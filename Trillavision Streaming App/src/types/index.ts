/**
 * Scene configuration interface
 * @interface Scene
 */
export interface Scene {
  id: string;
  name: string;
  layout: Layout;
  sources: Source[];
  active: boolean;
}

/**
 * Layout configuration interface
 * @interface Layout
 */
export interface Layout {
  id: string;
  name: string;
  template: string;
}

/**
 * Source configuration interface
 * @interface Source
 */
export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url?: string;
  settings: Record<string, any>;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  connection?: string;
  deviceType?: string;
}

/**
 * Source type enum
 * @enum SourceType
 */
export enum SourceType {
  CAMERA = 'camera',
  SCREEN = 'screen',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  BROWSER = 'browser'
}

/**
 * Stream settings interface
 * @interface StreamSettings
 */
export interface StreamSettings {
  platform: StreamPlatform;
  quality: StreamQuality;
  key: string;
  title: string;
  description: string;
  isPrivate: boolean;
}

/**
 * Stream platform enum
 * @enum StreamPlatform
 */
export enum StreamPlatform {
  YOUTUBE = 'youtube',
  TWITCH = 'twitch',
  FACEBOOK = 'facebook',
  CUSTOM = 'custom'
}

/**
 * Stream quality enum
 * @enum StreamQuality
 */
export enum StreamQuality {
  LOW = '720p30',
  MEDIUM = '1080p30',
  HIGH = '1080p60',
  ULTRA = '4K'
}

/**
 * Stream status enum
 * @enum StreamStatus
 */
export enum StreamStatus {
  OFFLINE = 'offline',
  CONNECTING = 'connecting',
  LIVE = 'live',
  ERROR = 'error'
}

/**
 * Audio processor type enum
 */
export enum AudioProcessorType {
  COMPRESSOR = 'compressor',
  LIMITER = 'limiter',
  EQUALIZER = 'equalizer',
  GATE = 'gate',
  DEESSER = 'deesser',
  VST = 'vst'
}

/**
 * Audio processor interface
 */
export interface AudioProcessor {
  id: string;
  type: AudioProcessorType;
  enabled: boolean;
  settings: Record<string, any>;
  vstPlugin?: VSTPlugin;
}

/**
 * VST plugin interface
 */
export interface VSTPlugin {
  id: string;
  name: string;
  path: string;
  type: 'vst2' | 'vst3';
  category: 'effect' | 'instrument';
  manufacturer: string;
  version: string;
  isLoaded: boolean;
  parameters: VSTParameter[];
}

/**
 * VST parameter interface
 */
export interface VSTParameter {
  id: number;
  name: string;
  value: number;
  defaultValue: number;
  minValue: number;
  maxValue: number;
  label?: string;
  isAutomatable: boolean;
}

/**
 * Audio channel interface
 */
export interface AudioChannel {
  id: string;
  name: string;
  deviceId: string;
  gain: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  processors: AudioProcessor[];
  meter?: {
    level: number;
    peak: number;
    reduction: number;
  };
}

/**
 * Audio routing interface
 */
export interface AudioRoute {
  id: string;
  sourceId: string;
  destinationId: string;
  type: 'direct' | 'send' | 'sidechain';
  gain: number;
  enabled: boolean;
}

/**
 * Audio bus interface
 */
export interface AudioBus {
  id: string;
  name: string;
  color: string;
  channels: string[];
  processors: AudioProcessor[];
  meter?: {
    level: number;
    peak: number;
    reduction: number;
  };
}

/**
 * Compressor settings interface
 * @interface CompressorSettings
 */
export interface CompressorSettings {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
  knee: number;
  makeupGain: number;
}

/**
 * Limiter settings interface
 * @interface LimiterSettings
 */
export interface LimiterSettings {
  threshold: number;
  release: number;
}

/**
 * Gate settings interface
 * @interface GateSettings
 */
export interface GateSettings {
  threshold: number;
  attack: number;
  release: number;
}

/**
 * De-esser settings interface
 * @interface DeEsserSettings
 */
