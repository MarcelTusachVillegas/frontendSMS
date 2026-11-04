const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withNotificationService(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const app = manifest.application[0];

    // Namespace 'tools' para resolver conflictos de manifest
    manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";

    // La librería declara allowBackup="false" y Expo usa "true":
    // le decimos a Android que prevalezca el de la app
    if (app.$["tools:replace"]) {
      if (!app.$["tools:replace"].includes("android:allowBackup")) {
        app.$["tools:replace"] += ",android:allowBackup";
      }
    } else {
      app.$["tools:replace"] = "android:allowBackup";
    }

    app.$["android:allowBackup"] = "true";

    return config;
  });
};
