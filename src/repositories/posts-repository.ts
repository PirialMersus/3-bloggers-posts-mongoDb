import {BloggerType, postsCollection, PostType} from "./db";
import {bloggersRepository} from "./bloggers-repository";

export const postsRepository = {
    async findPosts(name: string | null | undefined): Promise<PostType[]> {
        const findObject: any = {}

        if (name) findObject.name = {$regex: name}

        return postsCollection.find(findObject).toArray()
    },
    async findPostById(id: number): Promise<PostType | null> {
        let post = postsCollection.findOne({id})
        if (post) {
            return post
        } else {
            return null
        }
    },
    // have to have return value type
    async createPost(newPost: PostType): Promise<PostType> {

        await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(id: number,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: number): Promise<boolean> {
        const blogger: BloggerType | null = await bloggersRepository.findBloggerById(bloggerId)
        let result = await postsCollection.updateOne({id}, {
            $set: {
                title,
                shortDescription,
                content,
                bloggerId,
                bloggerName: blogger?.name
                    ? blogger?.name
                    : 'unknown'
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}