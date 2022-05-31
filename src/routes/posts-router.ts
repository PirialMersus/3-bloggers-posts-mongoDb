import {Request, Response, Router} from 'express'
import {body, param} from "express-validator";
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {IPost} from "../repositories/db";
import {postsService} from "../domain/posts-service";
import {bloggersService} from "../domain/bloggers-service";

export const postsRouter = Router({})
//TODO ask help
postsRouter.get('/', async (req: Request<{},{},{},{name: string}>, res: Response) => {
    const post: IPost[] = await postsService.findPosts(req.query.name)
    res.send(post);
})
    .get('/:postId?',
        param('postId').trim().not().isEmpty().withMessage('enter postId value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            let post: IPost | null = await postsService.findPostById(+req.params.postId)

            if (post) {
                res.send(post)
            } else {
                res.send(404)
            }
        })
    .post('/',
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('bloggerId').trim().not().isEmpty().withMessage('enter input value in bloggerId field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('bloggerId').isLength({max: 1000}).withMessage('bloggerId length should be less then 1000'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

            const newPost = await postsService.createPost(req.body.title,
                req.body.shortDescription,
                req.body.content,
                +req.body.bloggerId)

            res.status(201).send(newPost)

        })
    .put('/:id?',
        body('bloggerId').custom(async (value, {req}) => {
            const isBloggerPresent = await bloggersService.findBloggerById(+value)
            if (!isBloggerPresent) {
                throw new Error('incorrect blogger id');
            }
            return true;
        }),
        body('bloggerId').trim().not().isEmpty().withMessage('enter input value in bloggerId field'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('bloggerId').isLength({max: 1000}).withMessage('bloggerId length should be less then 1000'),
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const content = req.body.content;
            const bloggerId = +req.body.bloggerId;

            const id = +req.params.id;

            const isUpdated: boolean = await postsService.updatePost(id, title, shortDescription, content, bloggerId)
            if (isUpdated) {
                const product = await postsService.findPostById(+req.params.id)
                res.status(201).send(product)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Required post not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            }
        })
    .delete('/:id?',
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = +req.params.id;

            const isDeleted = await postsService.deletePost(id)


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