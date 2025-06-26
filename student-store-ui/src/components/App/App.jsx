import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import PastOrders from "../PastOrders/PastOrders";
import OrderDetails from "../OrderDetails/OrderDetails";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import { calculateTotal } from "../../utils/calculations";
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart"; //i need to use these somehow in handling checkout
import "./App.css";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ customer_id: "", email: ""});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [pastOrder, setPastOrder] = useState(null);
  const [order, setOrder] = useState(null);

  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  /// complete handle checkout, this is where i set setischecking out bc 
  // i think thats the only state declared and not used in this file yet. 
  // refer to the slides
  const handleOnCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);

    //customer_id: input validashunnn
    const customerId = Number(userInfo.customer_id);
    if (
      !userInfo.customer_id ||
      isNaN(customerId) ||
      !Number.isInteger(customerId)
    ) {
      setError("Please enter a valid numeric Student ID.");
      setIsCheckingOut(false);
      return;
    }

    const cartItems = Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === Number(productId));
      return {
        product_id: Number(productId),
        quantity,
        price: product?.price || 0,
      };
    });

    //i think the backend takes care of the calculation already, but to be safe
    const subTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const totalWithTaxes = calculateTotal(subTotal); 
    const total_price = Number(totalWithTaxes.toFixed(2)); 

    //creating the order
    try {
      console.log({ customerId, total_price });
      const orderRes = await axios.post("http://localhost:5000/orders", {
        customer_id: customerId,
        total_price,
        status: "created",
      });
      const order = orderRes.data;
      console.log(orderRes.data); //debugging
      const order_id = order.order_id;

      //creating order itemss
      await axios.post(
        `http://localhost:5000/orders/${order_id}/items`,
        cartItems
      );

      setOrder(order);
      setCart({});
    } catch (err) {
      setError("Could not place order");
    } finally {
      setIsCheckingOut(false);
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/products`);
        setProducts(res.data);
      } catch (err) {
        setError("Could not fetch products");
      } finally {
        setIsFetching(false);
      }
    };
    fetchProducts();
  }, []); 

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route 
            path="/past-orders" 
            element={<PastOrders />} 
            />

            <Route 
            path="/past-orders/:orderId" 
            element={<OrderDetails 
            />} />

            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
 