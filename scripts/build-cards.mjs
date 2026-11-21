// Generates the SVG cards used by README.md.
//
//   node scripts/build-cards.mjs           live data (needs GITHUB_TOKEN; GH_USER optional)
//   node scripts/build-cards.mjs --mock    placeholder data, for previewing the design
//
// All text is converted to vector paths with opentype.js, so the cards look the
// same everywhere (GitHub does not load web fonts inside <img> SVGs).

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

// ───────────────────────── config ─────────────────────────
const USER = process.env.GH_USER || "MohamedShiras";
const PROFILE = {
  label: "Software Engineering Undergraduate",
  first: "Mohamed",
  last: "Shiras",
  bio: "Full-stack developer building secure, scalable, and real-world problem-solving applications.",
  status: "Open to collaboration",
  site: "mohamedshiras.dev",
};
// Repos shown under "What I'm building". Falls back to your most-starred repos
// if any of these can't be found.
const FEATURED = ["Serendib", "AuctionXpress", "student-management-system"];

const C = {
  cream: "#f4f3ee",
  line: "#e3e1d8",
  hair: "#dcdad0",
  ink: "#111110",
  body: "#3b3b37",
  muted: "#8b8a84",
  accent: "#6C63FF",
  coral: "#FF5A47",
  amber: "#FFC62E",
  green: "#2fb36d",
  gray: "#c9c7bd",
  heat: ["#e7e5f7", "#cfcbf8", "#a8a1fb", "#6C63FF", "#3a2fd9"],
};
const W = 830; // full-width card
const W3 = 276; // one of three side-by-side cards (3 x 276 = 828)

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "cards");
const MOCK = process.argv.includes("--mock");

// ───────────────────────── fonts → paths ─────────────────────────
async function loadFont(file) {
  const b = await readFile(join(HERE, "..", "fonts", file));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}
const F = {
  serif: await loadFont("serif.woff"),
  italic: await loadFont("serif-italic.woff"),
  sans: await loadFont("sans.woff"),
  mono: await loadFont("mono.woff"),
};

const glyphs = (font, str) => [...str].map((c) => font.charToGlyph(c)).filter((g) => g.index !== 0);

function measure(font, str, size, ls = 0) {
  const gs = glyphs(font, str);
  const k = size / font.unitsPerEm;
  let w = 0;
  gs.forEach((g, i) => {
    w += g.advanceWidth * k + ls;
    if (i < gs.length - 1) w += font.getKerningValue(g, gs[i + 1]) * k;
  });
  return w;
}

function pathData(font, str, x, y, size, ls = 0) {
  const gs = glyphs(font, str);
  const k = size / font.unitsPerEm;
  let d = "";
  gs.forEach((g, i) => {
    d += g.getPath(x, y, size, {}, font).toPathData(2);
    x += g.advanceWidth * k + ls;
    if (i < gs.length - 1) x += font.getKerningValue(g, gs[i + 1]) * k;
  });
  return d;
}

// One line of text made of one or more runs: [{ s, font, size, fill, ls }]
function line(x, y, runs, anchor = "start") {
  const widths = runs.map((r) => measure(F[r.font], r.s, r.size, r.ls || 0));
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = anchor === "end" ? x - total : anchor === "middle" ? x - total / 2 : x;
  let out = "";
  runs.forEach((r, i) => {
    const d = pathData(F[r.font], r.s, cx, y, r.size, r.ls || 0);
    if (d) out += `<path d="${d}" fill="${r.fill}"/>`;
    cx += widths[i];
  });
  return out;
}
const lineW = (runs) => runs.reduce((a, r) => a + measure(F[r.font], r.s, r.size, r.ls || 0), 0);

function wrap(font, text, size, maxW, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? cur + " " + w : w;
    if (measure(F[font], next, size) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let last = lines[maxLines - 1];
    while (last.length && measure(F[font], last + "…", size) > maxW) last = last.slice(0, -1);
    lines[maxLines - 1] = last.replace(/[\s,.;:]+$/, "") + "…";
  }
  return lines;
}

