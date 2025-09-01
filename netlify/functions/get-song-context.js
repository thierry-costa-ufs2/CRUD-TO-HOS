const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido.' })
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const { song, artist } = JSON.parse(event.body);

        const prompt = `Forneça um breve contexto histórico, cultural ou social para a música "${song}" de "${artist}". Responda em português do Brasil e mantenha a resposta concisa e direta.`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
      
        return {
            statusCode: 200,
            body: JSON.stringify({ context: text })
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Falha na comunicação com a IA.' })
        };
    }
};
