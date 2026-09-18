import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  AnalyticsScopeProvider,
  HoursStatus,
  type HoursType,
  type ImageType,
  type StatusParams,
} from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  EntityField,
  Heading,
  Image,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
  type StreamDocument,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  hasImageSource,
  renderRichText,
} from "../shared/sectionHelpers";

type StyledHeading = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledBody = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type HeroImage = {
  image: YextEntityField<ImageType>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles: StyledImageValue;
};

type StatusPill = {
  backgroundColor: ThemeColor;
};

type HoursStyles = {
  showCurrentStatus: boolean;
  timeFormat: "12h" | "24h";
  dayOfWeekFormat: "short" | "long";
  showDayNames: boolean;
};

type HeroVerticalPaddingValue =
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

type HeroSectionStyles = {
  verticalPadding: HeroVerticalPaddingValue;
};

type CommunityFinanceHeroProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: HeroSectionStyles;
    visibleOnLivePage: boolean;
  };
  heading: StyledHeading;
  body: StyledBody;
  primaryCta: ComprehensiveCTAValue;
  secondaryCta: ComprehensiveCTAValue;
  heroImage: HeroImage;
  hours: YextEntityField<HoursType>;
  hoursStyles: HoursStyles;
  statusPill: StatusPill;
};

const heroVerticalPaddingOptions: Array<{
  label: string;
  value: HeroVerticalPaddingValue;
}> = [
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
];

