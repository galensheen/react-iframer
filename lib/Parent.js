'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Iframer = (_temp = _class = function (_Component) {
  _inherits(Iframer, _Component);

  function Iframer(props) {
    _classCallCheck(this, Iframer);

    var _this = _possibleConstructorReturn(this, (Iframer.__proto__ || Object.getPrototypeOf(Iframer)).call(this, props));

    _this.emit = function (message) {
      if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) !== 'object') {
        throw new Error('emit参数必须为对象');
      }

      if (!_this.iframe) return;
      message.to = _this.iframeName;
      message.source = 'IFramer';
      _this.iframe.postMessage(message, '*');
    };

    _this.msgHandler = function (e) {
      var _e$data = e.data,
          action = _e$data.action,
          data = _e$data.data;

      if (_this.actions[action]) _this.actions[action](data, e.data);
    };

    _this.syncHeight = function (height) {
      _this.setState({ height: height });
    };

    _this.ref = function (frame) {
      _this.iframe = frame.contentWindow;
    };

    _this.iframeName = props.iframeName;
    _this.initActions();

    _this.state = {
      width: props.width,
      height: props.height
    };
    return _this;
  }

  _createClass(Iframer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.registerMsgListener();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unregisterMsgListener();
    }
  }, {
    key: 'initActions',
    value: function initActions() {
      this.actions = Object.assign({
        syncHeight: this.syncHeight
      }, this.props.actions);
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
      var _props = this.props,
          src = _props.src,
          style = _props.style;
      var _state = this.state,
          width = _state.width,
          height = _state.height;


      return _react2.default.createElement('iframe', { src: src, frameBorder: 0, width: width, height: height, style: style, ref: this.ref });
    }
  }]);

  return Iframer;
}(_react.Component), _class.displayName = 'IFramer', _class.propTypes = {
  src: _propTypes2.default.string.isRequired,
  style: _propTypes2.default.object,
  width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  iframeName: _propTypes2.default.string,
  actions: _propTypes2.default.object
}, _class.defaultProps = {
  width: '100%',
  height: 800,
  iframeName: '',
  actions: {}
}, _temp);
exports.default = Iframer;