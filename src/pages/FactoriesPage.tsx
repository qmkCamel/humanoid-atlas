import { companyProduction, manufacturingPartners } from '../data';
import type { FactoryStatus } from '../data';
import {
  getCountryFilterGroup,
  getFilteredFactories,
  getProductionSorted,
} from '../domain/atlasAnalytics';
import type { CountryGroup } from '../domain/atlasAnalytics';

interface FactoriesPageProps {
  factoryStatusFilter: 'all' | FactoryStatus;
  countryFilter: CountryGroup;
  onFactoryStatusFilterChange: (filter: 'all' | FactoryStatus) => void;
  onSelectCompany: (id: string) => void;
}

function getFactoryStatusLabel(s: FactoryStatus) {
  switch (s) {
    case 'operational': return 'Operational';
    case 'under-construction': return 'Under Construction';
    case 'planned': return 'Planned';
    case 'pre-production': return 'Pre-Production';
    case 'trials': return 'Trials';
  }
}

function getMfgModelLabel(m: string) {
  switch (m) {
    case 'in-house': return 'In-House';
    case 'contract': return 'Contract';
    case 'partner': return 'Partner';
    case 'vertically-integrated': return 'Vert. Integrated';
    default: return m;
  }
}

function formatUnits(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M/yr`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K/yr`;
  return `${n}/yr`;
}

export default function FactoriesPage({
  factoryStatusFilter,
  countryFilter,
  onFactoryStatusFilterChange,
  onSelectCompany,
}: FactoriesPageProps) {
  const productionSorted = getProductionSorted();
  const filteredFactories = getFilteredFactories(factoryStatusFilter);
  const scaleMax = Math.max(
    ...productionSorted.map((p) => p.shipped2025 ?? 0),
    ...productionSorted
      .filter((p) => (p.annualCapacity ?? 0) <= 100000)
      .map((p) => p.annualCapacity ?? 0),
  );
  const pct = (v: number) => Math.min((v / scaleMax) * 100, 99);

  return (
    <div className="geo-content">
      <section className="geo-section">
        <div className="supply-chain__header">
          <h3 className="section-title">Production Capacity</h3>
        </div>
        <div className="funding-list">
          {productionSorted.map((p) => (
            <div
              key={p.companyId}
              className={`funding-row ${countryFilter && getCountryFilterGroup(p.country) !== countryFilter ? 'geo-dim' : ''}`}
              onClick={() => onSelectCompany(p.companyId)}
            >
              <span className="funding-row__country">{p.country}</span>
              <span className="funding-row__name">{p.name}</span>
              <span className="funding-row__status">{getMfgModelLabel(p.mfgModel)}</span>
              <div className="funding-row__bars">
                {p.shipped2025 != null && (
                  <div
                    className="funding-row__raised"
                    style={{ width: `${pct(p.shipped2025)}%` }}
                  />
                )}
                {p.annualCapacity != null && (
                  <div
                    className="funding-row__valuation"
                    style={{ left: `${pct(p.annualCapacity)}%` }}
                  />
                )}
              </div>
              <div className="funding-row__labels">
                {p.shipped2025 != null && (
                  <span className="funding-row__raised-label">{p.shipped2025.toLocaleString()} shipped</span>
                )}
                {p.shipped2025 == null && p.shipped2025Note && (
                  <span className="funding-row__raised-label">{p.shipped2025Note}</span>
                )}
                {p.annualCapacity != null && (
                  <span className="funding-row__val-label">{formatUnits(p.annualCapacity)} capacity{p.capacityNote ? '*' : ''}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="funding-legend">
          <span className="funding-legend__item"><span className="funding-legend__bar funding-legend__bar--raised" /> 2025 Shipped</span>
          <span className="funding-legend__item"><span className="funding-legend__bar funding-legend__bar--val" /> Capacity</span>
        </div>
        <div className="funding-footnote">* see capacity notes in data</div>
      </section>

      <section className="geo-section">
        <div className="supply-chain__header">
          <h3 className="section-title">Factory Directory</h3>
          <div className="vla-filters">
            <button className={`country-pill ${factoryStatusFilter === 'all' ? 'country-pill--active' : ''}`} onClick={() => onFactoryStatusFilterChange('all')}>All</button>
            <button className={`country-pill ${factoryStatusFilter === 'operational' ? 'country-pill--active' : ''}`} onClick={() => onFactoryStatusFilterChange(factoryStatusFilter === 'operational' ? 'all' : 'operational')}>Operational</button>
            <button className={`country-pill ${factoryStatusFilter === 'under-construction' ? 'country-pill--active' : ''}`} onClick={() => onFactoryStatusFilterChange(factoryStatusFilter === 'under-construction' ? 'all' : 'under-construction')}>Under Construction</button>
            <button className={`country-pill ${factoryStatusFilter === 'planned' ? 'country-pill--active' : ''}`} onClick={() => onFactoryStatusFilterChange(factoryStatusFilter === 'planned' ? 'all' : 'planned')}>Planned</button>
            <button className={`country-pill ${factoryStatusFilter === 'pre-production' ? 'country-pill--active' : ''}`} onClick={() => onFactoryStatusFilterChange(factoryStatusFilter === 'pre-production' ? 'all' : 'pre-production')}>Pre-Production</button>
          </div>
        </div>
        <div className="chain-flow">
          <div className="chain-tier">
            <div className="chain-tier-label">Factories</div>
            {filteredFactories.map((f) => (
              <button
                key={f.id}
                className={`chain-entity ${countryFilter && getCountryFilterGroup(f.country) !== countryFilter ? 'geo-dim' : ''}`}
                onClick={() => onSelectCompany(f.companyId)}
              >
                <span className="chain-name">{f.name}</span>
                <span className="chain-country">{f.country}</span>
                <span className="chain-share">
                  {f.companyName} · {f.location} · {getFactoryStatusLabel(f.status)}{f.sizeSqft ? ` · ${f.sizeSqft}` : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="geo-section">
        <div className="supply-chain__header">
          <h3 className="section-title">Manufacturing Partners</h3>
        </div>
        <div className="funding-investors">
          {manufacturingPartners.map((mp) => (
            <div key={mp.id} className="funding-investor-card">
              <div className="funding-investor-card__header">
                <span className="funding-investor-card__name">{mp.name}</span>
                <span className="funding-investor-card__meta">{mp.country} / {mp.type}</span>
              </div>
              <div className="funding-investor-card__portfolio">
                {mp.partnerCompanyIds.map((cid) => {
                  const cp = companyProduction.find((p) => p.companyId === cid);
                  return (
                    <button
                      key={cid}
                      className="funding-investor-card__company"
                      onClick={() => onSelectCompany(cid)}
                    >
                      {cp?.name || cid}
                    </button>
                  );
                })}
              </div>
              <p className="funding-investor-card__desc">{mp.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
