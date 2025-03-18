require("dotenv").config();
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/screenshot", async (req, res) => {
  try {
    const targetUrl = req.query.url || "https://example.com";

    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
        "--no-zygote",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: "networkidle0" });

    const screenshot = await page.screenshot({ encoding: "base64" });

    await browser.close();
    res.send(`<img src="data:image/png;base64,${screenshot}" />`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
