package com.nishchintsetu.app;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PermissionState;
import android.Manifest;

@CapacitorPlugin(name = "SmsPlugin", permissions = {
    @com.getcapacitor.annotation.Permission(
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

    @PluginMethod
    public void checkSmsPermission(PluginCall call) {
        PermissionState state = getPermissionState("sms");
        JSObject result = new JSObject();
        result.put("status", state.toString().toLowerCase());
        call.resolve(result);
    }
}
