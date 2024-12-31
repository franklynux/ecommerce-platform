export const formatResponse = (status, data, message = '') => {
  return {
    status,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
};