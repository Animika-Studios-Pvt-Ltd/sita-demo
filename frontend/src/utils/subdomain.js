export const getSubdomain = () => {
    const hostname = window.location.hostname;

    // Handle localhost (e.g. admin.localhost)
    // Localhost might be 'localhost' or 'admin.localhost'
    const parts = hostname.split('.');

    // If it's just 'localhost' or an IP, no subdomain
    if (parts.length === 1 || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        return null;
    }

    // For localhost development (e.g. admin.localhost)
    if (parts[parts.length - 1] === 'localhost') {
        if (parts.length === 2) return parts[0];
        return null; // or handle deeper levels if needed
    }

    // For production (e.g. admin.example.com)
    // Standard domain is parts.length - 2 (example.com)
    // Subdomain is parts[0]
    if (parts.length > 2) {
        return parts[0];
    }

    return null;
};
