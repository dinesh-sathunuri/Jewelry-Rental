import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import AddAdmin from "./Pages/AddAdmin";
import Home from "./Pages/Home";
import AddOrder from "./Pages/AddOrder";
import ProductsPage from "./Pages/ProductsPage";
import AllOrders from "./Pages/AllOrders";
import PrivateRoute from "./context/PrivateRoute";
import NotFound from "./Pages/NotFound";

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home visible={true} />}/>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/add-product" element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          } />
          <Route path="/edit-product/:id" element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          } />
          <Route path="/add-admin" element={
            <PrivateRoute>
              <AddAdmin />
            </PrivateRoute>
          } />
          <Route path="/add-order" element={
            <PrivateRoute>
              <AddOrder />
            </PrivateRoute>
          } />
          <Route path="/all-orders" element={
            <PrivateRoute>
              <AllOrders />
            </PrivateRoute>
          } />
          <Route path="/" element={<Home visible={true} />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;