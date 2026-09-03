import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  Address,
  AnalyticsScopeProvider,
  HoursTable,
  Link,
  type AddressType,
  type HoursType,
} from "@yext/pages-components";
import { parsePhoneNumber } from "awesome-phonenumber";
import { FaPhone, FaRegEnvelope } from "react-icons/fa";
import {
  VisibilityWrapper,
  ComprehensiveCTA,
  EntityField,
  MaybeRTF,
  getAnalyticsScopeHash,
  getDefaultRTF,
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
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

type StyledTextField = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
  showIcon?: boolean;
  color?: ThemeColor;
};

type EmailFieldProps = {
  list: YextEntityField<string[]>;
  showIcon?: boolean;
  color?: ThemeColor;
};

type HoursStyles = {
  startOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
    | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
  alignment: "items-start" | "items-center" | "items-end";
};

type CommunityFinanceLocationDetailsProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  heading: StyledHeading;
  cardBackgroundColor: ThemeColor;
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  phones: PhoneFieldProps;
  emails: EmailFieldProps;
  locationInformationHeading: StyledTextField;
  nmlsNumber: StyledTextField;
  primaryCta: ComprehensiveCTAValue;
  secondaryCta: ComprehensiveCTAValue;
  lobbyHoursHeading: StyledHeading;
  hours: YextEntityField<HoursType>;
  hoursStyles: HoursStyles;
  showSecondaryHours: boolean;
  secondaryHoursHeading: StyledHeading;
  secondaryHours: YextEntityField<HoursType>;
  secondaryHoursStyles: HoursStyles;
  clientServicesHeading: StyledTextField;
  languagesHeading: StyledTextField;
  accessibilityHeading: StyledTextField;
  servicesHeading: StyledTextField;
  languages: {
    text: YextEntityField<TranslatableRichText>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  accessibility: {
    text: YextEntityField<TranslatableRichText>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  services: {
    text: YextEntityField<TranslatableRichText>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
};

const CommunityFinanceLocationDetailsFields: YextFields<CommunityFinanceLocationDetailsProps> =
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
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    address: {
      type: "entityField",
      label: "Address",
      filter: { types: ["type.address"] },
    },
    showRegion: {
      label: "Show Region",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showCountry: {
      label: "Show Country",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    phones: {
      label: "Phones",
      type: "object",
      objectFields: {
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: "Number",
              filter: { types: ["type.phone"] },
            },
            label: { label: "Label", type: "text" },
          },
          defaultItemProps: {
            number: {
              field: "",
              constantValue: "",
              constantValueEnabled: true,
            } as YextEntityField<string>,
            label: "",
          },
          getItemSummary: (item) =>
            item.label ||
            item.number?.constantValue ||
            item.number?.field ||
            "Phone",
        },
        phoneFormat: {
          label: "Phone Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showIcon: {
          label: "Show Icon",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        color: {
          label: "Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    emails: {
      label: "Emails",
      type: "object",
      objectFields: {
        list: {
          type: "entityField",
          label: "Emails",
          filter: {
            types: ["type.string"],
            includeListsOnly: true,
            allowList: ["emails"],
          },
          disallowTranslation: true,
        },
        showIcon: {
          label: "Show Icon",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        color: {
          label: "Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    locationInformationHeading: {
      label: "Location Information Heading",
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
    nmlsNumber: {
      label: "NMLS Number",
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
    primaryCta: {
      label: "Primary CTA",
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: "Secondary CTA",
      type: "comprehensiveCTA",
    },
    lobbyHoursHeading: {
      label: "Lobby Hours Heading",
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
    hours: {
      type: "entityField",
      label: "Hours",
      filter: { types: ["type.hours"] },
      disableConstantValueToggle: true,
    },
    hoursStyles: {
      label: "Hours Styles",
      type: "object",
      objectFields: {
        startOfWeek: {
          label: "Start Of Week",
          type: "select",
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
            { label: "Today", value: "today" },
          ],
        },
        collapseDays: {
          label: "Collapse Days",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showAdditionalHoursText: {
          label: "Show Additional Hours Text",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        alignment: {
          label: "Alignment",
          type: "select",
          options: [
            { label: "Start", value: "items-start" },
            { label: "Center", value: "items-center" },
            { label: "End", value: "items-end" },
          ],
        },
      },
    },
    showSecondaryHours: {
      label: "Show Secondary Hours",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    secondaryHoursHeading: {
      label: "Secondary Hours Heading",
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
    secondaryHours: {
      type: "entityField",
      label: "Secondary Hours",
      filter: { types: ["type.hours"] },
      disableConstantValueToggle: true,
    },
    secondaryHoursStyles: {
      label: "Secondary Hours Styles",
      type: "object",
      objectFields: {
        startOfWeek: {
          label: "Start Of Week",
          type: "select",
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
            { label: "Today", value: "today" },
          ],
        },
        collapseDays: {
          label: "Collapse Days",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showAdditionalHoursText: {
          label: "Show Additional Hours Text",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        alignment: {
          label: "Alignment",
          type: "select",
          options: [
            { label: "Start", value: "items-start" },
            { label: "Center", value: "items-center" },
            { label: "End", value: "items-end" },
          ],
        },
      },
    },
    clientServicesHeading: {
      label: "Client Services Heading",
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
    languagesHeading: {
      label: "Languages Heading",
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
    accessibilityHeading: {
      label: "Accessibility Heading",
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
    servicesHeading: {
      label: "Services Heading",
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
    languages: {
      label: "Languages",
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
    accessibility: {
      label: "Accessibility",
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
    services: {
      label: "Services",
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
  };

const getThemeColorValue = (color?: ThemeColor): string | undefined => {
  const token = color?.selectedColor;

  if (!token) {
    return undefined;
  }

  if (token === "white") {
    return "#ffffff";
  }

  if (token.endsWith("-light")) {
    const baseToken = token.replace(/-light$/, "");
    return `hsl(from var(--colors-${baseToken}) h s 98)`;
  }

  if (token.endsWith("-dark")) {
    const baseToken = token.replace(/-dark$/, "");
    return `hsl(from var(--colors-${baseToken}) h s 20)`;
  }

  if (token.startsWith("palette-")) {
    return `var(--colors-${token})`;
  }

  if (
    token.startsWith("var(") ||
    token.startsWith("#") ||
    token.startsWith("rgb(") ||
    token.startsWith("rgba(") ||
    token.startsWith("hsl(") ||
    token.startsWith("hsla(")
  ) {
    return token;
  }

  if (token.startsWith("[") && token.endsWith("]")) {
    return token.slice(1, -1);
  }

  return token;
};

const getSurfaceTextColor = (
  color: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): string | undefined =>
  getThemeColorValue(color) ??
  getThemeColorValue({
    selectedColor: surfaceColor.contrastingColor,
    contrastingColor: surfaceColor.selectedColor,
  });

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

const formatPhone = (value: string, format: PhoneFieldProps["phoneFormat"]) => {
  const parsed = parsePhoneNumber(value.replace(/(?!^\+)\+|[^\d+]/g, ""));

  if (!parsed.valid || parsed.number === undefined) {
    return value;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const CommunityFinanceLocationDetailsComponent: PuckComponent<
  CommunityFinanceLocationDetailsProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const resolvedLobbyHoursHeading =
    resolveComponentData(
      props.lobbyHoursHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedAddress = resolveComponentData(
    props.address,
    locale,
    streamDocument,
  );
  const resolvedLocationInformationHeading =
    resolveComponentData(
      props.locationInformationHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedHours = resolveComponentData(
    props.hours,
    locale,
    streamDocument,
  );
  const resolvedSecondaryHoursHeading =
    resolveComponentData(
      props.secondaryHoursHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedSecondaryHours = resolveComponentData(
    props.secondaryHours,
    locale,
    streamDocument,
  );
  const resolvedClientServicesHeading =
    resolveComponentData(
      props.clientServicesHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedLanguagesHeading =
    resolveComponentData(
      props.languagesHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedAccessibilityHeading =
    resolveComponentData(
      props.accessibilityHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedServicesHeading =
    resolveComponentData(
      props.servicesHeading.text,
      locale,
      streamDocument,
    ) || "";
  const resolvedNmlsNumber =
    resolveComponentData(props.nmlsNumber.text, locale, streamDocument) || "";
  const resolvedAccessibility = resolveComponentData(
    props.accessibility.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides: {
        ...props.accessibility.styles,
        color: props.accessibility.fontColor,
      },
    },
  );
  const resolvedLanguages = resolveComponentData(
    props.languages.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides: {
        ...props.languages.styles,
        color: props.languages.fontColor,
      },
    },
  );
  const resolvedServices = resolveComponentData(
    props.services.text,
    locale,
    streamDocument,
    {
      richTextStyleOverrides: {
        ...props.services.styles,
        color: props.services.fontColor,
      },
    },
  );
  const resolvedEmails = resolveComponentData(
    props.emails.list,
    locale,
    streamDocument,
  );
  const normalizedEmails = Array.isArray(resolvedEmails) ? resolvedEmails : [];
  const normalizedPhones = (props.phones.items ?? [])
    .map((item) => {
      const resolvedNumber = resolveComponentData(
        item.number,
        locale,
        streamDocument,
      );
      const normalizedNumber =
        typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";

      if (!normalizedNumber) {
        return null;
      }

      return {
        label: item.label?.trim() || "",
        formatted: formatPhone(normalizedNumber, props.phones.phoneFormat),
        digits: normalizedNumber.replace(/\D/g, ""),
        entityField: item.number,
        original: normalizedNumber,
      };
    })
    .filter(
      (
        item,
      ): item is {
        label: string;
        formatted: string;
        digits: string;
        entityField: YextEntityField<string>;
        original: string;
      } => item !== null,
    );
  const sectionBackgroundColor = getThemeColorValue(
    props.section.backgroundColor,
  );
  const cardBackgroundColor = getThemeColorValue(props.cardBackgroundColor);
  const sectionForegroundColor = getSurfaceTextColor(
    props.heading.fontColor,
    props.section.backgroundColor,
  );
  const cardForegroundColor = getSurfaceTextColor(
    undefined,
    props.cardBackgroundColor,
  );
  const phoneColor =
    getThemeColorValue(props.phones.color) ?? cardForegroundColor;
  const emailColor =
    getThemeColorValue(props.emails.color) ?? cardForegroundColor;
  const accessibilityColor = getSurfaceTextColor(
    props.accessibility.fontColor,
    props.cardBackgroundColor,
  );
  const secondaryCtaValue: Partial<ComprehensiveCTAValue> =
    props.secondaryCta.styles.color.selectedColor === "default"
      ? {
          ...props.secondaryCta,
          styles: {
            ...props.secondaryCta.styles,
            color: {
              selectedColor: props.cardBackgroundColor.contrastingColor,
              contrastingColor: props.cardBackgroundColor.selectedColor,
            },
          },
        }
      : (props.secondaryCta as Partial<ComprehensiveCTAValue>);
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;
  const additionalHoursText =
    typeof streamDocument.additionalHoursText === "string"
      ? streamDocument.additionalHoursText.trim()
      : "";

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceLocationDetails${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <section
          className="yext-community-finance-location-details"
          style={{
            backgroundColor: sectionBackgroundColor,
            borderTop: "1px solid rgb(230, 232, 233)",
            borderBottom: "1px solid rgb(230, 232, 233)",
            paddingBlock,
          }}
        >
          <style>{`
            .yext-community-finance-location-details p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-location-details li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }
            .yext-community-finance-location-details h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }
            .yext-community-finance-location-details h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }
            .yext-community-finance-location-details h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }
            .yext-community-finance-location-details h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }
            .yext-community-finance-location-details h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }
            .yext-community-finance-location-details h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }
            .yext-community-finance-location-details a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }

            .yext-community-finance-location-details a.components {
              text-decoration: none;
            }

            .yext-community-finance-location-details a.components:hover {
              text-decoration: underline;
            }
          `}</style>
          <div
            className="mx-auto px-5 py-16 md:px-8"
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            <div className="mb-6 max-w-[780px]">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                className="m-0"
                style={{
                  color: sectionForegroundColor,
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
              </h2>
            </EntityField>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <article
                className="rounded-[24px] p-6"
                style={{
                  backgroundColor: cardBackgroundColor,
                }}
              >
                <EntityField
                  displayName="Location Information Heading"
                  fieldId={props.locationInformationHeading.text.field}
                  constantValueEnabled={
                    props.locationInformationHeading.text.constantValueEnabled}
              >
                <h3
                  className="m-0 text-lg font-bold"
                  style={{
                    color:
                      getSurfaceTextColor(
                        props.locationInformationHeading.fontColor,
                        props.cardBackgroundColor,
                      ) ?? cardForegroundColor,
                    fontFamily:
                      props.locationInformationHeading.styles.fontFamily ===
                      "default"
                        ? undefined
                        : props.locationInformationHeading.styles.fontFamily,
                    fontSize:
                      props.locationInformationHeading.styles.fontSize ===
                      "default"
                        ? undefined
                        : props.locationInformationHeading.styles.fontSize,
                    fontWeight:
                      props.locationInformationHeading.styles.fontWeight ===
                      "default"
                        ? undefined
                        : props.locationInformationHeading.styles.fontWeight,
                    fontStyle:
                      props.locationInformationHeading.styles.fontStyle ===
                      "default"
                        ? undefined
                        : props.locationInformationHeading.styles.fontStyle,
                    textTransform:
                      props.locationInformationHeading.styles.textTransform ===
                      "default"
                        ? undefined
                        : props.locationInformationHeading.styles.textTransform,
                  }}
                >
                  {resolvedLocationInformationHeading}
                </h3>
                </EntityField>
                <div
                  className="mt-5 grid gap-4 text-sm leading-6"
                  style={{ color: cardForegroundColor }}
                >
                  <div>
                    <dt className="font-bold">Address</dt>
                    <dd className="mt-1">
                      {resolvedAddress ? (
                        <EntityField
                          displayName="Address"
                          fieldId={props.address.field}
                          constantValueEnabled={
                            props.address.constantValueEnabled
                          }
                        >
                          <Address
                          address={resolvedAddress}
                          showRegion={props.showRegion}
                          showCountry={props.showCountry}
                        />
                        </EntityField>
                      ) : null}
                    </dd>
                  </div>
                  {normalizedPhones.map((phone, index) => (
                    <div key={`${phone.original}-${index}`}>
                      <dt className="font-bold">{phone.label || "Phone"}</dt>
                      <EntityField
                        displayName="Phone"
                        fieldId={phone.entityField.field}
                        constantValueEnabled={
                          phone.entityField.constantValueEnabled
                        }>
                      <dd className="mt-1">
                        {props.phones.includeHyperlink ? (
                          <Link
                            cta={{
                              link: phone.digits,
                              linkType: "PHONE",
                            }}
                            className="inline-flex items-center gap-2"
                            style={{
                              color: phoneColor,
                            }}
                          >
                            <>
                              {props.phones.showIcon ? <FaPhone /> : null}
                              <span>{phone.formatted}</span>
                            </>
                          </Link>
                        ) : (
                          <span
                            className="inline-flex items-center gap-2"
                            style={{
                              color: phoneColor,
                            }}
                          >
                            {props.phones.showIcon ? <FaPhone /> : null}
                            <span>{phone.formatted}</span>
                          </span>
                        )}
                      </dd>
                    </EntityField>
                    </div>
                  ))}
                  {normalizedEmails.length > 0 ? (
                    <div>
                      <dt className="font-bold">Email</dt>
                      <EntityField
                        displayName="Email Addresses"
                        fieldId={props.emails.list.field}
                        constantValueEnabled={
                          props.emails.list.constantValueEnabled
                        }>
                      <dd className="mt-1 grid gap-1">
                        {normalizedEmails.map((email) => (
                          <Link
                            key={email}
                            cta={{
                              link: email,
                              linkType: "EMAIL",
                            }}
                            className="inline-flex items-center gap-2"
                            style={{
                              color: emailColor,
                            }}
                          >
                            <>
                              {props.emails.showIcon ? <FaRegEnvelope /> : null}
                              <span>{email.replace(/^mailto:/i, "")}</span>
                            </>
                          </Link>
                        ))}
                      </dd>
                    </EntityField>
                    </div>
                  ) : null}
                  <div>
                    <dt className="font-bold">NMLS number</dt>
                    <EntityField
                      displayName="NMLS Number"
                      fieldId={props.nmlsNumber.text.field}
                      constantValueEnabled={
                        props.nmlsNumber.text.constantValueEnabled
                      }>
                    <dd
                      className="mt-1"
                      style={{
                        color:
                          getSurfaceTextColor(
                            props.nmlsNumber.fontColor,
                            props.cardBackgroundColor,
                          ) ?? cardForegroundColor,
                        fontFamily:
                          props.nmlsNumber.styles.fontFamily === "default"
                            ? undefined
                            : props.nmlsNumber.styles.fontFamily,
                        fontSize:
                          props.nmlsNumber.styles.fontSize === "default"
                            ? undefined
                            : props.nmlsNumber.styles.fontSize,
                        fontWeight:
                          props.nmlsNumber.styles.fontWeight === "default"
                            ? undefined
                            : props.nmlsNumber.styles.fontWeight,
                        fontStyle:
                          props.nmlsNumber.styles.fontStyle === "default"
                            ? undefined
                            : props.nmlsNumber.styles.fontStyle,
                        textTransform:
                          props.nmlsNumber.styles.textTransform === "default"
                            ? undefined
                            : props.nmlsNumber.styles.textTransform,
                      }}
                    >
                      {resolvedNmlsNumber}
                    </dd>
                  </EntityField>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
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
                      className="inline-flex"
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
                      value={secondaryCtaValue}
                      eventName="secondaryCta"
                      className="inline-flex text-sm font-bold no-underline hover:underline"
                    />
                  </EntityField>
                </div>
              </article>
              <article
                className="rounded-[24px] p-6"
                style={{
                  backgroundColor: cardBackgroundColor,
                }}
              >
                <EntityField
                  displayName="Lobby Hours Heading"
                  fieldId={props.lobbyHoursHeading.text.field}
                  constantValueEnabled={
                    props.lobbyHoursHeading.text.constantValueEnabled}
              >
                <h3
                  className="m-0 text-lg font-bold"
                  style={{
                    color:
                      getSurfaceTextColor(
                        props.lobbyHoursHeading.fontColor,
                        props.cardBackgroundColor,
                      ) ?? cardForegroundColor,
                    fontFamily:
                      props.lobbyHoursHeading.styles.fontFamily === "default"
                        ? undefined
                        : props.lobbyHoursHeading.styles.fontFamily,
                    fontSize:
                      props.lobbyHoursHeading.styles.fontSize === "default"
                        ? undefined
                        : props.lobbyHoursHeading.styles.fontSize,
                    fontWeight:
                      props.lobbyHoursHeading.styles.fontWeight === "default"
                        ? undefined
                        : props.lobbyHoursHeading.styles.fontWeight,
                    fontStyle:
                      props.lobbyHoursHeading.styles.fontStyle === "default"
                        ? undefined
                        : props.lobbyHoursHeading.styles.fontStyle,
                    textTransform:
                      props.lobbyHoursHeading.styles.textTransform === "default"
                        ? undefined
                        : props.lobbyHoursHeading.styles.textTransform,
                  }}
                >
                  {resolvedLobbyHoursHeading}
                </h3>
                </EntityField>
                {resolvedHours ? (
                  <EntityField
                    displayName="Lobby Hours"
                    fieldId={props.hours.field}
                    constantValueEnabled={props.hours.constantValueEnabled}
                  >
                  <div
                    className={`community-finance-hours-card mt-5 flex flex-col ${props.hoursStyles.alignment}`}
                    style={{ color: cardForegroundColor }}
                  >
                    <style>{`
                        .community-finance-hours-card table {
                          width: 100%;
                          border-collapse: separate;
                          border-spacing: 0 10px;
                        }

                        .community-finance-hours-card table,
                        .community-finance-hours-card tbody,
                        .community-finance-hours-card tr,
                        .community-finance-hours-card th,
                        .community-finance-hours-card td,
                        .community-finance-hours-card span,
                        .community-finance-hours-card div {
                          color: inherit;
                        }

                        .community-finance-hours-card td {
                          text-align: right;
                        }
                      `}</style>
                    <HoursTable
                      hours={resolvedHours}
                      comingSoon={streamDocument.comingSoon}
                      startOfWeek={props.hoursStyles.startOfWeek}
                      collapseDays={props.hoursStyles.collapseDays}
                    />
                    {props.hoursStyles.showAdditionalHoursText &&
                    additionalHoursText ? (
                      <span
                        className="mt-3 text-sm"
                        style={{ color: cardForegroundColor }}
                      >
                        {additionalHoursText}
                      </span>
                    ) : null}
                  </div>
                  </EntityField>
                ) : null}
                {props.showSecondaryHours ? (
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <EntityField
                      displayName="Secondary Hours Heading"
                      fieldId={props.secondaryHoursHeading.text.field}
                      constantValueEnabled={
                        props.secondaryHoursHeading.text.constantValueEnabled
                      }>
                    <h4
                      className="m-0 text-sm font-bold"
                      style={{
                        color:
                          getSurfaceTextColor(
                            props.secondaryHoursHeading.fontColor,
                            props.cardBackgroundColor,
                          ) ?? cardForegroundColor,
                        fontFamily:
                          props.secondaryHoursHeading.styles.fontFamily ===
                          "default"
                            ? undefined
                            : props.secondaryHoursHeading.styles.fontFamily,
                        fontSize:
                          props.secondaryHoursHeading.styles.fontSize ===
                          "default"
                            ? undefined
                            : props.secondaryHoursHeading.styles.fontSize,
                        fontWeight:
                          props.secondaryHoursHeading.styles.fontWeight ===
                          "default"
                            ? undefined
                            : props.secondaryHoursHeading.styles.fontWeight,
                        fontStyle:
                          props.secondaryHoursHeading.styles.fontStyle ===
                          "default"
                            ? undefined
                            : props.secondaryHoursHeading.styles.fontStyle,
                        textTransform:
                          props.secondaryHoursHeading.styles.textTransform ===
                          "default"
                            ? undefined
                            : props.secondaryHoursHeading.styles.textTransform,
                      }}
                    >
                      {resolvedSecondaryHoursHeading}
                    </h4>
                    </EntityField>
                    {resolvedSecondaryHours ? (
                      <EntityField
                        displayName="Secondary Hours"
                        fieldId={props.secondaryHours.field}
                        constantValueEnabled={
                          props.secondaryHours.constantValueEnabled
                        }
                      >
                      <div
                        className={`community-finance-hours-card mt-4 flex flex-col ${props.secondaryHoursStyles.alignment}`}
                        style={{ color: cardForegroundColor }}
                      >
                        <HoursTable
                          hours={resolvedSecondaryHours}
                          comingSoon={streamDocument.comingSoon}
                          startOfWeek={props.secondaryHoursStyles.startOfWeek}
                          collapseDays={props.secondaryHoursStyles.collapseDays}
                        />
                        {props.secondaryHoursStyles.showAdditionalHoursText &&
                        additionalHoursText ? (
                          <span
                            className="mt-3 text-sm"
                            style={{ color: cardForegroundColor }}
                          >
                            {additionalHoursText}
                          </span>
                        ) : null}
                      </div>
                      </EntityField>
                    ) : null}
                  </div>
                ) : null}
              </article>
              <article
                className="rounded-[24px] p-6 md:col-span-2 xl:col-span-1"
                style={{
                  backgroundColor: cardBackgroundColor,
                }}
              >
                <EntityField
                  displayName="Client Services Heading"
                  fieldId={props.clientServicesHeading.text.field}
                  constantValueEnabled={
                    props.clientServicesHeading.text.constantValueEnabled}
              >
                <h3
                  className="m-0 text-lg font-bold"
                  style={{
                    color:
                      getSurfaceTextColor(
                        props.clientServicesHeading.fontColor,
                        props.cardBackgroundColor,
                      ) ?? cardForegroundColor,
                    fontFamily:
                      props.clientServicesHeading.styles.fontFamily ===
                      "default"
                        ? undefined
                        : props.clientServicesHeading.styles.fontFamily,
                    fontSize:
                      props.clientServicesHeading.styles.fontSize === "default"
                        ? undefined
                        : props.clientServicesHeading.styles.fontSize,
                    fontWeight:
                      props.clientServicesHeading.styles.fontWeight ===
                      "default"
                        ? undefined
                        : props.clientServicesHeading.styles.fontWeight,
                    fontStyle:
                      props.clientServicesHeading.styles.fontStyle === "default"
                        ? undefined
                        : props.clientServicesHeading.styles.fontStyle,
                    textTransform:
                      props.clientServicesHeading.styles.textTransform ===
                      "default"
                        ? undefined
                        : props.clientServicesHeading.styles.textTransform,
                  }}
                >
                  {resolvedClientServicesHeading}
                </h3>
                </EntityField>
                <div
                  className="mt-5 grid gap-4 text-sm leading-6"
                  style={{ color: cardForegroundColor }}
                >
                  <div>
                    <EntityField
                      displayName="Languages Heading"
                      fieldId={props.languagesHeading.text.field}
                      constantValueEnabled={
                        props.languagesHeading.text.constantValueEnabled
                      }>
                    <h4
                      className="m-0 font-bold"
                      style={{
                        color:
                          getSurfaceTextColor(
                            props.languagesHeading.fontColor,
                            props.cardBackgroundColor,
                          ) ?? cardForegroundColor,
                        fontFamily:
                          props.languagesHeading.styles.fontFamily === "default"
                            ? undefined
                            : props.languagesHeading.styles.fontFamily,
                        fontSize:
                          props.languagesHeading.styles.fontSize === "default"
                            ? undefined
                            : props.languagesHeading.styles.fontSize,
                        fontWeight:
                          props.languagesHeading.styles.fontWeight === "default"
                            ? undefined
                            : props.languagesHeading.styles.fontWeight,
                        fontStyle:
                          props.languagesHeading.styles.fontStyle === "default"
                            ? undefined
                            : props.languagesHeading.styles.fontStyle,
                        textTransform:
                          props.languagesHeading.styles.textTransform ===
                          "default"
                            ? undefined
                            : props.languagesHeading.styles.textTransform,
                      }}
                    >
                      {resolvedLanguagesHeading}
                    </h4>
                    </EntityField>
                    <EntityField
                      displayName="Languages"
                      fieldId={props.languages.text.field}
                      constantValueEnabled={
                        props.languages.text.constantValueEnabled
                      }
                    >
                      <div className="mt-1">
                      {renderRichText(resolvedLanguages, {
                        ...props.languages.styles,
                        color: getSurfaceTextColor(
                          props.languages.fontColor,
                          props.cardBackgroundColor,
                        ),
                      })}
                    </div>
                  </EntityField>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <EntityField
                      displayName="Accessibility Heading"
                      fieldId={props.accessibilityHeading.text.field}
                      constantValueEnabled={
                        props.accessibilityHeading.text.constantValueEnabled
                      }>
                    <h4
                      className="m-0 font-bold"
                      style={{
                        color:
                          getSurfaceTextColor(
                            props.accessibilityHeading.fontColor,
                            props.cardBackgroundColor,
                          ) ?? cardForegroundColor,
                        fontFamily:
                          props.accessibilityHeading.styles.fontFamily ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontFamily,
                        fontSize:
                          props.accessibilityHeading.styles.fontSize ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontSize,
                        fontWeight:
                          props.accessibilityHeading.styles.fontWeight ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontWeight,
                        fontStyle:
                          props.accessibilityHeading.styles.fontStyle ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.fontStyle,
                        textTransform:
                          props.accessibilityHeading.styles.textTransform ===
                          "default"
                            ? undefined
                            : props.accessibilityHeading.styles.textTransform,
                      }}
                    >
                      {resolvedAccessibilityHeading}
                    </h4>
                    </EntityField>
                    <EntityField
                      displayName="Accessibility"
                      fieldId={props.accessibility.text.field}
                      constantValueEnabled={
                        props.accessibility.text.constantValueEnabled
                      }
                    >
                      <div className="mt-1">
                      {renderRichText(resolvedAccessibility, {
                        ...props.accessibility.styles,
                        color: accessibilityColor,
                      })}
                    </div>
                  </EntityField>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <EntityField
                      displayName="Services Heading"
                      fieldId={props.servicesHeading.text.field}
                      constantValueEnabled={
                        props.servicesHeading.text.constantValueEnabled
                      }>
                    <h4
                      className="m-0 font-bold"
                      style={{
                        color:
                          getSurfaceTextColor(
                            props.servicesHeading.fontColor,
                            props.cardBackgroundColor,
                          ) ?? cardForegroundColor,
                        fontFamily:
                          props.servicesHeading.styles.fontFamily === "default"
                            ? undefined
                            : props.servicesHeading.styles.fontFamily,
                        fontSize:
                          props.servicesHeading.styles.fontSize === "default"
                            ? undefined
                            : props.servicesHeading.styles.fontSize,
                        fontWeight:
                          props.servicesHeading.styles.fontWeight === "default"
                            ? undefined
                            : props.servicesHeading.styles.fontWeight,
                        fontStyle:
                          props.servicesHeading.styles.fontStyle === "default"
                            ? undefined
                            : props.servicesHeading.styles.fontStyle,
                        textTransform:
                          props.servicesHeading.styles.textTransform ===
                          "default"
                            ? undefined
                            : props.servicesHeading.styles.textTransform,
                      }}
                    >
                      {resolvedServicesHeading}
                    </h4>
                    </EntityField>
                    <EntityField
                      displayName="Services"
                      fieldId={props.services.text.field}
                      constantValueEnabled={
                        props.services.text.constantValueEnabled
                      }
                    >
                      <div className="mt-2">
                      {renderRichText(resolvedServices, {
                        ...props.services.styles,
                        color: getSurfaceTextColor(
                          props.services.fontColor,
                          props.cardBackgroundColor,
                        ),
                      })}
                    </div>
                    </EntityField>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceLocationDetails: YextComponentConfig<CommunityFinanceLocationDetailsProps> =
  {
    label: "Location Details",
    fields: CommunityFinanceLocationDetailsFields,
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
            defaultValue: "Location Details",
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
      address: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          postalCode: "",
          countryCode: "",
          region: "",
        },
        constantValueEnabled: false,
      } as YextEntityField<AddressType>,
      showRegion: true,
      showCountry: false,
      phones: {
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            } as YextEntityField<string>,
            label: "Main Phone",
          },
          {
            number: {
              field: "",
              constantValue: "+17045550112",
              constantValueEnabled: true,
            } as YextEntityField<string>,
            label: "Customer Service",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
        showIcon: false,
        color: undefined,
      },
      emails: {
        list: {
          field: "emails",
          constantValue: [],
          constantValueEnabled: false,
        } as YextEntityField<string[]>,
        showIcon: false,
        color: undefined,
      },
      locationInformationHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Location information",
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
      nmlsNumber: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "1987654",
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
                defaultValue: "Visit Website",
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
      lobbyHoursHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Lobby Hours",
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
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      } as YextEntityField<HoursType>,
      hoursStyles: {
        startOfWeek: "monday",
        collapseDays: false,
        showAdditionalHoursText: false,
        alignment: "items-start",
      },
      showSecondaryHours: true,
      secondaryHoursHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "ATM Deposit Cut-Off Hours",
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
      secondaryHours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      } as YextEntityField<HoursType>,
      secondaryHoursStyles: {
        startOfWeek: "monday",
        collapseDays: false,
        showAdditionalHoursText: false,
        alignment: "items-start",
      },
      clientServicesHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Client services",
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
      languagesHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Languages",
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
      accessibilityHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Accessibility",
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
      servicesHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Services",
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
      languages: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF("English, Spanish, Chinese, French"),
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
      accessibility: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "ADA compliant entrance, elevator access, private consultation rooms",
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
      services: {
        text: {
          field: "",
          constantValue: {
            defaultValue: {
              json: "{\"root\":{\"children\":[{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Private consultations\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"listitem\",\"value\":1,\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Accessible entrance\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"listitem\",\"value\":2,\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Notary on-site\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"listitem\",\"value\":3,\"version\":1},{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Drive-thru ATM\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"listitem\",\"value\":4,\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"listType\":\"bullet\",\"start\":1,\"tag\":\"ul\",\"type\":\"list\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}",
              html: "<ul><li>Private consultations</li><li>Accessible entrance</li><li>Notary on-site</li><li>Drive-thru ATM</li></ul>",
            },
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
    },
    render: CommunityFinanceLocationDetailsComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceLocationDetails",
  displayName: "Location Details",
  description: "Location Details",
  pageSetTypes: ["ENTITY"],
};
