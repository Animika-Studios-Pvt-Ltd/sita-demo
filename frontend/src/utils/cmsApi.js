import { api } from "./api";

export const fetchCmsPage = async (slug) => {
    try {
        // Public endpoint for fetching pages
        return await api.get(`/api/cms/pages/${slug}`);
    } catch (error) {
        console.error("Failed to fetch CMS page:", error);
        return null;
    }
};
