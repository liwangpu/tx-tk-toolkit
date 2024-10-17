import axios from 'axios';
import { UserRepository } from '../repositories';

export function axiosGlobalSetup() {

  axios.defaults.baseURL = "http://1.116.37.43:9200"
  const getToken = () => {
    return localStorage.getItem('token');
  };

  axios.interceptors.request.use((config) => {
    const token = getToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  });

  const gotoLogin = () => {
    localStorage.removeItem('token')
    window.location.href = '/login';
  };

  axios.interceptors.response.use(response => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, error => {
    // console.log(`error:`, error);
    // window.location.href = '/login';
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const token = getToken();
    try {
      const status = error.response.status;
      // 如果是未授权且token存在,刷新token再重新请求
      if (status === 401 && token) {
        return UserRepository.refreshToken()
          .then(() => {
            return axios.request(error.config);
          });
      } else if (status === 500) {
        // gotoLogin();
      }
    } catch (error) {
      gotoLogin();
    }

    return Promise.reject(error);
  });

}