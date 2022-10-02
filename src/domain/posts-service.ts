import {blogsRepository, IReturnedFindObj} from "../repositories/blogs-repository"
import {IPost} from "../repositories/db"
import {postsRepository} from "../repositories/posts-repository"

export type FindConditionsPostsObjType = {
    pageNumber: number
    pageSize: number
    skip: number
}
export type FindConditionsBlogsObjType = {
    blogId: string
    pageNumber: number
    pageSize: number
    skip: number
}

export const postsService = {
    findPosts(pageNumber: number,
              pageSize: number,
              sortBy: keyof IPost,
              sortDirection: string
    ): Promise<IReturnedFindObj<IPost>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsPostsObjType = {
            pageNumber,
            pageSize,
            skip,
        }
        return postsRepository.findPosts(findConditionsObj, sortBy, sortDirection)
    },
    async findPostById(id: string): Promise<IPost | null> {
        return postsRepository.findPostById(id)
    },
    async findPostsByBlogId(blogId: string,
                            pageNumber: number,
                            pageSize: number,
                            sortBy: keyof IPost,
                            sortDirection: string): Promise<IReturnedFindObj<IPost>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsBlogsObjType = {
            blogId,
            pageNumber,
            pageSize,
            skip,
        }
        return postsRepository.findPostsByBlogId(findConditionsObj, sortBy, sortDirection)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | null> {
        const blog = await blogsRepository.findBlogById(blogId)
        const date = new Date()
        const newPost: IPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog ? blog.name : 'unknown',
            id: (+date).toString(),
            createdAt: date.toISOString()
        }
        return postsRepository.createPost(newPost)
    },
    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {
        return postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id)
    }
}