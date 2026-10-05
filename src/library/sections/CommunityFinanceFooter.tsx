import {
  getFinanceCtaValue,
  getFinanceSurfaceColorStyle,
  getFinanceTextThemeColor,
} from "../shared/sectionHelpers";
import "../shared/typography.css";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  Link,
  type LinkType,
} from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  type StyledButtonValue,
  VisibilityWrapper,
  getThemeColorCssValue,
  getAnalyticsScopeHash,
  normalizeLink,
  resolveComponentData,
  useDocument,
  type StyledLinkValue,
  type StreamDocument,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
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

const financeSectionStylesFields = {
  verticalPadding: {
    label: msg("fields.verticalPadding", "Top/Bottom Padding"),
    type: "select",
    options: [
      { label: msg("fields.options.default", "Default"), value: "default" },
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

const FINANCE_SECTION_MAX_WIDTH = "var(--maxWidth-pageSection-contentWidth)";

type LegacyFooterLink = {
  label: TranslatableString;
  link: TranslatableString;
  linkType: LinkType;
  normalizeLink: boolean;
  openInNewTab: boolean;
};

type FooterLinkItem = {
  cta: ComprehensiveCTAValue;
};

type FooterBrand = LegacyFooterLink & {
  fontColor?: ThemeColor;
  styles: StyledLinkValue;
};

type FooterLinks = {
  items: FooterLinkItem[];
};

type FooterLinkCollection = {
  items: Array<FooterLinkItem | LegacyFooterLink>;
};

type CommunityFinanceFooterProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  brand?: FooterBrand;
  links?: FooterLinks;
};

const linkTypeOptions: Array<{ label: string; value: LinkType }> = [
  { label: msg("fields.options.url", "URL"), value: "URL" },
  { label: msg("fields.options.phone", "Phone"), value: "PHONE" },
  { label: msg("fields.options.email", "Email"), value: "EMAIL" },
];

const defaultLinkStyles: StyledLinkValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  letterSpacing: "default",
  includeCaret: "default",
};

const defaultButtonStyles: StyledButtonValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  letterSpacing: "default",
  borderRadius: "default",
};

const defaultFooterLinkCta = (label: string): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValueEnabled: true,
      constantValue: {
        ctaType: "textAndLink",
        label: {
          defaultValue: label,
        },
        link: {
          defaultValue: "#",
        },
        linkType: "URL",
      },
      selectedType: "textAndLink",
    },
    openInNewTab: false,
    buttonText: {
      defaultValue: label,
    },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: {
      defaultValue: label,
    },
  },
  styles: {
    variant: "link",
    color: {
      selectedColor: "default",
      contrastingColor: "black",
    },
    button: defaultButtonStyles,
    link: defaultLinkStyles,
  },
});

const resolveString = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: StreamDocument,
): string => {
  if (!value) {
    return "";
  }

  return resolveComponentData(value, locale, streamDocument) || "";
};

const getLinkTextStyles = ({
  color,
  styles,
}: {
  color?: ThemeColor;
  styles: Pick<
    StyledLinkValue,
    | "fontFamily"
    | "fontSize"
    | "fontWeight"
    | "fontStyle"
    | "textTransform"
    | "letterSpacing"
  >;
}): React.CSSProperties => {
  return {
    color: getThemeColorCssValue(color?.selectedColor),
    fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
    fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
    fontWeight:
      styles.fontWeight === "default" ? undefined : styles.fontWeight,
    fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
    textTransform:
      styles.textTransform === "default" ? undefined : styles.textTransform,
    letterSpacing:
      styles.letterSpacing === "default" ? undefined : styles.letterSpacing,
  };
};

