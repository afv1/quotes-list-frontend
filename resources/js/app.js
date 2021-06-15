require('./bootstrap');

import Vue from 'vue'
import vuetify from '../plugins/vuetify'
// import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

// import App from './components/App'

// Vue.use(Vuetify);

Vue.component('app', require('./components/App.vue').default);

// Vue.use(Vuetify);

new Vue({
  vuetify,
}).$mount('#app')

// new Vue({
//   el: '#app',
//   components: { App },
//   template: '<App/>'
// })

// const app = new Vue({
// 	vuetify: Vuetify,
// 	el: '#app',
// });
