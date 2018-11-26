package com.routes;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

public class SplashActivity extends AppCompatActivity {

    TextView heading;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        heading=(TextView)findViewById(R.id.heading);
        Typeface openSans = Typeface.createFromAsset(getAssets(),  "fonts/OpenSans-ExtraBold.ttf");
        heading.setTypeface(openSans);
        new Handler().postDelayed(new Runnable() {
        @Override
            public void run() {
                Intent intent = new Intent(SplashActivity.this,MainActivity.class);
                startActivity(intent);
                finish();

            }
        },3000);

    }
}
