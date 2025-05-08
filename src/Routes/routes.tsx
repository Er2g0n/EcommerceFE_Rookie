import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Brands from "../pages/ProductClassification/Brands";
import Categories from "../pages/ProductClassification/Categories";
import UnitOfMeasures from "../pages/ProductClassification/UnitOfMeasures";
import Products from "../pages/ProductManagement/Products";
import Cart from "../pages/Cart";
import Login from "../pages/Admin/Login";
import Users from "../pages/Admin/User";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />, // Default route goes to login
  },
  {
    path: "/",
    element: <MainLayout />, // MainLayout wraps admin pages with Sidebar
    children: [
     
      {
        path: "home", // Maps to /home
        element: <Home />,
      },
        // User Display
        {
        path: "users",
        element: <Users />, // Placeholder for User Display page
      },
      // Product Classification
      // Brand
      {
        path: "brands",
        element: <Brands />,
      },
      // Category
      {
        path: "categories",
        element: <Categories />,
      },
      // UnitOfMeasure
      {
        path: "unitOfMeasures",
        element: <UnitOfMeasures />,
      },
      // Product Management
      // Product
      {
        path: "products",
        element: <Products />,
      },




      // Cart
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>, // Fallback for undefined routes
  },
]);