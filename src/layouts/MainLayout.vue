<script setup lang="ts">
import { computed } from "vue";
import { useLayoutStore } from "@/stores/layout";
import { useQuasar } from "quasar";
import NewTaskForm from "@/components/NewTaskForm.vue";

const $q = useQuasar();

const layoutStore = useLayoutStore();

const rightDrawerOpen = computed(() => layoutStore.rightDrawerOpen);
const closeRightDrawer = layoutStore.closeRightDrawer;
const toggleRightDrawer = layoutStore.toggleRightDrawer;
const rightDrawerComponent = computed(() => layoutStore.drawerComponent);

const leftDrawerOpen = computed(() => layoutStore.leftDrawerOpen);
const closeLeftDrawer = layoutStore.closeLeftDrawer;
const toggleLeftDrawer = layoutStore.toggleLeftDrawer;

const openNewTaskForm = () => {
  $q.dialog({
    component: NewTaskForm,
  });
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          v-if="$q.screen.xs"
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Task App </q-toolbar-title>

        <q-btn
          class="q-mr-lg"
          color="secondary"
          icon="add"
          :label="`${!$q.screen.xs ? 'Add new' : ''}`"
          @click="openNewTaskForm"
        />

        <q-btn dense flat round icon="whatshot" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs v-if="!$q.screen.xs" align="left">
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/tasks" label="Tasks" />
      </q-tabs>
    </q-header>

    <q-drawer
      :model-value="leftDrawerOpen"
      side="left"
      @hide="closeLeftDrawer"
      bordered
    >
      <nav v-if="$q.screen.xs">
        <q-list dense bordered padding class="row">
          <q-item class="col-12">
            <q-item-section>
              <a href="/">Home</a>
            </q-item-section>
          </q-item>

          <q-item class="col-12">
            <q-item-section>
              <a href="/tasks">Tasks</a>
            </q-item-section>
          </q-item>
        </q-list>
      </nav>
    </q-drawer>

    <q-drawer
      :model-value="rightDrawerOpen"
      update:model-value="toggleRightDrawer"
      side="right"
      bordered
      @hide="closeRightDrawer"
    >
      <component :is="rightDrawerComponent" />
    </q-drawer>

    <q-page-container>
      <slot />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>All rights reserved.</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
