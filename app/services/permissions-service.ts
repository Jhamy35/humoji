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
        try {
          storageGranted = await permissions.requestPermission(readPermission);
        } catch (error) {
          console.error('Error requesting READ_EXTERNAL_STORAGE permission:', error);
          storageGranted = false;
        }
      }
      
      if (storageGranted && !permissions.hasPermission(writePermission)) {
        try {
          storageGranted = await permissions.requestPermission(writePermission);
        } catch (error) {
          console.error('Error requesting WRITE_EXTERNAL_STORAGE permission:', error);
          storageGranted = false;
        }
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
      
      const hasRead = permissions.hasPermission(readPermission);
      const hasWrite = permissions.hasPermission(writePermission);
      
      console.log(`Permission check: Camera=${hasCamera}, Read=${hasRead}, Write=${hasWrite}`);
      
      return hasCamera && hasRead && hasWrite;
    }
    
    return hasCamera;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
}