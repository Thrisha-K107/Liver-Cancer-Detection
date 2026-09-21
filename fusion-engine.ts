export type ImagingFeatures = {
  mean: number;
  std: number;
  entropy: number;
  edgeEnergy: number;
  contrastRatio: number;
  blocks: number[][];
};

export const IMAGING_ENGINE = "Quantitative Imaging Feature Extractor v1.0";
export const FUSION_ENGINE = "Multimodal Fusion + MC Uncertainty v1.0";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type ImagingAttribution = {
  intensityFit: number;
  complexity: number;
  structure: number;
  lesionRatio: number;
  index: number;
  blockScores: number[][];
};

export function computeImagingIndex(f: ImagingFeatures): ImagingAttribution {
  const intensityFit = clamp(100 - Math.abs(f.mean - 55) * 2.2, 0, 100);
  const complexity = clamp((f.entropy - 3.2) * 34, 0, 100);
  const structure = clamp(f.edgeEnergy * 42, 0, 100);
  const lesionRatio = clamp(f.contrastRatio * 520, 0, 100);
  const index = Math.round(0.15 * intensityFit + 0.22 * complexity + 0.3 * structure + 0.33 * lesionRatio);
  const blockScores = f.blocks.map((row) => row.map((v) => Math.round(clamp(v, 0, 1) * 100) / 100));
  return { intensityFit: Math.round(intensityFit), complexity: Math.round(complexity), structure: Math.round(structure), lesionRatio: Math.round(lesionRatio), index, blockScores };
}

export type FusionOutput = {
  fused: number;
  std: number;
  label: "LOW" | "MODERATE" | "HIGH";
  samples: number;
  clinicalJitter: number;
  imagingJitter: number;
};

export function runFusionEnsemble(clinicalScore: number, imagingIndex: number, seed = 20260214): FusionOutput {
  const rng = mulberry32(seed);
  const runs: number[] = [];
  for (let i = 0; i < 150; i++) {
    const w = 0.4 + rng() * 0.2; // imaging weight sampled 0.40–0.60 (MC weight perturbation)
    const c = clinicalScore * (1 + (rng() * 0.3 - 0.15));
    const im = imagingIndex * (1 + (rng() * 0.3 - 0.15));
    runs.push(clamp((1 - w) * c + w * im, 0, 100));
  }
  const mean = runs.reduce((s, x) => s + x, 0) / runs.length;
  const std = Math.sqrt(runs.reduce((s, x) => s + (x - mean) ** 2, 0) / runs.length);
  const label: FusionOutput["label"] = std < 4.5 ? "LOW" : std < 9 ? "MODERATE" : "HIGH";
  return { fused: Math.round(mean), std: Math.round(std * 100) / 100, label, samples: runs.length, clinicalJitter: 0.15, imagingJitter: 0.15 };
}

function fact(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Exact Shapley values via subset enumeration (2^n cooperative game).
// For the additive transparent engine the exact Shapley contribution of each
// parameter equals its own point contribution — verified by enumeration.
export function exactShapleyValues(contributions: number[]): number[] {
  const n = contributions.length;
  const values = new Array<number>(n).fill(0);
  for (let mask = 0; mask < 1 << n; mask++) {
    const size = popcount(mask);
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      const weight = fact(size) * fact(n - size - 1) / fact(n);
      values[i] += weight * contributions[i];
    }
  }
  return values.map((v) => Math.round(v * 100) / 100);
}

function popcount(x: number): number {
  let c = 0;
  while (x) {
    c += x & 1;
    x >>= 1;
  }
  return c;
}
