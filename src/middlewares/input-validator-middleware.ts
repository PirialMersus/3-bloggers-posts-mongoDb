import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

interface IErrorMessage {
    data: {
        additionalProp1: string,
        additionalProp2: string,
        additionalProp3: string
    },
    errorsMessages: [
        {
            message: string,
            field: string
        }
    ],
    resultCode: number
}

export const errorObj: IErrorMessage = {
    data: {
        additionalProp1: '',
        additionalProp2: '',
        additionalProp3: '',
    },
    errorsMessages: [{
        message: '',
        field: ''
    }],
    resultCode: 0
}

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // here we make validation. Also here we can transform returned object (for example to satisfy the Swagger API)
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next()
    } else {
        res.status(400).json({
            // data: {},
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