import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  Link,
  type LinkType,
} from "@yext/pages-components";
import {
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
  { label: "URL", value: "URL" },
  { label: "Phone", value: "PHONE" },
  { label: "Email", value: "EMAIL" },
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
    brand: {
      label: "Brand",
      type: "object",
      objectFields: {
        label: {
          label: "Label",
          type: "translatableString",
        },
        link: {
          label: "Link",
          type: "translatableString",
        },
        linkType: {
          label: "Link Type",
          type: "select",
          options: linkTypeOptions,
        },
        normalizeLink: {
          label: "Normalize Link",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        openInNewTab: {
          label: "Open in New Tab",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        styles: {
          label: "Link Styles",
          type: "styledLink",
          showIncludeCaretField: false,
        },
      },
    },
    links: {
      label: "Links",
      type: "object",
      objectFields: {
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            cta: {
              label: "CTA",
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
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
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
    color: brand.fontColor,
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
        >
          <style>{`
            .yext-community-finance-footer p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-footer li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-footer h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-footer h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-footer h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-footer h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-footer h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-footer h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-footer a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: none;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }

            .yext-community-finance-footer a:hover {
              text-decoration: underline;
            }
          `}</style>
          <div
            className="mx-auto flex flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8"
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
              paddingBlock:
                props.section.styles.verticalPadding === "default"
                  ? "28px"
                  : props.section.styles.verticalPadding,
            }}
          >
            <Link
              cta={{ link: brandLink, linkType: brand.linkType }}
              target={brand.openInNewTab ? "_blank" : undefined}
              rel={brand.openInNewTab ? "noopener noreferrer" : undefined}
              className="text-inherit"
            >
              <span
                className="text-sm font-bold uppercase tracking-[0.24em]"
                style={brandTextStyles}
              >
                {resolvedBrandLabel}
              </span>
            </Link>

            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
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
                      value={item.cta as Partial<ComprehensiveCTAValue>}
                      eventName="footerLink"
                      className={
                        item.isLegacy
                          ? "inline-flex text-inherit transition-colors hover:opacity-80"
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
    label: "Footer",
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
