import React, { useMemo, useState } from 'react';
import { X, AlertTriangle, Check, Clock3 } from 'lucide-react';
import {
  masterEmployees, ANNUAL_LEAVE_NOTICE_DAYS, requiresCompanyApproval, daysBetween,
  getEffortSplit, type LeaveRecord, type LeaveType, type TimesheetEntry,
} from '../../data/master-employees';

/**
 * APPLY LEAVE · APPROVE LEAVE · TIMESHEET ENTRY
 * ---------------------------------------------------------------------------
 * These encode SOW Appendix 1 clauses rather than a generic HR workflow:
 *
 *   §7.6  Annual leave needs COMPANY REPRESENTATIVE approval with at least two
 *         weeks notice. Sick leave and personal emergency are notifications —
 *         never gated behind approval.
 *   §7.1  A backup or replacement must be assigned for any absence, so a
 *         request with no named backup cannot be submitted.
 *   §2.4.1(d)  Timesheets feed the monthly Effort / Service Consumption
 *         Report, which is why effort is booked RUN or CHANGE — that split is
 *         what decides fixed fee versus chargeable Elastic capacity.
 *
 * These buttons carry no real approval authority. The data is illustrative.
 */

const shell: React.CSSProperties = {
  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: '100%', maxWidth: 640, maxHeight: '86vh', overflowY: 'auto',
  background: 'var(--surface-raised, #FFFFFF)', borderRadius: 14,
  boxShadow: '0 20px 48px rgba(0,0,0,0.22)', zIndex: 1301,
  display: 'flex', flexDirection: 'column',
};
const backdrop: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(3px)', zIndex: 1300,
};
const label: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 5,
};
const field: React.CSSProperties = {
  width: '100%', padding: '8px 11px', borderRadius: 6,
  border: '1px solid var(--input-border, #D0D5DD)', fontSize: '0.8125rem',
  background: 'var(--input-bg, #FFFFFF)', color: 'var(--input-text, #101828)', outline: 'none',
};
const clause: React.CSSProperties = {
  fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 4, fontStyle: 'italic',
};

