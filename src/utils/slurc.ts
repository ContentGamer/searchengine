// SlurContent abbrivated as SlurC Detection System
// Author: ContentGamer

import fs from "fs";

export function isslur(str: string): boolean {
    const badwords = fs.readFileSync("text/badwords.txt").toString().split("\n");
    for (let i = 0; i < badwords.length; i++) {
        const badword = badwords[i];
        if (str.toLowerCase().includes(badword.toLowerCase())) return true;
    }
    return false;
}