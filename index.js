// Import puppeteer
import puppeteer from "puppeteer";

const url = "https://scholar.google.com.br/?hl=pt";
const search = "ecologia organizacional Autor joel baum";

const articlesSelector = "div[class='gs_ri']";
const searchInput = "input[aria-label='Pesquisar']";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector(searchInput);
  await page.type(searchInput, search);
  await page.keyboard.press("Enter");

  await page.waitForSelector(articlesSelector);

  const articles = await page.evaluate((selector) => {
    const articles = Array.from(document.querySelectorAll(selector));
    return articles.map(async (article) => {
      const title = await page.evaluate(
        () => article.querySelector("h3").textContent
      );
      const author = await page.evaluate(
        () => article.querySelector("div.gs_a").textContent
      );
      const resume = await page.evaluate(
        () => article.querySelector("div.gs_rs").textContent
      );
      const link = article.querySelector("a").href;

      return { title, author, resume, link };
    });
  });

  console.log(articles);

  // Close browser.
  //   await browser.close();
})();
