import {
  getFinanceSurfaceColorStyle,
  getFinanceTextThemeColor,
  getSurfaceTextColor,
} from "../shared/sectionHelpers";
import "../shared/typography.css";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  msg,
  Background,
  createItemSource,
  EntityField,
  Heading,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getThemeColorCssValue,
  resolveComponentData,
  useDocument,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { renderRichText } from "../shared/sectionHelpers";
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
  label: msg("fields.faqs", "FAQs"),
  mappingFields: {
    question: {
      label: msg("fields.question", "Question"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    answer: {
      label: msg("fields.answer", "Answer"),
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
    rowBackgroundColor: {
      label: msg("fields.rowBackgroundColor", "Row Background Color"),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    faqs: {
      label: msg("fields.faqs", "FAQs"),
      type: "object",
      objectFields: {
        data: faqSource.field,
        styles: {
          label: msg("fields.faqStyles", "FAQ Styles"),
          type: "object",
          objectFields: {
            question: {
              label: msg("fields.question", "Question"),
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
            answer: {
              label: msg("fields.answer", "Answer"),
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
          },
        },
      },
    },
  };

const CommunityFinanceFaqComponent: PuckComponent<
  CommunityFinanceFaqProps
> = (props) => {
  const analytics = useAnalytics();
  const { i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const [openIndex, setOpenIndex] = React.useState(0);
  const resolvedFaqs = faqSource.resolveItems(props.faqs.data, streamDocument);
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? "var(--padding-pageSection-verticalPadding)"
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
            <div className="mx-auto max-w-[780px] text-center">
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
                    ? resolveComponentData(faq.answer, locale, streamDocument)
                    : undefined;
                  const isOpen = openIndex === index;
                  const questionColor = getThemeColorCssValue(
                    props.faqs.styles.question.fontColor?.selectedColor,
                  );

                  return (
                    <Background
                      key={`${resolvedQuestion}-${index}`}
                      background={props.rowBackgroundColor}
                      className="rounded-image-borderRadius px-5 py-4"
                      style={getFinanceSurfaceColorStyle(
                        props.rowBackgroundColor,
                        streamDocument,
                      )}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-5 text-left text-inherit"
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
                        <div className="mt-4 max-w-[880px]">
                          {renderRichText(resolvedAnswer, {
                            ...props.faqs.styles.answer.styles,
                            color: getSurfaceTextColor(
                              props.faqs.styles.answer.fontColor,
                              props.rowBackgroundColor,
                              streamDocument,
                            ),
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
    label: msg("components.faq", "FAQ"),
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
