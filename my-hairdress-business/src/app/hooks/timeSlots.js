export function divideTimeRange(startTime, endTime, slotDuration, busySlots) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const slots = [];

  // Check if the end time is after the start time
  if (end <= start) {
    throw new Error("End time must be after start time");
  }

  // Calculate the slot duration in milliseconds
  const slotDurationMs = slotDuration * 60 * 1000;

  // Parse busy slots into Date objects
  const parsedBusySlots = (busySlots || []).map((slot) => ({
    start: new Date(slot.start),
    end: new Date(slot.end),
  }));

  // Function to check if a slot is busy
  const isSlotBusy = (slotStart, slotEnd) => {
    return parsedBusySlots.some(
      (busySlot) => slotStart < busySlot.end && slotEnd > busySlot.start
    );
  };

  // Generate the slots
  let currentStart = start;
  while (currentStart < end) {
    const currentEnd = new Date(currentStart.getTime() + slotDurationMs);
    if (currentEnd > end) break;

    if (!isSlotBusy(currentStart, currentEnd)) {
      slots.push({
        start: currentStart.toISOString(),
        end: currentEnd.toISOString(),
        title: `${currentStart.getHours()}:${
          currentStart.getMinutes() == 0 ? "00" : currentStart.getMinutes()
        }-${currentEnd.getHours()}:${
          currentEnd.getMinutes() == 0 ? "00" : currentEnd.getMinutes()
        }`,
      });
    }
    currentStart = currentEnd;
  }
  return slots;
}

export function timeToMinutes(timeStr) {
  console.log("dddd", timeStr);
  const regex = /(\d+)(?::(\d+))?h/;
  const match = timeStr.match(regex);

  if (!match) {
    throw new Error("Invalid time format");
  }

  const hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;

  return hours * 60 + minutes;
}

export function timeRangeToTimes(
  timeRange,
  date = new Date().toISOString().split("T")[0]
) {
  const [startStr, endStr] = timeRange.split("-");
  const [startHour, startMinute] = startStr.split(":").map(Number);
  const [endHour, endMinute] = endStr.split(":").map(Number);

  const startDate = new Date(
    `${date}T${startHour}:${startMinute > 0 ? startMinute : "00"}`
  );
  const endDate = new Date(
    `${date}T${endHour}:${endMinute > 0 ? endMinute : "00"}`
  );

  // Check if the end time is before the start time (e.g., for times after midnight)
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1); // Add one day if end time is before start time
  }

  return {
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
  };
}

export function toISOStringWithTimezone(date) {
  // Get the time zone offset in minutes and convert to hours and minutes
  const timezoneOffset = date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const offsetMinutes = Math.abs(timezoneOffset) % 60;
  const sign = timezoneOffset <= 0 ? "+" : "-";

  // Get the year, month, day, hours, minutes, seconds, and milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  // Format the date to ISO string with time zone
  const isoStringWithTimezone = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${String(
    offsetHours
  ).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;

  return isoStringWithTimezone;
}
