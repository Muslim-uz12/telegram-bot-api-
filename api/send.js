module.exports = async (req, res) => {
    // CORS xatolarini oldini olish
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'POST') {
        try {
            // Body'dan ma'lumotni o'qiymiz
            const body = JSON.parse(req.body);
            const text = body.text || "Bo'sh xabar"; // Agar matn bo'lmasa, yozuv chiqadi

            const token = process.env.BOT_TOKEN;
            const chatId = process.env.CHAT_ID;
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: text })
            });

            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    res.status(405).send('Faqat POST so\'rovi ruxsat etilgan');
};
