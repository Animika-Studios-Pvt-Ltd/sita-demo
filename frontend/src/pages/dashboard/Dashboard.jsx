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

  return (
    <div className="container mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-12 px-2 sm:px-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg animate-pulse">
            <MdSecurity className="text-white text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight text-center sm:text-left">
            Admin Dashboard
          </h2>
        </div>
        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
          Overview of your store's performance, inventory, and orders.
        </p>
        <div className="mt-4 mx-auto w-20 sm:w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
      </motion.div>

      <div className="flex justify-end mb-6">
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 border-2 border-blue-500 rounded-full text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400">
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
            color="purple"
            icon={<MdOutlineLibraryBooks className="text-purple-600 text-3xl sm:text-4xl" />}
            title="Total Products"
            value={totalProducts}
          />
        </div>

        <div
          onClick={() => navigate("/dashboard/sales")}
          className="cursor-pointer"
        >
          <DashboardCard
            color="green"
            icon={<TbCurrencyRupee className="text-green-600 text-3xl sm:text-4xl" />}
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
            color="blue"
            icon={<AiOutlineShoppingCart className="text-blue-600 text-3xl sm:text-4xl" />}
            title="Total Orders"
            value={totalOrders}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-10 font-[Playfair_Display]">
        <div
          onClick={() => navigate("/dashboard/sales")}
          className="
          bg-white rounded-lg p-4 sm:p-6 md:p-6 shadow-lg cursor-pointer 
          hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300
          focus:outline-none active:scale-[0.98]
        "
        >
          <h2
            className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 select-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <FaChartLine className="text-indigo-600 text-2xl sm:text-3xl" />
            Sales Overview
          </h2>

          {salesChartData && salesChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} minHeight={250}>
              <AreaChart
                data={salesChartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#4B5563" }}
                  interval={Math.floor(salesChartData.length / 5)}
                  tickFormatter={(tick) => tick.split("/").slice(0, 2).join("/")}
                />
                <YAxis
                  tick={{ fill: "#4B5563", fontSize: 10 }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F9FAFB",
                    border: "none",
                    borderRadius: "8px",
                    fontFamily: "'Playfair Display', serif",
                  }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366F1"
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-gray-500 italic">
              No sales data available for the selected period.
            </div>
          )}
        </div>
        <div
          onClick={() => navigate("/dashboard/orders")}
          className="
    bg-white rounded-lg p-4 sm:p-6 md:p-6 shadow-lg cursor-pointer
    hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300
    focus:outline-none active:scale-[0.98]
  "
        >
          <h2
            className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 select-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <FaChartPie className="text-blue-600 text-2xl sm:text-3xl" />
            Orders by Status
          </h2>

          {ordersByStatus && ordersByStatus.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={250} minHeight={250}>
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={4}

                    >
                      {ordersByStatus.map((entry, index) => {
                        let fillColor;
                        switch (entry.name?.toLowerCase()) {
                          case "delivered":
                            fillColor = "#10B981";
                            break;
                          case "cancelled":
                          case "canceled":
                            fillColor = "#EF4444";
                            break;
                          case "pending":
                            fillColor = "#F59E0B";
                            break;
                          case "processing":
                            fillColor = "#3B82F6";
                            break;
                          case "shipped":
                            fillColor = "#8B5CF6";
                            break;
                          default:
                            fillColor = COLORS[index % COLORS.length];
                        }
                        return <Cell key={index} fill={fillColor} />;
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {ordersByStatus.map((entry, index) => {
                  let color;
                  switch (entry.name?.toLowerCase()) {
                    case "delivered":
                      color = "#10B981";
                      break;
                    case "cancelled":
                    case "canceled":
                      color = "#EF4444";
                      break;
                    case "pending":
                      color = "#F59E0B";
                      break;
                    case "processing":
                      color = "#3B82F6";
                      break;
                    case "shipped":
                      color = "#8B5CF6";
                      break;
                    default:
                      color = COLORS[index % COLORS.length];
                  }
                  return (
                    <div key={index} className="flex items-center text-gray-700 font-medium">
                      <span
                        className="w-3 h-3 rounded-full mr-2 inline-block"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="capitalize">{entry.name}</span>
                      <span className="text-gray-900 text-md ml-1"> - {entry.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-gray-500 italic">
              No order data available for the selected period.
            </div>
          )}
        </div>
      </div>

      <div
        onClick={() => navigate("/dashboard/sales")}
        className="
        bg-white rounded-lg p-4 sm:p-6 md:p-6 shadow-lg mb-6 cursor-pointer
        hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300
        focus:outline-none active:scale-[0.98] select-none
      "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaBook className="text-indigo-600 text-2xl sm:text-3xl" />
          Top Selling Books
        </h2>

        {topBooks && topBooks.length > 0 ? (
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <BarChart
              data={topBooks}
              margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#4B5563" }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F9FAFB",
                  border: "none",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value} sold`, "Quantity"]}
              />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]} animationDuration={800}>
                {topBooks.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-gray-500 italic font-[Playfair_Display]">
            No book sales data available for the selected period.
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ color, icon, title, value, prefix = "" }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg cursor-pointer ${colorMap[color]}`}
  >
    <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold">{prefix}<CountUp end={value} duration={2} separator="," /></p>
    </div>
  </motion.div>
);

export default Dashboard;
