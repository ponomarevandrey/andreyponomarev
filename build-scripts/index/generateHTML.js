const path = require("path");
const github = require("./../githubAPIClient.js");
const { formatISOstr } = require("./../../utility/formatISOstr.js");

async function buildProjectRow({ repo, tech }) {
  try {
    const r = await github.getRepository(repo);
    const { date, message } = await github.getRepoLastCommit(repo);
    tech = tech.map((v) => `<span class="projects__tag">${v}</span>`).join("");
    const { day, month, year } = formatISOstr(date);

    return `
    <div class="projects__row">
      <div class="projects__header">
        <div class="projects__title">${r.name}</div>
        <div class="projects__commit"> 
          <img
            src="./img/icon_refresh.svg"
            alt="Last commit"
            class="img-svg projects__img-svg"
          />
          <span class="projects__commit-text">
            ${day} ${month} ${year} — ${message}
          </span>
        </div>
    </div>
      <p class="projects__tags">${tech}</p>
      <p class="projects__about">${r.description || "—"}</p>
      <div class="buttons-col">
        <a href="${r.html_url}" class="button">Github</a>
        ${r.homepage ? `<a href="${r.homepage}" class="button">Demo</a>` : ""}
      </div>
    </div>  
  `;
  } catch (err) {
    console.error(`Error in "getRepository()": ${err}`);
  }
}

async function buildArticleRow({ title, url }) {
  const { date } = await github.getFileLastCommit(url);
  const { day, month, year } = formatISOstr(date);
  const fileName = path.basename(url).replace("md", "html");

  return `
    <div class="text various__row">
      <a href="./pages/${fileName}" class="link">${title}</a>
      <div class="various__updated">
        <img
          src="./img/icon_refresh.svg"
          alt="Last commit"
          class="img-svg"
        />
        <span class="update_time">${day} ${month} ${year}</span>
      </div>
    </div>
  `;
}

async function generateHTML({ projects, articles }) {
  const html = `
<!DOCTYPE html>
<html class="page" lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,viewport-fit=cover,shrink-to-fit=no"
    />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="description" content="Andrey Ponomarev Portfolio" />
    <meta
      name="keywords"
      content="web development, backend, frontend, databases, javascript, php"
    />
    <meta name="author" content="Andrey Ponomarev" />

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="./apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="./favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="./favicon-16x16.png"
    />
    <link rel="manifest" href="./site.webmanifest" />
    <link rel="mask-icon" href="./safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />

    <link rel="icon" type="image/png" href="./favicon.png" />

    <title>Andrey Ponomarev</title>

    <link href="./main.css" rel="stylesheet" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;0,800;1,400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="page__body">
    <!-- HEADER -->
    <header class="header">
      <div class="my-photo">
        <img
          src="https://sun9-52.userapi.com/c850520/v850520824/148c19/BC4V9wrvBvo.jpg"
          class="my-photo__img"
        />
      </div>

      <nav class="nav">
        <a
          href="mailto:info@andreyponomarev.ru"
          id="header"
          class="header__link"
          >info@andreyponomarev.ru</a
        >
      </nav>
    </header>

    <!-- MAIN -->
    <main class="main">

      <!-- PROJECTS -->
      <div class="projects">
        <div class="col-header col-header_type_projects">
          <a id="projects">PROJECTS</a>
        </div>
        <div class="projects__content">
          ${(
            await Promise.all(
              projects.map(({ repo, tech }) => buildProjectRow({ repo, tech }))
            )
          ).join("")}
        </div>
      </div>

      <!-- CONTENT -->
      <div class="various">

        <!-- ARTICLES -->
        <div class="various__articles">
          <div class="col-header col-header_type_articles">
            <a id="articles">ARTICLES</a>
          </div>
          <div class="various__articles">
            ${(
              await Promise.all(
                articles.map((article) => buildArticleRow(article))
              )
            ).join("")}
          </div>
        </div>

        <!-- ABOUT -->
        <div class="various__about">
          <div class="col-header col-header_type_about">
            <a id="about">ABOUT</a>
          </div>
          <div class="various__content">
            <p class="text text_display_block">
              Hi, my name is Andrey, I'm a web developer.
            </p>
            <p class="text text_display_block">
              I wrote my first lines of code back in 2003, and since 2006 I'm doing web development professionally, as an independent contractor. 
              
              <p class="text text_display_block">
                The period from the mid-2000s to the mid-2010s, I've mostly been working as a web designer and front-end developer but in recent years I've moved to the server side and primarily do backend development.
              </p>
            </p>

          </div>
        </div>
      </div>
    </main>

    <div class="gradient"></div>

    <!-- FOOTER -->
    <footer class="footer text">
      <!-- Place this tag where you want the button to render. -->
      <a
        class="github-button"
        href="https://github.com/ponomarevandrey"
        data-color-scheme="no-preference: dark; light: dark; dark: dark;"
        data-size="large"
        aria-label="Follow @ponomarevandrey on GitHub"
        >Follow @ponomarevandrey</a
      >
      <span class="footer__year"> © 1989 </span>
    </footer>
    <!-- Place this tag in your head or just before your close body tag. -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
  </body>
</html>`;

  return html;
}

module.exports.generateHTML = generateHTML;