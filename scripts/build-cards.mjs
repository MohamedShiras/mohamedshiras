// Generates the SVG cards used by README.md.
//
//   node scripts/build-cards.mjs           live data (needs GITHUB_TOKEN + GH_USER)
//   node scripts/build-cards.mjs --mock    placeholder data, for previewing the design
//
// No dependencies. Needs Node 18+.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ───────────────────────── config ─────────────────────────
const USER = process.env.GH_USER || "MohamedShiras";
const PROFILE = {
  name: "Mohamed Shiras",
  role: "Software Engineering Undergraduate | Full-Stack Developer",
  tagline: "Building secure, scalable, and real-world problem-solving applications.",
  place: "Sri Lanka",
  status: "Open to collaboration",
  handle: "shiras@github",
};
// Repos shown under "What I'm building". Falls back to your most-starred repos
// if any of these can't be found.
const FEATURED = ["Serendib", "AuctionXpress", "student-management-system"];

const C = {
  bg: "#0d1117",
  bar: "#161b22",
  border: "#30363d",
  text: "#e6edf3",
  soft: "#c9d1d9",
  muted: "#8b949e",
  accent: "#6C63FF",
  accentSoft: "#a9a3ff",
  green: "#3fb950",
  heat: ["#161b22", "#2d2a6e", "#4a43b8", "#6C63FF", "#a9a3ff"],
};
const FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const W = 830; // full-width card
const W3 = 274; // one of three side-by-side cards

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "cards");
const MOCK = process.argv.includes("--mock");

// ───────────────────────── helpers ─────────────────────────
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrap(text, max, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].slice(0, max - 1).replace(/[\s,.;:]+$/, "") + "…";
  }
  return lines;
}

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>text{font-family:${FONT}}</style>
${body}
</svg>
`;

const frame = (w, h) =>
  `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="12" fill="${C.bg}" stroke="${C.border}"/>`;

const fmt = (n) => Number(n).toLocaleString("en-US");

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
  const repos = u.repositories.nodes;
  const days = u.contributionsCollection.contributionCalendar.weeks.map((w) =>
    w.contributionDays.map((x) => ({ date: x.date, count: x.contributionCount }))
  );
  return {
    repoCount: u.repositories.totalCount,
    stars: repos.reduce((a, r) => a + r.stargazerCount, 0),
    total: u.contributionsCollection.contributionCalendar.totalContributions,
    weeks: days,
    repos,
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
      const count = r < 0.35 ? 0 : Math.round(rnd() * 9 * busy + (r > 0.93 ? 8 : 0));
      total += count;
      col.push({ date: dt.toISOString().slice(0, 10), count });
    }
    weeks.push(col);
  }
  return {
    repoCount: 27,
    stars: 32,
    total,
    weeks,
    repos: [
      { name: "Serendib", description: "An Android-based apartment management application designed to manage residents, maintenance requests, announcements, and common facility reservations efficiently.", stargazerCount: 28, primaryLanguage: { name: "Java", color: "#b07219" } },
      { name: "AuctionXpress", description: "An auctioning online portal which eliminates manual process into an seamless online experience", stargazerCount: 2, primaryLanguage: { name: "PHP", color: "#4F5D95" } },
      { name: "student-management-system", description: "Java web application demonstrating core Data Structures (Custom Linked List) and Web Development (Servlets/JSP) without external frameworks", stargazerCount: 2, primaryLanguage: { name: "Java", color: "#b07219" } },
    ],
  };
}

// ───────────────────────── derived stats ─────────────────────────
function analyse(weeks) {
  const flat = weeks.flat();
  const max = Math.max(1, ...flat.map((d) => d.count));
  const level = (n) => (n === 0 ? 0 : n <= max * 0.25 ? 1 : n <= max * 0.5 ? 2 : n <= max * 0.75 ? 3 : 4);

  let longest = 0, run = 0;
  for (const d of flat) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // current streak: count back from the latest day (today may still be empty)
  let current = 0;
  for (let i = flat.length - 1; i >= 0; i--) {
    if (flat[i].count > 0) current++;
    else if (i === flat.length - 1) continue;
    else break;
  }
  const busiest = flat.reduce((a, b) => (b.count > a.count ? b : a), flat[0]);

  const byMonth = new Map();
  for (const d of flat) {
    const k = d.date.slice(0, 7);
    byMonth.set(k, (byMonth.get(k) || 0) + d.count);
  }
  const months = [...byMonth.entries()].slice(-12).map(([k, v]) => ({
    label: new Date(k + "-01T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
    count: v,
  }));
  return { level, longest, current, busiest, months };
}

// ───────────────────────── cards ─────────────────────────
function hero() {
  const h = 236;
  const dots = [["#ff5f56", 22], ["#ffbd2e", 42], ["#27c93f", 62]]
    .map(([c, x]) => `<circle cx="${x}" cy="18" r="6" fill="${c}"/>`)
    .join("");
  const body = `
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.accent}"/><stop offset="1" stop-color="${C.accentSoft}"/></linearGradient>
<clipPath id="c"><rect x="0.5" y="0.5" width="${W - 1}" height="${h - 1}" rx="12"/></clipPath></defs>
${frame(W, h)}
<g clip-path="url(#c)"><rect width="${W}" height="36" fill="${C.bar}"/><line x1="0" y1="36.5" x2="${W}" y2="36.5" stroke="${C.border}"/></g>
${dots}
<text x="${W / 2}" y="22" text-anchor="middle" font-size="12" fill="${C.muted}">${esc(PROFILE.handle)}: ~</text>
<text x="30" y="78" font-size="14" fill="${C.muted}"><tspan fill="${C.green}">${esc(PROFILE.handle)}</tspan> <tspan fill="${C.accentSoft}">~</tspan> $ whoami</text>
<text x="30" y="130" font-size="42" font-weight="700" fill="url(#g)">${esc(PROFILE.name)}</text>
<text x="30" y="162" font-size="16" fill="${C.soft}">${esc(PROFILE.role)}</text>
<text x="30" y="188" font-size="13" fill="${C.muted}">${esc(PROFILE.tagline)}</text>
<circle cx="35" cy="213" r="4" fill="${C.green}"/>
<text x="48" y="217" font-size="12" fill="${C.muted}">${esc(PROFILE.status)}  ·  ${esc(PROFILE.place)}</text>`;
  return svg(W, h, body, `${PROFILE.name}. ${PROFILE.role}. ${PROFILE.tagline}`);
}

function heatmap(weeks, a, total) {
  const h = 200;
  const left = 30, gridW = W - left - 30;
  const step = gridW / weeks.length;
  const size = step - 3;
  const top = 78;
  let cells = "", months = "", lastMonth = "";
  weeks.forEach((col, wi) => {
    const m = col[0].date.slice(0, 7);
    if (m !== lastMonth) {
      const label = new Date(m + "-01T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" });
      if (wi < weeks.length - 2) months += `<text x="${(left + wi * step).toFixed(1)}" y="${top - 8}" font-size="10" fill="${C.muted}">${label}</text>`;
      lastMonth = m;
    }
    col.forEach((d, di) => {
      const dow = new Date(d.date + "T00:00:00Z").getUTCDay();
      cells += `<rect x="${(left + wi * step).toFixed(1)}" y="${top + dow * step}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" rx="2" fill="${C.heat[a.level(d.count)]}"><title>${d.count} on ${d.date}</title></rect>`;
    });
  });
  const ly = top + 7 * step + 16;
  const legend = C.heat
    .map((c, i) => `<rect x="${W - 30 - 36 - 5 * 15 + i * 15}" y="${ly - 9}" width="11" height="11" rx="2" fill="${c}"/>`)
    .join("");
  const body = `${frame(W, h)}
