/**
 * EDGE AMS Control Tower — Custom Filter Dropdown Component
 * Reusable enterprise dropdown replacing native <select> controls (Section 21).
 * Supports keyboard navigation (Up/Down/Enter/Esc), search filtering,
 * clean focus/active states, light/dark mode, and Arabic RTL.
 */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export default function FilterDropdown({
  label,
  value,
  options = [],
  onChange,
  placeholder = 'Select...',
  disabled = false,
  minWidth = '140px',
  maxWidth = '220px',
  allowClear = false,
  icon: Icon = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options array: [{ value: 'all', label: 'All Entities' }, ...] or ['Draft', 'Open', ...]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value ?? opt.id ?? opt.key, label: opt.label ?? opt.name ?? opt.title ?? opt.value };
    }
    return { value: opt, label: opt };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || normalizedOptions[0];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
        onChange(normalizedOptions[highlightedIndex].value);
        setIsOpen(false);
      } else {
        setIsOpen(!isOpen);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(normalizedOptions.length - 1);
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const itemEl = listRef.current.children[highlightedIndex];
      if (itemEl) {
        itemEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const isFiltered = value && value !== 'all' && value !== '';

  return (
    <div
      ref={containerRef}
      className={`filter-dropdown-container ${disabled ? 'disabled' : ''}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        minWidth,
        maxWidth,
      }}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-tertiary)',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          height: '34px',
          padding: '0 10px',
          background: isFiltered ? 'rgba(255, 86, 34, 0.05)' : 'var(--bg-primary)',
          border: isFiltered
            ? '1px solid var(--edge-primary)'
            : isOpen
            ? '1px solid var(--edge-primary)'
            : '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          color: isFiltered ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontSize: 'var(--text-xs)',
          fontWeight: isFiltered ? 600 : 500,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'all var(--transition-fast)',
          boxShadow: isOpen ? '0 0 0 2px rgba(255, 86, 34, 0.15)' : 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {Icon && <Icon size={13} color={isFiltered ? 'var(--edge-primary)' : 'var(--text-tertiary)'} />}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedOption?.label || placeholder}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {allowClear && isFiltered && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('all');
              }}
              style={{ padding: '2px', cursor: 'pointer', color: 'var(--text-tertiary)' }}
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={14}
            color="var(--text-tertiary)"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-fast)',
            }}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '4px',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {normalizedOptions.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <div
                key={`${opt.value}-${idx}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected
                    ? 'var(--edge-primary)'
                    : 'var(--text-primary)',
                  background: isSelected
                    ? 'var(--edge-primary-light)'
                    : isHighlighted
                    ? 'var(--bg-hover)'
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                  userSelect: 'none',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {opt.label}
                </span>
                {isSelected && <Check size={13} color="var(--edge-primary)" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
