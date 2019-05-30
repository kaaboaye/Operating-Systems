<template>
  <span>
    <v-progress-circular
      :rotate="90"
      :size="100"
      :width="15"
      :value="(100 * worker.load) / capacity"
      color="teal"
      style="margin: 1em"
      >#{{ worker.id }}
      {{ Math.round((100 * worker.load) / capacity) }}%</v-progress-circular
    >
  </span>
</template>

<script>
export default {
  props: ["worker", "capacity"]
};
</script>
