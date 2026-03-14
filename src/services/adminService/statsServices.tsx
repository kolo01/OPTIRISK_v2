import apiClient from "../apiservice";

const StatsService = {
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },
  getUsersReports: async () => {
    const response = await apiClient.get("/analyses/reports/");
    return response.data;
  },
  getlogs: async () => {
    const response = await apiClient.get("/admin/logs/");
    return response.data;
  }
};

export default StatsService;
