export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface EditHistoryItem {
  id: string;
  image: ImageData;
  prompt: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