const CommunityFinanceHeroFields: YextFields<CommunityFinanceHeroProps> =
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
          objectFields: {
            verticalPadding: {
              label: msg("fields.verticalPadding", "Top/Bottom Padding"),
              type: "select",
              options: heroVerticalPaddingOptions,
            },
          },
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
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.string"] },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    body: {
      label: msg("fields.body", "Body"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    primaryCta: {
      label: msg("fields.primaryCTA", "Primary CTA"),
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: msg("fields.secondaryCTA", "Secondary CTA"),
      type: "comprehensiveCTA",
    },
    heroImage: {
      label: msg("fields.heroImage", "Hero Image"),
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.image", "Image"),
          filter: { types: ["type.image"] },
        },
        aspectRatio: {
          label: msg("fields.aspectRatio", "Aspect Ratio"),
          type: "number",
        },
        imageConstrain: {
          label: msg("fields.imageConstrain", "Image Constrain"),
          type: "select",
          options: [
            { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
            { label: msg("fields.options.filled", "Filled"), value: "filled" },
          ],
        },
        styles: {
          label: msg("fields.imageStyles", "Image Styles"),
          type: "styledImage",
        },
      },
    },
    hours: {
      type: "entityField",
      label: msg("fields.hours", "Hours"),
      filter: {
        types: ["type.hours"],
      },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: msg("fields.hoursStyles", "Hours Styles"),
      type: "object",
      objectFields: {
        showCurrentStatus: {
          label: msg("fields.showCurrentStatus", "Show Current Status"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        timeFormat: {
          label: msg("fields.timeFormat", "Time Format"),
          type: "select",
          options: [
            { label: msg("fields.options.hour12", "12-hour"), value: "12h" },
            { label: msg("fields.options.hour24", "24-hour"), value: "24h" },
          ],
        },
        dayOfWeekFormat: {
          label: msg("fields.dayOfWeekFormat", "Day of Week Format"),
          type: "select",
          options: [
            { label: msg("fields.options.short", "Short"), value: "short" },
            { label: msg("fields.options.long", "Long"), value: "long" },
          ],
        },
        showDayNames: {
          label: msg("fields.showDayNames", "Show Day Names"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    statusPill: {
      label: msg("fields.statusPill", "Status Pill"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
  };

const CommunityFinanceHeroComponent: PuckComponent<
  CommunityFinanceHeroProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const resolvedBody = resolveComponentData(
    props.body.text,
    locale,
    streamDocument,
  );
  const resolvedHours = resolveComponentData(
    props.hours,
    locale,
    streamDocument,
  );
  const resolvedHeroImage = resolveComponentData(
    props.heroImage.image,
    locale,
    streamDocument,
  );
  const hasHeroImage = hasImageSource(resolvedHeroImage);
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;

  const statusTemplate = (status: StatusParams) => {
    const isComingSoon = !!status.comingSoon;
    const isOpen24Hours = !!status.currentInterval?.is24h?.();
    const isIndefinitelyClosed = !status.futureInterval;
    const hasFutureStatus = !isOpen24Hours && !isIndefinitelyClosed;
    const interval = status.isOpen
      ? status.currentInterval
      : status.futureInterval;
    const time = status.isOpen
      ? (interval?.getEndTime(i18n.language, status.timeOptions) ?? "")
      : (interval?.getStartTime(i18n.language, status.timeOptions) ?? "");
    const dayOfWeek = props.hoursStyles.showDayNames
      ? (interval?.[status.isOpen ? "end" : "start"]
          ?.setLocale(i18n.language)
          .toLocaleString({
            weekday: props.hoursStyles.dayOfWeekFormat,
          }) ?? "")
      : "";
    const currentStatus = isComingSoon
      ? t("comingSoon", "Coming Soon")
      : isOpen24Hours
        ? t("open24Hours", "Open 24 Hours")
        : isIndefinitelyClosed
          ? t("temporarilyClosed", "Temporarily Closed")
          : status.isOpen
            ? t("openNow", "Open Now")
            : t("closed", "Closed");
    const futureStatus =
      !isComingSoon && hasFutureStatus && time
        ? status.isOpen
          ? dayOfWeek
            ? t(
                "closesAtTimeWeek",
                "Closes at {{time}} {{dayOfWeek}}",
                { time, dayOfWeek },
              )
            : t("closesAtTime", "Closes at {{time}}", { time })
          : dayOfWeek
            ? t(
                "opensAtTimeWeek",
                "Opens at {{time}} {{dayOfWeek}}",
                { time, dayOfWeek },
              )
            : t("opensAtTime", "Opens at {{time}}", { time })
        : "";
    const isOpen = status.isOpen && !isComingSoon;
    const dotColor = isOpen ? "#59b66d" : "#d64545";
    const dotShadow = isOpen
      ? "0 0 0 4px rgba(89, 182, 109, 0.16)"
      : "0 0 0 4px rgba(214, 69, 69, 0.16)";

    return (
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: dotColor,
            boxShadow: dotShadow,
          }}
        />
        <span>{currentStatus}</span>
        {futureStatus ? <span>: {futureStatus}</span> : null}
      </span>
    );
  };

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceHero${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-hero border-b border-current/10"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            paddingBlock,
          }}
        >
          <style>{`
            .yext-community-finance-hero p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-hero li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-hero h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-hero h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-hero h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-hero h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-hero h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-hero h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-hero a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }

            .yext-community-finance-hero a.components {
              text-decoration: none;
            }

            .yext-community-finance-hero a.components:hover {
              text-decoration: underline;
            }
          `}</style>
          <div
            className={`mx-auto grid gap-10 px-5 py-12 md:px-8 ${
              hasHeroImage
                ? "lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-12 lg:py-16"
                : ""
            }`}
            style={{
              maxWidth: "1440px",
            }}
          >
            <div className="order-1">
              {props.hoursStyles.showCurrentStatus && resolvedHours ? (
                <EntityField
                  displayName="Hours Status"
                  fieldId={props.hours.field}
                  constantValueEnabled={props.hours.constantValueEnabled}
                >
                  <Background
                    background={props.statusPill.backgroundColor}
                    className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      ...getSurfaceColorStyle(
                        props.statusPill.backgroundColor,
                        streamDocument,
                      ),
                      textTransform: "uppercase",
                    }}
                  >
                  <HoursStatus
                    hours={resolvedHours}
                    timezone={streamDocument.timezone ?? "UTC"}
                    timeOptions={{
                      hour12: props.hoursStyles.timeFormat === "12h",
                    }}
                    comingSoon={streamDocument.comingSoon}
                    statusTemplate={statusTemplate}
                  />
                </Background>
                </EntityField>
              ) : null}
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
              <Heading
                level={1}
                color={props.heading.fontColor}
                className="m-0 max-w-[720px]"
                style={{
                  fontFamily:
                    props.heading.styles.fontFamily === "default"
                      ? "var(--fontFamily-h1-fontFamily)"
                      : props.heading.styles.fontFamily,
                  fontSize:
                    props.heading.styles.fontSize === "default"
                      ? "var(--fontSize-h1-fontSize)"
                      : props.heading.styles.fontSize,
                  fontWeight:
                    props.heading.styles.fontWeight === "default"
                      ? "var(--fontWeight-h1-fontWeight)"
                      : props.heading.styles.fontWeight,
                  fontStyle:
                    props.heading.styles.fontStyle === "default"
                      ? undefined
                      : props.heading.styles.fontStyle,
                  lineHeight: 0.95,
                  textTransform:
                    props.heading.styles.textTransform === "default"
                      ? undefined
                      : props.heading.styles.textTransform,
                }}
              >
                {resolvedHeading}
              </Heading>
              </EntityField>
              <EntityField
                displayName="Body"
                fieldId={props.body.text.field}
                constantValueEnabled={props.body.text.constantValueEnabled}
              >
                <div
                className="mt-4 max-w-[720px]"
                style={{
                  fontFamily:
                    props.body.styles.fontFamily === "default"
                      ? "var(--fontFamily-body-fontFamily)"
                      : props.body.styles.fontFamily,
                  fontSize:
                    props.body.styles.fontSize === "default"
                      ? "1.125rem"
                      : props.body.styles.fontSize,
                  fontWeight:
                    props.body.styles.fontWeight === "default"
                      ? "var(--fontWeight-body-fontWeight)"
                      : props.body.styles.fontWeight,
                  fontStyle:
                    props.body.styles.fontStyle === "default"
                      ? undefined
                      : props.body.styles.fontStyle,
                  lineHeight: 1.7,
                  textTransform:
                    props.body.styles.textTransform === "default"
                      ? undefined
                      : props.body.styles.textTransform,
                }}
              >
                {renderRichText(resolvedBody, {
                  ...props.body.styles,
                  color: props.body.fontColor,
                })}
              </div>
              </EntityField>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <EntityField
                  displayName="Primary CTA"
                  fieldId={props.primaryCta.data.cta.field}
                  constantValueEnabled={
                    props.primaryCta.data.cta.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    value={props.primaryCta as Partial<ComprehensiveCTAValue>}
                    eventName="primaryCta"
                  />
                </EntityField>
                <EntityField
                  displayName="Secondary CTA"
                  fieldId={props.secondaryCta.data.cta.field}
                  constantValueEnabled={
                    props.secondaryCta.data.cta.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    value={
                      props.secondaryCta as Partial<ComprehensiveCTAValue>
                    }
                    eventName="getDirections"
                    className="p-0 text-sm font-bold no-underline hover:underline"
                  />
                </EntityField>
              </div>
            </div>
            {hasHeroImage ? (
              <div className="order-2">
                <EntityField
                  displayName="Hero Image"
                  fieldId={props.heroImage.image.field}
                  constantValueEnabled={
                    props.heroImage.image.constantValueEnabled
                  }>
                <div
                  className="relative overflow-hidden rounded-[28px]"
                  style={{
                    aspectRatio:
                      props.heroImage.aspectRatio > 0
                        ? props.heroImage.aspectRatio
                        : 1,
                    borderRadius:
                      props.heroImage.styles.borderRadius === "default"
                        ? "28px"
                        : props.heroImage.styles.borderRadius,
                  }}
                >
                  <Image
                    image={resolvedHeroImage}
                    className="h-full w-full"
                    style={{
                      display: "block",
                      height: "100%",
                      objectFit:
                        props.heroImage.imageConstrain === "filled"
                          ? "cover"
                          : "contain",
                      width: "100%",
                    }}
                  />
                </div>
                </EntityField>
              </div>
            ) : null}
          </div>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceHero: YextComponentConfig<CommunityFinanceHeroProps> =
  {
    label: msg("components.hero", "Hero"),
    fields: CommunityFinanceHeroFields,
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
      heading: {
        text: {
          field: "name",
          constantValue: {
            defaultValue: "[[name]] - [[geomodifier]] [[address.city]]",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: false,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "[[name]] - [[geomodifier]] [[address.city]] provides wealth management, retirement planning, and financial advisory services for individuals, families, and business owners across the [[address.city]] metro area.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      primaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              ctaType: "textAndLink",
              label: {
                defaultValue: "Schedule Consultation",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
            },
            constantValueEnabled: true,
            selectedType: "textAndLink",
          },
          openInNewTab: false,
        },
        styles: {
          variant: "primary",
          color: {
            selectedColor: "palette-primary",
            contrastingColor: "palette-primary-contrast",
          },
          button: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            borderRadius: "default",
          },
        },
      },
      secondaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              ctaType: "textAndLink",
              label: {
                defaultValue: "Get Directions",
              },
              link: {
                defaultValue:
                  "https://www.google.com/maps/search/?api=1&query=1111%20S%20Tryon%20St%2C%20Suite%201600%2C%20[[address.city]]%2C%20NC%2028203",
              },
              linkType: "URL",
            },
            constantValueEnabled: true,
            selectedType: "textAndLink",
          },
          openInNewTab: false,
        },
        styles: {
          variant: "link",
          color: {
            selectedColor: "default",
            contrastingColor: "black",
          },
          link: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            includeCaret: "default",
          },
        },
      },
      heroImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg",
            width: 1900,
            height: 1267,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      } as YextEntityField<HoursType>,
      hoursStyles: {
        showCurrentStatus: true,
        timeFormat: "12h",
        dayOfWeekFormat: "long",
        showDayNames: true,
      },
      statusPill: {
        backgroundColor: {
          selectedColor: "palette-primary-light",
          contrastingColor: "black",
        },
      },
    },
    render: CommunityFinanceHeroComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceHero",
  displayName: "Hero",
  description: "Hero",
  pageSetTypes: ["ENTITY"],
};
