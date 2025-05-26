import { Observable, ImageSource } from '@nativescript/core';
import { HumojiProcessorService } from '../services/emoji-processor-service';
import { HumojiStorageService } from '../services/storage-service';
import { ShareService } from '../services/share-service';
import { NavigationService } from '../services/navigation-service';

export class EditViewModel extends Observable {
  private originalImageSource: ImageSource;
  private _processedImageSource: ImageSource;
  private _isProcessing: boolean = false;
  private _selectedStyle: string = 'bubble';
  private _brightness: number = 1.0;
  private _contrast: number = 1.0;
  private _saturation: number = 1.0;
  
  private processorService: HumojiProcessorService;
  private storageService: HumojiStorageService;
  
  constructor(imageSource: ImageSource) {
    super();
    this.originalImageSource = imageSource;
    this.processorService = new HumojiProcessorService();
    this.storageService = new HumojiStorageService();
    
    // Process the image with default settings
    this.processImage();
  }
  
  get processedImageSource(): ImageSource {
    return this._processedImageSource;
  }
  
  set processedImageSource(value: ImageSource) {
    if (this._processedImageSource !== value) {
      this._processedImageSource = value;
      this.notifyPropertyChange('processedImageSource', value);
    }
  }
  
  get isProcessing(): boolean {
    return this._isProcessing;
  }
  
  set isProcessing(value: boolean) {
    if (this._isProcessing !== value) {
      this._isProcessing = value;
      this.notifyPropertyChange('isProcessing', value);
    }
  }
  
  get selectedStyle(): string {
    return this._selectedStyle;
  }
  
  set selectedStyle(value: string) {
    if (this._selectedStyle !== value) {
      this._selectedStyle = value;
      this.notifyPropertyChange('selectedStyle', value);
    }
  }
  
  get brightness(): number {
    return this._brightness;
  }
  
  set brightness(value: number) {
    if (this._brightness !== value) {
      this._brightness = value;
      this.notifyPropertyChange('brightness', value);
    }
  }
  
  get contrast(): number {
    return this._contrast;
  }
  
  set contrast(value: number) {
    if (this._contrast !== value) {
      this._contrast = value;
      this.notifyPropertyChange('contrast', value);
    }
  }
  
  get saturation(): number {
    return this._saturation;
  }
  
  set saturation(value: number) {
    if (this._saturation !== value) {
      this._saturation = value;
      this.notifyPropertyChange('saturation', value);
    }
  }
  
  async processImage() {
    try {
      this.isProcessing = true;
      
      // Process the image with the current settings
      const processedImage = await this.processorService.processImage(
        this.originalImageSource,
        this.selectedStyle
      );
      
      this.processedImageSource = processedImage;
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  onStyleTap(args) {
    const id = args.object.id;
    this.selectedStyle = id;
    this.processImage();
  }
  
  onBrightnessChange(args) {
    this.brightness = args.value;
  }
  
  onContrastChange(args) {
    this.contrast = args.value;
  }
  
  onSaturationChange(args) {
    this.saturation = args.value;
  }
  
  onApplyTap() {
    this.processImage();
  }
  
  onResetTap() {
    this.brightness = 1.0;
    this.contrast = 1.0;
    this.saturation = 1.0;
    this.selectedStyle = 'bubble';
    this.processImage();
  }
  
  async onShareTap() {
    if (this.processedImageSource) {
      await ShareService.shareHumoji(this.processedImageSource);
    }
  }
  
  async onCopyTap() {
    if (this.processedImageSource) {
      await ShareService.copyHumojiToClipboard(this.processedImageSource);
    }
  }
  
  async onSaveTap() {
    try {
      if (this.processedImageSource) {
        const metadata = {
          style: this.selectedStyle,
          settings: {
            brightness: this.brightness,
            contrast: this.contrast,
            saturation: this.saturation
          }
        };
        
        const id = await this.storageService.saveHumoji(this.processedImageSource, metadata);
        NavigationService.navigateToDetailsPage(id);
      }
    } catch (error) {
      console.error('Error saving humoji:', error);
    }
  }
  
  onBackTap() {
    NavigationService.goBack();
  }
}