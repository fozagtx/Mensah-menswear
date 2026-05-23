import { getApiAssetUrl, type CampaignSummary, type ItemResponse } from "../api";

interface CampaignsProps {
  campaigns: CampaignSummary[];
  items: ItemResponse[];
}

export default function Campaigns({ campaigns, items }: CampaignsProps) {
  if (campaigns.length === 0) return null;

  return (
    <section id="campaigns" className="campaigns-section">
      <div className="container">
        <h2 className="section-title">Active Campaigns</h2>
        <div className="campaigns-grid">
          {campaigns.map((c) => (
            <div key={c.id} className="campaign-card">
              {getApiAssetUrl(c.image_urls?.[0]) && (
                <div className="campaign-image">
                  <img
                    src={getApiAssetUrl(c.image_urls?.[0]) ?? ""}
                    alt={c.title}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="campaign-body">
                <h3 className="campaign-title">{c.title}</h3>
                {c.copy_text && <p className="campaign-text">{c.copy_text}</p>}
                <a href="#shop" className="btn-link">
                  Shop Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
