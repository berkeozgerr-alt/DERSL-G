// db.config.js
const mongoose = require('mongoose');

// ⚠️ DİKKAT: .env dosyanıza MONGODB_URI ekleyin
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/derslig_db'; 

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('✅ MongoDB Veritabanına Başarıyla Bağlandı.');
    } catch (err) {
        console.error('❌ MongoDB Bağlantı Hatası:', err.message);
        // Hata durumunda uygulamayı sonlandır
        process.exit(1); 
    }
};

module.exports = connectDB;
