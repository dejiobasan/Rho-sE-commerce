import  CategoryItem  from "../Components/CategoryItem"
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../Components/FeaturedProducts";
import { useEffect } from "react";




const categories = [
  {href: "/Perfume", name: "Saviour", imageUrl: "../Perfume-Images/Perfume1.jpeg"},
  {href: "/Perfume", name: "Osma", imageUrl: "../Perfume-Images/Perfume2.jpeg"},
  {href: "/Clothes", name: "Denim Jacket", imageUrl: "../Clothes-Images/Clothes.jpeg"},
  {href: "/Spray", name: "Right Guard", imageUrl: "../Spray-Images/Spray.jpeg"},
  {href: "/Shoe", name: "Travis Nike Air", imageUrl: "../Shoe-Images/Shoe.jpeg"},
  {href: "/Jewelry", name: "Black Ring", imageUrl: "../Jewelry-Images/ring.jpeg"},
]


const HomePage = () => {
  const { fetchFeaturedProducts, products } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);


  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm-text-6xl font-bold
         text-emerald-400 mb-4">Welcome to Rho's Essence</h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          We sell the best perfumes in the market. Our perfumes are made from the best ingredients and are long lasting.
        </p>
        <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryItem
            category={category}
            key={category.name} 
            />
          ))}
        </div>
        {products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>
    </div>
  )
}

export default HomePage