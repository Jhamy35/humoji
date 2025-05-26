import { Frame, ImageSource } from '@nativescript/core';

export class NavigationService {
  static navigateToEditPage(imageSource: ImageSource) {
    Frame.topmost().navigate({
      moduleName: 'views/edit-page',
      context: { imageSource },
      animated: true,
      transition: {
        name: 'slide',
        duration: 300,
        curve: 'easeInOut'
      }
    });
  }

  static navigateToGalleryPage() {
    Frame.topmost().navigate({
      moduleName: 'views/gallery-page',
      animated: true,
      transition: {
        name: 'slide',
        duration: 300,
        curve: 'easeInOut'
      }
    });
  }

  static navigateToDetailsPage(emojiId: string) {
    Frame.topmost().navigate({
      moduleName: 'views/details-page',
      context: { emojiId },
      animated: true,
      transition: {
        name: 'slide',
        duration: 300,
        curve: 'easeInOut'
      }
    });
  }

  static goBack() {
    Frame.topmost().goBack();
  }
}