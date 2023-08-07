<script>
import Card from './components/Card.vue'

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
      try {

        let vendorPromise = await fetch('/api/vendor');
        let vendor = await vendorPromise.json();
        let manifestPromise = await fetch('/api/manifest');
        let manifest = await manifestPromise.json();
        let statManifest = manifest.Response.jsonWorldComponentContentPaths.en.DestinyStatDefinition;
        let statsPromise = await fetch(`https://www.bungie.net/${statManifest}`);
        let stats = await statsPromise.json();
        let sales = vendor.Response.sales.data['2190858386'].saleItems;

        let itemArray = [];

        for (const property in sales) {
          let hash = sales[property].itemHash;
          let xurItemRequest = await fetch(`/api/item?hash=${hash}`);
          let statArrayRaw = [];
          const xurItem = await xurItemRequest.json();
          if (xurItem.itemType === 3 && xurItem.stats && xurItem.stats.stats) {
            for (const s in xurItem.stats.stats) {
              if (stats[s].displayProperties.name) {
                var tempObj = {
                  ['name']: stats[s].displayProperties.name,
                  ['value']: xurItem.stats.stats[s].value
                }
                statArrayRaw.push(tempObj)
              }
            }  
          }

          let statArray = [];

          let statOrderObj = {
            "Impact": 0,
            "Range": 0,
            "Stability": 0,
            "Handling": 0,
            "Reload Speed": 0,
            "Aim Assistance": 0,
            "Airborne Effectiveness": 0,
            "Zoom": 0
          }
          
          Object.keys(statOrderObj).forEach(key => {
            statArray.push(statArrayRaw.find(o => o.name === key));
          });

          let itemObject = {
            hash: xurItem.hash,
            name: xurItem.displayProperties.name,
            description: xurItem.flavorText,
            icon: `https://bungie.net/${xurItem.displayProperties.icon}`,
            screenshot: `https://bungie.net/${xurItem.screenshot}`,
            type: xurItem.itemTypeAndTierDisplayName,
            stats: statArray,
            itemType: xurItem.itemType
          }
          itemArray.push(itemObject)
        }
        itemArray.pop();
        itemArray.shift();
        this.items = itemArray;
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
      <div class="">
        <h1>Xur Inventory</h1>
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
  <div v-else class="u-loading">
    <div class="u-loading__inner">
      <img src="/loader_ghost.gif"/>
      </div>
    </div>
</template>
