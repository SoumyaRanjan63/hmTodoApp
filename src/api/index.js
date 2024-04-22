import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        
    },
    timeout: 10000,
    transformRequest: [
        function(data,headers) {
            if (localStorage.getItem("token")) {
                headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
            }
            return JSON.stringify(data);
        }
    ],
});
