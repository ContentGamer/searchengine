import { Router } from "express";
import { BaseRouter, ScoreLevel, SearchPredicate } from "../types";
import { scrape } from "../scraper/scraper";
import { loadFile } from "../utils/svelte";

const app = Router();

app.get("/", (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(403).redirect("/");

    res.status(200).send(loadFile("search", `Search - ${query}`, {
        "query": query
    }));
});

app.post("/predicate", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(403).send({ message: "Forbidden.", status: 403 });

    const predicates = await scrape(query);
    res.send({ predicates });
});

export default <BaseRouter>{
    endpoint: "/search",
    app
}