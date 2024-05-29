"use client";
import React from "react";
import MyCalendar from "@/app/components/Calendar";
import "bootstrap/dist/css/bootstrap.min.css";
import { StoreProvider } from "@/app/store/store";

const FirstComponent = () => {
  return (
    <StoreProvider>
      <div style={{ padding: "10px" }}>
        <h1 className="major" style={{ textAlign: "center", color: "white" }}>
          {" "}
          Book an Appointment{" "}
        </h1>
        <MyCalendar />
      </div>
    </StoreProvider>
  );
};

export default FirstComponent;
