'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = iframer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function iframer(ComponentOrConfig) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var defaultConfig = {
    dom: '',
    targetOrigin: '*'
  };

  if (typeof ComponentOrConfig === 'function') {
    return enhance(ComponentOrConfig, Object.assign(defaultConfig, config));
  }

  if ((typeof ComponentOrConfig === 'undefined' ? 'undefined' : _typeof(ComponentOrConfig)) !== 'object') return new Error('iframe的config参数必须是对象');

  return function (WrappedComponent) {
    return enhance(WrappedComponent, Object.assign(defaultConfig, ComponentOrConfig));
  };
}

function enhance(WrappedComponent) {
  var _class, _temp;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  return _temp = _class = function (_Component) {
    _inherits(IframeComponent, _Component);

    function IframeComponent(props) {
      _classCallCheck(this, IframeComponent);

      var _this = _possibleConstructorReturn(this, (IframeComponent.__proto__ || Object.getPrototypeOf(IframeComponent)).call(this, props));

      _this.syncHeight = function () {
        var lastHeight = 0;
        _this.interval = setInterval(function () {
          var height = _this.dom ? _this.dom.scrollHeight : 0;
          if (height === lastHeight) return;
          lastHeight = height;
          _this.emit({ action: 'syncHeight', data: height });
        }, 100);
      };

      _this.emit = function () {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) !== 'object') {
          throw new Error('emit参数必须为对象');
        }
        message.from = _this.iframeName;
        message.source = 'IFramer';
        _this.win.postMessage(message, _this.config.targetOrigin);
      };

      _this.msgHandler = function (e) {
        var _e$data = e.data,
            action = _e$data.action,
            data = _e$data.data;

        if (_this.iframe[action]) _this.iframe[action](data, e.data);
      };

      _this.ref = function (frame) {
        _this.iframe = frame;
      };

      _this.config = config;
      _this.win = window.parent;
      _this.iframeName = WrappedComponent.name;
      _this.interval = null;
      _this.dom = null;
      return _this;
    }

    _createClass(IframeComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.dom = this.config.dom ? document.querySelector(this.config.dom) : _reactDom2.default.findDOMNode(this.iframe);
        this.syncHeight();
        this.registerMsgListener();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.unregisterMsgListener();
      }
    }, {
      key: 'registerMsgListener',
      value: function registerMsgListener() {
        window.addEventListener('message', this.msgHandler, false);
      }
    }, {
      key: 'unregisterMsgListener',
      value: function unregisterMsgListener() {
        window.removeEventListener('message', this.msgHandler);
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(WrappedComponent, { ref: this.ref, emit: this.emit });
      }
    }]);

    return IframeComponent;
  }(_react.Component), _class.displayName = 'Iframe' + WrappedComponent.name, _temp;
}