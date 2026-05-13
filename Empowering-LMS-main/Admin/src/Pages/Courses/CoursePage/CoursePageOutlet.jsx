import React from "react";
import { Outlet } from "react-router-dom";

const CoursePageOutlet = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CoursePageOutlet;
