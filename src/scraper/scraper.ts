import { websites } from "../config";
import { ScoreLevel, SearchPredicate, BaseMeta } from "../types";
import { JSDOM } from "jsdom";
import { isslur } from "../utils/slurc";

function extractDomain(url: string): string {
   if (url.startsWith("www")) {
    return url.split(".")[1];
   } else if (url.startsWith("https://") || url.startsWith("http://")) {
    return url.split(".")[0].replace("https://", "").replace("http://", "");
   }

   console.error("Err: cannot extract domain from url"); 
   return "err";
}

function extractData(url: string, source: string): BaseMeta {
    const dom = new JSDOM(source);
    const document = dom.window.document;

    const data: BaseMeta = { title: document.getElementsByTagName("title")[0] ? document.getElementsByTagName("title")[0].innerHTML.trim() : "", description: "" };
    const metas = document.getElementsByTagName("meta");

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].name == "description") data.description = metas[i].content;
        if (metas[i].name == "title") data.title = metas[i].content;
    }

    return data;
}

async function handleWebsite(website: string, query: string): Promise<SearchPredicate | undefined> {
    try {
        let score: ScoreLevel | undefined = undefined;

        const source = await (await fetch(website, { method: "GET" })).text();
        const meta = extractData(website, source);

        if (isslur(meta.title)) {
            return undefined;
        }
        if (isslur(meta.description)) {
            return undefined;
        }
    
        if (extractDomain(website).toLowerCase().includes(query) && meta.title.toLowerCase().includes(query) && meta.description.toLowerCase().includes(query)) {
            score = ScoreLevel.HIGH;
        } else if (!extractDomain(website).toLowerCase().includes(query) && meta.title.toLowerCase().includes(query) && meta.description.toLowerCase().includes(query)) { 
            score = ScoreLevel.MEDIUM;
        } else if (extractDomain(website).toLowerCase().includes(query) && meta.title.toLowerCase().includes(query) && !meta.description.toLowerCase().includes(query)) { 
            score = ScoreLevel.MEDIUM;
        } else if (extractDomain(website).toLowerCase().includes(query) && !meta.title.toLowerCase().includes(query) && meta.description.toLowerCase().includes(query)) { 
            score = ScoreLevel.MEDIUM;
        } else if (extractDomain(website).toLowerCase().includes(query) && !meta.title.toLowerCase().includes(query) && !meta.description.toLowerCase().includes(query)) { 
            score = ScoreLevel.LOW;
        } else {
            score = ScoreLevel.LOW;
        }
    
        if (!extractDomain(website).toLowerCase().includes(query) && !meta.title.toLowerCase().includes(query) && !meta.description.toLowerCase().includes(query)) {
            return undefined;
        }
    
        return { title: meta.title, description: meta.description, score, url: website };
    } catch {
        return undefined;
    }
}

export async function scrape(query: string): Promise<SearchPredicate[]> {
    const predicates: SearchPredicate[] = [];
    for (let i = 0; i < websites.length; i++) {
        const website = websites[i];
        if (!isslur(query) && (website.includes(query.toLowerCase()) || website.includes(query.toLowerCase().replace(" ", "+")) || website.includes(query.toLowerCase().replace(" ", "-")))) {
            const predicate = await handleWebsite(website, query.toLowerCase());
            if (predicate) {
                predicates.push(predicate);
            }
        }
    }

    return predicates;
}