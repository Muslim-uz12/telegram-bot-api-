// api/send.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // CORS xavfsizlik cheklovlarini yechish
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'POST') {
        const { text } = JSON.parse(req.body);
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
    }
    res.status(405).send('Method not allowed');
};
