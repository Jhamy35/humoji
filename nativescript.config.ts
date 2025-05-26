import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.humoji',
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
    timeout: 180000,
    port: 0,
    hmr: false,
    webpackConfig: {
      optimization: {
        minimize: false,
        splitChunks: false
      },
      output: {
        pathinfo: false
      },
      cache: {
        type: 'memory'
      }
    },
    socketRetryInterval: 10000,
    maxRetries: 15,
    cleanWebpackCache: true
  }
} as NativeScriptConfig;