import {IBlog, IPost, postsCollection} from "./db";
import {blogsRepository, IReturnedFindObj} from "./blogs-repository";
import {FindConditionsBlogsObjType, FindConditionsPostsObjType} from "../domain/posts-service";

export const postsRepository = {
    async findPosts({pageNumber, pageSize, skip}: FindConditionsPostsObjType,
                    sortBy: keyof IPost,
                    sortDirection: string): Promise<IReturnedFindObj<IPost>> {
        const count = await postsCollection.find({}).count()
        const foundPosts: IPost[] = await postsCollection
            .find({}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
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
        let post = postsCollection.findOne({id}, {projection: {_id: 0}})
        if (post) {
            return post
        } else {
            return null
        }
    },
    async findPostsByBlogId({blogId, pageNumber, pageSize, skip}: FindConditionsBlogsObjType,
                            sortBy: keyof IPost,
                            sortDirection: string): Promise<IReturnedFindObj<IPost>> {
        const count = await postsCollection.find({blogId}).count()
        const foundPosts: IPost[] = await postsCollection
            .find({blogId}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
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
    // have to have return value type
    async createPost(newPost: IPost): Promise<IPost | null> {

        await postsCollection.insertOne(newPost)
        return postsCollection.findOne({id: newPost.id}, {projection: {_id: 0}})
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {
        const blogger: IBlog | null = await blogsRepository.findBlogById(blogId)
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