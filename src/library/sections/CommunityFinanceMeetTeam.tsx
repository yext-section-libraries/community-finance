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
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
  type EnhancedTranslatableCTA,
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

type Eyebrow = StyledHeading & {
  backgroundColor: ThemeColor;
};

type Section = {
  backgroundColor: ThemeColor;
  styles: FinanceSectionStyles;
  visibleOnLivePage: boolean;
};

type TeamMemberFields = {
  name: YextEntityField<TranslatableString>;
  role: YextEntityField<TranslatableString>;
  credentials: YextEntityField<TranslatableString>;
  licenses: YextEntityField<TranslatableString[]>;
  specialties: YextEntityField<TranslatableRichText>;
  cta: YextEntityField<EnhancedTranslatableCTA>;
  image: YextEntityField<ImageType>;
};

const createTeamMemberDefaultValue = (
  name: string,
  role: string,
  credentials: string,
  licenses: string[],
  specialties: string,
  ctaLink: string,
  imageUrl: string,
): TeamMemberFields => ({
  name: {
    field: "",
    constantValue: { defaultValue: name, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  role: {
    field: "",
    constantValue: { defaultValue: role, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  credentials: {
    field: "",
    constantValue: { defaultValue: credentials, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  licenses: {
    field: "",
    constantValue: licenses,
    constantValueEnabled: true,
  },
  specialties: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(specialties),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  cta: {
    field: "",
    constantValue: {
      ctaType: "textAndLink",
      label: { defaultValue: "Advisor page" },
      link: { defaultValue: ctaLink },
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

const advisorsSource = createItemSource<TeamMemberFields>({
  label: "Advisors",
  mappingFields: {
    name: {
      label: "Name",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    role: {
      label: "Role",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    credentials: {
      label: "Credentials",
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    licenses: {
      label: "Licenses",
      type: "entityField",
      filter: { types: ["type.string"], includeListsOnly: true },
    },
    specialties: {
      label: "Specialties",
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
    createTeamMemberDefaultValue(
      "Morgan Lee",
      "Senior Wealth Advisor",
      "CFP",
      ["Series 7", "Series 66"],
      "Supports retirement planning and portfolio review conversations.",
      "/advisors/morgan-lee",
      "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
    ),
    createTeamMemberDefaultValue(
      "Avery Chen",
      "Financial Planner",
      "ChFC",
      ["Series 65"],
      "Supports financial planning and goal-based discussions.",
      "/advisors/avery-chen",
      "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
    ),
  ],
});

type TeamMemberImageStyles = {
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles: StyledImageValue;
};

type TeamMemberStyles = {
  name: Omit<StyledHeading, "text">;
  role: Omit<StyledHeading, "text">;
  credentials: Omit<StyledHeading, "text">;
  licenses: {
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  specialties: {
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  cta: ComprehensiveCTAValue["styles"];
  image: TeamMemberImageStyles;
};

type CommunityFinanceMeetTeamProps = {
  section: Section;
  eyebrow: Eyebrow;
  heading: StyledHeading;
  cardBackgroundColor: ThemeColor;
  credentialsHeading?: StyledHeading;
  licensesHeading?: StyledHeading;
  specialtiesHeading?: StyledHeading;
  advisors: {
    data: typeof advisorsSource.value;
    styles: TeamMemberStyles;
  };
};

const CommunityFinanceMeetTeamFields: YextFields<CommunityFinanceMeetTeamProps> =
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
      },
    },
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    credentialsHeading: {
      label: "Credentials Heading",
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
      },
    },
    licensesHeading: {
      label: "Licenses Heading",
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
      },
    },
    specialtiesHeading: {
      label: "Specialties Heading",
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
      },
    },
    advisors: {
      label: "Advisors",
      type: "object",
      objectFields: {
        data: advisorsSource.field,
        styles: {
          label: "Advisor Styles",
          type: "object",
          objectFields: {
            name: {
              label: "Name",
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
            role: {
              label: "Role",
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
            credentials: {
              label: "Credentials",
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
            licenses: {
              label: "Licenses",
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
            specialties: {
              label: "Specialties",
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

const CommunityFinanceMeetTeamComponent: PuckComponent<
  CommunityFinanceMeetTeamProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const credentialsHeading = props.credentialsHeading ?? {
    text: {
      field: "",
      constantValue: {
        defaultValue: "Credentials",
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
  };
  const licensesHeading = props.licensesHeading ?? {
    text: {
      field: "",
      constantValue: {
        defaultValue: "Licenses",
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
  };
  const specialtiesHeading = props.specialtiesHeading ?? {
    text: {
      field: "",
      constantValue: {
        defaultValue: "Specialties",
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
  };
  const resolvedEyebrow = resolveComponentData(
    props.eyebrow.text,
    locale,
    streamDocument,
  );
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
  );
  const resolvedCredentialsHeading = resolveComponentData(
    credentialsHeading.text,
    locale,
    streamDocument,
  );
  const resolvedLicensesHeading = resolveComponentData(
    licensesHeading.text,
    locale,
    streamDocument,
  );
  const resolvedSpecialtiesHeading = resolveComponentData(
    specialtiesHeading.text,
    locale,
    streamDocument,
  );
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;
  const eyebrowColor = getThemeColorCssValue(
    props.eyebrow.fontColor?.selectedColor,
  );
  const credentialsHeadingColor = getThemeColorCssValue(
    credentialsHeading.fontColor?.selectedColor,
  );
  const licensesHeadingColor = getThemeColorCssValue(
    licensesHeading.fontColor?.selectedColor,
  );
  const specialtiesHeadingColor = getThemeColorCssValue(
    specialtiesHeading.fontColor?.selectedColor,
  );
  const resolvedAdvisors = advisorsSource.resolveItems(
    props.advisors.data,
    streamDocument,
  );

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceMeetTeam${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <Background
          as="section"
          background={props.section.backgroundColor}
          className="yext-community-finance-meet-team border-t border-current/10"
          style={{ paddingBlock }}
        >
          <style>{`
            .yext-community-finance-meet-team p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-meet-team li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-meet-team h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-meet-team h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-meet-team h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-meet-team h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-meet-team h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-meet-team h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-meet-team a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }

            .yext-community-finance-meet-team a.components {
              text-decoration: none;
            }

            .yext-community-finance-meet-team a.components:hover {
              text-decoration: underline;
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
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {resolvedAdvisors.map((advisor) => {
                const resolvedImage = advisor.image;
                const hasAdvisorImage = hasImageSource(resolvedImage);
                const resolvedName = advisor.name
                  ? resolveComponentData(
                      advisor.name,
                      locale,
                      streamDocument,
                    ) || ""
                  : "";
                const resolvedRole = advisor.role
                  ? resolveComponentData(
                      advisor.role,
                      locale,
                      streamDocument,
                    ) || ""
                  : "";
                const resolvedCredentials = advisor.credentials
                  ? resolveComponentData(
                      advisor.credentials,
                      locale,
                      streamDocument,
                    ) || ""
                  : "";
                const resolvedLicenses = advisor.licenses;
                const normalizedLicenses = Array.isArray(resolvedLicenses)
                  ? resolvedLicenses.filter(
                      (license): license is string =>
                        typeof license === "string" &&
                        license.trim().length > 0,
                    )
                  : [];
                const resolvedSpecialties = advisor.specialties
                  ? resolveComponentData(
                      advisor.specialties,
                      locale,
                      streamDocument,
                      {
                        richTextStyleOverrides: {
                          ...props.advisors.styles.specialties.styles,
                          color: props.advisors.styles.specialties.fontColor,
                        },
                      },
                    )
                  : undefined;
                const resolvedSpecialtiesText = advisor.specialties
                  ? resolveComponentData(
                      advisor.specialties,
                      locale,
                      streamDocument,
                      { output: "plainText" },
                    )
                  : "";
                const advisorCtaValue:
                  Partial<ComprehensiveCTAValue> | undefined = advisor.cta
                  ? {
                      data: {
                        actionType: "link",
                        cta: {
                          field: "",
                          constantValue: advisor.cta,
                          constantValueEnabled: true,
                          selectedType: advisor.cta.ctaType,
                        },
                        openInNewTab: advisor.cta.openInNewTab ?? false,
                      },
                      styles: props.advisors.styles.cta,
                    }
                  : undefined;
                const nameColor = getThemeColorCssValue(
                  props.advisors.styles.name.fontColor?.selectedColor,
                );
                const roleColor = getThemeColorCssValue(
                  props.advisors.styles.role.fontColor?.selectedColor,
                );
                const credentialsColor = getThemeColorCssValue(
                  props.advisors.styles.credentials.fontColor?.selectedColor,
                );
                const licensesColor = getThemeColorCssValue(
                  props.advisors.styles.licenses.fontColor?.selectedColor,
                );
                const specialtiesColor = getThemeColorCssValue(
                  props.advisors.styles.specialties.fontColor?.selectedColor,
                );
                const cardForegroundColor = getThemeColorCssValue(
                  props.cardBackgroundColor.contrastingColor,
                );
                const hasCredentials =
                  typeof resolvedCredentials === "string" &&
                  resolvedCredentials.trim().length > 0;
                const hasLicenses = normalizedLicenses.length > 0;
                const hasSpecialties =
                  typeof resolvedSpecialtiesText === "string" &&
                  resolvedSpecialtiesText.trim().length > 0;

                return (
                  <Background
                    key={resolvedName}
                    className="overflow-hidden rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                    background={props.cardBackgroundColor}
                  >
                    <div className="flex h-full flex-col gap-5 p-6">
                      <div className="flex items-center gap-4">
                        {hasAdvisorImage ? (
                          <EntityField
                            displayName="Advisor Image"
                            fieldId={props.advisors.data.field}
                            constantValueEnabled={
                              props.advisors.data.constantValueEnabled
                            }
                          >
                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full">
                              <Image
                                image={resolvedImage}
                                className="h-full w-full"
                                style={{
                                  display: "block",
                                  height: "100%",
                                  objectFit: "cover",
                                  width: "100%",
                                }}
                              />
                            </div>
                          </EntityField>
                        ) : null}

                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <EntityField
                            displayName="Advisor Name"
                            fieldId={props.advisors.data.field}
                            constantValueEnabled={
                              props.advisors.data.constantValueEnabled
                            }
                          >
                            <h3
                              className="m-0 text-2xl"
                              style={{
                                color: nameColor,
                                fontFamily:
                                  props.advisors.styles.name.styles
                                    .fontFamily === "default"
                                    ? undefined
                                    : props.advisors.styles.name.styles
                                        .fontFamily,
                                fontSize:
                                  props.advisors.styles.name.styles.fontSize ===
                                  "default"
                                    ? undefined
                                    : props.advisors.styles.name.styles
                                        .fontSize,
                                fontWeight:
                                  props.advisors.styles.name.styles
                                    .fontWeight === "default"
                                    ? "600"
                                    : props.advisors.styles.name.styles
                                        .fontWeight,
                                fontStyle:
                                  props.advisors.styles.name.styles
                                    .fontStyle === "default"
                                    ? undefined
                                    : props.advisors.styles.name.styles
                                        .fontStyle,
                                textTransform:
                                  props.advisors.styles.name.styles
                                    .textTransform === "default"
                                    ? undefined
                                    : props.advisors.styles.name.styles
                                        .textTransform,
                              }}
                            >
                              {resolvedName}
                            </h3>
                          </EntityField>
                          <EntityField
                            displayName="Advisor Role"
                            fieldId={props.advisors.data.field}
                            constantValueEnabled={
                              props.advisors.data.constantValueEnabled
                            }
                          >
                            <p
                              className="mt-1 text-sm"
                              style={{
                                color: roleColor,
                                fontFamily:
                                  props.advisors.styles.role.styles
                                    .fontFamily === "default"
                                    ? undefined
                                    : props.advisors.styles.role.styles
                                        .fontFamily,
                                fontSize:
                                  props.advisors.styles.role.styles.fontSize ===
                                  "default"
                                    ? undefined
                                    : props.advisors.styles.role.styles
                                        .fontSize,
                                fontWeight:
                                  props.advisors.styles.role.styles
                                    .fontWeight === "default"
                                    ? undefined
                                    : props.advisors.styles.role.styles
                                        .fontWeight,
                                fontStyle:
                                  props.advisors.styles.role.styles
                                    .fontStyle === "default"
                                    ? undefined
                                    : props.advisors.styles.role.styles
                                        .fontStyle,
                                textTransform:
                                  props.advisors.styles.role.styles
                                    .textTransform === "default"
                                    ? undefined
                                    : props.advisors.styles.role.styles
                                        .textTransform,
                              }}
                            >
                              {resolvedRole}
                            </p>
                          </EntityField>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {hasCredentials ? (
                          <div>
                            <EntityField
                              displayName="Credentials Heading"
                              fieldId={credentialsHeading.text.field}
                              constantValueEnabled={
                                credentialsHeading.text.constantValueEnabled
                              }
                            >
                              <h4
                                className="m-0 font-bold"
                                style={{
                                  color:
                                    credentialsHeadingColor ??
                                    cardForegroundColor,
                                  fontFamily:
                                    credentialsHeading.styles.fontFamily ===
                                    "default"
                                      ? undefined
                                      : credentialsHeading.styles.fontFamily,
                                  fontSize:
                                    credentialsHeading.styles.fontSize ===
                                    "default"
                                      ? undefined
                                      : credentialsHeading.styles.fontSize,
                                  fontWeight:
                                    credentialsHeading.styles.fontWeight ===
                                    "default"
                                      ? undefined
                                      : credentialsHeading.styles.fontWeight,
                                  fontStyle:
                                    credentialsHeading.styles.fontStyle ===
                                    "default"
                                      ? undefined
                                      : credentialsHeading.styles.fontStyle,
                                  textTransform:
                                    credentialsHeading.styles.textTransform ===
                                    "default"
                                      ? undefined
                                      : credentialsHeading.styles.textTransform,
                                }}
                              >
                                {resolvedCredentialsHeading}
                              </h4>
                            </EntityField>
                            <EntityField
                              displayName="Advisor Credentials"
                              fieldId={props.advisors.data.field}
                              constantValueEnabled={
                                props.advisors.data.constantValueEnabled
                              }
                            >
                              <p
                                className="mt-1"
                                style={{
                                  color: credentialsColor,
                                  fontFamily:
                                    props.advisors.styles.credentials.styles
                                      .fontFamily === "default"
                                      ? undefined
                                      : props.advisors.styles.credentials.styles
                                          .fontFamily,
                                  fontSize:
                                    props.advisors.styles.credentials.styles
                                      .fontSize === "default"
                                      ? undefined
                                      : props.advisors.styles.credentials.styles
                                          .fontSize,
                                  fontWeight:
                                    props.advisors.styles.credentials.styles
                                      .fontWeight === "default"
                                      ? undefined
                                      : props.advisors.styles.credentials.styles
                                          .fontWeight,
                                  fontStyle:
                                    props.advisors.styles.credentials.styles
                                      .fontStyle === "default"
                                      ? undefined
                                      : props.advisors.styles.credentials.styles
                                          .fontStyle,
                                  textTransform:
                                    props.advisors.styles.credentials.styles
                                      .textTransform === "default"
                                      ? undefined
                                      : props.advisors.styles.credentials.styles
                                          .textTransform,
                                }}
                              >
                                {resolvedCredentials}
                              </p>
                            </EntityField>
                          </div>
                        ) : null}

                        {hasLicenses ? (
                          <div>
                            <EntityField
                              displayName="Licenses Heading"
                              fieldId={licensesHeading.text.field}
                              constantValueEnabled={
                                licensesHeading.text.constantValueEnabled
                              }
                            >
                              <h4
                                className="m-0 font-bold"
                                style={{
                                  color:
                                    licensesHeadingColor ?? cardForegroundColor,
                                  fontFamily:
                                    licensesHeading.styles.fontFamily ===
                                    "default"
                                      ? undefined
                                      : licensesHeading.styles.fontFamily,
                                  fontSize:
                                    licensesHeading.styles.fontSize ===
                                    "default"
                                      ? undefined
                                      : licensesHeading.styles.fontSize,
                                  fontWeight:
                                    licensesHeading.styles.fontWeight ===
                                    "default"
                                      ? undefined
                                      : licensesHeading.styles.fontWeight,
                                  fontStyle:
                                    licensesHeading.styles.fontStyle ===
                                    "default"
                                      ? undefined
                                      : licensesHeading.styles.fontStyle,
                                  textTransform:
                                    licensesHeading.styles.textTransform ===
                                    "default"
                                      ? undefined
                                      : licensesHeading.styles.textTransform,
                                }}
                              >
                                {resolvedLicensesHeading}
                              </h4>
                            </EntityField>
                            <EntityField
                              displayName="Advisor Licenses"
                              fieldId={props.advisors.data.field}
                              constantValueEnabled={
                                props.advisors.data.constantValueEnabled
                              }
                            >
                              <p
                                className="mt-1"
                                style={{
                                  color: licensesColor,
                                  fontFamily:
                                    props.advisors.styles.licenses.styles
                                      .fontFamily === "default"
                                      ? undefined
                                      : props.advisors.styles.licenses.styles
                                          .fontFamily,
                                  fontSize:
                                    props.advisors.styles.licenses.styles
                                      .fontSize === "default"
                                      ? undefined
                                      : props.advisors.styles.licenses.styles
                                          .fontSize,
                                  fontWeight:
                                    props.advisors.styles.licenses.styles
                                      .fontWeight === "default"
                                      ? undefined
                                      : props.advisors.styles.licenses.styles
                                          .fontWeight,
                                  fontStyle:
                                    props.advisors.styles.licenses.styles
                                      .fontStyle === "default"
                                      ? undefined
                                      : props.advisors.styles.licenses.styles
                                          .fontStyle,
                                  textTransform:
                                    props.advisors.styles.licenses.styles
                                      .textTransform === "default"
                                      ? undefined
                                      : props.advisors.styles.licenses.styles
                                          .textTransform,
                                }}
                              >
                                {normalizedLicenses.join(", ")}
                              </p>
                            </EntityField>
                          </div>
                        ) : null}

                        {hasSpecialties ? (
                          <div>
                            <EntityField
                              displayName="Specialties Heading"
                              fieldId={specialtiesHeading.text.field}
                              constantValueEnabled={
                                specialtiesHeading.text.constantValueEnabled
                              }
                            >
                              <h4
                                className="m-0 font-bold"
                                style={{
                                  color:
                                    specialtiesHeadingColor ??
                                    cardForegroundColor,
                                  fontFamily:
                                    specialtiesHeading.styles.fontFamily ===
                                    "default"
                                      ? undefined
                                      : specialtiesHeading.styles.fontFamily,
                                  fontSize:
                                    specialtiesHeading.styles.fontSize ===
                                    "default"
                                      ? undefined
                                      : specialtiesHeading.styles.fontSize,
                                  fontWeight:
                                    specialtiesHeading.styles.fontWeight ===
                                    "default"
                                      ? undefined
                                      : specialtiesHeading.styles.fontWeight,
                                  fontStyle:
                                    specialtiesHeading.styles.fontStyle ===
                                    "default"
                                      ? undefined
                                      : specialtiesHeading.styles.fontStyle,
                                  textTransform:
                                    specialtiesHeading.styles.textTransform ===
                                    "default"
                                      ? undefined
                                      : specialtiesHeading.styles.textTransform,
                                }}
                              >
                                {resolvedSpecialtiesHeading}
                              </h4>
                            </EntityField>
                            <EntityField
                              displayName="Advisor Specialties"
                              fieldId={props.advisors.data.field}
                              constantValueEnabled={
                                props.advisors.data.constantValueEnabled
                              }
                            >
                              <div className="mt-1 [&_ol]:my-0 [&_ol]:pl-0 [&_p]:m-0 [&_p]:pl-0 [&_ul]:my-0 [&_ul]:pl-0">
                                {renderRichText(resolvedSpecialties, {
                                  ...props.advisors.styles.specialties.styles,
                                  color:
                                    props.advisors.styles.specialties
                                      .fontColor ?? specialtiesColor,
                                })}
                              </div>
                            </EntityField>
                          </div>
                        ) : null}
                      </div>

                      {advisorCtaValue ? (
                        <div className="pt-1">
                          <EntityField
                            displayName="Advisor CTA"
                            fieldId={props.advisors.data.field}
                            constantValueEnabled={
                              props.advisors.data.constantValueEnabled
                            }
                          >
                            <ComprehensiveCTA
                              value={advisorCtaValue}
                              className="p-0 text-sm font-semibold no-underline hover:underline"
                            />
                          </EntityField>
                        </div>
                      ) : null}
                    </div>
                  </Background>
                );
              })}
            </div>
          </div>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceMeetTeam: YextComponentConfig<CommunityFinanceMeetTeamProps> =
  {
    label: "Meet Team",
    fields: CommunityFinanceMeetTeamFields,
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
            en: "Advisors",
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
            defaultValue: "Meet the Team",
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
      cardBackgroundColor: {
        selectedColor: "palette-primary-light",
        contrastingColor: "black",
      },
      credentialsHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Credentials",
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
      licensesHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Licenses",
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
      specialtiesHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Specialties",
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
      advisors: {
        data: advisorsSource.defaultValue,
        styles: {
          name: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
          role: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
          credentials: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
          licenses: {
            styles: {
              fontFamily: "default",
              fontSize: "default",
              fontWeight: "default",
              fontStyle: "default",
              textTransform: "default",
            },
            fontColor: undefined,
          },
          specialties: {
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
            color: { selectedColor: "default", contrastingColor: "black" },
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
            aspectRatio: 0.67,
            imageConstrain: "filled",
            styles: { borderRadius: "default" },
          },
        },
      },
    },
    render: CommunityFinanceMeetTeamComponent,
  };

export default CommunityFinanceMeetTeam;

export const config: SectionConfig = {
  id: "CommunityFinanceMeetTeam",
  displayName: "Meet Team",
  description: "Meet Team",
  pageSetTypes: ["ENTITY"],
};
