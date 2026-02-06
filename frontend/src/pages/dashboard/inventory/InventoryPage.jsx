import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import getBaseUrl from "../../../utils/baseURL";
import { updateCartStock } from "../../../redux/features/cart/cartSlice";
import { FaBoxes } from "react-icons/fa";
import CountUp from "react-countup";

const InventoryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockInputs, setStockInputs] = useState({});
  const dispatch = useDispatch();
  const glassPanel = "bg-white/70 backdrop-blur-xl border border-white/70 ring-1 ring-black/5 rounded-2xl shadow-sm";
  const glassHeader = `${glassPanel} p-6 md:p-8 mb-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]`;
  const glassTableHead = "bg-gradient-to-br from-[#7A1F2B]/10 via-white/90 to-white/80 text-slate-500 uppercase text-xs font-semibold border border-white/70";
  const glassInput = "bg-white/80 border border-white/70 ring-1 ring-black/5 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/30 focus:border-[#7A1F2B]/40";
  const glassButton = "px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border-1 border-[#7A1F2B] ring-1 ring-black/5 text-[#7A1F2B] hover:bg-white/90 transition-colors duration-200 font-medium shadow-sm";

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/api/books`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(res.data);
      const initialStock = {};
      res.data.forEach((book) => { initialStock[book._id] = book.stock || 1; });
      setStockInputs(initialStock);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch books", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    const interval = setInterval(() => { fetchBooks(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStockChange = (bookId, value) => {
    if (/^\d*$/.test(value)) setStockInputs((prev) => ({ ...prev, [bookId]: value }));
  };

  const updateStock = async (bookId) => {
    try {
      const newStock = parseInt(stockInputs[bookId], 10);
      if (isNaN(newStock)) {
        Swal.fire("Error", "Stock must be a number", "error");
        return;
      }
      await axios.put(`${getBaseUrl()}/api/books/edit/${bookId}`, { stock: newStock }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(updateCartStock({ bookId, newStock }));
      Swal.fire("Success", "Stock updated successfully", "success");
      fetchBooks();
    } catch (error) {
      console.error("Error updating stock:", error);
      if (error.response && error.response.status === 403) {
        Swal.fire("Forbidden", "You do not have permission to update stock", "error");
      } else {
        Swal.fire("Error", "Failed to update stock", "error");
      }
    }
  };

  const getStockStatusColor = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-800 border-red-200";
    if (stock <= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStockStatusText = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-montserrat">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-[#7A1F2B]/30 border-t-[#7A1F2B]"></div>
        <p className="mt-4 text-slate-600">Loading inventory...</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-[40px] px-4 md:px-8 font-montserrat">
      <div className="max-w-8xl mx-auto">
        <div className={glassHeader}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B]">
                  <FaBoxes className="text-xl" />
                </span>
                Inventory Management
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Total Books:{" "}
                <span className="font-semibold text-[#7A1F2B]">
                  <CountUp
                    end={books.length}
                    duration={2}
                    separator=","
                  />
                </span>{" "}
                | Total Stock:{" "}
                <span className="font-semibold text-[#7A1F2B]">
                  <CountUp
                    end={books.reduce((sum, book) => sum + (book.stock || 0), 0)}
                    duration={2.5}
                    separator=","
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className={`hidden lg:block ${glassPanel} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className={glassTableHead}>
                <tr>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Book Title</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Author</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Pricing</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock Status</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Update Stock</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {books.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-slate-500"><svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg><p className="mt-2 font-medium">No books found</p></td></tr>
                ) : (
                  books.map((book, index) => (
                    <tr key={book._id} className="border-b border-slate-200/70 hover:bg-white/60 transition duration-150">
                      <td className="px-4 py-4 text-center"><span className="text-sm font-medium text-slate-600">{index + 1}</span></td>
                      <td className="px-4 py-4 text-center"><p className="text-sm font-medium text-slate-900">{book.title}</p></td>
                      <td className="px-4 py-4 text-center"><p className="text-sm text-slate-700">{book.author || "Unknown"}</p></td>
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm text-center">
                          {book.oldPrice && book.oldPrice > book.newPrice ? (
                            <div><span className="line-through text-slate-400 text-xs">${book.oldPrice?.toFixed(2)}</span><p className="font-semibold text-slate-900">${book.newPrice?.toFixed(2)}</p></div>
                          ) : (
                            <p className="font-semibold text-slate-900">${book.newPrice?.toFixed(2)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center"><span className={`text-xs font-medium px-3 py-1.5 rounded-full border-2 inline-block ${getStockStatusColor(book.stock)}`}>{getStockStatusText(book.stock)} ({book.stock || 0})</span></td>
                      <td className="px-4 py-4 text-center"><input type="text" value={stockInputs[book._id] || ""} onChange={(e) => handleStockChange(book._id, e.target.value)} className={`${glassInput} w-24 text-center`} placeholder="0" /></td>
                      <td className="px-4 py-4 text-center"><button onClick={() => updateStock(book._id)} className={glassButton}>Update</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:hidden space-y-4 mt-4">
          {books.length > 0 ? books.map((book, index) => (
            <div key={book._id} className={glassPanel}>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-slate-500">#{index + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{book.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{book.author || "Unknown Author"}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStockStatusColor(book.stock)}`}>{book.stock || 0}</span>
                </div>
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/60">
                  <div className="flex items-center justify-between">
                    <div>
                      {book.oldPrice && book.oldPrice > book.newPrice ? (
                        <div><span className="line-through text-slate-400 text-xs">${book.oldPrice?.toFixed(2)}</span><p className="font-semibold text-slate-900">${book.newPrice?.toFixed(2)}</p></div>
                      ) : (
                        <p className="font-semibold text-slate-900">${book.newPrice?.toFixed(2)}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border-2 ${getStockStatusColor(book.stock)}`}>{getStockStatusText(book.stock)}</span>
                  </div>
                  <div><label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Update Stock</label><div className="flex gap-2"><input type="text" value={stockInputs[book._id] || ""} onChange={(e) => handleStockChange(book._id, e.target.value)} className={`${glassInput} w-24 text-center`} placeholder="0" /><button onClick={() => updateStock(book._id)} className={`flex-1 ${glassButton}`}>Update</button></div></div>
                </div>
              </div>
            </div>
          )) : (
            <div className={`${glassPanel} p-8 text-center`}><svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg><p className="mt-4 text-slate-600 font-medium">No books available</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

