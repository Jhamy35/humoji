import { File, Folder, knownFolders, path } from '@nativescript/core';
import { ImageSource } from '@nativescript/core';

export class HumojiStorageService {
  private humojisFolder: Folder;
  
  constructor() {
    this.humojisFolder = this.ensureHumojisFolder();
  }
  
  private ensureHumojisFolder(): Folder {
    const documentsFolder = knownFolders.documents();
    const humojisPath = path.join(documentsFolder.path, 'humojis');
    
    try {
      const folder = Folder.fromPath(humojisPath);
      return folder;
    } catch (error) {
      // Folder doesn't exist, create it
      return Folder.create(humojisPath);
    }
  }
  
  async saveHumoji(imageSource: ImageSource, metadata: any = {}): Promise<string> {
    const id = new Date().getTime().toString();
    const fileName = `humoji_${id}.png`;
    const filePath = path.join(this.humojisFolder.path, fileName);
    
    // Save the image
    const saved = await imageSource.saveToFile(filePath, 'png');
    
    if (saved) {
      // Save metadata
      const metadataFileName = `humoji_${id}.json`;
      const metadataFilePath = path.join(this.humojisFolder.path, metadataFileName);
      const metadataContent = JSON.stringify({
        id,
        createdAt: new Date().toISOString(),
        ...metadata
      });
      
      File.writeText(metadataFilePath, metadataContent);
      return id;
    } else {
      throw new Error('Failed to save humoji image');
    }
  }
  
  async getHumoji(id: string): Promise<{ imageSource: ImageSource, metadata: any }> {
    const fileName = `humoji_${id}.png`;
    const filePath = path.join(this.humojisFolder.path, fileName);
    
    if (File.exists(filePath)) {
      const imageSource = await ImageSource.fromFile(filePath);
      
      // Get metadata if exists
      const metadataFileName = `humoji_${id}.json`;
      const metadataFilePath = path.join(this.humojisFolder.path, metadataFileName);
      let metadata = {};
      
      if (File.exists(metadataFilePath)) {
        const metadataContent = await File.readText(metadataFilePath);
        metadata = JSON.parse(metadataContent);
      }
      
      return { imageSource, metadata };
    } else {
      throw new Error(`Humoji with id ${id} not found`);
    }
  }
  
  async getRecentHumojis(limit: number = 10): Promise<Array<{ id: string, imageUrl: string }>> {
    const files = this.humojisFolder.getEntitiesSync()
      .filter(entity => entity.name.startsWith('humoji_') && entity.name.endsWith('.png'))
      .sort((a, b) => {
        // Sort by creation date, newest first
        return b.lastModified.getTime() - a.lastModified.getTime();
      })
      .slice(0, limit);
    
    return files.map(file => {
      const id = file.name.replace('humoji_', '').replace('.png', '');
      return {
        id,
        imageUrl: file.path
      };
    });
  }
  
  async deleteHumoji(id: string): Promise<boolean> {
    const fileName = `humoji_${id}.png`;
    const filePath = path.join(this.humojisFolder.path, fileName);
    
    if (File.exists(filePath)) {
      File.fromPath(filePath).removeSync();
      
      // Delete metadata if exists
      const metadataFileName = `humoji_${id}.json`;
      const metadataFilePath = path.join(this.humojisFolder.path, metadataFileName);
      
      if (File.exists(metadataFilePath)) {
        File.fromPath(metadataFilePath).removeSync();
      }
      
      return true;
    }
    
    return false;
  }
}