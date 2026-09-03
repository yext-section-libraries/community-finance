import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  Background,
  EntityField,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveBreadcrumbs,
  resolveComponentData,
  useDocument,
  useTemplateProps,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

type FinanceSectionVerticalPaddingValue =
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

type FinanceSectionStyles = {
  verticalPadding: FinanceSectionVerticalPaddingValue;
};

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type CommunityFinanceBreadcrumbsProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  rootLabel: StyledTextProps;
  currentPage: StyledTextProps;
  includeCurrentLocation: boolean;
};

const financeSectionStylesFields = {
  verticalPadding: {
    label: "Top/Bottom Padding",
    type: "select",
    options: [
      { label: "Default", value: "default" },
      { label: "0px", value: "0px" },
      { label: "2px", value: "2px" },
      { label: "4px", value: "4px" },
      { label: "6px", value: "6px" },
      { label: "8px", value: "8px" },
      { label: "10px", value: "10px" },
      { label: "12px", value: "12px" },
      { label: "14px", value: "14px" },
      { label: "16px", value: "16px" },
      { label: "20px", value: "20px" },
      { label: "24px", value: "24px" },
      { label: "28px", value: "28px" },
      { label: "32px", value: "32px" },
      { label: "36px", value: "36px" },
      { label: "40px", value: "40px" },
      { label: "44px", value: "44px" },
      { label: "48px", value: "48px" },
      { label: "56px", value: "56px" },
      { label: "64px", value: "64px" },
      { label: "80px", value: "80px" },
      { label: "96px", value: "96px" },
    ],
  },
} as const;

const FINANCE_SECTION_MAX_WIDTH = "1440px";

const getThemeColorValue = (color?: ThemeColor): string | undefined => {
  const token = color?.selectedColor;

  if (!token || token === "default") {
    return undefined;
  }

  if (token === "white") {
    return "#ffffff";
  }

  if (token.endsWith("-light")) {
    const baseToken = token.replace(/-light$/, "");
    return `hsl(from var(--colors-${baseToken}) h s 98)`;
  }

  if (token.endsWith("-dark")) {
    const baseToken = token.replace(/-dark$/, "");
    return `hsl(from var(--colors-${baseToken}) h s 20)`;
  }

  if (token.startsWith("palette-")) {
    return `var(--colors-${token})`;
  }

  if (
    token.startsWith("var(") ||
    token.startsWith("#") ||
    token.startsWith("rgb(") ||
    token.startsWith("rgba(") ||
    token.startsWith("hsl(") ||
    token.startsWith("hsla(")
  ) {
    return token;
  }

  if (token.startsWith("[") && token.endsWith("]")) {
    return token.slice(1, -1);
  }

  return token;
};

const getReadableForegroundColor = (
  surfaceColor: ThemeColor,
  streamDocument: StreamDocument,
): string =>
  isDarkColor(surfaceColor, streamDocument) ? "#ffffff" : "#000000";

const getSurfaceTextColor = (
  color: ThemeColor | undefined,
  surfaceColor: ThemeColor,
  streamDocument: StreamDocument,
): string =>
  getThemeColorValue(color) ??
  getReadableForegroundColor(surfaceColor, streamDocument);

const getTextStyles = (
  field: StyledTextProps,
  surfaceColor: ThemeColor,
  streamDocument: StreamDocument,
): React.CSSProperties => ({
  color: getSurfaceTextColor(field.fontColor, surfaceColor, streamDocument),
  fontFamily:
    field.styles.fontFamily === "default"
      ? "var(--fontFamily-link-fontFamily)"
      : field.styles.fontFamily,
  fontSize:
    field.styles.fontSize === "default"
      ? "var(--fontSize-link-fontSize)"
      : field.styles.fontSize,
  fontWeight:
    field.styles.fontWeight === "default"
      ? "var(--fontWeight-link-fontWeight)"
      : field.styles.fontWeight,
  fontStyle:
    field.styles.fontStyle === "default" ? undefined : field.styles.fontStyle,
  lineHeight: 1.4,
  textTransform:
    field.styles.textTransform === "default"
      ? undefined
      : field.styles.textTransform,
});

