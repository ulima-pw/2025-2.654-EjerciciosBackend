import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import { PrismaClient } from "./generated/prisma"

dotenv.config() 
const app = express()
const PORT = process.env.PORT

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(cors()) // Habilitamos peticiones de cualquier origen

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

app.post("/login", async (req : Request, resp : Response) => {
    const username = req.body.username
    const password = req.body.password

    const prisma = new PrismaClient()
    const usuario = await prisma.usuario.findFirst({
        where : {
            username : username,
            password : password
        },
        omit : {
            password : true,
            apellido : true,
            activo : true
        }
    })

    if (usuario == null) {
        // Login incorrecto
        resp.status(401).json({
            error : "Credenciales invalidas"
        })
        return
    }else {
        // Login Correcto
        resp.status(200).json(usuario)
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