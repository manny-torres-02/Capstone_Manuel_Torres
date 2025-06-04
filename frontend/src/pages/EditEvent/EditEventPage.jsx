import React, { useState, useEffect } from "react";
import axios from "axios";
import EditEventForm from "../../components/EditEvent/EditEventForm";
import DataTable from "../../components/Table/Table";
import { Edit, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //pull the Data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError("No Event ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching event with ID: ${id}`);
        const response = await axios.get(`${apiURL}/events/${id}`);

        console.log("received event data:", response.data);
        setEventData(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);

        if (error.response?.status === 404) {
          setError("Event not found");
        } else if (error.response?.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load Event data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, apiURL]);

  const handleSubmit = async (updatedEvent) => {
    console.log("Event updated successfully:", updatedEvent);

    // Option 1: Use the returned data
    if (updatedEvent.categoryIds && updatedEvent.eventIds) {
      setEventData(updatedEvent);
      alert("Event updated successfully!");
    } else {
      // Try 2: Re-fetch from server to ensure consistency if 1st chance didnt work...
      try {
        const response = await axios.get(`${apiURL}/events/${id}`);
        setEventData(response.data);
        alert("Event updated successfully!");
      } catch (error) {
        console.error("Error re-fetching event:", error);
        alert("Update successful, but failed to refresh data");
      }
    }
  };

  const handleCancel = () => {
    console.log("Edit cancelled");
    // Navigate back to home page
    navigate("/");
  };

  //Make sure the backend data is correct...
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError("No Event ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching event with ID: ${id}`);
        const response = await axios.get(`${apiURL}/events/${id}`);

        console.log("Raw event data received:", response.data);
        console.log("Event data structure:", {
          hasTitle: !!response.data.title,
          hasName: !!response.data.name,
          hasDescription: !!response.data.description,
          hasDate: !!response.data.date,
          hasLocation: !!response.data.location,
          hasMaxParticipants: !!response.data.maxParticipants,
          hasCategoryIds: !!response.data.categoryIds,
          hasCategories: !!response.data.categories,
          hasVolunteerIds: !!response.data.volunteerIds,
          hasVolunteers: !!response.data.volunteers,
          categoryIds: response.data.categoryIds,
          categories: response.data.categories,
          volunteerIds: response.data.volunteerIds,
          volunteers: response.data.volunteers,
        });

        setEventData(response.data);
      } catch (error) {
        // ... error handling
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, apiURL]);

  return (
    <>
      <div className="edit-Event-page">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Edit Event</h1>
            <p className="text-muted-foreground">
              Update Event information for {eventData?.name}
            </p>
          </div>

          {/* TODO: Navigtional Breadcrumbs Keep or throw out... */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-primary hover:text-primary/80"
                >
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-muted-foreground">Edit Volunteer</span>
                </div>
              </li>
            </ol>
          </nav>

          <EditEventForm
            initialData={eventData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
};

export default EditEventPage;
