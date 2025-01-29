import { createRouter, createWebHistory } from "vue-router";

import ToDo from "@/components/TodoList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "TodoList",
      component: ToDo,
    },
  ],
});
