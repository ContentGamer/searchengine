export function loadFile(name: string, title: string, passedArguments: any = {}): string {
    const variables: string[] = [];
    
    passedArguments ? Object.keys(passedArguments).forEach((argument) => {
        const value: any = passedArguments[argument] as any;
        variables.push(`const _${argument} = "${value}";`)
        return "";
    }) : "";

    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <link rel="stylesheet" href="/svelte/out/${name}.css"></link>
            <script>
                ${variables.join("\n")}
            </script>
        </head>
        <body class="bg-zinc-800">
        </body>
        
        <script src="/svelte/out/${name}.js"></script>
        
        </html>
    `;
}