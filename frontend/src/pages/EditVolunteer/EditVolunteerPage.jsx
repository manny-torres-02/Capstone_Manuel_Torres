import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditVolunteerPage.scss";
import VolunteerForm from "../../components/VolunteerForm/VolunteerForm";

const EditVolunteerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";

  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //pull the data
  useEffect(() => {
    const fetchVolunteer = async () => {
      if (!id) {
        setError("No Volunteer ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching volunteer with ID: ${id}`);
        const response = await axios.get(`${apiURL}/volunteers/${id}`);

        console.log("received volunteer data:", response.data);
        setVolunteerData(response.data);
      } catch (error) {
        console.error("Error fetching volunteer:", error);

        if (error.response?.status === 404) {
          setError("Volunteer not found");
        } else if (error.response?.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to load volunteer data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteer();
  }, [id, apiURL]);

  // Handle submit
  const handleSubmit = (updatedVolunteer) => {
    console.log("Volunteer updated successfully:", updatedVolunteer);
    alert("Volunteer updated successfully!");
    navigate("/");
  };

  const handleCancel = () => {
    console.log("Edit cancelled");
    // Navigate back to home page
    navigate("/");
  };

  return (
    <div className="edit-volunteer-page">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Volunteer</h1>
          <p className="text-muted-foreground">
            Update volunteer information for {volunteerData?.name}
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
        {/* Volunteer Form */}
        <VolunteerForm
          initialData={volunteerData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditVolunteerPage;
