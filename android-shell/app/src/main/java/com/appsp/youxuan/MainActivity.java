package com.appsp.youxuan;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Window;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String START_URL = "https://appsp-cs-1-d5g815slocb5a611a.webapps.tcloudbase.com/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        w.setStatusBarColor(Color.parseColor("#FF5A1F"));

        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                // 自动跳过 CloudBase 测试域名拦截页
                view.evaluateJavascript(
                    "(function(){" +
                    "var btns=document.querySelectorAll('button,a,div,span');" +
                    "for(var i=0;i<btns.length;i++){" +
                    "  var t=(btns[i].textContent||'').trim();" +
                    "  if(t==='确定访问'||t.indexOf('确定访问')>=0){btns[i].click();return;}" +
                    "}" +
                    "})()", null);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        webView.clearCache(true);
        webView.clearHistory();
        setContentView(webView);
        webView.loadUrl(START_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
