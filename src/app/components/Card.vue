<script>
import Stat from "./Stat.vue";
export default {
  name: "Card",
  props: {
    item: Object,
  },
  components: {
    Stat,
  },
};
</script>

<template>
  <div v-bind:id="item.hash" class="xur-card mb-12 pl-8">
    <div>
      <div>
        <div class="flex justify-between items-center pb-8">
          <h2>{{ item.name }}</h2>
          <img
            v-bind:alt="item.description"
            class="xur-icon"
            v-bind:src="item.icon"
          />
        </div>
        <div
          v-if="item.itemType === 3"
          class="xur-stats bg-xur-dark-bg-secondary xur-border p-5 mb-8"
        >
          <h3>{{ item.name }} Stats</h3>
          <ul>
            <li
              v-for="stat in item.stats"
              class="flex items-center justify-between"
            >
              <Stat :stat="stat" />
            </li>
          </ul>
        </div>
        <div class="xur-card-border pb-8">
          <ul class="columns-3 gap-8">
            <li
              v-for="trait in item.traits"
              class="w-full xur-perk break-inside-avoid bg-xur-dark-bg-secondary xur-border p-5 mb-8"
            >
              <div>
                <h3>{{ trait.name }}</h3>
                <p class="opaque">{{ trait.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
