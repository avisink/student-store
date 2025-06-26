import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PastOrders.css";

const PastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/orders`);
        setOrders(res.data);
      } catch (err) {
        setError("Could not fetch past orders");
      } finally {
        setIsFetching(false);
      }
    };
    fetchAllOrders();
  }, []);

  const columns = ["Date", "Order ID", "Total Cost", "Status"];

  return (
    <div className="PastOrders">
      <h2>Past Orders</h2>
      {isFetching && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!orders.length && !isFetching && !error ? (
        <div className="row">
          <p>No past orders available. Go to the home page to buy stuff!</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="order-row"
                  onClick={() => navigate(`/past-orders/${order.order_id}`)}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.order_id}</td>
                  <td>${order.total_price}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PastOrders;
