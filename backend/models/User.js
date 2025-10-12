import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

UserSchema.pre('save', async function hashPassword(next) {
  const password = this?.credenciais?.password;

  if (!password || !this.isModified('credenciais.password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.credenciais.password = await bcrypt.hash(password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('User', UserSchema);
