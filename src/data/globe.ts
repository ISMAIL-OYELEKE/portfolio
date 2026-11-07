/**
 * Data for the "Where my builds run" globe on the Projects page.
 *
 * Coordinates are city level (one decimal is plenty for a globe this size).
 * Only projects whose AWS region is stated in their case study are pinned.
 */

export const home = { name: 'Lagos', lat: 6.5, lon: 3.4 };

/** The S3 bucket behind ismailoyeleke.com (see the portfolio case study). */
export const origin = { name: 'S3 bucket', region: 'us-east-1', lat: 38.9, lon: -77.4 };

export const builds: { slug: string; region: string; city: string; lat: number; lon: number }[] = [
  { slug: 'kestrel-loan-platform', region: 'eu-west-1', city: 'Ireland', lat: 53.3, lon: -6.3 },
  { slug: 'enterprise-staff-portal', region: 'eu-west-2', city: 'London', lat: 51.5, lon: -0.1 },
  { slug: 'portfolio-on-s3-cloudfront-route-53', region: 'us-east-1', city: 'N. Virginia', lat: 38.9, lon: -77.4 },
  { slug: 'highly-available-multi-tier-web-application', region: 'us-east-1', city: 'N. Virginia', lat: 38.9, lon: -77.4 },
];

/** A selection of AWS regions, for the "All AWS regions" view. */
export const awsRegions: [string, number, number][] = [
  ['us-east-1', 38.9, -77.4], ['us-east-2', 40.0, -83.0], ['us-west-1', 37.4, -122.0], ['us-west-2', 45.6, -121.2],
  ['ca-central-1', 45.5, -73.6], ['sa-east-1', -23.5, -46.6], ['eu-west-1', 53.3, -6.3], ['eu-west-2', 51.5, -0.1],
  ['eu-west-3', 48.9, 2.4], ['eu-central-1', 50.1, 8.7], ['eu-north-1', 59.3, 18.1], ['eu-south-1', 45.5, 9.2],
  ['af-south-1', -33.9, 18.4], ['me-south-1', 26.1, 50.6], ['ap-south-1', 19.1, 72.9], ['ap-southeast-1', 1.4, 103.8],
  ['ap-southeast-2', -33.9, 151.2], ['ap-northeast-1', 35.7, 139.7], ['ap-northeast-2', 37.6, 127.0], ['ap-east-1', 22.3, 114.2],
];

/**
 * CloudFront names the edge that answered in the x-amz-cf-pop header, which
 * starts with the nearest airport code (for example LHR61-C2). This maps
 * those codes to their city.
 */