const Header: React.FC<{ title: string; sub: string; onClose: () => void }> = ({ title, sub, onClose }) => (
  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border, #E4E7EC)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <div>
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text, #101828)' }}>{title}</h3>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>{sub}</span>
    </div>
    <button onClick={onClose} aria-label="Close"
      style={{ background: 'var(--bg-secondary, #F1F5F9)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: 'var(--text-secondary, #475467)' }}>
      <X size={16} />
    </button>
  </div>
);

const Notice: React.FC<{ tone: 'warn' | 'ok'; children: React.ReactNode }> = ({ tone, children }) => (
  <div style={{
    display: 'flex', gap: 9, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 7,
    background: tone === 'warn' ? '#FFFAEB' : '#ECFDF3',
    border: `1px solid ${tone === 'warn' ? '#FEDF89' : '#ABEFC6'}`,
    fontSize: '0.75rem', lineHeight: 1.55, color: tone === 'warn' ? '#93370D' : '#085D3A',
  }}>
    {tone === 'warn' ? <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> : <Check size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
    <div>{children}</div>
  </div>
);

// ─── APPLY LEAVE ───────────────────────────────────────────────────────
export const ApplyLeaveModal: React.FC<{
  onClose: () => void;
  onSubmit: (d: { employee: string; leaveType: LeaveType; startDate: string; endDate: string; reason: string; backupResource: string }) => void;
}> = ({ onClose, onSubmit }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [employee, setEmployee] = useState(masterEmployees[0]?.name ?? '');
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [backupResource, setBackupResource] = useState('');

  const needsApproval = requiresCompanyApproval(leaveType);
  const noticeDays = startDate ? daysBetween(today, startDate) : null;
  const shortNotice = needsApproval && noticeDays !== null && noticeDays < ANNUAL_LEAVE_NOTICE_DAYS;
  const days = startDate && endDate ? daysBetween(startDate, endDate) + 1 : 0;
  const backups = useMemo(() => masterEmployees.filter((e) => e.name !== employee), [employee]);
  const valid = employee && startDate && endDate && days > 0 && reason.trim() && backupResource;

  return (
    <>
      <div style={backdrop} onClick={onClose} />
      <div style={shell} role="dialog" aria-label="Apply for leave">
        <Header title="Apply for Leave" sub="SOW Appendix 1 §7.6 — notice and approval; §7.1 — named backup" onClose={onClose} />
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) { onSubmit({ employee, leaveType, startDate, endDate, reason, backupResource }); onClose(); } }}
          style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <div>
            <label style={label} htmlFor="al-emp">Resource</label>
            <select id="al-emp" style={field} value={employee} onChange={(e) => setEmployee(e.target.value)}>
              {masterEmployees.map((e) => (
                <option key={e.employeeId} value={e.name}>{e.name} — {e.role} ({e.commitment})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={label} htmlFor="al-type">Leave type</label>
            <select id="al-type" style={field} value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)}>
              {(['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Training Leave'] as LeaveType[]).map((t) => <option key={t}>{t}</option>)}
            </select>
            <div style={clause}>
              {needsApproval
                ? '§7.6 — annual leave requires COMPANY REPRESENTATIVE approval, at least two weeks in advance.'
                : '§7.6 — sick leave and personal emergency are notifications to the COMPANY REPRESENTATIVE, not approvals.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 180px' }}>
              <label style={label} htmlFor="al-start">First day</label>
              <input id="al-start" type="date" style={field} value={startDate} min={today} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div style={{ flex: '1 1 180px' }}>
              <label style={label} htmlFor="al-end">Last day</label>
              <input id="al-end" type="date" style={field} value={endDate} min={startDate || today} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>

          {noticeDays !== null && (
            shortNotice
              ? <Notice tone="warn">
                  <strong>{noticeDays} days notice.</strong> SOW §7.6 requires a minimum of{' '}
                  {ANNUAL_LEAVE_NOTICE_DAYS} days for annual leave. This request can be submitted, but it will be
                  flagged to the COMPANY REPRESENTATIVE as non-compliant with the notice period.
                </Notice>
              : <Notice tone="ok">
                  {noticeDays} days notice{days > 0 ? ` · ${days} calendar day${days === 1 ? '' : 's'} of leave` : ''}
                  {needsApproval ? ' — meets the §7.6 two-week requirement.' : ' — notification only under §7.6.'}
                </Notice>
          )}

          <div>
            <label style={label} htmlFor="al-backup">Named backup <span style={{ color: '#B54708' }}>· required</span></label>
            <select id="al-backup" style={field} value={backupResource} onChange={(e) => setBackupResource(e.target.value)} required>
              <option value="">Select the resource covering this absence…</option>
              {backups.map((e) => <option key={e.employeeId} value={e.name}>{e.name} — {e.role}</option>)}
            </select>
            <div style={clause}>§7.1 — the CONTRACTOR shall assign a backup or replacement to ensure continuity of the service.</div>
          </div>

          <div>
            <label style={label} htmlFor="al-reason">Reason</label>
            <input id="al-reason" type="text" style={field} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Brief reason for the request" required />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '9px 16px', borderRadius: 7, border: '1px solid var(--border, #D0D5DD)', background: 'transparent', color: 'var(--text-secondary, #475467)', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={!valid} style={{ padding: '9px 18px', borderRadius: 7, border: 'none', background: valid ? 'var(--brand-ink, #0D4C93)' : 'var(--bg-tertiary, #E4E7EC)', color: valid ? '#FFFFFF' : 'var(--text-tertiary, #98A2B3)', fontWeight: 700, fontSize: '0.8125rem', cursor: valid ? 'pointer' : 'not-allowed' }}>
              {needsApproval ? 'Submit for COMPANY approval' : 'Record notification'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// ─── APPROVE LEAVE ─────────────────────────────────────────────────────
export const ApproveLeaveModal: React.FC<{
  pending: LeaveRecord[];
  onClose: () => void;
  onApprove: (id: string, reason?: string) => void;
  onDecline: (id: string, reason: string) => void;
}> = ({ pending, onClose, onApprove, onDecline }) => {
  const [reasons, setReasons] = useState<Record<string, string>>({});

  return (
    <>
      <div style={backdrop} onClick={onClose} />
      <div style={{ ...shell, maxWidth: 760 }} role="dialog" aria-label="Approve leave requests">
        <Header title="Approve Leave" sub={`${pending.length} request${pending.length === 1 ? '' : 's'} awaiting the COMPANY REPRESENTATIVE — SOW §7.6`} onClose={onClose} />
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pending.length === 0 && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #475467)' }}>
              No annual leave awaiting approval. Sick and emergency leave are recorded as notifications under §7.6 and never appear here.
            </div>
          )}
          {pending.map((r) => (
            <div key={r.id} style={{ border: '1px solid var(--border, #E4E7EC)', borderRadius: 9, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--card-bg, #FFFFFF)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text, #101828)' }}>{r.employee} — {r.leaveType}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
                    {r.startDate} to {r.endDate} · {r.days} days · {r.tower}
                  </div>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-ink, #0D4C93)' }}>{r.id}</span>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
                Backup: <strong style={{ color: 'var(--text, #101828)' }}>{r.backupResource || '— none named —'}</strong> · Reason: {r.reason}
              </div>

              {!r.noticeCompliant ? (
                <Notice tone="warn">
                  <strong>Notice period breached.</strong> Submitted {r.noticeDays} days before the first day of leave;
                  SOW §7.6 requires {ANNUAL_LEAVE_NOTICE_DAYS}. Approving accepts a departure from the clause.
                </Notice>
              ) : (
                <Notice tone="ok">{r.noticeDays} days notice — meets the §7.6 two-week requirement.</Notice>
              )}

              <input
                type="text" style={field} placeholder="Decision note (required to decline)"
                value={reasons[r.id] ?? ''} onChange={(e) => setReasons((p) => ({ ...p, [r.id]: e.target.value }))}
                aria-label={`Decision note for ${r.id}`}
              />

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onDecline(r.id, reasons[r.id] || 'Declined by COMPANY REPRESENTATIVE')}
                  style={{ padding: '7px 14px', borderRadius: 6, background: '#FFEBE6', color: '#DE350B', border: '1px solid rgba(222,53,11,0.3)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                >Decline</button>
                <button
                  onClick={() => onApprove(r.id, reasons[r.id] || undefined)}
                  style={{ padding: '7px 16px', borderRadius: 6, background: '#22A06B', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                >Approve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── TIMESHEET ENTRY ───────────────────────────────────────────────────
export const TimesheetModal: React.FC<{
  entries: TimesheetEntry[];
  onClose: () => void;
  onSubmitEntry: (id: string) => void;
  onApproveEntry: (id: string) => void;
}> = ({ entries, onClose, onSubmitEntry, onApproveEntry }) => {
  const split = useMemo(() => getEffortSplit(entries), [entries]);

  return (
    <>
      <div style={backdrop} onClick={onClose} />
      <div style={{ ...shell, maxWidth: 900 }} role="dialog" aria-label="Timesheet entry">
        <Header
          title="Timesheet Entry"
          sub="Week ending 27 August 2026 — feeds the monthly Effort / Service Consumption Report (SOW §2.4.1 d)"
          onClose={onClose}
        />
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            {[
              ['RUN effort', `${split.runHours} h`, `${split.runPct}% — inside the fixed monthly fee`, 'var(--brand-ink, #0D4C93)'],
              ['CHANGE (Elastic)', `${split.changeHours} h`, `${split.changePct}% — chargeable, needs call-off`, '#B54708'],
              ['Total booked', `${split.totalHours} h`, 'across the AMS team this week', 'var(--text, #101828)'],
              ['Awaiting approval', String(split.awaitingApproval), 'draft or submitted entries', '#B54708'],
            ].map(([t, v, n, c]) => (
              <div key={t} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border, #E4E7EC)', background: 'var(--card-bg, #FFFFFF)' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary, #475467)' }}>{t}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: c, marginTop: 3 }}>{v}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>{n}</div>
              </div>
            ))}
          </div>

          <Notice tone="warn">
            The RUN / CHANGE boundary is <strong>INT-01</strong> in the interpretation register and is not yet confirmed
            by COMPANY — SOW §2 and §10.5 say ten business days, §4.2 says twenty. Annex 2 names COMPANY's hourly
            registration system as the measurement tool for TPM1 and TPM2, so this register reconciles to it rather
            than replacing it.
          </Notice>

          <div style={{ overflowX: 'auto', border: '1px solid var(--border, #E4E7EC)', borderRadius: 8 }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720, fontSize: '0.8125rem' }}>
              <thead>
                <tr>
                  {['Resource', 'Track', 'Activity', 'Reference', 'Hours', 'Status', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '9px 12px', background: 'var(--bg-secondary, #F8FAFC)', borderBottom: '1px solid var(--border, #E4E7EC)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary, #475467)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border, #E4E7EC)', fontWeight: 700, color: 'var(--text, #101828)', whiteSpace: 'nowrap' }}>{e.employee}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border, #E4E7EC)', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, color: e.track === 'RUN' ? 'var(--brand-ink, #0D4C93)' : '#B54708', border: `1px solid ${e.track === 'RUN' ? 'var(--brand-ink, #0D4C93)' : '#B54708'}` }}>{e.track}</span>
                    </td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border, #E4E7EC)', color: 'var(--text-secondary, #475467)' }}>{e.activity}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border, #E4E7EC)', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary, #475467)', whiteSpace: 'nowrap' }}>{e.reference}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border, #E4E7EC)', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--text, #101828)' }}>{e.hours}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border, #E4E7EC)', whiteSpace: 'nowrap', color: e.status === 'Approved' ? '#22A06B' : e.status === 'Submitted' ? '#B54708' : 'var(--text-tertiary, #98A2B3)', fontWeight: 700, fontSize: '0.75rem' }}>{e.status}</td>
                    <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border, #E4E7EC)', whiteSpace: 'nowrap' }}>
                      {e.status === 'Draft' && (
                        <button onClick={() => onSubmitEntry(e.id)} style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid var(--brand-ink, #0D4C93)', background: 'transparent', color: 'var(--brand-ink, #0D4C93)', fontWeight: 700, fontSize: '0.6875rem', cursor: 'pointer' }}>Submit</button>
                      )}
                      {e.status === 'Submitted' && (
                        <button onClick={() => onApproveEntry(e.id)} style={{ padding: '4px 10px', borderRadius: 5, border: 'none', background: '#22A06B', color: '#FFFFFF', fontWeight: 700, fontSize: '0.6875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock3 size={11} /> Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
