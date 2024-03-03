<script lang="ts">
    //@ts-ignore
    const query = _query;

    enum ScoreLevel {
        LOW,
        MEDIUM,
        HIGH
    }
    type SearchPredicate = {
        title: string,
        description: string,
        url: string,
        score: ScoreLevel
    }

    let predicates: SearchPredicate[] = [];
    let loading = true;

    (async () => {
        const body = await (await fetch("http://localhost:3030/search/predicate", {
            method: "POST",
            body: JSON.stringify({
                query
            }),
            headers: {
                "Content-type": "application/json"
            }
        })).json();

        predicates = body.predicates;
        loading = false;
    })();
</script>

<div class="flex flex-col w-full h-full justify-items-start space-y-2 place-items-start pt-3 bg-zinc-800">
    {#if loading}
        <div class="text-white">Searching around the world...</div>
    {:else if !loading && predicates.length < 1}
        <div class="text-white">No results found...</div>
    {:else if !loading && predicates.length > 0}
        {#each predicates as predicate}
            {#if predicate.title}
                <div class="pl-3">
                    <p class="transition text-sky-600 text-2xl hover:cursor-pointer hover:underline">
                        <a href="{predicate.url}">{predicate.title}</a>
                    </p>
                    <p class="text-white">{predicate.description}</p>
                    <p class="text-white">Score: {Math.floor((predicate.score / 3 + 1) * 50)}/50</p>
                </div>
            {/if}
        {/each}
    {/if}
</div>