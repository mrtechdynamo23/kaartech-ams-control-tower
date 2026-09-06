/**
 * EDGE AMS Control Tower — Software Licenses & Compliance
 * Route: /governance/licenses
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Key, AlertTriangle, CheckCircle, Plus, Shield, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailDrawer from '../../components/common/DetailDrawer';
import { licenses as initialLicenses } from '../../data/demoData';

export default function LicensesPage() {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [customLicenses, setCustomLicenses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form state
  const [softwareName, setSoftwareName] = useState('');
  const [vendor, setVendor] = useState('SAP');
  const [licenseType, setLicenseType] = useState('Named User');
  const [quantity, setQuantity] = useState(250);
  const [consumed, setConsumed] = useState(180);
  const [risk, setRisk] = useState('Low');
  const [renewalDate, setRenewalDate] = useState('2027-03-31');

  const allLicenses = useMemo(() => {
    return [...customLicenses, ...initialLicenses];
  }, [customLicenses]);

  const handleAddLicense = (e) => {
    e.preventDefault();
    if (!softwareName.trim()) return;

    const newId = `LIC-00${allLicenses.length + 1}`;
    const newRecord = {
      id: newId,
      software: softwareName.trim(),
      vendor: vendor.trim() || 'Enterprise Vendor',
      type: licenseType,
      quantity: Number(quantity) || 100,
      consumed: Number(consumed) || 50,
      risk: risk,
      renewalDate: renewalDate,
      status: 'Active',
      annualCost: 150000,
      contractRef: `CTR-${newId}`,
    };

    setCustomLicenses(prev => [newRecord, ...prev]);
    setIsAddModalOpen(false);
    setSoftwareName('');
    setSuccessBanner(`Entitlement record ${newId} created successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const highRisk = allLicenses.filter(l => l.risk === 'High');
  const totalCost = allLicenses.reduce((acc, curr) => acc + (curr.annualCost || 120000), 0);

  const columns = [
    { key: 'id', label: 'License ID', width: '110px' },
    { key: 'software', label: 'Software / Edition', wrap: true },
    { key: 'vendor', label: 'Vendor', width: '130px' },
    { key: 'type', label: 'License Model', width: '140px' },
    {
      key: 'consumed',
      label: 'Utilization',
      width: '180px',
      render: (val, item) => {
        const pct = Math.round((val / (item.quantity || 100)) * 100);
        const isHigh = pct >= 90;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span>{val} / {item.quantity}</span>
              <strong style={{ color: isHigh ? 'var(--color-red)' : 'var(--text-primary)' }}>{pct}%</strong>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: isHigh ? 'var(--color-red)' : 'var(--edge-primary)', borderRadius: '3px' }} />
            </div>
          </div>
        );
      }
    },
    {
      key: 'risk',
      label: 'Compliance Risk',
      width: '130px',
      render: (val) => (
        <span className={`badge ${val === 'High' ? 'badge-error' : val === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
          {val || 'Low'} Risk
        </span>
      )
    },
    { key: 'renewalDate', label: 'Renewal Due', type: 'date', width: '120px' },
    { key: 'status', label: 'Status', type: 'status', width: '110px' },
  ];

  return (
    <div className="licenses-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Software License Governance</h1>
            <span className="badge badge-primary">{allLicenses.length} Enterprise Subscriptions</span>
          </div>
          <p className="page-subtitle">Monitor entitlement compliance, consumption thresholds, and OEM renewal calendars.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Add Entitlement Record</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(21, 154, 106, 0.12)',
          border: '1px solid var(--color-emerald)',
          color: 'var(--color-emerald)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          marginBottom: '16px',
        }}>
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <KPICard
          title="Active Licenses"
          value={allLicenses.length}
          subtitle="In-scope application estate"
          icon={Key}
          sparklineData={[15, 16, 18, allLicenses.length]}
        />
        <KPICard
          title="Capacity Alerts (>90%)"
          value={highRisk.length}
          status={highRisk.length > 0 ? 'danger' : 'success'}
          subtitle="Approaching quota limit"
          icon={AlertTriangle}
          sparklineData={[2, 3, 2, highRisk.length]}
        />
        <KPICard
          title="Audit Compliance Score"
          value="99.2%"
          status="success"
          subtitle="Zero unlicenced deployments"
          icon={Shield}
          sparklineData={[98, 98.5, 99.2]}
        />
        <KPICard
          title="Annual Run-Rate"
          value={`AED ${(totalCost / 1000000).toFixed(1)}M`}
          subtitle="Consolidated OEM cost"
          sparklineData={[3.8, 4.0, 4.2, (totalCost / 1000000)]}
        />
      </div>

      {/* Table */}
      <DataTable
        title="Enterprise Software Entitlement Inventory"
        subtitle="Click any row to inspect contractual tier, entitlement keys, and renewal terms."
        columns={columns}
        data={allLicenses}
        onRowClick={(item) => setSelectedLicense(item)}
        exportFilename="edge-software-licenses.csv"
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedLicense)}
        item={selectedLicense}
        onClose={() => setSelectedLicense(null)}
        type="license"
      />

      {/* Centered Add Entitlement Record Modal */}
      {isAddModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="modal-overlay-centered"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '24px',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="modal-dialog-centered"
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '2px solid var(--border-secondary, #e2e8f0)',
              boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto',
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalCenterScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-primary, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: '16px 16px 0 0',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Key size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Add Software Entitlement Record
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Log application subscriptions, quota allocations, and compliance terms
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddLicense} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Software / Edition Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SAP S/4HANA Enterprise Cloud (FI-CO / SD)"
                  value={softwareName}
                  onChange={(e) => setSoftwareName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Software Vendor
                  </label>
                  <select
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="SAP">SAP SE</option>
                    <option value="Salesforce">Salesforce Inc.</option>
                    <option value="Oracle">Oracle Corporation</option>
                    <option value="Microsoft">Microsoft Corp.</option>
                    <option value="Coupa">Coupa Software</option>
                    <option value="ServiceNow">ServiceNow Inc.</option>
                    <option value="Red Hat">Red Hat Enterprise</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    License Model
                  </label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Named User">Named User Subscription</option>
                    <option value="Concurrent">Concurrent User Pool</option>
                    <option value="Processor Core">Processor Core Metric</option>
                    <option value="Site License">Enterprise Site License</option>
                    <option value="SaaS Seat">SaaS Monthly Active Users</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Total Entitlement Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Allocated / Consumed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={consumed}
                    onChange={(e) => setConsumed(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Compliance Risk Level
                  </label>
                  <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Low">Low Risk (&lt;75% Capacity)</option>
                    <option value="Medium">Medium Risk (75-90% Capacity)</option>
                    <option value="High">High Risk (&gt;90% Capacity)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Renewal Due Date
                  </label>
                  <input
                    type="date"
                    value={renewalDate}
                    onChange={(e) => setRenewalDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-primary, #e2e8f0)',
              }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Key size={14} />
                  <span>Save Entitlement</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
