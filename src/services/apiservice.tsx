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
      console.log(config.url)
      if (tokenData && config.url && !exceptUrl.includes(config.url)) {
        console.log('TOKEN DATA:', tokenData);
        const token = JSON.parse(tokenData);
        console.log('PARSED TOKEN:', token);
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
    window.location.href = '/';
  }
  return Promise.reject(error);
});

export default apiClient;