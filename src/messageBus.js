import { v4 as uuidv4 } from 'uuid';

window.messageBus = null;

class MessageBus {
  /**
   *
   * @param {DOM Object} eventSync If null asume bus created in iframed window and messages to be sent to parnt
   * otherwise send message events to the syncElement passed in, like an iframe.
   */
  constructor(eventSync = null) {
    this.syncMessageHandlers = {};
    const _this = this;

    window.addEventListener('message', event => {
      if (
        event.data &&
        event.data.channel &&
        typeof _this.syncMessageHandlers[event.data.channel] === 'function'
      ) {
        try {
          _this.syncMessageHandlers[event.data.channel](event.data.payload);
          console.log('[CBOARD] Handled message:', event.data.channel);
        } catch (e) {
          console.error('[CBOARD] Failed to handle event', event, e);
        }
      } else {
        console.warn('[CBOARD] Event was NOT handeled:', event);
      }
    });
    this._eventSync = eventSync || window.parent;
  }

  static instance() {
    if (window.messageBus === null) {
      window.messageBus = new MessageBus();
      window.cboardSessionId = uuidv4();
    }
    return window.messageBus;
  }

  set eventSync(val) {
    this._eventSync = val;
  }
  /**
   *
   * @param {string} channel - message channel name to pass messages to
   * @param {any} payload - any data that can be passed to the destination handler
   */
  emit(channel, payload) {
    console.log('[CBOARD] Emit message:', channel, payload);
    this._eventSync.postMessage({ channel, payload }, '*');
  }

  /**
   *
   * @param {string} channel - message channel name to receive messages from
   * @param {*} callback - message data handler
   */
  on(channel, callback) {
    if (typeof callback === 'function') {
      this.syncMessageHandlers[channel] = callback;
    }
  }

  /**
   *
   * @param {string} channel - message channel that should nolonger be supported
   */
  off(channel) {
    if (!!this.syncMessageHandlers[channel]) {
      delete this.syncMessageHandlers[channel];
    }
  }
}

export default MessageBus;
