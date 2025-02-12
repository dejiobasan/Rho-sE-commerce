
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import EmptyCartUI from "../Components/EmptyCartUI";
import CartItem from "../Components/CartItem";
import PeopleAlsoBought from "../Components/PeopleAlsoBought";


const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <motion.div
          className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI  />
            )  : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;




