import {blogsRepository} from "../repositories/blogs-repository"
import {IPost} from "../repositories/db"
import {IReturnedFindPostsObj, postsRepository} from "../repositories/posts-repository"

export const postsService = {
    async findPosts(pageNumber: number, pageSize: number): Promise<IReturnedFindPostsObj> {

        const skip = (pageNumber - 1) * pageSize
        return postsRepository.findPosts(pageNumber, pageSize, skip)
    },
    async findPostById(id: string): Promise<IPost | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<IPost> {
        const blogger = await blogsRepository.findBloggerById(bloggerId)
        const newPost: IPost = {
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName: blogger ? blogger.name : 'unknown',
            id: (+(new Date())).toString(),
        }
        return postsRepository.createPost(newPost)
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: string): Promise<boolean> {
        return postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    },

    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id)
    }
}