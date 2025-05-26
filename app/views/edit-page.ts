import { EventData, Page } from '@nativescript/core';
import { EditViewModel } from '../view-models/edit-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  const navigationContext = page.navigationContext;
  
  if (!page.bindingContext) {
    page.bindingContext = new EditViewModel(navigationContext.imageSource);
  }
}