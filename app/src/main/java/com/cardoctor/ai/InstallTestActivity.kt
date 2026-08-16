package com.cardoctor.ai

import android.app.Activity
import android.os.Bundle
import android.widget.TextView

class InstallTestActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val text = TextView(this).apply {
            text = "APK INSTALL TEST OK"
            textSize = 24f
            gravity = android.view.Gravity.CENTER
        }
        setContentView(text)
    }
}
