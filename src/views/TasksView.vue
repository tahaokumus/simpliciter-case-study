<script lang="ts">
import { computed, onMounted, ref } from "vue";
import { useTaskStore } from "@/stores/task";
import TasksTable from "@/components/TasksTable.vue";

export default {
  components: { TasksTable },
  setup() {
    const taskStore = useTaskStore();
    const tasks = computed(() => {
      return taskStore.getTasks;
    });
    const completedTasks = computed(() => {
      return taskStore.getCompletedTasks;
    });

    onMounted(() => {
      taskStore.fetchTasks();
    });

    const tab = ref("all");

    return {
      tasks,
      completedTasks,
      tab,
    };
  },
};
</script>

<template>
  <div class="q-pa-md">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="all" label="All tasks" />
      <q-tab name="completed" label="Completed" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="all">
        <TasksTable :tasks="tasks" />
      </q-tab-panel>

      <q-tab-panel name="completed">
        <TasksTable :tasks="completedTasks" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
