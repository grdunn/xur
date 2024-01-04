<script>
export default {
  name: "Stat",
  props: {
    stat: Object,
  },
};
</script>

<template>
  <div class="flex w-6/12">
    <p v-if="stat && stat.name" class="">{{ stat.name }}</p>
    <p v-if="stat && stat.value" class="xur-stat-value">
      {{ stat.value }}
    </p>
  </div>
  <div class="w-6/12">
    <progress
      class="w-full xur-stat"
      v-if="stat && stat.value"
      v-bind:value="stat.value"
      max="100"
    ></progress>
  </div>
</template>
