import { getSubdomain } from "./subdomain";

export const getTenantSubdomain = () => {
    return getSubdomain() || 'main'; // Fallback to 'main' for root domain
};

export const fetchTenantInfo = async (subdomain) => {
    // Mock response for CMS demo
    // In real app, this would call specific endpoint
    return {
        name: "Demo Tenant",
        features: {
            cms: true,
        },
        cms: {
            enabled: true,
        },
    };
};
