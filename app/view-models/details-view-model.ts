import { Observable, ImageSource, confirm } from '@nativescript/core';
import { HumojiStorageService } from '../services/storage-service';
import { ShareService } from '../services/share-service';
import { NavigationService } from '../services/navigation-service';

export class DetailsViewModel extends Observable {
  private _humojiId: string;
  private _imageSource: ImageSource;
  private _isLoading: boolean = false;
  private _createdAt: string = '';
  private _style: string = '';
  private _imageSize: string = '';
  
  private storageService: HumojiStorageService;
  
  constructor(humojiId: string) {
    super();
    this.storageService = new HumojiStorageService();
    this.loadHumoji(humojiId);
  }
  
  get humojiId(): string {
    return this._humojiId;
  }
  
  set humojiId(value: string) {
    if (this._humojiId !== value) {
      this._humojiId = value;
      this.notifyPropertyChange('humojiId', value);
    }
  }
  
  get imageSource(): ImageSource {
    return this._imageSource;
  }
  
  set imageSource(value: ImageSource) {
    if (this._imageSource !== value) {
      this._imageSource = value;
      this.notifyPropertyChange('imageSource', value);
    }
  }
  
  get isLoading(): boolean {
    return this._isLoading;
  }
  
  set isLoading(value: boolean) {
    if (this._isLoading !== value) {
      this._isLoading = value;
      this.notifyPropertyChange('isLoading', value);
    }
  }
  
  get createdAt(): string {
    return this._createdAt;
  }
  
  set createdAt(value: string) {
    if (this._createdAt !== value) {
      this._createdAt = value;
      this.notifyPropertyChange('createdAt', value);
    }
  }
  
  get style(): string {
    return this._style;
  }
  
  set style(value: string) {
    if (this._style !== value) {
      this._style = value;
      this.notifyPropertyChange('style', value);
    }
  }
  
  get imageSize(): string {
    return this._imageSize;
  }
  
  set imageSize(value: string) {
    if (this._imageSize !== value) {
      this._imageSize = value;
      this.notifyPropertyChange('imageSize', value);
    }
  }
  
  async loadHumoji(humojiId: string) {
    try {
      this.isLoading = true;
      this.humojiId = humojiId;
      
      const { imageSource, metadata } = await this.storageService.getHumoji(humojiId);
      this.imageSource = imageSource;
      
      // Format created date
      if (metadata.createdAt) {
        const date = new Date(metadata.createdAt);
        this.createdAt = date.toLocaleString();
      } else {
        this.createdAt = 'Unknown';
      }
      
      // Set style
      this.style = metadata.style || 'Default';
      
      // Set image size
      if (imageSource) {
        this.imageSize = `${imageSource.width}x${imageSource.height}`;
      } else {
        this.imageSize = 'Unknown';
      }
    } catch (error) {
      console.error('Error loading humoji:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  async onShareTap() {
    if (this.imageSource) {
      await ShareService.shareHumoji(this.imageSource);
    }
  }
  
  async onCopyTap() {
    if (this.imageSource) {
      await ShareService.copyHumojiToClipboard(this.imageSource);
    }
  }
  
  async onDeleteTap() {
    const result = await confirm({
      title: 'Delete Humoji',
      message: 'Are you sure you want to delete this humoji?',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });
    
    if (result) {
      try {
        await this.storageService.deleteHumoji(this.humojiId);
        NavigationService.goBack();
      } catch (error) {
        console.error('Error deleting humoji:', error);
      }
    }
  }
  
  onBackTap() {
    NavigationService.goBack();
  }
}