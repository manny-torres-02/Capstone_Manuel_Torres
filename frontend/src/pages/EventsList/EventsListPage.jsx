import React, { useState, useEffect } from "react";
import "./EventsListPage.scss";
import axios from "axios";
import DataTable from "../../components/Table/Table";
import { Edit, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import EditEventForm from "../../components/EditEvent/EditEventForm";

const EventsListPage = () => {
  return (
    <>
      <EditEventForm />
    </>
  );
};

export default EventsListPage;
