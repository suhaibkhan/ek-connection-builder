import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme, top, left }) => ({
    width: '200px',
    position: 'absolute',
    zIndex: 999,
    top: `${top}px`,
    left: `${left}px`,
    padding: 8,
}));

const getPos = (marker, map) => {
    if (!map || !marker) {
        return { left: 0, top: 0 };
    }

    const latLng = marker.getPosition();
    const projection = map.getProjection();
    const bounds = map.getBounds();

    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = Math.pow(2, map.getZoom());
    const worldPoint = projection.fromLatLngToPoint(latLng);

    return {
        left: Math.floor((worldPoint.x - bottomLeft.x) * scale),
        top: Math.floor((worldPoint.y - topRight.y) * scale),
    };
};

const getAirportInfoMap = ({ onwardLeg, connectingLeg }) => {
    const info = {};
    info[onwardLeg.source] = {
        flights: [
            {
                flightNo: onwardLeg.flightNo,
                flightTime: `${onwardLeg.etd} (Dep Time)`,
            },
        ],
    };
    info[connectingLeg.source] = {
        flights: [
            {
                flightNo: onwardLeg.flightNo,
                flightTime: `${onwardLeg.eta} (Arr Time)`,
            },
            {
                flightNo: connectingLeg.flightNo,
                flightTime: `${connectingLeg.etd} (Dep Time)`,
            },
        ],
        waitTime: calcWaitTime(onwardLeg.eta, connectingLeg.etd),
    };
    info[connectingLeg.destination] = {
        flights: [
            {
                flightNo: connectingLeg.flightNo,
                flightTime: `${connectingLeg.eta} (Arr Time)`,
            },
        ],
    };
    return info;
};

const calcWaitTime = (etd, eta) => {
    const [dhr, dmin] = etd.split(':').map((val) => parseInt(val));
    const [ahr, amin] = eta.split(':').map((val) => parseInt(val));
    const start = dhr * 60 + dmin;
    const end = (ahr < dhr ? ahr + 24 : ahr) * 60 + amin;
    const diff = ((end - start) / 60).toFixed(1);
    return `${diff} hrs`;
};

function FlightInfo({ route, map, selectedMarker, onClose }) {
    const { airport, marker } = selectedMarker;
    const { left, top } = useMemo(() => getPos(marker, map), [marker, map]);
    const airportInfoMap = useMemo(() => getAirportInfoMap(route), [route]);
    const airportInfo = airportInfoMap[airport];
    const airportFlights = airportInfo && airportInfo.flights;

    return (
        <StyledPaper elevation={2} top={top + 10} left={left}>
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sx={{ backgroundColor: '#1976d2', color: '#fff', px: 1 }}
                >
                    <Typography variant="h6">{airport}</Typography>
                </Grid>
                {airportFlights &&
                    airportFlights.map((flight) => (
                        <Grid
                            item
                            xs={12}
                            container
                            key={flight.flightNo}
                            sx={{ borderBottom: '1px solid #ccc', px: 1 }}
                        >
                            <Grid item sx={{ pr: 1 }}>
                                <Typography variant="caption">
                                    {flight.flightNo}
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="caption">
                                    {flight.flightTime}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                <Grid item sx={{ px: 1 }}>
                    <Typography variant="caption" sx={{ pr: 1 }}>
                        Wait Time :
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Typography variant="caption">
                        {(airportInfo && airportInfo.waitTime) || '-'}
                    </Typography>
                </Grid>
            </Grid>
        </StyledPaper>
    );
}

export default FlightInfo;
