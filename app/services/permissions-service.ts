import { android as androidApp, isAndroid } from '@nativescript/core/application';
import { requestPermissions as requestCameraPermissions } from '@nativescript/camera';
import * as permissions from 'nativescript-permissions';

export async function requestPermissions() {
  try {
    // Request camera permission first
    const cameraPermission = await requestCameraPermissions();
    
    // Request storage permissions on Android
    if (isAndroid) {
      const readPermission = android.Manifest.permission.READ_EXTERNAL_STORAGE;
      const writePermission = android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
      
      const hasReadPermission = await permissions.requestPermission(readPermission);
      const hasWritePermission = await permissions.requestPermission(writePermission);
      
      return hasReadPermission && hasWritePermission && cameraPermission;
    }
    
    return cameraPermission;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
}

export async function checkCameraPermission() {
  try {
    if (isAndroid) {
      const permission = android.Manifest.permission.CAMERA;
      return permissions.hasPermission(permission);
    }
    return true;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
}