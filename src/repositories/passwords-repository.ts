import {IPassword, IPasswordObjectType, passwordsCollection} from "./db";

export const passwordsRepository = {
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
    async updatePasswords(newPasswords: IPassword[], userId: number): Promise<boolean> {

        const result = await passwordsCollection.updateOne({userId}, {
            $set: {
                passwords: newPasswords
            }
        })

        return result.matchedCount === 1
    },
}