export interface City {
  name: string;
  country: string;
  timezone: string;
  id: string;
  coordinates: Coordinates;
}

export interface CitySearchResponse {
  total_count: number;
  results: CityDetails[];
}

export interface CityDetails {
  geoname_id: string;
  name: string;
  ascii_name: string;
  alternate_names: string[];
  feature_class: string;
  feature_code: string;
  country_code: string;
  cou_name_en: string;
  country_code_2?: any;
  admin1_code: string;
  admin2_code?: string;
  admin3_code?: string;
  admin4_code?: any;
  population: number;
  elevation?: any;
  dem: number;
  timezone: string;
  modification_date: string;
  label_en: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  lon: number;
  lat: number;
}
