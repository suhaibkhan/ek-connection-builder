import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function FlightTable({ flightRoutes, selectedRouteIdx, onSelect }) {
    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="flight route table">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Onward Flight</StyledTableCell>
                        <StyledTableCell>Dep Airport</StyledTableCell>
                        <StyledTableCell>Arr Airport</StyledTableCell>
                        <StyledTableCell>Dep Time</StyledTableCell>
                        <StyledTableCell>Arr Time</StyledTableCell>
                        <StyledTableCell>Connecting Flight</StyledTableCell>
                        <StyledTableCell>Dep Airport</StyledTableCell>
                        <StyledTableCell>Arr Airport</StyledTableCell>
                        <StyledTableCell>Dep Time</StyledTableCell>
                        <StyledTableCell>Arr Time</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {flightRoutes.map((route, idx) => (
                        <StyledTableRow
                            key={idx}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                            onClick={() => onSelect(idx)}
                            selected={idx === selectedRouteIdx}
                        >
                            <StyledTableCell>
                                {route.onwardLeg.flightNo}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.onwardLeg.source}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.onwardLeg.destination}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.onwardLeg.etd}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.onwardLeg.eta}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.connectingLeg.flightNo}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.connectingLeg.source}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.connectingLeg.destination}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.connectingLeg.etd}
                            </StyledTableCell>
                            <StyledTableCell>
                                {route.connectingLeg.eta}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default FlightTable;
