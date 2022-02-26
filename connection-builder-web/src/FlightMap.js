import React, {
    useMemo,
    useRef,
    useEffect,
    useCallback,
    useState,
} from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FlightInfo from './FlightInfo';

const drawMarkers = (markerPositions, map) => {
    if (!map) return [];
    return markerPositions.map(
        (pos) => new window.google.maps.Marker({ position: pos, map })
    );
};

function FlightMap({ route, airports }) {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const lineRef = useRef(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const airportCordinates = useMemo(
        () =>
            airports &&
            airports.reduce((retMap, curVal) => {
                retMap[curVal.code] = curVal.coordinates;
                return retMap;
            }, {}),
        [airports]
    );

    const drawRoute = useCallback((route, airportCordinates) => {
        const { onwardLeg, connectingLeg } = route;
        // take airports in route with valid position information
        const routeAirports = [
            onwardLeg.source,
            onwardLeg.destination,
            connectingLeg.destination,
        ].filter((airportCode) => !!airportCordinates[airportCode]);
        const markerPositions = routeAirports.map(
            (airportCode) => airportCordinates[airportCode]
        );
        // draw markers
        markersRef.current = drawMarkers(markerPositions, mapRef.current);
        // draw line
        lineRef.current = new window.google.maps.Polyline({
            map: mapRef.current,
            path: markerPositions,
            strokeColor: '#d93025',
            strokeWeight: 1,
        });

        markersRef.current.forEach((marker, idx) => {
            marker.addListener('click', () => {
                setSelectedMarker({ airport: routeAirports[idx], marker });
            });
        });
    }, []);

    const renderMap = (mapElem) => {
        if (!mapRef.current && mapElem) {
            mapRef.current = new window.google.maps.Map(mapElem, {
                zoom: 2,
                center: { lat: 0, lng: 0 },
            });
            mapRef.current.addListener('click', () => {
                setSelectedMarker(null);
            });
            drawRoute(route, airportCordinates);
        }
    };

    const render = (status) => {
        return (
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
                {status}
            </Typography>
        );
    };

    useEffect(() => {
        if (route && mapRef.current) {
            setSelectedMarker(null);
            drawRoute(route, airportCordinates);
        }
        return () => {
            markersRef.current &&
                markersRef.current.forEach((marker) => marker.setMap(null));
            lineRef.current && lineRef.current.setMap(null);
        };
    }, [route, airportCordinates, drawRoute]);
    return (
        <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY} render={render}>
            <Box ref={renderMap} sx={{ height: '500px', mt: 2 }}>
                {selectedMarker && (
                    <FlightInfo
                        map={mapRef.current}
                        route={route}
                        selectedMarker={selectedMarker}
                        onClose={() => setSelectedMarker(null)}
                    />
                )}
            </Box>
        </Wrapper>
    );
}

export default FlightMap;
