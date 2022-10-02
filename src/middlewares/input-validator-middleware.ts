import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

interface IErrorMessage {
    errorsMessages: [
        {
            message: string,
            field: string
        }
    ],
}

export const errorObj: IErrorMessage = {
    errorsMessages: [{
        message: '',
        field: ''
    }],
}

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next()
    } else {
        errors.array().map(e => {
            if (e.msg === 'incorrect blogId') {
                res.status(404)
                return
            }
        })
        res.status(400).json({
            errorsMessages: errors.array().map(e => {
                return {
                    message: e.msg,
                    field: e.param
                }
            })
        });
    }
}