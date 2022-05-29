import {bloggersRepository} from "../repositories/bloggers-repository"
import {bloggersCollection, IBlogger, IPassword, IPasswordObjectType, IPost} from "../repositories/db"
import {postsRepository} from "../repositories/posts-repository"
import {passwordsRepository} from "../repositories/passwords-repository";

export const passwordsService = {
    async findPasswordByPasswordId(passwordId: number | null | undefined, userId: number | null | undefined): Promise<IPasswordObjectType | null> {
        const passwordObject = passwordsRepository.findPasswordsByUserId(userId)
        if (passwordObject) {
            console.log(passwordObject, 'passwordObject')
        }
        return null
    },
    async findPasswordsByUserId(userId: number): Promise<IPasswordObjectType | null> {
        return passwordsRepository.findPasswordsByUserId(userId)
    },
    async addPasswordToUser(
        service: string,
        name: string,
        password: string,
        userId: number): Promise<boolean> {
        const passwordObj: IPasswordObjectType | null = await passwordsRepository.findPasswordsByUserId(userId)
        if (!passwordObj?.passwords) {
            return false
        }
        const newPassword: IPassword = {
            id: +(new Date()),
            service,
            name,
            password,
        }
        const newPasswordsArr = [...passwordObj?.passwords, newPassword]

        return passwordsRepository.createPassword(newPasswordsArr, userId)
        // passwordsRepository.createPasswordsObject(initPasswordsObject)
    },
    async updatePasswordObject(id: number,
                               service: string,
                               name: string,
                               password: string,
                               userId: number): Promise<IPasswordObjectType | null> {
        const passwordObj: IPasswordObjectType | null = await passwordsRepository.findPasswordsByUserId(userId)
        console.log('passwordObj', passwordObj)
        if (!passwordObj?.passwords) {
            return null
        }
        const passwords: IPassword[] = passwordObj.passwords.map(passwordItem => {
            if (passwordItem.id === id) {
                return ({
                    id,
                    service,
                    name,
                    password,
                })
            } else {
                return ({...passwordItem})
            }
        })
        const newPasswordObject: IPasswordObjectType = {userId: userId, passwords: passwords}
        return passwordsRepository.createPasswordsObject(newPasswordObject)
    },

    async deletePasswordObject(id: number): Promise<boolean> {
        return postsRepository.deletePost(id)
    }
}