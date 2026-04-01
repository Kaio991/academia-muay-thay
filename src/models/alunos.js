import mongoose from "mongoose";

const alunoSchema = new mongoose.Schema(
    {
        nome:{
            type: String,
            required: [true, "O nome e obrigatorio"]
        },
        email:{
            type: String,
            required: true
        },
        telefone:{
            type: String,
            required: [true, "O telefone e obrigatorio"]
        },
        dataDeNascimento:{
            type: Date,
            required: true
        },
        senha:{
            type: String,
            required: true
        },
        prajied:{
            type: String,
            default: "Branca"
        },
        diaVencimento:{
            type:Number,
            required: true,
            default: new Date().getDate()
        },
        statusPagamento:{
            type: mongoose.Schema.Types.Mixed,
            default: false
        },
        dataMatricula:{
            type: Date,
            default:  Date
        }
    }
)

const alunos = mongoose.model("alunos",alunoSchema)

export default alunos;