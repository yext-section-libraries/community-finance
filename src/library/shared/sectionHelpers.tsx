import * as React from "react";
import type { ImageType } from "@yext/pages-components";
import {
  msg,
  MaybeRTF,
  getThemeColorCssValue,
  isDarkColor,
  type MaybeRTFProps,
  type RichText,
  type StyledTextValue,
  type StreamDocument,
  type ThemeColor,
} from "@yext/visual-editor";

export type FinanceSectionVerticalPaddingValue =
  | "default"
  | "0px"
  | "2px"
  | "4px"
  | "6px"
  | "8px"
  | "10px"
  | "12px"
  | "14px"
  | "16px"
  | "20px"
  | "24px"
  | "28px"
  | "32px"
  | "36px"
  | "40px"
  | "44px"
  | "48px"
  | "56px"
  | "64px"
  | "80px"
  | "96px";

export type FinanceSectionStyles = {
  verticalPadding: FinanceSectionVerticalPaddingValue;
};

export const financeSectionStylesFields = {
  verticalPadding: {
    label: msg("fields.verticalPadding", "Top/Bottom Padding"),
    type: "select",
    options: [
      { label: msg("fields.options.default", "Default"), value: "default" },
      ...[
        0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48,
        56, 64, 80, 96,
      ].map((value) => ({ label: `${value}px`, value: `${value}px` })),
    ],
  },
} as const;

export const FINANCE_SECTION_MAX_WIDTH = "var(--maxWidth-pageSection-contentWidth)";

const resolveStyledTextStyles = (
  styles:
    | Partial<
        Pick<
          StyledTextValue,
          "fontFamily" | "fontSize" | "fontWeight" | "fontStyle" | "textTransform"
        >
      >
    | undefined,
) => ({
  fontFamily: styles?.fontFamily === "default" ? undefined : styles?.fontFamily,
  fontSize: styles?.fontSize === "default" ? undefined : styles?.fontSize,
  fontWeight: styles?.fontWeight === "default" ? undefined : styles?.fontWeight,
  fontStyle: styles?.fontStyle === "default" ? undefined : styles?.fontStyle,
  textTransform:
    styles?.textTransform === "default" ? undefined : styles?.textTransform,
});

export const renderRichText = (
  value: unknown,
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"],
): React.ReactNode => {
  const textStyle = resolveStyledTextStyles(richTextStyleOverrides);
  const bodyStyle = Object.fromEntries(
    Object.entries(textStyle)
      .filter(([, value]) => value !== undefined)
      .map(([property, value]) => [`--community-finance-body-${property}`, value]),
  );
  const bodyVariables = Object.fromEntries(
    Object.entries(textStyle)
      .filter(([, value]) => value !== undefined)
      .map(([property, value]) => [`--${property}-body-${property}`, value]),
  );
  const color =
    typeof richTextStyleOverrides?.color === "object"
      ? getThemeColorCssValue(richTextStyleOverrides.color)
      : richTextStyleOverrides?.color;

  if (React.isValidElement(value)) {
    if (value.type === MaybeRTF) {
      const element = value as React.ReactElement<MaybeRTFProps>;
      return React.cloneElement(element, {
        richTextStyleOverrides: { ...textStyle, color },
        style: { ...element.props.style, ...bodyStyle, ...bodyVariables, color },
      });
    }

    const element = value as React.ReactElement<{
      style?: React.CSSProperties;
      children?: React.ReactNode;
    }>;
    const child = element.props.children;
    const isMaybeRTFChild = React.isValidElement(child) && child.type === MaybeRTF;
    const isRichTextChild = React.isValidElement<{
      className?: string;
      style?: React.CSSProperties;
    }>(child) && child.props.className?.includes("rtf-wrapper");

    return React.cloneElement(
      element,
      {
        children: isMaybeRTFChild
          ? renderRichText(child, richTextStyleOverrides)
          : isRichTextChild
            ? React.cloneElement(child, {
                style: {
                  ...child.props.style,
                  ...bodyStyle,
                  ...bodyVariables,
                  color,
                },
              })
            : child,
        style: {
          ...element.props.style,
          ...bodyStyle,
          ...bodyVariables,
          color,
        } as React.CSSProperties,
      },
    );
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;
  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={{ ...textStyle, color }}
    />
  );
};

export const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) return true;
  if (typeof value === "string") return value.trim() === "";
  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }
  return false;
};

export const hasImageSource = (image: unknown): image is ImageType => {
  if (!image || typeof image !== "object") return false;
  if ("url" in image && typeof image.url === "string") {
    return image.url.trim().length > 0;
  }
  return Boolean(
    "image" in image &&
      image.image &&
      typeof image.image === "object" &&
      "url" in image.image &&
      typeof image.image.url === "string" &&
      image.image.url.trim(),
  );
};

export const getThemeColorValue = (
  color?: ThemeColor,
): string | undefined => {
  const token = color?.selectedColor;
  if (!token || token === "default") return undefined;
  if (token === "white") return "#ffffff";
  if (token.endsWith("-light")) {
    return `hsl(from var(--colors-${token.replace(/-light$/, "")}) h s 98)`;
  }
  if (token.endsWith("-dark")) {
    return `hsl(from var(--colors-${token.replace(/-dark$/, "")}) h s 20)`;
  }
  if (token.startsWith("palette-")) return `var(--colors-${token})`;
  if (token.startsWith("[") && token.endsWith("]")) return token.slice(1, -1);
  return token;
};

export const getSurfaceTextColor = (
  color: ThemeColor | undefined,
  surfaceColor: ThemeColor,
  streamDocument?: StreamDocument,
): string | undefined =>
  getThemeColorValue(color) ??
  (streamDocument
    ? isDarkColor(surfaceColor, streamDocument)
      ? "#ffffff"
      : "#000000"
    : getThemeColorValue({
        selectedColor: surfaceColor.contrastingColor,
        contrastingColor: surfaceColor.selectedColor,
      }));
