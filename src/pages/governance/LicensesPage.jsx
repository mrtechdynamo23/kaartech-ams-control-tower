/**
 * EDGE AMS Control Tower — Software Licenses & Compliance
 * Route: /governance/licenses
 */
import React, { useState } from 'react';
import { Key, AlertTriangle, CheckCircle, Plus, Shield, RefreshCw } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailDrawer from '../../components/common/DetailDrawer';
import { licenses } from '../../data/demoData';

export default function LicensesPage() {
  const [selectedLicense, setSelectedLicense] = useState(null);

  const highRisk = licenses.filter(l => l.risk === 'High');
  const totalCost = licenses.reduce((acc, curr) => acc + (curr.annualCost || 120000), 0);

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
            <span className="badge badge-primary">{licenses.length} Enterprise Subscriptions</span>
          </div>
          <p className="page-subtitle">Monitor entitlement compliance, consumption thresholds, and OEM renewal calendars.</p>
        </div>

        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Add Entitlement Record</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <KPICard
          title="Active Licenses"
          value={licenses.length}
          subtitle="In-scope application estate"
          icon={Key}
          sparklineData={[15, 16, 18, licenses.length]}
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
        data={licenses}
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
    </div>
  );
}
