import mongoose from 'mongoose';

const RedacaoSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // nome do model referenciado
    required: true,
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  turma: {
    type: String,
  },
  titulo: {
    type: String,
    default: 'Nova Redação',
  },
  status: {
    type: String,
    default: 'Não enviada',
  },
  data: {
    type: Object
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Redacao', RedacaoSchema);