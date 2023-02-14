<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useTaskStore } from "@/stores/task";
import { useQuasar } from "quasar";

const $q = useQuasar();

const route = useRoute();

const taskStore = useTaskStore();

const task = computed(() => {
  return taskStore.getTaskById(route.params.id as string);
});

let newTask = ref();
onMounted(() => {
  taskStore.fetchTask(route.params.id as string).then(() => {
    newTask.value = {
      ...task.value,
      isCompleted: task.value?.state === "completed",
    };
  });
});

const save = async () => {
  if (newTask.value.isCompleted) {
    newTask.value.state = "completed";
  } else {
    newTask.value.state = "todo";
  }

  const taskToSubmit = { ...newTask.value };
  delete taskToSubmit.isCompleted;

  await taskStore.updateTask(taskToSubmit);

  $q.notify({
    type: "positive",
    message: "Updated successfully!",
  });
};
</script>

<template>
  <div v-if="newTask" class="q-pa-xl q-gutter-md task-edit">
    <q-toggle clas v-model="newTask.isCompleted" label="Is Completed" />

    <q-input
      class="q-mt-md"
      filled
      v-model="newTask.title"
      label="Task title"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-date
      class="q-mt-md"
      v-model="newTask.endDate"
      minimal
      mask="YYYY-MM-DD"
    />

    <q-editor v-model="newTask.description" min-height="5rem" />

    <q-btn label="Save" type="button" color="primary" @click="save" />
  </div>
</template>

<style lang="scss">
.task-edit {
  width: 500px;
  max-width: 100%;

  & > * {
    width: 100%;
  }
}
</style>
