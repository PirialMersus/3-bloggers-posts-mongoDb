import {IBlog, IPost, postsCollection} from "./db";
import {blogsRepository} from "./blogs-repository";
export interface IReturnedFindPostsObj {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IPost[]
}

export const postsRepository = {
    async findPosts(pageNumber: number, pageSize: number, skip: number): Promise<IReturnedFindPostsObj> {
        const count = await postsCollection.find({}).count()
        const foundPosts: IPost[] = await postsCollection
            .find({})
            .skip(skip)
            .limit(pageSize)
            .toArray()

        return new Promise((resolve) => {
            resolve({
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: count,
                items: foundPosts
            })
        })
    },
    async findPostById(id: string): Promise<IPost | null> {
        let post = postsCollection.findOne({id})
        if (post) {
            return post
        } else {
            return null
        }
    },
    // have to have return value type
    async createPost(newPost: IPost): Promise<IPost> {

        await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {
        const blogger: IBlog | null = await blogsRepository.findBloggerById(blogId)
        let result = await postsCollection.updateOne({id}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId,
                blogName: blogger?.name
                    ? blogger?.name
                    : 'unknown'
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}