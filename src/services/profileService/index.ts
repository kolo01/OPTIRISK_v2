import apiClient from "../apiservice";


const getProfile = async () => {
    const response = await apiClient.get('/profil');
    return response.data;
}

const updateProfile = async (data: any) => {
    const response = await apiClient.put('/update-my-profile', data);
    return response.data;
}

const updatePassword = async (data: any) => {
    const response = await apiClient.put('/update-password', data);
    return response.data;
}

const setup2FA = async () => {
    const response = await apiClient.put('/2fa/setup/');
    return response.data;
}

const activate2FA = async () => {
    const response = await apiClient.post('/2fa/setup/');
    return response.data;
}
const disable2FA = async () => {
    const response = await apiClient.put('/2fa/disable/');
    return response.data;
}

const deleteAccount = async () => {
    const response = await apiClient.delete('/delete-my-account');
    return response.data;
}

const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('picture', file);
    const response = await apiClient.post('/profile-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

const getAvatar = async () => {
    const response = await apiClient.get('/profile-picture');
    return response.data;
}

export const profileService = {
    getProfile,
    updateProfile,
    updatePassword,
    activate2FA,
    setup2FA,
    disable2FA,
    deleteAccount,
    uploadAvatar,
    getAvatar,
}