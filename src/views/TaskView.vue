<script setup lang="ts">
import { useTaskStore } from "@/stores/task";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const store = useTaskStore();

const task = computed(() => {
  return store.getTaskById(route.params.id as string);
});

onMounted(() => {
  store.fetchTask(route.params.id as string);
});
</script>

<template>
  <h1>task</h1>
  <div v-if="task">
    {{ task.title }}
  </div>
</template>
