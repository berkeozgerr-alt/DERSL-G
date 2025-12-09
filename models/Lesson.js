// models/Lesson.js
const mongoose = require('mongoose');

// İnteraktif soru/etkileşim noktası şeması
const InteractivePointSchema = new mongoose.Schema({
    // Videnun kaçıncı saniyesinde durdurulacağını belirtir (Örn: 30 saniye)
    timestamp: { type: Number, required: true }, 
    questionText: { type: String, required: true },
    options: [{ type: String }], // Cevap seçenekleri
    // Doğru cevabın indexi (options dizisinde)
    correctOptionIndex: { type: Number, required: true } 
}, { _id: false }); // Ekstra ID'ye gerek yok

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // Video oynatıcının kullanacağı URL
    duration: { type: Number }, // Video süresi (saniye)
    // İnteraktif soruların listesi
    interactivePoints: [InteractivePointSchema], 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', LessonSchema);
