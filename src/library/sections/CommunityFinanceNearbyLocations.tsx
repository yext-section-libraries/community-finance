import "../shared/typography.css";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import type { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  AnalyticsScopeProvider,
  Link,
  getDirections,
  type AddressType,
} from "@yext/pages-components";
import { FaPhone } from "react-icons/fa";
import {
  msg,
  Background,
  ComprehensiveCTA,
  EntityField,
  MapboxStaticMapComponent,
  VisibilityWrapper,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  mapboxStaticMapStyleOptions,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  type ComprehensiveCTAValue,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  getSurfaceTextColor,
  getThemeColorValue,
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

type StyledCardText = {
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

type MapProps = {
  coordinate: YextEntityField<{ latitude: number; longitude: number }>;
  mapStyle: string;
  zoom: number;
  height?: string;
};

type CommunityFinanceNearbyLocationsProps = {
  section: {
    backgroundColor: ThemeColor;
    styles: FinanceSectionStyles;
    visibleOnLivePage: boolean;
  };
  eyebrow: Eyebrow;
  heading: StyledHeading;
  body: StyledBody;
  cardTitle: StyledCardText;
  cardAddress: StyledCardText;
  cardDetails: StyledCardText;
  phones: PhoneFieldProps;
  cardCta: ComprehensiveCTAValue;
  map: MapProps;
  radius: number;
  limit: number;
};

const CommunityFinanceNearbyLocationsFields: YextFields<CommunityFinanceNearbyLocationsProps> =
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
    cardTitle: {
      label: msg("fields.cardTitle", "Card Title"),
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
    cardAddress: {
      label: msg("fields.cardAddress", "Card Address"),
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
    cardDetails: {
      label: msg("fields.cardDetails", "Card Details"),
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
    phones: {
      label: msg("fields.phones", "Phones"),
      type: "object",
      objectFields: {
        items: {
          label: msg("fields.items", "Items"),
          type: "array",
          visible: false,
          arrayFields: {
            number: {
              type: "entityField",
              label: msg("fields.number", "Number"),
              filter: { types: ["type.phone"] },
            },
            label: { label: msg("fields.label", "Label"), type: "text" },
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
          label: msg("fields.phoneFormat", "Phone Format"),
          type: "radio",
          options: [
            { label: msg("fields.options.domestic", "Domestic"), value: "domestic" },
            { label: msg("fields.options.international", "International"), value: "international" },
          ],
        },
        includeHyperlink: {
          label: msg("fields.includeHyperlink", "Include Hyperlink"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        showIcon: {
          label: msg("fields.showIcon", "Show Icon"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        color: {
          label: msg("fields.color", "Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    cardCta: {
      label: msg("fields.cardCta", "Card CTA"),
      type: "comprehensiveCTA",
    },
    map: {
      label: msg("fields.map", "Map"),
      type: "object",
      objectFields: {
        coordinate: {
          type: "entityField",
          label: msg("fields.coordinates", "Coordinates"),
          filter: { types: ["type.coordinate"] },
        },
        mapStyle: {
          label: msg("fields.mapboxMapStyle", "Mapbox Map Style"),
          type: "select",
          options: mapboxStaticMapStyleOptions,
        },
        zoom: {
          label: msg("fields.zoom", "Zoom"),
          type: "number",
          min: 0,
          max: 22,
        },
      },
    },
    radius: {
      label: msg("fields.radius", "Radius"),
      type: "number",
    },
    limit: {
      label: msg("fields.limit", "Limit"),
      type: "number",
    },
  };

const haversineMiles = (
  origin?: { latitude?: number; longitude?: number },
  target?: { latitude?: number; longitude?: number },
) => {
  if (
    origin?.latitude === undefined ||
    origin.longitude === undefined ||
    target?.latitude === undefined ||
    target.longitude === undefined
  ) {
    return null;
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(target.latitude - origin.latitude);
  const dLon = toRadians(target.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(target.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
};

const formatAddress = (address?: AddressType) => {
  if (!address) {
    return [];
  }

  const line1 = [address.line1, address.line2, address.line3]
    .filter(Boolean)
    .join(", ");
  const line2 = [address.city, address.region, address.postalCode]
    .filter(Boolean)
    .join(", ");

  return [line1, line2].filter(Boolean);
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

const CommunityFinanceNearbyLocationsComponent: PuckComponent<
  CommunityFinanceNearbyLocationsProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const { iframe, relativePrefixToRoot } = useTemplateProps<{
    iframe?: HTMLIFrameElement;
    relativePrefixToRoot?: string;
  }>();
  const locale = i18n.language;
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const resolvedBody = resolveComponentData(
    props.body.text,
    locale,
    streamDocument,
  );
  const coordinate = streamDocument?.yextDisplayCoordinate;
  const enableNearbyLocations =
    coordinate?.latitude !== undefined &&
    coordinate?.longitude !== undefined &&
    !!props.radius &&
    !!props.limit;
  const { data, status } = useNearbyLocations({
    streamDocument,
    latitude: coordinate?.latitude,
    longitude: coordinate?.longitude,
    radiusMi: props.radius,
    limit: props.limit,
    enabled: enableNearbyLocations,
  });
  const sectionForegroundColor = getSurfaceTextColor(
    props.body.fontColor,
    props.section.backgroundColor,
  );
  const headingColor = getSurfaceTextColor(
    props.heading.fontColor,
    props.section.backgroundColor,
  );
  const cardTitleColor = getSurfaceTextColor(
    props.cardTitle.fontColor,
    props.section.backgroundColor,
  );
  const cardAddressColor = getSurfaceTextColor(
    props.cardAddress.fontColor,
    props.section.backgroundColor,
  );
  const cardDetailsColor = getSurfaceTextColor(
    props.cardDetails.fontColor,
    props.section.backgroundColor,
  );
  const phoneColor = getThemeColorValue(props.phones.color) ?? cardDetailsColor;
  const eyebrowColor = getSurfaceTextColor(
    props.eyebrow.fontColor,
    props.eyebrow.backgroundColor,
  );
  const cardAddressTextStyle: React.CSSProperties = {
    color: cardAddressColor,
    fontFamily:
      props.cardAddress.styles.fontFamily === "default"
        ? "var(--fontFamily-body-fontFamily)"
        : props.cardAddress.styles.fontFamily,
    fontSize:
      props.cardAddress.styles.fontSize === "default"
        ? "var(--fontSize-body-fontSize)"
        : props.cardAddress.styles.fontSize,
    fontWeight:
      props.cardAddress.styles.fontWeight === "default"
        ? "var(--fontWeight-body-fontWeight)"
        : props.cardAddress.styles.fontWeight,
    fontStyle:
      props.cardAddress.styles.fontStyle === "default"
        ? "var(--fontStyle-body-fontStyle)"
        : props.cardAddress.styles.fontStyle,
    textTransform:
      props.cardAddress.styles.textTransform === "default"
        ? "var(--textTransform-body-textTransform)"
        : props.cardAddress.styles.textTransform,
  };
  const cardDetailsTextStyle: React.CSSProperties = {
    color: cardDetailsColor,
    fontFamily:
      props.cardDetails.styles.fontFamily === "default"
        ? "var(--fontFamily-body-fontFamily)"
        : props.cardDetails.styles.fontFamily,
    fontSize:
      props.cardDetails.styles.fontSize === "default"
        ? "var(--fontSize-body-fontSize)"
        : props.cardDetails.styles.fontSize,
    fontWeight:
      props.cardDetails.styles.fontWeight === "default"
        ? "var(--fontWeight-body-fontWeight)"
        : props.cardDetails.styles.fontWeight,
    fontStyle:
      props.cardDetails.styles.fontStyle === "default"
        ? "var(--fontStyle-body-fontStyle)"
        : props.cardDetails.styles.fontStyle,
    textTransform:
      props.cardDetails.styles.textTransform === "default"
        ? "var(--textTransform-body-textTransform)"
        : props.cardDetails.styles.textTransform,
  };
  const cardCtaStyles =
    props.cardCta.styles.color?.selectedColor === "default"
      ? {
          ...props.cardCta.styles,
          color: {
            selectedColor: props.section.backgroundColor.contrastingColor,
            contrastingColor: props.section.backgroundColor.selectedColor,
          },
        }
      : props.cardCta.styles;
  const paddingBlock =
    props.section.styles.verticalPadding === "default"
      ? "var(--padding-pageSection-verticalPadding)"
      : props.section.styles.verticalPadding;
  const nearbyDocs = data?.response?.docs ?? [];
  const nearbyLocationsPending =
    enableNearbyLocations && status === "pending";
  const hasNearbyLocations =
    status === "success" && nearbyDocs.length > 0;
  let mapboxApiKey = streamDocument._env?.YEXT_MAPBOX_API_KEY;

  if (
    iframe?.contentDocument &&
    streamDocument._env?.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY
  ) {
    mapboxApiKey =
      streamDocument._env.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY;
  }

  const hasMap = props.puck.isEditing || Boolean(mapboxApiKey);
  const showNearbyLocationsArea =
    props.puck.isEditing || nearbyLocationsPending || hasNearbyLocations;

  if (!hasMap && !showNearbyLocationsArea) {
    return <></>;
  }

  return (
    <AnalyticsScopeProvider
      name={`CommunityFinanceNearbyLocations${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <section
          className="yext-community-finance-nearby-locations border-t border-current/10"
          style={{
            ...getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            ),
            paddingBlock,
          }}
        >
          <style>{`
              .community-finance-nearby-map .mapbox-static-map-shell,
              .community-finance-nearby-map .mapbox-static-map-picture,
              .community-finance-nearby-map .mapbox-static-map-image {
                height: 100%;
                width: 100%;
              }

              .community-finance-nearby-map .mapbox-static-map-image {
                object-fit: cover;
                object-position: center;
              }
            `}</style>
          <div
            className="mx-auto px-5 md:px-8"
            style={{
              maxWidth: FINANCE_SECTION_MAX_WIDTH,
            }}
          >
            {showNearbyLocationsArea ? (
              <div className="max-w-[780px]">
              <EntityField
                  displayName="Eyebrow"
                  fieldId={props.eyebrow.text.field}
                  constantValueEnabled={props.eyebrow.text.constantValueEnabled}
                >
                  <Background
                    background={props.eyebrow.backgroundColor}
                    className="mb-3 inline-flex items-center rounded-full px-3 py-1.5"
                    style={{
                      ...getSurfaceColorStyle(
                        props.eyebrow.backgroundColor,
                        streamDocument,
                      ),
                      ...(eyebrowColor ? { color: eyebrowColor } : {}),
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
                }}
              >
                {resolveComponentData(
                  props.eyebrow.text,
                  locale,
                  streamDocument,
                ) || ""}
              </Background>
              </EntityField>
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <h2
                className="m-0"
                style={{
                  color: headingColor,
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
              </h2>
              </EntityField>
                <EntityField
                  displayName="Body"
                  fieldId={props.body.text.field}
                  constantValueEnabled={props.body.text.constantValueEnabled}
                >
                  <div
                className="community-finance-nearby-section-body mt-3"
                style={{
                  color: sectionForegroundColor,
                  fontFamily:
                    props.body.styles.fontFamily === "default"
                      ? undefined
                      : props.body.styles.fontFamily,
                  fontSize:
                    props.body.styles.fontSize === "default"
                      ? undefined
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
                  color: props.body.fontColor,
                })}
              </div>
              </EntityField>
              </div>
            ) : null}
            {hasMap ? (
              <EntityField
                displayName="Map"
                fieldId={props.map.coordinate.field}
                constantValueEnabled={props.map.coordinate.constantValueEnabled}
              >
              <div className="community-finance-nearby-map relative mt-8 h-[220px] overflow-hidden rounded-image-borderRadius md:h-[320px]">
                <MapboxStaticMapComponent
                  id={`${props.id}-map`}
                  puck={props.puck}
                  coordinate={props.map.coordinate}
                  mapStyle={props.map.mapStyle}
                  height={props.map.height}
                  zoom={props.map.zoom}
                />
              </div>
              </EntityField>
            ) : null}
            {nearbyLocationsPending ? (
              <p
                className="mt-6"
                style={{ color: sectionForegroundColor }}
              >
                {t("loadingNearbyLocations", "Loading nearby locations")}
              </p>
            ) : null}
            {props.puck.isEditing &&
            !nearbyLocationsPending &&
            !hasNearbyLocations ? (
              <p
                className="mt-6"
                style={{ color: sectionForegroundColor }}
              >
                {t(
                  "noNearbyLocationsFoundForThisLocation",
                  "No nearby locations found for this location",
                )}
              </p>
            ) : null}
            {hasNearbyLocations ? (
              <EntityField
                displayName="Nearby Locations"
                fieldId={props.map.coordinate.field}
                constantValueEnabled={props.map.coordinate.constantValueEnabled}
              >
              <div className="mt-8 grid gap-8 xl:grid-cols-3">
                {nearbyDocs.map((locationData, index) => {
                  const mergedDocument = mergeMeta(
                    locationData,
                    streamDocument,
                  );
                  const resolvedUrl = resolveUrlTemplate(
                    mergedDocument,
                    relativePrefixToRoot ?? "",
                  );
                  const directionsUrl =
                    locationData.yextDisplayCoordinate?.latitude !==
                      undefined &&
                    locationData.yextDisplayCoordinate?.longitude !== undefined
                      ? (getDirections(
                          locationData.address,
                          undefined,
                          undefined,
                          undefined,
                          {
                            latitude:
                              locationData.yextDisplayCoordinate.latitude,
                            longitude:
                              locationData.yextDisplayCoordinate.longitude,
                          },
                        ) ?? getDirections(locationData.address))
                      : getDirections(locationData.address);
                  const distance = haversineMiles(
                    streamDocument.yextDisplayCoordinate,
                    locationData.yextDisplayCoordinate,
                  );
                  const normalizedPhones = (props.phones.items ?? [])
                    .map((item) => {
                      const resolvedNumber = resolveComponentData(
                        item.number,
                        locale,
                        mergedDocument,
                      );
                      const normalizedNumber =
                        typeof resolvedNumber === "string"
                          ? resolvedNumber.trim()
                          : "";

                      if (!normalizedNumber) {
                        return null;
                      }

                      return {
                        label: item.label?.trim() || "",
                        formatted: formatPhone(
                          normalizedNumber,
                          props.phones.phoneFormat,
                        ),
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

                  return (
                    <article
                      key={locationData.id ?? locationData.name ?? index}
                    >
                      <h4
                        className="m-0"
                        style={{
                          color: cardTitleColor,
                          fontFamily:
                            props.cardTitle.styles.fontFamily === "default"
                              ? "var(--fontFamily-h4-fontFamily)"
                              : props.cardTitle.styles.fontFamily,
                          fontSize:
                            props.cardTitle.styles.fontSize === "default"
                              ? "var(--fontSize-h4-fontSize)"
                              : props.cardTitle.styles.fontSize,
                          fontWeight:
                            props.cardTitle.styles.fontWeight === "default"
                              ? "var(--fontWeight-h4-fontWeight)"
                              : props.cardTitle.styles.fontWeight,
                          fontStyle:
                            props.cardTitle.styles.fontStyle === "default"
                              ? "var(--fontStyle-h4-fontStyle)"
                              : props.cardTitle.styles.fontStyle,
                          textTransform:
                            props.cardTitle.styles.textTransform === "default"
                              ? "var(--textTransform-h4-textTransform)"
                              : props.cardTitle.styles.textTransform,
                        }}
                      >
                        <Link
                          cta={{
                            link: resolvedUrl,
                            linkType: "URL",
                          }}
                          className=""
                          style={{ color: "inherit" }}
                        >
                          {locationData.name}
                        </Link>
                      </h4>
                      <div className="mt-3 grid gap-3">
                        <div className="grid gap-1.5">
                          {formatAddress(locationData.address).map((line) => (
                            <p key={line} style={cardAddressTextStyle}>
                              {line}
                            </p>
                          ))}
                        </div>
                        {normalizedPhones.map((phone, phoneIndex) => (
                            <EntityField
                              key={`${phone.original}-${phoneIndex}`}
                              displayName="Location Phone"
                              fieldId={phone.entityField.field}
                              constantValueEnabled={
                                phone.entityField.constantValueEnabled
                              }
                            >
                              {props.phones.includeHyperlink ? (
                                <Link
                              cta={{
                                link: phone.digits,
                                linkType: "PHONE",
                              }}
                              className="inline-flex items-center gap-2"
                              style={{ color: phoneColor }}
                            >
                              <>
                                {props.phones.showIcon ? <FaPhone /> : null}
                                <span>
                                  {phone.label
                                    ? `${phone.label} ${phone.formatted}`
                                    : phone.formatted}
                                </span>
                              </>
                            </Link>
                          ) : (
                            <span
                              className="inline-flex items-center gap-2"
                              style={{ color: phoneColor }}
                            >
                              {props.phones.showIcon ? <FaPhone /> : null}
                              <span>
                                {phone.label
                                  ? `${phone.label} ${phone.formatted}`
                                  : phone.formatted}
                              </span>
                            </span>
                          )}
                            </EntityField>
                          )
                        )}
                        {distance !== null ? (
                          <p style={cardDetailsTextStyle}>
                            <strong>
                              {t(
                                "locatedMilesFromLocation",
                                "Located {{distance}} miles from {{location}}",
                                {
                                  distance: distance.toFixed(1),
                                  location:
                                    streamDocument.name ??
                                    t("thisLocation", "this location"),
                                },
                              )}
                            </strong>
                          </p>
                        ) : null}
                      </div>
                      {directionsUrl ? (
                        <EntityField
                          displayName={`Location ${index + 1} CTA`}
                          fieldId={props.cardCta.data.cta.field}
                          constantValueEnabled={
                            props.cardCta.data.cta.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={{
                              data: {
                                actionType: "link",
                                cta: {
                                  field: "",
                                  constantValue: {
                                    ctaType: "textAndLink",
                                    label: {
                                      defaultValue: "Get directions",
                                    },
                                    link: {
                                      defaultValue: directionsUrl,
                                    },
                                    linkType: "URL",
                                  },
                                  constantValueEnabled: true,
                                  selectedType: "textAndLink",
                                },
                                openInNewTab: false,
                              },
                              styles: cardCtaStyles,
                            }}
                            label="Get directions"
                            eventName={`getDirections${index}`}
                            className={
                              props.cardCta.styles.variant === "link"
                                ? "community-finance-nearby-card-cta mt-3 inline-flex "
                                : "community-finance-nearby-card-cta mt-3 inline-flex items-center justify-center px-5 py-3"
                            }
                          />
                        </EntityField>
                      ) : null}
                    </article>
                  );
                })}
              </div>
              </EntityField>
            ) : null}
          </div>
        </section>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CommunityFinanceNearbyLocations: YextComponentConfig<CommunityFinanceNearbyLocationsProps> =
  {
    label: msg("components.nearbyLocations", "Nearby Locations Section"),
    fields: CommunityFinanceNearbyLocationsFields,
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
          constantValue: { defaultValue: "Nearby Locations" },
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
            defaultValue: "Find Additional [[name]] Locations",
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
              "Explore nearby [[address.city]]-area offices for wealth management, retirement planning, and advisory conversations.",
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
      cardTitle: {
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      cardAddress: {
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      cardDetails: {
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      phones: {
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            } as YextEntityField<string>,
            label: "",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
        showIcon: false,
        color: undefined,
      },
      cardCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValue: {
              ctaType: "textAndLink",
              label: {
                defaultValue: "Get directions",
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
      map: {
        coordinate: {
          field: "yextDisplayCoordinate",
          constantValue: {
            latitude: 0,
            longitude: 0,
          },
          constantValueEnabled: false,
        },
        mapStyle: "streets-v12",
        zoom: 10,
        height: "100%",
      },
      radius: 10,
      limit: 3,
    },
    render: CommunityFinanceNearbyLocationsComponent,
  };

export const config: SectionConfig = {
  id: "CommunityFinanceNearbyLocations",
  displayName: "Nearby Locations Section",
  description: "Nearby Locations",
  pageSetTypes: ["ENTITY"],
};
