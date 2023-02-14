import { defineAsyncComponent, ref, shallowRef } from "vue";
import { defineStore } from "pinia";

function getDrawerComponent(component: string) {
  return defineAsyncComponent(() => import(`../components/${component}.vue`));
}

export const useLayoutStore = defineStore("layout", () => {
  const rightDrawerOpen = ref(false);
  const leftDrawerOpen = ref(false);

  function toggleRightDrawer() {
    if (rightDrawerOpen.value) {
      closeRightDrawer();
    } else {
      openRightDrawer();
    }
  }
  function openRightDrawer() {
    drawerComponent.value = getDrawerComponent(drawerComponentName);
    rightDrawerOpen.value = true;
  }
  function closeRightDrawer() {
    drawerComponent.value = ref();
    rightDrawerOpen.value = false;
    drawerComponentName = "DefaultDrawerComponent";
  }

  function toggleLeftDrawer() {
    if (leftDrawerOpen.value) {
      closeLeftDrawer();
    } else {
      openLeftDrawer();
    }
  }
  function openLeftDrawer() {
    leftDrawerOpen.value = true;
  }
  function closeLeftDrawer() {
    leftDrawerOpen.value = false;
  }

  let drawerComponentName = "DefaultDrawerComponent";
  const drawerComponent = shallowRef();
  function setDrawerComponent(component: string = "DefaultDrawerComponent") {
    drawerComponentName = component;
  }

  return {
    drawerComponent,
    rightDrawerOpen,
    toggleRightDrawer,
    setDrawerComponent,
    openRightDrawer,
    closeRightDrawer,
    leftDrawerOpen,
    toggleLeftDrawer,
    openLeftDrawer,
    closeLeftDrawer,
  };
});
