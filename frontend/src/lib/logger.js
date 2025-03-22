// frontend/src/lib/logger.js
const logger = {
  info: (message, data) => {
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service
    } else {
      console.info(message, data);
    }
  },
  error: (message, error) => {
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    } else {
      console.error(message, error);
    }
  }
};

export default logger;
