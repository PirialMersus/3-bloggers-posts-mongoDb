import {bloggersRepository, IReturnedFindBloggersObj} from "../repositories/bloggers-repository"
import {IBlogger} from "../repositories/db"
import * as core from "express-serve-static-core";

export interface IFindObj {
    name: string,
    pageNumber: number,
    pageSize: number,
    skip: number,
}

export const bloggersService = {
    findBloggers(queryObj: core.Query): Promise<IReturnedFindBloggersObj> {

        const name = queryObj.SearchNameTerm ? queryObj.SearchNameTerm.toString() : ''
        const pageNumber = queryObj.PageNumber ? +queryObj.PageNumber : 1
        const pageSize = queryObj.PageSize ? +queryObj.PageSize : 10
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: IFindObj = {
            name,
            pageNumber,
            pageSize,
            skip,
        }

        return bloggersRepository.findBloggers(findConditionsObj)
    },

    async findBloggerById(id: number): Promise<IBlogger | null> {
        return bloggersRepository.findBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<IBlogger> {
        const newBlogger = {
            name,
            youtubeUrl,
            id: +(new Date()),
        }
        return bloggersRepository.createBlogger(newBlogger)
    },
    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async deleteBlogger(id: number): Promise<boolean> {
        return bloggersRepository.deleteBlogger(id)
    }
}