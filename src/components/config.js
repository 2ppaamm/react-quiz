const config = {
  baseURL: process.env.REACT_APP_BACKEND_URL || "https://your-default-backend-host.com",
};

export default config;

// Then, in your QuestionsDisplay component, you use it directly
const baseURL = config.baseURL;
