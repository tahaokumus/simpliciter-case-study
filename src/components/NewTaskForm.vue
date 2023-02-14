<script lang="ts">
import type Task from "@/models/Task";
import { useDialogPluginComponent } from "quasar";
import { ref } from "vue";
import { useTaskStore } from "@/stores/task";
import { useQuasar } from "quasar";

export default {
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const newTask = ref({
      state: "todo",
      description: "",
    } as Task);

    const titleInput = ref(null) as any;
    const tagInput = ref(null) as any;

    const taskStore = useTaskStore();

    const $q = useQuasar();

    const save = async () => {
      if (titleInput.value?.validate() && tagInput.value?.validate()) {
        if (
          !newTask.value.endDate ||
          !/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(
            newTask.value.endDate
          )
        ) {
          dateError.value = true;
          return;
        }

        dateError.value = true;

        await taskStore.createTask(newTask.value);
        $q.notify({
          type: "positive",
          message: "Created successfully!",
        });
        onDialogOK();
      }
    };

    const checkNewTag = (
      tag: string,
      doneFn: (
        item?: any,
        mode?: "add-unique" | "add" | "toggle" | undefined
      ) => void
    ) => {
      if (tagInput.value?.validate(tag)) {
        doneFn(tag, "add-unique");
      } else {
        doneFn();
      }
    };

    const checkTitle = (val: string | number | null) => {
      titleInput.value?.validate(val);
    };

    const dateError = ref(false);

    return {
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel,
      newTask,
      save,
      checkNewTag,
      checkTitle,
      titleInput,
      tagInput,
      dateError,
    };
  },
};
</script>

<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <div class="new-task-card q-pa-lg">
        <q-input
          ref="titleInput"
          class="q-mt-md"
          filled
          v-model="newTask.title"
          label="Task title"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please type something',
            (val) => (val && val.length <= 30) || 'Max 30 characters',
            (val) => !/\d/.test(val) || 'No numbers allowed',
          ]"
          @update:model-value="checkTitle"
        />

        <q-select
          ref="tagInput"
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
          :rules="[(val) => !/\d/.test(val) || 'No numbers allowed']"
          @new-value="checkNewTag"
        />

        <q-date
          class="q-mt-md"
          v-model="newTask.endDate"
          minimal
          mask="YYYY-MM-DD"
          rules="date"
        />
        <span v-if="dateError" class="date-error">End date is required</span>
      </div>
      <q-card-actions align="right">
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
        <q-btn color="primary" label="Create" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.new-task-card {
  width: 500px;
  max-width: 100%;

  & > * {
    width: 100%;
  }
}

.date-error {
  display: block;
  font-size: 12px;
  color: var(--q-negative);
  padding: 8px 12px 0;
}
</style>
