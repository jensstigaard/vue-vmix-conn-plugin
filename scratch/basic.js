const Vue = require('vue')

const { vMixConnectionPlugin, vMixConnectionPluginStore } = require('../dist/index')

Vue.use(vMixConnectionPlugin, new vMixConnectionPluginStore())

const app = new Vue({
	// Test that when create you can access the vMix plugin and use it
	created() {
		this.$vMixConnection.setConnection('localhost', { debug: false })
		this.$vMixConnection.on('connecting', () => {
			console.log('Connecting to vMix instance')
		})
		this.$vMixConnection.on('connect', () => {
			console.log('Connected to vMix instance')
		})
		this.$vMixConnection.on('data', data => {
			console.log('Received data from vMix instance')
			console.log(data)
		})

		// console.log('Connection', this.$vMixConnection.connection)
		// console.log('Connected', this.$vMixConnection.connected)
	}
})

