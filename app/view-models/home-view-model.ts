import { Observable, ObservableArray, Application, Utils } from '@nativescript/core';
import { takePicture, ImageSource, requestPermissions as requestCameraPermissions } from '@nativescript/camera';
import { NavigationService } from '../services/navigation-service';
import { HumojiStorageService } from '../services/storage-service';

export class HomeViewModel extends Observable {
  private _recentHumojis: ObservableArray<{ id: string, imageUrl: string }>;
  private storageService: HumojiStorageService;

  constructor() {
    super();
    this.storageService = new HumojiStorageService();
    this._recentHumojis = new ObservableArray<{ id: string, imageUrl: string }>();
    this.loadRecentHumojis();
  }

  get recentHumojis(): ObservableArray<{ id: string, imageUrl: string }> {
    return this._recentHumojis;
  }

  async loadRecentHumojis() {
    try {
      const humojis = await this.storageService.getRecentHumojis();
      this._recentHumojis.push(...humojis);
    } catch (error) {
      console.error('Failed to load recent humojis:', error);
    }
  }

  async onTakePhotoTap() {
    try {
      await requestCameraPermissions();
      const imageAsset = await takePicture({
        width: 300,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: false
      });
      
      if (imageAsset) {
        const source = await ImageSource.fromAsset(imageAsset);
        NavigationService.navigateToEditPage(source);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }

  onLoadImageTap() {
    // Implementation for loading image from gallery
    // This will be implemented in a future version
    console.log('Load image from gallery');
  }

  onGalleryTap() {
    NavigationService.navigateToGalleryPage();
  }

  onHumojiTap(args) {
    const humoji = this.recentHumojis.getItem(args.index);
    NavigationService.navigateToDetailsPage(humoji.id);
  }
}