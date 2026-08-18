import express from 'express';
import createConnection from './db/connectionDB.js';
import userRouter from './modules/users/user.controller.js';
import noteRouter from './modules/notes/note.controller.js';
const app = express()
const port = process.env.PORT || 3000


const bootstrap = async () => {

    app.use(express.json())

    createConnection()


    app.use('/users', userRouter)

    app.use('/notes', noteRouter)

    app.get('/', (req, res) => {
        res.send('server is running ...')
    })

    app.use((req, res) => {
        res.status(404).send('Route not found');
    });

    app.use((err, req, res, next) => {
        res.status(err.cause || 500).json({
            message: err.message,
            statusCode: err.cause || 500,
            stack: err.stack,
        })
    });
    app.listen(port, () => console.log('Server is up and running on port : ' + port))
}


export default bootstrap