// ───────────────────────── svg helpers ─────────────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n) => Number(n).toLocaleString("en-US");

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
${body}
</svg>
`;

const card = (x, w, h, fill = C.cream, stroke = C.line) =>
  `<rect x="${x + 0.5}" y="0.5" width="${w - 1}" height="${h - 1}" rx="16" fill="${fill}" stroke="${stroke}"/>`;

const arrowNE = (x, y, s, color) =>
  `<path d="M${x} ${y + s} L${x + s} ${y} M${x + s * 0.15} ${y} H${x + s} V${y + s * 0.85}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
const arrowE = (x, y, s, color) =>
  `<path d="M${x} ${y} H${x + s} M${x + s * 0.6} ${y - s * 0.38} L${x + s} ${y} L${x + s * 0.6} ${y + s * 0.38}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
const star = (cx, cy, r, color) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.42;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${color}"/>`;
};

const mono = (s, size = 10, fill = C.muted, ls = 1.2) => ({ s: s.toUpperCase(), font: "mono", size, fill, ls });

// ───────────────────────── data ─────────────────────────
async function gql(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error("GitHub API error: " + JSON.stringify(json.errors || res.status));
  return json.data;
}

async function liveData() {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN is not set (use --mock to preview).");
  const d = await gql(
    `query($login:String!){
      user(login:$login){
        repositories(ownerAffiliations:OWNER, privacy:PUBLIC, isFork:false, first:100,
                     orderBy:{field:STARGAZERS, direction:DESC}){
          totalCount
          nodes{ name description stargazerCount primaryLanguage{ name color } }
        }
        contributionsCollection{
          contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount } } }
        }
      }
    }`,
    { login: USER }
  );
  const u = d.user;
  const cal = u.contributionsCollection.contributionCalendar;
  return {
    repoCount: u.repositories.totalCount,
    repos: u.repositories.nodes,
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) => w.contributionDays.map((x) => ({ date: x.date, count: x.contributionCount }))),
  };
}

function mockData() {
  // deterministic placeholder data — NOT real numbers
  let seed = 7;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 52 * 7 - end.getUTCDay());
  const weeks = [];
  let total = 0;
  for (let w = 0; w < 53; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(start);
      dt.setUTCDate(start.getUTCDate() + w * 7 + d);
      if (dt > end) continue;
      const busy = Math.sin(w / 5) * 0.5 + 0.5;
      const r = rnd();
      const count = r < 0.3 ? 0 : Math.round(rnd() * 9 * busy + (r > 0.93 ? 8 : 0));
      total += count;
      col.push({ date: dt.toISOString().slice(0, 10), count });
    }
    weeks.push(col);
  }
  return {
    repoCount: 27,
    total,
    weeks,
    repos: [
      { name: "Serendib", description: "An Android-based apartment management application designed to manage residents, maintenance requests, announcements, and common facility reservations efficiently.", stargazerCount: 28, primaryLanguage: { name: "Java", color: "#b07219" } },
      { name: "AuctionXpress", description: "An auctioning online portal which eliminates manual process into an seamless online experience", stargazerCount: 2, primaryLanguage: { name: "PHP", color: "#4F5D95" } },
      { name: "student-management-system", description: "Java web application demonstrating core Data Structures (Custom Linked List) and Web Development (Servlets/JSP) without external frameworks", stargazerCount: 2, primaryLanguage: { name: "Java", color: "#b07219" } },
      { name: "ATMManagementSystem", description: "A Simple Automated Teller Machine, Implemented using Java", stargazerCount: 0, primaryLanguage: { name: "Java", color: "#b07219" } },
      { name: "E-Commerce-Site", description: "", stargazerCount: 0, primaryLanguage: { name: "C#", color: "#178600" } },
    ],
  };
}

