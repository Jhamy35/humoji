import { ImageSource } from '@nativescript/core';

export class HumojiProcessorService {
  
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
    const x = Math.floor((width - size) / 2);
    const y = Math.floor((height - size) / 2);
    
    try {
      // Create a new image source from the cropped region
      const newImageSource = new ImageSource();
      // Use native image manipulation to crop
      if (imageSource.android) {
        const bitmap = imageSource.android;
        const croppedBitmap = android.graphics.Bitmap.createBitmap(
          bitmap, x, y, size, size
        );
        newImageSource.setNativeSource(croppedBitmap);
        return newImageSource;
      } else {
        // For iOS implementation
        return imageSource;
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      return imageSource;
    }
  }
  
  private async applyBubbleStyle(imageSource: ImageSource): Promise<ImageSource> {
    try {
      // Apply basic image adjustments for bubble style
      if (imageSource.android) {
        const bitmap = imageSource.android;
        const width = bitmap.getWidth();
        const height = bitmap.getHeight();
        
        // Create a new bitmap with the same dimensions
        const resultBitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(resultBitmap);
        
        // Apply a color filter for the bubble effect
        const paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.LightingColorFilter(0xFF9EDBFF, 0));
        canvas.drawBitmap(bitmap, 0, 0, paint);
        
        // Apply circular mask
        return this.applyCircularMask(new ImageSource().setNativeSource(resultBitmap));
      }
      
      return imageSource;
    } catch (error) {
      console.error('Error applying bubble style:', error);
      return imageSource;
    }
  }
  
  private async applyMarbleStyle(imageSource: ImageSource): Promise<ImageSource> {
    try {
      // Apply basic image adjustments for marble style
      if (imageSource.android) {
        const bitmap = imageSource.android;
        const width = bitmap.getWidth();
        const height = bitmap.getHeight();
        
        // Create a new bitmap with the same dimensions
        const resultBitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(resultBitmap);
        
        // Apply a color filter for the marble effect
        const paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.LightingColorFilter(0xFFE0E0E0, 0));
        canvas.drawBitmap(bitmap, 0, 0, paint);
        
        // Apply circular mask
        return this.applyCircularMask(new ImageSource().setNativeSource(resultBitmap));
      }
      
      return imageSource;
    } catch (error) {
      console.error('Error applying marble style:', error);
      return imageSource;
    }
  }
  
  private async applyClassicStyle(imageSource: ImageSource): Promise<ImageSource> {
    try {
      // Apply basic image adjustments for classic style
      if (imageSource.android) {
        const bitmap = imageSource.android;
        const width = bitmap.getWidth();
        const height = bitmap.getHeight();
        
        // Create a new bitmap with the same dimensions
        const resultBitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(resultBitmap);
        
        // Apply a color filter for the classic effect
        const paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.LightingColorFilter(0xFFFFF0E0, 0));
        canvas.drawBitmap(bitmap, 0, 0, paint);
        
        // Apply circular mask
        return this.applyCircularMask(new ImageSource().setNativeSource(resultBitmap));
      }
      
      return imageSource;
    } catch (error) {
      console.error('Error applying classic style:', error);
      return imageSource;
    }
  }
  
  private applyCircularMask(imageSource: ImageSource): ImageSource {
    try {
      if (imageSource.android) {
        const bitmap = imageSource.android;
        const width = bitmap.getWidth();
        const height = bitmap.getHeight();
        
        // Create a new bitmap with the same dimensions
        const output = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(output);
        const paint = new android.graphics.Paint();
        const rect = new android.graphics.Rect(0, 0, width, height);
        
        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        canvas.drawCircle(width / 2, height / 2, width / 2, paint);
        
        // Apply the source bitmap using PorterDuff mode SRC_IN
        paint.setXfermode(new android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);
        
        return new ImageSource().setNativeSource(output);
      }
      
      return imageSource;
    } catch (error) {
      console.error('Error applying circular mask:', error);
      return imageSource;
    }
  }
}