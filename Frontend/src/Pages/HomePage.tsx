import  CategoryItem  from "../Components/CategoryItem"


const categories = [
  {href: "/Perfume", name: "Saviour", imageUrl: "../Perfume-Images/Perfume1.jpeg"},
  {href: "/Perfume", name: "Osma", imageUrl: "../Perfume-Images/Perfume2.jpeg"},
  {href: "/Perfume", name: "Imperial", imageUrl: "../Perfume-Images/Perfume3.jpeg"},
  {href: "/Perfume", name: "Emporior Armani", imageUrl: "../Perfume-Images/Perfume4.jpeg"},
  {href: "/Perfume", name: "Al-Faajir", imageUrl: "../Perfume-Images/Perfume5.jpeg"},
  {href: "/Perfume", name: "Oudh", imageUrl: "../Perfume-Images/Perfume6.jpeg"},
]


const HomePage = () => {
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
      </div>
    </div>
  )
}

export default HomePage