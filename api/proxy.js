import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL is required");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch URL");
    }

    // Проксируем поток напрямую клиенту
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Cache-Control", "no-cache");

    response.body.pipe(res); // stream
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching URL");
  }
}
