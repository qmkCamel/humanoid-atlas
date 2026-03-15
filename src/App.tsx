import { useState, useMemo } from 'react';
import PLYViewer from './components/PLYViewer';
import { companies, relationships, componentCategories } from './data';
import './App.css';

const TABS = [
  { id: 'skeleton', label: 'Skeleton' },
  { id: 'all_oems', label: 'All OEMs' },
  { id: 'sensors_general', label: 'Sensors' },
  { id: 'compute', label: 'Compute' },
  { id: 'batteries', label: 'Battery' },
  { id: 'motors', label: 'Motors' },
  { id: 'reducers', label: 'Reducers' },
  { id: 'bearings', label: 'Bearings' },
  { id: 'actuators_rotary', label: 'Actuators' },
  { id: 'screws', label: 'Screws' },
  { id: 'end_effectors', label: 'Hands' },
  { id: 'pcbs', label: 'PCBs' },
];

// Per-model orientation fixes (most models are fine, these need correction)
const MODEL_ROTATIONS: Record<string, [number, number, number]> = {
  '/models/skeleton.ply': [-Math.PI / 2, 0, 0],
  '/models/end-effector.ply': [-Math.PI / 2, 0, 0],
  '/models/planetary-screw.ply': [0, 0, Math.PI / 2],
};

const COMPONENT_KEYWORDS: Record<string, string[]> = {
  motors: ['bldc motors', 'motors', 'servo motors'],
  reducers: ['harmonic reducer', 'strain wave reducer'],
  compute: ['jetson', 'nvidia gpu', 'cpu', 'soc', 'n97', 'ai chips', 'ai/ml models'],
  sensors_general: ['lidar', 'image sensors'],
  end_effectors: ['dexterous hands'],
  pcbs: ['motor drivers', 'analog ics', 'power semiconductors', 'mlcc', 'passive components', 'chip fabrication'],
  batteries: ['battery cells', 'battery pack'],
  bearings: ['cross-roller bearings', 'ball bearings', 'bearings'],
  actuators_rotary: ['actuator modules', 'servo actuators'],
  actuators_linear: ['actuator modules'],
  screws: ['planetary roller screws', 'roller screws'],
  sensors_tactile: [],
  skeleton: [],
};

