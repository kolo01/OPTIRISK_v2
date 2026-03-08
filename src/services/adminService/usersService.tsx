import apiClient from "../apiservice";

const usersService = {
  getAllUsers: async () => {
    const response = await apiClient.get("/analyses/");
    return response.data || [];
  },
  suspendUser: async (id: string) => {
    // Simulate an API call to suspend a user
    confirm("Êtes-vous sûr de vouloir suspendre cet utilisateur ?") &&
    console.log(`User with ID ${id} has been suspended.`);
  },
  reactivateUser: async (id: string) => {
    // Simulate an API call to reactivate a user
    console.log(`User with ID ${id} has been reactivated.`);
  },
};

export default usersService;
