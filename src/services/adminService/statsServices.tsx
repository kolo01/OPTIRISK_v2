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
};

export default StatsService;
