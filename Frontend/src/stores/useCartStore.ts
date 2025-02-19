import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface Cart {
  _id: string;
  Name: string;
  Description: string;
  quantity: number;
  Price: number;
  Image: string;
}

interface Coupon {
  code: string;
  discountPercentage: number;
}

interface Product {
  _id: string;
  Price: number;
  Image: string;
  Name: string;
  Description: string;
}

interface cartStore {
  cart: Cart[];
  coupon: Coupon | null;
  product: Product[];
  loading: boolean;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
  getCartItems: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  calculateTotalAmount: () => number;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
}

export const useCartStore = create<cartStore>((set, get) => ({
  cart: [],
  product: [],
  coupon: null,
  loading: false,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/Carts/getCartProducts");
      set({ cart: response.data, loading: false });
      get().calculateTotalAmount();
    } catch (error) {
      console.error("Error fetching cart items", error);
      toast.error("Error fetching cart items");
      set({ loading: false });
    }
  },

  addToCart: async (product: Product) => {
    set({ loading: true });
    try {
      await axios.post("/Carts/addToCart", { productId: product._id });
      set((state) => ({
        cart: [...state.cart, { ...product, quantity: 1 }],
        loading: false,
      }));
      get().calculateTotalAmount();
      toast.success("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart", error);
      toast.error("Error adding product to cart");
      set({ loading: false });
    }
  },

  calculateTotalAmount: (): number => {
    const { cart, coupon } = get();
    const total = cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);
    set({ total });
    let subtotal = total;
    if (coupon) {
      subtotal = total - (total * coupon.discountPercentage) / 100;
      set({ subtotal });
    }
    return subtotal;
  },

  removeFromCart: async (productId) => {
    await axios.delete("/Carts/removeAllFromCart", {data: { productId }});
    set((state) => ({ cart: state.cart.filter((item) => item._id !== productId) }));
    get().calculateTotalAmount();
  },

  updateQuantity: async (productId, quantity) => {
    set ({ loading: true });
    try {
      const response = await axios.put(`/Carts/updateQuantity/${productId}`, { quantity });
      set({cart: response.data,loading: false});
      get().calculateTotalAmount();
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating cart quantity", error);
      toast.error("Error updating cart quantity");
      set({ loading: false });
    }
  }

}));
