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

const DataTable = ({ data, title, columns }) => {
  return (
    <>
      <h1>{title}</h1>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>A list of {title.toLowerCase()}</TableCaption>
          <TableHeader className="dataTable__header-row">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className || ""}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={column.cellClassName || ""}
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No {title.toLowerCase()} found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-card border rounded-lg p-4 shadow-sm"
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex justify-between py-2 border-b border-border last:border-b-0"
                >
                  <span className="font-medium text-muted-foreground">
                    {column.label}:
                  </span>
                  <span className="text-right">
                    {column.render ? column.render(item) : item[column.key]}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No {title.toLowerCase()} found
          </div>
        )}
      </div>
    </>
  );
};

export default DataTable;
