const getBaseUrl = () => {
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000"; // Local dev backend
  }
  return "https://bookstore-backend-hshq.onrender.com"; // Production backend
};

export default getBaseUrl;
