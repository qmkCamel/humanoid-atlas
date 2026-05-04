import { companyFunding, topInvestors } from '../data';
import type { FundingStatus } from '../data';
import {
  getCountryFilterGroup,
  getFilteredFunding,
  getFundingSortedByRaised,
} from '../domain/atlasAnalytics';
import type { CountryGroup } from '../domain/atlasAnalytics';

interface FundingPageProps {
  fundingStatusFilter: 'all' | FundingStatus;
  countryFilter: CountryGroup;
  onFundingStatusFilterChange: (filter: 'all' | FundingStatus) => void;
  onSelectCompany: (id: string) => void;
}

function getFundingStatusLabel(s: FundingStatus) {
  switch (s) {
    case 'private': return 'Private';
    case 'public': return 'Public';
    case 'ipo-filed': return 'IPO Filed';
    case 'acquired': return 'Acquired';
    case 'subsidiary': return 'Subsidiary';
  }
}

function formatAmount(m: number) {
  if (m >= 1000000) return `$${(m / 1000000).toFixed(1)}T`;
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${Math.round(m)}M`;
}

export default function FundingPage({
  fundingStatusFilter,
  countryFilter,
  onFundingStatusFilterChange,
  onSelectCompany,
}: FundingPageProps) {
  const filteredFunding = getFilteredFunding(fundingStatusFilter);
  const fundingSortedByRaised = getFundingSortedByRaised(filteredFunding);
  const scaleMax = Math.max(
    ...filteredFunding.map((f) => f.totalRaisedM ?? 0),
    ...filteredFunding
      .filter((f) => (f.latestValuationM ?? 0) <= 100000)
      .map((f) => f.latestValuationM ?? 0),
  );
  const pct = (v: number) => Math.min((v / scaleMax) * 100, 99);

  return (
    <div className="geo-content">
      <section className="geo-section">
        <div className="supply-chain__header">
          <h3 className="section-title">Funding & Valuation</h3>
          <div className="vla-filters">
            <button className={`country-pill ${fundingStatusFilter === 'all' ? 'country-pill--active' : ''}`} onClick={() => onFundingStatusFilterChange('all')}>All</button>
            <button className={`country-pill ${fundingStatusFilter === 'private' ? 'country-pill--active' : ''}`} onClick={() => onFundingStatusFilterChange(fundingStatusFilter === 'private' ? 'all' : 'private')}>Private</button>
            <button className={`country-pill ${fundingStatusFilter === 'public' ? 'country-pill--active' : ''}`} onClick={() => onFundingStatusFilterChange(fundingStatusFilter === 'public' ? 'all' : 'public')}>Public</button>
            <button className={`country-pill ${fundingStatusFilter === 'subsidiary' ? 'country-pill--active' : ''}`} onClick={() => onFundingStatusFilterChange(fundingStatusFilter === 'subsidiary' ? 'all' : 'subsidiary')}>Subsidiary</button>
            <button className={`country-pill ${fundingStatusFilter === 'acquired' ? 'country-pill--active' : ''}`} onClick={() => onFundingStatusFilterChange(fundingStatusFilter === 'acquired' ? 'all' : 'acquired')}>Acquired</button>
          </div>
        </div>
        <div className="funding-list">
          {fundingSortedByRaised.map((f) => (
            <div
              key={f.companyId}
              className={`funding-row ${countryFilter && getCountryFilterGroup(f.country) !== countryFilter ? 'geo-dim' : ''}`}
              onClick={() => onSelectCompany(f.companyId)}
            >
              <span className="funding-row__country">{f.country}</span>
              <span className="funding-row__name">{f.name}</span>
              <span className="funding-row__status">{getFundingStatusLabel(f.status)}</span>
              <div className="funding-row__bars">
                {f.totalRaisedM != null && (
                  <div
                    className="funding-row__raised"
                    style={{ width: `${pct(f.totalRaisedM)}%` }}
                  />
                )}
                {f.latestValuationM != null && (
                  <div
                    className="funding-row__valuation"
                    style={{ left: `${pct(f.latestValuationM)}%` }}
                  />
                )}
              </div>
              <div className="funding-row__labels">
                {f.totalRaisedM != null && (
                  <span className="funding-row__raised-label">{formatAmount(f.totalRaisedM)} raised</span>
                )}
                {f.latestValuationM != null && (
                  <span className="funding-row__val-label">{formatAmount(f.latestValuationM)} val{f.latestValuationNote ? '*' : ''}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="funding-legend">
          <span className="funding-legend__item"><span className="funding-legend__bar funding-legend__bar--raised" /> Raised</span>
          <span className="funding-legend__item"><span className="funding-legend__bar funding-legend__bar--val" /> Valuation</span>
        </div>
        <div className="funding-footnote">* analyst estimate / IPO target / acquisition price</div>
      </section>

      <section className="geo-section">
        <div className="supply-chain__header">
          <h3 className="section-title">Top Investors</h3>
        </div>
        <div className="funding-investors">
          {topInvestors.map((inv) => (
            <div key={inv.id} className="funding-investor-card">
              <div className="funding-investor-card__header">
                <span className="funding-investor-card__name">{inv.name}</span>
                <span className="funding-investor-card__meta">{inv.country} / {inv.type}</span>
              </div>
              <div className="funding-investor-card__portfolio">
                {inv.portfolioCompanyIds.map((cid) => {
                  const cf = companyFunding.find((f) => f.companyId === cid);
                  return (
                    <button
                      key={cid}
                      className="funding-investor-card__company"
                      onClick={() => onSelectCompany(cid)}
                    >
                      {cf?.name || cid}
                    </button>
                  );
                })}
              </div>
              <p className="funding-investor-card__desc">{inv.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
