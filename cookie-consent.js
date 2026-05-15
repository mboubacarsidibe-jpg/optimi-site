(function(){
  var KEY = 'optimi_consent';

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
    // Google Ads
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17544027457';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'AW-17544027457');

    // TODO: Meta Pixel - décommenter quand pixel ID disponible
    // !function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    // fbq('init','VOTRE_META_PIXEL_ID');fbq('track','PageView');

    // TODO: TikTok Pixel - décommenter quand pixel ID disponible
    // TODO: LinkedIn Insight Tag - décommenter quand ID disponible
  }

  function loadChat(){
    // GHL Web Chat Widget - chargement post-consent uniquement (RGPD).
    // Source de vérité unique : on retire le tag direct des HTML, on le charge ici.
    var w = document.createElement('script');
    w.src = 'https://widgets.leadconnectorhq.com/loader.js';
    w.setAttribute('data-resources-url','https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    w.setAttribute('data-widget-id','695efad35caa57681323b378');
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
