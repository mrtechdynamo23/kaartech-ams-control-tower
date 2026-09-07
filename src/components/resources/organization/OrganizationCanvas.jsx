/**
 * EDGE AMS Control Tower — Interactive Organization Canvas
 * 
 * Main visualization canvas implementing Sections 14, 15, 16, 17, 18, 21, 22, 32, 33:
 * - 4-tier interactive hierarchy:
 *     Tier 1: AMS Leadership & SteerCom
 *     Tier 2: Business Domains (8 Core Streams)
 *     Tier 3: Capability / Process Teams
 *     Tier 4: Individual Specialized Resources
 * - Intelligent Auto-Fit: Automatically calculates scale to fit the entire flow to the screen on load
 * - Layout Modes: Panoramic Tree (horizontal branching) vs Compact Grid Flow (4x2 multi-row, fits without scaling)
 * - Quick Domain Focus pills (All, L2C, E2M, P2P, D2S, S2P, A2D, R2R, H2R)
 * - Orthogonal/curved SVG connectors with active path illumination
 * - Floating controls: Fit to Screen, Zoom In, Zoom Out, Reset, Layout Toggle
 * - Direct drill-down triggers for TeamDetailModal and ResourceDetailModal
 */
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Shield, Users, ChevronRight, ChevronDown, Plus, Minus,
  RotateCcw, Maximize2, MapPin, Award, CheckCircle2, User,
  Briefcase, CornerDownRight, Layers, Eye, Grid, Layout
} from 'lucide-react';
import { BUSINESS_DOMAINS } from '../../../data/masterData';

