<script lang="ts">
import type Task from "@/models/Task";
import { useLayoutStore } from "@/stores/layout";
import { useTaskStore } from "@/stores/task";
import { computed, ref } from "vue";
import { useQuasar } from "quasar";

const columns = [
  {
    name: "check",
  },
  {
    name: "title",
    required: true,
    label: "Title",
    align: "left",
    field: "title",
  },
  {
    name: "tags",
    align: "center",
    label: "Tags",
    field: "tags",
    format: (val: string[]) => val.join(","),
  },
  { name: "endDate", label: "End Date", field: "endDate", sortable: true },
  { name: "state", label: "State", field: "state", sortable: true },
  { name: "description", label: "Description", field: "description" },
  {
    name: "actions",
    label: "Actions",
  },
];

export default {
  name: "TasksTable",
  props: {
    tasks: {
      type: Array<Task>,
      required: true,
    },
  },
  emits: ["edit-task"],
  setup(props) {
    const taskStore = useTaskStore();
    const layoutStore = useLayoutStore();

    const $q = useQuasar();

    const tagFilter = ref("");
    const tags = computed(() => {
      return props.tasks.reduce((acc, task) => {
        task.tags.forEach((tag) => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
        return acc;
      }, [] as string[]);
    });
    const filteredTasks = computed(() => {
      return props.tasks.filter((task) => {
        return tagFilter.value ? task.tags.includes(tagFilter.value) : true;
      });
    });

    const searchTerm = ref("");
    const searchTasks = (rows: Task[], terms: string) => {
      return rows.filter((row) =>
        row.title.toLowerCase().includes(terms.toLowerCase())
      );
    };

    const editTask = (id: string) => {
      taskStore.setTaskToEdit(id);
      layoutStore.setDrawerComponent("QuickTaskEdit");
      layoutStore.openRightDrawer();
    };

    const taskStates = computed(() => {
      let states = {} as Record<string, boolean>;
      props.tasks.forEach((task) => {
        states[task.id] = task.state === "completed";
      });
      return states;
    });

    const changeState = async (id: string) => {
      const task = props.tasks.find((task) => task.id === id);
      const state = taskStates.value[id] ? "completed" : "todo";
      if (task) {
        task.state = state;
        await taskStore.updateTask(task);
        $q.notify({
          type: "positive",
          message: `Marked as ${state}!`,
        });
      }
    };

    return {
      columns,
      filteredTasks,
      searchTerm,
      searchTasks,
      tagFilter,
      tags,
      editTask,
      taskStates,
      changeState,
    };
  },
};
</script>

<template>
  <q-table
    :grid="$q.screen.xs"
    title="Tasks"
    :rows="filteredTasks"
    :columns="columns"
    row-key="name"
    :filter="searchTerm"
    :filter-method="searchTasks"
  >
    <template v-slot:body-cell-title="props">
      <q-td :props="props">
        <a :href="`/task/${props.row.id}`">
          <s v-if="taskStates[props.row.id]">{{ props.row.title }}</s>
          <template v-else>
            {{ props.row.title }}
          </template>
        </a>
      </q-td>
    </template>

    <template v-slot:body-cell-check="props">
      <q-td :props="props">
        <q-checkbox
          v-model="taskStates[props.row.id]"
          @click="changeState(props.row.id)"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <template v-for="(tag, index) in props.row.tags" :key="index">
          <q-badge class="q-mr-sm" color="secondary" :label="tag" />
        </template>
      </q-td>
    </template>

    <template v-slot:body-cell-endDate="props">
      <q-td :props="props">
        <s v-if="taskStates[props.row.id]">{{ props.row.endDate }}</s>
        <template v-else>
          {{ props.row.endDate }}
        </template>
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          color="primary"
          label="edit"
          @click="editTask(props.row.id)"
        />
      </q-td>
    </template>

    <template v-slot:item="props">
      <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
      >
        <q-card :class="taskStates[props.row.id] ? 'bg-grey-2' : ''">
          <q-card-section>
            <q-checkbox
              dense
              v-model="taskStates[props.row.id]"
              @click="changeState(props.row.id)"
              :label="`${taskStates[props.row.id] ? 'Completed' : 'Todo'}`"
            />
          </q-card-section>
          <q-list dense>
            <q-item
              v-for="col in props.cols.filter((col) => col.name !== 'desc')"
              :key="col.name"
            >
              <q-item-section>
                <q-item-label>{{ col.label }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label v-if="col.name === 'title'" caption>
                  <a :href="`/task/${props.row.id}`">
                    <s v-if="taskStates[props.row.id]">{{ props.row.title }}</s>
                    <template v-else>
                      {{ props.row.title }}
                    </template>
                  </a>
                </q-item-label>
                <q-item-label v-else-if="col.name === 'endDate'" caption>
                  <s v-if="taskStates[props.row.id]">{{ props.row.endDate }}</s>
                  <template v-else>
                    {{ props.row.endDate }}
                  </template>
                </q-item-label>
                <q-item-label
                  v-else-if="col.name === 'description'"
                  caption
                  style="max-width: 70%"
                >
                  {{ props.row.description }}
                </q-item-label>
                <q-item-label v-else-if="col.name === 'actions'" caption>
                  <q-btn
                    class="q-mb-sm"
                    round
                    color="primary"
                    size="sm"
                    icon="edit"
                    @click="editTask(props.row.id)"
                  />
                </q-item-label>
                <q-item-label v-else caption>{{ col.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>

    <template v-slot:top-right>
      <q-select
        class="q-mr-xl"
        v-model="tagFilter"
        label="Filter by tag"
        outline
        dense
        options-dense
        emit-value
        map-options
        :options="tags"
        option-value="name"
        clearable
        style="min-width: 150px"
      />
      <q-input
        outline
        dense
        debounce="300"
        v-model="searchTerm"
        placeholder="Search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>
