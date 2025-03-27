"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatExceptedDeliveryDate = void 0;
function formatExceptedDeliveryDate(deliveryHours) {
  const splitHours = deliveryHours.split("-");
  const currentDate = new Date();
  // Function to format date as YYYY/MM/DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
  // Check if deliveryHours is a range (e.g., "48-72")
  if (deliveryHours.includes("-") && splitHours.length === 2) {
    // Destructure min and max hours from the split string
    const [minHours, maxHours] = splitHours.map(Number); // Convert to numbers
    // Ensure the hours are valid
    if (isNaN(minHours) || isNaN(maxHours)) {
      throw new Error("Invalid deliveryHours format");
    }
    // Calculate the start and end dates based on hours range
    const startDate = new Date(currentDate);
    startDate.setHours(currentDate.getHours() + minHours);
    const endDate = new Date(currentDate);
    endDate.setHours(currentDate.getHours() + maxHours);
    // Format the dates as YYYY/MM/DD
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    return `${formattedStartDate}-${formattedEndDate}`;
  } else {
    // If deliveryHours is a single value (e.g., "48")
    const hours = parseInt(deliveryHours);
    if (isNaN(hours)) {
      throw new Error("Invalid deliveryHours format");
    }
    // Set the expected delivery date based on hours
    currentDate.setHours(currentDate.getHours() + hours);
    return formatDate(currentDate);
  }
}
exports.formatExceptedDeliveryDate = formatExceptedDeliveryDate;
