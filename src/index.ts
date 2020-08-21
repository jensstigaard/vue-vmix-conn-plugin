
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

  connection() {
    return this.storeVM!.$data.connection
  }

  connected(): boolean {
    const connection = this.connection()
    if (!connection) {
      return false
    }
    return connection.connected()
  }

  setConnection(host: string, options: { [key: string]: any } = {}) {
    // Shutdown/Destroy old connection?
    if (this.connection()) {
      // console.log('Shutdown old connection!', this.storeVM!.$data.connection)
      this.connection().shutdown()
    }

    // Set new connection
    // @ts-ignore
    this.storeVM!.$data.connection = new ConnectionTCP(host, options)
  }

  shutdown() {
    const connection = this.connection()
    // If no connection then do nothing
    if (!connection) {
      return
    }

    // Shutdown/Destroy old connection
    // console.log('Shutdown old connection!', this.storeVM!.$data.connection)
    connection.shutdown()
  }

  send(commands: any) {
    const connection = this.connection()
    if (!connection) {
      throw new Error('No vMix connection instanciated')
    }
    connection.send(commands)
  }

  on(...args: any) {
    const connection = this.connection()
    if (!connection) {
      throw new Error('No vMix connection instanciated')
    }
    connection.on(...args)
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
