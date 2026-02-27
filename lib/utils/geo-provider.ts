/**
 * Client-safe: determine geo provider for a country.
 * 2GIS: Eurasia, Middle East | Google: Rest of world
 */
const TWO_GIS_REGIONS = new Set([
  "RU", "KZ", "UA", "BY", "UZ", "GE", "AZ", "AM", "KG", "TJ", "TM", "MD",
  "AE", "SA", "QA", "KW", "BH", "OM", "YE", "IQ", "IR", "JO", "LB", "SY", "PS",
  "CY", "TR",
]);

export function getGeoProviderForCountry(countryCode: string): "2gis" | "google" {
  return TWO_GIS_REGIONS.has(countryCode.toUpperCase()) ? "2gis" : "google";
}
