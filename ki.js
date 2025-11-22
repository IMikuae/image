const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ytDlpPath = path.join(__dirname, "yt-dlp.exe");
const ytDlpWrap = new YTDlpWrap(ytDlpPath);

rl.question("Masukkan URL YouTube: ", (url) => {
  if (!url.startsWith("http")) {
    console.log("❌ URL tidak valid!");
    rl.close();
    return;
  }

  console.log("⬇️ Sedang mengunduh audio tanpa konversi...");

  const output = "%(title)s.%(ext)s"; // nama file sesuai judul dan ekstensi asli

  ytDlpWrap
    .exec([
      url,
      "-f", "bestaudio",  // ambil audio terbaik tanpa ekstrak
      "-o", output       // simpan nama sesuai judul dan ekstensi asli
    ])
    .on("progress", (progress) => {
      if (progress.percent) {
        process.stdout.write(`\r📥 ${progress.percent.toFixed(2)}% selesai (ETA: ${progress.eta}s)`);
      }
    })
    .on("error", (err) => {
      console.error("\n❌ Terjadi error:", err);
      rl.close();
    })
    .on("close", () => {
      console.log("\n✅ Download selesai! File audio sudah tersimpan.");
      rl.close();
    });
});

//https://youtu.be/t05Bd6xSn6c?si=4JwRkSFdHonwPb1E