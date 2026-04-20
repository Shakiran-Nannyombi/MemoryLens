export interface PersonMemory {
  id: string;
  name: string;
  relationship: string;
  note: string;
  image_url?: string;
  face_descriptor?: number[];
  created_at: string;
}

export interface ObjectMemory {
  id: string;
  coco_class: string;
  custom_label: string;
  created_at: string;
}

export interface PlaceMemory {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius_meters: number;
  created_at: string;
}

export interface SpeechEvent {
  id: string;
  transcript: string;
  extracted_names: string[];
  is_verified: boolean;
  created_at: string;
}
