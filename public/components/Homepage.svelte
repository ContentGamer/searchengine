<script lang="ts">
    let input: HTMLInputElement;
</script>

<div class="flex flex-col w-screen h-screen justify-items-center space-y-2 place-items-center pt-3 bg-zinc-800">
    <p class="text-4xl font-bold bg-clip-text bg-gradient-to-r from-sky-500 to-red-500 text-transparent">SafeSearch</p>
    <br>
    <p class="text-white text-xs">(Surf the web safely with style)</p>
    <p class="text-white text-sm">This search engine implements blocking for websites with slur, bad words, etc..</p>
    <br>
    <input type="text" bind:this={input} on:keydown={(key) => {
        if (key.key === "Enter") {
            window.location.href = `/search?q=${input.value}`;
        }
    }} class="transition duration-500 text-white w-[30%] h-10 pl-2 rounded-md bg-zinc-700 scale-100 hover:scale-[1.01] focus:scale-[1.02]" placeholder="Search anything...">
</div>