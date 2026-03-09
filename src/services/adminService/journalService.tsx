import apiClient from "../apiservice";

const journalService = {
  getLogs: async () => {
    const response = await apiClient.get("/admin/logs");
    return response.data;
  },
};

export default journalService;
