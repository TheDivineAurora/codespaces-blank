import axios from "axios";

const api = axios.create({
    baseURL : "https://organic-adventure-9v6qxj669gp2pw75-8000.app.github.dev",
    withCredentials: true,
});

// api.interceptors.response.use(
//     res => res,
//     async (err) => {
//         const original = err.config;
//         if(err.response?.status === 401 && !original._retry) {
//             original._retry = true;
//             try {
//                 await api.post("/auth/refresh")
//                 return api(original)
//             } catch {
//                 window.location.href = "/login"
//             }
//         }
//         return Promise.reject(err)
//     }
// )

export default api;