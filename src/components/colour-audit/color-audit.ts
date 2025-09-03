// MAPS v2.2 Dark-First Color System Audit
// Enhanced with OKLab and HIG-style "harmony" thresholds

type RGB = [number, number, number];
type OKLab = [number, number, number];

const relLum = ([r, g, b]: RGB): number => {
  const srgb = [r, g, b]
    .map(v => v / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
};

const ratio = (fg: RGB, bg: RGB): number => {
  const L1 = relLum(fg);
  const L2 = relLum(bg);
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
};

// --- Perceptual OKLab conversion (no deps) ---
// Ref: Björn Ottosson (oklab)
const srgbToLinear = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);

const rgbToOKLab = ([r8, g8, b8]: RGB): OKLab => {
  const r = srgbToLinear(r8 / 255);
  const g = srgbToLinear(g8 / 255);
  const b = srgbToLinear(b8 / 255);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
};

const okLabDistance = (a: OKLab, b: OKLab): number => {
  const [l1, a1, b1] = a;
  const [l2, a2, b2] = b;
  return Math.sqrt((l2 - l1) ** 2 + (a2 - a1) ** 2 + (b2 - b1) ** 2);
};

// Color harmony thresholds (HIG-inspired)
const HARMONY_THRESHOLDS = {
  complementary: 180, // ±15° tolerance
  triadic: 120, // ±15° tolerance  
  tetradic: 90, // ±15° tolerance
  analogous: 30, // ±15° tolerance
  monochromatic: 0, // ±15° tolerance
};

// Convert RGB to HSL for hue analysis
const rgbToHsl = ([r, g, b]: RGB): [number, number, number] => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;
  
  let h = 0;
  if (diff !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / diff) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / diff + 2;
    } else {
      h = (rNorm - gNorm) / diff + 4;
    }
  }
  h = (h * 60 + 360) % 360;
  
  const l = (max + min) / 2;
  const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
  
  return [h, s * 100, l * 100];
};

// Analyze color harmony
const analyzeHarmony = (colors: RGB[]): Record<string, number> => {
  const hues = colors.map(rgbToHsl).map(([h]) => h);
  const harmonies: Record<string, number> = {};
  
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const hueDiff = Math.abs(hues[i] - hues[j]);
      const normalizedDiff = Math.min(hueDiff, 360 - hueDiff);
      
      if (normalizedDiff <= 15) {
        harmonies.monochromatic = (harmonies.monochromatic || 0) + 1;
      } else if (normalizedDiff >= 165 && normalizedDiff <= 195) {
        harmonies.complementary = (harmonies.complementary || 0) + 1;
      } else if (normalizedDiff >= 105 && normalizedDiff <= 135) {
        harmonies.triadic = (harmonies.triadic || 0) + 1;
      } else if (normalizedDiff >= 75 && normalizedDiff <= 105) {
        harmonies.tetradic = (harmonies.tetradic || 0) + 1;
      } else if (normalizedDiff >= 15 && normalizedDiff <= 45) {
        harmonies.analogous = (harmonies.analogous || 0) + 1;
      }
    }
  }
  
  return harmonies;
};

// Main audit function
export const auditColorSystem = (colors: Record<string, RGB>): {
  contrast: Record<string, number>;
  accessibility: Record<string, boolean>;
  harmony: Record<string, number>;
  recommendations: string[];
} => {
  const colorEntries = Object.entries(colors);
  const recommendations: string[] = [];
  
  // Contrast analysis
  const contrast: Record<string, number> = {};
  const accessibility: Record<string, boolean> = {};
  
  for (let i = 0; i < colorEntries.length; i++) {
    for (let j = i + 1; j < colorEntries.length; j++) {
      const [name1, rgb1] = colorEntries[i];
      const [name2, rgb2] = colorEntries[j];
      const contrastRatio = ratio(rgb1, rgb2);
      const pair = `${name1}-${name2}`;
      
      contrast[pair] = contrastRatio;
      accessibility[pair] = contrastRatio >= 4.5; // WCAG AA standard
      
      if (contrastRatio < 4.5) {
        recommendations.push(`⚠️ Low contrast between ${name1} and ${name2}: ${contrastRatio.toFixed(2)}`);
      }
    }
  }
  
  // Harmony analysis
  const harmony = analyzeHarmony(colorEntries.map(([, rgb]) => rgb));
  
  // Generate recommendations
  if (Object.keys(harmony).length === 0) {
    recommendations.push('🎨 Consider adding more harmonious color relationships');
  }
  
  const totalPairs = (colorEntries.length * (colorEntries.length - 1)) / 2;
  const accessiblePairs = Object.values(accessibility).filter(Boolean).length;
  const accessibilityScore = (accessiblePairs / totalPairs) * 100;
  
  if (accessibilityScore < 80) {
    recommendations.push(`📊 Accessibility score: ${accessibilityScore.toFixed(1)}% - needs improvement`);
  }
  
  return {
    contrast,
    accessibility,
    harmony,
    recommendations,
  };
};

// Export for use in other modules
export { relLum, ratio, rgbToOKLab, okLabDistance, rgbToHsl, analyzeHarmony };
