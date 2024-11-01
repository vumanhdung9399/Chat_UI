import router from "@src/router";
import "@src/style.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import vClickOutside from "click-outside-vue3";
import "vue3-toastify/dist/index.css";
// import { io } from "socket.io-client";

import App from "@src/App.vue";
const app = createApp(App);

// const socket = io("http://localhost:3000");

// socket.on("connect", () => {
//   console.log("Connected to server with id: ", socket.id);
// });

// app.provide("socket", socket);

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vClickOutside);
app.mount("#app");
