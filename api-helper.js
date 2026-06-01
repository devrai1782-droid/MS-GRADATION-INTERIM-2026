// ═══════════════════════════════════════════════════
//  MS GRADATION ERP — API Helper
//  Ye file app.js ke TOP mein add karo
//  Direct Supabase calls ki jagah ye use hoga
// ═══════════════════════════════════════════════════

// ══════════════════════════════════════════════════
//  🔧 ENVIRONMENT SWITCH
//  Testing ke liye : IS_TESTING = true
//  Production ke liye : IS_TESTING = false
// ══════════════════════════════════════════════════
const IS_TESTING = true;

const API_URL = IS_TESTING
  ? "https://lvblkqwftuzbysjvzffm.supabase.co/functions/v1/ums-api"   // 🧪 TESTING
  : "https://dgzdessdyrxhsbjxeahi.supabase.co/functions/v1/ums-api";  // 🚀 PRODUCTION

// ── Token storage ──
function _getToken()       { return sessionStorage.getItem("ums_token"); }
function _setToken(t)      { sessionStorage.setItem("ums_token", t); }
function _clearToken()     { sessionStorage.removeItem("ums_token"); }

// ── Core API caller ──
async function apiCall(action, body = {}) {
  const token = _getToken();
  const headers = {
    "Content-Type": "application/json",
    "x-action": action,
  };
  if (token) headers["Authorization"] = "Bearer " + token;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "API Error");
    return json;
  } catch (e) {
    console.error(`API [${action}] failed:`, e.message);
    throw e;
  }
}

// ═══════════════════════════════════════════════════
//  PUBLIC API FUNCTIONS — Inhe app.js mein use karo
// ═══════════════════════════════════════════════════

// ── Login ──
async function apiLogin(userId, password) {
  const res = await apiCall("login", { userId, password });
  _setToken(res.token);
  window.currentUser     = res.userId;
  window.currentLevel    = res.level;
  window.currentLocation = res.location;
  return res;
}

// ── Logout ──
function apiLogout() {
  _clearToken();
  window.currentUser = null;
  window.currentLevel = null;
}

// ── Data fetch ──
async function apiGetData() {
  return await apiCall("getData");
}

// ── Record save ──
async function apiSaveRecord(record) {
  return await apiCall("saveRecord", { record });
}

// ── Record delete ──
async function apiDeleteRecord(id) {
  return await apiCall("deleteRecord", { id });
}

// ── Password change ──
async function apiChangePassword(targetUserId, newPassword) {
  return await apiCall("changePassword", { targetUserId, newPassword });
}

// ── Users list (DPI only) ──
async function apiGetUsers() {
  return await apiCall("getUsers");
}

// ── Settings ──
async function apiGetSettings() {
  return await apiCall("getSettings");
}
async function apiSaveSettings(key, value) {
  return await apiCall("saveSettings", { key, value });
}

// ── Token verify (page load pe check karo) ──
async function apiVerifySession() {
  if (!_getToken()) return null;
  try {
    return await apiCall("verifyToken");
  } catch {
    _clearToken();
    return null;
  }
}

// ═══════════════════════════════════════════════════
//  app.js mein YE LINES HATAO (insecure):
//
//  const SUPABASE_URL = "https://...";
//  const SUPABASE_KEY = "eyJ...";
//  const supabaseClient = supabase.createClient(...);
//  const districtCredentials = { ... };
//
//  AUR IN FUNCTIONS KO REPLACE KARO:
//
//  doLogin()       → apiLogin(userId, password)
//  loadData()      → apiGetData()
//  saveRecord()    → apiSaveRecord(record)
//  deleteRow()     → apiDeleteRecord(id)
//  changePassword()→ apiChangePassword(uid, pass)
// ═══════════════════════════════════════════════════

// ── DPI Admin check ──
function isDpiAdmin() {
  return window.currentUser === "DPI";
}

// ═══════════════════════════════════════════════════
//  CLEAR ALL DATA — STORAGE BUG FIX
//  Supabase Storage bucket 'documents' bhi clear karta hai
//  Pehle ye missing tha — sirf DB delete hota tha
// ═══════════════════════════════════════════════════

