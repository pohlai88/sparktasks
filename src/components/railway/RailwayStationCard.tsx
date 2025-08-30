import { useMemo, KeyboardEvent } from "react";
import type { RailwayStation, StationStatus } from "../../types/railway";
import { RailwayStationZ } from "../../types/railway";
import { EnhancedCard } from "../ui-enhanced/Card";
import { EnhancedBadge } from "../ui-enhanced/Badge";
import { EnhancedProgress } from "../ui-enhanced/Progress";
import { ENHANCED_DESIGN_TOKENS } from "../../design/enhanced-tokens";
import { cn } from "../../utils/cn";

export type RailwayStationProps = {
  station: RailwayStation;
  onSelect?: (id: string) => void;
  onAction?: (id: string, action: "open" | "advance" | "rollback") => void;
  disabled?: boolean;
  qaId?: string;
};

export function RailwayStationCard({
  station,
  onSelect,
  onAction,
  disabled = false,
  qaId,
}: RailwayStationProps) {
  // Clamp progress first to ensure valid range before validation
  const clampedProgress = Math.max(0, Math.min(100, Math.round(station.progressPct)));
  
  // Create a sanitized station object for validation
  const sanitizedStation = { ...station, progressPct: clampedProgress };
  
  // Boundary validation (upstream should already validate; this is an extra guard)
  const parsed = useMemo(() => RailwayStationZ.parse(sanitizedStation), [sanitizedStation]);
  const testId = qaId ?? parsed.slug;
  const badgeVariant = mapStatusToBadge(parsed.status);
  const clamped = clampedProgress;

  const interactive = Boolean(onSelect || onAction) && !disabled;
  const role = interactive ? "button" : undefined;
  const tabIndex = interactive ? 0 : -1;
  const ariaDisabled = disabled || undefined;
  const ariaCurrent = parsed.status === "active" ? "step" : undefined;

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(parsed.id);
    }
  };

  const handleClick = () => {
    if (interactive) {
      onSelect?.(parsed.id);
    }
  };

  return (
    <EnhancedCard
      data-testid={testId}
      role={role}
      tabIndex={tabIndex}
      aria-disabled={ariaDisabled}
      aria-current={ariaCurrent}
      onClick={handleClick}
      onKeyDown={handleKey}
      variant="elevated"
      size="md"
      className={cn(
        "transition-all duration-200 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        interactive && "cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed hover:scale-100 active:scale-100"
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              {parsed.name}
            </h3>
            {parsed.description && (
              <p className={cn(
                "text-sm",
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                {parsed.description}
              </p>
            )}
          </div>
          
          {/* Status Badge */}
          <EnhancedBadge
            data-testid={`${testId}__status`}
            data-variant={badgeVariant}
            variant={badgeVariant}
            size="sm"
            className="ml-4"
          >
            {parsed.status}
          </EnhancedBadge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm font-medium",
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Progress
            </span>
            <span className={cn(
              "text-sm font-bold",
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              {clamped}%
            </span>
          </div>
          <EnhancedProgress
            data-testid={`${testId}__progress`}
            value={clamped / 100} // Convert percentage to decimal for EnhancedProgress
            variant="default"
            size="md"
          />
        </div>

        {/* Station Details */}
        <div className="space-y-3">
          {/* Index */}
          <div className={cn(
            'text-xs',
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            <strong>Position:</strong> {parsed.index + 1}
          </div>

          {/* ETA */}
          {parsed.eta && (
            <div className={cn(
              'text-xs',
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              <strong>ETA:</strong> {parsed.eta}
            </div>
          )}

          {/* Metrics */}
          {parsed.metrics && (
            <div className="space-y-1">
              {parsed.metrics.openIssues !== undefined && (
                <div className={cn(
                  'text-xs',
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Open Issues:</strong> {parsed.metrics.openIssues}
                </div>
              )}
              {parsed.metrics.risks !== undefined && (
                <div className={cn(
                  'text-xs',
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Risks:</strong> {parsed.metrics.risks}
                </div>
              )}
              {parsed.metrics.budgetVariancePct !== undefined && (
                <div className={cn(
                  'text-xs',
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Budget Variance:</strong> {parsed.metrics.budgetVariancePct}%
                </div>
              )}
            </div>
          )}

          {/* Links */}
          {parsed.links && (
            <div className="space-y-1">
              {parsed.links.href && (
                <div className={cn(
                  'text-xs',
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Link:</strong> {parsed.links.href}
                </div>
              )}
              {parsed.links.docIds && parsed.links.docIds.length > 0 && (
                <div className={cn(
                  'text-xs',
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Documents:</strong> {parsed.links.docIds.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {onAction && (
          <div className={cn(
            'flex space-x-2 pt-4 border-t',
            ENHANCED_DESIGN_TOKENS.foundation.color.border.default
          )}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(parsed.id, "open");
              }}
              className={cn(
                "px-3 py-1 text-xs rounded",
                ENHANCED_DESIGN_TOKENS.recipes.button.variant.primary,
                "hover:opacity-80 transition-opacity"
              )}
            >
              Open
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(parsed.id, "advance");
              }}
              className={cn(
                "px-3 py-1 text-xs rounded",
                ENHANCED_DESIGN_TOKENS.recipes.button.variant.primary,
                "hover:opacity-80 transition-opacity"
              )}
            >
              Advance
            </button>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}

function mapStatusToBadge(
  status: StationStatus
): "success" | "warning" | "error" | "accent" | "muted" | "secondary" {
  switch (status) {
    case "completed":
      return "success";
    case "delayed":
      return "warning";
    case "blocked":
      return "error";
    case "active":
      return "accent";
    case "planned":
      return "muted";
    case "cancelled":
      return "secondary";
  }
}
