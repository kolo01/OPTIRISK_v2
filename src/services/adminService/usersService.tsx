import apiClient from "../apiservice";

const usersService = {
  getAllUsers: async () => {
    const response = await apiClient.get("/analyses/");
    return response.data || [];
  },
  suspendUser: async (slug: string) => {
    const response = await apiClient.put(`/users/${slug}/suspend`);
    return response.data;
  },
  reactivateUser: async (id: string) => {
    const response = await apiClient.put(`/users/${id}/reactivate`);
    return response.data;
  },
};

export default usersService;
