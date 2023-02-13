import { ref } from "vue";
import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", () => {
  const rightDrawerOpen = ref(false);
  function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value;
  }

  return { rightDrawerOpen, toggleRightDrawer };
});
