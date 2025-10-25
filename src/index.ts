import express, {Request, Response} from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"

dotenv.config()
const app = express()
const PORT = process.env.PORT

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`)
})