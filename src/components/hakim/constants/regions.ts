export const DEFAULT_LOCATION = { lat: 9.0320, lng: 38.7469 };

export const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Addis Ababa": { lat: 9.0320, lng: 38.7469 },
  "Oromia": { lat: 8.5400, lng: 39.2700 },
  "Amhara": { lat: 11.6000, lng: 37.3800 },
  "Tigray": { lat: 14.0000, lng: 38.8000 },
  "SNNPR": { lat: 7.0000, lng: 38.0000 },
  "Somali": { lat: 8.0000, lng: 44.0000 },
  "Afar": { lat: 12.0000, lng: 41.0000 },
  "Djibouti": { lat: 11.5886, lng: 43.1456 },
  "Harari": { lat: 9.3100, lng: 42.1300 },
  "Dire Dawa": { lat: 9.6000, lng: 41.8500 },
  "Benishangul-Gumuz": { lat: 10.5000, lng: 34.5000 },
  "Gambela": { lat: 8.2500, lng: 34.5000 },
};

export const REGION_AMBULANCE_DATA: Record<string, {
  primaryNumber: string;
  primaryName: string;
  secondaryNumber?: string;
  secondaryName?: string;
  redCrossNumber: string;
}> = {
  "Addis Ababa": {
    primaryNumber: "939",
    primaryName: "Addis Ababa Fire & Emergency",
    secondaryNumber: "907",
    secondaryName: "Red Cross Ambulance",
    redCrossNumber: "907",
  },
  "Oromia": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Amhara": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Tigray": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "SNNPR": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Somali": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Afar": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Harari": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Dire Dawa": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Benishangul-Gumuz": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Gambela": {
    primaryNumber: "907",
    primaryName: "Red Cross Ambulance",
    secondaryNumber: "911",
    secondaryName: "General Emergency",
    redCrossNumber: "907",
  },
  "Djibouti": {
    primaryNumber: "18",
    primaryName: "Emergency Services",
    redCrossNumber: "907",
  },
};
