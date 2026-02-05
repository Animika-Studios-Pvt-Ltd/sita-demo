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
  // All other subdomains (blog, store, booking) are now merged into mainRoutes
  // along with the main domain itself.
  routes = mainRoutes;
}

const router = createBrowserRouter(routes);

export default router;
