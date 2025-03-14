const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/info', async (req, res) => {
    const url = req.query.url;
    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    try {
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'audioonly');
        res.json({
            title: info.videoDetails.title,
            lengthSeconds: info.videoDetails.lengthSeconds,
            thumbnails: info.videoDetails.thumbnails,
            audioUrl: formats[0].url
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/download', (req, res) => {
    const url = req.query.url;
    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).send("Invalid YouTube URL");
    }
    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    ytdl(url, { filter: 'audioonly' }).pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
