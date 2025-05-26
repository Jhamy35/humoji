import { Application } from '@nativescript/core';
import { requestPermissions } from './services/permissions-service';

// Request permissions when the app starts
requestPermissions();

Application.run({ moduleName: 'app-root' });