export interface DeEsserSettings {
  frequency: number;
  threshold: number;
  ratio: number;
}

/**
 * Equalizer band interface
 * @interface EQBand
 */
export interface EQBand {
  id: string;
  frequency: number;
  gain: number;
  Q: number;
  type: 'lowshelf' | 'highshelf' | 'peaking' | 'lowpass' | 'highpass';
}

/**
 * Equalizer settings interface
 * @interface EqualizerSettings
 */
export interface EqualizerSettings {
  bands: EQBand[];
  presets: Record<string, EQBand[]>;
}

/**
 * Brand settings interface
 * @interface BrandSettings
 */
export interface BrandSettings {
  name: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
  };
  overlays: Overlay[];
}

/**
 * Overlay interface
 * @interface Overlay
 */
export interface Overlay {
  id: string;
  name: string;
  type: OverlayType;
  content: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: Record<string, any>;
  visible: boolean;
}

/**
 * Overlay type enum
 * @enum OverlayType
 */
export enum OverlayType {
  TEXT = 'text',
  IMAGE = 'image',
  TIMER = 'timer',
  SOCIAL = 'social',
  CUSTOM = 'custom'
}

/**
 * Overlay template interface
 * @interface OverlayTemplate
 */
export interface OverlayTemplate {
  id: string;
  name: string;
  type: OverlayType;
  previewUrl: string;
  content: string;
  defaultSettings: Record<string, any>;
}

/**
 * Preset interface
 * @interface Preset
 */
export interface Preset {
  id: string;
  name: string;
  type: 'compressor' | 'limiter' | 'equalizer' | 'gate' | 'deesser' | 'channel' | 'master';
  settings: Record<string, any>;
}

/**
 * Device interface
 * @interface Device
 */
export interface Device {
  id: string;
  name: string;
  type?: string;
  connection?: string;
  isActive?: boolean;
}

/**
 * Transition type enum
 * @enum TransitionType
 */
export enum TransitionType {
  FADE = 'fade',
  CUT = 'cut',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  WIPE = 'wipe'
}

/**
 * Transition interface
 * @interface Transition
 */
export interface Transition {
  id: string;
  name: string;
  type: TransitionType;
  duration: number;
  settings: Record<string, any>;
}

/**
 * Viewer history point interface
 * @interface ViewerHistoryPoint
 */
export interface ViewerHistoryPoint {
  timestamp: string;
  count: number;
}

/**
 * Stream analytics interface
 * @interface StreamAnalytics
 */
export interface StreamAnalytics {
  viewerCount: number;
  peakViewers: number;
  averageViewers: number;
  chatMessages: number;
  engagementRate: number;
  viewerRetention: number;
  viewerHistory: ViewerHistoryPoint[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
    other: number;
  };
  geographicData: {
    country: string;
    percentage: number;
  }[];
}

/**
 * Recording configuration interface
 * @interface RecordingConfig
 */
export interface RecordingConfig {
  format: 'mp4' | 'mkv';
  quality: {
    videoBitrate: string;
    audioBitrate: string;
    fps: number;
    resolution: string;
  };
  outputPath?: string;
  filename?: string;
  separateAudioTracks: boolean;
}

/**
 * Recording information interface
 * @interface RecordingInfo
 */
export interface RecordingInfo {
  id: string;
  filename: string;
  path: string;
  format: string;
  startTime: number;
  duration: number;
  size: number;
  status: 'recording' | 'stopped' | 'error';
  error?: string;
}

/**
 * Recording state interface
 * @interface RecordingState
 */
export interface RecordingState {
  isRecording: boolean;
  currentRecording: RecordingInfo | null;
  error: string | null;
  recordings: RecordingInfo[];
}

/**
 * YouTube broadcast interface
 * @interface YouTubeBroadcast
 */
export interface YouTubeBroadcast {
  id: string;
  title: string;
  description: string;
  scheduledStartTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: 'created' | 'ready' | 'live' | 'complete' | 'error';
  privacyStatus: 'public' | 'unlisted' | 'private';
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}