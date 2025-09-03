import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RailwayStationZ, type RailwayStation } from "../../../src/types/railway";
import { RailwayStationCard } from "../../../src/components/railway/RailwayStationCard";

// Type-safe fixture data - omit optional properties entirely
const typeSafeStations: RailwayStation[] = [
  {
    id: "init",
    name: "Initiation",
    slug: "initiation",
    index: 0,
    status: "completed",
    progressPct: 100
  },
  {
    id: "sched",
    name: "Scheduling",
    slug: "scheduling",
    index: 2,
    status: "active",
    progressPct: 65
  }
];

describe("RailwayStationCard", () => {
  it("renders a valid station without errors", () => {
    const station = typeSafeStations[1]!;
    render(<RailwayStationCard station={station} />);
    expect(screen.getByText("Scheduling")).toBeInTheDocument();
    expect(screen.getByTestId("scheduling__status")).toHaveTextContent("active");
  });

  it("rejects invalid station (missing slug) at validation boundary", () => {
    const bad = { ...typeSafeStations[0]!, slug: "" };
    expect(() => RailwayStationZ.parse(bad)).toThrow();
  });

  it("fires onSelect on click and Enter", () => {
    const station = typeSafeStations[1];
    const onSelect = vi.fn();
    render(<RailwayStationCard station={station} onSelect={onSelect} />);
    const card = screen.getByTestId("scheduling");
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith("sched");
  });

  it("displays progress correctly", () => {
    const station = typeSafeStations[1];
    render(<RailwayStationCard station={station} />);
    
    const progressBar = screen.getByTestId("scheduling__progress");
    expect(progressBar).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
  });

  it("shows correct status badge variant", () => {
    const station = typeSafeStations[1];
    render(<RailwayStationCard station={station} />);
    
    const statusBadge = screen.getByTestId("scheduling__status");
    expect(statusBadge).toHaveAttribute("data-variant", "accent");
  });

  it("handles disabled state correctly", () => {
    const station = typeSafeStations[1];
    render(<RailwayStationCard station={station} disabled={true} />);
    
    const card = screen.getByTestId("scheduling");
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).toHaveAttribute("tabIndex", "-1");
  });

  it("calls onAction when action buttons are clicked", () => {
    const station = typeSafeStations[1];
    const onAction = vi.fn();
    render(<RailwayStationCard station={station} onAction={onAction} />);
    
    const openButton = screen.getByText("Open");
    const advanceButton = screen.getByText("Advance");
    
    fireEvent.click(openButton);
    expect(onAction).toHaveBeenCalledWith("sched", "open");
    
    fireEvent.click(advanceButton);
    expect(onAction).toHaveBeenCalledWith("sched", "advance");
  });

  it("displays optional fields when provided", () => {
    const stationWithDetails: RailwayStation = {
      id: "test",
      name: "Test Station",
      slug: "test-station",
      index: 0,
      status: "completed",
      progressPct: 100,
      description: "Test description",
      eta: "2025-12-31T23:59:59Z",
      metrics: {
        openIssues: 5,
        risks: 2,
        budgetVariancePct: -10
      },
      links: {
        href: "https://example.com",
        docIds: ["doc1", "doc2"]
      }
    };
    
    render(<RailwayStationCard station={stationWithDetails} />);
    
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getAllByText((content, element) => {
      return element?.textContent?.includes("ETA:") && element?.textContent?.includes("2025-12-31T23:59:59Z");
    }).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Open Issues:") && element?.textContent?.includes("5");
    }).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Risks:") && element?.textContent?.includes("2");
    }).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Budget Variance:") && element?.textContent?.includes("-10%");
    }).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Link:") && element?.textContent?.includes("https://example.com");
    }).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, element) => {
      return element?.textContent?.includes("Documents:") && element?.textContent?.includes("doc1, doc2");
    }).length).toBeGreaterThan(0);
  });

  it("clamps progress percentage to valid range", () => {
    const stationWithInvalidProgress: RailwayStation = {
      id: "test",
      name: "Test Station",
      slug: "test-station",
      index: 0,
      status: "completed",
      progressPct: 150 // Invalid: > 100
    };
    
    render(<RailwayStationCard station={stationWithInvalidProgress} />);
    
    // Should display clamped value (100%)
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("uses custom qaId when provided", () => {
    const station = typeSafeStations[1];
    const customQaId = "custom-test-id";
    render(<RailwayStationCard station={station} qaId={customQaId} />);
    
    const card = screen.getByTestId(customQaId);
    expect(card).toBeInTheDocument();
  });
});
