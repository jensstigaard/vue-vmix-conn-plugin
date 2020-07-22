# vue-vmix-conn-plugin

vMix connection plugin for Vue.

## Usage
### Install dependency and add to dependencies list
Yarn
```
yarn add vue-vmix-conn-plugin -d
```
NPM
```
npm install vue-vmix-conn-plugin --save
```

### Instanciate with Vue instance
```javascript
// In main script
const Vue = require('vue')
const { vMixConnectionPlugin, vMixConnectionPluginStore } = require('vue-vmix-conn-plugin')

Vue.use(vMixConnectionPlugin, new vMixConnectionPluginStore())

const app = new Vue({
	// ...options
}).$mount('#app')
```
### Simple use
You can now access the vMix connection plugin and use it inside any Vue file.
```javascript
// In Vue file
export default {
	created() {
		this.$vMixConnection.setConnection('192.168.0.115', { debug: true })
		this.$vMixConnection.on('data', data => {
			console.log('Received data from vMix instance')
			console.log(data)
		})
	}
}
```
