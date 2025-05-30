import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.jhamy.humoji',
  appPath: 'app',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    maxLogcatObjectSize: 2048,
    androidHome: '/opt/android-sdk',
    releaseConfig: {
      keyAlias: 'humojiapp',
      keyPassword: 'YOUR_KEY_PASSWORD',
      storeFile: 'path/to/keystore.jks',
      storePassword: 'YOUR_STORE_PASSWORD',
      android: {
        signingConfig: 'release'
      }
    }
  },
  preview: {
    port: 3000,
    hmr: false,
    env: {
      preview: true
    }
  }
} as NativeScriptConfig;