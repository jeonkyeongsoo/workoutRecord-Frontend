import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // 세션/쿠키 포함 설정
});

export default api;