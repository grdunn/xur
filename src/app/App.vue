<template>
  <div>
    <ul v-if="items.length">
      <li v-for="item in items">
        <img v-bind:src="item.icon" />
        <strong>{{  item.type }}</strong>
        {{ item.name }}
        {{ item.description }}
        <ul>
          <!-- To do: filter out stats in a computed property so there are no blank stats -->
          <li v-for="stat in item.stats.stats">
            <span v-if="stats[stat.statHash].displayProperties.name ">
              {{  stats[stat.statHash].displayProperties.name }}
              {{  stat.value }}
            </span>
          </li>
        </ul>
      </li>
    </ul>
    <h1 v-else>loading</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vendor: null,
      manifest: null,
      stats: null,
      items: []
    };
  },

  created() {
    const fetchData = async () => {
      try {

        let vendor = await fetch('/api/vendor');
        this.vendor = await vendor.json();

        let manifest = await fetch('/api/manifest');
        this.manifest = await manifest.json();

        let statManifest = this.manifest.Response.jsonWorldComponentContentPaths.en.DestinyStatDefinition;
        let stats = await fetch(`https://www.bungie.net/${statManifest}`);
        this.stats = await stats.json();

        let sales = this.vendor.Response.sales.data['2190858386'].saleItems;
        let itemArray = [];

        for (const property in sales) {
          let hash = sales[property].itemHash;
          let xurItemRequest = await fetch(`/api/item?hash=${hash}`);
          const xurItem = await xurItemRequest.json();
          let itemObject = {
            name: xurItem.displayProperties.name,
            description: xurItem.flavorText,
            icon: `https://bungie.net/${xurItem.displayProperties.icon}`,
            screenshot: `https://bungie.net/${xurItem.screenshot}`,
            type: xurItem.itemTypeDisplayName,
            stats: xurItem.stats || {}
          }
          itemArray.push(itemObject)
        }
        this.items = itemArray;
      } catch (e) {
        return console.log(e);;
      } finally {
        console.log('completed');
      }
    };
    return fetchData();
  }
};
</script>
