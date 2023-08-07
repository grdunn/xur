<script>
export default {
  name: 'Stat',
  props: {
    stat: Object
  }
}
</script>

<template>
  <div v-if="stat && stat.name" class="c-item__stats-name">{{  stat.name }}</div>
  <div v-if="stat && stat.value" class="c-item__stats-value">{{ stat.value }}</div>
  <progress v-if="stat && stat.value" v-bind:value="stat.value" max="100"></progress>
</template>