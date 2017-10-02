/**
 * Created by galen on 2017/10/2.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

/**
 * HOC执行转换
 * @param ComponentOrConfig
 * @param config
 * @returns {*}
 */
export default function iframer(ComponentOrConfig, config = {}) {
  
  const defaultConfig = {
    dom: '',
    targetOrigin: '*'
  };
  
  if (typeof ComponentOrConfig === 'function') {
    return enhance(ComponentOrConfig, Object.assign(defaultConfig, config));
  }
  
  if (typeof ComponentOrConfig !== 'object') return new Error('iframe的config参数必须是对象');
  
  return (WrappedComponent) => enhance(WrappedComponent, Object.assign(defaultConfig, ComponentOrConfig));
}

/**
 * HOC实现
 * @param WrappedComponent
 * @param config
 * @returns {IframeComponent}
 */
function enhance(WrappedComponent, config = {}) {
  
  return class IframeComponent extends Component {
    
    static displayName = `Iframe${WrappedComponent.name}`;
    
    constructor(props) {
      super(props);
      this.config = config;
      this.win = window.parent;
      this.iframeName = WrappedComponent.name;
      this.interval = null;
      this.dom = null;
    }
    
    componentDidMount() {
      this.dom = this.config.dom ? document.querySelector(this.config.dom) : ReactDOM.findDOMNode(this.iframe);
      this.syncHeight();
      this.registerMsgListener();
    }
    
    componentWillUnmount() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.unregisterMsgListener();
    }
    
    /**
     * 向父窗口同步高度
     */
    syncHeight = () => {
      let lastHeight = 0;
      this.interval = setInterval(() => {
        let height = this.dom ? this.dom.scrollHeight : 0;
        if (height === lastHeight) return;
        lastHeight = height;
        this.emit({action: 'syncHeight', data: height});
      }, 100);
    };
    
    /**
     * 向父窗口发送事件
     * @param message
     */
    emit = (message = {}) => {
      if (typeof message !== 'object') {
        throw new Error('emit参数必须为对象');
      }
      message.from = this.iframeName;
      message.source = 'IFramer';
      this.win.postMessage(message, this.config.targetOrigin);
    };
    
    /**
     * 注册消息监听函数
     */
    registerMsgListener() {
      window.addEventListener('message', this.msgHandler, false);
    }
    
    /**
     * 注销消息监听函数
     */
    unregisterMsgListener() {
      window.removeEventListener('message', this.msgHandler);
    }
    
    /**
     * 消息处理函数，用于消息透传到被封装组件内部并执行方法
     * @param e
     */
    msgHandler = (e) => {
      let {action, data} = e.data;
      if (this.iframe[action]) this.iframe[action](data, e.data);
    };
    
    /**
     * 获取被封装组件的引用
     * @param frame
     */
    ref = frame => {
      this.iframe = frame;
    };
    
    render() {
      return (
        <WrappedComponent ref={this.ref} emit={this.emit} />
      );
    }
  };
}