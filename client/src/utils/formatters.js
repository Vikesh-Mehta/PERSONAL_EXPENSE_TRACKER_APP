// client/src/utils/formatters.js

/**
 * Formats a number as Indian Rupees (INR).
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string (e.g., "₹1,234.56") or "N/A".
 */
export const formatCurrencyINR = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
      return '₹0.00'; // Return zero or 'N/A' based on preference
  }
  return amount.toLocaleString('en-IN', { // Use Indian English locale
      style: 'currency',
      currency: 'INR', // Specify INR currency code
      minimumFractionDigits: 2, // Ensure two decimal places
      maximumFractionDigits: 2,
  });
};

/**
* Formats a date string or Date object into a readable format.
* @param {string|Date} dateInput - The date to format.
* @returns {string} Formatted date string (e.g., "Oct 26, 2023") or "N/A".
*/
export const formatDateReadable = (dateInput) => {
  if (!dateInput) return 'N/A';
  try {
      const date = new Date(dateInput);
       // Check if date is valid after parsing
      if (isNaN(date.getTime())) {
          return 'Invalid Date';
      }
      return date.toLocaleDateString('en-IN', { // Use Indian locale for consistency if desired
          year: 'numeric',
          month: 'short', // 'long', 'short', 'numeric'
          day: 'numeric',
      });
  } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
  }
};

/**
* Formats a date string or Date object for input type="date".
* @param {string|Date} dateInput - The date to format.
* @returns {string} Formatted date string (YYYY-MM-DD) or empty string.
*/
export const formatDateForInput = (dateInput) => {
   if (!dateInput) return '';
  try {
      const date = new Date(dateInput);
       if (isNaN(date.getTime())) {
          return '';
      }
      return date.toISOString().split('T')[0];
  } catch (error) {
      console.error("Error formatting date for input:", error);
      return "";
  }
};