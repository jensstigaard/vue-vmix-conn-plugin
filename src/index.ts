
import Vue from 'vue'

import { ConnectionTCP } from 'node-vmix'

// vMix connection plugin for Vue
// Implemented with inspiration from
//  - https://vuejs.org/v2/guide/plugins.html
//  - https://codepen.io/stigaard/pen/yLNNQbg
export class vMixConnectionPluginStore {
  // protected supportMultipleConnections: boolean = false

  protected storeVM: Vue = new Vue({
    data: {
      connection: undefined,
    },
  })

  constructor(_supportMultipleConnections: boolean = false) {
    // this.supportMultipleConnections = _supportMultipleConnections
  }

  /**
   * Get first connection
   */
  get connection(): ConnectionTCP | undefined {
    return this.storeVM!.$data.connection
  }

  /**
   * Get is connected
   */
  get connected(): boolean {
    if (!this.connection) {
      return false
    }

    return this.connection.connected()
  }

  setConnection(host: string, options: { [key: string]: any } = {}) {
    if (!this.connection) {
      // Set new connection
      this.storeVM.$data.connection = new ConnectionTCP(host, options)
    }

    // console.log('Set new connection', this.storeVM!.$data.connection)
    // Shutdown/Destroy old connection?
    if (this.connection && this.connection.connected()) {
      // console.log('Shutting down old connection', this.connection)
      this.shutdown()
    }

    this.changeConnection(host, options.port || 8099)
  }

  /**
   * Change connection
   * 
   * @param host
   * @param port
   */
  changeConnection(host: string, port: number) {
    if (!this.connection) {
      throw new Error('vMix Connection not set...')
    }

    this.connection.connect(host, port)
  }

  shutdown() {
    // If no connection then do nothing
    if (!this.connection || !this.connection.connected()) {
      return
    }

    // Shutdown/Destroy old connection
    // console.log('Shutdown old connection!', this.storeVM!.$data.connection)
    this.connection.shutdown()
  }

  /**
   * Send commands to vMix instance
   * @param commands
   */
  send(commands: any) {
    if (!this.connection) {
      throw new Error('No vMix connection instanciated')
    }

    if (!this.connected) {
      throw new Error('vMix connection not connected')
    }

    this.connection.send(commands)
  }

  /** 
   * Register on(...) listener to connection
   */
  on(type: string, cb: Function) {
    if (!this.connection) {
      throw new Error('No vMix connection instanciated')
    }

    this.connection.on(type, cb)
  }
}

export const vMixConnectionPlugin = {
  install(Vue: any, store: vMixConnectionPluginStore) {
    Vue.mixin({
      beforeCreate() {
        this.$vMixConnection = store
      },
    })

    // // Global method - set vMix connection
    // Vue.prototype.setVmixConnection = function (
    //   host: string,
    //   options: { [key: string]: any } = {}
    // ) {
    //   this.$vMixConnection.setConnection(host, options)
    // }

    // Vue.prototype.shutdownVmixConnection = function () {
    //   this.$vMixConnection.shutdown()
    // }

    // Vue.prototype.execVmixCommands = function (commands: any) {
    //   this.$vMixConnection.send(commands)
    // }
  },
}

export default {
  vMixConnectionPlugin,
  vMixConnectionPluginStore
}
