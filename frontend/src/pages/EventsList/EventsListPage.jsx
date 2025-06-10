import React, { useState, useEffect } from "react";
import "./EventsListPage.scss";
import axios from "axios";
import DataTable from "../../components/Table/Table";
import { Edit, Trash2, Plus, Calendar, MapPin, Users } from "lucide-react";
import { Button, buttonVariants } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

import { useNavigate } from "react-router-dom";

const EventsListPage = () => {
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080/";
  const [eventData, setEventData] = useState([]);

  const navigate = useNavigate();
  const handleEdit = (event) => {
    console.log("Editing Event:", event);
    navigate(`/${event.id}/editEvent`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDescription = (description) => {
    if (!description) return "No description";
    return description.length > 100
      ? `${description.substring(0, 100)}...`
      : description;
  };

  const eventColumns = [
    {
      key: "title",
      label: "Event Name",
      className: "font-medium",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{item.title || item.name}</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      className: "text-center",
      render: (item) => (
        <Badge variant="secondary" className="font-mono">
          {formatDate(item.date)}
        </Badge>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (item) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 mapPin" />
          <span>{item.location || "TBD"}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      className: "max-w-xs",
      render: (item) => (
        <span className="text-muted-foreground text-sm">
          {formatDescription(item.description)}
        </span>
      ),
    },
    {
      key: "maxParticipants",
      label: "Capacity",
      className: "text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1">
          <Users className="h-4 w-4 text-purple-500" />
          <span className="text-sm">{item.maxParticipants || "Unlimited"}</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[120px] text-center",
      render: (item) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(item)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateNew = () => {
    navigate("/createEvent");
  };

  const handleDelete = async (event) => {
    if (window.confirm(`Are you sure you want to delete ${event.name}?`)) {
      try {
        await axios.delete(`${apiURL}/events/${event.id}`);
        // Refresh the data after deletion
        readEventData();
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting Event:", error);
        alert("Error deleting Event. Please try again.");
      }
    }
  };

  const readEventData = async () => {
    try {
      let url = `${apiURL}/events`;
      console.log("url=:", url);
      const eventList = await axios.get(url);
      setEventData(eventList.data);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };
  useEffect(() => {
    readEventData();
  }, []);

  console.log("Event Data:", eventData);
  return (
    <div>
      <DataTable data={eventData} title="Our Events" columns={eventColumns} />
      <Button onClick={handleCreateNew}> + Create event</Button>
    </div>
  );
};

export default EventsListPage;
