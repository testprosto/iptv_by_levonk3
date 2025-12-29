import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL is required");

  try {
    const response = await fetch(url);
    const data = await response.text();

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(data);
  } catch (err) {
    res.status(500).send("Error fetching URL");
  }
}
