

const projectId = 'website-systutor';
const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/tutorials`;

async function testSecurity() {
  console.log("🕵️ MENGUJI KEAMANAN FIREBASE (SIMULASI GOOGLEBOT/HACKER)");
  console.log("---------------------------------------------------------");
  console.log("Status: TIDAK LOGIN (Anonim)");
  console.log("Mencoba mengambil SEMUA artikel (termasuk draft)...\n");

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      console.log("❌ GAWAT! Database Anda bocor! Publik bisa melihat data ini:");
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log("✅ AMAN! Firebase memblokir akses karena aturan keamanan Anda.");
      console.log("Pesan Error dari Firebase:");
      console.log(`[Status ${response.status}] ${data.error.message}`);
    }
  } catch (error) {
    console.log("Terjadi kesalahan jaringan:", error);
  }
}

testSecurity();
