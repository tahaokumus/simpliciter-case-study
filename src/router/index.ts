import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/tasks",
      name: "tasks",
      component: () => import("@/views/TasksView.vue"),
    },
    {
      path: "/task/:id",
      name: "task",
      component: () => import("@/views/TaskView.vue"),
    },
  ],
});

export default router;
