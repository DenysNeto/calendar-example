"use client";
import React, { useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { toISOStringWithTimezone } from "@/app/hooks/timeSlots";
import moment from "moment";
import Modal from "./Modal";
import { useStore } from "@/app/store/store";
import Notification from "@/app/components/notification/Notification";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [view, setView] = useState("month"); // State to keep track of the current view
  const [selectedDate, setSelectedDate] = useState(null); // State to keep track of the selected date
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { state } = useStore();
  const [allEvents, setAllEvents] = useState([]);
  const [notification, setNotification] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleCloseModal = (value) => {
    setIsModalOpen(false);
    if (value) {
      showNotification("Your appointment sceduled!", "success");
    }
  };

  const offRangeDays = [
    // new Date(2024, 4, 1),
    // new Date(2024, 4, 5),
    // new Date(2024, 4, 10),
  ];

  const dayPropGetter = useCallback(
    (date) => {
      const isOffRange = offRangeDays.some((offRangeDay) => {
        return moment(date).isSame(offRangeDay, "day");
      });
      const today = new Date();
      const isPast = moment(date).isBefore(today, "day");

      if (isOffRange || isPast) {
        return {
          className: "rbc-off-range-bg-custom", // Apply a CSS class to off-range days
        };
      }

      return {
        className: "", // Apply a default class
      };
    },
    [offRangeDays]
  );

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setIsModalOpen(true);
  };

  const handleNavigate = (date, view, action) => {
    if (action === "NEXT") {
      setSelectedDate(moment(new Date(selectedDate)).add(1, "months").toDate());
    } else if (action === "PREV") {
      setSelectedDate(
        moment(new Date(selectedDate)).subtract(1, "months").toDate()
      );
    } else if (action === "TODAY") {
      setSelectedDate(new Date());
    } else {
      setSelectedDate(date);
    }
  };

  const minTime = new Date();
  minTime.setHours(8, 0, 0); // Set the start time to 08:00

  const maxTime = new Date();
  maxTime.setHours(20, 0, 0); // Set the end time to 20:00

  return (
    <div
      id="calendar-wrapper"
      style={{ height: "85vh", padding: 50, cursor: "pointer" }}>
      {notification && (
        <Notification
          onClose={() => setNotification(null)}
          message={notification.message}
          type={notification.type}
        />
      )}

      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        views={["month"]}
        onView={handleViewChange}
        onSelectSlot={handleSelectSlot}
        onNavigate={handleNavigate}
        view={view}
        date={selectedDate}
        events={state.eventsByDay.reduce((acc, curr) => {
          return [...acc, ...curr.events];
        }, [])}
        selectable={true}
        dayPropGetter={dayPropGetter}
        min={minTime} // Set the start time of the day
        max={maxTime} // Set the end time of the day
      />
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          selectedDate={toISOStringWithTimezone(selectedDate)}
        />
      )}
    </div>
  );
};
export default MyCalendar;
