import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";


const categories = ["Perfume", "Spray", "Shoe", "Clothes", "Jewelry"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });


  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({name: "", description: "", price: "", category: "", image: ""});
    } catch (error) {
      console.error("Product creation failed", error);
    }
  };

  const HandleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setNewProduct({ ...newProduct, [e.target.id]: e.target.value });
  };

  const HandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewProduct({ ...newProduct, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl text-emerald-300 font-semibold mb-6">
        Create a new product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={newProduct.name}
            onChange={HandleChange}
            className="mt-1 block w-full bg-gray-700 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={HandleChange}
            rows={3}
            className="mt-1 block w-full bg-gray-700 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={newProduct.price}
            onChange={HandleChange}
            className="mt-1 block w-full bg-gray-700 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={HandleChange}
            className="mt-1 block w-full bg-gray-700 rounded-md shadow-sm py-2 px-3
          text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center">
          <input type="file" id="image" className="sr-only" accept="image/*" 
          onChange={HandleImageChange} />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600
          rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && <span className="ml-3 text-sm text-gray-400">Image Uploaded</span>}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
        text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none
        focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="h-5 w-5 mr-2 animate-spin"
                aria-hidden="true"
              />
              Loading
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
