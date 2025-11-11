import { useEffect, useState } from "react";
import "./Recommendations.css";

const Recommendations = () => {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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
          <div key={item.id} className="recommend-card">
            <img
              src={item.imageUrl || "/placeholder.png"}
              alt={item.title}
              className="recommend-img"
              onClick={() => setSelectedImage(item.imageUrl)} // open image instead of navigating
            />
            <p className="recommend-name">{item.title}</p> {/* title stays */}
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="modal-image" />
        </div>
      )}
    </section>
  );
};

export default Recommendations;