const CommunityFinanceBreadcrumbsFields: YextFields<CommunityFinanceBreadcrumbsProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        styles: {
          label: "Section Styles",
          type: "object",
          objectFields: financeSectionStylesFields,
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    rootLabel: {
      label: "Root Label",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    currentPage: {
      label: "Current Page",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    includeCurrentLocation: {
      label: "Include Current Location",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  };

const CommunityFinanceBreadcrumbsComponent: PuckComponent<
  CommunityFinanceBreadcrumbsProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const breadcrumbs = resolveBreadcrumbs(streamDocument) ?? [];
  const resolvedRootLabel =
    resolveComponentData(props.rootLabel.text, locale, streamDocument) ||
    breadcrumbs[0]?.name ||
    "All Locations";
  const resolvedCurrentPageLabel =
    streamDocument.address?.line1 ||
    resolveComponentData(props.currentPage.text, locale, streamDocument) ||
    streamDocument.name ||
    "";
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;
  const sectionBackgroundColor = getThemeColorValue(
    props.section.backgroundColor,
  );
  const rootTextStyles = getTextStyles(
    props.rootLabel,
    props.section.backgroundColor,
    streamDocument,
  );
  const currentTextStyles = getTextStyles(
    props.currentPage,
    props.section.backgroundColor,
    streamDocument,
  );
  const showSyntheticPreview = breadcrumbs.length === 0 && props.puck.isEditing;

  if (breadcrumbs.length === 0 && !showSyntheticPreview) {
    return <></>;
  }

  const getPrefixedHref = (slug?: string) =>
    slug
      ? relativePrefixToRoot
        ? `${relativePrefixToRoot}${slug}`
        : slug
      : undefined;

  const separator = (
    <span
      aria-hidden="true"
      className="text-[0.7rem] opacity-45"
      style={currentTextStyles}
    >
      /
    </span>
  );

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceBreadcrumbs${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="border-b border-current/10"
          style={{
            backgroundColor: sectionBackgroundColor,
            paddingBlock,
          }}
        >
          <div
            className="mx-auto px-5 py-4 md:px-8"
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {showSyntheticPreview ? (
                  <li
                    className="text-sm"
                    style={{
                      ...currentTextStyles,
                      fontFamily: "Arial, Helvetica, sans-serif",
                      padding: "18px 24px",
                    }}
                  >
                    No breadcrumbs available (section will be hidden on live
                    page). Create a directory to enable breadcrumbs.
                    </li>
                ) : (
                  breadcrumbs.map((breadcrumb, index) => {
                    const isRoot = index === 0;
                    const isCurrentPage = index === breadcrumbs.length - 1;
                    const shouldRenderAsCurrent =
                      props.includeCurrentLocation && isCurrentPage;
                    const href = getPrefixedHref(breadcrumb.slug);
                    let label = breadcrumb.name;

                    if (shouldRenderAsCurrent && resolvedCurrentPageLabel) {
                      label = resolvedCurrentPageLabel;
                    }

                    if (isRoot && resolvedRootLabel) {
                      label = resolvedRootLabel;
                    }

                    const breadcrumbNode =
                      !shouldRenderAsCurrent && href ? (
                        <Link
                          cta={{
                            link: href,
                            linkType: "URL",
                          }}
                          eventName={`breadcrumbLink${index}`}
                          className="text-sm font-medium tracking-[0.08em] transition-opacity hover:opacity-75"
                          style={isRoot ? rootTextStyles : currentTextStyles}
                        >
                          {label}
                        </Link>
                      ) : (
                        <span
                          className={`text-sm font-medium tracking-[0.08em] ${
                            shouldRenderAsCurrent ? "opacity-65" : ""
                          }`}
                          style={isRoot ? rootTextStyles : currentTextStyles}
                        >
                          {label}
                        </span>
                      );

                    return (
                      <li
                        key={`${breadcrumb.slug ?? breadcrumb.name ?? index}`}
                        className="flex items-center gap-2"
                      >
                        {!isRoot ? separator : null}
                        <wbr />
                        {isRoot ? (
                          <EntityField
                            displayName="Directory Root"
                            fieldId={props.rootLabel.text.field}
                            constantValueEnabled={
                              props.rootLabel.text.constantValueEnabled
                            }
                          >
                            {breadcrumbNode}
                          </EntityField>
                        ) : shouldRenderAsCurrent ? (
                          <EntityField
                            displayName="Current Page"
                            fieldId={props.currentPage.text.field}
                            constantValueEnabled={
                              props.currentPage.text.constantValueEnabled
                            }
                          >
                            {breadcrumbNode}
                          </EntityField>
                        ) : (
                          breadcrumbNode
                        )}
                      </li>
                    );
                  })
                )}
              </ol>
            </nav>
          </div>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceBreadcrumbs: YextComponentConfig<CommunityFinanceBreadcrumbsProps> =
  {
    label: "Breadcrumbs",
    fields: CommunityFinanceBreadcrumbsFields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        styles: {
          verticalPadding: "default",
        },
        visibleOnLivePage: true,
      },
      rootLabel: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "All Locations",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "uppercase",
        },
        fontColor: undefined,
      },
      currentPage: {
        text: {
          field: "name",
          constantValue: {
            defaultValue: "",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: false,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "uppercase",
        },
        fontColor: undefined,
      },
      includeCurrentLocation: true,
    },
    render: CommunityFinanceBreadcrumbsComponent,
  };

export default CommunityFinanceBreadcrumbs;

export const config: SectionConfig = {
  id: "CommunityFinanceBreadcrumbs",
  displayName: "Breadcrumbs",
  description: "Breadcrumbs",
  pageSetTypes: ["ENTITY"],
};
