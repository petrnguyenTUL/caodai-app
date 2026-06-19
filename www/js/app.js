/* Cao Dai Vegetarian 365 - main app logic (vanilla JS PWA) */
(function () {
  var D = window.DATA, L = window.Lunar;
  var S = {
    lang: localStorage.getItem('cd_lang') || 'vi',
    theme: localStorage.getItem('cd_theme') || 'light',
    elder: localStorage.getItem('cd_elder') === '1',
    mode: localStorage.getItem('cd_mode') || 'thap',
    tab: 'home',
    notif: localStorage.getItem('cd_notif') === '1'
  };
  function t(key, vars) {
    var s = (window.I18N[S.lang] && window.I18N[S.lang][key]) || window.I18N.vi[key] || key;
    if (vars) { for (var k in vars) { s = s.replace('{' + k + '}', vars[k]); } }
    return s;
  }
  function nameOf(r) { return (r.name[S.lang] || r.name.vi); }
  function catName(c) { return t('cat_' + c); }
  function el(id) { return document.getElementById(id); }
  function esc(s){ return String(s).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c];}); }

  // ---------- fasting logic ----------
  function fastSet() { return S.mode === 'luc' ? D.FAST_LUC : D.FAST_THAP; }
  function isFastLunarDay(ld) { return fastSet().indexOf(ld) !== -1; }
  function lunarOf(date) {
    return L.convertSolar2Lunar(date.getDate(), date.getMonth() + 1, date.getFullYear(), 7);
  }
  function fastIndexInMonth(date) {
    // which veg-day number within the lunar month (1-based) today is, else 0
    var lu = lunarOf(date); var ld = lu[0];
    if (!isFastLunarDay(ld)) return 0;
    var set = fastSet().slice().sort(function (a, b) { return a - b; });
    return set.indexOf(ld) + 1;
  }
  function nextFastDate(date) {
    var d = new Date(date.getTime());
    for (var i = 1; i <= 35; i++) {
      d.setDate(d.getDate() + 1);
      if (isFastLunarDay(lunarOf(d)[0])) return new Date(d.getTime());
    }
    return null;
  }

  // ---------- deterministic menu generation (120 unique day-menus) ----------
  function byCat(c) { return D.RECIPES.filter(function (r) { return r.cat === c; }); }
  function pick(arr, n) { return arr[n % arr.length]; }
  function dayMenu(month, dayIdx) {
    // month 1..12, dayIdx 0..9 -> unique seed across 120 combos
    var seed = (month - 1) * 10 + dayIdx;
    var brk = byCat('chao').concat(byCat('uong'));
    var lun = byCat('com').concat(byCat('nuoc'));
    var din = byCat('canh').concat(byCat('mon'));
    return {
      breakfast: pick(brk, seed),
      lunch: pick(lun, seed * 3 + 1),
      dinner: pick(din, seed * 7 + 2),
      extra: pick(byCat('trang').concat(byCat('uong')), seed * 5 + 4)
    };
  }
  function todayMenu(date) {
    var lu = lunarOf(date);
    var m = lu[1], dIdx = (lu[0] - 1) % 10;
    return dayMenu(m, dIdx);
  }

  // ---------- streak tracking ----------
  function todayKey(date) { var d = date || new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function getLog() { try { return JSON.parse(localStorage.getItem('cd_log') || '{}'); } catch (e) { return {}; } }
  function markToday() { var lg = getLog(); lg[todayKey()] = 1; localStorage.setItem('cd_log', JSON.stringify(lg)); }
  function isMarked() { return !!getLog()[todayKey()]; }
  function streak() {
    var lg = getLog(); var n = 0; var d = new Date();
    for (var i = 0; i < 400; i++) { if (lg[todayKey(d)]) { n++; d.setDate(d.getDate() - 1); } else break; }
    return n;
  }

  // ---------- views ----------
  var VN_WD = ['Ch\u1ee7 nh\u1eadt','Th\u1ee9 Hai','Th\u1ee9 Ba','Th\u1ee9 T\u01b0','Th\u1ee9 N\u0103m','Th\u1ee9 S\u00e1u','Th\u1ee9 B\u1ea3y'];
  function fmtSolar(d) {
    var wd = S.lang === 'vi' ? VN_WD[d.getDay()] : d.toLocaleDateString(S.lang === 'ko' ? 'ko' : 'en', { weekday: 'long' });
    return wd + ', ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
  }
  function fmtLunar(lu) { return lu[0] + '/' + lu[1] + (lu[3] ? ' (nhu\u1eadn)' : '') + ' \u00b7 ' + L.canChiYear(lu[2]); }

  function recipeChip(r) {
    if (!r) return '';
    return '<button class=\"chip\" data-recipe=\"' + r.id + '\">' + esc(nameOf(r)) + ' \u00b7 ' + r.kcal + ' ' + t('kcal') + '</button>';
  }

  function cdNet() { var on = navigator.onLine !== false; var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection; var type = c && c.type ? c.type : ''; var wifi = type ? (type === 'wifi' || type === 'ethernet') : true; return { online: on, wifi: wifi, type: type }; }
  function cdOnlinePref() { return localStorage.getItem('cd_online') || 'auto'; }
  function cdOnlineActive() { var p = cdOnlinePref(); if (p === 'off') return false; var n = cdNet(); if (!n.online) return false; return p === 'always' ? true : n.wifi; }
  function openExt(url) { try { window.open(url, '_blank'); } catch (e) { try { location.href = url; } catch (e2) {} } }
  function cdNetBadge() { var n = cdNet(); if (!n.online) return '<span class="netbadge off">' + t('net_offline') + '</span>'; if (!cdOnlineActive()) return '<span class="netbadge wifi">' + t('net_wifionly') + '</span>'; return '<span class="netbadge on">' + t('net_online') + '</span>'; }
  function updateNetBadge() { var b = el('netBadge'); if (b) b.innerHTML = cdNetBadge(); }
  function onlineCard() { var h = '<div class="card"><div class="label">' + t('online_title') + '</div>'; if (!cdOnlineActive()) { h += '<div class="hint">' + t('online_off_note') + '</div></div>'; return h; } h += '<div class="hint">' + t('online_hint') + '</div><div class="seg">'; h += '<button class="seg-b" data-online="news">' + t('online_news') + '</button>'; h += '<button class="seg-b" data-online="market">' + t('online_market') + '</button>'; h += '<button class="seg-b" data-online="food">' + t('online_food') + '</button>'; h += '</div></div>'; return h; }
  if (!window._cdNetBound) { window._cdNetBound = true; window.addEventListener('online', function () { try { render(); } catch (e) {} }); window.addEventListener('offline', function () { try { render(); } catch (e) {} }); }
  function viewHome() {
    var d = new Date(); var lu = lunarOf(d); var idx = fastIndexInMonth(d);
    var fast = idx > 0; var m = todayMenu(d);
    var teach = D.TEACH[S.lang][d.getDate() % D.TEACH[S.lang].length];
    var nf = nextFastDate(d);
    var h = '';
    h += '<div class=\"card\"><div class=\"label\">' + t('quick_access') + '</div><div class=\"qgrid\">';
    [['cam','\ud83d\udcf7','nav_cam'],['ai','\ud83c\udf99\ufe0f','nav_ai'],['menu','\ud83c\udf71','nav_menu'],['recipe','\ud83c\udf72','nav_recipe'],['health','\u2764\ufe0f','nav_health'],['market','\ud83d\uded2','nav_market']].forEach(function(q){ h += '<button class=\"qcard\" data-go=\"' + q[0] + '\"><span class=\"qic\">' + q[1] + '</span><em>' + t(q[2]) + '</em></button>'; });
    h += '</div></div>';
    h += onlineCard();
    h += '<div class=\"card hero ' + (fast ? 'fast' : 'nofast') + '\">';
    h += '<div class=\"hero-emoji\">' + (fast ? '\ud83e\udd57' : '\ud83c\udf7d\ufe0f') + '</div>';
    h += '<div class=\"hero-main\">' + (fast ? t('today_fast') : t('today_nofast')) + '</div>';
    if (fast) h += '<div class=\"hero-sub\">' + t('fastday_n', { n: idx }) + '</div>';
    else if (nf) h += '<div class=\"hero-sub\">' + t('next_fast', { d: nf.getDate() + '/' + (nf.getMonth() + 1) }) + '</div>';
    h += '</div>';
    h += '<div class=\"card\"><div class=\"row\"><span>\ud83d\udcc5 ' + t('solar') + '</span><b>' + esc(fmtSolar(d)) + '</b></div>';
    h += '<div class=\"row\"><span>\ud83c\udf19 ' + t('lunar') + '</span><b>' + esc(fmtLunar(lu)) + '</b></div></div>';
    h += '<div class=\"card teach\"><div class=\"label\">\u2764\ufe0f ' + t('teaching') + '</div><div class=\"teach-txt\">\u201c' + esc(teach) + '\u201d</div></div>';
    h += '<div class=\"card\"><div class=\"label\">\ud83c\udf72 ' + t('breakfast') + ' / ' + t('lunch') + ' / ' + t('dinner') + '</div>';
    h += '<div class=\"meal\"><span>\ud83e\udd63 ' + t('breakfast') + '</span>' + recipeChip(m.breakfast) + '</div>';
    h += '<div class=\"meal\"><span>\ud83c\udf5a ' + t('lunch') + '</span>' + recipeChip(m.lunch) + '</div>';
    h += '<div class=\"meal\"><span>\ud83c\udf72 ' + t('dinner') + '</span>' + recipeChip(m.dinner) + '</div>';
    h += '<div class=\"meal\"><span>\ud83c\udf4e +</span>' + recipeChip(m.extra) + '</div></div>';
    h += '<div class=\"card grid2\"><div class=\"mini\">\ud83d\udca7<br>' + t('water') + '</div><div class=\"mini\">\ud83d\udeb6<br>' + t('move') + '</div></div>';
    h += '<div class=\"card streak\"><div class=\"label\">\ud83c\udfc6 ' + t('streak') + '</div><div class=\"streak-n\">' + streak() + ' ' + t('days') + '</div>';
    h += '<button id=\"markBtn\" class=\"btn ' + (isMarked() ? 'btn-done' : 'btn-primary') + '\">' + (isMarked() ? t('marked') : t('mark_done')) + '</button></div>';
    return h;
  }

  function viewCalendar() {
    var now = new Date(); var h = '';
    h += '<div class=\"card\"><div class=\"label\">' + t('cal_mode') + '</div>';
    h += '<div class=\"seg\"><button class=\"seg-b ' + (S.mode==='thap'?'on':'') + '\" data-mode=\"thap\">' + t('thap') + '</button>';
    h += '<button class=\"seg-b ' + (S.mode==='luc'?'on':'') + '\" data-mode=\"luc\">' + t('luc') + '</button></div></div>';
    var year = now.getFullYear(), mon = now.getMonth();
    var first = new Date(year, mon, 1); var days = new Date(year, mon + 1, 0).getDate();
    h += '<div class=\"card\"><div class=\"label\">' + esc(first.toLocaleDateString(S.lang==='vi'?'vi':S.lang, {month:'long', year:'numeric'})) + '</div>';
    h += '<div class=\"calgrid\">';
    var wdShort = ['CN','T2','T3','T4','T5','T6','T7'];
    for (var w = 0; w < 7; w++) h += '<div class=\"cal-h\">' + wdShort[w] + '</div>';
    for (var b = 0; b < first.getDay(); b++) h += '<div></div>';
    for (var dd = 1; dd <= days; dd++) {
      var dt = new Date(year, mon, dd); var fdon = isFastLunarDay(lunarOf(dt)[0]);
      var isToday = dd === now.getDate();
      h += '<div class=\"cal-d ' + (fdon ? 'cal-fast' : '') + ' ' + (isToday ? 'cal-today' : '') + '\">' + dd + (fdon ? '<span class=\"dot\">\ud83c\udf3f</span>' : '') + '</div>';
    }
    h += '</div><div class=\"legend\">\ud83c\udf3f = ' + t('today_fast').toLowerCase() + '</div></div>';
    return h;
  }

  function viewMenu() {
    var sel = window._mSel || { m: 1, d: 0 };
    var h = '<div class=\"card\"><div class=\"label\">' + t('menu_title') + '</div>';
    h += '<div class=\"label\">' + t('month') + '</div><div class=\"pills\">';
    for (var mm = 1; mm <= 12; mm++) h += '<button class=\"pill ' + (sel.m===mm?'on':'') + '\" data-m=\"' + mm + '\">' + mm + '</button>';
    h += '</div><div class=\"label\">' + t('day') + ' (1-10)</div><div class=\"pills\">';
    for (var dd = 0; dd < 10; dd++) h += '<button class=\"pill ' + (sel.d===dd?'on':'') + '\" data-d=\"' + dd + '\">' + (dd + 1) + '</button>';
    h += '</div></div>';
    var mn = dayMenu(sel.m, sel.d);
    h += '<div class=\"card\">';
    h += '<div class=\"meal\"><span>\ud83e\udd63 ' + t('breakfast') + '</span>' + recipeChip(mn.breakfast) + '</div>';
    h += '<div class=\"meal\"><span>\ud83c\udf5a ' + t('lunch') + '</span>' + recipeChip(mn.lunch) + '</div>';
    h += '<div class=\"meal\"><span>\ud83c\udf72 ' + t('dinner') + '</span>' + recipeChip(mn.dinner) + '</div>';
    h += '<div class=\"meal\"><span>\ud83c\udf4e +</span>' + recipeChip(mn.extra) + '</div>';
    h += '<button class=\"btn btn-primary\" id=\"shopDay\">\ud83d\uded2 ' + t('shop_from_day') + '</button></div>';
    h += '<div id=\"shopOut\"></div>';
    return h;
  }

  function shoppingFromMenu(mn) {
    var bag = {};
    [mn.breakfast, mn.lunch, mn.dinner, mn.extra].forEach(function (r) {
      if (!r) return; r.ing.forEach(function (i) { bag[i] = (bag[i] || 0) + 1; });
    });
    var h = '<div class=\"card\"><div class=\"label\">\ud83d\uded2 ' + t('shopping') + '</div><ul class=\"shop\">';
    Object.keys(bag).forEach(function (k) { h += '<li>\u2705 ' + esc(k) + (bag[k] > 1 ? ' \u00d7' + bag[k] : '') + '</li>'; });
    h += '</ul></div>';
    return h;
  }

  function viewRecipe() {
    var q = (window._rq || '').toLowerCase(); var cat = window._rcat || 'all';
    var h = '<div class=\"card\"><input id=\"rsearch\" class=\"input\" placeholder=\"' + t('search') + '\" value=\"' + esc(window._rq||'') + '\"/>';
    h += '<div class=\"pills\"><button class=\"pill ' + (cat==='all'?'on':'') + '\" data-cat=\"all\">' + t('all') + '</button>';
    ['nuoc','com','canh','chao','uong','mon','trang'].forEach(function (c) { h += '<button class=\"pill ' + (cat===c?'on':'') + '\" data-cat=\"' + c + '\">' + catName(c) + '</button>'; });
    h += '</div></div>';
    var list = D.RECIPES.filter(function (r) {
      var ok = cat === 'all' || r.cat === cat;
      if (q) ok = ok && (nameOf(r).toLowerCase().indexOf(q) !== -1 || r.name.vi.toLowerCase().indexOf(q) !== -1);
      return ok;
    });
    h += '<div class=\"rlist\">';
    list.forEach(function (r) {
      h += '<button class=\"rcard\" data-recipe=\"' + r.id + '\"><div class=\"rcard-t\">' + esc(nameOf(r)) + '</div>';
      h += '<div class=\"rcard-m\">' + catName(r.cat) + ' \u00b7 ' + r.kcal + ' ' + t('kcal') + ' \u00b7 ' + r.time + ' ' + t('minutes') + '</div></button>';
    });
    h += '</div>';
    return h;
  }

  function recipeModal(id) {
    var r = D.RECIPES.filter(function (x) { return x.id === id; })[0]; if (!r) return;
    var h = '<div class=\"modal-h\">' + esc(nameOf(r)) + '</div>';
    h += '<div class=\"rcard-m\">' + catName(r.cat) + ' \u00b7 ' + r.kcal + ' ' + t('kcal') + ' \u00b7 ' + r.time + ' ' + t('minutes') + '</div>';
    h += '<div class=\"label\">' + t('ingredients') + '</div><ul class=\"shop\">';
    r.ing.forEach(function (i) { h += '<li>\u2022 ' + esc(i) + '</li>'; });
    h += '</ul><div class=\"label\">' + t('steps') + '</div><ol class=\"steps\">';
    r.steps.forEach(function (s) { h += '<li>' + esc(s) + '</li>'; });
    h += '</ol>';
    el('modalBody').innerHTML = h; el('modal').classList.add('show');
  }

  function viewPray() {
    var h = '<div class=\"card note\">\u26a0\ufe0f ' + t('pray_note') + '</div>';
    D.PRAYERS.forEach(function (p, i) {
      h += '<div class=\"card\"><button class=\"acc-h\" data-acc=\"' + i + '\">\ud83d\udcd6 ' + esc(p.title[S.lang] || p.title.vi) + '</button>';
      h += '<div class=\"acc-b\" id=\"acc' + i + '\"><pre class=\"kinh\">' + esc(p.body) + '</pre></div></div>';
    });
    return h;
  }

  function viewHealth() {
    var h = '<div class=\"card\"><div class=\"label\">' + t('health_title') + '</div>';
    h += '<label>' + t('height') + '</label><input id=\"hH\" class=\"input\" type=\"number\" value=\"165\"/>';
    h += '<label>' + t('weight') + '</label><input id=\"hW\" class=\"input\" type=\"number\" value=\"60\"/>';
    h += '<label>' + t('age') + '</label><input id=\"hA\" class=\"input\" type=\"number\" value=\"40\"/>';
    h += '<label>' + t('gender') + '</label><select id=\"hG\" class=\"input\"><option value=\"m\">' + t('male') + '</option><option value=\"f\">' + t('female') + '</option></select>';
    h += '<label>' + t('activity') + '</label><select id=\"hAct\" class=\"input\"><option value=\"1.3\">' + t('act_low') + '</option><option value=\"1.5\">' + t('act_mid') + '</option><option value=\"1.7\">' + t('act_high') + '</option></select>';
    h += '<button class=\"btn btn-primary\" id=\"hCalc\">' + t('calc') + '</button></div>';
    h += '<div id=\"hOut\"></div>';
    return h;
  }
  function calcHealth() {
    var H = +el('hH').value, W = +el('hW').value, A = +el('hA').value, G = el('hG').value, act = +el('hAct').value;
    if (!H || !W) return;
    var m = H / 100; var bmi = W / (m * m);
    var cat = bmi < 18.5 ? t('bmi_low') : bmi < 23 ? t('bmi_normal') : bmi < 25 ? t('bmi_over') : t('bmi_obese');
    var ideal = (22 * m * m);
    var water = (W * 0.035);
    var bmr = G === 'm' ? (10 * W + 6.25 * H - 5 * A + 5) : (10 * W + 6.25 * H - 5 * A - 161);
    var calo = bmr * act;
    var protein = W * 1.0;
    function rowv(l, v) { return '<div class=\"row\"><span>' + l + '</span><b>' + v + '</b></div>'; }
    var h = '<div class=\"card\">';
    h += rowv(t('bmi'), bmi.toFixed(1) + ' \u00b7 ' + cat);
    h += rowv(t('ideal'), ideal.toFixed(1) + ' kg');
    h += rowv(t('water_need'), water.toFixed(1) + ' L');
    h += rowv(t('calo_need'), Math.round(calo) + ' kcal');
    h += rowv(t('protein_need'), Math.round(protein) + ' g');
    h += '</div>';
    el('hOut').innerHTML = h;
  }

  function viewAI() {
    var h = '<div class=\"card\"><div class=\"label\">\ud83c\udf99\ufe0f ' + t('ai_title') + '</div><div class=\"hint\">' + t('ai_hint') + '</div></div>';
    h += '<div id=\"chat\" class=\"chat\"></div>';
    h += '<div class=\"chatbar\"><button id=\"aiMic\" class=\"btn\" style=\"width:auto;padding:12px 14px;background:var(--accent);color:var(--brand)\">' + t('ai_voice') + '</button><input id=\"aiIn\" class=\"input\" placeholder=\"' + t('ai_placeholder') + '\"/><button id=\"aiSend\" class=\"btn btn-primary\">' + t('ai_send') + '</button></div>';
    h += '<label class=\"switch\" style=\"margin-top:10px\"><input type=\"checkbox\" id=\"aiSpeak\"/> ' + t('ai_speak_on') + '</label>';
    return h;
  }
  function aiReply(qRaw) {
    var q = qRaw.toLowerCase();
    function names(arr, n) { return arr.slice(0, n).map(nameOf).join(', '); }
    function tagged(tag) { return D.RECIPES.filter(function (r) { return r.tags.indexOf(tag) !== -1; }); }
    var days = (q.match(/(\d+)\s*(ng\u00e0y|day|\uc77c)/) || [])[1];
    if (days) {
      var n = Math.min(+days, 10); var out = '';
      for (var i = 0; i < n; i++) { var mn = dayMenu(((i) % 12) + 1, i % 10); out += (i + 1) + '. ' + nameOf(mn.breakfast) + ' / ' + nameOf(mn.lunch) + ' / ' + nameOf(mn.dinner) + '\n'; }
      return out;
    }
    if (/ti\u1ec3u \u0111\u01b0\u1eddng|diabet|\ub2f9\ub1e8/.test(q)) return t('ai_title') + ': ' + names(tagged('tieuduong'), 5) + ' \u2014 \u01b0u ti\u00ean g\u1ea1o l\u1ee9t, \u00edt \u0111\u01b0\u1eddng, nhi\u1ec1u rau.';
    if (/huy\u1ebft \u00e1p|blood pressure|\ud608\uc555/.test(q)) return t('ai_title') + ': ' + names(tagged('huyetap'), 5) + ' \u2014 \u0103n nh\u1ea1t, nhi\u1ec1u rau xanh.';
    if (/gi\u1ea3m c\u00e2n|weight|\ub2e4\uc774\uc5b4\ud2b8|\uc0b4/.test(q)) return t('ai_title') + ': ' + names(tagged('giamcan'), 5) + ' \u2014 \u01b0u ti\u00ean lu\u1ed9c/h\u1ea5p, \u00edt d\u1ea7u.';
    if (/cao tu\u1ed5i|elder|\uace0\ub839/.test(q)) return t('ai_title') + ': ' + names(tagged('caotuoi'), 5) + ' \u2014 m\u1ec1m, d\u1ec5 ti\u00eau.';
    // default: today
    var m = todayMenu(new Date());
    return t('breakfast') + ': ' + nameOf(m.breakfast) + '\n' + t('lunch') + ': ' + nameOf(m.lunch) + '\n' + t('dinner') + ': ' + nameOf(m.dinner);
  }
  function pushChat(who, txt) {
    var c = el('chat'); var div = document.createElement('div'); div.className = 'msg ' + who;
    div.textContent = txt; c.appendChild(div); c.scrollTop = c.scrollHeight;
  }

  function viewMore() {
    var h = '<div class=\"card\"><div class=\"label\">' + t('lang') + '</div><div class=\"seg\">';
    [['vi','\ud83c\uddfb\ud83c\uddf3 Ti\u1ebfng Vi\u1ec7t'],['en','\ud83c\uddfa\ud83c\uddf8 English'],['ko','\ud83c\uddf0\ud83c\uddf7 \ud55c\uad6d\uc5b4']].forEach(function(o){ h += '<button class=\"seg-b ' + (S.lang===o[0]?'on':'') + '\" data-lang=\"' + o[0] + '\">' + o[1] + '</button>'; });
    h += '</div></div>';
    h += '<div class=\"card\"><div class=\"label\">' + t('theme') + '</div><div class=\"seg\">';
    h += '<button class=\"seg-b ' + (S.theme==='light'?'on':'') + '\" data-theme=\"light\">\u2600\ufe0f ' + t('light') + '</button>';
    h += '<button class=\"seg-b ' + (S.theme==='dark'?'on':'') + '\" data-theme=\"dark\">\ud83c\udf19 ' + t('dark') + '</button></div></div>';
    h += '<div class=\"card\"><label class=\"switch\"><input type=\"checkbox\" id=\"elderChk\" ' + (S.elder?'checked':'') + '/> ' + t('elder') + '</label></div>';
    h += '<div class=\"card\"><div class=\"label\">\ud83d\udd14 ' + t('reminders') + '</div><ul class=\"shop\">';
    D.DEFAULT_REMINDERS.forEach(function (r) { h += '<li>' + r.icon + ' ' + r.t + ' \u2014 ' + remName(r.key) + '</li>'; });
    h += "</ul>";
    var granted = notifSupported() && Notification.permission === 'granted';
    if (S.notif && granted) {
      h += "<div class='row'><span>✅ " + t('notif_on') + "</span></div>";
      h += "<button class='btn' id='notifTest'>" + t('notif_test') + "</button>";
      h += "<button class='btn' id='notifOff'>" + t('notif_off') + "</button>";
    } else {
      h += "<button class='btn btn-primary' id='notifBtn'>🔔 " + t('notif_enable') + "</button>";
    }
    h += "<div class='hint'>" + t('notif_hint') + "</div></div>";
    h += '<div class="card"><div class="label">' + t('set_online') + '</div><div class="seg">';
    [['auto', t('set_online_auto')], ['always', t('set_online_always')], ['off', t('set_online_off')]].forEach(function (o) { h += '<button class="seg-b ' + (cdOnlinePref() === o[0] ? 'on' : '') + '" data-onpref="' + o[0] + '">' + o[1] + '</button>'; });
    h += '</div></div>';
    h += '<div class=\"card about\"><b>' + t('app') + '</b><br>' + t('slogan') + '<br><span class=\"muted\">' + t('offline_ok') + ' \u00b7 v1.0</span></div>';
    return h;
  }
  function remName(k) {
    var map = { vi: { r_morning:'Ch\u00e0o ng\u00e0y m\u1edbi', r_breakfast:'\u0102n s\u00e1ng', r_water:'U\u1ed1ng n\u01b0\u1edbc', r_lunch:'\u0102n tr\u01b0a', r_walk:'\u0110i b\u1ed9 15 ph\u00fat', r_dinner:'\u0102n t\u1ed1i', r_meditate:'Thi\u1ec1n & \u0111\u1ecdc kinh' },
      en: { r_morning:'Good morning', r_breakfast:'Breakfast', r_water:'Drink water', r_lunch:'Lunch', r_walk:'Walk 15 min', r_dinner:'Dinner', r_meditate:'Meditate & pray' },
      ko: { r_morning:'\uc88b\uc740 \uc544\uce68', r_breakfast:'\uc544\uce68 \uc2dd\uc0ac', r_water:'\ubb3c \ub9c8\uc2dc\uae30', r_lunch:'\uc810\uc2ec', r_walk:'15\ubd84 \uac77\uae30', r_dinner:'\uc800\ub141', r_meditate:'\uba85\uc0c1\u00b7\uae30\ub3c4' } };
    return (map[S.lang] || map.vi)[k];
  }

  // ---------- push reminders (local notifications) ----------
  function notifSupported() { return 'Notification' in window; }
  function showReminder(r) {
    var title = t('app');
    var opts = { body: r.icon + ' ' + remName(r.key), icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: r.key };
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready && navigator.serviceWorker.ready.then) {
        navigator.serviceWorker.ready.then(function (reg) { reg.showNotification(title, opts); }).catch(function () {});
      } else if (notifSupported()) { new Notification(title, opts); }
    } catch (e) {}
  }
  function clearReminders() { (window._cdTimers || []).forEach(function (id) { clearTimeout(id); }); window._cdTimers = []; }
  function scheduleReminders() {
    clearReminders();
    if (!S.notif || !notifSupported() || Notification.permission !== 'granted') return;
    window._cdTimers = [];
    D.DEFAULT_REMINDERS.forEach(function (r) {
      var hm = r.t.split(':');
      var next = new Date(); next.setHours(+hm[0], +hm[1], 0, 0);
      if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1);
      var fire = function () { showReminder(r); window._cdTimers.push(setTimeout(fire, 86400000)); };
      window._cdTimers.push(setTimeout(fire, next.getTime() - Date.now()));
    });
  }
  function enableNotif() {
    if (!notifSupported()) { alert(t('notif_unsupported')); return; }
    var done = function (perm) {
      if (perm === 'granted') { S.notif = true; localStorage.setItem('cd_notif', '1'); scheduleReminders(); showReminder({ icon: '🔔', key: 'r_morning' }); }
      else { S.notif = false; localStorage.setItem('cd_notif', '0'); }
      render();
    };
    try { var pr = Notification.requestPermission(done); if (pr && pr.then) pr.then(done); } catch (e) { try { Notification.requestPermission(done); } catch (e2) {} }
  }
  function disableNotif() { S.notif = false; localStorage.setItem('cd_notif', '0'); clearReminders(); render(); }

  // ---------- vendor / supplier AI evaluation ----------
  function vendorCertWeight(c) { return { organic: 30, globalgap: 28, vietgap: 25, haccp: 22, iso: 20, attp: 15 }[c] || 10; }
  function scoreSupplier(s) {
    var cert = 0; (s.certs || []).forEach(function (c) { cert += vendorCertWeight(c); }); cert = Math.min(100, cert);
    var review = (s.rating / 5) * 100;
    var exp = Math.min(100, (s.years || 0) * 9);
    var tr = s.transparency || 0, hy = s.hygiene || 0;
    return Math.round(cert * 0.30 + review * 0.22 + tr * 0.20 + hy * 0.16 + exp * 0.12);
  }
  function scoreLabel(score) {
    if (score >= 85) return { key: 'rank_top', cls: 'rk-top' };
    if (score >= 70) return { key: 'rank_good', cls: 'rk-good' };
    if (score >= 55) return { key: 'rank_fair', cls: 'rk-fair' };
    return { key: 'rank_low', cls: 'rk-low' };
  }
  function supplierInsights(s) {
    var st = [], ca = []; var cc = (s.certs || []).length;
    if (cc >= 2) st.push(t('ins_cert_many')); else if (cc === 1) st.push(t('ins_cert_some')); else ca.push(t('ins_cert_none'));
    if ((s.certs || []).indexOf('organic') !== -1) st.push(t('ins_organic'));
    if (s.transparency >= 80) st.push(t('ins_trans_high')); else if (s.transparency < 50) ca.push(t('ins_trans_low'));
    if (s.hygiene >= 80) st.push(t('ins_hyg_high')); else if (s.hygiene < 50) ca.push(t('ins_hyg_low'));
    if (s.rating >= 4.3) st.push(t('ins_review_high')); else if (s.rating < 3.5) ca.push(t('ins_review_low'));
    if (s.years >= 5) st.push(t('ins_exp_high')); else if (s.years < 2) ca.push(t('ins_exp_low'));
    return { st: st, ca: ca };
  }
  function scoreBar(label, val) {
    return '<div class="bar-row"><span>' + label + '</span><div class="bar"><i style="width:' + Math.round(val) + '%"></i></div><b>' + Math.round(val) + '</b></div>';
  }
  function supplierReport(s, isVendor) {
    var sc = scoreSupplier(s), lb = scoreLabel(sc), ins = supplierInsights(s);
    var cert = 0; (s.certs || []).forEach(function (c) { cert += vendorCertWeight(c); }); cert = Math.min(100, cert);
    var h = '';
    if (isVendor) { h += '<div class="modal-h">' + esc(s.name) + '</div><div class="rcard-m">' + t('vtype_' + s.type) + ' · ' + esc(s.region) + '</div>'; }
    else { h += '<div class="label">🤖 ' + t('eval_result') + (s.name ? ' · ' + esc(s.name) : '') + '</div>'; }
    h += '<div class="score-hero ' + lb.cls + '"><div class="score-num">' + sc + '</div><div class="score-lab">' + t(lb.key) + '</div></div>';
    h += '<div class="label">' + t('score_breakdown') + '</div>';
    h += scoreBar(t('crit_cert'), cert);
    h += scoreBar(t('crit_review'), (s.rating / 5) * 100);
    h += scoreBar(t('crit_trans'), s.transparency || 0);
    h += scoreBar(t('crit_hyg'), s.hygiene || 0);
    h += scoreBar(t('crit_exp'), Math.min(100, (s.years || 0) * 9));
    if (isVendor && s.products) { h += '<div class="label">' + t('vproducts') + '</div><div class="vcerts">' + s.products.map(function (p) { return '<span class="tagc">' + esc(p) + '</span>'; }).join('') + '</div>'; }
    if (isVendor && s.certs && s.certs.length) { h += '<div class="label">' + t('vcerts') + '</div><div class="vcerts">' + s.certs.map(function (c) { return '<span class="tagc">' + t('cert_' + c) + '</span>'; }).join('') + '</div>'; }
    if (ins.st.length) { h += '<div class="label">✅ ' + t('strengths') + '</div><ul class="shop">' + ins.st.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
    if (ins.ca.length) { h += '<div class="label">⚠️ ' + t('cautions') + '</div><ul class="shop">' + ins.ca.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
    var adv = lb.key === 'rank_top' ? 'advice_top' : lb.key === 'rank_good' ? 'advice_good' : lb.key === 'rank_fair' ? 'advice_fair' : 'advice_low';
    h += '<div class="card note">💡 ' + t(adv) + '</div>';
    if (isVendor && s.contact) { h += '<div class="rcard-m">📍 ' + esc(s.contact) + '</div>'; }
    h += '<div class="hint">' + t('eval_disclaimer') + '</div>';
    return h;
  }
  function vendorModal(id) {
    var v = D.VENDORS.filter(function (x) { return x.id === id; })[0]; if (!v) return;
    el('modalBody').innerHTML = supplierReport(v, true); el('modal').classList.add('show');
  }
  function viewMarket() {
    var h = '';
    h += '<div class="card note">🛒 ' + t('market_note') + '</div>';
    h += '<div class="card"><div class="label">🤖 ' + t('eval_title') + '</div><div class="hint">' + t('eval_hint') + '</div>';
    h += '<label>' + t('eval_name') + '</label><input id="evName" class="input" placeholder="' + t('eval_name') + '"/>';
    h += '<label>' + t('eval_certs') + '</label><div class="pills" id="evCerts">';
    ['organic','vietgap','globalgap','haccp','iso','attp'].forEach(function (c) { h += '<button type="button" class="pill" data-cert="' + c + '">' + t('cert_' + c) + '</button>'; });
    h += '</div>';
    h += '<label>' + t('eval_years') + '</label><input id="evYears" class="input" type="number" value="3"/>';
    h += '<label>' + t('eval_rating') + '</label><input id="evRating" class="input" type="number" step="0.1" min="1" max="5" value="4"/>';
    h += '<label>' + t('eval_trans') + '</label><select id="evTrans" class="input"><option value="90">' + t('lvl_high') + '</option><option value="60" selected>' + t('lvl_mid') + '</option><option value="30">' + t('lvl_low') + '</option></select>';
    h += '<label>' + t('eval_hyg') + '</label><select id="evHyg" class="input"><option value="90">' + t('lvl_good') + '</option><option value="65" selected>' + t('lvl_ok') + '</option><option value="35">' + t('lvl_poor') + '</option></select>';
    h += '<button class="btn btn-primary" id="evCalc">' + t('eval_btn') + '</button></div>';
    h += '<div id="evOut"></div>';
    h += '<div class="card"><div class="label">🏪 ' + t('market_dir') + '</div><div class="pills">';
    var cat = window._vcat || 'all';
    h += '<button class="pill ' + (cat === 'all' ? 'on' : '') + '" data-vcat="all">' + t('all') + '</button>';
    ['store','online','farm','market','restaurant'].forEach(function (ty) { h += '<button class="pill ' + (cat === ty ? 'on' : '') + '" data-vcat="' + ty + '">' + t('vtype_' + ty) + '</button>'; });
    h += '</div></div>';
    var list = D.VENDORS.filter(function (v) { return cat === 'all' || v.type === cat; }).slice().sort(function (a, b) { return scoreSupplier(b) - scoreSupplier(a); });
    h += '<div class="rlist">';
    list.forEach(function (v) {
      var sc = scoreSupplier(v), lb = scoreLabel(sc);
      h += '<button class="rcard" data-vendor="' + v.id + '"><div class="vtop"><div class="rcard-t">' + esc(v.name) + '</div><div class="score-badge ' + lb.cls + '">' + sc + '</div></div>';
      h += '<div class="rcard-m">' + t('vtype_' + v.type) + ' · ' + esc(v.region) + ' · ' + t(lb.key) + '</div>';
      h += '<div class="vcerts">' + (v.certs.length ? v.certs.map(function (c) { return '<span class="tagc">' + t('cert_' + c) + '</span>'; }).join('') : '<span class="tagc">—</span>') + '</div></button>';
    });
    h += '</div>';
    return h;
  }
  function runEval() {
    var certs = []; Array.prototype.forEach.call(document.querySelectorAll('#evCerts .pill.on'), function (b) { certs.push(b.getAttribute('data-cert')); });
    var s = { name: el('evName').value.trim(), certs: certs, years: +el('evYears').value || 0, rating: Math.max(1, Math.min(5, +el('evRating').value || 0)), transparency: +el('evTrans').value, hygiene: +el('evHyg').value };
    el('evOut').innerHTML = '<div class="card">' + supplierReport(s, false) + '</div>';
    var o = el('evOut'); if (o && o.scrollIntoView) o.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- AI Camera (mon chay scanner) ----------
  var camStream = null;
  function startDishCam() {
    var v = el('cdvid'); if (!v) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { alert(t('cam_nocam')); return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (st) { camStream = st; v.srcObject = st; v.style.display = 'block'; }).catch(function () { alert(t('cam_denied')); });
  }
  function stopDishCam() { if (camStream) { camStream.getTracks().forEach(function (tk) { tk.stop(); }); camStream = null; } var v = el('cdvid'); if (v) v.style.display = 'none'; }
  function bindRecipeButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('#camOut [data-recipe]'), function (b) { b.onclick = function () { recipeModal(b.getAttribute('data-recipe')); }; });
    var sv = el('cdSave'); if (sv) sv.onclick = function () { saveDishScan(); };
    var rd = el('cdRead'); if (rd) rd.onclick = function () { readDishAloud(); };
  }
  function shotDish() {
    var v = el('cdvid');
    if (camStream && v && v.videoWidth) { var cv = el('cdcap'); cv.width = v.videoWidth; cv.height = v.videoHeight; cv.getContext('2d').drawImage(v, 0, 0); el('camOut').innerHTML = analyzeDish(cv); bindRecipeButtons(); var o = el('camOut'); if (o && o.scrollIntoView) o.scrollIntoView({ behavior: 'smooth' }); }
    else { alert(t('cam_hintshot')); }
  }
  function loadDishFile(e) {
    var f = e.target.files[0]; if (!f) return;
    var img = new Image(); img.onload = function () { var cv = el('cdcap'); var sc = Math.min(1, 720 / img.width); cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); el('camOut').innerHTML = analyzeDish(cv); bindRecipeButtons(); var o = el('camOut'); if (o && o.scrollIntoView) o.scrollIntoView({ behavior: 'smooth' }); };
    img.src = URL.createObjectURL(f);
  }
  function analyzeDish(cv) {
    var ctx = cv.getContext('2d'); var W = cv.width, H = cv.height; var d = ctx.getImageData(0, 0, W, H).data;
    var n = 0, green = 0, brown = 0, red = 0, white = 0, sat = 0, bright = 0;
    for (var y = 0; y < H; y += 6) { for (var x = 0; x < W; x += 6) { var i = (y * W + x) * 4; var r = d[i], g = d[i + 1], b = d[i + 2]; var mx = Math.max(r, g, b), mn = Math.min(r, g, b); var s = mx === 0 ? 0 : (mx - mn) / mx; var v = mx / 255; sat += s; bright += v; n++;
      if (g > r && g > b && g > 60) green++;
      else if (r > 140 && g > 90 && b < 120 && r >= g) brown++;
      else if (r > 150 && r > g + 40 && r > b + 20) red++;
      else if (mn > 150) white++;
    } }
    if (!n) n = 1; sat /= n; bright /= n;
    var gR = green / n, bR = brown / n, rR = red / n, wR = white / n;
    var veg = Math.round(Math.min(1, gR / 0.45) * 100);
    var fresh = Math.round(Math.min(1, (bright * 0.5 + gR * 1.3 + sat * 0.4)) * 100);
    var oily = Math.round(Math.min(1, bR / 0.4) * 100);
    var light = Math.max(0, 100 - oily);
    var kcal = Math.round(Math.max(150, Math.min(800, 250 + bR * 520 + wR * 240 + rR * 160 - gR * 150)));
    var vegConf = Math.round(Math.min(1, 0.55 + gR * 0.8 + wR * 0.4 - bR * 0.5 - rR * 0.4) * 100);
    vegConf = Math.max(15, Math.min(96, vegConf));
    var overall = Math.round((veg + fresh + light) / 3);
    var lb = scoreLabel(overall);
    var img = cv.toDataURL('image/jpeg', 0.6);
    var h = '<div class="card"><img src="' + img + '" style="width:100%;border-radius:12px"/>';
    h += '<div class="score-hero ' + lb.cls + '"><div class="score-num">' + overall + '</div><div class="score-lab">' + t(lb.key) + '</div></div>';
    h += '<div class="label">' + t('cam_breakdown') + '</div>';
    h += scoreBar(t('cam_veg'), veg);
    h += scoreBar(t('cam_fresh'), fresh);
    h += scoreBar(t('cam_light'), light);
    h += '<div class="bar-row"><span>\ud83d\udd25 ' + t('cam_kcal') + '</span><div class="bar"><i style="width:' + Math.min(100, Math.round(kcal / 8)) + '%"></i></div><b>~' + kcal + '</b></div>';
    h += '<div class="bar-row"><span>\ud83c\udf31 ' + t('cam_vegconf') + '</span><div class="bar"><i style="width:' + vegConf + '%"></i></div><b>' + vegConf + '%</b></div>';
    var ing = dishIngredients(gR, bR, rR, wR, sat);
    h += '<div class="label">' + t('cam_ingredients') + '</div><div class="rlist">';
    if (ing.length) { ing.forEach(function (z) { h += '<span style="display:inline-block;border:1px solid currentColor;opacity:.8;border-radius:14px;padding:3px 10px;margin:3px;font-size:13px">' + z + '</span>'; }); } else { h += '<span class="hint">' + t('ing_none') + '</span>'; }
    h += '</div>';
    var tips = [];
    if (gR < 0.18) tips.push(t('cam_tip_veg'));
    if (bR > 0.25) tips.push(t('cam_tip_oil'));
    if (fresh < 50) tips.push(t('cam_tip_fresh'));
    if (!tips.length) tips.push(t('cam_tip_good'));
    h += '<div class="label">\ud83d\udca1 ' + t('cam_tips') + '</div><ul class="shop">';
    tips.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
    h += '</ul>';
    var recs = (D.RECIPES || []).slice().sort(function (a, b) { return Math.abs((a.kcal || 0) - kcal) - Math.abs((b.kcal || 0) - kcal); }).slice(0, 3);
    h += '<div class="label">\ud83c\udf7d\ufe0f ' + t('cam_suggest') + '</div><div class="rlist">';
    recs.forEach(function (r) { h += '<button class="rcard" data-recipe="' + r.id + '"><div class="rcard-t">' + esc(nameOf(r)) + '</div><div class="rcard-m">' + catName(r.cat) + ' \u00b7 ' + (r.kcal || '?') + ' kcal</div></button>'; });
    h += '</div>';
    lastDishScan = { overall: overall, veg: veg, fresh: fresh, light: light, kcal: kcal, vegConf: vegConf, img: img, ing: ing, t: Date.now() };
    h += '<div class="seg" style="margin-top:10px"><button class="btn btn-primary" id="cdSave">' + t('cam_save') + '</button><button class="btn" id="cdRead">' + t('cam_read') + '</button></div>';
    h += '<div class="hint">' + t('cam_disclaimer') + '</div></div>';
    return h;
  }
  var lastDishScan = null;
  function dishIngredients(gR, bR, rR, wR, sat) {
    var out = [];
    if (gR > 0.16) out.push(t('ing_leafy'));
    if (wR > 0.14) out.push(t('ing_starch'));
    if (wR > 0.18 && sat < 0.22) out.push(t('ing_tofu'));
    if (bR > 0.2) out.push(t('ing_fried'));
    if (rR > 0.08) out.push(t('ing_redveg'));
    if (bR > 0.12 && bR <= 0.2 && sat < 0.3) out.push(t('ing_mushroom'));
    if (wR > 0.3 && bR < 0.15) out.push(t('ing_soup'));
    if (rR > 0.05 && sat > 0.5 && gR < 0.12) out.push(t('ing_fruit'));
    if (sat > 0.42 && gR <= 0.16) out.push(t('ing_colorful'));
    return out;
  }
  function cdScans() { try { return JSON.parse(localStorage.getItem('cd_scans') || '[]'); } catch (e) { return []; } }
  function cdSaveScans(a) { localStorage.setItem('cd_scans', JSON.stringify(a.slice(0, 40))); }
  function cdGoal() { return parseInt(localStorage.getItem('cd_goal') || '1800', 10); }
  function dayKey(ts) { var d = new Date(ts); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function saveDishScan() { if (!lastDishScan) return; var a = cdScans(); a.unshift(lastDishScan); cdSaveScans(a); alert(t('cam_saved')); render(); }
  function startVoiceInput(after) {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert(t('ai_nospeech')); return; }
    var inp = el('aiIn');
    try {
      var rec = new SR(); rec.lang = (S.lang === 'en' ? 'en-US' : (S.lang === 'ko' ? 'ko-KR' : 'vi-VN')); rec.interimResults = false; rec.maxAlternatives = 1;
      if (inp) inp.placeholder = t('ai_listening');
      rec.onresult = function (e) { var txt = e.results[0][0].transcript; if (inp) inp.value = txt; if (after) after(); };
      rec.onerror = function () { if (inp) inp.placeholder = t('ai_placeholder'); };
      rec.onend = function () { if (inp) inp.placeholder = t('ai_placeholder'); };
      rec.start();
    } catch (e) { if (inp) inp.placeholder = t('ai_placeholder'); }
  }
  function speakText(txt) { try { if (!window.speechSynthesis) { alert(t('cam_nospeak')); return; } var u = new SpeechSynthesisUtterance(txt); u.lang = (S.lang === 'en' ? 'en-US' : (S.lang === 'ko' ? 'ko-KR' : 'vi-VN')); window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch (e) {} }
  function readDishAloud() { if (!lastDishScan) return; var s = lastDishScan; var txt = t('cam_title') + ': ' + s.overall + '/100. ' + t('cam_veg') + ' ' + s.veg + '. ' + t('cam_fresh') + ' ' + s.fresh + '. ' + t('cam_kcal') + ' ~' + s.kcal + '. ' + t('cam_vegconf') + ' ' + s.vegConf + '%.'; speakText(txt); }
  function viewDiaryCard() {
    var a = cdScans(); var tk = dayKey(Date.now());
    var today = a.filter(function (x) { return dayKey(x.t) === tk; });
    var total = 0; today.forEach(function (x) { total += x.kcal || 0; });
    var goal = cdGoal(); var remain = goal - total;
    var h = '<div class="card"><div class="label">' + t('diary_title') + '</div>';
    h += scoreBar(t('diary_total') + ' (' + total + '/' + goal + ')', Math.min(100, total / goal * 100));
    h += '<div class="row" style="margin:8px 0"><span>' + t('diary_goal') + '</span> <input id="cdGoalIn" type="number" value="' + goal + '" style="width:90px"/> <button class="btn" id="cdGoalSet">OK</button></div>';
    h += '<div class="hint">' + t('diary_remain') + ': ' + remain + ' kcal</div>';
    if (!today.length) { h += '<div class="hint">' + t('diary_empty') + '</div>'; }
    else { h += '<ul class="shop">'; today.forEach(function (x) { h += '<li>' + (x.ing && x.ing.length ? esc(x.ing.join(', ')) : t('cam_title')) + ' - ~' + x.kcal + ' kcal</li>'; }); h += '</ul>'; }
    h += '</div>';
    return h;
  }
  function viewHistoryCard() {
    var a = cdScans();
    var h = '<div class="card"><div class="label">' + t('hist_title') + '</div>';
    if (!a.length) { h += '<div class="hint">' + t('hist_empty') + '</div></div>'; return h; }
    h += '<div class="rlist">';
    a.slice(0, 12).forEach(function (x) { h += '<div style="display:inline-block;text-align:center;margin:4px"><img src="' + x.img + '" style="width:64px;height:64px;object-fit:cover;border-radius:10px"/><div style="font-size:12px">' + x.overall + ' - ' + x.kcal + '</div></div>'; });
    h += '</div><button class="btn" id="cdClrHist" style="margin-top:8px">' + t('hist_clear') + '</button></div>';
    return h;
  }
  function genMenu() {
    var goal = cdGoal(); var R = (D.RECIPES || []);
    function pick(cats, target) { var pool = R.filter(function (r) { return cats.indexOf(r.cat) >= 0; }); if (!pool.length) pool = R.slice(); pool.sort(function (a, b) { return Math.abs((a.kcal || 0) - target) - Math.abs((b.kcal || 0) - target); }); return pool[Math.floor(Math.random() * Math.min(3, pool.length))] || pool[0]; }
    var bf = pick(['chao', 'uong', 'trang'], Math.round(goal * 0.25));
    var ln = pick(['com', 'mon', 'canh'], Math.round(goal * 0.45));
    var dn = pick(['mon', 'canh', 'com'], Math.round(goal * 0.3));
    var items = [[t('menu_b'), bf], [t('menu_l'), ln], [t('menu_d'), dn]];
    var total = 0; var h = '';
    items.forEach(function (it) { if (!it[1]) return; total += it[1].kcal || 0; h += '<button class="rcard" data-recipe="' + it[1].id + '"><div class="rcard-t">' + it[0] + ': ' + esc(nameOf(it[1])) + '</div><div class="rcard-m">' + catName(it[1].cat) + ' - ' + (it[1].kcal || '?') + ' kcal</div></button>'; });
    h += '<div class="hint" style="margin-top:6px">' + t('menu_total') + ': ~' + total + ' kcal</div>';
    el('menuOut').innerHTML = h; bindMenuButtons();
  }
  function bindMenuButtons() { Array.prototype.forEach.call(document.querySelectorAll('#menuOut [data-recipe]'), function (b) { b.onclick = function () { recipeModal(b.getAttribute('data-recipe')); }; }); }
  function viewCam() {
    var h = '';
    h += '<div class="card note">\ud83d\udcf7 ' + t('cam_note') + '</div>';
    h += '<div class="card"><div class="label">\ud83d\udcf7 ' + t('cam_title') + '</div><div class="hint">' + t('cam_hint') + '</div>';
    h += '<video id="cdvid" autoplay playsinline muted style="width:100%;border-radius:14px;background:#000;display:none;margin-top:10px"></video>';
    h += '<canvas id="cdcap" style="display:none"></canvas>';
    h += '<div class="seg" style="margin-top:10px"><button class="btn" id="cdStart">' + t('cam_start') + '</button><button class="btn btn-primary" id="cdShot">' + t('cam_shot') + '</button></div>';
    h += '<input id="cdFile" type="file" accept="image/*" capture="environment" style="display:none"/>';
    h += '<button class="btn" id="cdUpload" style="margin-top:8px;width:100%">' + t('cam_upload') + '</button></div>';
    h += '<div id="camOut"></div>';
    h += '<div class="card"><div class="label">' + t('menu_title') + '</div><div class="hint">' + t('menu_hint') + '</div><button class="btn btn-primary" id="cdMenuGen" style="margin-top:8px;width:100%">' + t('menu_gen') + '</button><div id="menuOut"></div></div>';
    h += viewDiaryCard();
    h += viewHistoryCard();
    return h;
  }

  // ---------- render & routing ----------
  var TABS = ['home','cal','menu','market','recipe','pray','health','ai','cam','more'];
  function render() {
    if (S.tab !== 'cam') { try { stopDishCam(); } catch (e) {} }
    document.documentElement.setAttribute('data-theme', S.theme);
    document.body.classList.toggle('elder', S.elder);
    el('appTitle').textContent = t('app');
    el('appSlogan').textContent = t('slogan');
    updateNetBadge();
    var v = '';
    switch (S.tab) {
      case 'home': v = viewHome(); break;
      case 'cal': v = viewCalendar(); break;
      case 'menu': v = viewMenu(); break;
      case 'market': v = viewMarket(); break;
      case 'recipe': v = viewRecipe(); break;
      case 'pray': v = viewPray(); break;
      case 'health': v = viewHealth(); break;
      case 'ai': v = viewAI(); break;
      case 'cam': v = viewCam(); break;
      case 'more': v = viewMore(); break;
    }
    el('view').innerHTML = v;
    renderNav();
    bindView();
  }
  function renderNav() {
    var icons = { home:'\ud83c\udfe0', cal:'\ud83d\udcc5', menu:'\ud83c\udf71', market:'\ud83d\uded2', recipe:'\ud83c\udf72', pray:'\ud83d\udcd6', health:'\u2764\ufe0f', ai:'\ud83c\udf99\ufe0f', cam:'\ud83d\udcf7', more:'\u2630' };
    var labels = { home:'nav_home', cal:'nav_cal', menu:'nav_menu', market:'nav_market', recipe:'nav_recipe', pray:'nav_pray', health:'nav_health', ai:'nav_ai', cam:'nav_cam', more:'nav_more' };
    var h = '';
    TABS.forEach(function (tb) { h += '<button class=\"nav-b ' + (S.tab===tb?'on':'') + '\" data-tab=\"' + tb + '\"><span>' + icons[tb] + '</span><em>' + t(labels[tb]) + '</em></button>'; });
    el('nav').innerHTML = h;
  }

  function bindView() {
    // recipe chips / cards
    Array.prototype.forEach.call(document.querySelectorAll('[data-recipe]'), function (b) {
      b.addEventListener('click', function () { recipeModal(b.getAttribute('data-recipe')); });
    });
    if (S.tab === 'home') {
      var mb = el('markBtn'); if (mb) mb.addEventListener('click', function () { markToday(); render(); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-go]'), function (b) { b.addEventListener('click', function () { S.tab = b.getAttribute('data-go'); render(); }); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-online]'), function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-online'); var map = { news: 'https://www.google.com/search?q=cao+dai+bai+giang+an+chay', market: 'https://www.google.com/maps/search/quan+chay+gan+day', food: 'https://www.google.com/search?q=mua+thuc+pham+chay+online' }; if (map[k]) openExt(map[k]); }); });
    }
    if (S.tab === 'cal') {
      Array.prototype.forEach.call(document.querySelectorAll('[data-mode]'), function (b) {
        b.addEventListener('click', function () { S.mode = b.getAttribute('data-mode'); localStorage.setItem('cd_mode', S.mode); render(); });
      });
    }
    if (S.tab === 'menu') {
      window._mSel = window._mSel || { m: 1, d: 0 };
      Array.prototype.forEach.call(document.querySelectorAll('[data-m]'), function (b) { b.addEventListener('click', function () { window._mSel.m = +b.getAttribute('data-m'); render(); }); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-d]'), function (b) { b.addEventListener('click', function () { window._mSel.d = +b.getAttribute('data-d'); render(); }); });
      var sd = el('shopDay'); if (sd) sd.addEventListener('click', function () { el('shopOut').innerHTML = shoppingFromMenu(dayMenu(window._mSel.m, window._mSel.d)); });
    }
    if (S.tab === 'recipe') {
      var rs = el('rsearch'); if (rs) rs.addEventListener('input', function () { window._rq = rs.value; var p = rs.selectionStart; render(); var n = el('rsearch'); if (n) { n.focus(); try { n.setSelectionRange(p, p); } catch (e) {} } });
      Array.prototype.forEach.call(document.querySelectorAll('[data-cat]'), function (b) { b.addEventListener('click', function () { window._rcat = b.getAttribute('data-cat'); render(); }); });
    }
    if (S.tab === 'pray') {
      Array.prototype.forEach.call(document.querySelectorAll('[data-acc]'), function (b) { b.addEventListener('click', function () { var bd = el('acc' + b.getAttribute('data-acc')); bd.classList.toggle('open'); }); });
    }
    if (S.tab === 'health') { var hc = el('hCalc'); if (hc) hc.addEventListener('click', calcHealth); }
    if (S.tab === 'cam') {
      var cs = el('cdStart'); if (cs) cs.addEventListener('click', startDishCam);
      var csh = el('cdShot'); if (csh) csh.addEventListener('click', shotDish);
      var cup = el('cdUpload'); if (cup) cup.addEventListener('click', function () { el('cdFile').click(); });
      var cfi = el('cdFile'); if (cfi) cfi.addEventListener('change', loadDishFile);
      var mg = el('cdMenuGen'); if (mg) mg.addEventListener('click', genMenu);
      var gs = el('cdGoalSet'); if (gs) gs.addEventListener('click', function () { var val = parseInt(el('cdGoalIn').value, 10); if (val > 0) { localStorage.setItem('cd_goal', val); render(); } });
      var clh = el('cdClrHist'); if (clh) clh.addEventListener('click', function () { if (confirm(t('hist_clear') + '?')) { localStorage.removeItem('cd_scans'); render(); } });
    }
    if (S.tab === 'ai') {
      var send = function () { var inp = el('aiIn'); var q = inp.value.trim(); if (!q) return; pushChat('me', q); inp.value = ''; setTimeout(function () { var ans = aiReply(q); pushChat('ai', ans); var sp = el('aiSpeak'); if (sp && sp.checked) speakText(ans); }, 200); };
      el('aiSend').addEventListener('click', send);
      el('aiIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
      var amic = el('aiMic'); if (amic) amic.addEventListener('click', function () { startVoiceInput(send); });
    }
    if (S.tab === 'market') {
      Array.prototype.forEach.call(document.querySelectorAll('[data-vcat]'), function (b) { b.addEventListener('click', function () { window._vcat = b.getAttribute('data-vcat'); render(); }); });
      Array.prototype.forEach.call(document.querySelectorAll('#evCerts .pill'), function (b) { b.addEventListener('click', function () { b.classList.toggle('on'); }); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-vendor]'), function (b) { b.addEventListener('click', function () { vendorModal(b.getAttribute('data-vendor')); }); });
      var ec = el('evCalc'); if (ec) ec.addEventListener('click', runEval);
    }
    if (S.tab === 'more') {
      Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (b) { b.addEventListener('click', function () { S.lang = b.getAttribute('data-lang'); localStorage.setItem('cd_lang', S.lang); render(); }); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-theme]'), function (b) { b.addEventListener('click', function () { S.theme = b.getAttribute('data-theme'); localStorage.setItem('cd_theme', S.theme); render(); }); });
      var ec = el('elderChk'); if (ec) ec.addEventListener('change', function () { S.elder = ec.checked; localStorage.setItem('cd_elder', S.elder ? '1' : '0'); render(); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-onpref]'), function (b) { b.addEventListener('click', function () { localStorage.setItem('cd_online', b.getAttribute('data-onpref')); render(); }); });
      var nb = el('notifBtn'); if (nb) nb.addEventListener('click', enableNotif);
      var nf = el('notifOff'); if (nf) nf.addEventListener('click', disableNotif);
      var nt = el('notifTest'); if (nt) nt.addEventListener('click', function () { showReminder(D.DEFAULT_REMINDERS[0]); });
    }
  }

  function init() {
    el('nav').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]'); if (!b) return; S.tab = b.getAttribute('data-tab'); render();
      if (window.CDAds) { try { window.CDAds.onNavigate(); } catch (e2) {} }
    });
    el('modalClose').addEventListener('click', function () { el('modal').classList.remove('show'); });
    el('modal').addEventListener('click', function (e) { if (e.target.id === 'modal') el('modal').classList.remove('show'); });
    render();
    if (window.CDAds) { try { window.CDAds.init(); } catch (e3) {} }
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js').catch(function () {}); }
    if (S.notif && notifSupported() && Notification.permission === 'granted') { scheduleReminders(); }
  }
  document.addEventListener('DOMContentLoaded', init);
})();
