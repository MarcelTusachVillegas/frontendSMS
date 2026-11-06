package com.capstone.antifraude.sms;

import javax.annotation.Nullable;
import javax.management.Notification;
import javax.naming.Context;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

public class MySmsTaskService extends HeadlessJsTaskService {
    private static final String CHANNEL_ID = "sms_check";

    @Override
    public void onCreate() {
        super.onCreate();
        
        // Creación obligatoria del NotificationChannel en Android 8+ (API 26+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Análisis de SMS",
                NotificationManager.IMPORTANCE_LOW
            );
            
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }

            Notification notification = new Notification.Builder(this, CHANNEL_ID)
                .setContentTitle("Verificando mensaje…")
                .setContentText("Analizando enlaces por seguridad")
                .setSmallIcon(android.R.drawable.stat_notify_chat)
                .build();

            // Notificación exigida para Foreground Service
            startForeground(1001, notification);
        }
    }

    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        super.onHeadlessJsTaskFinish(taskId);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE);
        }
        stopSelf();
    }

    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras == null) return null;

        WritableMap data = Arguments.createMap();
        data.putString("sender", extras.getString("sender"));
        data.putString("message", extras.getString("message"));

        // 15000 ms (15 seg) de timeout para completar la Headless Task
        return new HeadlessJsTaskConfig("SMSAnalyzerTask", data, 15000, true);
    }
}