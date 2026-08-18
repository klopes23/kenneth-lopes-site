// proto/deck-mobile.jsx — full 7-slide mobile deck
// Reads: window.MS_C, MS_FONT, Kicker, Sparkline, ImageSlot, Rail, Sheet, Toast, Em, PSBlock, DetailReveal, useDeckNav

const { useState: dUseState, useEffect: dUseEffect, useRef: dUseRef } = React;

// ─────────────────────────────────────────────────────────────
// SLIDES — slot 1..7 mirrors the desktop deck order
// ─────────────────────────────────────────────────────────────
const DECK_SLIDES = [
  { id: 0, code: 'CS / 00', name: 'Profile', accent: MS_C.pop, dark: true },
  { id: 1, code: 'CS / 01', name: 'Multi-Site Governance', accent: MS_C.accent },
  { id: 2, code: 'CS / 02', name: 'RAG + HITL', accent: MS_C.olive },
  { id: 3, code: 'CS / 03', name: 'GenAI Enablement', accent: MS_C.accent },
  { id: 4, code: 'CS / 04', name: 'Customer Experience Center', accent: MS_C.olive },
  { id: 5, code: 'CS / 05', name: 'Mexico Launch', accent: MS_C.accent },
  { id: 6, code: 'Creator', name: 'The Nesi Family', accent: MS_C.accent },
];

