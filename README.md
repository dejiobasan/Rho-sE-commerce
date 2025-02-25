# Rho's E-Commerce

Rho's E-Commerce is a full-stack e-commerce application built with React, Node.js, Express, and MongoDB. The application allows users to browse products, add them to the cart, apply coupons, and make payments using Flutterwave.

## Features

- User authentication and authorization
- Product listing and details
- Shopping cart management
- Coupon application and validation
- Payment processing with Flutterwave
- Order management and analytics

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS, Zustand, Axios, Framer Motion, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose
- Payment Gateway: Flutterwave

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Rho-sE-commerce.git
   cd Rho-sE-commerce

2. Install the dependencies for both frontend and backend   

 # Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install  

3. Set up environment variables:

Create a .env file in the Backend directory and add the following environment variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key

4. Start the development servers:

# Start the backend server
cd Backend
npm run dev

# Start the frontend server
cd ../Frontend
npm start

5. Open your browser and navigate to Host URL to view the application.

Project Structure

rho-e-commerce/
├── Backend/
│   ├── Controllers/
│   ├── Lib/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── .env
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── stores/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── Lib/
│   ├── .env
│   ├── package.json
│   └── ...
└── README.md


Usage
User Authentication:
 - Users can sign up and log in to the application.
 - Authentication is handled using JWT tokens.

Product Management: 
- Users can browse products and view product details.
- Products are fetched from the backend and displayed on the frontend.

Shopping Cart:
- Users can add products to the cart and update the quantity.
- The cart is managed using Zustand for state management.

Coupons: 
- Users can apply coupons to get discounts on their orders.
- Coupons are validated on the backend.

Payments: 
- Users can make payments using Flutterwave.
- Payment status is handled and displayed to the user.

Order Management: 
- Orders are saved in the database after successful payment.
- Users can view their order history.

Analytics: 
- Admins can view analytics data such as total users, total products, total sales, and total revenue.
- Daily sales data is displayed using Recharts.

Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


License
I do not have a License lol.