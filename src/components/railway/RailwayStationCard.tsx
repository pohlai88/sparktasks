import type { KeyboardEvent } from "react";
import { useMemo } from "react";

import { ENHANCED_DESIGN_TOKENS } from "../../design/enhanced-tokens";
import type { RailwayStation, StationStatus } from "../../types/railway";
import { RailwayStationZ } from "../../types/railway";
import { cn } from "../../utils/cn";
import { EnhancedBadge } from "../ui-enhanced/Badge";
import { EnhancedCard } from "../ui-enhanced/Card";
import { EnhancedButton } from "../ui-enhanced/Button";
import { EnhancedProgress } from "../ui-enhanced/Progress";

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
        ENHANCED_DESIGN_TOKENS.foundation.motionComponents.cardHover,
        ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
        interactive && ENHANCED_DESIGN_TOKENS.foundation.layout.cursor.pointer,
        disabled && ENHANCED_DESIGN_TOKENS.foundation.layout.cursor['not-allowed']
      )}
    >
      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
        {/* Header */}
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                          <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
            <h3 className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              {parsed.name}
            </h3>
            {parsed.description && (
              <p className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
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
            className={undefined}
          >
            {parsed.status}
          </EnhancedBadge>
        </div>

        {/* Progress Bar */}
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
            <span className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Progress
            </span>
            <span className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
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
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
          {/* Index */}
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            <strong>Position:</strong> {parsed.index + 1}
          </div>

          {/* ETA */}
          {parsed.eta && (
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              <strong>ETA:</strong> {parsed.eta}
            </div>
          )}

          {/* Metrics */}
          {parsed.metrics && (
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xs}>
              {parsed.metrics.openIssues !== undefined && (
                <div className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Open Issues:</strong> {parsed.metrics.openIssues}
                </div>
              )}
              {parsed.metrics.risks !== undefined && (
                <div className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Risks:</strong> {parsed.metrics.risks}
                </div>
              )}
              {parsed.metrics.budgetVariancePct !== undefined && (
                <div className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Budget Variance:</strong> {parsed.metrics.budgetVariancePct}%
                </div>
              )}
            </div>
          )}

          {/* Links */}
          {parsed.links && (
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xs}>
              {parsed.links.href && (
                <div className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                )}>
                  <strong>Link:</strong> {parsed.links.href}
                </div>
              )}
              {parsed.links.docIds && parsed.links.docIds.length > 0 && (
                <div className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
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
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
            ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.md,
            ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
            ENHANCED_DESIGN_TOKENS.foundation.color.border.default
          )}>
            <EnhancedButton
              onClick={(e) => {
                e.stopPropagation();
                onAction(parsed.id, "open");
              }}
              variant="outline"
              size="sm"
            >
              Open
            </EnhancedButton>
            <EnhancedButton
              onClick={(e) => {
                e.stopPropagation();
                onAction(parsed.id, "advance");
              }}
              variant="primary"
              size="sm"
            >
              Advance
            </EnhancedButton>
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
    case "completed": {
      return "success";
    }
    case "delayed": {
      return "warning";
    }
    case "blocked": {
      return "error";
    }
    case "active": {
      return "accent";
    }
    case "planned": {
      return "muted";
    }
    case "cancelled": {
      return "secondary";
    }
  }
}
