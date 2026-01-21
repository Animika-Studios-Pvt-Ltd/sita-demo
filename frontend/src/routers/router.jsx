import { createBrowserRouter } from "react-router-dom";
import { getSubdomain } from "../utils/subdomain";
import { adminRoutes } from "./routes/adminRoutes";
import { mainRoutes } from "./routes/mainRoutes";
import { blogRoutes } from "./routes/blogRoutes";

// Determine which routes to use based on subdomain
const subdomain = getSubdomain();

let routes = [];

if (subdomain === 'admin') {
  routes = adminRoutes;
} else if (subdomain === 'blog') {
  routes = blogRoutes;
} else {
  // Default to main routes (includes potential store/booking fallback until separated)
  routes = mainRoutes;
}

const router = createBrowserRouter(routes);

export default router;
