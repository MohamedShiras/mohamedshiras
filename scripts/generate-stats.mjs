const username = process.env.GITHUB_USERNAME || "MohamedShiras";
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is required");

const query = `query($login:String!){ user(login:$login){ name login repositories(privacy:PUBLIC, first:100, ownerAffiliations:OWNER){ totalCount nodes{ stargazerCount } } contributionsCollection { contributionCalendar { totalContributions } } followers { totalCount } } }`;
const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { login: username } })
});
if (!response.ok) throw new Error(`GitHub API failed: ${response.status}`);
const payload = await response.json();
if (payload.errors?.length) throw new Error(payload.errors.map(e => e.message).join("; "));
const user = payload.data.user;
const stars = user.repositories.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);
const values = [
  ["PUBLIC REPOSITORIES", user.repositories.totalCount],
  ["TOTAL STARS", stars],
  ["FOLLOWERS", user.followers.totalCount],
  ["CONTRIBUTIONS THIS YEAR", user.contributionsCollection.contributionCalendar.totalContributions]
];
const cards = values.map(([label, value], i) => {
  const x = 28 + i * 286;
  return `<g transform="translate(${x} 22)"><rect width="260" height="112" rx="13" fill="#11101B" stroke="#38265E"/><text x="20" y="39" fill="#A78BFA" font-family="monospace" font-size="11" letter-spacing="1">${label}</text><text x="20" y="83" fill="#F8FAFC" font-family="Arial" font-size="34" font-weight="700">${value.toLocaleString("en-US")}</text></g>`;
}).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="160" viewBox="0 0 1200 160"><rect width="1200" height="160" rx="18" fill="#0D0B14"/>${cards}</svg>`;
await (await import("node:fs/promises")).mkdir("cards", { recursive: true });
await (await import("node:fs/promises")).writeFile("cards/stats.svg", svg);
console.log(`Updated profile stats for ${username}`);
