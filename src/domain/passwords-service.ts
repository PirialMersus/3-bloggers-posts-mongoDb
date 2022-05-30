import {IPassword, IPasswordObjectType} from "../repositories/db"
import {passwordsRepository} from "../repositories/passwords-repository";

export const passwordsService = {
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
        return passwordsRepository.updatePasswords(newPasswordsArr, userId)
    },
    async updatePasswordObject(id: number,
                               service: string,
                               name: string,
                               password: string,
                               userId: number): Promise<IPasswordObjectType | null> {
        const passwordObj: IPasswordObjectType | null = await passwordsRepository.findPasswordsByUserId(userId)
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
        const isPasswordUpdated: Promise<boolean> = passwordsRepository.updatePasswords(passwords, userId)
        return await isPasswordUpdated ? newPasswordObject : null
    },

    async deletePasswordObject(id: number, userId: number): Promise<boolean | null> {
        const passwordObj: IPasswordObjectType | null = await passwordsRepository.findPasswordsByUserId(userId)
        if (!passwordObj?.passwords) {
            return null
        }

        const passwords: IPassword[] = passwordObj.passwords.filter(passwordItem => passwordItem.id !== id)

        return passwordsRepository.updatePasswords(passwords, userId)
    }
}