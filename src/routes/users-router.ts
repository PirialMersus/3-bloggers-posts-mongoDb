import {Request, Response, Router} from 'express'
import {body} from "express-validator";
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {usersService} from "../domain/users-service";
import {IUser} from "../repositories/db"

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    res.send({token: 'test123'});
})
    .post('/',
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        body('name').isLength({max: 50}).withMessage('name length should be less then 50'),
        body('name').isLength({min: 5}).withMessage('name length should be more then 5'),
        body('password').isLength({max: 50}).withMessage('password length should be less then 50'),
        body('password').isLength({min: 5}).withMessage('password length should be more then 5'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const newUser = await usersService.createUser(req.body.name, req.body.password)
            if (newUser) {
                res.status(201).send(newUser)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Cant create new user',
                    field: 'none',
                }]
                res.status(406).send(errorObj)
            }
        })
    .put('/',
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        body('name').isLength({max: 50}).withMessage('name length should be less then 50'),
        body('password').isLength({max: 50}).withMessage('password length should be less then 50'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const name = req.body.name;
            const password = req.body.password;

            const user: IUser | null = await usersService.findUser(name, password)
            if (user) {
                res.status(201).send(user)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Name or password is incorrect',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            }
        })
