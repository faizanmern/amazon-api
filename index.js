const express = require("express");
const app = express();
const puppeteer = require("puppeteer");

app.get("/", async (req, res) => {
  let productUrl = req.query.url;

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: 60000,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage();
  await page.setCacheEnabled(true);

  //   // Navigate to the product page
  await page.goto(productUrl, {timeout: 0});

  //   // Wait for the product information to load (you may need to adjust the selector and wait time)
  await page.waitForSelector("#productTitle", { timeout: 10000});

  const productData = await page.evaluate(() => {
    const title = document.querySelector("#productTitle").innerText.trim();
    const price = document
      .querySelector(".a-price .a-offscreen")
      .innerText.trim();
    const availability = document
      .querySelector("#availability")
      .innerText.trim();
    const description = document
      .querySelector("#productDescription")
      .innerText.trim();

    return {
      title,
      price,
      availability,
      description,
    };
  });

  //   // Close the browser
  await browser.close();

  //   // Return the scraped data as a JSON object
  //   console.log(JSON.stringify(productData, null, 2));
  res.json(productData);
  //   await page.goto(
  //     `https://www.amazon.com/Amazfit-Fitness-Tracker-Battery-Compatible-Black/dp/B09Z6GMPC6/`
  //   );
  //   data = await page.$$eval(
  //     "#productDetails_detailBullets_sections1 tbody",
  //     (rows) => rows
  //   );
  //   console.log(data);

  //   await browser.close();
  //   res.json({ success: true });
});

app.listen(8080, () => {
  console.log("Server is running");
});

// let data = {};
//         for (let index = 0; index < 10; index++) {
//             data.rows[index].children[0].innerText = rows[index].children[1].innerText;
//         }
//         return data;
