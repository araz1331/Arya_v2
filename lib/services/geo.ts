"use server";

import { getGeoProviderForCountry } from "@/lib/utils/geo-provider";

/**
 * Geo service for Sales Arya territory setup.
 * Routes by region: 2GIS (Eurasia, Middle East) | Google Maps (rest of world)
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  provider: "2gis" | "google";
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  types?: string[];
  provider: "2gis" | "google";
}

export interface TargetGeoArea {
  name: string;
  provider: "2gis" | "google";
  countryCodes: string[];
  cities: string[];
  centerLat?: number;
  centerLng?: number;
  radiusKm?: number;
}

/**
 * Geocode address to coordinates.
 * Uses 2GIS for Eurasia/MENA, Google for rest.
 */
export async function geocode(
  address: string,
  countryCode?: string
): Promise<GeocodeResult | null> {
  const provider = countryCode
    ? getGeoProviderForCountry(countryCode)
    : "google";

  if (provider === "2gis") {
    return geocode2GIS(address);
  }
  return geocodeGoogle(address);
}

async function geocode2GIS(address: string): Promise<GeocodeResult | null> {
  const key = process.env.TWO_GIS_API_KEY;
  if (!key) {
    console.warn("TWO_GIS_API_KEY not set");
    return null;
  }

  const url = new URL("https://catalog.api.2gis.com/3.0/items/geocode");
  url.searchParams.set("q", address);
  url.searchParams.set("fields", "items.point");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json();
  const item = data.result?.items?.[0];
  if (!item?.point) return null;

  return {
    lat: item.point.lat,
    lng: item.point.lon,
    formattedAddress: item.full_name || address,
    provider: "2gis",
  };
}

async function geocodeGoogle(address: string): Promise<GeocodeResult | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.warn("GOOGLE_MAPS_API_KEY not set");
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json();
  const result = data.results?.[0];
  if (!result?.geometry?.location) return null;

  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address || address,
    provider: "google",
  };
}

/**
 * Search places (businesses, organizations) in a location.
 */
export async function searchPlaces(
  query: string,
  options: {
    lat?: number;
    lng?: number;
    radiusM?: number;
    countryCode?: string;
    city?: string;
  }
): Promise<PlaceSearchResult[]> {
  const provider = options.countryCode
    ? getGeoProviderForCountry(options.countryCode)
    : "google";

  if (provider === "2gis") {
    return searchPlaces2GIS(query, options);
  }
  return searchPlacesGoogle(query, options);
}

async function searchPlaces2GIS(
  query: string,
  options: { lat?: number; lng?: number; radiusM?: number; city?: string }
): Promise<PlaceSearchResult[]> {
  const key = process.env.TWO_GIS_API_KEY;
  if (!key) return [];

  const url = new URL("https://catalog.api.2gis.com/3.0/items");
  url.searchParams.set("q", query);
  url.searchParams.set("key", key);
  if (options.city) url.searchParams.set("region", options.city);
  if (options.lat != null && options.lng != null) {
    url.searchParams.set("point", `${options.lng},${options.lat}`);
    if (options.radiusM) url.searchParams.set("radius", String(options.radiusM));
  }

  const res = await fetch(url.toString());
  if (!res.ok) return [];

  const data = await res.json();
  const items = data.result?.items ?? [];

  return items.slice(0, 20).map((item: Record<string, unknown>) => ({
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
    address: String(item.address_name ?? ""),
    lat: Number((item.point as { lat?: number })?.lat ?? 0),
    lng: Number((item.point as { lon?: number })?.lon ?? 0),
    provider: "2gis" as const,
  }));
}

async function searchPlacesGoogle(
  query: string,
  options: { lat?: number; lng?: number; radiusM?: number }
): Promise<PlaceSearchResult[]> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return [];

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query);
  url.searchParams.set("key", key);
  if (options.lat != null && options.lng != null) {
    url.searchParams.set("location", `${options.lat},${options.lng}`);
    if (options.radiusM) url.searchParams.set("radius", String(options.radiusM));
  }

  const res = await fetch(url.toString());
  if (!res.ok) return [];

  const data = await res.json();
  const results = data.results ?? [];

  return results.slice(0, 20).map((r: Record<string, unknown>) => ({
    id: String(r.place_id ?? ""),
    name: String(r.name ?? ""),
    address: String(r.formatted_address ?? ""),
    lat: (r.geometry as { location?: { lat: number; lng: number } })?.location?.lat ?? 0,
    lng: (r.geometry as { location?: { lat: number; lng: number } })?.location?.lng ?? 0,
    provider: "google" as const,
  }));
}

