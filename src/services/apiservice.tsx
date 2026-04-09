import  axios  from  'axios' ;


const API_BASE_URL  =  'https://api-optirisk.paullence.link/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const tokenData = localStorage.getItem('token');
      const exceptUrl = ['/login/','/login','login/']
      if (tokenData && config.url && !exceptUrl.includes(config.url)) {
        const token = JSON.parse(tokenData);
        if (token?.access) {
          config.headers['Authorization'] = `Bearer ${token.access}`;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du token:', error);
      localStorage.removeItem('token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401 && window.location.pathname !== '/') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('optirisk_user');
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return Promise.reject(error);
});

export default apiClient;