import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

//An User interface that defines the shape of a user object
interface User {
  id: string;
  Name: string;
  Email: string;
  Role: string;
}

//A SignupData interface that defines the shape of the data needed to sign up a user
interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

//A SignupResponse interface that defines the shape of the response from the server when a user signs up
interface SignupResponse {
  success: boolean;
  message: string;
  User: {
    id: string;
    Name: string;
    Email: string;
    Role: string;
  };
}

//A LoginData interface that defines the shape of the data needed to log in a user
interface LoginData {
  email: string;
  password: string;
}

//A LoginResponse interface that defines the shape of the response from the server when a user logs in
interface LoginResponse {
  success: boolean;
  message: string;
  User: {
    id: string;
    Name: string;
    Email: string;
    Role: string;
  };
}

//A LogoutResponse interface that defines the shape of the response from the server when a user logs out
interface LogoutResponse {
  success: boolean;
  message: string;
}


//A UserStore interface that defines the shape of the store
interface UserStore {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// Create a store
export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  //A signup state function that takes in a SignupData object and sends a POST request to the server to create a new user
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

  //A login state function that takes in a LoginData object and sends a POST request to the server to log in a user
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

  //A logout state function that sends a POST request to the server to log out the user
  logout: async () => {
    try {
      const response = await axios.post<LogoutResponse>("/Users/logout");
      if (response.data.success) {
        set({ user: null });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  },

  //A checkAuth state function that sends a GET request to the server to check if the user is authenticated
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("Profile/getProfile", { withCredentials: true });
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.log(error);
    }
  },

  //A refreshToken state function that sends a POST request to the server to refresh the user's token
  refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/Users/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

let refreshPromise: Promise<void> | null = null;

// Add an interceptor to handle 401 errors
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
