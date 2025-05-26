import { android as androidApp, isAndroid } from '@nativescript/core/application';
import { requestPermissions as requestCameraPermissions } from '@nativescript/camera';
import * as permissions from 'nativescript-permissions';

export async function requestPermissions() {
  try {
    // Request camera permission
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
  } catch (error) {
    console.error('Error requesting permissions:', error);
  }
}