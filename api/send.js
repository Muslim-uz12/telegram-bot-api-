module.exports = async (req, res) => {
    // 1. CORS sozlamalari (Aloqa uchun)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const { email, phone, text } = body;

            // --- TEKSHIRUV (Validation) ---
            // Bu yerga o'zingizning AbstractAPI kalitlaringizni qo'ying!
            const EMAIL_KEY = "70ddf60ad004474092a288f62b8067e1"; 
            const PHONE_KEY = "cd801b011fd84a99a665bc19d556d817";

            // Emailni tekshirish
            const emailCheck = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_KEY}&email=${email}`);
            const emailData = await emailCheck.json();
            if (emailData.deliverability === "UNDELIVERABLE") {
                return res.status(400).json({ error: "Email manzili yaroqsiz!" });
            }

            // Telefonni tekshirish
            const phoneCheck = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${PHONE_KEY}&phone=${phone}`);
            const phoneData = await phoneCheck.json();
            if (!phoneData.valid) {
                return res.status(400).json({ error: "Telefon raqami noto'g'ri!" });
            }

            // --- TELEGRAMGA YUBORISH ---
            // Bu qism sizning Telegram botingizga xabar yuboradi
            const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: process.env.CHAT_ID, text: text })
            });

            const data = await response.json();
            res.status(200).json(data);

        } catch (error) {
            res.status(500).json({ error: "Xatolik yuz berdi" });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
