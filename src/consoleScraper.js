const cheerio = require('cheerio');
const fetch = require('node-fetch');

const sites = require('./sites.json');

async function getCoffee(site) {
  const page = await fetch(`${sites[site].url}`).then(res => res.text());
  const $ = cheerio.load(page, {
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: true,
    decodeEntities: true,
  });

  const selected = $(`.${sites[site].class}`)
    .map(function() {
      return $(this)
        .text()
        .replace(/\s+/g, ' ');
    })
    .toArray();
  return { [site]: selected };
}

const coffeeScrape = Promise.all(
  Object.keys(sites).map(site => getCoffee(site)),
)
  .then(allCoffeeData => {
    allCoffeeData.map(x => console.log(JSON.stringify(x, null, 2)));
  })
  .catch(console.error);
