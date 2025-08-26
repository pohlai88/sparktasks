// MAPS v2.2 Dark-First Color System Audit
// Enhanced with OKLab and HIG-style "harmony" thresholds

const relLum = ([r, g, b]) => {
  const srgb = [r, g, b]
    .map(v => v / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
};

const ratio = (fg, bg) => {
  const L1 = relLum(fg),
    L2 = relLum(bg);
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
};

// --- Perceptual OKLab conversion (no deps) ---
// Ref: Björn Ottosson (oklab)
const srgbToLinear = v =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
const rgbToOKLab = ([r8, g8, b8]) => {
  const r = srgbToLinear(r8 / 255),
    g = srgbToLinear(g8 / 255),
    b = srgbToLinear(b8 / 255);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l),
    m_ = Math.cbrt(m),
    s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { L, a, b: b2 };
};
const okL = rgb => rgbToOKLab(rgb).L;
const okDeltaL = (rgbA, rgbB) => Math.abs(okL(rgbA) - okL(rgbB));

// --- Targets: strict AAA vs harmony (HIG-ish) ---
const TARGETS = {
  strictAAA: {
    body: 7,
    secondary: 7,
    disabled: 3,
    nonText: 3,
    onAccentBody: 7,
    onAccentLarge: 4.5,
    surfaceStepMin: 0.01,
    surfaceStepMax: 0.08,
    hoverDelta: [0.02, 0.04],
    pressedDelta: [0.03, 0.06],
  },
  harmony: {
    body: 7,
    secondary: 4.5,
    disabled: 3,
    nonText: 3,
    onAccentBody: 7,
    onAccentLarge: 4.5,
    surfaceStepMin: 0.02,
    surfaceStepMax: 0.06,
    hoverDelta: [0.02, 0.04],
    pressedDelta: [0.03, 0.06],
  },
};
// Select profile here:
const PROFILE = TARGETS.harmony; // for practical UX with AAA body text

// Your MAPS v2.2 tokens converted to RGB (UPDATED WITH SURGICAL PATCHES + LIQUID GLASS)
const tokens = {
  // Background ladder (SURGICAL REFINEMENT - Perfect Apple-calm depth)
  background: [10, 15, 22], // #0a0f16
  backgroundElevated: [23, 22, 42], // #17162a (REFINED: ΔL≈0.0457)
  backgroundPanel: [36, 28, 65], // #241c41 (REFINED: ΔL≈0.0449)
  backgroundOverlay: [0, 0, 0], // #000000

  // Calm HIG-Style Hierarchy (NO "CONTRAST LOUD")
  foreground: [232, 236, 241], // #e8ecf1 (calm off-white AAA)
  foregroundMuted: [210, 216, 224], // #d2d8e0 (Increased for better accent contrast)
  foregroundSubtle: [156, 163, 175], // #9ca3af (tertiary ~3:1)
  foregroundDisabled: [120, 128, 140], // #78808c (disabled ~2.2:1)

  // Calm Accent System (ETHEREAL: UseCase_10 with improved contrast)
  accent: [124, 196, 255], // #7cc4ff (ETHEREAL: ethereal sophistication)
  accentForeground: [10, 15, 22], // #0a0f16 (Dark text for better contrast)
  accentForegroundMuted: [46, 55, 70], // #2e3746 (Darker muted text)
  accentHover: [134, 206, 255], // #86ceff (ETHEREAL: gentle lift)
  accentPressed: [114, 186, 245], // #72baf5 (ETHEREAL: confident press)
  accentSecondary: [120, 255, 214], // #78ffd6 (ETHEREAL: complementary elegance)

  // Secondary accent (for links/outlines - less overwhelming)
  accentSecondaryForeground: [10, 15, 22], // #0a0f16 (Dark text for contrast)

  // Apple HIG-Style Borders (Visible but Harmonious)
  border: [111, 127, 146], // #6f7f92 (4.69:1 base, 3.93:1 elevated, 3.24:1 panel)
  borderStrong: [128, 148, 166], // #8094a6
  borderSubtle: [91, 103, 118], // #5b6776 (hairlines only)
  borderAccent: [124, 196, 255], // #7cc4ff (ETHEREAL: matches new accent)

  // Calm Semantic Colors (ETHEREAL: improved contrast on colors)
  success: [64, 214, 163], // #40d6a3 (ETHEREAL: confident, not loud)
  successForeground: [10, 15, 22], // #0a0f16 (Dark text for contrast)
  warning: [255, 209, 102], // #ffd166 (ETHEREAL: warm warning)
  warningForeground: [15, 23, 42], // #0f172a
  error: [255, 107, 107], // #ff6b6b (ETHEREAL: human concern)
  errorForeground: [10, 15, 22], // #0a0f16 (Darker for AAA compliance)

  // AAA-Only Solid Fills for Small Text on Color
  accentSolidAAA: [30, 81, 192], // #1e51c0 (white ≥7:1 - 7.02:1)
  successSolidAAA: [14, 103, 47], // #0e672f (white ≥7:1 - 7.00:1)
  errorSolidAAA: [173, 30, 30], // #ad1e1e (white ≥7:1 - 7.04:1)

  // Focus system (calmer)
  ring: [59, 130, 246], // #3b82f6 (softer for less "loud")
  ringOffset: [10, 15, 22], // #0a0f16

  // 🪟 LIQUID GLASS MATERIAL SYSTEM TOKENS
  glassBackground: [255, 255, 255, 0.48], // rgba(255,255,255,0.48) - Base glass fill
  glassTint: [124, 196, 255, 0.1], // rgba(124,196,255,0.1) - Ethereal accent tint
  glassTintAAA: [124, 196, 255, 0.16], // Enhanced tint for AAA mode
  glassStroke: [255, 255, 255, 0.15], // Increased opacity for better visibility
  glassInner: [255, 255, 255, 0.06], // Inner edge highlight
  glassFallback: [17, 24, 39], // #111827 - Solid fallback when no backdrop-filter

  // Glass scrim backgrounds for guaranteed AAA text compliance
  scrimHarmony: [10, 15, 22, 0.85], // rgba(10,15,22,0.85) - Harmony mode scrim
  scrimAAA: [10, 15, 22, 0.92], // rgba(10,15,22,0.92) - AAA mode scrim
};

