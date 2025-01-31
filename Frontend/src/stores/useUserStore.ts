import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  User: {
    name: string;
    email: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  User: {
    name: string;
  };
}

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (data: SignupData) => {
    set({ loading: true });

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post<SignupResponse>("/Users/signup", data);
      if (response.data.success) {
        set({ user: response.data.User, loading: false });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
    set({ loading: false });
  },

  login: async (data: LoginData) => {
    set({ loading: true });

    try {
      const response = await axios.post<LoginResponse>("/Users/login", data);
      if (response.data.success) {
        set({ user: response.data.User, loading: false });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
    set({ loading: false });
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/Profile/getProfile");
      if (response.data.success) {
        set({ user: response.data.User, checkingAuth: false });
      }
    } catch (error) {
        set({ checkingAuth: false, user: null });
      console.log(error);
    }
  },
}));
