import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/orders/${orderId}/items`);
        setOrder(res.data);
        console.log(res.data);
        setOrderItems(res.data.order_items);
      } catch (err) {
        setError("Could not fetch order details");
      } finally {
        setIsFetching(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);
  if (isFetching)
    return (
      <div className="OrderDetails">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="OrderDetails">
        <p>{error}</p>
      </div>
    );
  if (!order) return null;

  return (
    <div className="OrderDetails">
      <Link to="/past-orders" className="back-link">
        ← Back to Past Orders
      </Link>
      <h2>Order #{order.order_id} Details</h2>
      <p>
        <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <div className="order-items-table-container">
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.order_item_id}>
                <td>{item.product?.name || item.product_id}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-total">
        <strong>Total Cost: </strong>${order.total_price}
      </div>
    </div>
  );
};

export default OrderDetails;
