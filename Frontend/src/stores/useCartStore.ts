import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { data } from "react-router-dom";

interface Cart {
  id: string;
}

interface cartStore {
  cart: Cart[];
  loading: boolean;
  getCartItems: () => Promise<void>;
}

export const useCartStore = create<cartStore>((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  loading: false,

  getCartItems: async () => {
    try {
      const response = await axios.get("/Carts/getCartProducts");
      set({ cart: response.data });
    } catch (error) {
      set({ cart: [] });
      console.error(error);
      toast.error("An error occurred");
      set({ loading: false });
    }
  },

  addToCart: async(product) => {
    try {
        
    } catch (error) {
        
    }
  }
}));
