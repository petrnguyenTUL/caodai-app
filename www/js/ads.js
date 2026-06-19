/* =============================================================================
 * Cao Dai Vegetarian 365 - AdMob integration (App Open + Banner + Interstitial)
 * Plugin: @capacitor-community/admob
 * ---------------------------------------------------------------------------
 *  HUONG DAN: Thay cac ID test ben duoi bang ID THAT cua ban tu AdMob console
 *  (https://apps.admob.com) khi app da san sang kiem tien.
 *
 *  Da bo sung:
 *   - Xin dong y nguoi dung (GDPR/UMP consent) truoc khi hien quang cao.
 *   - Xin quyen theo doi (ATT) tren iOS.
 *   - Gioi han tan suat quang cao mo app (tranh lam phien & vi pham chinh sach).
 * ========================================================================== */
(function () {
  // ====== CAU HINH QUANG CAO ======
  // Khi con dang phat trien / test => de USE_TEST_ADS = true (dung ID test cua Google).
  // Khi da co ID that va app duoc duyet => doi thanh false.
  var USE_TEST_ADS = true;

  // >>> ID THAT cua ban (lay tu AdMob -> Apps -> Ad units). Thay XXXX bang ID that.
  var REAL = {
    appOpen:      'ca-app-pub-0000000000000000/0000000000',
    banner:       'ca-app-pub-0000000000000000/0000000000',
    interstitial: 'ca-app-pub-0000000000000000/0000000000'
  };

  // ID TEST chinh thuc cua Google (an toan khi phat trien, KHONG tao thu nhap that).
  var TEST = {
    appOpen:      'ca-app-pub-3940256099942544/9257395921',
    banner:       'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712'
  };

  var IDS = USE_TEST_ADS ? TEST : REAL;

  // Hien quang cao xen ke sau moi N lan chuyen tab (de tranh lam phien nguoi dung).
  var INTERSTITIAL_EVERY = 4;

  // Khoang cach toi thieu giua 2 lan hien quang cao mo app (ms). 4 phut.
  var APP_OPEN_MIN_INTERVAL = 4 * 60 * 1000;

  // ====== TRANG THAI NOI BO ======
  var navCount = 0;
  var interstitialReady = false;
  var appOpenReady = false;
  var initialized = false;
  var lastAppOpenAt = 0;
  var showingAppOpen = false;

  function getAdMob() {
    return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AdMob) || null;
  }
  function getApp() {
    return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) || null;
  }
  function isNative() {
    return !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  }

  // ---------- DONG Y NGUOI DUNG (GDPR / UMP) ----------
  // Bat buoc co co che xin dong y de phuc vu quang cao cho nguoi dung EEA/UK.
  function requestConsent() {
    var AdMob = getAdMob();
    if (!AdMob || typeof AdMob.requestConsentInfo !== 'function') return Promise.resolve();
    return AdMob.requestConsentInfo({ tagForUnderAgeOfConsent: false })
      .then(function (info) {
        if (info && info.isConsentFormAvailable && info.status === 'REQUIRED' &&
            typeof AdMob.showConsentForm === 'function') {
          return AdMob.showConsentForm();
        }
      })
      .catch(function (e) { console.warn('[ads] consent error', e); });
  }

  // ---------- XIN QUYEN THEO DOI (ATT - chi iOS) ----------
  function requestTracking() {
    var AdMob = getAdMob();
    if (!AdMob || typeof AdMob.requestTrackingAuthorization !== 'function') return Promise.resolve();
    return AdMob.requestTrackingAuthorization().catch(function () {});
  }

  // ---------- BANNER ----------
  function showBanner() {
    var AdMob = getAdMob();
    if (!AdMob) return;
    AdMob.showBanner({
      adId: IDS.banner,
      adSize: 'ADAPTIVE_BANNER',     // co gian theo chieu rong man hinh
      position: 'BOTTOM_CENTER',
      margin: 0,
      isTesting: USE_TEST_ADS
    }).then(function () {
      document.body.classList.add('has-ad-banner');
    }).catch(function (e) { console.warn('[ads] banner error', e); });
  }

  // ---------- INTERSTITIAL (xen ke) ----------
  function prepareInterstitial() {
    var AdMob = getAdMob();
    if (!AdMob) return;
    AdMob.prepareInterstitial({
      adId: IDS.interstitial,
      isTesting: USE_TEST_ADS
    }).then(function () {
      interstitialReady = true;
    }).catch(function (e) { console.warn('[ads] prepare interstitial error', e); });
  }
  function maybeShowInterstitial() {
    var AdMob = getAdMob();
    if (!AdMob) return;
    navCount++;
    if (navCount % INTERSTITIAL_EVERY !== 0) return;
    if (!interstitialReady) { prepareInterstitial(); return; }
    interstitialReady = false;
    AdMob.showInterstitial()
      .catch(function (e) { console.warn('[ads] show interstitial error', e); })
      .then(function () { prepareInterstitial(); }); // nap san cho lan sau
  }

  // ---------- APP OPEN (khi mo / quay lai app) ----------
  function prepareAppOpen() {
    var AdMob = getAdMob();
    if (!AdMob || typeof AdMob.prepareAppOpenAd !== 'function') return;
    AdMob.prepareAppOpenAd({
      adId: IDS.appOpen,
      isTesting: USE_TEST_ADS
    }).then(function () {
      appOpenReady = true;
    }).catch(function (e) { console.warn('[ads] prepare app open error', e); });
  }
  function showAppOpen() {
    var AdMob = getAdMob();
    if (!AdMob || typeof AdMob.showAppOpenAd !== 'function') return;
    if (showingAppOpen) return;
    // Gioi han tan suat: khong hien lai trong vong APP_OPEN_MIN_INTERVAL.
    if (lastAppOpenAt && (Date.now() - lastAppOpenAt) < APP_OPEN_MIN_INTERVAL) return;
    if (!appOpenReady) { prepareAppOpen(); return; }
    appOpenReady = false;
    showingAppOpen = true;
    lastAppOpenAt = Date.now();
    AdMob.showAppOpenAd()
      .catch(function (e) { console.warn('[ads] show app open error', e); })
      .then(function () { showingAppOpen = false; prepareAppOpen(); });
  }

  // ---------- KHOI TAO ----------
  function init() {
    if (initialized) return;
    var AdMob = getAdMob();
    if (!isNative() || !AdMob) {
      // Chay tren trinh duyet (PWA) => khong co quang cao native, bo qua an toan.
      return;
    }
    initialized = true;
    AdMob.initialize({
      initializeForTesting: USE_TEST_ADS,
      // Them ID thiet bi test cua ban neu muon test voi ID that ma khong vi pham chinh sach.
      testingDevices: []
    })
      .then(function () { return requestTracking(); })   // iOS ATT (bo qua tren Android)
      .then(function () { return requestConsent(); })    // GDPR/UMP consent
      .then(function () {
        showBanner();
        prepareInterstitial();
        prepareAppOpen();
        // Hien quang cao mo app ngay sau khi nap xong (cho ~1.5s de chac chan da prepare).
        setTimeout(showAppOpen, 1500);

        // Hien lai quang cao mo app khi nguoi dung quay lai app (co gioi han tan suat).
        var App = getApp();
        if (App && App.addListener) {
          App.addListener('appStateChange', function (state) {
            if (state && state.isActive) { showAppOpen(); }
          });
        }
      })
      .catch(function (e) { console.warn('[ads] init error', e); });
  }

  // API cong khai cho app.js goi.
  window.CDAds = {
    init: init,
    onNavigate: maybeShowInterstitial,
    showAppOpen: showAppOpen
  };
})();
