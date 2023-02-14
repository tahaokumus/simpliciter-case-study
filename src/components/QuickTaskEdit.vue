<script setup lang="ts">
import type Task from "@/models/Task";
import { useLayoutStore } from "@/stores/layout";
import { useTaskStore } from "@/stores/task";
import { computed, ref } from "vue";

const taskStore = useTaskStore();
const task = computed(() => {
  return taskStore.getTaskToEdit;
});

const newTask = ref({
  ...task.value,
} as Task);

const layoutStore = useLayoutStore();

const save = () => {
  taskStore.updateTask(newTask.value);
  taskStore.setTaskToEdit(null);
  layoutStore.setDrawerComponent(null);
  layoutStore.closeRightDrawer();
};
</script>

<template>
  <div class="q-pa-lg column" v-if="task">
    <q-input v-model="newTask.title" label="Title" dense />

    <q-date
      class="q-mt-md"
      v-model="newTask.endDate"
      minimal
      mask="YYYY-MM-DD"
      style="min-width: 250px"
    />

    <q-select
      class="q-mt-md"
      label="Tags"
      filled
      v-model="newTask.tags"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
      style="width: 250px"
    />

    <q-btn class="q-mt-lg" color="primary" label="Save" @click="save" />
  </div>
</template>
