exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido.' })
        };
    }

    try {
        const { song, artist } = JSON.parse(event.body);
        if (!song || !artist) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Título e artista da música são obrigatórios.' })
            };
        }

        const deezerApiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(song + ' ' + artist)}&limit=1`;
        const response = await fetch(deezerApiUrl);
        const data = await response.json();

        if (data.data && data.data.length > 0 && data.data[0].preview && data.data[0].album.cover_medium) {
            const previewUrl = data.data[0].preview;
            const coverUrl = data.data[0].album.cover_medium;
          
            return {
                statusCode: 200,
                body: JSON.stringify({ previewUrl, coverUrl })
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Pré-visualização ou capa da música não encontrada.' })
            };
        }
    } catch (error) {
        console.error('Erro ao buscar a pré-visualização:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor ao buscar a pré-visualização.' })
        };
    }
};
