import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Interface for Cart items
interface Cart {
  _id: string;
  Name: string;
  Description: string;
  quantity: number;
  Price: number;
  Image: string;
}

// Interface for Coupon details
interface Coupon {
  code: string;
  discountPercentage: number;
}

// Interface for Product details
interface Product {
  _id: string;
  Price: number;
  Image: string;
  Name: string;
  Description: string;
}

// Interface for the Zustand store
interface cartStore {
  cart: Cart[]; // Array of cart items
  coupon: Coupon | null; // Applied coupon details
  product: Product[]; // Array of products
  loading: boolean; // Loading state
  total: number; // Total amount after discount
  subtotal: number; // Subtotal amount before discount
  isCouponApplied: boolean; // Flag to check if coupon is applied
  getMyCoupon: () => Promise<void>; // Function to fetch user's coupon
  getCartItems: () => Promise<void>; // Function to fetch cart items
  clearCart: () => Promise<void>; // Function to clear the cart
  addToCart: (product: Product) => Promise<void>; // Function to add a product to the cart
  calculateTotalAmount: () => Promise<void>; // Function to calculate total amount
  updateQuantity: (productId: string, quantity: number) => Promise<void>; // Function to update product quantity in the cart
  removeFromCart: (productId: string) => Promise<void>; // Function to remove a product from the cart
  applyCoupon: (code: string) => Promise<void>; // Function to apply a coupon
  removeCoupon: () => Promise<void>; // Function to remove the applied coupon
}

// Zustand store implementation
export const useCartStore = create<cartStore>((set, get) => ({
  cart: [], // Initial cart state
  product: [], // Initial product state
  coupon: null, // Initial coupon state
  loading: false, // Initial loading state
  total: 0, // Initial total amount
  subtotal: 0, // Initial subtotal amount
  isCouponApplied: false, // Initial coupon applied state

  // Function to fetch user's coupon
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/Coupon/getCoupon");
      set({ coupon: response.data });
    } catch (error) {
      console.error("error fetching coupon:", error);
    }
  },

  // Function to apply a coupon
  applyCoupon: async (code: string) => {
    try {
      const response = await axios.post("/Coupon/validateCoupon", { code });
      console.log(response.data);
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotalAmount();
      toast.success("Coupon applied successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to apply coupon");
    }
  },

  // Function to remove the applied coupon
  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotalAmount();
    toast.success("Coupon removed");
  },

  // Function to fetch cart items
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

  // Function to clear the cart
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },

  // Function to add a product to the cart
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

  // Function to calculate total amount
  calculateTotalAmount: async () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);
    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },

  // Function to remove a product from the cart
  removeFromCart: async (productId) => {
    await axios.delete("/Carts/removeAllFromCart", { data: { productId } });
    set((state) => ({ cart: state.cart.filter((item) => item._id !== productId) }));
    get().calculateTotalAmount();
  },

  // Function to update product quantity in the cart
  updateQuantity: async (productId, quantity) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/Carts/updateQuantity/${productId}`, { quantity });
      set({ cart: response.data, loading: false });
      get().calculateTotalAmount();
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating cart quantity", error);
      toast.error("Error updating cart quantity");
      set({ loading: false });
    }
  },
}));
