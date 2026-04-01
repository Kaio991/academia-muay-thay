import mongoose from "mongoose";

function manipuladorDeErros(erro,req,res,next) {
    if (erro instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: "Um ou mais dados fornecidos estão incorretos (ID inválido)." });
    }
    if (erro instanceof mongoose.Error.ValidationError) {
        
        const mensagens = Object.values(erro.errors).map(err => err.message).join("; ");
        return res.status(400).send({ message: `Erro de validação: ${mensagens}` });
    }
    res.status(500).send({ message: "Erro interno do servidor." });
}

export default manipuladorDeErros;