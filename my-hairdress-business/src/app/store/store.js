// store.js
"use client";
import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  eventsByDay: [],
};

// Action types
const actionTypes = {
  ADD_EVENT: "ADD_EVENT",
  GET_EVENTS: "GET_EVENTS",
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_EVENT:
      const { date, event } = action.payload;
      const existingEventIndex = state.eventsByDay.findIndex(
        (d) => d.date.toDateString() === date.toDateString()
      );
      if (existingEventIndex !== -1) {
        // Check if the event already exists with the same start and end times
        const existingEvent = state.eventsByDay[existingEventIndex].events.find(
          (e) =>
            e.start.getTime() === event.start.getTime() &&
            e.end.getTime() === event.end.getTime()
        );
        if (existingEvent) {
          // Event with the same start and end times already exists, do not add
          return state;
        }
        // Event does not exist with the same start and end times, add it
        state.eventsByDay[existingEventIndex].events.push(event);
      } else {
        // No events exist for the date, add the event
        state.eventsByDay.push({ date, events: [event] });
      }
      return { ...state };
    default:
      return state;
  }
};

// Create context
const StoreContext = createContext();

// Store provider component
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the store
export const useStore = () => useContext(StoreContext);
