import {Request, Response, Router} from 'express'
import {body, param} from "express-validator";
import {bloggersService} from '../domain/bloggers-service';
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {IBlogger} from "../repositories/db";
import {IReturnedFindBloggersObj} from "../repositories/bloggers-repository";

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
    const response: IReturnedFindBloggersObj = await bloggersService.findBloggers(req.query) // req.query.name?.toString()
    console.log('response', response)
    res.send(response);
})
    .get('/:bloggerId?',
        param('bloggerId').not().isEmpty().withMessage('enter bloggerId value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            let blogger: IBlogger | null = await bloggersService.findBloggerById(+req.params.bloggerId)

            if (blogger) {
                res.send(blogger)
            } else {
                res.send(404)
            }
        })
    .post('/',
        body('youtubeUrl').not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('name').not().isEmpty().withMessage('enter input value in name field'),
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

            const newBlogger = await bloggersService.createBlogger(req.body.name, req.body.youtubeUrl)

            res.status(201).send(newBlogger)

        })
    .put('/:id?',
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

            const isUpdated: boolean = await bloggersService.updateBlogger(+req.params.id, name, youtubeUrl)
            if (isUpdated) {
                const blogger = await bloggersService.findBloggerById(+req.params.id)
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
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = +req.params.id;
            const isDeleted = await bloggersService.deleteBlogger(id)

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