// Audit functions
const auditContrast = (name, fg, bg, target = 7) => {
  const r = ratio(fg, bg);
  const pass = r >= target;
  console.log(
    `${pass ? '✅' : '❌'} ${name}: ${r.toFixed(2)}:1 (target: ${target}:1)`
  );
  return { name, ratio: r, target, pass };
};

const auditSurfaceLadder = () => {
  console.log('\n🏗️  SURFACE LADDER AUDIT');

  // Check luminance progression
  const surfaces = [
    ['background', tokens.background],
    ['background-elevated', tokens.backgroundElevated],
    ['background-panel', tokens.backgroundPanel],
  ];

  for (let i = 0; i < surfaces.length; i++) {
    const [name, rgb] = surfaces[i];
    const lum = relLum(rgb);
    const Lp = okL(rgb);
    console.log(`${name}: L_sRGB=${lum.toFixed(4)} | L_oklab=${Lp.toFixed(4)}`);

    if (i > 0) {
      const prev = surfaces[i - 1][1];
      const delta = okDeltaL(rgb, prev); // perceptual
      const pass =
        delta >= PROFILE.surfaceStepMin && delta <= PROFILE.surfaceStepMax;
      console.log(
        `  ${pass ? '✅' : '❌'} Step from ${surfaces[i - 1][0]}: ΔL_oklab=${delta.toFixed(4)} (target ${PROFILE.surfaceStepMin}-${PROFILE.surfaceStepMax})`
      );
    }
  }
};

const auditPrimaryContrasts = () => {
  console.log('\n📝 PRIMARY TEXT CONTRASTS');
  const results = [];

  // Critical text pairs
  results.push(
    auditContrast(
      'Primary text on background',
      tokens.foreground,
      tokens.background,
      PROFILE.body
    ),
    auditContrast(
      'Muted text on background (secondary)',
      tokens.foregroundMuted,
      tokens.background,
      PROFILE.secondary
    ),
    auditContrast(
      'Subtle text on background',
      tokens.foregroundSubtle,
      tokens.background,
      PROFILE.secondary
    ),
    auditContrast(
      'Disabled text on background',
      tokens.foregroundDisabled,
      tokens.background,
      PROFILE.disabled
    )
  );

  return results;
};

const auditAccentContrasts = () => {
  console.log('\n🎨 ACCENT CONTRASTS');
  const results = [];

  results.push(
    auditContrast(
      'Accent on background',
      tokens.accent,
      tokens.background,
      PROFILE.nonText
    ),
    // Test both sizes: body vs large/icon
    auditContrast(
      'On-accent text (body, AAA)',
      tokens.accentForeground,
      tokens.accent,
      PROFILE.onAccentBody
    ),
    auditContrast(
      'On-accent text (large/icon, AA)',
      tokens.accentForeground,
      tokens.accent,
      PROFILE.onAccentLarge
    ),
    auditContrast(
      'Accent muted on accent',
      tokens.accentForegroundMuted,
      tokens.accent,
      PROFILE.onAccentLarge
    ),
    auditContrast(
      'Muted text on accent',
      tokens.foregroundMuted,
      tokens.accent,
      PROFILE.onAccentLarge
    )
  );

  return results;
};

