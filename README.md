<!-- Animated SVG Header -->
<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=45&duration=3000&pause=1000&color=6C63FF&center=true&vCenter=true&random=false&width=800&height=100&lines=Hi+%F0%9F%91%8B+I'm+Mohamed+Shiras;Software+Engineering+Student;Full-Stack+Developer;Problem+Solver+%26+Innovator" alt="Typing SVG" />
</div>

<!-- Animated GIF Banner Alternative -->
<p align="center">
  <img src="https://user-images.githubusercontent.com/74038190/225813708-98b745f2-7d22-48cf-9150-083f1b00d6c9.gif" width="800">
</p>

<!-- Social Links -->
<p align="center">
  <a href="https://mohamedshiras.dev">
    <img src="https://img.shields.io/badge/🌐_Portfolio-mohamedshiras.dev-black?style=for-the-badge&logoColor=white&color=6C63FF"/>
  </a>
  <a href="mailto:mchiya1003@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
  </a>
  <a href="https://linkedin.com/in/mohamed-shiras">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
  <a href="https://instagram.com/chiya.forsure">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white"/>
  </a>
</p>

<!-- Profile Views & Followers -->
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=mohamedshiras&label=Profile%20Views&color=6C63FF&style=for-the-badge" alt="Profile Views" />
  <img src="https://img.shields.io/github/followers/mohamedshiras?label=Followers&style=for-the-badge&color=6C63FF" alt="followers" />
</p>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

<!-- About Me Section -->
<table align="center">
<tr border="none">
<td width="50%" align="center">

<img src="https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif" width="400"/>

### 📊 Most Used Languages

<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=mohamedshiras&layout=compact&theme=tokyonight&hide_border=true&langs_count=8" width="100%"/>

</td>
<td width="50%" align="left">

## 👨‍💻 About Me

```javascript
const shiras = {
    location: "Sri Lanka 🇱🇰",
    education: "Software Engineering @ NIBM",
    role: "Full-Stack Developer",
    currentFocus: "Building scalable applications",
    learning: ["Python", "React", "Spring Boot"],
    askMeAbout: ["Web Dev", "Mobile Dev", "OOP"],
    funFact: "I debug with console.log() 🤫"
};
```

## 🎯 What I'm Doing

- 🔭 Working on **Full-Stack Projects**
- 🌱 Learning **Python & React Ecosystem**
- 👯 Open to **collaboration opportunities**
- 💬 Ask me about **Java, C#, Databases**
- 📫 Reach me: **mchiya1003@gmail.com**
- ⚡ Motto: **Coffee + Code = Magic ☕**

</td>
</tr>
</table>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

## 🛠️ Tech Stack

<div align="center">

### 💻 Programming Languages
<p>
  <img src="https://skillicons.dev/icons?i=c,cpp,java,python,javascript,php,kotlin&theme=dark&perline=7" />
</p>

### 🎨 Frontend Development
<p>
  <img src="https://skillicons.dev/icons?i=html,css,bootstrap,tailwind,react,nextjs,jquery&theme=dark&perline=7" />
</p>

### ⚙️ Backend Development
<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,spring,django,flask,dotnet,laravel&theme=dark&perline=7" />
</p>

### 💾 Databases & Cloud
<p>
  <img src="https://skillicons.dev/icons?i=mysql,mongodb,firebase,sqlite,postgres,redis&theme=dark&perline=6" />
</p>

### 🔧 Tools & Platforms
<p>
  <img src="https://skillicons.dev/icons?i=git,github,vscode,visualstudio,idea,androidstudio,eclipse,docker,postman,figma&theme=dark&perline=10" />
</p>

</div>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

## 📊 GitHub Statistics

<p align="center">
  <img width="49%" src="https://github-readme-stats.vercel.app/api?username=mohamedshiras&show_icons=true&theme=tokyonight&hide_border=true&include_all_commits=true&count_private=true" alt="GitHub Stats"/>
  <img width="49%" src="https://github-readme-streak-stats.herokuapp.com/?user=mohamedshiras&theme=tokyonight&hide_border=true" alt="GitHub Streak"/>
</p>

<p align="center">
  <img width="70%" src="https://github-readme-activity-graph.vercel.app/graph?username=mohamedshiras&theme=tokyo-night&hide_border=true&area=true" alt="Activity Graph"/>
</p>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

## 🐍 Contribution Snake

<div align="center">
  
![Snake animation](https://raw.githubusercontent.com/platane/platane/output/github-contribution-grid-snake-dark.svg)

<details>
  <summary>📌 Setup Instructions</summary>
  <br>
  
Create `.github/workflows/snake.yml`:
  
```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 */12 * * *"
  workflow_dispatch:
  push:
    branches:
      - main

jobs:
  generate:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: generate snake.svg
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: dist/snake.svg?palette=github-dark

      - name: push snake.svg to the output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
</details>

</div>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

## 💼 Featured Projects

<div align="center">

<a href="https://github.com/mohamedshiras/QuickBid">
  <img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=mohamedshiras&repo=QuickBid&theme=tokyonight&hide_border=true" />
</a>

<a href="https://github.com/mohamedshiras/ATM-Management-System">
  <img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=mohamedshiras&repo=ATM-Management-System&theme=tokyonight&hide_border=true" />
</a>

</div>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

## 💭 Random Dev Quote

<p align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Random Dev Quote"/>
</p>

<br>

## 📈 Contribution Stats

<p align="center">
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=mohamedshiras&theme=tokyonight" alt="Contribution Graph"/>
</p>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

## 📫 Connect With Me

<div align="center">

### 💬 Open to interesting conversations and collaboration!

<p>
  <a href="https://mohamedshiras.dev">
    <img src="https://img.shields.io/badge/Website-mohamedshiras.dev-6C63FF?style=for-the-badge&logo=google-chrome&logoColor=white"/>
  </a>
  <a href="https://linkedin.com/in/mohamed-shiras">
    <img src="https://img.shields.io/badge/LinkedIn-Mohamed_Shiras-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/>
  </a>
  <a href="mailto:mchiya1003@gmail.com">
    <img src="https://img.shields.io/badge/Email-mchiya1003@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white"/>
  </a>
  <a href="https://instagram.com/chiya.forsure">
    <img src="https://img.shields.io/badge/Instagram-@chiya.forsure-E4405F?style=for-the-badge&logo=instagram&logoColor=white"/>
  </a>
</p>

</div>

<br>

<!-- Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<br>

<div align="center">
  
### 💡 *"First, solve the problem. Then, write the code."* – John Johnson

### ⭐ Show some love by starring repositories you find interesting!

</div>

<br>

<!-- Expandable Stats -->
<details>
  <summary align="center"><b>📊 More GitHub Stats</b></summary>
  <br/>
  <p align="center">
    <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=mohamedshiras&theme=tokyonight" />
    <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=mohamedshiras&theme=tokyonight" />
  </p>
  <p align="center">
    <img src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=mohamedshiras&theme=tokyonight" />
    <img src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=mohamedshiras&theme=tokyonight" />
  </p>
</details>

<br>

<!-- Footer -->
<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️%20and%20Markdown-1f425f.svg?style=for-the-badge" alt="Made with Love"/>
  <img src="https://img.shields.io/badge/Maintained-Yes-6C63FF.svg?style=for-the-badge" alt="Maintenance"/>
  <img src="https://img.shields.io/badge/Ask%20me-Anything-1abc9c.svg?style=for-the-badge" alt="Ask Me Anything"/>
</p>

<br>

<!-- Animated Footer -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>
</p>
