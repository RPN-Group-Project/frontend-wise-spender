const API_BASE_URL = "http://localhost:3000/v1";
const keyToken = "token";
const storeToken = localStorage.getItem(keyToken);

const apiService = {
  fetchData: (endpoint, method = "GET", data = {}) => {
    const headers = {
      Authorization: storeToken ? `Bearer ${storeToken}` : undefined,
    };
    return $.ajax({
      url: `${API_BASE_URL}/${endpoint}`,
      method: method,
      headers,
      data,
    });
  },

  get: (endpoint) => {
    return apiService.fetchData(endpoint, "GET");
  },

  post: (endpoint, data) => {
    return apiService.fetchData(endpoint, "POST", data);
  },

  patch: (endpoint, data) => {
    return apiService.fetchData(endpoint, "PATCH", data);
  },

  delete: (endpoint, data) => {
    return apiService.fetchData(endpoint, "DELETE", data);
  },
};

export default apiService;
