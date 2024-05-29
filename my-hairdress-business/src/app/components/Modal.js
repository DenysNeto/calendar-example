"use client";
import React, { useState } from "react";
import { useStore } from "@/app/store/store";
import Notification from "@/app/components/notification/Notification";
import EventForm from "./EventForm"; // Make sure to import the EventForm component
import { toISOStringWithTimezone } from "@/app/hooks/timeSlots";

const Modal = ({ onClose, selectedDate }) => {
  const [showForm, setShowForm] = useState(true);

  const [notification, setNotification] = useState(null);

  const handleClose = () => {
    onClose(); // Call the onClose function passed as prop
  };

  const handleAddEvent = (newEvent) => {
    onClose("add");
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <div
        className="modal-overlay"
        style={{ display: showForm ? "flex" : "none" }}>
        <div className="modal-test">
          <button className="close-btn" onClick={handleClose}>
            Close
          </button>
          {showForm ? (
            <EventForm
              onAddEvent={handleAddEvent}
              selectedDate={selectedDate}
            />
          ) : (
            <button className="open-form-btn" onClick={() => setShowForm(true)}>
              Add Event
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          background-color: #45558d;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100000;
        }

        .modal-test {
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          padding: 50px;
          background: #2e3141;
          max-width: 500px;
          position: absolute;
          overflow-y: auto;
          max-height: 100%;
        }

        .close-btn {
          background-color: #ff6347;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          margin-bottom: 10px;
          cursor: pointer;
        }

        .open-form-btn {
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Modal;