// ── Storage bucket ke saare files delete karo ──
async function apiClearAllStorage() {
  const SUPABASE_URL = IS_TESTING
    ? "https://lvblkqwftuzbysjvzffm.supabase.co"   // 🧪 TESTING
    : "https://dgzdessdyrxhsbjxeahi.supabase.co";  // 🚀 PRODUCTION

  // Supabase anon key — sirf storage list/delete ke liye (read+delete only)
  const SUPABASE_ANON_KEY = _getToken(); // JWT token use karenge jo already hai

  // Step 1: 'documents' bucket ke saare files list karo
  const listRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/list/documents`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + _getToken(),
      },
      body: JSON.stringify({ prefix: "", limit: 1000, offset: 0 }),
    }
  );

  if (!listRes.ok) {
    const err = await listRes.json();
    throw new Error("Storage list failed: " + (err.message || listRes.status));
  }

  const files = await listRes.json();
  if (!files || files.length === 0) {
    console.log("Storage already empty.");
    return { deleted: 0 };
  }

  // Step 2: Saare file paths collect karo (subfolders ke saath)
  const allPaths = [];

  async function listFolder(prefix) {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/list/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + _getToken(),
        },
        body: JSON.stringify({ prefix, limit: 1000, offset: 0 }),
      }
    );
    const items = await res.json();
    for (const item of items || []) {
      if (item.id) {
        // File hai
        allPaths.push(prefix ? prefix + "/" + item.name : item.name);
      } else {
        // Folder hai — recurse karo
        await listFolder(prefix ? prefix + "/" + item.name : item.name);
      }
    }
  }

  for (const item of files) {
    if (item.id) {
      allPaths.push(item.name); // root level file
    } else {
      await listFolder(item.name); // folder — andar jao
    }
  }

  if (allPaths.length === 0) return { deleted: 0 };

  // Step 3: Batch delete (max 100 at a time)
  let totalDeleted = 0;
  const BATCH = 100;
  for (let i = 0; i < allPaths.length; i += BATCH) {
    const batch = allPaths.slice(i, i + BATCH);
    const delRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/documents`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + _getToken(),
        },
        body: JSON.stringify({ prefixes: batch }),
      }
    );
    if (delRes.ok) totalDeleted += batch.length;
    else console.warn("Batch delete partial fail:", await delRes.text());
  }

  console.log(`✅ Storage cleared: ${totalDeleted} files deleted.`);
  return { deleted: totalDeleted };
}

// ── MAIN FIX: clearAllData ke baad ye call karo ──
// index.html mein "Clear All Data" button ka onclick ye hoga:
//
//   await patchedClearAllData()
//
async function patchedClearAllData() {
  // Step 1: Password prompt
  const pwd = prompt("⚠️ Confirm: Enter Password to CLEAR ALL DATA:");
  if (pwd === null) return;
  if (pwd !== "1782") {
    myAlert("❌ Invalid Password!");
    return;
  }

  if (!confirm("🚨 Are you sure? This will permanently delete ALL records AND uploaded documents!")) return;

  try {
    // Step 2: DB records delete
    // Table: gradation_list — primary key: "unique_id" (NOT "id")
    // supabaseClient global hai app.js se
    const { error } = await supabaseClient
      .from("gradation_list")
      .delete()
      .neq("unique_id", "XXXXXXXXXX_PLACEHOLDER_THAT_NEVER_EXISTS");
    // .neq ensures all rows are targeted (PostgREST needs a filter for bulk delete)

    if (error) throw error;

    // Step 3: ✅ Storage bucket bhi clear karo
    let storageResult = { deleted: 0 };
    try {
      storageResult = await apiClearAllStorage();
    } catch (storageErr) {
      console.warn("Storage clear partial fail:", storageErr.message);
    }

    // Step 4: UI reset
    window.allData      = [];
    window.fullData     = [];
    window.filteredData = [];
    const tbody = document.getElementById("tableBody");
    if (tbody) tbody.innerHTML = "";
    if (typeof renderVirtual === "function") renderVirtual();

    myAlert(`✅ All data cleared!\n📁 Documents deleted: ${storageResult.deleted}`);
  } catch (err) {
    console.error(err);
    myAlert("❌ Error clearing data: " + err.message);
  }
}
