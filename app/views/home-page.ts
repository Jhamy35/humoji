import { EventData, Page, Observable, ObservableArray } from '@nativescript/core';
import { HomeViewModel } from '../view-models/home-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  if (!page.bindingContext) {
    page.bindingContext = new HomeViewModel();
  }
}