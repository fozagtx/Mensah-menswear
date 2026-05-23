import { useEffect, useState } from "react";
import { getApiAssetUrl, type ItemResponse } from "../api";

interface ProductGridProps {
  items: ItemResponse[];
  preferredOccasion?: OccasionFilter;
  onSelect: (item: ItemResponse) => void;
  onAddToCart: (item: ItemResponse) => void;
}

type PriceFilter = "all" | "under1000" | "1000to2000" | "over2000";
export type OccasionFilter = "all" | "beach" | "summer" | "party" | "programs" | "afropop";

const occasionOptions: { value: OccasionFilter; label: string }[] = [
  { value: "all", label: "All styles" },
  { value: "beach", label: "Beach outing" },
  { value: "summer", label: "Summer dresses" },
  { value: "party", label: "Party dresses" },
  { value: "programs", label: "Programs" },
  { value: "afropop", label: "Afro pop" },
];

const itemOccasions: Record<string, string[]> = {
  "outfit-1": ["summer", "party", "afropop", "weekend", "light occasion"],
  "outfit-2": ["party", "programs", "formal", "evening", "occasion"],
  "outfit-3": ["beach", "summer", "outing", "resort"],
  "outfit-4": ["party", "programs", "ceremony", "statement", "evening"],
  "outfit-5": ["summer", "afropop", "daily", "visit", "smart casual"],
  "outfit-6": ["beach", "outing", "travel", "summer"],
  "outfit-7": ["party", "afropop", "dinner", "event", "polished"],
  "outfit-8": ["beach", "summer", "weekend", "relaxed"],
  "outfit-9": ["party", "programs", "ceremony", "evening", "tailored"],
  "outfit-10": ["summer", "afropop", "casual", "daily", "outing"],
};

function getOccasionTags(item: ItemResponse): string[] {
  const configured = itemOccasions[item.id] ?? [];
  return [
    ...configured,
    "fashion",
    "dress",
    "dresses",
    "outfit",
    item.name,
    item.description ?? "",
  ].filter(Boolean);
}

export default function ProductGrid({
  items,
  preferredOccasion = "all",
  onSelect,
  onAddToCart,
}: ProductGridProps) {
  const [filter, setFilter] = useState<PriceFilter>("all");
  const [occasion, setOccasion] = useState<OccasionFilter>(preferredOccasion);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOccasion(preferredOccasion);
  }, [preferredOccasion]);

  const filtered = items.filter((item) => {
    const ghs = item.price_minor / 100;
    const matchesPrice = (() => {
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
    })();

    const tags = getOccasionTags(item).map((tag) => tag.toLowerCase());
    const searchText = [
      item.name,
      item.description,
      item.currency,
      ...tags,
      `ghs ${ghs}`,
      `${ghs}`,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || searchText.includes(normalizedQuery);
    const matchesOccasion = occasion === "all" || tags.includes(occasion);

    return matchesPrice && matchesOccasion && matchesQuery;
  });

  return (
    <div className="product-grid-wrapper">
      <div className="style-library-search">
        <div>
          <span className="section-kicker">Style Library</span>
          <h3>Find the right look</h3>
        </div>
        <label className="style-search-field">
          <span>Search occasion</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search beach outing, summer dresses, party dresses..."
          />
        </label>
      </div>

      <div className="filter-bar occasion-filter-bar" aria-label="Occasion filters">
        {occasionOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-btn ${occasion === option.value ? "active" : ""}`}
            onClick={() => setOccasion(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
          type="button"
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "under1000" ? "active" : ""}`}
          onClick={() => setFilter("under1000")}
          type="button"
        >
          Under GHS 1,000
        </button>
        <button
          className={`filter-btn ${filter === "1000to2000" ? "active" : ""}`}
          onClick={() => setFilter("1000to2000")}
          type="button"
        >
          GHS 1,000 – 2,000
        </button>
        <button
          className={`filter-btn ${filter === "over2000" ? "active" : ""}`}
          onClick={() => setFilter("over2000")}
          type="button"
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
              <div className="product-tags">
                {getOccasionTags(item).slice(0, 2).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
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
        <p className="empty-state">No outfits found for this search.</p>
      )}
    </div>
  );
}
