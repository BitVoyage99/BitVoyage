import axios from 'axios';

export const upbitInstance = axios.create({
  baseURL: 'https://api.upbit.com/v1/',
});