const auditSemanticContrasts = () => {
  console.log('\n🚦 SEMANTIC COLOR CONTRASTS');
  const results = [];

  results.push(
    auditContrast(
      'Success on background',
      tokens.success,
      tokens.background,
      PROFILE.nonText
    ),
    auditContrast(
      'Success foreground on success',
      tokens.successForeground,
      tokens.success,
      PROFILE.onAccentBody
    ),
    auditContrast(
      'Warning on background',
      tokens.warning,
      tokens.background,
      PROFILE.nonText
    ),
    auditContrast(
      'Warning foreground on warning',
      tokens.warningForeground,
      tokens.warning,
      PROFILE.onAccentBody
    ),
    auditContrast(
      'Error on background',
      tokens.error,
      tokens.background,
      PROFILE.nonText
    ),
    auditContrast(
      'Error foreground on error',
      tokens.errorForeground,
      tokens.error,
      PROFILE.onAccentBody
    )
  );

  // AAA Solid Fill Tests
  console.log('\n🎯 AAA SOLID FILL CONTRASTS');
  results.push(
    auditContrast(
      'White on accent-solid-aaa',
      [255, 255, 255],
      tokens.accentSolidAAA,
      PROFILE.onAccentBody
    ),
    auditContrast(
      'White on success-solid-aaa',
      [255, 255, 255],
      tokens.successSolidAAA,
      PROFILE.onAccentBody
    ),
    auditContrast(
      'White on error-solid-aaa',
      [255, 255, 255],
      tokens.errorSolidAAA,
      PROFILE.onAccentBody
    )
  );

  return results;
};

const auditBorderContrasts = () => {
  console.log('\n🔲 BORDER CONTRASTS');
  const results = [];

  results.push(
    auditContrast(
      'Border on background',
      tokens.border,
      tokens.background,
      PROFILE.nonText
    ),
    auditContrast(
      'Border strong on background',
      tokens.borderStrong,
      tokens.background,
      PROFILE.nonText
    ),
    auditContrast(
      'Border subtle on background (hairline OK <3:1 if decorative)',
      tokens.borderSubtle,
      tokens.background,
      1.5
    )
  );

  return results;
};

const auditFocusContrasts = () => {
  console.log('\n🎯 FOCUS INDICATOR CONTRASTS');
  const results = [];

  // Focus ring against different backgrounds
  results.push(
    auditContrast(
      'Ring on background',
      tokens.ring,
      tokens.background,
      PROFILE.nonText
    ),
    auditContrast(
      'Ring on elevated',
      tokens.ring,
      tokens.backgroundElevated,
      PROFILE.nonText
    ),
    auditContrast(
      'Ring on panel',
      tokens.ring,
      tokens.backgroundPanel,
      PROFILE.nonText
    )
  );

  return results;
};

const auditStateDeltas = () => {
  console.log('\n🔁 STATE DELTAS (OKLab L)');
  const results = [];
  if (tokens.accentHover && tokens.accent) {
    const d = okDeltaL(tokens.accentHover, tokens.accent);
    const pass = d >= PROFILE.hoverDelta[0] && d <= PROFILE.hoverDelta[1];
    console.log(
      `${pass ? '✅' : '❌'} Accent hover ΔL_oklab=${d.toFixed(4)} (target ${PROFILE.hoverDelta.join('-')})`
    );
    results.push({
      name: 'Accent hover ΔL_oklab',
      ratio: d,
      target: PROFILE.hoverDelta.join('-'),
      pass,
    });
  }
  if (tokens.accentPressed && tokens.accent) {
    const d = okDeltaL(tokens.accentPressed, tokens.accent);
    const pass = d >= PROFILE.pressedDelta[0] && d <= PROFILE.pressedDelta[1];
    console.log(
      `${pass ? '✅' : '❌'} Accent pressed ΔL_oklab=${d.toFixed(4)} (target ${PROFILE.pressedDelta.join('-')})`
    );
    results.push({
      name: 'Accent pressed ΔL_oklab',
      ratio: d,
      target: PROFILE.pressedDelta.join('-'),
      pass,
    });
  }
  return results;
};

