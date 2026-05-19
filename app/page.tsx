"use client";

import { type CSSProperties, type ChangeEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  BellElectric,
  BotMessageSquare,
  Box,
  Copy,
  Download,
  FileJson,
  Image,
  Layers,
  MousePointerClick,
  Orbit,
  Package,
  PanelTop,
  PanelsTopLeft,
  Pencil,
  Rabbit,
  Save,
  Sandwich,
  Sparkles,
  WandSparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";

const componentTypes = [
  "Button",
  "Card",
  "Modal",
  "Toast",
  "Graphic",
] as const;

const motionPresets = [
  "Soft Entrance",
  "Floating",
  "Press Feedback",
  "Hover Glow",
  "Notification Pop",
  "Card Stagger",
  "Breathing",
  "Playful Bounce",
  "Intelligent Drift",
  "Alert Pulse",
] as const;

const accentOptions = [
  { name: "White", color: "#ffffff", textColor: "#000000" },
  { name: "Blue", color: "#60a5fa", textColor: "#ffffff" },
  { name: "Green", color: "#34d399", textColor: "#001510" },
  { name: "Purple", color: "#a78bfa", textColor: "#ffffff" },
  { name: "Orange", color: "#fb923c", textColor: "#1f1307" },
] as const;

type ComponentType = (typeof componentTypes)[number];
type MotionPreset = (typeof motionPresets)[number];
type AccentName = string;
type ThemeMode = "Light" | "Dark";

type ComponentContent = {
  buttonText: string;
  cardTitle: string;
  cardDescription: string;
  cardCta: string;
  modalTitle: string;
  modalBody: string;
  modalPrimary: string;
  modalSecondary: string;
  toastTitle: string;
  toastMessage: string;
};

const componentIcons: Record<ComponentType, LucideIcon> = {
  Button: Box,
  Card: PanelTop,
  Modal: PanelsTopLeft,
  Toast: Sandwich,
  Graphic: Image,
};

const motionPresetIcons: Record<MotionPreset, LucideIcon> = {
  "Soft Entrance": Sparkles,
  Floating: Orbit,
  "Press Feedback": MousePointerClick,
  "Hover Glow": WandSparkles,
  "Notification Pop": Bell,
  "Card Stagger": Layers,
  Breathing: Waves,
  "Playful Bounce": Rabbit,
  "Intelligent Drift": BotMessageSquare,
  "Alert Pulse": BellElectric,
};

const defaultComponentContent: ComponentContent = {
  buttonText: "Get started",
  cardTitle: "Product update",
  cardDescription: "A minimal card preview with motion applied.",
  cardCta: "View details",
  modalTitle: "Confirm action",
  modalBody: "This modal uses a simple entrance motion.",
  modalPrimary: "Continue",
  modalSecondary: "Cancel",
  toastTitle: "Changes saved",
  toastMessage: "Your motion preset was applied.",
};

const defaultComponentSettingsByType: Record<ComponentType, ComponentSettings> = {
  Button: { width: 180, height: 48, radius: 12 },
  Card: { width: 320, height: 180, radius: 16 },
  Modal: { width: 360, height: 220, radius: 18 },
  Toast: { width: 320, height: 72, radius: 16 },
  Graphic: { width: 180, height: 180, radius: 12 },
};

const componentContentFields: Record<
  ComponentType,
  { key: keyof ComponentContent; label: string }[]
> = {
  Button: [{ key: "buttonText", label: "Button text" }],
  Card: [
    { key: "cardTitle", label: "Title" },
    { key: "cardDescription", label: "Description" },
    { key: "cardCta", label: "CTA text" },
  ],
  Modal: [
    { key: "modalTitle", label: "Title" },
    { key: "modalBody", label: "Body" },
    { key: "modalPrimary", label: "Primary button" },
    { key: "modalSecondary", label: "Secondary button" },
  ],
  Toast: [
    { key: "toastTitle", label: "Title" },
    { key: "toastMessage", label: "Message" },
  ],
  Graphic: [],
};

type GenerationHistoryItem = {
  id: string;
  prompt: string;
  componentType: ComponentType;
  componentContent: ComponentContent;
  contentEdited: boolean;
  motionPreset: MotionPreset;
  intensity: number;
  speed: number;
  softness: number;
  componentWidth: number;
  componentHeight: number;
  componentRadius: number;
  componentDimensionsEdited: boolean;
  accentName: AccentName;
  accentColor: string;
  createdAt: string;
};

type SelectedImage = {
  name: string;
  previewUrl: string | null;
};

type MotionAsset = {
  id: string;
  name: string;
  prompt: string;
  componentType: ComponentType;
  componentSpecified: boolean;
  componentContent: ComponentContent;
  contentEdited: boolean;
  motionPreset: MotionPreset;
  intensity: number;
  speed: number;
  softness: number;
  componentWidth: number;
  componentHeight: number;
  componentRadius: number;
  componentDimensionsEdited: boolean;
  uploadedImage: SelectedImage | null;
  createdAt: string;
  accentName: AccentName;
  accentColor: string;
};

type ComponentSettings = {
  width: number;
  height: number;
  radius: number;
};

type MotionConfig = {
  intensityFactor: number;
  duration: number;
  spring: { stiffness: number; damping: number };
  hoverScale: number;
  tapScale: number;
  entranceY: number;
  floatDistance: number;
  ease: [number, number, number, number] | "easeInOut" | "easeOut";
};

type AccentConfig = {
  name: AccentName;
  color: string;
  textColor: string;
  glow: string;
  soft: string;
};

const colorWords: Record<string, string> = {
  white: "White",
  blue: "Blue",
  green: "Green",
  purple: "Purple",
  violet: "Purple",
  orange: "Orange",
  amber: "Orange",
  red: "#ef4444",
  rose: "#fb7185",
  pink: "#ec4899",
  yellow: "#facc15",
  gold: "#f59e0b",
  cyan: "#22d3ee",
  teal: "#2dd4bf",
  black: "#111111",
  gray: "#737373",
  grey: "#737373",
};

function hexToRgb(color: string) {
  const raw = color.replace("#", "");
  const normalized =
    raw.length === 3
      ? raw
          .split("")
          .map((value) => value + value)
          .join("")
      : raw;

  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbStringToRgb(color: string) {
  const match = color.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i
  );

  if (!match) {
    return null;
  }

  const [r, g, b] = match.slice(1, 4).map((value) =>
    Math.min(255, Math.max(0, Math.round(Number(value))))
  );

  return Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)
    ? { r, g, b }
    : null;
}

function colorParts(color: string) {
  if (!color || typeof color !== "string") {
    return hexToRgb("#ffffff");
  }

  return color.startsWith("#") ? hexToRgb(color) : rgbStringToRgb(color);
}

function colorInputValue(color: string) {
  const parts = colorParts(color);

  if (!parts) {
    return "#ffffff";
  }

  return `#${[parts.r, parts.g, parts.b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function alphaColor(color: string, alpha: number) {
  const parts = colorParts(color);

  return parts
    ? `rgba(${parts.r}, ${parts.g}, ${parts.b}, ${alpha})`
    : color;
}

function contrastTextColor(color: string) {
  const parts = colorParts(color);

  if (!parts) {
    return "#ffffff";
  }

  const brightness = (parts.r * 299 + parts.g * 587 + parts.b * 114) / 1000;

  return brightness > 160 ? "#000000" : "#ffffff";
}

function accentConfig(name: AccentName): AccentConfig {
  const option =
    accentOptions.find((accent) => accent.name === name) ??
    ({
      name,
      color: name,
      textColor: contrastTextColor(name),
    } as const);
  const glowAlpha = option.name === "White" ? 0.28 : 0.38;

  return {
    ...option,
    glow: alphaColor(option.color, glowAlpha),
    soft: alphaColor(option.color, 0.14),
  };
}

function parsePromptAccent(prompt: string) {
  const hexMatch = prompt.match(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i);

  if (hexMatch) {
    return hexMatch[0];
  }

  const rgbMatch = prompt.match(
    /rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*[\d.]+)?\s*\)/i
  );

  if (rgbMatch) {
    return rgbMatch[0];
  }

  const lower = prompt.toLowerCase();
  const words = Object.keys(colorWords).sort((a, b) => b.length - a.length);
  const word = words.find((name) => new RegExp(`\\b${name}\\b`).test(lower));

  return word ? colorWords[word] : null;
}

function isPresetAccent(name: AccentName) {
  return accentOptions.some((accent) => accent.name === name);
}

function deriveMotionConfig(
  intensity: number,
  speed: number,
  softness: number
): MotionConfig {
  const intensityFactor = 0.5 + (intensity / 100) * 0.9;
  const duration = Math.max(0.35, 2.2 - (speed / 100) * 1.85);
  const stiffness = Math.round(110 + (100 - softness) * 4.2);
  const damping = Math.round(10 + softness * 0.38);
  const ease: MotionConfig["ease"] =
    softness >= 66
      ? [0.25, 0.1, 0.25, 1]
      : softness <= 33
        ? [0.4, 0, 0.2, 1]
        : "easeInOut";

  return {
    intensityFactor,
    duration,
    spring: { stiffness, damping },
    hoverScale: 1 + 0.04 * intensityFactor,
    tapScale: 1 - 0.06 * intensityFactor,
    entranceY: 10 + intensity * 0.22,
    floatDistance: 5 + intensity * 0.14,
    ease,
  };
}

function workspaceLabels(
  componentType: ComponentType,
  motionPreset: MotionPreset
) {
  return {
    previewTitle: `${componentType} · ${motionPreset}`,
    previewSubtitle: `${motionPreset} motion applied to ${componentType.toLowerCase()} component`,
  };
}

const defaultPrompt =
  "Describe motion, emotion, and interaction...";

function promptSpecifiesComponent(prompt: string) {
  return /\b(button|card|modal|dialog|toast|notification)\b/i.test(
    prompt
  );
}

function analyzePrompt(
  prompt: string,
  currentComponentType: ComponentType,
  currentMotionPreset: MotionPreset
) {
  const lower = prompt.toLowerCase();
  let componentType = currentComponentType;
  let motionPreset = currentMotionPreset;

  if (lower.includes("soft") || lower.includes("calm")) {
    motionPreset = "Soft Entrance";
  }
  if (lower.includes("floating") || lower.includes("float")) {
    motionPreset = "Floating";
  }
  if (lower.includes("button")) {
    componentType = "Button";
  }
  if (lower.includes("card")) {
    componentType = "Card";
  }
  if (lower.includes("modal") || lower.includes("dialog")) {
    componentType = "Modal";
  }
  if (lower.includes("toast") || lower.includes("notification")) {
    componentType = "Toast";
  }
  if (lower.includes("graphic") || lower.includes("image")) {
    componentType = "Graphic";
  }
  if (
    lower.includes("press") ||
    lower.includes("tap") ||
    lower.includes("click")
  ) {
    motionPreset = "Press Feedback";
  }
  if (lower.includes("hover") || lower.includes("glow")) {
    motionPreset = "Hover Glow";
  }
  if (lower.includes("pop") || lower.includes("notification")) {
    motionPreset = "Notification Pop";
  }
  if (lower.includes("stagger")) {
    motionPreset = "Card Stagger";
  }

  let intensity = 64;
  let speed = 48;
  let softness = 72;

  if (lower.includes("soft") || lower.includes("calm")) {
    intensity = 52;
    speed = 38;
    softness = 84;
  }
  if (lower.includes("floating") || lower.includes("float")) {
    intensity = 48;
    speed = 42;
    softness = 76;
  }
  if (lower.includes("fast") || lower.includes("snappy") || lower.includes("urgent")) {
    speed = 78;
    intensity = 72;
    softness = 40;
  }
  if (lower.includes("bold") || lower.includes("strong")) {
    intensity = 82;
    speed = 58;
    softness = 48;
  }

  const reasoningTags: string[] = [];

  if (lower.includes("soft") || lower.includes("calm")) {
    reasoningTags.push("soft motion language detected");
  }
  if (lower.includes("floating") || lower.includes("float")) {
    reasoningTags.push("floating rhythm inferred");
  }
  if (lower.includes("button")) {
    reasoningTags.push("button component context matched");
  }
  if (lower.includes("card")) {
    reasoningTags.push("card layout pattern detected");
  }
  if (lower.includes("modal") || lower.includes("dialog")) {
    reasoningTags.push("overlay transition considered");
  }
  if (lower.includes("toast") || lower.includes("notification")) {
    reasoningTags.push("ephemeral entry timing evaluated");
  }
  if (lower.includes("graphic") || lower.includes("image")) {
    reasoningTags.push("graphic preview mode selected");
  }
  if (reasoningTags.length === 0) {
    reasoningTags.push(
      "prompt keywords scanned",
      "motion preset ranked",
      "preview scaffold updated"
    );
  }

  const labels = workspaceLabels(componentType, motionPreset);

  return {
    componentType,
    motionPreset,
    reasoningTags,
    intensity,
    speed,
    softness,
    previewTitle: labels.previewTitle,
    previewSubtitle: labels.previewSubtitle,
  };
}

function tsxExportMotionProps(
  motionPreset: MotionPreset,
  config: MotionConfig,
  accent: AccentConfig,
  duration: string,
  stiffness: number,
  damping: number,
  hoverScale: string,
  tapScale: string
) {
  switch (motionPreset) {
    case "Breathing":
      return `animate={{ scale: [1, 1.025, 1], opacity: [1, 0.96, 1] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}`;
    case "Playful Bounce":
      return `animate={{
        y: [0, -6, 0],
        scale: [1, 1.08, 0.98, 1.04, 1],
        rotate: [0, -1, 0.8, 0],
      }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}`;
    case "Intelligent Drift":
      return `animate={{
        x: [0, 4, -2, 0],
        rotate: [0, 1, -1, 0],
        scale: [1, 1.02, 1.01, 1],
        opacity: [1, 0.97, 1],
      }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}`;
    case "Alert Pulse":
      return `animate={{
        scale: [1, 1.12, 1],
        opacity: [1, 0.7, 1],
        boxShadow: [
          "0 0 0px rgba(255,255,255,0)",
          "0 0 ${18 + config.intensityFactor * 18}px ${accent.glow}",
          "0 0 0px rgba(255,255,255,0)",
        ],
      }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}`;
    default:
      return `initial={{ opacity: 0, y: ${config.entranceY.toFixed(0)} }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: ${hoverScale} }}
      whileTap={{ scale: ${tapScale} }}
      transition={{
        duration: ${duration},
        type: "spring",
        stiffness: ${stiffness},
        damping: ${damping},
      }}`;
  }
}

function cssExportMotionRules(
  motionPreset: MotionPreset,
  config: MotionConfig,
  softness: number,
  duration: string,
  hoverScale: string,
  accent: AccentConfig,
  width: number,
  height: number,
  radius: number
) {
  const base = `.motion-target {
  width: ${width}px;
  height: ${height}px;
  border-radius: ${radius}px;
  transform-origin: center;`;

  switch (motionPreset) {
    case "Breathing":
      return `${base}
  animation: motion-breathing 2.8s ease-in-out infinite;
}

@keyframes motion-breathing {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.96; transform: scale(1.025); }
}`;
    case "Playful Bounce":
      return `${base}
  animation: motion-playful-bounce 1.2s ease-in-out infinite;
}

