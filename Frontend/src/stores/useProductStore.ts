import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;// URL
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

  deleteproduct: async () => {

  },

  toggleFeaturedProduct: async () => { 

  }
}));
