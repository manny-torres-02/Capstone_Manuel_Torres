import * as React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditVolunteer = () => {
  const { id } = useParams();
  return (
    <>
      <h1>Edit volunteer page </h1>
    </>
  );
};
