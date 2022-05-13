import {bloggersRepository} from "../repositories/bloggers-repository"
import {bloggersCollection, BloggerType, PostType} from "../repositories/db"
import { postsRepository } from "../repositories/posts-repository"

export const postsService = {
    async findPosts(name: string | null | undefined): Promise<PostType[]> {
        return postsRepository.findPosts(name)
    },
    async findPostById(id: number): Promise<PostType | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: number): Promise<PostType> {
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        const newPost: PostType = {
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName: blogger ? blogger.name : 'unknown',
            id: +(new Date()),
        }
        return postsRepository.createPost(newPost)
    },
    async updatePost(id: number,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: number): Promise<boolean> {
        return postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    },

    async deletePost(id: number): Promise<boolean> {
        return postsRepository.deletePost(id)
    }
}