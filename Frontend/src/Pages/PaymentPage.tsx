import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { Navigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const { amount } = location.state || { amount: 0 };
  const { user } = useUserStore();

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
    public_key: "FLWPUBK_TEST-8657a5e179ef8883cff0ae5a4de30180-X",
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
    callback: (response) => {
      console.log(response);
      closePaymentModal();
      <Navigate to="/purchase-success" /> // this will close the modal programmatically
    },
    onClose: () => {<Navigate to="/purchase-cancel" />},
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
