import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

export const homeService = {
  getHomepageDeals: async () => {
    const res = await axios.get(`${API}/deals/homepage`);
    return res.data;
  },
};
