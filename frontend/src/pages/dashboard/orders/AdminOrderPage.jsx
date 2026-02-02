import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import getBaseUrl from "../../../utils/baseURL";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import CountUp from "react-countup";
import { FaClipboardList } from "react-icons/fa";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState({});
  const [totalSales, setTotalSales] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  const getTotalQuantity = (products) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        console.error("No admin token found");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${getBaseUrl()}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersData = res.data.orders || res.data || [];

      const sortedOrders = ordersData.sort((a, b) => {
        const statusPriority = (status) => (status === "Delivered" || status === "Cancelled" ? 1 : 0);
        return statusPriority(a.status) - statusPriority(b.status);
      });

      setOrders(sortedOrders);

      const initialTracking = {};
      sortedOrders.forEach((order) => {
        initialTracking[order._id] = order.trackingId || "";
      });
      setTrackingInputs(initialTracking);
      setLoading(false);

    } catch (error) {
      console.error("Failed to fetch orders", error);
      setLoading(false);

      if (error.response?.status === 401) {
        Swal.fire({
          title: "Session Expired",
          text: "Please login again",
          icon: "warning",
          confirmButtonColor: "#3B82F6",
        });
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => { fetchOrders(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orders.length === 0) {
      setTotalOrders(0);
      setDeliveredOrders(0);
      setCancelledOrders(0);
      setTotalSales(0);
      return;
    }

    const total = orders.reduce((sum, order) => {
      if (order.status !== "Cancelled" && order.status !== "Return Approved") {
        return sum + (order.totalPrice || 0);
      }
      return sum;
    }, 0);

    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
    const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

    setTotalOrders(orders.length);
    setDeliveredOrders(deliveredCount);
    setCancelledOrders(cancelledCount);
    setTotalSales(total);
  }, [orders]);


  const updateOrderField = async (orderId, updatedFields) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${getBaseUrl()}/api/orders/${orderId}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      throw error;
    }
  };

  const handleStatusChange = async (orderId, value) => {
    try {
      await updateOrderField(orderId, { status: value });
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, status: value } : order));
      Swal.fire("Success", "Status updated", "success");
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleTrackingChange = (orderId, value) => {
    setTrackingInputs((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleUpdateSingleTracking = async (orderId) => {
    const newTracking = trackingInputs[orderId]?.trim() || "";
    const order = orders.find(o => o._id === orderId);
    const oldTracking = order?.trackingId || "";

    if (newTracking === oldTracking) {
      Swal.fire("Info", "No changes to update", "info");
      return;
    }

    try {
      await updateOrderField(orderId, { trackingId: newTracking });
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, trackingId: newTracking } : order));
      Swal.fire("Success", "Tracking ID updated", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update tracking ID", "error");
      console.error(error);
    }
  };

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200",
      Shipped: "bg-purple-100 text-purple-800 border-purple-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
      "Return Requested": "bg-orange-100 text-orange-800 border-orange-200",
      "Return Approved": "bg-green-100 text-green-800 border-green-200",
      "Return Rejected": "bg-red-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };


  const generateInvoicePDF = (order, download = false) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 40;
    const rightMargin = 40;
    const usableWidth = pageWidth - leftMargin - rightMargin;

    const {
      name,
      email,
      phone,
      _id,
      address,
      totalPrice,
      products,
      giftTo,
      giftFrom,
      giftMessage,
      returnReason,
      returnImage,
    } = order;

    let currentY = 40;

    // --- HEADER ---
    doc.setDrawColor(41, 128, 185);
    doc.setFillColor(41, 128, 185);
    doc.rect(leftMargin, currentY, usableWidth, 50, "F");

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("INVOICE", pageWidth / 2, currentY + 32, { align: "center" });
    currentY += 70;

    // --- CUSTOMER INFO BOX ---
    doc.setDrawColor(0);
    doc.setFillColor(245, 245, 245);
    doc.rect(leftMargin, currentY, usableWidth, 160, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Customer Info:", leftMargin + 10, currentY + 20);
    doc.setFont("helvetica", "normal");
    let infoY = currentY + 40;
    const lineSpacing = 18;

    doc.text(`Name: ${name || "N/A"}`, leftMargin + 10, infoY);
    infoY += lineSpacing;

    doc.text(`Phone: ${phone || "N/A"}`, leftMargin + 10, infoY);
    infoY += lineSpacing;

    doc.text(`Email: ${email || "N/A"}`, leftMargin + 10, infoY);
    infoY += lineSpacing;

    const purchaseDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
    doc.text(`Purchased Date: ${purchaseDate}`, leftMargin + 10, infoY);
    infoY += lineSpacing;

    const addressText = [address?.street, address?.city, address?.state, address?.country, address?.zipcode]
      .filter(Boolean)
      .join(", ");
    const wrappedAddress = doc.splitTextToSize(addressText, usableWidth - 20);
    doc.text("Address:", leftMargin + 10, infoY);
    infoY += 14;
    doc.text(wrappedAddress, leftMargin + 10, infoY);

    currentY = infoY + wrappedAddress.length * 14 + 20;

    // --- Gift Info Box ---
    if (giftTo || giftFrom || giftMessage) {
      const giftText = `To: ${giftTo || "-"} | From: ${giftFrom || "-"} | Message: ${giftMessage || "-"}`;
      const wrappedGift = doc.splitTextToSize(giftText, usableWidth - 20);

      const boxHeight = wrappedGift.length * 14 + 20;
      doc.setDrawColor(0);
      doc.setFillColor(245, 245, 245);
      doc.rect(leftMargin, currentY, usableWidth, boxHeight, "F");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Gift Details:", leftMargin + 10, currentY + 20);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      doc.text(wrappedGift, leftMargin + 10, currentY + 35);

      currentY += boxHeight + 20;
    }

    // --- PRODUCTS TABLE (full width) ---
    const itemRows = (products || []).map((item, idx) => [
      idx + 1,
      item.title || "Untitled Book",
      item.quantity || 1,
      `Rs. ${(Number(item.price) || 0).toFixed(2)}`,
      `Rs. ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [["#", "Book Title", "Qty", "Unit Price", "Subtotal"]],
      body: itemRows,
      startY: currentY,
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold", halign: "center" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { halign: "center", cellWidth: 40 },
        1: { halign: "left", cellWidth: usableWidth * 0.45 },
        2: { halign: "center", cellWidth: 60 },
        3: { halign: "right", cellWidth: 80 },
        4: { halign: "right", cellWidth: 80 },
      },
      margin: { left: leftMargin, right: rightMargin },
    });

    let finalY = doc.lastAutoTable.finalY + 20;

    // --- Return / Notes ---
    if (order.status === "Return Requested" || returnReason) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(192, 57, 43);
      doc.text("Return / Notes:", leftMargin, finalY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      if (returnReason) {
        const wrappedReason = doc.splitTextToSize(`Reason: ${returnReason}`, usableWidth - 20);
        doc.text(wrappedReason, leftMargin + 10, finalY + 15);
        finalY += wrappedReason.length * 12;
      }

      if (returnImage) {
        try {
          doc.addImage(returnImage, "JPEG", leftMargin + 10, finalY + 20, 120, 90);
          finalY += 100;
        } catch (err) {
          console.warn("Failed to add return image:", err);
        }
      }

      finalY += 20;
    }

    const shippingCharge = order.shippingCharge || 0;

    // Calculate subtotal from products
    const subTotal = (order.products || []).reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 1));
    }, 0);

    // Add gift price if it exists
    const giftPrice = order.giftPrice ? Number(order.giftPrice) : 0;

    // Calculate final grand total
    const grandTotal = subTotal + shippingCharge + giftPrice;

    // --- TOTAL AMOUNT BOX ---
    doc.setFillColor(41, 128, 185);
    doc.setDrawColor(41, 128, 185);
    doc.rect(leftMargin, finalY, usableWidth, 80, "F"); // ⬆️ slightly taller box

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);

    const lineGap = 12;
    let totalY = finalY + 20;

    doc.text(`Order Total: Rs. ${subTotal.toFixed(2)}`, leftMargin + 10, totalY);
    totalY += lineGap + 5;
    doc.text(`Shipping Fee: Rs. ${shippingCharge.toFixed(2)}`, leftMargin + 10, totalY);

    if (giftPrice > 0) {
      totalY += lineGap + 5;
      doc.text(`Gift Charges: Rs. ${giftPrice.toFixed(2)}`, leftMargin + 10, totalY);
    }

    totalY += lineGap + 8;
    doc.setFontSize(13);
    doc.text(`Grand Total (Incl. Shipping${giftPrice > 0 ? " + Gift" : ""}): Rs. ${grandTotal.toFixed(2)}`, leftMargin + 10, totalY);

    // --- FOOTER ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(0);
    doc.text("Thank you for shopping with us!", pageWidth / 2, 820, { align: "center" });
    doc.text("https://sitashakti.com | enquiries@sitashakti.com", pageWidth / 2, 835, { align: "center" });

    if (download) {
      doc.save(`Invoice-${_id}.pdf`);
    } else {
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    }
  };

  const previewInvoice = (order) => generateInvoicePDF(order, false);
  const downloadInvoice = (order) => generateInvoicePDF(order, true);


  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-10 px-4 md:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 md:p-8 mb-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-2">
                <FaClipboardList className="text-white text-2xl" /> Order Management
              </h2>
              <p className="text-blue-100 text-lg">
                Total Sales:{" "}
                <span className="font-semibold">
                  ₹
                  <CountUp
                    end={totalSales}
                    duration={2.5}
                    separator=","
                    decimals={2}
                  />
                </span>{" "}
                | Orders:{" "}
                <span className="font-semibold">
                  <CountUp
                    end={orders.length}
                    duration={2.5}
                    separator=","
                  />
                </span>
                <span>{" "}
                  | Cancelled:{" "}
                  <span className="font-semibold ">
                    <CountUp end={cancelledOrders} duration={2.5} separator="," />
                  </span>
                </span>{" "}
                <span>
                  | Delivered:{" "}
                  <span className="font-semibold ">
                    <CountUp end={deliveredOrders} duration={2.5} separator="," />
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-b-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-[25%] px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order Details</th>
                  <th className="w-[15%] px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="w-[15%] px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="w-[30%] px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tracking ID</th>
                  <th className="w-[15%] px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-12 text-gray-500"><svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p className="mt-2 font-medium">No orders found</p></td></tr>
                ) : (
                  orders.map((order) => {
                    const totalQty = getTotalQuantity(order.products);
                    return (
                      <React.Fragment key={order._id}>
                        <tr className="hover:bg-gray-50 transition duration-150">
                          <td className="px-3 py-3">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => toggleRowExpansion(order._id)}
                                className="mt-1 text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                              >
                                <svg
                                  className={`w-4 h-4 transform transition-transform ${expandedRows[order._id] ? "rotate-90" : ""}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-900 break-all">{order.orderCode}</p>

                                {(order.giftTo || order.giftFrom || order.giftMessage) && (
                                  <p className="text-xs text-pink-600 font-semibold mt-1 flex items-center gap-1">
                                    🎁 Gift Order
                                  </p>
                                )}

                                <p className="text-xs text-gray-500 mt-1">
                                  {totalQty} {totalQty === 1 ? "item" : "items"} ({order.products?.length || 0}{" "}
                                  {order.products?.length === 1 ? "book" : "books"})
                                </p>

                                <p className="text-xs font-semibold text-gray-900 mt-1">
                                  ₹{order.totalPrice?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{order.name}</p>
                              <p className="text-xs text-gray-500 truncate">{order.email}</p>
                              {order.phone && <p className="text-xs text-gray-500 truncate">{order.phone}</p>}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`text-xs font-medium px-2 py-1.5 rounded-lg border-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Return Requested">Return Requested</option>
                              <option value="Return Approved">Return Approved</option>
                              <option value="Return Rejected">Return Rejected</option>
                            </select>
                            <p className="text-[11px] text-gray-500 font-semibold mt-2 text-center">
                              Ordered on - {" "}
                              <span className="font-semibold text-gray-700">
                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </p>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={trackingInputs[order._id] || ""}
                                onChange={(e) => handleTrackingChange(order._id, e.target.value)}
                                className="text-xs border-2 border-gray-300 rounded-lg px-2 py-1.5 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter Tracking ID"
                              />
                              <button
                                onClick={() => handleUpdateSingleTracking(order._id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition duration-200 flex-shrink-0"
                                title="Update Tracking ID"
                              >
                                <SendIcon style={{ fontSize: 18 }} />
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => previewInvoice(order)}
                                className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-lg transition duration-200"
                                title="Preview Invoice"
                              >
                                <VisibilityIcon style={{ fontSize: 18 }} />
                              </button>
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-lg transition duration-200"
                                title="Download Invoice"
                              >
                                <DownloadIcon style={{ fontSize: 18 }} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expandedRows[order._id] && (
                          <tr className="bg-blue-50">
                            <td colSpan="5" className="px-3 py-3">
                              <div className="ml-6 bg-white rounded-lg p-3 border-l-4 border-blue-500">
                                <h4 className="text-xs font-semibold text-gray-700 mb-2">Order Items</h4>
                                <div className="space-y-1">
                                  {order.products && order.products.length > 0 ? (
                                    order.products.map((product, index) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center py-1.5 border-b last:border-b-0"
                                      >
                                        <div className="flex-1">
                                          <p className="text-xs font-medium text-gray-900">
                                            {product.title || "Untitled Book"}
                                          </p>
                                          <p className="text-xs text-gray-500">Qty: {product.quantity || 1}</p>
                                        </div>
                                        <div className="text-xs text-gray-600 ml-4">
                                          <span className="font-semibold">
                                            ₹{((product.price || 0) * (product.quantity || 1)).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-gray-500">No items in this order</p>
                                  )}
                                  {order.status === "Return Requested" && (
                                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                                      <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                                        🔁 Return Request Details
                                      </h4>

                                      <p className="text-sm text-gray-700 mb-2">
                                        <span className="font-semibold">Reason:</span>{" "}
                                        {order.returnReason || "No reason provided"}
                                      </p>

                                      {order.returnImage && (
                                        <div className="mb-2">
                                          <img
                                            src={order.returnImage}
                                            alt="Return proof"
                                            className="w-64 h-48 object-cover rounded-lg border border-gray-300"
                                          />
                                        </div>
                                      )}

                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleStatusChange(order._id, "Return Approved")}
                                          className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-800 hover:to-green-600 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                          Approve Return
                                        </button>
                                        <button
                                          onClick={() => handleStatusChange(order._id, "Return Rejected")}
                                          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                          Reject Return
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:hidden space-y-4 mt-4">
          {orders && orders.length > 0 ? orders.map((order) => {
            const totalQty = getTotalQuantity(order.products);
            return (
              <div key={order._id} className="bg-white rounded-lg overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase">Order ID</p>
                      <p className="text-sm font-mono text-gray-900 break-all mt-1">{order._id}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-gray-900">{order.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.email}</p>
                    {order.phone && <p className="text-sm text-gray-600">{order.phone}</p>}
                  </div>
                  <div className="border-t pt-3">
                    <button onClick={() => toggleRowExpansion(order._id)} className="flex items-center justify-between w-full text-left text-sm font-medium text-blue-600 hover:text-blue-800">
                      <span>{expandedRows[order._id] ? "Hide" : "View"} Items ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
                      <svg className={`w-5 h-5 transform transition-transform ${expandedRows[order._id] ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {expandedRows[order._id] && (
                      <div className="mt-3 bg-blue-50 rounded-lg p-3 space-y-2">{order.products && order.products.length > 0 ? order.products.map((product, index) => (<div key={index} className="flex justify-between items-start py-2 border-b last:border-b-0 border-blue-100"><div className="flex-1 pr-2"><p className="text-sm text-gray-900">{product.title || "Untitled Book"}</p><p className="text-xs text-gray-500">Qty: {product.quantity || 1} × ₹{(product.price || 0).toFixed(2)}</p></div><p className="text-sm font-semibold text-gray-900">₹{((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p></div>)) : <p className="text-sm text-gray-500">No items</p>}</div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 pt-2">
                    <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Status</label><select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`text-sm font-medium px-3 py-2 rounded-lg border-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}><option value="Pending">Pending</option><option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option></select></div>
                    <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Tracking ID</label>
                      <div className="flex gap-2">
                        <input type="text" value={trackingInputs[order._id] || ""} onChange={(e) => handleTrackingChange(order._id, e.target.value)} className="text-sm border-2 border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Tracking ID" />
                        <button onClick={() => handleUpdateSingleTracking(order._id)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200"><SendIcon style={{ fontSize: 18 }} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-lg font-bold text-gray-900">₹{order.totalPrice?.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => previewInvoice(order)} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition duration-200" title="Preview"><VisibilityIcon style={{ fontSize: 18 }} /></button>
                      <button onClick={() => downloadInvoice(order)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition duration-200" title="Download"><DownloadIcon style={{ fontSize: 18 }} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="bg-white rounded-lg p-8 text-center"><svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p className="mt-4 text-gray-600 font-medium">No orders available</p></div>
          )}
        </div>
      </div>
    </div >
  );
};

export default AdminOrderPage;