<text x="30" y="32" font-size="14" fill="${C.muted}"><tspan fill="${C.green}">${esc(PROFILE.handle)}</tspan> <tspan fill="${C.accentSoft}">~</tspan> $ ./contributions.sh</text>
${months}${cells}
<text x="${left}" y="${ly}" font-size="11" fill="${C.muted}">${fmt(total)} contributions in the last year</text>
<text x="${W - 30 - 36 - 5 * 15 - 8}" y="${ly}" font-size="10" fill="${C.muted}" text-anchor="end">less</text>
${legend}
<text x="${W - 30}" y="${ly}" font-size="10" fill="${C.muted}" text-anchor="end">more</text>`;
  return svg(W, h, body, `Contribution graph for ${USER}, ${total} contributions in the last year`);
}

function activity(a) {
  const h = 210;
  const chartL = 30, chartW = 520, baseY = 160, chartH = 86;
  const max = Math.max(1, ...a.months.map((m) => m.count));
  const slot = chartW / a.months.length;
  const bw = slot - 10;
  const bars = a.months
    .map((m, i) => {
      const bh = Math.max(m.count ? 3 : 1, (m.count / max) * chartH);
      const x = chartL + i * slot;
      const top = m.count === max;
      return `<rect x="${x.toFixed(1)}" y="${(baseY - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${top ? C.accentSoft : C.accent}" opacity="${top ? 1 : 0.8}"/>
