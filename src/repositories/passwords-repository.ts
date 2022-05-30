import {
    IBlogger,
    passwordsCollection,
    IPasswordObjectType,
    IPassword,
    postsCollection,
    IPost
} from "./db";
import {bloggersRepository} from "./bloggers-repository";
import {log} from "util";

export const passwordsRepository = {
    async findPasswordByPasswordId(passwordId: string | null | undefined): Promise<IPasswordObjectType | null> {

        return passwordsCollection.findOne({passwordId})
    },
    async findPasswordsByUserId(userId: number | null | undefined): Promise<IPasswordObjectType | null> {

        if (userId) {
            const passwordObject = await passwordsCollection.findOne({userId: userId})
            return passwordObject
        }
        return null
    },
    async createPasswordsObject(newPasswordObject: IPasswordObjectType): Promise<IPasswordObjectType> {

        await passwordsCollection.insertOne(newPasswordObject)
        return newPasswordObject
    },
    async createPassword(newPasswords: IPassword[], userId: number): Promise<boolean> {

        const result = await passwordsCollection.updateOne({userId}, {
            $set: {
                passwords: newPasswords
            }
        })

        return result.matchedCount === 1
    },
    // async updatePasswordObject(userId: number, passwords: IPassword[]): Promise<boolean> {
    //     const blogger: IBlogger | null = await bloggersRepository.findBloggerById(bloggerId)
    //     let result = await passwordCollection.updateOne({id}, {
    //         $set: {
    //             title,
    //             shortDescription,
    //             content,
    //             bloggerId,
    //             bloggerName: blogger?.name
    //                 ? blogger?.name
    //                 : 'unknown'
    //         }
    //     })
    //     return result.matchedCount === 1
    // },

    async deletePassword(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}