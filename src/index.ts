import express, {Request, Response, NextFunction} from "express"
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

const authenticator = (req : Request, resp : Response, next : NextFunction) => {
    const token = req.header("Authorization")

    if (token == undefined) {
        resp.status(400).json({
            error : "Debe enviar un token."
        })
        return
    }

    if (token == "Bearer abc123") {
        next()
        return
    }else {
        resp.status(403).json({
            error : "Token invalido"
        })
        return
    }
}

app.post("/login", (req : Request, resp : Response) => {
    const username = req.body.username
    const password = req.body.password

    if (username == "PW" && password == "123") {
        resp.json({
            token : "abc123"
        })
        return
    }else {
        resp.status(400).json({
            error : "Credenciales invalidas"
        })
        return
    }
})

app.get("/profile", authenticator, (req : Request, resp : Response) => {
    // /profile?token=12312
    //const token = req.query.token
    resp.send("OK")
    
})

app.get("/main", authenticator, (req : Request, resp : Response) => {
    
})

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`)
})