// ─────────────────────────────────────────────────────────────
// Slide wrapper — gives every slide identical sizing, scroll, padding
// ─────────────────────────────────────────────────────────────
function SlideShell({ slide, total, dark, bg, children, contentPad = '90px 22px 110px' }) {
  return (
    <article data-screen-label={`${String(slide.id + 1).padStart(2, '0')} ${slide.name}`} style={{
      position: 'relative', flex: '0 0 100%', height: '100%',
      scrollSnapAlign: 'start', scrollSnapStop: 'always',
      overflowY: 'auto', overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
      background: bg || MS_C.bg, color: dark ? MS_C.bg : MS_C.ink,
      padding: contentPad,
    }}>
      <Kicker code={slide.code} name={slide.name} idx={slide.id} total={total} dark={!!dark} />
      {children}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1 / 7 — Profile (cover)
// ─────────────────────────────────────────────────────────────
function S1_Profile({ slide, total }) {
  return (
    <article data-screen-label="01 Profile" style={{
      position: 'relative', flex: '0 0 100%', height: '100%',
      scrollSnapAlign: 'start', scrollSnapStop: 'always',
      overflow: 'hidden', color: MS_C.bg, background: MS_C.ink,
    }}>
      <img src="../assets/headshot.jpg" alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: '50% 28%',
        filter: 'saturate(0.85) contrast(1.04)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(27,42,27,0.08) 0%, rgba(27,42,27,0.55) 52%, rgba(27,42,27,0.94) 100%),
                     radial-gradient(120% 80% at 80% 8%, rgba(199,111,61,0.32), transparent 58%)`,
      }} />
      <Kicker code={slide.code} name="Case Study Deck · 2026" idx={0} total={total} dark />

      <div style={{ position: 'absolute', left: 22, right: 22, bottom: 190, zIndex: 4 }}>
        <p style={{
          fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10.5,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: MS_C.pop, marginBottom: 16,
        }}>Kenneth Lopes · He/Him</p>
        <h1 style={{
          fontFamily: MS_FONT.display, fontWeight: 600,
          fontSize: 'clamp(48px, 13.5vw, 64px)', lineHeight: 0.92,
          letterSpacing: '-0.025em', margin: 0, color: MS_C.bg,
        }}>
          TPM, Product<br />
          & <Em color={MS_C.pop}>Strategy.</Em>
        </h1>
        <p style={{
          marginTop: 18, fontFamily: MS_FONT.body, fontWeight: 400,
          fontSize: 14.5, lineHeight: 1.42, maxWidth: '32ch',
          color: 'rgba(242,235,218,0.85)',
        }}>
          Cross-functional PM at Canoga Perkins. Hardware, software, cloud, ops.
          Turns ambiguous requests into <Em color={MS_C.pop}>shippable</Em> plans.
        </p>
      </div>

      {/* stat strip — horizontal scroll-snap */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 92,
        display: 'flex', gap: 10, padding: '0 22px',
        overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
      }}>
        {[
          ['4,700+', 'issues governed'],
          ['$15M+', 'shipped'],
          ['985K+', 'creator audience'],
          ['$1M+', 'RAG savings'],
        ].map(([n, l]) => (
          <div key={l} style={{
            scrollSnapAlign: 'start', flex: '0 0 auto',
            minWidth: 130, padding: '12px 14px',
            background: 'rgba(250,246,234,0.10)',
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            border: '1px solid rgba(242,235,218,0.18)', borderRadius: 14,
          }}>
            <b style={{
              display: 'block', fontFamily: MS_FONT.display, fontWeight: 500,
              fontSize: 23, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.015em', color: MS_C.bg,
            }}>{n}</b>
            <span style={{
              display: 'block', marginTop: 5, fontFamily: MS_FONT.mono,
              fontWeight: 600, fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(242,235,218,0.7)',
            }}>{l}</span>
          </div>
        ))}
      </div>

      {/* swipe hint */}
      <div style={{
        position: 'absolute', bottom: 60, right: 22,
        fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(242,235,218,0.6)',
        animation: 'swipePulse 1.8s ease-in-out infinite',
      }}>Swipe →</div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE 2 / 7 — Multi-Site Governance (CS01)
// ─────────────────────────────────────────────────────────────
function S2_MultiSite({ slide, total }) {
  return (
    <SlideShell slide={slide} total={total}>
      <p style={{
        fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.accent, margin: '0 0 14px',
      }}>— The challenge</p>
      <h2 style={{
        fontFamily: MS_FONT.display, fontWeight: 400,
        fontSize: 'clamp(28px, 7.6vw, 34px)', lineHeight: 1.02,
        letterSpacing: '-0.015em', margin: 0, textWrap: 'balance',
      }}>
        Operating system for <Em>5 sites</Em>, 4,700+ issues, <Em>$15M+</Em> shipped.
      </h2>

      <div style={{
        marginTop: 24, padding: '20px 18px 16px',
        background: MS_C.card, borderRadius: 18,
        border: `1px solid ${MS_C.line}`,
        boxShadow: '0 1px 0 rgba(27,42,27,0.04)',
      }}>
        <div style={{
          fontFamily: MS_FONT.display, fontWeight: 500, fontSize: 54,
          lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
        }}>4,712</div>
        <div style={{ marginTop: 4, fontFamily: MS_FONT.body, fontSize: 13, color: MS_C.muted }}>
          issues governed across 5 sites
        </div>
        <div style={{ marginTop: 14 }}>
          <Sparkline data={[12, 18, 24, 31, 42, 58, 78, 105, 142, 190, 248, 312]} color={MS_C.accent} />
        </div>
        <p style={{
          marginTop: 8, fontFamily: MS_FONT.mono, fontWeight: 600,
          fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: MS_C.muted,
        }}>Cumulative · 2023 → 2025</p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        margin: '16px 0 22px',
      }}>
        {[['$15M+', 'shipped'], ['5', 'sites'], ['$0.9M/yr', 'avoided']].map(([n, l]) => (
          <ChipStat key={l} n={n} l={l} />
        ))}
      </div>

      <PSBlock label="Problem" color={MS_C.accent} items={[
        '5 sites, 5 trackers, no shared definition of "done"',
        'Exec reviews built from spreadsheets at 2am',
      ]} />
      <div style={{ height: 16 }} />
      <PSBlock label="Shipped" color={MS_C.olive} items={[
        'Unified intake + status taxonomy, 5 sites in 6 weeks',
        'Single auto-generated weekly exec view',
      ]} />

      <DetailReveal accent={MS_C.accent} label="↓ See burndown detail">
        <p style={{ fontFamily: MS_FONT.mono, fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: MS_C.muted, marginBottom: 12 }}>
          Issue burndown · 6 months
        </p>
        <div style={{ height: 80, background: MS_C.cream, borderRadius: 12, padding: 14, border: `1px solid ${MS_C.line}` }}>
          <Sparkline data={[6000, 4500, 3000, 1500, 800, 200]} color={MS_C.accent} height={50} />
        </div>
        <p style={{ marginTop: 10, fontFamily: MS_FONT.body, fontSize: 13, color: MS_C.muted, lineHeight: 1.42 }}>
          5 sites · United States, Ukraine, Pakistan, India, Singapore. Unified intake routed
          to named owner per gate. 4,700 issues closed in 6 months.
        </p>
      </DetailReveal>
    </SlideShell>
  );
}

function ChipStat({ n, l }) {
  return (
    <div style={{
      padding: '12px 8px', background: MS_C.cream,
      border: `1px solid rgba(27,42,27,0.08)`,
      borderRadius: 12, textAlign: 'center',
    }}>
      <b style={{
        display: 'block', fontFamily: MS_FONT.display, fontWeight: 500,
        fontSize: 19, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        color: MS_C.ink,
      }}>{n}</b>
      <span style={{
        display: 'block', marginTop: 4, fontFamily: MS_FONT.mono,
        fontWeight: 600, fontSize: 8.5, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: MS_C.muted,
      }}>{l}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE 3 / 7 — RAG + HITL (CS02)
// ─────────────────────────────────────────────────────────────
function S3_RAG({ slide, total }) {
  const dept = [['Engineering', 213], ['Manufacturing', 70], ['Product', 52], ['Operations', 34], ['Marketing', 12]];
  const max = 213;
  return (
    <SlideShell slide={slide} total={total}>
      <p style={{
        fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.olive, margin: '0 0 14px',
      }}>— Procurement intelligence</p>
      <h2 style={{
        fontFamily: MS_FONT.display, fontWeight: 400,
        fontSize: 'clamp(26px, 7.4vw, 32px)', lineHeight: 1.04,
        letterSpacing: '-0.015em', margin: 0, textWrap: 'balance',
      }}>
        Cut expedite fees by <Em color={MS_C.olive}>80%</Em> with a RAG + HITL purchasing workflow.
      </h2>

      <div style={{
        marginTop: 24, padding: '22px 20px',
        background: MS_C.forest, color: MS_C.bg, borderRadius: 20,
      }}>
        <div style={{
          fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(242,235,218,0.6)', marginBottom: 8,
        }}>Expedite fees</div>
        <div style={{
          fontFamily: MS_FONT.display, fontWeight: 600,
          fontSize: 64, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em',
        }}>−80%</div>
        <div style={{ marginTop: 6, fontFamily: MS_FONT.body, fontSize: 13, color: 'rgba(242,235,218,0.78)' }}>
          435+ queries · 13 departments · ~$1M annual savings
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '14px 0 22px' }}>
        <ChipStat n="435+" l="Queries" />
        <ChipStat n="13" l="Departments" />
      </div>

      <p style={{
        fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.muted, margin: '0 0 12px',
      }}>By department</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {dept.map(([name, q]) => (
          <div key={name}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: 5,
              fontFamily: MS_FONT.body, fontSize: 12.5, color: MS_C.ink,
            }}>
              <span>{name}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{q}</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: MS_C.bg2, overflow: 'hidden' }}>
              <div style={{ width: `${(q / max) * 100}%`, height: '100%', background: MS_C.olive, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>

      <DetailReveal accent={MS_C.olive} label="↓ See RAG architecture">
        <ImageSlot src="../assets/cs02-rag-screenshot.png" label="RAG platform UI" ratio="16 / 10" />
        <p style={{ marginTop: 12, fontFamily: MS_FONT.body, fontSize: 13, color: MS_C.muted, lineHeight: 1.45 }}>
          Retrieval-augmented LLM with Human-in-the-Loop approval. Buyer drafts go through
          policy guardrails before send. Adoption ramped Sep '25 → Feb '26 from 1 user / week to 12.
        </p>
      </DetailReveal>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE 4 / 7 — GenAI Enablement (CS03)
// ─────────────────────────────────────────────────────────────
function S4_GenAI({ slide, total }) {
  return (
    <SlideShell slide={slide} total={total}>
      <p style={{
        fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.accent, margin: '0 0 14px',
      }}>— Adoption program</p>
      <h2 style={{
        fontFamily: MS_FONT.display, fontWeight: 400,
        fontSize: 'clamp(26px, 7.4vw, 32px)', lineHeight: 1.04,
        letterSpacing: '-0.015em', margin: 0, textWrap: 'balance',
      }}>
        Operationalized <Em>intake-to-execution</Em> with a live adoption dashboard.
      </h2>

      <div style={{
        marginTop: 24, padding: '22px 20px', background: MS_C.ink, color: MS_C.bg,
        borderRadius: 20,
      }}>
        <div style={{
          fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: MS_C.accent, marginBottom: 8,
        }}>+193% WAU lift</div>
        <div style={{
          fontFamily: MS_FONT.display, fontWeight: 500, fontSize: 44,
          lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.025em',
        }}>41 users · 24w</div>
        <div style={{ marginTop: 8 }}>
          <Sparkline data={[1, 1, 2, 3, 5, 8, 12, 16, 20, 28, 34, 41]} color={MS_C.accent} height={36} />
        </div>
        <div style={{
          marginTop: 8, fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(242,235,218,0.65)',
        }}>84% CSAT · 435 Q · 13 depts</div>
      </div>

      <p style={{
        marginTop: 22, fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.muted, marginBottom: 12,
      }}>Enablement assets</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AssetCard color={MS_C.olive} eyebrow="Comms cadence" title="85% open rate" />
        <AssetCard color={MS_C.forest} eyebrow="Gamification" title="Leaderboard + badges" />
        <AssetCard color={MS_C.accent} eyebrow="Prompt engineering" title="Role-based templates" mono="{ }" />
      </div>

      <a href="#" onClick={(e) => e.preventDefault()} style={{
        marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', background: MS_C.accent, color: '#fff',
        borderRadius: 18, textDecoration: 'none',
      }}>
        <div>
          <div style={{
            fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.78)', marginBottom: 4,
          }}>Live dashboard</div>
          <div style={{
            fontFamily: MS_FONT.display, fontWeight: 500, fontSize: 18,
            letterSpacing: '-0.01em',
          }}>Open full report</div>
        </div>
        <span style={{ fontFamily: MS_FONT.body, fontSize: 22 }}>↗</span>
      </a>

      <p style={{
        marginTop: 8, fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: MS_C.muted,
      }}>Best viewed on desktop</p>
    </SlideShell>
  );
}

function AssetCard({ color, eyebrow, title, mono }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '56px 1fr', alignItems: 'center',
      background: MS_C.cream, borderRadius: 14,
      border: `1px solid ${MS_C.line}`, overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: MS_FONT.display, fontSize: 20, fontWeight: 500,
        minHeight: 64,
      }}>{mono || '•'}</div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{
          fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 8.5,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: color, marginBottom: 3,
        }}>{eyebrow}</div>
        <div style={{
          fontFamily: MS_FONT.display, fontSize: 16, fontWeight: 500,
          letterSpacing: '-0.01em', color: MS_C.ink, lineHeight: 1.2,
        }}>{title}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE 5 / 7 — Customer Experience Center (CS04) — carousel
// ─────────────────────────────────────────────────────────────
function S5_CEC({ slide, total }) {
  const tiles = [
    { src: '../assets/cs04-vr-demo.jpg', label: 'VR demo · field engineer training' },
    { src: '../assets/cs04-racing-sim.png', label: 'Latency racing rig · 5G PoC' },
    { src: '../assets/cs04-syncmetra.png', label: 'SyncMetra live data wall' },
    { src: '../assets/brand-pf-changs.jpg', label: "Brand activation · P.F. Chang's" },
  ];
  return (
    <SlideShell slide={slide} total={total} contentPad="90px 0 110px">
      <div style={{ padding: '0 22px' }}>
        <p style={{
          fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: MS_C.olive, margin: '0 0 14px',
        }}>— The bet</p>
        <h2 style={{
          fontFamily: MS_FONT.display, fontWeight: 400,
          fontSize: 'clamp(26px, 7vw, 32px)', lineHeight: 1.04,
          letterSpacing: '-0.015em', margin: 0, textWrap: 'balance',
        }}>
          Replaced slideshows with <Em color={MS_C.olive}>hands-on PoCs</Em> · <Em color={MS_C.olive}>$1.2M+</Em> qualified pipeline.
        </h2>
      </div>

      <div style={{
        marginTop: 22, display: 'flex', gap: 10,
        padding: '0 22px 4px',
        overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
      }}>
        {tiles.map((t, i) => (
          <div key={i} style={{
            scrollSnapAlign: 'start', flex: '0 0 78%',
            position: 'relative', aspectRatio: '4 / 5',
            borderRadius: 18, overflow: 'hidden',
            border: `1px solid ${MS_C.line}`,
          }}>
            <img src={t.src} alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(15,25,15,0.86) 0%, rgba(15,25,15,0.05) 55%, transparent 100%)',
            }} />
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 12,
              display: 'flex', justifyContent: 'space-between', padding: '0 14px',
              fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.78)',
            }}>
              <span>{String(i + 1).padStart(2, '0')} / 04</span>
              <span>PoC</span>
            </div>
            <div style={{
              position: 'absolute', left: 16, right: 16, bottom: 14,
              color: '#fff', fontFamily: MS_FONT.display, fontSize: 17,
              fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.01em',
            }}>{t.label}</div>
          </div>
        ))}
      </div>

      <p style={{
        margin: '12px 22px 0', fontFamily: MS_FONT.mono,
        fontWeight: 600, fontSize: 9.5, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: MS_C.muted,
      }}>Swipe through PoCs ↔</p>

      <div style={{ padding: '22px 22px 0' }}>
        <div style={{
          padding: '20px', background: MS_C.ink, color: MS_C.bg, borderRadius: 18,
        }}>
          <div style={{
            fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(242,235,218,0.6)', marginBottom: 8,
          }}>Qualified pipeline · 2024</div>
          <div style={{
            fontFamily: MS_FONT.display, fontWeight: 500, fontSize: 44,
            lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em',
          }}>
            <Em color={MS_C.pop}>$1.2M+</Em>
          </div>
          <p style={{
            marginTop: 10, fontFamily: MS_FONT.body, fontSize: 13,
            lineHeight: 1.45, color: 'rgba(242,235,218,0.78)',
          }}>
            Tagged from CEC visits. Multi-stakeholder demos choreographed exec brief → pipeline tag.
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE 6 / 7 — Mexico Launch (CS05)
// ─────────────────────────────────────────────────────────────
function S6_Mexico({ slide, total }) {
  return (
    <SlideShell slide={slide} total={total}>
      <p style={{
        fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.accent, margin: '0 0 14px',
      }}>— Regional launch</p>
      <h2 style={{
        fontFamily: MS_FONT.display, fontWeight: 400,
        fontSize: 'clamp(26px, 7.4vw, 32px)', lineHeight: 1.04,
        letterSpacing: '-0.015em', margin: 0, textWrap: 'balance',
      }}>
        High-stakes <Em>end-to-end</Em> launch in 4 weeks.
      </h2>

      <div style={{ marginTop: 22, position: 'relative', aspectRatio: '5 / 3',
                   borderRadius: 18, overflow: 'hidden', border: `1px solid ${MS_C.line}` }}>
        <img src="../assets/cs04-syncmetra.png" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,25,15,0.75) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'absolute', bottom: 14, left: 16, color: '#fff' }}>
          <div style={{
            fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.78)', marginBottom: 4,
          }}>Onstage demo</div>
          <div style={{
            fontFamily: MS_FONT.display, fontSize: 18, fontWeight: 500,
            letterSpacing: '-0.01em',
          }}>SyncMetra LAAM Launch</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
        <div style={{
          padding: '16px 14px', background: MS_C.ink, color: MS_C.bg, borderRadius: 14,
        }}>
          <div style={{
            fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(242,235,218,0.6)', marginBottom: 6,
          }}>Region</div>
          <div style={{ fontFamily: MS_FONT.display, fontSize: 19, fontWeight: 500, letterSpacing: '-0.015em' }}>LATAM · MX</div>
        </div>
        <div style={{
          padding: '16px 14px', background: MS_C.accent, color: '#fff', borderRadius: 14,
        }}>
          <div style={{
            fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.78)', marginBottom: 6,
          }}>Window</div>
          <div style={{ fontFamily: MS_FONT.display, fontSize: 19, fontWeight: 500, letterSpacing: '-0.015em' }}>4 weeks</div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MetricRow eyebrow="Registrations" v="75" sub="Localized acquisition flow" />
        <MetricRow eyebrow="Attendees" v="~90" sub="20% walk-up over registration" />
        <MetricRow eyebrow="Sales conversion" v="11%" sub="Attendees → next-step meetings" highlight />
      </div>
    </SlideShell>
  );
}

function MetricRow({ eyebrow, v, sub, highlight }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 14,
      padding: '14px 16px',
      background: highlight ? MS_C.accent : MS_C.card, color: highlight ? '#fff' : MS_C.ink,
      borderRadius: 14, border: highlight ? 'none' : `1px solid ${MS_C.line}`,
    }}>
      <div>
        <div style={{
          fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: highlight ? 'rgba(255,255,255,0.78)' : MS_C.muted, marginBottom: 4,
        }}>{eyebrow}</div>
        <div style={{ fontFamily: MS_FONT.body, fontSize: 12.5, color: highlight ? 'rgba(255,255,255,0.85)' : MS_C.muted, lineHeight: 1.4 }}>{sub}</div>
      </div>
      <div style={{
        fontFamily: MS_FONT.display, fontWeight: 500, fontSize: 34,
        lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em',
      }}>{v}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE 7 / 7 — Creator Community (Slide3) — angle toggle
// ─────────────────────────────────────────────────────────────
const CREATOR_ANGLES = {
  pm: {
    label: 'PM lens',
    kicker: '— Shipping to 985K real users',
    h: <>Shipping to <Em>985K real users</Em> every week.</>,
    bullets: [
      'Weekly release cadence · post → measure → iterate',
      '250M+ views, 3M+ engagements (Mar \'25 → Mar \'26)',
      '100% organic · $0 paid acquisition',
    ],
  },
  platform: {
    label: 'Platform mechanics',
    kicker: '— Platform + algorithm fluency',
    h: <>Learned every platform's <Em>algorithm + creator stack</Em> first-hand.</>,
    bullets: [
      'TikTok 700K · IG 95K · Snap 85K · FB 60K · YT 32K',
      'Format A/B testing across 5 platforms simultaneously',
      'Built creator-tooling instincts no product team can fake',
    ],
  },
  data: {
    label: 'Data-driven',
    kicker: '— Experimentation at scale',
    h: <>Treated content like a <Em>product backlog.</Em></>,
    bullets: [
      'Weekly hypotheses, ranked by reach × retention × engagement',
      '50+ format experiments shipped, 250M+ views attributed',
      'Audience cohorts segmented by platform × pillar × hook type',
    ],
  },
};

function S7_Creator({ slide, total }) {
  const [angle, setAngle] = dUseState('pm');
  const A = CREATOR_ANGLES[angle];
  const platforms = [
    ['TikTok', '700K', '#000'],
    ['Instagram', '95K', '#962fbf'],
    ['Snapchat', '85K', '#FFFC00'],
    ['YouTube', '32K', '#FF0000'],
    ['Facebook', '60K', '#1877F2'],
  ];
  return (
    <SlideShell slide={slide} total={total}>
      <p style={{
        fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.accent, margin: '0 0 14px',
      }}>{A.kicker}</p>
      <h2 style={{
        fontFamily: MS_FONT.display, fontWeight: 400,
        fontSize: 'clamp(26px, 7.4vw, 32px)', lineHeight: 1.04,
        letterSpacing: '-0.015em', margin: 0, textWrap: 'balance',
      }}>{A.h}</h2>

      {/* Angle toggle */}
      <div style={{
        display: 'flex', gap: 6, marginTop: 18,
        padding: 4, background: MS_C.bg2, borderRadius: 999,
      }}>
        {Object.entries(CREATOR_ANGLES).map(([key, val]) => (
          <button key={key} onClick={() => setAngle(key)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 999,
            border: 'none', cursor: 'pointer',
            background: angle === key ? MS_C.ink : 'transparent',
            color: angle === key ? MS_C.bg : MS_C.ink,
            fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            transition: 'background 0.2s, color 0.2s',
          }}>{val.label}</button>
        ))}
      </div>

      {/* Hero combined number */}
      <div style={{
        marginTop: 20, padding: '22px 20px',
        background: MS_C.ink, color: MS_C.bg, borderRadius: 20,
      }}>
        <div style={{
          fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(242,235,218,0.6)', marginBottom: 8,
        }}>Combined audience · 5 platforms</div>
        <div style={{
          fontFamily: MS_FONT.display, fontWeight: 500, fontSize: 64,
          lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.035em',
        }}>985K+</div>
        <div style={{ marginTop: 4, fontFamily: MS_FONT.body, fontSize: 13, color: 'rgba(242,235,218,0.7)' }}>
          250M+ views · 3M+ engagements · 100% organic
        </div>
      </div>

      {/* Bullets per angle */}
      <ul style={{ marginTop: 18, listStyle: 'none', padding: 0 }}>
        {A.bullets.map((b, i) => (
          <li key={i} style={{
            position: 'relative', paddingLeft: 18, marginBottom: 10,
            fontFamily: MS_FONT.body, fontSize: 14, lineHeight: 1.42, color: MS_C.ink,
          }}>
            <span style={{
              position: 'absolute', left: 0, top: 8,
              width: 7, height: 7, borderRadius: '50%', background: MS_C.accent,
            }} />
            {b}
          </li>
        ))}
      </ul>

      {/* Platform horizontal swipe */}
      <p style={{
        marginTop: 18, fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9.5,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: MS_C.muted, marginBottom: 10,
      }}>By platform</p>
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
        marginLeft: -22, marginRight: -22, padding: '4px 22px',
      }}>
        {platforms.map(([name, count, color]) => (
          <div key={name} style={{
            scrollSnapAlign: 'start', flex: '0 0 56%', aspectRatio: '9 / 14',
            borderRadius: 18, padding: 16, position: 'relative', overflow: 'hidden',
            background: color, color: name === 'Snapchat' ? MS_C.ink : '#fff',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: MS_FONT.mono, fontWeight: 600, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              opacity: name === 'Snapchat' ? 0.7 : 0.78,
            }}>{name}</div>
            <div>
              <div style={{
                fontFamily: MS_FONT.display, fontWeight: 500, fontSize: 38,
                lineHeight: 0.95, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em',
              }}>{count}</div>
              <div style={{
                marginTop: 4, fontFamily: MS_FONT.mono, fontWeight: 600,
                fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase',
                opacity: name === 'Snapchat' ? 0.55 : 0.7,
              }}>followers</div>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Deck shell
// ─────────────────────────────────────────────────────────────
const SLIDE_COMPONENTS = [S1_Profile, S2_MultiSite, S3_RAG, S4_GenAI, S5_CEC, S6_Mexico, S7_Creator];

function DeckMobile() {
  const { current, trackRef, go } = useDeckNav(DECK_SLIDES.length);
  const [sheet, setSheet] = dUseState(false);
  const [toast, setToast] = dUseState('');

  // sync slide change with parent (postMessage)
  dUseEffect(() => {
    try { window.parent.postMessage({ slideIndexChanged: current }, '*'); } catch {}
  }, [current]);

  const share = () => {
    setToast(`Slide ${current + 1} link copied`);
    setTimeout(() => setToast(''), 1600);
  };

  return (
    <div data-screen-label="Deck (mobile)" style={{
      position: 'relative', height: '100%', background: MS_C.bg,
    }}>
      <div ref={trackRef} style={{
        height: '100%', display: 'flex',
        overflowX: 'auto', overflowY: 'hidden',
        scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
      }}>
        {SLIDE_COMPONENTS.map((Slide, i) => (
          <Slide key={i} slide={DECK_SLIDES[i]} total={DECK_SLIDES.length} />
        ))}
      </div>

      <Rail
        current={current} total={DECK_SLIDES.length}
        onPrev={() => go(current - 1)}
        onNext={() => go(current + 1)}
        onMenu={() => setSheet(true)}
        onShare={share}
      />
      <Sheet
        open={sheet} onClose={() => setSheet(false)}
        items={DECK_SLIDES} current={current}
        onPick={(i) => go(i)} title="Slides · 7 total"
      />
      <Toast msg={toast} />
    </div>
  );
}

window.DeckMobile = DeckMobile;
window.DECK_SLIDES = DECK_SLIDES;

// ─────────────────────────────────────────────────────────────
// DeckSlideStatic — show ONE slide (for canvas comparison view)
// ─────────────────────────────────────────────────────────────
function DeckSlideStatic({ index }) {
  const Slide = SLIDE_COMPONENTS[index];
  const slide = DECK_SLIDES[index];
  if (!Slide) return null;
  return (
    <div style={{ position: 'relative', height: '100%', background: MS_C.bg, overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <Slide slide={slide} total={DECK_SLIDES.length} />
        </div>
      </div>
      {/* static rail showing this slide's dot */}
      <Rail
        current={index} total={DECK_SLIDES.length}
        onPrev={() => {}} onNext={() => {}} onMenu={() => {}} onShare={() => {}}
      />
    </div>
  );
}

window.DeckSlideStatic = DeckSlideStatic;
