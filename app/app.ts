import { Application } from '@nativescript/core';
import { requestPermissions, checkCameraPermission } from './services/permissions-service';

// Request permissions when the app starts
async function initialize() {
  const hasPermissions = await checkCameraPermission();
  if (!hasPermissions) {
    await requestPermissions();
  }
}

initialize().then(() => {
  Application.run({ moduleName: 'app-root' });
});