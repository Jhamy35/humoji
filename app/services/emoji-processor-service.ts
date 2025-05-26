import { ImageSource } from '@nativescript/core';
import { FilterView } from 'nativescript-filterview';

export class HumojiProcessorService {
  private filterView: FilterView;
  
  constructor() {
    this.filterView = new FilterView();
  }
  
  async processImage(imageSource: ImageSource, style: string = 'bubble'): Promise<ImageSource> {
    try {
      // First, resize and crop the image to a square
      const processedImage = await this.cropToSquare(imageSource);
      
      // Apply filters based on style
      if (style === 'bubble') {
        return this.applyBubbleStyle(processedImage);
      } else if (style === 'marble') {
        return this.applyMarbleStyle(processedImage);
      } else {
        return this.applyClassicStyle(processedImage);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      return imageSource; // Return original if processing fails
    }
  }
  
  private async cropToSquare(imageSource: ImageSource): Promise<ImageSource> {
    const width = imageSource.width;
    const height = imageSource.height;
    const size = Math.min(width, height);
    
    // Calculate crop dimensions to get a centered square
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    
    // Crop the image
    return this.filterView.applyFilter({
      image: imageSource,
      filter: 'crop',
      options: {
        x,
        y,
        width: size,
        height: size
      }
    });
  }
  
  private async applyBubbleStyle(imageSource: ImageSource): Promise<ImageSource> {
    let processed = await this.filterView.applyFilter({
      image: imageSource,
      filter: 'brightness',
      options: { value: 1.2 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'contrast',
      options: { value: 1.3 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'saturation',
      options: { value: 1.5 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'cartoon'
    });
    
    // Apply circular mask
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'circularCrop'
    });
    
    return processed;
  }
  
  private async applyMarbleStyle(imageSource: ImageSource): Promise<ImageSource> {
    let processed = await this.filterView.applyFilter({
      image: imageSource,
      filter: 'brightness',
      options: { value: 1.1 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'contrast',
      options: { value: 1.2 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'grayscale',
      options: { value: 0.5 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'tint',
      options: { color: '#3498db', amount: 0.3 }
    });
    
    // Apply circular mask
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'circularCrop'
    });
    
    return processed;
  }
  
  private async applyClassicStyle(imageSource: ImageSource): Promise<ImageSource> {
    let processed = await this.filterView.applyFilter({
      image: imageSource,
      filter: 'brightness',
      options: { value: 1.1 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'contrast',
      options: { value: 1.2 }
    });
    
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'cartoon'
    });
    
    // Apply circular mask
    processed = await this.filterView.applyFilter({
      image: processed,
      filter: 'circularCrop'
    });
    
    return processed;
  }
}