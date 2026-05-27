(function(){
  var KEY = 'optimi_consent';

  // ============================================
  // ANALYTICS IDs — remplir quand dispo (post-consent uniquement)
  // ============================================
  var GOOGLE_ADS_ID = 'AW-17544027457';
  var GA4_ID        = '';                  // ex: 'G-XXXXXXXXXX'
  var META_PIXEL_ID = '';                  // ex: '123456789012345'
  var TIKTOK_PIXEL_ID = '';                // ex: 'CXXXXXXXXXXXXXXX'
  var LINKEDIN_PARTNER_ID = '';            // ex: '1234567'
  var GHL_CHAT_WIDGET_ID = '695efad35caa57681323b378';  // à confirmer GHL Settings → Chat Widget

  function getConsent(){
    try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){ return null; }
  }

  function setConsent(val){
    localStorage.setItem(KEY, JSON.stringify({
      accepted: val,
      date: new Date().toISOString()
    }));
  }

  function loadAnalytics(){
    // ── Google Ads + GA4 (gtag.js) ──
    var primaryGtagId = GOOGLE_ADS_ID || GA4_ID;
    if (primaryGtagId) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + primaryGtagId;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      if (GOOGLE_ADS_ID) gtag('config', GOOGLE_ADS_ID);
      if (GA4_ID)        gtag('config', GA4_ID);
    }

    // ── Meta Pixel ──
    if (META_PIXEL_ID) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }

    // ── TikTok Pixel ──
    if (TIKTOK_PIXEL_ID) {
      !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(TIKTOK_PIXEL_ID);ttq.page()}(window,document,'ttq');
    }

    // ── LinkedIn Insight Tag ──
    if (LINKEDIN_PARTNER_ID) {
      window._linkedin_partner_id = LINKEDIN_PARTNER_ID;
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);
      (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);
    }

    // Replay les conversion events déclarés par la page (merci-*, etc.)
    if (typeof window.gtag === 'function' && Array.isArray(window.__OPTIMI_GTAG_EVENT)) {
      try { window.gtag.apply(null, ['event'].concat(window.__OPTIMI_GTAG_EVENT)); }
      catch(e) { /* silent */ }
    }
  }

  function loadChat(){
    // GHL Web Chat Widget - chargement post-consent uniquement (RGPD).
    if (!GHL_CHAT_WIDGET_ID) return;
    var w = document.createElement('script');
    w.src = 'https://widgets.leadconnectorhq.com/loader.js';
    w.setAttribute('data-resources-url','https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    w.setAttribute('data-widget-id', GHL_CHAT_WIDGET_ID);
    w.async = true;
    document.body.appendChild(w);
  }

  function hideBanner(){
    var b = document.getElementById('optimi-consent-banner');
    if(b) b.style.display = 'none';
  }

  function buildBanner(){
    var b = document.createElement('div');
    b.id = 'optimi-consent-banner';
    b.innerHTML =
      '<div class="ocb-inner">' +
        '<div class="ocb-text">' +
          '<strong>Nous utilisons des cookies</strong>' +
          '<p>Pour mesurer nos performances et améliorer votre expérience, nous utilisons des cookies analytiques et publicitaires. Vous pouvez accepter ou refuser leur utilisation à tout moment.</p>' +
        '</div>' +
        '<div class="ocb-actions">' +
          '<button id="ocb-refuse" class="ocb-btn ocb-refuse">Refuser</button>' +
          '<button id="ocb-accept" class="ocb-btn ocb-accept">Accepter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    b.style.display = 'flex';

    document.getElementById('ocb-accept').addEventListener('click', function(){
      setConsent(true);
      hideBanner();
      loadAnalytics();
      loadChat();
    });
    document.getElementById('ocb-refuse').addEventListener('click', function(){
      setConsent(false);
      hideBanner();
    });
  }

  var consent = getConsent();
  if(consent === null){
    document.addEventListener('DOMContentLoaded', buildBanner);
  } else if(consent.accepted === true){
    document.addEventListener('DOMContentLoaded', function(){
      loadAnalytics();
      loadChat();
    });
  }
})();
