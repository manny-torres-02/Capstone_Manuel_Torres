import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Nav/Navigation";
import DataTable from "../components/Table/Table";
import { Edit, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "../components/ui/button";
import { useNavigate } from "react-router-dom"; // Add this import

const HomePage = () => {
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080/";
  const [volunteerData, setVolunteerData] = useState([]);

  const navigate = useNavigate();
  const handleEdit = (volunteer) => {
    console.log("Editing volunteer:", volunteer);
    // Navigate to edit page with volunteer ID
    navigate(`/${volunteer.id}/edit`);
  };

  const volunteerColumns = [
    { key: "id", label: "ID", className: "w-[100px]" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone", cellClassName: "text-right" },
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
    navigate("/createVolunteer");
  };

  const handleDelete = async (volunteer) => {
    if (window.confirm(`Are you sure you want to delete ${volunteer.name}?`)) {
      try {
        await axios.delete(`${apiURL}/volunteers/${volunteer.id}`);
        // Refresh the data after deletion
        readvolunteerData();
        alert("Volunteer deleted successfully!");
      } catch (error) {
        console.error("Error deleting volunteer:", error);
        alert("Error deleting volunteer. Please try again.");
      }
    }
  };

  const readvolunteerData = async () => {
    try {
      let url = `${apiURL}/volunteers`;
      console.log("url=:", url);
      const volunteerList = await axios.get(url);
      setVolunteerData(volunteerList.data);
    } catch (error) {
      console.error("Error fetching volunteer data:", error);
    }
  };
  useEffect(() => {
    readvolunteerData();
  }, []);

  console.log("volunteer Data:", volunteerData);
  return (
    <div>
      <DataTable
        data={volunteerData}
        title="Volunteers"
        columns={volunteerColumns}
        // searchable={true}  shadcn fxn
        // sortable={true}shadcn fxn
        // pagination={true}shadcn fxn
      />
      <Button onClick={handleCreateNew}> + Create Volunteer</Button>
    </div>
  );
};

export default HomePage;
