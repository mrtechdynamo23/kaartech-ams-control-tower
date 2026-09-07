/**
 * EDGE AMS Control Tower — Resource Directory & Capability
 * Route: /resources/directory
 * Master resource profiles, track allocation, certifications, and workforce composition (Section 25).
 * Visuals:
 * 1. Onsite vs Offshore Track Mix (Donut)
 * 2. Gender & Nationality Composition (Donut)
 * 3. Business Domain Allocation (Bar)
 * 4. Contractual Track Compliance Plan vs Actual (Bar)
 */
import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, Shield, Award, MapPin, Phone, Mail, Plus,
  CheckCircle2, RefreshCw, UserCheck, Briefcase
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';
import ResourceDetailModal from '../../components/resources/organization/ResourceDetailModal';
import { RESOURCES, getResourceStats } from '../../data/demoData';
import { isResourceAvailable, subscribeTimeManagement } from '../../data/timeManagementStore';
import { getOverallResourceUtilization } from '../../data/analyticsSelectors';

export default function ResourceDirectoryPage() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    return subscribeTimeManagement(() => {
      setStoreVersion(v => v + 1);
    });
  }, []);

  const stats = getResourceStats();
  const overallUtil = useMemo(() => getOverallResourceUtilization(), []);

  const filteredResources = useMemo(() => {
    if (selectedTrack === 'all') return RESOURCES;
    return RESOURCES.filter(r => r.track === selectedTrack);
  }, [selectedTrack]);

  // Visual 1: Onsite vs Offshore
  const locationData = [
    { name: 'Onsite (Abu Dhabi HQ)', value: stats.onsite, color: '#FF5622' },
    { name: 'Offshore Dedicated', value: stats.offshore - 3, color: '#2563EB' },
    { name: 'Offshore Flex Pool', value: 3, color: '#7C3AED' },
  ];

  // Visual 2: Gender Diversity
  const genderData = [
    { name: `Female (${stats.femalePercent}%)`, value: stats.female, color: '#EC4899' },
    { name: `Male (${100 - stats.femalePercent}%)`, value: stats.total - stats.female, color: '#3B82F6' },
  ];

  // Visual 3: Business Domain Distribution
  const domainData = [
    { domain: 'L2C', count: 6 },
    { domain: 'E2M', count: 5 },
    { domain: 'P2P', count: 5 },
    { domain: 'R2R', count: 4 },
    { domain: 'H2R', count: 4 },
    { domain: 'A2D', count: 3 },
    { domain: 'D2S', count: 3 },
  ];

  // Visual 4: Contractual Compliance Plan vs Actual
  const complianceData = [
    { track: 'AMS-ON-RUN', Plan: 14, Actual: 14 },
    { track: 'AMS-OF-RUN', Plan: 10, Actual: 10 },
    { track: 'AMS-OF-Flex', Plan: 3, Actual: 3 },
    { track: 'ENH-OF-RUN', Plan: 3, Actual: 3 },
  ];

  const columns = [
    { key: 'id', label: 'Emp ID', width: '100px' },
    {
      key: 'name',
      label: 'Specialist Name',
      width: '180px',
      render: (val, item) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{val}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.role || 'Consultant'}</div>
        </div>
      )
    },
    {
      key: 'track',
      label: 'Contractual Track',
      width: '140px',
      render: (val) => (
        <span className="badge badge-neutral" style={{ fontWeight: 600 }}>{val}</span>
      )
    },
    { key: 'businessDomain', label: 'Domain', width: '80px' },
    { key: 'processGroup', label: 'Process Group', width: '120px' },
    { key: 'skill', label: 'Core Competency', width: '140px' },
    { key: 'certification', label: 'Certified Credential', width: '180px' },
    { key: 'location', label: 'Location', width: '110px' },
    { key: 'nationality', label: 'Nationality', width: '110px' },
    {
      key: 'status',
      label: 'Availability State',
      width: '130px',
      render: (val, item) => {
        const avail = isResourceAvailable(item.id, '2026-09-08');
        if (!avail.available && avail.status === 'On Leave') {
          return (
            <span
              className="badge badge-warning"
              style={{ fontWeight: 600, fontSize: '11px' }}
              title={`On Leave • Backup: ${avail.backupResource || 'Nominated Specialist'}`}
            >
              On Leave
            </span>
          );
        }
        if (avail.status === 'Remote Work') {
          return (
            <span className="badge badge-primary" style={{ fontWeight: 600, fontSize: '11px' }}>
              Remote
            </span>
          );
        }
        return (
          <span className="badge badge-success" style={{ fontWeight: 600, fontSize: '11px' }}>
            Active
          </span>
        );
      }
    },
  ];

  return (
    <div className="resource-directory-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Resource</h1>
            <span className="badge badge-primary">{stats.total} Dedicated FTEs</span>
            <span className="badge badge-success">100% Staffing Compliance</span>
          </div>
          <p className="page-subtitle">
            Workforce composition, certified technical competencies, and contractual track allocation across Abu Dhabi and offshore delivery centers.
          </p>
        </div>
      </div>

      {/* KPI Strip per Section 25 & Section 5 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Overall Resource Utilization %"
          value={overallUtil.overallUtilizationFormatted}
          target="90.0%"
          status="success"
          trend={+(overallUtil.overallUtilization - 90).toFixed(1)}
          subtitle={`${overallUtil.totalUtilized}h / ${overallUtil.totalAllocated}h Total`}
          icon={Briefcase}
          sparklineData={[91, 92.5, 93.8, overallUtil.overallUtilization]}
        />
        <KPICard
          title="Total Headcount"
          value={stats.total}
          subtitle="Contractual dedicated FTEs"
          icon={Users}
          sparklineData={[28, 30, 30, stats.total]}
        />
        <KPICard
          title="Onsite UAE Delivery"
          value={stats.onsite}
          unit="FTEs"
          subtitle={`${Math.round((stats.onsite / stats.total) * 100)}% Abu Dhabi Presence`}
          icon={MapPin}
        />
        <KPICard
          title="Offshore Centers"
          value={stats.offshore}
          unit="FTEs"
          subtitle="Dedicated & Flex Pool"
          icon={Shield}
        />
        <KPICard
          title="Female Ratio"
          value={`${stats.femalePercent}%`}
          subtitle={`${stats.female} Female Specialists`}
          icon={UserCheck}
        />
        <KPICard
          title="UAE National Ratio"
          value={`${stats.localNationalPercent}%`}
          target="40%"
          status="success"
          subtitle={`${stats.localNational} Emirati Specialists`}
          icon={Award}
        />
        <KPICard
          title="Staffing Coverage"
          value="100%"
          target="100%"
          status="success"
          subtitle="0 Open Resourcing Gaps"
          icon={CheckCircle2}
        />
      </div>

      {/* 4 Visual Analytics Charts per Section 25 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '16px',
      }}>
        {/* Visual 1: Onsite vs Offshore Track Allocation */}
        <ChartCard
          title="Delivery Track Distribution"
          subtitle="Onsite (Abu Dhabi HQ) vs Offshore Dedicated & Flex Pool"
          badge={`${stats.total} FTEs`}
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val, entry) => (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {val} (<strong>{entry.payload.value}</strong>)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 2: Gender Diversity Composition */}
        <ChartCard
          title="Workforce Diversity Breakdown"
          subtitle="Female representation vs total consultant demographic"
          badge="Diversity Index"
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-g-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val, entry) => (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {val} (<strong>{entry.payload.value}</strong>)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 3: Business Domain Distribution */}
        <ChartCard
          title="FTE Allocation by Business Domain"
          subtitle="Core ERP/HXM stream alignment (L2C, E2M, P2P, R2R, H2R, A2D, D2S)"
          badge="Domain Alignment"
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="domain" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="count" name="FTEs" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 4: Contractual Track Compliance */}
        <ChartCard
          title="Contractual Staffing Plan vs Actual"
          subtitle="Mandated track quotas vs deployed personnel"
          badge="100% Fulfilled"
          height={250}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="track" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend verticalAlign="top" align="right" height={28} />
              <Bar dataKey="Plan" fill="#71777C" radius={[4, 4, 0, 0]} name="Contract Plan" barSize={16} />
              <Bar dataKey="Actual" fill="#0D9F6E" radius={[4, 4, 0, 0]} name="Actual Deployed" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Track Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['all', 'AMS-ON-RUN', 'AMS-OF-RUN', 'AMS-OF-Flex', 'ENH-OF-RUN'].map(tr => (
          <button
            key={tr}
            onClick={() => setSelectedTrack(tr)}
            className={`btn ${selectedTrack === tr ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            {tr === 'all' ? `All Tracks (${RESOURCES.length})` : tr}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        title="Consultant Roster & Certifications"
        subtitle="Click any consultant row to view contact details, competency profiles, and assigned applications."
        columns={columns}
        data={filteredResources}
        onRowClick={(item) => setSelectedResource(item)}
        exportFilename="edge-resources.csv"
      />

      {/* Centered Record Detail Modal (Section 7, 23) */}
      <ResourceDetailModal
        isOpen={Boolean(selectedResource)}
        resourceId={selectedResource?.id}
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}
