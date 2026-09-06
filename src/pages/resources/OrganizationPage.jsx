/**
 * EDGE AMS Control Tower — Organization Structure
 * Route: /resources/organization
 * 
 * Enterprise Command & Control Organization Structure Page
 * Implements all specifications from ANTIGRAVITY MASTER IMPLEMENTATION PROMPT:
 * - EDGE Resource Master is the source of truth
 * - 4-tier functional organization hierarchy (SteerCom -> Domains -> Teams -> Resources)
 * - Three synchronized view modes:
 *     1. Structure View: Interactive organization canvas with zoom, pan, expand/collapse, active path illumination
 *     2. Team Overview: NOC-inspired capability breakdown, tower leadership matrices, domain & location mix analytics
 *     3. Resource Roster: Searchable master personnel roster with fast profile inspection
 * - Deep drill-down modals for both Teams (TeamDetailModal) and Specialists (ResourceDetailModal)
 * - Recent Organization Changes drawer for governance and personnel movement auditing
 * - Fully responsive, dark mode primary, light mode compatible, RTL support
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  buildOrganizationTree,
  solveHierarchyMatches,
  getEnrichedResources,
  getOrganizationMetrics
} from '../../data/organizationData';
import OrganizationHeader from '../../components/resources/organization/OrganizationHeader';
import OrganizationSummaryStrip from '../../components/resources/organization/OrganizationSummaryStrip';
import OrganizationCanvas from '../../components/resources/organization/OrganizationCanvas';
import TeamOverviewView from '../../components/resources/organization/TeamOverviewView';
import ResourceRosterView from '../../components/resources/organization/ResourceRosterView';
import TeamDetailModal from '../../components/resources/organization/TeamDetailModal';
import ResourceDetailModal from '../../components/resources/organization/ResourceDetailModal';
import RecentChangesDrawer from '../../components/resources/organization/RecentChangesDrawer';
import './OrganizationPage.css';

export default function OrganizationPage() {
  // ── View Mode: 'structure' | 'teams' | 'roster' ──
  const [activeView, setActiveView] = useState('structure');

  // ── Search & Filter State ──
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    domain: 'all',
    location: 'all',
    track: 'all',
    status: 'all',
  });

  // ── Build Canonical Tree Model & Enriched Resources ──
  const orgTree = useMemo(() => buildOrganizationTree(), []);
  const enrichedResources = useMemo(() => getEnrichedResources(), []);
  const metrics = useMemo(() => getOrganizationMetrics(), []);

  // ── Node Expansion State ──
  // Initially expand all 8 business domains for immediate visual clarity
  const initialExpanded = useMemo(() => {
    const set = new Set();
    orgTree.children.forEach(domain => {
      set.add(domain.id);
    });
    return set;
  }, [orgTree]);

  const [expandedNodeIds, setExpandedNodeIds] = useState(initialExpanded);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // ── Modal States ──
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isRecentChangesOpen, setIsRecentChangesOpen] = useState(false);
  const [fitTrigger, setFitTrigger] = useState(0);

  const handleFitToScreen = useCallback(() => {
    setFitTrigger(t => t + 1);
  }, []);

  // ── Solve Search & Filter Path Ancestry ──
  const searchMatches = useMemo(() => {
    return solveHierarchyMatches(orgTree, searchTerm, filters);
  }, [orgTree, searchTerm, filters]);

  // When search or filter changes, auto-expand ancestors so matched nodes are visible
  useEffect(() => {
    if (searchMatches.isFilterActive && searchMatches.ancestorNodeIds.size > 0) {
      setExpandedNodeIds(prev => {
        const next = new Set(prev);
        searchMatches.ancestorNodeIds.forEach(id => next.add(id));
        return next;
      });
    }
  }, [searchMatches]);

  // ── Tree Expansion Handlers ──
  const handleToggleNode = useCallback((nodeId) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    const allIds = new Set();
    allIds.add(orgTree.id);
    orgTree.children.forEach(domain => {
      allIds.add(domain.id);
      domain.children.forEach(team => {
        allIds.add(team.id);
      });
    });
    setExpandedNodeIds(allIds);
  }, [orgTree]);

  const handleCollapseAll = useCallback(() => {
    setExpandedNodeIds(new Set());
    setSelectedNodeId(null);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ domain: 'all', location: 'all', track: 'all', status: 'all' });
  }, []);

  // ── Modal Openers ──
  const handleOpenResource = useCallback((resId) => {
    setSelectedResourceId(resId);
    setIsResourceModalOpen(true);
  }, []);

  const handleOpenTeam = useCallback((team) => {
    setSelectedTeam(team);
    setIsTeamModalOpen(true);
  }, []);

  const handleSelectNode = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
  }, []);

  return (
    <div className="organization-page animate-fade-in">
      {/* ── Top Header & Command Toolbar ── */}
      <OrganizationHeader
        activeView={activeView}
        onViewChange={setActiveView}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onFitToScreen={handleFitToScreen}
        onOpenRecentChanges={() => setIsRecentChangesOpen(true)}
        matchCount={searchMatches.matchCount}
        isFilterActive={searchMatches.isFilterActive}
      />

      {/* ── Organization Summary Enterprise KPI Strip ── */}
      <OrganizationSummaryStrip
        onFilterClick={(f) => setFilters(prev => ({ ...prev, ...f }))}
      />

      {/* ── Main Workspace Views ── */}
      {activeView === 'structure' && (
        <OrganizationCanvas
          tree={orgTree}
          expandedNodeIds={expandedNodeIds}
          onToggleNode={handleToggleNode}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          searchMatches={searchMatches}
          onOpenResource={handleOpenResource}
          onOpenTeam={handleOpenTeam}
          onFilterDomain={(domainKey) => setFilters(prev => ({ ...prev, domain: domainKey }))}
          fitTrigger={fitTrigger}
          onOpenChanges={() => setIsRecentChangesOpen(true)}
        />
      )}

      {activeView === 'teams' && (
        <TeamOverviewView
          onOpenResource={handleOpenResource}
          onOpenTeam={handleOpenTeam}
          onFilterByDomain={(domainKey) => setFilters(prev => ({ ...prev, domain: domainKey }))}
          onOpenChanges={() => setIsRecentChangesOpen(true)}
        />
      )}

      {activeView === 'roster' && (
        <ResourceRosterView
          resources={enrichedResources}
          onOpenResource={handleOpenResource}
          searchTerm={searchTerm}
          filters={filters}
        />
      )}

      {/* ── Deep Team Detail Modal ── */}
      <TeamDetailModal
        isOpen={isTeamModalOpen}
        team={selectedTeam}
        onClose={() => setIsTeamModalOpen(false)}
        onSelectResource={(resId) => {
          setIsTeamModalOpen(false);
          handleOpenResource(resId);
        }}
      />

      {/* ── Deep Resource Personnel Profile Modal ── */}
      <ResourceDetailModal
        isOpen={isResourceModalOpen}
        resourceId={selectedResourceId}
        onClose={() => setIsResourceModalOpen(false)}
        onSelectResource={(newResId) => setSelectedResourceId(newResId)}
      />

      {/* ── Recent Organization Changes Drawer ── */}
      <RecentChangesDrawer
        isOpen={isRecentChangesOpen}
        onClose={() => setIsRecentChangesOpen(false)}
      />
    </div>
  );
}
