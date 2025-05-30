import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Nav/Navigation";
import DataTable from "../components/Table/Table";
import { Edit, Trash2 } from "lucide-react"; // Add this import

const HomePage = () => {
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080/";
  const [volunteerData, setVolunteerData] = useState([]);

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
            // onClick={() => handleEdit(item)}
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
    </div>
  );
};

export default HomePage;
