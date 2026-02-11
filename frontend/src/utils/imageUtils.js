/**
 * Ensures that the image URL is secure (HTTPS) and optimized for Cloudinary.
 * @param {string} url - The image URL to process.
 * @param {string} backendUrl - The backend base URL (optional, defaults to VITE_API_URL or localhost).
 * @returns {string} The secure and optimized image URL.
 */
export const getSecureImageUrl = (url, backendUrl) => {
    if (!url) return "/placeholder-image.jpg"; // Return a placeholder if no URL

    // 1. Handle Cloudinary URLs (force HTTPS and add optimizations)
    if (url.includes("cloudinary.com")) {
        let secureUrl = url;

        // Force HTTPS
        if (secureUrl.startsWith("http:")) {
            secureUrl = secureUrl.replace("http:", "https:");
        }

        // Add optimizations (f_auto, q_auto) if not already present
        // This assumes standard Cloudinary URL structure: .../upload/v.../id
        if (!secureUrl.includes("f_auto") && !secureUrl.includes("q_auto") && secureUrl.includes("/upload/")) {
            secureUrl = secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");
        }

        return secureUrl;
    }

    // 2. Handle Absolute HTTP URLs (non-Cloudinary) -> Force HTTPS
    if (url.startsWith("http:")) {
        return url.replace("http:", "https:");
    }

    // 3. Handle Absolute HTTPS URLs (already secure)
    if (url.startsWith("https:")) {
        return url;
    }

    // 4. Handle Relative Paths (append backend URL)
    const base = backendUrl || import.meta.env.VITE_API_URL || "http://localhost:5000";
    // Ensure base URL doesn't have a trailing slash if url has leading slash, or vice versa
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;

    return `${cleanBase}${cleanUrl}`;
};
