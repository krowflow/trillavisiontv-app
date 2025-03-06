import { AudioChannel, AudioProcessor, AudioProcessorType, AudioRoute, VSTPlugin } from '../types';
import { vstService } from './vst-service';
import { logger, LogCategory } from '../utils/logging';

class AudioEngine {
  private static instance: AudioEngine;
  private context: AudioContext | null = null;
  private channels: Map<string, GainNode> = new Map();
  private processors: Map<string, AudioNode> = new Map();
  private routes: Map<string, AudioRoute> = new Map();
  private masterGain: GainNode | null = null;
  private analyserNodes: Map<string, AnalyserNode> = new Map();
  private meterNodes: Map<string, any> = new Map();
  private vstNodes: Map<string, VSTPlugin> = new Map();
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Web Audio API context
      this.context = new AudioContext();
      
      // Initialize master gain
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);

      // Initialize VST service
      await vstService.initialize();

      // Create master channel analyser
      const masterAnalyser = this.context.createAnalyser();
      masterAnalyser.fftSize = 2048;
      masterAnalyser.smoothingTimeConstant = 0.8;
      this.masterGain.connect(masterAnalyser);
      this.analyserNodes.set('master', masterAnalyser);

      // Create preview and program channel analysers
      const previewAnalyser = this.context.createAnalyser();
      const programAnalyser = this.context.createAnalyser();
      
      previewAnalyser.fftSize = 2048;
      programAnalyser.fftSize = 2048;
      previewAnalyser.smoothingTimeConstant = 0.8;
      programAnalyser.smoothingTimeConstant = 0.8;

      this.analyserNodes.set('preview', previewAnalyser);
      this.analyserNodes.set('program', programAnalyser);

      this.isInitialized = true;
      logger.info(LogCategory.AUDIO, 'Audio engine initialized');
    } catch (error) {
      logger.error(LogCategory.AUDIO, 'Failed to initialize audio engine', { error });
      throw error;
    }
  }

  async createChannel(channelId: string, config: Partial<AudioChannel> = {}): Promise<void> {
    if (!this.context || !this.masterGain) return;

    try {
      // Create channel gain node
      const gainNode = this.context.createGain();
      gainNode.gain.value = (config.gain || 75) / 100;
      gainNode.connect(this.masterGain);

      // Create channel analyser
      const analyser = this.context.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      gainNode.connect(analyser);

      // Store nodes
      this.channels.set(channelId, gainNode);
      this.analyserNodes.set(channelId, analyser);

      // Create processors if specified
      if (config.processors) {
        for (const processor of config.processors) {
          await this.createProcessor(channelId, processor);
        }
      }

      logger.info(LogCategory.AUDIO, 'Audio channel created', { channelId });
    } catch (error) {
      logger.error(LogCategory.AUDIO, 'Failed to create audio channel', { error });
      throw error;
    }
  }

  async createProcessor(channelId: string, processor: AudioProcessor): Promise<void> {
    if (!this.context) return;

    try {
      let processorNode: AudioNode;

      switch (processor.type) {
        case AudioProcessorType.COMPRESSOR:
          processorNode = this.context.createDynamicsCompressor();
          this.updateCompressorSettings(processorNode as DynamicsCompressorNode, processor.settings);
          break;

        case AudioProcessorType.EQUALIZER:
          processorNode = this.context.createBiquadFilter();
          this.updateEqualizerSettings(processorNode as BiquadFilterNode, processor.settings);
          break;

        case AudioProcessorType.GATE:
          // Implement custom noise gate
          processorNode = this.createNoiseGate(processor.settings);
          break;

        case AudioProcessorType.VST:
          if (processor.vstPlugin) {
            const plugin = await vstService.loadPlugin(processor.vstPlugin.id);
            if (plugin) {
              this.vstNodes.set(processor.id, plugin);
              // In a real implementation, this would create a VST node
              processorNode = this.context.createGain();
            } else {
              throw new Error('Failed to load VST plugin');
            }
          } else {
            throw new Error('No VST plugin specified');
          }
          break;

        default:
          processorNode = this.context.createGain();
      }

      // Store and connect processor
      this.processors.set(processor.id, processorNode);
      this.connectProcessor(channelId, processor.id);

      logger.info(LogCategory.AUDIO, 'Audio processor created', {
        channelId,
        processorId: processor.id,
        type: processor.type
      });
    } catch (error) {
      logger.error(LogCategory.AUDIO, 'Failed to create audio processor', { error });
      throw error;
    }
  }

  private createNoiseGate(settings: any): GainNode {
    const node = this.context!.createGain();
    // Implement noise gate logic here
    return node;
  }

  private updateCompressorSettings(node: DynamicsCompressorNode, settings: any): void {
    if (settings.threshold) node.threshold.value = settings.threshold;
    if (settings.knee) node.knee.value = settings.knee;
    if (settings.ratio) node.ratio.value = settings.ratio;
    if (settings.attack) node.attack.value = settings.attack / 1000;
    if (settings.release) node.release.value = settings.release / 1000;
  }

  private updateEqualizerSettings(node: BiquadFilterNode, settings: any): void {
    if (settings.frequency) node.frequency.value = settings.frequency;
    if (settings.Q) node.Q.value = settings.Q;
    if (settings.gain) node.gain.value = settings.gain;
  }

  private connectProcessor(channelId: string, processorId: string): void {
    const channel = this.channels.get(channelId);
    const processor = this.processors.get(processorId);
    if (!channel || !processor) return;

    // Disconnect existing connections
    channel.disconnect();

    // Connect channel -> processor -> master
    channel.connect(processor);
    processor.connect(this.masterGain!);
  }

  getChannelMeter(channelId: string): Float32Array | null {
    const analyser = this.analyserNodes.get(channelId);
    if (!analyser) return null;

    const dataArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(dataArray);
    return dataArray;
  }

  setChannelGain(channelId: string, gain: number): void {
    const channel = this.channels.get(channelId);
    if (!channel) return;
    channel.gain.value = gain / 100;
  }

  setChannelMute(channelId: string, muted: boolean): void {
    const channel = this.channels.get(channelId);
    if (!channel) return;
    channel.gain.value = muted ? 0 : 1;
  }

  dispose(): void {
    if (this.context) {
      this.context.close();
      this.context = null;
    }

    this.channels.clear();
    this.processors.clear();
    this.routes.clear();
    this.analyserNodes.clear();
    this.meterNodes.clear();
    this.vstNodes.clear();
    this.masterGain = null;
    this.isInitialized = false;

    logger.info(LogCategory.AUDIO, 'Audio engine disposed');
  }
}

export const audioEngine = AudioEngine.getInstance();
export default audioEngine;