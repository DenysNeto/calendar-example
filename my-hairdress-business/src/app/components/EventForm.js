"use client";
import React, { useState } from "react";
import {
  divideTimeRange,
  timeToMinutes,
  timeRangeToTimes,
  toISOStringWithTimezone,
} from "@/app/hooks/timeSlots";
import Chips from "./Chips";
import { useStore } from "@/app/store/store";
import moment from "moment";

const EventForm = ({ onAddEvent, selectedDate }) => {
  const [title, setTitle] = useState("");
  const [procedure, setProcedure] = useState("");
  const { dispatch } = useStore();

  // time slots
  const [procedures, setProcedures] = useState([]);

  const startTime = toISOStringWithTimezone(
    new Date(`${selectedDate.split("T")[0]}T05:00:00.000Z`)
  );
  const endTime = toISOStringWithTimezone(
    new Date(`${selectedDate.split("T")[0]}T15:00:00.000Z`)
  );

  const { state } = useStore();

  const events =
    state.eventsByDay.find((day) => {
      return moment(new Date(selectedDate)).isSame(day.date, "day");
    }) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("AAA", selectedDate.split("T")[0], procedures[0]);
    const { startTime, endTime } = timeRangeToTimes(
      procedures[0],
      // TODO selectedDate
      selectedDate.split("T")[0]
    );

    const newEvent = {
      title: title || procedures[0],
      procedure,
      start: new Date(startTime),
      end: new Date(endTime),
    };

    setTitle("");
    setProcedure("");
    setProcedures([]);

    dispatch({
      type: "ADD_EVENT",
      payload: {
        date: new Date(toISOStringWithTimezone(new Date(selectedDate))),
        event: { ...newEvent },
      },
    });

    onAddEvent();
    // Clear form fields after submission
  };

  const handleProcedureSelect = (value) => {
    setProcedures([]);
    setProcedure(value);
  };

  return (
    <div class="inner">
      <h2 style={{ color: "white" }} class="major">
        Add event
      </h2>
      <form method="post" action="#" onSubmit={handleSubmit}>
        <div class="fields">
          <div class="field">
            <label for="name">Event Title</label>
            <input
              className="field"
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div class="field">
            <label for="email">Procedure Type</label>
            <select
              className="field"
              value={procedure}
              onChange={(e) => handleProcedureSelect(e.target.value)}
              required>
              <option value="">Select procedure</option>
              <option value="0:30h">Procedure 1 (30min)</option>
              <option value="1h">Procedure 2 (1h)</option>
              <option value="1:30h">Procedure 3(1:30h)</option>
              <option value="3h">Procedure 4 (3h)</option>
            </select>
          </div>

          {procedure && (
            <div className="field">
              <label>Select Time</label>
              <Chips
                options={divideTimeRange(
                  startTime,
                  endTime,
                  timeToMinutes(procedure || "1h"),
                  events
                ).map((el) => el.title)}
                selectedOptions={procedures}
                onChange={setProcedures}
              />
            </div>
          )}
          {procedures && procedures.length > 0 && (
            <button className="close-btn">Add Record</button>
          )}
        </div>
      </form>

      <style jsx>{`
        .field {
          padding: 10px !inportant;
        }
        .close-btn {
          background-color: #ff6347;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          margin-bottom: 10px;
          cursor: pointer;
          width: 100%;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default EventForm;
