import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  type ImageType,
} from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  Heading,
  Image,
  MaybeRTF,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getDefaultRTF,
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
  type RichText,
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

type StyledBody = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type LinkItem = {
  cta: ComprehensiveCTAValue;
};

type SectionImage = {
  image: YextEntityField<ImageType>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles: StyledImageValue;
};

type CommunityFinanceBeforeMeetProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  heading: StyledHeading;
  body: StyledBody;
  links: LinkItem[];
  sectionImage: SectionImage;
};

const CommunityFinanceBeforeMeetFields: YextFields<CommunityFinanceBeforeMeetProps> =
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
    body: {
      label: "Body",
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
    links: {
      label: "Links",
      type: "array",
      arrayFields: {
        cta: {
          label: "CTA",
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: {
        cta: {
          data: {
            actionType: "link",
            cta: {
              field: "",
              constantValue: {
                ctaType: "textAndLink",
                label: {
                  defaultValue: "Link",
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
      },
      getItemSummary: (item) => item.cta?.data?.cta?.field || "Disclosure CTA",
    },
    sectionImage: {
      label: "Section Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: { types: ["type.image"] },
        },
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
  };

const renderRichText = (value: unknown, color?: ThemeColor) => {
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
      richTextStyleOverrides={{
        color,
      }}
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

const CommunityFinanceBeforeMeetComponent: PuckComponent<
  CommunityFinanceBeforeMeetProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const resolvedBody = resolveComponentData(
    props.body.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides: {
        ...props.body.styles,
        color: props.body.fontColor,
      },
    },
  );
  const resolvedImage = resolveComponentData(
    props.sectionImage.image,
    locale,
    streamDocument,
  );
  const hasImage = hasImageSource(resolvedImage);
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceBeforeMeet${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-before-meet border-t border-current/10"
          style={{ paddingBlock }}
        >
          <style>{`
            .yext-community-finance-before-meet p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-before-meet li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-before-meet h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-before-meet h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-before-meet h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-before-meet h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-before-meet h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-before-meet h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-before-meet a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }

            .yext-community-finance-before-meet a.components {
              text-decoration: none;
            }

            .yext-community-finance-before-meet a.components:hover {
              text-decoration: underline;
            }
          `}</style>
          <div
            className={`mx-auto grid gap-10 px-5 py-16 md:px-8 ${
              hasImage
                ? "lg:grid-cols-[520px_minmax(0,1fr)] lg:items-center"
                : ""
            }`}
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            {hasImage ? (
              <div>
                <EntityField
                  displayName="Section Image"
                  fieldId={props.sectionImage.image.field}
                  constantValueEnabled={
                    props.sectionImage.image.constantValueEnabled
                  }
                >
                  <div
                  className="overflow-hidden rounded-[28px]"
                  style={{
                    aspectRatio:
                      props.sectionImage.aspectRatio > 0
                        ? props.sectionImage.aspectRatio
                        : 1,
                    borderRadius:
                      props.sectionImage.styles.borderRadius === "default"
                        ? "28px"
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
            <div className={hasImage ? "" : "max-w-[560px]"}>
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}>
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
                className="mt-4"
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
                      ? undefined
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
                {renderRichText(resolvedBody, props.body.fontColor)}
              </div>
              </EntityField>
              <ul className="mt-7 grid gap-3">
                {(props.links ?? []).map((item, index) => (
                  <li key={`link-${index}`}>
                    <EntityField
                      displayName={`Link ${index + 1}`}
                      fieldId={item.cta.data.cta.field}
                      constantValueEnabled={
                        item.cta.data.cta.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        value={item.cta as Partial<ComprehensiveCTAValue>}
                        eventName={`link${index}`}
                        className="p-0 text-sm font-bold text-palette-primary no-underline hover:underline"
                      />
                    </EntityField>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceBeforeMeet: YextComponentConfig<CommunityFinanceBeforeMeetProps> =
  {
    label: "Before Meet",
    fields: CommunityFinanceBeforeMeetFields,
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
          field: "",
          constantValue: {
            defaultValue: "Before You Meet With Us",
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
              "Prospective clients can review advisor credentials, disclosures, and service information before scheduling a consultation. Additional regulatory and advisory disclosures are available through the links below.",
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
      links: [
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  ctaType: "textAndLink",
                  label: {
                    defaultValue: "Advisory disclosures",
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
        },
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  ctaType: "textAndLink",
                  label: {
                    defaultValue: "Regulatory information",
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
        },
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  ctaType: "textAndLink",
                  label: {
                    defaultValue: "Privacy policy",
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
        },
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  ctaType: "textAndLink",
                  label: {
                    defaultValue: "FINRA BrokerCheck",
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
        },
      ],
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
    render: CommunityFinanceBeforeMeetComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceBeforeMeet",
  displayName: "Before Meet",
  description: "Before Meet",
  pageSetTypes: ["ENTITY"],
};
