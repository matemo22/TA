package com.ta;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.imagepicker.ImagePickerPackage;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new AutoGrowTextInputPackage(),
            new VectorIconsPackage(),
            new RNFirebasePackage(),
            new RNGestureHandlerPackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseFirestorePackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseStoragePackage(),
            new RNFirebaseFunctionsPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
						new ReactNativeDocumentPicker()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
