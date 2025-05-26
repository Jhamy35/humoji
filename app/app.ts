import { Application } from '@nativescript/core';
import { requestPermissions, checkCameraPermission } from './services/permissions-service';

// Request permissions when the app starts
async function initialize() {
  try {
    console.log('Checking camera permissions...');
    const hasPermissions = await checkCameraPermission();
    console.log('Has permissions:', hasPermissions);
    
    if (!hasPermissions) {
      console.log('Requesting permissions...');
      const granted = await requestPermissions();
      console.log('Permissions granted:', granted);
      
      if (!granted) {
        console.warn('Not all permissions were granted');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error during initialization:', error);
    return false;
  }
}

// Initialize and run the app
initialize()
  .then(() => {
    console.log('App initialization complete');
    Application.run({ moduleName: 'app-root' });
  })
  .catch(error => {
    console.error('Failed to initialize app:', error);
    // Still run the app even if permissions fail
    Application.run({ moduleName: 'app-root' }); 
  });