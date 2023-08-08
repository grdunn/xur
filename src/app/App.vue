<script>
import Card from './components/Card.vue'
import MANIFEST_JSON from '../manifest.json';
export default {
  components: {
    Card
  },
  data() {
    return {
      items: []
    };
  },
  created() {
    const fetchBungieApiCalls = async () => {

      // Going to put all the async/await 
      // calls in a big try/catch block.
      try {

        // API calls for items and manifests.
        const XUR_HASH = '2190858386';
        const VENDOR_PROMISE = await fetch('/api/vendor');
        const VENDOR = await VENDOR_PROMISE.json();
        const MANIFEST_PROMISE = await fetch('/api/manifest');
        const MANIFEST = await MANIFEST_PROMISE.json();
        const STAT_MANIFEST = MANIFEST.Response.jsonWorldComponentContentPaths.en.DestinyStatDefinition;
        const STATS_PROMISE = await fetch(`https://www.bungie.net/${STAT_MANIFEST}`);
        const STATS = await STATS_PROMISE.json();
        const SALES = VENDOR.Response.sales.data[XUR_HASH].saleItems;

        console.log(VENDOR);

        // Set itemArray to an empty array first.
        // We'll loop through and add items to this bucket.
        let itemArray = [];

        // Loop through all of Xur's sales inventory
        for (const property in SALES) {
          let hash = SALES[property].itemHash;

          // Grab the actual item from the Bungie API.
          let xurItemRequest = await fetch(`/api/item?hash=${hash}`);
          let xurItem = await xurItemRequest.json();

          let statArrayRaw = [];
          let traitArrayRaw = [];

          // Loop through the stats, and only grab them if they are weapon type.
          // The Bungie API awkwardly does not provide meaningful stats for armor.
          // Since the entry on Xur's object is a hash, we have to cross reference
          // the Stats manifest to pull out the name. 
          if (xurItem.itemType === 3 && xurItem.stats && xurItem.stats.stats) {
            for (const s in xurItem.stats.stats) {
              if (STATS[s].displayProperties.name) {
                var tempObj = {
                  ['name']: STATS[s].displayProperties.name,
                  ['value']: xurItem.stats.stats[s].value
                }
                statArrayRaw.push(tempObj)
              }
            }  

            // Loop through the sockets, which contain the perks and other fun stuff.
            // We'll use the manifest, as to avoid pinging the API. Also, faster.
            for (const p in xurItem.sockets.socketEntries) {
              let hash = xurItem.sockets.socketEntries[p].singleInitialItemHash;
              if (!hash == 0) {
                  let tempObj = {
                    ['name']: MANIFEST_JSON[hash].displayProperties.name,
                    ['description']: MANIFEST_JSON[hash].displayProperties.description,
                    ['icon']: 'https://bungie.net' + MANIFEST_JSON[hash].displayProperties.icon
                  }
                traitArrayRaw.push(tempObj)
              }
            }
          }
          

          let statArray = [];

          // Re-order the stats that are more legible 
          // and consistent with Bungie's in game experience.
          const STAT_ORDER_OBJECT = {
            "Impact": 0,
            "Range": 0,
            "Stability": 0,
            "Handling": 0,
            "Reload Speed": 0,
            "Aim Assistance": 0,
            "Airborne Effectiveness": 0,
            "Zoom": 0
          }
          
          Object.keys(STAT_ORDER_OBJECT).forEach(key => {
            statArray.push(statArrayRaw.find(o => o.name === key));
          });

          // Create the big item object and push it into the
          // items array.
          let itemObject = {
            hash: xurItem.hash,
            name: xurItem.displayProperties.name,
            description: xurItem.flavorText,
            icon: `https://bungie.net/${xurItem.displayProperties.icon}`,
            screenshot: `https://bungie.net/${xurItem.screenshot}`,
            type: xurItem.itemTypeAndTierDisplayName,
            stats: statArray,
            itemType: xurItem.itemType,
            traits: traitArrayRaw
          }
          itemArray.push(itemObject)
        }

        // We dont want the first which, which is an exotic engram.
        itemArray.pop();
        // We also dont want the last item, which is an exotic cipher. 
        itemArray.shift();

        this.items = itemArray;
        console.log(itemArray);
      } catch (e) {
        return console.log(e);;
      } finally {
        console.log('Bungie calls complete.');
      }
    };
    return fetchBungieApiCalls();
  }
};
</script>

<template>
  <div v-if="items.length" class="o-container">
    <header class="c-header">
      <div>
        <h1><a href="#">Xur Inventory</a></h1>
      </div>
      <h6>IX</h6>
    </header>
    <div class="o-container__inner">
      <ul>
        <li v-for="item in items">
          <Card :key="item.hash" :item="item"/>
        </li>
      </ul>
    </div>
    <aside class="c-aside">
      <ul class="c-aside__links">
        <h3>Items</h3>
        <li class="c-aside__link" v-for="item in items">
          <a :href="'#' + item.hash">{{ item.name }}</a>
        </li>
      </ul>
    </aside>
  </div>
  <div v-else class="c-loading">
    <div class="c-loading__inner">
      <img src="/loader_ghost.gif"/>
    </div>
  </div>
</template>
