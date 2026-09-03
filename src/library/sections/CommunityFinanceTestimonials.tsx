import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  useAnalytics,
} from "@yext/pages-components";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import {
  Background,
  Body,
  EntityField,
  Heading,
  MaybeRTF,
  ReviewStars,
  VisibilityWrapper,
  getAggregateRating,
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
import { ChevronLeft, ChevronRight } from "lucide-react";
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

type CommunityFinanceTestimonialsProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  eyebrow: Eyebrow;
  heading: StyledHeading;
  description: StyledBody;
  slideBackgroundColor: ThemeColor;
};

const CommunityFinanceTestimonialsFields: YextFields<CommunityFinanceTestimonialsProps> =
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
    slideBackgroundColor: {
      label: "Slide Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
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

const CommunityFinanceTestimonialsComponent: PuckComponent<
  CommunityFinanceTestimonialsProps
> = (props) => {
  const analytics = useAnalytics();
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
  const liveReviews =
    streamDocument.ref_reviewsAgg?.find(
      (agg: { publisher?: string; topReviews?: unknown[] }) =>
        agg.publisher === "FIRSTPARTY",
    )?.topReviews ?? [];
  const aggregateRating = getAggregateRating(streamDocument);
  const reviewItems =
    liveReviews.length > 0
      ? liveReviews.map(
          (review: {
            authorName?: string;
            content?: string;
            rating?: number;
          }) => ({
            authorName: review.authorName ?? "Verified Client",
            authorRole: "First-party review",
            quote: review.content ?? "",
            rating: review.rating,
          }),
        )
      : [];
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeTestimonial = reviewItems[activeIndex] ?? reviewItems[0];
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;
  const eyebrowColor = getThemeColorCssValue(
    props.eyebrow.fontColor?.selectedColor,
  );

  React.useEffect(() => {
    if (activeIndex >= reviewItems.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, reviewItems.length]);

  if (!activeTestimonial || !activeTestimonial.quote) {
    if (!props.puck.isEditing) {
      return <></>;
    }

    return <></>;
  }

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceTestimonials${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-testimonials border-t border-current/10"
          style={{ paddingBlock }}
        >
          <style>{`
            .yext-community-finance-testimonials p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-testimonials li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-testimonials h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-testimonials h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-testimonials h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-testimonials h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-testimonials h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-testimonials h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-testimonials a {
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
            <div className="max-w-[780px]">
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
                <div className="mt-3 max-w-[620px] text-base leading-7">
                {renderRichText(resolvedDescription, {
                  ...props.description.styles,
                  color: props.description.fontColor,
                })}
              </div>
              </EntityField>
              {liveReviews.length > 0 ? (
                <ReviewStars
                  averageRating={aggregateRating.averageRating}
                  reviewCount={aggregateRating.reviewCount}
                  className="mt-5"
                />
              ) : null}
            </div>
            <Background
              background={props.slideBackgroundColor}
              className="mt-8 overflow-hidden rounded-[28px] px-6 py-10 text-center md:px-10"
            >
              <p className="mx-auto max-w-[1210px] text-[1.9rem] font-bold leading-tight md:text-[2.4rem]">
                {activeTestimonial.quote}
              </p>
              <div className="mt-6 flex flex-col items-center gap-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <h3 className="m-0 text-base font-bold">
                    {activeTestimonial.authorName}
                  </h3>
                  <p className="m-0 text-sm">{activeTestimonial.authorRole}</p>
                </div>
                {typeof activeTestimonial.rating === "number" ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-0.5" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, index) =>
                        activeTestimonial.rating - index >= 0.75 ? (
                          <FaStar key={index} />
                        ) : activeTestimonial.rating - index >= 0.25 ? (
                          <FaStarHalfAlt key={index} />
                        ) : (
                          <FaRegStar key={index} />
                        )
                      )}
                    </div>
                    <Body variant="sm" className="m-0 font-medium">
                      {activeTestimonial.rating}/5 stars
                    </Body>
                  </div>
                ) : null}
              </div>
            </Background>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_12px_36px_rgba(1,22,36,0.1)]"
                onClick={() => {
                  const nextIndex =
                    (activeIndex - 1 + reviewItems.length) %
                    reviewItems.length;
                  setActiveIndex(nextIndex);
                  void analytics?.track({
                    action: "PAGINATE",
                    eventName: "previous",
                  });
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                {reviewItems.map((testimonial: typeof activeTestimonial, index: number) => (
                  <button
                    key={`${testimonial.authorName}-${index}`}
                    type="button"
                    className={`h-2.5 w-2.5 rounded-full ${
                      activeIndex === index
                        ? "bg-[var(--colors-palette-quaternary)]"
                        : "bg-[rgba(1,22,36,0.18)]"
                    }`}
                    onClick={() => {
                      setActiveIndex(index);
                      void analytics?.track({
                        action: "PAGINATE",
                        eventName: `pagination${index}`,
                      });
                    }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_12px_36px_rgba(1,22,36,0.1)]"
                onClick={() => {
                  const nextIndex = (activeIndex + 1) % reviewItems.length;
                  setActiveIndex(nextIndex);
                  void analytics?.track({
                    action: "PAGINATE",
                    eventName: "next",
                  });
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceTestimonials: YextComponentConfig<CommunityFinanceTestimonialsProps> =
  {
    label: "Testimonials",
    fields: CommunityFinanceTestimonialsFields,
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
          constantValue: { en: "Testimonials", hasLocalizedValue: "true" },
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
            defaultValue: "What Our Clients Say",
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
              "Genuine experiences and feedback directly from our clients.",
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
      slideBackgroundColor: {
        selectedColor: "palette-primary-light",
        contrastingColor: "black",
      },
    },
    render: CommunityFinanceTestimonialsComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceTestimonials",
  displayName: "Testimonials",
  description: "Testimonials",
  pageSetTypes: ["ENTITY"],
};
