import { android as androidApp, isAndroid } from '@nativescript/core/application';
import { requestPermissions as requestCameraPermissions, hasPermissions as hasCameraPermissions } from '@nativescript/camera';
import * as permissions from 'nativescript-permissions';

export async function requestPermissions() {
  try {
    // Request camera permission first
    const cameraGranted = await requestCameraPermissions();
    
    // Request storage permissions on Android
    if (isAndroid) {
      const readPermission = android.Manifest.permission.READ_EXTERNAL_STORAGE;
      const writePermission = android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
      
      let storageGranted = true;

      if (!permissions.hasPermission(readPermission)) {
        storageGranted = await permissions.requestPermission(readPermission);
      }
      
      if (storageGranted && !permissions.hasPermission(writePermission)) {
        storageGranted = await permissions.requestPermission(writePermission);
      }

      return cameraGranted && storageGranted;
    }
    
    return cameraGranted;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
}

export async function checkCameraPermission() {
  try {
    const hasCamera = await hasCameraPermissions();
    
    if (isAndroid) {
      const readPermission = android.Manifest.permission.READ_EXTERNAL_STORAGE;
      const writePermission = android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
      
      return hasCamera && 
             permissions.hasPermission(readPermission) &&
             permissions.hasPermission(writePermission);
    }
    
    return hasCamera;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
}