export const airports: Record<string, [string, number, number]> = {
  LHR: ['London', 51.5, -0.1], MAN: ['Manchester', 53.5, -2.2], DUB: ['Dublin', 53.3, -6.3], CDG: ['Paris', 48.9, 2.4],
  MRS: ['Marseille', 43.3, 5.4], FRA: ['Frankfurt', 50.1, 8.7], MUC: ['Munich', 48.1, 11.6], DUS: ['Düsseldorf', 51.2, 6.8],
  HAM: ['Hamburg', 53.6, 10.0], BER: ['Berlin', 52.5, 13.4], TXL: ['Berlin', 52.5, 13.4], AMS: ['Amsterdam', 52.4, 4.9],
  BRU: ['Brussels', 50.8, 4.4], MAD: ['Madrid', 40.4, -3.7], BCN: ['Barcelona', 41.4, 2.2], LIS: ['Lisbon', 38.7, -9.1],
  MXP: ['Milan', 45.5, 9.2], FCO: ['Rome', 41.9, 12.5], PMO: ['Palermo', 38.1, 13.4], ZRH: ['Zurich', 47.4, 8.5],
  VIE: ['Vienna', 48.2, 16.4], PRG: ['Prague', 50.1, 14.4], WAW: ['Warsaw', 52.2, 21.0], ARN: ['Stockholm', 59.3, 18.1],
  CPH: ['Copenhagen', 55.7, 12.6], OSL: ['Oslo', 59.9, 10.8], HEL: ['Helsinki', 60.2, 24.9], ATH: ['Athens', 38.0, 23.7],
  SOF: ['Sofia', 42.7, 23.3], OTP: ['Bucharest', 44.4, 26.1], BUD: ['Budapest', 47.5, 19.0], ZAG: ['Zagreb', 45.8, 16.0],
  IST: ['Istanbul', 41.0, 29.0], TLV: ['Tel Aviv', 32.1, 34.8], DXB: ['Dubai', 25.2, 55.3], FJR: ['Fujairah', 25.1, 56.3],
  BAH: ['Bahrain', 26.2, 50.6], DOH: ['Doha', 25.3, 51.5], JED: ['Jeddah', 21.5, 39.2], RUH: ['Riyadh', 24.7, 46.7],
  CAI: ['Cairo', 30.0, 31.2], LOS: ['Lagos', 6.5, 3.4], NBO: ['Nairobi', -1.3, 36.8], JNB: ['Johannesburg', -26.2, 28.0],
  CPT: ['Cape Town', -33.9, 18.4], IAD: ['Washington DC', 38.9, -77.4], JFK: ['New York', 40.7, -74.0],
  EWR: ['Newark', 40.7, -74.2], BOS: ['Boston', 42.4, -71.1], PHL: ['Philadelphia', 40.0, -75.2], ATL: ['Atlanta', 33.7, -84.4],
  MIA: ['Miami', 25.8, -80.2], ORD: ['Chicago', 41.9, -87.6], DFW: ['Dallas', 32.8, -96.8], IAH: ['Houston', 29.8, -95.4],
  DEN: ['Denver', 39.7, -105.0], PHX: ['Phoenix', 33.4, -112.1], LAX: ['Los Angeles', 34.1, -118.2],
  SFO: ['San Francisco', 37.8, -122.4], SJC: ['San Jose', 37.3, -121.9], SEA: ['Seattle', 47.6, -122.3],
  MSP: ['Minneapolis', 45.0, -93.3], YUL: ['Montreal', 45.5, -73.6], YTO: ['Toronto', 43.7, -79.4], YYZ: ['Toronto', 43.7, -79.4],
  YVR: ['Vancouver', 49.3, -123.1], MEX: ['Mexico City', 19.4, -99.1], QRO: ['Querétaro', 20.6, -100.4],
  GRU: ['São Paulo', -23.5, -46.6], GIG: ['Rio de Janeiro', -22.9, -43.2], EZE: ['Buenos Aires', -34.6, -58.4],
  SCL: ['Santiago', -33.4, -70.7], BOG: ['Bogotá', 4.7, -74.1], LIM: ['Lima', -12.0, -77.0], BOM: ['Mumbai', 19.1, 72.9],
  DEL: ['New Delhi', 28.6, 77.2], MAA: ['Chennai', 13.1, 80.3], BLR: ['Bengaluru', 13.0, 77.6], HYD: ['Hyderabad', 17.4, 78.5],
  CCU: ['Kolkata', 22.6, 88.4], SIN: ['Singapore', 1.4, 103.8], KUL: ['Kuala Lumpur', 3.1, 101.7], BKK: ['Bangkok', 13.8, 100.5],
  CGK: ['Jakarta', -6.2, 106.8], MNL: ['Manila', 14.6, 121.0], HKG: ['Hong Kong', 22.3, 114.2], TPE: ['Taipei', 25.0, 121.6],
  NRT: ['Tokyo', 35.7, 139.7], HND: ['Tokyo', 35.7, 139.7], KIX: ['Osaka', 34.7, 135.5], ICN: ['Seoul', 37.6, 127.0],
  SYD: ['Sydney', -33.9, 151.2], MEL: ['Melbourne', -37.8, 145.0], PER: ['Perth', -31.9, 115.9], BNE: ['Brisbane', -27.5, 153.0],
  AKL: ['Auckland', -36.8, 174.8],
};

/**
 * Rough visitor location from the device's time zone (no lookup, nothing
 * sent). Zones not listed fall back to the edge city.
 */
