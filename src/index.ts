
import Vue from 'vue'

import { ConnectionTCP } from 'node-vmix'

// vMix connection plugin for Vue
// Implemented with inspiration from
//  - https://vuejs.org/v2/guide/plugins.html
//  - https://codepen.io/stigaard/pen/yLNNQbg
export class vMixConnectionPluginStore {
  storeVM: Vue = new Vue({
    data: {
      connection: null,
      connected: false,
    },
  })

  get connection() {
    return this.storeVM!.$data.connection
  }

  get connected() {
    if (!this.storeVM!.$data.connection) {
      return false
    }
    return this.storeVM!.$data.connection.connected()
  }

  setConnection(host: string, options: { [key: string]: any } = {}) {
    // Shutdown/Destroy old connection?
    if (this.storeVM!.$data.connection) {
      // console.log('Shutdown old connection!', this.storeVM!.$data.connection)
      this.storeVM!.$data.connection.shutdown()
    }

    // @ts-ignore
    this.storeVM!.$data.connection = new ConnectionTCP(host, options)
  }

  shutdown() {
    // Shutdown/Destroy old connection?
    if (this.storeVM!.$data.connection) {
      // console.log('Shutdown old connection!', this.storeVM!.$data.connection)
      this.storeVM!.$data.connection.shutdown()
    }
  }

  send(commands: any) {
    this.storeVM!.$data.connection.send(commands)
  }

  on(...args: any) {
    this.storeVM!.$data.connection.on(...args)
  }
}

export const vMixConnectionPlugin = {
  install(Vue: any, store: vMixConnectionPluginStore) {
    Vue.mixin({
      beforeCreate() {
        this.$vMixConnection = store
      },
    })

    // Global method - set vMix connection
    Vue.prototype.setVmixConnection = function (
      host: string,
      options: { [key: string]: any } = {},
      keepListeners: boolean = false
    ) {
      if (keepListeners) {
        console.log('Take care of listeners...')
      }

      this.$vMixConnection.setConnection(host, options)
    }

    Vue.prototype.shutdownVmixConnection = function () {
      this.$vMixConnection.shutdown()
    }

    Vue.prototype.execVmixCommands = function (commands: any) {
      this.$vMixConnection.send(commands)
    }
  },
}

export default {
  vMixConnectionPlugin,
  vMixConnectionPluginStore
}
