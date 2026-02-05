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

const MUTED_PALETTE = [
  "#64748B",
  "#94A3B8",
  "#CBD5E1",
  "#7C8AA5",
  "#A3AED0",
  "#E2E8F0"
];

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

  // Minimal glass palette
  const SLATE = "#64748B";
  const SLATE_DARK = "#334155";
  const SLATE_LIGHT = "#94A3B8";
  const PIE_COLORS = MUTED_PALETTE;

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8 font-montserrat text-slate-700">
      <motion.div
        className="text-center mb-2 px-2 sm:px-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center justify-center gap-3 mb-2">
          <div className="shield-glow p-3 bg-white/70 backdrop-blur-md rounded-full border border-white/60 ring-1 ring-black/5">
            <MdSecurity className="text-slate-600 text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-center font-montserrat">
            Admin Dashboard
          </h2>
        </div>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          Overview of your store's performance, inventory, and orders.
        </p>
        <div className="mt-4 mx-auto w-24 h-1 bg-slate-300 rounded-full opacity-80"></div>
      </motion.div>

      <div className="flex justify-end mb-6">
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-4 py-2 bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-full text-slate-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-white/80 font-medium shadow-sm hover:bg-white/90 transition-all duration-200 cursor-pointer"
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
            color="slate"
            icon={<MdOutlineLibraryBooks className="text-slate-600 text-3xl sm:text-4xl" />}
            title="Total Books"
            value={totalProducts}
          />
        </div>

        <div
          onClick={() => navigate("/dashboard/sales")}
          className="cursor-pointer"
        >
          <DashboardCard
            color="slate"
            icon={<TbCurrencyRupee className="text-slate-600 text-3xl sm:text-4xl" />}
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
            color="slate"
            icon={<AiOutlineShoppingCart className="text-slate-600 text-3xl sm:text-4xl" />}
            title="Total Orders"
            value={totalOrders}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-10">
        <div
          onClick={() => navigate("/dashboard/sales")}
          className="
          bg-gradient-to-br from-white/80 via-white/60 to-slate-50/70 backdrop-blur-xl rounded-2xl p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] cursor-pointer border border-white/70 ring-1 ring-black/5
          hover:shadow-[0_22px_50px_-32px_rgba(15,23,42,0.55)] hover:-translate-y-0.5 transition-all duration-300
        "
        >
          <h2
            className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 select-none font-montserrat"
          >
            <FaChartLine className="text-slate-600 text-2xl sm:text-3xl" />
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
                    <stop offset="5%" stopColor={SLATE} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={SLATE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#64748B", fontFamily: "Montserrat" }}
                  interval={Math.floor(salesChartData.length / 5)}
                  tickFormatter={(tick) => tick.split("/").slice(0, 2).join("/")}
                />
                <YAxis
                  tick={{ fill: "#64748B", fontSize: 11, fontFamily: "Montserrat" }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    borderRadius: "8px",
                    fontFamily: "Montserrat",
                    boxShadow: "0 6px 16px -8px rgba(15, 23, 42, 0.2)"
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]}
                  labelStyle={{ color: "#334155", fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke={SLATE_DARK}
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 italic font-medium">
              No sales data available for the selected period.
            </div>
          )}
        </div>
        <div
          onClick={() => navigate("/dashboard/orders")}
          className="
            bg-gradient-to-br from-white/80 via-white/60 to-slate-50/70 backdrop-blur-xl rounded-2xl p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] cursor-pointer border border-white/70 ring-1 ring-black/5
            hover:shadow-[0_22px_50px_-32px_rgba(15,23,42,0.55)] hover:-translate-y-0.5 transition-all duration-300
          "
        >
          <h2
            className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 select-none font-montserrat"
          >
            <FaChartPie className="text-slate-600 text-2xl sm:text-3xl" />
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
                          case "delivered": fillColor = "#5A7F6A"; break;
                          case "cancelled":
                          case "canceled": fillColor = "#9B5C5C"; break;
                          case "pending": fillColor = "#B59B6A"; break;
                          case "processing": fillColor = "#6B7280"; break;
                          case "shipped": fillColor = "#7C8AA5"; break;
                          default: fillColor = PIE_COLORS[index % PIE_COLORS.length];
                        }
                        return <Cell key={index} fill={fillColor} stroke="#fff" strokeWidth={2} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        fontFamily: 'Montserrat',
                        borderRadius: '8px',
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(148,163,184,0.3)"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col gap-3 justify-center">
                {ordersByStatus.map((entry, index) => {
                  let color;
                  switch (entry.name?.toLowerCase()) {
                    case "delivered": color = "#5A7F6A"; break;
                    case "cancelled":
                    case "canceled": color = "#9B5C5C"; break;
                    case "pending": color = "#B59B6A"; break;
                    case "processing": color = "#6B7280"; break;
                    case "shipped": color = "#7C8AA5"; break;
                    default: color = PIE_COLORS[index % PIE_COLORS.length];
                  }
                  return (
                    <div key={index} className="flex items-center text-slate-700 text-sm font-medium">
                      <span
                        className="w-3 h-3 rounded-full mr-3 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="capitalize">{entry.name}</span>
                      <span className="text-slate-900 font-semibold ml-auto">{entry.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500 italic font-medium">
              No order data available for the selected period.
            </div>
          )}
        </div>
      </div>

      <div
        onClick={() => navigate("/dashboard/sales")}
        className="
        bg-gradient-to-br from-white/80 via-white/60 to-slate-50/70 backdrop-blur-xl rounded-2xl p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] mb-6 cursor-pointer border border-white/70 ring-1 ring-black/5
        hover:shadow-[0_22px_50px_-32px_rgba(15,23,42,0.55)] hover:-translate-y-0.5 transition-all duration-300 select-none
      "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 font-montserrat">
          <FaBook className="text-slate-600 text-2xl sm:text-3xl" />
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
                tick={{ fontSize: 11, fill: "#64748B", fontFamily: "Montserrat" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fontFamily: "Montserrat" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(148,163,184,0.3)",
                  borderRadius: "8px",
                  fontFamily: "Montserrat",
                }}
                formatter={(value) => [`${value} sold`, "Quantity"]}
                cursor={{ fill: '#F3F4F6' }}
              />
              <Bar dataKey="stock" radius={[4, 4, 0, 0]} animationDuration={1000}>
                {topBooks.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? SLATE_DARK : SLATE_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-slate-500 italic font-medium">
            No book sales data available for the selected period.
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ color, icon, title, value, prefix = "" }) => {
  const borderClass = color ? "border border-white/70 ring-1 ring-black/5" : "border border-slate-200/70";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-5 p-6 bg-gradient-to-br from-white/80 via-white/60 to-slate-50/70 backdrop-blur-xl rounded-2xl shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] ${borderClass} hover:shadow-[0_22px_46px_-32px_rgba(15,23,42,0.55)] hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className="p-4 bg-white/70 backdrop-blur rounded-full border border-white/80 ring-1 ring-black/5 shadow-[inset_0_1px_6px_rgba(15,23,42,0.08)]">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase font-montserrat">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1 font-montserrat">
          {prefix}<CountUp end={value} duration={2} separator="," />
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
