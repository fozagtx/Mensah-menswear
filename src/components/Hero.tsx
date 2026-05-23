import { getApiAssetUrl } from "../api";

interface HeroProps {
  imageUrl?: string | null;
}

export default function Hero({ imageUrl }: HeroProps) {
  const heroImageUrl = getApiAssetUrl(imageUrl);

  return (
    <section className="hero">
      {heroImageUrl && (
        <img
          className="hero-image"
          src={heroImageUrl}
          alt="Mensah collection"
        />
      )}
      <div className="hero-overlay" />
      <div className="container hero-content">
        <span className="hero-eyebrow">New Collection</span>
        <h1 className="hero-title">
          Where Tradition
          <br />
          Meets Precision
        </h1>
        <p className="hero-text">
          Curated menswear for the modern West African gentleman. 
          Tailored garments that command presence in every room.
        </p>
        <p className="hero-fomo">
          For only 500 cedis, step out as that classic gentleman before the next drop moves.
        </p>
        <div className="hero-actions">
          <a href="#shop" className="btn-primary">
            Shop Collection
          </a>
          <a href="#about" className="btn-link">
            Our Story →
          </a>
        </div>
      </div>
    </section>
  );
}
