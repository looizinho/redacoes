import Fastify from "fastify";
import mongoose from "mongoose";
import User from "./models/User.js";
import Redacao from "./models/Redacao.js";

const app = Fastify({ logger: true });

// Configurações básicas de CORS para permitir acesso do app web/mobile durante o desenvolvimento
app.addHook("onRequest", (request, reply, done) => {
  const origin = request.headers.origin ?? "*";

  reply
    .header("Access-Control-Allow-Origin", origin)
    .header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    .header("Access-Control-Allow-Credentials", "true")
    .header("Vary", "Origin");

  if (request.method === "OPTIONS") {
    reply.code(204).send();
    return;
  }

  done();
});

// mongodb+srv://luizinho:searom@devclusterfree.ahvmaf1.mongodb.net/iassis
// Conectar ao MongoDB
mongoose.connect("mongodb://localhost:27017/iassis", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Criar novo usuário
app.post("/user/new", async (request, reply) => {
  const {
    username,
    age,
    credenciais: { password },
    tipo,
    nome,
    turmas,
    redacoes,
  } = request.body;
  try {
    const user = new User({
      username,
      age,
      credenciais: { password },
      tipo,
      nome,
      turmas,
      redacoes,
    });
    const saved = await user.save();
    reply.code(201).send(saved);
  } catch (err) {
    reply.code(500).send({ error: "Erro ao salvar usuário" });
  }
});

// Criar nova redação
app.post("/redacao/new", async (request, reply) => {
  const { aluno, professor, turma, titulo, status, data } = request.body;
  try {
    const redacao = new Redacao({
      aluno,
      professor,
      turma,
      titulo,
      status,
      data,
    });
    const saved = await redacao.save();
    reply.code(201).send(saved);
  } catch (err) {
    reply.code(500).send({ error: "Erro ao salvar redação" });
  }
});

// Listar usuários
app.get("/users", async (request, reply) => {
  try {
    const users = await User.find();
    reply.send(users);
  } catch (err) {
    reply.code(500).send({ error: "Erro ao buscar usuários" });
  }
});

// Listar redações
app.get("/redacoes", async (request, reply) => {
  try {
    const redacoes = await Redacao.find();
    reply.send(redacoes);
  } catch (err) {
    reply.code(500).send({ error: "Erro ao buscar redações" });
  }
});

// Iniciar servidor
app.listen({ port: 4000, host: "127.0.0.1" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
