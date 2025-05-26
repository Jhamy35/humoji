import { ImageSource } from '@nativescript/core';
import { shareImage } from '@nativescript/social-share';

export class ShareService {
  static async shareHumoji(imageSource: ImageSource) {
    try {
      await shareImage(imageSource);
      return true;
    } catch (error) {
      console.error('Error sharing humoji:', error);
      return false;
    }
  }
  
  static async copyHumojiToClipboard(imageSource: ImageSource) {
    // Note: Copying images to clipboard is not directly supported in NativeScript
    // This would require a native implementation or plugin
    // For now, we'll share the image instead
    return this.shareHumoji(imageSource);
  }
}