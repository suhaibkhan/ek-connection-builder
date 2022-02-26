import React, { useState, useEffect, useMemo } from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FlightSearch from './FlightSearch';
import FlightTable from './FlightTable';
import FlightMap from './FlightMap';
import axios from 'axios';

function App() {
    const [airports, setAirports] = useState([]);
    const [flightRoutes, setFlightRoutes] = useState(null);
    const [selectedRouteIdx, setSelectedRouteIdx] = useState(-1);
    const selectedRoute = useMemo(
        () => flightRoutes && flightRoutes[selectedRouteIdx],
        [selectedRouteIdx, flightRoutes]
    );

    useEffect(() => {
        axios.get('airports.json').then((res) => {
            setAirports(res.data);
        });
    }, []);

    const handleSearch = async ({ from, to }) => {
        // call actual service with from and to
        const flightResponse = await axios.get('flights.json');
        setFlightRoutes(flightResponse.data);
    };

    return (
        <>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box sx={{ py: 2 }}>
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>
                        Flight Connection Builder
                    </Typography>
                    <FlightSearch airports={airports} onSearch={handleSearch} />
                    {flightRoutes && (
                        <FlightTable
                            flightRoutes={flightRoutes}
                            selectedRouteIdx={selectedRouteIdx}
                            onSelect={setSelectedRouteIdx}
                        />
                    )}
                    {selectedRoute && (
                        <FlightMap route={selectedRoute} airports={airports} />
                    )}
                </Box>
            </Container>
        </>
    );
}

export default App;
