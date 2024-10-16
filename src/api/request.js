import axios from 'axios'
import {Message} from 'element-ui'
const instance = axios.create({
  baseURL: 'http://localhost:8081/',
  timeout: 5000
})

//请求拦截
instance.interceptors.request.use(config =>{
  // let token = sessionStorage.getItem('token');
  // if (token) {
  //   config.headers = Object.assign(config.headers, {token, 'Retry-after': 3600})
  // }
  return config;
}, error => {
  return Promise.reject(error);
})

//响应拦截
instance.interceptors.response.use(response =>{
  if (response.status === 200)  {
    return response.data;
  }
}, error => {
  let message = '';
  if (error && error.response) {
    switch (error.response.status) {
      case 401:
        message = '请求未授权';
        break;
      case 403:
        message = '禁止访问';
        break;
      case 404:
        message = '找不到如何与 URI 相匹配的资源';
        break;
      case 500:
        message = '最常见的服务器端错误';
        break;
      case 503:
        message = '服务器端暂时无法处理请求（可能是过载或维护）';
        break;
    }
  }
  Message({
    type: 'error',
    message
  })
  return Promise.reject(error);
})


export default instance;
