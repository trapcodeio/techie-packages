// Import Bulma
import "bulma/css/bulma.min.css"
// Import bootstrap utilities
import "shred-bootstrap/css/utilities.css"
// Add some styling
import "./css/app.css"


import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
