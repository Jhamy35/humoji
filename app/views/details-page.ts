import { EventData, Page } from '@nativescript/core';
import { DetailsViewModel } from '../view-models/details-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  const navigationContext = page.navigationContext;
  
  if (!page.bindingContext) {
    page.bindingContext = new DetailsViewModel(navigationContext.emojiId);
  } else {
    (<DetailsViewModel>page.bindingContext).loadEmoji(navigationContext.emojiId);
  }
}