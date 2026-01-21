import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from "chart.js";
import { FaChartLine, FaBook } from "react-icons/fa";
import getBaseUrl from "../../../utils/baseURL";
import CountUp from "react-countup";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

const timeFilters = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

const SalesPage = () => {
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState({ labels: [], values: [] });
    const [bookSalesData, setBookSalesData] = useState([]);
    const [filter, setFilter] = useState("Daily");
    const [chartType, setChartType] = useState("bar");
    const [summary, setSummary] = useState({ totalSales: 0, totalOrders: 0, avgOrderValue: 0 });

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            if (!token) return setLoading(false);

            const booksRes = await axios.get(`${getBaseUrl()}/api/books`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const books = booksRes.data || [];
            const booksMap = {};
            books.forEach((b) => { if (b?._id) booksMap[b._id] = b; });

            const ordersRes = await axios.get(`${getBaseUrl()}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const ordersData = ordersRes.data.orders || ordersRes.data || [];
            const validOrders = ordersData.filter(
                (o) => o?.status && o.status !== "Cancelled" && o.status !== "Return Approved"
            );

            const totalSales = validOrders.reduce((sum, o) => sum + (o?.totalPrice || 0), 0);
            const totalOrders = validOrders.length;
            const totalBooksSold = validOrders.reduce((sum, order) => {
                return sum + (order.products?.reduce((s, item) => s + (item.quantity || 0), 0) || 0);
            }, 0);

            setSummary({ totalSales, totalOrders, totalBooksSold });

            setSalesData(transformChartData(validOrders, filter));
            setBookSalesData(transformBookData(validOrders, filter, booksMap));

            setLoading(false);
        } catch (error) {
            console.error("Error fetching sales data:", error);
            Swal.fire("Error", "Failed to fetch sales data", "error");
            setLoading(false);
        }
    };


    const transformChartData = (orders, filterType) => {
        const dataMap = {};
        orders.forEach((order) => {
            if (!order?.createdAt) return;
            const date = new Date(order.createdAt);
            let key;
            switch (filterType) {
                case "Daily":
                    key = date.toLocaleDateString();
                    break;
                case "Weekly":
                    const week = Math.ceil(date.getDate() / 7);
                    key = `${date.getMonth() + 1}-W${week}`;
                    break;
                case "Monthly":
                    key = `${date.getMonth() + 1}-${date.getFullYear()}`;
                    break;
                case "Quarterly":
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    key = `Q${quarter}-${date.getFullYear()}`;
                    break;
                case "Yearly":
                    key = `${date.getFullYear()}`;
                    break;
                default:
                    key = date.toLocaleDateString();
            }
            if (!dataMap[key]) dataMap[key] = 0;
            dataMap[key] += order?.totalPrice || 0;
        });

        const labels = Object.keys(dataMap).sort((a, b) => new Date(a) - new Date(b));
        const values = labels.map((l) => dataMap[l]);
        return { labels, values };
    };

    const transformBookData = (orders, filterType, booksMap = {}) => {
        const bookMap = {};

        orders.forEach((order) => {
            if (!order?.createdAt || !Array.isArray(order.products)) return;

            const date = new Date(order.createdAt);
            let key;
            switch (filterType) {
                case "Daily":
                    key = date.toLocaleDateString(); break;
                case "Weekly":
                    const week = Math.ceil(date.getDate() / 7);
                    key = `${date.getMonth() + 1}-W${week}`; break;
                case "Monthly":
                    key = `${date.getMonth() + 1}-${date.getFullYear()}`; break;
                case "Quarterly":
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    key = `Q${quarter}-${date.getFullYear()}`; break;
                case "Yearly":
                    key = `${date.getFullYear()}`; break;
                default: key = date.toLocaleDateString();
            }

            order.products.forEach((item) => {
                const title = booksMap[item.bookId]?.title || item.title || "Unknown";
                const price = item?.price || 0;

                if (!bookMap[title]) bookMap[title] = { quantity: 0, revenue: 0 };
                bookMap[title].quantity += item?.quantity || 0;
                bookMap[title].revenue += (item?.quantity || 0) * price;
            });
        });

        return Object.keys(bookMap)
            .map((title) => ({ title, ...bookMap[title] }))
            .sort((a, b) => b.revenue - a.revenue);
    };

    useEffect(() => {
        fetchSalesData();
    }, [filter]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSalesData();
        }, 30000);

        return () => clearInterval(interval);
    }, [filter]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading sales data...</p>
                </div>
            </div>
        );

    const chartConfig = {
        labels: salesData.labels,
        datasets: [
            {
                label: "Sales (₹)",
                data: salesData.values,
                backgroundColor: "rgba(34,197,94,0.5)",
                borderColor: "rgba(34,197,94,1)",
                borderWidth: 2,
                fill: chartType === "line" ? false : true,
                tension: 0.3,
                pointRadius: chartType === "line" ? 5 : 0,
            },
        ],
    };

    const reversedChartConfig = {
        ...chartConfig,
        labels: [...chartConfig.labels].reverse(),
        datasets: chartConfig.datasets.map(dataset => ({
            ...dataset,
            data: [...dataset.data].reverse(),
        })),
    };

    const bookChartConfig = {
        labels: bookSalesData.map((b) => b.title),
        datasets: [
            {
                label: "Quantity Sold",
                data: bookSalesData.map((b) => b.quantity),
                backgroundColor: "rgba(59,130,246,0.6)",
            },
            {
                label: "Revenue (₹)",
                data: bookSalesData.map((b) => b.revenue),
                backgroundColor: "rgba(16,185,129,0.6)",
            },
        ],
    };

    return (
        <div className="container mt-24 px-4 md:px-8">
            <div className="max-w-8xl mx-auto">
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 md:p-8 mb-5 shadow-lg">
                    <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-2">
                        <FaChartLine /> Sales Overview
                    </h2>
                    <p className="text-green-100 text-lg">
                        Total Sales:{" "}
                        <span className="font-semibold">
                            ₹<CountUp end={summary.totalSales} duration={1.2} separator="," />
                        </span>{" "}
                        | Active Orders:{" "}
                        <span className="font-semibold">
                            <CountUp end={summary.totalOrders} duration={1.2} />
                        </span>{" "}
                        | Total Books Sold:{" "}
                        <span className="font-semibold">
                            <CountUp end={summary.totalBooksSold} duration={1.2} />
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    {timeFilters.map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${filter === t ? "bg-green-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                    <button
                        onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
                        className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                        {chartType === "bar" ? "Switch to Line Chart" : "Switch to Bar Chart"}
                    </button>
                </div>


                <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                    {chartType === "bar" ? (
                        <Bar
                            data={reversedChartConfig}
                            options={{
                                animation: { duration: 800, easing: 'easeOutQuart' },
                                responsive: true,
                                plugins: {
                                    legend: { position: "top" },
                                    tooltip: {
                                        callbacks: {
                                            label: (tooltipItem) => `₹${tooltipItem.raw.toLocaleString()}`,
                                        },
                                    },
                                },
                                scales: { y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } } },
                            }}
                        />
                    ) : (
                        <Line
                            data={reversedChartConfig}
                            options={{
                                animation: { duration: 800, easing: 'easeOutQuart' },
                                responsive: true,
                                plugins: { legend: { position: "top" }, title: { display: true, text: `${filter} Sales Trend` } },
                                scales: { y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } } },
                            }}
                        />
                    )}
                </div>


                <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaBook /> Book Sales Overview
                    </h2>
                    <Bar
                        data={bookChartConfig}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) =>
                                            tooltipItem.dataset.label === "Revenue (₹)"
                                                ? `₹${tooltipItem.raw.toLocaleString()}`
                                                : tooltipItem.raw,
                                    },
                                },
                            },
                            scales: { y: { beginAtZero: true } },
                        }}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaBook /> Book Sales Details
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Book Title</th>
                                    <th className="py-2 px-4 border-b text-right">Quantity Sold</th>
                                    <th className="py-2 px-4 border-b text-right">Revenue (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookSalesData.map((b, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{b.title}</td>
                                        <td className="py-2 px-4 border-b text-right">{b.quantity}</td>
                                        <td className="py-2 px-4 border-b text-right">₹{b.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;
