import "dotenv/config"
import express from "express";
import Router from "./src/routes/alunoRoute.js";
import cors from "cors"
import db from "./src/db/db.js";
import manipuladorDeErros from "./src/middlewares/manipuladorDeErros.js";


db()
const app = express();


app.use(cors())
app.use(express.json())
app.use(Router)
app.use(manipuladorDeErros)


const Porta = process.env.PORT || 10000
app.listen(Porta,"0.0.0.0",()=>{
    console.log(`servidor rodando em http://localhost:${Porta}`);
});