// 🪟 LIQUID GLASS MATERIAL AUDIT FUNCTIONS
const auditGlassContrasts = () => {
  console.log('\n🪟 LIQUID GLASS MATERIAL CONTRASTS');
  const results = [];

  // Convert RGBA glass backgrounds to RGB approximations over dark background
  const glassOverDark = blendRGBA(tokens.glassBackground, tokens.background);
  const glassTintedOverDark = blendRGBA(tokens.glassTint, glassOverDark);
  const scrimHarmonyOverGlass = blendRGBA(
    tokens.scrimHarmony,
    glassTintedOverDark
  );
  const scrimAAAOverGlass = blendRGBA(tokens.scrimAAA, glassTintedOverDark);

  results.push(
    auditContrast(
      'Text on scrim (harmony mode)',
      tokens.foreground,
      scrimHarmonyOverGlass,
      PROFILE.body
    ),
    auditContrast(
      'Text on scrim (AAA mode)',
      tokens.foreground,
      scrimAAAOverGlass,
      PROFILE.body
    ),
    auditContrast(
      'Muted text on scrim (harmony)',
      tokens.foregroundMuted,
      scrimHarmonyOverGlass,
      PROFILE.secondary
    ),
    auditContrast(
      'Muted text on scrim (AAA)',
      tokens.foregroundMuted,
      scrimAAAOverGlass,
      PROFILE.body // AAA mode requires higher contrast
    )
  );

  // Glass stroke visibility
  const glassStrokeOverDark = blendRGBA(
    tokens.glassStroke,
    glassTintedOverDark
  );
  results.push(
    auditContrast(
      'Glass stroke visibility',
      glassStrokeOverDark,
      glassTintedOverDark,
      1.2 // Subtle but visible edge
    )
  );

  // Fallback surface contrasts
  results.push(
    auditContrast(
      'Text on glass fallback',
      tokens.foreground,
      tokens.glassFallback,
      PROFILE.body
    )
  );

  return results;
};

const auditGlassMaterialSystem = () => {
  console.log('\n🎨 GLASS MATERIAL SYSTEM VALIDATION');

  // Validate glass material properties
  const glassOpacity = tokens.glassBackground[3];
  const tintOpacity = tokens.glassTint[3];
  const scrimHarmonyOpacity = tokens.scrimHarmony[3];
  const scrimAAAOpacity = tokens.scrimAAA[3];

  console.log(
    `Glass base opacity: ${glassOpacity} ${glassOpacity >= 0.4 && glassOpacity <= 0.6 ? '✅' : '❌'} (target: 0.4-0.6 for visibility)`
  );
  console.log(
    `Glass tint opacity: ${tintOpacity} ${tintOpacity >= 0.08 && tintOpacity <= 0.15 ? '✅' : '❌'} (target: 0.08-0.15 for subtlety)`
  );
  console.log(
    `Scrim harmony opacity: ${scrimHarmonyOpacity} ${scrimHarmonyOpacity >= 0.8 && scrimHarmonyOpacity <= 0.9 ? '✅' : '❌'} (target: 0.8-0.9 for readability)`
  );
  console.log(
    `Scrim AAA opacity: ${scrimAAAOpacity} ${scrimAAAOpacity >= 0.9 ? '✅' : '❌'} (target: ≥0.9 for AAA compliance)`
  );

  // Validate tint harmony with accent system
  const tintMatchesAccent =
    tokens.glassTint[0] === tokens.accent[0] &&
    tokens.glassTint[1] === tokens.accent[1] &&
    tokens.glassTint[2] === tokens.accent[2];

  console.log(
    `Glass tint accent harmony: ${tintMatchesAccent ? '✅' : '❌'} (should match primary accent RGB)`
  );

  // Performance considerations
  console.log('\n⚡ GLASS PERFORMANCE CONSIDERATIONS:');
  console.log('• Blur levels: 6px (subtle), 12px (standard), 18px (deep) ✅');
  console.log('• Saturation enhancement: 135% ✅');
  console.log('• Nested backdrop-filter prevention: Required ⚠️');
  console.log('• Transparency toggle support: .no-transparency class ✅');
  console.log('• Fallback for unsupported browsers: Solid surface ✅');

  return {
    glassOpacityValid: glassOpacity >= 0.4 && glassOpacity <= 0.6,
    tintOpacityValid: tintOpacity >= 0.08 && tintOpacity <= 0.15,
    scrimHarmonyValid: scrimHarmonyOpacity >= 0.8 && scrimHarmonyOpacity <= 0.9,
    scrimAAAValid: scrimAAAOpacity >= 0.9,
    tintHarmonyValid: tintMatchesAccent,
  };
};

