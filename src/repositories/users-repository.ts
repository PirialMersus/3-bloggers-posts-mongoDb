import {usersCollection, IUser} from "./db";

export const usersRepository = {
    async findUser(name: string, password: string): Promise<IUser | null> {
        return usersCollection.findOne({name, password})
    },

    async createUser(newUser: IUser): Promise<IUser> {
        await usersCollection.insertOne(newUser)
        return newUser
    },
}