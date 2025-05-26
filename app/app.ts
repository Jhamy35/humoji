import { Application } from '@nativescript/core';
import { requestPermissions, checkCameraPermission } from './services/permissions-service';

// Request permissions when the app starts
async function initialize() {
  try {
    const hasPermissions = await checkCameraPermission();
    if (!hasPermissions) {
      await requestPermissions();
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Initialize and run the app
initialize().then(() => {
  Application.run({ moduleName: 'app-root' });
}).catch(error => {
  console.error('Failed to initialize app:', error);
  Application.run({ moduleName: 'app-root' });
});