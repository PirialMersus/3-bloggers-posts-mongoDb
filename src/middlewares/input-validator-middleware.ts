import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

interface IErrorMessage {
    errorsMessages: [
        {
            message: string,
            field: string
        }
    ],
    resultCode: number
}

export const errorObj: IErrorMessage = {
    errorsMessages: [{
        message: '',
        field: ''
    }],
    resultCode: 0
}

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next()
    } else {
        res.status(400).json({
            resultCode: 0,
            errorsMessages: errors.array().map(e => {
                return {
                    message: e.msg,
                    field: e.param
                }
            })
        });
    }
}