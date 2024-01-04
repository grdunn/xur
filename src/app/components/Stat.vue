<script>
export default {
  name: "Stat",
  props: {
    stat: Object,
  },
};
</script>

<template>
  <div class="flex w-6/12 items-center">
    <p v-if="stat && stat.name" class="">{{ stat.name }}</p>
    <p v-if="stat && stat.value" class="xur-stat-value">
      {{ stat.value }}
    </p>
  </div>
  <div
    v-if="stat && stat.value"
    v-tippy="{ content: stat.value }"
    class="w-6/12 flex items-center self-stretch cursor-pointer"
  >
    <progress
      class="w-full xur-stat"
      v-bind:value="stat.value"
      max="100"
    ></progress>
  </div>
</template>
