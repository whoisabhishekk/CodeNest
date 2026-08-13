import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,  // Cookies automatically bhejne ke liye
    headers: {
        'Content-Type': 'application/json'
    }
})

// ===== RESPONSE INTERCEPTOR =====
// Har response ko check karta hai. Agar 401 (Unauthorized) aaye,
// toh user ka session expire ho chuka hai → localStorage saaf karo
axiosClient.interceptors.response.use(
    (response) => response,  // Agar success hai toh seedha return karo
    (error) => {
        if (error.response?.status === 401) {
            // Agar /user/check fail hota hai (jaise guest user visit pe), toh redirect mat karo
            if (error.config && error.config.url && error.config.url.includes('/user/check')) {
                return Promise.reject(error);
            }

            // Baaki kisi API call pe 401 aaye (matlab token expire hua), toh login bhejo
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/signup') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;