# vue-vmix-conn-plugin

vMix connection plugin for Vue.

## Usage
### Install dependency and add to dependencies list
```
yarn add vue-vmix-conn-plugin -d
```

### Instanciate with Vue instance
```javascript
// In main script
const Vue = require('vue')
const { vMixConnectionPlugin, vMixConnectionPluginStore } = require('vue-vmix-conn-plugin')

Vue.use(vMixConnectionPlugin, new vMixConnectionPluginStore())

const app = new Vue({
})
```

You can access the vMix plugin and use it inside Vue instance
```javacript
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
