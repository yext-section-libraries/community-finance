import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  Background,
  createItemSource,
  EntityField,
  Heading,
  MaybeRTF,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getThemeColorCssValue,
  resolveComponentData,
  useDocument,
  type RichText,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { Minus, Plus } from "lucide-react";
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

type FaqItemFields = {
  question: YextEntityField<TranslatableString>;
  answer: YextEntityField<TranslatableRichText>;
};

const createFaqDefaultValue = (
  question: string,
  answer: string,
): FaqItemFields => ({
  question: {
    field: "",
    constantValue: { defaultValue: question, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  answer: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(answer),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
});

const faqSource = createItemSource<FaqItemFields>({
  label: "FAQs",
  mappingFields: {
    question: {
      label: "Question",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    answer: {
      label: "Answer",
      type: "entityField",
      filter: { types: ["type.rich_text_v2"] },
    },
  },
  defaultValues: [
    createFaqDefaultValue(
      "Do I need an appointment to visit this office?",
      "Appointments are recommended for financial planning and advisory meetings, but clients can still stop by during lobby hours for basic banking support or questions.",
    ),
    createFaqDefaultValue(
      "Is parking available nearby?",
      "Yes. Visitor parking is available in the attached garage at [[address.line1]], and additional street parking is available throughout [[geomodifier]] [[address.city]].",
    ),
    createFaqDefaultValue(
      "Can I meet with an advisor virtually?",
      "Yes. Advisors at this location offer both in-person and virtual meetings depending on your preferences and scheduling needs.",
    ),
    createFaqDefaultValue(
      "What languages are supported at this office?",
      "This location offers support in English, Spanish, Chinese, and French.",
    ),
    createFaqDefaultValue(
      "Is this office accessible by public transit?",
      "Yes. The office is a short walk from the light rail stop and several bus routes.",
    ),
  ],
});

type CommunityFinanceFaqProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  heading: StyledHeading;
  rowBackgroundColor: ThemeColor;
  faqs: {
    data: typeof faqSource.value;
    styles: {
      question: Omit<StyledHeading, "text">;
      answer: {
        styles: StyledTextValue;
        fontColor?: ThemeColor;
      };
    };
  };
};

const CommunityFinanceFaqFields: YextFields<CommunityFinanceFaqProps> =
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
    rowBackgroundColor: {
      label: "Row Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    faqs: {
      label: "FAQs",
      type: "object",
      objectFields: {
        data: faqSource.field,
        styles: {
          label: "FAQ Styles",
          type: "object",
          objectFields: {
            question: {
              label: "Question",
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
            answer: {
              label: "Answer",
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

const CommunityFinanceFaqComponent: PuckComponent<
  CommunityFinanceFaqProps
> = (props) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const [openIndex, setOpenIndex] = React.useState(0);
  const resolvedFaqs = faqSource.resolveItems(props.faqs.data, streamDocument);
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceFaq${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-faq border-t border-current/10"
          style={{ paddingBlock }}
        >
          <style>{`
            .yext-community-finance-faq p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-faq li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-faq h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-faq h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-faq h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-faq h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-faq h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-faq h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-faq a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }
          `}</style>
          <div
            className="mx-auto px-5 py-16 md:px-8"
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            <div className="mx-auto max-w-[780px] text-center">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <Heading
                  level={2}
                  color={props.heading.fontColor}
                  className="m-0 text-balance"
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
            </div>
            <EntityField
              displayName="FAQs"
              fieldId={props.faqs.data.field}
              constantValueEnabled={props.faqs.data.constantValueEnabled}
            >
              <div className="mx-auto mt-8 grid max-w-[1100px] gap-3">
                {resolvedFaqs.map((faq, index) => {
                  const resolvedQuestion = faq.question
                    ? resolveComponentData(
                        faq.question,
                        locale,
                        streamDocument,
                      ) || ""
                    : "";
                  const resolvedAnswer = faq.answer
                    ? resolveComponentData(faq.answer, locale, streamDocument, {
                        richTextStyleOverrides: {
                          ...props.faqs.styles.answer.styles,
                          color: props.faqs.styles.answer.fontColor,
                        },
                      })
                    : undefined;
                  const isOpen = openIndex === index;
                  const questionColor = getThemeColorCssValue(
                    props.faqs.styles.question.fontColor?.selectedColor,
                  );

                  return (
                    <Background
                      key={`${resolvedQuestion}-${index}`}
                      background={props.rowBackgroundColor}
                      className="rounded-[20px] px-5 py-4"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-5 text-left text-base font-bold text-inherit"
                        onClick={() => {
                          const nextIsOpen = !isOpen;
                          setOpenIndex(nextIsOpen ? index : -1);
                          void analytics?.track({
                            action: nextIsOpen ? "EXPAND" : "COLLAPSE",
                            eventName: `toggle${index}`,
                          });
                        }}
                      >
                        <span
                          style={{
                            color: questionColor,
                            fontFamily:
                              props.faqs.styles.question.styles.fontFamily ===
                              "default"
                                ? undefined
                                : props.faqs.styles.question.styles.fontFamily,
                            fontSize:
                              props.faqs.styles.question.styles.fontSize ===
                              "default"
                                ? undefined
                                : props.faqs.styles.question.styles.fontSize,
                            fontWeight:
                              props.faqs.styles.question.styles.fontWeight ===
                              "default"
                                ? undefined
                                : props.faqs.styles.question.styles.fontWeight,
                            fontStyle:
                              props.faqs.styles.question.styles.fontStyle ===
                              "default"
                                ? undefined
                                : props.faqs.styles.question.styles.fontStyle,
                            textTransform:
                              props.faqs.styles.question.styles
                                .textTransform === "default"
                                ? undefined
                                : props.faqs.styles.question.styles
                                    .textTransform,
                          }}
                        >
                          {resolvedQuestion}
                        </span>
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      {isOpen ? (
                        <div className="mt-4 max-w-[880px] text-sm leading-7">
                          {renderRichText(resolvedAnswer, {
                            ...props.faqs.styles.answer.styles,
                            color: props.faqs.styles.answer.fontColor,
                          })}
                        </div>
                      ) : null}
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

export const CommunityFinanceFaq: YextComponentConfig<CommunityFinanceFaqProps> =
  {
    label: "FAQ",
    fields: CommunityFinanceFaqFields,
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
            defaultValue: "Frequently Asked Questions",
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
      rowBackgroundColor: {
        selectedColor: "palette-primary-light",
        contrastingColor: "black",
      },
      faqs: {
        data: faqSource.defaultValue,
        styles: {
          question: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
          answer: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
        },
      },
    },
    render: CommunityFinanceFaqComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceFaq",
  displayName: "FAQ",
  description: "FAQ",
  pageSetTypes: ["ENTITY"],
};
