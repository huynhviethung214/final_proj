import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "shelf",
    component: () => import("@/views/Shelf.vue")
  },
  {
    path: "/employees",
    name: "employees",
    component: () => import("@/views/Employees.vue")
  },
  {
    path: "/tickets",
    name: "tickets",
    component: () => import("@/views/Tickets.vue")
  },
  {
    path: "/readers",
    name: "readers",
    component: () => import("@/views/Readers.vue")
  },
  {
    path: "/publishers",
    name: "publishers",
    component: () => import("@/views/Publishers.vue")
  },
  {
    path: "/publisher/add",
    name: "publisher.add",
    component: () => import("@/views/AddPublisher.vue")
  },
  {
    path: "/publisher/edit/:id",
    name: "publisher.edit",
    component: () => import("@/views/EditPublisher.vue"),
    props: true
  },
  {
    path: "/employee/add",
    name: "employee.add",
    component: () => import("@/views/AddEmployee.vue")
  },
  {
    path: "/employee/edit/:id",
    name: "employee.edit",
    component: () => import("@/views/EditEmployee.vue"),
    props: true
  },
  {
    path: "/reader/add/:accountId",
    name: "reader.add",
    component: () => import("@/views/AddReader.vue"),
    props: true
  },
  {
    path: "/reader/edit/:id",
    name: "reader.edit",
    component: () => import("@/views/EditReader.vue"),
    props: true
  },
  {
    path: "/book/add",
    name: "book.add",
    component: () => import("@/views/AddBook.vue")
  },
  {
    path: "/book/edit/:id",
    name: "book.edit",
    component: () => import("@/views/EditBook.vue"),
    props: true
  },
  {
    path: "/sign-up",
    name: "signup",
    component: () => import("@/views/SignUp.vue")
  },
  {
    path: "/sign-in",
    name: "signin",
    component: () => import("@/views/SignIn.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
