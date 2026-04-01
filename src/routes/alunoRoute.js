    import express from "express"
    import Aluno from "../controller/alunosControllers.js";

    const Router = express.Router();

    Router
    //alunos
    .post("/api/matricula",Aluno.cadastrarAlunos)
    .post("/api/login",Aluno.loginAluno)

    //mestre
    .get("/api/admin",Aluno.listarAlunos)
    .get("/api/recibos",Aluno.listarRecibos)
    .put("/api/admin/:id",Aluno.atualizaAluno)
    .delete("/api/admin/:id",Aluno.deletarAluno)

    export default Router;
