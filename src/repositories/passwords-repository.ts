import {
    IBlogger,
    passwordsCollection,
    IPasswordObjectType,
    IPassword,
    postsCollection,
    IPost
} from "./db";
import {bloggersRepository} from "./bloggers-repository";

export const passwordsRepository = {
    async findPasswordByPasswordId(passwordId: string | null | undefined): Promise<IPasswordObjectType | null> {

        return passwordsCollection.findOne({passwordId})
    },
    async findPasswordsByUserId(userId: number | null | undefined): Promise<IPasswordObjectType | null> {
        console.log('userId', userId)
        if (userId) {
            let passwordObject = passwordsCollection.findOne({userId})
            console.log('passwordObject', passwordObject)
            if (passwordObject) {
                return passwordObject
            }
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
        console.log('userId', userId)
        console.log('newPasswords', newPasswords)
        console.log('result.matchedCount', result.matchedCount)
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

    async deletePost(id: number): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}