function getComponentChain(componentId: string) {
  const keywords = COMPONENT_KEYWORDS[componentId] || [];
  const rels = relationships.filter((r) =>
    keywords.some((kw) => r.component.toLowerCase().includes(kw))
  );
  const supplierIds = [...new Set(rels.map((r) => r.from))];
  const oemIds = [...new Set(rels.map((r) => r.to))];
  const upstreamRels = relationships.filter(
    (r) => supplierIds.includes(r.to) && !supplierIds.includes(r.from)
  );
  const upstreamIds = [...new Set(upstreamRels.map((r) => r.from))];

  return {
    upstream: upstreamIds.map((id) => companies.find((c) => c.id === id)).filter(Boolean),
    suppliers: supplierIds.map((id) => companies.find((c) => c.id === id)).filter(Boolean),
    oems: oemIds.map((id) => companies.find((c) => c.id === id)).filter(Boolean),
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState('skeleton');
  const [companyId, setCompanyId] = useState<string | null>(null);

  const selectedComponent = useMemo(
    () => (activeTab !== 'skeleton' ? componentCategories.find((c) => c.id === activeTab) : null),
    [activeTab]
  );

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === companyId),
    [companyId]
  );

  const chain = useMemo(
    () => (activeTab !== 'skeleton' ? getComponentChain(activeTab) : null),
    [activeTab]
  );

  const oems = companies.filter((c) => c.type === 'oem');

  const handleSelectCompany = (id: string) => {
    setCompanyId(id);
  };

  const handleBackFromCompany = () => {
    setCompanyId(null);
  };

  // ==================== COMPANY VIEW ====================
  if (companyId && selectedCompany) {
    const specs = selectedCompany.robotSpecs;
    const supplierRels = relationships.filter((r) => r.to === selectedCompany.id);
    const customerRels = relationships.filter((r) => r.from === selectedCompany.id);

    return (
      <div className="app">
        <header className="header">
          <button className="back-btn" onClick={handleBackFromCompany}>&larr;</button>
          <span className="header-title">{selectedCompany.name}</span>
          {selectedCompany.ticker && <span className="header-ticker">{selectedCompany.ticker}</span>}
          <span className="header-badge">{selectedCompany.country}</span>
        </header>

        <main className="company-view">
          <div className="company-top">
            <div className="company-model">
              {selectedCompany.plyModel ? (
                <PLYViewer
                  modelUrl={selectedCompany.plyModel}
                  color="#1a1a1a"
                  initialRotation={MODEL_ROTATIONS[selectedCompany.plyModel]}
                />
              ) : (
                <div className="model-placeholder" />
              )}
            </div>
            <div className="company-info">
              <p className="company-desc">{selectedCompany.description}</p>
              {selectedCompany.marketShare && (
                <div className="company-share">Market Share: {selectedCompany.marketShare}</div>
              )}
            </div>
          </div>

          {supplierRels.length > 0 && (
            <div className="company-section">
              <h3 className="section-title">Suppliers ({supplierRels.length})</h3>
              <div className="rel-list">
                {supplierRels.map((rel) => {
                  const supplier = companies.find((c) => c.id === rel.from);
                  if (!supplier) return null;
                  return (
                    <button key={rel.id} className="rel-row" onClick={() => handleSelectCompany(rel.from)}>
                      <span className="rel-name">{supplier.name}</span>
                      <span className="rel-component">{rel.component}</span>
                      {rel.bomPercent && <span className="rel-pct">{rel.bomPercent}%</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {customerRels.length > 0 && (
            <div className="company-section">
              <h3 className="section-title">Customers ({customerRels.length})</h3>
              <div className="rel-list">
                {customerRels.map((rel) => {
                  const customer = companies.find((c) => c.id === rel.to);
                  if (!customer) return null;
                  return (
                    <button key={rel.id} className="rel-row" onClick={() => handleSelectCompany(rel.to)}>
                      <span className="rel-name">{customer.name}</span>
                      <span className="rel-component">{rel.component}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {specs && (
            <div className="company-section">
              <h3 className="section-title">Specifications</h3>
              <div className="specs-grid">
                <Spec label="Status" value={specs.status} />
                <Spec label="Launch" value={specs.launchDate} />
                {specs.shipments2025 && (
                  <Spec label="2025 Shipments" value={`${specs.shipments2025.toLocaleString()} (${specs.shipmentShare})`} />
                )}
                <Spec label="Target" value={specs.targetUse.join(', ')} />
                <Spec label="Mass" value={specs.mass} />
                <Spec label="Height" value={specs.height} />
                <Spec label="Speed" value={specs.speed} />
                <Spec label="DOF" value={specs.totalDOF} />
                <Spec label="Runtime" value={specs.operatingTime} />
                <Spec label="Payload" value={specs.payloadCapacity} />
                <Spec label="End Effector" value={specs.endEffector} />
                <Spec label="Locomotion" value={specs.locomotion} />
                <Spec label="Materials" value={specs.materials} />
                <Spec label="Motor" value={specs.motor} />
                <Spec label="Body Actuator" value={specs.actuatorBody} />
                <Spec label="Hand Actuator" value={specs.actuatorHand} />
                <Spec label="Transmission" value={specs.transmission} />
                <Spec label="Ext. Sensors" value={specs.externalSensors} />
                <Spec label="Int. Sensors" value={specs.internalSensors} />
                <Spec label="Compute" value={specs.compute} />
                <Spec label="Battery" value={specs.battery} />
                <Spec label="Charging" value={specs.charging} />
                <Spec label="AI Partner" value={specs.aiPartner} />
                <Spec label="Software" value={specs.software} />
                <Spec label="Data Collection" value={specs.dataCollection} />
                {specs.bom && <Spec label="BOM" value={specs.bom} />}
                {specs.price && <Spec label="Price" value={specs.price} highlight />}
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <span>Data: Humanity's Last Machine + RoboStrategy</span>
        </footer>
      </div>
    );
  }

  // ==================== MAIN VIEW (tabs) ====================
  return (
    <div className="app">
      <header className="header">
        <span className="header-title">Humanoid Terminal</span>
      </header>

      <nav className="component-nav">
        {TABS.map((t) => {
          const comp = componentCategories.find((c) => c.id === t.id);
          return (
            <button
              key={t.id}
              className={`component-btn ${activeTab === t.id ? 'component-btn--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {comp?.bottleneck && (
                <svg className="component-btn__warn" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 5.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="14" r="0.75" fill="currentColor"/>
                </svg>
              )}
            </button>
          );
        })}
      </nav>

      <main className={activeTab === 'skeleton' ? 'skeleton-view' : 'component-view'}>
        {/* Skeleton tab */}
        {activeTab === 'skeleton' && (
          <div className="skeleton-center">
            <PLYViewer modelUrl="/models/skeleton.ply" color="#1a1a1a" initialRotation={MODEL_ROTATIONS['/models/skeleton.ply']} />
          </div>
        )}

        {/* All OEMs tab */}
        {activeTab === 'all_oems' && (
          <div className="oems-view">
            <div className="oem-grid">
              {oems.map((c) => (
                <button key={c.id} className="oem-card" onClick={() => handleSelectCompany(c.id)}>
                  <span className="oem-name">{c.name}</span>
                  <span className="oem-country">{c.country}</span>
                  {c.robotSpecs?.status === 'In Production' && (
                    <span className="oem-status">In Production</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Component tab */}
        {activeTab !== 'skeleton' && activeTab !== 'all_oems' && selectedComponent && (
          <>
            <div className="component-top">
              <div className="component-model">
                {selectedComponent.plyModel ? (
                  <PLYViewer modelUrl={selectedComponent.plyModel} color="#1a1a1a" initialRotation={MODEL_ROTATIONS[selectedComponent.plyModel]} />
                ) : (
                  <div className="model-placeholder">No 3D model</div>
                )}
              </div>

              <div className="component-info">
                <p className="component-desc">{selectedComponent.description}</p>

                {selectedComponent.bottleneck && (
                  <div className="bottleneck-alert">
                    <span className="bottleneck-icon">!</span>
                    <div>
                      <div className="bottleneck-title">Supply Chain Bottleneck</div>
                      <p className="bottleneck-reason">{selectedComponent.bottleneckReason}</p>
                    </div>
                  </div>
                )}

                {selectedComponent.keyMetrics && (
                  <div className="metrics">
                    {Object.entries(selectedComponent.keyMetrics).map(([k, v]) => (
                      <div key={k} className="metric-row">
                        <span className="metric-label">{k}</span>
                        <span className="metric-value">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {chain && (chain.upstream.length > 0 || chain.suppliers.length > 0 || chain.oems.length > 0) && (
              <div className="supply-chain">
                <h3 className="section-title">Supply Chain</h3>
                <div className="chain-flow">
                  {chain.upstream.length > 0 && (
                    <div className="chain-tier">
                      <div className="chain-tier-label">Raw Materials</div>
                      {chain.upstream.map((c) => c && (
                        <button key={c.id} className="chain-entity" onClick={() => handleSelectCompany(c.id)}>
                          <span className="chain-name">{c.name}</span>
                          <span className="chain-country">{c.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {chain.upstream.length > 0 && chain.suppliers.length > 0 && (
                    <div className="chain-arrow">&rarr;</div>
                  )}
                  {chain.suppliers.length > 0 && (
                    <div className="chain-tier">
                      <div className="chain-tier-label">Suppliers</div>
                      {chain.suppliers.map((c) => c && (
                        <button key={c.id} className="chain-entity" onClick={() => handleSelectCompany(c.id)}>
                          <span className="chain-name">{c.name}</span>
                          <span className="chain-country">{c.country}</span>
                          {c.marketShare && <span className="chain-share">{c.marketShare}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {chain.suppliers.length > 0 && chain.oems.length > 0 && (
                    <div className="chain-arrow">&rarr;</div>
                  )}
                  {chain.oems.length > 0 && (
                    <div className="chain-tier">
                      <div className="chain-tier-label">OEMs</div>
                      {chain.oems.map((c) => c && (
                        <button key={c.id} className="chain-entity" onClick={() => handleSelectCompany(c.id)}>
                          <span className="chain-name">{c.name}</span>
                          <span className="chain-country">{c.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </main>

      <footer className="footer">
        <span>{oems.length} OEMs</span>
        <span className="footer-sep" />
        <span>{companies.filter((c) => c.type !== 'oem').length} Suppliers</span>
        <span className="footer-sep" />
        <span>
          {oems.reduce((s, c) => s + (c.robotSpecs?.shipments2025 || 0), 0).toLocaleString()} est. 2025 shipments
        </span>
        <span className="footer-right">Data: Humanity's Last Machine + RoboStrategy</span>
      </footer>
    </div>
  );
}

function Spec({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  if (!value || value === 'Not disclosed') return null;
  return (
    <div className={`spec-row ${highlight ? 'spec-row--hl' : ''}`}>
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  );
}
