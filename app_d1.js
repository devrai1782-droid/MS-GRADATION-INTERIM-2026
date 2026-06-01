// ═══ DPI: Console allowed, others blocked ═══
document.addEventListener = (function(orig) {
  return function(type, fn, opts) {
    if (window.currentUser === 'DPI') return orig.call(this, type, fn, opts);
    if (type === 'contextmenu' || type === 'selectstart' || type === 'dragstart') return;
    return orig.call(this, type, fn, opts);
  };
})(document.addEventListener);
// ═══════════════════════════════════════════════

// ═══ EARLY RIGHT-CLICK BLOCK (sabke liye, DPI ko chhodke) ═══
(function _earlyRightClickBlock() {

  // Right-click / context menu — DPI ke alawa sab block
  document.addEventListener('contextmenu', function(e) {
    if (window.currentUser !== 'DPI') {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Ctrl+Shift+C — Inspect Element — DPI ke alawa sab block
  document.addEventListener('keydown', function(e) {
    if (window.currentUser !== 'DPI') {
      var ctrl = e.ctrlKey || e.metaKey;
      var shift = e.shiftKey;
      var k = e.key || '';
      if (ctrl && shift && (k === 'C' || k === 'c')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    }
  }, true);
})();
// ════════════════════════════════════════════════


// ═══════════════════════════════════════
// DATE VALIDATION CSS INJECTION
// ═══════════════════════════════════════
(function injectDateValidationCSS() {
  const style = document.createElement('style');
  style.id = 'date-validation-styles';
  style.textContent = `
    @keyframes shake-invalid {
      0%   { transform: translateX(0); }
      20%  { transform: translateX(-5px); }
      40%  { transform: translateX(5px); }
      60%  { transform: translateX(-4px); }
      80%  { transform: translateX(4px); }
      100% { transform: translateX(0); }
    }
    .invalid-field {
      border: 2px solid #991b1b !important;
      background: #fee2e2 !important;
      color: #7f1d1d !important;
      box-shadow: 0 0 0 3px rgba(153, 27, 27, 0.28) !important;
      border-radius: 4px !important;
      animation: shake-invalid 0.35s ease !important;
    }
    .invalid-field:focus {
      background: #fecaca !important;
      box-shadow: 0 0 0 3px rgba(153, 27, 27, 0.40) !important;
    }
    /* probOrderDate has inline styles set in HTML — override them too */
    #probOrderDate.invalid-field {
      border: 2px solid #991b1b !important;
      background: #fee2e2 !important;
      color: #7f1d1d !important;
      box-shadow: 0 0 0 3px rgba(153, 27, 27, 0.28) !important;
    }
  `;
  document.head.appendChild(style);
})();

// ═══════════════════════════════════════
// JS Block 1
// ═══════════════════════════════════════

(function() {
  'use strict';

  // ── 1. RIGHT-CLICK DISABLE ──
  // (Handled above via capture:true listener — DPI ke alawa sab ke liye block)

  // ── 2. KEYBOARD SHORTCUTS BLOCK ──
  document.addEventListener('keydown', function(e) {
    if (window.currentUser === 'DPI') return; // DPI ko sab allow
    var k = e.key || '';
    var ctrl = e.ctrlKey || e.metaKey;
    var shift = e.shiftKey;

    // F12 — DevTools
    if (k === 'F12') { e.preventDefault(); return false; }

    // Ctrl+Shift+I — DevTools
    if (ctrl && shift && (k === 'I' || k === 'i')) { e.preventDefault(); return false; }

    // Ctrl+Shift+J — Console
    if (ctrl && shift && (k === 'J' || k === 'j')) { e.preventDefault(); return false; }

    // Ctrl+Shift+C — Inspect
    if (ctrl && shift && (k === 'C' || k === 'c')) { e.preventDefault(); return false; }

    // Ctrl+Shift+K — Firefox Console
    if (ctrl && shift && (k === 'K' || k === 'k')) { e.preventDefault(); return false; }

    // Ctrl+Shift+E — Firefox Network
    if (ctrl && shift && (k === 'E' || k === 'e')) { e.preventDefault(); return false; }

    // Ctrl+U — View Source
    if (ctrl && (k === 'U' || k === 'u')) { e.preventDefault(); return false; }

    // Ctrl+S — Save file
    if (ctrl && (k === 'S' || k === 's')) { e.preventDefault(); return false; }

    // Ctrl+A — Select All
    if (ctrl && (k === 'A' || k === 'a')) { e.preventDefault(); return false; }

    // Ctrl+C — Copy (block on body, not inputs)
    if (ctrl && (k === 'C' || k === 'c')) {
      var tag = (document.activeElement || {}).tagName || '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault(); return false;
      }
    }

    // Ctrl+P — Print
    if (ctrl && (k === 'P' || k === 'p')) { e.preventDefault(); return false; }

    // Ctrl+R / F5 — Refresh block
    // if (k === 'F5' || (ctrl && (k === 'R' || k === 'r'))) { e.preventDefault(); return false; }
  }, true);

  // ── 3. TEXT SELECTION DISABLE ──
  document.addEventListener('selectstart', function(e) {
    var tag = (e.target || {}).tagName || '';
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault(); return false;
    }
  }, true);

  // ── 4. DRAG DISABLE ──
  document.addEventListener('dragstart', function(e) {
    e.preventDefault(); return false;
  }, true);

  // ── 5. DEVTOOLS DETECTION (window size method) ──
  (function() {
    var _threshold = 160;
    var _devOpen = false;
    function _checkDevTools() {
      var widthDiff  = window.outerWidth  - window.innerWidth;
      var heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > _threshold || heightDiff > _threshold) {
        if (!_devOpen) {
          _devOpen = true;
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a1a2e;color:#e02424;font-family:sans-serif;text-align:center;flex-direction:column;">'
            + '<div style="font-size:60px;">⛔</div>'
            + '<h1 style="font-size:28px;margin:16px 0 8px;">Access Denied</h1>'
            + '<p style="font-size:15px;color:#f0a500;">Developer Tools खोलना इस application में प्रतिबंधित है।<br>© 2026 DPI Madhya Pradesh</p>'
            + '</div>';
        }
      } else {
        _devOpen = false;
      }
    }
    setInterval(_checkDevTools, 1000);
  })();

  // ── 6. CONSOLE WARNING ──
  setTimeout(function() {
    try {
      console.clear();
      console.log('%c⛔ STOP!', 'color:#e02424;font-size:48px;font-weight:900;');
      console.log('%cयह browser feature केवल developers के लिए है।\nMS Gradation ERP का code copy करना या inspect करना\nकानूनी अपराध है। © 2026 DPI Madhya Pradesh',
        'color:#f0a500;font-size:14px;font-weight:700;line-height:2;');
    } catch(err) {}
  }, 500);

  // ── 7. PRINT BLOCK ──
  window.addEventListener('beforeprint', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  });

  // ── 8. IFRAME EMBEDDING PREVENTION ──
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

})();


