import mongoose from "mongoose";

const db  = async () => {
    try {
        console.log("Link de conexão:", process.env.MONGODB ? "Identificado ✅" : "Vazio ❌");
        
        await mongoose.connect(process.env.MONGODB)
        console.log("conectado com sucesso ao banco de dados");
    } catch (error) {
        console.log("falha ao conectar no banco de dados" + error);
        process.exit(1)
    }
}

export default db;