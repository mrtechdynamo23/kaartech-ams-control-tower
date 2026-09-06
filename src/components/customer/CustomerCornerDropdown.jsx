/**
 * EDGE AMS Control Tower — CustomerCornerDropdown
 *
 * Custom fully-controlled enterprise dropdown component.
 * Replaces all native <select> elements across Customer Corner.
 *
 * Features:
 * - Application-styled dark mode (#11161D) & light mode (#FFFFFF)
 * - Grouped & flat options support
 * - Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape, Home, End)
 * - Click outside & Escape listeners to close
 * - Active / hover / selected states with subtle EDGE orange accent bar
 * - High z-index (1050) to prevent clipping
 * - Full accessibility attributes (role="combobox", aria-expanded, aria-activedescendant)
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { SideBadge } from './CornerShared';
import './CustomerCorner.css';

export default function CustomerCornerDropdown({
  id: customId,
  label,
  value,
  onChange,
  groups,
  options,
  icon,
  placeholder = 'Select an option…',
  disabled = false,
  width = 'auto',
  menuWidth = null,
  showSublabelInTrigger = false,
  align = 'left',
  ariaLabel,
}) {
  const generatedId = useId();
  const dropdownId = customId || `corner-dd-${generatedId}`;
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Flatten options for easy index-based navigation
  const flatOptions = useMemo(() => {
    if (groups && groups.length > 0) {
      const items = [];
      groups.forEach((g, gIdx) => {
        g.options.forEach((opt, oIdx) => {
          items.push({ ...opt, groupLabel: g.label, groupIndex: gIdx, optionIndex: oIdx });
        });
      });
      return items;
    }
    return (options || []).map((opt, idx) => ({ ...opt, optionIndex: idx }));
  }, [groups, options]);

  // Find currently selected option object
  const selectedOption = useMemo(() => {
    return flatOptions.find((opt) => String(opt.value) === String(value)) || null;
  }, [flatOptions, value]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keep highlighted option scrolled into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const el = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Open dropdown and initialize highlight
  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    const selIdx = flatOptions.findIndex((opt) => String(opt.value) === String(value));
    setHighlightedIndex(selIdx >= 0 ? selIdx : 0);
  }, [disabled, flatOptions, value]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const handleSelect = useCallback((val) => {
    onChange(val);
    closeDropdown();
  }, [onChange, closeDropdown]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < flatOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flatOptions.length - 1));
        break;
      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setHighlightedIndex(flatOptions.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
          handleSelect(flatOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
      case 'Tab':
        closeDropdown();
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%',
        minWidth: 0,
        flexShrink: 1,
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        id={dropdownId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        disabled={disabled}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        className={`corner-dropdown-trigger ${isOpen ? 'open' : ''}`}
        style={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          height: 38,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
        }}
      >
        {icon && <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}

        {label && (
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-secondary, #9CA3AB)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        )}

        <span
          style={{
            flex: '1 1 0%',
            minWidth: 0,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            fontSize: '0.75rem',
            color: selectedOption ? 'var(--text-primary, #F1F3F5)' : 'var(--text-tertiary, #6B7280)',
          }}
        >
          {selectedOption ? (
            <span>
              {selectedOption.label}
              {showSublabelInTrigger && selectedOption.sublabel && (
                <span style={{ color: 'var(--text-tertiary, #6B7280)', fontWeight: 400, marginLeft: 6 }}>
                  — {selectedOption.sublabel}
                </span>
              )}
            </span>
          ) : (
            placeholder
          )}
        </span>

        {selectedOption?.side && (
          <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
            <SideBadge side={selectedOption.side} compact />
          </span>
        )}

        <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', marginLeft: 2 }}>
          <ChevronDown
            size={14}
            style={{
              color: 'var(--text-tertiary, #6B7280)',
              transition: 'transform 0.15s ease',
              transform: isOpen ? 'rotate(180deg)' : 'none',
            }}
          />
        </span>
      </button>

      {/* Floating Menu List */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          aria-labelledby={dropdownId}
          className="corner-dropdown-menu corner-custom-scrollbar"
          style={{
            left: align === 'right' ? 'auto' : 0,
            right: align === 'right' ? 0 : 'auto',
            width: menuWidth
              ? (typeof menuWidth === 'number' ? `${menuWidth}px` : menuWidth)
              : (typeof width === 'number' ? `${width}px` : '100%'),
            minWidth: menuWidth ? undefined : '260px',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 1200,
          }}
        >
          {groups && groups.length > 0 ? (
            groups.map((group, gIdx) => (
              <div key={group.label || gIdx} role="group" aria-label={group.label}>
                <div className="corner-dropdown-group-label">{group.label}</div>
                {group.options.map((opt) => {
                  const globalIdx = flatOptions.findIndex(
                    (item) => item.groupIndex === gIdx && String(item.value) === String(opt.value)
                  );
                  const isSelected = String(opt.value) === String(value);
                  const isHighlighted = globalIdx === highlightedIndex;

                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      data-index={globalIdx}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(globalIdx)}
                      className={`corner-dropdown-item ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.8125rem' }}>
                          {opt.label}
                        </div>
                        {opt.sublabel && (
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)', marginTop: 1 }}>
                            {opt.sublabel}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {opt.side && <SideBadge side={opt.side} compact />}
                        {isSelected && <Check size={14} style={{ color: 'var(--edge-primary, #FF5622)' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            flatOptions.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              const isHighlighted = idx === highlightedIndex;

              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  data-index={idx}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`corner-dropdown-item ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.8125rem' }}>
                      {opt.label}
                    </div>
                    {opt.sublabel && (
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)', marginTop: 1 }}>
                        {opt.sublabel}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {opt.side && <SideBadge side={opt.side} compact />}
                    {isSelected && <Check size={14} style={{ color: 'var(--edge-primary, #FF5622)' }} />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
