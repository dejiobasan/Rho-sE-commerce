import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

//An Product interface that defines the shape of a product object
interface Product {
  _id: string;
  Name: string;
  Description: string;
  Price: number;
  Category: string;
  Image: string; // URL
  isFeatured: boolean;
}
//A productData interface that defines the shape of the data needed to create a product
interface productData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

//A productStore interface that defines the shape of the store
interface productStore {
  products: Product[];
  loading: boolean;
  createProduct: (data: productData) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<productStore>((set) => ({
  products: [],
  loading: false,

  setProducts: (products: Product[]) => set({ products }),

  //A createProduct state function that sends a POST request to the server to create a product
  createProduct: async (data: productData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/Products/createProduct", data);
      set((prevState) => ({
        products: [...prevState.products, response.data],
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
      set({ loading: false });
    }
  },

  //A fetchAllProducts state function that sends a GET request to the server to fetch all products
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/Products/getAllProducts");
      set({ products: response.data.Products, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured");
    }
  },

  //A fetchProductsByCategory state function that sends a GET request to the server to fetch products by category
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/Products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured");
    }
  },

  //A deleteProduct state function that sends a DELETE request to the server to delete a product
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/Products/deleteProduct/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured");
    }
  },

  //A toggleFeaturedProduct state function that sends a PATCH request to the server to toggle the featured status of a product
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(
        `/Products/toggleFeaturedProduct/${productId}`
      );
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured");
    }
  },

  //A fetchFeaturedProducts state function that sends a GET request to the server to fetch featured products
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/Products/getFeaturedProducts");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
