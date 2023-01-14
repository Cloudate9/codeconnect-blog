<script lang="ts">
    import logo from "$lib/assets/logo.png"
    import { pb } from "$lib/pocketbase"
    import type { Post } from "$lib/post"
    import SvelteMarkdown from "svelte-markdown"
    import IntersectionObserver from "svelte-intersection-observer"
	import type { PageData } from "./$types"


    export let data: PageData
    let lastPostFectched: HTMLElement

    // Start pagination at 2 cause 1 was already done for us in load.
    // We use a load file (i.e. +page.ts) so that posts will have a non-zero value from the get-go, if there are actual db values for posts
    let pagination = 2
    let posts = data.posts

    async function fetchAndStorePosts() {
        const resultList = await pb.collection("posts").getList<Post>(pagination, 10, {
            // The '-' in front of "created" indicates descending order
            sort: "-created"
        })

        // Don't update anymore if there is no change. This stops infinite pagenation increment by observing a new instance of an object of the same post
        if (resultList.items.at(-1)?.id === posts.at(-1)?.id) return
        posts = resultList.items

        ++pagination
    }

</script>
<!-- Specify colour cause of margin top (or m-y ig) causes extra white space to appear. Colour that in. -->
<body class="bg-zinc-800">
    
    <!-- Note that this margin on y (specifically affecting top) causes a colour difference btw the top of the page and this div -->
    <div class="grid place-items-center text-center bg-zinc-700 mb-8 lg:my-8 p-4">
        <a href="https://codeconnect.ca">
            <img src={logo} alt="Code Connect's logo"/>
        </a>
        <h1 class="text-lg">Code Connect Blog</h1>
        <h2 class="text-md">Updates about Code Connect, all in one place</h2>
    </div>

    {#if posts.length === 0}

        <div class="flex justify-items-center items-center">
            <h1 class="text-red-400">No posts found</h1>
        </div>

    {:else}

        <div class="grid grid-rows m-10">
            <!-- This should get the info we fetch from pocketbase -->

            <!-- TODO: We shouldn't be displaying all the data here. Perhaps make the post element a fixed size, and fit as much text there as poss/use a description. Also, thumbnails -->

            {#each posts as post (post.id)}
                {#if post === posts.at(-1)} <!-- If it is the last element, add an intersection observer to load more data when we read the last one -->
                    <IntersectionObserver once element={lastPostFectched} on:intersect={() => fetchAndStorePosts()}>
                    <!-- Bg colour should be zinc-900 if there is no hover, matching the bg -->
                    <div bind:this={lastPostFectched} class="hover:bg-zinc-700 p-4 duration-300 rounded-md">
                        <a href="/post/{post.id}">
                            <SvelteMarkdown source={post.mdContent} /> 
                        </a>
                    </div>
                    </IntersectionObserver>
                {:else}
                    <!-- Bg colour should be zinc-900 if there is no hover, matching the bg -->
                    <div bind:this={lastPostFectched} class="hover:bg-zinc-700 p-4 duration-300 rounded-md">
                        <a href="/post/{post.id}">
                            <SvelteMarkdown source={post.mdContent} /> 
                        </a>
                    </div>
                {/if}
            {/each}
        </div>

    {/if}

</body>
