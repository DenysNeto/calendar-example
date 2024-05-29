"use client";
import React, { useState, useEffect } from "react";

const Chips = ({ options, selectedOptions, onChange }) => {
  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([option]);
    }
  };

  useEffect(() => {
    // Cleanup function to clear the timeout
    return () => {
      onChange([]);
    };
  }, []);

  return (
    <div className="chips-container">
      {options.map((option) => (
        <div
          key={option}
          className={`chip ${
            selectedOptions.includes(option) ? "selected" : ""
          }`}
          onClick={() => handleSelect(option)}>
          {option}
        </div>
      ))}
      <style jsx>{`
        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .chip:hover {
          scale: 1.1;
        }

        .chip {
          padding: 10px 15px;
          border: 1px solid #007bff;
          border-radius: 25px;
          background-color: #f1f1f1;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }
        .chip.selected {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Chips;