@keyframes motion-playful-bounce {
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  25% { transform: translateY(-6px) scale(1.08) rotate(-1deg); }
  50% { transform: translateY(0) scale(0.98) rotate(0.8deg); }
  75% { transform: translateY(-3px) scale(1.04) rotate(0deg); }
}`;
    case "Intelligent Drift":
      return `${base}
  animation: motion-intelligent-drift 2.6s ease-in-out infinite;
}

@keyframes motion-intelligent-drift {
  0%, 100% { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
  33% { opacity: 0.97; transform: translateX(4px) scale(1.02) rotate(1deg); }
  66% { opacity: 1; transform: translateX(-2px) scale(1.01) rotate(-1deg); }
}`;
    case "Alert Pulse":
      return `${base}
  animation: motion-alert-pulse 0.7s ease-in-out infinite;
}

@keyframes motion-alert-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0px rgba(255,255,255,0);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.12);
    box-shadow: 0 0 ${18 + config.intensityFactor * 18}px ${accent.glow};
  }
}`;
    default:
      return `${base}
  animation: motion-preview ${duration}s ${softness >= 66 ? "ease-in-out" : "ease-out"} forwards;
}

.motion-target:hover {
  transform: scale(${hoverScale});
}

@keyframes motion-preview {
  from {
    opacity: 0;
    transform: translateY(${config.entranceY.toFixed(0)}px) scale(${(
        1 -
        0.04 * config.intensityFactor
      ).toFixed(2)});
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}`;
  }
}

function motionJsonDuration(motionPreset: MotionPreset, fallbackDuration: string) {
  switch (motionPreset) {
    case "Breathing":
      return 2.8;
    case "Playful Bounce":
      return 1.2;
    case "Intelligent Drift":
      return 2.6;
    case "Alert Pulse":
      return 0.7;
    default:
      return Number(fallbackDuration);
  }
}

function buildExportCode(
  format: ExportFormat,
  componentType: ComponentType,
  motionPreset: MotionPreset,
  intensity: number,
  speed: number,
  softness: number,
  componentSettings: ComponentSettings,
  content: ComponentContent,
  accentName: AccentName,
  uploadedImage: SelectedImage | null
) {
  const config = deriveMotionConfig(intensity, speed, softness);
  const duration = config.duration.toFixed(2);
  const stiffness = config.spring.stiffness;
  const damping = config.spring.damping;
  const hoverScale = config.hoverScale.toFixed(2);
  const tapScale = config.tapScale.toFixed(2);
  const jsonDuration = motionJsonDuration(motionPreset, duration);
  const { width, height, radius } = componentSettings;
  const accent = accentConfig(accentName);
  const tsxMotionProps = tsxExportMotionProps(
    motionPreset,
    config,
    accent,
    duration,
    stiffness,
    damping,
    hoverScale,
    tapScale
  );
  const cssMotionRules = cssExportMotionRules(
    motionPreset,
    config,
    softness,
    duration,
    hoverScale,
    accent,
    width,
    height,
    radius
  );
  const assetInfo = uploadedImage
    ? {
        type: "image",
        name: uploadedImage.name,
        hasPreview: Boolean(uploadedImage.previewUrl),
        previewUrl: uploadedImage.previewUrl,
      }
    : null;

  switch (format) {
    case "TSX":
      return `import { motion } from "motion/react";

export function ${componentType.replace(/\s/g, "")}Motion() {
  return (
    <motion.div
      // ${componentType} · ${motionPreset}
      style={{
        width: ${width},
        height: ${height},
        borderRadius: ${radius},
        transformOrigin: "center",
      }}
      ${tsxMotionProps}
    >
      ${previewContentText(componentType, content)}
    </motion.div>
  );
}`;
    case "HTML/CSS":
      return `/* ${componentType} · ${motionPreset}
   Content: ${previewContentText(componentType, content)} */
${cssMotionRules}`;
    case "JSON":
      return JSON.stringify(
        {
          version: "0.1",
          componentType,
          motionPreset,
          parameters: { intensity, speed, softness },
          componentSettings: { width, height, radius },
          style: {
            accentName,
            accentColor: accent.color,
            textColor: accent.textColor,
          },
          content: previewContentObject(componentType, content),
          asset: assetInfo,
          transition: {
            duration: jsonDuration,
            stiffness,
            damping,
            hoverScale: Number(hoverScale),
            tapScale: Number(tapScale),
          },
        },
        null,
        2
      );
  }
}

function previewContentText(
  componentType: ComponentType,
  content: ComponentContent
) {
  switch (componentType) {
    case "Button":
      return content.buttonText;
    case "Card":
      return `${content.cardTitle} / ${content.cardDescription} / ${content.cardCta}`;
    case "Modal":
      return `${content.modalTitle} / ${content.modalBody} / ${content.modalSecondary} / ${content.modalPrimary}`;
    case "Toast":
      return `${content.toastTitle} / ${content.toastMessage}`;
    case "Graphic":
      return "Graphic image";
  }
}

function previewContentObject(
  componentType: ComponentType,
  content: ComponentContent
) {
  switch (componentType) {
    case "Button":
      return { text: content.buttonText };
    case "Card":
      return {
        title: content.cardTitle,
        description: content.cardDescription,
        cta: content.cardCta,
      };
    case "Modal":
      return {
        title: content.modalTitle,
        body: content.modalBody,
        primaryButton: content.modalPrimary,
        secondaryButton: content.modalSecondary,
      };
    case "Toast":
      return { title: content.toastTitle, message: content.toastMessage };
    case "Graphic":
      return { mode: "uploaded image" };
  }
}

const exportFormats = ["TSX", "HTML/CSS", "JSON"] as const;

type ExportFormat = (typeof exportFormats)[number];

function exportFileName(format: ExportFormat, componentType: ComponentType) {
  const baseName = `${componentType.toLowerCase()}-motion`;

  switch (format) {
    case "TSX":
      return `${baseName}.tsx`;
    case "HTML/CSS":
      return `${baseName}.css`;
    case "JSON":
      return `${baseName}.json`;
  }
}

function isComponentType(value: unknown): value is ComponentType {
  return componentTypes.includes(value as ComponentType);
}

function isMotionPreset(value: unknown): value is MotionPreset {
  return motionPresets.includes(value as MotionPreset);
}

function parameterValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value)))
    : fallback;
}

function pixelValue(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : fallback;
}

function previewScale({ width, height }: ComponentSettings) {
  const maxWidth = 420;
  const maxHeight = 300;
  const scale = Math.min(maxWidth / width, maxHeight / height);

  return Math.min(1, Math.max(0.35, scale));
}

function componentContentScale(
  componentType: ComponentType,
  { width, height }: ComponentSettings
) {
  const baseSize: Record<ComponentType, { width: number; height: number }> = {
    Button: { width: 180, height: 48 },
    Card: { width: 320, height: 180 },
    Modal: { width: 360, height: 220 },
    Toast: { width: 320, height: 72 },
    Graphic: { width: 320, height: 180 },
  };
  const base = baseSize[componentType];
  const scale = Math.min(width / base.width, height / base.height);

  return Math.min(3, Math.max(0.55, scale));
}

function componentContentFromSchema(
  current: ComponentContent,
  schemaContent: Record<string, unknown>,
  componentType: ComponentType
): ComponentContent {
  return {
    ...current,
    buttonText:
      typeof schemaContent.buttonText === "string"
        ? schemaContent.buttonText
        : typeof schemaContent.text === "string"
        ? schemaContent.text
        : typeof schemaContent.cta === "string" && componentType === "Button"
          ? schemaContent.cta
          : current.buttonText,
    cardTitle:
      typeof schemaContent.cardTitle === "string"
        ? schemaContent.cardTitle
        : typeof schemaContent.title === "string"
        ? schemaContent.title
        : current.cardTitle,
    cardDescription:
      typeof schemaContent.cardDescription === "string"
        ? schemaContent.cardDescription
        : typeof schemaContent.description === "string"
        ? schemaContent.description
        : current.cardDescription,
    cardCta:
      typeof schemaContent.cardCta === "string"
        ? schemaContent.cardCta
        : typeof schemaContent.cta === "string"
          ? schemaContent.cta
          : current.cardCta,
    modalTitle:
      typeof schemaContent.modalTitle === "string"
        ? schemaContent.modalTitle
        : typeof schemaContent.title === "string"
        ? schemaContent.title
        : current.modalTitle,
    modalBody:
      typeof schemaContent.modalBody === "string"
        ? schemaContent.modalBody
        : typeof schemaContent.body === "string"
        ? schemaContent.body
        : typeof schemaContent.description === "string" &&
            componentType === "Modal"
          ? schemaContent.description
          : current.modalBody,
    modalPrimary:
      typeof schemaContent.modalPrimary === "string"
        ? schemaContent.modalPrimary
        : typeof schemaContent.primaryButton === "string"
        ? schemaContent.primaryButton
        : typeof schemaContent.cta === "string" && componentType === "Modal"
          ? schemaContent.cta
          : current.modalPrimary,
    modalSecondary:
      typeof schemaContent.modalSecondary === "string"
        ? schemaContent.modalSecondary
        : typeof schemaContent.secondaryButton === "string"
        ? schemaContent.secondaryButton
        : current.modalSecondary,
    toastTitle:
      typeof schemaContent.toastTitle === "string"
        ? schemaContent.toastTitle
        : typeof schemaContent.title === "string"
        ? schemaContent.title
        : current.toastTitle,
    toastMessage:
      typeof schemaContent.toastMessage === "string"
        ? schemaContent.toastMessage
        : typeof schemaContent.message === "string"
        ? schemaContent.message
        : typeof schemaContent.description === "string" &&
            componentType === "Toast"
          ? schemaContent.description
          : current.toastMessage,
  };
}

function themeVariables(themeMode: ThemeMode) {
  return {
    "--app-bg": themeMode === "Dark" ? "#0b0d10" : "#f6f6f3",
    "--panel-bg": themeMode === "Dark" ? "#0f1115" : "#ffffff",
    "--surface-bg": themeMode === "Dark" ? "#101318" : "#eeeeeb",
    "--preview-bg": themeMode === "Dark" ? "#14171c" : "#e9e9e5",
    "--text-primary": themeMode === "Dark" ? "#f5f5f5" : "#18181b",
    "--text-secondary": themeMode === "Dark" ? "#d4d4d4" : "#3f3f46",
    "--text-muted": themeMode === "Dark" ? "#737373" : "#71717a",
    "--border-color":
      themeMode === "Dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(24,24,27,0.12)",
    "--border-strong":
      themeMode === "Dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(24,24,27,0.22)",
    "--control-bg":
      themeMode === "Dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(24,24,27,0.05)",
    "--control-bg-strong":
      themeMode === "Dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(24,24,27,0.1)",
    "--inverse-bg": themeMode === "Dark" ? "#ffffff" : "#18181b",
    "--inverse-text": themeMode === "Dark" ? "#000000" : "#ffffff",
    "--grid-line":
      themeMode === "Dark"
        ? "rgba(255,255,255,0.04)"
        : "rgba(24,24,27,0.08)",
    "--generating-text":
      themeMode === "Dark" ? "rgba(245,245,245,0.82)" : "rgba(24,24,27,0.78)",
    "--generate-bg": themeMode === "Dark" ? "#ffffff" : "#18181b",
    "--generate-hover-bg": themeMode === "Dark" ? "#e5e5e5" : "#3f3f46",
    "--generate-text": themeMode === "Dark" ? "#000000" : "#ffffff",
  } as CSSProperties;
}

export default function Home() {
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("Dark");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [componentType, setComponentType] =
    useState<ComponentType>("Button");
  const [componentSpecified, setComponentSpecified] = useState(false);
  const [motionPreset, setMotionPreset] =
    useState<MotionPreset>("Soft Entrance");
  const [componentContent, setComponentContent] = useState<ComponentContent>(
    defaultComponentContent
  );
  const [contentEdited, setContentEdited] = useState(false);
  const initialLabels = workspaceLabels("Button", "Soft Entrance");
  const [previewTitle, setPreviewTitle] = useState(initialLabels.previewTitle);
  const [previewSubtitle, setPreviewSubtitle] = useState(
    initialLabels.previewSubtitle
  );
  const [generationHistory, setGenerationHistory] = useState<
    GenerationHistoryItem[]
  >([]);
  const [motionAssets, setMotionAssets] = useState<MotionAsset[]>([]);
  const [uploadedImage, setUploadedImage] = useState<SelectedImage | null>(
    null
  );
  const [intensity, setIntensity] = useState(64);
  const [speed, setSpeed] = useState(48);
  const [softness, setSoftness] = useState(72);
  const [componentWidth, setComponentWidth] = useState(
    defaultComponentSettingsByType.Button.width
  );
  const [componentHeight, setComponentHeight] = useState(
    defaultComponentSettingsByType.Button.height
  );
  const [componentRadius, setComponentRadius] = useState(
    defaultComponentSettingsByType.Button.radius
  );
  const [componentDimensionsEdited, setComponentDimensionsEdited] =
    useState(false);
  const [accentName, setAccentName] = useState<AccentName>("White");
  const [accentColor, setAccentColor] = useState("#ffffff");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const componentSettings = {
    width: componentWidth,
    height: componentHeight,
    radius: componentRadius,
  };
  const previewComponentSettings = componentDimensionsEdited
    ? componentSettings
    : {
        ...defaultComponentSettingsByType[componentType],
        radius: componentRadius,
      };

  function handleContentChange(key: keyof ComponentContent, value: string) {
    setContentEdited(true);
    setComponentContent((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleComponentTypeChange(type: ComponentType) {
    const defaults = defaultComponentSettingsByType[type];

    setComponentType(type);
    setComponentSpecified(type !== "Graphic");
    setComponentWidth(defaults.width);
    setComponentHeight(defaults.height);
    setComponentRadius(defaults.radius);
    setComponentDimensionsEdited(false);
    const labels = workspaceLabels(type, motionPreset);
    setPreviewTitle(labels.previewTitle);
    setPreviewSubtitle(labels.previewSubtitle);
  }

  function handleMotionPresetChange(preset: MotionPreset) {
    setMotionPreset(preset);
    const labels = workspaceLabels(componentType, preset);
    setPreviewTitle(labels.previewTitle);
    setPreviewSubtitle(labels.previewSubtitle);
  }

  async function handleGenerate() {
  const trimmed = prompt.trim();

  if (!trimmed) return;

  setIsGenerating(true);
  setGenerateError("");

  try {
    const response = await fetch("/api/generate-motion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: trimmed,
        componentType,
        motionPreset,
      }),
    });

    const data = await response.json();

    if (!response.ok || data?.success === false) {
      throw new Error(data?.error || "Failed to generate motion schema.");
    }

    const schema = data?.schema ?? data;

    const safeComponentType: ComponentType = isComponentType(schema?.componentType)
      ? schema.componentType
      : componentType;

    const safeMotionPreset: MotionPreset = isMotionPreset(schema?.motionPreset)
      ? schema.motionPreset
      : motionPreset;

    const nextIntensity = parameterValue(
      schema?.parameters?.intensity,
      intensity
    );
    const nextSpeed = parameterValue(schema?.parameters?.speed, speed);
    const nextSoftness = parameterValue(
      schema?.parameters?.softness,
      softness
    );

    const labels = workspaceLabels(safeComponentType, safeMotionPreset);
    const parsedAccent =
      typeof schema?.style?.accentColor === "string"
        ? schema.style.accentColor
        : parsePromptAccent(trimmed);
    const nextAccentName = parsedAccent ?? accentName;
    const nextAccentColor = parsedAccent
      ? colorInputValue(parsedAccent)
      : accentColor;

    const promptHasComponent = promptSpecifiesComponent(trimmed);
    const resultDefaults =
      defaultComponentSettingsByType[safeComponentType] ??
      defaultComponentSettingsByType.Button;

    const resultChangesComponent = safeComponentType !== componentType;

    const nextComponentSettings = resultChangesComponent
      ? resultDefaults
      : componentSettings;

    const nextDimensionsEdited = resultChangesComponent
      ? false
      : componentDimensionsEdited;

    setComponentType(safeComponentType);

    setComponentSpecified((specified) =>
      safeComponentType === "Graphic" ? false : specified || promptHasComponent
    );

    if (resultChangesComponent) {
      setComponentWidth(resultDefaults.width);
      setComponentHeight(resultDefaults.height);
      setComponentRadius(resultDefaults.radius);
      setComponentDimensionsEdited(false);
    }

    setMotionPreset(safeMotionPreset);

    if (parsedAccent) {
      setAccentName(parsedAccent);

      if (!isPresetAccent(parsedAccent)) {
        setAccentColor(colorInputValue(parsedAccent));
      }
    }

    let nextComponentContent = componentContent;

    if (
      !contentEdited &&
      schema?.content &&
      typeof schema.content === "object"
    ) {
      const schemaContent = schema.content as Record<string, unknown>;
      nextComponentContent = componentContentFromSchema(
        componentContent,
        schemaContent,
        safeComponentType
      );

      setComponentContent(nextComponentContent);
    }

    setIntensity(nextIntensity);
    setSpeed(nextSpeed);
    setSoftness(nextSoftness);
    setPreviewTitle(labels.previewTitle);
    setPreviewSubtitle(labels.previewSubtitle);

    setGenerationHistory((prev) => [
      {
        id: `${Date.now()}-${prev.length}`,
        prompt: trimmed,
        componentType: safeComponentType,
        componentContent: nextComponentContent,
        contentEdited,
        motionPreset: safeMotionPreset,
        intensity: nextIntensity,
        speed: nextSpeed,
        softness: nextSoftness,
        componentWidth: nextComponentSettings.width,
        componentHeight: nextComponentSettings.height,
        componentRadius: nextComponentSettings.radius,
        componentDimensionsEdited: nextDimensionsEdited,
        accentName: nextAccentName,
        accentColor: nextAccentColor,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);

    console.log("Motion Schema:", schema);
  } catch (error) {
    console.error("Generate failed:", error);
    setGenerateError(
      error instanceof Error ? error.message : "Failed to generate motion."
    );
  } finally {
    setIsGenerating(false);
  }
}

  function handleHistorySelect(item: GenerationHistoryItem) {
    const labels = workspaceLabels(item.componentType, item.motionPreset);

    setPrompt(item.prompt);
    setComponentType(item.componentType);
    setComponentSpecified(promptSpecifiesComponent(item.prompt));
    setComponentContent(item.componentContent);
    setContentEdited(item.contentEdited);
    setMotionPreset(item.motionPreset);
    setIntensity(item.intensity);
    setSpeed(item.speed);
    setSoftness(item.softness);
    setComponentWidth(item.componentWidth);
    setComponentHeight(item.componentHeight);
    setComponentRadius(item.componentRadius);
    setComponentDimensionsEdited(item.componentDimensionsEdited);
    setAccentName(item.accentName ?? "White");
    setAccentColor(item.accentColor ?? "#ffffff");
    setPreviewTitle(labels.previewTitle);
    setPreviewSubtitle(labels.previewSubtitle);
  }

  function handleSaveAsset() {
    const trimmed = prompt.trim() || "Untitled motion prompt";

    setMotionAssets((prev) => [
      {
        id: `${Date.now()}-${prev.length}`,
        name: `${componentType} ${motionPreset}`,
        prompt: trimmed,
        componentType,
        componentSpecified,
        componentContent,
        contentEdited,
        motionPreset,
        intensity,
        speed,
        softness,
        componentWidth,
        componentHeight,
        componentRadius,
        componentDimensionsEdited,
        uploadedImage: uploadedImage ? { ...uploadedImage } : null,
        accentName,
        accentColor,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);
    setAssetsOpen(true);
  }

  function handleImportAssetJson(data: unknown) {
    if (data === null || typeof data !== "object") {
      return false;
    }

    const record = data as Record<string, unknown>;
    const parameters =
      record.parameters !== null && typeof record.parameters === "object"
        ? (record.parameters as Record<string, unknown>)
        : record;
    const importedComponentType = isComponentType(record.componentType)
      ? record.componentType
      : componentType;
    const importedMotionPreset = isMotionPreset(record.motionPreset)
      ? record.motionPreset
      : motionPreset;
    const importedComponentSpecified =
      typeof record.componentSpecified === "boolean"
        ? record.componentSpecified
        : true;
    const importedIntensity = parameterValue(parameters.intensity, intensity);
    const importedSpeed = parameterValue(parameters.speed, speed);
    const importedSoftness = parameterValue(parameters.softness, softness);
    const settings =
      record.componentSettings !== null &&
      typeof record.componentSettings === "object"
        ? (record.componentSettings as Record<string, unknown>)
        : record;
    const importedWidth = pixelValue(settings.width, componentWidth, 80, 1200);
    const importedHeight = pixelValue(settings.height, componentHeight, 40, 900);
    const importedRadius = pixelValue(settings.radius, componentRadius, 0, 120);
    const importedDimensionsEdited =
      typeof record.componentDimensionsEdited === "boolean"
        ? record.componentDimensionsEdited
        : true;
    const importedImage =
      record.uploadedImage !== null && typeof record.uploadedImage === "object"
        ? (record.uploadedImage as Record<string, unknown>)
        : null;
    const importedUploadedImage =
      importedImage && typeof importedImage.name === "string"
        ? {
            name: importedImage.name,
            previewUrl:
              typeof importedImage.previewUrl === "string"
                ? importedImage.previewUrl
                : null,
          }
        : null;
    const importedStyle =
      record.style !== null && typeof record.style === "object"
        ? (record.style as Record<string, unknown>)
        : null;
    const importedAccentName =
      typeof record.accentName === "string"
        ? record.accentName
        : typeof importedStyle?.accentColor === "string"
          ? importedStyle.accentColor
          : accentName;
    const importedAccentColor =
      typeof record.accentColor === "string"
        ? record.accentColor
        : typeof importedStyle?.accentColor === "string"
          ? colorInputValue(importedStyle.accentColor)
          : accentColor;
    const importedContentRecord =
      record.componentContent !== null &&
      typeof record.componentContent === "object"
        ? (record.componentContent as Record<string, unknown>)
        : record.content !== null && typeof record.content === "object"
          ? (record.content as Record<string, unknown>)
          : null;
    const importedComponentContent = importedContentRecord
      ? componentContentFromSchema(
          componentContent,
          importedContentRecord,
          importedComponentType
        )
      : componentContent;
    const importedContentEdited =
      typeof record.contentEdited === "boolean" ? record.contentEdited : true;

    setMotionAssets((prev) => [
      {
        id: `${Date.now()}-${prev.length}`,
        name:
          typeof record.name === "string" && record.name.trim()
            ? record.name.trim()
            : `${importedComponentType} ${importedMotionPreset}`,
        prompt:
          typeof record.prompt === "string" && record.prompt.trim()
            ? record.prompt.trim()
            : prompt.trim() || "Imported motion asset",
        componentType: importedComponentType,
        componentSpecified: importedComponentSpecified,
        componentContent: importedComponentContent,
        contentEdited: importedContentEdited,
        motionPreset: importedMotionPreset,
        intensity: importedIntensity,
        speed: importedSpeed,
        softness: importedSoftness,
        componentWidth: importedWidth,
        componentHeight: importedHeight,
        componentRadius: importedRadius,
        componentDimensionsEdited: importedDimensionsEdited,
        uploadedImage: importedUploadedImage,
        accentName: importedAccentName,
        accentColor: importedAccentColor,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);

    return true;
  }

  function handleDeleteAsset(id: string) {
    setMotionAssets((prev) => prev.filter((asset) => asset.id !== id));
  }

  function handleAssetSelect(asset: MotionAsset) {
    const labels = workspaceLabels(asset.componentType, asset.motionPreset);

    setPrompt(asset.prompt);
    setComponentType(asset.componentType);
    setComponentSpecified(asset.componentSpecified);
    setComponentContent(asset.componentContent);
    setContentEdited(asset.contentEdited);
    setMotionPreset(asset.motionPreset);
    setIntensity(asset.intensity);
    setSpeed(asset.speed);
    setSoftness(asset.softness);
    setComponentWidth(asset.componentWidth);
    setComponentHeight(asset.componentHeight);
    setComponentRadius(asset.componentRadius);
    setComponentDimensionsEdited(asset.componentDimensionsEdited);
    setUploadedImage(asset.uploadedImage ? { ...asset.uploadedImage } : null);
    setAccentName(asset.accentName ?? "White");
    setAccentColor(asset.accentColor ?? "#ffffff");
    setPreviewTitle(labels.previewTitle);
    setPreviewSubtitle(labels.previewSubtitle);
    setAssetsOpen(false);
  }

  return (
    <main
      style={themeVariables(themeMode)}
      data-theme={themeMode}
      className="motion-theme min-h-screen overflow-hidden bg-[#0b0d10] text-neutral-100"
    >
      <style>{`
        .motion-theme {
          background-color: var(--app-bg);
          color: var(--text-primary);
        }
        .motion-theme svg {
          color: currentColor;
          stroke: currentColor;
        }
        .motion-theme [class*="bg-[#0b0d10]"] {
          background-color: var(--app-bg) !important;
        }
        .motion-theme [class*="bg-[#0f1115]"] {
          background-color: var(--panel-bg) !important;
        }
        .motion-theme [class*="bg-[#101318]"],
        .motion-theme [class*="bg-[#0d1014]"],
        .motion-theme [class*="bg-[#171b21]"],
        .motion-theme [class*="bg-neutral-800"] {
          background-color: var(--surface-bg) !important;
        }
        .motion-theme [class*="bg-[#14171c]"] {
          background-color: var(--preview-bg) !important;
        }
        .motion-theme [class*="bg-white/"] {
          background-color: var(--control-bg) !important;
        }
        .motion-theme [class*="bg-white "] {
          background-color: var(--inverse-bg) !important;
        }
        .motion-theme [class*="hover:bg-white/"]:hover,
        .motion-theme [class*="hover:bg-neutral-700"]:hover {
          background-color: var(--control-bg-strong) !important;
        }
        .motion-theme [class*="hover:bg-neutral-200"]:hover {
          background-color: var(--inverse-bg) !important;
        }
        .motion-theme .generate-button {
          background-color: var(--generate-bg) !important;
          color: var(--generate-text) !important;
        }
        .motion-theme .generate-button:hover,
        .motion-theme .generate-button:active {
          background-color: var(--generate-hover-bg) !important;
        }
        .motion-theme [class*="border-white/"] {
          border-color: var(--border-color) !important;
        }
        .motion-theme [class*="hover:border-white/"]:hover,
        .motion-theme [class*="focus:border-white/"]:focus {
          border-color: var(--border-strong) !important;
        }
        .motion-theme [class*="text-neutral-100"],
        .motion-theme [class*="text-white"] {
          color: var(--text-primary) !important;
        }
        .motion-theme [class*="text-neutral-200"],
        .motion-theme [class*="text-neutral-300"],
        .motion-theme [class*="text-neutral-400"] {
          color: var(--text-secondary) !important;
        }
        .motion-theme [class*="text-neutral-500"],
        .motion-theme [class*="text-neutral-600"] {
          color: var(--text-muted) !important;
        }
        .motion-theme [class*="text-black"] {
          color: var(--inverse-text) !important;
        }
        .motion-theme [class*="placeholder:text-neutral-600"]::placeholder {
          color: var(--text-muted) !important;
        }
        .motion-theme input[type="range"] {
          accent-color: var(--text-primary);
        }
        .motion-theme .motion-grid {
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px) !important;
        }
        .motion-theme[data-theme="Dark"] .sidebar-scrollbar,
        .motion-theme[data-theme="Dark"] .prompt-scrollbar {
          scrollbar-color: rgba(115, 115, 115, 0.42) transparent;
        }
        .motion-theme[data-theme="Dark"] .sidebar-scrollbar::-webkit-scrollbar,
        .motion-theme[data-theme="Dark"] .prompt-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .motion-theme[data-theme="Dark"] .sidebar-scrollbar::-webkit-scrollbar-track,
        .motion-theme[data-theme="Dark"] .prompt-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .motion-theme[data-theme="Dark"] .sidebar-scrollbar::-webkit-scrollbar-thumb,
        .motion-theme[data-theme="Dark"] .prompt-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(115, 115, 115, 0.38);
          background-clip: content-box;
          border: 2px solid transparent;
          border-radius: 999px;
        }
        .motion-theme[data-theme="Dark"] .sidebar-scrollbar::-webkit-scrollbar-thumb:hover,
        .motion-theme[data-theme="Dark"] .prompt-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(140, 140, 140, 0.48);
        }
      `}</style>
      <div className="flex h-screen flex-col">
        <TopBar
          themeMode={themeMode}
          onThemeToggle={() =>
            setThemeMode((mode) => (mode === "Dark" ? "Light" : "Dark"))
          }
          onOpenAssets={() => setAssetsOpen(true)}
          onOpenExport={() => setExportOpen(true)}
        />

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
          <LeftSidebar
            componentType={componentType}
            onComponentTypeChange={handleComponentTypeChange}
            componentContent={componentContent}
            motionPreset={motionPreset}
            onMotionPresetChange={handleMotionPresetChange}
            intensity={intensity}
            onIntensityChange={setIntensity}
            speed={speed}
            onSpeedChange={setSpeed}
            softness={softness}
            onSoftnessChange={setSoftness}
            componentSettings={componentSettings}
            onComponentWidthChange={(value) => {
              setComponentWidth(value);
              setComponentDimensionsEdited(true);
            }}
            onComponentHeightChange={(value) => {
              setComponentHeight(value);
              setComponentDimensionsEdited(true);
            }}
            onComponentRadiusChange={setComponentRadius}
            accentName={accentName}
            accentColor={accentColor}
            onAccentChange={setAccentName}
            onCustomAccentChange={(color) => {
              setAccentColor(color);
              setAccentName(color);
            }}
            generationHistory={generationHistory}
            onHistorySelect={handleHistorySelect}
          />

          <section className="flex min-h-0 flex-col overflow-hidden border-l border-white/8 bg-[#0f1115]">
            <LivePreview
              title={previewTitle}
              subtitle={previewSubtitle}
              isGenerating={isGenerating}
              componentType={componentType}
              componentSpecified={componentSpecified}
              motionPreset={motionPreset}
              intensity={intensity}
              speed={speed}
              softness={softness}
              componentSettings={previewComponentSettings}
              accentName={accentName}
              uploadedImage={uploadedImage}
              componentContent={componentContent}
              onContentChange={handleContentChange}
            />
            <PromptDock
              prompt={prompt}
              selectedImage={uploadedImage}
              onPromptChange={setPrompt}
              onImageChange={setUploadedImage}
              onImageRemove={() => setUploadedImage(null)}
              onGenerate={handleGenerate}
            />
          </section>
        </div>
      </div>

      <AnimatePresence>
        {assetsOpen ? (
          <AssetsDrawer
            assets={motionAssets}
            onAssetSelect={handleAssetSelect}
            onClose={() => setAssetsOpen(false)}
            onDeleteAsset={handleDeleteAsset}
            onImportJson={handleImportAssetJson}
            onSaveAsset={handleSaveAsset}
          />
        ) : null}
        {exportOpen ? (
          <ExportDrawer
            onClose={() => setExportOpen(false)}
            componentType={componentType}
            motionPreset={motionPreset}
            intensity={intensity}
            speed={speed}
            softness={softness}
            componentSettings={componentSettings}
            componentContent={componentContent}
            accentName={accentName}
            uploadedImage={uploadedImage}
          />
        ) : null}
        {generateError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setGenerateError("")}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.16 }}
              onClick={(event) => event.stopPropagation()}
              className="w-[min(88vw,340px)] rounded-2xl border border-white/10 bg-[#101318] p-5 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Bell size={14} aria-hidden="true" />
                Generation Error
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {generateError}
              </p>
              <button
                type="button"
                onClick={() => setGenerateError("")}
                className="mt-5 w-full rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function TopBar({
  themeMode,
  onThemeToggle,
  onOpenAssets,
  onOpenExport,
}: {
  themeMode: ThemeMode;
  onThemeToggle: () => void;
  onOpenAssets: () => void;
  onOpenExport: () => void;
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signedOutOpen, setSignedOutOpen] = useState(false);
  const [userState, setUserState] = useState<"signedIn" | "guest">(
    "signedIn"
  );
  const [displayName, setDisplayName] = useState("Kateli");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);
  const [draftAvatarPreview, setDraftAvatarPreview] = useState<string | null>(
    avatarPreview
  );
  const isGuest = userState === "guest";
  const avatarInitial = isGuest
    ? "G"
    : displayName.trim().charAt(0).toUpperCase() || "K";

  function openProfileModal() {
    setDraftDisplayName(displayName);
    setDraftAvatarPreview(avatarPreview);
    setAccountOpen(false);
    setProfileOpen(true);
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setDraftAvatarPreview(
        typeof reader.result === "string" ? reader.result : null
      );
    };

    reader.readAsDataURL(file);
  }

  function handleProfileSave() {
    const trimmedName = draftDisplayName.trim();

    setDisplayName(trimmedName || "Kateli");
    setAvatarPreview(draftAvatarPreview);
    setProfileOpen(false);
  }

  function handleSignOut() {
    setAccountOpen(false);
    setSignedOutOpen(true);
  }

  function continueAsGuest() {
    setUserState("guest");
    setSignedOutOpen(false);
  }

  function handleSignIn() {
    setUserState("signedIn");
    setAccountOpen(false);
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-[#0b0d10]/95 px-4 sm:px-6">
        <div className="ml-1 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={themeMode === "Dark" ? "/logo1.svg" : "/logo.svg"}
            alt="Motion logo"
            className="h-7 w-7 object-contain"
          />
          <h1 className="text-base font-medium tracking-wide">Motiz</h1>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={onOpenAssets}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
          >
            <Package size={15} aria-hidden="true" />
            Assets
          </button>

          <button
            onClick={onOpenExport}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
          >
            <Download size={15} aria-hidden="true" />
            Export
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
              className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-neutral-800 text-xs font-medium text-neutral-100 transition hover:border-white/20 hover:bg-neutral-700"
            >
              {!isGuest && avatarPreview ? (
                <span
                  aria-hidden="true"
                  className="size-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${avatarPreview})` }}
                />
              ) : (
                avatarInitial
              )}
            </button>

            <AnimatePresence>
              {accountOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#101318] py-1 shadow-xl shadow-black/40"
                >
                  {isGuest ? (
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="block w-full px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/8 hover:text-white"
                    >
                      Sign In
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openProfileModal}
                      className="block w-full px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/8 hover:text-white"
                    >
                      Profile
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onThemeToggle}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/8 hover:text-white"
                  >
                    <span>Theme</span>
                    <span className="text-xs text-neutral-500">
                      {themeMode}
                    </span>
                  </button>
                  {!isGuest ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/8 hover:text-white"
                    >
                      Sign out
                    </button>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {profileOpen ? (
          <>
            <motion.button
              aria-label="Close profile modal"
              onClick={() => setProfileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-[#101318] p-5 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center gap-4">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-neutral-800 text-lg font-medium text-neutral-100">
                  {draftAvatarPreview ? (
                    <span
                      aria-hidden="true"
                      className="size-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${draftAvatarPreview})`,
                      }}
                    />
                  ) : (
                    draftDisplayName.trim().charAt(0).toUpperCase() || "K"
                  )}
                </div>
                <div className="min-w-0">
                  <h2
                    id="profile-modal-title"
                    className="text-lg font-medium text-white"
                  >
                    Profile
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Edit profile
                  </p>
                </div>
              </div>

              <label
                htmlFor="profile-display-name"
                className="mt-5 block text-xs uppercase tracking-[0.18em] text-neutral-500"
              >
                Display name
              </label>
              <input
                id="profile-display-name"
                value={draftDisplayName}
                onChange={(event) => setDraftDisplayName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-white/20"
              />

              <div className="mt-4 flex gap-2">
                <label
                  htmlFor="profile-avatar-upload"
                  className="flex-1 rounded-lg border border-dashed border-white/18 px-3 py-2.5 text-center text-sm text-neutral-300 transition hover:bg-white/8"
                >
                  Upload Avatar
                </label>
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={handleProfileSave}
                  className="flex-1 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {signedOutOpen ? (
          <>
            <motion.button
              aria-label="Close signed out modal"
              onClick={() => setSignedOutOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="signed-out-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-[#101318] p-5 text-center shadow-2xl shadow-black/60"
            >
              <h2
                id="signed-out-title"
                className="text-base font-medium text-white"
              >
                Signed out
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                You are now viewing Motion Playground as a guest.
              </p>
              <div className="mt-5 flex items-center justify-between gap-6 pl-3">
                <button
                  type="button"
                  onClick={() => setSignedOutOpen(false)}
                  className="px-1 py-2 text-sm text-neutral-400 transition hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200"
                >
                  Continue as Guest
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function LeftSidebar({
  componentType,
  onComponentTypeChange,
  componentContent,
  motionPreset,
  onMotionPresetChange,
  intensity,
  onIntensityChange,
  speed,
  onSpeedChange,
  softness,
  onSoftnessChange,
  componentSettings,
  onComponentWidthChange,
  onComponentHeightChange,
  onComponentRadiusChange,
  accentName,
  accentColor,
  onAccentChange,
  onCustomAccentChange,
  generationHistory,
  onHistorySelect,
}: {
  componentType: ComponentType;
  onComponentTypeChange: (type: ComponentType) => void;
  componentContent: ComponentContent;
  motionPreset: MotionPreset;
  onMotionPresetChange: (preset: MotionPreset) => void;
  intensity: number;
  onIntensityChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  softness: number;
  onSoftnessChange: (value: number) => void;
  componentSettings: ComponentSettings;
  onComponentWidthChange: (value: number) => void;
  onComponentHeightChange: (value: number) => void;
  onComponentRadiusChange: (value: number) => void;
  accentName: AccentName;
  accentColor: string;
  onAccentChange: (value: AccentName) => void;
  onCustomAccentChange: (value: string) => void;
  generationHistory: GenerationHistoryItem[];
  onHistorySelect: (item: GenerationHistoryItem) => void;
}) {
  return (
    <aside className="hidden min-h-0 flex-col bg-[#0b0d10] lg:flex">
      <div className="sidebar-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5">
        <SidebarSection title="Component Type">
          <div className="space-y-2">
            {componentTypes.map((type) => {
              const Icon = componentIcons[type];

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onComponentTypeChange(type)}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                    componentType === type
                      ? "border-white/25 bg-white/12 text-white shadow-inner shadow-white/5"
                      : "border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/16 hover:bg-white/[0.06] hover:text-neutral-100"
                  }`}
                >
                  <Icon size={15} aria-hidden="true" className="shrink-0" />
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </SidebarSection>

        <SidebarSection title="Component Content">
          <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
            <p className="text-xs text-neutral-300">
              Edit text directly in preview
            </p>
            <div className="mt-3 space-y-2">
              {componentContentFields[componentType].map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <span className="text-neutral-500">{field.label}</span>
                  <span className="truncate text-right text-neutral-300">
                    {componentContent[field.key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SidebarSection>

        <SidebarSection title="Motion Presets">
          <div className="space-y-2">
            {motionPresets.map((preset) => {
              const Icon = motionPresetIcons[preset];

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onMotionPresetChange(preset)}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                    motionPreset === preset
                      ? "border-white/25 bg-white/12 text-white shadow-inner shadow-white/5"
                      : "border-white/8 bg-white/[0.03] text-neutral-300 hover:border-white/16 hover:bg-white/[0.06] hover:text-neutral-100"
                  }`}
                >
                  <Icon size={15} aria-hidden="true" className="shrink-0" />
                  <span>{preset}</span>
                </button>
              );
            })}
          </div>
        </SidebarSection>

        {componentType !== "Graphic" ? (
          <SidebarSection title="Component Settings">
            <div className="space-y-3">
              <PixelInput
                label="Width"
                value={componentSettings.width}
                onChange={onComponentWidthChange}
                min={80}
                max={1200}
              />
              <PixelInput
                label="Height"
                value={componentSettings.height}
                onChange={onComponentHeightChange}
                min={40}
                max={900}
              />
              <PixelInput
                label="Radius"
                value={componentSettings.radius}
                onChange={onComponentRadiusChange}
                min={0}
                max={120}
              />
            </div>
          </SidebarSection>
        ) : null}

        <SidebarSection title="Parameters">
          <div className="space-y-4">
            <ParameterSlider
              label="Intensity"
              value={intensity}
              onChange={onIntensityChange}
            />
            <ParameterSlider
              label="Speed"
              value={speed}
              onChange={onSpeedChange}
            />
            <ParameterSlider
              label="Softness"
              value={softness}
              onChange={onSoftnessChange}
            />
          </div>
        </SidebarSection>

        <SidebarSection title="Accent">
          <div className="grid grid-cols-6 gap-2">
            {accentOptions.map((accent) => (
              <button
                key={accent.name}
                type="button"
                aria-label={`${accent.name} accent`}
                onClick={() => onAccentChange(accent.name)}
                className={`grid aspect-square place-items-center rounded-lg border transition ${
                  accentName === accent.name
                    ? "border-white/20 bg-white/10"
                    : "border-white/8 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className="size-4 rounded-full border border-white/20"
                  style={{ backgroundColor: accent.color }}
                />
              </button>
            ))}
            <label
              aria-label="Custom accent color"
              className={`relative grid aspect-square cursor-pointer place-items-center rounded-lg border transition ${
                accentName === accentColor
                  ? "border-white/20 bg-white/10"
                  : "border-white/8 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.06]"
              }`}
            >
              <span
                className="size-4 rounded-full border border-white/20"
                style={{
                  background:
                    "conic-gradient(from 90deg, #ef4444, #f97316, #facc15, #22c55e, #38bdf8, #8b5cf6, #ef4444)",
                }}
              />
              <input
                type="color"
                value={accentColor}
                onChange={(event) => onCustomAccentChange(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>
          {!isPresetAccent(accentName) ? (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-neutral-400">
              <span
                className="size-3 rounded-full border border-white/20"
                style={{ backgroundColor: accentConfig(accentName).color }}
              />
              Prompt color
            </div>
          ) : null}
        </SidebarSection>
      </div>

      <div className="flex min-h-0 shrink-0 flex-col border-t border-white/8 p-5">
        <div>
          <SidebarSection title="Recent Generations">
            <div className="sidebar-scrollbar max-h-40 space-y-2 overflow-y-auto pr-1">
              {generationHistory.length === 0 ? (
                <p className="text-xs text-neutral-500">
                  No generations yet. Run Generate to add history.
                </p>
              ) : (
                generationHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onHistorySelect(item)}
                    className="w-full rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-left transition hover:border-white/16 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-500">
                      <span>{item.createdAt}</span>
                      <span>
                        {item.componentType} · {item.motionPreset}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-300">
                      {item.prompt}
                    </p>
                  </button>
                ))
              )}
            </div>
          </SidebarSection>
        </div>
      </div>
    </aside>
  );
}

function ParameterSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-200">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-neutral-200"
      />
    </div>
  );
}

function PixelInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  const [draft, setDraft] = useState({
    editing: false,
    text: String(value),
    value,
  });
  const displayValue =
    draft.editing && draft.value === value ? draft.text : String(value);

  function commitValue(rawValue: string) {
    const trimmedValue = rawValue.trim();

    if (trimmedValue === "") {
      setDraft({ editing: false, text: String(value), value });
      return;
    }

    const numericValue = Number(trimmedValue);

    if (Number.isFinite(numericValue)) {
      const nextValue = pixelValue(numericValue, value, min, max);

      onChange(nextValue);
      setDraft({ editing: false, text: String(nextValue), value: nextValue });
      return;
    }

    setDraft({ editing: false, text: String(value), value });
  }

  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-neutral-400">{label}</span>
      <div className="flex h-9 w-28 items-center rounded-lg border border-white/8 bg-white/[0.03] px-2 text-neutral-200 focus-within:border-white/20">
        <input
          type="number"
          min={min}
          max={max}
          value={displayValue}
          onFocus={() =>
            setDraft({ editing: true, text: String(value), value })
          }
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              editing: true,
              text: event.target.value,
              value,
            }))
          }
          onBlur={(event) => commitValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.blur();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              event.currentTarget.value = String(value);
              setDraft({ editing: false, text: String(value), value });
              event.currentTarget.blur();
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-right text-sm outline-none"
        />
        <span className="ml-1 text-xs text-neutral-500">px</span>
      </div>
    </label>
  );
}

function SidebarSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
        {Icon ? <Icon size={14} aria-hidden="true" className="shrink-0" /> : null}
        {title}
      </h2>
      {children}
    </section>
  );
}

function getPresetMotion(
  preset: MotionPreset,
  config: MotionConfig,
  accent: AccentConfig = accentConfig("White")
) {
  const spring = {
    type: "spring" as const,
    stiffness: config.spring.stiffness,
    damping: config.spring.damping,
  };

  switch (preset) {
    case "Soft Entrance":
      return {
        initial: {
          opacity: 0,
          y: config.entranceY,
          scale: 1 - 0.03 * config.intensityFactor,
        },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: config.duration, ease: config.ease },
      };
    case "Floating":
      return {
        animate: { y: [0, -config.floatDistance, 0] },
        transition: {
          duration: config.duration * 1.35,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    case "Press Feedback":
      return {
        whileHover: { scale: config.hoverScale },
        whileTap: { scale: config.tapScale },
        transition: spring,
      };
    case "Hover Glow":
      return {
        animate: { boxShadow: "0 0 0px rgba(255,255,255,0)" },
        whileHover: {
          scale: config.hoverScale,
          boxShadow: `0 0 ${18 + config.intensityFactor * 18}px ${accent.glow}`,
        },
        transition: {
          duration: config.duration * 0.45,
          ease: "easeInOut" as const,
        },
      };
    case "Notification Pop":
      return {
        initial: {
          opacity: 0,
          x: config.entranceY * 1.2,
          y: 0,
          scale: 1,
        },
        animate: { opacity: 1, x: 0, y: 0, scale: 1 },
        transition: {
          type: "spring" as const,
          stiffness: config.spring.stiffness,
          damping: config.spring.damping,
        },
      };
    case "Card Stagger":
      return {
        initial: { opacity: 0, y: config.entranceY * 0.7 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: config.duration, ease: config.ease },
      };
    case "Breathing":
      return {
        animate: {
          scale: [1, 1.025, 1],
          opacity: [1, 0.96, 1],
        },
        transition: {
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    case "Playful Bounce":
      return {
        animate: {
          y: [0, -6, 0],
          scale: [1, 1.08, 0.98, 1.04, 1],
          rotate: [0, -1, 0.8, 0],
        },
        whileTap: { scale: config.tapScale },
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    case "Intelligent Drift":
      return {
        animate: {
          x: [0, 4, -2, 0],
          rotate: [0, 1, -1, 0],
          scale: [1, 1.02, 1.01, 1],
          opacity: [1, 0.97, 1],
        },
        transition: {
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
    case "Alert Pulse":
      return {
        animate: {
          scale: [1, 1.12, 1],
          opacity: [1, 0.7, 1],
          boxShadow: [
            "0 0 0px rgba(255,255,255,0)",
            `0 0 ${18 + config.intensityFactor * 18}px ${accent.glow}`,
            "0 0 0px rgba(255,255,255,0)",
          ],
        },
        transition: {
          duration: 0.7,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };
  }
}

function PreviewScene({
  componentType,
  motionPreset,
  motionConfig,
  accent,
  uploadedImage,
  componentSettings,
  componentContent,
  onContentChange,
}: {
  componentType: ComponentType;
  motionPreset: MotionPreset;
  motionConfig: MotionConfig;
  accent: AccentConfig;
  uploadedImage: SelectedImage | null;
  componentSettings: ComponentSettings;
  componentContent: ComponentContent;
  onContentChange: (key: keyof ComponentContent, value: string) => void;
}) {
  switch (componentType) {
    case "Button":
      return (
        <ButtonPreview
          motionPreset={motionPreset}
          motionConfig={motionConfig}
          accent={accent}
          uploadedImage={uploadedImage}
          componentSettings={componentSettings}
          content={componentContent}
          onContentChange={onContentChange}
        />
      );
    case "Card":
      return (
        <CardPreview
          motionPreset={motionPreset}
          motionConfig={motionConfig}
          accent={accent}
          uploadedImage={uploadedImage}
          componentSettings={componentSettings}
          content={componentContent}
          onContentChange={onContentChange}
        />
      );
    case "Modal":
      return (
        <ModalPreview
          motionPreset={motionPreset}
          motionConfig={motionConfig}
          accent={accent}
          uploadedImage={uploadedImage}
          componentSettings={componentSettings}
          content={componentContent}
          onContentChange={onContentChange}
        />
      );
    case "Toast":
      return (
        <ToastPreview
          motionPreset={motionPreset}
          motionConfig={motionConfig}
          accent={accent}
          uploadedImage={uploadedImage}
          componentSettings={componentSettings}
          content={componentContent}
          onContentChange={onContentChange}
        />
      );
    case "Graphic":
      return uploadedImage?.previewUrl ? (
        <UploadedImagePreview
          image={uploadedImage}
          motionPreset={motionPreset}
          motionConfig={motionConfig}
          accent={accent}
          componentSettings={componentSettings}
        />
      ) : (
        <ButtonPreview
          motionPreset={motionPreset}
          motionConfig={motionConfig}
          accent={accent}
          uploadedImage={null}
          componentSettings={componentSettings}
          content={componentContent}
          onContentChange={onContentChange}
        />
      );
    default:
      return (
        <ButtonPreview
          motionPreset={motionPreset}
          motionConfig={motionConfig}
          accent={accent}
          uploadedImage={uploadedImage}
          componentSettings={componentSettings}
          content={componentContent}
          onContentChange={onContentChange}
        />
      );
  }
}

function EditableText({
  value,
  onChange,
  className,
  inputClassName,
  style,
  inputStyle,
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
  inputClassName?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const sharedClassName =
    "relative rounded-sm border-b border-transparent outline-none transition hover:border-white/30";
  const iconClassName =
    "pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover/edit:opacity-60";

  if (editing) {
    const editorClassName = `${inputClassName ?? ""} box-border border-b border-white/30 bg-white/[0.06] px-1 outline-none`;

    return (
      <span className={`group/edit relative ${className}`} style={style}>
        {multiline ? (
          <textarea
            autoFocus
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={() => setEditing(false)}
            className={`${editorClassName} min-h-16 w-full resize-none text-inherit`}
            style={inputStyle}
          />
        ) : (
          <input
            autoFocus
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={() => setEditing(false)}
            className={`${editorClassName} text-inherit`}
            style={inputStyle}
          />
        )}
        <Pencil
          size={12}
          aria-hidden="true"
          className={`${iconClassName} opacity-60`}
        />
      </span>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setEditing(true);
        }
      }}
      className={`group/edit ${sharedClassName} ${className}`}
      style={style}
    >
      <span>{value}</span>
      <Pencil
        size={12}
        aria-hidden="true"
        className={iconClassName}
      />
    </span>
  );
}

function ButtonPreview({
  motionPreset,
  motionConfig,
  accent,
  uploadedImage,
  componentSettings,
  content,
  onContentChange,
}: {
  motionPreset: MotionPreset;
  motionConfig: MotionConfig;
  accent: AccentConfig;
  uploadedImage: SelectedImage | null;
  componentSettings: ComponentSettings;
  content: ComponentContent;
  onContentChange: (key: keyof ComponentContent, value: string) => void;
}) {
  const preset = getPresetMotion(motionPreset, motionConfig, accent);
  const scale = componentContentScale("Button", componentSettings);
  const textStyle = {
    fontSize: 14 * scale,
    lineHeight: `${16 * scale}px`,
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      {...preset}
      className="relative inline-flex items-center justify-center overflow-hidden text-center font-medium leading-none shadow-lg shadow-black/30"
      style={{
        width: componentSettings.width,
        height: componentSettings.height,
        borderRadius: componentSettings.radius,
        padding: `${12 * scale}px ${32 * scale}px`,
        backgroundColor: accent.color,
        color: uploadedImage?.previewUrl ? "#ffffff" : accent.textColor,
        transformOrigin: "center",
      }}
    >
      {uploadedImage?.previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uploadedImage.previewUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/35" />
          <EditableText
            value={content.buttonText}
            onChange={(value) => onContentChange("buttonText", value)}
            className="relative z-10 inline-flex items-center justify-center text-center font-medium leading-none text-white"
            inputClassName="text-center text-white"
            style={textStyle}
            inputStyle={{ width: 112 * scale }}
          />
        </>
      ) : (
        <EditableText
          value={content.buttonText}
          onChange={(value) => onContentChange("buttonText", value)}
          className="inline-flex items-center justify-center text-center font-medium leading-none"
          inputClassName="text-center"
          style={textStyle}
          inputStyle={{ width: 112 * scale }}
        />
      )}
    </motion.div>
  );
}

function CardPreview({
  motionPreset,
  motionConfig,
  accent,
  uploadedImage,
  componentSettings,
  content,
  onContentChange,
}: {
  motionPreset: MotionPreset;
  motionConfig: MotionConfig;
  accent: AccentConfig;
  uploadedImage: SelectedImage | null;
  componentSettings: ComponentSettings;
  content: ComponentContent;
  onContentChange: (key: keyof ComponentContent, value: string) => void;
}) {
  const preset = getPresetMotion(motionPreset, motionConfig, accent);
  const scale = componentContentScale("Card", componentSettings);
  const useAutoPreviewHeight =
    componentSettings.height === defaultComponentSettingsByType.Card.height;
  const titleStyle = {
    fontSize: 16 * scale,
    lineHeight: `${24 * scale}px`,
  };
  const bodyStyle = {
    fontSize: 14 * scale,
    lineHeight: `${20 * scale}px`,
  };
  const lines = [
    {
      key: "cardTitle" as const,
      value: content.cardTitle,
      className: "font-medium text-white",
      style: titleStyle,
    },
    {
      key: "cardDescription" as const,
      value: content.cardDescription,
      className: "text-neutral-500",
      style: bodyStyle,
    },
    {
      key: "cardCta" as const,
      value: content.cardCta,
      className: "text-neutral-500",
      style: bodyStyle,
    },
  ];

  return (
    <motion.div
      {...preset}
      className="overflow-hidden border border-white/12 bg-[#0d1014] shadow-xl shadow-black/40"
      style={{
        width: componentSettings.width,
        height: useAutoPreviewHeight ? undefined : componentSettings.height,
        minHeight: useAutoPreviewHeight ? undefined : componentSettings.height,
        borderRadius: componentSettings.radius,
        padding: 20 * scale,
      }}
    >
      {uploadedImage?.previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={uploadedImage.previewUrl}
          alt={uploadedImage.name}
          className="w-full object-contain"
          style={{
            marginBottom: 16 * scale,
            maxHeight: 144 * scale,
            borderRadius: 8 * scale,
          }}
        />
      ) : (
        <div
          className="rounded-full"
          style={{
            width: 64 * scale,
            height: 8 * scale,
            marginBottom: 12 * scale,
            backgroundColor: accent.color,
          }}
        />
      )}
      {motionPreset === "Card Stagger" ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: motionConfig.duration * 0.35 },
            },
          }}
        >
          {lines.map((line) => (
            <motion.p
              key={line.key}
              variants={{
                hidden: { opacity: 0, y: motionConfig.entranceY * 0.5 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: motionConfig.duration,
                ease: motionConfig.ease,
              }}
              className={line.className}
              style={line.style}
            >
              <EditableText
                value={line.value}
                onChange={(value) => onContentChange(line.key, value)}
                className={line.className}
                inputClassName="w-full"
                style={line.style}
              />
            </motion.p>
          ))}
        </motion.div>
      ) : (
        <>
          <h3 className="font-medium text-white" style={titleStyle}>
            <EditableText
              value={content.cardTitle}
              onChange={(value) => onContentChange("cardTitle", value)}
              className="font-medium text-white"
              inputClassName="w-full"
              style={titleStyle}
            />
          </h3>
          <p
            className="text-neutral-500"
            style={{ ...bodyStyle, marginTop: 4 * scale }}
          >
            <EditableText
              value={content.cardDescription}
              onChange={(value) => onContentChange("cardDescription", value)}
              className="text-neutral-500"
              inputClassName="w-full"
              style={bodyStyle}
              multiline
            />
          </p>
          <p
            className="font-medium"
            style={{
              ...bodyStyle,
              marginTop: 12 * scale,
              color: accent.color,
            }}
          >
            <EditableText
              value={content.cardCta}
              onChange={(value) => onContentChange("cardCta", value)}
              className="font-medium"
              inputClassName="w-full"
              style={bodyStyle}
            />
          </p>
        </>
      )}
    </motion.div>
  );
}

function ModalPreview({
  motionPreset,
  motionConfig,
  accent,
  uploadedImage,
  componentSettings,
  content,
  onContentChange,
}: {
  motionPreset: MotionPreset;
  motionConfig: MotionConfig;
  accent: AccentConfig;
  uploadedImage: SelectedImage | null;
  componentSettings: ComponentSettings;
  content: ComponentContent;
  onContentChange: (key: keyof ComponentContent, value: string) => void;
}) {
  const preset = getPresetMotion(motionPreset, motionConfig, accent);
  const scale = componentContentScale("Modal", componentSettings);
  const titleStyle = {
    fontSize: 16 * scale,
    lineHeight: `${24 * scale}px`,
  };
  const bodyStyle = {
    fontSize: 14 * scale,
    lineHeight: `${20 * scale}px`,
  };
  const buttonTextStyle = {
    fontSize: 12 * scale,
    lineHeight: `${16 * scale}px`,
  };
  const useAutoPreviewHeight =
    componentSettings.height === defaultComponentSettingsByType.Modal.height;
  const modalInitial =
    motionPreset === "Notification Pop"
      ? {
          opacity: 0,
          x: motionConfig.entranceY * 0.9,
          scale: 1,
        }
      : (preset.initial ?? {
          opacity: 1,
          scale: 1,
          y: 0,
        });
  const modalAnimate =
    motionPreset === "Notification Pop"
      ? { opacity: 1, x: 0, scale: 1 }
      : {
          opacity: 1,
          scale: 1,
          y: 0,
          ...(preset.animate ?? {}),
        };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={modalInitial}
        animate={modalAnimate}
        whileHover={preset.whileHover}
        whileTap={preset.whileTap}
        transition={preset.transition ?? { duration: motionConfig.duration }}
        className="relative z-10 overflow-hidden border border-white/12 bg-[#0d1014]"
        style={{
          width: componentSettings.width,
          height: useAutoPreviewHeight ? undefined : componentSettings.height,
          minHeight: useAutoPreviewHeight ? undefined : componentSettings.height,
          borderRadius: componentSettings.radius,
          padding: 20 * scale,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 48 * scale,
            height: 4 * scale,
            marginBottom: 16 * scale,
            backgroundColor: accent.color,
          }}
        />
        <h3 className="font-medium text-white" style={titleStyle}>
          <EditableText
            value={content.modalTitle}
            onChange={(value) => onContentChange("modalTitle", value)}
            className="font-medium text-white"
            inputClassName="w-full"
            style={titleStyle}
          />
        </h3>
        {uploadedImage?.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={uploadedImage.previewUrl}
            alt={uploadedImage.name}
            className="w-full object-contain"
            style={{
              marginTop: 12 * scale,
              maxHeight: 160 * scale,
              borderRadius: 8 * scale,
            }}
          />
        ) : null}
        <p
          className="text-neutral-500"
          style={{ ...bodyStyle, marginTop: 4 * scale }}
        >
          <EditableText
            value={content.modalBody}
            onChange={(value) => onContentChange("modalBody", value)}
            className="text-neutral-500"
            inputClassName="w-full"
            style={bodyStyle}
            multiline
          />
        </p>
        <div
          className="flex justify-end"
          style={{ gap: 8 * scale, marginTop: 16 * scale }}
        >
          <span
            className="inline-flex items-center justify-center rounded-lg text-neutral-400"
            style={{ padding: `${6 * scale}px ${12 * scale}px` }}
          >
            <EditableText
              value={content.modalSecondary}
              onChange={(value) => onContentChange("modalSecondary", value)}
              className="text-neutral-400"
              inputClassName="text-right"
              style={buttonTextStyle}
              inputStyle={{ width: 80 * scale }}
            />
          </span>
          <span
            className="inline-flex items-center justify-center rounded-lg font-medium"
            style={{
              padding: `${6 * scale}px ${12 * scale}px`,
              borderRadius: 8 * scale,
              backgroundColor: accent.color,
              color: accent.textColor,
            }}
          >
            <EditableText
              value={content.modalPrimary}
              onChange={(value) => onContentChange("modalPrimary", value)}
              className="font-medium"
              inputClassName="text-center"
              style={buttonTextStyle}
              inputStyle={{ width: 80 * scale }}
            />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function ToastPreview({
  motionPreset,
  motionConfig,
  accent,
  uploadedImage,
  componentSettings,
  content,
  onContentChange,
}: {
  motionPreset: MotionPreset;
  motionConfig: MotionConfig;
  accent: AccentConfig;
  uploadedImage: SelectedImage | null;
  componentSettings: ComponentSettings;
  content: ComponentContent;
  onContentChange: (key: keyof ComponentContent, value: string) => void;
}) {
  const preset = getPresetMotion(motionPreset, motionConfig, accent);
  const scale = componentContentScale("Toast", componentSettings);
  const useAutoPreviewHeight =
    componentSettings.height === defaultComponentSettingsByType.Toast.height;
  const titleStyle = {
    fontSize: 14 * scale,
    lineHeight: `${20 * scale}px`,
  };
  const messageStyle = {
    fontSize: 12 * scale,
    lineHeight: `${16 * scale}px`,
  };

  return (
    <motion.div
      initial={
        preset.initial ?? {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        }
      }
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        ...(preset.animate ?? {}),
      }}
      whileHover={preset.whileHover}
      whileTap={preset.whileTap}
      transition={
        preset.transition ?? {
          type: "spring",
          stiffness: motionConfig.spring.stiffness,
          damping: motionConfig.spring.damping,
        }
      }
      className="flex items-center overflow-hidden border border-white/12 bg-[#0d1014]"
      style={{
        width: componentSettings.width,
        height: useAutoPreviewHeight ? undefined : componentSettings.height,
        minHeight: useAutoPreviewHeight ? undefined : componentSettings.height,
        borderRadius: componentSettings.radius,
        gap: 12 * scale,
        padding: `${12 * scale}px ${16 * scale}px`,
      }}
    >
      {uploadedImage?.previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={uploadedImage.previewUrl}
          alt={uploadedImage.name}
          className="shrink-0 object-contain"
          style={{
            width: 36 * scale,
            height: 36 * scale,
            borderRadius: 8 * scale,
          }}
        />
      ) : (
        <span
          className="shrink-0 rounded-full"
          style={{
            width: 8 * scale,
            height: 8 * scale,
            backgroundColor: accent.color,
          }}
        />
      )}
      <div className="min-w-0 text-left">
        <p className="font-medium text-white" style={titleStyle}>
          <EditableText
            value={content.toastTitle}
            onChange={(value) => onContentChange("toastTitle", value)}
            className="font-medium text-white"
            inputClassName="w-full"
            style={titleStyle}
          />
        </p>
        <p className="text-neutral-500" style={messageStyle}>
          <EditableText
            value={content.toastMessage}
            onChange={(value) => onContentChange("toastMessage", value)}
            className="text-neutral-500"
            inputClassName="w-full"
            style={messageStyle}
          />
        </p>
      </div>
    </motion.div>
  );
}

function LivePreview({
  title,
  subtitle,
  isGenerating,
  componentType,
  componentSpecified,
  motionPreset,
  intensity,
  speed,
  softness,
  componentSettings,
  accentName,
  uploadedImage,
  componentContent,
  onContentChange,
}: {
  title: string;
  subtitle: string;
  isGenerating: boolean;
  componentType: ComponentType;
  componentSpecified: boolean;
  motionPreset: MotionPreset;
  intensity: number;
  speed: number;
  softness: number;
  componentSettings: ComponentSettings;
  accentName: AccentName;
  uploadedImage: SelectedImage | null;
  componentContent: ComponentContent;
  onContentChange: (key: keyof ComponentContent, value: string) => void;
}) {
  const motionConfig = deriveMotionConfig(intensity, speed, softness);
  const accent = accentConfig(accentName);
  const isDirectImagePreview =
    Boolean(uploadedImage?.previewUrl) &&
    (!componentSpecified || componentType === "Graphic");
  const scale = isDirectImagePreview ? 1 : previewScale(componentSettings);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Live Preview
          </p>
          <h2 className="mt-1 text-lg font-medium text-neutral-100">{title}</h2>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>
        <div className="hidden flex-wrap items-center justify-end gap-2 text-xs text-neutral-500 sm:flex">
          <span className="rounded-md border border-white/8 px-2 py-1">
            {componentType}
          </span>
          <span className="rounded-md border border-white/8 px-2 py-1">
            {motionPreset}
          </span>
          <span className="rounded-md border border-white/8 px-2 py-1">
            INT {intensity}%
          </span>
          <span className="rounded-md border border-white/8 px-2 py-1">
            SPD {speed}%
          </span>
          <span className="rounded-md border border-white/8 px-2 py-1">
            SOF {softness}%
          </span>
          {componentType !== "Graphic" ? (
            <>
              <span className="rounded-md border border-white/8 px-2 py-1">
                {componentSettings.width}×{componentSettings.height}
              </span>
              <span className="rounded-md border border-white/8 px-2 py-1">
                R {componentSettings.radius}px
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#14171c]">
        <div className="motion-grid absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative grid h-full place-items-center p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${componentType}-${componentSpecified}-${motionPreset}-${intensity}-${speed}-${softness}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full items-center justify-center"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center",
              }}
            >
              {isDirectImagePreview && uploadedImage?.previewUrl ? (
                <UploadedImagePreview
                  image={uploadedImage}
                  motionPreset={motionPreset}
                  motionConfig={motionConfig}
                  accent={accent}
                  componentSettings={componentSettings}
                  autoFit
                />
              ) : (
                <PreviewScene
                  componentType={componentType}
                  motionPreset={motionPreset}
                  motionConfig={motionConfig}
                  accent={accent}
                  uploadedImage={uploadedImage}
                  componentSettings={componentSettings}
                  componentContent={componentContent}
                  onContentChange={onContentChange}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {isGenerating ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
            >
              <GeneratingOverlay />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GeneratingOverlay() {
  const text = "Motiz is shaping...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: [0, 1, 1, 0], y: [4, 0, 0, -2] }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.14, 0.82, 1],
      }}
      className="pointer-events-none select-none text-base font-medium tracking-[0.32em]"
      style={{ color: "var(--generating-text)" }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 1] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.05,
            times: [0, 0.16, 0.82, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

function UploadedImagePreview({
  image,
  motionPreset,
  motionConfig,
  accent,
  componentSettings,
  autoFit = false,
}: {
  image: SelectedImage;
  motionPreset: MotionPreset;
  motionConfig: MotionConfig;
  accent: AccentConfig;
  componentSettings: ComponentSettings;
  autoFit?: boolean;
}) {
  const baseTransition = {
    duration: motionConfig.duration,
    ease: motionConfig.ease,
  };

  const motionProps = (() => {
    switch (motionPreset) {
      case "Soft Entrance":
        return {
          initial: {
            opacity: 0,
            y: motionConfig.entranceY,
            scale: 1 - 0.03 * motionConfig.intensityFactor,
          },
          animate: { opacity: 1, y: 0, scale: 1, filter: "none" },
          transition: baseTransition,
        };
      case "Floating":
        return {
          animate: {
            y: [0, -motionConfig.floatDistance, 0],
            filter: "none",
          },
          transition: {
            duration: motionConfig.duration * 1.35,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "Press Feedback":
        return {
          whileHover: { scale: motionConfig.hoverScale },
          whileTap: { scale: motionConfig.tapScale },
          transition: {
            type: "spring" as const,
            stiffness: motionConfig.spring.stiffness,
            damping: motionConfig.spring.damping,
          },
        };
      case "Hover Glow":
        return {
          animate: { filter: "drop-shadow(0 0 0px transparent)" },
          whileHover: {
            scale: motionConfig.hoverScale,
            filter: `drop-shadow(0 0 ${18 + motionConfig.intensityFactor * 18}px ${accent.glow})`,
          },
          transition: {
            duration: motionConfig.duration * 0.45,
            ease: "easeInOut" as const,
          },
        };
      case "Notification Pop":
        return {
          initial: {
            opacity: 0,
            x: motionConfig.entranceY * 1.2,
            scale: 0.96,
          },
          animate: { opacity: 1, x: 0, scale: 1, filter: "none" },
          transition: {
            type: "spring" as const,
            stiffness: motionConfig.spring.stiffness,
            damping: motionConfig.spring.damping,
          },
        };
      case "Card Stagger":
        return {
          initial: { opacity: 0, y: motionConfig.entranceY * 0.7 },
          animate: { opacity: 1, y: 0, filter: "none" },
          transition: baseTransition,
        };
      case "Breathing":
        return {
          animate: {
            scale: [1, 1.025, 1],
            opacity: [1, 0.96, 1],
            filter: "none",
          },
          transition: {
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "Playful Bounce":
        return {
          animate: {
            y: [0, -6, 0],
            scale: [1, 1.08, 0.98, 1.04, 1],
            rotate: [0, -1, 0.8, 0],
            filter: "none",
          },
          whileTap: { scale: motionConfig.tapScale },
          transition: {
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "Intelligent Drift":
        return {
          animate: {
            x: [0, 4, -2, 0],
            rotate: [0, 1, -1, 0],
            scale: [1, 1.02, 1.01, 1],
            opacity: [1, 0.97, 1],
            filter: "none",
          },
          transition: {
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "Alert Pulse":
        return {
          animate: {
            scale: [1, 1.12, 1],
            opacity: [1, 0.7, 1],
            filter: [
              "drop-shadow(0 0 0px transparent)",
              `drop-shadow(0 0 ${18 + motionConfig.intensityFactor * 18}px ${accent.glow})`,
              "drop-shadow(0 0 0px transparent)",
            ],
          },
          transition: {
            duration: 0.7,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
    }
  })();

  return (
    <motion.img
      {...motionProps}
      src={image.previewUrl ?? ""}
      alt={image.name}
      className="block object-contain"
      style={{
        width: autoFit ? "auto" : componentSettings.width,
        height: autoFit ? "auto" : componentSettings.height,
        maxWidth: autoFit ? "min(72vw, 460px)" : undefined,
        maxHeight: autoFit ? 320 : undefined,
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    />
  );
}

function PromptDock({
  prompt,
  selectedImage,
  onPromptChange,
  onImageChange,
  onImageRemove,
  onGenerate,
}: {
  prompt: string;
  selectedImage: SelectedImage | null;
  onPromptChange: (value: string) => void;
  onImageChange: (image: SelectedImage) => void;
  onImageRemove: () => void;
  onGenerate: () => void;
}) {
  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      onImageChange({ name: file.name, previewUrl: null });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      onImageChange({
        name: file.name,
        previewUrl:
          typeof reader.result === "string" ? reader.result : null,
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className="h-[176px] shrink-0 overflow-hidden border-t border-white/8 bg-[#0b0d10] p-3">
      <div className="mx-auto flex h-full max-w-5xl flex-col rounded-lg border border-white/10 bg-white/[0.04] p-3">
        <label
          htmlFor="motion-prompt"
          className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-neutral-500"
        >
          Prompt
        </label>

        <div className="relative min-h-0 flex-1">
          <textarea
            id="motion-prompt"
            rows={2}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe motion, emotion, and interaction..."
            className="prompt-scrollbar h-full w-full resize-none overflow-y-auto bg-transparent pr-2 text-sm leading-5 text-neutral-200 outline-none placeholder:text-neutral-600"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.28) 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.28) 90%, transparent 100%)",
            }}
          />
        </div>

        <div className="mt-2 flex h-11 shrink-0 items-center gap-2">
          <div className="min-w-0 flex-1">
            {selectedImage ? (
              <div className="flex h-10 max-w-md items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-2.5">
                {selectedImage.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedImage.previewUrl}
                    alt=""
                    className="h-7 w-10 shrink-0 rounded-md object-contain"
                  />
                ) : null}
                <span className="min-w-0 truncate text-xs text-neutral-300">
                  {selectedImage.name}
                </span>
                <button
                  type="button"
                  aria-label="Remove uploaded image"
                  onClick={onImageRemove}
                  className="ml-auto grid size-6 shrink-0 place-items-center rounded-full border border-white/10 text-xs text-neutral-400 transition hover:bg-white/8 hover:text-white"
                >
                  ×
                </button>
              </div>
            ) : null}
          </div>

          <label
            htmlFor="prompt-image-upload"
            className="grid h-10 w-32 place-items-center rounded-lg border border-dashed border-white/18 text-sm text-neutral-300 transition hover:bg-white/8"
          >
            Upload Image
          </label>
          <input
            id="prompt-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
          <button
            type="button"
            onClick={onGenerate}
            className="generate-button h-10 w-32 cursor-pointer rounded-lg bg-white text-sm font-medium text-black transition-colors"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetsDrawer({
  assets,
  onAssetSelect,
  onClose,
  onDeleteAsset,
  onImportJson,
  onSaveAsset,
}: {
  assets: MotionAsset[];
  onAssetSelect: (asset: MotionAsset) => void;
  onClose: () => void;
  onDeleteAsset: (id: string) => void;
  onImportJson: (data: unknown) => boolean;
  onSaveAsset: () => void;
}) {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  function handleJsonImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = onImportJson(JSON.parse(String(reader.result)));
        setImportStatus(
          imported ? `Imported ${file.name}` : `Could not import ${file.name}`
        );
      } catch {
        setImportStatus(`Could not import ${file.name}`);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <>
      <motion.button
        aria-label="Close assets drawer"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-30 bg-black/50"
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#101318] shadow-2xl shadow-black/60"
      >
        <div className="flex h-[116px] items-start justify-between gap-4 border-b border-white/8 px-6 pb-6 pt-9">
          <div className="min-w-0">
            <h2 className="text-lg font-medium text-white">Assets</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Workspace Library
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-0 grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-neutral-300 transition hover:bg-white/8"
          >
            x
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSaveAsset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-neutral-200 transition hover:bg-white/10"
            >
              <Save size={15} aria-hidden="true" />
              Save Current Motion
            </button>
            <label
              htmlFor="asset-json-import"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/18 bg-white/[0.03] px-3 py-2.5 text-sm text-neutral-300 transition hover:bg-white/8"
            >
              <FileJson size={15} aria-hidden="true" />
              Import JSON
            </label>
            <input
              id="asset-json-import"
              type="file"
              accept="application/json,.json"
              onChange={handleJsonImport}
              className="sr-only"
            />
          </div>
          {importStatus ? (
            <p className="text-xs text-neutral-500">{importStatus}</p>
          ) : null}

          {assets.length === 0 ? (
            <div className="rounded-lg border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-neutral-100">
                No saved assets yet
              </p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                Save the current motion to add it to this workspace library.
              </p>
            </div>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-lg border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/16"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-100">
                      {asset.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {asset.componentType}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-neutral-600">
                    {asset.createdAt}
                  </span>
                </div>
                <p className="mt-3 text-xs text-neutral-400">
                  {asset.motionPreset}
                </p>
                {asset.uploadedImage ? (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
                    {asset.uploadedImage.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.uploadedImage.previewUrl}
                        alt=""
                        className="h-10 w-14 shrink-0 rounded-md object-contain"
                      />
                    ) : null}
                    <span className="min-w-0 truncate text-xs text-neutral-400">
                      {asset.uploadedImage.name}
                    </span>
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md border border-white/8 px-2 py-1 text-[11px] text-neutral-500">
                    INT {asset.intensity}%
                  </span>
                  <span className="rounded-md border border-white/8 px-2 py-1 text-[11px] text-neutral-500">
                    SPD {asset.speed}%
                  </span>
                  <span className="rounded-md border border-white/8 px-2 py-1 text-[11px] text-neutral-500">
                    SOF {asset.softness}%
                  </span>
                  <span className="rounded-md border border-white/8 px-2 py-1 text-[11px] text-neutral-500">
                    {asset.componentWidth}×{asset.componentHeight}
                  </span>
                  <span className="rounded-md border border-white/8 px-2 py-1 text-[11px] text-neutral-500">
                    R {asset.componentRadius}px
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-500">
                  {asset.prompt}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAssetSelect(asset)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
                  >
                    Use
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteAsset(asset.id)}
                    className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-neutral-400 transition hover:bg-white/8 hover:text-neutral-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.aside>
    </>
  );
}

function ExportDrawer({
  onClose,
  componentType,
  motionPreset,
  intensity,
  speed,
  softness,
  componentSettings,
  componentContent,
  accentName,
  uploadedImage,
}: {
  onClose: () => void;
  componentType: ComponentType;
  motionPreset: MotionPreset;
  intensity: number;
  speed: number;
  softness: number;
  componentSettings: ComponentSettings;
  componentContent: ComponentContent;
  accentName: AccentName;
  uploadedImage: SelectedImage | null;
}) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("TSX");
  const [copyStatus, setCopyStatus] = useState("Copy Code");
  const previewCode = buildExportCode(
    activeFormat,
    componentType,
    motionPreset,
    intensity,
    speed,
    softness,
    componentSettings,
    componentContent,
    accentName,
    uploadedImage
  );
  const fileName = exportFileName(activeFormat, componentType);

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(previewCode);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy Code"), 1400);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = previewCode;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy Code"), 1400);
    }
  }

  function handleDownloadCode() {
    const blob = new Blob([previewCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <motion.button
        aria-label="Close export drawer"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-30 bg-black/50"
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#101318] shadow-2xl shadow-black/60"
      >
        <div className="flex h-[116px] items-start justify-between gap-4 border-b border-white/8 px-6 pb-6 pt-9">
          <div className="min-w-0">
            <h2 className="text-lg font-medium text-white">Export</h2>
            <p className="mt-1 text-sm text-neutral-500">Export Motion</p>
          </div>
          <button
            onClick={onClose}
            className="mt-0 grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-neutral-300 transition hover:bg-white/8"
          >
            x
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {exportFormats.map((format) => (
              <button
                key={format}
                onClick={() => setActiveFormat(format)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                  activeFormat === format
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/8 bg-white/[0.03] text-neutral-400 hover:border-white/16 hover:text-neutral-200"
                }`}
              >
                {format}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-white/8 bg-[#0b0d10]">
            <pre className="h-full overflow-auto p-4 text-xs leading-5 text-neutral-300">
              <code>{previewCode}</code>
            </pre>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-neutral-200 transition hover:bg-white/10"
            >
              <Copy size={15} aria-hidden="true" />
              {copyStatus}
            </button>
            <button
              type="button"
              onClick={handleDownloadCode}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-neutral-200 transition hover:bg-white/10"
            >
              <Download size={15} aria-hidden="true" />
              Download
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
