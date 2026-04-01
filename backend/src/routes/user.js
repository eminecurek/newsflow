const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const VALID_CATEGORIES = ['teknoloji', 'spor', 'ekonomi', 'eglence', 'saglik', 'bilim', 'genel', 'politika'];

// PUT /api/user/preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { categories, language } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'En az bir kategori seçmelisiniz.' });
    }

    const invalidCategories = categories.filter((c) => !VALID_CATEGORIES.includes(c));
    if (invalidCategories.length > 0) {
      return res.status(400).json({ message: `Geçersiz kategoriler: ${invalidCategories.join(', ')}` });
    }

    const updateData = { 'preferences.categories': categories };
    if (language && ['tr', 'en'].includes(language)) {
      updateData['preferences.language'] = language;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Tercihler güncellendi.',
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ message: 'Tercihler güncellenirken hata oluştu.' });
  }
});

// GET /api/user/saved
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedArticles');
    const sorted = user.savedArticles.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    res.json({ articles: sorted });
  } catch (error) {
    console.error('Get saved error:', error);
    res.status(500).json({ message: 'Kaydedilen haberler yüklenirken hata oluştu.' });
  }
});

// POST /api/user/saved
router.post('/saved', auth, async (req, res) => {
  try {
    const { articleId, title, description, url, urlToImage, publishedAt, source, category } = req.body;

    if (!articleId || !title || !url) {
      return res.status(400).json({ message: 'Haber ID, başlık ve URL zorunludur.' });
    }

    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedArticles.some((a) => a.articleId === articleId);
    if (alreadySaved) {
      return res.status(409).json({ message: 'Bu haber zaten kaydedilmiş.' });
    }

    if (user.savedArticles.length >= 100) {
      return res.status(400).json({ message: 'En fazla 100 haber kaydedebilirsiniz.' });
    }

    user.savedArticles.push({
      articleId,
      title,
      description: description || '',
      url,
      urlToImage: urlToImage || '',
      publishedAt: publishedAt || new Date().toISOString(),
      source: source || '',
      category: category || 'genel',
      savedAt: new Date(),
    });

    await user.save();

    res.status(201).json({ message: 'Haber kaydedildi.' });
  } catch (error) {
    console.error('Save article error:', error);
    res.status(500).json({ message: 'Haber kaydedilirken hata oluştu.' });
  }
});

// DELETE /api/user/saved
router.delete('/saved', auth, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({ message: 'Haber ID zorunludur.' });
    }

    const user = await User.findById(req.user._id);
    const initialLength = user.savedArticles.length;

    user.savedArticles = user.savedArticles.filter((a) => a.articleId !== articleId);

    if (user.savedArticles.length === initialLength) {
      return res.status(404).json({ message: 'Haber bulunamadı.' });
    }

    await user.save();

    res.json({ message: 'Haber kaydedilenlerden kaldırıldı.' });
  } catch (error) {
    console.error('Delete saved article error:', error);
    res.status(500).json({ message: 'Haber silinirken hata oluştu.' });
  }
});

// PUT /api/user/password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mevcut şifre ve yeni şifre zorunludur.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'Yeni şifre mevcut şifrenizden farklı olmalıdır.' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mevcut şifre hatalı.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Şifre güncellenirken hata oluştu.' });
  }
});

module.exports = router;
