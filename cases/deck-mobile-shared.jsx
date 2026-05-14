// proto/mobile-shared.jsx — tokens, Kicker, Sparkline, Rail, Sheet, Toast, ImageSlot, useDeckNav

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Tokens — mirror the site's CSS vars (cream + forest editorial)
// ─────────────────────────────────────────────────────────────
const C = {
  bg: '#F2EBDA',
  bg2: '#E8E0CC',
  cream: '#FAF6EA',
  ink: '#1B2A1B',
  ink2: '#2D4A2B',
  muted: '#7A8A7A',
  line: 'rgba(27,42,27,0.14)',
  accent: '#C76F3D',          // terracotta
  olive: '#5E7030',
  forest: '#2D4A2B',
  pop: '#D9B65A',             // mustard (deck-em italic)
  card: '#FFFFFF',
};

const FONT = {
  display: "'Fraunces', Georgia, serif",
  italic: "'Instrument Serif', Georgia, serif",
  body: "'Inter Tight', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

// ─────────────────────────────────────────────────────────────
// Kicker — sticky mono uppercase top strip (CS / 0N · Title · N/T)
// ─────────────────────────────────────────────────────────────
function Kicker({ code, name, idx, total, dark = false }) {
  const fg = dark ? 'rgba(242,235,218,0.78)' : 'rgba(27,42,27,0.62)';
  return (
    <header style={{
      position: 'absolute', top: 'max(54px, env(safe-area-inset-top))',
      left: 20, right: 20, display: 'flex', justifyContent: 'space-between',
      fontFamily: FONT.mono, fontWeight: 600, fontSize: 10,
      letterSpacing: '0.22em', textTransform: 'uppercase', color: fg,
      zIndex: 5, pointerEvents: 'none',
    }}>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {code} · {name}
      </span>
      <span style={{ flexShrink: 0, marginLeft: 12 }}>
        {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Sparkline — replaces Recharts on mobile (inline SVG, ~40 lines)
// ─────────────────────────────────────────────────────────────
function Sparkline({ data, color = C.accent, height = 44, fill = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 200;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' L ');
  const gid = `g-${color.replace('#', '')}-${Math.round(Math.random() * 999)}`;
  return (
    <svg viewBox={`0 0 200 ${height}`} preserveAspectRatio="none"
         style={{ width: '100%', height, display: 'block' }}>
      {fill && (
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={`M 0,${height} L ${pts} L 200,${height} Z`} fill={`url(#${gid})`} />}
      <path d={`M ${pts}`} fill="none" stroke={color} strokeWidth="1.8"
            strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="200" r="3" fill={color}
              cy={height - ((data[data.length - 1] - min) / range) * (height - 6) - 3} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// ImageSlot — placeholder for assets Claude Code will wire later
// ─────────────────────────────────────────────────────────────
function ImageSlot({ src, label, ratio = '4 / 5', dark = false, tint = C.bg2 }) {
  if (src) {
    return (
      <div style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', borderRadius: 14 }}>
        <img src={src} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
        }} />
      </div>
    );
  }
  return (
    <div style={{
      position: 'relative', aspectRatio: ratio, borderRadius: 14,
      background: `repeating-linear-gradient(135deg, ${tint} 0 8px, ${dark ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.04)'} 8px 16px)`,
      border: `1px dashed ${dark ? 'rgba(242,235,218,0.32)' : 'rgba(27,42,27,0.18)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 12, textAlign: 'center',
    }}>
      <span style={{
        fontFamily: FONT.mono, fontSize: 9, fontWeight: 600,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: dark ? 'rgba(242,235,218,0.6)' : C.muted,
      }}>{label || 'asset'}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Rail — single bottom chrome (replaces banner + jumper + progress)
// ─────────────────────────────────────────────────────────────
function Rail({ current, total, onPrev, onNext, onMenu, onShare }) {
  const btn = {
    width: 38, height: 38, borderRadius: 999, border: 'none',
    background: 'transparent', color: C.ink, cursor: 'pointer', padding: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12,
      bottom: 'calc(14px + env(safe-area-inset-bottom))',
      height: 54, zIndex: 100,
      display: 'grid', gridTemplateColumns: 'auto auto 1fr auto auto',
      gap: 4, alignItems: 'center', padding: '0 8px',
      background: 'rgba(250,246,234,0.86)',
      backdropFilter: 'blur(18px) saturate(170%)',
      WebkitBackdropFilter: 'blur(18px) saturate(170%)',
      border: `1px solid ${C.line}`, borderRadius: 999,
      boxShadow: '0 10px 32px rgba(27,42,27,0.12), 0 1px 0 rgba(255,255,255,0.6) inset',
    }}>
      <button style={btn} onClick={onPrev} aria-label="Previous">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 3l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button style={btn} onClick={onNext} aria-label="Next">
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{
            width: i === current ? 22 : 6, height: 6, borderRadius: 999,
            background: i === current ? C.accent : 'rgba(27,42,27,0.22)',
            transition: 'all 0.22s cubic-bezier(.2,.7,.2,1)',
          }} />
        ))}
      </div>
      <button style={btn} onClick={onShare} aria-label="Share this slide">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 2v8M8 2L5 5M8 2l3 3M3 9v3a1 1 0 001 1h8a1 1 0 001-1V9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button style={btn} onClick={onMenu} aria-label="Slide list">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="2.5" y="3.5" width="13" height="2" rx="1" fill="currentColor"/>
          <rect x="2.5" y="8" width="13" height="2" rx="1" fill="currentColor"/>
          <rect x="2.5" y="12.5" width="13" height="2" rx="1" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sheet — reuses site's m-sheet pattern (text list, Fraunces 19px + →)
// ─────────────────────────────────────────────────────────────
function Sheet({ open, onClose, items, current, onPick, title = 'Slides' }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'rgba(27,42,27,0.45)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 210,
        background: C.cream, borderRadius: '18px 18px 0 0',
        padding: '14px 22px calc(34px + env(safe-area-inset-bottom))',
        boxShadow: '0 -12px 40px rgba(27,42,27,0.18)',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.32s cubic-bezier(.2,.7,.2,1)',
        maxHeight: '82%', overflowY: 'auto',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: 'rgba(27,42,27,0.18)', margin: '0 auto 18px',
        }} />
        <p style={{
          fontFamily: FONT.mono, fontSize: 10, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(27,42,27,0.5)',
          margin: '0 0 14px',
        }}>{title}</p>
        {items.map((s, i) => (
          <a key={s.id || i} href="#" onClick={(e) => { e.preventDefault(); onPick(i); onClose(); }} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 4px',
            fontFamily: FONT.display, fontSize: 19, fontWeight: 500,
            letterSpacing: '-0.01em', color: C.ink,
            borderBottom: i === items.length - 1 ? 'none' : '1px solid rgba(27,42,27,0.08)',
            textDecoration: 'none',
            background: i === current ? 'rgba(199,111,61,0.06)' : 'transparent',
          }}>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{
                fontFamily: FONT.mono, fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', width: 22,
                color: i === current ? C.accent : 'rgba(27,42,27,0.45)',
              }}>{String(i + 1).padStart(2, '0')}</span>
              {s.name}
            </span>
            <span style={{ fontFamily: FONT.body, fontSize: 16, color: 'rgba(27,42,27,0.35)' }}>→</span>
          </a>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Toast — share confirm
// ─────────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: 100,
      transform: 'translateX(-50%)', zIndex: 300,
      background: C.ink, color: C.bg,
      padding: '10px 16px', borderRadius: 999,
      fontFamily: FONT.mono, fontSize: 10,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
      animation: 'toastIn 0.25s ease',
    }}>{msg}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Editorial italic em — matches site's deck-em pattern
// ─────────────────────────────────────────────────────────────
function Em({ children, color = C.accent }) {
  return (
    <em style={{ fontFamily: FONT.italic, fontStyle: 'italic', color, fontWeight: 400 }}>
      {children}
    </em>
  );
}

// ─────────────────────────────────────────────────────────────
// PSBlock — Problem / Shipped dot-bullets
// ─────────────────────────────────────────────────────────────
function PSBlock({ label, color, items, labelColor = C.muted, textColor = C.ink }) {
  return (
    <div>
      <p style={{
        fontFamily: FONT.mono, fontWeight: 600, fontSize: 9.5,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: labelColor, margin: '0 0 10px',
      }}>{label}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((it, i) => (
          <li key={i} style={{
            position: 'relative', paddingLeft: 18, marginBottom: 8,
            fontFamily: FONT.body, fontSize: 14, lineHeight: 1.42,
            color: textColor,
          }}>
            <span style={{
              position: 'absolute', left: 0, top: 8,
              width: 7, height: 7, borderRadius: '50%', background: color,
            }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Detail reveal — "↓ Detail" inline expander
// ─────────────────────────────────────────────────────────────
function DetailReveal({ label = '↓ See detail', children, accent = C.ink }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: FONT.mono, fontWeight: 600, fontSize: 11,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: accent, background: 'transparent', border: 'none',
        borderBottom: `1.5px solid ${accent}`, padding: '0 0 4px',
        cursor: 'pointer',
      }}>
        <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>↓</span>
        {open ? 'Hide detail' : label}
      </button>
      <div style={{
        maxHeight: open ? 1200 : 0, overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ paddingTop: open ? 18 : 0 }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// useDeckNav — horizontal scroll-snap + index tracking + solo mode
// ─────────────────────────────────────────────────────────────
function useDeckNav(slideCount) {
  const [current, setCurrent] = useState(0);
  const [solo, setSolo] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const w = track.clientWidth;
      const idx = Math.round(track.scrollLeft / w);
      if (idx !== current) setCurrent(idx);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [current]);

  const go = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(slideCount - 1, i));
    track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
  }, [slideCount]);

  return { current, setCurrent, solo, setSolo, trackRef, go };
}

// Export
Object.assign(window, {
  MS_C: C, MS_FONT: FONT,
  Kicker, Sparkline, ImageSlot, Rail, Sheet, Toast, Em, PSBlock, DetailReveal,
  useDeckNav,
});
