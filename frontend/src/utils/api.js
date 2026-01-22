import axiosClient from "../api/axiosClient";

export const api = {
    get: async (url, config = {}) => {
        const response = await axiosClient.get(url, config);
        return response.data;
    },
    post: async (url, data, config = {}) => {
        const response = await axiosClient.post(url, data, config);
        return response.data;
    },
    put: async (url, data, config = {}) => {
        const response = await axiosClient.put(url, data, config);
        return response.data;
    },
    patch: async (url, data, config = {}) => {
        const response = await axiosClient.patch(url, data, config);
        return response.data;
    },
    delete: async (url, config = {}) => {
        const response = await axiosClient.delete(url, config);
        return response.data;
    },
    upload: async (url, data, config = {}) => {
        const response = await axiosClient.post(url, data, {
            ...config,
            headers: {
                ...config.headers,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
