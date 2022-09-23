import {Request, Response, Router} from 'express'
import {body, param} from "express-validator";
import {blogsService} from '../domain/blogs-service';
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {IBlog} from "../repositories/db";
import {IReturnedFindBloggersObj} from "../repositories/blogs-repository";
import {authMiddleware} from "../middlewares/auth-middleware";

export const blogsRouter = Router({})

export interface IRequest {
    SearchNameTerm: string,
    PageNumber: string,
    PageSize: string
}

blogsRouter.get('/', async (req: Request<{}, {}, {}, IRequest>, res: Response) => {
    const name = req.query.SearchNameTerm ? req.query.SearchNameTerm : ''
    const pageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
    const pageSize = req.query.PageSize ? +req.query.PageSize : 10
    const response: IReturnedFindBloggersObj = await blogsService.findBlogs(name, pageNumber, pageSize)
    // console.log('response', response)
    res.send(response);
})
    .get('/:blogId?',
        param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            // lines added
            //     const pageNumber = req.query.PageNumber ? +req.query.PageNumber : 1
            //     const pageSize = req.query.PageSize ? +req.query.PageSize : 10
            let blog: IBlog | null = await blogsService.findBlogById(req.params.bloggerId)

            if (blog) {
                res.send(blog)
            } else {
                res.send(404)
            }
        })
    .get('/:blogId/posts',
        param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            // lines added
            let blog: IBlog | null = await blogsService.findBlogById(req.params.blogId)

            if (blog) {
                res.send(blog)
            } else {
                res.send(404)
            }
        })
    .post('/',
        authMiddleware,
        body('youtubeUrl').trim().not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }

            return true;
        }),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

            const newBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl)

            res.status(201).send(newBlog)

        })
    .put('/:id?',
        authMiddleware,
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        body('name').not().isEmpty().withMessage('enter input value in name field'),
        body('youtubeUrl').not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }
            return true;
        }),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const name = req.body.name;
            const youtubeUrl = req.body.youtubeUrl;

            const isUpdated: boolean = await blogsService.updateBlogger(req.params.id, name, youtubeUrl)
            if (isUpdated) {
                const blogger = await blogsService.findBlogById(req.params.id)
                res.status(201).send(blogger)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Required blogger not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            }
        })
    .delete('/:id?',
        authMiddleware,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = req.params.id;
            const isDeleted = await blogsService.deleteBlogger(id)

            if (!isDeleted) {
                errorObj.errorsMessages = [{
                    message: 'Required blogger not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            } else {
                res.send(204)
            }
        })