import axios from 'axios';

const config = {
    baseURL: 'https://momentum.redberryinternship.ge/api',
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer 9e76d0a1-53f7-4fb9-8fee-c6f087864bbc`
    }
};

const axiosInstance = axios.create(config);

export default axiosInstance;