import { pb } from "$lib/pocketbase"
import type { Post } from "$lib/post"
import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
	const pagination = 1
	const resultList = await pb.collection("posts").getList<Post>(pagination, 1, {
		// The '-' in front of "created" indicates descending order
		sort: "-created"
	})
	return {
		posts: resultList.items
	}
}
