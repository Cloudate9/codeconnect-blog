<script lang="ts">
    import logo from "$lib/assets/logo.png"
	import { onMount } from "svelte"
    import { currentUser, pb } from "$lib/pocketbase"
	import type { Post } from "$lib/post"
    import SvelteMarkdown from "svelte-markdown"


    // TODO move the entire fetching to server side bc we can't expose our client secret
    let pagination = 1
    let posts: Post[] = []

    onMount(async() => {

        const resultList = await pb.collection("posts").getList<Post>(pagination, 10, {
            sort: "created"
        })
        posts = resultList.items

        //TODO increment pagenation and fetch new data on scroll
    }

    )

</script>


<!-- Note that this margin on y (specifically affecting top) causes a colour difference btw the top of the page and this div -->
<div class="grid place-items-center bg-zinc-800 my-8 p-4">
    <a href="https://codeconnect.ca">
        <img src={logo} alt="Code Connect's logo"/>
    </a>
    <h1 class="text-lg">Code Connect Blog</h1>
    <h2 class="text-md">Updates about Code Connect, all in one place</h2>
</div>

{posts.length}
<div>
    <!-- This should get the info we fetch from pocketbase -->
    {#each posts as post (post.id)}
       <SvelteMarkdown source={post.mdContent} /> 
    {/each}
</div>
