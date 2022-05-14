import {MongoClient} from 'mongodb'

export interface BloggerType {
    name: string,
    youtubeUrl: string,
    id: number
}
export interface PostType {
    id: number,
    bloggerId: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerName: string
}

const uri = "mongodb+srv://mersus:genafe@bloggers.ypwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

export const client = new MongoClient(uri);
export const bloggersCollection = client.db().collection<BloggerType>('bloggers')
export const postsCollection = client.db().collection<PostType>('posts')


export async function runDb() {
    try {
        await client.connect();
        // Establish and verify connection
        await client.db("bloggers").command({ping: 1});
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}