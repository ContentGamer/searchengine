import { push, websites } from "../config";
import { JSDOM } from "jsdom";
import { log, logWarn } from "../utils/logger";

const maximum_crawl: number = 420;
let current_crawl: number = 0;

function extractDomain(url: string): string | null {
    try {
        let domain = url.replace(/(^\w+:|^)\/\//, '');
        domain = domain.replace(/\/(.*)/, '');
        domain = domain.split('.').slice(-2).join('.');

        return domain;
    } catch (error) {
        console.error("Error while extracting domain:", error);
        return null;
    }
}

export async function crawl(url: string) {
    current_crawl++;
    if (current_crawl >= maximum_crawl) {
        return;
    }

    try {
        const source = await (await fetch(url, { method: "GET" })).text();
        const dom = new JSDOM(source);
        const document = dom.window.document;

        const possible = [document.getElementsByTagName("link"), document.getElementsByTagName("a")]
    
        push(url);
        log(`ADDED: ${url}`);

        for (let i = 0; i < possible.length; i++) {
            const pos = possible[i];
            for (let i = 0; i < pos.length; i++) {
                const element = pos[i];
                if (!websites.includes(element.href.includes("https://") ? element.href : `https://${extractDomain(url)}${element.href}`)) {
                    await crawl(element.href.includes("https://") ? element.href : `https://${extractDomain(url)}${element.href}`);
                }
            } 
        }
    } catch {
        logWarn(`COULD NOT ADD: ${url}`);
    }
}