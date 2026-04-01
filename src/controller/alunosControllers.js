import alunos from "../models/alunos.js"
import pagamentos from "../models/recibos.js"

class Aluno {
    static cadastrarAlunos = async (req,res,next) => {
        try{
        let novoAluno = new alunos(req.body)

        const alunoSalvo = await novoAluno.save()

        return res.status(201).json(
            {
                message: "Aluno cadastrado com sucesso",
                aluno: alunoSalvo
            }
        )
         }catch(error){
            next(error)
         }
    }

    static listarAlunos = async (req,res,next) => {
        try {
            const alunosEncontrados = await alunos.find()

            return res.status(200).json({alunosEncontrados})

        } catch (error) {
            next(error)
        }
    }

    static atualizaAluno = async (req, res, next) => {
        try {
            const { id } = req.params;
            let dadosParaMudar = { ...req.body };

            const alunoAntesDeMudar = await alunos.findById(id);

            if (!alunoAntesDeMudar) {
                return res.status(404).json({ message: "Aluno não encontrado" });
            }

       
            if (dadosParaMudar.statusPagamento === true) {
                const dataDeHoje = new Date();
                
                
                dadosParaMudar.statusPagamento = dataDeHoje;

               
                await pagamentos.create({
                    alunoId: id,
                    nomeAluno: alunoAntesDeMudar.nome,
                    valor: 100,
                    dataPagamento: dataDeHoje
                });
                
                console.log(` Recibo gerado e validade de 30 dias iniciada para ${alunoAntesDeMudar.nome}`);
            }

            const alunoAtualizado = await alunos.findByIdAndUpdate(
                id, 
                { $set: dadosParaMudar }, 
                { new: true } 
            );

            return res.status(200).json({
                message: "Aluno atualizado com sucesso!",
                aluno: alunoAtualizado
            });

        } catch (error) {
            console.error("Erro ao atualizar no banco:", error);
            next(error);
        }
    }


    static deletarAluno = async (req,res,next) => {
        try {
            const {id} = req.params
            await alunos.findByIdAndDelete(id)

            return res.status(200).json(
                {
                    message: "Aluno deletado com sucesso"
                }
            )
        } catch (error) {
            next(error)
        }
    }

    static loginAluno = async (req,res,next) => {
        try {
             const {nome,senha} = req.body
             const alunoEncontrado = await alunos.findOne({nome: nome})
            if (alunoEncontrado && alunoEncontrado.senha === senha) {
                return res.status(200).json(
                    {
                        message: "Aluno encontrado com sucesso",
                        aluno:{
                            nome: alunoEncontrado.nome,
                            prajied: alunoEncontrado.prajied,
                            statusPagamento: alunoEncontrado.statusPagamento
                        }
                    }
                )
            }else{
                return res.status(401).json(
                    {
                        message: "nome ou senha incorretos"
                    }
                )
            }
        } catch (error) {
            next(error)
        }
    }

    static listarRecibos = async (req,res,next) => {
        try {
            const todosOsRecibos = await pagamentos.find().sort({dataPagamento:-1})
            return res.status(200).json(
                todosOsRecibos
            )
        } catch (error) {
            next(error)
        }
    }
} 

export default Aluno;