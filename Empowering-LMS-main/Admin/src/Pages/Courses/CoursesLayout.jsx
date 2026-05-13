import React from "react";
import { Outlet } from "react-router-dom";

const CoursesLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CoursesLayout;
