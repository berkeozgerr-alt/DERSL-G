// server.js - DersLig Projesi için Tam Arka Uç Sunucu Dosyası

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios'); // GitHub Auth için
const connectDB = require('./db.config'); // YENİ: Veritabanı bağlantısı
const courseRoutes = require('./routes/courseRoutes'); // YENİ: Ders API rotaları

// .env dosyasındaki değişkenleri yükle
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// GitHub OAuth Bilgileri (Buraya .env'den gelen bilgiler yüklenir)
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// ----------------------------------------------------
// ⚙️ MIDDLEWARE'LER
// ----------------------------------------------------
app.use(cors()); 
app.use(express.json());

// ----------------------------------------------------
// 🔗 VERİTABANI BAĞLANTISI
// ----------------------------------------------------
// Uygulama başlarken veritabanına bağlanır
connectDB();

// ----------------------------------------------------
// 🔑 GITHUB AUTH KODU (Adım 1: Kullanıcı Girişi)
// ----------------------------------------------------

app.post('/api/auth/github', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'GitHub yetkilendirme kodu eksik.' });
    }

    try {
        // 1. GitHub'dan Erişim Jetonu (Access Token) Talep Et
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
            },
            {
                headers: { Accept: 'application/json' }, 
            }
        );

        const { access_token } = tokenResponse.data;

        if (!access_token) {
             return res.status(401).json({ message: 'GitHub yetkilendirmesi başarısız.' });
        }

        // 2. Kullanıcı Profilini Çek
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });

        const githubUser = userResponse.data;
        
        // 3. Başarılı Yanıt ve Kullanıcı Bilgisi
        res.json({ 
            success: true, 
            message: 'Giriş başarılı',
            user: {
                id: githubUser.id,
                username: githubUser.login,
                avatar_url: githubUser.avatar_url
            }
        });

    } catch (error) {
        console.error('GitHub giriş hatası:', error.message);
        res.status(500).json({ message: 'Sunucu hatası: GitHub ile iletişim kurulamadı.' });
    }
});


// ----------------------------------------------------
// 🚀 DERS API ROTLARI (Adım 3: Ders İçeriği)
// ----------------------------------------------------
// /api/courses ile başlayan tüm istekler courseRoutes dosyasına yönlendirilir
app.use('/api/courses', courseRoutes); 


// ----------------------------------------------------
// 🚦 SUNUCUYU BAŞLAT
// ----------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Arka Uç Sunucusu http://localhost:${PORT} adresinde çalışıyor...`);
});
