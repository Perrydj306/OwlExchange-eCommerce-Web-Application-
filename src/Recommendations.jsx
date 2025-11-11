import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recommendations.css";

const Recommendations = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data.slice(0, 8))) 
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  return (
    <section className="recommend-container">
      <h2 className="recommend-title">You Might Like It</h2>

      <div className="recommend-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="recommend-card"
            onClick={() => navigate(`/item/${item.id}`)}
          >
            <img
              src={item.imageUrl || "/placeholder.png"}
              alt={item.title}
              className="recommend-img"
            />
            <p className="recommend-name">{item.title}</p>
          </div>
        ))}
      </div>

      <button className="explore-btn" onClick={() => navigate("/search")}>
        Explore More
      </button>
    </section>
  );
};

export default Recommendations;
