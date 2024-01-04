<script>
import Card from "./components/Card.vue";
import MANIFEST_JSON from "../manifest.json";
export default {
  components: {
    Card,
  },
  data() {
    return {
      items: [],
      message: undefined,
    };
  },
  created() {
    const fetchBungieApiCalls = async () => {
      // Going to put all the async/await
      // calls in a big try/catch block.
      try {
        // API calls for items and manifests.
        const XUR_HASH = "2190858386";
        const VENDOR_PROMISE = await fetch("/api/vendor");
        const VENDOR = await VENDOR_PROMISE.json();

        if (VENDOR.ErrorCode === 1) {
          const MANIFEST_PROMISE = await fetch("/api/manifest");
          const MANIFEST = await MANIFEST_PROMISE.json();
          const STAT_MANIFEST =
            MANIFEST.Response.jsonWorldComponentContentPaths.en
              .DestinyStatDefinition;
          const STATS_PROMISE = await fetch(
            `https://www.bungie.net/${STAT_MANIFEST}`
          );
          const STATS = await STATS_PROMISE.json();
          const SALES = VENDOR.Response.sales.data[XUR_HASH].saleItems;

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
            if (
              xurItem.itemType === 3 &&
              xurItem.stats &&
              xurItem.stats.stats
            ) {
              for (const s in xurItem.stats.stats) {
                if (STATS[s].displayProperties.name) {
                  var tempObj = {
                    ["name"]: STATS[s].displayProperties.name,
                    ["value"]: xurItem.stats.stats[s].value,
                  };
                  statArrayRaw.push(tempObj);
                }
              }

              // Loop through the sockets, which contain the perks and other fun stuff.
              // We'll use the manifest, as to avoid pinging the API. Also, faster.
              for (const p in xurItem.sockets.socketEntries) {
                let hash =
                  xurItem.sockets.socketEntries[p].singleInitialItemHash;
                if (!hash == 0) {
                  let tempObj = {
                    ["name"]: MANIFEST_JSON[hash].displayProperties.name,
                    ["description"]:
                      MANIFEST_JSON[hash].displayProperties.description,
                    ["icon"]:
                      "https://bungie.net" +
                      MANIFEST_JSON[hash].displayProperties.icon,
                  };
                  traitArrayRaw.push(tempObj);
                }
              }
            }

            let statArray = [];

            // Re-order the stats that are more legible
            // and consistent with Bungie's in game experience.
            const STAT_ORDER_OBJECT = {
              Impact: 0,
              Range: 0,
              Stability: 0,
              Handling: 0,
              "Reload Speed": 0,
              "Aim Assistance": 0,
              "Airborne Effectiveness": 0,
              Zoom: 0,
            };

            Object.keys(STAT_ORDER_OBJECT).forEach((key) => {
              statArray.push(statArrayRaw.find((o) => o.name === key));
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
              traits: traitArrayRaw,
            };
            itemArray.push(itemObject);
          }

          // We dont want the first which, which is an exotic engram.
          itemArray.pop();
          // We also dont want the last item, which is an exotic cipher.
          itemArray.shift();
          this.items = itemArray;
        } else {
          this.message = VENDOR;
        }
      } catch (e) {
        return console.log(e);
      } finally {
        console.log("Bungie calls complete.");
      }
    };
    return fetchBungieApiCalls();
  },
};
</script>

<template>
  <div v-if="items.length">
    <div class="container mx-auto px-12">
      <header class="flex justify-between items-center xur-header-border py-12">
        <div>
          <h1><a href="/">Xur Inventory</a></h1>
        </div>
        <h6>IX</h6>
      </header>
      <div class="flex my-12">
        <div class="w-4/12 xur-nav">
          <div class="xur-card-list bg-xur-dark-bg-secondary xur-border p-5">
            <h3>Items</h3>
            <ul>
              <li v-for="item in items">
                <a :href="'#' + item.hash">
                  <div class="flex justify-between items-center">
                    {{ item.name }}
                    <small>{{ item.type }}</small>
                  </div>
                  <p class="opaque">{{ item.description }}</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-8/12 xur-list">
          <ul>
            <li v-for="item in items">
              <Card :key="item.hash" :item="item" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!items.length && message == undefined">
    <div class="w-full h-screen flex items-center justify-center">
      <div
        class="animate-pulse loader bg-xur-dark-bg-secondary xur-border p-5 flex"
      >
        <h3 class="mr-4">Fetching most recent game data</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 14 14"
          fill="none"
        >
          <g clip-path="url(#clip0_1552_21085)">
            <path
              d="M7.47003 6.89996C7.3217 6.96437 7.16173 6.9976 7.00003 6.9976C6.83832 6.9976 6.67835 6.96437 6.53003 6.89996L0.830026 4.25996C0.737468 4.21328 0.659684 4.14182 0.605338 4.05354C0.550992 3.96526 0.522217 3.86363 0.522217 3.75996C0.522217 3.65629 0.550992 3.55466 0.605338 3.46638C0.659684 3.37811 0.737468 3.30665 0.830026 3.25996L6.53003 0.599961C6.67835 0.535554 6.83832 0.502319 7.00003 0.502319C7.16173 0.502319 7.3217 0.535554 7.47003 0.599961L13.17 3.23996C13.2626 3.28665 13.3404 3.35811 13.3947 3.44638C13.4491 3.53466 13.4778 3.63629 13.4778 3.73996C13.4778 3.84363 13.4491 3.94526 13.3947 4.03354C13.3404 4.12182 13.2626 4.19328 13.17 4.23996L7.47003 6.89996Z"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.5 7.34998L7.4 10.16C7.26972 10.2194 7.12819 10.2502 6.985 10.2502C6.84181 10.2502 6.70028 10.2194 6.57 10.16L0.5 7.34998"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.5 10.6L7.4 13.41C7.26972 13.4694 7.12819 13.5002 6.985 13.5002C6.84181 13.5002 6.70028 13.4694 6.57 13.41L0.5 10.6"
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_1552_21085">
              <rect width="14" height="14" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  </div>
  <div v-else="message">
    <div>
      <span>Error Code {{ message.ErrorCode }} : {{ message.ErrorStatus }}</span
      >{{ message.Message
      }}<a href="https://help.bungie.net/hc/en-us">Bungie.net</a>
    </div>
  </div>
</template>
