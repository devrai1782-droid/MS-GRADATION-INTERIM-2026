// ═══════════════════════════════════════════════════
//  MS GRADATION ERP — API Helper (D1 Worker version)
//  Supabase Edge Function → Cloudflare Worker
// ═══════════════════════════════════════════════════

// Worker URL — same jo app_d1.js mein hai
const API_URL = "https://ms-gradation-api.devrai1782.workers.dev";

// ── Token storage ──
function _getToken()   { return sessionStorage.getItem("ums_token"); }
function _setToken(t)  { sessionStorage.setItem("ums_token", t); }
function _clearToken() { sessionStorage.removeItem("ums_token"); }

// ── DPI Admin check ──
function isDpiAdmin() { return window.currentUser === "DPI"; }

// ═══════════════════════════════════════════════════
//  CLEAR ALL DATA — Worker D1 version
// ═══════════════════════════════════════════════════
async function patchedClearAllData() {
  const pwd = prompt("⚠️ Confirm: Enter Password to CLEAR ALL DATA:");
  if (pwd === null) return;
  if (pwd !== "1782") { myAlert("❌ Invalid Password!"); return; }
  if (!confirm("🚨 Are you sure? This will permanently delete ALL records!")) return;

  try {
    // D1 Worker se delete karo
    const res = await fetch(`${API_URL}/gradation_list`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(await res.text());

    // UI reset
    window.allData      = [];
    window.fullData     = [];
    window.filteredData = [];
    const tbody = document.getElementById("tableBody");
    if (tbody) tbody.innerHTML = "";
    if (typeof renderVirtual === "function") renderVirtual();

    myAlert("✅ All data cleared successfully!");
  } catch (err) {
    console.error(err);
    myAlert("❌ Error clearing data: " + err.message);
  }
}
