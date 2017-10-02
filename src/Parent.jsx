/**
 * Created by galen on 2017/10/2.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Iframe包装组件，用来代替原生的iframe
 */
export default class Iframer extends Component {
  
  static displayName = 'IFramer';
  
  static propTypes = {
    src: PropTypes.string.isRequired,
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    iframeName: PropTypes.string,
    actions: PropTypes.object
  };
  
  static defaultProps = {
    width: '100%',
    height: 800,
    iframeName: '',
    actions: {}
  };
  
  constructor(props) {
    super(props);
    
    this.iframeName = props.iframeName;
    this.initActions();
    
    this.state = {
      width: props.width,
      height: props.height
    };
  }
  
  componentDidMount() {
    this.registerMsgListener();
  }
  
  componentWillUnmount() {
    this.unregisterMsgListener();
  }
  
  /**
   * 初始化actions
   */
  initActions() {
    this.actions = Object.assign({
      syncHeight: this.syncHeight
    }, this.props.actions);
  }
  
  /**
   * 向iframe发送事件
   * @param message
   */
  emit = (message) => {
    if (typeof message !== 'object') {
      throw new Error('emit参数必须为对象');
    }
    
    if (!this.iframe) return;
    message.to = this.iframeName;
    message.source = 'IFramer';
    this.iframe.postMessage(message, '*');
  };
  
  /**
   * 注册消息监听
   */
  registerMsgListener() {
    window.addEventListener('message', this.msgHandler, false);
  }
  
  /**
   * 注销消息监听
   */
  unregisterMsgListener() {
    window.removeEventListener('message', this.msgHandler);
  }
  
  /**
   * 消息处理函数
   * @param e
   */
  msgHandler = (e) => {
    let {action, data} = e.data;
    if (this.actions[action]) this.actions[action](data, e.data);
  };
  
  /**
   * 同步iframe高度
   * @param height
   */
  syncHeight = (height) => {
    this.setState({height});
  };
  
  /**
   * 获取iframe窗口引用
   * @param frame
   */
  ref = (frame) => {
    this.iframe = frame.contentWindow;
  };
  
  render() {
    
    let {src, style} = this.props;
    let {width, height} = this.state;
    
    return (
      <iframe src={src} frameBorder={0} width={width} height={height} style={style} ref={this.ref} />
    );
  }
  
}