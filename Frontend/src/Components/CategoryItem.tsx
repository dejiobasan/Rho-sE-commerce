import { Link } from "react-router-dom";
import { FC } from "react";



interface CategoryItemProps {
    category: {
        href: string;
        name: string;
        imageUrl: string;   
    }
}

const CategoryItem: FC<CategoryItemProps> = ({category}) => {
  return (
    <div className="relative overflow-hidden h-96 w-full rounded-lg group">
      <Link to={"/category" + category.href}>
        <div className="w-full h-full cursor-pointer">
          <div className="absolute inset-o bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-black text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-900 text-sm"> Explore {category.name}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
