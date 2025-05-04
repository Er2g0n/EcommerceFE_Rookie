import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Brands from "../pages/ProductClassification/Brands"
import Categories from "../pages/ProductClassification/Categories"
import UnitOfMeasures from "../pages/ProductClassification/UnitOfMeasures"

import Products from "../pages/ProductManagement/Products";
import Cart from "../pages/Cart";
import Login from "../pages/Admin/Login";

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      //  Product Classification
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
      // Image

      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
]);
