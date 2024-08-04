import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const EventHostManagement = ({ eventHosts = [], onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Company Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventHosts.map((host) => (
            <TableRow key={host._id}>
              <TableCell>{host?.user?.name || "N/A"}</TableCell>
              <TableCell>{host?.companyName || "N/A"}</TableCell>
              <TableCell>
                <Button
                  color="error"
                  onClick={() => onDelete(host, "eventHost")}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventHostManagement;
