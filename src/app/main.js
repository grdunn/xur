import { createApp } from "vue";
import "./styles/style.scss";
import "tippy.js/dist/tippy.css";
import App from "./App.vue";
import VueTippy from "vue-tippy";

const app = createApp(App);

app.use(VueTippy, {
  defaultProps: {
    placement: "top",
    followCursor: true,
  },
});

app.mount("#app");
