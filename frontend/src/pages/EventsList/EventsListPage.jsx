import React, { useState, useEffect } from "react";
import "./EventsListPage.scss";
import axios from "axios";
import DataTable from "../../components/Table/Table";
import { Edit, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const EventsListPage = () => {
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080/";
  const [eventData, setEventData] = useState([]);

  const navigate = useNavigate();
  const handleEdit = (event) => {
    console.log("Editing Event:", event);
    // Navigate to edit page with volunteer ID
    navigate(`/${event.id}/editEvent`);
  };

  const eventColumns = [
    // { key: "name", label: "", className: "w-[100px]" },
    { key: "name", label: "Name" },
    { key: "date", label: "date" },
    { key: "description", label: "description", cellClassName: "text-right" },
    { key: "location", label: "location" },
    {
      key: "actions",
      label: "Actions",
      className: "w-[120px]",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-1 hover:bg-accent rounded transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
      console.error("Error fetching volunteer data:", error);
    }
  };
  useEffect(() => {
    readEventData();
  }, []);

  console.log("Event Data:", eventData);
  return (
    <div>
      <DataTable data={eventData} title="events" columns={eventColumns} />
      <Button onClick={handleCreateNew}> + Create event</Button>
    </div>
  );
};

export default EventsListPage;
