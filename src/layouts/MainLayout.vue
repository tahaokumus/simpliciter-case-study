<script lang="ts">
import { useLayoutStore } from "@/stores/layout";
import { computed } from "vue";

export default {
  setup() {
    const layoutStore = useLayoutStore();

    return {
      rightDrawerOpen: computed(() => layoutStore.rightDrawerOpen),
      toggleRightDrawer: layoutStore.toggleRightDrawer,
      drawerComponent: computed(() => layoutStore.drawerComponent),
    };
  },
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <nav></nav>
        <q-route-tab to="/" label="Home" />
        <q-route-tab to="/tasks" label="Tasks" />
      </q-tabs>
    </q-header>

    <q-drawer
      :model-value="rightDrawerOpen"
      update:model-value="toggleRightDrawer"
      side="right"
      bordered
    >
      <component :is="drawerComponent" />
    </q-drawer>

    <q-page-container>
      <slot />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Lorem ipsum dolor sit amet.</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
