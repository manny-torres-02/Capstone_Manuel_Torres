import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "./Table.scss";

const DataTable = ({ data, title }) => {
  // try
  return (
    <>
      <h1> {title} </h1>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="dataTable__header-row">
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((volunteer, index) => (
              <TableRow key={volunteer.id || index}>
                <TableCell className="font-medium">{volunteer.id}</TableCell>
                <TableCell>{volunteer.name}</TableCell>
                <TableCell>{volunteer.email}</TableCell>
                <TableCell className="text-right">{volunteer.phone}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No volunteers found
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default DataTable;
