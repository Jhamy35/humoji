import { android as androidApp, isAndroid } from '@nativescript/core/application';
import { requestPermissions as requestCameraPermissions, hasPermissions as hasCameraPermissions } from '@nativescript/camera';
import * as permissions from 'nativescript-permissions';

export async function requestPermissions() {
  try {
    // Request camera permission first
    await requestCameraPermissions();
    
    // Request storage permissions on Android
    if (isAndroid) {
      const readPermission = android.Manifest.permission.READ_EXTERNAL_STORAGE;
      const writePermission = android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
      
      if (!permissions.hasPermission(readPermission)) {
        await permissions.requestPermission(readPermission);
      }
      
      if (!permissions.hasPermission(writePermission)) {
        await permissions.requestPermission(writePermission);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
}

export async function checkCameraPermission() {
  try {
    return await hasCameraPermissions();
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
}