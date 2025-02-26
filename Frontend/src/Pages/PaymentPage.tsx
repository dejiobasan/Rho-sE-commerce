import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";



const PaymentPage = () => {
  const location = useLocation();
  const { amount } = location.state || { amount: 0 };
  const { user } = useUserStore();
  const navigate = useNavigate();
  const {  cart } = useCartStore();

  interface Customer {
    email: string;
    name: string;
  }

  interface Customizations {
    title: string;
    description: string;
    logo: string;
  }

  interface Config {
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: Customer;
    customizations: Customizations;
  }

  interface FWConfig extends Config {
    text: string;
    callback: (response: Record<string, unknown>) => void;
    onClose: () => void;
  }

  const config = {
    public_key: "", //Input your Flutterwave public key here.
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user?.Email || "",
      name: user?.Name || "",
    },
    customizations: {
      title: "Rho's Essence and More.",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const fwConfig: FWConfig = {
    ...config,
    text: "Pay with Flutterwave!",
    callback: async (response) => {
      if (response.status !== "completed") {
        console.log("Transaction was not completed!");
      } else {
        try {
          await axios.post("/Payments/checkout-success", {
            products: cart.map((product) => ({
              id: product._id,
              quantity: product.quantity,
              Price: product.Price,
            })),
            totalAmount: amount,
            flutterSessionId: response.transaction_id,
          });
          navigate("/purchase-success");
        } catch (error) {
          console.error("Error saving order:", error);
        }
        console.log("Transaction was successful!");
      };
      closePaymentModal();// this will close the modal programmatically
    },
    onClose: () => {
      navigate("/purchase-cancel");
      console.log("Transaction was closed!");
    },
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1
          className="text-center text-5xl sm:text-6xl font-bold
         text-emerald-400 mb-4"
        >
          Make payment with Flutterwave
        </h1>
        <div className="flex justify-center">
          <FlutterWaveButton
            {...fwConfig}
            className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 
            text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 
            focus:ring-emerald-300"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
