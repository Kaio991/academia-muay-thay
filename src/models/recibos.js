import mongoose from "mongoose";

const pagemntosSchema = new mongoose.Schema(
    {
        alunoId:
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'alunos',
            required: true 
        },
        nomeAluno: 
        {
            type: String,
            required: true 
        },
        dataPagamento: 
        { 
            type: Date, 
            default: Date.now 
        },
        valor: 
        {
            type: Number,
            default: 100 
        } 
        },
        { 
            versionKey: false
    }
);

const pagamentos = mongoose.model("pagamentos", pagemntosSchema)

export default pagamentos