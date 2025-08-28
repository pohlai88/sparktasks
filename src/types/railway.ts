import { z } from "zod";

// Station operational status (UI + logic). Narrow, enumerable.
export type StationStatus =
  | "planned"
  | "active"
  | "blocked"
  | "delayed"
  | "completed"
  | "cancelled";

export interface RailwayStation {
  /** Stable ID across sessions (UUID/string) */
  id: string;
  /** Human label for display */
  name: string;
  /** Kebab-case slug used for URLs/qa-ids. REQUIRED; do not compute in render. */
  slug: string; // e.g. "scheduling"
  /** Station position in the route (0-based) */
  index: number; // >= 0
  /** Operational status */
  status: StationStatus;
  /** Whole-number percentage 0..100 */
  progressPct: number; // int 0..100
  /** Optional ETA (ISO 8601) */
  eta?: string;
  /** Optional short description */
  description?: string;
  /** Optional metrics for badges/heatmaps */
  metrics?: {
    openIssues?: number;
    risks?: number;
    budgetVariancePct?: number; // -100..100
  };
  /** Useful external links (doc ids, deep links) */
  links?: {
    href?: string;
    docIds?: string[];
  };
}

// Validation Schema (must gate all external data)
export const StationStatusZ = z.enum([
  "planned",
  "active",
  "blocked",
  "delayed",
  "completed",
  "cancelled",
]);

export const RailwayStationZ = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), // kebab-case only
  index: z.number().int().min(0),
  status: StationStatusZ,
  progressPct: z.number().int().min(0).max(100),
  eta: z.string().datetime().optional(),
  description: z.string().min(1).max(500).optional(),
  metrics: z
    .object({
      openIssues: z.number().int().min(0).optional(),
      risks: z.number().int().min(0).optional(),
      budgetVariancePct: z.number().min(-100).max(100).optional(),
    })
    .optional(),
  links: z
    .object({
      href: z.string().url().optional(),
      docIds: z.array(z.string()).optional(),
    })
    .optional(),
});

export type RailwayStationValidated = z.infer<typeof RailwayStationZ>;

// Legacy adapter for tests only (NOT for production components)
export const adaptLegacyToStation = (p: {
  id: string;
  name: string;
  status: StationStatus;
  progressPct: number;
}) => ({
  id: p.id,
  name: p.name,
  slug: p.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-"), // compute ONCE in fixture setup
  index: 0,
  status: p.status,
  progressPct: Math.max(0, Math.min(100, Math.round(p.progressPct))),
});
