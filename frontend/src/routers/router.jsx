import { createBrowserRouter } from "react-router-dom";
import { getSubdomain } from "../utils/subdomain";
import { adminRoutes } from "./routes/adminRoutes";
import { mainRoutes } from "./routes/mainRoutes";

// Determine which routes to use based on subdomain
const subdomain = getSubdomain();

let routes = [];

if (subdomain === 'admin') {
  routes = adminRoutes;
} else {
  // Default to main routes for now (includes potential store/blog fallback until separated)
  routes = mainRoutes;
}

const router = createBrowserRouter(routes);

export default router;
