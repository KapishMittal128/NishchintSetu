import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nishchintsetu.app',
  appName: 'Nishchint Setu',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: 'http://10.0.2.2:3000', // Use 10.0.2.2 for Android emulator to access localhost
    cleartext: true,
  },
  plugins: {
    SmsPlugin: {
      permissions: ['RECEIVE_SMS', 'READ_SMS'],
    },
  },
};

export default config;
