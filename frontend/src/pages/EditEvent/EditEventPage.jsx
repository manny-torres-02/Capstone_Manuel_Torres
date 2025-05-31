import React, { useState, useEffect } from "react";
import axios from "axios";
import EditEvent from "../../components/EditEvent/EditEventForm";
import DataTable from "../../components/Table/Table";
import { Edit, Trash2 } from "lucide-react";

const EditEventPage = () => {
  return (
    <>
      <h1> test</h1>
      <EditEvent />
    </>
  );
};

export default EditEventPage;