export default function OrganizationCanvas({
  tree,
  expandedNodeIds,
  onToggleNode,
  selectedNodeId,
  onSelectNode,
  searchMatches,
  onOpenResource,
  onOpenTeam,
  onFilterDomain,
  fitTrigger,
  onOpenChanges,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [flowMode, setFlowMode] = useState('panoramic'); // 'panoramic' | 'grid'
  
  const containerRef = useRef(null);
  const workspaceRef = useRef(null);

  const { matchedNodeIds, ancestorNodeIds, isFilterActive } = searchMatches;

  // ── Auto-Fit to Screen Engine ──
  const fitToScreen = useCallback(() => {
    if (!containerRef.current || !workspaceRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const contentWidth = workspaceRef.current.scrollWidth;
    const contentHeight = workspaceRef.current.scrollHeight;

    if (contentWidth > 0 && containerWidth > 0) {
      const scaleX = (containerWidth - 60) / contentWidth;
      const scaleY = (containerHeight - 80) / contentHeight;

      let optimalScale = Math.min(scaleX, 1.0);
      if (flowMode === 'grid') {
        optimalScale = Math.min(scaleX, scaleY, 1.0);
      }
      optimalScale = Math.max(optimalScale, 0.42);
      optimalScale = Math.round(optimalScale * 100) / 100;

      setZoom(optimalScale);
      setPan({ x: 0, y: 10 });
    }
  }, [flowMode]);

  // Handle external fitTrigger
  useEffect(() => {
    if (fitTrigger > 0) {
      fitToScreen();
    }
  }, [fitTrigger, fitToScreen]);

  // Initial auto-fit on mount & when window resizes or flowMode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToScreen();
    }, 120);
    window.addEventListener('resize', fitToScreen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', fitToScreen);
    };
  }, [fitToScreen]);

  // Zoom handlers
  const handleZoomIn = () => setZoom(z => Math.min(Math.round((z + 0.15) * 100) / 100, 1.8));
  const handleZoomOut = () => setZoom(z => Math.max(Math.round((z - 0.15) * 100) / 100, 0.35));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    if (
      e.target.closest('.org-node-interactive') ||
      e.target.closest('.resource-node') ||
      e.target.closest('.team-card') ||
      e.target.closest('.domain-card') ||
      e.target.closest('.hover-card') ||
      e.target.closest('.canvas-control-btn') ||
      e.target.closest('.domain-focus-pill') ||
      e.target.closest('.member-change-badge') ||
      e.target.closest('button')
    ) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Auto-fit when search or filter changes
  useEffect(() => {
    if (isFilterActive) {
      setPan({ x: 0, y: 0 });
    }
  }, [isFilterActive]);

  const isDimmed = (nodeId) => {
    if (!isFilterActive && !selectedNodeId) return false;
    if (isFilterActive) {
      return !matchedNodeIds.has(nodeId) && !ancestorNodeIds.has(nodeId);
    }
    return false;
  };

  return (
    <div
      ref={containerRef}
      className="organization-canvas-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '620px',
        height: 'calc(100vh - 290px)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      {/* Background Grid Pattern */}
      <div
        className="canvas-grid-pattern"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(var(--border-primary) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Canvas Controls */}
      <div
        className="canvas-floating-controls"
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-secondary)',
          padding: '4px 6px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Flow Mode Switcher: Panoramic Tree vs Grid Flow */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-secondary)' }}>
          <button
            onClick={() => setFlowMode('panoramic')}
            className={`canvas-control-btn btn-sm ${flowMode === 'panoramic' ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: flowMode === 'panoramic' ? 700 : 500,
              border: 'none',
              cursor: 'pointer',
            }}
            title="Panoramic Tree Flow"
          >
            <Layout size={12} />
            <span>Panoramic</span>
          </button>
          <button
            onClick={() => setFlowMode('grid')}
            className={`canvas-control-btn btn-sm ${flowMode === 'grid' ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: flowMode === 'grid' ? 700 : 500,
              border: 'none',
              cursor: 'pointer',
            }}
            title="Compact Multi-row Grid Flow (fits screen without scaling)"
          >
            <Grid size={12} />
            <span>Grid Flow</span>
          </button>
        </div>

        <div style={{ width: '1px', height: '18px', background: 'var(--border-secondary)', margin: '0 2px' }} />

        {/* Fit to Screen Button */}
        <button
          onClick={fitToScreen}
          className="canvas-control-btn btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--edge-primary)',
            background: 'rgba(255, 86, 34, 0.08)',
            border: '1px solid rgba(255, 86, 34, 0.25)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
          }}
          title="Auto-Fit Entire Organization Structure to Screen"
        >
          <Maximize2 size={13} />
          <span>Fit to Screen</span>
        </button>

        <div style={{ width: '1px', height: '18px', background: 'var(--border-secondary)', margin: '0 2px' }} />

        {/* Zoom Controls */}
        <button
          onClick={handleZoomIn}
          className="canvas-control-btn btn-sm"
          style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          title="Zoom In"
        >
          <Plus size={14} />
        </button>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '38px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleZoomOut}
          className="canvas-control-btn btn-sm"
          style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          title="Zoom Out"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleResetZoom}
          className="canvas-control-btn btn-sm"
          style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          title="Reset to 100%"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Top Legend Bar with Quick Domain Focus Pills */}
      <div
        className="canvas-legend"
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        {/* Color Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-secondary)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-sm)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-green)' }} />
            <span>Onsite (UAE HQ)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-blue)' }} />
            <span>Offshore Delivery</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--edge-primary)' }} />
            <span>Leads & Command</span>
          </div>
        </div>

        {/* Quick Domain Focus Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-secondary)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
            pointerEvents: 'auto',
            overflowX: 'auto',
            maxWidth: '100%',
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginRight: '4px' }}>
            Focus:
          </span>
          <button
            onClick={() => {
              if (onFilterDomain) onFilterDomain('all');
              setTimeout(fitToScreen, 100);
            }}
            className="domain-focus-pill"
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 700,
              background: !searchMatches.isFilterActive ? 'var(--edge-primary)' : 'transparent',
              color: !searchMatches.isFilterActive ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            All 8
          </button>
          {BUSINESS_DOMAINS.map(d => {
            const isSelected = searchMatches.matchedNodeIds.has(`domain-${d.key}`);
            return (
              <button
                key={d.key}
                onClick={() => {
                  if (onFilterDomain) onFilterDomain(d.key);
                  setTimeout(fitToScreen, 100);
                }}
                className="domain-focus-pill"
                style={{
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700,
                  background: isSelected ? 'rgba(255, 86, 34, 0.15)' : 'transparent',
                  color: isSelected ? 'var(--edge-primary)' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid rgba(255, 86, 34, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
                title={d.label}
              >
                {d.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scalable & Pannable Workspace */}
      <div
        ref={workspaceRef}
        className="canvas-workspace"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: '60px 40px 140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 'max-content',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════
            LEVEL 1: AMS LEADERSHIP / STEERCOM NODE
            ════════════════════════════════════════════════════════════════ */}
        <div
          className="org-node-tier1 org-node-interactive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          {/* Main Leadership Command Card */}
          <div
            onClick={() => onSelectNode(tree.id)}
            style={{
              width: '460px',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(255, 86, 34, 0.08) 100%)',
              border: selectedNodeId === tree.id ? '2px solid var(--edge-primary)' : '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '18px 20px',
              boxShadow: selectedNodeId === tree.id
                ? '0 10px 25px -5px rgba(255, 86, 34, 0.3)'
                : '0 8px 24px -4px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {/* Top Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: 'var(--edge-primary)',
                    letterSpacing: '0.06em',
                    background: 'rgba(255, 86, 34, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  TIER 1 · AMS STEERCOM
                </span>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                  Active Operational Command
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                30 Dedicated FTEs
              </span>
            </div>

            {/* SteerCom Director Profile */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onOpenResource('LEAD-01');
              }}
              className="org-node-interactive hover-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Click to view Dr. Tariq Al Nuaimi (Program Director) profile"
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--edge-primary) 0%, #B82B10 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                  boxShadow: '0 4px 10px rgba(255, 86, 34, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  flexShrink: 0,
                }}
              >
                TN
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {tree.director.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--edge-primary)', fontWeight: 600 }}>
                  {tree.director.role} • {tree.director.entity}
                </div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--edge-primary)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                Profile →
              </span>
            </div>

            {/* Sub-Command Leads: Operational & Governance */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                borderTop: '1px solid var(--border-secondary)',
                paddingTop: '10px',
              }}
            >
              {/* Delivery Lead */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenResource(tree.deliveryLead.id);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                className="hover-card"
                title="Click to view Fatima Al Zaabi profile"
              >
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Delivery Lead
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {tree.deliveryLead.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--edge-primary)', marginTop: '1px' }}>
                  Operational Command
                </div>
              </div>

              {/* Quality Lead */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenResource(tree.governanceLead.id);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                className="hover-card"
                title="Click to view Sara Al Marzouqi profile"
              >
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Quality & Governance
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {tree.governanceLead.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-green)', marginTop: '1px' }}>
                  Audit & Compliance
                </div>
              </div>
            </div>
          </div>

          {/* Stem Connector Downwards */}
          <div
            style={{
              width: '2px',
              height: '32px',
              background: 'var(--edge-primary)',
              opacity: 0.6,
            }}
          />
        </div>

        {/* ════════════════════════════════════════════════════════════════
            LEVEL 2: BUSINESS DOMAINS (Panoramic or Grid Flow)
            ════════════════════════════════════════════════════════════════ */}
        <div
          className={flowMode === 'grid' ? 'org-domains-grid-flow' : 'org-domains-rail'}
          style={flowMode === 'grid' ? {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 260px)',
            gap: '20px',
            position: 'relative',
            paddingTop: '20px',
          } : {
            display: 'flex',
            gap: '24px',
            position: 'relative',
            paddingTop: '20px',
          }}
        >
          {/* Top connecting bar across all domains in panoramic mode */}
          {flowMode === 'panoramic' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '120px',
                right: '120px',
                height: '2px',
                background: 'var(--border-primary)',
              }}
            />
          )}

          {tree.children.map((domain) => {
            const isDomainExpanded = expandedNodeIds.has(domain.id);
            const isDomainMatched = matchedNodeIds.has(domain.id);
            const isDomainSelected = selectedNodeId === domain.id;
            const dimmed = isDimmed(domain.id);

            return (
              <div
                key={domain.id}
                className={`org-domain-column ${dimmed ? 'node-dimmed' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '260px',
                  position: 'relative',
                  opacity: dimmed ? 0.35 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {/* Vertical drop line from top rail to domain node (panoramic mode) */}
                {flowMode === 'panoramic' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      width: '2px',
                      height: '20px',
                      background: isDomainMatched || isDomainSelected ? 'var(--edge-primary)' : 'var(--border-primary)',
                    }}
                  />
                )}

                {/* Domain Node Card */}
                <div
                  className="org-node-interactive domain-card"
                  onClick={() => onSelectNode(domain.id)}
                  style={{
                    width: '260px',
                    background: 'var(--bg-card)',
                    border: isDomainSelected
                      ? '2px solid var(--edge-primary)'
                      : isDomainMatched
                      ? '2px solid rgba(255, 86, 34, 0.6)'
                      : '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 16px',
                    boxShadow: isDomainSelected
                      ? '0 6px 20px rgba(255, 86, 34, 0.25)'
                      : 'var(--card-shadow)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                  }}
                >
                  {/* Domain Code & Resource Count */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: 'var(--edge-primary)',
                          background: 'rgba(255, 86, 34, 0.1)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {domain.code}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {domain.teamCount} Teams
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        background: 'var(--bg-secondary)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                      }}
                    >
                      {domain.resourceCount} Staff
                    </span>
                  </div>

                  {/* Domain Title + Member Change Count Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                        minWidth: 0,
                      }}
                      title={domain.name}
                    >
                      {domain.name}
                    </div>
                    {domain.memberChangeCount > 0 && (
                      <button
                        type="button"
                        className="member-change-badge"
                        title={`${domain.memberChangeCount} member change${domain.memberChangeCount > 1 ? 's' : ''} in this domain`}
                        aria-label={`${domain.memberChangeCount} member changes`}
                        onClick={(e) => {
                          if (onOpenChanges) {
                            e.stopPropagation();
                            onOpenChanges();
                          }
                        }}
                      >
                        [{domain.memberChangeCount}]
                      </button>
                    )}
                  </div>

                  {/* Domain Lead Info */}
                  <div
                    onClick={(e) => {
                      if (domain.lead) {
                        e.stopPropagation();
                        onOpenResource(domain.lead.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      padding: '6px 8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                    className="hover-card"
                    title={`Click to view Domain Lead: ${domain.lead ? domain.lead.name : 'Unassigned'}`}
                  >
                    <div>
                      <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Domain Lead</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                        {domain.lead ? domain.lead.name : 'Domain Lead'}
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--edge-primary)', fontWeight: 600 }}>
                      Profile →
                    </span>
                  </div>

                  {/* Location Mix Breakdown */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: 'var(--text-secondary)' }}>
                    <span>Onsite: <strong>{domain.onsiteCount}</strong></span>
                    <span>Offshore: <strong>{domain.offshoreCount}</strong></span>
                  </div>

                  {/* Expand / Collapse Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleNode(domain.id);
                    }}
                    style={{
                      marginTop: '10px',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--edge-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{isDomainExpanded ? 'Hide Teams' : `View ${domain.teamCount} Teams`}</span>
                    {isDomainExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </div>

                {/* ════════════════════════════════════════════════════════════════
                    LEVEL 3: CAPABILITY / PROCESS TEAMS
                    ════════════════════════════════════════════════════════════════ */}
                {isDomainExpanded && (
                  <div
                    className="org-teams-container"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginTop: '16px',
                      position: 'relative',
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    {/* Vertical connector line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2px',
                        height: '16px',
                        background: 'var(--edge-primary)',
                        opacity: 0.5,
                      }}
                    />

                    {domain.children.map(team => {
                      const isTeamExpanded = expandedNodeIds.has(team.id);
                      const isTeamMatched = matchedNodeIds.has(team.id);
                      const isTeamSelected = selectedNodeId === team.id;
                      const teamDimmed = isDimmed(team.id);

                      return (
                        <div
                          key={team.id}
                          className={`org-team-unit ${teamDimmed ? 'node-dimmed' : ''}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            opacity: teamDimmed ? 0.35 : 1,
                            transition: 'opacity 0.2s ease',
                          }}
                        >
                          {/* Team Node Card */}
                          <div
                            className="org-node-interactive team-card"
                            onClick={() => onSelectNode(team.id)}
                            style={{
                              width: '240px',
                              background: 'var(--bg-secondary)',
                              border: isTeamSelected
                                ? '2px solid var(--edge-primary)'
                                : isTeamMatched
                                ? '1.5px solid var(--edge-primary)'
                                : '1px solid var(--border-secondary)',
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 12px',
                              boxShadow: 'var(--card-shadow)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                                Capability Unit
                              </span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  color: 'var(--text-primary)',
                                  background: 'var(--bg-card)',
                                  padding: '1px 5px',
                                  borderRadius: '6px',
                                }}
                              >
                                {team.resourceCount} Staff
                              </span>
                            </div>

                            {/* Team Title + Member Change Count Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '2px' }}>
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  color: 'var(--text-primary)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  flex: 1,
                                  minWidth: 0,
                                }}
                                title={team.name}
                              >
                                {team.name}
                              </div>
                              {team.memberChangeCount > 0 && (
                                <button
                                  type="button"
                                  className="member-change-badge"
                                  title={`${team.memberChangeCount} member change${team.memberChangeCount > 1 ? 's' : ''} for this posting`}
                                  aria-label={`${team.memberChangeCount} member changes`}
                                  onClick={(e) => {
                                    if (onOpenChanges) {
                                      e.stopPropagation();
                                      onOpenChanges();
                                    }
                                  }}
                                >
                                  [{team.memberChangeCount}]
                                </button>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '10px', color: 'var(--text-secondary)' }}>
                              <span
                                onClick={(e) => {
                                  if (team.lead) {
                                    e.stopPropagation();
                                    onOpenResource(team.lead.id);
                                  }
                                }}
                                style={{ cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600 }}
                                title={`Click to view team lead: ${team.lead ? team.lead.name : 'Lead'}`}
                              >
                                Lead: {team.lead ? team.lead.name.split(' ')[0] : 'Lead'}
                              </span>
                              <span>•</span>
                              <span>{team.onsiteCount} Onsite · {team.offshoreCount} Offshore</span>
                            </div>

                            {/* Actions bar */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '8px',
                                paddingTop: '6px',
                                borderTop: '1px solid var(--border-primary)',
                                fontSize: '10px',
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenTeam(team);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--edge-primary)',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  padding: 0,
                                }}
                              >
                                <Layers size={10} /> Team Details
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleNode(team.id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--text-secondary)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  padding: 0,
                                }}
                              >
                                {isTeamExpanded ? 'Hide' : `Show (${team.resourceCount})`}
                                {isTeamExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                              </button>
                            </div>
                          </div>

                          {/* ════════════════════════════════════════════════════════════════
                              LEVEL 4: INDIVIDUAL RESOURCES
                              ════════════════════════════════════════════════════════════════ */}
                          {isTeamExpanded && (
                            <div
                              className="org-resources-container"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                marginTop: '8px',
                                width: '100%',
                                alignItems: 'center',
                                position: 'relative',
                              }}
                            >
                              {team.members.map(memberNode => {
                                const member = memberNode.data;
                                const isMemberMatched = matchedNodeIds.has(memberNode.id);
                                const isMemberSelected = selectedNodeId === memberNode.id;
                                const memberDimmed = isDimmed(memberNode.id);

                                return (
                                  <div
                                    key={memberNode.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectNode(memberNode.id);
                                      onOpenResource(member.id);
                                    }}
                                    className={`org-node-interactive resource-node ${memberDimmed ? 'node-dimmed' : ''}`}
                                    style={{
                                      width: '220px',
                                      position: 'relative',
                                      background: 'var(--bg-card)',
                                      border: isMemberSelected
                                        ? '2px solid var(--edge-primary)'
                                        : isMemberMatched
                                        ? '2px solid var(--edge-primary)'
                                        : '1.5px solid var(--border-primary)',
                                      borderRadius: 'var(--radius-sm)',
                                      padding: '8px 10px',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                      boxShadow: isMemberSelected ? '0 4px 12px rgba(255, 86, 34, 0.2)' : 'var(--card-shadow)',
                                      opacity: memberDimmed ? 0.35 : 1,
                                    }}
                                    title={`Click to inspect specialist profile: ${member.name} (${member.id})`}
                                  >
                                    {(memberNode.memberChangeCount > 0) && (
                                      <span
                                        className="member-change-badge"
                                        title={`${memberNode.memberChangeCount} member changes for this posting`}
                                        style={{
                                          position: 'absolute',
                                          top: '4px',
                                          right: '6px',
                                          background: 'rgba(255, 86, 34, 0.12)',
                                          color: 'var(--edge-primary)',
                                          border: '1px solid rgba(255, 86, 34, 0.3)',
                                          borderRadius: '10px',
                                          fontSize: '9px',
                                          fontWeight: 700,
                                          padding: '0 5px',
                                          lineHeight: '14px',
                                          pointerEvents: 'none',
                                          zIndex: 2,
                                        }}
                                      >
                                        {memberNode.memberChangeCount}
                                      </span>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {/* Status Dot + Initials */}
                                      <div
                                        style={{
                                          width: '26px',
                                          height: '26px',
                                          borderRadius: '50%',
                                          background: member.location === 'Onsite' ? 'var(--color-green)' : 'var(--color-blue)',
                                          color: 'white',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontWeight: 700,
                                          fontSize: '10px',
                                          flexShrink: 0,
                                        }}
                                      >
                                        {member.name.charAt(0)}
                                      </div>

                                      <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {member.name}
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {member.role}
                                        </div>
                                      </div>

                                      <span
                                        className="badge badge-neutral"
                                        style={{ fontSize: '9px', padding: '1px 4px', flexShrink: 0 }}
                                      >
                                        {member.track.replace('AMS-', '')}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
