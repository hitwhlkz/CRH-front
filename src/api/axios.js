import axios from 'axios';
import { baseURL } from './base';

const instance = axios.create({
  baseURL: baseURL
});

export default instance;
