import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {runDb} from './repositories/db'
import {bloggersRouter} from './routes/bloggers-router'
import {postsRouter} from './routes/posts-router'
import {usersRouter} from "./routes/users-router"
import {passwordsRouter} from "./routes/passwords-router";

const app = express()

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)
app.use(cors());

const port = process.env.PORT || 5000

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/login', usersRouter)
app.use('/passwords', passwordsRouter)


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()