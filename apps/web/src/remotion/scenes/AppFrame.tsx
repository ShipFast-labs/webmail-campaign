import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../constants";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Mail01Icon,
  UserGroupIcon,
  ChartAnalysisIcon,
  Layout02Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { NamiSendLogo } from "@/components/ui/namis-end-logo";

interface AppFrameProps {
  children: ReactNode;
  /** Active sidebar item label */
  activeItem?: string;
}

const SIDEBAR_WIDTH = 200;
const TOPBAR_HEIGHT = 48;

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: Home01Icon },
  { label: "Campaigns", icon: Mail01Icon },
  { label: "Contacts", icon: UserGroupIcon },
  { label: "Analytics", icon: ChartAnalysisIcon },
  { label: "Templates", icon: Layout02Icon },
  { label: "Settings", icon: Settings01Icon },
];

export function AppFrame({ children, activeItem = "Dashboard" }: AppFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sidebar slides in from left
  const sidebarX = interpolate(frame, [0, 0.6 * fps], [-SIDEBAR_WIDTH, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Content fades in slightly after
  const contentOpacity = interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.creamPaper,
        fontFamily: FONTS.sans,
        overflow: "hidden",
      }}
    >
      {/* Grid background — matches real app */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: COLORS.creamPaper,
          borderRight: `1px solid ${COLORS.hairlineMist}`,
          transform: `translateX(${sidebarX}px)`,
          display: "flex",
          flexDirection: "column",
          padding: "16px 12px",
          zIndex: 10,
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 56, // h-14 equivalent
            padding: "0 12px",
            marginBottom: 16,
          }}
        >
          <NamiSendLogo size={28} showWordmark={true} />
        </div>

        {/* Nav items */}
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = item.label === activeItem;
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 10px",
                borderRadius: 6,
                marginBottom: 2,
                backgroundColor: isActive ? "rgba(0,0,0,0.05)" : "transparent",
              }}
            >
              <HugeiconsIcon
                icon={item.icon}
                size={18}
                className={isActive ? "text-foreground" : "text-foreground/50"}
                color={isActive ? COLORS.inkBlack : COLORS.stoneGray}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? COLORS.inkBlack : COLORS.stoneGray,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          left: SIDEBAR_WIDTH,
          top: 0,
          right: 0,
          height: TOPBAR_HEIGHT,
          backgroundColor: COLORS.creamPaper,
          borderBottom: `1px solid ${COLORS.hairlineMist}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          transform: `translateX(${sidebarX}px)`,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.inkBlack,
          }}
        >
          {activeItem}
        </span>
        {/* Avatar placeholder */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: COLORS.stickyTeal,
            border: `1.5px solid ${COLORS.inkBlack}`,
          }}
        />
      </div>

      {/* Main content area */}
      <div
        style={{
          position: "absolute",
          left: SIDEBAR_WIDTH,
          top: TOPBAR_HEIGHT,
          right: 0,
          bottom: 0,
          padding: 20,
          overflow: "hidden",
          opacity: contentOpacity,
          transform: `translateX(${sidebarX}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
