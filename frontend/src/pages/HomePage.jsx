import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Nav/Navigation";
import DataTable from "../components/Table/Table";

const HomePage = () => {
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080/";
  const [volunteerData, setVolunteerData] = useState([]);

  const volunteerColumns = [
    { key: "id", label: "ID", className: "w-[100px]" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone", cellClassName: "text-right" },
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
