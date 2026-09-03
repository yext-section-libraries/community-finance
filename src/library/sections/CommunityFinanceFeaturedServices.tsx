import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, type ImageType } from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  createItemSource,
  EntityField,
  Heading,
  Image,
  MaybeRTF,
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
  type RichText,
  resolveComponentData,
  useDocument,
  type StreamDocument,
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
  label: "Services",
  mappingFields: {
    title: {
      label: "Title",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    description: {
      label: "Description",
      type: "entityField",
      filter: { types: ["type.rich_text_v2"] },
    },
    cta: {
      label: "CTA",
      type: "entityField",
      filter: { types: ["type.cta"] },
    },
    image: {
      label: "Image",
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
    eyebrow: {
      label: "Eyebrow",
      type: "object",
      objectFields: {
        text: {
          label: "Text",
          type: "entityField",
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
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.string"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    description: {
      label: "Description",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    sectionCta: {
      label: "Section CTA",
      type: "comprehensiveCTA",
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    services: {
      label: "Services",
      type: "object",
      objectFields: {
        data: serviceCardsSource.field,
        styles: {
          label: "Service Styles",
          type: "object",
          objectFields: {
            title: {
              label: "Title",
              type: "object",
              objectFields: {
                styles: { label: "Text Styles", type: "styledText" },
                fontColor: {
                  label: "Font Color",
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
              },
            },
            description: {
              label: "Description",
              type: "object",
              objectFields: {
                styles: { label: "Text Styles", type: "styledText" },
                fontColor: {
                  label: "Font Color",
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
              },
            },
            cta: {
              label: "CTA Styles",
              type: "object",
              objectFields: {
                variant: {
                  label: "Variant",
                  type: "select",
                  options: [
                    { label: "Link", value: "link" },
                    { label: "Primary", value: "primary" },
                    { label: "Secondary", value: "secondary" },
                  ],
                },
                color: {
                  label: "Color",
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
                link: { label: "Link Styles", type: "styledLink" },
              },
            },
            image: {
              label: "Image",
              type: "object",
              objectFields: {
                aspectRatio: { label: "Aspect Ratio", type: "number" },
                imageConstrain: {
                  label: "Image Constrain",
                  type: "select",
                  options: [
                    { label: "Fixed", value: "fixed" },
                    { label: "Filled", value: "filled" },
                  ],
                },
                styles: { label: "Image Styles", type: "styledImage" },
              },
            },
          },
        },
      },
    },
  };

const renderRichText = (
  value: unknown,
  richTextStyleOverrides?: React.ComponentProps<
    typeof MaybeRTF
  >["richTextStyleOverrides"],
) => {
  if (React.isValidElement(value)) {
    return value;
  }

  const normalizedValue: RichText | string | undefined =
    typeof value === "string"
      ? value
      : typeof value === "object" && value !== null && "html" in value
        ? (value as RichText)
        : undefined;

  return (
    <MaybeRTF
      data={normalizedValue}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
};

const hasImageSource = (image: unknown): image is ImageType => {
  if (!image || typeof image !== "object") {
    return false;
  }

  if ("url" in image && typeof image.url === "string" && image.url.trim()) {
    return true;
  }

  if (
    "image" in image &&
    image.image &&
    typeof image.image === "object" &&
    "url" in image.image &&
    typeof image.image.url === "string" &&
    image.image.url.trim()
  ) {
    return true;
  }

  return false;
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
      className="overflow-hidden"
      style={{
        aspectRatio: styles.aspectRatio > 0 ? styles.aspectRatio : 16 / 9,
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
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const resolvedEyebrow =
    resolveComponentData(props.eyebrow.text, locale, streamDocument) || "";
  const resolvedDescription = resolveComponentData(
    props.description.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides: {
        ...props.description.styles,
        color: props.description.fontColor,
      },
    },
  );
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
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
          style={{ paddingBlock }}
        >
          <style>{`
            .yext-community-finance-featured-services p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-featured-services li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-featured-services h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-featured-services h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-featured-services h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-featured-services h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-featured-services h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-featured-services h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-featured-services a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }

            .yext-community-finance-featured-services a.components {
              text-decoration: none;
            }

            .yext-community-finance-featured-services a.components:hover {
              text-decoration: underline;
            }
          `}</style>
          <div
            className="mx-auto px-5 py-16 md:px-8"
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
                    className="mb-3 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold"
                    style={{
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
                      color: eyebrowColor,
                      lineHeight: 1.2,
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
                    color={props.heading.fontColor}
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
                      lineHeight: 1,
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
                  <div className="mt-3 text-lg leading-7">
                    {renderRichText(resolvedDescription, {
                      ...props.description.styles,
                      color: props.description.fontColor,
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
                  value={props.sectionCta as Partial<ComprehensiveCTAValue>}
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
                        {
                          richTextStyleOverrides: {
                            ...props.services.styles.description.styles,
                            color: props.services.styles.description.fontColor,
                          },
                        },
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
                      className="min-w-[280px] overflow-hidden rounded-[24px] md:min-w-[320px]"
                      background={props.cardBackgroundColor}
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
                          className="m-0 text-[28px] leading-[1.05]"
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
                                ? "700"
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
                        <div className="mt-3 text-sm leading-6">
                          {renderRichText(resolvedServiceDescription, {
                            ...props.services.styles.description.styles,
                            color: props.services.styles.description.fontColor,
                          })}
                        </div>
                        {serviceCtaValue ? (
                          <ComprehensiveCTA
                            value={serviceCtaValue}
                            eventName={`cardLink${index}`}
                            className={
                              serviceCtaVariant === "link"
                                ? "mt-5 p-0 text-sm font-bold no-underline hover:underline"
                                : "mt-5 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold"
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
    label: "Featured Services",
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
  displayName: "Featured Services",
  description: "Featured Services",
  pageSetTypes: ["ENTITY"],
};
