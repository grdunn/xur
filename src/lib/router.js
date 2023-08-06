const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();

const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY;
const BUNGIE_ENDPOINTS = {
  xur: 'https://www.bungie.net/Platform/Destiny2/Vendors/?components=400,101,401,402',
  manifest: 'https://www.bungie.net/Platform/Destiny2/Manifest/',
  item: 'https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/'
}

const bungieApiRequest = async (url) => {
  const request = await fetch(url, {
    headers: {
      'X-API-Key': BUNGIE_API_KEY
    }
  })
  return data = await request.json();
}


router.get('/vendor', async (_req, res) => {
  const data = await bungieApiRequest(BUNGIE_ENDPOINTS.xur);
  res.status(200).send(data);
});

router.get('/manifest', async (_req, res) => {
  const data = await bungieApiRequest(BUNGIE_ENDPOINTS.manifest);
  res.status(200).send(data);
});

router.get('/item', async (_req, res) => {
  let hash = _req.query.hash;
  const data = await bungieApiRequest(BUNGIE_ENDPOINTS.item + hash);
  res.status(200).send(data.Response);
});

router.get('*', async (_req, res) => {
    res.redirect('/')
});

module.exports = router;