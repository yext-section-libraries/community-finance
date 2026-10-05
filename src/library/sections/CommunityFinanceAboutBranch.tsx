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
  getSurfaceColorStyle,
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
  FINANCE_SECTION_MAX_WIDTH,
  financeSectionStylesFields,
  hasImageSource,
  renderRichText,
  type FinanceSectionStyles,
} from "../shared/sectionHelpers";

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

type BranchImage = {
  image: YextEntityField<ImageType>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles: StyledImageValue;
};

type CommunityFinanceAboutBranchProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  eyebrow: Eyebrow;
  heading: StyledHeading;
  body: StyledBody;
  primaryCta: ComprehensiveCTAValue;
  branchImage: BranchImage;
};

const CommunityFinanceAboutBranchFields: YextFields<CommunityFinanceAboutBranchProps> =
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
    branchImage: {
      label: msg("fields.branchImage", "Branch Image"),
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
  };

const CommunityFinanceAboutBranchComponent: PuckComponent<
  CommunityFinanceAboutBranchProps
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
    props.branchImage.image,
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
      name={`CommunityFinanceAboutBranch${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-about-branch border-t border-current/10"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            paddingBlock,
          }}
        >
          <div
            className={`mx-auto grid gap-10 px-5 md:px-8 ${
              hasImage
                ? "lg:grid-cols-[minmax(0,1fr)_540px] lg:items-center"
                : ""
            }`}
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            <div
              className={`order-2 lg:order-1 ${hasImage ? "" : "max-w-[560px]"}`}
            >
              <EntityField
                displayName="Eyebrow"
                fieldId={props.eyebrow.text.field}
                constantValueEnabled={props.eyebrow.text.constantValueEnabled}
              >
                <Background
                  background={props.eyebrow.backgroundColor}
                  className="mb-3 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold"
                  style={{
                    ...getSurfaceColorStyle(
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
                displayName="Body"
                fieldId={props.body.text.field}
                constantValueEnabled={props.body.text.constantValueEnabled}
              >
                <div
                className="mt-5 grid gap-4"
                style={{
                  fontFamily: "var(--fontFamily-body-fontFamily)",
                  fontSize:
                    props.body.styles.fontSize === "default"
                      ? "1.125rem"
                      : props.body.styles.fontSize,
                  fontWeight:
                    props.body.styles.fontWeight === "default"
                      ? undefined
                      : props.body.styles.fontWeight,
                  fontStyle:
                    props.body.styles.fontStyle === "default"
                      ? undefined
                      : props.body.styles.fontStyle,
                  lineHeight: 1.75,
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
                  className="mt-8"
                />
              </EntityField>
            </div>
            {hasImage ? (
              <div className="order-1 lg:order-2">
                <EntityField
                  displayName="Branch Image"
                  fieldId={props.branchImage.image.field}
                  constantValueEnabled={
                    props.branchImage.image.constantValueEnabled
                  }>
                <div
                  className="overflow-hidden rounded-image-borderRadius"
                  style={{
                    aspectRatio:
                      props.branchImage.aspectRatio > 0
                        ? props.branchImage.aspectRatio
                        : 16 / 9,
                    borderRadius:
                      props.branchImage.styles.borderRadius === "default"
                        ? undefined
                        : props.branchImage.styles.borderRadius,
                  }}
                >
                  <Image
                    image={resolvedImage}
                    className="h-full w-full"
                    style={{
                      display: "block",
                      height: "100%",
                      objectFit:
                        props.branchImage.imageConstrain === "filled"
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

export const CommunityFinanceAboutBranch: YextComponentConfig<CommunityFinanceAboutBranchProps> =
  {
    label: msg("components.aboutBranch", "About Branch Section"),
    fields: CommunityFinanceAboutBranchFields,
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
            en: "About This Branch",
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
              "[[name]] - [[geomodifier]] [[address.city]] is located near [[geomodifier]] [[address.city]] and supports clients across [[address.region]].\n\nThe office provides in-person and virtual financial planning conversations for individuals, families, retirees, and business owners looking for guidance around long-term financial goals.\n\nThe office includes private consultation rooms, multilingual support, and online scheduling for added flexibility. Saturday hours are available for select appointment types.",
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
                defaultValue: "Book Appointment",
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
      branchImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.8,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
    },
    render: CommunityFinanceAboutBranchComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceAboutBranch",
  displayName: "About Branch Section",
  description: "About Branch",
  pageSetTypes: ["ENTITY"],
};
