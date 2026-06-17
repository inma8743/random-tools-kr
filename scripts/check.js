const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const required = [
  "index.html",
  "server-time.html",
  "naver-server-time.html",
  "ticketing-server-time.html",
  "class-registration-server-time.html",
  "ladder-game.html",
  "ladder-penalty.html",
  "roulette.html",
  "lunch-menu-roulette.html",
  "penalty-roulette.html",
  "random-picker.html",
  "presentation-order-picker.html",
  "duty-picker.html",
  "draw-lots.html",
  "team-random-picker.html",
  "coin-flip.html",
  "dice-roller.html",
  "number-randomizer.html",
  "about.html",
  "privacy.html",
  "feedback.html",
  "ads.txt",
  "robots.txt",
  "sitemap.xml",
  "assets/styles.css",
  "assets/app.js"
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error(`Missing files: ${missing.join(", ")}`);
  process.exit(1);
}

const htmlFiles = required.filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const needle of ["G-3EZW95TCSF", "ca-pub-4587553505034907", "<title>", "description"]) {
    if (!source.includes(needle)) {
      console.error(`${file} is missing ${needle}`);
      process.exit(1);
    }
  }
}

const linkTargets = [
  ["index.html", "https://type-lab-kr.vercel.app/attachment-test.html"],
  ["index.html", "https://type-lab-kr.vercel.app/contact-test.html"],
  ["index.html", "https://type-lab-kr.vercel.app/psychology-tests.html"],
  ["server-time.html", "https://type-lab-kr.vercel.app/attachment-test.html"],
  ["roulette.html", "https://type-lab-kr.vercel.app/attachment-test.html"],
  ["ladder-game.html", "https://type-lab-kr.vercel.app/attachment-test.html"],
  ["random-picker.html", "https://type-lab-kr.vercel.app/attachment-test.html"],
  ["server-time.html", "/coin-flip.html"],
  ["roulette.html", "/dice-roller.html"],
  ["ladder-game.html", "/number-randomizer.html"],
  ["random-picker.html", "/coin-flip.html"]
];

for (const [file, needle] of linkTargets) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (!source.includes(needle)) {
    console.error(`${file} is missing ${needle}`);
    process.exit(1);
  }
}

const ads = fs.readFileSync(path.join(root, "ads.txt"), "utf8").trim();
if (ads !== "google.com, pub-4587553505034907, DIRECT, f08c47fec0942fa0") {
  console.error("ads.txt content is invalid");
  process.exit(1);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const file of ["coin-flip.html", "dice-roller.html", "number-randomizer.html", "feedback.html"]) {
  if (!sitemap.includes(`https://random-tools-kr.vercel.app/${file}`)) {
    console.error(`sitemap.xml is missing ${file}`);
    process.exit(1);
  }
}

console.log("Static checks passed");
