import {bloggersCollection, IBlogger} from "./db";
import {IFindObj} from "../domain/bloggers-service";
import {FindCursor} from "mongodb";
import {log} from "util";

export interface IReturnedFindBloggersObj {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IBlogger[]
}

export const bloggersRepository = {
    async findBloggers({name, pageNumber, pageSize, skip}: IFindObj): Promise<IReturnedFindBloggersObj> {
        const findObject: any = {}
        if (name) findObject.name = {$regex: name}
        const count = await bloggersCollection.find(findObject).count()
        const foundBloggers: IBlogger[] = await bloggersCollection
            .find(findObject)
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

    async findBloggerById(id: number): Promise<IBlogger | null> {
        const blogger = bloggersCollection.findOne({id})
        if (blogger) {
            return blogger
        } else {
            return null
        }
    },
    // have to have return value type
    async createBlogger(newBlogger: IBlogger): Promise<IBlogger> {

        await bloggersCollection.insertOne(newBlogger)
        return newBlogger
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        let result = await bloggersCollection.updateOne({id}, {
            $set: {name, youtubeUrl}
        })
        return result.matchedCount === 1
    },

    async deleteBlogger(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}