/*!
 * mdui v0.4.3 (https://mdui.org)
 * Copyright 2016-2019 zdhxiong
 * Licensed under MIT
 */
/* jshint ignore:start */
;(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.mdui = factory());
}(this, (function() {
  'use strict';

  /* jshint ignore:end */
  var mdui = {};

  /**
   * =============================================================================
   * ************   浏览器兼容性问题修复   ************
   * =============================================================================
   */

  /**
   * requestAnimationFrame
   * cancelAnimationFrame
   */
  (function () {
    var lastTime = 0;

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = window.webkitRequestAnimationFrame;
      window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));

        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);

        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  })();


  /**
   * JQ 1.0.0 (https://github.com/zdhxiong/mdui.JQ#readme)
   * Copyright 2018-2018 zdhxiong
   * Licensed under MIT
   */
  var $ = (function () {
    'use strict';

    var JQ = function JQ(arr) {
      var self = this;

      for (var i = 0; i < arr.length; i += 1) {
        self[i] = arr[i];
      }

      self.length = arr.length;

      return this;
    };

    function $(selector) {
      var arr = [];

      if (!selector) {
        return new JQ(arr);
      }

      if (selector instanceof JQ) {
        return selector;
      }

      if (typeof selector === 'string') {
        var html = selector.trim();

        if (html[0] === '<' && html[html.length - 1] === '>') {
          // 创建 HTML 字符串
          var toCreate = 'div';

          if (html.indexOf('<li') === 0) {
            toCreate = 'ul';
          }

          if (html.indexOf('<tr') === 0) {
            toCreate = 'tbody';
          }

          if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) {
            toCreate = 'tr';
          }

          if (html.indexOf('<tbody') === 0) {
            toCreate = 'table';
          }

          if (html.indexOf('<option') === 0) {
            toCreate = 'select';
          }

          var tempParent = document.createElement(toCreate);
          tempParent.innerHTML = html;

          for (var i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          // 选择器
          var elems = selector[0] === '#' && !selector.match(/[ .<>:~]/)
            ? [document.getElementById(selector.slice(1))]
            : document.querySelectorAll(selector);

          for (var i$1 = 0; i$1 < elems.length; i$1 += 1) {
            if (elems[i$1]) {
              arr.push(elems[i$1]);
            }
          }
        }
      } else if (typeof selector === 'function') {
        // function
        return $(document).ready(selector);
      } else if (selector.nodeType || selector === window || selector === document) {
        // Node
        arr.push(selector);
      } else if (selector.length > 0 && selector[0].nodeType) {
        // NodeList
        for (var i$2 = 0; i$2 < selector.length; i$2 += 1) {
          arr.push(selector[i$2]);
        }
      }

      return new JQ(arr);
    }

    $.fn = JQ.prototype;

    function extend() {
      var this$1 = this;
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (!args.length) {
        return this;
      }

      // $.extend(obj)
      if (args.length === 1) {
        Object.keys(args[0]).forEach(function (prop) {
          this$1[prop] = args[0][prop];
        });

        return this;
      }

      // $.extend({}, defaults[, obj])
      var target = args.shift();

      var loop = function ( i ) {
        Object.keys(args[i]).forEach(function (prop) {
          target[prop] = args[i][prop];
        });
      };

      for (var i = 0; i < args.length; i += 1) loop( i );

      return target;
    }

    $.fn.extend = extend;
    $.extend = extend;

    /**
     * 判断一个节点名
     * @param ele
     * @param name
     * @returns {boolean}
     */
    function isNodeName(ele, name) {
      return ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();
    }

    /**
     * 除去 null 后的 object 类型
     * @param obj
     * @returns {*|boolean}
     */
    function isObjectLike(obj) {
      return typeof obj === 'object' && obj !== null;
    }

    function isFunction(fn) {
      return typeof fn === 'function';
    }

    function isString(obj) {
      return typeof obj === 'string';
    }

    function isWindow(win) {
      return win && win === win.window;
    }

    function isDocument(doc) {
      return doc && doc.nodeType === doc.DOCUMENT_NODE;
    }

    function isArrayLike(obj) {
      return typeof obj.length === 'number';
    }

    /**
     * 循环数组或对象
     * @param obj
     * @param callback
     * @returns {*}
     */
    function each(obj, callback) {
      if (isArrayLike(obj)) {
        for (var i = 0; i < obj.length; i += 1) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            return obj;
          }
        }
      } else {
        var keys = Object.keys(obj);
        for (var i$1 = 0; i$1 < keys.length; i$1 += 1) {
          if (callback.call(obj[keys[i$1]], keys[i$1], obj[keys[i$1]]) === false) {
            return obj;
          }
        }
      }

      return obj;
    }

    /**
     * 遍历数组或对象，通过函数返回一个新的数组或对象，null 和 undefined 将被过滤掉。
     * @param elems
     * @param callback
     * @returns {Array}
     */
    function map(elems, callback) {
      var ref;

      var value;
      var ret = [];

      each(elems, function (i, elem) {
        value = callback(elem, i);

        if (value !== null && value !== undefined) {
          ret.push(value);
        }
      });

      return (ref = []).concat.apply(ref, ret);
    }

    /**
     * 把对象合并到第一个参数中，并返回第一个参数
     * @param first
     * @param second
     * @returns {*}
     */
    function merge(first, second) {
      each(second, function (i, val) {
        first.push(val);
      });

      return first;
    }

    /**
     * 删除数组中重复元素
     * @param arr {Array}
     * @returns {Array}
     */
    function unique(arr) {
      var result = [];

      for (var i = 0; i < arr.length; i += 1) {
        if (result.indexOf(arr[i]) === -1) {
          result.push(arr[i]);
        }
      }

      return result;
    }

    var elementDisplay = {};

    /**
     * 获取元素的默认 display 样式值，用于 .show() 方法
     * @param nodeName
     * @returns {*}
     */
    function defaultDisplay(nodeName) {
      var element;
      var display;

      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, '').getPropertyValue('display');
        element.parentNode.removeChild(element);
        if (display === 'none') {
          display = 'block';
        }

        elementDisplay[nodeName] = display;
      }

      return elementDisplay[nodeName];
    }

    $.extend({
      each: each,
      merge: merge,
      unique: unique,
      map: map,

      /**
       * 一个 DOM 节点是否包含另一个 DOM 节点
       * @param parent {Node} 父节点
       * @param node {Node} 子节点
       * @returns {Boolean}
       */
      contains: function contains(parent, node) {
        if (parent && !node) {
          return document.documentElement.contains(parent);
        }

        return parent !== node && parent.contains(node);
      },

      /**
       * 将数组或对象序列化
       * @param obj
       * @returns {String}
       */
      param: function param(obj) {
        if (!isObjectLike(obj)) {
          return '';
        }

        var args = [];

        function destructure(key, value) {
          var keyTmp;

          if (isObjectLike(value)) {
            each(value, function (i, v) {
              if (Array.isArray(value) && !isObjectLike(v)) {
                keyTmp = '';
              } else {
                keyTmp = i;
              }

              destructure((key + "[" + keyTmp + "]"), v);
            });
          } else {
            if (value !== null && value !== '') {
              keyTmp = "=" + (encodeURIComponent(value));
            } else {
              keyTmp = '';
            }

            args.push(encodeURIComponent(key) + keyTmp);
          }
        }

        each(obj, function (key, value) {
          destructure(key, value);
        });

        return args.join('&');
      },
    });

    $.fn.extend({
      /**
       * 遍历对象
       * @param callback {Function}
       * @return {JQ}
       */
      each: function each$1(callback) {
        return each(this, callback);
      },

      /**
       * 通过遍历集合中的节点对象，通过函数返回一个新的对象，null 或 undefined 将被过滤掉。
       * @param callback {Function}
       * @returns {JQ}
       */
      map: function map$1(callback) {
        return new JQ(map(this, function (el, i) { return callback.call(el, i, el); }));
      },

      /**
       * 获取指定 DOM 元素，没有 index 参数时，获取所有 DOM 的数组
       * @param index {Number=}
       * @returns {Node|Array}
       */
      get: function get(index) {
        return index === undefined
          ? [].slice.call(this)
          : this[index >= 0 ? index : index + this.length];
      },

      /**
       * array中提取的方法。从start开始，如果end 指出。提取不包含end位置的元素。
       * @param args {start, end}
       * @returns {JQ}
       */
      slice: function slice() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return new JQ([].slice.apply(this, args));
      },

      /**
       * 筛选元素集合
       * @param selector {String|JQ|Node|Function}
       * @returns {JQ}
       */
      filter: function filter(selector) {
        if (isFunction(selector)) {
          return this.map(function (index, ele) { return (selector.call(ele, index, ele) ? ele : undefined); });
        }

        var $selector = $(selector);

        return this.map(function (index, ele) { return ($selector.index(ele) > -1 ? ele : undefined); });
      },

      /**
       * 从元素集合中删除指定的元素
       * @param selector {String|Node|JQ|Function}
       * @return {JQ}
       */
      not: function not(selector) {
        var $excludes = this.filter(selector);

        return this.map(function (index, ele) { return ($excludes.index(ele) > -1 ? undefined : ele); });
      },

      /**
       * 获取元素相对于 document 的偏移
       * @returns {Object}
       */
      offset: function offset() {
        if (this[0]) {
          var offset = this[0].getBoundingClientRect();

          return {
            left: offset.left + window.pageXOffset,
            top: offset.top + window.pageYOffset,
            width: offset.width,
            height: offset.height,
          };
        }

        return null;
      },

      /**
       * 返回最近的用于定位的父元素
       * @returns {*|JQ}
       */
      offsetParent: function offsetParent() {
        return this.map(function () {
          var parent = this.offsetParent;

          while (parent && $(parent).css('position') === 'static') {
            parent = parent.offsetParent;
          }

          return parent || document.documentElement;
        });
      },

      /**
       * 获取元素相对于父元素的偏移
       * @return {Object}
       */
      position: function position() {
        var self = this;

        if (!self[0]) {
          return null;
        }

        var offsetParent;
        var offset;
        var parentOffset = {
          top: 0,
          left: 0,
        };

        if (self.css('position') === 'fixed') {
          offset = self[0].getBoundingClientRect();
        } else {
          offsetParent = self.offsetParent();
          offset = self.offset();
          if (!isNodeName(offsetParent[0], 'html')) {
            parentOffset = offsetParent.offset();
          }

          parentOffset = {
            top: parentOffset.top + offsetParent.css('borderTopWidth'),
            left: parentOffset.left + offsetParent.css('borderLeftWidth'),
          };
        }

        return {
          top: offset.top - parentOffset.top - self.css('marginTop'),
          left: offset.left - parentOffset.left - self.css('marginLeft'),
          width: offset.width,
          height: offset.height,
        };
      },

      /**
       * 显示指定元素
       * @returns {JQ}
       */
      show: function show() {
        return this.each(function () {
          if (this.style.display === 'none') {
            this.style.display = '';
          }

          if (window.getComputedStyle(this, '').getPropertyValue('display') === 'none') {
            this.style.display = defaultDisplay(this.nodeName);
          }
        });
      },

      /**
       * 隐藏指定元素
       * @returns {JQ}
       */
      hide: function hide() {
        return this.each(function () {
          this.style.display = 'none';
        });
      },

      /**
       * 切换元素的显示状态
       * @returns {JQ}
       */
      toggle: function toggle() {
        return this.each(function () {
          this.style.display = this.style.display === 'none' ? '' : 'none';
        });
      },

      /**
       * 是否含有指定的 CSS 类
       * @param className {String}
       * @returns {boolean}
       */
      hasClass: function hasClass(className) {
        if (!this[0] || !className) {
          return false;
        }

        return this[0].classList.contains(className);
      },

      /**
       * 移除指定属性
       * @param attr {String}
       * @returns {JQ}
       */
      removeAttr: function removeAttr(attr) {
        return this.each(function () {
          this.removeAttribute(attr);
        });
      },

      /**
       * 删除属性值
       * @param name {String}
       * @returns {JQ}
       */
      removeProp: function removeProp(name) {
        return this.each(function () {
          try {
            delete this[name];
          } catch (e) {
            // empty
          }
        });
      },

      /**
       * 获取当前对象中第n个元素
       * @param index {Number}
       * @returns {JQ}
       */
      eq: function eq(index) {
        var ret = index === -1
          ? this.slice(index)
          : this.slice(index, +index + 1);

        return new JQ(ret);
      },

      /**
       * 获取对象中第一个元素
       * @returns {JQ}
       */
      first: function first() {
        return this.eq(0);
      },

      /**
       * 获取对象中最后一个元素
       * @returns {JQ}
       */
      last: function last() {
        return this.eq(-1);
      },

      /**
       * 获取一个元素的位置。
       * 当 elem 参数没有给出时，返回当前元素在兄弟节点中的位置。
       * 有给出了 elem 参数时，返回 elem 元素在当前对象中的位置
       * @param elem {Selector|Node=}
       * @returns {Number}
       */
      index: function index(elem) {
        if (!elem) {
          // 获取当前 JQ 对象的第一个元素在同辈元素中的位置
          return this
            .eq(0)
            .parent()
            .children()
            .get()
            .indexOf(this[0]);
        }

        if (i