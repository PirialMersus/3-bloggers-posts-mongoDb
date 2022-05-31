import {bloggersCollection, IBlogger} from "./db";
import {IFindObj} from "../domain/bloggers-service";
import {FindCursor} from "mongodb";

export interface IReturnedFindBloggersObj {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IBlogger[]
}

export const bloggersRepository = {
    async findBloggers(findConditionsObj: IFindObj): Promise<IReturnedFindBloggersObj> {
        const findObject: any = {}
            //TODO custom validation
        if (findConditionsObj.name) findObject.name = {$regex: findConditionsObj.name}
        const count = await bloggersCollection.find(findObject).count()
        const foundBloggers: IBlogger[] = await bloggersCollection.find(findObject).skip(findConditionsObj.skip).limit(findConditionsObj.pageSize).toArray()
        return new Promise((resolve) => {
            resolve({
                pagesCount: Math.ceil(count / findConditionsObj.pageSize),
                page: findConditionsObj.pageNumber,
                pageSize: findConditionsObj.pageSize,
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