import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,   // job portal ke .env mein jo naam hai wahi likho
});

// Clerk ka token yahan se har request mein jata hai
let getTokenFn = null;
export const setAuthTokenGetter = (fn) => {
  getTokenFn = fn;
};

api.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview/", formData);   // Content-Type axios khud lagata hai
  return response.data;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
    responseType: "blob",
  });
  return response.data;
};

export const getAllReports = async () => {
  const res = await api.get("/api/interview");
  return res.data;
};

export const evaluateAnswer = async (reportId, question, answer) => {
  const res = await api.post(`/api/interview/report/${reportId}/evaluate`, { question, answer });
  return res.data;
};