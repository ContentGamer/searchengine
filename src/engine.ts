import fs from "fs";
import express from "express";
import { PORT } from "./constants";
import { loadFile } from "./utils/svelte";
import { crawl } from "./scraper/crawler";

const app = express();

app.use("/svelte/out", express.static("dist/svelte"));
app.use(express.json());

fs.readdirSync("src/routes").forEach((route) => {
    const file = require(`./routes/${route}`);
    app.use(`${file.default.endpoint}`, file.default.app);
});

app.get("/", (req, res) => res.status(200).send(loadFile("index", "G++")));

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);

    fs.readFileSync("text/domains.txt").toString().split("\n").forEach((domain, indx) => {
        if (indx <= 220)  {
            crawl(`https://${domain}`);
        }
    })
});