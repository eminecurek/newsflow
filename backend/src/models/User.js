const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Kullanıcı adı zorunludur.'],
      unique: true,
      trim: true,
      minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır.'],
      maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olabilir.'],
      match: [/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.'],
    },
    email: {
      type: String,
      required: [true, 'E-posta adresi zorunludur.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz.'],
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur.'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır.'],
    },
    preferences: {
      categories: {
        type: [String],
        default: ['genel', 'teknoloji'],
        enum: ['teknoloji', 'spor', 'ekonomi', 'eglence', 'saglik', 'bilim', 'genel', 'politika'],
      },
      language: {
        type: String,
        default: 'tr',
        enum: ['tr', 'en'],
      },
    },
    savedArticles: [
      {
        articleId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        url: { type: String, required: true },
        urlToImage: { type: String, default: '' },
        publishedAt: { type: String, default: '' },
        source: { type: String, default: '' },
        category: { type: String, default: 'genel' },
        savedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Şifreyi kaydetmeden önce hashle
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// JSON'a dönüştürürken şifreyi çıkar
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