const CommunityFinanceFooterFields: YextFields<CommunityFinanceFooterProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        styles: {
          label: msg("fields.sectionStyles", "Section Styles"),
          type: "object",
          objectFields: financeSectionStylesFields,
        },
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    brand: {
      label: msg("fields.brand", "Brand"),
      type: "object",
      objectFields: {
        label: {
          label: msg("fields.label", "Label"),
          type: "translatableString",
        },
        link: {
          label: msg("fields.link", "Link"),
          type: "translatableString",
        },
        linkType: {
          label: msg("fields.linkType", "Link Type"),
          type: "select",
          options: linkTypeOptions,
        },
        normalizeLink: {
          label: msg("fields.normalizeLink", "Normalize Link"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        openInNewTab: {
          label: msg("fields.openInNewTab", "Open in New Tab"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        styles: {
          label: msg("fields.linkStyles", "Link Styles"),
          type: "styledLink",
          showIncludeCaretField: false,
        },
      },
    },
    links: {
      label: msg("fields.links", "Links"),
      type: "object",
      objectFields: {
        items: {
          label: msg("fields.items", "Items"),
          type: "array",
          arrayFields: {
            cta: {
              label: msg("fields.cta", "CTA"),
              type: "comprehensiveCTA",
            },
          },
          defaultItemProps: (index: number) => ({
            cta: defaultFooterLinkCta(`Footer Link ${index + 1}`),
          }),
          getItemSummary: (item: FooterLinkItem, index?: number) =>
            (typeof item.cta?.data?.cta?.constantValue?.label === "string"
              ? item.cta.data.cta.constantValue.label
              : item.cta?.data?.cta?.constantValue?.label &&
                  typeof item.cta.data.cta.constantValue.label === "object" &&
                  "defaultValue" in item.cta.data.cta.constantValue.label &&
                  typeof item.cta.data.cta.constantValue.label.defaultValue ===
                    "string"
                ? item.cta.data.cta.constantValue.label.defaultValue
                : "") ||
            `Footer Link ${index ?? 0}`,
        },
      },
    },
  };

const CommunityFinanceFooterComponent: PuckComponent<
  CommunityFinanceFooterProps
> = (props) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const legacyProps = props as typeof props & {
    brandLabel?: {
      text?: unknown;
      fontColor?: ThemeColor;
      styles?: Partial<StyledLinkValue>;
    };
    brandLink?: string;
    links?:
      | Array<{ label?: string; link?: string }>
      | FooterLinkCollection
      | FooterLinks;
  };
  const brand: FooterBrand = props.brand ?? {
    label:
      (legacyProps.brandLabel?.text
        ? (resolveComponentData(
            legacyProps.brandLabel.text as TranslatableString,
            locale,
            streamDocument,
          ) as string | undefined)
        : undefined) || "",
    link: legacyProps.brandLink || "#",
    linkType: "URL",
    normalizeLink: false,
    openInNewTab: false,
    fontColor: legacyProps.brandLabel?.fontColor,
    styles: {
      ...defaultLinkStyles,
      fontFamily: legacyProps.brandLabel?.styles?.fontFamily ?? "default",
      fontSize: legacyProps.brandLabel?.styles?.fontSize ?? "default",
      fontWeight: legacyProps.brandLabel?.styles?.fontWeight ?? "default",
      fontStyle: legacyProps.brandLabel?.styles?.fontStyle ?? "default",
      textTransform:
        legacyProps.brandLabel?.styles?.textTransform ?? "default",
    },
  };
  const links: FooterLinkCollection =
    props.links && !Array.isArray(props.links)
      ? (props.links as FooterLinkCollection)
      : {
          items: Array.isArray(legacyProps.links)
            ? legacyProps.links.map((item) => ({
                label: item.label || "",
                link: item.link || "#",
                linkType: "URL",
                normalizeLink: false,
                openInNewTab: false,
              }))
            : [],
        };
  const resolvedBrandLabel = resolveString(
    brand.label,
    locale,
    streamDocument,
  );
  const resolvedBrandLink = resolveString(
    brand.link,
    locale,
    streamDocument,
  );
  const brandLink = brand.normalizeLink
    ? normalizeLink(resolvedBrandLink, brand.linkType)
    : resolvedBrandLink;
  const brandTextStyles = getLinkTextStyles({
    color: getFinanceTextThemeColor(
      brand.fontColor,
      props.section.backgroundColor,
      streamDocument,
    ),
    styles: brand.styles,
  });
  const footerLinks = (links.items ?? [])
    .map((item, index) => {
      if ("cta" in item) {
        return {
          key: `footer-link-${index}`,
          cta: item.cta,
          isLegacy: false,
        };
      }

      const label = resolveString(item.label, locale, streamDocument);
      const resolvedLink = resolveString(item.link, locale, streamDocument);
      const link = item.normalizeLink
        ? normalizeLink(resolvedLink, item.linkType)
        : resolvedLink;

      return {
        key: `footer-link-${index}-${label}-${link}`,
        cta: {
          data: {
            actionType: "link",
            cta: {
              field: "",
              constantValueEnabled: true,
              constantValue: {
                ctaType: "textAndLink",
                label: {
                  defaultValue: label,
                },
                link: {
                  defaultValue: link,
                },
                linkType: item.linkType,
              },
              selectedType: "textAndLink",
            },
            openInNewTab: item.openInNewTab,
            buttonText: {
              defaultValue: label,
            },
            customId: "",
            customClass: "",
            dataAttributes: [],
            ariaLabel: {
              defaultValue: label,
            },
          },
          styles: {
            variant: "link",
            color: {
              selectedColor: "default",
              contrastingColor: "black",
            },
            button: defaultButtonStyles,
            link: defaultLinkStyles,
          },
        } as ComprehensiveCTAValue,
        isLegacy: true,
      };
    })
    .filter((item) => {
      const resolvedCta = resolveComponentData(
        item.cta.data.cta,
        locale,
        streamDocument,
      ) as
        | {
            label?: TranslatableString;
            link?: TranslatableString;
            linkType?: LinkType;
          }
        | undefined;

      return Boolean(
        resolveString(resolvedCta?.label, locale, streamDocument) &&
          resolveString(resolvedCta?.link, locale, streamDocument),
      );
    });

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceFooter${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          id="footer"
          as="footer"
          background={props.section.backgroundColor}
          className="yext-community-finance-footer relative border-t border-current/10"
          style={getFinanceSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
        >
          <div
            className="mx-auto flex flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8"
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
              paddingBlock:
                props.section.styles.verticalPadding === "default"
                  ? "var(--padding-pageSection-verticalPadding)"
                  : props.section.styles.verticalPadding,
            }}
          >
            <Link
              cta={{ link: brandLink, linkType: brand.linkType }}
              target={brand.openInNewTab ? "_blank" : undefined}
              rel={brand.openInNewTab ? "noopener noreferrer" : undefined}
            >
              <span style={brandTextStyles}
              >
                {resolvedBrandLabel}
              </span>
            </Link>

            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footerLinks.map((item) => (
                <li key={item.key}>
                  <EntityField
                    displayName="Footer Link"
                    fieldId={item.cta.data.cta.field}
                    constantValueEnabled={
                      item.cta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={getFinanceCtaValue(
                        item.cta as Partial<ComprehensiveCTAValue>,
                        props.section.backgroundColor,
                        streamDocument,
                      )}
                      eventName="footerLink"
                      className={
                        item.isLegacy
                          ? "inline-flex transition-colors hover:opacity-80"
                          : "inline-flex"
                      }
                    />
                  </EntityField>
                </li>
              ))}
            </ul>
          </div>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceFooter: YextComponentConfig<CommunityFinanceFooterProps> =
  {
    label: msg("components.footer", "Footer"),
    fields: CommunityFinanceFooterFields,
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
      brand: {
        label: {
          en: "[[name]]",
          hasLocalizedValue: "true",
        },
        link: {
          defaultValue: "#",
        },
        linkType: "URL",
        normalizeLink: false,
        openInNewTab: false,
        fontColor: undefined,
        styles: defaultLinkStyles,
      },
      links: {
        items: ["Locations", "Services", "Advisors", "Disclosures", "Contact"]
          .map((label) => ({
            cta: defaultFooterLinkCta(label),
          })),
      },
    },
    render: CommunityFinanceFooterComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceFooter",
  displayName: "Footer",
  description: "Footer",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