function analyse(weeks) {
  const flat = weeks.flat();
  const max = Math.max(1, ...flat.map((d) => d.count));
  const level = (n) => (n === 0 ? 0 : n <= max * 0.25 ? 1 : n <= max * 0.5 ? 2 : n <= max * 0.75 ? 3 : 4);

  let longest = 0, run = 0;
  for (const d of flat) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  for (let i = flat.length - 1; i >= 0; i--) {
    if (flat[i].count > 0) current++;
    else if (i === flat.length - 1) continue; // today may still be empty
    else break;
  }
  const busiest = flat.reduce((a, b) => (b.count > a.count ? b : a), flat[0]);
  const byMonth = new Map();
  for (const d of flat) byMonth.set(d.date.slice(0, 7), (byMonth.get(d.date.slice(0, 7)) || 0) + d.count);
  const months = [...byMonth.entries()].slice(-12).map(([k, v]) => ({
    label: new Date(k + "-01T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
    count: v,
  }));
  return {
    level, longest, current, busiest, months,
    daysWith: flat.filter((d) => d.count > 0).length,
    totalDays: flat.length,
  };
}

const listJoin = (a) => (a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);

// ───────────────────────── cards ─────────────────────────
function hero() {
  const h = 296;
  const nameRuns = [
    { s: PROFILE.first + " ", font: "serif", size: 104, fill: C.ink },
    { s: PROFILE.last, font: "italic", size: 104, fill: C.ink },
  ];
  const bio = wrap("sans", PROFILE.bio, 17, 540, 2);
  const body = `${card(0, W, h)}
<rect x="40" y="46" width="8" height="8" fill="${C.accent}"/>
${line(58, 55, [mono(PROFILE.label, 10.5)])}
<circle cx="${W - 40 - 6 - measure(F.mono, PROFILE.status.toUpperCase(), 10.5, 1.2) - 10}" cy="50.5" r="4" fill="${C.green}"/>
${line(W - 40, 55, [mono(PROFILE.status, 10.5)], "end")}
${line(36, 150, nameRuns)}
${bio.map((l, i) => line(40, 196 + i * 24, [{ s: l, font: "sans", size: 17, fill: C.body }])).join("")}
${line(40, 258, [{ s: PROFILE.site, font: "mono", size: 12, fill: C.body }])}
${arrowNE(40 + measure(F.mono, PROFILE.site, 12) + 8, 248, 9, C.accent)}`;
  return svg(W, h, body, `Mohamed Shiras. ${PROFILE.label}. ${PROFILE.bio}`);
}

function heatmap(weeks, a) {
  const h = 258;
  const left = 40, gridW = W - 80;
  const step = gridW / weeks.length;
  const size = step - 3.2;
  const top = 98;
  let cells = "", months = "", lastMonth = "";
  const legendW = 5 * 14 + 70;
  weeks.forEach((col, wi) => {
    const m = col[0].date.slice(0, 7);
    if (m !== lastMonth) {
      const label = new Date(m + "-01T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      const x = left + wi * step;
      if (wi > 0 && x < W - 40 - legendW - 20) months += line(x, top + 7 * step + 20, [mono(label, 8.5, C.muted, 0.8)]);
      lastMonth = m;
    }
    col.forEach((d) => {
      const dow = new Date(d.date + "T00:00:00Z").getUTCDay();
      cells += `<rect x="${(left + wi * step).toFixed(1)}" y="${(top + dow * step).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" rx="3" fill="${C.heat[a.level(d.count)]}"><title>${d.count} on ${d.date}</title></rect>`;
    });
  });
  const ly = top + 7 * step + 20;
  const lx = W - 40 - 5 * 14 - 34;
  const legend =
    line(lx - 6, ly, [mono("less", 8.5, C.muted, 0.8)], "end") +
    C.heat.map((c, i) => `<rect x="${lx + i * 14}" y="${ly - 9}" width="10.5" height="10.5" rx="2.5" fill="${c}"/>`).join("") +
    line(lx + 5 * 14 + 2, ly, [mono("more", 8.5, C.muted, 0.8)]);
  const body = `${card(0, W, h)}
${line(40, 66, [
    { s: "Every day, ", font: "serif", size: 36, fill: C.ink },
    { s: "in purple", font: "italic", size: 36, fill: C.accent },
  ])}
${line(W - 40, 58, [mono("Refreshed daily", 9.5)], "end")}
${cells}${months}${legend}`;
  return svg(W, h, body, "Contribution graph for the last year, refreshed daily");
}

function activity(a, total) {
  const h = 380;
  const chartL = 40, chartW = 470, baseY = 316, maxH = 124;
  const max = Math.max(1, ...a.months.map((m) => m.count));
  const slot = chartW / a.months.length;
  const bw = slot - 9;
  const bars = a.months
    .map((m, i) => {
      const isMax = m.count === max;
      const isLast = i === a.months.length - 1;
      const bh = Math.max(m.count ? 4 : 2, (m.count / max) * maxH);
      const x = chartL + i * slot;
      const fill = isMax ? C.accent : isLast ? C.gray : C.ink;
      return (
        `<rect x="${x.toFixed(1)}" y="${(baseY - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${fill}"/>` +
        (isMax ? line(x + bw / 2, baseY - bh - 8, [{ s: fmt(m.count), font: "mono", size: 9.5, fill: C.accent }], "middle") : "") +
        line(x + bw / 2, baseY + 20, [mono(m.label, 8.5, C.muted, 0.6)], "middle")
      );
    })
    .join("");

  const colX = 590;
  const big = (value, unit, y, unitFill = C.muted) =>
    line(colX, y, [
      { s: value, font: "serif", size: 46, fill: C.ink },
      ...(unit ? [{ s: unit, font: "italic", size: 46, fill: unitFill }] : []),
    ]);
  const sub = (s, y) => line(colX, y, [{ s, font: "mono", size: 10, fill: C.muted }]);
  const rule = (y) => `<line x1="${colX}" y1="${y}" x2="${W - 40}" y2="${y}" stroke="${C.hair}"/>`;

  const body = `${card(0, W, h)}
${line(40, 56, [mono("The last 12 months on GitHub", 10, C.muted, 1.2)])}
${line(40, 126, [
    { s: fmt(total) + " ", font: "serif", size: 64, fill: C.ink },
    { s: "contributions", font: "italic", size: 64, fill: C.ink },
  ])}
${bars}
${big(String(a.current), a.current === 1 ? " day" : " days", 134)}
${sub(`current streak · longest ${a.longest}`, 156)}
${rule(182)}
${big(String(a.daysWith), " / " + a.totalDays, 238)}
${sub("days with a commit", 260)}
${rule(286)}
${big(String(a.busiest.count), "", 342)}
${sub("on the busiest day", 364)}`;
  return svg(W, h, body, `${fmt(total)} contributions in the last 12 months. Current streak ${a.current} days, longest ${a.longest}. ${a.daysWith} of ${a.totalDays} days with a commit. Busiest day ${a.busiest.count}.`);
}

// inset logic so three cards line up with the full-width cards above them
const insets = (i) => [i === 0 ? 0 : 4, i === 2 ? 0 : 4];

function statCard(i, color, ink, label, value, unit, desc) {
  const h = 184;
  const [l, r] = insets(i);
  const x = l, w = W3 - l - r;
  const pad = 24;
  const lines = wrap("sans", desc, 12.5, w - pad * 2, 3);
  const body = `${card(x, w, h, color, color)}
${line(x + pad, 38, [mono(label, 10, ink, 1.4)])}
${arrowE(x + w - pad - 11, 34, 11, ink)}
${line(x + pad, 100, [{ s: `${value} ${unit}`, font: "italic", size: 44, fill: ink }])}
${lines.map((t, k) => line(x + pad, 128 + k * 17, [{ s: t, font: "sans", size: 12.5, fill: ink }])).join("")}`;
  return svg(W3, h, body, `${label}: ${value} ${unit}. ${desc}`);
}

function sectionTitle(inkColor) {
  const h = 70;
  const body = line(6, 48, [
    { s: "What I’m ", font: "serif", size: 36, fill: inkColor },
    { s: "building", font: "italic", size: 36, fill: inkColor },
  ]);
  return svg(W, h, body, "What I’m building");
}

function repoCard(i, r) {
  const h = 212;
  const [l, rr] = insets(i);
  const x = l, w = W3 - l - rr;
  const pad = 24;
  const lang = r.primaryLanguage;
  // shrink the repo name until it fits
  let size = 30;
  while (size > 16 && measure(F.serif, r.name, size) > w - pad * 2 - 4) size -= 1;
  const desc = wrap("sans", r.description || "No description yet.", 12.5, w - pad * 2, 4);
  const body = `${card(x, w, h)}
${lang ? `<circle cx="${x + pad + 4}" cy="35" r="4" fill="${lang.color || C.accent}"/>${line(x + pad + 14, 39, [mono(lang.name, 9.5, C.muted, 1.2)])}` : ""}
${arrowNE(x + w - pad - 9, 30, 9, C.ink)}
${line(x + pad, 80, [{ s: r.name, font: "serif", size, fill: C.ink }])}
${desc.map((t, k) => line(x + pad, 108 + k * 17, [{ s: t, font: "sans", size: 12.5, fill: C.body }])).join("")}
${star(x + pad + 5, h - 26, 5.5, C.ink)}
${line(x + pad + 16, h - 22, [{ s: String(r.stargazerCount), font: "mono", size: 11, fill: C.body }])}`;
  return svg(W3, h, body, `${r.name}. ${r.description || ""}`);
}

// ───────────────────────── main ─────────────────────────
const data = MOCK ? mockData() : await liveData();
const a = analyse(data.weeks);
const stars = data.repos.reduce((s, r) => s + r.stargazerCount, 0);
const topRepo = [...data.repos].sort((x, y) => y.stargazerCount - x.stargazerCount)[0];
const langCount = {};
for (const r of data.repos) if (r.primaryLanguage) langCount[r.primaryLanguage.name] = (langCount[r.primaryLanguage.name] || 0) + 1;
const langs = Object.entries(langCount).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([n]) => n);

const picked = FEATURED.map((n) => data.repos.find((r) => r.name.toLowerCase() === n.toLowerCase())).filter(Boolean);
for (const r of data.repos) {
  if (picked.length >= 3) break;
  if (!picked.includes(r) && r.name.toLowerCase() !== USER.toLowerCase()) picked.push(r);
}

const files = {
  "hero.svg": hero(),
  "heatmap.svg": heatmap(data.weeks, a),
  "activity.svg": activity(a, data.total),
  "stat-repos.svg": statCard(0, C.accent, "#ffffff", "Build", fmt(data.repoCount), "repos",
    langs.length ? `Public repositories on GitHub, mostly in ${listJoin(langs)}.` : "Public repositories on GitHub."),
  "stat-stars.svg": statCard(1, C.coral, "#ffffff", "Stars", fmt(stars), stars === 1 ? "star" : "stars",
    topRepo && topRepo.stargazerCount > 0 ? `Earned across my repositories, led by ${topRepo.name}.` : "Earned across my public repositories."),
  "stat-commits.svg": statCard(2, C.amber, C.ink, "Activity", fmt(data.total), "this year",
    "Contributions on GitHub over the last 12 months: commits, pull requests and reviews."),
  "title-projects-light.svg": sectionTitle(C.ink),
  "title-projects-dark.svg": sectionTitle(C.cream),
};
picked.slice(0, 3).forEach((r, i) => (files[`repo-${i + 1}.svg`] = repoCard(i, r)));

await mkdir(OUT, { recursive: true });
for (const [name, content] of Object.entries(files)) await writeFile(join(OUT, name), content);
console.log(`${MOCK ? "[mock] " : ""}wrote ${Object.keys(files).length} cards to ${OUT}`);