// ═══════════════════════════════════════
// EMPLOYEE RECORD PRINT FUNCTION
// ═══════════════════════════════════════
function printEmployeeRecord() {
  function val(id) { var el=document.getElementById(id); if(!el) return '\u2014'; var v=(el.value||'').trim(); return v||'\u2014'; }
  function fmtDate(id) { var el=document.getElementById(id); if(!el||!el.value) return '\u2014'; var v=el.value.trim(); if(!v||v==='\u2014') return '\u2014'; if(/^\d{4}-\d{2}-\d{2}$/.test(v)){var p=v.split('-');return p[2]+'-'+p[1]+'-'+p[0];} return v; }
  var probYes=document.getElementById('probYes');
  var probStatus=(probYes&&probYes.checked)?'\u0939\u093e\u0901 (\u0906\u0926\u0947\u0936 \u091c\u093e\u0930\u0940)':'\u0928\u0939\u0940\u0902';
  var probOrderNo=val('probOrderNo'), probOrderDate=fmtDate('probOrderDate');
  var transferDate=(val('in19mode')==='NIL')?'NIL':fmtDate('in19');
  var now=new Date();
  var printDateTime=now.toLocaleString('hi-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});
  var empName=val('in4'),uniqueId=val('in3'),gNo=val('in2'),sNo=val('in1');
  var genderText=val('in6')==='M'?'\u092a\u0941\u0930\u0941\u0937 (M)':val('in6')==='F'?'\u092e\u0939\u093f\u0932\u093e (F)':'\u2014';
  var modeText=val('in8')==='DIR'?'Direct (DIR)':val('in8')==='PRO'?'Promotion (PRO)':val('in8');
  var probBlock='';
  if(probStatus==='\u0939\u093e\u0901 (\u0906\u0926\u0947\u0936 \u091c\u093e\u0930\u0940)'||probOrderNo!=='\u2014'||probOrderDate!=='\u2014'){
    probBlock='<div class="prob-box"><div class="prob-title">&#x26A0; \u092a\u0930\u0940\u0935\u0940\u0915\u094d\u0937\u093e \u0905\u0935\u0927\u093f</div><table style="margin:0;"><tr><td class="lbl">\u0906\u0926\u0947\u0936</td><td class="val">'+probStatus+'</td><td class="lbl">\u0906\u0926\u0947\u0936 \u0915\u094d\u0930\u092e\u093e\u0902\u0915</td><td class="val">'+probOrderNo+'</td></tr><tr><td class="lbl">\u0906\u0926\u0947\u0936 \u0926\u093f\u0928\u093e\u0902\u0915</td><td class="val" colspan="3">'+probOrderDate+'</td></tr></table></div>';
  }
  var css='*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:10px;color:#000;background:#fff;}.page{width:210mm;min-height:297mm;margin:0 auto;padding:10mm 12mm 8mm 12mm;}.header{text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:8px;}.t1{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:1px;}.t2{font-size:10px;font-weight:600;margin-top:2px;}.t3{font-size:9px;color:#333;margin-top:3px;}.emp-banner{border:1.5px solid #000;padding:5px 10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;background:#f2f2f2;}.emp-name{font-size:13px;font-weight:800;text-transform:uppercase;}.emp-ids{font-size:10px;font-weight:600;text-align:right;line-height:1.7;}.sec{background:#ddd;border:1px solid #000;padding:3px 8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0;}table{width:100%;border-collapse:collapse;margin-bottom:6px;}td{border:1px solid #999;padding:3px 6px;vertical-align:middle;line-height:1.4;}td.lbl{width:38%;font-weight:700;font-size:9px;background:#fafafa;text-transform:uppercase;}td.lbl .fn{display:inline-block;background:#555;color:#fff;font-size:8px;font-weight:800;padding:1px 4px;border-radius:2px;margin-right:4px;min-width:14px;text-align:center;}td.val{font-size:10px;font-weight:600;color:#000;}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;}.two-col table{margin-bottom:0;}.prob-box{border:1.5px dashed #555;padding:5px 8px;margin-bottom:6px;background:#fafafa;}.prob-title{font-size:9px;font-weight:800;margin-bottom:4px;text-transform:uppercase;}.footer{border-top:1.5px solid #000;margin-top:10px;padding-top:5px;display:flex;justify-content:space-between;align-items:flex-end;font-size:8.5px;}.wm{font-size:8px;color:#777;font-style:italic;}.signbox{text-align:center;font-size:9px;font-weight:700;}.signline{width:120px;border-bottom:1px solid #000;margin:18px auto 3px auto;}.badge{display:inline-block;border:1px solid #000;padding:1px 6px;font-size:9px;font-weight:700;border-radius:2px;}.pbar{text-align:center;padding:12px;background:#f5f5f5;border-bottom:1px solid #ccc;margin-bottom:10px;}.pbar button{padding:8px 24px;font-size:13px;font-weight:700;background:#222;color:#fff;border:none;border-radius:4px;cursor:pointer;margin:0 5px;}.pbar button:hover{background:#444;}@media print{body{margin:0;}.page{width:100%;padding:8mm 10mm;margin:0;}.pbar{display:none!important;}@page{size:A4;margin:0;}}';
  var html='<!DOCTYPE html><html lang="hi"><head><meta charset="UTF-8"><title>'+empName+' ('+uniqueId+')</title><style>'+css+'</style></head><body>'
    +'<div class="pbar"><button onclick="window.print()">\uD83D\uDDB6\uFE0F \u092a\u094d\u0930\u093f\u0902\u091f \u0915\u0930\u0947\u0902</button><button onclick="window.close()">\u2715 \u092c\u0902\u0926 \u0915\u0930\u0947\u0902</button></div>'
    +'<div class="page">'
    +'<div class="header"><div class="t1">\u0932\u094b\u0915 \u0936\u093f\u0915\u094d\u0937\u0923 \u0938\u0902\u091a\u093e\u0932\u0928\u093e\u0932\u092f, \u092e\u0927\u094d\u092f\u092a\u094d\u0930\u0926\u0947\u0936</div><div class="t2">MS \u0938\u0902\u0935\u0930\u094d\u0917 \u0935\u0930\u0940\u092f\u0924\u093e \u0938\u0942\u091a\u0940 01/04/2026 \u2014 \u0932\u094b\u0915 \u0938\u0947\u0935\u0915 \u0935\u093f\u0935\u0930\u0923 \u092a\u0924\u094d\u0930</div><div class="t3">\u092e\u0941\u0926\u094d\u0930\u0923 \u0926\u093f\u0928\u093e\u0902\u0915: '+printDateTime+'</div></div>'
    +'<div class="emp-banner"><div class="emp-name">'+(empName!=='\u2014'?empName:'\u0928\u093e\u092e \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902')+'</div><div class="emp-ids">Unique ID: <strong>'+uniqueId+'</strong><br>G.N.: <strong>'+gNo+'</strong><br>S.No.: <strong>'+sNo+'</strong></div></div>'
    +'<div class="sec">&#9312; \u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0917\u0924 \u090f\u0935\u0902 \u0936\u0948\u0915\u094d\u0937\u0923\u093f\u0915 \u091c\u093e\u0928\u0915\u093e\u0930\u0940</div>'
    +'<div class="two-col"><table>'
    +'<tr><td class="lbl"><span class="fn">5</span>\u0935\u0930\u094d\u0917</td><td class="val">'+val('in5')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">6</span>\u0932\u093f\u0902\u0917</td><td class="val">'+genderText+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">7</span>\u091c\u0928\u094d\u092e \u0924\u093f\u0925\u093f</td><td class="val">'+fmtDate('in7')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">R</span>\u0938\u0947\u0935\u093e\u0928\u093f\u0935\u0943\u0924\u094d\u0924\u093f (62Y)</td><td class="val">'+val('retirementField')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">13</span>\u0917\u0943\u0939 \u091c\u093f\u0932\u093e</td><td class="val">'+val('in13')+'</td></tr>'
    +'</table><table>'
    +'<tr><td class="lbl"><span class="fn">8</span>\u0928\u093f\u092f\u0941\u0915\u094d\u0924\u093f \u0924\u0930\u0940\u0915\u093e</td><td class="val">'+modeText+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">9</span>UG \u0935\u093f\u0937\u092f</td><td class="val">'+val('in9')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">10</span>\u0935\u094d\u092f\u093e\u0935\u0938\u093e\u092f\u093f\u0915 \u092f\u094b\u0917\u094d\u092f\u0924\u093e</td><td class="val">'+val('in10')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">11</span>PG \u092f\u094b\u0917\u094d\u092f\u0924\u093e</td><td class="val">'+val('in11')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">12</span>PG \u0935\u093f\u0937\u092f</td><td class="val">'+val('in12')+'</td></tr>'
    +'</table></div>'
    +'<div class="sec">&#9313; \u0928\u093f\u092f\u0941\u0915\u094d\u0924\u093f \u090f\u0935\u0902 \u092a\u0926\u094b\u0928\u094d\u0928\u0924\u093f \u0935\u093f\u0935\u0930\u0923</div>'
    +'<table style="margin-bottom:6px;"><tr><td class="lbl"><span class="fn">14</span>\u092a\u094d\u0930\u0925\u092e \u0928\u093f\u092f\u0941\u0915\u094d\u0924\u093f \u0924\u093f\u0925\u093f</td><td class="val">'+fmtDate('in14')+'</td><td class="lbl"><span class="fn">15</span>\u092a\u094d\u0930\u0925\u092e \u0928\u093f\u092f\u0941\u0915\u094d\u0924\u093f \u092a\u0926</td><td class="val">'+val('in15')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">16</span>\u0905\u0927\u094d\u092f\u093e\u092a\u0915 \u092a\u094d\u0930\u094b\u0928\u094d\u0928\u0924\u093f \u0924\u093f\u0925\u093f</td><td class="val">'+fmtDate('in16')+'</td><td class="lbl"><span class="fn">17</span>\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0938\u0902\u0935\u0930\u094d\u0917 \u0924\u093f\u0925\u093f</td><td class="val">'+fmtDate('in17')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">18</span>\u0935\u0930\u093f\u0937\u094d\u0920\u0924\u093e \u0924\u093f\u0925\u093f</td><td class="val">'+fmtDate('in18')+'</td><td class="lbl"><span class="fn">19</span>\u0905\u0902\u0924\u0930 \u0938\u0902\u092d\u093e\u0917 \u0938\u094d\u0925\u093e\u0928\u093e\u0902\u0924\u0930\u0923</td><td class="val">'+transferDate+'</td></tr></table>'
    +probBlock
    +'<div class="sec">&#9314; \u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u092a\u0926\u0938\u094d\u0925\u093e\u092a\u0928\u093e</div>'
    +'<table style="margin-bottom:6px;"><tr><td class="lbl"><span class="fn">20</span>\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0936\u093e\u0932\u093e</td><td class="val">'+val('in20')+'</td><td class="lbl"><span class="fn">21</span>UDISE \u0915\u094b\u0921</td><td class="val">'+val('in21')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">22</span>\u092a\u0926\u0938\u094d\u0925\u093e\u092a\u0928\u093e \u091c\u093f\u0932\u093e</td><td class="val" colspan="3">'+val('in22')+'</td></tr></table>'
    +'<div class="sec">&#9315; \u0909\u091a\u094d\u091a \u092a\u0926 \u092a\u094d\u0930\u092d\u093e\u0930</div>'
    +'<table style="margin-bottom:6px;"><tr><td class="lbl"><span class="fn">23</span>\u0909\u091a\u094d\u091a \u092a\u0926 \u091c\u094d\u0935\u093e\u0907\u0928</td><td class="val"><span class="badge">'+val('in23')+'</span></td><td class="lbl"><span class="fn">26</span>\u0909\u091a\u094d\u091a \u092a\u0926 \u091c\u093f\u0932\u093e</td><td class="val">'+val('in26')+'</td></tr>'
    +'<tr><td class="lbl"><span class="fn">24</span>\u0936\u093e\u0932\u093e \u0928\u093e\u092e</td><td class="val">'+val('in24')+'</td><td class="lbl"><span class="fn">25</span>UDISE \u0915\u094b\u0921</td><td class="val">'+val('in25')+'</td></tr></table>'
    +'<div class="sec">&#9316; \u091f\u093f\u092a\u094d\u092a\u0923\u0940 (Remark)</div>'
    +'<table style="margin-bottom:8px;"><tr><td class="lbl" style="width:20%;"><span class="fn">27</span>Remark</td><td class="val" style="font-style:italic;">'+val('in27')+'</td></tr></table>'
    +'<div class="footer"><div><div style="font-weight:700;font-size:9px;">MS \u0938\u0902\u0935\u0930\u094d\u0917 \u0935\u0930\u0940\u092f\u0924\u093e \u0938\u0942\u091a\u0940 01/04/2026</div><div class="wm">\u00a9 2026 \u0932\u094b\u0915 \u0936\u093f\u0915\u094d\u0937\u0923 \u0938\u0902\u091a\u093e\u0932\u0928\u093e\u0932\u092f, \u092e.\u092a\u094d\u0930.</div><div class="wm">\u092e\u0941\u0926\u094d\u0930\u0923: '+printDateTime+' | ID: '+uniqueId+'</div></div>'
    +'<div class="signbox"><div class="signline"></div>\u0905\u0927\u093f\u0915\u0943\u0924 \u0939\u0938\u094d\u0924\u093e\u0915\u094d\u0937\u0930<div style="font-size:8px;color:#555;">(Authorised Signature)</div></div></div>'
    +'</div></body></html>';
  var w=window.open('','_blank','width=900,height=700,scrollbars=yes');
  if(!w){var b=new Blob([html],{type:'text/html;charset=utf-8'});window.open(URL.createObjectURL(b),'_blank');return;}
  w.document.open(); w.document.write(html); w.document.close();
  w.onload=function(){w.focus();};
}


// ═══════════════════════════════════════
// JS Block 2
// ═══════════════════════════════════════

// ══ SAFE STORAGE — Edge Tracking Prevention workaround ══
(function() {
  var _memStore = {};
  function _safeLS() {
    try { localStorage.setItem('__test__','1'); localStorage.removeItem('__test__'); return localStorage; }
    catch(e) { return null; }
  }
  var _ls = _safeLS();
  window._safeStorage = {
    getItem: function(k) {
      if (_ls) { try { return _ls.getItem(k); } catch(e){} }
      return _memStore[k] !== undefined ? _memStore[k] : null;
    },
    setItem: function(k, v) {
      if (_ls) { try { _ls.setItem(k, v); } catch(e){} }
      _memStore[k] = v;
    },
    removeItem: function(k) {
      if (_ls) { try { _ls.removeItem(k); } catch(e){} }
      delete _memStore[k];
    }
  };
  // Patch global localStorage usage gracefully
  if (!_ls) {
    console.warn('⚠️ localStorage blocked (Edge Tracking Prevention). Using in-memory fallback.');
    try {
      Object.defineProperty(window, 'localStorage', {
        get: function() { return window._safeStorage; }
      });
    } catch(e) {}
  }

// ═══════════════════════════════════════════════════════
//  SUPABASE SETTINGS HELPERS
//  Tables used:
//    erp_settings  — key/value store (config_start_date, config_end_date, ms_sheet_title)
//    ms_user_overrides — per-user date overrides
//    pw_reset_log  — password reset audit log
// ═══════════════════════════════════════════════════════
// ── D1 Worker URL — Supabase se migrate kiya ──
const _SB_URL  = "https://ms-gradation-api.devrai1782.workers.dev"; // ← Aapka Worker URL
const _SB_HDR  = { "Content-Type": "application/json" };

// ── erp_settings: get ──
async function _sbGetSetting(key) {
  try {
    const r = await fetch(_SB_URL + "/erp_settings?key=eq." + encodeURIComponent(key) + "&select=value", { headers: _SB_HDR });
    const d = await r.json();
    return (d && d[0]) ? d[0].value : null;
  } catch(e) { return null; }
}
// ── erp_settings: set ──
async function _sbSetSetting(key, value) {
  try {
    await fetch(_SB_URL + "/erp_settings", {
      method: "POST",
      headers: { ..._SB_HDR, "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ key, value })
    });
  } catch(e) { console.error("_sbSetSetting error:", e); }
}
// ── ms_user_overrides: get all ──
async function _sbGetOverrides() {
  try {
    const r = await fetch(_SB_URL + "/ms_user_overrides?select=user_id,start_date,end_date,closed", { headers: _SB_HDR });
    const rows = await r.json();
    const obj = {};
    if(Array.isArray(rows)) rows.forEach(row => {
      obj[row.user_id] = { start: row.start_date, end: row.end_date, closed: row.closed || false };
    });
    return obj;
  } catch(e) { return {}; }
}
// ── ms_user_overrides: upsert one user ──
async function _sbSetOverride(userId, start, end, closed) {
  try {
    await fetch(_SB_URL + "/ms_user_overrides", {
      method: "POST",
      headers: { ..._SB_HDR, "Prefer": "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ user_id: userId, start_date: start, end_date: end, closed: closed || false })
    });
  } catch(e) { console.error("_sbSetOverride error:", e); }
}
// ── ms_user_overrides: delete all ──
async function _sbClearOverrides() {
  try {
    await fetch(_SB_URL + "/ms_user_overrides?user_id=neq.NONE", {
      method: "DELETE", headers: _SB_HDR
    });
  } catch(e) { console.error("_sbClearOverrides error:", e); }
}
// ── pw_reset_log: insert ──
async function _sbLogPwReset(userId, oldPass, newPass, resetBy) {
  try {
    await fetch(_SB_URL + "/pw_reset_log", {
      method: "POST",
      headers: { ..._SB_HDR, "Prefer": "return=minimal" },
      body: JSON.stringify({ user_id: userId, old_pass: oldPass, new_pass: newPass, reset_by: resetBy || window.currentUser || 'DPI' })
    });
  } catch(e) { console.error("_sbLogPwReset error:", e); }
}
// ── pw_reset_log: get all ──
async function _sbGetPwResetLog() {
  try {
    const r = await fetch(_SB_URL + "/pw_reset_log?select=*&order=created_at.desc", { headers: _SB_HDR });
    return await r.json();
  } catch(e) { return []; }
}
// ── pw_reset_log: clear all ──
async function _sbClearPwResetLog() {
  try {
    await fetch(_SB_URL + "/pw_reset_log?id=gt.0", { method: "DELETE", headers: _SB_HDR });
  } catch(e) { console.error("_sbClearPwResetLog error:", e); }
}
// ✅ FIX: Expose Supabase helpers + constants globally (were trapped inside IIFE closure)
window._SB_URL           = _SB_URL;
window._SB_HDR           = _SB_HDR;
window._sbGetSetting     = _sbGetSetting;
window._sbSetSetting     = _sbSetSetting;
window._sbGetOverrides   = _sbGetOverrides;
window._sbSetOverride    = _sbSetOverride;
window._sbClearOverrides = _sbClearOverrides;
window._sbLogPwReset     = _sbLogPwReset;
window._sbGetPwResetLog  = _sbGetPwResetLog;
window._sbClearPwResetLog= _sbClearPwResetLog;
})();


// ═══════════════════════════════════════
// JS Block 3
// ═══════════════════════════════════════

function openUserManual() {
  var m = document.getElementById('userManualModal');
  m.style.display = 'flex';
  m.style.animation = 'pa-fade-in 0.25s ease forwards';
  umTab(0);
}
function closeUserManual() {
  document.getElementById('userManualModal').style.display = 'none';
}
function umTab(idx) {
  var panes = document.querySelectorAll('.um-pane');
  var tabs  = document.querySelectorAll('.um-tab');
  panes.forEach(function(p, i) { p.style.display = i === idx ? 'block' : 'none'; });
  tabs.forEach(function(t, i) {
    t.style.color        = i === idx ? '#1a237e' : '#64748b';
    t.style.borderBottom = i === idx ? '3px solid #3b82f6' : '3px solid transparent';
    t.style.fontWeight   = i === idx ? '700' : '600';
    t.style.background   = i === idx ? 'white' : 'none';
  });
}
document.getElementById('userManualModal').addEventListener('click', function(e) {
  if (e.target === this) closeUserManual();
});


// ═══════════════════════════════════════
// JS Block 4
// ═══════════════════════════════════════

let historyStore = {};
const fieldNames = {
field1: "S.No",
field2: "G.NO",
field3: "Unique ID",
field4: "Name",
field5: "Category",
field6: "Gender",
field7: "DOB",
field8: "Mode of Appointment",
field9: "UG Subject as per appointment and Promotion",
field10: "Professional Qualification",
field11: "PG Qualification",
field12: "PG Subject",
field13: "Home District",
field14: "Date of First Appointment",
field15: "First appointment Designation",
field16: "Date of Appointment in Adhyapak by promotion ",
field17: "Date of Appointment in present cadre",
field18: "Date of seniority in present cadre",
field19: "Inter division Transfer Date",
field20: "Present Posting Place",
field21: "UDISE Code",
field22: "Present Posting District",
field23: "उच्च पद पर ज्वाइन किया (YES OR NO)",
field24: "उच्च पद प्रभार की शाला का नाम",
field25: "उच्च पद प्रभार की शाला का UDISE कोड",
field26: "उच्च पद प्रभार का जिला",
field27: "Remark"
};
window.alert = function(msg) {
console.log("Blocked alert:", msg);
};
let keyTimer;
window.addEventListener('keydown', function(e) {
if (e.key && e.key.toLowerCase() === 'a' && !keyTimer) {
keyTimer = setTimeout(function() {
const lockActive = document.getElementById('lockScreen')?.style.display === 'flex';
if(!lockActive && window.currentUser !== 'DPI') return;
openDpiPasswordModal();
}, 2000);
}
});
window.addEventListener('keyup', function(e) {
if (e.key && e.key.toLowerCase() === 'a') { clearTimeout(keyTimer); keyTimer = null; }
});
function openDpiPasswordModal() {
const modal = document.getElementById('dpiPassModal');
modal.style.display = 'flex';
document.getElementById('dpiPassInput').value = '';
document.getElementById('dpiPassErr').textContent = '';
setTimeout(() => document.getElementById('dpiPassInput').focus(), 100);
}
function verifyDpiPass() {
const pwd = document.getElementById('dpiPassInput').value;
if(pwd !== (window._importPwd || '1782')) { // ✅ Runtime check
document.getElementById('dpiPassErr').textContent = '❌ Galat password!';
document.getElementById('dpiPassInput').value = '';
document.getElementById('dpiPassInput').focus();
return;
}
document.getElementById('dpiPassModal').style.display = 'none';
toggleDPI();
}
function onMaintToggleChange() {
const on     = document.getElementById('maintToggle').checked;
const slider = document.getElementById('maintToggleSlider');
const knob   = document.getElementById('maintToggleKnob');
const label  = document.getElementById('maintStatusLabel');
if(on) {
slider.style.background = '#f59e0b'; knob.style.left = '27px';
label.style.background = '#fef3c7'; label.style.color = '#92400e';
label.textContent = 'Status: ON — Maintenance चालू है';
} else {
slider.style.background = '#ccc'; knob.style.left = '3px';
label.style.background = '#f3f4f6'; label.style.color = '#6b7280';
label.textContent = 'Status: OFF';
}
}
async function saveMaintSettings() {
const on  = document.getElementById('maintToggle').checked;
const msg = document.getElementById('maintMsgInput').value.trim();
if(on && !msg) { myAlert('Please enter the Maintenance message.'); return; }
const cfg = {
active:   on,
message:  msg,
startTime: document.getElementById('maintStartTime').value,
endTime:   document.getElementById('maintEndTime').value,
durationText: document.getElementById('maintDurationText').value.trim(),
forJD:  document.getElementById('maintForJD').checked,
forDEO: document.getElementById('maintForDEO').checked,
savedAt: new Date().toISOString()
};
// ✅ FIX: Supabase ms_maintenance table mein save karo
const btn = document.querySelector('[onclick="saveMaintSettings()"]');
if(btn) { btn.innerHTML = '⏳ Saving...'; btn.disabled = true; }
try {
  const maintResp = await fetch(_SB_URL + "/ms_maintenance?id=eq.1", {
    method: "PATCH",
    headers: { ..._SB_HDR, "Prefer": "return=minimal" },
    body: JSON.stringify({
      is_active: on,
      message: msg,
      start_time: document.getElementById('maintStartTime').value,
      end_time:   document.getElementById('maintEndTime').value,
      jd_filter:  document.getElementById('maintForJD').checked,
      deo_filter: document.getElementById('maintForDEO').checked
    })
  });
  console.log('Maintenance PATCH status:', maintResp.status);
  if(!maintResp.ok) {
    const errText = await maintResp.text();
    console.error('Maintenance PATCH error:', errText);
    myAlert('❌ Supabase save failed! Status: ' + maintResp.status + ' | ' + errText);
    if(btn) { btn.innerHTML = '💾 Maintenance Settings Save करें'; btn.disabled = false; }
    return;
  }
} catch(e) { console.error('Maintenance Supabase save error:', e); }
// localStorage backup
localStorage.setItem('ms_maintenance', JSON.stringify(cfg));
window._maintCfg = cfg;
const dot = document.getElementById('maintActiveDot');
if(dot) dot.style.display = on ? 'block' : 'none';
if(btn) { btn.innerHTML = '💾 Maintenance Settings Save करें'; btn.disabled = false; }
checkMaintenanceStatus();
myAlert(on ? '🔧 Maintenance Mode ON! Supabase mein save ho gaya.' : '✅ Maintenance settings saved in Supabase (Mode OFF).');
// ── Realtime broadcast — sab online users ko turant notify karo ──
_rtSend({
  event: 'data-update',
  payload: {
    msg: on ? '🔧 Maintenance Mode ON — Portal band ho raha hai!' : '✅ Maintenance Mode OFF',
    type: 'maintenance',
    maintenance: { active: on, message: msg, forJD: document.getElementById('maintForJD').checked, forDEO: document.getElementById('maintForDEO').checked },
    user: _realtimeUser(),
    district: _realtimeDistrict()
  }
});
toggleDPI();
}
async function turnOffMaintenance() {
const existing = JSON.parse(localStorage.getItem('ms_maintenance') || '{}');
existing.active = false;
// ✅ FIX: Supabase mein bhi OFF karo
try {
  await fetch(_SB_URL + "/ms_maintenance?id=eq.1", {
    method: "PATCH",
    headers: { ..._SB_HDR, "Prefer": "return=minimal" },
    body: JSON.stringify({ is_active: false })
  });
} catch(e) { console.error('turnOffMaintenance Supabase error:', e); }
localStorage.setItem('ms_maintenance', JSON.stringify(existing));
window._maintCfg = existing;
document.getElementById('maintToggle').checked = false;
onMaintToggleChange();
const dot = document.getElementById('maintActiveDot');
if(dot) dot.style.display = 'none';
const ms = document.getElementById('maintenanceScreen');
if(ms) ms.style.display = 'none';
myAlert('✅ Maintenance Mode OFF — Supabase mein update ho gaya.');
toggleDPI();
}
let _maintCountdownTimer = null;
function checkMaintenanceStatus() {
const cu = window.currentUser || null;
if(cu === 'DPI') { const ms=document.getElementById('maintenanceScreen'); if(ms) ms.style.display='none'; return; }
const cfg = window._maintCfg || JSON.parse(localStorage.getItem('ms_maintenance') || 'null');
const ms = document.getElementById('maintenanceScreen');
if(!ms) return;
if(!cfg || !cfg.active) { ms.style.display = 'none'; return; }
const isJD  = cu && cu.startsWith('JD');
const isDEO = cu && cu.startsWith('DEO');
if((isJD && !cfg.forJD) || (isDEO && !cfg.forDEO)) { ms.style.display = 'none'; return; }
ms.style.display = 'flex';
document.getElementById('maintMsg').textContent = cfg.message || 'Portal पर maintenance कार्य चल रहा है।';
const tpBox = document.getElementById('maintTimePeriodBox');
const tpEl  = document.getElementById('maintTimePeriod');
const cdBox = document.getElementById('maintCountdownBox');
const cdEl  = document.getElementById('maintCountdown');
let tpParts = [];
if(cfg.startTime) tpParts.push('शुरू: ' + _fmtDT(cfg.startTime));
if(cfg.endTime)   tpParts.push('समाप्ति: ' + _fmtDT(cfg.endTime));
if(cfg.durationText) tpParts.push('अवधि: ' + cfg.durationText);
if(tpBox) tpBox.style.display = tpParts.length > 0 ? 'block' : 'none';
if(tpEl)  tpEl.innerHTML = tpParts.join('<br>');
if(_maintCountdownTimer) clearInterval(_maintCountdownTimer);
if(cfg.endTime && cdBox && cdEl) {
cdBox.style.display = 'block';
function _updateCD() {
const diff = new Date(cfg.endTime).getTime() - Date.now();
if(diff <= 0) { cdEl.textContent = 'जल्द ही उपलब्ध...'; clearInterval(_maintCountdownTimer); return; }
const h=Math.floor(diff/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
cdEl.textContent = (h ? _p2(h)+' घण्टे ' : '') + _p2(m)+' मिनट '+_p2(s)+' सेकंड';
}
_updateCD();
_maintCountdownTimer = setInterval(_updateCD, 1000);
} else if(cdBox) cdBox.style.display = 'none';
}
function _fmtDT(dtStr) {
if(!dtStr) return '';
try { const d = new Date(dtStr); return d.toLocaleDateString('hi-IN') + ' ' + d.toLocaleTimeString('hi-IN',{hour:'2-digit',minute:'2-digit',hour12:true}); } catch(e){ return dtStr; }
}
function _p2(n) { return String(n).padStart(2,'0'); }
async function loadMaintPanelState() {
// ✅ FIX: Supabase se fresh data load karo
try {
  const r = await fetch(_SB_URL + "/ms_maintenance?id=eq.1&select=*", { headers: _SB_HDR });
  const rows = await r.json();
  if(Array.isArray(rows) && rows[0]) {
    const row = rows[0];
    const cfg = {
      active:      row.is_active,
      message:     row.message,
      startTime:   row.start_time,
      endTime:     row.end_time,
      forJD:       row.jd_filter,
      forDEO:      row.deo_filter,
      durationText: ''
    };
    window._maintCfg = cfg;
    localStorage.setItem('ms_maintenance', JSON.stringify(cfg));
  }
} catch(e) { console.warn('loadMaintPanelState Supabase error:', e); }
const cfg = window._maintCfg || JSON.parse(localStorage.getItem('ms_maintenance') || 'null');
if(!cfg) return;
document.getElementById('maintToggle').checked = !!cfg.active;
onMaintToggleChange();
document.getElementById('maintMsgInput').value      = cfg.message || '';
document.getElementById('maintStartTime').value     = cfg.startTime || '';
document.getElementById('maintEndTime').value       = cfg.endTime || '';
document.getElementById('maintDurationText').value  = cfg.durationText || '';
if(cfg.forJD  !== undefined) document.getElementById('maintForJD').checked  = cfg.forJD;
if(cfg.forDEO !== undefined) document.getElementById('maintForDEO').checked = cfg.forDEO;
}
const MS_CUSTOM_PASS_KEY = 'msErp_customPasswords';
function _getEffectivePass(userId) {
const custom = JSON.parse(localStorage.getItem(MS_CUSTOM_PASS_KEY) || '{}');
return custom[userId] || districtCredentials[userId] || null;
}
function renderPwTable(q) {
q = (q || '').trim().toUpperCase();
const custom = JSON.parse(localStorage.getItem(MS_CUSTOM_PASS_KEY) || '{}');
const allUsers = Object.keys(districtCredentials);
const customUsers = Object.keys(custom).filter(u => !districtCredentials[u]);
const allKeys = [...allUsers, ...customUsers];
const filtered = q ? allKeys.filter(k => k.toUpperCase().includes(q)) : allKeys;
const container = document.getElementById('pwTableContainer');
if(!container) return;
if(!filtered.length) { container.innerHTML = '<div style="text-align:center;color:#999;padding:20px;">No results</div>'; return; }
container.innerHTML = filtered.map(userId => {
const pass = custom[userId] || districtCredentials[userId] || '(default)';
const isJD = userId.startsWith('JD');
const isDPI = userId === 'DPI';
// Sirf custom/new users delete ho sakte hain — default hardcoded users nahi
// Jo users pehle file mein hardcoded nahi the — wo delete ho sakte hain
const _hardcoded = {"DPI":1,"JDBHOPAL":1,"JDGWALIOR":1,"JDINDORE":1,"JDJABALPUR":1,"JDREWA":1,"JDSAGAR":1,"JDUJJAIN":1,"JDSHAHDOL":1,"JDNARMADAPURAM":1,"DEOAGARMALWA":1,"DEOALIRAJPUR":1,"DEOANUPPUR":1,"DEOASHOKNAGAR":1,"DEOBALAGHAT":1,"DEOBARWANI":1,"DEOBETUL":1,"DEOBHIND":1,"DEOBHOPAL":1,"DEOBURHANPUR":1,"DEOCHHATARPUR":1,"DEOCHHINDWARA":1,"DEODAMOH":1,"DEODATIA":1,"DEODEWAS":1,"DEODHAR":1,"DEODINDORI":1,"DEOGUNA":1,"DEOGWALIOR":1,"DEOHARDA":1,"DEOINDORE":1,"DEOJABALPUR":1,"DEOJHABUA":1,"DEOKATNI":1,"DEOKHANDWA":1,"DEOKHARGONE":1,"DEOMANDLA":1,"DEOMANDSAUR":1,"DEOMORENA":1,"DEONARMADAPURAM":1,"DEONARSINGHPUR":1,"DEONEEMUCH":1,"DEONIWARI":1,"DEOPANNA":1,"DEORAISEN":1,"DEORAJGARH":1,"DEORATLAM":1,"DEOREWA":1,"DEOSAGAR":1,"DEOSATNA":1,"DEOSEHORE":1,"DEOSEONI":1,"DEOSHAHDOL":1,"DEOSHAJAPUR":1,"DEOSHEOPUR":1,"DEOSHIVPURI":1,"DEOSIDHI":1,"DEOSINGRAULI":1,"DEOTIKAMGARH":1,"DEOUJJAIN":1,"DEOUMARIA":1,"DEOVIDISHA":1,"DEOPANDHURNA":1,"DEOMAIHAR":1,"DEOMAUGANJ":1};
const isCustom = !_hardcoded[userId];
const col = isDPI ? '#c62828' : isJD ? '#1565c0' : '#2e7d32';
return `<div style="display:grid;grid-template-columns:1fr 120px ${isCustom?'72px 68px':'72px'};align-items:center;gap:6px;padding:7px 0;border-bottom:1px solid #eee;">
<div>
<span style="font-size:11px;font-weight:700;color:${col};">${userId}</span>
<span style="font-size:9px;background:#f0f0f0;color:#666;padding:1px 6px;border-radius:3px;margin-left:6px;">${isDPI?'DPI':isJD?'JD':'DEO'}</span>
</div>
<div style="font-family:monospace;font-size:12px;color:#2e7d32;font-weight:600;">${pass}</div>
<button onclick="openAdminPwChange('${userId}')" style="padding:5px 9px;background:#002e5b;color:white;border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:700;">✏️ Edit</button>
${isCustom ? `<button onclick="deleteUser('${userId}')" style="padding:5px 9px;background:#c62828;color:white;border:none;border-radius:4px;cursor:pointer;font-size:10px;font-weight:700;">🗑️ Del</button>` : ''}
</div>`;
}).join('');
}
function filterPwTable(val) { renderPwTable(val); }
async function deleteUser(userId) {
  if(window.currentUser !== 'DPI') { myAlert('⛔ Only DPI can delete users.'); return; }
  if(!confirm(`⚠️ "${userId}" ko delete karna chahte ho?\nYe action undo nahi hoga!`)) return;
  // Supabase se delete karo
  try {
    await fetch(`${WORKER_URL}/users?userid=eq.${encodeURIComponent(userId)}`, { method: 'DELETE', headers: _SB_HDR });
  } catch(e) { console.warn('Supabase delete failed:', e); }
  // Local se bhi hatao
  const custom = JSON.parse(localStorage.getItem(MS_CUSTOM_PASS_KEY) || '{}');
  delete custom[userId];
  delete districtCredentials[userId];
  localStorage.setItem(MS_CUSTOM_PASS_KEY, JSON.stringify(custom));
  auditLog('USER_DELETED', 'User deleted: ' + userId + ' by DPI');
  renderPwTable(document.getElementById('pwSearchBox')?.value || '');
  myAlert('✅ User "' + userId + '" deleted successfully!');
}
function openAdminPwChange(userId) {
const target = document.getElementById('adminPwChangeTarget');
if(target) target.innerHTML = `User: <span style="color:#1565c0;font-family:monospace;">${userId}</span>`;
document.getElementById('adminNewPass').value = '';
document.getElementById('adminConfirmPass').value = '';
document.getElementById('adminPwMsg').innerHTML = '';
document.getElementById('adminNewPass').dataset.userId = userId;
document.getElementById('adminPwChangeModal').style.display = 'flex';
setTimeout(() => document.getElementById('adminNewPass').focus(), 100);
}
function saveAdminPwChange() {
const np = document.getElementById('adminNewPass');
const cp = document.getElementById('adminConfirmPass');
const msg = document.getElementById('adminPwMsg');
const userId = np.dataset.userId;
const newPass = np.value.trim();
const confirmPass = cp.value.trim();
if(!newPass || newPass.length < 4) { msg.innerHTML = '<span style="color:red;">❌ Password must be at least 4 characters.</span>'; return; }
if(newPass !== confirmPass) { msg.innerHTML = '<span style="color:red;">❌ Both passwords do not match.</span>'; return; }
const custom = JSON.parse(localStorage.getItem(MS_CUSTOM_PASS_KEY) || '{}');
const oldPass = custom[userId] || districtCredentials[userId] || '(default)';
custom[userId] = newPass;
localStorage.setItem(MS_CUSTOM_PASS_KEY, JSON.stringify(custom));
districtCredentials[userId] = newPass;
if (typeof _savePasswordToCloud === 'function') _savePasswordToCloud(userId, newPass); // ✅ Cloud sync
auditLog('ADMIN_PW_CHANGE', 'DPI changed password for: ' + userId);
_sbLogPwReset(userId, oldPass, newPass, window.currentUser||'DPI');
msg.innerHTML = '<span style="color:#2e7d32;font-weight:bold;">✅ Password successfully changed!</span>';
setTimeout(() => {
document.getElementById('adminPwChangeModal').style.display = 'none';
renderPwTable(document.getElementById('pwSearchBox').value);
}, 1400);
}
async function createNewUser() {
if(window.currentUser !== 'DPI') { myAlert('⛔ Only DPI can do this.'); return; }
const uidRaw = (document.getElementById('newUserId').value||'').trim().toUpperCase();
const pass   = (document.getElementById('newUserPass').value||'').trim();
const msg    = document.getElementById('newUserMsg');
if(!uidRaw) { msg.innerHTML='<span style="color:red;">❌ User ID cannot be empty.</span>'; return; }
if(uidRaw.length < 3) { msg.innerHTML='<span style="color:red;">❌ User ID must be at least 3 characters.</span>'; return; }
if(!pass || pass.length < 4) { msg.innerHTML='<span style="color:red;">❌ Password must be at least 4 characters.</span>'; return; }
const custom = JSON.parse(localStorage.getItem(MS_CUSTOM_PASS_KEY) || '{}');
if(districtCredentials[uidRaw] || custom[uidRaw]) {
msg.innerHTML='<span style="color:#b45309;">⚠️ This User ID already exists in the system.</span>'; return;
}
msg.innerHTML='<span style="color:#1565c0;font-weight:bold;">⏳ Saving to cloud...</span>';
// Sirf users table mein save karo (new user) — user_passwords mein nahi
try {
  const _cuRes = await fetch(`${WORKER_URL}/users`, {
    method: 'POST',
    headers: { ..._SB_HDR, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ userid: uidRaw, password: pass, level: (document.getElementById('newUserLevel')?.value||'DEO'), location: (document.getElementById('newUserLocation')?.value||'').trim().toUpperCase() })
  });
  if(!_cuRes.ok) throw new Error(await _cuRes.text());
  // Local mein bhi save karo
  custom[uidRaw] = pass;
  districtCredentials[uidRaw] = pass;
  localStorage.setItem(MS_CUSTOM_PASS_KEY, JSON.stringify(custom));
  auditLog('USER_CREATED', 'New user created: ' + uidRaw + ' by DPI');
  document.getElementById('newUserId').value = '';
  document.getElementById('newUserPass').value = '';
  msg.innerHTML = `<span style="color:#2e7d32;font-weight:bold;">✅ User "${uidRaw}" created! Har device pe kaam karega!</span>`;
  renderPwTable();
} catch(e) {
  msg.innerHTML=`<span style="color:red;">❌ Cloud save failed: ${e.message}</span>`;
}
}
function openImportExcelModal() {
const modal = document.getElementById('importExcelModal');
modal.style.display = 'flex';
document.getElementById('importExcelPassInput').value = '';
document.getElementById('importExcelPassErr').textContent = '';
setTimeout(() => document.getElementById('importExcelPassInput').focus(), 100);
}
function verifyImportExcelPass() {
const pwd = document.getElementById('importExcelPassInput').value;
if(pwd !== (window._importPwd || '1782')) { // ✅ Runtime check
document.getElementById('importExcelPassErr').textContent = '❌ Galat password!';
document.getElementById('importExcelPassInput').value = '';
document.getElementById('importExcelPassInput').focus();
return;
}
document.getElementById('importExcelModal').style.display = 'none';
document.getElementById('excelFile').click();
}
function handleTitleClick() {
if (window.currentUser !== 'DPI') {
const toast = document.createElement('div');
toast.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:100000;background:#1e293b;color:white;padding:11px 18px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.35);border-left:5px solid #f44336;font-size:13px;font-family:"Inter",sans-serif;max-width:320px;';
toast.innerHTML = '🔒 Title can only be edited by <b>DPI</b>.';
document.body.appendChild(toast);
setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity 0.4s'; setTimeout(()=>toast.remove(),400); }, 3000);
return;
}
const span = document.getElementById('sheetTitleText');
const hint = document.getElementById('editTitleHint');
if (!span) return;
const current = span.textContent.trim();
const input = document.createElement('input');
input.type = 'text';
input.value = current;
input.style.cssText = 'width:90%;font-size:15px;font-weight:700;color:#002e5b;border:2px solid #2c7be5;border-radius:4px;padding:4px 10px;outline:none;font-family:inherit;text-align:center;';
span.replaceWith(input);
if(hint) hint.style.display = 'none';
input.focus();
input.select();
function saveTitle() {
const newTitle = input.value.trim() || current;
const newSpan = document.createElement('span');
newSpan.id = 'sheetTitleText';
newSpan.onclick = handleTitleClick;
newSpan.textContent = newTitle;
input.replaceWith(newSpan);
if(hint) hint.style.display = 'inline';
localStorage.setItem('ms_sheet_title', newTitle);
_sbSetSetting('ms_sheet_title', newTitle);
_broadcastTitleUpdate(newTitle);
}
input.addEventListener('blur', saveTitle);
input.addEventListener('keydown', function(e) {
if(e.key === 'Enter') { e.preventDefault(); saveTitle(); }
if(e.key === 'Escape') { input.value = current; saveTitle(); }
});
}
function _broadcastTitleUpdate(newTitle) {
try {
_rtSend({ event: 'title-update', payload: { title: newTitle, user: _realtimeUser() } });
} catch(e) { console.warn('Title broadcast failed:', e); }
}
function _applyRemoteTitleUpdate(newTitle) {
if (!newTitle) return;
localStorage.setItem('ms_sheet_title', newTitle);
_sbSetSetting('ms_sheet_title', newTitle);
const span = document.getElementById('sheetTitleText');
if (span && span.tagName !== 'INPUT') {
span.textContent = newTitle;
span.style.transition = 'background 0.3s';
span.style.background = '#fff9c4';
setTimeout(() => { span.style.background = ''; }, 1500);
}
const toast = document.createElement('div');
toast.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:100000;background:#1e293b;color:white;padding:11px 18px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.35);border-left:5px solid #4caf50;font-size:13px;font-family:"Inter",sans-serif;max-width:320px;';
toast.innerHTML = '📝 DPI ne title update kiya — reload ki zaroorat nahi!';
document.body.appendChild(toast);
setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity 0.4s'; setTimeout(()=>toast.remove(),400); }, 4000);
}
function _updateTitleHintVisibility() {
const hint = document.getElementById('editTitleHint');
if (!hint) return;
hint.style.display = (window.currentUser === 'DPI') ? 'inline' : 'none';
}
(async function restoreSavedTitle() {
// Pehle localStorage se (fast), phir Supabase se update
const cached = localStorage.getItem('ms_sheet_title');
if(cached) {
const span = document.getElementById('sheetTitleText');
if(span) span.textContent = cached;
}
const cloud = await _sbGetSetting('ms_sheet_title');
if(cloud) {
localStorage.setItem('ms_sheet_title', cloud);
const span = document.getElementById('sheetTitleText');
if(span && span.tagName !== 'INPUT') span.textContent = cloud;
}
})();
function toggleOtherToolbar(e) {
e.stopPropagation();
const menu = document.getElementById('otherToolbarMenu');
menu.style.display = (menu.style.display === 'none' || !menu.style.display) ? 'block' : 'none';
}
function closeOtherToolbar() {
const menu = document.getElementById('otherToolbarMenu');
if(menu) menu.style.display = 'none';
}
document.addEventListener('click', function(e) {
const wrap = document.getElementById('otherToolbarWrap');
if(wrap && !wrap.contains(e.target)) closeOtherToolbar();
});
(function clockTick(){
const el = document.getElementById('clockDisplay');
if(el) el.textContent = new Date().toLocaleTimeString('hi-IN');
setTimeout(clockTick, 1000);
})();
(function updateDeadlineBadge() {
const badge = document.getElementById('deadlineBadge');
if (!badge) return;
const endStr = window._msEnd || localStorage.getItem('config_end_date');
if (!endStr) { badge.style.display = 'none'; return; }
const now = new Date();
const today = now.toISOString().split('T')[0];
const end = new Date(endStr + 'T23:59:59');
const diffMs = end - now;
const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
const [y, m, d] = endStr.split('-');
const displayDate = `${d}-${m}-${y}`;
let color, bg, text, icon;
if (today > endStr) {
icon = '🔴'; color = '#fff'; bg = '#b71c1c';
text = `⏰ कार्य अवधि समाप्त हो गई! (${displayDate})`;
} else if (diffDays <= 3) {
icon = '🔴'; color = '#fff'; bg = '#c62828';
text = `⚠️ अंतिम तिथि: ${displayDate} (${diffDays} दिन बचे)`;
} else if (diffDays <= 7) {
icon = '🟠'; color = '#fff'; bg = '#e65100';
text = `⏳ अंतिम तिथि: ${displayDate} (${diffDays} दिन बचे)`;
} else {
icon = '🟢'; color = '#fff'; bg = '#2e7d32';
text = `📅 कार्य करने की अंतिम तिथि: ${displayDate}`;
}
badge.textContent = text;
badge.style.cssText = `
display:inline-block;
background:${bg};
color:${color};
font-size:11px;
font-weight:700;
padding:3px 10px;
border-radius:4px;
margin:0 8px;
letter-spacing:0.3px;
animation: ${diffDays <= 7 ? 'deadlineBlink 1s ease-in-out infinite' : 'none'};
-webkit-print-color-adjust:exact;
print-color-adjust:exact;
`;
setTimeout(updateDeadlineBadge, 60000);
})();
document.addEventListener('DOMContentLoaded', function() {
});
// ── Boot: Supabase se global dates load karo ──
(async function _bootLoadConfig() {
  const [s, e] = await Promise.all([
    _sbGetSetting('config_start_date'),
    _sbGetSetting('config_end_date')
  ]);
  if(s) { window._msStart = s; localStorage.setItem('config_start_date', s); }
  if(e) { window._msEnd   = e; localStorage.setItem('config_end_date',   e); }
  // overrides bhi load karo
  const ov = await _sbGetOverrides();
  window._cachedOverrides = ov;
  localStorage.setItem('ms_user_overrides', JSON.stringify(ov));
  // ab lock status check karo (dates aa gayi)
  if(typeof checkLockStatus === 'function') checkLockStatus();
})();
function toggleDPI() {
const p = document.getElementById('dpiControlPanel');
const isHidden = p.style.display === 'none' || !p.style.display;
p.style.display = isHidden ? 'flex' : 'none';
if (isHidden) {
document.getElementById('dpiStartDate').value = window._msStart || localStorage.getItem('config_start_date') || '';
document.getElementById('dpiEndDate').value   = window._msEnd   || localStorage.getItem('config_end_date')   || '';
// Supabase se fresh load karo
Promise.all([_sbGetSetting('config_start_date'), _sbGetSetting('config_end_date')]).then(([s,e]) => {
  if(s) { window._msStart = s; localStorage.setItem('config_start_date', s); document.getElementById('dpiStartDate').value = s; }
  if(e) { window._msEnd   = e; localStorage.setItem('config_end_date',   e); document.getElementById('dpiEndDate').value   = e; }
});
switchDpiTab(1);
renderDpiUserCheckboxes();
loadMaintPanelState();
const cfg2 = window._maintCfg || JSON.parse(localStorage.getItem('ms_maintenance') || 'null');
const dot2 = document.getElementById('maintActiveDot');
if (dot2) dot2.style.display = (cfg2 && cfg2.active) ? 'block' : 'none';
}
}
function switchDpiTab(n) {
[1,2,3].forEach(i => {
const btn  = document.getElementById('dpiTab'+i);
const pane = document.getElementById('dpiPane'+i);
if(btn)  { btn.classList.toggle('active', i===n); }
if(pane) { pane.classList.toggle('active', i===n); }
});
if(n===2) {
  _syncCloudPasswordsToLocal().then(() => renderPwTable());
}
}
async function renderDpiUserCheckboxes() {
// ✅ FIX: districtCredentials load hone ka wait karo
if (!window.districtCredentials || Object.keys(window.districtCredentials).length === 0) {
  await new Promise(res => setTimeout(res, 1000));
}
// Supabase se overrides fetch karo
const overrides = await _sbGetOverrides();
window._cachedOverrides = overrides;
localStorage.setItem('ms_user_overrides', JSON.stringify(overrides));
// Known JD/DEO keys — districtCredentials async load ka intezaar nahi
const _KNOWN_JD  = ['JDBHOPAL','JDGWALIOR','JDINDORE','JDJABALPUR','JDREWA','JDSAGAR','JDUJJAIN','JDSHAHDOL','JDNARMADAPURAM'];
const _KNOWN_DEO = ['DEOAGARMALWA','DEOALIRAJPUR','DEOANUPPUR','DEOASHOKNAGAR','DEOBALAGHAT','DEOBARWANI','DEOBETUL','DEOBHIND','DEOBHOPAL','DEOBURHANPUR','DEOCHHATARPUR','DEOCHHINDWARA','DEODAMOH','DEODATIA','DEODEWAS','DEODHAR','DEODINDORI','DEOGUNA','DEOGWALIOR','DEOHARDA','DEOINDORE','DEOJABALPUR','DEOJHABUA','DEOKATNI','DEOKHANDWA','DEOKHARGONE','DEOMANDLA','DEOMANDSAUR','DEOMORENA','DEONARMADAPURAM','DEONARSINGHPUR','DEONEEMUCH','DEONIWARI','DEOPANNA','DEORAISEN','DEORAJGARH','DEORATLAM','DEOREWA','DEOSAGAR','DEOSATNA','DEOSEHORE','DEOSEONI','DEOSHAHDOL','DEOSHAJAPUR','DEOSHEOPUR','DEOSHIVPURI','DEOSIDHI','DEOSINGRAULI','DEOTIKAMGARH','DEOUJJAIN','DEOUMARIA','DEOVIDISHA','DEOPANDHURNA','DEOMAIHAR','DEOMAUGANJ'];
// districtCredentials में extra custom users हों तो उन्हें भी जोड़ो
const dcKeys = Object.keys(districtCredentials);
const jdKeys  = [...new Set([..._KNOWN_JD,  ...dcKeys.filter(k => k.startsWith('JD'))])];
const deoKeys = [...new Set([..._KNOWN_DEO, ...dcKeys.filter(k => k.startsWith('DEO'))])];
function buildList(keys, containerId) {
const container = document.getElementById(containerId);
if(!container) return;
container.innerHTML = keys.map(k => {
const ov = overrides[k];
const ovLabel   = ov ? `<span style="font-size:9px;color:#888;margin-left:4px;">(${ov.start||'?'} to ${ov.end||'?'})</span>` : '';
const closedLabel = (ov && ov.closed) ? `<span style="font-size:9px;background:#fee2e2;color:#991b1b;padding:1px 5px;border-radius:3px;margin-left:4px;">CLOSED</span>` : '';
return `<label style="display:flex;align-items:center;gap:6px;padding:5px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:11px;">
<input type="checkbox" class="dpi-user-cb" data-user="${k}" style="width:14px;height:14px;cursor:pointer;">
<span style="font-weight:600;color:#002e5b;">${k}</span>${ovLabel}${closedLabel}
</label>`;
}).join('');
}
buildList(jdKeys,  'jdCheckboxList');
buildList(deoKeys, 'deoCheckboxList');
}
function toggleUserGroup(id) {
const el = document.getElementById(id);
if(el) el.style.display = el.style.display === 'none' ? '' : 'none';
}
function dpiSelectAllUsers(val) {
document.querySelectorAll('.dpi-user-cb').forEach(cb => { cb.checked = val; });
}
function dpiSelectByType(type) {
document.querySelectorAll('.dpi-user-cb').forEach(cb => {
if(cb.dataset.user && cb.dataset.user.startsWith(type)) cb.checked = true;
});
}
async function saveTimeLimit() {
const s = document.getElementById('dpiStartDate').value;
const e = document.getElementById('dpiEndDate').value;
if(!s || !e) { myAlert('⚠️ Please select both Global Start and End dates.'); return; }
// ── Show saving indicator ──
const btn = document.querySelector('[onclick="saveTimeLimit()"]');
const origText = btn ? btn.innerHTML : '';
if(btn) { btn.innerHTML = '⏳ Saving...'; btn.disabled = true; }
try {
  window._msStart = s; window._msEnd = e;
  // Supabase mein save karo
  await _sbSetSetting('config_start_date', s);
  await _sbSetSetting('config_end_date', e);
  // localStorage backup
  localStorage.setItem('config_start_date', s);
  localStorage.setItem('config_end_date', e);
  const ovStart = document.getElementById('overrideStartDate').value;
  const ovEnd   = document.getElementById('overrideEndDate').value;
  const checkedCBs = Array.from(document.querySelectorAll('.dpi-user-cb:checked'));
  if(checkedCBs.length > 0) {
    if(!ovStart || !ovEnd) { myAlert('⚠️ Please select Override Start and End date for per-user override.'); if(btn){btn.innerHTML=origText;btn.disabled=false;} return; }
    // Supabase mein har user ke liye override save karo
    for(const cb of checkedCBs) { await _sbSetOverride(cb.dataset.user, ovStart, ovEnd, false); }
    // localStorage backup
    const overrides = JSON.parse(localStorage.getItem('ms_user_overrides') || '{}');
    checkedCBs.forEach(cb => { overrides[cb.dataset.user] = { start: ovStart, end: ovEnd }; });
    localStorage.setItem('ms_user_overrides', JSON.stringify(overrides));
    myAlert(`✅ Settings Saved!\n\nGlobal: ${s} → ${e}\n\nOverride applied to ${checkedCBs.length} user(s):\n${ovStart} → ${ovEnd}`);
  } else {
    myAlert('✅ Global access dates saved!\nStart: ' + s + '\nEnd: ' + e);
  }
  checkLockStatus();
  // ── Realtime broadcast — sab users ko turant notify karo ──
  _rtSend({
    event: 'data-update',
    payload: {
      msg: '📅 Access dates updated by DPI',
      type: 'dates-update',
      globalStart: s,
      globalEnd: e,
      overrides: checkedCBs.length > 0 ? checkedCBs.map(cb => ({ user: cb.dataset.user, start: ovStart, end: ovEnd })) : [],
      user: _realtimeUser(),
      district: _realtimeDistrict()
    }
  });
  toggleDPI();
} catch(err) {
  myAlert('❌ Save FAILED!\n\nError: ' + err.message + '\n\nPossible reasons:\n• Internet connection issue\n• Supabase server down\n• RLS Policy blocking write\n\nConsole mein check karo.');
  console.error('saveTimeLimit ERROR:', err);
} finally {
  if(btn) { btn.innerHTML = origText; btn.disabled = false; }
}
}
async function clearUserOverrides() {
if(!confirm('Sabhi per-user overrides clear kar dein?')) return;
await _sbClearOverrides();
localStorage.removeItem('ms_user_overrides');
window._cachedOverrides = {};
renderDpiUserCheckboxes();
myAlert('All per-user overrides have been cleared.');
}
function checkLockStatus() {
const cu = window.currentUser;
if (cu === 'DPI') { document.getElementById('lockScreen').style.display = 'none'; checkMaintenanceStatus(); return; }
if (!cu) { document.getElementById('lockScreen').style.display = 'none'; return; }
checkMaintenanceStatus();
if (document.getElementById('maintenanceScreen') && document.getElementById('maintenanceScreen').style.display === 'flex') return;
// Supabase se overrides + dates (cache use karo)
const overrides = window._cachedOverrides || JSON.parse(localStorage.getItem('ms_user_overrides') || '{}');
let startStr = window._msStart || localStorage.getItem('config_start_date');
let endStr   = window._msEnd   || localStorage.getItem('config_end_date');
if (overrides[cu]) { startStr = overrides[cu].start; endStr = overrides[cu].end; }
if (startStr && endStr) {
const now = new Date();
const today = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
if (today < startStr || today > endStr) {
document.getElementById('lockScreen').style.display = 'flex';
document.getElementById('lockMsg').innerText = `Your access period on this portal was ${startStr} to ${endStr}.`;
const panel = document.getElementById('dpiControlPanel'); panel.style.zIndex = '1000001'; document.body.appendChild(panel);
const passModal = document.getElementById('dpiPassModal'); passModal.style.zIndex = '1000002'; document.body.appendChild(passModal);
} else { document.getElementById('lockScreen').style.display = 'none'; }
}
}
document.addEventListener('DOMContentLoaded', checkLockStatus);
window.fullData = [];
window.filteredData = [];
const ROW_HEIGHT = 35;
let uploadedFileURL = "";
async function uploadDocument(file) {
  try {
    // Document upload → Worker /upload endpoint (R2 ya base64 fallback)
    const _path = 'docs/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const _fd = new FormData(); _fd.append('file', file); _fd.append('path', _path);
    const _upRes = await fetch(`${WORKER_URL}/upload`, { method: 'POST', body: _fd });
    if (!_upRes.ok) throw new Error(await _upRes.text());
    const _upData = await _upRes.json();
    uploadedFileURL = _upData.url;
    console.log("✅ Cloudinary upload:", uploadedFileURL);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    myAlert("❌ Upload failed: " + err.message);
  }
}
function getStatusHtml(row) {
let remarks = row[26] || "";
let statusText = "Verified";
let statusColor = "#27ae60";
if (remarks.toLowerCase().includes("pending") || !row[2]) {
statusText = "Incomplete";
statusColor = "#e74c3c";
}
return `<span style="background: ${statusColor}; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 10px;">${statusText}</span>`;
}
let documentStore = {};
function syncDataFromTable() {
let uniqueValues = new Set();
window.fullData.forEach(row => {
let val = row['field' + (parseInt(colIdx) + 1)] || "";
val = val.trim();
if(val && val !== "-" && val !== "NIL") {
uniqueValues.add(val);
}
});
gradationData = Array.from(rows).map(row => {
return Array.from(row.cells).map(cell => cell.innerText);
});
}
function validateForm() {
const allFields = [];
let missing = false;
for(let i = 1; i <= 27; i++){
const el = document.getElementById('in'+i);
let val = el ? el.value.trim() : "";
if(i === 1 || i === 2) continue;
if(i === 19){
const mode = document.getElementById('in19mode').value;
if(mode === "NIL") continue;
if(val === "") missing = true;
}
else if(i === 24 || i === 25 || i === 26){
const f23 = document.getElementById('in23').value;
if(f23 === "YES" && val === "") missing = true;
}
else{
if(val === "") missing = true;
}
}
if(missing){
showCustomAlert("All fields are mandatory!");
return false;
}
return true;
}
function handleUPPLogic() {
const f23 = document.getElementById('in23').value;
const f24 = document.getElementById('in24');
const f25 = document.getElementById('in25');
const f26 = document.getElementById('in26');
if (f23 === "NO" || f23 === "") {
f24.value = "";
f25.value = "";
f26.selectedIndex = 0;
f24.readOnly = true;
f25.readOnly = true;
f26.disabled = true;
[f24, f25, f26].forEach(el => {
el.style.pointerEvents = "none";
el.style.backgroundColor = "#bdc3c7";
el.style.cursor = "not-allowed";
});
} else {
f24.readOnly = false;
f25.readOnly = false;
f26.disabled = false;
[f24, f25, f26].forEach(el => {
el.style.pointerEvents = "auto";
el.style.backgroundColor = "#fff";
el.style.cursor = "pointer";
});
}
}
function openUpdateLog(){
myAlert("Update Log feature not added yet.");
}
function calculateSeniority() {
const f14 = document.getElementById('in14').value;
const f16 = document.getElementById('in16').value;
const f17 = document.getElementById('in17').value;
const f19 = document.getElementById('in19').value;
const seniorityField = document.getElementById('in18');
const dates = [f14, f16, f17, f19]
.filter(d => d && d !== "NIL" && d !== "NO")
.map(d => new Date(d));
if(dates.length) {
const maxDate = new Date(Math.max(...dates));
seniorityField.value = maxDate.toISOString().split("T")[0];
}
}
// ✅ Passwords removed — Edge Function handles auth
const districtCredentials = {}; // Empty — server se aayega
async function checkLogin() {
const user = document.getElementById('userField').value.trim().toUpperCase();
const pass = document.getElementById('passField').value.trim();
const errorDiv = document.getElementById('loginError');

// Block check (local)
const blockKey = 'loginBlock_' + user;
const attemptsKey = 'loginAttempts_' + user;
const blockData = JSON.parse(localStorage.getItem(blockKey) || 'null');
if (blockData) {
const remaining = Math.ceil((blockData.until - Date.now()) / 1000);
if (remaining > 0) {
errorDiv.innerText = `🔒 Account blocked! Try again after ${remaining}s.`;
return;
} else {
localStorage.removeItem(blockKey);
localStorage.removeItem(attemptsKey);
}
}

errorDiv.innerText = '⏳ Verifying...';

// ✅ Edge Function se login — password browser mein nahi aata
try {
  const res = await apiLogin(user, pass);
  localStorage.removeItem(attemptsKey);
  localStorage.removeItem(blockKey);
  document.getElementById('loginOverlay').style.display = 'none';
  window.currentUser = res.userId;
  window.currentLevel = res.level;
  const _ub = document.getElementById('userBadge');
  if(_ub){ _ub.textContent='👤 '+res.userId; _ub.style.display='inline-block'; }
  securityResetTimer();
  auditLog('LOGIN', 'User logged in via Edge Function');
  if (typeof initRealtime === 'function') initRealtime();
  if (typeof checkLockStatus === 'function') checkLockStatus();
} catch(e) {
  let attempts = parseInt(localStorage.getItem(attemptsKey) || '0') + 1;
  localStorage.setItem(attemptsKey, attempts);
  if (attempts >= 3) {
    localStorage.setItem(blockKey, JSON.stringify({ until: Date.now() + 5 * 60 * 1000 }));
    localStorage.removeItem(attemptsKey);
    errorDiv.innerText = `🔒 3 wrong attempts! Account blocked for 5 minutes.`;
  } else {
    errorDiv.innerText = `❌ INVALID USER ID OR PASSWORD! (${attempts}/3 attempts)`;
  }
}
}
const colConfig = [
{ name: "S.No.", class: "col-xs" },
{ name: "G.N.", class: "col-xs" },
{ name: "Unique ID", class: "col-sm" },
{ name: "Name", class: "col-lg" },
{ name: "Category", class: "col-sm" },
{ name: "GENDER", class: "col-sm" },
{ name: "Date of Birth", class: "col-md" },
{ name: "Mode of Appointment", class: "col-md" },
{ name: "UG Subject as per appointment and Promotion", class: "col-lg" },
{ name: "Professional Qualification", class: "col-lg" },
{ name: "PG Qualification", class: "col-lg" },
{ name: "PG Subject", class: "col-lg" },
{ name: "Home District", class: "col-lg" },
{ name: "Date of First Appointment", class: "col-md" },
{ name: "First appointment Designation", class: "col-lg" },
{ name: "Date of Appointment in Adhyapak by promotion If any", class: "col-md" },
{ name: "Date of Appointment in present cadre", class: "col-md" },
{ name: "Date of seniority in present cadre", class: "col-md" },
{ name: "Inter division Transfer Date", class: "col-md" },
{ name: "Present Posting Place", class: "col-xl" },
{ name: "UDISE Code", class: "col-md" },
{ name: "Present Posting District", class: "col-lg" },
{ name: "उच्च पद पर ज्वाइन किया (YES OR NO)", class: "col-md" },
{ name: "उच्च पद प्रभार की शाला का नाम", class: "col-xl" },
{ name: "उच्च पद प्रभार की शाला का UDISE कोड", class: "col-md" },
{ name: "उच्च पद प्रभार का जिला", class: "col-lg" },
{ name: "Remark (Deputation or other issue etc)", class: "col-xl" },
{ name: "Status (New Entry/Updated)", class: "col-md" },
{ name: "Updated By / District / Date-Time", class: "col-lg" },
{ name: "View Document", class: "col-md" },
{ name: "Transfer Document", class: "col-md" }
];
const districts = [
"SELECT DISTRICT", "Agar Malwa", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal",
"Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna",
"Gwalior", "Harda", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla",
"Mandsaur", "Morena", "Narmadapuram", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen",
"Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur",
"Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
];
let listZoom = 11; let formZoom = 12; let selectedRowElement = null;
window.onload = () => {
setupTableFilters();
document.getElementById("clearFiltersBtn").addEventListener("click", function () {
document.querySelectorAll("#filterRow input").forEach(input => {
input.value = "";
});
if (window.fullData && window.fullData.length > 0) {
window.filteredData = [...window.fullData];
renderVirtual();
}
});
document.getElementById('in23').addEventListener('change', handleUPPLogic);
const head = document.getElementById('tableHead');
colConfig.forEach(c => {
const th = document.createElement('th');
th.className = c.class;
th.innerText = c.name;
head.appendChild(th);
});
document.querySelectorAll('.district-list').forEach(dl => {
districts.forEach(d => {
let opt = document.createElement('option');
opt.value = d === "SELECT DISTRICT" ? "" : d;
opt.innerText = d;
dl.appendChild(opt);
});
});
const today = new Date().toISOString().split('T')[0];

// All .date-field inputs — future lock + typing block + picker on click
document.querySelectorAll('.date-field').forEach(inp => {
  inp.setAttribute('max', today);
  inp.addEventListener('keydown', (e) => e.preventDefault());
  inp.addEventListener('click', function() { if(this.showPicker) this.showPicker(); });
});

// probOrderDate — show form ka field, .date-field class nahi hai isme
const probOrderDateEl = document.getElementById('probOrderDate');
if (probOrderDateEl) {
  probOrderDateEl.setAttribute('max', today);
  probOrderDateEl.addEventListener('keydown', (e) => e.preventDefault());
  probOrderDateEl.addEventListener('click', function() { if(this.showPicker) this.showPicker(); });
}
handleUPPLogic();
};
function setupTableFilters() {
const filterRow = document.getElementById('filterRow');
if (!filterRow) return;
for (let i = 0; i < 30; i++) {
const th = document.createElement('th');
const inp = document.createElement('input');
inp.type = "text";
inp.placeholder = "🔍";
inp.oninput = function() {
document.getElementById('tableBody').style.opacity = "0.5";
runAllFilters();
setTimeout(() => { document.getElementById('tableBody').style.opacity = "1"; }, 350);
};
th.appendChild(inp);
filterRow.appendChild(th);
}
}
let filterTimeout;
function runAllFilters() {
clearTimeout(filterTimeout);
filterTimeout = setTimeout(() => {
const filters = Array.from(document.getElementById('filterRow').getElementsByTagName('input'))
.map(i => i.value.toUpperCase());
const hasFilter = filters.some(f => f !== "");
if (!hasFilter) {
} else {
window.filteredData = window.fullData.filter(row => {
return filters.every((fVal, idx) => {
if (!fVal) return true;
let cellValue = String(row['field' + (idx + 1)] || "").toUpperCase();
return cellValue.includes(fVal);
});
});
}
renderVirtual();
}, 300);
}
function updateAutoSerialNumbers() {
const rows = document.querySelectorAll('#tableBody tr');
rows.forEach((row, index) => {
row.cells[0].innerText = index + 1;
});
}
function toggleMS(e, triggerEl, id) {
  if (e && e.stopPropagation) e.stopPropagation();

  // Close any open portal dropdown
  var existing = document.getElementById('ms-portal-dropdown');
  if (existing) {
    var srcId = existing.dataset.srcId;
    if (srcId) {
      var src = document.getElementById(srcId);
      if (src) src.appendChild(existing); // move back
      existing.style.display = 'none';
      existing.id = srcId;
      delete existing.dataset.srcId;
    }
    if (srcId === id) return; // toggle close
  }

  var el = document.getElementById(id);
  if (!el) return;

  var trigger = triggerEl || e.target.closest('.ms-container');
  if (!trigger) return;

  // Move el to body (portal) so no ancestor transform/overflow clips it
  el.dataset.srcId = id;
  el.id = 'ms-portal-dropdown';
  document.body.appendChild(el);

  // Calculate position using trigger's real viewport rect
  var rect = trigger.getBoundingClientRect();
  var dropMaxH = 260;
  var spaceBelow = window.innerHeight - rect.bottom - 8;
  var spaceAbove = rect.top - 8;

  el.style.position   = 'fixed';
  el.style.left       = rect.left + 'px';
  el.style.width      = Math.max(rect.width, 220) + 'px';
  el.style.zIndex     = '2147483647';
  el.style.maxHeight  = Math.min(dropMaxH, Math.max(spaceBelow, spaceAbove)) + 'px';
  el.style.overflowY  = 'auto';
  el.style.display    = 'block';
  el.style.background = 'white';
  el.style.border     = '1px solid #d4dce8';
  el.style.borderRadius = '0 0 8px 8px';
  el.style.boxShadow  = '0 12px 36px rgba(10,22,40,.25)';

  if (spaceBelow >= 120 || spaceBelow >= spaceAbove) {
    el.style.top    = (rect.bottom + 2) + 'px';
    el.style.bottom = 'auto';
    el.style.borderRadius = '0 0 8px 8px';
  } else {
    el.style.top    = 'auto';
    el.style.bottom = (window.innerHeight - rect.top + 2) + 'px';
    el.style.borderRadius = '8px 8px 0 0';
  }
}

function _closeMsPortal() {
  var el = document.getElementById('ms-portal-dropdown');
  if (!el) return;
  var srcId = el.dataset.srcId;
  if (srcId) {
    var origContainer = document.querySelector('[onclick*="\'' + srcId + '\'"]');
    if (origContainer) origContainer.appendChild(el);
    el.style.display = 'none';
    el.id = srcId;
    delete el.dataset.srcId;
  }
}
function restoreMSCheckboxes(num, val) {
  // Restore checkbox state from saved value (e.g. "B.Ed/D.Ed")
  var container = document.getElementById('ms' + num);
  var textEl    = document.getElementById('text' + num);
  var hiddenEl  = document.getElementById('in' + num);
  if (!container) return;

  // Uncheck all first
  container.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    cb.checked = false;
  });

  if (!val || val === 'SELECT' || val === '') {
    // Empty/unset — show SELECT, save as NIL so mandatory validation passes
    if (textEl) textEl.innerText = 'SELECT';
    if (hiddenEl) hiddenEl.value = 'NIL';
    return;
  }
  if (val.toUpperCase() === 'NIL') {
    // Explicitly NIL — tick the NIL checkbox and show NIL
    if (textEl) textEl.innerText = 'NIL';
    if (hiddenEl) hiddenEl.value = 'NIL';
    var nilCb = container.querySelector('input[type="checkbox"][value="NIL"]');
    if (nilCb) nilCb.checked = true;
    return;
  }

  // Values stored as "B.Ed/D.Ed" — split by /
  var vals = val.toUpperCase().split('/').map(function(v){ return v.trim(); });
  var matched = [];

  container.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    if (vals.includes(cb.value.toUpperCase())) {
      cb.checked = true;
      matched.push(cb.value);
    }
  });

  var display = matched.length > 0 ? matched.join('/') : val;
  if (textEl)   textEl.innerText  = display;
  if (hiddenEl) hiddenEl.value    = display;
}

