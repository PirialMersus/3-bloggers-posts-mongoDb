import {Request, Response, Router} from 'express'
import {body, param} from "express-validator";
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {IPasswordObjectType} from "../repositories/db";
import {passwordsService} from "../domain/passwords-service";

export const passwordsRouter = Router({})

passwordsRouter
    .get('/:passwordObjectId?',
        param('passwordObjectId').not().isEmpty().withMessage('enter passwordObjectId value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            let passwordObject: IPasswordObjectType | null = await passwordsService.findPasswordsByUserId(+req.params.passwordObjectId)

            if (passwordObject) {
                res.send(passwordObject)
            } else {
                res.send(404)
            }
        })
    .post('/create',
        body('service').trim().not().isEmpty().withMessage('enter input value in service field'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        body('userId').trim().not().isEmpty().withMessage('enter input value in userId field'),

        body('service').isLength({max: 50}).withMessage('service length should be less then 50'),
        body('name').isLength({max: 50}).withMessage('name length should be less then 50'),
        body('password').isLength({max: 50}).withMessage('password length should be less then 50'),
        body('userId').isLength({max: 50}).withMessage('userId length should be less then 50'),

        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

            const newPassword = await passwordsService.addPasswordToUser(
                req.body.service,
                req.body.name,
                req.body.password,
                +req.body.userId)
            if (newPassword) {
                res.sendStatus(201)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Database error. Try again please',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            }
        })
    .post('/delete',
        body('passwordId').trim().not().isEmpty().withMessage('enter id value in params'),
        body('passwordId').isLength({max: 50}).withMessage('id length should be less then 50'),
        body('userId').trim().not().isEmpty().withMessage('enter input value in userId field'),
        body('userId').isLength({max: 50}).withMessage('id length should be less then 50'),

        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const passwordId = +req.body.passwordId;
            const userId = +req.body.userId;

            const isDeleted = await passwordsService.deletePasswordObject(passwordId, userId)

            if (!isDeleted) {
                errorObj.errorsMessages = [{
                    message: 'Required passwordObject not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            } else {
                res.send(204)
            }
        })
    .put('/',

        body('id').trim().not().isEmpty().withMessage('enter input value in id field'),
        body('service').trim().not().isEmpty().withMessage('enter input value in service field'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        body('userId').trim().not().isEmpty().withMessage('enter input value in userId field'),

        body('id').isLength({max: 50}).withMessage('id length should be less then 50'),
        body('service').isLength({max: 50}).withMessage('service length should be less then 50'),
        body('name').isLength({max: 50}).withMessage('name length should be less then 50'),
        body('password').isLength({max: 50}).withMessage('password length should be less then 50'),
        body('userId').isLength({max: 50}).withMessage('userId length should be less then 50'),

        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = +req.body.id;
            const service = req.body.service;
            const name = req.body.name;
            const password = req.body.password;
            const userId = +req.body.userId;

            const newPasswordObject: IPasswordObjectType | null = await passwordsService.updatePasswordObject(id, service, name, password, userId)
            if (newPasswordObject) {
                res.status(201).send(newPasswordObject)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Required passwordObject not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            }
        })