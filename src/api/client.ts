import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1', // base URL
});

export default apiClient;