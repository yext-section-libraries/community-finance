import {
  getFinanceCtaValue,
  getFinanceSurfaceColorStyle,
  getFinanceTextThemeColor,
  getSurfaceTextColor,
} from "../shared/sectionHelpers";
import "../shared/typography.css";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, type ImageType } from "@yext/pages-components";
import {
  msg,
  Background,
  ComprehensiveCTA,
  createItemSource,
  EntityField,
  Heading,
  Image,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getThemeColorCssValue,
  type ComprehensiveCTAValue,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type EnhancedTranslatableCTA,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  resolveComponentData,
  useDocument,
  type StreamDocument,
} from "@yext/visual-editor";
import {
  hasImageSource,
  renderRichText,
} from "../shared/sectionHelpers";
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

type StyledHeading = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type Eyebrow = StyledHeading & {
  backgroundColor: ThemeColor;
};

type StyledBody = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type ServiceCardFields = {
  title: YextEntityField<TranslatableString>;
  description: YextEntityField<TranslatableRichText>;
  cta: YextEntityField<EnhancedTranslatableCTA>;
  image: YextEntityField<ImageType>;
};

const createServiceDefaultValue = (
  title: string,
  description: string,
  ctaLabel: string,
  imageUrl: string,
): ServiceCardFields => ({
  title: {
    field: "",
    constantValue: { defaultValue: title, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  description: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(description),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  cta: {
    field: "",
    constantValue: {
      ctaType: "textAndLink",
      label: { defaultValue: ctaLabel },
      link: { defaultValue: "#" },
      linkType: "URL",
    },
    constantValueEnabled: true,
  },
  image: {
    field: "",
    constantValue: { url: imageUrl, width: 1267, height: 1900 },
    constantValueEnabled: true,
  },
});

const serviceCardsSource = createItemSource<ServiceCardFields>({
  label: msg("fields.services", "Services"),
  mappingFields: {
    title: {
      label: msg("fields.title", "Title"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    description: {
      label: msg("fields.description", "Description"),
      type: "entityField",
      filter: { types: ["type.rich_text_v2"] },
    },
    cta: {
      label: msg("fields.cta", "CTA"),
      type: "entityField",
      filter: { types: ["type.cta"] },
    },
    image: {
      label: msg("fields.image", "Image"),
      type: "entityField",
      filter: { types: ["type.image"] },
    },
  },
  defaultValues: [
    createServiceDefaultValue(
      "Wealth Management",
      "Portfolio oversight and account review support for clients seeking ongoing guidance.",
      "Schedule a Wealth Review",
      "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
    ),
    createServiceDefaultValue(
      "Retirement Planning",
      "Planning conversations for retirement timelines, income needs, and account coordination.",
      "Book a Retirement Consultation",
      "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
    ),
    createServiceDefaultValue(
      "Investment Management",
      "Ongoing investment strategy support based on client objectives and risk considerations.",
      "Request an Investment Review",
      "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
    ),
    createServiceDefaultValue(
      "Financial Planning",
      "Goal-based planning conversations covering cash flow, savings, and long-term priorities.",
      "Speak With an Advisor",
      "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
    ),
    createServiceDefaultValue(
      "Portfolio Reviews",
      "Periodic review meetings for existing clients who want to revisit account structure and goals.",
      "Request a Portfolio Review",
      "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
    ),
  ],
});

type ServiceCardStyles = {
  title: Omit<StyledHeading, "text">;
  description: Omit<StyledBody, "text">;
  cta: ComprehensiveCTAValue["styles"];
  image: {
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles: StyledImageValue;
  };
};

type CommunityFinanceFeaturedServicesProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  eyebrow: Eyebrow;
  heading: StyledHeading;
  description: StyledBody;
  sectionCta: ComprehensiveCTAValue;
  cardBackgroundColor: ThemeColor;
  services: {
    data: typeof serviceCardsSource.value;
    styles: ServiceCardStyles;
  };
};

const CommunityFinanceFeaturedServicesFields: YextFields<CommunityFinanceFeaturedServicesProps> =
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
    eyebrow: {
      label: msg("fields.eyebrow", "Eyebrow"),
      type: "object",
      objectFields: {
        text: {
          label: msg("fields.text", "Text"),
          type: "entityField",
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
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
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
        styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    description: {
      label: msg("fields.description", "Description"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    sectionCta: {
      label: msg("fields.sectionCta", "Section CTA"),
      type: "comprehensiveCTA",
    },
    cardBackgroundColor: {
      label: msg("fields.cardBackgroundColor", "Card Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    services: {
      label: msg("fields.services", "Services"),
      type: "object",
      objectFields: {
        data: serviceCardsSource.field,
        styles: {
          label: msg("fields.serviceStyles", "Service Styles"),
          type: "object",
          objectFields: {
            title: {
              label: msg("fields.title", "Title"),
              type: "object",
              objectFields: {
                styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
                fontColor: {
                  label: msg("fields.fontColor", "Font Color"),
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
              },
            },
            description: {
              label: msg("fields.description", "Description"),
              type: "object",
              objectFields: {
                styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
                fontColor: {
                  label: msg("fields.fontColor", "Font Color"),
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
              },
            },
            cta: {
              label: msg("fields.ctaStyles", "CTA Styles"),
              type: "object",
              objectFields: {
                variant: {
                  label: msg("fields.variant", "Variant"),
                  type: "select",
                  options: [
                    { label: msg("fields.options.link", "Link"), value: "link" },
                    { label: msg("fields.options.primary", "Primary"), value: "primary" },
                    { label: msg("fields.options.secondary", "Secondary"), value: "secondary" },
                  ],
                },
                color: {
                  label: msg("fields.color", "Color"),
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
                link: { label: msg("fields.linkStyles", "Link Styles"), type: "styledLink" },
              },
            },
            image: {
              label: msg("fields.image", "Image"),
              type: "object",
              objectFields: {
                aspectRatio: { label: msg("fields.aspectRatio", "Aspect Ratio"), type: "number" },
                imageConstrain: {
                  label: msg("fields.imageConstrain", "Image Constrain"),
                  type: "select",
                  options: [
                    { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
                    { label: msg("fields.options.filled", "Filled"), value: "filled" },
                  ],
                },
                styles: { label: msg("fields.imageStyles", "Image Styles"), type: "styledImage" },
              },
            },
          },
        },
      },
    },
  };

const ServiceImage = ({
  image,
  styles,
}: {
  image: ImageType | undefined;
  styles: ServiceCardStyles["image"];
}) => {
  if (!hasImageSource(image)) {
    return null;
  }

  return (
    <div
      className="overflow-hidden rounded-image-borderRadius"
      style={{
        aspectRatio: styles.aspectRatio > 0 ? styles.aspectRatio : 16 / 9,
        borderRadius:
          styles.styles.borderRadius === "default"
            ? undefined
            : styles.styles.borderRadius,
      }}
    >
      <Image
        image={image}
        className="h-full w-full"
        style={{
          display: "block",
          height: "100%",
          objectFit: styles.imageConstrain === "filled" ? "cover" : "contain",
          width: "100%",
        }}
      />
    </div>
  );
};

const CommunityFinanceFeaturedServicesComponent: PuckComponent<
  CommunityFinanceFeaturedServicesProps
> = (props) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const resolvedEyebrow =
    resolveComponentData(props.eyebrow.text, locale, streamDocument) || "";
  const resolvedDescription = resolveComponentData(
    props.description.text,
    locale,
    streamDocument,
  );
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? "var(--padding-pageSection-verticalPadding)"
      : props.section.styles.verticalPadding;
  const eyebrowColor = getThemeColorCssValue(
    props.eyebrow.fontColor?.selectedColor,
  );
  const resolvedServices = serviceCardsSource.resolveItems(
    props.services.data,
    streamDocument,
  );
  const hasAnyImages = resolvedServices.some((service) =>
    hasImageSource(service.image),
  );

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceFeaturedServices${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-featured-services"
          style={{
            ...getFinanceSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            paddingBlock,
          }}
        >
          <div
            className="mx-auto px-5 md:px-8"
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="max-w-[860px]">
                <EntityField
                  displayName="Eyebrow"
                  fieldId={props.eyebrow.text.field}
                  constantValueEnabled={props.eyebrow.text.constantValueEnabled}
                >
                  <Background
                    background={props.eyebrow.backgroundColor}
                    className="mb-3 inline-flex items-center rounded-full px-3 py-1.5"
                    style={{
                      ...getFinanceSurfaceColorStyle(
                        props.eyebrow.backgroundColor,
                        streamDocument,
                      ),
                      fontFamily:
                        props.eyebrow.styles.fontFamily === "default"
                          ? undefined
                          : props.eyebrow.styles.fontFamily,
                      fontSize:
                        props.eyebrow.styles.fontSize === "default"
                          ? undefined
                          : props.eyebrow.styles.fontSize,
                      fontWeight:
                        props.eyebrow.styles.fontWeight === "default"
                          ? undefined
                          : props.eyebrow.styles.fontWeight,
                      fontStyle:
                        props.eyebrow.styles.fontStyle === "default"
                          ? undefined
                          : props.eyebrow.styles.fontStyle,
                      textTransform:
                        props.eyebrow.styles.textTransform === "default"
                          ? undefined
                          : props.eyebrow.styles.textTransform,
                      ...(eyebrowColor ? { color: eyebrowColor } : {}),
                    }}
                  >
                    {resolvedEyebrow}
                  </Background>
                </EntityField>
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <Heading
                    level={2}
                    color={getFinanceTextThemeColor(
                      props.heading.fontColor,
                      props.section.backgroundColor,
                      streamDocument,
                    )}
                    className="m-0"
                    style={{
                      fontFamily:
                        props.heading.styles.fontFamily === "default"
                          ? "var(--fontFamily-h2-fontFamily)"
                          : props.heading.styles.fontFamily,
                      fontSize:
                        props.heading.styles.fontSize === "default"
                          ? "var(--fontSize-h2-fontSize)"
                          : props.heading.styles.fontSize,
                      fontWeight:
                        props.heading.styles.fontWeight === "default"
                          ? "var(--fontWeight-h2-fontWeight)"
                          : props.heading.styles.fontWeight,
                      fontStyle:
                        props.heading.styles.fontStyle === "default"
                          ? undefined
                          : props.heading.styles.fontStyle,
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
                  displayName="Description"
                  fieldId={props.description.text.field}
                  constantValueEnabled={
                    props.description.text.constantValueEnabled
                  }
                >
                  <div className="mt-3">
                    {renderRichText(resolvedDescription, {
                      ...props.description.styles,
                      color: getSurfaceTextColor(
                        props.description.fontColor,
                        props.section.backgroundColor,
                        streamDocument,
                      ),
                    })}
                  </div>
                </EntityField>
              </div>
              <EntityField
                displayName="Section CTA"
                fieldId={props.sectionCta.data.cta.field}
                constantValueEnabled={
                  props.sectionCta.data.cta.constantValueEnabled
                }
              >
                <ComprehensiveCTA
                  value={getFinanceCtaValue(
                    props.sectionCta as Partial<ComprehensiveCTAValue>,
                    props.section.backgroundColor,
                    streamDocument,
                  )}
                  eventName="primaryCta"
                />
              </EntityField>
            </div>
            <EntityField
              displayName="Services"
              fieldId={props.services.data.field}
              constantValueEnabled={props.services.data.constantValueEnabled}
            >
              <div className="mt-10 flex gap-5 overflow-x-auto pb-3">
                {resolvedServices.map((service, index) => {
                  const resolvedServiceTitle = service.title
                    ? resolveComponentData(
                        service.title,
                        locale,
                        streamDocument,
                      ) || ""
                    : "";
                  const resolvedServiceDescription = service.description
                    ? resolveComponentData(
                        service.description,
                        locale,
                        streamDocument,
                      )
                    : undefined;
                  const serviceTitleColor = getThemeColorCssValue(
                    props.services.styles.title.fontColor?.selectedColor,
                  );
                  const serviceCtaVariant = props.services.styles.cta.variant;
                  const hasServiceImage = hasImageSource(service.image);
                  const serviceCtaValue:
                    Partial<ComprehensiveCTAValue> | undefined = service.cta
                    ? {
                        data: {
                          actionType: "link",
                          cta: {
                            field: "",
                            constantValue: service.cta,
                            constantValueEnabled: true,
                            selectedType: service.cta.ctaType,
                          },
                          openInNewTab: false,
                        },
                        styles: props.services.styles.cta,
                      }
                    : undefined;

                  return (
                    <Background
                      key={`${resolvedServiceTitle}-${index}`}
                      className="min-w-[280px] overflow-hidden rounded-image-borderRadius md:min-w-[320px]"
                      background={props.cardBackgroundColor}
                      style={getFinanceSurfaceColorStyle(
                        props.cardBackgroundColor,
                        streamDocument,
                      )}
                    >
                      {hasAnyImages ? (
                        hasServiceImage ? (
                          <ServiceImage
                            image={service.image}
                            styles={props.services.styles.image}
                          />
                        ) : (
                          <div
                            style={{
                              aspectRatio:
                                props.services.styles.image.aspectRatio > 0
                                  ? props.services.styles.image.aspectRatio
                                  : 16 / 9,
                            }}
                          />
                        )
                      ) : null}
                      <div className="flex h-full flex-col p-5">
                        <h3
                          className="m-0"
                          style={{
                            color: serviceTitleColor,
                            fontFamily:
                              props.services.styles.title.styles.fontFamily ===
                              "default"
                                ? undefined
                                : props.services.styles.title.styles.fontFamily,
                            fontSize:
                              props.services.styles.title.styles.fontSize ===
                              "default"
                                ? undefined
                                : props.services.styles.title.styles.fontSize,
                            fontWeight:
                              props.services.styles.title.styles.fontWeight ===
                              "default"
                                ? undefined
                                : props.services.styles.title.styles.fontWeight,
                            fontStyle:
                              props.services.styles.title.styles.fontStyle ===
                              "default"
                                ? undefined
                                : props.services.styles.title.styles.fontStyle,
                            textTransform:
                              props.services.styles.title.styles
                                .textTransform === "default"
                                ? undefined
                                : props.services.styles.title.styles
                                    .textTransform,
                          }}
                        >
                          {resolvedServiceTitle}
                        </h3>
                        <div className="mt-3">
                          {renderRichText(resolvedServiceDescription, {
                            ...props.services.styles.description.styles,
                            color: getSurfaceTextColor(
                              props.services.styles.description.fontColor,
                              props.cardBackgroundColor,
                              streamDocument,
                            ),
                          })}
                        </div>
                        {serviceCtaValue ? (
                          <ComprehensiveCTA
                            value={getFinanceCtaValue(
                              serviceCtaValue,
                              props.cardBackgroundColor,
                              streamDocument,
                            )}
                            eventName={`cardLink${index}`}
                            className={
                              serviceCtaVariant === "link"
                                ? "mt-5 "
                                : "mt-5 inline-flex items-center justify-center px-5 py-3"
                            }
                          />
                        ) : null}
                      </div>
                    </Background>
                  );
                })}
              </div>
            </EntityField>
          </div>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceFeaturedServices: YextComponentConfig<CommunityFinanceFeaturedServicesProps> =
  {
    label: msg("components.featuredServices", "Featured Services Section"),
    fields: CommunityFinanceFeaturedServicesFields,
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
      eyebrow: {
        text: {
          field: "",
          constantValue: {
            en: "Featured Services",
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
        backgroundColor: {
          selectedColor: "palette-primary-light",
          contrastingColor: "black",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Financial Guidance for Every Milestone",
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
      description: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Explore the advisory services available at [[name]] - [[geomodifier]] [[address.city]].",
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
      sectionCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              ctaType: "textAndLink",
              label: {
                defaultValue: "Explore Services",
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
      cardBackgroundColor: {
        selectedColor: "palette-primary-light",
        contrastingColor: "black",
      },
      services: {
        data: serviceCardsSource.defaultValue,
        styles: {
          title: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
          description: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
          cta: {
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
          image: {
            aspectRatio: 1.8,
            imageConstrain: "filled",
            styles: { borderRadius: "default" },
          },
        },
      },
    },
    render: CommunityFinanceFeaturedServicesComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceFeaturedServices",
  displayName: "Featured Services Section",
  description: "Featured Services",
  pageSetTypes: ["ENTITY"],
};
