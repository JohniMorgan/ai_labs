import { useStateStore } from "~/store/stateStore";

export default defineNuxtRouteMiddleware(to => {
    const nuxtApp = useNuxtApp()
  if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return
    const store = useStateStore();
    store.refresh();
})