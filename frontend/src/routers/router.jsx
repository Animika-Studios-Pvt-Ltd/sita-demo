import { createBrowserRouter } from "react-router-dom";
import { getSubdomain } from "../utils/subdomain";
import { adminRoutes } from "./routes/adminRoutes";
import { mainRoutes } from "./routes/mainRoutes";
import { blogRoutes } from "./routes/blogRoutes";
import { storeRoutes } from "./routes/storeRoutes";

// Determine which routes to use based on subdomain
const subdomain = getSubdomain();

let routes = [];

if (subdomain === 'admin') {
  routes = adminRoutes;
} else if (subdomain === 'blog') {
  routes = blogRoutes;
} else if (subdomain === 'store') {
  routes = storeRoutes;
} else {
  // Default to main routes 
  routes = mainRoutes;
}

const router = createBrowserRouter(routes);

export default router;