<text x="${(x + bw / 2).toFixed(1)}" y="${(baseY - bh - 6).toFixed(1)}" font-size="10" fill="${C.muted}" text-anchor="middle">${m.count}</text>
<text x="${(x + bw / 2).toFixed(1)}" y="${baseY + 18}" font-size="11" fill="${C.muted}" text-anchor="middle">${m.label}</text>`;
    })
    .join("");
  const bd = new Date(a.busiest.date + "T00:00:00Z").toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const stat = (y, label, value, sub) =>
    `<text x="610" y="${y}" font-size="11" fill="${C.muted}">${label}</text>
<text x="610" y="${y + 24}" font-size="22" font-weight="700" fill="${C.text}">${value}<tspan dx="8" font-size="12" font-weight="400" fill="${C.muted}">${sub}</tspan></text>`;
  const body = `${frame(W, h)}
<text x="30" y="32" font-size="14" fill="${C.muted}"><tspan fill="${C.green}">${esc(PROFILE.handle)}</tspan> <tspan fill="${C.accentSoft}">~</tspan> $ ./activity.sh</text>
${bars}
<line x1="580" y1="56" x2="580" y2="${h - 24}" stroke="${C.border}"/>
${stat(72, "CURRENT STREAK", a.current, a.current === 1 ? "day" : "days")}
${stat(120, "LONGEST STREAK", a.longest, a.longest === 1 ? "day" : "days")}
${stat(168, "BUSIEST DAY", a.busiest.count, `on ${bd}`)}`;
  return svg(W, h, body, "Contributions by month for the last 12 months, with streaks and busiest day");
}

function statCard(label, value, sub) {
  const h = 96;
  const body = `${frame(W3, h)}
<text x="22" y="30" font-size="11" letter-spacing="1.5" fill="${C.muted}">${label}</text>
<text x="22" y="64" font-size="32" font-weight="700" fill="${C.accentSoft}">${esc(value)}</text>
<text x="22" y="83" font-size="11" fill="${C.muted}">${esc(sub)}</text>`;
  return svg(W3, h, body, `${label}: ${value} ${sub}`);
}

function sectionTitle(text) {
  const h = 52;
  const body = `${frame(W, h)}
<text x="30" y="32" font-size="16" fill="${C.muted}"><tspan fill="${C.green}">$</tspan> <tspan fill="${C.text}" font-weight="700">${esc(text)}</tspan></text>`;
  return svg(W, h, body, text);
}

function repoCard(r) {
  const h = 150;
  const lines = wrap(r.description || "No description yet.", 33, 4);
  const desc = lines.map((l, i) => `<text x="22" y="${58 + i * 17}" font-size="12" fill="${C.soft}">${esc(l)}</text>`).join("");
  const lang = r.primaryLanguage;
  const footer = `${lang ? `<circle cx="27" cy="${h - 22}" r="5" fill="${lang.color || C.accent}"/><text x="38" y="${h - 18}" font-size="11" fill="${C.muted}">${esc(lang.name)}</text>` : ""}
<text x="${W3 - 22}" y="${h - 18}" font-size="11" fill="${C.muted}" text-anchor="end">★ ${r.stargazerCount}</text>`;
  const body = `${frame(W3, h)}
<text x="22" y="32" font-size="14" font-weight="700" fill="${C.accentSoft}">${esc(r.name.length > 26 ? r.name.slice(0, 25) + "…" : r.name)}</text>
${desc}${footer}`;
  return svg(W3, h, body, `${r.name}: ${r.description || ""}`);
}

// ───────────────────────── main ─────────────────────────
const data = MOCK ? mockData() : await liveData();
const a = analyse(data.weeks);

const picked = FEATURED.map((n) => data.repos.find((r) => r.name.toLowerCase() === n.toLowerCase())).filter(Boolean);
for (const r of data.repos) {
  if (picked.length >= 3) break;
  if (!picked.includes(r) && r.name.toLowerCase() !== USER.toLowerCase()) picked.push(r);
}

const files = {
  "hero.svg": hero(),
  "heatmap.svg": heatmap(data.weeks, a, data.total),
  "activity.svg": activity(a),
  "stat-repos.svg": statCard("REPOS", fmt(data.repoCount), "public repositories"),
  "stat-stars.svg": statCard("STARS", fmt(data.stars), "earned across my repos"),
  "stat-commits.svg": statCard("CONTRIBUTIONS", fmt(data.total), "in the last 12 months"),
  "title-projects.svg": sectionTitle("What I'm building"),
};
picked.slice(0, 3).forEach((r, i) => (files[`repo-${i + 1}.svg`] = repoCard(r)));

await mkdir(OUT, { recursive: true });
for (const [name, content] of Object.entries(files)) await writeFile(join(OUT, name), content);
console.log(`${MOCK ? "[mock] " : ""}wrote ${Object.keys(files).length} cards to ${OUT}`);
