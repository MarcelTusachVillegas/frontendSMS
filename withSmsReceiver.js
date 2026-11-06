const { withAndroidManifest } = require("@expo/config-plugins");

const RECEIVER = ".sms.SmsReceiver";
const SERVICE  = ".sms.MySmsTaskService";

module.exports = function withSmsReceiver(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const app = manifest.application[0];

    // --- <receiver> para SMS_RECEIVED ---
    app.receiver = app.receiver || [];
    if (!app.receiver.some((r) => r.$["android:name"] === RECEIVER)) {
      app.receiver.push({
        $: {
          "android:name": RECEIVER,
          "android:exported": "true",
          "android:permission": "android.permission.BROADCAST_SMS",
        },
        "intent-filter": [
          {
            action: [{ $: { "android:name": "android.provider.Telephony.SMS_RECEIVED" } }],
          },
        ],
      });
    }

    // --- <service> Headless JS ---
    app.service = app.service || [];
    if (!app.service.some((s) => s.$["android:name"] === SERVICE)) {
      app.service.push({
        $: {
          "android:name": SERVICE,
          "android:exported": "false",
          "android:foregroundServiceType": "remoteMessaging",
        },
      });
    }

    return config;
  });
};
