import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  esignetSubjectId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'reviewer'],
    default: 'user',
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema, 'users');