export const zones: Record<string, [string, number, number]> = {
  'Africa/Lagos': ['Lagos', 6.5, 3.4], 'Africa/Accra': ['Accra', 5.6, -0.2], 'Africa/Abidjan': ['Abidjan', 5.3, -4.0],
  'Africa/Dakar': ['Dakar', 14.7, -17.5], 'Africa/Nairobi': ['Nairobi', -1.3, 36.8], 'Africa/Kampala': ['Kampala', 0.3, 32.6],
  'Africa/Kigali': ['Kigali', -1.9, 30.1], 'Africa/Addis_Ababa': ['Addis Ababa', 9.0, 38.7], 'Africa/Cairo': ['Cairo', 30.0, 31.2],
  'Africa/Casablanca': ['Casablanca', 33.6, -7.6], 'Africa/Tunis': ['Tunis', 36.8, 10.2], 'Africa/Algiers': ['Algiers', 36.8, 3.1],
  'Africa/Johannesburg': ['Johannesburg', -26.2, 28.0], 'Africa/Douala': ['Douala', 4.1, 9.7], 'Africa/Kinshasa': ['Kinshasa', -4.3, 15.3],
  'Africa/Luanda': ['Luanda', -8.8, 13.2], 'Africa/Dar_es_Salaam': ['Dar es Salaam', -6.8, 39.3], 'Africa/Lusaka': ['Lusaka', -15.4, 28.3],
  'Africa/Harare': ['Harare', -17.8, 31.0], 'Africa/Maputo': ['Maputo', -26.0, 32.6],
  'Europe/London': ['London', 51.5, -0.1], 'Europe/Dublin': ['Dublin', 53.3, -6.3], 'Europe/Lisbon': ['Lisbon', 38.7, -9.1],
  'Europe/Madrid': ['Madrid', 40.4, -3.7], 'Europe/Paris': ['Paris', 48.9, 2.4], 'Europe/Brussels': ['Brussels', 50.8, 4.4],
  'Europe/Amsterdam': ['Amsterdam', 52.4, 4.9], 'Europe/Berlin': ['Berlin', 52.5, 13.4], 'Europe/Zurich': ['Zurich', 47.4, 8.5],
  'Europe/Rome': ['Rome', 41.9, 12.5], 'Europe/Vienna': ['Vienna', 48.2, 16.4], 'Europe/Prague': ['Prague', 50.1, 14.4],
  'Europe/Warsaw': ['Warsaw', 52.2, 21.0], 'Europe/Copenhagen': ['Copenhagen', 55.7, 12.6], 'Europe/Stockholm': ['Stockholm', 59.3, 18.1],
  'Europe/Oslo': ['Oslo', 59.9, 10.8], 'Europe/Helsinki': ['Helsinki', 60.2, 24.9], 'Europe/Athens': ['Athens', 38.0, 23.7],
  'Europe/Bucharest': ['Bucharest', 44.4, 26.1], 'Europe/Budapest': ['Budapest', 47.5, 19.0], 'Europe/Istanbul': ['Istanbul', 41.0, 29.0],
  'Europe/Kyiv': ['Kyiv', 50.5, 30.5], 'Europe/Kiev': ['Kyiv', 50.5, 30.5], 'Europe/Moscow': ['Moscow', 55.8, 37.6],
  'Asia/Dubai': ['Dubai', 25.2, 55.3], 'Asia/Qatar': ['Doha', 25.3, 51.5], 'Asia/Riyadh': ['Riyadh', 24.7, 46.7],
  'Asia/Jerusalem': ['Jerusalem', 31.8, 35.2], 'Asia/Karachi': ['Karachi', 24.9, 67.0], 'Asia/Kolkata': ['India', 20.6, 78.9],
  'Asia/Calcutta': ['India', 20.6, 78.9], 'Asia/Dhaka': ['Dhaka', 23.8, 90.4], 'Asia/Singapore': ['Singapore', 1.4, 103.8],
  'Asia/Kuala_Lumpur': ['Kuala Lumpur', 3.1, 101.7], 'Asia/Bangkok': ['Bangkok', 13.8, 100.5], 'Asia/Jakarta': ['Jakarta', -6.2, 106.8],
  'Asia/Manila': ['Manila', 14.6, 121.0], 'Asia/Hong_Kong': ['Hong Kong', 22.3, 114.2], 'Asia/Shanghai': ['Shanghai', 31.2, 121.5],
  'Asia/Taipei': ['Taipei', 25.0, 121.6], 'Asia/Seoul': ['Seoul', 37.6, 127.0], 'Asia/Tokyo': ['Tokyo', 35.7, 139.7],
  'Australia/Sydney': ['Sydney', -33.9, 151.2], 'Australia/Melbourne': ['Melbourne', -37.8, 145.0], 'Australia/Perth': ['Perth', -31.9, 115.9],
  'Australia/Brisbane': ['Brisbane', -27.5, 153.0], 'Pacific/Auckland': ['Auckland', -36.8, 174.8],
  'America/New_York': ['New York', 40.7, -74.0], 'America/Toronto': ['Toronto', 43.7, -79.4], 'America/Chicago': ['Chicago', 41.9, -87.6],
  'America/Denver': ['Denver', 39.7, -105.0], 'America/Phoenix': ['Phoenix', 33.4, -112.1], 'America/Los_Angeles': ['Los Angeles', 34.1, -118.2],
  'America/Vancouver': ['Vancouver', 49.3, -123.1], 'America/Halifax': ['Halifax', 44.6, -63.6], 'America/Mexico_City': ['Mexico City', 19.4, -99.1],
  'America/Bogota': ['Bogotá', 4.7, -74.1], 'America/Lima': ['Lima', -12.0, -77.0], 'America/Sao_Paulo': ['São Paulo', -23.5, -46.6],
  'America/Argentina/Buenos_Aires': ['Buenos Aires', -34.6, -58.4], 'America/Buenos_Aires': ['Buenos Aires', -34.6, -58.4],
  'America/Santiago': ['Santiago', -33.4, -70.7], 'America/Detroit': ['Detroit', 42.3, -83.0], 'Pacific/Honolulu': ['Honolulu', 21.3, -157.9],
};
