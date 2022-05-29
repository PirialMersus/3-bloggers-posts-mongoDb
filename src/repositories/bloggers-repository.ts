import {bloggersCollection, IBlogger} from "./db";

export const bloggersRepository = {
    async findBloggers(name: string | null | undefined): Promise<IBlogger[]> {
        const findObject: any = {}

        if (name) findObject.name = {$regex: name}

        return bloggersCollection.find(findObject).toArray()
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