import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../NotFound/NotFound";
import { formatPrice } from "../../utils/format";
import "./ProductDetail.css";

function ProductDetail({ addToCart, removeFromCart, getQuantityOfItemInCart }) {
  
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);


  if (error) {
    return <NotFound />;
  }

  if (isFetching || !product) {
    return <h1>Loading...</h1>;
  }

  const quantity = getQuantityOfItemInCart(product);

  const handleAddToCart = () => {
    if (product.id) {
      addToCart(product)
    }
  };

  const handleRemoveFromCart = () => {
    if (product.id) {
      removeFromCart(product);
    }
  };

  useEffect(() => {
    console.log("fetching or not? tf");
    const fetchProductDetails = async () => {
      // setProduct(null)
      // setIsFetching(true); these 2 lines totally messed up my product rendering, ensure to delete
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(res.data);
        console.log(res.data);
      } catch (err) {
        setError("Could not fetch product details, sorry :( ");
      } finally {
        setIsFetching(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  return (
    <div className="ProductDetail">
      <div className="product-card">
        <div className="media">
          <img
            src={product.image_url || "/assets/codepath.svg"}
            alt={product.name}
          />
        </div>
        <div className="product-info">
          <p className="product-name">{product.name}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>
          <div className="actions">
            <button onClick={handleAddToCart}>Add to Cart</button>
            {quantity > 0 && (
              <button onClick={handleRemoveFromCart}>Remove from Cart</button>
            )}
            {quantity > 0 && (
              <span className="quantity">Quantity: {quantity}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default ProductDetail;