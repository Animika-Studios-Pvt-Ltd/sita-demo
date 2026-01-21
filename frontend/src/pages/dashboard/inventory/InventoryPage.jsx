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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading inventory...</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-24 px-4 md:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 md:p-8 mb-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-2">
                <FaBoxes className="text-white text-2xl" /> Inventory Management
              </h2>
              <p className="text-blue-100 text-lg">
                Total Books:{" "}
                <span className="font-semibold">
                  <CountUp
                    end={books.length}
                    duration={2}
                    separator=","
                  />
                </span>{" "}
                | Total Stock:{" "}
                <span className="font-semibold">
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
        <div className="hidden lg:block bg-white rounded-b-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Sl. No</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Book Title</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Author</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pricing</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update Stock</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-gray-500"><svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg><p className="mt-2 font-medium">No books found</p></td></tr>
                ) : (
                  books.map((book, index) => (
                    <tr key={book._id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-4 py-4 text-center"><span className="text-sm font-medium text-gray-700">{index + 1}</span></td>
                      <td className="px-4 py-4"><p className="text-sm font-medium text-gray-900">{book.title}</p></td>
                      <td className="px-4 py-4"><p className="text-sm text-gray-900">{book.author || "Unknown"}</p></td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          {book.oldPrice && book.oldPrice > book.newPrice ? (
                            <div><span className="line-through text-gray-400 text-xs">₹{book.oldPrice?.toFixed(2)}</span><p className="font-semibold text-gray-900">₹{book.newPrice?.toFixed(2)}</p></div>
                          ) : (
                            <p className="font-semibold text-gray-900">₹{book.newPrice?.toFixed(2)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4"><span className={`text-xs font-medium px-3 py-1.5 rounded-full border-2 inline-block ${getStockStatusColor(book.stock)}`}>{getStockStatusText(book.stock)} ({book.stock || 0})</span></td>
                      <td className="px-4 py-4"><input type="text" value={stockInputs[book._id] || ""} onChange={(e) => handleStockChange(book._id, e.target.value)} className="text-sm border-2 border-gray-300 rounded-lg px-3 py-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" /></td>
                      <td className="px-4 py-4 text-center"><button onClick={() => updateStock(book._id)} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">Update</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:hidden space-y-4 mt-4">
          {books.length > 0 ? books.map((book, index) => (
            <div key={book._id} className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{book.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{book.author || "Unknown Author"}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStockStatusColor(book.stock)}`}>{book.stock || 0}</span>
                </div>
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      {book.oldPrice && book.oldPrice > book.newPrice ? (
                        <div><span className="line-through text-gray-400 text-xs">₹{book.oldPrice?.toFixed(2)}</span><p className="font-semibold text-gray-900">₹{book.newPrice?.toFixed(2)}</p></div>
                      ) : (
                        <p className="font-semibold text-gray-900">₹{book.newPrice?.toFixed(2)}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border-2 ${getStockStatusColor(book.stock)}`}>{getStockStatusText(book.stock)}</span>
                  </div>
                  <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Update Stock</label><div className="flex gap-2"><input type="text" value={stockInputs[book._id] || ""} onChange={(e) => handleStockChange(book._id, e.target.value)} className="text-sm border-2 border-gray-300 rounded-lg px-3 py-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" /><button onClick={() => updateStock(book._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">Update</button></div></div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-lg p-8 text-center"><svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg><p className="mt-4 text-gray-600 font-medium">No books available</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
