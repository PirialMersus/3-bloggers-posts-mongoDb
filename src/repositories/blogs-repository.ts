import {blogsCollection, IBlog} from "./db";
import {IFindObj} from "../domain/blogs-service";
import {Filter} from "mongodb";

export interface IReturnedFindObj<T> {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

// export interface IReturnedFindPostsObj {
//     pagesCount: number,
//     page: number,
//     pageSize: number,
//     totalCount: number,
//     items: IPost[]
// }

export const blogsRepository = {
    async findBlogs({name, pageNumber, pageSize, skip}: IFindObj,
                    sortBy: keyof IBlog,
                    sortDirection: string): Promise<IReturnedFindObj<IBlog>> {
        const findObject: Filter<IBlog> = {}
        if (name) findObject.name = {$regex: new RegExp(name, "i")}
        const count = await blogsCollection.countDocuments(findObject)
        const foundBloggers: IBlog[] = await blogsCollection
            .find(findObject, {projection: {_id: false}})
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
                items: foundBloggers
            })
        })
    },

    async findBlogById(id: string): Promise<IBlog | null> {
        const blog = blogsCollection.findOne({id}, {projection: {_id: 0}})
        if (blog) {
            return blog
        } else {
            return null
        }
    },
    // have to have return value type
    async createBlogger(newBlog: IBlog): Promise<IBlog | null> {

        await blogsCollection.insertOne(newBlog)
        return blogsCollection.findOne({id: newBlog.id}, {projection: {_id: 0}})
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        let result = await blogsCollection.updateOne({id}, {
            $set: {name, youtubeUrl}
        })
        return result.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async getTotalCount(filter: Filter<IBlog>): Promise<number> {
        return blogsCollection.countDocuments(filter)
    }
}