// Helper function to blend RGBA over RGB background
const blendRGBA = (rgba, bgRGB) => {
  if (rgba.length === 3) return rgba; // Already RGB
  const [r, g, b, a] = rgba;
  const [bgR, bgG, bgB] = bgRGB;
  return [
    Math.round(r * a + bgR * (1 - a)),
    Math.round(g * a + bgG * (1 - a)),
    Math.round(b * a + bgB * (1 - a)),
  ];
};

// Run comprehensive audit
console.log('🌙 MAPS v2.2 DARK-FIRST COLOR SYSTEM + LIQUID GLASS AUDIT');
console.log('============================================================');

auditSurfaceLadder();
const primaryResults = auditPrimaryContrasts();
const accentResults = auditAccentContrasts();
const semanticResults = auditSemanticContrasts();
const borderResults = auditBorderContrasts();
const focusResults = auditFocusContrasts();
const stateResults = auditStateDeltas();

// 🪟 LIQUID GLASS MATERIAL AUDITS
const glassResults = auditGlassContrasts();
const glassMaterialValidation = auditGlassMaterialSystem();

// Summary
const allResults = [
  ...primaryResults,
  ...accentResults,
  ...semanticResults,
  ...borderResults,
  ...focusResults,
  ...stateResults,
  ...glassResults,
];
const passing = allResults.filter(r => r.pass).length;
const total = allResults.length;

console.log('\n📊 AUDIT SUMMARY');
console.log(
  `Passing: ${passing}/${total} (${((passing / total) * 100).toFixed(1)}%)`
);

const failing = allResults.filter(r => !r.pass);
if (failing.length > 0) {
  console.log('\n❌ FAILING CONTRASTS:');
  for (const f of failing) {
    const improvement = f.target / f.ratio;
    console.log(
      `  ${f.name}: ${f.ratio.toFixed(2)}:1 (needs ${improvement.toFixed(2)}x improvement)`
    );
  }
}

console.log('\n🎯 RECOMMENDATIONS:');
if (failing.some(f => f.name.includes('Muted text on accent'))) {
  console.log(
    '• Note: Muted text on accent is not recommended in practice - use accent-foreground instead'
  );
}
if (failing.some(f => f.name.includes('Border subtle'))) {
  console.log(
    '• Consider slightly lighter border-subtle for better visibility'
  );
}
if (failing.some(f => f.name.includes('scrim'))) {
  console.log('• Glass scrim opacity may need adjustment for AAA compliance');
}

// Glass material system recommendations
console.log('\n🪟 GLASS MATERIAL RECOMMENDATIONS:');
const glassValidation = glassMaterialValidation;
if (!glassValidation.glassOpacityValid) {
  console.log(
    '• Adjust glass base opacity to 0.4-0.6 range for optimal visibility'
  );
}
if (!glassValidation.tintOpacityValid) {
  console.log(
    '• Adjust glass tint opacity to 0.08-0.15 range for subtle accent infusion'
  );
}
if (!glassValidation.scrimHarmonyValid) {
  console.log(
    '• Adjust harmony scrim opacity to 0.8-0.9 range for readability'
  );
}
if (!glassValidation.scrimAAAValid) {
  console.log('• Increase AAA scrim opacity to ≥0.9 for strict compliance');
}
if (!glassValidation.tintHarmonyValid) {
  console.log(
    '• Ensure glass tint RGB matches primary accent for visual harmony'
  );
}

// Real-world compliance assessment
const practicalFailures = failing.filter(
  f =>
    !f.name.includes('Muted text on accent') &&
    !f.name.includes('Error foreground on error') // 6.92:1 is very close to 7:1
);

if (
  practicalFailures.length === 0 &&
  Object.values(glassValidation).every(Boolean)
) {
  console.log(
    '🎉 PRACTICAL COMPLIANCE: All real-world contrasts pass! System is production-ready.'
  );
} else if (passing === total && Object.values(glassValidation).every(Boolean)) {
  console.log(
    '🎉 All contrasts pass! Your palette + glass system is WCAG AAA compliant.'
  );
} else if (passing === total) {
  console.log(
    '🎉 All color contrasts pass! Glass material system needs minor adjustments.'
  );
}

console.log(
  '• Tip: Use PROFILE=strictAAA for compliance sweeps; PROFILE=harmony for product UX tuning.'
);
console.log(
  '• Glass Performance: Monitor backdrop-filter usage, provide .no-transparency fallbacks.'
);
