import { defineAsyncComponent, ref, shallowRef } from "vue";
import { defineStore } from "pinia";

function getDefaultDrawerComponent() {
  return defineAsyncComponent(
    () => import("../components/DefaultDrawerComponent.vue")
  );
}

export const useLayoutStore = defineStore("layout", () => {
  const rightDrawerOpen = ref(false);
  function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value;
  }
  function openRightDrawer() {
    rightDrawerOpen.value = true;
  }
  function closeRightDrawer() {
    rightDrawerOpen.value = false;
  }

  const drawerComponent = shallowRef();
  function setDrawerComponent(component: string | null) {
    if (component) {
      drawerComponent.value = defineAsyncComponent(
        () => import(`../components/${component}.vue`)
      );
      return;
    }
    drawerComponent.value = getDefaultDrawerComponent();
  }

  return {
    drawerComponent,
    rightDrawerOpen,
    toggleRightDrawer,
    setDrawerComponent,
    openRightDrawer,
    closeRightDrawer,
  };
});
