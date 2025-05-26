import { Observable, ObservableArray } from '@nativescript/core';
import { HumojiStorageService } from '../services/storage-service';
import { NavigationService } from '../services/navigation-service';

export class GalleryViewModel extends Observable {
  private _humojis: ObservableArray<any>;
  private storageService: HumojiStorageService;
  
  constructor() {
    super();
    this.storageService = new HumojiStorageService();
    this._humojis = new ObservableArray<any>();
    this.loadHumojis();
  }
  
  get humojis(): ObservableArray<any> {
    return this._humojis;
  }
  
  async loadHumojis() {
    try {
      // Clear existing humojis
      this._humojis.splice(0);
      
      // Get all humojis from storage (no limit)
      const humojis = await this.storageService.getRecentHumojis(100);
      
      // Format date for display
      const formattedHumojis = humojis.map(humoji => {
        // Get metadata if available
        let style = 'Unknown';
        let createdAt = 'Unknown';
        
        try {
          const metadataFileName = `humoji_${humoji.id}.json`;
          const metadataFilePath = this.storageService.humojisFolder.path + '/' + metadataFileName;
          if (File.exists(metadataFilePath)) {
            const metadataContent = File.readText(metadataFilePath);
            const metadata = JSON.parse(metadataContent);
            style = metadata.style || 'Unknown';
            
            if (metadata.createdAt) {
              const date = new Date(metadata.createdAt);
              createdAt = date.toLocaleDateString();
            }
          }
        } catch (error) {
          console.error('Error reading metadata:', error);
        }
        
        return {
          ...humoji,
          style,
          createdAt
        };
      });
      
      this._humojis.push(...formattedHumojis);
    } catch (error) {
      console.error('Error loading humojis:', error);
    }
  }
  
  onHumojiTap(args) {
    const humoji = this.humojis.getItem(args.index);
    NavigationService.navigateToDetailsPage(humoji.id);
  }
  
  onBackTap() {
    NavigationService.goBack();
  }
}