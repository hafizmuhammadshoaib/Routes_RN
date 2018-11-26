package com.routes;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // import this

import android.graphics.Typeface;
import android.os.Bundle; // import this
import android.widget.TextView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    TextView heading;
    @Override
    protected String getMainComponentName() {
        return "Routes";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);

    }
}
