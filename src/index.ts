
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

  get connected(): boolean {
    if (!this.connection) {
      return false
    }

    return this.connection.connected()
  }

  setConnection(host: string, options: { [key: string]: any } = {}) {
    // Shutdown/Destroy old connection?
    if (this.connection) {
      console.log('Shutting down old connection', this.connection)
      this.connection.shutdown()
    }

    // Set new connection
    // @ts-ignore
    this.storeVM!.$data.connection = new ConnectionTCP(host, options)
    console.log('Set new connection', this.storeVM!.$data.connection)
  }

  shutdown() {
    // If no connection then do nothing
    if (!this.connection) {
      return
    }

    // Shutdown/Destroy old connection
    // console.log('Shutdown old connection!', this.storeVM!.$data.connection)
    this.connection.shutdown()
  }

  send(commands: any) {
    if (!this.connection) {
      throw new Error('No vMix connection instanciated')
    }
    this.connection.send(commands)
  }

  on(...args: any) {
    if (!this.connection) {
      throw new Error('No vMix connection instanciated')
    }

    this.connection.on(...args)
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
