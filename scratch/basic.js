const Vue = require('vue')

const { vMixConnectionPlugin, vMixConnectionPluginStore } = require('../dist/index')


Vue.use(vMixConnectionPlugin, new vMixConnectionPluginStore())

const app = new Vue({
	// Test that when create you can access the vMix plugin and use it
	created() {
		this.$vMixConnection.setConnection('192.168.0.115', { debug: true })
		this.$vMixConnection.on('data', data => {
			console.log('Received data from vMix instance')
			console.log(data)
		})
	}
})

