import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

const savedCart = loadFromLocalStorage("cartItems", []);
const savedGift = loadFromLocalStorage("giftDetails", {
  to: "",
  from: "",
  message: "",
});

const initialState = {
  cartItems: savedCart,
  giftDetails: savedGift,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = { ...action.payload, qty: 1 };
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );

      if (existingItem) {
        if (existingItem.qty < newItem.stock) {
          existingItem.qty += 1;
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Increased quantity in cart",
            showConfirmButton: false,
            timer: 1500,
            toast: false,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Stock limit reached",
            showConfirmButton: false,
            timer: 1500,
            toast: false,
          });
        }
      } else {
        state.cartItems.push(newItem);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product Added to the Cart",
          showConfirmButton: false,
          timer: 1500,
          toast: false,
        });
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      saveToLocalStorage("cartItems", state.cartItems);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Product Removed from Cart",
        showConfirmButton: false,
        timer: 1500,
        toast: false,
      });
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },

    updateCartQty: (state, action) => {
      const { _id, type } = action.payload;
      const item = state.cartItems.find((p) => p._id === _id);

      if (item) {
        if (type === "increase" && item.qty < item.stock) {
          item.qty += 1;
        } else if (type === "decrease") {
          item.qty -= 1;
          if (item.qty <= 0) {
            state.cartItems = state.cartItems.filter((p) => p._id !== _id);
          }
        }
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    removeSoldOut: (state) => {
      const initialLength = state.cartItems.length;
      state.cartItems = state.cartItems.filter((item) => item.stock > 0);

      if (state.cartItems.length < initialLength) {
        saveToLocalStorage("cartItems", state.cartItems);
      }
    },

    updateCartStock: (state, action) => {
      const { bookId, newStock } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item._id === bookId ? { ...item, stock: newStock } : item
      );
      saveToLocalStorage("cartItems", state.cartItems);
    },

    updateCartProductDetails: (state, action) => {
      const { _id, stock, newPrice, oldPrice } = action.payload;
      const index = state.cartItems.findIndex((item) => item._id === _id);

      if (index !== -1) {
        state.cartItems[index].stock = stock;
        state.cartItems[index].newPrice = newPrice;
        state.cartItems[index].oldPrice = oldPrice;

        if (state.cartItems[index].qty > stock) {
          state.cartItems[index].qty = stock;
        }
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    saveGiftDetails: (state, action) => {
      state.giftDetails = {
        to: action.payload.to || "",
        from: action.payload.from || "",
        message: action.payload.message || "",
      };

      saveToLocalStorage("giftDetails", state.giftDetails);
    },

    updateGiftDetails: (state, action) => {

      state.giftDetails = {
        ...state.giftDetails,
        ...action.payload,
      };

      saveToLocalStorage("giftDetails", state.giftDetails);
    },

    clearGiftDetails: (state) => {
      state.giftDetails = {
        to: "",
        from: "",
        message: "",
      };

      localStorage.removeItem("giftDetails");
    },

    clearAll: (state) => {
      state.cartItems = [];
      state.giftDetails = {
        to: "",
        from: "",
        message: "",
      };

      localStorage.removeItem("cartItems");
      localStorage.removeItem("giftDetails");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateCartQty,
  removeSoldOut,
  updateCartStock,
  updateCartProductDetails,
  saveGiftDetails,
  updateGiftDetails,
  clearGiftDetails,
  clearAll,
} = cartSlice.actions;

export default cartSlice.reducer;
