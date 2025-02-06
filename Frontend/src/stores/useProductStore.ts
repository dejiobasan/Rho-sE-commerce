import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface Product {
    _id: string;
    Name: string;
    Description: string;
    Price: string;
    Category: string;
    Image: string;// URL
    isFeatured: boolean;
}

interface productData {
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;
}

interface productStore {
  products: Product[];
  loading: boolean;
  createProduct: (data: productData) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeaturedProduct: (productId: string) => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
}


export const useProductStore = create<productStore>((set) => ({
  products: [],
  loading: false,

  setProducts: (products: Product[]) => set({ products }),

  createProduct: async (data: productData) => {
    set ({ loading: true });
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

  fetchAllProducts: async () => {
    set({loading: true});
    try {
        const response = await axios.get("/Products/getAllProducts");
        set({ products: response.data.Products, loading: false})
    } catch (error) {
        set({ loading: false });
        console.error(error);
        toast.error("An error occured");
    }
  },

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

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
        await axios.delete(`/Products/deleteProduct/${productId}`)
        set((prevState) => ({
            products: prevState.products.filter((product) => product._id !== productId),
            loading: false,
        }))
    } catch (error) {
        set({ loading: false});
        console.error(error);
        toast.error("An error occured");
    }
  },

  toggleFeaturedProduct: async (productId) => { 
    set({ loading: true})
    try {
        const response = await axios.patch(`/Products/toggleFeaturedProduct/${productId}`)
        set((prevProducts) => ({
            products: prevProducts.products.map((product) => 
                product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
            ),
            loading: false,
        }))
    } catch (error) {
        set({ loading: false });
        console.error(error);
        toast.error("An error occured");
    }
  },
}));
