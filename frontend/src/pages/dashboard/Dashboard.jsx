import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import getBaseUrl from "../../utils/baseURL";
import { MdOutlineLibraryBooks, MdSecurity } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbCurrencyRupee } from "react-icons/tb";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { FaBook, FaChartLine, FaChartPie } from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";

const COLORS = ["#6D28D9", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"];

const colorMap = {
  purple: "border-l-4 border-purple-500",
  green: "border-l-4 border-green-500",
  blue: "border-l-4 border-blue-500",
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const [salesChartData, setSalesChartData] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [topBooks, setTopBooks] = useState([]);

  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [timeFilter, setTimeFilter] = useState("overall");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const response = await axios.get(
          `${getBaseUrl()}/api/admin-auth/verify`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminToken");
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem("adminToken");
        navigate("/", { replace: true });
      }
    };
    verifyAuth();
  }, [navigate]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    setLoading(true);

    try {
      const [booksRes, ordersRes] = await Promise.all([
        axios.get(`${getBaseUrl()}/api/books`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${getBaseUrl()}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      const booksData = booksRes.data || [];
      const allOrders = ordersRes.data?.orders || ordersRes.data || [];
      setBooks(booksData);
      setOrders(allOrders);
      setTotalProducts(booksData.length);
      setTotalOrders(allOrders.length);
      const validOrders = allOrders.filter(o => o.status !== "Cancelled" && o.status !== "Return Approved");
      setTotalSales(validOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0));

    } catch (err) {
      console.error('Fetch data error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, isAuthenticated]);

  const applyFilter = useCallback(() => {
    if (!isAuthenticated) return;

    const now = new Date();

    const filteredOrders = orders.filter(o => {
      const created = new Date(o.createdAt);

      switch (timeFilter) {
        case "day":
          return created.toDateString() === now.toDateString();
        case "week": {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return created >= weekStart && created <= weekEnd;
        }
        case "month":
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    const totalFilteredOrders = filteredOrders.length;

    const validOrders = filteredOrders.filter(
      o => o.status !== "Cancelled" && o.status !== "Return Approved"
    );
    const totalFilteredSales = validOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    setTotalSales(totalFilteredSales);


    setTotalOrders(totalFilteredOrders);
    setTotalSales(totalFilteredSales);
    setTotalProducts(books.length);
    const statusMap = {};
    filteredOrders.forEach(o => {
      const status = o.status || "Unknown";
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    setOrdersByStatus(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

    const today = new Date();
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (29 - i));
      return { date: d.toLocaleDateString("en-GB"), sales: 0 };
    });

    validOrders.forEach(o => {
      const date = new Date(o.createdAt).toLocaleDateString("en-GB");
      const idx = last30Days.findIndex(d => d.date === date);
      if (idx !== -1) last30Days[idx].sales += o.totalPrice || 0;
    });
    setSalesChartData(last30Days);

    const bookMap = {};
    validOrders.forEach(o => {
      if (!Array.isArray(o.products)) return;
      o.products.forEach(p => {
        let name = p.title;
        if (!name && books.find(b => b._id === p.bookId)) {
          name = books.find(b => b._id === p.bookId).title;
        }
        if (!name) return;
        bookMap[name] = bookMap[name] || { name, stock: 0 };
        bookMap[name].stock += p.quantity || 0;
      });
    });
    setTopBooks(Object.values(bookMap).sort((a, b) => b.stock - a.stock).slice(0, 10));
  }, [orders, books, timeFilter, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchData();
    applyFilter();

    const intervalId = setInterval(() => {
      fetchData();
      applyFilter();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [fetchData, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      applyFilter();
    }
  }, [applyFilter, isAuthenticated]);

  if (!isAuthenticated || loading) {
    return <Loading />;
  }

  // Sita-inspired palette
  const BRONZE = "#c86836";
  const GOLD = "#FFCE1A";
  const DARK_BLUE = "#0D0842";
  const LIGHT_CREAM = "#F9F5F0";
  const PIE_COLORS = [BRONZE, DARK_BLUE, GOLD, "#10B981", "#EF4444", "#8B5CF6"];

  return (
    <div className="container mx-auto mt-24 px-4 sm:px-6 lg:px-8 font-montserrat">
      <motion.div
        className="text-center mb-12 px-2 sm:px-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-white rounded-full shadow-md border border-gray-200">
            <MdSecurity className="text-[#c86836] text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0842] tracking-tight text-center sm:text-left font-pt-serif">
            Admin Dashboard
          </h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Overview of your store's performance, inventory, and orders.
        </p>
        <div className="mt-4 mx-auto w-24 h-1 bg-[#c86836] rounded-full opacity-80"></div>
      </motion.div>

      <div className="flex justify-end mb-6">
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-[#c86836] rounded-full text-[#0D0842] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FFCE1A] focus:border-transparent font-medium shadow-sm cursor-pointer"
        >
          <option value="overall">Overall</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => navigate("/dashboard/inventory")}
          className="cursor-pointer"
        >
          <DashboardCard
            color="c86836"
            icon={<MdOutlineLibraryBooks className="text-[#c86836] text-3xl sm:text-4xl" />}
            title="Total Products"
            value={totalProducts}
          />
        </div>

        <div
          onClick={() => navigate("/dashboard/sales")}
          className="cursor-pointer"
        >
          <DashboardCard
            color="FFCE1A"
            icon={<TbCurrencyRupee className="text-[#B49214] text-3xl sm:text-4xl" />}
            title="Total Sales"
            prefix="₹"
            value={totalSales}
          />
        </div>

        <div
          onClick={() => navigate("/dashboard/orders")}
          className="cursor-pointer"
        >
          <DashboardCard
            color="0D0842"
            icon={<AiOutlineShoppingCart className="text-[#0D0842] text-3xl sm:text-4xl" />}
            title="Total Orders"
            value={totalOrders}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-10">
        <div
          onClick={() => navigate("/dashboard/sales")}
          className="
          bg-white rounded-xl p-6 shadow-md cursor-pointer border-t-4 border-[#c86836]
          hover:shadow-lg transform transition-all duration-300
        "
        >
          <h2
            className="text-xl sm:text-2xl font-bold text-[#0D0842] mb-6 flex items-center gap-2 select-none font-pt-serif"
          >
            <FaChartLine className="text-[#c86836] text-2xl sm:text-3xl" />
            Sales Overview
          </h2>

          {salesChartData && salesChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} minHeight={300}>
              <AreaChart
                data={salesChartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRONZE} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={BRONZE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#4B5563", fontFamily: "Montserrat" }}
                  interval={Math.floor(salesChartData.length / 5)}
                  tickFormatter={(tick) => tick.split("/").slice(0, 2).join("/")}
                />
                <YAxis
                  tick={{ fill: "#4B5563", fontSize: 11, fontFamily: "Montserrat" }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontFamily: "Montserrat",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]}
                  labelStyle={{ color: "#0D0842", fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={BRONZE}
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 italic font-medium">
              No sales data available for the selected period.
            </div>
          )}
        </div>
        <div
          onClick={() => navigate("/dashboard/orders")}
          className="
            bg-white rounded-xl p-6 shadow-md cursor-pointer border-t-4 border-[#0D0842]
            hover:shadow-lg transform transition-all duration-300
          "
        >
          <h2
            className="text-xl sm:text-2xl font-bold text-[#0D0842] mb-6 flex items-center gap-2 select-none font-pt-serif"
          >
            <FaChartPie className="text-[#0D0842] text-2xl sm:text-3xl" />
            Orders by Status
          </h2>

          {ordersByStatus && ordersByStatus.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex-1 min-h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={3}
                    >
                      {ordersByStatus.map((entry, index) => {
                        let fillColor;
                        switch (entry.name?.toLowerCase()) {
                          case "delivered": fillColor = "#10B981"; break;
                          case "cancelled":
                          case "canceled": fillColor = "#EF4444"; break;
                          case "pending": fillColor = GOLD; break;
                          case "processing": fillColor = DARK_BLUE; break;
                          case "shipped": fillColor = BRONZE; break;
                          default: fillColor = PIE_COLORS[index % PIE_COLORS.length];
                        }
                        return <Cell key={index} fill={fillColor} stroke="#fff" strokeWidth={2} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontFamily: 'Montserrat', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col gap-3 justify-center">
                {ordersByStatus.map((entry, index) => {
                  let color;
                  switch (entry.name?.toLowerCase()) {
                    case "delivered": color = "#10B981"; break;
                    case "cancelled":
                    case "canceled": color = "#EF4444"; break;
                    case "pending": color = GOLD; break;
                    case "processing": color = DARK_BLUE; break;
                    case "shipped": color = BRONZE; break;
                    default: color = PIE_COLORS[index % PIE_COLORS.length];
                  }
                  return (
                    <div key={index} className="flex items-center text-gray-700 text-sm font-medium">
                      <span
                        className="w-3 h-3 rounded-full mr-3 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="capitalize">{entry.name}</span>
                      <span className="text-[#0D0842] font-semibold ml-auto">{entry.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 italic font-medium">
              No order data available for the selected period.
            </div>
          )}
        </div>
      </div>

      <div
        onClick={() => navigate("/dashboard/sales")}
        className="
        bg-white rounded-xl p-6 shadow-md mb-6 cursor-pointer border-t-4 border-[#FFCE1A]
        hover:shadow-lg transform transition-all duration-300 select-none
      "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-[#0D0842] mb-6 flex items-center gap-2 font-pt-serif">
          <FaBook className="text-[#FFCE1A] text-2xl sm:text-3xl" />
          Top Selling Books
        </h2>

        {topBooks && topBooks.length > 0 ? (
          <ResponsiveContainer width="100%" height={320} minHeight={320}>
            <BarChart
              data={topBooks}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={45}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#4B5563", fontFamily: "Montserrat" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fontFamily: "Montserrat" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontFamily: "Montserrat",
                }}
                formatter={(value) => [`${value} sold`, "Quantity"]}
                cursor={{ fill: '#F3F4F6' }}
              />
              <Bar dataKey="stock" radius={[4, 4, 0, 0]} animationDuration={1000}>
                {topBooks.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? DARK_BLUE : BRONZE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500 italic font-medium">
            No book sales data available for the selected period.
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ color, icon, title, value, prefix = "" }) => {
  // Generate styles based on prop color, though we moved to specific hex props in usage,
  // we can fallback or handle the prop logic here.
  // However, to keep it clean with the new design, let's treat 'color' as a key or just style directly.

  // Mapping for border colors if we keep the "purple/green" prop names for compatibility, 
  // OR we can just use the exact colors passed in the rewrite above.
  // The rewrite passes hex codes directly or keys. Let's handle the specific keys passed above.

  let borderClass = "";
  if (color === "c86836") borderClass = "border-l-4 border-[#c86836]"; // Bronze
  else if (color === "FFCE1A") borderClass = "border-l-4 border-[#FFCE1A]"; // Gold
  else if (color === "0D0842") borderClass = "border-l-4 border-[#0D0842]"; // Blue
  else borderClass = "border-l-4 border-gray-300";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-5 p-6 bg-white rounded-xl shadow-md ${borderClass} hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="p-4 bg-gray-50 rounded-full shadow-inner">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm font-semibold tracking-wide uppercase font-montserrat">{title}</p>
        <p className="text-3xl font-bold text-[#0D0842] mt-1 font-pt-serif">
          {prefix}<CountUp end={value} duration={2} separator="," />
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
