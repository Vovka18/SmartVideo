import dotenv from 'dotenv'
import express from 'express'
import {connect} from './database'
import cors from 'cors'
import routes from './routes'
import ErrorHandleMiddleware from './middleware/ErrorHandleMiddleware'
import fileUpload from 'express-fileupload';
import * as path from 'path'

dotenv.config()

const app = express()

app.use(cors()) 
app.use(express.json()) 
app.use(fileUpload({}))
app.use('/api',routes) 
app.use(express.static(path.resolve(__dirname,'..','static')))
app.use(ErrorHandleMiddleware)

const start = async () =>{
    await connect.authenticate()
    await connect.sync()
    app.listen(Number(process.env.PORT), String(process.env.HOST), () =>{
        console.log('server start on ' + process.env.PORT + ' port')
    })
}
start()


/*
    Запрос на поставку лайка
    Запрос на получение всех видео которые мы лайкали 
*/