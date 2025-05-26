import { EventData, Page } from '@nativescript/core';
import { GalleryViewModel } from '../view-models/gallery-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  
  if (!page.bindingContext) {
    page.bindingContext = new GalleryViewModel();
  } else {
    (<GalleryViewModel>page.bindingContext).loadEmojis();
  }
}