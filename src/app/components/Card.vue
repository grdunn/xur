<script>
import Stat from './Stat.vue'
export default {
  name: 'Card',
  props: {
    item: Object
  },
  components: {
    Stat
  }
}
</script>

<template>
  <div v-bind:id="item.hash" class="c-item__card">
    <div class="c-item__description">
      <div class="c-item__meta">
        <div class="c-item__title">
          <h4>{{  item.type }}</h4>
          <h2>{{ item.name }}</h2>
          <p>{{ item.description }}</p>
          <img v-bind:alt="item.description" class="c-item__icon" v-bind:src="item.icon" />
        </div>
        <div v-if="item.itemType === 3" class="c-item__stats">
          <ul class="c-item__stats-list">
            <li v-for="stat in item.stats">
              <Stat :stat="stat" />
            </li>
          </ul>
        </div >
        <div class="c-item__traits">
          <ul class="c-item__traits-list">
            <li v-for="trait in item.traits">
              <div class="c-item__traits-item">
                <h3>{{ trait.name  }}</h3>
                <p>{{ trait.description  }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>