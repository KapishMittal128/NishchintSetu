package com.nishchintsetu.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.PermissionState;
import android.Manifest;

@CapacitorPlugin(name = "SmsPlugin", permissions = {
    @Permission(
        strings = { Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS },
        alias = "sms"
    )
})
public class SmsPlugin extends Plugin {

    private static SmsPlugin instance;

    @Override
    public void load() {
        instance = this;
    }

    public static void onSmsReceived(String sender, String body) {
        if (instance != null) {
            JSObject ret = new JSObject();
            ret.put("sender", sender);
            ret.put("body", body);
            instance.notifyListeners("smsReceived", ret, true);
        }
    }

    @PluginMethod()
    public void requestSmsPermission(PluginCall call) {
        if (getPermissionState("sms") == PermissionState.GRANTED) {
            call.resolve();
            return;
        }
        requestPermissionForAlias("sms", call, "requestSmsPermissionCallback");
    }

    @PermissionCallback
    private void requestSmsPermissionCallback(PluginCall call) {
        if (getPermissionState("sms") != PermissionState.GRANTED) {
            call.reject("Permission is required to read SMS.");
        } else {
            call.resolve();
        }
    }


    @PluginMethod
    public void checkSmsPermission(PluginCall call) {
        JSObject result = new JSObject();
        if (Capacitor.isPluginAvailable("SmsPlugin")) {
            PermissionState state = getPermissionState("sms");
            result.put("status", state.toString().toLowerCase());
        } else {
            result.put("status", "unavailable");
        }
        call.resolve(result);
    }
}
