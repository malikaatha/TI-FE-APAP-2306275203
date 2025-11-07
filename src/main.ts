import { createApp } from 'vue'
import { createPinia } from 'pinia'

// BENAR: Menggunakan destructuring { } untuk mengambil 'createBootstrap'
import { createBootstrap } from 'bootstrap-vue-next'

// Import file CSS Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// BENAR: Memanggil fungsi createBootstrap() untuk membuat plugin
app.use(createBootstrap())

app.mount('#app')
