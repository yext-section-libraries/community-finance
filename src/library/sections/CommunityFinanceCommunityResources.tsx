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
import {
  AnalyticsScopeProvider,
  type ImageType,
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
  getThemeColorCssValue,
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

type SectionImage = {
  image: YextEntityField<ImageType>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles: StyledImageValue;
};

type CommunityFinanceCommunityResourcesProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  eyebrow: Eyebrow;
  heading: StyledHeading;
  body: StyledBody;
  primaryCta: ComprehensiveCTAValue;
  sectionImage: SectionImage;
};

const CommunityFinanceCommunityResourcesFields: YextFields<CommunityFinanceCommunityResourcesProps> =
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
    body: {
      label: msg("fields.body", "Body"),
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
    primaryCta: {
      label: msg("fields.primaryCTA", "Primary CTA"),
      type: "comprehensiveCTA",
    },
    sectionImage: {
      label: msg("fields.sectionImage", "Section Image"),
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.image", "Image"),
          filter: { types: ["type.image"] },
        },
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
  };

const CommunityFinanceCommunityResourcesComponent: PuckComponent<
  CommunityFinanceCommunityResourcesProps
> = (props) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const resolvedEyebrow =
    resolveComponentData(props.eyebrow.text, locale, streamDocument) || "";
  const resolvedBody = resolveComponentData(
    props.body.text,
    locale,
    streamDocument,
  );
  const resolvedImage = resolveComponentData(
    props.sectionImage.image,
    locale,
    streamDocument,
  );
  const hasImage = hasImageSource(resolvedImage);
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? "var(--padding-pageSection-verticalPadding)"
      : props.section.styles.verticalPadding;
  const eyebrowColor = getThemeColorCssValue(
    props.eyebrow.fontColor?.selectedColor,
  );

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceCommunityResources${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-community-resources border-t border-current/10"
          style={{
            ...getFinanceSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            paddingBlock,
          }}
        >
          <div
            className={`mx-auto grid gap-10 px-5 md:px-8 ${
              hasImage
                ? "xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center"
                : ""
            }`}
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            <div className="order-2 xl:order-1">
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
                className="m-0 max-w-[720px]"
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
                displayName="Body"
                fieldId={props.body.text.field}
                constantValueEnabled={props.body.text.constantValueEnabled}
              >
                <div
                className="mt-4 max-w-[680px]"
                style={{
                  fontFamily:
                    props.body.styles.fontFamily === "default"
                      ? "var(--fontFamily-body-fontFamily)"
                      : props.body.styles.fontFamily,
                  fontSize:
                    props.body.styles.fontSize === "default"
                      ? "var(--fontSize-body-fontSize)"
                      : props.body.styles.fontSize,
                  fontWeight:
                    props.body.styles.fontWeight === "default"
                      ? undefined
                      : props.body.styles.fontWeight,
                  fontStyle:
                    props.body.styles.fontStyle === "default"
                      ? undefined
                      : props.body.styles.fontStyle,
                  textTransform:
                    props.body.styles.textTransform === "default"
                      ? undefined
                      : props.body.styles.textTransform,
                }}
              >
                {renderRichText(resolvedBody, {
                  ...props.body.styles,
                  color: getSurfaceTextColor(
                    props.body.fontColor,
                    props.section.backgroundColor,
                    streamDocument,
                  ),
                })}
              </div>
              </EntityField>
              <EntityField
                displayName="Primary CTA"
                fieldId={props.primaryCta.data.cta.field}
                constantValueEnabled={
                  props.primaryCta.data.cta.constantValueEnabled
                }
              >
                <ComprehensiveCTA
                  value={getFinanceCtaValue(
                    props.primaryCta as Partial<ComprehensiveCTAValue>,
                    props.section.backgroundColor,
                    streamDocument,
                  )}
                  eventName="primaryCta"
                  className="mt-8"
                />
              </EntityField>
            </div>
            {hasImage ? (
              <div className="order-1 xl:order-2">
                <EntityField
                  displayName="Image"
                  fieldId={props.sectionImage.image.field}
                  constantValueEnabled={
                    props.sectionImage.image.constantValueEnabled
                  }>
                <div
                  className="overflow-hidden rounded-image-borderRadius"
                  style={{
                    aspectRatio:
                      props.sectionImage.aspectRatio > 0
                        ? props.sectionImage.aspectRatio
                        : 16 / 9,
                    borderRadius:
                      props.sectionImage.styles.borderRadius === "default"
                        ? undefined
                        : props.sectionImage.styles.borderRadius,
                  }}
                >
                  <Image
                    image={resolvedImage}
                    className="h-full w-full"
                    style={{
                      display: "block",
                      height: "100%",
                      objectFit:
                        props.sectionImage.imageConstrain === "filled"
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

export const CommunityFinanceCommunityResources: YextComponentConfig<CommunityFinanceCommunityResourcesProps> =
  {
    label: msg("components.communityResources", "Community Resources"),
    fields: CommunityFinanceCommunityResourcesFields,
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
            en: "Client Resources",
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
            defaultValue: "Community & Client Resources",
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
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "[[name]] regularly hosts educational workshops and retirement planning events for [[address.city]]-area residents. Clients can also schedule appointments, review meeting details, and securely manage communications through the [[name]] client portal and mobile app.",
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
                defaultValue: "View Event Calendar",
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
      sectionImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
    },
    render: CommunityFinanceCommunityResourcesComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceCommunityResources",
  displayName: "Community Resources",
  description: "Community Resources",
  pageSetTypes: ["ENTITY"],
};
