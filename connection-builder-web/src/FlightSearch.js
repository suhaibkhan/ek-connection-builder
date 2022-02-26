import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    ignoreCase: true,
    stringify: (option) => `${option.code}${option.name}`,
});

const getOptionLabel = (opt) => `${opt.name} (${opt.code})`;

const isOptionEqualToValue = (opt, value) => opt.code === value.code;

function FlightSearch({ airports, onSearch }) {
    const [fromAirport, setFromAirport] = useState(null);
    const [toAirport, setToAirport] = useState(null);
    const [errMsg, setErrMsg] = useState('');

    const handleSearch = () => {
        let error = '';
        if (!fromAirport || !toAirport) {
            error = 'From and to airport mandatory';
        } else if (fromAirport.code === toAirport.code) {
            error = 'From and to airport cannot be same';
        }
        setErrMsg(error);
        !error && onSearch({ from: fromAirport.code, to: toAirport.code });
    };

    return (
        <Grid container spacing={1} alignItems="center" sx={{ p: 2 }}>
            <Grid item xs>
                <Autocomplete
                    disablePortal
                    fullWidth
                    value={fromAirport}
                    id="from-autocomple"
                    options={airports}
                    getOptionLabel={getOptionLabel}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, newVal) => setFromAirport(newVal)}
                    filterOptions={filterOptions}
                    renderInput={(params) => (
                        <TextField {...params} label="From Airport" />
                    )}
                />
            </Grid>
            <Grid item xs>
                <Autocomplete
                    disablePortal
                    fullWidth
                    value={toAirport}
                    id="to-autocomple"
                    options={airports}
                    getOptionLabel={getOptionLabel}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, newVal) => setToAirport(newVal)}
                    filterOptions={filterOptions}
                    renderInput={(params) => (
                        <TextField {...params} label="To Airport" />
                    )}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Grid>
            {errMsg && (
                <Grid item xs={12}>
                    <Typography
                        variant="caption"
                        sx={{ color: 'red', fontSize: '1rem' }}
                    >
                        {errMsg}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
}

export default FlightSearch;
