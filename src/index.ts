import express from 'express'
import bodyParser from 'body-parser'
import {runDb} from './repositories/db'
import {bloggersRouter} from './routes/bloggers-router'
import { postsRouter } from './routes/posts-router'

// create express app
const app = express()

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

const port = process.env.PORT || 5000

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()