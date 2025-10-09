import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  nome: {
    type: String
  },
  age: {
    type: Number
  },
  credenciais: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  tipo: {
    type: String
  },
  turmas: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  redacoes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

export default mongoose.model('User', UserSchema);