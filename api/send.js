module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            // Foydalanuvchi yuborgan ma'lumotlar
            const { email, phone, text } = body; 

            // --- TEKSHIRUV QISMI (AbstractAPI) ---
            const EMAIL_KEY = "70ddf60a...."; // O'z kalitingizni yozing
            const PHONE_KEY = "cd801b01...."; // O'z kalitingizni yozing

            const emailCheck = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_KEY}&email=${email}`);
            const emailData = await emailCheck.json();
            if (emailData.deliverability === "UNDELIVERABLE") {
                return res.status(400).json({ error: "Email manzili noto'g'ri!" });
            }

            const phoneCheck = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${PHONE_KEY}&phone=${phone}`);
            const phoneData = await phoneCheck.json();
            if (!phoneData.valid) {
                return res.status(400).json({ error: "Telefon raqami noto'g'ri!" });
            }
            // ------------------------------------

            // Telegramga yuborish
            const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: process.env.CHAT_ID, text: text || "Bo'sh xabar" })
            });

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
