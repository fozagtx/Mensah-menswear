import { useState } from "react";
import { getApiAssetUrl, type ItemResponse } from "../api";

interface ProductGridProps {
  items: ItemResponse[];
  onSelect: (item: ItemResponse) => void;
  onAddToCart: (item: ItemResponse) => void;
}

export default function ProductGrid({ items, onSelect, onAddToCart }: ProductGridProps) {
  const [filter, setFilter] = useState<"all" | "under1000" | "1000to2000" | "over2000">("all");

  const filtered = items.filter((item) => {
    const ghs = item.price_minor / 100;
    switch (filter) {
      case "under1000":
        return ghs < 1000;
      case "1000to2000":
        return ghs >= 1000 && ghs <= 2000;
      case "over2000":
        return ghs > 2000;
      default:
        return true;
    }
  });

  return (
    <div className="product-grid-wrapper">
      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "under1000" ? "active" : ""}`}
          onClick={() => setFilter("under1000")}
        >
          Under GHS 1,000
        </button>
        <button
          className={`filter-btn ${filter === "1000to2000" ? "active" : ""}`}
          onClick={() => setFilter("1000to2000")}
        >
          GHS 1,000 – 2,000
        </button>
        <button
          className={`filter-btn ${filter === "over2000" ? "active" : ""}`}
          onClick={() => setFilter("over2000")}
        >
          Over GHS 2,000
        </button>
      </div>

      <div className="product-grid">
        {filtered.map((item) => (
          <article key={item.id} className="product-card">
            <button
              className="product-card-media"
              onClick={() => onSelect(item)}
            >
              {getApiAssetUrl(item.image_urls?.[0]) ? (
                <img
                  src={getApiAssetUrl(item.image_urls?.[0]) ?? ""}
                  alt={item.name}
                  loading="lazy"
                />
              ) : (
                <div className="img-placeholder" />
              )}
              <div className="product-card-overlay">
                <span>Quick View</span>
              </div>
            </button>
            <div className="product-card-body">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-price">
                GHS {(item.price_minor / 100).toFixed(2)}
              </p>
              <button
                className="btn-primary btn-full"
                onClick={() => onAddToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="empty-state">No items found in this range.</p>
      )}
    </div>
  );
}