function updateMS(num) {
// When portal is open, div is moved to body with id 'ms-portal-dropdown'
// and original id stored in dataset.srcId — check both locations
var container = document.getElementById('ms' + num);
if (!container) {
  var portal = document.getElementById('ms-portal-dropdown');
  if (portal && portal.dataset.srcId === 'ms' + num) container = portal;
}
const textDisplay = document.getElementById('text' + num);
const hiddenInput = document.getElementById('in' + num);
if (!container || !hiddenInput) return;
const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
let selectedValues = Array.from(checkboxes).map(cb => cb.value.toUpperCase());
if (selectedValues.length > 0) {
  // If NIL is selected, uncheck everything else and keep only NIL
  if (selectedValues.includes('NIL')) {
    container.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
      if (cb.value.toUpperCase() !== 'NIL') cb.checked = false;
    });
    hiddenInput.value = 'NIL';
    if (textDisplay) textDisplay.innerText = 'NIL';
  } else {
    const joinedValue = selectedValues.join('/');
    hiddenInput.value = joinedValue;
    if (textDisplay) textDisplay.innerText = joinedValue;
  }
} else {
  hiddenInput.value = 'NIL';
  if (textDisplay) textDisplay.innerText = 'SELECT';
}
}
function pasteExcel() {
const pw = prompt("Enter Password to Open Paste Zone:");
if (pw === "1782") {
document.getElementById('pasteZone').style.display = 'block';
document.getElementById('bulkInput').focus();
} else if (pw !== null) {
myAlert("❌ Invalid Password");
}
}
window.processBulkPaste = async function () {
const uploadDiv = document.getElementById("uploadStatus");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const textInput = document.getElementById("bulkInput");
const pasteBox = document.getElementById("pasteZone");
if (uploadDiv) uploadDiv.style.display = "block";
const textValue = textInput.value.trim();
if (!textValue) return alert("Paste data first!");
const rows = textValue
.replace(/\r/g, "")
.split(/\n(?=\d+\t)/);
const batchSize = 400;
let uploaded = 0;
let batch = [];
let map = new Map();
try {
for (let i = 0; i < rows.length; i++) {
if (i % 500 === 0) {
await new Promise(r => setTimeout(r, 0));
}
const cols = rows[i].split("\t").map(c => (c || "").trim());
const serial = (cols[0] || (i + 1)).toString().trim();
const originalId = (cols[2] || "").toUpperCase().trim();
const safeId = originalId || ("ROW_" + serial);
const rowKey = safeId + "_" + serial;
while (cols.length < 27) cols.push("");
const teacherData = {
uniqueId: safeId,
auditTrail: "",
status: "",
...Object.fromEntries(
cols.slice(0, 27).map((val, idx) => [
`field${idx + 1}`,
(val || "").trim().toUpperCase()
])
)
};
map.set(rowKey, {
unique_id: rowKey,
data: teacherData
});
if (map.size >= batchSize) {
batch = Array.from(map.values());
map.clear();
const _bRes1 = await fetch(`${WORKER_URL}/gradation_list`, {
  method: 'POST',
  headers: { ..._SB_HDR, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
  body: JSON.stringify(batch)
});
if (!_bRes1.ok) throw new Error(await _bRes1.text());
uploaded += batch.length;
updateProgress(uploaded, rows.length);
}
}
if (map.size > 0) {
batch = Array.from(map.values());
const _bRes2 = await fetch(`${WORKER_URL}/gradation_list`, {
  method: 'POST',
  headers: { ..._SB_HDR, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
  body: JSON.stringify(batch)
});
if (!_bRes2.ok) throw new Error(await _bRes2.text());
uploaded += batch.length;
updateProgress(uploaded, rows.length);
}
if (progressBar) {
progressBar.style.width = "100%";
progressBar.innerText = "100%";
progressBar.style.background = "green";
}
if (progressText) {
progressText.innerText = "✅ Upload Complete!";
}
await new Promise(r => setTimeout(r, 1200));
if (uploadDiv) uploadDiv.style.display = "none";
if (textInput) textInput.value = "";
if (pasteBox) pasteBox.style.display = "none";
alert(`🎉 Upload complete: ${uploaded} records`);
await loadData();
} catch (err) {
console.error("❌ Upload failed:", err);
alert("❌ Upload failed: " + err.message);
if (uploadDiv) uploadDiv.style.display = "none";
}
function updateProgress(done, total) {
const percent = Math.min((done / total) * 100, 100).toFixed(1);
if (progressBar) {
progressBar.style.width = percent + "%";
progressBar.innerText = percent + "%";
}
if (progressText) {
progressText.innerText = `Uploading... ${done} / ${total}`;
}
}
};
window.onclick = function(event) {
if (!event.target.closest('.ms-container') && !event.target.closest('#ms-portal-dropdown')) {
    _closeMsPortal();
  }
}
function autoDesignationLogic() {
const mode = document.getElementById('in8').value;
const apptDateStr = document.getElementById('in14').value;
const adhyapakEl = document.getElementById('in16');
const adhyapakDateStr = (adhyapakEl && adhyapakEl.value) ? adhyapakEl.value : "";
const desigField = document.getElementById('in15');
const adhyapakDateField = document.getElementById('in16');
const presentCadreField = document.getElementById('in17');
if (mode === "DIR") {
adhyapakDateField.type = "text";
adhyapakDateField.value = "NIL";
adhyapakDateField.setAttribute('readonly', 'true');
adhyapakDateField.style.backgroundColor = "var(--disabled-bg)";
if (apptDateStr) {
const apptDate = new Date(apptDateStr);
const threshold = new Date("2018-07-01");
desigField.value = (apptDate >= threshold) ? "MS" : "SHIKSHA KARMI-2/SSS-2";
} else { desigField.value = ""; }
presentCadreField.value = apptDateStr;
} else if (mode === "PRO") {
adhyapakDateField.type = "date";
if(adhyapakDateField.value === "NIL") adhyapakDateField.value = "";
adhyapakDateField.removeAttribute('readonly');
adhyapakDateField.style.backgroundColor = "#fff";
desigField.value = "SHIKSHA KARMI-3/SSS-3";
presentCadreField.value = adhyapakDateStr;
} else {
adhyapakDateField.type = "date";
adhyapakDateField.removeAttribute('readonly');
desigField.value = "";
presentCadreField.value = "";
}
calculateSeniority();
}
function handle18Mode(){
const mode = document.getElementById("in19mode").value;
const field = document.getElementById("in19");
if(mode === "NIL"){
field.value = "NIL";
field.type = "text";
field.readOnly = true;
field.style.background = "#bdc3c7";
field.style.width = "130px";
const box = document.getElementById("transferUploadWarningBox");
if(box) box.style.display = "none";
} else {
field.value = "";
field.type = "date";
field.readOnly = false;
field.style.background = "#fff";
field.style.width = "130px";
}
if (typeof calculateSeniority === "function") calculateSeniority();
}
function checkTransferUploadBox() {
const val = document.getElementById("in19").value;
const mode = document.getElementById("in19mode").value;
const box = document.getElementById("transferUploadWarningBox");
if (box) {
box.style.display = (val && val !== "NIL" && mode === "DATE") ? "block" : "none";
}
}
function updateTransferUploadStatus19(event) {
const file = event.target.files[0];
const nameDiv = document.getElementById("transferFileName19");
const uploadBox = document.getElementById("transferUploadBox19");
if (file) {
const MAX_TRANSFER_SIZE = 100 * 1024; // 100KB
if (file.size > MAX_TRANSFER_SIZE) {
myAlert("❌ Transfer Document size cannot exceed 100KB.\nYour file: " + (file.size / 1024).toFixed(1) + "KB\nPlease compress the file and upload again.");
event.target.value = "";
nameDiv.style.display = "none";
uploadBox.style.borderColor = "";
uploadBox.style.color = "";
uploadBox.textContent = "📤 Transfer Document Upload करें (PDF/JPG)";
return;
}
const reader = new FileReader();
reader.onload = function(e) {
window.transferFileURL19 = e.target.result;
};
reader.readAsDataURL(file);
nameDiv.textContent = "✅ " + file.name;
nameDiv.style.display = "block";
uploadBox.style.borderColor = "#2e7d32";
uploadBox.style.color = "#2e7d32";
uploadBox.textContent = "✅ दस्तावेज़ चुना गया — बदलने के लिए क्लिक करें";
}
}
function validateFieldGap() {
const dob = document.getElementById('in7');
const appt = document.getElementById('in14');
const adhyapak = document.getElementById('in16');

// Clear all date-related invalid states first
[dob, appt, adhyapak].forEach(el => {
  el.classList.remove('invalid-field');
  el.title = '';
});

let errors = [];

// Validation 1: in7 (DOB) → in14 (First Appointment) must be 18+ years gap
if (dob.value && appt.value) {
  let d1 = new Date(dob.value); let d2 = new Date(appt.value);
  let diff = (d2 - d1) / (1000 * 60 * 60 * 24 * 365.25);
  if (diff < 18) {
    dob.classList.add('invalid-field');
    appt.classList.add('invalid-field');
    dob.title = '⚠️ Age gap must be 18+ years between DOB and First Appointment';
    appt.title = '⚠️ Age gap must be 18+ years between DOB and First Appointment';
    errors.push("Age Difference Error! (Field 7 & 14 must have 18+ years gap)");
  }
}

// Validation 2: in14 (First Appointment) → in16 (Adhyapak Promotion) must be 7+ years gap
if (appt.value && adhyapak.value) {
  let d1 = new Date(appt.value); let d2 = new Date(adhyapak.value);
  let gap = (d2 - d1) / (1000 * 60 * 60 * 24 * 365.25);
  if (gap < 7) {
    appt.classList.add('invalid-field');
    adhyapak.classList.add('invalid-field');
    appt.title = (appt.title ? appt.title + ' | ' : '') + '⚠️ Field 14 & 16 must have at least 7 years gap';
    adhyapak.title = '⚠️ Field 14 & 16 must have at least 7 years gap';
    errors.push("Field 14 & 16 Gap Error! (Must be 7+ years)");
  }
}

// Validation 3: in19 (Transfer Date) must always be after in14 (First Appointment Date)
const transfer = document.getElementById('in19');
const in19mode = document.getElementById('in19mode');
if (transfer) transfer.classList.remove('invalid-field');
if (appt.value && transfer && transfer.value && in19mode && in19mode.value !== 'NIL') {
  let d1 = new Date(appt.value); let d2 = new Date(transfer.value);
  if (d2 <= d1) {
    appt.classList.add('invalid-field');
    transfer.classList.add('invalid-field');
    appt.title = (appt.title ? appt.title + ' | ' : '') + '⚠️ Transfer Date (Field 19) must be after First Appointment Date (Field 14)';
    transfer.title = '⚠️ Transfer Date must be after First Appointment Date (Field 14)';
    errors.push("Field 14 & 19 Error! Transfer Date must be after First Appointment Date.");
  }
}

return errors;
}
function validateProbationDate() {
const appt = document.getElementById('in14');
const probDate = document.getElementById('probOrderDate');
if (!appt || !probDate) return;
// Reset
probDate.classList.remove('invalid-field');
probDate.style.border = '';
probDate.style.background = '';
probDate.style.color = '';
probDate.style.boxShadow = '';
probDate.title = '';
if (appt.value && probDate.value) {
  let d1 = new Date(appt.value);
  let d2 = new Date(probDate.value);
  let diffYears = (d2 - d1) / (1000 * 60 * 60 * 24 * 365.25);
  if (diffYears < 3) {
    probDate.classList.add('invalid-field');
    probDate.title = '⚠️ आदेश दिनांक, प्रथम नियुक्ति दिनांक से कम से कम 3 वर्ष बाद होनी चाहिए';
  }
}
}
function isDuplicateUniqueID(newID, currentRowElement) {
const rows = document.querySelectorAll('#tableBody tr');
let isDuplicate = false;
rows.forEach(row => {
if (row === currentRowElement) return;
const existingID = row.cells[2].innerText.trim().toUpperCase();
if (existingID === newID.toUpperCase() && existingID !== "") {
isDuplicate = true;
}
});
return isDuplicate;
}
async function saveEntry(isNew) {
if (document.getElementById("in23").value === "NO") {
document.getElementById("in24").value = "";
document.getElementById("in25").value = "";
document.getElementById("in26").value = "";
}
let errorMessages = [];
const userField = document.getElementById('userField').value.toUpperCase();
const district = userField.replace("DEO", "") || "UNKNOWN";
const timestamp = new Date().toLocaleString();
for (let i = 1; i <= 27; i++) {
const f = document.getElementById('in' + i);
if (f) f.classList.remove('invalid-field');
}
const field3 = document.getElementById('in3');
const uniqueIDValue = field3 ? field3.value.trim().toUpperCase() : "";
if (uniqueIDValue === "" || uniqueIDValue.length !== 6) {
field3.classList.add('invalid-field');
errorMessages.push("• Field 3 (Unique ID) must be exactly 6 characters.");
}
for (let i = 1; i <= 27; i++) {
const el = document.getElementById('in' + i);
if (!el || i === 1 || i === 2 || i === 3) continue;
if (i === 19 && document.getElementById('in19mode')?.value === "NIL") continue;
if ((i === 24 || i === 25 || i === 26) && document.getElementById('in23')?.value === "NO") continue;
if (el.value.trim() === "") {
el.classList.add('invalid-field');
errorMessages.push(`• Field ${i} is mandatory.`);
}
}
const dobField = document.getElementById('in7');
const apptField = document.getElementById('in14');
if (dobField.value && apptField.value) {
let ageDiff = (new Date(apptField.value) - new Date(dobField.value)) / (1000 * 60 * 60 * 24 * 365.25);
if (ageDiff < 18) {
dobField.classList.add('invalid-field');
apptField.classList.add('invalid-field');
errorMessages.push("• Age Gap must be 18+ years.");
}
}
const seniorityField = document.getElementById('in16');
if (apptField.value && seniorityField && seniorityField.value) {
let gap = (new Date(seniorityField.value) - new Date(apptField.value)) / (1000 * 60 * 60 * 24 * 365.25);
if (gap < 7) {
apptField.classList.add('invalid-field');
seniorityField.classList.add('invalid-field');
errorMessages.push("• Field 14 & 16 must have at least 7 years gap.");
}
}
const transferField = document.getElementById('in19');
const in19mode = document.getElementById('in19mode');
if (apptField.value && transferField && transferField.value && in19mode && in19mode.value !== 'NIL') {
if (new Date(transferField.value) <= new Date(apptField.value)) {
apptField.classList.add('invalid-field');
transferField.classList.add('invalid-field');
errorMessages.push("• Field 19 (Transfer Date) must be after Field 14 (First Appointment Date).");
}
}
const probDateField = document.getElementById('probOrderDate');
const probYes = document.getElementById('probYes');
if (probDateField) probDateField.classList.remove('invalid-field');
if (apptField.value && probDateField && probDateField.value && probYes && probYes.checked) {
let diffYears = (new Date(probDateField.value) - new Date(apptField.value)) / (1000 * 60 * 60 * 24 * 365.25);
if (diffYears < 3) {
probDateField.classList.add('invalid-field');
errorMessages.push("• आदेश दिनांक (Probation Order Date) must be at least 3 years after First Appointment Date (Field 14).");
}
}
if (errorMessages.length > 0) {
myAlert("⚠️ VALIDATION ERRORS:\n\n" + errorMessages.join("\n"));
return false;
}
// ── Transfer Document Mandatory Check ──
const _in19val  = document.getElementById('in19')?.value || '';
const _in19mode = document.getElementById('in19mode')?.value || '';
if (_in19val && _in19val !== 'NIL' && _in19mode === 'DATE') {
  // Transfer date bhari hai — document upload check karo
  const _hasTransferDoc = window.transferFileURL19 && window.transferFileURL19.length > 0;
  if (!_hasTransferDoc) {
    const _uploadBox = document.getElementById('transferUploadBox19');
    if (_uploadBox) {
      _uploadBox.style.borderColor = '#c62828';
      _uploadBox.style.color = '#c62828';
      _uploadBox.style.animation = 'none';
      setTimeout(() => { _uploadBox.style.animation = ''; }, 10);
    }
    myAlert('⚠️ Transfer Document अपलोड करना अनिवार्य है!\n\nTransfer Date भरी है — कृपया पहले Transfer Document (PDF/JPG) अपलोड करें, फिर Save करें।');
    document.getElementById('transferUploadBox19')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
}
if (isNew) {
document.getElementById('in1').value = generateSerialNumber();
}
let teacherData = {};
teacherData._oldData = {};
let existingIndex = window.fullData.findIndex(
r => (r.uniqueId || "").trim().toUpperCase() === uniqueIDValue
);
let existingRecord = existingIndex !== -1 ? window.fullData[existingIndex] : null;
// _oldData: snapshot se lo (most accurate), warna fullData se directly
if (window._formSnapshot && Object.keys(window._formSnapshot).length > 0) {
for (let i = 1; i <= 27; i++) {
teacherData._oldData['field' + i] = window._formSnapshot['field' + i] || "";
}
} else if (existingRecord) {
for (let i = 1; i <= 27; i++) {
teacherData._oldData['field' + i] = (existingRecord['field' + i] || "").toString().trim().toUpperCase();
}
}
for (let i = 1; i <= 27; i++) {
const field = document.getElementById('in' + i);
let fVal = field ? field.value.trim().toUpperCase() : "";
// field19 (Inter Division Transfer Date) — empty → save as NIL
if (i === 19 && !fVal) fVal = "NIL";
teacherData['field' + i] = fVal;
}
var probResult = extractProbationData(teacherData['field27'] || '');
teacherData['field27'] = probResult.cleanRemark.toUpperCase();
teacherData.field1 = document.getElementById('in1')?.value.trim() || "";
teacherData.document_url = uploadedFileURL || "";
teacherData.uniqueId = uniqueIDValue;
teacherData.status = isNew ? "NEW ENTRY" : "UPDATED";
teacherData.auditTrail = `${district} | ${timestamp}`;
teacherData.field28 = teacherData.status;
teacherData.field29 = teacherData.auditTrail;
teacherData.field30 = uploadedFileURL || "";
teacherData.field31 = window.transferFileURL19 || "";
if (!isNew && existingRecord) {
const uniqueId = uniqueIDValue;
let oldData = {};
for (let i = 1; i <= 27; i++) {
oldData['field' + i] = teacherData._oldData['field' + i] || "";
}
let newData = {};
for (let i = 1; i <= 27; i++) {
newData['field' + i] = document.getElementById('in' + i)?.value.trim().toUpperCase() || "";
}
teacherData.history_log = existingRecord?.history_log ? [...existingRecord.history_log] : [];
teacherData.history_log.push({
time: new Date().toLocaleString(),
before: JSON.stringify(oldData),
after: JSON.stringify(newData)
});
}
let changedFields = [];
if (existingRecord && !isNew) {
for (let i = 1; i <= 27; i++) {
const field = document.getElementById('in' + i);
if (!field) continue;
let newVal = field.value.trim().toUpperCase();
// Snapshot available hai toh use karo, warna _oldData fallback
let oldVal = (window._formSnapshot && window._formSnapshot['field' + i] !== undefined)
  ? window._formSnapshot['field' + i]
  : (teacherData._oldData['field' + i] || "");
if (newVal !== oldVal) {
changedFields.push('field' + i);
}
}
}
teacherData.changed_fields = [
...new Set([
...(existingRecord?.changed_fields || []),
...changedFields
])
];
if (!isNew && existingRecord && changedFields.length === 0) {
myAlert("ℹ️ No Changes Detected\n\nRecord " + uniqueIDValue + " was not updated because no fields were modified.");
umsToast("No changes detected — nothing updated", 'info');
return;
}
try {
const _saveRes = await fetch(`${WORKER_URL}/gradation_list`, {
  method: 'POST',
  headers: { ..._SB_HDR, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
  body: JSON.stringify({ unique_id: uniqueIDValue, data: teacherData })
});
if (!_saveRes.ok) { const _saveErr = await _saveRes.text(); throw new Error(_saveErr); }
let index = window.fullData.findIndex(r => r.uniqueId === uniqueIDValue);
if (index !== -1) {
window.fullData[index] = {
...window.fullData[index],
...teacherData,
uniqueId: uniqueIDValue
};
} else {
window.fullData.push({
uniqueId: uniqueIDValue,
...teacherData
});
}
window.filteredData = [...window.fullData];
let container = document.querySelector('.scroll-area');
let scrollTop = container.scrollTop;
renderVirtual();
container.scrollTop = scrollTop;
// Green flash on the saved row
setTimeout(() => {
const savedRow = document.querySelector(`#tableBody tr[data-id="${uniqueIDValue}"]`);
if (savedRow) {
savedRow.classList.remove('ums-save-flash');
savedRow.offsetHeight;
savedRow.classList.add('ums-save-flash');
setTimeout(() => savedRow.classList.remove('ums-save-flash'), 1700);
}
}, 80);
myAlert(`✅ Record ${uniqueIDValue} ${isNew ? "saved" : "updated"} successfully`);
umsToast(`Record ${uniqueIDValue} ${isNew ? "saved ✨" : "updated 🔄"} successfully`, 'success');
broadcastDataUpdate(
`${_realtimeDistrict()} ${isNew ? 'added new record' : 'updated record'}: ${uniqueIDValue}`,
isNew ? 'info' : 'update'
);
if (isNew) {
selectedRowElement = null;
}
uploadedFileURL = "";
if (typeof clearForm === "function") clearForm();
if (typeof closeModal === "function") closeModal();
} catch (error) {
console.error("Save Error:", error);
let exists = window.fullData.some(r => r.uniqueId === uniqueIDValue);
if (exists) {
myAlert(`✅ Record ${uniqueIDValue} saved successfully`);
} else {
myAlert("❌ Save Failed: " + (error.message || "Unknown error"));
}
selectedRowElement = null;
if (typeof clearForm === "function") clearForm();
}
}
function openRowInForm(uniqueId) {
  const searchVal = document.getElementById('searchVal');
  if (!searchVal) return;
  searchVal.value = uniqueId;
  toggleForm(true);
  performSearch();
}
async function performSearch() {
const sid = document.getElementById('searchVal').value.trim().toUpperCase();
if (!sid) {
myAlert("Please enter a Unique ID to search.");
return;
}
const tableBody = document.getElementById('tableBody');
const rows = tableBody.querySelectorAll('tr');
tableBody.style.display = 'none';
const record = window.fullData.find(r => 
  (r.uniqueId || "").trim().toUpperCase() === sid ||
  (r.field3 || "").trim().toUpperCase() === sid
);
if (record) {
const d = record;
const snoBox = document.getElementById('displaySNo');
if (snoBox) snoBox.innerText = d.field1 || "";
for (let j = 1; j <= 27; j++) {
const field = document.getElementById('in' + j);
if (!field) continue;
let val = d['field' + j] || "";
if (field.type === "date" || [7, 14, 16, 17, 18, 19].includes(j)) {
if (val && val.includes("-") && val.toUpperCase() !== "NIL") {
const p = val.split("-");
field.value = p[0].length === 2 ? `${p[2]}-${p[1]}-${p[0]}` : val;
} else { field.value = ""; }
if (j === 19) {
const mode19 = document.getElementById('in19mode');
if (mode19) mode19.value = (val && val !== "NIL") ? "DATE" : "NIL";
field.style.display = (val && val !== "NIL") ? "inline-block" : "none";
}
}
else if ([10, 11, 12].includes(j)) {
restoreMSCheckboxes(j, val);
}
else if (field.tagName === "SELECT") {
field.value = val;
if (field.selectedIndex === -1) {
Array.from(field.options).forEach(opt => {
if (opt.text.toUpperCase() === val.toUpperCase()) field.value = opt.value;
});
}
}
else { field.value = val; }
}
const retLabel = document.getElementById('retirementField');
const dobVal = d.field7 || "";
if (dobVal && dobVal !== "NIL") {
let dateObj;
if (dobVal.includes("-")) {
let parts = dobVal.split("-");
if (parts[0].length === 4) {
dateObj = new Date(dobVal);
} else {
dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
}
}
else if (dobVal.includes("/")) {
let parts = dobVal.split("/");
dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
}
if (dateObj && !isNaN(dateObj.getTime())) {
let retYear = dateObj.getFullYear() + 62;
let month = dateObj.getMonth() + 1;
let lastDate = new Date(retYear, month, 0).getDate();
let dStr = String(lastDate).padStart(2, '0');
let mStr = String(month).padStart(2, '0');
if (retLabel) {
retLabel.value = `${dStr}-${mStr}-${retYear}`;
retLabel.style.color = "black";
retLabel.style.fontWeight = "bold";
}
} else {
retLabel.value = "NIL";
retLabel.style.color = "red";
}
} else {
if (retLabel) {
retLabel.value = "NIL";
retLabel.style.color = "red";
}
}
if (typeof handleUPPLogic === "function") handleUPPLogic();
if (typeof autoDesignationLogic === "function") autoDesignationLogic();
// ── Snapshot: form load hone ke baad original values store karo comparison ke liye ──
window._formSnapshot = {};
for (let s = 1; s <= 27; s++) {
  const sf = document.getElementById('in' + s);
  if (!sf) continue;
  window._formSnapshot['field' + s] = sf.value.trim().toUpperCase();
}
const f23 = document.getElementById('in23');
if (f23) f23.dispatchEvent(new Event('change'));
const docURL30 = d.field30 || d.document_url || "";
const fileNameDisplay = document.getElementById('fileNameDisplay');
const premiumBox = fileNameDisplay ? fileNameDisplay.closest('.premium-box') : null;
if (docURL30 && docURL30 !== "") {
uploadedFileURL = docURL30;
window['_b64doc_doc30_loaded'] = docURL30;
if (fileNameDisplay) {
fileNameDisplay.innerHTML = `✅ Document Uploaded &nbsp;<button onclick="openBase64Doc('doc30_loaded')" style="background:#1565c0;color:white;border:none;padding:2px 7px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;">👁️ View</button>`;
fileNameDisplay.style.color = "#2e7d32";
}
if (premiumBox) {
premiumBox.style.borderColor = "#2e7d32";
premiumBox.style.background = "#f0fff4";
premiumBox.onclick = null;
}
} else {
uploadedFileURL = "";
if (fileNameDisplay) {
fileNameDisplay.innerText = "Feature Disabled";
fileNameDisplay.style.color = "#999";
}
if (premiumBox) {
premiumBox.style.borderColor = "#ccc";
premiumBox.style.background = "#f0f0f0";
premiumBox.style.opacity = "0.5";
premiumBox.style.cursor = "not-allowed";
premiumBox.onclick = null;
}
}
const transferURL31 = d.field31 || "";
const transferWarningBox = document.getElementById('transferUploadWarningBox');
const transferUploadBox = document.getElementById('transferUploadBox19');
const transferFileName19 = document.getElementById('transferFileName19');
const mode19Val = (document.getElementById('in19mode')?.value || "NIL");
if (mode19Val === "DATE" && document.getElementById('in19')?.value) {
if (transferWarningBox) transferWarningBox.style.display = 'block';
if (transferURL31 && transferURL31 !== "") {
window.transferFileURL19 = transferURL31;
if (transferUploadBox) {
transferUploadBox.innerHTML = `✅ Document Already Uploaded &nbsp; <button onclick="openBase64Doc('transfer31_loaded')" style='background:#1565c0;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;margin-left:6px;'>👁️ View</button>`;
window['_b64doc_transfer31_loaded'] = transferURL31;
transferUploadBox.style.borderColor = "#2e7d32";
transferUploadBox.style.color = "#2e7d32";
transferUploadBox.onclick = null;
}
if (transferFileName19) {
transferFileName19.textContent = "✅ Transfer document saved with this record";
transferFileName19.style.display = "block";
transferFileName19.style.color = "#2e7d32";
}
} else {
window.transferFileURL19 = "";
if (transferUploadBox) {
transferUploadBox.innerHTML = `📤 Transfer Document Upload करें (PDF/JPG)`;
transferUploadBox.style.borderColor = "#e65100";
transferUploadBox.style.color = "#e65100";
transferUploadBox.onclick = function() { document.getElementById('transferFileInput19').click(); };
}
if (transferFileName19) { transferFileName19.textContent = ""; transferFileName19.style.display = "none"; }
}
} else {
if (transferWarningBox) transferWarningBox.style.display = 'none';
window.transferFileURL19 = "";
}
selectedUniqueId = sid;
tableBody.style.display = '';
for (let row of rows) {
if (row.cells[2] && row.cells[2].innerText.trim().toUpperCase() === sid) {
selectedRowElement = row;
document.querySelectorAll('#tableBody tr').forEach(r => r.classList.remove('selected-row'));
row.classList.add('selected-row');
row.scrollIntoView({ behavior: 'smooth', block: 'center' });
break;
}
}
const addBtnFound = document.getElementById('newAddBtn');
if (addBtnFound) {
addBtnFound.style.opacity = "0.35";
addBtnFound.style.pointerEvents = "none";
addBtnFound.title = "Record loaded — use UPDATE or DELETE";
}
return;
}
tableBody.style.display = '';
const addBtnNotFound = document.getElementById('newAddBtn');
if (addBtnNotFound) {
addBtnNotFound.style.opacity = "1";
addBtnNotFound.style.pointerEvents = "auto";
addBtnNotFound.title = "";
}
}
async function deleteEntry() {
if (!selectedRowElement) return myAlert("Select a record first!");
let reason = prompt("To DELETE, enter a reason (or leave blank for 'DELETED'):");
if (reason === null) return;
const userField = document.getElementById('userField').value.toUpperCase();
const district = userField || "UNKNOWN";
const timestamp = new Date().toLocaleString();
let finalReason = reason.trim() === "" ? "DELETED" : reason.toUpperCase();
let uniqueID  = selectedRowElement.cells[2].innerText.trim().toUpperCase();
let datasetId = (selectedRowElement.dataset.id || "").trim();
try {
let dbUniqueId = null;
let updatedData = null;
const candidates = [...new Set([datasetId, uniqueID].filter(Boolean))];
for (let candidate of candidates) {
const _fetchRow = await fetch(`${WORKER_URL}/gradation_list?unique_id=eq.${encodeURIComponent(candidate)}`, { headers: _SB_HDR });
const _rowData = await _fetchRow.json();
const row = Array.isArray(_rowData) ? _rowData[0] : _rowData;
if (row && row.unique_id) {
dbUniqueId  = row.unique_id;
updatedData = row.data;
break;
}
}
if (!dbUniqueId) {
const _searchRes = await fetch(`${WORKER_URL}/gradation_list?data->>field3=eq.${encodeURIComponent(uniqueID)}`, { headers: _SB_HDR });
const _searchRows = await _searchRes.json();
if (Array.isArray(_searchRows) && _searchRows.length > 0) {
dbUniqueId  = _searchRows[0].unique_id;
updatedData = _searchRows[0].data;
}
}
if (!dbUniqueId || !updatedData) {
throw new Error(`Record not found in DB for ID: ${uniqueID}`);
}
updatedData.field27 = finalReason;
// ✅ FIX: NEW ENTRY ka status preserve karo delete pe bhi
const _wasNewEntry = (updatedData.field28 || '').toUpperCase().includes('NEW');
updatedData.field28 = _wasNewEntry ? "NEW ENTRY DELETED" : "DELETED";
updatedData.field29 = `${district} | ${timestamp}`;
const _updateRes = await fetch(`${WORKER_URL}/gradation_list?unique_id=eq.${encodeURIComponent(dbUniqueId)}`, {
  method: 'PATCH', headers: _SB_HDR,
  body: JSON.stringify({ data: updatedData })
});
if (!_updateRes.ok) throw new Error(await _updateRes.text());
const updateMemoryRow = (arr) => {
const index = arr.findIndex(r =>
r.uniqueId === dbUniqueId ||
r.uniqueId === datasetId  ||
(r.field3 || "").trim().toUpperCase() === uniqueID
);
if (index !== -1) {
arr[index].field27 = finalReason;
arr[index].field28 = (arr[index].field28||'').toUpperCase().includes('NEW') ? "NEW ENTRY DELETED" : "DELETED";
arr[index].field29 = `${district} | ${timestamp}`;
arr[index].uniqueId = dbUniqueId;
}
};
if (window.fullData)     updateMemoryRow(window.fullData);
if (window.filteredData) updateMemoryRow(window.filteredData);
if (selectedRowElement) {
selectedRowElement.classList.add('deleting-row');
await new Promise(r => setTimeout(r, 560));
}
renderVirtual();
setTimeout(() => {
let newRow = document.querySelector(`#tableBody tr[data-id="${dbUniqueId}"]`)
|| document.querySelector(`#tableBody tr[data-id="${datasetId}"]`);
if (newRow) {
newRow.classList.add('soft-deleted');
newRow.classList.remove('selected-row');
newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
}, 50);
selectedRowElement = null;
if (typeof clearForm === "function") clearForm();
broadcastDataUpdate(`${_realtimeDistrict()} deleted record: ${uniqueID}`, 'delete');
setTimeout(() => {
myAlert("✅ Record marked as Deleted in Database.");
umsToast("Record deleted successfully 🗑️", 'warning');
}, 100);
} catch (error) {
console.error("Delete Error:", error);
myAlert("❌ Delete failed: " + (error.message || "Unknown error"));
selectedRowElement = null;
if (typeof clearForm === "function") clearForm();
}
}
function selectRow(el) {
if (selectedRowElement && selectedRowElement !== el) {
if (typeof unlockRow === 'function') unlockRow(selectedRowElement.dataset.id);
}
if (typeof lockRow === 'function') lockRow(el.dataset.id);
document.querySelectorAll('#tableBody tr').forEach(r => r.classList.remove('selected-row'));
el.classList.add('selected-row');
selectedRowElement = el;
selectedUniqueId = el.dataset.id;
const snoBox = document.getElementById('displaySNo');
if (snoBox) snoBox.innerText = el.cells[0].innerText;
}
function changeFormZoom(v) {
formZoom += v; if(formZoom < 9) formZoom = 9;
document.getElementById('formCard').style.fontSize = formZoom + 'px';
document.getElementById('formZoomVal').innerText = formZoom + 'px';
}
function myAlert(msg) {
document.getElementById('alertMsg').innerText = msg;
document.getElementById('customAlert').style.display = 'flex';
}
function closeAlert() { document.getElementById('customAlert').style.display = 'none'; }
function toggleForm(show) {
document.getElementById('formOverlay').style.display = show ? 'block' : 'none';
if(show) {
const badge = document.getElementById('formStatusBadge');
if(badge) { badge.textContent='NEW ENTRY'; badge.style.background='#1b5e20'; }
// Stagger animate form row-items on open
const rows = document.querySelectorAll('#formCard .row-item');
rows.forEach((row, i) => {
row.style.animation = 'none';
row.offsetHeight; // reflow
row.style.animation = `ums-fadeInUp 0.28s ease ${i * 0.018}s both`;
});
}
}
function exportExcel() {
const wb = XLSX.utils.table_to_book(document.getElementById('dataTable'));
XLSX.writeFile(wb, "MS_Gradation.xlsx");
}
function exportPDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF('l', 'mm', 'a4');
document.fonts.ready.then(() => {
/* watermark removed – base64 was truncated in source */
const watermarkB64 = "data:image/jpeg;base64,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BPPPK2/IOC6/LuT6565RmEAPPPPi3rz+62slDXMLCpQ01HYoBHNI0WIPPPPKvEGrBGvPI0fB6IxPHrx8QhPPGEVwPPPq3m14i5yIukkwJxQwAc7FQHHK1AWPPPPBbC53PDUuPl/GgH//AD63BehDT3qhRTzzz85ffs+/sqKsIQFHQARyg5DTxUQOjzzzxqhj7zzm3xJ33vz6Lwi7ww0AA2cBQXzyrvr+/wC+rwRoBwUW1aQzkRhAUkXEDp0888ukInAwq88Pb8KYG1uvR4wdmYHAIY888+jOTqm+7ECuJyDDpOTmyjZsEUfUFh8888X88yTGe88NOArki1o0G82rDPVAAj388/LYfa2TijriCCYjAQgAcA0Q08rUVA8889t88cc8s4sPuDj82+hK9XUADVxAIJw88/z2rvrq/HTCC9RdHkgcIgAcc0qUTA88878c8c88884L/Vog+S/+xUiDBAnpkkX88/PCb/q2uCSuGowtpWyAQAAA8A2cVA88814wc88888vZ3zg8e6k1X2sNI074cAe38/8AdirP96v91ntdT/8A2iGDcoQADUknxTz1SBTzDTDzzh/37zzx6D7HfN9PMCymCBPy/wDgOfnFKOucuGym9gAATAKnCEBt3VA8t4sc8EUsc80jD08c8OM/FFM/LDEzFsB13/JzSyCh+8c8/wD+kgxzqgww3UEZfhs6PVnBP/qEPPO+3hn/ADyyxrVVRPBuf8pi5KB7zzzzzzzzzDDzzzzzzzzjDzzzzzzwTyChRTjhzzzzMR0vzzzLyJMYJRwTiDqthcQB7zzzzzzyAADzzzzzzzzzzjjDCBTzz9yhDlVV/wC88LS/f888OemQ3b1l4g8J1F6csW08888888AAU888888888AAEMM887k8ARm1+/kUqBeWMc8wy22MWSRb8IvcTxMsv8e0w08888888880884EM8888888/s8gEPIMGfO8npja8888ai04RhnSqaDbHEcBDbJC/M888AM888888ws888888888KkgYtKvLdE8yW8Q/80882SqemNDSU+COPVJukaRQZY8888c888888888888888xFoIQEj7oBx3/Y2/v8E888Syey2AAF8iSuuurBraOMsDc388888888888888884ZAABk79eq1AAQpE30AEAU8A2y+OysHKzrf8E2oDi8wKI4E8L+88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";
const heading = "Madhyamik Shikshak (MS) Samvarg Ki Anantim Variyata Suchi - Sthiti Dated 01/04/2026";
const headingHindi = "माध्यमिक शिक्षक (MS) संवर्ग की अनंतिम वरीयता सूची - 01/04/2026 की स्थिति में";
const canvas = document.createElement('canvas');
canvas.width = 2200; canvas.height = 80;
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#002e5b';
ctx.font = 'bold 44px "Noto Sans Devanagari", "Mangal", "Arial Unicode MS", Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(headingHindi, canvas.width / 2, canvas.height / 2);
const headingImgData = canvas.toDataURL('image/png');
doc.autoTable({
html: '#dataTable',
styles: { fontSize: 4 },
startY: 18,
didDrawPage: function(data) {
const pageW = doc.internal.pageSize.getWidth();
const imgW = pageW - 20;
const imgH = imgW * (80 / 2200);
doc.addImage(headingImgData, 'PNG', 10, 4, imgW, imgH);
const pageH = doc.internal.pageSize.getHeight();
const wmW = 120, wmH = 120;
const x = (pageW - wmW) / 2;
const y = (pageH - wmH) / 2;
if (watermarkB64) {
doc.saveGraphicsState();
doc.setGState(new doc.GState({opacity: 0.10}));
doc.addImage(watermarkB64, 'PNG', x, y, wmW, wmH);
doc.restoreGraphicsState();
}
}
});
doc.save("Report.pdf");
});
}
async function clearAllData() {
const pw = prompt("Enter Password to CLEAR ALL DATA:");
if (pw === null) return;
if (pw === "1782") {
if (confirm("⚠️ WARNING: This will permanently delete ALL records from system. Are you sure?")) {
try {
const _clearRes = await fetch(`${WORKER_URL}/gradation_list?unique_id=neq.`, {
  method: 'DELETE', headers: _SB_HDR
});
if (!_clearRes.ok) throw new Error(await _clearRes.text());
window.fullData = [];
window.filteredData = [];
document.getElementById('tableBody').innerHTML = "";
renderVirtual();
myAlert("✅ All Data Cleared Permanently");
} catch (error) {
console.error(error);
myAlert("❌ Error deleting data from cloud!");
}
}
} else {
myAlert("❌ Invalid Password!");
}
}
function importExcel(event) {
const pw = prompt("Enter Password to Import Excel:");
if (pw === null) {
event.target.value = "";
return;
}
if (pw === "1782") {
const file = event.target.files[0];
if (!file) return;
if (typeof XLSX === 'undefined') {
myAlert("Error: Excel library (SheetJS) not loaded. Please check your internet connection.");
return;
}
const reader = new FileReader();
reader.onload = function(e) {
try {
const data = new Uint8Array(e.target.result);
const workbook = XLSX.read(data, { type: 'array' });
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
if (json.length <= 1) {
myAlert("The selected file is empty!");
return;
}
json.shift();
const tableBody = document.getElementById('tableBody');
const fragment = document.createDocumentFragment();
json.forEach(rowData => {
const tr = document.createElement('tr');
tr.onclick = function() { selectRow(this); };
tr.ondblclick = function() {
  const uid = (this.cells[2] ? this.cells[2].innerText.trim().toUpperCase() : '');
  if (uid) openRowInForm(uid);
};
for (let i = 0; i < 27; i++) {
const td = document.createElement('td');
const cellValue = rowData[i] !== undefined ? rowData[i] : "";
const val = cellValue.toString().trim().toUpperCase();
td.innerText = val;
td.title = val;
tr.appendChild(td);
}
fragment.appendChild(tr);
});
tableBody.appendChild(fragment);
updateAutoSerialNumbers();
myAlert("✅ " + json.length + " Records Imported Successfully!");
} catch (err) {
console.error(err);
myAlert("❌ Error reading file. Ensure it is a valid Excel file (.xlsx).");
}
event.target.value = "";
};
reader.readAsArrayBuffer(file);
} else {
myAlert("❌ Invalid Password");
event.target.value = "";
}
}
syncDataArray();
function syncDataArray() {
if (typeof allMasterData !== 'undefined' && allMasterData.length > 0) {
gradationData = JSON.parse(JSON.stringify(allMasterData));
console.log("✅ Memory Sync Complete from Master Data: " + gradationData.length + " rows.");
} else {
console.warn("⚠️ Main data array not found! Fetching from DB...");
}
}
function importExcel() {
syncDataArray();
renderTableLimit(1000);
}
function clearForm() {
window._formSnapshot = {}; // snapshot reset — new entry ke liye
const badge = document.getElementById('formStatusBadge');
if(badge) { badge.textContent = 'NEW ENTRY'; badge.style.background = '#1b5e20'; }
resetProbationSection();
const field1 = document.getElementById('in1');
if (field1) field1.value = "";
for (let i = 2; i <= 27; i++) {
const field = document.getElementById('in' + i);
if (!field) continue;
field.classList.remove('invalid-field');
if (field.tagName === "SELECT") {
field.selectedIndex = 0;
} else {
field.value = "";
}
if (i === 2) {
field.value = "NEW ENTRY";
}
if (i === 27) {
field.value = "NO";
}
if ([10, 11, 12].includes(i)) {
const label = document.getElementById('text' + i);
if (label) label.innerText = "SELECT";
const checks = document.querySelectorAll('#ms' + i + ' input');
checks.forEach(c => c.checked = false);
}
if ([1, 2, 17, 18].includes(i)) {
field.style.backgroundColor = "#bdc3c7";
field.readOnly = true;
} else {
field.style.backgroundColor = "#ffffff";
field.readOnly = false;
}
}
const addBtn = document.getElementById('newAddBtn');
if (addBtn) {
addBtn.style.opacity = "1";
addBtn.style.pointerEvents = "auto";
addBtn.title = "";
}
const fileInput = document.getElementById('fileInput');
if (fileInput) fileInput.value = "";
const fileNameDisplay = document.getElementById('fileNameDisplay');
if (fileNameDisplay) {
fileNameDisplay.innerText = "Feature Disabled";
fileNameDisplay.style.color = "#999";
const pb = fileNameDisplay.closest('.premium-box');
if (pb) { pb.style.borderColor = "#ccc"; pb.style.background = "#f0f0f0"; pb.style.opacity = "0.5"; pb.style.cursor = "not-allowed"; pb.onclick = null; }
}
uploadedFileURL = "";
window.transferFileURL19 = "";
const tfi = document.getElementById('transferFileInput19');
if (tfi) tfi.value = "";
const tfn = document.getElementById('transferFileName19');
if (tfn) { tfn.textContent = ""; tfn.style.display = "none"; }
const tub = document.getElementById('transferUploadBox19');
if (tub) { tub.style.borderColor = "#e65100"; tub.style.color = "#e65100"; tub.textContent = "📤 Transfer Document Upload करें (PDF/JPG)"; }
const twb = document.getElementById('transferUploadWarningBox');
if (twb) twb.style.display = "none";
document.querySelectorAll('#tableBody tr').forEach(r => r.classList.remove('selected-row'));
if(document.getElementById('displaySNo')) document.getElementById('displaySNo').innerText = "---";
if (selectedRowElement && typeof unlockRow === 'function') unlockRow(selectedRowElement.dataset.id);
selectedRowElement = null;
}
function updateAutoSerialNumbers() {
const tableRows = document.querySelectorAll('#tableBody tr');
tableRows.forEach((row, index) => {
if (row.cells[0]) {
row.cells[0].innerText = index + 1;
}
});
}
function showSummary() {
const structure = [
{ name: 'JD BHOPAL', districts: ['BHOPAL', 'RAISEN', 'RAJGARH', 'SEHORE', 'VIDISHA'] },
{ name: 'JD GWALIOR', districts: ['ASHOKNAGAR', 'BHIND', 'DATIA', 'GUNA', 'GWALIOR', 'MORENA', 'SHEOPUR', 'SHIVPURI'] },
{ name: 'JD INDORE', districts: ['ALIRAJPUR', 'BADWANI', 'BURHANPUR', 'DHAR', 'INDORE', 'JHABUA', 'KHANDWA', 'KHARGONE'] },
{ name: 'JD JABALPUR', districts: ['BALAGHAT', 'CHHINDWARA', 'JABALPUR', 'KATNI', 'MANDLA', 'NARSINGHPUR', 'SEONI', 'DINDORI', 'PANDHURNA'] },
{ name: 'JD UJJAIN', districts: ['AGAR MALWA', 'DEWAS', 'MANDSAUR', 'NEEMUCH', 'RATLAM', 'SHAJAPUR', 'UJJAIN'] },
{ name: 'JD SAGAR', districts: ['CHHATARPUR', 'DAMOH', 'PANNA', 'SAGAR', 'TIKAMGARH', 'NIWARI'] },
{ name: 'JD REWA', districts: ['REWA', 'SATNA', 'SIDHI', 'SINGRAULI', 'MAUGANJ', 'MAIHAR'] },
{ name: 'JD NARMADAPURAM', districts: ['BETUL', 'HARDA', 'NARMADAPURAM'] },
{ name: 'JD SHAHDOL', districts: ['ANUPPUR', 'SHAHDOL', 'UMARIA'] }
];
const rows = window.fullData || [];
if (rows.length === 0) return myAlert("No data available to summarize!");
let grand = { total: 0, updated: 0, new: 0, deleted: 0, deo: 0, jd: 0, dpi: 0, unmapped: 0 };
// Total = max serial number (field1)
grand.total = Math.max(...rows.filter(r => (r.field28||'').toUpperCase().trim() !== 'NEW ENTRY').map(r => parseInt(r.field2||'0')||0));
let finalData = [];
structure.forEach(div => {
let divStats = { name: div.name, type: 'JD', total: 0, updated: 0, new: 0, deleted: 0, deo: 0, jd: 0, dpi: 0 };
let districtRows = [];
div.districts.forEach(d => {
let distStats = { name: d, type: 'DISTRICT', total: 0, updated: 0, new: 0, deleted: 0, deo: 0, jd: 0, dpi: 0 };
rows.forEach(row => {
let officeCell = (row.field22 || "").toUpperCase().trim();
if (/^\d{8,}/.test(officeCell) || officeCell.includes("ODS")) {
officeCell = (row.field23 || "").toUpperCase().trim();
}
let status = (row.field28 || "").toUpperCase().trim();
let actionBy = (row.field29 || "").toUpperCase().trim();
const cleanOffice = officeCell
.replace(/^DEO\s+/,'')
.replace(/^JD\s+/,'')
.trim();
const isDistrictData = cleanOffice === d.trim();
if (isDistrictData) {
distStats.total++;
divStats.total++;
if (status.includes("UPDATED")) {
distStats.updated++; divStats.updated++; grand.updated++;
} else if (status.includes("NEW")) {
distStats.new++; divStats.new++; grand.new++;
} else if (status.includes("DELETE")) {
distStats.deleted++; divStats.deleted++; grand.deleted++;
}
if (actionBy.includes("DPI")) {
distStats.dpi++; divStats.dpi++; grand.dpi++;
} else if (actionBy.includes("JD")) {
distStats.jd++; divStats.jd++; grand.jd++;
} else if (actionBy.includes("DEO") || (status !== "" && actionBy !== "")) {
distStats.deo++; divStats.deo++; grand.deo++;
}
}
});
if (distStats.total > 0) districtRows.push(distStats);
});
if (divStats.total > 0) {
finalData.push(divStats);
finalData = finalData.concat(districtRows);
}
});
const printCSS = `
<style>
body{
font-family: "Segoe UI", Tahoma, Arial;
}
@media print {
body * { visibility: hidden; }
#summaryModal, #summaryModal * { visibility: visible; }
#summaryModal { position: absolute; left:0; top:0; width:auto !important; display:block !important; }
.no-print { display:none !important; }
table { width:auto !important; border-collapse:collapse !important; }
th,td { border:1px solid black !important; padding:3px 6px !important; white-space:nowrap !important; }
body::before {
content: "";
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 500px;
height: 500px;
background-image: url("data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAQABAADASIAAhEBAxEB/8QAHQAAAgICAwEAAAAAAAAAAAAAAAECCAYHAwQFCf/EAGgQAAECBAMEBgQHCQsHCQcACwECAwAEBREGITEHEkFRCBMiYXGBFDKRoRUjQlJicoIWN0OSorGys8EXJDNTY3N0dcLR0ic1NlZllMMmNERVhJOj4fAlKEVGZIOFGDjxR1RmlbSk0+L/xAAbAQABBQEBAAAAAAAAAAAAAAAAAQMEBQYCB
background-repeat: no-repeat;
background-position: center;
background-size: contain;
opacity: 0.10;
z-index: 9999;
pointer-events: none;
}
}
@media print {
.toolbar,
#onlineStatusBar,
#formOverlay,
#editTitleHint,
#dpiControlPanel,
#dpiPassModal,
#importExcelModal,
#lockScreen,
#customAlert,
#sessionTimerBadge,
.footer-btn,
.zoom-box,
button { display: none !important; }
#sheetTitleDiv {
display: block !important;
visibility: visible !important;
text-align: center !important;
font-size: 14px !important;
font-weight: 700 !important;
color: #000 !important;
padding: 10px 0 !important;
border-bottom: 2px solid #002e5b !important;
background: white !important;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
}
#sheetTitleText {
display: block !important;
visibility: visible !important;
color: #000 !important;
}
.excel-container { box-shadow: none !important; }
.scroll-area { height: auto !important; overflow: visible !important; }
.row-item { border: 1px solid #ccc !important; background: none !important; color: black !important; }
.f-label { color: black !important; }
.f-num { display: none !important; }
}
@media screen and (max-width: 480px) {
.modern-modal-content {
width: 98% !important;
padding: 15px !important;
margin: 5px auto !important;
}
.modal-header h2 {
font-size: 18px;
}
}
</style>
`;
let modal = document.createElement('div');
modal.id = "summaryModal";
modal.style = `
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.6);
z-index:10000;
display:flex;
justify-content:center;
align-items:center;
`;
modal.innerHTML = printCSS + `
<div style="
background:#000080;
color: white;
border-radius: 8px;
border: 1px solid #ffffff;
display: inline-block;
max-height: 90vh;
overflow: hidden;
width: fit-content;
box-shadow: 0 10px 30px rgba(0,0,0,0.35);
">
<div style="
background:linear-gradient(90deg,#2c3e50,#34495e);
color:white;
padding:10px;
border-bottom:2px solid #1c2833;
text-align:center;
">
<h3 style="margin:0;font-size:15px;font-weight:600;letter-spacing:0.5px;">
District Enrollment Summary
</h3>
<div style="
margin-top:6px;
display:flex;
gap:10px;
justify-content:center;
flex-wrap:wrap;
font-weight:bold;
font-size:14px;
">
<div style="background:#e3f2fd;padding:4px 12px;border:1px solid #000;border-radius:4px;color: black !important;">
Total : ${grand.total}
</div>
<div style="background:#e8f5e9;padding:4px 12px;border:1px solid #000;border-radius:4px;color: black !important;">
Updated : ${grand.updated}
</div>
<div style="background:#e1f5fe;padding:4px 12px;border:1px solid #000;border-radius:4px;color: black !important;">
New Entry : ${grand.new}
</div>
<div style="background:#ffebee;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#b71c1c;">
Delete : ${grand.deleted}
</div>
<div style="background:#ffebee;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#b71c1c;">
DEO : ${grand.deo}
</div>
<div style="background:#e8f5e9;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#1b5e20;">
JD : ${grand.jd}
</div>
<div style="background:#e3f2fd;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#0d47a1;">
DPI : ${grand.dpi}
</div>
</div>
<div style="
overflow-y:auto;
max-height:65vh;
padding:10px;
display:block;
width:100%;
">
<table style="
width:1px !important;
min-width:100% !important;
border-collapse:collapse;
font-size:11px;
border:1px solid #000;
margin:0 auto;
table-layout:auto !important;
background:white;
">
<thead style="background:#f2f2f2; color:#000; font-weight:bold;">
<tr>
<th style="padding:4px 10px;text-align:left;border:1px solid #000;white-space:nowrap;">Office Name</th>
<th style="padding:4px 8px;border:1px solid #000;">Total</th>
<th style="padding:4px 8px;border:1px solid #000;">Updated</th>
<th style="padding:4px 8px;border:1px solid #000;">New entry</th>
<th style="padding:4px 8px;border:1px solid #000;">Delete</th>
<th style="padding:4px 8px;border:1px solid #000;background:#e8f5e9;">📤 Upload List</th>
<th style="padding:4px 8px;border:1px solid #000;background:#e3f2fd;">👁️ View Doc</th>
</tr>
</thead>
<tbody>
${finalData.map(item => {
let itemKey = item.type === 'JD'
? item.name.replace(/\s+/g, '')
: 'DEO' + item.name.replace(/\s+/g, '');
let canUpload = (window.currentUser === itemKey) || (window.currentUser === 'DPI');
let uploadBtn = canUpload
? `<button onclick="summaryUploadDoc('${itemKey}')" style="background:#2e7d32;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;">📤 Upload</button><div id='uploadStatus_${itemKey}' style='font-size:10px;margin-top:2px;'></div>`
: `<span style="color:#bbb;font-size:10px;">🔒 No Access</span>`;
const storedDoc = localStorage.getItem('summaryDoc_' + itemKey);
let viewBtn = storedDoc
? `<button onclick="summaryViewDoc('${itemKey}')" style="background:#1565c0;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;animation:pulseBtn 1.5s infinite;">👁️ View</button>`
: `<span style="color:#aaa;font-size:10px;font-style:italic;">No Document</span>`;
return `
<tr style="border-bottom:1px solid #000;${item.type === 'JD' ? 'background:#e8f1ff;font-weight:600;color:#0d47a1;' : ''}">
<td style="padding:2px 10px;border-right:1px solid #000;white-space:nowrap;color:black !important;">
${item.type === 'JD' ? item.name : 'DEO ' + item.name}
</td>
<td style="padding:2px 8px;text-align:center;border-right:1px solid #000;font-weight:bold;color:black !important;">${item.total}</td>
<td style="padding:2px 8px;text-align:center;border-right:1px solid #000;color:#2e7d32;">${item.updated}</td>
<td style="padding:2px 8px;text-align:center;border-right:1px solid #000;color:#1565c0;">${item.new}</td>
<td style="padding:2px 8px;text-align:center;border-right:1px solid #000;color:#c62828;font-weight:600;">${item.deleted}</td>
<td style="padding:2px 8px;text-align:center;border-right:1px solid #000;">
<input type="file" id="fileUpload_${itemKey}" accept=".pdf,.jpg,.jpeg,.png" style="display:none;" onchange="handleSummaryFileUpload(event,'${itemKey}')">
${uploadBtn}
</td>
<td style="padding:2px 8px;text-align:center;">${viewBtn}</td>
</tr>`;
}).join('')}
</tbody>
</table>
</div>
<div class="no-print" style="
padding:10px;
background:#f5f6fa;
text-align:right;
border-top:1px solid #ddd;
">
<button onclick="window.print()" style="
padding:7px 18px;
background:#2e7d32;
color:white;
border:none;
border-radius:4px;
cursor:pointer;
font-weight:600;
font-size:12px;
margin-right:8px;
">
Print Report
</button>
<button onclick="document.getElementById('summaryModal').remove()" style="
padding:7px 18px;
background:#c62828;
color:white;
border:none;
border-radius:4px;
cursor:pointer;
font-weight:600;
font-size:12px;
">
Close
</button>
</div>
</div>
`;
document.body.appendChild(modal);
}
document.addEventListener('change', function(e) {
if (e.target && e.target.id === 'in19mode') {
const dateInput = document.getElementById('in19');
if (e.target.value === 'DATE') {
dateInput.style.display = 'inline-block';
dateInput.type = 'date';
dateInput.value = "";
} else {
dateInput.style.display = 'none';
dateInput.type = 'text';
dateInput.value = 'NIL';
}
}
});
document.addEventListener('DOMContentLoaded', function() {
const resetBtn = document.getElementById('clearFiltersBtn');
if (resetBtn) {
resetBtn.addEventListener('click', function() {
const filterInputs = document.querySelectorAll('#filterRow input');
filterInputs.forEach(input => { input.value = ''; });
const otherInputs = document.querySelectorAll('thead input');
otherInputs.forEach(input => { input.value = ''; });
window.filteredData = [...window.fullData];
renderVirtual();
console.log("✅ Filters fully reset");
});
}
});
function formatDateToDisplay(dateStr) {
if (!dateStr || dateStr.toUpperCase() === "NIL" || dateStr === "" || dateStr === "dd-mm-yyyy") return "NIL";
if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
const parts = dateStr.split('-');
if (parts.length === 3 && parts[0].length === 4) {
return `${parts[2]}-${parts[1]}-${parts[0]}`;
}
return dateStr;
}
function updateRetirementDate() {
const dobInput = document.getElementById('in7');
const retDisplay = document.getElementById('retirementField');
if (dobInput && dobInput.value && dobInput.value !== "" && dobInput.value !== "NIL") {
const dob = new Date(dobInput.value);
if (!isNaN(dob.getTime())) {
const day   = dob.getDate();
const month = dob.getMonth();
const year  = dob.getFullYear();
let retYear  = year + 62;
let retMonth = month;
if (day === 1) {
retMonth = month - 1;
if (retMonth < 0) { retMonth = 11; retYear--; }
}
const lastDay = new Date(retYear, retMonth + 1, 0);
const d = String(lastDay.getDate()).padStart(2, '0');
const m = String(lastDay.getMonth() + 1).padStart(2, '0');
if (retDisplay) retDisplay.value = `${d}-${m}-${retYear}`;
}
} else {
if (retDisplay) retDisplay.value = "NIL";
}
}
const dobField = document.getElementById('in7');
if (dobField) {
dobField.addEventListener('input', updateRetirementDate);
dobField.addEventListener('change', updateRetirementDate);
const observer = new MutationObserver(() => updateRetirementDate());
observer.observe(dobField, { attributes: true, childList: true, characterData: true });
}
function checkProbationSection() {
var f14 = document.getElementById('in14').value;
var sec = document.getElementById('probationSection');
if (!sec) return;
if (f14 && f14 >= '2020-01-01') {
sec.style.display = 'block';
} else {
sec.style.display = 'none';
resetProbationSection();
}
}
function handleProbationToggle() {
var yesRadio = document.getElementById('probYes');
var details  = document.getElementById('probationDetails');
if (!details) return;
details.style.display = (yesRadio && yesRadio.checked) ? 'block' : 'none';
}
function resetProbationSection() {
var sec = document.getElementById('probationSection');
if (sec) sec.style.display = 'none';
var noRadio = document.getElementById('probNo');
if (noRadio) noRadio.checked = true;
var det = document.getElementById('probationDetails');
if (det) det.style.display = 'none';
var ordNo = document.getElementById('probOrderNo');
if (ordNo) ordNo.value = '';
var ordDt = document.getElementById('probOrderDate');
if (ordDt) ordDt.value = '';
}
function populateProbationFromRecord(rec) {
var remark = rec.field27 || '';
resetProbationSection();
checkProbationSection();
var sec = document.getElementById('probationSection');
if (!sec || sec.style.display === 'none') return;
var match = remark.match(/__PROB__({.*?})__END__/);
if (match) {
try {
var pd = JSON.parse(match[1]);
if (pd.status === 'YES') {
document.getElementById('probYes').checked = true;
handleProbationToggle();
if (pd.orderNo)   document.getElementById('probOrderNo').value   = pd.orderNo;
if (pd.orderDate) document.getElementById('probOrderDate').value = pd.orderDate;
} else {
document.getElementById('probNo').checked = true;
handleProbationToggle();
}
} catch(e) {}
}
}
function extractProbationData(currentRemark) {
var sec = document.getElementById('probationSection');
var clean = (currentRemark || '').replace(/__PROB__({.*?})__END__/g, '').trim();
if (!sec || sec.style.display === 'none') {
return { probationJSON: null, cleanRemark: clean };
}
var yesRadio = document.getElementById('probYes');
var status   = (yesRadio && yesRadio.checked) ? 'YES' : 'NO';
var pd = { status: status };
if (status === 'YES') {
pd.orderNo   = (document.getElementById('probOrderNo')   || {}).value || '';
pd.orderDate = (document.getElementById('probOrderDate') || {}).value || '';
}
var encoded = '__PROB__' + JSON.stringify(pd) + '__END__';
var newRemark = clean ? clean + ' ' + encoded : encoded;
return { probationJSON: pd, cleanRemark: newRemark };
}
function openReportModal() {
const modal = document.getElementById('reportModal');
if(modal) {
modal.style.display = 'flex';
} else {
alert("Error: reportModal ID not found!");
}
}
function openAdvancedFilter() {
const fieldSel = document.getElementById('fieldSelector');
fieldSel.innerHTML = '<option value="">-- Choose Field --</option>';
colConfig.forEach((col, index) => {
if(index < 27) {
let opt = document.createElement('option');
opt.value = index;
opt.innerText = `${index + 1}. ${col.name}`;
fieldSel.appendChild(opt);
}
});
document.getElementById('filterModal').style.display = 'flex';
}
function populateValueDropdown() {
const colIdx = document.getElementById('fieldSelector').value;
const valueSel = document.getElementById('valueSelector');
valueSel.innerHTML = '<option value="ALL">-- Show All Data --</option>';
if(colIdx === "") return;
let uniqueValues = new Set();
window.fullData.forEach(row => {
let val = row['field' + (parseInt(colIdx) + 1)] || "";
val = val.trim();
if(val && val !== "-" && val !== "NIL") {
uniqueValues.add(val);
}
});
Array.from(uniqueValues).sort().forEach(val => {
let opt = document.createElement('option');
opt.value = val;
opt.innerText = val;
valueSel.appendChild(opt);
});
}
function applyAdvancedFilter() {
const colIdx = document.getElementById('fieldSelector').value;
const targetVal = document.getElementById('valueSelector').value;
if(colIdx === "") {
alert("Please select a field first!");
return;
}
if(targetVal === "ALL") {
window.filteredData = [...window.fullData];
} else {
window.filteredData = window.fullData.filter(row => {
let val = row['field' + (parseInt(colIdx) + 1)] || "";
return val.trim() === targetVal;
});
}
renderVirtual();
closeFilterModal();
}
function closeFilterModal() {
document.getElementById('filterModal').style.display = 'none';
}
function calculateRetirementForPDF(dobStr) {
if(!dobStr || dobStr.includes("NIL")) return "NIL";
try {
let parts = dobStr.split('-');
const day   = parseInt(parts[0]);
const month = parseInt(parts[1]) - 1;
const year  = parseInt(parts[2]);
let retYear  = year + 62;
let retMonth = month;
if (day === 1) {
retMonth = month - 1;
if (retMonth < 0) { retMonth = 11; retYear--; }
}
const lastDay = new Date(retYear, retMonth + 1, 0);
const d = String(lastDay.getDate()).padStart(2, '0');
const m = String(lastDay.getMonth() + 1).padStart(2, '0');
return `${d}-${m}-${retYear}`;
} catch(e) { return "NIL"; }
}
function viewDocument(url) {
  if (!url) { myAlert("❌ No document found!"); return; }
  _openCloudinaryDoc(url);
}
function openBase64Doc(key) {
  const dataUrl = window['_b64doc_' + key] || "";
  if (!dataUrl) { myAlert("❌ Document not found!"); return; }

  // If it's a Cloudinary URL (not base64), use fetch→blob
  if (dataUrl.startsWith('http') && dataUrl.includes('cloudinary')) {
    _openCloudinaryDoc(dataUrl);
    return;
  }
  // Base64 document
  try {
    const arr  = dataUrl.split(',');
    const mime = (arr[0].match(/:(.*?);/) || [])[1] || 'application/pdf';
    const bstr = atob(arr[arr.length > 1 ? 1 : 0]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const blob    = new Blob([u8arr], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  } catch(e) {
    window.open(dataUrl, '_blank');
  }
}
function triggerFile() {
const fileInput = document.getElementById('docUpload');
if (fileInput) {
fileInput.click();
} else {
console.error("Error: Element with ID 'docUpload' not found in HTML.");
}
}
const docUploadEl = document.getElementById('docUpload');
if (docUploadEl) {
docUploadEl.addEventListener('change', async function () {
const file = this.files[0];
if (!file) return;
if (file.type !== "application/pdf") {
myAlert("❌ Only PDF allowed!");
this.value = "";
return;
}
const fileNameLabel = document.getElementById('fileName');
if (fileNameLabel) fileNameLabel.innerText = "✅ " + file.name;
await uploadDocument(file);
});
}
function renderVirtual() {
const container = document.querySelector('.scroll-area');
const tbody = document.getElementById('tableBody');
if (!container || !tbody) return;
const scrollTop = container.scrollTop;
const viewportHeight = container.clientHeight;
const totalRows = window.filteredData.length;
let startIndex = Math.floor(scrollTop / ROW_HEIGHT) - 10;
startIndex = Math.max(0, startIndex);
let endIndex = Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + 10;
endIndex = Math.min(totalRows, endIndex);
const topPadding = startIndex * ROW_HEIGHT;
const bottomPadding = Math.max(0, (totalRows - endIndex) * ROW_HEIGHT);
const visibleData = window.filteredData.slice(startIndex, endIndex);
let html = '';
if (topPadding > 0) {
html += `<tr><td colspan="35" style="height:${topPadding}px; border:none;"></td></tr>`;
}
visibleData.forEach((row, idx) => {
let rowData = row;
let gno = rowData.field1 || "";
let changedFields = Array.isArray(rowData.changed_fields)
? rowData.changed_fields
: [];
let rowBg = (rowData.field28 === "DELETED") ? 'style="background-color: #ffebee;"' : '';
let rowClass = (rowData.field28 === "DELETED") ? 'soft-deleted' : '';
html += `<tr onclick="selectRow(this)" ondblclick="openRowInForm('${row.uniqueId}')" data-id="${row.uniqueId}" class="${rowClass} ums-row-animate" ${rowBg}>`;
html += `<td>${gno}</td>`;
for (let i = 2; i <= 31; i++) {
let key = 'field' + i;
let val = rowData[key] || "";
if (i === 28 && val === "DELETED") {
val = `<span style="color:#d32f2f; font-weight:bold;">DELETED</span>`;
}
if (i === 30) {
let docURL = row.document_url || row.field30 || "";
if (docURL && docURL !== "") {
const safeKey30 = (row.uniqueId || idx).toString().replace(/[^a-z0-9]/gi,'_');
val = `<button onclick="openBase64Doc('doc30_${safeKey30}')" style="background:#2563eb; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">📄 View</button>`;
window['_b64doc_doc30_' + safeKey30] = docURL;
} else {
val = `<span style="color:#94a3b8;">No Document</span>`;
}
html += `<td>${val}</td>`;
continue;
}
if (i === 31) {
let transferURL = row.field31 || "";
if (transferURL && transferURL !== "") {
const safeKey31 = (row.uniqueId || idx).toString().replace(/[^a-z0-9]/gi,'_');
val = `<button onclick="openBase64Doc('doc31_${safeKey31}')" style="background:#e65100; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">📤 View</button>`;
window['_b64doc_doc31_' + safeKey31] = transferURL;
} else {
val = `<span style="color:#94a3b8;">No Document</span>`;
}
html += `<td>${val}</td>`;
continue;
}
if ([7, 14, 15, 16, 17, 18, 19].includes(i) && val.includes("-")) {
let parts = val.split("-");
if (parts[0].length === 4) {
val = `${parts[2]}/${parts[1]}/${parts[0]}`;
}
}
// field19 (Inter Division Transfer Date) — blank → NIL
if (i === 19 && (!val || val.trim() === "")) {
val = '<span style="color:#94a3b8;font-style:italic;">NIL</span>';
}
if (changedFields.includes(key)) {
let oldVal = (rowData._oldData?.[key] || "")
.toUpperCase()
.replace(/\s+/g, " ")
.replace(/–/g, "-")
.trim();
let newVal = (val || "")
.toUpperCase()
.replace(/\s+/g, " ")
.replace(/–/g, "-")
.trim();
if (oldVal === newVal) {
}
else if (newVal.includes("/") && oldVal) {
let newParts = newVal.split("/").map(x => x.trim());
let oldParts = oldVal.split("/").map(x => x.trim());
let originalParts = val.split("/");
let result = newParts.map((part, index) => {
if (!oldParts.includes(part)) {
return `<span class="update-highlight">${originalParts[index]}</span>`;
} else {
return originalParts[index];
}
});
val = result.join("/");
}
else {
val = `<span class="update-highlight">${val}</span>`;
}
}
html += `<td title="${val.replace(/<[^>]+>/g, '')}">${val}</td>`;
}
html += `</tr>`;
});
if (bottomPadding > 0) {
html += `<tr><td colspan="35" style="height:${bottomPadding}px; border:none;"></td></tr>`;
}
tbody.innerHTML = html;
}
let searchTimeout;
function handleSearch(val) {
clearTimeout(searchTimeout);
searchTimeout = setTimeout(() => {
val = val.toLowerCase();
window.filteredData = window.fullData.filter(row =>
(row.field2 || "").toLowerCase().includes(val) ||
(row.field4 || "").toLowerCase().includes(val) ||
(row.field5 || "").toLowerCase().includes(val)
);
renderVirtual();
}, 300);
}


// ═══════════════════════════════════════
// JS Block 5
// ═══════════════════════════════════════

// ── Cloudflare Durable Objects Realtime (Supabase replace) ──
// CRUD operations → Worker (_SB_URL) se hote hain
// Realtime → Cloudflare Durable Objects WebSocket se hota hai
const WORKER_URL = _SB_URL; // alias for clarity
const REALTIME_WS_URL = _SB_URL.replace('https://', 'wss://').replace('http://', 'ws://') + '/realtime';
async function loadData() {
let allData = [];
let from = 0;
const limit = 1000;
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const uploadDiv = document.getElementById("uploadStatus");
if (uploadDiv) uploadDiv.style.display = "block";
while (true) {
let data = null;
try {
  const res = await fetch(`${WORKER_URL}/gradation_list?from=${from}&to=${from + limit - 1}`, { headers: _SB_HDR });
  data = await res.json();
} catch(e) { console.error('loadData fetch error:', e); break; }
if (!data || data.length === 0) break;
allData = allData.concat(data);
from += limit;
if (progressText) {
progressText.innerText = `Loading data... ${allData.length}`;
}
if (progressBar) {
let percentage = Math.min((allData.length / 30000) * 100, 95);
progressBar.style.width = percentage + "%";
progressBar.innerText = Math.round(percentage) + "%";
}
await new Promise(r => setTimeout(r, 0));
}
if (typeof loadDataIntoMemory === "function") {
loadDataIntoMemory(allData);
} else {
console.error("loadDataIntoMemory function not found!");
}
if (progressText) progressText.innerText = "✅ " + allData.length + " Records Loaded!";
if (progressBar) {
progressBar.style.width = "100%";
progressBar.innerText = "100%";
progressBar.style.background = "linear-gradient(90deg,#16a34a,#22c55e)";
}
setTimeout(() => {
if (uploadDiv) { uploadDiv.style.display = "none"; }
if (progressBar) { progressBar.style.width = "0%"; progressBar.innerText = "0%"; }
if (progressText) { progressText.innerText = "Starting..."; }
}, 800);
console.log("✅ Total loaded into memory:", allData.length);
}
function getNextSerialNumber() {
if (!window.fullData || window.fullData.length === 0) return 1;
const numbers = window.fullData.map(item => parseInt(item.field1) || 0);
const maxNumber = Math.max(...numbers);
return maxNumber + 1;
}
function loadDataIntoMemory(data) {
const mappedData = data.map(item => {
const d = item.data || {};
return {
...d,
uniqueId: item.unique_id,
field28: d.field28 || item.status || "",
field29: d.field29 || item.deleted_by || item.deletion_timestamp || "",
};
});
const seen = new Set();
window.fullData = mappedData
.slice()
.reverse()
.filter(item => {
// ✅ FIX: Sirf uniqueId se dedup karo — field3 se nahi
// D1 fix ke baad unique_id = field3 hai, field3 se dedup cross-contamination karta tha
if (seen.has(item.uniqueId)) return false;
seen.add(item.uniqueId);
return true;
})
.reverse();
console.log("✅ After removing duplicates (Latest kept):", window.fullData.length);
window.fullData.sort((a, b) => {
const aIsNew = (a.field28||'').toUpperCase().trim() === 'NEW ENTRY';
const bIsNew = (b.field28||'').toUpperCase().trim() === 'NEW ENTRY';
// NEW ENTRY records always at end
if (aIsNew && !bIsNew) return 1;
if (!aIsNew && bIsNew) return -1;
let valA = (a.field1 !== undefined && a.field1 !== null) ? a.field1.toString().trim() : "";
let valB = (b.field1 !== undefined && b.field1 !== null) ? b.field1.toString().trim() : "";
let aNo = valA === "" ? Infinity : parseInt(valA);
let bNo = valB === "" ? Infinity : parseInt(valB);
if (aNo !== bNo) return aNo - bNo;
return (a.uniqueId > b.uniqueId) ? 1 : -1;
});
window.filteredData = [...window.fullData];
console.log("✅ Final Records:", window.fullData.length);
renderVirtual();
}
async function deleteFromSupabase(uniqueID) {
try {
  const res = await fetch(`${WORKER_URL}/gradation_list?unique_id=eq.${encodeURIComponent(uniqueID)}`, {
    method: 'DELETE', headers: _SB_HDR
  });
  if (!res.ok) throw new Error(await res.text());
  console.log("🗑 Deleted:", uniqueID);
} catch(e) { console.error("Delete error:", e); }
}
// ── Cloudflare Durable Objects Realtime ──
// Replaces: Supabase presenceChannel
let _rtWs = null;          // WebSocket instance
let _rtReady = false;      // connected?
let _rtReconnectTimer = null;

function _realtimeUser()     { return window.currentUser || 'Unknown'; }
function _realtimeDistrict() {
var u = window.currentUser || '';
if (!u) return 'UNKNOWN';
if (u === 'DPI') return 'DPI';
if (u.startsWith('JD')) { var jdPart = u.replace(/^JD/, '').trim(); return 'JD ' + jdPart; }
if (u.startsWith('DEO')) { return u.replace(/^DEO/, '').trim() || u; }
return u;
}

const _rowLocks = {};

function initRealtime() {
  // Close existing connection
  if (_rtWs) { try { _rtWs.close(); } catch(e){} _rtWs = null; }
  _rtReady = false;

  const me   = encodeURIComponent(_realtimeUser());
  const dist = encodeURIComponent(_realtimeDistrict());
  const wsUrl = REALTIME_WS_URL + '?user=' + me + '&district=' + dist;

  try {
    _rtWs = new WebSocket(wsUrl);
  } catch(e) {
    console.warn('Realtime WS connect failed:', e);
    _scheduleReconnect();
    return;
  }

  _rtWs.onopen = () => {
    _rtReady = true;
    console.log('Realtime connected ✅');
    // Start ping to keep alive
    _startPing();
  };

  _rtWs.onmessage = (evt) => {
    try {
      const { event, payload } = JSON.parse(evt.data);
      const me = _realtimeUser();
      switch(event) {
        case 'presence-sync':
          updateOnlineUsersUI(payload.state || {});
          break;
        case 'presence-join':
          const _jname = (payload.district && payload.district !== 'UNKNOWN') ? payload.district : _labelFromKey(payload.user);
          showNotification(`${_jname} joined`, 'join');
          // Update online UI — add this user
          _presenceState[payload.user] = [payload];
          updateOnlineUsersUI(_presenceState);
          break;
        case 'presence-leave':
          showNotification(`${_labelFromKey(payload.user)} went offline`, 'leave');
          delete _presenceState[payload.user];
          updateOnlineUsersUI(_presenceState);
          break;
        case 'row-locked':
          if (payload.user !== me) handleExternalLock(payload);
          break;
        case 'row-unlocked':
          handleExternalUnlock(payload);
          break;
        case 'data-update':
          if (payload.user !== me) {
            // Maintenance broadcast
            if (payload.type === 'maintenance' && payload.maintenance) {
              const mc = payload.maintenance;
              const cfg = { active: mc.active, message: mc.message, forJD: mc.forJD, forDEO: mc.forDEO };
              localStorage.setItem('ms_maintenance', JSON.stringify(cfg));
              window._maintCfg = cfg;
              if (typeof checkMaintenanceStatus === 'function') checkMaintenanceStatus();
              if (mc.active) showNotification('🔧 Maintenance Mode ON — Portal band ho raha hai!', 'info');
            }
            // Dates update broadcast
            else if (payload.type === 'dates-update') {
              if (payload.globalStart) { window._msStart = payload.globalStart; localStorage.setItem('config_start_date', payload.globalStart); }
              if (payload.globalEnd)   { window._msEnd   = payload.globalEnd;   localStorage.setItem('config_end_date',   payload.globalEnd); }
              // Per-user overrides
              if (payload.overrides && payload.overrides.length > 0) {
                const ov = JSON.parse(localStorage.getItem('ms_user_overrides') || '{}');
                payload.overrides.forEach(o => { ov[o.user] = { start: o.start, end: o.end }; });
                localStorage.setItem('ms_user_overrides', JSON.stringify(ov));
              }
              if (typeof checkLockStatus === 'function') checkLockStatus();
              showNotification('📅 Access dates updated by DPI', 'info');
            }
            // Normal data update
            else {
              showNotification(payload.msg || 'Data updated by another user', payload.type || 'update');
              const formOpen = document.getElementById('formOverlay')?.style.display === 'block';
              const editingRow = selectedRowElement !== null;
              if (!formOpen && !editingRow) { loadData(); }
              else {
                const bell = document.getElementById('notifBell');
                if (bell) { bell.style.display = 'inline'; bell.classList.add('pulse-animation'); }
              }
            }
          }
          break;
        case 'title-update':
          if (payload.user !== me && payload.title) _applyRemoteTitleUpdate(payload.title);
          break;
        case 'pong':
          break; // keepalive ok
      }
    } catch(e) { console.warn('Realtime msg error:', e); }
  };

  _rtWs.onclose = () => {
    _rtReady = false;
    console.warn('Realtime WS closed, reconnecting...');
    _scheduleReconnect();
  };

  _rtWs.onerror = (e) => {
    _rtReady = false;
    console.warn('Realtime WS error:', e);
  };
}

// Local presence state cache
const _presenceState = {};

function _scheduleReconnect() {
  if (_rtReconnectTimer) clearTimeout(_rtReconnectTimer);
  _rtReconnectTimer = setTimeout(() => {
    if (window.currentUser) initRealtime();
  }, 5000);
}

let _pingTimer = null;
function _startPing() {
  if (_pingTimer) clearInterval(_pingTimer);
  _pingTimer = setInterval(() => {
    _rtSend({ event: 'ping' });
  }, 25000); // ping every 25s
}

function _rtSend(data) {
  if (_rtWs && _rtReady && _rtWs.readyState === 1) {
    try { _rtWs.send(JSON.stringify(data)); } catch(e) {}
  }
}

function _labelFromKey(key) {
  if (!key) return 'User';
  if (key === 'DPI') return 'DPI';
  if (key.startsWith('JD')) return 'JD ' + key.replace(/^JD/, '').trim();
  if (key.startsWith('DEO')) return key.replace(/^DEO/, '').trim();
  return key;
}

function updateOnlineUsersUI(state) {
  const div = document.getElementById('onlineStatus');
  if (!div) return;
  const entries = Object.entries(state);
  if (entries.length === 0) {
    div.innerHTML = '<span style="color:#999;font-style:italic;">No other users online</span>';
    return;
  }
  div.innerHTML = entries.map(([key, presArr]) => {
    const p = Array.isArray(presArr) ? presArr[0] : presArr;
    let label = '';
    if (p && p.district && p.district !== 'UNKNOWN' && p.district !== 'Unknown') { label = p.district; }
    else if (p && p.user && p.user !== 'Unknown') { label = _labelFromKey(p.user); }
    else { label = _labelFromKey(key); }
    const since = (p && p.onlineAt) ? new Date(p.onlineAt).toLocaleTimeString('en-IN') : '';
    return `<span title="${label} | Online since: ${since}" style="padding:2px 8px; background:#e8f5e9; border-radius:12px; font-size:10px; border:1px solid #4caf50; white-space:nowrap;">🟢 ${label}</span>`;
  }).join('');
}

function lockRow(rowId) {
  if (!rowId) return;
  _rowLocks[rowId] = { user: _realtimeUser(), district: _realtimeDistrict(), self: true };
  _rtSend({ event: 'row-locked', payload: { rowId, user: _realtimeUser(), district: _realtimeDistrict() } });
}

function unlockRow(rowId) {
  if (!rowId) return;
  delete _rowLocks[rowId];
  _rtSend({ event: 'row-unlocked', payload: { rowId } });
}

function handleExternalLock(data) {
  _rowLocks[data.rowId] = { user: data.user, district: data.district, self: false };
  const row = document.querySelector(`#tableBody tr[data-id="${data.rowId}"]`);
  if (row) {
    row.classList.add('row-locked-external');
    row.title = `🔒 Being edited by ${data.district} (${data.user})`;
    if (!row.querySelector('.lock-icon')) {
      const icon = document.createElement('span');
      icon.className = 'lock-icon'; icon.textContent = ' 🔒';
      row.cells[2].appendChild(icon);
    }
  }
}

function handleExternalUnlock(data) {
  delete _rowLocks[data.rowId];
  const row = document.querySelector(`#tableBody tr[data-id="${data.rowId}"]`);
  if (row) {
    row.classList.remove('row-locked-external');
    row.title = '';
    row.querySelector('.lock-icon')?.remove();
  }
}

const _origRenderVirtual = renderVirtual;
renderVirtual = function() {
  _origRenderVirtual.apply(this, arguments);
  Object.keys(_rowLocks).forEach(rowId => {
    const lock = _rowLocks[rowId];
    if (!lock.self) {
      const row = document.querySelector(`#tableBody tr[data-id="${rowId}"]`);
      if (row && !row.classList.contains('row-locked-external')) {
        row.classList.add('row-locked-external');
        row.title = `🔒 Being edited by ${lock.district} (${lock.user})`;
        if (!row.querySelector('.lock-icon')) {
          const icon = document.createElement('span');
          icon.className = 'lock-icon'; icon.textContent = ' 🔒';
          row.cells[2].appendChild(icon);
        }
      }
    }
  });
};

const _toastColors = { update: '#4caf50', join: '#2196f3', leave: '#9e9e9e', delete: '#f44336', info: '#607d8b' };
function showNotification(msg, type = 'info') {
  const color = _toastColors[type] || _toastColors.info;
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed; bottom:20px; right:20px; z-index:100000; background:#1e293b; color:white; padding:11px 18px; border-radius:8px; box-shadow:0 6px 20px rgba(0,0,0,0.35); border-left:5px solid ${color}; font-size:13px; font-family:'Inter',sans-serif; max-width:320px; word-wrap:break-word;`;
  toast.innerHTML = `🔔 ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 4500);
}

function broadcastDataUpdate(msg, type = 'update') {
  _rtSend({ event: 'data-update', payload: { msg, type, user: _realtimeUser(), district: _realtimeDistrict() } });
}

window.addEventListener('load', () => {
  setTimeout(() => {
    if (window.currentUser) initRealtime();
  }, 1500);
});
window.addEventListener("load", () => {
setTimeout(handle18Mode, 500);
});
let lastScrollTop = 0;
document.addEventListener("DOMContentLoaded", () => {
const container = document.querySelector('.scroll-area');
if (container) {
container.addEventListener("scroll", () => {
if (container.scrollTop !== lastScrollTop) {
lastScrollTop = container.scrollTop;
requestAnimationFrame(() => {
renderVirtual();
});
}
});
}
});
async function updateUploadStatus(event) {
  const file = event.target.files[0];
  const display = document.getElementById('fileNameDisplay');
  const premiumBox = display ? display.closest('.premium-box') : null;
  if (!file) return;

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    myAlert("❌ File size cannot exceed 5MB.\nYour file: " + (file.size / 1024 / 1024).toFixed(2) + "MB");
    event.target.value = "";
    return;
  }

  display.innerHTML = "⏳ Processing...";
  display.style.color = "#f39c12";

  // Step 1: Read as base64 for immediate local viewing (like transfer upload)
  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64 = e.target.result;
    window['_b64doc_doc30_loaded'] = base64;
    uploadedFileURL = base64; // use base64 as primary URL

    // Upload to Supabase Storage
    try {
      await uploadDocument(file);
    } catch(err) {
      console.warn('Supabase upload failed:', err.message);
    }

    // Always succeed since base64 is ready
    var viewHtml = ['<span style="color:#27ae60">&#x2705; ' + file.name + '</span>',
      ' &nbsp;<button id="doc30ViewBtn" style="background:#1565c0;color:white;',
      'border:none;padding:2px 7px;border-radius:4px;cursor:pointer;',
      'font-size:11px;font-weight:bold;">&#x1F441; View</button>'].join('');
    display.innerHTML = viewHtml;
    display.style.color = '#27ae60';
    if (premiumBox) {
      premiumBox.style.borderColor = '#2e7d32';
      premiumBox.style.background  = '#f0fff4';
      premiumBox.onclick = null;
    }
    setTimeout(function() {
      var vb = document.getElementById('doc30ViewBtn');
      if (vb) vb.onclick = function() { openBase64Doc('doc30_loaded'); };
    }, 30)
  };
  reader.onerror = function() {
    display.innerHTML = "❌ File read failed";
    display.style.color = "#e74c3c";
  };
  reader.readAsDataURL(file);
}
function generateSerialNumber() {
// Use fullData (not visible DOM rows) so virtual scrolling doesn't cause wrong serial
if (!window.fullData || window.fullData.length === 0) return 1;
const numbers = window.fullData.map(item => parseInt(item.field1) || 0).filter(n => !isNaN(n));
return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}
function handleUpdateClick() {
const uniqueId = document.getElementById("in3").value.trim().toUpperCase();
if (!uniqueId) {
myAlert("⚠️ Please enter Unique ID first.");
return;
}
let recordFound = false;
if (window.fullData && window.fullData.length > 0) {
recordFound = window.fullData.some(row =>
(row.uniqueId || "").trim().toUpperCase() === uniqueId ||
(row.field3 || "").trim().toUpperCase() === uniqueId
);
}
if (!recordFound) {
myAlert("❌ Record not found in list. Update not allowed.");
return;
}
saveEntry(false);
}
function logoutUser() {
if(confirm("Do you want to Logout?")) {
auditLog('LOGOUT', 'User logged out');
securityClearTimer();
if (selectedRowElement && typeof unlockRow === 'function') unlockRow(selectedRowElement.dataset.id);
if (_rtWs) {
try { _rtWs.close(); } catch(e) {}
_rtWs = null;
_rtReady = false;
}
if (_pingTimer) { clearInterval(_pingTimer); _pingTimer = null; }
if (_rtReconnectTimer) { clearTimeout(_rtReconnectTimer); _rtReconnectTimer = null; }
const loginOverlay = document.getElementById('loginOverlay');
if (loginOverlay) loginOverlay.style.display = 'flex';
document.getElementById('userField').value = "";
document.getElementById('passField').value = "";
const errorDiv = document.getElementById('loginError');
if (errorDiv) errorDiv.innerText = "";
localStorage.removeItem('isLoggedIn');
window.currentUser = null;
const _ubL = document.getElementById('userBadge');
if(_ubL){ _ubL.textContent=''; _ubL.style.display='none'; }
}
}
function checkDuplicateID(inputEl) {
let enteredID = inputEl.value.trim().toUpperCase();
if (enteredID.length === 0) return;
if (typeof selectedRowElement !== 'undefined' && selectedRowElement !== null) {
let existingRowID = selectedRowElement.cells[2].innerText.trim().toUpperCase();
if (existingRowID === enteredID) {
return;
}
}
let isDuplicate = false;
if (window.fullData && window.fullData.length > 0) {
isDuplicate = window.fullData.some(row => row.uniqueId === enteredID);
}
if (isDuplicate) {
myAlert("⚠️ This Unique ID (" + enteredID + ") is already submitted!");
inputEl.value = "";
inputEl.classList.remove('invalid-field');
}
}
function viewHistory() {
if (!selectedRowElement) {
myAlert("⚠️ Please select a row first!");
return;
}
const uniqueId = selectedRowElement.cells[2].innerText.trim();
const record = window.fullData.find(r => (r.uniqueId || "").trim().toUpperCase() === uniqueId.toUpperCase());
const history = record ? record.history_log : null;
if (!history || history.length === 0) {
myAlert("❌ No history found for this record.");
return;
}
let output = "";
history.forEach((h, index) => {
let before = JSON.parse(h.before);
let after = JSON.parse(h.after);
let hasChange = false;
function normalizeDate(val) {
if (!val) return "";
if (val.includes("-")) {
let parts = val.split("-");
if (parts.length === 3) {
if (parts[0].length === 2) {
return `${parts[2]}-${parts[1]}-${parts[0]}`;
}
return val;
}
}
return val;
}
output += `<div style="margin-bottom:15px">`;
output += `<b>Update ${index + 1} (${h.time})</b><br><br>`;
for (let key in before) {
let beforeVal = before[key] || "-";
let afterVal = after[key] || "-";
let normBefore = normalizeDate(beforeVal);
let normAfter = normalizeDate(afterVal);
if (normBefore !== normAfter) {
hasChange = true;
output += `
<div style="margin-bottom:10px; text-align:left;">
<b>${fieldNames[key] || key}</b><br>
Before: <span style="color:red">${beforeVal}</span><br>
After: <span style="color:green">${afterVal}</span>
</div>
`;
}
}
if (!hasChange) {
output += `<i>No actual changes</i>`;
}
output += `</div>`;
});
showHistoryPopup(output);
}
function saveHistory(oldData, newData, uniqueId) {
if (!historyStore[uniqueId]) {
historyStore[uniqueId] = [];
}
historyStore[uniqueId].push({
time: new Date().toLocaleString(),
before: JSON.stringify(oldData),
after: JSON.stringify(newData)
});
}
function showHistoryPopup(htmlData) {
if (document.getElementById('historyPopupBox')) document.getElementById('historyPopupBox').remove();
if (document.getElementById('popupOverlay')) document.getElementById('popupOverlay').remove();
const overlay = document.createElement('div');
overlay.id = 'popupOverlay';
Object.assign(overlay.style, {
position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '9999'
});
document.body.appendChild(overlay);
const box = document.createElement('div');
box.id = 'historyPopupBox';
Object.assign(box.style, {
position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto',
backgroundColor: 'white', padding: '20px', zIndex: '10000',
borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontFamily: 'sans-serif'
});
let header = `
<div style="display:flex; justify-content:space-between; align-items:center; position:sticky; top:-20px; background:white; padding:10px 0; border-bottom:2px solid #eee; margin-bottom:15px; z-index:11;">
<h3 style="margin:0; color:#333;">📜 Update History</h3>
<button onclick="closeHistoryPopup()" style="background:#ff4757; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">CLOSE [X]</button>
</div>
`;
box.innerHTML = header + htmlData;
document.body.appendChild(box);
overlay.onclick = closeHistoryPopup;
}
function closeHistoryPopup() {
const box = document.getElementById('historyPopupBox');
const overlay = document.getElementById('popupOverlay');
if (box) box.remove();
if (overlay) overlay.remove();
}
function getSummaryDocKey(officeKey) {
return 'summaryDoc_' + officeKey;
}
function summaryUploadDoc(officeKey) {
if (window.currentUser !== officeKey && window.currentUser !== 'DPI') {
myAlert('❌ You can only upload your own document.');
return;
}
const fileInput = document.getElementById('fileUpload_' + officeKey);
if (fileInput) fileInput.click();
}
async function handleSummaryFileUpload(event, officeKey) {
const file = event.target.files[0];
if (!file) return;
if (window.currentUser !== officeKey && window.currentUser !== 'DPI') {
myAlert('❌ Unauthorized upload attempt!');
event.target.value = '';
return;
}
const MAX_SUMMARY_SIZE = 1 * 1024 * 1024; // 1MB
if (file.size > MAX_SUMMARY_SIZE) {
myAlert("❌ Summary Document size cannot exceed 1MB.\nYour file: " + (file.size / 1024).toFixed(1) + "KB\nPlease compress the file and upload again.");
event.target.value = '';
return;
}
const statusDiv = document.getElementById('uploadStatus_' + officeKey);
if (statusDiv) { statusDiv.innerHTML = '⏳ Uploading...'; statusDiv.style.color = '#f39c12'; }
let publicUrl = null;
try {
const fd = new FormData();
    const _sp = 'summary_docs/' + officeKey + '/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const _sfd = new FormData(); _sfd.append('file', file); _sfd.append('path', _sp);
    const _sUpRes = await fetch(`${WORKER_URL}/upload`, { method: 'POST', body: _sfd });
    if (!_sUpRes.ok) throw new Error(await _sUpRes.text());
    publicUrl = (await _sUpRes.json()).url;
  } catch (err) {
    console.warn('Cloudinary upload failed, using local fallback:', err.message);
  }
const meta = {
name: file.name,
url: publicUrl,
local_data: null,
uploadedBy: window.currentUser,
uploadedAt: new Date().toLocaleString('hi-IN')
};
if (!publicUrl) {
await new Promise(resolve => {
const reader = new FileReader();
reader.onload = ev => { meta.local_data = ev.target.result; resolve(); };
reader.readAsDataURL(file);
});
}
localStorage.setItem(getSummaryDocKey(officeKey), JSON.stringify(meta));
if (statusDiv) { statusDiv.innerHTML = '✅ ' + file.name; statusDiv.style.color = '#27ae60'; }
myAlert('✅ Document Successfully Uploaded!\nFile: ' + file.name + '\n\nReopen Summary — View button will appear.');
event.target.value = '';
}
function summaryViewDoc(officeKey) {
if (!officeKey) { myAlert('❌ Office key missing.'); return; }
const stored = localStorage.getItem(getSummaryDocKey(officeKey));
if (!stored) {
myAlert('❌ No Document uploaded for ' + officeKey + '.');
return;
}
try {
const docInfo = JSON.parse(stored);
if (docInfo.local_data) {
const win = window.open('', '_blank');
if (!win) { myAlert('❌ Popup blocked! Please allow popups in your browser.'); return; }
win.document.write('<html><head><title>' + officeKey + ' Document</title></head><body style="margin:0;padding:0;"><iframe src="' + docInfo.local_data + '" style="width:100%;height:100vh;border:none;"></iframe></body></html>');
win.document.close();
return;
}
if (docInfo.url && !docInfo.url.startsWith('local:')) {
const _dUrl = docInfo.url;
    if (_dUrl && _dUrl.includes('cloudinary')) {
      _openCloudinaryDoc(_dUrl);
    } else {
      window.open(_dUrl, '_blank');
    }
return;
}
myAlert('❌ Document data not found. Please upload again.');
} catch(e) {
myAlert('❌ Error reading document.');
}
}


// ═══════════════════════════════════════
// JS Block 6
// ═══════════════════════════════════════

var _pdfDoc       = null;
var _pdfScale     = 1.5;
var _pdfCurrentPage = 1;
var _currentPdfUrl  = '';

if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function _openCloudinaryDoc(url) {
  if (!url) return;

  // ✅ FIX: Base64 document — blob URL banao aur new tab mein open karo
  if (url.startsWith('data:')) {
    try {
      var arr = url.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while(n--) u8arr[n] = bstr.charCodeAt(n);
      var blob = new Blob([u8arr], { type: mime });
      var blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      setTimeout(function() { URL.revokeObjectURL(blobUrl); }, 10000);
    } catch(e) {
      myAlert('❌ Document open nahi hua: ' + e.message);
    }
    return;
  }

  _currentPdfUrl = url;
  var fname = decodeURIComponent(url.split('/').pop() || 'document');
  var modal = document.getElementById('pdfViewerModal');
  var wrap  = document.getElementById('pdfCanvasWrap');
  var title = document.getElementById('pdfViewerTitle');
  var info  = document.getElementById('pdfPageInfo');
  if (title) title.innerText = fname;
  if (info)  info.innerText  = 'Cloudinary Document';
  if (modal) modal.style.display = 'flex';

  // Store URL globally for copy button
  window._cldCopyUrl = url;

  if (wrap) {
    // ── If served over HTTPS (Netlify/Vercel), show iframe directly ──
    if (window.location.protocol === 'https:') {
      var ext = (url.split('?')[0].split('.').pop() || '').toLowerCase();
      var isImg = ['jpg','jpeg','png','gif','webp','svg'].indexOf(ext) > -1;
      if (isImg) {
        wrap.innerHTML = '<img src="' + url + '" style="max-width:100%;max-height:80vh;display:block;margin:auto;border-radius:4px;">';
      } else {
        wrap.innerHTML = '<iframe src="' + url + '" style="width:100%;height:80vh;border:none;background:#fff;border-radius:4px;"></iframe>';
      }
      // Set copy URL too
      setTimeout(function() {
        var box = document.getElementById('cldUrlBox');
        var btn = document.getElementById('cldCopyBtn');
        if (box) box.value = window._cldCopyUrl || '';
        if (btn) btn.onclick = function() {
          var b = document.getElementById('cldUrlBox');
          if (b) { b.select(); document.execCommand('copy'); }
          if (typeof umsToast === 'function') umsToast('✅ URL Copied!', 'success', 2000);
        };
      }, 50);
      return;
    }

    // ── Local file:// — show the copy-URL fallback ──
    wrap.innerHTML = [
      '<div style="color:white;text-align:center;padding:40px 30px;max-width:700px;margin:auto;">',
      '<div style="font-size:48px;margin-bottom:12px;">&#x1F4C4;</div>',
      '<div style="font-size:15px;font-weight:700;margin-bottom:6px;">' + fname + '</div>',
      '<div style="font-size:12px;color:#fcd34d;margin-bottom:20px;line-height:1.6;">',
      '&#9888; Edge browser local file se Cloudinary URLs block karta hai.<br>',
      'Neeche URL copy karke <b>new tab mein paste</b> karein.',
      '</div>',
      '<div style="display:flex;gap:8px;margin-bottom:16px;">',
      '<input id="cldUrlBox" type="text" readonly onclick="this.select()" ',
      'style="flex:1;padding:10px 12px;border-radius:6px;border:none;font-size:11px;',
      'background:#1a2540;color:#a8c4ff;font-family:monospace;outline:none;cursor:text;">',
      '<button id="cldCopyBtn" style="padding:10px 16px;background:#1e6fe0;color:white;',
      'border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700;">',
      '&#x1F4CB; Copy</button>',
      '</div>',
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:20px;">',
      'Ctrl+C ke baad Edge address bar mein Ctrl+V paste karein',
      '</div>',
      '<div style="background:rgba(240,165,0,0.12);border:1px solid rgba(240,165,0,0.3);',
      'border-radius:8px;padding:12px;font-size:11px;color:#fcd34d;text-align:left;">',
      '&#128161; <b>Permanent Fix:</b> HTML file ko Netlify/Vercel pe deploy karo — PDF direct preview hoga.',
      '</div></div>'
    ].join('');

    // Set URL value and copy button handler after DOM update
    setTimeout(function() {
      var box = document.getElementById('cldUrlBox');
      var btn = document.getElementById('cldCopyBtn');
      if (box) box.value = window._cldCopyUrl || '';
      if (btn) btn.onclick = function() {
        var b = document.getElementById('cldUrlBox');
        if (b) { b.select(); document.execCommand('copy'); }
        if (typeof umsToast === 'function') umsToast('✅ URL Copied!', 'success', 2000);
      };
    }, 50);
  }
}

function _downloadPdfDirect() {
  if (!_currentPdfUrl) return;
  // fl_attachment forces correct Content-Disposition: attachment header
  var dlUrl = _currentPdfUrl
    .replace('/image/upload/', '/image/upload/fl_attachment/')
    .replace('/raw/upload/',   '/raw/upload/fl_attachment/');
  var a = document.createElement('a');
  a.href = dlUrl;
  a.download = decodeURIComponent(_currentPdfUrl.split('/').pop() || 'document.pdf');
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  closePdfViewer();
  if (typeof umsToast === 'function') umsToast('⬇️ Document download ho raha hai...', 'success', 3000);
}

function closePdfViewer() {
  var modal = document.getElementById('pdfViewerModal');
  var wrap  = document.getElementById('pdfCanvasWrap');
  if (wrap)  wrap.innerHTML = '';
  if (modal) modal.style.display = 'none';
  _pdfDoc = null; _currentPdfUrl = '';
}

var _pdfModalEl = document.getElementById('pdfViewerModal');
if (_pdfModalEl) _pdfModalEl.addEventListener('click', function(e) { if (e.target === this) closePdfViewer(); });


// ═══════════════════════════════════════
// JS Block 7
// ═══════════════════════════════════════

// ══ CLOUD PASSWORD SYNC — har device pe sync hoga ══
const _PW_SUPABASE_KEY = 'custom_passwords';

async function _savePasswordToCloud(userId, newPass) {
  // Sirf user_passwords table mein save karo (password change log)
  try {
    const _pwRes = await fetch(`${WORKER_URL}/user_passwords`, {
      method: 'POST',
      headers: { ..._SB_HDR, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: userId, password: newPass, changed_by: window.currentUser || 'DPI', changed_at: new Date().toISOString() })
    });
    if (!_pwRes.ok) throw new Error(await _pwRes.text());
    console.log('✅ Password change saved to user_passwords for:', userId);
    return true;
  } catch(e) { console.warn('Cloud pw save failed:', e.message); return false; }
}

async function _loadPasswordsFromCloud() {
  const result = {};
  try {
    const uRes = await fetch(`${WORKER_URL}/users?select=userid,password`, { headers: _SB_HDR });
    const uData = await uRes.json();
    if(Array.isArray(uData)) uData.forEach(row => { if(row.userid && row.password) result[row.userid] = row.password; });
  } catch(e) {}
  try {
    const pRes = await fetch(`${WORKER_URL}/user_passwords?select=user_id,password`, { headers: _SB_HDR });
    const pData = await pRes.json();
    if(Array.isArray(pData)) pData.forEach(row => { if(row.user_id && row.password) result[row.user_id] = row.password; });
  } catch(e) {}
  return result;
}

async function _syncCloudPasswordsToLocal() {
  const cloud = await _loadPasswordsFromCloud();
  const local = JSON.parse(localStorage.getItem('msErp_customPasswords') || '{}');
  const merged = Object.assign({}, local, cloud);
  localStorage.setItem('msErp_customPasswords', JSON.stringify(merged));
  Object.assign(districtCredentials, merged);
  return merged;
}

// Override saveDpiNewPassword → save to cloud
saveDpiNewPassword = function() {
  const newPass = document.getElementById('dpiNewPass')?.value.trim();
  const confirmPass = document.getElementById('dpiConfirmPass')?.value.trim();
  const errDiv = document.getElementById('dpiEditPassErr');
  if (!newPass || newPass.length < 4) { if(errDiv) errDiv.innerHTML = '❌ Min 4 characters.'; return; }
  if (newPass !== confirmPass) { if(errDiv) errDiv.innerHTML = '❌ Passwords do not match.'; return; }
  const custom = JSON.parse(localStorage.getItem('msErp_customPasswords') || '{}');
  const oldPass = custom['DPI'] || districtCredentials['DPI'] || '(default)';
  custom['DPI'] = newPass;
  localStorage.setItem('msErp_customPasswords', JSON.stringify(custom));
  districtCredentials['DPI'] = newPass;
  if(typeof auditLog==='function') auditLog('DPI_PASSWORD_CHANGED','DPI password changed');
  if(errDiv) errDiv.innerHTML = '<span style="color:#1565c0;font-weight:bold;">⏳ Saving to cloud (all devices)...</span>';
  _savePasswordToCloud('DPI', newPass).then(ok => {
    if(errDiv) errDiv.innerHTML = ok
      ? '<span style="color:#2e7d32;font-weight:bold;">✅ Saved! All devices pe apply hoga!</span>'
      : '<span style="color:#e65100;font-weight:bold;">✅ Locally saved (cloud sync failed)</span>';
    setTimeout(() => {
      document.getElementById('dpiEditPassModal')?.remove();
      if(typeof buildDistPassTable==='function') buildDistPassTable('dpi');
      if(typeof showDistPassTab==='function') showDistPassTab('dpi');
    }, 1800);
  });
  _sbLogPwReset('DPI', oldPass, newPass, 'DPI (Self)');
};

// Override saveUniPassword → save to cloud
saveUniPassword = function(userId, userType) {
  const newPass = document.getElementById('uniNewPass')?.value.trim();
  const confirmPass = document.getElementById('uniConfirmPass')?.value.trim();
  const errDiv = document.getElementById('uniEditPassErr');
  if (!newPass || newPass.length < 4) { if(errDiv) errDiv.innerHTML = '❌ Min 4 characters.'; return; }
  if (newPass !== confirmPass) { if(errDiv) errDiv.innerHTML = '❌ Passwords do not match.'; return; }
  const custom = JSON.parse(localStorage.getItem('msErp_customPasswords') || '{}');
  const oldPass = custom[userId] || districtCredentials[userId] || '(default)';
  custom[userId] = newPass;
  localStorage.setItem('msErp_customPasswords', JSON.stringify(custom));
  districtCredentials[userId] = newPass;
  if(typeof auditLog==='function') auditLog(userType+'_PASSWORD_CHANGED', userId+' pw changed by '+(window.currentUser||'DPI'));
  if(errDiv) errDiv.innerHTML = '<span style="color:#1565c0;font-weight:bold;">⏳ Saving to cloud (all devices)...</span>';
  _savePasswordToCloud(userId, newPass).then(ok => {
    if(errDiv) errDiv.innerHTML = ok
      ? '<span style="color:#2e7d32;font-weight:bold;">✅ ' + userId + ' — All devices pe apply hoga!</span>'
      : '<span style="color:#e65100;font-weight:bold;">✅ Locally saved (cloud sync failed)</span>';
    setTimeout(() => {
      document.getElementById('uniEditPassModal')?.remove();
      const tab = userType==='DPI'?'dpi':userType==='JD'?'jd':'deo';
      if(typeof buildDistPassTable==='function') buildDistPassTable(tab);
      if(typeof showDistPassTab==='function') showDistPassTab(tab);
    }, 1800);
  });
  _sbLogPwReset(userId, oldPass, newPass, window.currentUser||'DPI');
};

// Supabase users table se user fetch karo
async function _getUserFromCloud(userId) {
  try {
    const _ugRes = await fetch(`${WORKER_URL}/users?userid=eq.${encodeURIComponent(userId)}&select=userid,password,level,location`, { headers: _SB_HDR });
    const _ugData = await _ugRes.json();
    if (!_ugData) return null;
    return Array.isArray(_ugData) ? (_ugData[0] || null) : _ugData;
  } catch(e) { return null; }
}

// Override getEffectivePassword
getEffectivePassword = function(user) {
  const custom = JSON.parse(localStorage.getItem('msErp_customPasswords') || '{}');
  return custom[user] || districtCredentials[user] || null;
};

// Override checkLogin → Supabase users table + cloud passwords sync
checkLogin = async function() {
  const user = document.getElementById('userField').value.trim().toUpperCase();
  const pass = document.getElementById('passField').value.trim();
  const errorDiv = document.getElementById('loginError');
  const blockKey = 'loginBlock_' + user;
  const attemptsKey = 'loginAttempts_' + user;
  const blockData = JSON.parse(localStorage.getItem(blockKey) || 'null');
  if (blockData) {
    const remaining = Math.ceil((blockData.until - Date.now()) / 1000);
    if (remaining > 0) { errorDiv.innerText = '🔒 Account blocked for ' + remaining + 's.'; return; }
    localStorage.removeItem(blockKey); localStorage.removeItem(attemptsKey);
  }
  errorDiv.innerText = '⏳ Verifying from cloud...';

  // Step 1: Supabase users table mein dhundo
  const cloudUser = await _getUserFromCloud(user);
  if (cloudUser && cloudUser.password === pass) {
    // Cloud user found — login success
    localStorage.removeItem(attemptsKey); localStorage.removeItem(blockKey);
    // districtCredentials mein bhi add karo is session ke liye
    districtCredentials[user] = pass;
    window.currentUserLevel = cloudUser.level || 'DEO';
    window.currentUserLocation = cloudUser.location || '';
    document.getElementById('loginOverlay').style.display = 'none';
    window.currentUser = user;
    const _ub = document.getElementById('userBadge');
    if(_ub){ _ub.textContent='👤 '+user; _ub.style.display='inline-block'; }
    if(typeof securityResetTimer==='function') securityResetTimer();
    if(typeof auditLog==='function') auditLog('LOGIN','User logged in via cloud users table');
    if(typeof loadData==='function') loadData();
    if(typeof initRealtime==='function') initRealtime();
    if(typeof _updateTitleHintVisibility==='function') _updateTitleHintVisibility();
    if(typeof checkLockStatus==='function') checkLockStatus();
    errorDiv.innerText = '';
    return;
  }

  // Step 2: Purane districtCredentials + user_passwords table se check karo
  await _syncCloudPasswordsToLocal();
  const correctPass = getEffectivePassword(user);
  if (correctPass && pass === correctPass) {
    localStorage.removeItem(attemptsKey); localStorage.removeItem(blockKey);
    document.getElementById('loginOverlay').style.display = 'none';
    window.currentUser = user;
    const _ub = document.getElementById('userBadge');
    if(_ub){ _ub.textContent='👤 '+user; _ub.style.display='inline-block'; }
    if(typeof securityResetTimer==='function') securityResetTimer();
    if(typeof auditLog==='function') auditLog('LOGIN','User logged in');
    if(typeof loadData==='function') loadData();
    if(typeof initRealtime==='function') initRealtime();
    if(typeof _updateTitleHintVisibility==='function') _updateTitleHintVisibility();
    if(typeof checkLockStatus==='function') checkLockStatus();
    errorDiv.innerText = '';
  } else {
    let attempts = parseInt(localStorage.getItem(attemptsKey) || '0') + 1;
    localStorage.setItem(attemptsKey, attempts);
    if (attempts >= 3) {
      localStorage.setItem(blockKey, JSON.stringify({ until: Date.now() + 5*60*1000 }));
      localStorage.removeItem(attemptsKey);
      errorDiv.innerText = '🔒 3 wrong attempts! Blocked for 5 minutes.';
    } else {
      errorDiv.innerText = '❌ INVALID USER ID OR PASSWORD! (' + attempts + '/3 attempts)';
    }
  }
};
console.log('✅ Cloud Password Sync + Users Table loaded.');


// ═══════════════════════════════════════
// JS Block 8
// ═══════════════════════════════════════

function showAnalytics() {
const rows = window.fullData || [];
if (rows.length === 0) { myAlert("⚠️ Data not loaded yet!"); return; }
if (document.getElementById('analyticsModal')) document.getElementById('analyticsModal').remove();
const modal = document.createElement('div');
modal.id = 'analyticsModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);z-index:10001;display:flex;align-items:center;justify-content:center;';
modal.innerHTML = `
<div style="background:#f8f9fa;border-radius:12px;width:96%;max-width:1100px;max-height:93vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
<!-- Header -->
<div style="background:linear-gradient(135deg,#1a237e,#283593);color:white;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
<div>
<div style="font-size:17px;font-weight:700;letter-spacing:0.3px;">📊 DPI Live Dashboard</div>
<div style="font-size:11px;opacity:0.75;margin-top:2px;">MS Gradation ERP — Real-time Analytics</div>
</div>
<div style="display:flex;align-items:center;gap:10px;">
<span id="dashLiveIndicator" style="font-size:11px;background:rgba(76,175,80,0.3);border:1px solid rgba(76,175,80,0.6);padding:3px 10px;border-radius:20px;">🟢 Live</span>
<button onclick="document.getElementById('analyticsModal').remove()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;">✕</button>
</div>
</div>
<!-- KPI Strip -->
<div id="kpiStrip" style="display:flex;gap:0;border-bottom:1px solid #ddd;flex-shrink:0;background:white;"></div>
<!-- Tab Bar -->
<div style="display:flex;border-bottom:2px solid #e0e0e0;flex-shrink:0;background:white;">
<button class="dashTab" id="dashTab1" onclick="switchDashTab(1)" style="flex:1;padding:11px 6px;border:none;background:#1a237e;color:white;font-weight:600;font-size:12px;cursor:pointer;border-radius:0;">📊 District Chart</button>
<button class="dashTab" id="dashTab2" onclick="switchDashTab(2)" style="flex:1;padding:11px 6px;border:none;background:#f5f5f5;color:#555;font-weight:600;font-size:12px;cursor:pointer;border-radius:0;">🥧 Category Split</button>
<button class="dashTab" id="dashTab3" onclick="switchDashTab(3)" style="flex:1;padding:11px 6px;border:none;background:#f5f5f5;color:#555;font-weight:600;font-size:12px;cursor:pointer;border-radius:0;">📈 Monthly Trend</button>
<button class="dashTab" id="dashTab4" onclick="switchDashTab(4)" style="flex:1;padding:11px 6px;border:none;background:#f5f5f5;color:#555;font-weight:600;font-size:12px;cursor:pointer;border-radius:0;">📅 Retirement</button>
</div>
<!-- Content Area -->
<div style="overflow-y:auto;flex:1;padding:16px;background:#f8f9fa;">
<!-- TAB 1: District Bar Chart -->
<div id="dashPane1">
<div style="background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;">
<div style="font-size:13px;font-weight:700;color:#1a237e;margin-bottom:4px;">District-wise Record Count</div>
<div style="font-size:11px;color:#888;margin-bottom:14px;">Deleted records excluded — sorted by count</div>
<div style="position:relative;height:420px;"><canvas id="districtBarChart"></canvas></div>
</div>
</div>
<!-- TAB 2: Category Pie -->
<div id="dashPane2" style="display:none;">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
<div style="background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;">
<div style="font-size:13px;font-weight:700;color:#1a237e;margin-bottom:14px;">Overall Category Split</div>
<div style="position:relative;height:280px;"><canvas id="catPieChart"></canvas></div>
</div>
<div style="background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;">
<div style="font-size:13px;font-weight:700;color:#1a237e;margin-bottom:14px;">Gender Split</div>
<div style="position:relative;height:280px;"><canvas id="genderPieChart"></canvas></div>
</div>
<div style="background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;grid-column:1/-1;">
<div style="font-size:13px;font-weight:700;color:#1a237e;margin-bottom:4px;">Division-wise Category Breakdown</div>
<div style="font-size:11px;color:#888;margin-bottom:14px;">SC / ST / OBC / UR per JD Division</div>
<div style="position:relative;height:260px;"><canvas id="divCatChart"></canvas></div>
</div>
</div>
</div>
<!-- TAB 3: Monthly Trend -->
<div id="dashPane3" style="display:none;">
<div style="background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;">
<div style="font-size:13px;font-weight:700;color:#1a237e;margin-bottom:4px;">Monthly Activity Trend</div>
<div style="font-size:11px;color:#888;margin-bottom:14px;">New entries, updates aur deletions — last 12 months</div>
<div style="position:relative;height:350px;"><canvas id="trendLineChart"></canvas></div>
</div>
<div id="trendNote" style="background:white;border-radius:8px;padding:14px;border:1px solid #e0e0e0;margin-top:14px;font-size:12px;color:#555;"></div>
</div>
<!-- TAB 4: Retirement Calendar -->
<div id="dashPane4" style="display:none;">
<div style="background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;margin-bottom:14px;">
<div style="font-size:13px;font-weight:700;color:#1a237e;margin-bottom:4px;">Retirement Timeline — Next 12 Months</div>
<div style="font-size:11px;color:#888;margin-bottom:14px;">62 saal ki umra par retirement — month-wise breakdown</div>
<div style="position:relative;height:260px;"><canvas id="retBarChart"></canvas></div>
</div>
<div id="retDetailList" style="background:white;border-radius:8px;padding:14px;border:1px solid #e0e0e0;"></div>
</div>
</div>
<!-- Footer -->
<div style="padding:10px 16px;background:white;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
<span style="font-size:11px;color:#aaa;">Data: window.fullData — ${rows.length} total records</span>
<div>
<button onclick="document.getElementById('analyticsModal').remove()" style="background:#c62828;color:white;border:none;padding:7px 16px;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;">✖ Close</button>
</div>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
function buildDashboard() {
_buildKPI(rows);
_buildDistrictBar(rows);
_buildCategoryPie(rows);
_buildTrendLine(rows);
_buildRetirement(rows);
}
if (window.Chart) {
buildDashboard();
} else {
const s = document.createElement('script');
s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
s.onload = buildDashboard;
document.head.appendChild(s);
}
}
function _buildKPI(rows) {
const active   = rows.filter(r => !(r.field28||'').toUpperCase().includes('DELETE'));
const newE     = rows.filter(r => (r.field28||'').toUpperCase().includes('NEW'));
const updated  = rows.filter(r => (r.field28||'').toUpperCase().includes('UPDATED'));
const deleted  = rows.filter(r => (r.field28||'').toUpperCase().includes('DELETE'));
const today = new Date();
const retThisMonth = rows.filter(r => {
const raw = r.field7 || '';
if (!raw || raw === 'NIL') return false;
const p = raw.split('-');
let dob = null;
if (p.length === 3) dob = p[0].length === 4 ? new Date(p[0], p[1]-1, p[2]) : new Date(p[2], p[1]-1, p[0]);
if (!dob || isNaN(dob)) return false;
const ret = new Date(dob.getFullYear()+62, dob.getMonth()+1, 0);
return ret.getFullYear() === today.getFullYear() && ret.getMonth() === today.getMonth();
});
const kpis = [
{ label: 'Total Active', val: active.length, color: '#1565c0', bg: '#e3f2fd' },
{ label: 'New Entries',  val: newE.length,   color: '#2e7d32', bg: '#e8f5e9' },
{ label: 'Updated',      val: updated.length, color: '#e65100', bg: '#fff3e0' },
{ label: 'Deleted',      val: deleted.length, color: '#c62828', bg: '#ffebee' },
{ label: 'Retiring This Month', val: retThisMonth.length, color: '#6a1b9a', bg: '#f3e5f5' },
];
const strip = document.getElementById('kpiStrip');
if (!strip) return;
strip.innerHTML = kpis.map(k => `
<div style="flex:1;padding:12px 10px;text-align:center;border-right:1px solid #eee;background:${k.bg};">
<div style="font-size:22px;font-weight:700;color:${k.color};">${k.val}</div>
<div style="font-size:10px;color:#777;margin-top:2px;">${k.label}</div>
</div>`).join('');
}
function _buildDistrictBar(rows) {
const distCount = {};
rows.forEach(r => {
if ((r.field28||'').toUpperCase().includes('DELETE')) return;
let d = (r.field22||'').toUpperCase().trim().replace(/^DEO\s*/,'').replace(/^JD\s*/,'').trim();
if (!d || d.length < 2) return;
distCount[d] = (distCount[d] || 0) + 1;
});
const sorted = Object.entries(distCount).sort((a,b) => b[1]-a[1]);
const labels = sorted.map(x => x[0]);
const data   = sorted.map(x => x[1]);
const colors = data.map((v, i) => {
const max = data[0] || 1;
const ratio = v / max;
const r = Math.round(21  + ratio * (25  - 21));
const g = Math.round(101 + ratio * (40  - 101));
const b = Math.round(192 + ratio * (78  - 192));
return `rgba(${r},${g},${b},0.85)`;
});
const ctx = document.getElementById('districtBarChart');
if (!ctx) return;
new Chart(ctx, {
type: 'bar',
data: { labels, datasets: [{ label: 'Records', data, backgroundColor: colors, borderRadius: 4, borderSkipped: false }] },
options: {
indexAxis: 'y',
responsive: true, maintainAspectRatio: false,
plugins: {
legend: { display: false },
tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.x} records` } }
},
scales: {
x: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } } },
y: { grid: { display: false }, ticks: { font: { size: 10 } } }
}
}
});
}
function _buildCategoryPie(rows) {
const active = rows.filter(r => !(r.field28||'').toUpperCase().includes('DELETE'));
const catCount = { SC:0, ST:0, OBC:0, UR:0, Other:0 };
active.forEach(r => {
const c = (r.field5||'').toUpperCase().trim();
if (catCount[c] !== undefined) catCount[c]++;
else catCount.Other++;
});
const catCtx = document.getElementById('catPieChart');
if (catCtx) new Chart(catCtx, {
type: 'doughnut',
data: {
labels: Object.keys(catCount).filter(k => catCount[k] > 0),
datasets: [{ data: Object.values(catCount).filter(v => v > 0),
backgroundColor: ['#e53935','#f57c00','#1565c0','#2e7d32','#9e9e9e'],
borderWidth: 2, borderColor: 'white' }]
},
options: { responsive:true, maintainAspectRatio:false,
plugins: { legend: { position:'bottom', labels:{ font:{ size:11 }, padding:10 } },
tooltip: { callbacks: { label: c => ` ${c.label}: ${c.parsed} (${((c.parsed/active.length)*100).toFixed(1)}%)` } }
}
}
});
const genCount = { Male:0, Female:0, Other:0 };
active.forEach(r => {
const g = (r.field6||'').toUpperCase().trim();
if (g === 'MALE' || g === 'M') genCount.Male++;
else if (g === 'FEMALE' || g === 'F') genCount.Female++;
else genCount.Other++;
});
const genCtx = document.getElementById('genderPieChart');
if (genCtx) new Chart(genCtx, {
type: 'doughnut',
data: {
labels: ['Male','Female','Other'].filter(k => genCount[k] > 0),
datasets: [{ data: ['Male','Female','Other'].map(k => genCount[k]).filter(v => v > 0),
backgroundColor: ['#1565c0','#e91e63','#9e9e9e'],
borderWidth: 2, borderColor: 'white' }]
},
options: { responsive:true, maintainAspectRatio:false,
plugins: { legend: { position:'bottom', labels:{ font:{ size:11 }, padding:10 } } }
}
});
const jdStructure = {
'BHOPAL':['BHOPAL','RAISEN','RAJGARH','SEHORE','VIDISHA'],
'GWALIOR':['ASHOKNAGAR','BHIND','DATIA','GUNA','GWALIOR','MORENA','SHEOPUR','SHIVPURI'],
'INDORE':['ALIRAJPUR','BADWANI','BARWANI','BURHANPUR','DHAR','INDORE','JHABUA','KHANDWA','KHARGONE'],
'JABALPUR':['BALAGHAT','CHHINDWARA','JABALPUR','KATNI','MANDLA','NARSINGHPUR','SEONI','DINDORI','PANDHURNA'],
'UJJAIN':['AGAR MALWA','DEWAS','MANDSAUR','NEEMUCH','RATLAM','SHAJAPUR','UJJAIN'],
'SAGAR':['CHHATARPUR','DAMOH','PANNA','SAGAR','TIKAMGARH','NIWARI'],
'REWA':['REWA','SATNA','SIDHI','SINGRAULI','MAUGANJ','MAIHAR'],
'NARMADAPURAM':['BETUL','HARDA','NARMADAPURAM'],
'SHAHDOL':['ANUPPUR','SHAHDOL','UMARIA']
};
const cats = ['SC','ST','OBC','UR'];
const jdCat = {};
Object.keys(jdStructure).forEach(j => { jdCat[j] = {SC:0,ST:0,OBC:0,UR:0}; });
active.forEach(r => {
const dist = (r.field22||'').toUpperCase().replace(/^DEO\s*/,'').replace(/^JD\s*/,'').trim();
const cat  = (r.field5||'').toUpperCase().trim();
if (!cats.includes(cat)) return;
for (const [j, ds] of Object.entries(jdStructure)) {
if (ds.some(d => dist === d || dist.includes(d) || d.includes(dist))) { jdCat[j][cat]++; break; }
}
});
const jdLabels = Object.keys(jdCat);
const divCtx = document.getElementById('divCatChart');
if (divCtx) new Chart(divCtx, {
type: 'bar',
data: {
labels: jdLabels,
datasets: [
{ label:'SC',  data: jdLabels.map(j=>jdCat[j].SC),  backgroundColor:'#e53935', borderRadius:2 },
{ label:'ST',  data: jdLabels.map(j=>jdCat[j].ST),  backgroundColor:'#f57c00', borderRadius:2 },
{ label:'OBC', data: jdLabels.map(j=>jdCat[j].OBC), backgroundColor:'#1565c0', borderRadius:2 },
{ label:'UR',  data: jdLabels.map(j=>jdCat[j].UR),  backgroundColor:'#2e7d32', borderRadius:2 },
]
},
options: {
responsive:true, maintainAspectRatio:false,
plugins: { legend:{ position:'top', labels:{ font:{ size:11 } } } },
scales: {
x: { stacked:true, grid:{ display:false }, ticks:{ font:{ size:10 } } },
y: { stacked:true, grid:{ color:'#f0f0f0' } }
}
}
});
}
function _buildTrendLine(rows) {
const today = new Date();
const months = [];
const monthLabels = [];
const mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
for (let i = 11; i >= 0; i--) {
const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
months.push(d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0'));
monthLabels.push(mNames[d.getMonth()] + "'" + String(d.getFullYear()).slice(2));
}
const newData=months.map(()=>0), updData=months.map(()=>0), delData=months.map(()=>0);
rows.forEach(r => {
const trail = (r.field29 || r.auditTrail || '').trim();
const dateMatch = trail.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
if (!dateMatch) return;
const [, dd, mm, yyyy] = dateMatch;
const key = yyyy + '-' + mm.padStart(2,'0');
const idx = months.indexOf(key);
if (idx === -1) return;
const st = (r.field28||'').toUpperCase();
if (st.includes('DELETE')) delData[idx]++;
else if (st.includes('NEW')) newData[idx]++;
else if (st.includes('UPDATED')) updData[idx]++;
});
const totalThisYear = newData.reduce((a,b)=>a+b,0) + updData.reduce((a,b)=>a+b,0);
const ctx = document.getElementById('trendLineChart');
if (ctx) new Chart(ctx, {
type: 'line',
data: {
labels: monthLabels,
datasets: [
{ label:'New Entries', data:newData, borderColor:'#2e7d32', backgroundColor:'rgba(46,125,50,0.08)', tension:0.4, fill:true, pointRadius:4, pointHoverRadius:6 },
{ label:'Updated',     data:updData, borderColor:'#1565c0', backgroundColor:'rgba(21,101,192,0.08)', tension:0.4, fill:true, pointRadius:4, pointHoverRadius:6 },
{ label:'Deleted',     data:delData, borderColor:'#c62828', backgroundColor:'rgba(198,40,40,0.06)', tension:0.4, fill:true, pointRadius:4, pointHoverRadius:6 },
]
},
options: {
responsive:true, maintainAspectRatio:false,
interaction: { mode:'index', intersect:false },
plugins: { legend:{ position:'top', labels:{ font:{ size:11 } } } },
scales: {
x: { grid:{ color:'#f0f0f0' }, ticks:{ font:{ size:10 } } },
y: { grid:{ color:'#f0f0f0' }, ticks:{ font:{ size:11 }, stepSize:1 } }
}
}
});
const note = document.getElementById('trendNote');
if (note) note.innerHTML = `<b>📌 Note:</b> Trend audit trail field se parse kiya gaya hai (<code>field29</code>). Agar dates wahan store nahi hain to all zeros dikhenge — tab field29 mein timestamp save karna hoga.`;
}
function _buildRetirement(rows) {
const today = new Date();
const mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const buckets = {}, bucketPeople = {};
for (let i = 0; i < 12; i++) {
const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
buckets[key] = 0;
bucketPeople[key] = [];
}
rows.forEach(r => {
if ((r.field28||'').toUpperCase().includes('DELETE')) return;
const raw = r.field7 || '';
if (!raw || raw === 'NIL') return;
const p = raw.split('-');
let dob = null;
if (p.length === 3) dob = p[0].length === 4 ? new Date(p[0], p[1]-1, p[2]) : new Date(p[2], p[1]-1, p[0]);
if (!dob || isNaN(dob)) return;
const ret = new Date(dob.getFullYear()+62, dob.getMonth()+1, 0);
if (ret < today) return;
const key = ret.getFullYear() + '-' + String(ret.getMonth()+1).padStart(2,'0');
if (buckets[key] !== undefined) {
buckets[key]++;
bucketPeople[key].push({ name: r.field4||'—', district: (r.field22||'—').replace(/^DEO\s*/i,''), retDate: ret.toLocaleDateString('en-IN') });
}
});
const labels = Object.keys(buckets).map(k => { const [y,m]=k.split('-'); return mNames[+m-1]+"'"+y.slice(2); });
const data   = Object.values(buckets);
const bgColors = data.map(v => v === 0 ? '#e0e0e0' : v >= 5 ? '#c62828' : v >= 3 ? '#f57c00' : '#2e7d32');
const ctx = document.getElementById('retBarChart');
if (ctx) new Chart(ctx, {
type: 'bar',
data: { labels, datasets: [{ label:'Retirements', data, backgroundColor: bgColors, borderRadius:4, borderSkipped:false }] },
options: {
responsive:true, maintainAspectRatio:false,
plugins: {
legend:{ display:false },
tooltip:{ callbacks:{ label: c => ` ${c.parsed.y} retiring` } }
},
scales: {
x: { grid:{ display:false }, ticks:{ font:{ size:10 } } },
y: { grid:{ color:'#f0f0f0' }, ticks:{ stepSize:1, font:{ size:11 } } }
},
onClick: (evt, elements) => {
if (!elements.length) return;
const key = Object.keys(buckets)[elements[0].index];
_showRetDetail(key, bucketPeople[key]);
}
}
});
const firstKey = Object.keys(bucketPeople).find(k => bucketPeople[k].length > 0) || Object.keys(bucketPeople)[0];
_showRetDetail(firstKey, bucketPeople[firstKey]);
window._retBucketPeople = bucketPeople;
}
function _showRetDetail(key, people) {
const mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const [yr, mo] = key.split('-');
const label = mNames[+mo-1] + ' ' + yr;
const el = document.getElementById('retDetailList');
if (!el) return;
if (!people || people.length === 0) {
el.innerHTML = `<div style="color:#aaa;font-size:12px;padding:10px;">📅 ${label} — koi retirement nahi hai</div>`; return;
}
el.innerHTML = `
<div style="font-size:13px;font-weight:700;color:#c62828;margin-bottom:10px;">📅 ${label} — ${people.length} retiring</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;">
${people.map(p => `
<div style="background:#fff8f8;border:1px solid #ffcdd2;border-radius:6px;padding:8px 10px;">
<div style="font-size:12px;font-weight:600;color:#333;">👤 ${p.name}</div>
<div style="font-size:11px;color:#666;margin-top:2px;">📍 ${p.district}</div>
<div style="font-size:11px;color:#c62828;margin-top:2px;">🗓️ ${p.retDate}</div>
</div>`).join('')}
</div>`;
}
function switchDashTab(num) {
[1,2,3,4].forEach(i => {
const pane = document.getElementById('dashPane'+i);
const btn  = document.getElementById('dashTab'+i);
if (!pane || !btn) return;
pane.style.display = i === num ? 'block' : 'none';
btn.style.background = i === num ? '#1a237e' : '#f5f5f5';
btn.style.color      = i === num ? 'white'   : '#555';
});
}
function switchTab(num) {
[1,2,3,4].forEach(i => {
const t = document.getElementById('analyticsTab'+i);
const b = document.getElementById('tabBtn'+i);
if (t) t.style.display = i===num?'block':'none';
if (b) { b.style.background=i===num?'#e65100':'#f5f5f5'; b.style.color=i===num?'white':'#555'; }
});
}


// ═══════════════════════════════════════
// JS Block 9
// ═══════════════════════════════════════

window.recentRecords = JSON.parse(localStorage.getItem('ux_recentRecords') || '[]');
function addToRecent(uniqueId, name, district) {
if (!uniqueId) return;
window.recentRecords = window.recentRecords.filter(r => r.id !== uniqueId);
window.recentRecords.unshift({ id: uniqueId, name: name || '—', district: district || '—', time: new Date().toLocaleTimeString('en-IN') });
if (window.recentRecords.length > 10) window.recentRecords = window.recentRecords.slice(0, 10);
localStorage.setItem('ux_recentRecords', JSON.stringify(window.recentRecords));
if (document.getElementById('recentPanel') && document.getElementById('recentPanel').style.display !== 'none') {
renderRecentList();
}
}
function renderRecentList() {
const list = document.getElementById('recentList');
if (!list) return;
if (window.recentRecords.length === 0) {
list.innerHTML = '<div style="color:#aaa;font-size:11px;text-align:center;padding:15px;">No records viewed yet</div>';
return;
}
list.innerHTML = window.recentRecords.map((r, i) => `
<div onclick="jumpToRecord('${r.id}')" style="padding:7px 10px;border-bottom:1px solid #f0f0f0;cursor:pointer;transition:background 0.15s;"
onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='white'">
<div style="font-size:12px;font-weight:bold;color:#002e5b;">#${r.id} &nbsp; ${r.name}</div>
<div style="font-size:10px;color:#888;">📍 ${r.district} &nbsp;|&nbsp; 🕐 ${r.time}</div>
</div>`).join('');
}
function jumpToRecord(uniqueId) {
const searchBox = document.getElementById('searchVal');
if (searchBox) {
searchBox.value = uniqueId;
performSearch();
}
closeRecentPanel();
}
function toggleRecentPanel() {
const panel = document.getElementById('recentPanel');
if (!panel) return;
const isOpen = panel.style.display !== 'none';
panel.style.display = isOpen ? 'none' : 'block';
if (!isOpen) renderRecentList();
}
function closeRecentPanel() {
const panel = document.getElementById('recentPanel');
if (panel) panel.style.display = 'none';
}
const _origSelectRow = window.selectRow;
if (typeof selectRow === 'function') {
const __orig = selectRow;
selectRow = function(el) {
__orig(el);
try {
const uid  = el.cells[2]?.innerText?.trim() || '';
const name = el.cells[3]?.innerText?.trim() || '';
const dist = el.cells[21]?.innerText?.trim() || '';
addToRecent(uid, name, dist);
} catch(e) {}
};
}
document.addEventListener('keydown', function(e) {
const tag = document.activeElement?.tagName?.toLowerCase();
const isTyping = ['input','textarea','select'].includes(tag);
if (e.ctrlKey && e.key.toLowerCase() === 'n') {
e.preventDefault();
const overlay = document.getElementById('formOverlay');
if (overlay) { overlay.style.display = 'block'; }
showShortcutToast('Ctrl+N → Form Opened');
return;
}
if (e.ctrlKey && e.key.toLowerCase() === 's') {
e.preventDefault();
const formVisible = document.getElementById('formOverlay')?.style.display === 'block';
if (formVisible) {
if (typeof saveEntry === 'function') saveEntry(true);
showShortcutToast('Ctrl+S → Saved');
}
return;
}
if (e.ctrlKey && e.key.toLowerCase() === 'f') {
e.preventDefault();
const sb = document.getElementById('searchVal');
if (sb) { sb.focus(); sb.select(); }
showShortcutToast('Ctrl+F → Search focused');
return;
}
if (e.key === 'Escape' && !isTyping) {
const formOverlay = document.getElementById('formOverlay');
if (formOverlay?.style.display === 'block') {
formOverlay.style.display = 'none';
showShortcutToast('Esc → Form Closed');
return;
}
if (document.getElementById('analyticsModal')) {
document.getElementById('analyticsModal').remove();
return;
}
if (document.getElementById('summaryModal')) {
document.getElementById('summaryModal').remove();
return;
}
closeRecentPanel();
return;
}
if (e.ctrlKey && e.key.toLowerCase() === 'r') {
e.preventDefault();
toggleRecentPanel();
showShortcutToast('Ctrl+R → Recent Records');
return;
}
if (e.key === '?' && !isTyping) {
showShortcutsHelp();
return;
}
});
// ── UMS Toast Notification System ──
function umsToast(msg, type = 'info', duration = 3500) {
const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
const container = document.getElementById('ums-toast-container') || (() => {
const c = document.createElement('div'); c.id = 'ums-toast-container'; document.body.appendChild(c); return c;
})();
const toast = document.createElement('div');
toast.className = `ums-toast ums-toast-${type}`;
toast.innerHTML = `<span class="ums-toast-icon">${icons[type]||icons.info}</span><span>${msg}</span>`;
container.appendChild(toast);
const hide = () => {
toast.classList.add('hide');
setTimeout(() => toast.remove(), 320);
};
const timer = setTimeout(hide, duration);
toast.addEventListener('click', () => { clearTimeout(timer); hide(); });
}
function showShortcutToast(msg) {
let t = document.getElementById('shortcutToast');
if (!t) {
t = document.createElement('div');
t.id = 'shortcutToast';
t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#002e5b;color:white;padding:8px 18px;border-radius:20px;font-size:12px;font-weight:bold;z-index:99999;transition:opacity 0.4s;pointer-events:none;';
document.body.appendChild(t);
}
t.innerText = msg;
t.style.opacity = '1';
clearTimeout(t._timer);
t._timer = setTimeout(() => { t.style.opacity = '0'; }, 1800);
}
function showShortcutsHelp() {
if (document.getElementById('shortcutsHelp')) { document.getElementById('shortcutsHelp').remove(); return; }
const div = document.createElement('div');
div.id = 'shortcutsHelp';
div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:10px;padding:20px 25px;z-index:99999;box-shadow:0 10px 30px rgba(0,0,0,0.4);min-width:300px;font-family:sans-serif;';
div.innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:2px solid #002e5b;padding-bottom:8px;">
<b style="color:#002e5b;font-size:15px;">⌨️ Keyboard Shortcuts</b>
<button onclick="this.closest('#shortcutsHelp').remove()" style="background:#c62828;color:white;border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-weight:bold;">✕</button>
</div>
${[
['Ctrl + N', 'Form खोलें (New Entry)'],
['Ctrl + S', 'Save / Add Record'],
['Ctrl + F', 'Search Box Focus'],
['Ctrl + R', 'Recent Records Panel'],
['Escape',   'Form / Modal बंद करें'],
['?',        'यह Help दिखाएं'],
].map(([k,v]) => `
<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">
<kbd style="background:#f0f0f0;border:1px solid #ccc;padding:2px 8px;border-radius:4px;font-family:monospace;font-weight:bold;">${k}</kbd>
<span style="color:#555;">${v}</span>
</div>`).join('')}
<div style="margin-top:12px;font-size:10px;color:#aaa;text-align:center;">Press '?' anywhere to toggle this panel</div>`;
document.body.appendChild(div);
div.addEventListener('click', e => e.stopPropagation());
setTimeout(() => document.addEventListener('click', function _c() { div.remove(); document.removeEventListener('click',_c); }), 100);
}
document.addEventListener('DOMContentLoaded', function() {
const recentBtn = document.createElement('div');
recentBtn.id = 'recentBtn';
recentBtn.onclick = toggleRecentPanel;
recentBtn.title = 'Recent Records (Ctrl+R)';
recentBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#002e5b;color:white;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;z-index:9990;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:transform 0.2s;';
recentBtn.innerHTML = '🕐';
recentBtn.onmouseover = () => recentBtn.style.transform = 'scale(1.1)';
recentBtn.onmouseout  = () => recentBtn.style.transform = 'scale(1)';
document.body.appendChild(recentBtn);
const recentPanel = document.createElement('div');
recentPanel.id = 'recentPanel';
recentPanel.style.cssText = 'display:none;position:fixed;bottom:78px;right:20px;width:300px;max-height:380px;background:white;border-radius:10px;box-shadow:0 8px 25px rgba(0,0,0,0.3);z-index:9989;overflow:hidden;font-family:sans-serif;';
recentPanel.innerHTML = `
<div style="background:#002e5b;color:white;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">
<b style="font-size:13px;">🕐 Recent Records</b>
<button onclick="closeRecentPanel()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:22px;height:22px;border-radius:50%;cursor:pointer;font-size:12px;">✕</button>
</div>
<div id="recentList" style="overflow-y:auto;max-height:320px;"></div>`;
document.body.appendChild(recentPanel);
});


// ═══════════════════════════════════════
// JS Block 10
// ═══════════════════════════════════════

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const WARN_BEFORE_MS     =  2 * 60 * 1000;
let _sessionTimer = null;
let _sessionWarnTimer = null;
let _sessionWarnShown = false;
function securityResetTimer() {
securityClearTimer();
_sessionWarnShown = false;
_sessionWarnTimer = setTimeout(() => {
if (!window.currentUser) return;
_sessionWarnShown = true;
showSessionWarning();
}, SESSION_TIMEOUT_MS - WARN_BEFORE_MS);
_sessionTimer = setTimeout(() => {
if (!window.currentUser) return;
auditLog('SESSION_TIMEOUT', 'Auto-logout after 30 min inactivity');
forceLogout();
}, SESSION_TIMEOUT_MS);
}
function securityClearTimer() {
clearTimeout(_sessionTimer);
clearTimeout(_sessionWarnTimer);
_sessionTimer = null;
_sessionWarnTimer = null;
const w = document.getElementById('sessionWarnBanner');
if (w) w.remove();
}
function showSessionWarning() {
if (document.getElementById('sessionWarnBanner')) return;
const banner = document.createElement('div');
banner.id = 'sessionWarnBanner';
banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#e65100;color:white;text-align:center;padding:10px;z-index:999999;font-weight:bold;font-size:13px;display:flex;align-items:center;justify-content:center;gap:15px;';
banner.innerHTML = `
⚠️ Session 2 मिनट में समाप्त होगा! Inactivity के कारण auto-logout होगा।
<button onclick="securityResetTimer();document.getElementById('sessionWarnBanner').remove();_sessionWarnShown=false;"
style="background:white;color:#e65100;border:none;padding:5px 14px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:12px;">
✅ Active रहें
</button>`;
document.body.appendChild(banner);
}
function forceLogout() {
securityClearTimer();
window.currentUser = null;
localStorage.removeItem('isLoggedIn');
document.getElementById('userField').value = '';
document.getElementById('passField').value = '';
const loginOverlay = document.getElementById('loginOverlay');
if (loginOverlay) loginOverlay.style.display = 'flex';
const errorDiv = document.getElementById('loginError');
if (errorDiv) errorDiv.innerText = '⏱️ You have been logged out due to session timeout. Please login again.';
}
['mousemove','keydown','click','scroll','touchstart'].forEach(evt => {
document.addEventListener(evt, () => {
if (window.currentUser) securityResetTimer();
}, { passive: true });
});
const AUDIT_KEY = 'auditLog_ms_erp';
function auditLog(action, detail) {
if (!window.currentUser && action !== 'LOGIN') return;
const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
logs.unshift({
user:   window.currentUser || 'UNKNOWN',
action: action,
detail: detail || '',
time:   new Date().toLocaleString('en-IN'),
ts:     Date.now()
});
if (logs.length > 500) logs.length = 500;
localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
}
const _origSaveEntry = window.saveEntry;
if (typeof saveEntry === 'function') {
const __s = saveEntry;
saveEntry = function(isNew) {
const uid = document.getElementById('in3')?.value || '';
auditLog(isNew ? 'NEW_ENTRY' : 'UPDATE', 'Unique ID: ' + uid);
return __s(isNew);
};
}
const _origDeleteEntry = window.deleteEntry;
if (typeof deleteEntry === 'function') {
const __d = deleteEntry;
deleteEntry = function() {
const uid = document.getElementById('in3')?.value || (window.selectedRowElement?.cells[2]?.innerText || '');
auditLog('DELETE', 'Unique ID: ' + uid);
return __d();
};
}
function showAuditTrail() {
const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
if (document.getElementById('auditModal')) document.getElementById('auditModal').remove();
const modal = document.createElement('div');
modal.id = 'auditModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);z-index:10003;display:flex;align-items:center;justify-content:center;';
const actionColors = {
LOGIN:          '#2e7d32',
LOGOUT:         '#555',
SESSION_TIMEOUT:'#e65100',
NEW_ENTRY:      '#1565c0',
UPDATE:         '#f57c00',
DELETE:         '#c62828',
};
const rows = logs.map(l => `
<tr onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
<td style="padding:5px 10px;border:1px solid #eee;font-size:11px;color:#555;white-space:nowrap;">${l.time}</td>
<td style="padding:5px 10px;border:1px solid #eee;font-weight:bold;font-size:11px;color:#002e5b;">${l.user}</td>
<td style="padding:5px 10px;border:1px solid #eee;text-align:center;">
<span style="background:${actionColors[l.action]||'#777'};color:white;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:bold;">${l.action}</span>
</td>
<td style="padding:5px 10px;border:1px solid #eee;font-size:11px;color:#444;">${l.detail}</td>
</tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:#aaa;padding:20px;">No audit logs yet</td></tr>';
modal.innerHTML = `
<div style="background:white;border-radius:10px;width:92%;max-width:850px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 15px 40px rgba(0,0,0,0.4);">
<div style="background:linear-gradient(90deg,#1a237e,#283593);color:white;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
<div>
<b style="font-size:15px;">📋 Audit Trail</b>
<span style="font-size:11px;opacity:0.8;margin-left:12px;">${logs.length} events recorded</span>
</div>
<div style="display:flex;gap:8px;align-items:center;">
<button onclick="clearAuditLog()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:11px;">🗑️ Clear Log</button>
<button onclick="exportAuditCSV()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:11px;">⬇️ Export CSV</button>
<button onclick="document.getElementById('auditModal').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;">✕</button>
</div>
</div>
<!-- Filter bar -->
<div style="padding:8px 16px;background:#f8f9fa;border-bottom:1px solid #eee;display:flex;gap:10px;align-items:center;flex-shrink:0;flex-wrap:wrap;">
<input id="auditFilterUser" oninput="filterAuditTable()" style="padding:5px 10px;border:1px solid #ddd;border-radius:4px;font-size:11px;width:140px;">
<select id="auditFilterAction" onchange="filterAuditTable()" style="padding:5px 8px;border:1px solid #ddd;border-radius:4px;font-size:11px;">
<option value="">All Actions</option>
<option>LOGIN</option><option>LOGOUT</option>
<option>NEW_ENTRY</option><option>UPDATE</option>
<option>DELETE</option><option>SESSION_TIMEOUT</option>
</select>
<span style="font-size:11px;color:#888;" id="auditCount">${logs.length} records</span>
</div>
<div style="overflow-y:auto;flex:1;">
<table id="auditTable" style="width:100%;border-collapse:collapse;">
<thead style="background:#f5f5f5;position:sticky;top:0;">
<tr>
<th style="padding:7px 10px;border:1px solid #ddd;font-size:11px;text-align:left;">Date & Time</th>
<th style="padding:7px 10px;border:1px solid #ddd;font-size:11px;">User</th>
<th style="padding:7px 10px;border:1px solid #ddd;font-size:11px;">Action</th>
<th style="padding:7px 10px;border:1px solid #ddd;font-size:11px;text-align:left;">Detail</th>
</tr>
</thead>
<tbody id="auditBody">${rows}</tbody>
</table>
</div>
<div style="padding:10px 16px;background:#f5f5f5;border-top:1px solid #eee;text-align:right;flex-shrink:0;">
<button onclick="document.getElementById('auditModal').remove()" style="background:#c62828;color:white;border:none;padding:7px 18px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:12px;">✖ Close</button>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}
function filterAuditTable() {
const userF   = document.getElementById('auditFilterUser')?.value.toUpperCase() || '';
const actionF = document.getElementById('auditFilterAction')?.value || '';
const logs    = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
const filtered = logs.filter(l => {
const matchUser   = !userF   || l.user.includes(userF);
const matchAction = !actionF || l.action === actionF;
return matchUser && matchAction;
});
const actionColors = { LOGIN:'#2e7d32',LOGOUT:'#555',SESSION_TIMEOUT:'#e65100',NEW_ENTRY:'#1565c0',UPDATE:'#f57c00',DELETE:'#c62828' };
const body = document.getElementById('auditBody');
if (body) body.innerHTML = filtered.map(l => `
<tr onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
<td style="padding:5px 10px;border:1px solid #eee;font-size:11px;color:#555;white-space:nowrap;">${l.time}</td>
<td style="padding:5px 10px;border:1px solid #eee;font-weight:bold;font-size:11px;color:#002e5b;">${l.user}</td>
<td style="padding:5px 10px;border:1px solid #eee;text-align:center;">
<span style="background:${actionColors[l.action]||'#777'};color:white;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:bold;">${l.action}</span>
</td>
<td style="padding:5px 10px;border:1px solid #eee;font-size:11px;color:#444;">${l.detail}</td>
</tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:#aaa;padding:15px;">No matching records</td></tr>';
const countEl = document.getElementById('auditCount');
if (countEl) countEl.innerText = filtered.length + ' records';
}
function clearAuditLog() {
if (!confirm('Are you sure you want to delete the entire audit log?')) return;
localStorage.removeItem(AUDIT_KEY);
document.getElementById('auditModal')?.remove();
myAlert('✅ Audit log cleared.');
}
function exportAuditCSV() {
const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
if (!logs.length) { myAlert('No logs to export.'); return; }
let csv = 'Date & Time,User,Action,Detail\n';
logs.forEach(l => {
csv += `"${l.time}","${l.user}","${l.action}","${l.detail}"\n`;
});
const blob = new Blob([csv], { type: 'text/csv' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'AuditLog_MS_ERP_' + new Date().toLocaleDateString('en-IN').replace(/\//g, '-') + '.csv';
a.click();
}
document.addEventListener('DOMContentLoaded', function() {
});
setInterval(() => {
if (!window.currentUser || !_sessionTimer) return;
let badge = document.getElementById('sessionTimerBadge');
if (!badge) {
badge = document.createElement('div');
badge.id = 'sessionTimerBadge';
badge.style.cssText = 'position:fixed;top:8px;right:8px;background:#002e5b;color:white;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:bold;z-index:9988;opacity:0.85;pointer-events:none;';
document.body.appendChild(badge);
}
const remaining = Math.max(0, SESSION_TIMEOUT_MS - (Date.now() - (_sessionStartTs || Date.now())));
const mins = Math.floor(remaining / 60000);
const secs = Math.floor((remaining % 60000) / 1000);
badge.innerText = `⏱️ ${mins}:${String(secs).padStart(2,'0')}`;
badge.style.background = mins < 3 ? '#c62828' : '#002e5b';
}, 1000);
const _origSecurityResetTimer = securityResetTimer;
securityResetTimer = function() {
_sessionStartTs = Date.now();
_origSecurityResetTimer();
};
let _sessionStartTs = Date.now();


// ═══════════════════════════════════════
// JS Block 11
// ═══════════════════════════════════════

const CUSTOM_PASS_KEY = 'msErp_customPasswords';
function getEffectivePassword(user) {
const custom = JSON.parse(localStorage.getItem(CUSTOM_PASS_KEY) || '{}');
return custom[user] || districtCredentials[user] || null;
}
// [old checkLogin override removed - using cloud sync version]
window._otpStore = {};
function generateOTP() {
return String(Math.floor(100000 + Math.random() * 900000));
}
function openChangePassword() {
if (document.getElementById('changePwModal')) document.getElementById('changePwModal').remove();
const modal = document.createElement('div');
modal.id = 'changePwModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:10005;display:flex;align-items:center;justify-content:center;';
modal.innerHTML = `
<div style="background:white;border-radius:10px;width:90%;max-width:400px;box-shadow:0 15px 40px rgba(0,0,0,0.5);overflow:hidden;font-family:sans-serif;">
<!-- Header -->
<div style="background:linear-gradient(90deg,#0d47a1,#1565c0);color:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
<b style="font-size:15px;">🔑 Password Change (OTP)</b>
<button onclick="document.getElementById('changePwModal').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px;font-weight:bold;">✕</button>
</div>
<!-- Step 1: Enter User ID & Generate OTP -->
<div id="otpStep1" style="padding:24px;">
<p style="font-size:12px;color:#666;margin:0 0 16px 0;">अपना User ID डालें और OTP Generate करें।</p>
<label style="font-size:11px;font-weight:bold;color:#333;">USER ID</label>
<input id="otpUserId" type="text"
style="width:100%;padding:10px;margin:6px 0 14px 0;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;text-transform:uppercase;font-size:13px;">
<button onclick="generateAndShowOTP()"
style="width:100%;padding:11px;background:#0d47a1;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px;">
📲 Generate OTP
</button>
<div id="otpGenMsg" style="margin-top:10px;font-size:12px;text-align:center;"></div>
</div>
<!-- Step 2: Enter OTP -->
<div id="otpStep2" style="padding:24px;display:none;">
<div style="background:#e3f2fd;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:#1565c0;">
📲 OTP generate ho gaya hai। DPI Admin se OTP lekar neeche darj karein।<br>
<span style="font-size:10px;color:#888;">(OTP 10 minutes mein expire ho jayega)</span>
</div>
<!-- DPI Panel: show OTP only if DPI is logged in OR no one is logged in during setup -->
<div id="dpiOtpReveal" style="display:none;background:#fff3e0;border:1px solid #ff9800;border-radius:6px;padding:10px;margin-bottom:14px;text-align:center;">
<div style="font-size:11px;color:#e65100;font-weight:bold;margin-bottom:4px;">🔐 DPI Admin OTP View</div>
<div id="otpDisplayValue" style="font-size:28px;font-weight:bold;letter-spacing:8px;color:#0d47a1;"></div>
<div style="font-size:10px;color:#888;margin-top:4px;" id="otpExpireTime"></div>
</div>
<label style="font-size:11px;font-weight:bold;color:#333;">OTP ENTER करें</label>
<input id="otpInputVal" type="text" maxlength="6"
style="width:100%;padding:10px;margin:6px 0 14px 0;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:18px;text-align:center;letter-spacing:6px;font-weight:bold;">
<button onclick="verifyOTP()"
style="width:100%;padding:11px;background:#2e7d32;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px;">
✅ OTP Verify करें
</button>
<button onclick="showStep(1)" style="width:100%;padding:8px;background:white;color:#555;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:12px;margin-top:8px;">← वापस जाएं</button>
<div id="otpVerifyMsg" style="margin-top:10px;font-size:12px;text-align:center;"></div>
</div>
<!-- Step 3: Set New Password -->
<div id="otpStep3" style="padding:24px;display:none;">
<div style="background:#e8f5e9;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:#2e7d32;font-weight:bold;">
✅ OTP Verified! अब नया Password सेट करें।
</div>
<label style="font-size:11px;font-weight:bold;color:#333;">नया PASSWORD</label>
<input id="newPassVal" type="password"
style="width:100%;padding:10px;margin:6px 0 14px 0;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:13px;">
<label style="font-size:11px;font-weight:bold;color:#333;">PASSWORD CONFIRM करें</label>
<input id="confirmPassVal" type="password"
style="width:100%;padding:10px;margin:6px 0 16px 0;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:13px;">
<!-- Password strength bar -->
<div style="margin-bottom:12px;">
<div style="background:#eee;border-radius:4px;height:6px;overflow:hidden;">
<div id="pwStrengthBar" style="height:100%;width:0%;border-radius:4px;transition:width 0.3s,background 0.3s;"></div>
</div>
<div id="pwStrengthLabel" style="font-size:10px;color:#888;margin-top:3px;"></div>
</div>
<button onclick="saveNewPassword()"
style="width:100%;padding:11px;background:#0d47a1;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px;">
💾 Password Save करें
</button>
<div id="pwSaveMsg" style="margin-top:10px;font-size:12px;text-align:center;"></div>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
setTimeout(() => {
const np = document.getElementById('newPassVal');
if (np) np.addEventListener('input', updatePwStrength);
}, 100);
}
function showStep(n) {
[1,2,3].forEach(i => {
const el = document.getElementById('otpStep' + i);
if (el) el.style.display = i === n ? 'block' : 'none';
});
}
function generateAndShowOTP() {
const userId = document.getElementById('otpUserId').value.trim().toUpperCase();
const msg = document.getElementById('otpGenMsg');
if (!userId) { msg.innerHTML = '<span style="color:red;">❌ Please enter User ID.</span>'; return; }
if (!districtCredentials[userId]) { msg.innerHTML = '<span style="color:red;">❌ This User ID does not exist.</span>'; return; }
if (userId === 'DPI') {
msg.innerHTML = '<span style="color:red;">⛔ DPI password cannot be reset this way.</span>';
return;
}
if (window.currentUser && window.currentUser !== 'DPI' && window.currentUser !== userId) {
msg.innerHTML = '<span style="color:red;">⛔ You can only reset your own password.</span>';
return;
}
const otp = generateOTP();
const expiry = Date.now() + 10 * 60 * 1000;
window._otpStore[userId] = { otp, expiry };
auditLog('OTP_GENERATED', 'Password change OTP generated for: ' + userId);
showStep(2);
const revealDiv = document.getElementById('dpiOtpReveal');
const otpDisplay = document.getElementById('otpDisplayValue');
const expireLabel = document.getElementById('otpExpireTime');
const isOwnReset = window.currentUser && window.currentUser === userId;
const isDPI = window.currentUser === 'DPI';
if (isDPI || isOwnReset) {
revealDiv.style.display = 'block';
otpDisplay.innerText = otp;
expireLabel.innerText = '⏱️ Expires at: ' + new Date(expiry).toLocaleTimeString('en-IN');
revealDiv.querySelector('div').innerText = isDPI ? '🔐 DPI Admin OTP View' : '🔐 Your OTP';
} else {
revealDiv.style.display = 'none';
}
document.getElementById('otpUserId')._resolvedUser = userId;
}
function verifyOTP() {
const enteredOTP = document.getElementById('otpInputVal').value.trim();
const userId = document.getElementById('otpUserId')._resolvedUser ||
document.getElementById('otpUserId').value.trim().toUpperCase();
const msg = document.getElementById('otpVerifyMsg');
const stored = window._otpStore[userId];
if (!stored) { msg.innerHTML = '<span style="color:red;">❌ OTP not generated. Please generate first.</span>'; return; }
if (Date.now() > stored.expiry) {
msg.innerHTML = '<span style="color:red;">⏱️ OTP expired. Please generate again.</span>';
delete window._otpStore[userId];
return;
}
if (enteredOTP !== stored.otp) {
msg.innerHTML = '<span style="color:red;">❌ Incorrect OTP. Please try again.</span>';
return;
}
delete window._otpStore[userId];
auditLog('OTP_VERIFIED', 'OTP verified for: ' + userId);
showStep(3);
document.getElementById('newPassVal').dataset.userId = userId;
}
function updatePwStrength() {
const val = document.getElementById('newPassVal').value;
const bar = document.getElementById('pwStrengthBar');
const label = document.getElementById('pwStrengthLabel');
let score = 0;
if (val.length >= 6)  score++;
if (val.length >= 8)  score++;
if (/[A-Z]/.test(val)) score++;
if (/[0-9]/.test(val)) score++;
if (/[^A-Za-z0-9]/.test(val)) score++;
const levels = [
{ w:'0%',   bg:'#eee',    t:'' },
{ w:'20%',  bg:'#e53935', t:'बहुत कमज़ोर' },
{ w:'40%',  bg:'#f57c00', t:'कमज़ोर' },
{ w:'60%',  bg:'#fbc02d', t:'ठीक है' },
{ w:'80%',  bg:'#7cb342', t:'अच्छा' },
{ w:'100%', bg:'#2e7d32', t:'बहुत मज़बूत ✅' },
];
const lvl = levels[score] || levels[0];
bar.style.width = lvl.w;
bar.style.background = lvl.bg;
label.innerText = lvl.t;
label.style.color = lvl.bg;
}
function saveNewPassword() {
const newPass    = document.getElementById('newPassVal').value;
const confirmPass = document.getElementById('confirmPassVal').value;
const userId     = document.getElementById('newPassVal').dataset.userId;
const msg        = document.getElementById('pwSaveMsg');
if (!newPass || newPass.length < 4) {
msg.innerHTML = '<span style="color:red;">❌ Password must be at least 4 characters.</span>';
return;
}
if (newPass !== confirmPass) {
msg.innerHTML = '<span style="color:red;">❌ Passwords do not match.</span>';
return;
}
const custom = JSON.parse(localStorage.getItem(CUSTOM_PASS_KEY) || '{}');
const oldPass = custom[userId] || districtCredentials[userId] || '(default)';
custom[userId] = newPass;
localStorage.setItem(CUSTOM_PASS_KEY, JSON.stringify(custom));
auditLog('PASSWORD_CHANGED', 'Password changed for: ' + userId);
_sbLogPwReset(userId, oldPass, newPass, window.currentUser || 'SELF');
msg.innerHTML = '<span style="color:#2e7d32;font-weight:bold;">✅ Password changed successfully!</span>';
setTimeout(() => {
document.getElementById('changePwModal')?.remove();
const uf = document.getElementById('userField');
if (uf) uf.value = userId;
}, 1800);
}
async function openPwResetLog() {
if (window.currentUser !== 'DPI') {
alert('⛔ This log can only be viewed by DPI Admin.');
return;
}
const resetLog = await _sbGetPwResetLog();
const modal = document.createElement('div');
modal.id = 'pwResetLogModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;';
let rows = '';
if (resetLog.length === 0) {
rows = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999;">कोई Password Reset नहीं हुआ अभी तक।</td></tr>';
} else {
resetLog.forEach((entry, i) => {
const dt = entry.created_at ? new Date(entry.created_at).toLocaleString('en-IN',{hour12:true}) : (entry.dateTime || '-');
rows += `<tr style="background:${i%2===0?'#fff':'#f9f9f9'}">
<td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:bold;color:#0d47a1;">${entry.user_id || entry.userId || '-'}</td>
<td style="padding:10px 12px;border-bottom:1px solid #eee;color:#333;">${dt}</td>
<td style="padding:10px 12px;border-bottom:1px solid #eee;color:#c62828;font-family:monospace;">${entry.old_pass || entry.oldPass || '-'}</td>
<td style="padding:10px 12px;border-bottom:1px solid #eee;color:#2e7d32;font-family:monospace;font-weight:bold;">${entry.new_pass || entry.newPass || '-'}</td>
<td style="padding:10px 12px;border-bottom:1px solid #eee;color:#555;">${entry.reset_by || entry.resetBy || '-'}</td>
</tr>`;
});
}
modal.innerHTML = `
<div style="background:white;border-radius:10px;width:95%;max-width:700px;box-shadow:0 20px 60px rgba(0,0,0,0.4);overflow:hidden;">
<div style="background:#c62828;color:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
<span style="font-weight:bold;font-size:15px;">🔐 Password Reset Log — DPI View</span>
<button onclick="document.getElementById('pwResetLogModal').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px;font-weight:bold;">✕</button>
</div>
<div style="padding:16px 20px;background:#fff8f8;border-bottom:1px solid #eee;font-size:12px;color:#c62828;">
⚠️ यह log केवल DPI Admin को दिखता है। जो भी User अपना Password Reset करे, उसकी जानकारी यहाँ दर्ज होती है।
</div>
<div style="overflow-y:auto;max-height:400px;">
<table style="width:100%;border-collapse:collapse;font-size:13px;">
<thead>
<tr style="background:#f5f5f5;">
<th style="padding:10px 12px;text-align:left;color:#333;border-bottom:2px solid #ddd;">User ID</th>
<th style="padding:10px 12px;text-align:left;color:#333;border-bottom:2px solid #ddd;">Date & Time</th>
<th style="padding:10px 12px;text-align:left;color:#c62828;border-bottom:2px solid #ddd;">पुराना Password</th>
<th style="padding:10px 12px;text-align:left;color:#2e7d32;border-bottom:2px solid #ddd;">नया Password</th>
<th style="padding:10px 12px;text-align:left;color:#333;border-bottom:2px solid #ddd;">Reset By</th>
</tr>
</thead>
<tbody>${rows}</tbody>
</table>
</div>
<div style="padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #eee;background:#fafafa;">
<span style="font-size:11px;color:#999;">कुल Reset: <strong>${resetLog.length}</strong></span>
<button onclick="if(confirm('Are you sure you want to delete all Password Reset Logs?')){_sbClearPwResetLog().then(()=>{localStorage.removeItem('dpi_pw_reset_log');document.getElementById('pwResetLogModal').remove();alert('Log cleared successfully.');});}"
style="padding:7px 14px;background:#e53935;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;">🗑️ Log Clear करें</button>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}
document.addEventListener('DOMContentLoaded', function() {
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn && logoutBtn.parentNode) {
const cpBtn = document.createElement('button');
cpBtn.onclick = openChangePassword;
cpBtn.title = 'Change Password via OTP';
cpBtn.style.cssText = 'padding:7px 14px;background:#006064;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
cpBtn.innerHTML = '🔑 Change Password';
logoutBtn.parentNode.insertBefore(cpBtn, logoutBtn);
}
});


// ═══════════════════════════════════════
// JS Block 12
// ═══════════════════════════════════════

const _DISTRICT_STRUCTURE = [
{ jd:'JD BHOPAL',       districts:['BHOPAL','RAISEN','RAJGARH','SEHORE','VIDISHA'] },
{ jd:'JD GWALIOR',      districts:['ASHOKNAGAR','BHIND','DATIA','GUNA','GWALIOR','MORENA','SHEOPUR','SHIVPURI'] },
{ jd:'JD INDORE',       districts:['ALIRAJPUR','BADWANI','BURHANPUR','DHAR','INDORE','JHABUA','KHANDWA','KHARGONE'] },
{ jd:'JD JABALPUR',     districts:['BALAGHAT','CHHINDWARA','JABALPUR','KATNI','MANDLA','NARSINGHPUR','SEONI','DINDORI','PANDHURNA'] },
{ jd:'JD UJJAIN',       districts:['AGAR MALWA','DEWAS','MANDSAUR','NEEMUCH','RATLAM','SHAJAPUR','UJJAIN'] },
{ jd:'JD SAGAR',        districts:['CHHATARPUR','DAMOH','PANNA','SAGAR','TIKAMGARH','NIWARI'] },
{ jd:'JD REWA',         districts:['REWA','SATNA','SIDHI','SINGRAULI','MAUGANJ','MAIHAR'] },
{ jd:'JD NARMADAPURAM', districts:['BETUL','HARDA','NARMADAPURAM'] },
{ jd:'JD SHAHDOL',      districts:['ANUPPUR','SHAHDOL','UMARIA'] }
];
let _dashCharts = {};
function _destroyDashCharts() {
Object.values(_dashCharts).forEach(c => { try { c.destroy(); } catch(e){} });
_dashCharts = {};
}
function _getDistrictName(row) {
let v = (row.field22 || '').toUpperCase().trim();
if (/^\d{8,}/.test(v) || v.includes('ODS')) v = (row.field23 || '').toUpperCase().trim();
return v.replace(/^DEO\s+/,'').replace(/^JD\s+/,'').trim();
}
function _computeDashData() {
const rows = (window.fullData || []).filter(r => (r.field28||'').toUpperCase() !== 'DELETED');
const today = new Date();
const distCount = {};
_DISTRICT_STRUCTURE.forEach(j => j.districts.forEach(d => { distCount[d] = 0; }));
rows.forEach(r => { const d = _getDistrictName(r); if (distCount[d] !== undefined) distCount[d]++; });
const catCount = {};
rows.forEach(r => {
const c = (r.field5 || 'UNKNOWN').trim().toUpperCase() || 'UNKNOWN';
catCount[c] = (catCount[c] || 0) + 1;
});
const monthlyNew = {}, monthlyUpd = {};
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const months = [];
for (let i = 5; i >= 0; i--) {
const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
months.push({ label: monthNames[d.getMonth()] + ' ' + d.getFullYear().toString().slice(2), year: d.getFullYear(), month: d.getMonth() });
monthlyNew[i] = 0; monthlyUpd[i] = 0;
}
rows.forEach(r => {
const status = (r.field28 || '').toUpperCase();
const trail = r.field29 || '';
const dateMatch = trail.match(/(\d{2})-(\d{2})-(\d{4})/);
if (!dateMatch) return;
const rDate = new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2])-1, parseInt(dateMatch[1]));
months.forEach((m, idx) => {
if (rDate.getFullYear() === m.year && rDate.getMonth() === m.month) {
if (status.includes('NEW')) monthlyNew[5 - idx < 0 ? 0 : 5-idx]++;
else if (status.includes('UPD')) monthlyUpd[5 - idx < 0 ? 0 : 5-idx]++;
}
});
});
const retiringSoon = [];
rows.forEach(r => {
const dob = r.field7 || '';
let birthDate = null;
if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
const p = dob.split('-');
birthDate = new Date(parseInt(p[2]), parseInt(p[1])-1, parseInt(p[0]));
} else if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
birthDate = new Date(dob);
}
if (!birthDate || isNaN(birthDate)) return;
const retDate = new Date(birthDate.getFullYear()+60, birthDate.getMonth(), birthDate.getDate());
const daysLeft = Math.floor((retDate - today) / 86400000);
if (daysLeft >= 0 && daysLeft <= 90) {
retiringSoon.push({
name: r.field4 || '—',
district: _getDistrictName(r),
dob: dob,
retDate: retDate.toLocaleDateString('en-IN'),
daysLeft: daysLeft
});
}
});
retiringSoon.sort((a,b) => a.daysLeft - b.daysLeft);
return { distCount, catCount, months, monthlyNew, monthlyUpd, retiringSoon, total: rows.length };
}
function openLiveDashboard() {
if (!window.fullData || window.fullData.length === 0) {
myAlert('Data not loaded yet. Please try again in a moment.'); return;
}
_destroyDashCharts();
const existing = document.getElementById('liveDashModal');
if (existing) existing.remove();
const D = _computeDashData();
const sortedDist = Object.entries(D.distCount).sort((a,b) => b[1]-a[1]);
const barLabels = sortedDist.map(e => e[0]);
const barData   = sortedDist.map(e => e[1]);
const catLabels = Object.keys(D.catCount);
const catData   = Object.values(D.catCount);
const PIE_COLORS = ['#6a1b9a','#1565c0','#2e7d32','#e65100','#b71c1c','#00695c','#4527a0','#558b2f'];
const trendLabels = D.months.map(m => m.label);
const trendNew  = D.months.map((m,i) => D.monthlyNew[i] || 0);
const trendUpd  = D.months.map((m,i) => D.monthlyUpd[i] || 0);
const retRows = D.retiringSoon.length === 0
? '<tr><td colspan="5" style="text-align:center;padding:16px;color:#888;font-style:italic;">Agle 90 din mein koi retirement nahi</td></tr>'
: D.retiringSoon.slice(0,20).map(r => {
const urgency = r.daysLeft <= 30 ? '#ffebee' : r.daysLeft <= 60 ? '#fff8e1' : '#e8f5e9';
const badge   = r.daysLeft <= 30 ? '#c62828' : r.daysLeft <= 60 ? '#e65100' : '#2e7d32';
return `<tr style="background:${urgency};border-bottom:1px solid #eee;">
<td style="padding:7px 10px;font-weight:600;font-size:12px;">${r.name}</td>
<td style="padding:7px 10px;font-size:12px;">${r.district}</td>
<td style="padding:7px 10px;font-size:12px;">${r.dob}</td>
<td style="padding:7px 10px;font-size:12px;">${r.retDate}</td>
<td style="padding:7px 10px;text-align:center;">
<span style="background:${badge};color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:bold;">${r.daysLeft}d</span>
</td>
</tr>`;
}).join('');
const modal = document.createElement('div');
modal.id = 'liveDashModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10001;overflow-y:auto;';
modal.innerHTML = `
<div style="max-width:1100px;margin:20px auto;background:#f4f6fa;border-radius:10px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4);">
<!-- Header -->
<div style="background:linear-gradient(135deg,#4a148c,#6a1b9a);color:white;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-size:18px;font-weight:700;letter-spacing:.5px;">📊 DPI Live Dashboard</div>
<div style="font-size:12px;opacity:.8;margin-top:2px;">Real-time data from Supabase • ${new Date().toLocaleString('en-IN')}</div>
</div>
<button onclick="closeLiveDashboard()" style="background:rgba(255,255,255,.2);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;font-weight:bold;">✕</button>
</div>
<!-- KPI Cards -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:20px 24px 8px;">
<div style="background:white;border-radius:8px;padding:14px 16px;border-left:4px solid #6a1b9a;">
<div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">कुल Records</div>
<div style="font-size:28px;font-weight:700;color:#4a148c;margin-top:4px;">${D.total.toLocaleString('en-IN')}</div>
</div>
<div style="background:white;border-radius:8px;padding:14px 16px;border-left:4px solid #1565c0;">
<div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Districts Active</div>
<div style="font-size:28px;font-weight:700;color:#1565c0;margin-top:4px;">${Object.values(D.distCount).filter(v=>v>0).length}</div>
</div>
<div style="background:white;border-radius:8px;padding:14px 16px;border-left:4px solid #e65100;">
<div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Retiring (90 days)</div>
<div style="font-size:28px;font-weight:700;color:#e65100;margin-top:4px;">${D.retiringSoon.length}</div>
</div>
<div style="background:white;border-radius:8px;padding:14px 16px;border-left:4px solid #2e7d32;">
<div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Categories</div>
<div style="font-size:28px;font-weight:700;color:#2e7d32;margin-top:4px;">${catLabels.length}</div>
</div>
</div>
<!-- Charts Row 1: Bar + Pie -->
<div style="display:grid;grid-template-columns:2fr 1fr;gap:14px;padding:8px 24px;">
<div style="background:white;border-radius:8px;padding:16px;">
<div style="font-size:13px;font-weight:700;color:#333;margin-bottom:12px;">📍 District-wise Records (Top 55)</div>
<div style="overflow-x:auto;">
<div style="min-width:900px;height:260px;">
<canvas id="dashBarChart"></canvas>
</div>
</div>
</div>
<div style="background:white;border-radius:8px;padding:16px;">
<div style="font-size:13px;font-weight:700;color:#333;margin-bottom:12px;">🎯 Category Split</div>
<div style="height:220px;display:flex;align-items:center;justify-content:center;">
<canvas id="dashPieChart"></canvas>
</div>
</div>
</div>
<!-- Charts Row 2: Line trend -->
<div style="padding:8px 24px;">
<div style="background:white;border-radius:8px;padding:16px;">
<div style="font-size:13px;font-weight:700;color:#333;margin-bottom:12px;">📈 Monthly Activity Trend (Last 6 Months)</div>
<div style="height:200px;">
<canvas id="dashLineChart"></canvas>
</div>
</div>
</div>
<!-- Retirement Calendar -->
<div style="padding:8px 24px 24px;">
<div style="background:white;border-radius:8px;padding:16px;">
<div style="font-size:13px;font-weight:700;color:#333;margin-bottom:4px;">⚠️ Upcoming Retirements — Next 90 Days</div>
<div style="font-size:11px;color:#888;margin-bottom:12px;">
<span style="background:#ffebee;padding:2px 8px;border-radius:4px;color:#c62828;font-weight:600;margin-right:6px;">● ≤ 30 days</span>
<span style="background:#fff8e1;padding:2px 8px;border-radius:4px;color:#e65100;font-weight:600;margin-right:6px;">● ≤ 60 days</span>
<span style="background:#e8f5e9;padding:2px 8px;border-radius:4px;color:#2e7d32;font-weight:600;">● ≤ 90 days</span>
</div>
<div style="overflow-y:auto;max-height:260px;">
<table style="width:100%;border-collapse:collapse;font-size:13px;">
<thead>
<tr style="background:#f5f5f5;position:sticky;top:0;">
<th style="padding:8px 10px;text-align:left;font-size:11px;color:#555;border-bottom:2px solid #eee;">Name</th>
<th style="padding:8px 10px;text-align:left;font-size:11px;color:#555;border-bottom:2px solid #eee;">District</th>
<th style="padding:8px 10px;text-align:left;font-size:11px;color:#555;border-bottom:2px solid #eee;">DOB</th>
<th style="padding:8px 10px;text-align:left;font-size:11px;color:#555;border-bottom:2px solid #eee;">Retirement Date</th>
<th style="padding:8px 10px;text-align:center;font-size:11px;color:#555;border-bottom:2px solid #eee;">Days Left</th>
</tr>
</thead>
<tbody>${retRows}</tbody>
</table>
</div>
</div>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) closeLiveDashboard(); });
requestAnimationFrame(() => {
const barCtx = document.getElementById('dashBarChart')?.getContext('2d');
if (barCtx) {
_dashCharts.bar = new Chart(barCtx, {
type: 'bar',
data: {
labels: barLabels,
datasets: [{
label: 'Records',
data: barData,
backgroundColor: barLabels.map((_, i) => {
const jdColors = ['#6a1b9a','#1565c0','#2e7d32','#e65100','#b71c1c','#00695c','#4527a0','#558b2f','#0277bd'];
for (let ji = 0; ji < _DISTRICT_STRUCTURE.length; ji++) {
if (_DISTRICT_STRUCTURE[ji].districts.includes(barLabels[i])) return jdColors[ji] + 'cc';
}
return '#9e9e9ecc';
}),
borderRadius: 4,
borderSkipped: false,
}]
},
options: {
responsive: true, maintainAspectRatio: false,
plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' Records: ' + ctx.parsed.y } } },
scales: {
x: { ticks: { font: { size: 9 }, maxRotation: 75, minRotation: 45 }, grid: { display: false } },
y: { beginAtZero: true, ticks: { font: { size: 10 } }, grid: { color: '#f0f0f0' } }
}
}
});
}
const pieCtx = document.getElementById('dashPieChart')?.getContext('2d');
if (pieCtx) {
_dashCharts.pie = new Chart(pieCtx, {
type: 'doughnut',
data: {
labels: catLabels,
datasets: [{ data: catData, backgroundColor: PIE_COLORS.slice(0, catLabels.length), borderWidth: 2, borderColor: '#fff' }]
},
options: {
responsive: true, maintainAspectRatio: false,
plugins: {
legend: { position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + ' (' + Math.round(ctx.parsed / catData.reduce((a,b)=>a+b,0) * 100) + '%)' } }
}
}
});
}
const lineCtx = document.getElementById('dashLineChart')?.getContext('2d');
if (lineCtx) {
_dashCharts.line = new Chart(lineCtx, {
type: 'line',
data: {
labels: trendLabels,
datasets: [
{ label: 'New Entries', data: trendNew, borderColor: '#1565c0', backgroundColor: '#1565c022', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#1565c0' },
{ label: 'Updated',     data: trendUpd, borderColor: '#2e7d32', backgroundColor: '#2e7d3222', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#2e7d32' }
]
},
options: {
responsive: true, maintainAspectRatio: false,
plugins: { legend: { position: 'top', labels: { font: { size: 11 }, boxWidth: 14 } } },
scales: {
x: { grid: { display: false }, ticks: { font: { size: 11 } } },
y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } } }
}
}
});
}
});
}
function closeLiveDashboard() {
_destroyDashCharts();
const m = document.getElementById('liveDashModal');
if (m) m.remove();
}


// ═══════════════════════════════════════
// JS Block 13
// ═══════════════════════════════════════

function _computeTrackerData() {
const rows = window.fullData || [];
const today = new Date();
const DEO_MAP = {
'AGARMALWA':'DEOAGARMALWA','ALIRAJPUR':'DEOALIRAJPUR','ANUPPUR':'DEOANUPPUR',
'ASHOKNAGAR':'DEOASHOKNAGAR','BALAGHAT':'DEOBALAGHAT','BARWANI':'DEOBARWANI',
'BADWANI':'DEOBARWANI','BETUL':'DEOBETUL','BHIND':'DEOBHIND','BHOPAL':'DEOBHOPAL',
'BURHANPUR':'DEOBURHANPUR','CHHATARPUR':'DEOCHHATARPUR','CHHINDWARA':'DEOCHHINDWARA',
'DAMOH':'DEODAMOH','DATIA':'DEODATIA','DEWAS':'DEODEWAS','DHAR':'DEODHAR',
'DINDORI':'DEODINDORI','GUNA':'DEOGUNA','GWALIOR':'DEOGWALIOR','HARDA':'DEOHARDA',
'HOSHANGABAD':'DEOHOSHANGABAD','NARMADAPURAM':'DEONARMADAPURAM',
'INDORE':'DEOINDORE','JABALPUR':'DEOJABALPUR','JHABUA':'DEOJHABUA',
'KATNI':'DEOKATNI','KHANDWA':'DEOKHANDWA','KHARGONE':'DEOKHARGONE',
'MANDLA':'DEOMANDLA','MANDSAUR':'DEOMANDSAUR','MORENA':'DEOMORENA',
'NARSINGHPUR':'DEONARSINGHPUR','NEEMUCH':'DEONEEMUCH','NIWARI':'DEONIWARI',
'PANNA':'DEOPANNA','RAISEN':'DEORAISEN','RAJGARH':'DEORAJGARH',
'RATLAM':'DEORATLAM','REWA':'DEOREWA','SAGAR':'DEOSAGAR','SATNA':'DEOSATNA',
'SEHORE':'DEOSEHORE','SEONI':'DEOSEONI','SHAHDOL':'DEOSHAHDOL',
'SHAJAPUR':'DEOSHAJAPUR','SHEOPUR':'DEOSHEOPUR','SHIVPURI':'DEOSHIVPURI',
'SIDHI':'DEOSIDHI','SINGRAULI':'DEOSINGRAULI','TIKAMGARH':'DEOTIKAMGARH',
'UJJAIN':'DEOUJJAIN','UMARIA':'DEOUMARIA','VIDISHA':'DEOVIDISHA',
'PANDHURNA':'DEOPANDHURNA','MAIHAR':'DEOMAIHAR','MAUGANJ':'DEOMAUGANJ'
};
const stats = {};
Object.keys(DEO_MAP).forEach(d => {
stats[d] = { district: d, loginId: DEO_MAP[d], total: 0, active: 0, updated: 0, newEntry: 0, deleted: 0, lastActivity: null, lastActivityRaw: 0 };
});
rows.forEach(row => {
let rawDistrict = (row.field22 || '').toUpperCase().trim();
if (/^\d{8,}/.test(rawDistrict) || rawDistrict.includes('ODS')) {
rawDistrict = (row.field23 || '').toUpperCase().trim();
}
const distName = rawDistrict.replace(/^DEO\s+/,'').replace(/^JD\s+/,'').trim();
if (!stats[distName]) return;
const st = stats[distName];
const status = (row.field28 || '').toUpperCase().trim();
const trail  = (row.field29 || '').trim();
st.total++;
if (!status.includes('DELETE')) st.active++;
if (status.includes('NEW'))     st.newEntry++;
if (status.includes('UPD'))     st.updated++;
if (status.includes('DELETE'))  st.deleted++;
if (trail) {
const pipeParts = trail.split('|');
const datePart = pipeParts.length > 1 ? pipeParts[pipeParts.length - 1].trim() : trail;
let parsed = null;
const dmyMatch = datePart.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
if (dmyMatch) {
const attempt = new Date(`${dmyMatch[3]}-${dmyMatch[2].padStart(2,'0')}-${dmyMatch[1].padStart(2,'0')}`);
if (!isNaN(attempt)) parsed = attempt;
}
const ddmmMatch = datePart.match(/(\d{2})-(\d{2})-(\d{4})/);
if (!parsed && ddmmMatch) {
const attempt = new Date(`${ddmmMatch[3]}-${ddmmMatch[2]}-${ddmmMatch[1]}`);
if (!isNaN(attempt)) parsed = attempt;
}
if (parsed && !isNaN(parsed)) {
const ts = parsed.getTime();
if (ts > st.lastActivityRaw) {
st.lastActivityRaw = ts;
st.lastActivity = parsed;
}
}
}
});
const arr = Object.values(stats).filter(s => s.total > 0 || true);
arr.sort((a, b) => b.active - a.active);
const maxActive = Math.max(...arr.map(s => s.active), 1);
const scored = arr.map(s => ({
...s,
score: s.active + s.updated * 2 + s.newEntry
})).sort((a,b) => b.score - a.score);
return { arr, maxActive, leaderboard: scored.slice(0, 10), today };
}
function _timeAgo(date) {
if (!date) return '<span style="color:#bbb;font-style:italic;">No activity</span>';
const diff = Date.now() - date.getTime();
const mins  = Math.floor(diff / 60000);
const hours = Math.floor(diff / 3600000);
const days  = Math.floor(diff / 86400000);
if (mins < 2)   return '<span style="color:#2e7d32;font-weight:600;">Just now</span>';
if (mins < 60)  return `<span style="color:#2e7d32;font-weight:600;">${mins}m ago</span>`;
if (hours < 24) return `<span style="color:#1565c0;font-weight:600;">${hours}h ago</span>`;
if (days === 1) return `<span style="color:#e65100;font-weight:600;">Yesterday</span>`;
if (days < 7)   return `<span style="color:#e65100;font-weight:600;">${days}d ago</span>`;
return `<span style="color:#b71c1c;font-weight:600;">${date.toLocaleDateString('en-IN')}</span>`;
}
function _statusBadge(s) {
if (!s.lastActivity) return '<span style="background:#f5f5f5;color:#aaa;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">INACTIVE</span>';
const days = Math.floor((Date.now() - s.lastActivity.getTime()) / 86400000);
if (days <= 1)  return '<span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">ACTIVE</span>';
if (days <= 7)  return '<span style="background:#e3f2fd;color:#1565c0;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">RECENT</span>';
if (days <= 30) return '<span style="background:#fff8e1;color:#e65100;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">SLOW</span>';
return '<span style="background:#ffebee;color:#b71c1c;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">LAGGING</span>';
}
function openCompletionTracker() {
if (!window.fullData || window.fullData.length === 0) {
myAlert('Data not loaded. Please try again in a moment.'); return;
}
const existing = document.getElementById('trackerModal');
if (existing) existing.remove();
const { arr, maxActive, leaderboard, today } = _computeTrackerData();
const totalActive  = arr.reduce((s,d) => s + d.active, 0);
const totalNew     = arr.reduce((s,d) => s + d.newEntry, 0);
const totalUpd     = arr.reduce((s,d) => s + d.updated, 0);
const totalDel     = arr.reduce((s,d) => s + d.deleted, 0);
const activeDistricts = arr.filter(d => d.lastActivity && (Date.now() - d.lastActivity.getTime()) < 86400000 * 7).length;
const laggingDistricts = arr.filter(d => !d.lastActivity || (Date.now() - d.lastActivity.getTime()) > 86400000 * 30).length;
const MEDALS = ['🥇','🥈','🥉'];
const leaderRows = leaderboard.map((s, i) => `
<tr style="background:${i < 3 ? ['#fffde7','#f3f3f3','#fff3e0'][i] : (i%2===0?'#fff':'#fafafa')};border-bottom:1px solid #f0f0f0;">
<td style="padding:10px 12px;font-size:15px;text-align:center;width:36px;">${i < 3 ? MEDALS[i] : '<span style="color:#999;font-size:12px;font-weight:700;">' + (i+1) + '</span>'}</td>
<td style="padding:10px 12px;">
<div style="font-size:13px;font-weight:700;color:#1a237e;">${s.district}</div>
<div style="font-size:10px;color:#888;">${s.loginId}</div>
</td>
<td style="padding:10px 12px;text-align:center;">
<span style="font-size:16px;font-weight:700;color:#1565c0;">${s.active.toLocaleString('en-IN')}</span>
</td>
<td style="padding:10px 12px;text-align:center;">
<span style="background:#e8f5e9;color:#2e7d32;padding:2px 7px;border-radius:8px;font-size:11px;font-weight:700;">+${s.newEntry}</span>
<span style="background:#e3f2fd;color:#1565c0;padding:2px 7px;border-radius:8px;font-size:11px;font-weight:700;margin-left:3px;">↻${s.updated}</span>
</td>
<td style="padding:10px 12px;text-align:center;">${_timeAgo(s.lastActivity)}</td>
<td style="padding:10px 12px;text-align:center;">${_statusBadge(s)}</td>
</tr>`).join('');
const JD_COLOR = {
'JD BHOPAL':'#6a1b9a','JD GWALIOR':'#1565c0','JD INDORE':'#2e7d32',
'JD JABALPUR':'#e65100','JD UJJAIN':'#b71c1c','JD SAGAR':'#00695c',
'JD REWA':'#4527a0','JD NARMADAPURAM':'#558b2f','JD SHAHDOL':'#0277bd'
};
let progressHTML = '';
(_DISTRICT_STRUCTURE || []).forEach(jd => {
const color = JD_COLOR[jd.jd] || '#555';
progressHTML += `
<div style="margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid ${color}22;">
${jd.jd}
</div>`;
jd.districts.forEach(distName => {
const s = arr.find(a => a.district === distName) || { district: distName, active: 0, newEntry: 0, updated: 0, deleted: 0, lastActivity: null };
const pct = maxActive > 0 ? Math.round((s.active / maxActive) * 100) : 0;
const barColor = s.active === 0 ? '#e0e0e0' : color;
progressHTML += `
<div data-district="${distName}" style="display:grid;grid-template-columns:120px 1fr 60px 90px 80px;gap:8px;align-items:center;margin-bottom:6px;">
<div style="font-size:11px;font-weight:600;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${distName}">${distName}</div>
<div style="background:#f0f0f0;border-radius:4px;height:10px;overflow:hidden;">
<div style="width:${pct}%;height:100%;background:${barColor};border-radius:4px;transition:width .4s;"></div>
</div>
<div style="font-size:11px;font-weight:700;color:#333;text-align:right;">${s.active.toLocaleString('en-IN')}</div>
<div style="font-size:10px;text-align:center;">${_timeAgo(s.lastActivity)}</div>
<div style="font-size:10px;text-align:right;">${_statusBadge(s)}</div>
</div>`;
});
progressHTML += `</div>`;
});
const modal = document.createElement('div');
modal.id = 'trackerModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.72);z-index:10002;overflow-y:auto;';
modal.innerHTML = `
<div style="max-width:1080px;margin:20px auto 40px;background:#f4f6fa;border-radius:12px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,0.45);">
<!-- ── Header ── -->
<div style="background:linear-gradient(135deg,#0d47a1,#1565c0);color:white;padding:18px 28px;display:flex;justify-content:space-between;align-items:center;">
<div>
<div style="font-size:19px;font-weight:700;letter-spacing:.4px;">🏆 District Completion Tracker</div>
<div style="font-size:12px;opacity:.8;margin-top:3px;">Live progress • Last refreshed: ${today.toLocaleString('en-IN')}</div>
</div>
<div style="display:flex;gap:10px;align-items:center;">
<button onclick="refreshTracker()" style="background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);color:white;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">🔄 Refresh</button>
<button onclick="document.getElementById('trackerModal').remove()" style="background:rgba(255,255,255,.15);border:none;color:white;width:34px;height:34px;border-radius:50%;font-size:16px;cursor:pointer;font-weight:bold;">✕</button>
</div>
</div>
<!-- ── KPI Strip ── -->
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:20px 24px 10px;">
<div style="background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #1565c0;">
<div style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Total Active</div>
<div style="font-size:26px;font-weight:700;color:#1565c0;margin-top:3px;">${totalActive.toLocaleString('en-IN')}</div>
</div>
<div style="background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #2e7d32;">
<div style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">New Entries</div>
<div style="font-size:26px;font-weight:700;color:#2e7d32;margin-top:3px;">${totalNew.toLocaleString('en-IN')}</div>
</div>
<div style="background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #0277bd;">
<div style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Updated</div>
<div style="font-size:26px;font-weight:700;color:#0277bd;margin-top:3px;">${totalUpd.toLocaleString('en-IN')}</div>
</div>
<div style="background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #2e7d32;">
<div style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Active This Week</div>
<div style="font-size:26px;font-weight:700;color:#2e7d32;margin-top:3px;">${activeDistricts}</div>
</div>
<div style="background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #b71c1c;">
<div style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Lagging (&gt;30d)</div>
<div style="font-size:26px;font-weight:700;color:#b71c1c;margin-top:3px;">${laggingDistricts}</div>
</div>
</div>
<!-- ── Two Column: Leaderboard + Search ── -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:10px 24px;">
<!-- Leaderboard -->
<div style="background:white;border-radius:10px;overflow:hidden;">
<div style="padding:14px 16px;border-bottom:1px solid #f0f0f0;">
<div style="font-size:13px;font-weight:700;color:#1a237e;">🏅 Top 10 Leaderboard</div>
<div style="font-size:11px;color:#888;margin-top:2px;">Score = Active + Updated×2 + New</div>
</div>
<div style="overflow-y:auto;max-height:340px;">
<table style="width:100%;border-collapse:collapse;">
<thead>
<tr style="background:#f8f9fa;position:sticky;top:0;">
<th style="padding:8px 10px;font-size:10px;color:#666;font-weight:600;text-align:center;width:36px;">#</th>
<th style="padding:8px 10px;font-size:10px;color:#666;font-weight:600;text-align:left;">District</th>
<th style="padding:8px 10px;font-size:10px;color:#666;font-weight:600;text-align:center;">Records</th>
<th style="padding:8px 10px;font-size:10px;color:#666;font-weight:600;text-align:center;">Activity</th>
<th style="padding:8px 10px;font-size:10px;color:#666;font-weight:600;text-align:center;">Last Active</th>
<th style="padding:8px 10px;font-size:10px;color:#666;font-weight:600;text-align:center;">Status</th>
</tr>
</thead>
<tbody>${leaderRows}</tbody>
</table>
</div>
</div>
<!-- Alert Panel: Lagging districts -->
<div style="background:white;border-radius:10px;overflow:hidden;">
<div style="padding:14px 16px;border-bottom:1px solid #f0f0f0;background:#fff8f8;">
<div style="font-size:13px;font-weight:700;color:#b71c1c;">⚠️ Attention Required</div>
<div style="font-size:11px;color:#888;margin-top:2px;">Districts with no activity in last 30 days</div>
</div>
<div style="overflow-y:auto;max-height:340px;padding:8px 0;">
${arr.filter(s => !s.lastActivity || (Date.now() - s.lastActivity.getTime()) > 86400000 * 30)
.sort((a,b) => (a.lastActivityRaw||0) - (b.lastActivityRaw||0))
.map(s => `
<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:1px solid #ffeaea;">
<div>
<div style="font-size:12px;font-weight:700;color:#333;">${s.district}</div>
<div style="font-size:10px;color:#999;">${s.loginId} • ${s.active} records</div>
</div>
<div style="text-align:right;">
${_timeAgo(s.lastActivity)}
<div style="margin-top:2px;">${_statusBadge(s)}</div>
</div>
</div>`).join('') || '<div style="padding:20px;text-align:center;color:#2e7d32;font-weight:600;">✅ Sab districts active hain!</div>'
}
</div>
</div>
</div>
<!-- ── Progress Bars: All Districts by JD ── -->
<div style="padding:10px 24px 28px;">
<div style="background:white;border-radius:10px;padding:18px 20px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
<div style="font-size:13px;font-weight:700;color:#333;">📊 All Districts — Progress View</div>
<div style="display:flex;gap:8px;align-items:center;">
<input type="text" id="trackerSearchBox" oninput="filterTrackerRows(this.value)" style="padding:5px 10px;border:1px solid #ddd;border-radius:6px;font-size:12px;width:160px;">
</div>
</div>
<div style="font-size:10px;color:#888;margin-bottom:14px;">Progress bar = relative to highest district. Color = JD region.</div>
<!-- Legend -->
<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #f0f0f0;">
${Object.entries(JD_COLOR).map(([jd, col]) => `<span style="font-size:10px;font-weight:600;color:${col};display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;background:${col};border-radius:2px;display:inline-block;"></span>${jd}</span>`).join('')}
</div>
<!-- Column headers -->
<div style="display:grid;grid-template-columns:120px 1fr 60px 90px 80px;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee;">
<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;">District</div>
<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;">Progress</div>
<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;text-align:right;">Records</div>
<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;text-align:center;">Last Active</div>
<div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;text-align:right;">Status</div>
</div>
<div id="trackerProgressBody">${progressHTML}</div>
</div>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}
function refreshTracker() {
openCompletionTracker();
}
function filterTrackerRows(val) {
const body = document.getElementById('trackerProgressBody');
if (!body) return;
const q = val.trim().toUpperCase();
body.querySelectorAll('[data-district]').forEach(el => {
el.style.display = (!q || el.dataset.district.includes(q)) ? '' : 'none';
});
}
const _origLoadDataIntoMemory2 = typeof loadDataIntoMemory === 'function' ? loadDataIntoMemory : null;


// ═══════════════════════════════════════
// JS Block 14
// ═══════════════════════════════════════

const DIST_PANEL_PASSWORD = "1782";
function openDistrictPasswordPanel() {
document.getElementById('distPassUnlockModal').style.display = 'flex';
document.getElementById('distPassUnlockInput').value = '';
document.getElementById('distPassUnlockErr').textContent = '';
setTimeout(() => document.getElementById('distPassUnlockInput').focus(), 100);
}
function verifyDistPassUnlock() {
const entered = document.getElementById('distPassUnlockInput').value.trim();
if (entered === DIST_PANEL_PASSWORD) {
document.getElementById('distPassUnlockModal').style.display = 'none';
document.getElementById('distPassUnlockInput').value = '';
document.getElementById('distPassUnlockErr').textContent = '';
showDistrictPasswordPanel();
} else {
document.getElementById('distPassUnlockErr').textContent = '❌ Galat password! Sirf DPI ke liye.';
document.getElementById('distPassUnlockInput').value = '';
document.getElementById('distPassUnlockInput').focus();
}
}
function showDistrictPasswordPanel() {
buildDistPassTable('all');
document.getElementById('districtPasswordPanel').style.display = 'block';
document.getElementById('distPassSearch').value = '';
}
function closeDistrictPasswordPanel() {
document.getElementById('districtPasswordPanel').style.display = 'none';
}
function showDistPassTab(tab) {
['all','dpi','jd','deo'].forEach(t => {
const btn = document.getElementById('tab' + t.toUpperCase());
if(btn){ btn.style.background = (t===tab)?'#1565c0':'#e0e0e0'; btn.style.color = (t===tab)?'white':'#333'; }
});
document.getElementById('distPassSearch').value = '';
buildDistPassTable(tab);
}
function buildDistPassTable(tab) {
const allEntries = [
{ type:'DPI', label:'DPI (State Level)', id:'DPI', pass: districtCredentials['DPI'] },
{ type:'JD', label:'JD Bhopal', id:'JDBHOPAL', pass: districtCredentials['JDBHOPAL'] },
{ type:'JD', label:'JD Gwalior', id:'JDGWALIOR', pass: districtCredentials['JDGWALIOR'] },
{ type:'JD', label:'JD Indore', id:'JDINDORE', pass: districtCredentials['JDINDORE'] },
{ type:'JD', label:'JD Jabalpur', id:'JDJABALPUR', pass: districtCredentials['JDJABALPUR'] },
{ type:'JD', label:'JD Rewa', id:'JDREWA', pass: districtCredentials['JDREWA'] },
{ type:'JD', label:'JD Sagar', id:'JDSAGAR', pass: districtCredentials['JDSAGAR'] },
{ type:'JD', label:'JD Ujjain', id:'JDUJJAIN', pass: districtCredentials['JDUJJAIN'] },
{ type:'JD', label:'JD Shahdol', id:'JDSHAHDOL', pass: districtCredentials['JDSHAHDOL'] },
{ type:'JD', label:'JD Narmadapuram', id:'JDNARMADAPURAM', pass: districtCredentials['JDNARMADAPURAM'] },
{ type:'DEO', label:'DEO Agar Malwa', id:'DEOAGARMALWA', pass: districtCredentials['DEOAGARMALWA'] },
{ type:'DEO', label:'DEO Alirajpur', id:'DEOALIRAJPUR', pass: districtCredentials['DEOALIRAJPUR'] },
{ type:'DEO', label:'DEO Anuppur', id:'DEOANUPPUR', pass: districtCredentials['DEOANUPPUR'] },
{ type:'DEO', label:'DEO Ashoknagar', id:'DEOASHOKNAGAR', pass: districtCredentials['DEOASHOKNAGAR'] },
{ type:'DEO', label:'DEO Balaghat', id:'DEOBALAGHAT', pass: districtCredentials['DEOBALAGHAT'] },
{ type:'DEO', label:'DEO Barwani', id:'DEOBARWANI', pass: districtCredentials['DEOBARWANI'] },
{ type:'DEO', label:'DEO Betul', id:'DEOBETUL', pass: districtCredentials['DEOBETUL'] },
{ type:'DEO', label:'DEO Bhind', id:'DEOBHIND', pass: districtCredentials['DEOBHIND'] },
{ type:'DEO', label:'DEO Bhopal', id:'DEOBHOPAL', pass: districtCredentials['DEOBHOPAL'] },
{ type:'DEO', label:'DEO Burhanpur', id:'DEOBURHANPUR', pass: districtCredentials['DEOBURHANPUR'] },
{ type:'DEO', label:'DEO Chhatarpur', id:'DEOCHHATARPUR', pass: districtCredentials['DEOCHHATARPUR'] },
{ type:'DEO', label:'DEO Chhindwara', id:'DEOCHHINDWARA', pass: districtCredentials['DEOCHHINDWARA'] },
{ type:'DEO', label:'DEO Damoh', id:'DEODAMOH', pass: districtCredentials['DEODAMOH'] },
{ type:'DEO', label:'DEO Datia', id:'DEODATIA', pass: districtCredentials['DEODATIA'] },
{ type:'DEO', label:'DEO Dewas', id:'DEODEWAS', pass: districtCredentials['DEODEWAS'] },
{ type:'DEO', label:'DEO Dhar', id:'DEODHAR', pass: districtCredentials['DEODHAR'] },
{ type:'DEO', label:'DEO Dindori', id:'DEODINDORI', pass: districtCredentials['DEODINDORI'] },
{ type:'DEO', label:'DEO Guna', id:'DEOGUNA', pass: districtCredentials['DEOGUNA'] },
{ type:'DEO', label:'DEO Gwalior', id:'DEOGWALIOR', pass: districtCredentials['DEOGWALIOR'] },
{ type:'DEO', label:'DEO Harda', id:'DEOHARDA', pass: districtCredentials['DEOHARDA'] },
{ type:'DEO', label:'DEO Indore', id:'DEOINDORE', pass: districtCredentials['DEOINDORE'] },
{ type:'DEO', label:'DEO Jabalpur', id:'DEOJABALPUR', pass: districtCredentials['DEOJABALPUR'] },
{ type:'DEO', label:'DEO Jhabua', id:'DEOJHABUA', pass: districtCredentials['DEOJHABUA'] },
{ type:'DEO', label:'DEO Katni', id:'DEOKATNI', pass: districtCredentials['DEOKATNI'] },
{ type:'DEO', label:'DEO Khandwa', id:'DEOKHANDWA', pass: districtCredentials['DEOKHANDWA'] },
{ type:'DEO', label:'DEO Khargone', id:'DEOKHARGONE', pass: districtCredentials['DEOKHARGONE'] },
{ type:'DEO', label:'DEO Mandla', id:'DEOMANDLA', pass: districtCredentials['DEOMANDLA'] },
{ type:'DEO', label:'DEO Mandsaur', id:'DEOMANDSAUR', pass: districtCredentials['DEOMANDSAUR'] },
{ type:'DEO', label:'DEO Morena', id:'DEOMORENA', pass: districtCredentials['DEOMORENA'] },
{ type:'DEO', label:'DEO Narmadapuram', id:'DEONARMADAPURAM', pass: districtCredentials['DEONARMADAPURAM'] },
{ type:'DEO', label:'DEO Narsinghpur', id:'DEONARSINGHPUR', pass: districtCredentials['DEONARSINGHPUR'] },
{ type:'DEO', label:'DEO Neemuch', id:'DEONEEMUCH', pass: districtCredentials['DEONEEMUCH'] },
{ type:'DEO', label:'DEO Niwari', id:'DEONIWARI', pass: districtCredentials['DEONIWARI'] },
{ type:'DEO', label:'DEO Panna', id:'DEOPANNA', pass: districtCredentials['DEOPANNA'] },
{ type:'DEO', label:'DEO Raisen', id:'DEORAISEN', pass: districtCredentials['DEORAISEN'] },
{ type:'DEO', label:'DEO Rajgarh', id:'DEORAJGARH', pass: districtCredentials['DEORAJGARH'] },
{ type:'DEO', label:'DEO Ratlam', id:'DEORATLAM', pass: districtCredentials['DEORATLAM'] },
{ type:'DEO', label:'DEO Rewa', id:'DEOREWA', pass: districtCredentials['DEOREWA'] },
{ type:'DEO', label:'DEO Sagar', id:'DEOSAGAR', pass: districtCredentials['DEOSAGAR'] },
{ type:'DEO', label:'DEO Satna', id:'DEOSATNA', pass: districtCredentials['DEOSATNA'] },
{ type:'DEO', label:'DEO Sehore', id:'DEOSEHORE', pass: districtCredentials['DEOSEHORE'] },
{ type:'DEO', label:'DEO Seoni', id:'DEOSEONI', pass: districtCredentials['DEOSEONI'] },
{ type:'DEO', label:'DEO Shahdol', id:'DEOSHAHDOL', pass: districtCredentials['DEOSHAHDOL'] },
{ type:'DEO', label:'DEO Shajapur', id:'DEOSHAJAPUR', pass: districtCredentials['DEOSHAJAPUR'] },
{ type:'DEO', label:'DEO Sheopur', id:'DEOSHEOPUR', pass: districtCredentials['DEOSHEOPUR'] },
{ type:'DEO', label:'DEO Shivpuri', id:'DEOSHIVPURI', pass: districtCredentials['DEOSHIVPURI'] },
{ type:'DEO', label:'DEO Sidhi', id:'DEOSIDHI', pass: districtCredentials['DEOSIDHI'] },
{ type:'DEO', label:'DEO Singrauli', id:'DEOSINGRAULI', pass: districtCredentials['DEOSINGRAULI'] },
{ type:'DEO', label:'DEO Tikamgarh', id:'DEOTIKAMGARH', pass: districtCredentials['DEOTIKAMGARH'] },
{ type:'DEO', label:'DEO Ujjain', id:'DEOUJJAIN', pass: districtCredentials['DEOUJJAIN'] },
{ type:'DEO', label:'DEO Umaria', id:'DEOUMARIA', pass: districtCredentials['DEOUMARIA'] },
{ type:'DEO', label:'DEO Vidisha', id:'DEOVIDISHA', pass: districtCredentials['DEOVIDISHA'] },
{ type:'DEO', label:'DEO Pandhurna', id:'DEOPANDHURNA', pass: districtCredentials['DEOPANDHURNA'] },
{ type:'DEO', label:'DEO Maihar', id:'DEOMAIHAR', pass: districtCredentials['DEOMAIHAR'] },
{ type:'DEO', label:'DEO Mauganj', id:'DEOMAUGANJ', pass: districtCredentials['DEOMAUGANJ'] },
];
const filtered = tab === 'all' ? allEntries :
tab === 'dpi' ? allEntries.filter(e => e.type==='DPI') :
tab === 'jd'  ? allEntries.filter(e => e.type==='JD') :
allEntries.filter(e => e.type==='DEO');
renderDistPassRows(filtered);
}
function renderDistPassRows(entries) {
const container = document.getElementById('distPassTableBody');
const typeColors = { DPI:'#c62828', JD:'#1565c0', DEO:'#2e7d32' };
const typeBg    = { DPI:'#ffebee', JD:'#e3f2fd', DEO:'#e8f5e9' };
const typeBorder= { DPI:'#c62828', JD:'#1565c0', DEO:'#2e7d32' };
if(!entries.length){
container.innerHTML = '<div style="grid-column:1/-1;padding:30px;text-align:center;color:#999;font-size:13px;">Koi result nahi mila 🔍</div>';
return;
}
container.innerHTML = entries.map((e, i) => `
<div data-id="${e.id}" data-label="${e.label.toUpperCase()}"
style="background:white;border-radius:10px;border:1.5px solid ${typeBorder[e.type]};
padding:14px 16px;box-shadow:0 2px 8px rgba(0,0,0,.07);transition:.2s;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
<span style="background:${typeBg[e.type]};color:${typeColors[e.type]};padding:2px 9px;
border-radius:4px;font-size:10px;font-weight:800;">${e.type}</span>
<span style="font-size:10px;color:#bbb;font-weight:600;">#${i+1}</span>
</div>
<div style="font-size:13px;font-weight:700;color:#002e5b;margin-bottom:2px;">${e.label}</div>
<div style="font-size:10px;color:#999;margin-bottom:12px;font-family:monospace;">${e.id}</div>
<div style="background:#f0f4ff;border-radius:7px;padding:10px 12px;text-align:center;margin-bottom:10px;">
<div style="font-size:10px;color:#888;font-weight:600;margin-bottom:4px;">PASSWORD</div>
<div id="pw_${e.id}" style="font-family:monospace;font-size:22px;font-weight:900;
color:#002e5b;letter-spacing:6px;">••••</div>
</div>
<div style="display:flex;gap:6px;">
<button onclick="togglePassVis('${e.id}','${e.pass}')"
style="flex:1;padding:7px;border:1.5px solid #ccc;border-radius:6px;cursor:pointer;
background:white;color:#555;font-size:11px;font-weight:700;">
👁 Show/Hide
</button>
<button onclick="copyDistPass('${e.pass}','${e.id}')" id="cpbtn_${e.id}"
style="flex:1;padding:7px;border:none;border-radius:6px;cursor:pointer;
background:#1565c0;color:white;font-size:11px;font-weight:700;">
📋 Copy
</button>
</div>
<div style="margin-top:8px;">
<button onclick="openEditPassword('${e.id}','${e.type}')"
style="width:100%;padding:8px;border:none;border-radius:6px;cursor:pointer;
background:linear-gradient(135deg,${typeColors[e.type]},${e.type==='DPI'?'#b71c1c':e.type==='JD'?'#0d47a1':'#1b5e20'});
color:white;font-size:11px;font-weight:700;">
✏️ Edit ${e.type} Password
</button>
</div>
</div>
`).join('');
}
function togglePassVis(id, pass) {
const el = document.getElementById('pw_' + id);
if(!el) return;
el.textContent = (el.textContent === '••••') ? pass : '••••';
}
function copyDistPass(pass, id) {
navigator.clipboard.writeText(pass).then(() => {
const btn = document.getElementById('cpbtn_' + id);
if(btn){ btn.textContent='✅ Copied!'; btn.style.background='#2e7d32'; setTimeout(()=>{ btn.textContent='📋 Copy'; btn.style.background='#1565c0'; }, 1800); }
}).catch(() => {
const ta = document.createElement('textarea');
ta.value = pass;
document.body.appendChild(ta);
ta.select();
document.execCommand('copy');
document.body.removeChild(ta);
const btn = document.getElementById('cpbtn_' + id);
if(btn){ btn.textContent='✅ Copied!'; btn.style.background='#2e7d32'; setTimeout(()=>{ btn.textContent='📋 Copy'; btn.style.background='#1565c0'; }, 1800); }
});
}
function openDpiEditPassword() {
if (window.currentUser !== 'DPI') {
alert('⛔ This option is only for DPI.');
return;
}
const old = document.getElementById('dpiEditPassModal');
if (old) old.remove();
const modal = document.createElement('div');
modal.id = 'dpiEditPassModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000020;display:flex;align-items:center;justify-content:center;';
modal.innerHTML = `
<div style="background:white;border-radius:12px;width:90%;max-width:380px;box-shadow:0 15px 50px rgba(0,0,0,.5);overflow:hidden;font-family:sans-serif;">
<div style="background:linear-gradient(90deg,#b71c1c,#c62828);color:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
<b style="font-size:15px;">✏️ DPI Password Edit</b>
<button onclick="document.getElementById('dpiEditPassModal').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px;font-weight:bold;">✕</button>
</div>
<div style="padding:24px;">
<p style="font-size:12px;color:#c62828;background:#ffebee;padding:8px 12px;border-radius:6px;margin:0 0 18px 0;font-weight:600;">⚠️ DPI password change karna ek sensitive action hai।</p>
<label style="font-size:11px;font-weight:bold;color:#333;">नया PASSWORD</label>
<input id="dpiNewPass" type="password"
style="width:100%;padding:10px;margin:6px 0 14px 0;border:1.5px solid #ccc;border-radius:5px;font-size:14px;box-sizing:border-box;"
oninput="dpiPwStrengthCheck(this.value)" placeholder="Enter new password">
<label style="font-size:11px;font-weight:bold;color:#333;">PASSWORD CONFIRM करें</label>
<input id="dpiConfirmPass" type="password"
style="width:100%;padding:10px;margin:6px 0 14px 0;border:1.5px solid #ccc;border-radius:5px;font-size:14px;box-sizing:border-box;"
placeholder="Re-enter password">
<div style="background:#eee;border-radius:4px;height:6px;overflow:hidden;margin-bottom:4px;">
<div id="dpiPwBar" style="height:100%;width:0%;border-radius:4px;transition:width 0.3s,background 0.3s;"></div>
</div>
<div id="dpiPwLabel" style="font-size:10px;color:#888;margin-bottom:14px;"></div>
<div id="dpiEditPassErr" style="color:#c62828;font-size:11px;min-height:16px;margin-bottom:10px;font-weight:bold;"></div>
<button onclick="saveDpiNewPassword()"
style="width:100%;padding:12px;background:#b71c1c;color:white;border:none;border-radius:5px;font-weight:bold;cursor:pointer;font-size:13px;">
💾 DPI Password Save करें
</button>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
setTimeout(() => document.getElementById('dpiNewPass').focus(), 100);
}
function dpiPwStrengthCheck(val) {
const bar = document.getElementById('dpiPwBar');
const label = document.getElementById('dpiPwLabel');
if (!bar || !label) return;
let score = 0;
if (val.length >= 4) score++;
if (val.length >= 6) score++;
if (/[A-Z]/.test(val)) score++;
if (/[0-9]/.test(val)) score++;
if (/[^A-Za-z0-9]/.test(val)) score++;
const levels = [
{w:'0%',bg:'#eee',t:''},{w:'20%',bg:'#e53935',t:'बहुत कमज़ोर'},
{w:'40%',bg:'#f57c00',t:'कमज़ोर'},{w:'60%',bg:'#fbc02d',t:'ठीक है'},
{w:'80%',bg:'#7cb342',t:'अच्छा'},{w:'100%',bg:'#2e7d32',t:'बहुत मज़बूत ✅'}
];
const lvl = levels[score] || levels[0];
bar.style.width = lvl.w; bar.style.background = lvl.bg;
label.innerText = lvl.t; label.style.color = lvl.bg;
}
async function saveDpiNewPassword() {
const newPass     = document.getElementById('dpiNewPass').value.trim();
const confirmPass = document.getElementById('dpiConfirmPass').value.trim();
const errDiv      = document.getElementById('dpiEditPassErr');
if (!newPass || newPass.length < 4) { errDiv.innerHTML = '❌ Password must be at least 4 characters.'; return; }
if (newPass !== confirmPass) { errDiv.innerHTML = '❌ Passwords do not match.'; return; }
const CUSTOM_PASS_KEY = 'msErp_customPasswords';
const custom = JSON.parse(localStorage.getItem(CUSTOM_PASS_KEY) || '{}');
const oldPass = custom['DPI'] || districtCredentials['DPI'] || '(default)';
custom['DPI'] = newPass;
localStorage.setItem(CUSTOM_PASS_KEY, JSON.stringify(custom));
districtCredentials['DPI'] = newPass;
errDiv.innerHTML = '<span style="color:#1565c0;font-weight:bold;">⏳ Saving to cloud...</span>';
// ✅ FIX: user_passwords table mein save karo
await _savePasswordToCloud('DPI', newPass);
// ✅ FIX: users table mein bhi update karo
try {
  await fetch(`${WORKER_URL}/users?userid=eq.DPI`, { method: 'PATCH', headers: _SB_HDR, body: JSON.stringify({ password: newPass }) });
  console.log('✅ users table updated for DPI');
} catch(e) { console.warn('users table update failed:', e); }
if (typeof auditLog === 'function') auditLog('DPI_PASSWORD_CHANGED', 'DPI password changed by DPI admin');
_sbLogPwReset('DPI', oldPass, newPass, 'DPI');
const PW_RESET_LOG_KEY = 'dpi_pw_reset_log';
const resetLog = JSON.parse(localStorage.getItem(PW_RESET_LOG_KEY) || '[]');
resetLog.unshift({ userId:'DPI', dateTime: new Date().toLocaleString('en-IN',{hour12:true}), timestamp: Date.now(), resetBy:'DPI (Self)', oldPass, newPass });
localStorage.setItem(PW_RESET_LOG_KEY, JSON.stringify(resetLog));
errDiv.innerHTML = '<span style="color:#2e7d32;font-weight:bold;">✅ DPI Password saved to cloud!</span>';
setTimeout(() => {
document.getElementById('dpiEditPassModal')?.remove();
buildDistPassTable('dpi');
showDistPassTab('dpi');
}, 1500);
}
function openEditPassword(userId, userType) {
if (window.currentUser !== 'DPI' && window.currentUser !== userId) {
alert('⛔ You can only edit your own password.');
return;
}
const typeColors = { DPI:'#b71c1c', JD:'#0d47a1', DEO:'#1b5e20' };
const typeGrad   = { DPI:'linear-gradient(90deg,#b71c1c,#c62828)', JD:'linear-gradient(90deg,#0d47a1,#1565c0)', DEO:'linear-gradient(90deg,#1b5e20,#2e7d32)' };
const color = typeColors[userType] || '#333';
const grad  = typeGrad[userType]  || 'linear-gradient(90deg,#333,#555)';
const old = document.getElementById('uniEditPassModal');
if (old) old.remove();
const modal = document.createElement('div');
modal.id = 'uniEditPassModal';
modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000020;display:flex;align-items:center;justify-content:center;';
modal.innerHTML = `
<div style="background:white;border-radius:12px;width:90%;max-width:380px;box-shadow:0 15px 50px rgba(0,0,0,.5);overflow:hidden;font-family:sans-serif;">
<div style="background:${grad};color:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
<b style="font-size:15px;">✏️ ${userType} Password Edit</b>
<button onclick="document.getElementById('uniEditPassModal').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px;font-weight:bold;">✕</button>
</div>
<div style="padding:24px;">
<p style="font-size:12px;color:${color};background:#f9f9f9;border-left:4px solid ${color};padding:8px 12px;border-radius:4px;margin:0 0 10px 0;font-weight:600;">
🔐 User: <span style="font-family:monospace;letter-spacing:1px;">${userId}</span>
</p>
<p style="font-size:12px;color:#888;background:#fff8e1;padding:8px 12px;border-radius:6px;margin:0 0 18px 0;font-weight:600;">⚠️ Password change karna ek sensitive action hai।</p>
<label style="font-size:11px;font-weight:bold;color:#333;">नया PASSWORD</label>
<input id="uniNewPass" type="password"
style="width:100%;padding:10px;margin:6px 0 14px 0;border:1.5px solid #ccc;border-radius:5px;font-size:14px;box-sizing:border-box;"
oninput="uniPwStrengthCheck(this.value)" placeholder="Enter new password">
<label style="font-size:11px;font-weight:bold;color:#333;">PASSWORD CONFIRM करें</label>
<input id="uniConfirmPass" type="password"
style="width:100%;padding:10px;margin:6px 0 14px 0;border:1.5px solid #ccc;border-radius:5px;font-size:14px;box-sizing:border-box;"
placeholder="Re-enter password">
<div style="background:#eee;border-radius:4px;height:6px;overflow:hidden;margin-bottom:4px;">
<div id="uniPwBar" style="height:100%;width:0%;border-radius:4px;transition:width 0.3s,background 0.3s;"></div>
</div>
<div id="uniPwLabel" style="font-size:10px;color:#888;margin-bottom:14px;"></div>
<div id="uniEditPassErr" style="color:#c62828;font-size:11px;min-height:16px;margin-bottom:10px;font-weight:bold;"></div>
<button onclick="saveUniPassword('${userId}','${userType}')"
style="width:100%;padding:12px;background:${color};color:white;border:none;border-radius:5px;font-weight:bold;cursor:pointer;font-size:13px;">
💾 ${userId} Password Save करें
</button>
</div>
</div>`;
document.body.appendChild(modal);
modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
setTimeout(() => document.getElementById('uniNewPass').focus(), 100);
}
function uniPwStrengthCheck(val) {
const bar = document.getElementById('uniPwBar');
const label = document.getElementById('uniPwLabel');
if (!bar || !label) return;
let score = 0;
if (val.length >= 4) score++;
if (val.length >= 6) score++;
if (/[A-Z]/.test(val)) score++;
if (/[0-9]/.test(val)) score++;
if (/[^A-Za-z0-9]/.test(val)) score++;
const levels = [
{w:'0%',bg:'#eee',t:''},{w:'20%',bg:'#e53935',t:'बहुत कमज़ोर'},
{w:'40%',bg:'#f57c00',t:'कमज़ोर'},{w:'60%',bg:'#fbc02d',t:'ठीक है'},
{w:'80%',bg:'#7cb342',t:'अच्छा'},{w:'100%',bg:'#2e7d32',t:'बहुत मज़बूत ✅'}
];
const lvl = levels[score] || levels[0];
bar.style.width = lvl.w; bar.style.background = lvl.bg;
label.innerText = lvl.t; label.style.color = lvl.bg;
}
async function saveUniPassword(userId, userType) {
const newPass     = document.getElementById('uniNewPass').value.trim();
const confirmPass = document.getElementById('uniConfirmPass').value.trim();
const errDiv      = document.getElementById('uniEditPassErr');
if (!newPass || newPass.length < 4) { errDiv.innerHTML = '❌ Password must be at least 4 characters.'; return; }
if (newPass !== confirmPass) { errDiv.innerHTML = '❌ Passwords do not match.'; return; }
const CUSTOM_PASS_KEY = 'msErp_customPasswords';
const custom = JSON.parse(localStorage.getItem(CUSTOM_PASS_KEY) || '{}');
const oldPass = custom[userId] || districtCredentials[userId] || '(default)';
custom[userId] = newPass;
localStorage.setItem(CUSTOM_PASS_KEY, JSON.stringify(custom));
districtCredentials[userId] = newPass;
if(errDiv) errDiv.innerHTML = '<span style="color:#1565c0;font-weight:bold;">⏳ Saving to cloud...</span>';
// ✅ FIX: user_passwords table mein save karo (log)
await _savePasswordToCloud(userId, newPass);
// ✅ FIX: users table mein bhi password update karo
try {
  await fetch(`${WORKER_URL}/users?userid=eq.${encodeURIComponent(userId)}`, { method: 'PATCH', headers: _SB_HDR, body: JSON.stringify({ password: newPass }) });
  console.log('✅ users table updated for:', userId);
} catch(e) { console.warn('users table update failed:', e); }
if (typeof auditLog === 'function') auditLog(userType + '_PASSWORD_CHANGED', userId + ' password changed by ' + (window.currentUser || 'DPI'));
_sbLogPwReset(userId, oldPass, newPass, window.currentUser || 'DPI');
const PW_RESET_LOG_KEY = 'dpi_pw_reset_log';
const resetLog = JSON.parse(localStorage.getItem(PW_RESET_LOG_KEY) || '[]');
resetLog.unshift({ userId, dateTime: new Date().toLocaleString('en-IN',{hour12:true}), timestamp: Date.now(), resetBy: window.currentUser || 'DPI', oldPass, newPass });
localStorage.setItem(PW_RESET_LOG_KEY, JSON.stringify(resetLog));
errDiv.innerHTML = '<span style="color:#2e7d32;font-weight:bold;">✅ ' + userId + ' Password saved to cloud!</span>';
setTimeout(() => {
document.getElementById('uniEditPassModal')?.remove();
const tab = userType === 'DPI' ? 'dpi' : userType === 'JD' ? 'jd' : 'deo';
buildDistPassTable(tab);
showDistPassTab(tab);
}, 1500);
}
function filterDistPassTable(val) {
const q = val.trim().toUpperCase();
const cards = document.querySelectorAll('#distPassTableBody [data-id]');
cards.forEach(card => {
const id = card.dataset.id || '';
const label = card.dataset.label || '';
card.style.display = (!q || id.includes(q) || label.includes(q)) ? '' : 'none';
});
}
document.getElementById('districtPasswordPanel').addEventListener('click', function(e){
if(e.target === this) closeDistrictPasswordPanel();
});

// ══════════════════════════════════════════════════════
// 🔄 PUSH-PULL TRANSFER SYSTEM
// ══════════════════════════════════════════════════════

const PUSH_PULL_KEY = 'ms_transfer_pushpull';
var _currentPullRecord = null;

function openPushPullModal() {
  document.getElementById('pushPullModal').style.display = 'flex';
  switchPPTab('push');
  document.getElementById('pushUniqueId').value = '';
  document.getElementById('pushSearchResult').style.display = 'none';
  document.getElementById('pushMsg').innerHTML = '';
}

function closePushPullModal() {
  document.getElementById('pushPullModal').style.display = 'none';
}

function switchPPTab(tab) {
  document.getElementById('ppPane_push').style.display = tab === 'push' ? 'block' : 'none';
  document.getElementById('ppPane_pull').style.display = tab === 'pull' ? 'block' : 'none';
  document.getElementById('ppTab_push').style.background = tab === 'push' ? '#7c3aed' : '#f3f4f6';
  document.getElementById('ppTab_push').style.color = tab === 'push' ? 'white' : '#374151';
  document.getElementById('ppTab_pull').style.background = tab === 'pull' ? '#7c3aed' : '#f3f4f6';
  document.getElementById('ppTab_pull').style.color = tab === 'pull' ? 'white' : '#374151';
  if (tab === 'pull') loadPullList();
}

function searchForPush() {
  const uid = document.getElementById('pushUniqueId').value.trim().toUpperCase();
  if (!uid) { myAlert('❌ Unique ID डालें!'); return; }
  const row = window.fullData.find(r => r.uniqueId === uid || r.field3 === uid);
  if (!row) { document.getElementById('pushMsg').innerHTML = '<span style="color:red;">❌ Record नहीं मिला!</span>'; return; }
  document.getElementById('pushMsg').innerHTML = '';
  document.getElementById('pushEmployeeInfo').innerHTML = `
    <b>नाम:</b> ${row.field4 || '-'} &nbsp;|&nbsp;
    <b>G.N.:</b> ${row.field2 || '-'} &nbsp;|&nbsp;
    <b>वर्तमान जिला:</b> ${row.field22 || '-'} &nbsp;|&nbsp;
    <b>शाला:</b> ${row.field20 || '-'}
  `;
  document.getElementById('pushSearchResult').dataset.uid = row.uniqueId;
  document.getElementById('pushSearchResult').style.display = 'block';
}

async function doPush() {
  const uid = document.getElementById('pushSearchResult').dataset.uid;
  const toDistrict = document.getElementById('pushToDistrict').value.trim();
  if (!toDistrict) { myAlert('❌ नया जिला चुनें!'); return; }

  const row = window.fullData.find(r => r.uniqueId === uid);
  if (!row) { myAlert('❌ Record नहीं मिला!'); return; }

  const fromDistrict = _realtimeDistrict();
  const pushedBy = window.currentUser || 'UNKNOWN';
  const timestamp = new Date().toLocaleString('en-IN', {hour12:true});

  // D1 mein push entry save karo
  const pushEntry = {
    unique_id: 'TRANSFER_' + uid + '_' + Date.now(),
    data: {
      transferType: 'PUSH',
      employeeUid: uid,
      employeeName: row.field4 || '',
      employeeGN: row.field2 || '',
      fromDistrict: fromDistrict,
      toDistrict: toDistrict,
      pushedBy: pushedBy,
      pushedAt: timestamp,
      status: 'PENDING',
      currentSchool: row.field20 || '',
      currentUdise: row.field21 || '',
    },
    created_at: new Date().toISOString(),
    status: 'TRANSFER_PUSH',
    deleted_by: '',
    deletion_timestamp: ''
  };

  try {
    document.getElementById('pushMsg').innerHTML = '<span style="color:#7c3aed;">⏳ Push हो रहा है...</span>';
    const res = await fetch(`${WORKER_URL}/migrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [pushEntry] })
    });
    if (!res.ok) throw new Error(await res.text());
    document.getElementById('pushMsg').innerHTML = `<span style="color:green;">✅ Push सफल! ${toDistrict} जिले को Pull करने की सूचना दें।</span>`;
    document.getElementById('pushSearchResult').style.display = 'none';
    document.getElementById('pushUniqueId').value = '';
  } catch(e) {
    document.getElementById('pushMsg').innerHTML = `<span style="color:red;">❌ Error: ${e.message}</span>`;
  }
}

async function loadPullList() {
  const pullListEl = document.getElementById('pullList');
  if (!pullListEl) return;
  pullListEl.innerHTML = '<div style="color:#6b7280;text-align:center;padding:20px;">⏳ लोड हो रहा है...</div>';
  try {
    let allTransfers = [];
    // Transfer entries end mein hain — last 500 records check karo
    const totalRecords = window.fullData ? window.fullData.length + 50 : 53000;
    const checkFrom = Math.max(0, totalRecords - 500);
    for(let from = checkFrom; ; from += 1000) {
      const r = await fetch(`${WORKER_URL}/gradation_list?from=${from}&to=${from+999}`, {headers: _SB_HDR});
      const d = await r.json();
      const transfers = d.filter(x => x.data && x.data.transferType === 'PUSH' && x.data.status === 'PENDING');
      allTransfers = allTransfers.concat(transfers);
      if(d.length < 1000) break;
    }

    if(allTransfers.length === 0) {
      pullListEl.innerHTML = '<div style="color:#6b7280;text-align:center;padding:30px;">📭 कोई Transfer Entry नहीं है।</div>';
      return;
    }

    const myDistrict = _realtimeDistrict();
    let html = `<table style="width:100%;border-collapse:collapse;font-size:12px;">
      <thead><tr style="background:#f3f4f6;">
        <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">नाम</th>
        <th style="padding:8px;border:1px solid #e5e7eb;">G.N.</th>
        <th style="padding:8px;border:1px solid #e5e7eb;">से जिला</th>
        <th style="padding:8px;border:1px solid #e5e7eb;">को जिला</th>
        <th style="padding:8px;border:1px solid #e5e7eb;">Push किया</th>
        <th style="padding:8px;border:1px solid #e5e7eb;">समय</th>
        <th style="padding:8px;border:1px solid #e5e7eb;">Action</th>
      </tr></thead><tbody>`;

    allTransfers.forEach(t => {
      const d = t.data;
      const canPull = myDistrict === d.toDistrict || window.currentUser === 'DPI';
      const rowBg = d.toDistrict === myDistrict ? '#f0fdf4' : 'white';
      html += `<tr style="background:${rowBg};">
        <td style="padding:8px;border:1px solid #e5e7eb;font-weight:600;">${d.employeeName}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${d.employeeGN}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;color:#dc2626;">${d.fromDistrict}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;color:#16a34a;font-weight:700;">${d.toDistrict}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${d.pushedBy}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;font-size:11px;">${d.pushedAt}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">
          ${canPull ? `<button onclick="openPullInput('${t.unique_id}','${d.employeeUid}','${d.employeeName}','${d.toDistrict}','${encodeURIComponent(JSON.stringify(d))}')" 
            style="background:#7c3aed;color:white;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-weight:700;">📥 PULL</button>` 
            : '<span style="color:#9ca3af;font-size:11px;">—</span>'}
        </td>
      </tr>`;
    });

    html += '</tbody></table>';
    pullListEl.innerHTML = html;
  } catch(e) {
    pullListEl.innerHTML = `<div style="color:red;">❌ Error: ${e.message}</div>`;
  }
}

function openPullInput(transferId, empUid, empName, toDistrict, transferData) {
  _currentPullRecord = { transferId, empUid, empName, toDistrict, transferData: JSON.parse(decodeURIComponent(transferData)) };
  document.getElementById('pullInputEmployeeInfo').innerHTML = `
    <b>नाम:</b> ${empName}<br>
    <b>नया जिला:</b> ${toDistrict}
  `;
  document.getElementById('pullSchoolName').value = '';
  document.getElementById('pullUdiseCode').value = '';
  document.getElementById('pullInputMsg').innerHTML = '';
  document.getElementById('pullInputModal').style.display = 'flex';
}

async function doPull() {
  if (!_currentPullRecord) return;
  const school = document.getElementById('pullSchoolName').value.trim();
  const udise = document.getElementById('pullUdiseCode').value.trim();
  if (!school) { document.getElementById('pullInputMsg').innerHTML = '<span style="color:red;">❌ शाला का नाम डालें!</span>'; return; }
  if (!udise) { document.getElementById('pullInputMsg').innerHTML = '<span style="color:red;">❌ UDISE Code डालें!</span>'; return; }

  const { transferId, empUid, toDistrict } = _currentPullRecord;
  const timestamp = new Date().toLocaleString('en-IN', {hour12:true});
  const actionBy = `${_realtimeDistrict()} | ${timestamp}`;

  try {
    document.getElementById('pullInputMsg').innerHTML = '<span style="color:#7c3aed;">⏳ Update हो रहा है...</span>';

    // 1. D1 se fresh record fetch karo
    const fetchRes = await fetch(`${WORKER_URL}/gradation_list?unique_id=eq.${encodeURIComponent(empUid)}`, {headers: _SB_HDR});
    const fetchData = await fetchRes.json();
    // ✅ FIX: Worker single object return karta hai, array nahi
    const fetchRow = Array.isArray(fetchData) ? fetchData[0] : fetchData;
    if (!fetchRow || !fetchRow.data) throw new Error('Employee record नहीं मिला!');
    
    // 2. Sirf data column update karo
    const freshData = { ...fetchRow.data };
    freshData.field20 = school;
    freshData.field21 = udise;
    freshData.field22 = toDistrict;
    freshData.field28 = 'UPDATED';
    freshData.field29 = actionBy;

    const updateRes = await fetch(`${WORKER_URL}/gradation_list?unique_id=eq.${encodeURIComponent(empUid)}`, {
      method: 'PATCH',
      headers: _SB_HDR,
      body: JSON.stringify({ data: freshData })
    });
    if (!updateRes.ok) throw new Error(await updateRes.text());

    // 3. Transfer entry ko COMPLETED mark karo
    const transferFetch = await fetch(`${WORKER_URL}/gradation_list?unique_id=eq.${encodeURIComponent(transferId)}`, {headers: _SB_HDR});
    const transferData = await transferFetch.json();
    // ✅ FIX: Worker single object return karta hai
    const transferRow = Array.isArray(transferData) ? transferData[0] : transferData;
    if (transferRow && transferRow.data) {
      const tData = { ...transferRow.data, status: 'COMPLETED' };
      await fetch(`${WORKER_URL}/gradation_list?unique_id=eq.${encodeURIComponent(transferId)}`, {
        method: 'PATCH',
        headers: _SB_HDR,
        body: JSON.stringify({ data: tData })
      });
    }

    // 4. Local fullData update karo
    const idx = window.fullData.findIndex(r => r.uniqueId === empUid);
    if (idx !== -1) {
      Object.assign(window.fullData[idx], freshData);
      window.filteredData = [...window.fullData];
      renderVirtual();
    }

    document.getElementById('pullInputMsg').innerHTML = '<span style="color:green;">✅ Pull सफल! Record अपडेट हो गया।</span>';
    setTimeout(() => {
      document.getElementById('pullInputModal').style.display = 'none';
      loadPullList();
    }, 1500);

  } catch(e) {
    document.getElementById('pullInputMsg').innerHTML = `<span style="color:red;">❌ Error: ${e.message}</span>`;
  }
}
