package com.awesomeproject;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.realm.react.RealmReactPackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import java.util.Arrays;
import java.util.List;
import br.com.dopaminamob.gpsstate.GPSStatePackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import expo.modules.location.LocationPackage;


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
            new VectorIconsPackage(),
            new OrientationPackage(),
            new RCTCameraPackage(),
            new RealmReactPackage(),
            new AndroidOpenSettingsPackage(),
            new GPSStatePackage(),
            new RNAndroidLocationEnablerPackage(),
            new LocationPackage()


      );
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
