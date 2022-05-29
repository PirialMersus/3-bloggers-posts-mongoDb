import {IPasswordObjectType, IUser} from "../repositories/db"
import {usersRepository} from "../repositories/users-repository";
import {passwordsRepository} from "../repositories/passwords-repository";

export const usersService = {
    async findUser(name: string, password: string): Promise<IUser | null> {
        return usersRepository.findUser(name, password)
    },
    async createUser(name: string, password: string,): Promise<IUser | null> {
        const userId: number = +(new Date())
        const newUser: IUser = {
            name,
            password,
            id: userId,
        }
        const initPasswordsObject: IPasswordObjectType = {
            userId,
            passwords: []
        }
        const newPasswordObject = await passwordsRepository.createPasswordsObject(initPasswordsObject);
        return newPasswordObject ? usersRepository.createUser(newUser) : null
    },
}