import {bloggersRepository} from "../repositories/bloggers-repository"
import {BloggerType} from "../repositories/db"

export const bloggersService = {
    async findBloggers(name: string | null | undefined): Promise<BloggerType[]> {
        return bloggersRepository.findBloggers(name)
    },
    async findBloggerById(id: number): Promise<BloggerType | null> {
        return bloggersRepository.findBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
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