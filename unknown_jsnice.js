'use strict';
/** @type {string} */
Function.__typeName = "Function";
/** @type {boolean} */
Function.__class = true;
/**
 * @param {!Function} callback
 * @param {?} data
 * @return {?}
 */
Function.createCallback = function(callback, data) {
  return function() {
    /** @type {number} */
    var e = arguments.length;
    if (e > 0) {
      /** @type {!Array} */
      var message = [];
      /** @type {number} */
      var i = 0;
      for (; i < e; i++) {
        message[i] = arguments[i];
      }
      message[e] = data;
      return callback.apply(this, message);
    }
    return callback.call(this, data);
  };
};
/**
 * @param {?} contextObject
 * @param {!Function} delegateMethod
 * @return {?}
 */
Function.createDelegate = function(contextObject, delegateMethod) {
  return function() {
    return delegateMethod.apply(contextObject, arguments);
  };
};
/** @type {function(): undefined} */
Function.emptyFunction = Function.emptyMethod = function() {
};
/**
 * @param {(Node|NodeList|string)} callback
 * @param {!Object} params
 * @param {string} value
 * @return {?}
 */
Function.validateParameters = function(callback, params, value) {
  return Function._validateParams(callback, params, value);
};
/**
 * @param {!NodeList} object
 * @param {!Object} params
 * @param {string} value
 * @return {?}
 */
Function._validateParams = function(object, params, value) {
  var result;
  var a = params.length;
  value = value || typeof value === "undefined";
  result = Function._validateParameterCount(object, params, value);
  if (result) {
    result.popStackFrame();
    return result;
  }
  /** @type {number} */
  var b = 0;
  var pos = object.length;
  for (; b < pos; b++) {
    var data = params[Math.min(b, a - 1)];
    var value = data.name;
    if (data.parameterArray) {
      /** @type {string} */
      value = value + ("[" + (b - a + 1) + "]");
    } else {
      if (!value && b >= a) {
        break;
      }
    }
    result = Function._validateParameter(object[b], data, value);
    if (result) {
      result.popStackFrame();
      return result;
    }
  }
  return null;
};
/**
 * @param {(Array|NodeList)} trace
 * @param {!Object} args
 * @param {string} next
 * @return {?}
 */
Function._validateParameterCount = function(trace, args, next) {
  var i;
  var c;
  var height = args.length;
  var y = trace.length;
  if (y < height) {
    var ymax = height;
    /** @type {number} */
    i = 0;
    for (; i < height; i++) {
      var arg = args[i];
      if (arg.optional || arg.parameterArray) {
        ymax--;
      }
    }
    if (y < ymax) {
      /** @type {boolean} */
      c = true;
    }
  } else {
    if (next && y > height) {
      /** @type {boolean} */
      c = true;
      /** @type {number} */
      i = 0;
      for (; i < height; i++) {
        if (args[i].parameterArray) {
          /** @type {boolean} */
          c = false;
          break;
        }
      }
    }
  }
  if (c) {
    var e = Error.parameterCount();
    e.popStackFrame();
    return e;
  }
  return null;
};
/**
 * @param {!Object} filter
 * @param {!Object} options
 * @param {string} data
 * @return {?}
 */
Function._validateParameter = function(filter, options, data) {
  var result;
  var method = options.type;
  /** @type {boolean} */
  var value = !!options.integer;
  /** @type {boolean} */
  var php = !!options.domElement;
  /** @type {boolean} */
  var A = !!options.mayBeNull;
  result = Function._validateParameterType(filter, method, value, php, A, data);
  if (result) {
    result.popStackFrame();
    return result;
  }
  var elementType = options.elementType;
  /** @type {boolean} */
  var status = !!options.elementMayBeNull;
  if (method === Array && typeof filter !== "undefined" && filter !== null && (elementType || !status)) {
    /** @type {boolean} */
    var htmlMinifierOptions = !!options.elementInteger;
    /** @type {boolean} */
    var php = !!options.elementDomElement;
    /** @type {number} */
    var i = 0;
    for (; i < filter.length; i++) {
      var value = filter[i];
      result = Function._validateParameterType(value, elementType, htmlMinifierOptions, php, status, data + "[" + i + "]");
      if (result) {
        result.popStackFrame();
        return result;
      }
    }
  }
  return null;
};
/**
 * @param {!Object} value
 * @param {!Object} type
 * @param {boolean} page
 * @param {string} id
 * @param {boolean} result
 * @param {string} argumentName
 * @return {?}
 */
Function._validateParameterType = function(value, type, page, id, result, argumentName) {
  var sent;
  var name;
  if (typeof value === "undefined") {
    if (result) {
      return null;
    } else {
      sent = Error.argumentUndefined(argumentName);
      sent.popStackFrame();
      return sent;
    }
  }
  if (value === null) {
    if (result) {
      return null;
    } else {
      sent = Error.argumentNull(argumentName);
      sent.popStackFrame();
      return sent;
    }
  }
  if (type && type.__enum) {
    if (typeof value !== "number") {
      sent = Error.argumentType(argumentName, Object.getType(value), type);
      sent.popStackFrame();
      return sent;
    }
    if (value % 1 === 0) {
      var p = type.prototype;
      if (!type.__flags || value === 0) {
        for (name in p) {
          if (p[name] === value) {
            return null;
          }
        }
      } else {
        /** @type {!Object} */
        var n = value;
        for (name in p) {
          var i = p[name];
          if (i === 0) {
            continue;
          }
          if ((i & value) === i) {
            /** @type {number} */
            n = n - i;
          }
          if (n === 0) {
            return null;
          }
        }
      }
    }
    sent = Error.argumentOutOfRange(argumentName, value, String.format(Sys.Res.enumInvalidValue, value, type.getName()));
    sent.popStackFrame();
    return sent;
  }
  if (id && (!Sys._isDomElement(value) || value.nodeType === 3)) {
    sent = Error.argument(argumentName, Sys.Res.argumentDomElement);
    sent.popStackFrame();
    return sent;
  }
  if (type && !Sys._isInstanceOfType(type, value)) {
    sent = Error.argumentType(argumentName, Object.getType(value), type);
    sent.popStackFrame();
    return sent;
  }
  if (type === Number && page) {
    if (value % 1 !== 0) {
      sent = Error.argumentOutOfRange(argumentName, value, Sys.Res.argumentInteger);
      sent.popStackFrame();
      return sent;
    }
  }
  return null;
};
/** @type {string} */
Error.__typeName = "Error";
/** @type {boolean} */
Error.__class = true;
/**
 * @param {string} message
 * @param {!Object} data
 * @return {?}
 */
Error.create = function(message, data) {
  /** @type {!Error} */
  var e = new Error(message);
  /** @type {string} */
  e.message = message;
  if (data) {
    var i;
    for (i in data) {
      e[i] = data[i];
    }
  }
  e.popStackFrame();
  return e;
};
/**
 * @param {string} name
 * @param {string} options
 * @return {?}
 */
Error.argument = function(name, options) {
  /** @type {string} */
  var message = "Sys.ArgumentException: " + (options ? options : Sys.Res.argument);
  if (name) {
    /** @type {string} */
    message = message + ("\n" + String.format(Sys.Res.paramName, name));
  }
  var e = Error.create(message, {
    name : "Sys.ArgumentException",
    paramName : name
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} name
 * @param {string} status
 * @return {?}
 */
Error.argumentNull = function(name, status) {
  /** @type {string} */
  var message = "Sys.ArgumentNullException: " + (status ? status : Sys.Res.argumentNull);
  if (name) {
    /** @type {string} */
    message = message + ("\n" + String.format(Sys.Res.paramName, name));
  }
  var e = Error.create(message, {
    name : "Sys.ArgumentNullException",
    paramName : name
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} name
 * @param {!Object} v
 * @param {string} delayed
 * @return {?}
 */
Error.argumentOutOfRange = function(name, v, delayed) {
  /** @type {string} */
  var message = "Sys.ArgumentOutOfRangeException: " + (delayed ? delayed : Sys.Res.argumentOutOfRange);
  if (name) {
    /** @type {string} */
    message = message + ("\n" + String.format(Sys.Res.paramName, name));
  }
  if (typeof v !== "undefined" && v !== null) {
    /** @type {string} */
    message = message + ("\n" + String.format(Sys.Res.actualValue, v));
  }
  var e = Error.create(message, {
    name : "Sys.ArgumentOutOfRangeException",
    paramName : name,
    actualValue : v
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} i
 * @param {string} p
 * @param {string} c
 * @param {string} data
 * @return {?}
 */
Error.argumentType = function(i, p, c, data) {
  /** @type {string} */
  var message = "Sys.ArgumentTypeException: ";
  if (data) {
    /** @type {string} */
    message = message + data;
  } else {
    if (p && c) {
      /** @type {string} */
      message = message + String.format(Sys.Res.argumentTypeWithTypes, p.getName(), c.getName());
    } else {
      /** @type {string} */
      message = message + Sys.Res.argumentType;
    }
  }
  if (i) {
    /** @type {string} */
    message = message + ("\n" + String.format(Sys.Res.paramName, i));
  }
  var e = Error.create(message, {
    name : "Sys.ArgumentTypeException",
    paramName : i,
    actualType : p,
    expectedType : c
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} name
 * @param {string} status
 * @return {?}
 */
Error.argumentUndefined = function(name, status) {
  /** @type {string} */
  var message = "Sys.ArgumentUndefinedException: " + (status ? status : Sys.Res.argumentUndefined);
  if (name) {
    /** @type {string} */
    message = message + ("\n" + String.format(Sys.Res.paramName, name));
  }
  var e = Error.create(message, {
    name : "Sys.ArgumentUndefinedException",
    paramName : name
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} tpl
 * @return {?}
 */
Error.format = function(tpl) {
  /** @type {string} */
  var message = "Sys.FormatException: " + (tpl ? tpl : Sys.Res.format);
  var e = Error.create(message, {
    name : "Sys.FormatException"
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} position
 * @return {?}
 */
Error.invalidOperation = function(position) {
  /** @type {string} */
  var message = "Sys.InvalidOperationException: " + (position ? position : Sys.Res.invalidOperation);
  var e = Error.create(message, {
    name : "Sys.InvalidOperationException"
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} data
 * @return {?}
 */
Error.notImplemented = function(data) {
  /** @type {string} */
  var message = "Sys.NotImplementedException: " + (data ? data : Sys.Res.notImplemented);
  var e = Error.create(message, {
    name : "Sys.NotImplementedException"
  });
  e.popStackFrame();
  return e;
};
/**
 * @param {string} limit
 * @return {?}
 */
Error.parameterCount = function(limit) {
  /** @type {string} */
  var msg = "Sys.ParameterCountException: " + (limit ? limit : Sys.Res.parameterCount);
  var count = Error.create(msg, {
    name : "Sys.ParameterCountException"
  });
  count.popStackFrame();
  return count;
};
/**
 * @return {undefined}
 */
Error.prototype.popStackFrame = function() {
  if (typeof this.stack === "undefined" || this.stack === null || typeof this.fileName === "undefined" || this.fileName === null || typeof this.lineNumber === "undefined" || this.lineNumber === null) {
    return;
  }
  /** @type {!Array<string>} */
  var argv = this.stack.split("\n");
  /** @type {string} */
  var value = argv[0];
  /** @type {string} */
  var pattern = this.fileName + ":" + this.lineNumber;
  for (; typeof value !== "undefined" && value !== null && value.indexOf(pattern) === -1;) {
    argv.shift();
    /** @type {string} */
    value = argv[0];
  }
  /** @type {string} */
  var format = argv[1];
  if (typeof format === "undefined" || format === null) {
    return;
  }
  /** @type {(Array<string>|null)} */
  var names = format.match(/@(.*):(\d+)$/);
  if (typeof names === "undefined" || names === null) {
    return;
  }
  /** @type {string} */
  this.fileName = names[1];
  /** @type {number} */
  this.lineNumber = parseInt(names[2]);
  argv.shift();
  /** @type {string} */
  this.stack = argv.join("\n");
};
/** @type {string} */
Object.__typeName = "Object";
/** @type {boolean} */
Object.__class = true;
/**
 * @param {!Object} d
 * @return {?}
 */
Object.getType = function(d) {
  var type = d.constructor;
  if (!type || typeof type !== "function" || !type.__typeName || type.__typeName === "Object") {
    return Object;
  }
  return type;
};
/**
 * @param {!Object} node
 * @return {?}
 */
Object.getTypeName = function(node) {
  return Object.getType(node).getName();
};
/** @type {string} */
String.__typeName = "String";
/** @type {boolean} */
String.__class = true;
/**
 * @param {string} str
 * @param {number=} p1
 * @return {boolean}
 * @this {!String}
 */
String.prototype.endsWith = function(str) {
  return this.substr(this.length - str.length) === str;
};
/**
 * @param {string} value
 * @param {number=} p1
 * @return {boolean}
 * @this {!String}
 */
String.prototype.startsWith = function(value) {
  return this.substr(0, value.length) === value;
};
/**
 * @return {string}
 * @this {!String}
 */
String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};
/**
 * @return {?}
 * @this {!String}
 */
String.prototype.trimEnd = function() {
  return this.replace(/\s+$/, "");
};
/**
 * @return {?}
 * @this {!String}
 */
String.prototype.trimStart = function() {
  return this.replace(/^\s+/, "");
};
/**
 * @return {?}
 */
String.format = function() {
  return String._toFormattedString(false, arguments);
};
/**
 * @param {string} format
 * @param {!Array} args
 * @return {?}
 */
String._toFormattedString = function(format, args) {
  /** @type {string} */
  var result = "";
  var s = args[0];
  /** @type {number} */
  var index = 0;
  for (; true;) {
    var i = s.indexOf("{", index);
    var j = s.indexOf("}", index);
    if (i < 0 && j < 0) {
      result = result + s.slice(index);
      break;
    }
    if (j > 0 && (j < i || i < 0)) {
      result = result + s.slice(index, j + 1);
      index = j + 2;
      continue;
    }
    result = result + s.slice(index, i);
    index = i + 1;
    if (s.charAt(index) === "{") {
      /** @type {string} */
      result = result + "{";
      index++;
      continue;
    }
    if (j < 0) {
      break;
    }
    var line = s.substring(index, j);
    var columnIndex = line.indexOf(":");
    /** @type {number} */
    var prop = parseInt(columnIndex < 0 ? line : line.substring(0, columnIndex), 10) + 1;
    var r = columnIndex < 0 ? "" : line.substring(columnIndex + 1);
    var value = args[prop];
    if (typeof value === "undefined" || value === null) {
      /** @type {string} */
      value = "";
    }
    if (value.toFormattedString) {
      result = result + value.toFormattedString(r);
    } else {
      if (format && value.localeFormat) {
        result = result + value.localeFormat(r);
      } else {
        if (value.format) {
          result = result + value.format(r);
        } else {
          result = result + value.toString();
        }
      }
    }
    index = j + 1;
  }
  return result;
};
/** @type {string} */
Boolean.__typeName = "Boolean";
/** @type {boolean} */
Boolean.__class = true;
/**
 * @param {!Object} b
 * @return {?}
 */
Boolean.parse = function(b) {
  var excludedAttr = b.trim().toLowerCase();
  if (excludedAttr === "false") {
    return false;
  }
  if (excludedAttr === "true") {
    return true;
  }
};
/** @type {string} */
Date.__typeName = "Date";
/** @type {boolean} */
Date.__class = true;
/** @type {string} */
Number.__typeName = "Number";
/** @type {boolean} */
Number.__class = true;
/** @type {string} */
RegExp.__typeName = "RegExp";
/** @type {boolean} */
RegExp.__class = true;
if (!window) {
  /** @type {!global this} */
  this.window = this;
}
/** @type {function(new:!Function, ...*): ?} */
window.Type = Function;
/**
 * @param {?} mode
 * @param {string} name
 * @param {?} b
 * @return {?}
 */
Type.prototype.callBaseMethod = function(mode, name, b) {
  var c = Sys._getBaseMethod(this, mode, name);
  if (!b) {
    return c.apply(mode);
  } else {
    return c.apply(mode, b);
  }
};
/**
 * @param {?} properties
 * @param {string} seconds
 * @return {?}
 */
Type.prototype.getBaseMethod = function(properties, seconds) {
  return Sys._getBaseMethod(this, properties, seconds);
};
/**
 * @return {?}
 */
Type.prototype.getBaseType = function() {
  return typeof this.__baseType === "undefined" ? null : this.__baseType;
};
/**
 * @return {?}
 */
Type.prototype.getInterfaces = function() {
  /** @type {!Array} */
  var ret = [];
  var baseType = this;
  for (; baseType;) {
    var interfaces = baseType.__interfaces;
    if (interfaces) {
      /** @type {number} */
      var i = 0;
      var len = interfaces.length;
      for (; i < len; i++) {
        var value = interfaces[i];
        if (!Array.contains(ret, value)) {
          ret[ret.length] = value;
        }
      }
    }
    baseType = baseType.__baseType;
  }
  return ret;
};
/**
 * @return {?}
 */
Type.prototype.getName = function() {
  return typeof this.__typeName === "undefined" ? "" : this.__typeName;
};
/**
 * @param {!Object} func
 * @return {?}
 */
Type.prototype.implementsInterface = function(func) {
  this.resolveInheritance();
  var $orderCol = func.getName();
  var b = this.__interfaceCache;
  if (b) {
    var bb = b[$orderCol];
    if (typeof bb !== "undefined") {
      return bb;
    }
  } else {
    b = this.__interfaceCache = {};
  }
  var baseType = this;
  for (; baseType;) {
    var interfaces = baseType.__interfaces;
    if (interfaces) {
      if (Array.indexOf(interfaces, func) !== -1) {
        return b[$orderCol] = true;
      }
    }
    baseType = baseType.__baseType;
  }
  return b[$orderCol] = false;
};
/**
 * @param {!Object} object
 * @return {?}
 */
Type.prototype.inheritsFrom = function(object) {
  this.resolveInheritance();
  var baseType = this.__baseType;
  for (; baseType;) {
    if (baseType === object) {
      return true;
    }
    baseType = baseType.__baseType;
  }
  return false;
};
/**
 * @param {?} instance
 * @param {?} args
 * @return {?}
 */
Type.prototype.initializeBase = function(instance, args) {
  this.resolveInheritance();
  if (this.__baseType) {
    if (!args) {
      this.__baseType.apply(instance);
    } else {
      this.__baseType.apply(instance, args);
    }
  }
  return instance;
};
/**
 * @param {!Object} obj
 * @return {?}
 */
Type.prototype.isImplementedBy = function(obj) {
  if (typeof obj === "undefined" || obj === null) {
    return false;
  }
  var ctor = Object.getType(obj);
  return !!(ctor.implementsInterface && ctor.implementsInterface(this));
};
/**
 * @param {!Object} obj
 * @return {?}
 */
Type.prototype.isInstanceOfType = function(obj) {
  return Sys._isInstanceOfType(this, obj);
};
/**
 * @param {string} name
 * @param {!Object} klass
 * @param {!Function} key
 * @return {?}
 */
Type.prototype.registerClass = function(name, klass, key) {
  this.prototype.constructor = this;
  /** @type {string} */
  this.__typeName = name;
  /** @type {boolean} */
  this.__class = true;
  if (klass) {
    /** @type {!Object} */
    this.__baseType = klass;
    /** @type {boolean} */
    this.__basePrototypePending = true;
  }
  Sys.__upperCaseTypes[name.toUpperCase()] = this;
  if (key) {
    /** @type {!Array} */
    this.__interfaces = [];
    /** @type {number} */
    var i = 2;
    /** @type {number} */
    var argl = arguments.length;
    for (; i < argl; i++) {
      var requestMatcher = arguments[i];
      this.__interfaces.push(requestMatcher);
    }
  }
  return this;
};
/**
 * @param {string} name
 * @return {?}
 */
Type.prototype.registerInterface = function(name) {
  Sys.__upperCaseTypes[name.toUpperCase()] = this;
  this.prototype.constructor = this;
  /** @type {string} */
  this.__typeName = name;
  /** @type {boolean} */
  this.__interface = true;
  return this;
};
/**
 * @return {undefined}
 */
Type.prototype.resolveInheritance = function() {
  if (this.__basePrototypePending) {
    var type = this.__baseType;
    type.resolveInheritance();
    var prop;
    for (prop in type.prototype) {
      var val = type.prototype[prop];
      if (!this.prototype[prop]) {
        this.prototype[prop] = val;
      }
    }
    delete this.__basePrototypePending;
  }
};
/**
 * @return {?}
 */
Type.getRootNamespaces = function() {
  return Array.clone(Sys.__rootNamespaces);
};
/**
 * @param {!Object} value
 * @return {?}
 */
Type.isClass = function(value) {
  if (typeof value === "undefined" || value === null) {
    return false;
  }
  return !!value.__class;
};
/**
 * @param {number} value
 * @return {?}
 */
Type.isInterface = function(value) {
  if (typeof value === "undefined" || value === null) {
    return false;
  }
  return !!value.__interface;
};
/**
 * @param {number} thing
 * @return {?}
 */
Type.isNamespace = function(thing) {
  if (typeof thing === "undefined" || thing === null) {
    return false;
  }
  return !!thing.__namespace;
};
/**
 * @param {string} typeName$jscomp$0
 * @param {!Notification} ns$jscomp$0
 * @return {?}
 */
Type.parse = function(typeName$jscomp$0, ns$jscomp$0) {
  var fn$jscomp$0;
  if (ns$jscomp$0) {
    fn$jscomp$0 = Sys.__upperCaseTypes[ns$jscomp$0.getName().toUpperCase() + "." + typeName$jscomp$0.toUpperCase()];
    return fn$jscomp$0 || null;
  }
  if (!typeName$jscomp$0) {
    return null;
  }
  if (!Type.__htClasses) {
    Type.__htClasses = {};
  }
  fn$jscomp$0 = Type.__htClasses[typeName$jscomp$0];
  if (!fn$jscomp$0) {
    /** @type {*} */
    fn$jscomp$0 = eval(typeName$jscomp$0);
    /** @type {*} */
    Type.__htClasses[typeName$jscomp$0] = fn$jscomp$0;
  }
  return fn$jscomp$0;
};
/**
 * @param {string} type
 * @return {undefined}
 */
Type.registerNamespace = function(type) {
  /** @type {!Window} */
  var currentObject = window;
  var components = type.split(".");
  /** @type {number} */
  var i = 0;
  for (; i < components.length; i++) {
    var name = components[i];
    var value = currentObject[name];
    if (!value) {
      value = currentObject[name] = {};
    }
    if (!value.__namespace) {
      if (i === 0 && type !== "Sys") {
        Sys.__rootNamespaces[Sys.__rootNamespaces.length] = value;
      }
      /** @type {boolean} */
      value.__namespace = true;
      value.__typeName = components.slice(0, i + 1).join(".");
      /**
       * @return {?}
       */
      value.getName = function() {
        return this.__typeName;
      };
    }
    currentObject = value;
  }
};
/**
 * @param {?} name
 * @param {?} format
 * @return {?}
 */
Type._checkDependency = function(name, format) {
  var extra = Type._registerScript._scripts;
  /** @type {boolean} */
  var thisPageLinks = extra ? !!extra[name] : false;
  if (typeof format !== "undefined" && !thisPageLinks) {
    throw Error.invalidOperation(String.format(Sys.Res.requiredScriptReferenceNotIncluded, format, name));
  }
  return thisPageLinks;
};
/**
 * @param {?} format
 * @param {!NodeList} raw
 * @return {undefined}
 */
Type._registerScript = function(format, raw) {
  var aggregatedDataByFormat = Type._registerScript._scripts;
  if (!aggregatedDataByFormat) {
    Type._registerScript._scripts = aggregatedDataByFormat = {};
  }
  if (aggregatedDataByFormat[format]) {
    throw Error.invalidOperation(String.format(Sys.Res.scriptAlreadyLoaded, format));
  }
  /** @type {boolean} */
  aggregatedDataByFormat[format] = true;
  if (raw) {
    /** @type {number} */
    var i = 0;
    var rawLength = raw.length;
    for (; i < rawLength; i++) {
      var value = raw[i];
      if (!Type._checkDependency(value)) {
        throw Error.invalidOperation(String.format(Sys.Res.scriptDependencyNotFound, format, value));
      }
    }
  }
};
Type.registerNamespace("Sys");
Sys.__upperCaseTypes = {};
/** @type {!Array} */
Sys.__rootNamespaces = [Sys];
/**
 * @param {!Object} query
 * @param {!Object} c
 * @return {?}
 */
Sys._isInstanceOfType = function(query, c) {
  if (typeof c === "undefined" || c === null) {
    return false;
  }
  if (c instanceof query) {
    return true;
  }
  var ctor = Object.getType(c);
  return !!(ctor === query) || ctor.inheritsFrom && ctor.inheritsFrom(query) || ctor.implementsInterface && ctor.implementsInterface(query);
};
/**
 * @param {?} property
 * @param {?} parent
 * @param {string} i
 * @return {?}
 */
Sys._getBaseMethod = function(property, parent, i) {
  var b = property.getBaseType();
  if (b) {
    var curve = b.prototype[i];
    return curve instanceof Function ? curve : null;
  }
  return null;
};
/**
 * @param {!Object} elem
 * @return {?}
 */
Sys._isDomElement = function(elem) {
  /** @type {boolean} */
  var can_up_level = false;
  if (typeof elem.nodeType !== "number") {
    var doc = elem.ownerDocument || elem.document || elem;
    if (doc != elem) {
      var parent = doc.defaultView || doc.parentWindow;
      /** @type {boolean} */
      can_up_level = parent != elem;
    } else {
      /** @type {boolean} */
      can_up_level = typeof doc.body === "undefined";
    }
  }
  return !can_up_level;
};
/** @type {string} */
Array.__typeName = "Array";
/** @type {boolean} */
Array.__class = true;
/** @type {function(!Array, !Object): undefined} */
Array.add = Array.enqueue = function(o, fn) {
  /** @type {!Object} */
  o[o.length] = fn;
};
/**
 * @param {!Array} value
 * @param {string} array
 * @return {undefined}
 */
Array.addRange = function(value, array) {
  value.push.apply(value, array);
};
/**
 * @param {!Array} a
 * @return {undefined}
 */
Array.clear = function(a) {
  /** @type {number} */
  a.length = 0;
};
/**
 * @param {!Object} obj
 * @return {?}
 */
Array.clone = function(obj) {
  if (obj.length === 1) {
    return [obj[0]];
  } else {
    return Array.apply(null, obj);
  }
};
/**
 * @param {!Array} value
 * @param {!Object} properties
 * @return {?}
 */
Array.contains = function(value, properties) {
  return Sys._indexOf(value, properties) >= 0;
};
/**
 * @param {!Array} type
 * @return {?}
 */
Array.dequeue = function(type) {
  return type.shift();
};
/**
 * @param {(IArrayLike<T>|null)} data
 * @param {(function(this:S, T, number, ?): ?|null)} fn
 * @param {(S|null)=} thisv
 * @return {undefined}
 * @template T,S
 */
Array.forEach = function(data, fn, thisv) {
  /** @type {number} */
  var i = 0;
  /** @type {number} */
  var nbElts = data.length;
  for (; i < nbElts; i++) {
    var item = data[i];
    if (typeof item !== "undefined") {
      fn.call(thisv, item, i, data);
    }
  }
};
/**
 * @param {(IArrayLike<T>|null)} arr
 * @param {!Object} a
 * @param {number=} b
 * @return {number}
 * @template T
 */
Array.indexOf = function(arr, a, b) {
  return Sys._indexOf(arr, a, b);
};
/**
 * @param {!Array} list
 * @param {!Object} n
 * @param {!Object} a
 * @return {undefined}
 */
Array.insert = function(list, n, a) {
  list.splice(n, 0, a);
};
/**
 * @param {?} value$jscomp$84
 * @return {?}
 */
Array.parse = function(value$jscomp$84) {
  if (!value$jscomp$84) {
    return [];
  }
  return eval(value$jscomp$84);
};
/**
 * @param {!Array} value
 * @param {!Object} args
 * @return {?}
 */
Array.remove = function(value, args) {
  var a = Sys._indexOf(value, args);
  if (a >= 0) {
    value.splice(a, 1);
  }
  return a >= 0;
};
/**
 * @param {!Array} index
 * @param {number} array
 * @return {undefined}
 */
Array.removeAt = function(index, array) {
  index.splice(array, 1);
};
/**
 * @param {!Array} arr
 * @param {!Object} obj
 * @param {number} a
 * @return {?}
 */
Sys._indexOf = function(arr, obj, a) {
  if (typeof obj === "undefined") {
    return -1;
  }
  var c = arr.length;
  if (c !== 0) {
    /** @type {number} */
    a = a - 0;
    if (isNaN(a)) {
      /** @type {number} */
      a = 0;
    } else {
      if (isFinite(a)) {
        /** @type {number} */
        a = a - a % 1;
      }
      if (a < 0) {
        /** @type {number} */
        a = Math.max(0, c + a);
      }
    }
    /** @type {number} */
    var i = a;
    for (; i < c; i++) {
      if (typeof arr[i] !== "undefined" && arr[i] === obj) {
        return i;
      }
    }
  }
  return -1;
};
Type._registerScript._scripts = {
  "MicrosoftAjaxCore.js" : true,
  "MicrosoftAjaxGlobalization.js" : true,
  "MicrosoftAjaxSerialization.js" : true,
  "MicrosoftAjaxComponentModel.js" : true,
  "MicrosoftAjaxHistory.js" : true,
  "MicrosoftAjaxNetwork.js" : true,
  "MicrosoftAjaxWebServices.js" : true
};
/**
 * @return {undefined}
 */
Sys.IDisposable = function() {
};
Sys.IDisposable.prototype = {};
Sys.IDisposable.registerInterface("Sys.IDisposable");
/**
 * @param {string} value
 * @return {undefined}
 */
Sys.StringBuilder = function(value) {
  /** @type {!Array} */
  this._parts = typeof value !== "undefined" && value !== null && value !== "" ? [value.toString()] : [];
  this._value = {};
  /** @type {number} */
  this._len = 0;
};
Sys.StringBuilder.prototype = {
  append : function(v) {
    /** @type {string} */
    this._parts[this._parts.length] = v;
  },
  appendLine : function(text) {
    /** @type {string} */
    this._parts[this._parts.length] = typeof text === "undefined" || text === null || text === "" ? "\r\n" : text + "\r\n";
  },
  clear : function() {
    /** @type {!Array} */
    this._parts = [];
    this._value = {};
    /** @type {number} */
    this._len = 0;
  },
  isEmpty : function() {
    if (this._parts.length === 0) {
      return true;
    }
    return this.toString() === "";
  },
  toString : function(s) {
    s = s || "";
    var parts = this._parts;
    if (this._len !== parts.length) {
      this._value = {};
      this._len = parts.length;
    }
    var value = this._value;
    if (typeof value[s] === "undefined") {
      if (s !== "") {
        /** @type {number} */
        var i = 0;
        for (; i < parts.length;) {
          if (typeof parts[i] === "undefined" || parts[i] === "" || parts[i] === null) {
            parts.splice(i, 1);
          } else {
            i++;
          }
        }
      }
      value[s] = this._parts.join(s);
    }
    return value[s];
  }
};
Sys.StringBuilder.registerClass("Sys.StringBuilder");
Sys.Browser = {};
Sys.Browser.InternetExplorer = {};
Sys.Browser.Firefox = {};
Sys.Browser.Safari = {};
Sys.Browser.Opera = {};
/** @type {null} */
Sys.Browser.agent = null;
/** @type {boolean} */
Sys.Browser.hasDebuggerStatement = false;
/** @type {string} */
Sys.Browser.name = navigator.appName;
/** @type {number} */
Sys.Browser.version = parseFloat(navigator.appVersion);
/** @type {number} */
Sys.Browser.documentMode = 0;
if (navigator.userAgent.indexOf(" MSIE ") > -1) {
  Sys.Browser.agent = Sys.Browser.InternetExplorer;
  /** @type {number} */
  Sys.Browser.version = parseFloat(navigator.userAgent.match(/MSIE (\d+\.\d+)/)[1]);
  if (Sys.Browser.version >= 8) {
    if (document.documentMode >= 7) {
      Sys.Browser.documentMode = document.documentMode;
    }
  }
  /** @type {boolean} */
  Sys.Browser.hasDebuggerStatement = true;
} else {
  if (navigator.userAgent.indexOf(" Firefox/") > -1) {
    Sys.Browser.agent = Sys.Browser.Firefox;
    /** @type {number} */
    Sys.Browser.version = parseFloat(navigator.userAgent.match(/Firefox\/(\d+\.\d+)/)[1]);
    /** @type {string} */
    Sys.Browser.name = "Firefox";
    /** @type {boolean} */
    Sys.Browser.hasDebuggerStatement = true;
  } else {
    if (navigator.userAgent.indexOf(" AppleWebKit/") > -1) {
      Sys.Browser.agent = Sys.Browser.Safari;
      /** @type {number} */
      Sys.Browser.version = parseFloat(navigator.userAgent.match(/AppleWebKit\/(\d+(\.\d+)?)/)[1]);
      /** @type {string} */
      Sys.Browser.name = "Safari";
    } else {
      if (navigator.userAgent.indexOf("Opera/") > -1) {
        Sys.Browser.agent = Sys.Browser.Opera;
      }
    }
  }
}
/**
 * @return {undefined}
 */
Sys.EventArgs = function() {
};
Sys.EventArgs.registerClass("Sys.EventArgs");
Sys.EventArgs.Empty = new Sys.EventArgs;
/**
 * @return {undefined}
 */
Sys.CancelEventArgs = function() {
  Sys.CancelEventArgs.initializeBase(this);
  /** @type {boolean} */
  this._cancel = false;
};
Sys.CancelEventArgs.prototype = {
  get_cancel : function() {
    return this._cancel;
  },
  set_cancel : function(fn) {
    /** @type {!Function} */
    this._cancel = fn;
  }
};
Sys.CancelEventArgs.registerClass("Sys.CancelEventArgs", Sys.EventArgs);
Type.registerNamespace("Sys.UI");
/**
 * @return {undefined}
 */
Sys._Debug = function() {
};
Sys._Debug.prototype = {
  _appendConsole : function(message) {
    if (typeof Debug !== "undefined" && Debug.writeln) {
      Debug.writeln(message);
    }
    if (window.console && window.console.log) {
      window.console.log(message);
    }
    if (window.opera) {
      window.opera.postError(message);
    }
    if (window.debugService) {
      window.debugService.trace(message);
    }
  },
  _appendTrace : function(text) {
    /** @type {(Element|null)} */
    var firstChild = document.getElementById("TraceConsole");
    if (firstChild && firstChild.tagName.toUpperCase() === "TEXTAREA") {
      firstChild.value += text + "\n";
    }
  },
  assert : function(getter, value, subject) {
    if (!getter) {
      value = subject && this.assert.caller ? String.format(Sys.Res.assertFailedCaller, value, this.assert.caller) : String.format(Sys.Res.assertFailed, value);
      if (confirm(String.format(Sys.Res.breakIntoDebugger, value))) {
        this.fail(value);
      }
    }
  },
  clearTrace : function() {
    /** @type {(Element|null)} */
    var firstChild = document.getElementById("TraceConsole");
    if (firstChild && firstChild.tagName.toUpperCase() === "TEXTAREA") {
      /** @type {string} */
      firstChild.value = "";
    }
  },
  fail : function(message$jscomp$23) {
    this._appendConsole(message$jscomp$23);
    if (Sys.Browser.hasDebuggerStatement) {
      eval("debugger");
    }
  },
  trace : function(data) {
    this._appendConsole(data);
    this._appendTrace(data);
  },
  traceDump : function(a, b) {
    var bySmiley = this._traceDump(a, b, true);
  },
  _traceDump : function(obj, name, val, color, link) {
    name = name ? name : "traceDump";
    color = color ? color : "";
    if (obj === null) {
      this.trace(color + name + ": null");
      return;
    }
    switch(typeof obj) {
      case "undefined":
        this.trace(color + name + ": Undefined");
        break;
      case "number":
      case "string":
      case "boolean":
        this.trace(color + name + ": " + obj);
        break;
      default:
        if (Date.isInstanceOfType(obj) || RegExp.isInstanceOfType(obj)) {
          this.trace(color + name + ": " + obj.toString());
          break;
        }
        if (!link) {
          /** @type {!Array} */
          link = [];
        } else {
          if (Array.contains(link, obj)) {
            this.trace(color + name + ": ...");
            return;
          }
        }
        Array.add(link, obj);
        if (obj == window || obj === document || window.HTMLElement && obj instanceof HTMLElement || typeof obj.nodeName === "string") {
          var length = obj.tagName ? obj.tagName : "DomElement";
          if (obj.id) {
            /** @type {string} */
            length = length + (" - " + obj.id);
          }
          this.trace(color + name + " {" + length + "}");
        } else {
          var o = Object.getTypeName(obj);
          this.trace(color + name + (typeof o === "string" ? " {" + o + "}" : ""));
          if (color === "" || val) {
            /** @type {string} */
            color = color + "    ";
            var i;
            var j;
            var l;
            var prop;
            var value;
            if (Array.isInstanceOfType(obj)) {
              j = obj.length;
              /** @type {number} */
              i = 0;
              for (; i < j; i++) {
                this._traceDump(obj[i], "[" + i + "]", val, color, link);
              }
            } else {
              for (prop in obj) {
                value = obj[prop];
                if (!Function.isInstanceOfType(value)) {
                  this._traceDump(value, prop, val, color, link);
                }
              }
            }
          }
        }
        Array.remove(link, obj);
    }
  }
};
Sys._Debug.registerClass("Sys._Debug");
Sys.Debug = new Sys._Debug;
/** @type {boolean} */
Sys.Debug.isDebug = false;
/**
 * @param {string} id
 * @param {boolean} err
 * @return {?}
 */
function Sys$Enum$parse(id, err) {
  var o;
  var val;
  var msg;
  if (err) {
    o = this.__lowerCaseValues;
    if (!o) {
      this.__lowerCaseValues = o = {};
      var p = this.prototype;
      var i;
      for (i in p) {
        o[i.toLowerCase()] = p[i];
      }
    }
  } else {
    o = this.prototype;
  }
  if (!this.__flags) {
    msg = err ? id.toLowerCase() : id;
    val = o[msg.trim()];
    if (typeof val !== "number") {
      throw Error.argument("value", String.format(Sys.Res.enumInvalidValue, id, this.__typeName));
    }
    return val;
  } else {
    var termFragments = (err ? id.toLowerCase() : id).split(",");
    /** @type {number} */
    var b = 0;
    /** @type {number} */
    var i = termFragments.length - 1;
    for (; i >= 0; i--) {
      var name = termFragments[i].trim();
      val = o[name];
      if (typeof val !== "number") {
        throw Error.argument("value", String.format(Sys.Res.enumInvalidValue, id.split(",")[i].trim(), this.__typeName));
      }
      /** @type {number} */
      b = b | val;
    }
    return b;
  }
}
/**
 * @param {number} b
 * @return {?}
 */
function Sys$Enum$toString(b) {
  if (typeof b === "undefined" || b === null) {
    return this.__string;
  }
  var d = this.prototype;
  var j;
  if (!this.__flags || b === 0) {
    for (j in d) {
      if (d[j] === b) {
        return j;
      }
    }
  } else {
    var nodes = this.__sortedValues;
    if (!nodes) {
      /** @type {!Array} */
      nodes = [];
      for (j in d) {
        nodes[nodes.length] = {
          key : j,
          value : d[j]
        };
      }
      nodes.sort(function(cube_vb, cube_va) {
        return cube_vb.value - cube_va.value;
      });
      /** @type {!Array} */
      this.__sortedValues = nodes;
    }
    /** @type {!Array} */
    var params = [];
    /** @type {number} */
    var i = b;
    /** @type {number} */
    j = nodes.length - 1;
    for (; j >= 0; j--) {
      var node = nodes[j];
      var a = node.value;
      if (a === 0) {
        continue;
      }
      if ((a & b) === a) {
        params[params.length] = node.key;
        /** @type {number} */
        i = i - a;
        if (i === 0) {
          break;
        }
      }
    }
    if (params.length && i === 0) {
      return params.reverse().join(", ");
    }
  }
  return "";
}
/**
 * @param {string} name
 * @param {number} enumValues
 * @return {undefined}
 */
Type.prototype.registerEnum = function(name, enumValues) {
  Sys.__upperCaseTypes[name.toUpperCase()] = this;
  var prop;
  for (prop in this.prototype) {
    this[prop] = this.prototype[prop];
  }
  /** @type {string} */
  this.__typeName = name;
  /** @type {function(string, boolean): ?} */
  this.parse = Sys$Enum$parse;
  this.__string = this.toString();
  /** @type {function(number): ?} */
  this.toString = Sys$Enum$toString;
  /** @type {number} */
  this.__flags = enumValues;
  /** @type {boolean} */
  this.__enum = true;
};
/**
 * @param {number} type
 * @return {?}
 */
Type.isEnum = function(type) {
  if (typeof type === "undefined" || type === null) {
    return false;
  }
  return !!type.__enum;
};
/**
 * @param {!Object} type
 * @return {?}
 */
Type.isFlags = function(type) {
  if (typeof type === "undefined" || type === null) {
    return false;
  }
  return !!type.__flags;
};
/**
 * @param {string} url
 * @param {string} id
 * @param {number} data
 * @param {string} deps
 * @param {number} i
 * @return {undefined}
 */
Sys.CollectionChange = function(url, id, data, deps, i) {
  /** @type {string} */
  this.action = url;
  if (id) {
    if (!(id instanceof Array)) {
      /** @type {!Array} */
      id = [id];
    }
  }
  this.newItems = id || null;
  if (typeof data !== "number") {
    /** @type {number} */
    data = -1;
  }
  /** @type {number} */
  this.newStartingIndex = data;
  if (deps) {
    if (!(deps instanceof Array)) {
      /** @type {!Array} */
      deps = [deps];
    }
  }
  this.oldItems = deps || null;
  if (typeof i !== "number") {
    /** @type {number} */
    i = -1;
  }
  /** @type {number} */
  this.oldStartingIndex = i;
};
Sys.CollectionChange.registerClass("Sys.CollectionChange");
/**
 * @return {?}
 */
Sys.NotifyCollectionChangedAction = function() {
  throw Error.notImplemented();
};
Sys.NotifyCollectionChangedAction.prototype = {
  add : 0,
  remove : 1,
  reset : 2
};
Sys.NotifyCollectionChangedAction.registerEnum("Sys.NotifyCollectionChangedAction");
/**
 * @param {!Array} a
 * @return {undefined}
 */
Sys.NotifyCollectionChangedEventArgs = function(a) {
  /** @type {!Array} */
  this._changes = a;
  Sys.NotifyCollectionChangedEventArgs.initializeBase(this);
};
Sys.NotifyCollectionChangedEventArgs.prototype = {
  get_changes : function() {
    return this._changes || [];
  }
};
Sys.NotifyCollectionChangedEventArgs.registerClass("Sys.NotifyCollectionChangedEventArgs", Sys.EventArgs);
/**
 * @return {undefined}
 */
Sys.Observer = function() {
};
Sys.Observer.registerClass("Sys.Observer");
/**
 * @param {!Object} target
 * @return {?}
 */
Sys.Observer.makeObservable = function(target) {
  /** @type {boolean} */
  var isTargetArr = target instanceof Array;
  /** @type {function(): undefined} */
  var api = Sys.Observer;
  if (target.setValue === api._observeMethods.setValue) {
    return target;
  }
  api._addMethods(target, api._observeMethods);
  if (isTargetArr) {
    api._addMethods(target, api._arrayMethods);
  }
  return target;
};
/**
 * @param {!Object} node
 * @param {!Object} template
 * @return {undefined}
 */
Sys.Observer._addMethods = function(node, template) {
  var key;
  for (key in template) {
    node[key] = template[key];
  }
};
/**
 * @param {!AudioNode} element
 * @param {string} handler
 * @param {!Object} method
 * @return {undefined}
 */
Sys.Observer._addEventHandler = function(element, handler, method) {
  Sys.Observer._getContext(element, true).events._addHandler(handler, method);
};
/**
 * @param {!AudioNode} fn
 * @param {string} cb
 * @param {!Object} n
 * @return {undefined}
 */
Sys.Observer.addEventHandler = function(fn, cb, n) {
  Sys.Observer._addEventHandler(fn, cb, n);
};
/**
 * @param {!AudioNode} element
 * @param {string} func
 * @param {string} method
 * @return {undefined}
 */
Sys.Observer._removeEventHandler = function(element, func, method) {
  Sys.Observer._getContext(element, true).events._removeHandler(func, method);
};
/**
 * @param {!AudioNode} element
 * @param {string} fnName
 * @param {string} fn
 * @return {undefined}
 */
Sys.Observer.removeEventHandler = function(element, fnName, fn) {
  Sys.Observer._removeEventHandler(element, fnName, fn);
};
/**
 * @param {!Object} context
 * @param {string} name
 * @param {string} value
 * @return {undefined}
 */
Sys.Observer.raiseEvent = function(context, name, value) {
  var self = Sys.Observer._getContext(context);
  if (!self) {
    return;
  }
  var handler = self.events.getHandler(name);
  if (handler) {
    handler(context, value);
  }
};
/**
 * @param {!AudioNode} event_name
 * @param {!Object} _
 * @return {undefined}
 */
Sys.Observer.addPropertyChanged = function(event_name, _) {
  Sys.Observer._addEventHandler(event_name, "propertyChanged", _);
};
/**
 * @param {!AudioNode} key
 * @param {string} global
 * @return {undefined}
 */
Sys.Observer.removePropertyChanged = function(key, global) {
  Sys.Observer._removeEventHandler(key, "propertyChanged", global);
};
/**
 * @param {!AudioNode} context
 * @return {undefined}
 */
Sys.Observer.beginUpdate = function(context) {
  /** @type {boolean} */
  Sys.Observer._getContext(context, true).updating = true;
};
/**
 * @param {!Object} context
 * @return {undefined}
 */
Sys.Observer.endUpdate = function(context) {
  var user = Sys.Observer._getContext(context);
  if (!user || !user.updating) {
    return;
  }
  /** @type {boolean} */
  user.updating = false;
  var dirty = user.dirty;
  /** @type {boolean} */
  user.dirty = false;
  if (dirty) {
    if (context instanceof Array) {
      var s = user.changes;
      /** @type {null} */
      user.changes = null;
      Sys.Observer.raiseCollectionChanged(context, s);
    }
    Sys.Observer.raisePropertyChanged(context, "");
  }
};
/**
 * @param {!AudioNode} context
 * @return {?}
 */
Sys.Observer.isUpdating = function(context) {
  var element = Sys.Observer._getContext(context);
  return element ? element.updating : false;
};
/**
 * @param {!Object} target
 * @param {string} key
 * @param {string} value
 * @return {undefined}
 */
Sys.Observer._setValue = function(target, key, value) {
  var method;
  var func;
  /** @type {!Object} */
  var context = target;
  var extendScopeBuffer = key.split(".");
  /** @type {number} */
  var n = 0;
  /** @type {number} */
  var num = extendScopeBuffer.length - 1;
  for (; n < num; n++) {
    var name = extendScopeBuffer[n];
    method = target["get_" + name];
    if (typeof method === "function") {
      target = method.call(target);
    } else {
      target = target[name];
    }
    /** @type {string} */
    var path = typeof target;
    if (target === null || path === "undefined") {
      throw Error.invalidOperation(String.format(Sys.Res.nullReferenceInPath, key));
    }
  }
  var item;
  var name = extendScopeBuffer[num];
  method = target["get_" + name];
  func = target["set_" + name];
  if (typeof method === "function") {
    item = method.call(target);
  } else {
    item = target[name];
  }
  if (typeof func === "function") {
    func.call(target, value);
  } else {
    /** @type {string} */
    target[name] = value;
  }
  if (item !== value) {
    var store = Sys.Observer._getContext(context);
    if (store && store.updating) {
      /** @type {boolean} */
      store.dirty = true;
      return;
    }
    Sys.Observer.raisePropertyChanged(context, extendScopeBuffer[0]);
  }
};
/**
 * @param {!Object} val
 * @param {string} fill
 * @param {string} time
 * @return {undefined}
 */
Sys.Observer.setValue = function(val, fill, time) {
  Sys.Observer._setValue(val, fill, time);
};
/**
 * @param {!Object} type
 * @param {string} name
 * @return {undefined}
 */
Sys.Observer.raisePropertyChanged = function(type, name) {
  Sys.Observer.raiseEvent(type, "propertyChanged", new Sys.PropertyChangedEventArgs(name));
};
/**
 * @param {!AudioNode} event_name
 * @param {!Object} _
 * @return {undefined}
 */
Sys.Observer.addCollectionChanged = function(event_name, _) {
  Sys.Observer._addEventHandler(event_name, "collectionChanged", _);
};
/**
 * @param {!AudioNode} key
 * @param {string} global
 * @return {undefined}
 */
Sys.Observer.removeCollectionChanged = function(key, global) {
  Sys.Observer._removeEventHandler(key, "collectionChanged", global);
};
/**
 * @param {!Object} context
 * @param {?} id
 * @return {undefined}
 */
Sys.Observer._collectionChange = function(context, id) {
  var model = Sys.Observer._getContext(context);
  if (model && model.updating) {
    /** @type {boolean} */
    model.dirty = true;
    var values = model.changes;
    if (!values) {
      /** @type {!Array} */
      model.changes = values = [id];
    } else {
      values.push(id);
    }
  } else {
    Sys.Observer.raiseCollectionChanged(context, [id]);
    Sys.Observer.raisePropertyChanged(context, "length");
  }
};
/**
 * @param {!Array} fn
 * @param {!Object} a
 * @return {undefined}
 */
Sys.Observer.add = function(fn, a) {
  var extUserId = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [a], fn.length);
  Array.add(fn, a);
  Sys.Observer._collectionChange(fn, extUserId);
};
/**
 * @param {!Array} index
 * @param {string} max
 * @return {undefined}
 */
Sys.Observer.addRange = function(index, max) {
  var box = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, max, index.length);
  Array.addRange(index, max);
  Sys.Observer._collectionChange(index, box);
};
/**
 * @param {!Array} a
 * @return {undefined}
 */
Sys.Observer.clear = function(a) {
  var _ref_a = Array.clone(a);
  Array.clear(a);
  Sys.Observer._collectionChange(a, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.reset, null, -1, _ref_a, 0));
};
/**
 * @param {!Array} value
 * @param {!Object} target
 * @param {!Object} cb
 * @return {undefined}
 */
Sys.Observer.insert = function(value, target, cb) {
  Array.insert(value, target, cb);
  Sys.Observer._collectionChange(value, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [cb], target));
};
/**
 * @param {!Array} a
 * @param {!Object} b
 * @return {?}
 */
Sys.Observer.remove = function(a, b) {
  /** @type {number} */
  var bySmiley = Array.indexOf(a, b);
  if (bySmiley !== -1) {
    Array.remove(a, b);
    Sys.Observer._collectionChange(a, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [b], bySmiley));
    return true;
  }
  return false;
};
/**
 * @param {!Array} value
 * @param {number} i
 * @return {undefined}
 */
Sys.Observer.removeAt = function(value, i) {
  if (i > -1 && i < value.length) {
    var fieldId = value[i];
    Array.removeAt(value, i);
    Sys.Observer._collectionChange(value, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [fieldId], i));
  }
};
/**
 * @param {!Object} type
 * @param {?} s
 * @return {undefined}
 */
Sys.Observer.raiseCollectionChanged = function(type, s) {
  Sys.Observer.raiseEvent(type, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(s));
};
Sys.Observer._observeMethods = {
  add_propertyChanged : function(handler) {
    Sys.Observer._addEventHandler(this, "propertyChanged", handler);
  },
  remove_propertyChanged : function(handler) {
    Sys.Observer._removeEventHandler(this, "propertyChanged", handler);
  },
  addEventHandler : function(eventType, handler) {
    Sys.Observer._addEventHandler(this, eventType, handler);
  },
  removeEventHandler : function(fnName, fn) {
    Sys.Observer._removeEventHandler(this, fnName, fn);
  },
  get_isUpdating : function() {
    return Sys.Observer.isUpdating(this);
  },
  beginUpdate : function() {
    Sys.Observer.beginUpdate(this);
  },
  endUpdate : function() {
    Sys.Observer.endUpdate(this);
  },
  setValue : function(fill, time) {
    Sys.Observer._setValue(this, fill, time);
  },
  raiseEvent : function(name, value) {
    Sys.Observer.raiseEvent(this, name, value);
  },
  raisePropertyChanged : function(name) {
    Sys.Observer.raiseEvent(this, "propertyChanged", new Sys.PropertyChangedEventArgs(name));
  }
};
Sys.Observer._arrayMethods = {
  add_collectionChanged : function(fieldGenerator) {
    Sys.Observer._addEventHandler(this, "collectionChanged", fieldGenerator);
  },
  remove_collectionChanged : function(fieldGenerator) {
    Sys.Observer._removeEventHandler(this, "collectionChanged", fieldGenerator);
  },
  add : function(fn) {
    Sys.Observer.add(this, fn);
  },
  addRange : function(index) {
    Sys.Observer.addRange(this, index);
  },
  clear : function() {
    Sys.Observer.clear(this);
  },
  insert : function(t, cb) {
    Sys.Observer.insert(this, t, cb);
  },
  remove : function(target) {
    return Sys.Observer.remove(this, target);
  },
  removeAt : function(index) {
    Sys.Observer.removeAt(this, index);
  },
  raiseCollectionChanged : function(a) {
    Sys.Observer.raiseEvent(this, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(a));
  }
};
/**
 * @param {!AudioNode} context
 * @param {boolean} data
 * @return {?}
 */
Sys.Observer._getContext = function(context, data) {
  var tokenWriter = context._observerContext;
  if (tokenWriter) {
    return tokenWriter();
  }
  if (data) {
    return (context._observerContext = Sys.Observer._createContext())();
  }
  return null;
};
/**
 * @return {?}
 */
Sys.Observer._createContext = function() {
  var pressRecognizer = {
    events : new Sys.EventHandlerList
  };
  return function() {
    return pressRecognizer;
  };
};
/**
 * @param {string} a
 * @param {?} tokens
 * @return {?}
 */
Date._appendPreOrPostMatch = function(a, tokens) {
  /** @type {number} */
  var d = 0;
  /** @type {boolean} */
  var m = false;
  /** @type {number} */
  var n = 0;
  var numberOfFrustums = a.length;
  for (; n < numberOfFrustums; n++) {
    var w = a.charAt(n);
    switch(w) {
      case "'":
        if (m) {
          tokens.append("'");
        } else {
          d++;
        }
        /** @type {boolean} */
        m = false;
        break;
      case "\\":
        if (m) {
          tokens.append("\\");
        }
        /** @type {boolean} */
        m = !m;
        break;
      default:
        tokens.append(w);
        /** @type {boolean} */
        m = false;
    }
  }
  return d;
};
/**
 * @param {?} dt
 * @param {string} format
 * @return {?}
 */
Date._expandFormat = function(dt, format) {
  if (!format) {
    /** @type {string} */
    format = "F";
  }
  var l = format.length;
  if (l === 1) {
    switch(format) {
      case "d":
        return dt.ShortDatePattern;
      case "D":
        return dt.LongDatePattern;
      case "t":
        return dt.ShortTimePattern;
      case "T":
        return dt.LongTimePattern;
      case "f":
        return dt.LongDatePattern + " " + dt.ShortTimePattern;
      case "F":
        return dt.FullDateTimePattern;
      case "M":
      case "m":
        return dt.MonthDayPattern;
      case "s":
        return dt.SortableDateTimePattern;
      case "Y":
      case "y":
        return dt.YearMonthPattern;
      default:
        throw Error.format(Sys.Res.formatInvalidString);
    }
  } else {
    if (l === 2 && format.charAt(0) === "%") {
      format = format.charAt(1);
    }
  }
  return format;
};
/**
 * @param {?} y
 * @param {number} i
 * @return {?}
 */
Date._expandYear = function(y, i) {
  /** @type {!Date} */
  var d = new Date;
  var day = Date._getEra(d);
  if (i < 100) {
    var j = Date._getEraYear(d, y, day);
    i = i + (j - j % 100);
    if (i > y.Calendar.TwoDigitYearMax) {
      /** @type {number} */
      i = i - 100;
    }
  }
  return i;
};
/**
 * @param {!Date} end
 * @param {!Object} c
 * @return {?}
 */
Date._getEra = function(end, c) {
  if (!c) {
    return 0;
  }
  var b;
  var a = end.getTime();
  /** @type {number} */
  var i = 0;
  var cl = c.length;
  for (; i < cl; i = i + 4) {
    b = c[i + 2];
    if (b === null || a >= b) {
      return i;
    }
  }
  return 0;
};
/**
 * @param {!Date} time
 * @param {?} data
 * @param {number} name
 * @param {boolean} sortable
 * @return {?}
 */
Date._getEraYear = function(time, data, name, sortable) {
  var nCs = time.getFullYear();
  if (!sortable && data.eras) {
    /** @type {number} */
    nCs = nCs - data.eras[name + 3];
  }
  return nCs;
};
/**
 * @param {?} v
 * @param {string} format
 * @return {?}
 */
Date._getParseRegExp = function(v, format) {
  if (!v._parseRegExp) {
    v._parseRegExp = {};
  } else {
    if (v._parseRegExp[format]) {
      return v._parseRegExp[format];
    }
  }
  var path = Date._expandFormat(v, format);
  path = path.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");
  var d = new Sys.StringBuilder("^");
  /** @type {!Array} */
  var groups = [];
  /** @type {number} */
  var i = 0;
  /** @type {number} */
  var resultString = 0;
  var PATH_NAME_MATCHER = Date._getTokenRegExp();
  var parts;
  for (; (parts = PATH_NAME_MATCHER.exec(path)) !== null;) {
    var day = path.slice(i, parts.index);
    i = PATH_NAME_MATCHER.lastIndex;
    resultString = resultString + Date._appendPreOrPostMatch(day, d);
    if (resultString % 2 === 1) {
      d.append(parts[0]);
      continue;
    }
    switch(parts[0]) {
      case "dddd":
      case "ddd":
      case "MMMM":
      case "MMM":
      case "gg":
      case "g":
        d.append("(\\D+)");
        break;
      case "tt":
      case "t":
        d.append("(\\D*)");
        break;
      case "yyyy":
        d.append("(\\d{4})");
        break;
      case "fff":
        d.append("(\\d{3})");
        break;
      case "ff":
        d.append("(\\d{2})");
        break;
      case "f":
        d.append("(\\d)");
        break;
      case "dd":
      case "d":
      case "MM":
      case "M":
      case "yy":
      case "y":
      case "HH":
      case "H":
      case "hh":
      case "h":
      case "mm":
      case "m":
      case "ss":
      case "s":
        d.append("(\\d\\d?)");
        break;
      case "zzz":
        d.append("([+-]?\\d\\d?:\\d{2})");
        break;
      case "zz":
      case "z":
        d.append("([+-]?\\d\\d?)");
        break;
      case "/":
        d.append("(\\" + v.DateSeparator + ")");
    }
    Array.add(groups, parts[0]);
  }
  Date._appendPreOrPostMatch(path.slice(i), d);
  d.append("$");
  var regexpStr = d.toString().replace(/\s+/g, "\\s+");
  var parseRegExp = {
    "regExp" : regexpStr,
    "groups" : groups
  };
  v._parseRegExp[format] = parseRegExp;
  return parseRegExp;
};
/**
 * @return {?}
 */
Date._getTokenRegExp = function() {
  return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};
/**
 * @param {undefined} value
 * @return {?}
 */
Date.parseLocale = function(value) {
  return Date._parse(value, Sys.CultureInfo.CurrentCulture, arguments);
};
/**
 * @param {undefined} value
 * @return {?}
 */
Date.parseInvariant = function(value) {
  return Date._parse(value, Sys.CultureInfo.InvariantCulture, arguments);
};
/**
 * @param {string} type
 * @param {?} args
 * @param {!Array} data
 * @return {?}
 */
Date._parse = function(type, args, data) {
  var i;
  var l;
  var ret;
  var y;
  var set;
  /** @type {boolean} */
  var g = false;
  /** @type {number} */
  i = 1;
  l = data.length;
  for (; i < l; i++) {
    y = data[i];
    if (y) {
      /** @type {boolean} */
      g = true;
      ret = Date._parseExact(type, y, args);
      if (ret) {
        return ret;
      }
    }
  }
  if (!g) {
    set = args._getDateTimeFormats();
    /** @type {number} */
    i = 0;
    l = set.length;
    for (; i < l; i++) {
      ret = Date._parseExact(type, set[i], args);
      if (ret) {
        return ret;
      }
    }
  }
  return null;
};
/**
 * @param {string} name
 * @param {string} m
 * @param {?} data
 * @return {?}
 */
Date._parseExact = function(name, m, data) {
  name = name.trim();
  var val = data.dateTimeFormat;
  var query = Date._getParseRegExp(val, m);
  /** @type {(Array<string>|null)} */
  var defs = (new RegExp(query.regExp)).exec(name);
  if (defs === null) {
    return null;
  }
  var parts = query.groups;
  /** @type {null} */
  var rotation = null;
  /** @type {null} */
  var year = null;
  /** @type {null} */
  var month = null;
  /** @type {null} */
  var date = null;
  /** @type {null} */
  var value = null;
  /** @type {number} */
  var x = 0;
  var h;
  /** @type {number} */
  var min = 0;
  /** @type {number} */
  var s = 0;
  /** @type {number} */
  var e = 0;
  /** @type {null} */
  var gradientBoxHeight = null;
  /** @type {boolean} */
  var isMainDimDefined = false;
  /** @type {number} */
  var i = 0;
  var parts_length = parts.length;
  for (; i < parts_length; i++) {
    /** @type {string} */
    var d = defs[i + 1];
    if (d) {
      switch(parts[i]) {
        case "dd":
        case "d":
          /** @type {number} */
          date = parseInt(d, 10);
          if (date < 1 || date > 31) {
            return null;
          }
          break;
        case "MMMM":
          month = data._getMonthIndex(d);
          if (month < 0 || month > 11) {
            return null;
          }
          break;
        case "MMM":
          month = data._getAbbrMonthIndex(d);
          if (month < 0 || month > 11) {
            return null;
          }
          break;
        case "M":
        case "MM":
          /** @type {number} */
          month = parseInt(d, 10) - 1;
          if (month < 0 || month > 11) {
            return null;
          }
          break;
        case "y":
        case "yy":
          year = Date._expandYear(val, parseInt(d, 10));
          if (year < 0 || year > 9999) {
            return null;
          }
          break;
        case "yyyy":
          /** @type {number} */
          year = parseInt(d, 10);
          if (year < 0 || year > 9999) {
            return null;
          }
          break;
        case "h":
        case "hh":
          /** @type {number} */
          x = parseInt(d, 10);
          if (x === 12) {
            /** @type {number} */
            x = 0;
          }
          if (x < 0 || x > 11) {
            return null;
          }
          break;
        case "H":
        case "HH":
          /** @type {number} */
          x = parseInt(d, 10);
          if (x < 0 || x > 23) {
            return null;
          }
          break;
        case "m":
        case "mm":
          /** @type {number} */
          min = parseInt(d, 10);
          if (min < 0 || min > 59) {
            return null;
          }
          break;
        case "s":
        case "ss":
          /** @type {number} */
          s = parseInt(d, 10);
          if (s < 0 || s > 59) {
            return null;
          }
          break;
        case "tt":
        case "t":
          /** @type {string} */
          var justifyContent = d.toUpperCase();
          /** @type {boolean} */
          isMainDimDefined = justifyContent === val.PMDesignator.toUpperCase();
          if (!isMainDimDefined && justifyContent !== val.AMDesignator.toUpperCase()) {
            return null;
          }
          break;
        case "f":
          /** @type {number} */
          e = parseInt(d, 10) * 100;
          if (e < 0 || e > 999) {
            return null;
          }
          break;
        case "ff":
          /** @type {number} */
          e = parseInt(d, 10) * 10;
          if (e < 0 || e > 999) {
            return null;
          }
          break;
        case "fff":
          /** @type {number} */
          e = parseInt(d, 10);
          if (e < 0 || e > 999) {
            return null;
          }
          break;
        case "dddd":
          value = data._getDayIndex(d);
          if (value < 0 || value > 6) {
            return null;
          }
          break;
        case "ddd":
          value = data._getAbbrDayIndex(d);
          if (value < 0 || value > 6) {
            return null;
          }
          break;
        case "zzz":
          /** @type {!Array<string>} */
          var enmlHash = d.split(/:/);
          if (enmlHash.length !== 2) {
            return null;
          }
          /** @type {number} */
          h = parseInt(enmlHash[0], 10);
          if (h < -12 || h > 13) {
            return null;
          }
          /** @type {number} */
          var m = parseInt(enmlHash[1], 10);
          if (m < 0 || m > 59) {
            return null;
          }
          /** @type {number} */
          gradientBoxHeight = h * 60 + (d.startsWith("-") ? -m : m);
          break;
        case "z":
        case "zz":
          /** @type {number} */
          h = parseInt(d, 10);
          if (h < -12 || h > 13) {
            return null;
          }
          /** @type {number} */
          gradientBoxHeight = h * 60;
          break;
        case "g":
        case "gg":
          /** @type {string} */
          var htmldata = d;
          if (!htmldata || !val.eras) {
            return null;
          }
          /** @type {string} */
          htmldata = htmldata.toLowerCase().trim();
          /** @type {number} */
          var rot = 0;
          var max = val.eras.length;
          for (; rot < max; rot = rot + 4) {
            if (htmldata === val.eras[rot + 1].toLowerCase()) {
              /** @type {number} */
              rotation = rot;
              break;
            }
          }
          if (rotation === null) {
            return null;
          }
      }
    }
  }
  /** @type {!Date} */
  var result = new Date;
  var option;
  var convert = val.Calendar.convert;
  if (convert) {
    option = convert.fromGregorian(result)[0];
  } else {
    /** @type {number} */
    option = result.getFullYear();
  }
  if (year === null) {
    year = option;
  } else {
    if (val.eras) {
      year = year + val.eras[(rotation || 0) + 3];
    }
  }
  if (month === null) {
    /** @type {number} */
    month = 0;
  }
  if (date === null) {
    /** @type {number} */
    date = 1;
  }
  if (convert) {
    result = convert.toGregorian(year, month, date);
    if (result === null) {
      return null;
    }
  } else {
    result.setFullYear(year, month, date);
    if (result.getDate() !== date) {
      return null;
    }
    if (value !== null && result.getDay() !== value) {
      return null;
    }
  }
  if (isMainDimDefined && x < 12) {
    /** @type {number} */
    x = x + 12;
  }
  result.setHours(x, min, s, e);
  if (gradientBoxHeight !== null) {
    /** @type {number} */
    var adjustedMin = result.getMinutes() - (gradientBoxHeight + result.getTimezoneOffset());
    result.setHours(result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60);
  }
  return result;
};
/**
 * @param {string} N
 * @return {?}
 */
Date.prototype.format = function(N) {
  return this._toFormattedString(N, Sys.CultureInfo.InvariantCulture);
};
/**
 * @param {string} format
 * @return {?}
 */
Date.prototype.localeFormat = function(format) {
  return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
};
/**
 * @param {string} format
 * @param {!Function} data
 * @return {?}
 */
Date.prototype._toFormattedString = function(format, data) {
  /**
   * @param {number} n
   * @return {?}
   */
  function pad(n) {
    if (n < 10) {
      return "0" + n;
    }
    return n.toString();
  }
  /**
   * @param {number} errorText
   * @return {?}
   */
  function encode(errorText) {
    if (errorText < 10) {
      return "00" + errorText;
    }
    if (errorText < 100) {
      return "0" + errorText;
    }
    return errorText.toString();
  }
  /**
   * @param {number} stats
   * @return {?}
   */
  function get_stats_box(stats) {
    if (stats < 10) {
      return "000" + stats;
    } else {
      if (stats < 100) {
        return "00" + stats;
      } else {
        if (stats < 1000) {
          return "0" + stats;
        }
      }
    }
    return stats.toString();
  }
  /**
   * @return {?}
   */
  function matchBrowserName() {
    if (inputWin || winRef) {
      return inputWin;
    }
    /** @type {boolean} */
    inputWin = localFormattingTokens.test(format);
    /** @type {boolean} */
    winRef = true;
    return inputWin;
  }
  var value = data.dateTimeFormat;
  var convert = value.Calendar.convert;
  if (!format || !format.length || format === "i") {
    if (data && data.name.length) {
      if (convert) {
        return this._toFormattedString(value.FullDateTimePattern, data);
      } else {
        /** @type {!Date} */
        var eraDate = new Date(this.getTime());
        var era = Date._getEra(this, value.eras);
        eraDate.setFullYear(Date._getEraYear(this, value, era));
        return eraDate.toLocaleString();
      }
    } else {
      return this.toString();
    }
  }
  var date = value.eras;
  /** @type {boolean} */
  var sortable = format === "s";
  format = Date._expandFormat(value, format);
  var result = new Sys.StringBuilder;
  var n;
  var inputWin;
  var winRef;
  /** @type {!RegExp} */
  var localFormattingTokens = /([^d]|^)(d|dd)([^d]|$)/g;
  /** @type {number} */
  var html = 0;
  var patternParts = Date._getTokenRegExp();
  var converted;
  if (!sortable && convert) {
    converted = convert.fromGregorian(this);
  }
  for (; true;) {
    /**
     * @param {!Object} value
     * @param {number} i
     * @return {?}
     */
    var getPart = function(value, i) {
      if (converted) {
        return converted[i];
      }
      switch(i) {
        case 0:
          return value.getFullYear();
        case 1:
          return value.getMonth();
        case 2:
          return value.getDate();
      }
    };
    var index = patternParts.lastIndex;
    var match = patternParts.exec(format);
    var val = format.slice(index, match ? match.index : format.length);
    html = html + Date._appendPreOrPostMatch(val, result);
    if (!match) {
      break;
    }
    if (html % 2 === 1) {
      result.append(match[0]);
      continue;
    }
    switch(match[0]) {
      case "dddd":
        result.append(value.DayNames[this.getDay()]);
        break;
      case "ddd":
        result.append(value.AbbreviatedDayNames[this.getDay()]);
        break;
      case "dd":
        /** @type {boolean} */
        inputWin = true;
        result.append(pad(getPart(this, 2)));
        break;
      case "d":
        /** @type {boolean} */
        inputWin = true;
        result.append(getPart(this, 2));
        break;
      case "MMMM":
        result.append(value.MonthGenitiveNames && matchBrowserName() ? value.MonthGenitiveNames[getPart(this, 1)] : value.MonthNames[getPart(this, 1)]);
        break;
      case "MMM":
        result.append(value.AbbreviatedMonthGenitiveNames && matchBrowserName() ? value.AbbreviatedMonthGenitiveNames[getPart(this, 1)] : value.AbbreviatedMonthNames[getPart(this, 1)]);
        break;
      case "MM":
        result.append(pad(getPart(this, 1) + 1));
        break;
      case "M":
        result.append(getPart(this, 1) + 1);
        break;
      case "yyyy":
        result.append(get_stats_box(converted ? converted[0] : Date._getEraYear(this, value, Date._getEra(this, date), sortable)));
        break;
      case "yy":
        result.append(pad((converted ? converted[0] : Date._getEraYear(this, value, Date._getEra(this, date), sortable)) % 100));
        break;
      case "y":
        result.append((converted ? converted[0] : Date._getEraYear(this, value, Date._getEra(this, date), sortable)) % 100);
        break;
      case "hh":
        /** @type {number} */
        n = this.getHours() % 12;
        if (n === 0) {
          /** @type {number} */
          n = 12;
        }
        result.append(pad(n));
        break;
      case "h":
        /** @type {number} */
        n = this.getHours() % 12;
        if (n === 0) {
          /** @type {number} */
          n = 12;
        }
        result.append(n);
        break;
      case "HH":
        result.append(pad(this.getHours()));
        break;
      case "H":
        result.append(this.getHours());
        break;
      case "mm":
        result.append(pad(this.getMinutes()));
        break;
      case "m":
        result.append(this.getMinutes());
        break;
      case "ss":
        result.append(pad(this.getSeconds()));
        break;
      case "s":
        result.append(this.getSeconds());
        break;
      case "tt":
        result.append(this.getHours() < 12 ? value.AMDesignator : value.PMDesignator);
        break;
      case "t":
        result.append((this.getHours() < 12 ? value.AMDesignator : value.PMDesignator).charAt(0));
        break;
      case "f":
        result.append(encode(this.getMilliseconds()).charAt(0));
        break;
      case "ff":
        result.append(encode(this.getMilliseconds()).substr(0, 2));
        break;
      case "fff":
        result.append(encode(this.getMilliseconds()));
        break;
      case "z":
        /** @type {number} */
        n = this.getTimezoneOffset() / 60;
        result.append((n <= 0 ? "+" : "-") + Math.floor(Math.abs(n)));
        break;
      case "zz":
        /** @type {number} */
        n = this.getTimezoneOffset() / 60;
        result.append((n <= 0 ? "+" : "-") + pad(Math.floor(Math.abs(n))));
        break;
      case "zzz":
        /** @type {number} */
        n = this.getTimezoneOffset() / 60;
        result.append((n <= 0 ? "+" : "-") + pad(Math.floor(Math.abs(n))) + ":" + pad(Math.abs(this.getTimezoneOffset() % 60)));
        break;
      case "g":
      case "gg":
        if (value.eras) {
          result.append(value.eras[Date._getEra(this, date) + 1]);
        }
        break;
      case "/":
        result.append(value.DateSeparator);
    }
  }
  return result.toString();
};
/**
 * @return {?}
 */
String.localeFormat = function() {
  return String._toFormattedString(true, arguments);
};
/**
 * @param {undefined} value
 * @return {?}
 */
Number.parseLocale = function(value) {
  return Number._parse(value, Sys.CultureInfo.CurrentCulture);
};
/**
 * @param {undefined} value
 * @return {?}
 */
Number.parseInvariant = function(value) {
  return Number._parse(value, Sys.CultureInfo.InvariantCulture);
};
/**
 * @param {string} s
 * @param {?} data
 * @return {?}
 */
Number._parse = function(s, data) {
  s = s.trim();
  if (s.match(/^[+-]?infinity$/i)) {
    return parseFloat(s);
  }
  if (s.match(/^0x[a-f0-9]+$/i)) {
    return parseInt(s);
  }
  var value = data.numberFormat;
  var m = Number._parseNumberNegativePattern(s, value, value.NumberNegativePattern);
  var str = m[0];
  var num = m[1];
  if (str === "" && value.NumberNegativePattern !== 1) {
    m = Number._parseNumberNegativePattern(s, value, 1);
    str = m[0];
    num = m[1];
  }
  if (str === "") {
    /** @type {string} */
    str = "+";
  }
  var index;
  var intAndFraction;
  var exponentPos = num.indexOf("e");
  if (exponentPos < 0) {
    exponentPos = num.indexOf("E");
  }
  if (exponentPos < 0) {
    intAndFraction = num;
    /** @type {null} */
    index = null;
  } else {
    intAndFraction = num.substr(0, exponentPos);
    index = num.substr(exponentPos + 1);
  }
  var integer;
  var T000000;
  var decimalPos = intAndFraction.indexOf(value.NumberDecimalSeparator);
  if (decimalPos < 0) {
    integer = intAndFraction;
    /** @type {null} */
    T000000 = null;
  } else {
    integer = intAndFraction.substr(0, decimalPos);
    T000000 = intAndFraction.substr(decimalPos + value.NumberDecimalSeparator.length);
  }
  integer = integer.split(value.NumberGroupSeparator).join("");
  var groupSep = value.NumberGroupSeparator.replace(/\u00A0/g, " ");
  if (value.NumberGroupSeparator !== groupSep) {
    integer = integer.split(groupSep).join("");
  }
  var result = str + integer;
  if (T000000 !== null) {
    /** @type {string} */
    result = result + ("." + T000000);
  }
  if (index !== null) {
    var pair = Number._parseNumberNegativePattern(index, value, 1);
    if (pair[0] === "") {
      /** @type {string} */
      pair[0] = "+";
    }
    result = result + ("e" + pair[0] + pair[1]);
  }
  if (result.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) {
    return parseFloat(result);
  }
  return Number.NaN;
};
/**
 * @param {string} p
 * @param {?} f
 * @param {number} forceClassBase
 * @return {?}
 */
Number._parseNumberNegativePattern = function(p, f, forceClassBase) {
  var c = f.NegativeSign;
  var s = f.PositiveSign;
  switch(forceClassBase) {
    case 4:
      /** @type {string} */
      c = " " + c;
      /** @type {string} */
      s = " " + s;
    case 3:
      if (p.endsWith(c)) {
        return ["-", p.substr(0, p.length - c.length)];
      } else {
        if (p.endsWith(s)) {
          return ["+", p.substr(0, p.length - s.length)];
        }
      }
      break;
    case 2:
      /** @type {string} */
      c = c + " ";
      /** @type {string} */
      s = s + " ";
    case 1:
      if (p.startsWith(c)) {
        return ["-", p.substr(c.length)];
      } else {
        if (p.startsWith(s)) {
          return ["+", p.substr(s.length)];
        }
      }
      break;
    case 0:
      if (p.startsWith("(") && p.endsWith(")")) {
        return ["-", p.substr(1, p.length - 2)];
      }
  }
  return ["", p];
};
/**
 * @param {string} N
 * @return {?}
 * @this {!Number}
 */
Number.prototype.format = function(N) {
  return this._toFormattedString(N, Sys.CultureInfo.InvariantCulture);
};
/**
 * @param {string} format
 * @return {?}
 * @this {!Number}
 */
Number.prototype.localeFormat = function(format) {
  return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
};
/**
 * @param {string} type
 * @param {?} props
 * @return {?}
 * @this {!Number}
 */
Number.prototype._toFormattedString = function(type, props) {
  /**
   * @param {string} num
   * @param {number} x
   * @param {string} utc
   * @return {?}
   */
  function zeroPad(num, x, utc) {
    var length = num.length;
    for (; length < x; length++) {
      /** @type {string} */
      num = utc ? "0" + num : num + "0";
    }
    return num;
  }
  /**
   * @param {number} n2
   * @param {number} precision
   * @param {!Array} data
   * @param {?} prefix
   * @param {string} value
   * @return {?}
   */
  function formatNumber(n2, precision, data, prefix, value) {
    var curSize = data[0];
    /** @type {number} */
    var byteIndex = 1;
    /** @type {number} */
    var multiplier = Math.pow(10, precision);
    /** @type {number} */
    var n1 = Math.round(n2 * multiplier) / multiplier;
    if (!isFinite(n1)) {
      /** @type {number} */
      n1 = n2;
    }
    n2 = n1;
    var numberString = n2.toString();
    /** @type {string} */
    var right = "";
    var exponent;
    var split = numberString.split(/e/i);
    numberString = split[0];
    /** @type {number} */
    exponent = split.length > 1 ? parseInt(split[1]) : 0;
    split = numberString.split(".");
    numberString = split[0];
    right = split.length > 1 ? split[1] : "";
    var q;
    if (exponent > 0) {
      right = zeroPad(right, exponent, false);
      numberString = numberString + right.slice(0, exponent);
      right = right.substr(exponent);
    } else {
      if (exponent < 0) {
        /** @type {number} */
        exponent = -exponent;
        numberString = zeroPad(numberString, exponent + 1, true);
        right = numberString.slice(-exponent, numberString.length) + right;
        numberString = numberString.slice(0, -exponent);
      }
    }
    if (precision > 0) {
      if (right.length > precision) {
        right = right.slice(0, precision);
      } else {
        right = zeroPad(right, precision, false);
      }
      right = value + right;
    } else {
      /** @type {string} */
      right = "";
    }
    /** @type {number} */
    var stringIndex = numberString.length - 1;
    /** @type {string} */
    var s = "";
    for (; stringIndex >= 0;) {
      if (curSize === 0 || curSize > stringIndex) {
        if (s.length > 0) {
          return numberString.slice(0, stringIndex + 1) + prefix + s + right;
        } else {
          return numberString.slice(0, stringIndex + 1) + right;
        }
      }
      if (s.length > 0) {
        s = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + prefix + s;
      } else {
        s = numberString.slice(stringIndex - curSize + 1, stringIndex + 1);
      }
      /** @type {number} */
      stringIndex = stringIndex - curSize;
      if (byteIndex < data.length) {
        curSize = data[byteIndex];
        byteIndex++;
      }
    }
    return numberString.slice(0, stringIndex + 1) + prefix + s + right;
  }
  if (!type || type.length === 0 || type === "i") {
    if (props && props.name.length > 0) {
      return this.toLocaleString();
    } else {
      return this.toString();
    }
  }
  /** @type {!Array} */
  var series = ["n %", "n%", "%n"];
  /** @type {!Array} */
  var r = ["-n %", "-n%", "-%n"];
  /** @type {!Array} */
  var item = ["(n)", "-n", "- n", "n-", "n -"];
  /** @type {!Array} */
  var schema = ["$n", "n$", "$ n", "n $"];
  /** @type {!Array} */
  var m = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];
  var column = props.numberFormat;
  /** @type {number} */
  var number = Math.abs(this);
  if (!type) {
    /** @type {string} */
    type = "D";
  }
  /** @type {number} */
  var precision = -1;
  if (type.length > 1) {
    /** @type {number} */
    precision = parseInt(type.slice(1), 10);
  }
  var s;
  switch(type.charAt(0)) {
    case "d":
    case "D":
      /** @type {string} */
      s = "n";
      if (precision !== -1) {
        number = zeroPad("" + number, precision, true);
      }
      if (this < 0) {
        /** @type {number} */
        number = -number;
      }
      break;
    case "c":
    case "C":
      if (this < 0) {
        s = m[column.CurrencyNegativePattern];
      } else {
        s = schema[column.CurrencyPositivePattern];
      }
      if (precision === -1) {
        precision = column.CurrencyDecimalDigits;
      }
      number = formatNumber(Math.abs(this), precision, column.CurrencyGroupSizes, column.CurrencyGroupSeparator, column.CurrencyDecimalSeparator);
      break;
    case "n":
    case "N":
      if (this < 0) {
        s = item[column.NumberNegativePattern];
      } else {
        /** @type {string} */
        s = "n";
      }
      if (precision === -1) {
        precision = column.NumberDecimalDigits;
      }
      number = formatNumber(Math.abs(this), precision, column.NumberGroupSizes, column.NumberGroupSeparator, column.NumberDecimalSeparator);
      break;
    case "p":
    case "P":
      if (this < 0) {
        s = r[column.PercentNegativePattern];
      } else {
        s = series[column.PercentPositivePattern];
      }
      if (precision === -1) {
        precision = column.PercentDecimalDigits;
      }
      number = formatNumber(Math.abs(this) * 100, precision, column.PercentGroupSizes, column.PercentGroupSeparator, column.PercentDecimalSeparator);
      break;
    default:
      throw Error.format(Sys.Res.formatBadFormatSpecifier);
  }
  /** @type {!RegExp} */
  var reHostnameToken = /n|\$|-|%/g;
  /** @type {string} */
  var ret = "";
  for (; true;) {
    /** @type {number} */
    var i = reHostnameToken.lastIndex;
    /** @type {(Array<string>|null)} */
    var ar = reHostnameToken.exec(s);
    ret = ret + s.slice(i, ar ? ar.index : s.length);
    if (!ar) {
      break;
    }
    switch(ar[0]) {
      case "n":
        ret = ret + number;
        break;
      case "$":
        ret = ret + column.CurrencySymbol;
        break;
      case "-":
        if (/[1-9]/.test(number)) {
          ret = ret + column.NegativeSign;
        }
        break;
      case "%":
        ret = ret + column.PercentSymbol;
    }
  }
  return ret;
};
/**
 * @param {string} name
 * @param {!Function} numberFormat
 * @param {!Object} dateTimeFormat
 * @return {undefined}
 */
Sys.CultureInfo = function(name, numberFormat, dateTimeFormat) {
  /** @type {string} */
  this.name = name;
  /** @type {!Function} */
  this.numberFormat = numberFormat;
  /** @type {!Object} */
  this.dateTimeFormat = dateTimeFormat;
};
Sys.CultureInfo.prototype = {
  _getDateTimeFormats : function() {
    if (!this._dateTimeFormats) {
      var a = this.dateTimeFormat;
      /** @type {!Array} */
      this._dateTimeFormats = [a.MonthDayPattern, a.YearMonthPattern, a.ShortDatePattern, a.ShortTimePattern, a.LongDatePattern, a.LongTimePattern, a.FullDateTimePattern, a.RFC1123Pattern, a.SortableDateTimePattern, a.UniversalSortableDateTimePattern];
    }
    return this._dateTimeFormats;
  },
  _getIndex : function(value, item, key) {
    var b = this._toUpper(value);
    /** @type {number} */
    var p = Array.indexOf(item, b);
    if (p === -1) {
      /** @type {number} */
      p = Array.indexOf(key, b);
    }
    return p;
  },
  _getMonthIndex : function(key) {
    if (!this._upperMonths) {
      this._upperMonths = this._toUpperArray(this.dateTimeFormat.MonthNames);
      this._upperMonthsGenitive = this._toUpperArray(this.dateTimeFormat.MonthGenitiveNames);
    }
    return this._getIndex(key, this._upperMonths, this._upperMonthsGenitive);
  },
  _getAbbrMonthIndex : function(value) {
    if (!this._upperAbbrMonths) {
      this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames);
      this._upperAbbrMonthsGenitive = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthGenitiveNames);
    }
    return this._getIndex(value, this._upperAbbrMonths, this._upperAbbrMonthsGenitive);
  },
  _getDayIndex : function(value) {
    if (!this._upperDays) {
      this._upperDays = this._toUpperArray(this.dateTimeFormat.DayNames);
    }
    return Array.indexOf(this._upperDays, this._toUpper(value));
  },
  _getAbbrDayIndex : function(value) {
    if (!this._upperAbbrDays) {
      this._upperAbbrDays = this._toUpperArray(this.dateTimeFormat.AbbreviatedDayNames);
    }
    return Array.indexOf(this._upperAbbrDays, this._toUpper(value));
  },
  _toUpperArray : function(homonymsArray) {
    /** @type {!Array} */
    var unloadHandlers = [];
    /** @type {number} */
    var i = 0;
    var n = homonymsArray.length;
    for (; i < n; i++) {
      unloadHandlers[i] = this._toUpper(homonymsArray[i]);
    }
    return unloadHandlers;
  },
  _toUpper : function(qline) {
    return qline.split("\u00a0").join(" ").toUpperCase();
  }
};
Sys.CultureInfo.registerClass("Sys.CultureInfo");
/**
 * @param {?} data
 * @return {?}
 */
Sys.CultureInfo._parse = function(data) {
  var info = data.dateTimeFormat;
  if (info && !info.eras) {
    info.eras = data.eras;
  }
  return new Sys.CultureInfo(data.name, data.numberFormat, info);
};
Sys.CultureInfo.InvariantCulture = Sys.CultureInfo._parse({
  "name" : "",
  "numberFormat" : {
    "CurrencyDecimalDigits" : 2,
    "CurrencyDecimalSeparator" : ".",
    "IsReadOnly" : true,
    "CurrencyGroupSizes" : [3],
    "NumberGroupSizes" : [3],
    "PercentGroupSizes" : [3],
    "CurrencyGroupSeparator" : ",",
    "CurrencySymbol" : "\u00a4",
    "NaNSymbol" : "NaN",
    "CurrencyNegativePattern" : 0,
    "NumberNegativePattern" : 1,
    "PercentPositivePattern" : 0,
    "PercentNegativePattern" : 0,
    "NegativeInfinitySymbol" : "-Infinity",
    "NegativeSign" : "-",
    "NumberDecimalDigits" : 2,
    "NumberDecimalSeparator" : ".",
    "NumberGroupSeparator" : ",",
    "CurrencyPositivePattern" : 0,
    "PositiveInfinitySymbol" : "Infinity",
    "PositiveSign" : "+",
    "PercentDecimalDigits" : 2,
    "PercentDecimalSeparator" : ".",
    "PercentGroupSeparator" : ",",
    "PercentSymbol" : "%",
    "PerMilleSymbol" : "\u2030",
    "NativeDigits" : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    "DigitSubstitution" : 1
  },
  "dateTimeFormat" : {
    "AMDesignator" : "AM",
    "Calendar" : {
      "MinSupportedDateTime" : "@-62135568000000@",
      "MaxSupportedDateTime" : "@253402300799999@",
      "AlgorithmType" : 1,
      "CalendarType" : 1,
      "Eras" : [1],
      "TwoDigitYearMax" : 2029,
      "IsReadOnly" : true
    },
    "DateSeparator" : "/",
    "FirstDayOfWeek" : 0,
    "CalendarWeekRule" : 0,
    "FullDateTimePattern" : "dddd, dd MMMM yyyy HH:mm:ss",
    "LongDatePattern" : "dddd, dd MMMM yyyy",
    "LongTimePattern" : "HH:mm:ss",
    "MonthDayPattern" : "MMMM dd",
    "PMDesignator" : "PM",
    "RFC1123Pattern" : "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
    "ShortDatePattern" : "MM/dd/yyyy",
    "ShortTimePattern" : "HH:mm",
    "SortableDateTimePattern" : "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
    "TimeSeparator" : ":",
    "UniversalSortableDateTimePattern" : "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
    "YearMonthPattern" : "yyyy MMMM",
    "AbbreviatedDayNames" : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    "ShortestDayNames" : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    "DayNames" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "AbbreviatedMonthNames" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
    "MonthNames" : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
    "IsReadOnly" : true,
    "NativeCalendarName" : "Gregorian Calendar",
    "AbbreviatedMonthGenitiveNames" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
    "MonthGenitiveNames" : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""]
  },
  "eras" : [1, "A.D.", null, 0]
});
if (typeof __cultureInfo === "object") {
  Sys.CultureInfo.CurrentCulture = Sys.CultureInfo._parse(__cultureInfo);
  delete __cultureInfo;
} else {
  Sys.CultureInfo.CurrentCulture = Sys.CultureInfo._parse({
    "name" : "en-US",
    "numberFormat" : {
      "CurrencyDecimalDigits" : 2,
      "CurrencyDecimalSeparator" : ".",
      "IsReadOnly" : false,
      "CurrencyGroupSizes" : [3],
      "NumberGroupSizes" : [3],
      "PercentGroupSizes" : [3],
      "CurrencyGroupSeparator" : ",",
      "CurrencySymbol" : "$",
      "NaNSymbol" : "NaN",
      "CurrencyNegativePattern" : 0,
      "NumberNegativePattern" : 1,
      "PercentPositivePattern" : 0,
      "PercentNegativePattern" : 0,
      "NegativeInfinitySymbol" : "-Infinity",
      "NegativeSign" : "-",
      "NumberDecimalDigits" : 2,
      "NumberDecimalSeparator" : ".",
      "NumberGroupSeparator" : ",",
      "CurrencyPositivePattern" : 0,
      "PositiveInfinitySymbol" : "Infinity",
      "PositiveSign" : "+",
      "PercentDecimalDigits" : 2,
      "PercentDecimalSeparator" : ".",
      "PercentGroupSeparator" : ",",
      "PercentSymbol" : "%",
      "PerMilleSymbol" : "\u2030",
      "NativeDigits" : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      "DigitSubstitution" : 1
    },
    "dateTimeFormat" : {
      "AMDesignator" : "AM",
      "Calendar" : {
        "MinSupportedDateTime" : "@-62135568000000@",
        "MaxSupportedDateTime" : "@253402300799999@",
        "AlgorithmType" : 1,
        "CalendarType" : 1,
        "Eras" : [1],
        "TwoDigitYearMax" : 2029,
        "IsReadOnly" : false
      },
      "DateSeparator" : "/",
      "FirstDayOfWeek" : 0,
      "CalendarWeekRule" : 0,
      "FullDateTimePattern" : "dddd, MMMM dd, yyyy h:mm:ss tt",
      "LongDatePattern" : "dddd, MMMM dd, yyyy",
      "LongTimePattern" : "h:mm:ss tt",
      "MonthDayPattern" : "MMMM dd",
      "PMDesignator" : "PM",
      "RFC1123Pattern" : "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
      "ShortDatePattern" : "M/d/yyyy",
      "ShortTimePattern" : "h:mm tt",
      "SortableDateTimePattern" : "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
      "TimeSeparator" : ":",
      "UniversalSortableDateTimePattern" : "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
      "YearMonthPattern" : "MMMM, yyyy",
      "AbbreviatedDayNames" : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "ShortestDayNames" : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      "DayNames" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "AbbreviatedMonthNames" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
      "MonthNames" : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
      "IsReadOnly" : false,
      "NativeCalendarName" : "Gregorian Calendar",
      "AbbreviatedMonthGenitiveNames" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
      "MonthGenitiveNames" : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""]
    },
    "eras" : [1, "A.D.", null, 0]
  });
}
Type.registerNamespace("Sys.Serialization");
/**
 * @return {undefined}
 */
Sys.Serialization.JavaScriptSerializer = function() {
};
Sys.Serialization.JavaScriptSerializer.registerClass("Sys.Serialization.JavaScriptSerializer");
/** @type {!Array} */
Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs = [];
/** @type {!Array} */
Sys.Serialization.JavaScriptSerializer._charsToEscape = [];
/** @type {!RegExp} */
Sys.Serialization.JavaScriptSerializer._dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', "g");
Sys.Serialization.JavaScriptSerializer._escapeChars = {};
/** @type {!RegExp} */
Sys.Serialization.JavaScriptSerializer._escapeRegEx = new RegExp('["\\\\\\x00-\\x1F]', "i");
/** @type {!RegExp} */
Sys.Serialization.JavaScriptSerializer._escapeRegExGlobal = new RegExp('["\\\\\\x00-\\x1F]', "g");
/** @type {!RegExp} */
Sys.Serialization.JavaScriptSerializer._jsonRegEx = new RegExp("[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]", "g");
/** @type {!RegExp} */
Sys.Serialization.JavaScriptSerializer._jsonStringRegEx = new RegExp('"(\\\\.|[^"\\\\])*"', "g");
/** @type {string} */
Sys.Serialization.JavaScriptSerializer._serverTypeFieldName = "__type";
/**
 * @return {undefined}
 */
Sys.Serialization.JavaScriptSerializer._init = function() {
  /** @type {!Array} */
  var __WEBPACK_IMPORTED_MODULE_0__components_header__ = ["\\u0000", "\\u0001", "\\u0002", "\\u0003", "\\u0004", "\\u0005", "\\u0006", "\\u0007", "\\b", "\\t", "\\n", "\\u000b", "\\f", "\\r", "\\u000e", "\\u000f", "\\u0010", "\\u0011", "\\u0012", "\\u0013", "\\u0014", "\\u0015", "\\u0016", "\\u0017", "\\u0018", "\\u0019", "\\u001a", "\\u001b", "\\u001c", "\\u001d", "\\u001e", "\\u001f"];
  /** @type {string} */
  Sys.Serialization.JavaScriptSerializer._charsToEscape[0] = "\\";
  /** @type {!RegExp} */
  Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs["\\"] = new RegExp("\\\\", "g");
  /** @type {string} */
  Sys.Serialization.JavaScriptSerializer._escapeChars["\\"] = "\\\\";
  /** @type {string} */
  Sys.Serialization.JavaScriptSerializer._charsToEscape[1] = '"';
  /** @type {!RegExp} */
  Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs['"'] = new RegExp('"', "g");
  /** @type {string} */
  Sys.Serialization.JavaScriptSerializer._escapeChars['"'] = '\\"';
  /** @type {number} */
  var a = 0;
  for (; a < 32; a++) {
    /** @type {string} */
    var i = String.fromCharCode(a);
    /** @type {string} */
    Sys.Serialization.JavaScriptSerializer._charsToEscape[a + 2] = i;
    /** @type {!RegExp} */
    Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs[i] = new RegExp(i, "g");
    Sys.Serialization.JavaScriptSerializer._escapeChars[i] = __WEBPACK_IMPORTED_MODULE_0__components_header__[a];
  }
};
/**
 * @param {!Object} data
 * @param {?} instance
 * @return {undefined}
 */
Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder = function(data, instance) {
  instance.append(data.toString());
};
/**
 * @param {!Object} b
 * @param {?} a
 * @return {undefined}
 */
Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder = function(b, a) {
  if (isFinite(b)) {
    a.append(String(b));
  } else {
    throw Error.invalidOperation(Sys.Res.cannotSerializeNonFiniteNumbers);
  }
};
/**
 * @param {string} s
 * @param {?} o
 * @return {undefined}
 */
Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder = function(s, o) {
  o.append('"');
  if (Sys.Serialization.JavaScriptSerializer._escapeRegEx.test(s)) {
    if (Sys.Serialization.JavaScriptSerializer._charsToEscape.length === 0) {
      Sys.Serialization.JavaScriptSerializer._init();
    }
    if (s.length < 128) {
      s = s.replace(Sys.Serialization.JavaScriptSerializer._escapeRegExGlobal, function(ballNumber) {
        return Sys.Serialization.JavaScriptSerializer._escapeChars[ballNumber];
      });
    } else {
      /** @type {number} */
      var iccId = 0;
      for (; iccId < 34; iccId++) {
        var i = Sys.Serialization.JavaScriptSerializer._charsToEscape[iccId];
        if (s.indexOf(i) !== -1) {
          if (Sys.Browser.agent === Sys.Browser.Opera || Sys.Browser.agent === Sys.Browser.FireFox) {
            s = s.split(i).join(Sys.Serialization.JavaScriptSerializer._escapeChars[i]);
          } else {
            s = s.replace(Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs[i], Sys.Serialization.JavaScriptSerializer._escapeChars[i]);
          }
        }
      }
    }
  }
  o.append(s);
  o.append('"');
};
/**
 * @param {!Object} value
 * @param {?} obj
 * @param {string} i
 * @param {?} forceOptional
 * @return {undefined}
 */
Sys.Serialization.JavaScriptSerializer._serializeWithBuilder = function(value, obj, i, forceOptional) {
  var j;
  switch(typeof value) {
    case "object":
      if (value) {
        if (Number.isInstanceOfType(value)) {
          Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder(value, obj);
        } else {
          if (Boolean.isInstanceOfType(value)) {
            Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder(value, obj);
          } else {
            if (String.isInstanceOfType(value)) {
              Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder(value, obj);
            } else {
              if (Array.isInstanceOfType(value)) {
                obj.append("[");
                /** @type {number} */
                j = 0;
                for (; j < value.length; ++j) {
                  if (j > 0) {
                    obj.append(",");
                  }
                  Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(value[j], obj, false, forceOptional);
                }
                obj.append("]");
              } else {
                if (Date.isInstanceOfType(value)) {
                  obj.append('"\\/Date(');
                  obj.append(value.getTime());
                  obj.append(')\\/"');
                  break;
                }
                /** @type {!Array} */
                var keys = [];
                /** @type {number} */
                var len = 0;
                var k;
                for (k in value) {
                  if (k.startsWith("$")) {
                    continue;
                  }
                  if (k === Sys.Serialization.JavaScriptSerializer._serverTypeFieldName && len !== 0) {
                    keys[len++] = keys[0];
                    /** @type {string} */
                    keys[0] = k;
                  } else {
                    /** @type {string} */
                    keys[len++] = k;
                  }
                }
                if (i) {
                  keys.sort();
                }
                obj.append("{");
                /** @type {boolean} */
                var x = false;
                /** @type {number} */
                j = 0;
                for (; j < len; j++) {
                  var parameters = value[keys[j]];
                  if (typeof parameters !== "undefined" && typeof parameters !== "function") {
                    if (x) {
                      obj.append(",");
                    } else {
                      /** @type {boolean} */
                      x = true;
                    }
                    Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(keys[j], obj, i, forceOptional);
                    obj.append(":");
                    Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(parameters, obj, i, forceOptional);
                  }
                }
                obj.append("}");
              }
            }
          }
        }
      } else {
        obj.append("null");
      }
      break;
    case "number":
      Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder(value, obj);
      break;
    case "string":
      Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder(value, obj);
      break;
    case "boolean":
      Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder(value, obj);
      break;
    default:
      obj.append("null");
  }
};
/**
 * @param {!Object} type
 * @return {?}
 */
Sys.Serialization.JavaScriptSerializer.serialize = function(type) {
  var a = new Sys.StringBuilder;
  Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(type, a, false);
  return a.toString();
};
/**
 * @param {string} data$jscomp$32
 * @param {boolean} secure$jscomp$0
 * @return {?}
 */
Sys.Serialization.JavaScriptSerializer.deserialize = function(data$jscomp$32, secure$jscomp$0) {
  if (data$jscomp$32.length === 0) {
    throw Error.argument("data", Sys.Res.cannotDeserializeEmptyString);
  }
  try {
    var exp$jscomp$0 = data$jscomp$32.replace(Sys.Serialization.JavaScriptSerializer._dateRegEx, "$1new Date($2)");
    if (secure$jscomp$0 && Sys.Serialization.JavaScriptSerializer._jsonRegEx.test(exp$jscomp$0.replace(Sys.Serialization.JavaScriptSerializer._jsonStringRegEx, ""))) {
      throw null;
    }
    return eval("(" + exp$jscomp$0 + ")");
  } catch (a) {
    throw Error.argument("data", Sys.Res.cannotDeserializeInvalidJson);
  }
};
Type.registerNamespace("Sys.UI");
/**
 * @return {undefined}
 */
Sys.EventHandlerList = function() {
  this._list = {};
};
Sys.EventHandlerList.prototype = {
  _addHandler : function(name, callback) {
    Array.add(this._getEvent(name, true), callback);
  },
  addHandler : function(type, callback) {
    this._addHandler(type, callback);
  },
  _removeHandler : function(e, id) {
    var evt = this._getEvent(e);
    if (!evt) {
      return;
    }
    Array.remove(evt, id);
  },
  removeHandler : function(name, callback) {
    this._removeHandler(name, callback);
  },
  getHandler : function(name) {
    var a = this._getEvent(name);
    if (!a || a.length === 0) {
      return null;
    }
    a = Array.clone(a);
    return function(e, xhr) {
      /** @type {number} */
      var j = 0;
      var startLen = a.length;
      for (; j < startLen; j++) {
        a[j](e, xhr);
      }
    };
  },
  _getEvent : function(eventName, create) {
    if (!this._list[eventName]) {
      if (!create) {
        return null;
      }
      /** @type {!Array} */
      this._list[eventName] = [];
    }
    return this._list[eventName];
  }
};
Sys.EventHandlerList.registerClass("Sys.EventHandlerList");
/**
 * @param {?} commandName
 * @param {?} enableHooks
 * @param {?} callback
 * @return {undefined}
 */
Sys.CommandEventArgs = function(commandName, enableHooks, callback) {
  Sys.CommandEventArgs.initializeBase(this);
  this._commandName = commandName;
  this._commandArgument = enableHooks;
  this._commandSource = callback;
};
Sys.CommandEventArgs.prototype = {
  _commandName : null,
  _commandArgument : null,
  _commandSource : null,
  get_commandName : function() {
    return this._commandName;
  },
  get_commandArgument : function() {
    return this._commandArgument;
  },
  get_commandSource : function() {
    return this._commandSource;
  }
};
Sys.CommandEventArgs.registerClass("Sys.CommandEventArgs", Sys.CancelEventArgs);
/**
 * @return {undefined}
 */
Sys.INotifyPropertyChange = function() {
};
Sys.INotifyPropertyChange.prototype = {};
Sys.INotifyPropertyChange.registerInterface("Sys.INotifyPropertyChange");
/**
 * @param {string} s
 * @return {undefined}
 */
Sys.PropertyChangedEventArgs = function(s) {
  Sys.PropertyChangedEventArgs.initializeBase(this);
  /** @type {string} */
  this._propertyName = s;
};
Sys.PropertyChangedEventArgs.prototype = {
  get_propertyName : function() {
    return this._propertyName;
  }
};
Sys.PropertyChangedEventArgs.registerClass("Sys.PropertyChangedEventArgs", Sys.EventArgs);
/**
 * @return {undefined}
 */
Sys.INotifyDisposing = function() {
};
Sys.INotifyDisposing.prototype = {};
Sys.INotifyDisposing.registerInterface("Sys.INotifyDisposing");
/**
 * @return {undefined}
 */
Sys.Component = function() {
  if (Sys.Application) {
    Sys.Application.registerDisposableObject(this);
  }
};
Sys.Component.prototype = {
  _id : null,
  _initialized : false,
  _updating : false,
  get_events : function() {
    if (!this._events) {
      this._events = new Sys.EventHandlerList;
    }
    return this._events;
  },
  get_id : function() {
    return this._id;
  },
  set_id : function(id) {
    /** @type {string} */
    this._id = id;
  },
  get_isInitialized : function() {
    return this._initialized;
  },
  get_isUpdating : function() {
    return this._updating;
  },
  add_disposing : function(type) {
    this.get_events().addHandler("disposing", type);
  },
  remove_disposing : function(fn) {
    this.get_events().removeHandler("disposing", fn);
  },
  add_propertyChanged : function(handler) {
    this.get_events().addHandler("propertyChanged", handler);
  },
  remove_propertyChanged : function(handler) {
    this.get_events().removeHandler("propertyChanged", handler);
  },
  beginUpdate : function() {
    /** @type {boolean} */
    this._updating = true;
  },
  dispose : function() {
    if (this._events) {
      var handler = this._events.getHandler("disposing");
      if (handler) {
        handler(this, Sys.EventArgs.Empty);
      }
    }
    delete this._events;
    Sys.Application.unregisterDisposableObject(this);
    Sys.Application.removeComponent(this);
  },
  endUpdate : function() {
    /** @type {boolean} */
    this._updating = false;
    if (!this._initialized) {
      this.initialize();
    }
    this.updated();
  },
  initialize : function() {
    /** @type {boolean} */
    this._initialized = true;
  },
  raisePropertyChanged : function(name) {
    if (!this._events) {
      return;
    }
    var propertyChanged = this._events.getHandler("propertyChanged");
    if (propertyChanged) {
      propertyChanged(this, new Sys.PropertyChangedEventArgs(name));
    }
  },
  updated : function() {
  }
};
Sys.Component.registerClass("Sys.Component", null, Sys.IDisposable, Sys.INotifyPropertyChange, Sys.INotifyDisposing);
/**
 * @param {!Object} obj
 * @param {!Object} wrapper
 * @return {undefined}
 */
function Sys$Component$_setProperties(obj, wrapper) {
  var result;
  var type = Object.getType(obj);
  /** @type {boolean} */
  var privacyCheckRequired = type === Object || type === Sys.UI.DomElement;
  var h = Sys.Component.isInstanceOfType(obj) && !obj.get_isUpdating();
  if (h) {
    obj.beginUpdate();
  }
  var key;
  for (key in wrapper) {
    var value = wrapper[key];
    var f = privacyCheckRequired ? null : obj["get_" + key];
    if (privacyCheckRequired || typeof f !== "function") {
      var user = obj[key];
      if (!value || typeof value !== "object" || privacyCheckRequired && !user) {
        obj[key] = value;
      } else {
        Sys$Component$_setProperties(user, value);
      }
    } else {
      var fn = obj["set_" + key];
      if (typeof fn === "function") {
        fn.apply(obj, [value]);
      } else {
        if (value instanceof Array) {
          result = f.apply(obj);
          /** @type {number} */
          var i = 0;
          var j = result.length;
          /** @type {number} */
          var valueLength = value.length;
          for (; i < valueLength; i++, j++) {
            result[j] = value[i];
          }
        } else {
          if (typeof value === "object" && Object.getType(value) === Object) {
            result = f.apply(obj);
            Sys$Component$_setProperties(result, value);
          }
        }
      }
    }
  }
  if (h) {
    obj.endUpdate();
  }
}
/**
 * @param {!Object} target
 * @param {!Object} arr
 * @return {undefined}
 */
function Sys$Component$_setReferences(target, arr) {
  var name;
  for (name in arr) {
    var fn = target["set_" + name];
    var obj = $find(arr[name]);
    fn.apply(target, [obj]);
  }
}
/** @type {function(!Object, !Object, !Object, !Object, ?): ?} */
var $create = Sys.Component.create = function(message, object, opts, data, el) {
  var item = el ? new message(el) : new message;
  var target = Sys.Application;
  var i = target.get_isCreatingComponents();
  item.beginUpdate();
  if (object) {
    Sys$Component$_setProperties(item, object);
  }
  if (opts) {
    var i;
    for (i in opts) {
      item["add_" + i](opts[i]);
    }
  }
  if (item.get_id()) {
    target.addComponent(item);
  }
  if (i) {
    target._createdComponents[target._createdComponents.length] = item;
    if (data) {
      target._addComponentToSecondPass(item, data);
    } else {
      item.endUpdate();
    }
  } else {
    if (data) {
      Sys$Component$_setReferences(item, data);
    }
    item.endUpdate();
  }
  return item;
};
/**
 * @return {?}
 */
Sys.UI.MouseButton = function() {
  throw Error.notImplemented();
};
Sys.UI.MouseButton.prototype = {
  leftButton : 0,
  middleButton : 1,
  rightButton : 2
};
Sys.UI.MouseButton.registerEnum("Sys.UI.MouseButton");
/**
 * @return {?}
 */
Sys.UI.Key = function() {
  throw Error.notImplemented();
};
Sys.UI.Key.prototype = {
  backspace : 8,
  tab : 9,
  enter : 13,
  esc : 27,
  space : 32,
  pageUp : 33,
  pageDown : 34,
  end : 35,
  home : 36,
  left : 37,
  up : 38,
  right : 39,
  down : 40,
  del : 127
};
Sys.UI.Key.registerEnum("Sys.UI.Key");
/**
 * @param {number} a
 * @param {number} angle
 * @return {undefined}
 */
Sys.UI.Point = function(a, angle) {
  /** @type {number} */
  this.rawX = a;
  /** @type {number} */
  this.rawY = angle;
  /** @type {number} */
  this.x = Math.round(a);
  /** @type {number} */
  this.y = Math.round(angle);
};
Sys.UI.Point.registerClass("Sys.UI.Point");
/**
 * @param {number} left
 * @param {number} top
 * @param {number} size
 * @param {number} opt_height
 * @return {undefined}
 */
Sys.UI.Bounds = function(left, top, size, opt_height) {
  /** @type {number} */
  this.x = left;
  /** @type {number} */
  this.y = top;
  /** @type {number} */
  this.height = opt_height;
  /** @type {number} */
  this.width = size;
};
Sys.UI.Bounds.registerClass("Sys.UI.Bounds");
/**
 * @param {!Object} startExonIdx
 * @return {undefined}
 */
Sys.UI.DomEvent = function(startExonIdx) {
  /** @type {!Object} */
  var e = startExonIdx;
  var type = this.type = e.type.toLowerCase();
  this.rawEvent = e;
  this.altKey = e.altKey;
  if (typeof e.button !== "undefined") {
    this.button = typeof e.which !== "undefined" ? e.button : e.button === 4 ? Sys.UI.MouseButton.middleButton : e.button === 2 ? Sys.UI.MouseButton.rightButton : Sys.UI.MouseButton.leftButton;
  }
  if (type === "keypress") {
    this.charCode = e.charCode || e.keyCode;
  } else {
    if (e.keyCode && e.keyCode === 46) {
      /** @type {number} */
      this.keyCode = 127;
    } else {
      this.keyCode = e.keyCode;
    }
  }
  this.clientX = e.clientX;
  this.clientY = e.clientY;
  this.ctrlKey = e.ctrlKey;
  this.target = e.target ? e.target : e.srcElement;
  if (!type.startsWith("key")) {
    if (typeof e.offsetX !== "undefined" && typeof e.offsetY !== "undefined") {
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    } else {
      if (this.target && this.target.nodeType !== 3 && typeof e.clientX === "number") {
        var filterBounds = Sys.UI.DomElement.getLocation(this.target);
        var n = Sys.UI.DomElement._getWindow(this.target);
        /** @type {number} */
        this.offsetX = (n.pageXOffset || 0) + e.clientX - filterBounds.x;
        /** @type {number} */
        this.offsetY = (n.pageYOffset || 0) + e.clientY - filterBounds.y;
      }
    }
  }
  this.screenX = e.screenX;
  this.screenY = e.screenY;
  this.shiftKey = e.shiftKey;
};
Sys.UI.DomEvent.prototype = {
  preventDefault : function() {
    if (this.rawEvent.preventDefault) {
      this.rawEvent.preventDefault();
    } else {
      if (window.event) {
        /** @type {boolean} */
        this.rawEvent.returnValue = false;
      }
    }
  },
  stopPropagation : function() {
    if (this.rawEvent.stopPropagation) {
      this.rawEvent.stopPropagation();
    } else {
      if (window.event) {
        /** @type {boolean} */
        this.rawEvent.cancelBubble = true;
      }
    }
  }
};
Sys.UI.DomEvent.registerClass("Sys.UI.DomEvent");
/** @type {function(!Object, string, !Function, !Array): undefined} */
var $addHandler = Sys.UI.DomEvent.addHandler = function(obj, type, fn, add) {
  if (!obj._events) {
    obj._events = {};
  }
  var listeners = obj._events[type];
  if (!listeners) {
    /** @type {!Array} */
    obj._events[type] = listeners = [];
  }
  var handler;
  if (obj.addEventListener) {
    /**
     * @param {?} e
     * @return {?}
     */
    handler = function(e) {
      return fn.call(obj, new Sys.UI.DomEvent(e));
    };
    obj.addEventListener(type, handler, false);
  } else {
    if (obj.attachEvent) {
      /**
       * @return {?}
       */
      handler = function() {
        var e = {};
        try {
          e = Sys.UI.DomElement._getWindow(obj).event;
        } catch (c) {
        }
        return fn.call(obj, new Sys.UI.DomEvent(e));
      };
      obj.attachEvent("on" + type, handler);
    }
  }
  listeners[listeners.length] = {
    handler : fn,
    browserHandler : handler,
    autoRemove : add
  };
  if (add) {
    var d = obj.dispose;
    if (d !== Sys.UI.DomEvent._disposeHandlers) {
      /** @type {function(): undefined} */
      obj.dispose = Sys.UI.DomEvent._disposeHandlers;
      if (typeof d !== "undefined") {
        obj._chainDispose = d;
      }
    }
  }
};
/** @type {function(?, !Object, ?, string): undefined} */
var $addHandlers = Sys.UI.DomEvent.addHandlers = function(obj, type, fn, table) {
  var j;
  for (j in type) {
    var method = type[j];
    if (fn) {
      method = Function.createDelegate(fn, method);
    }
    $addHandler(obj, j, method, table || false);
  }
};
/** @type {function(?): undefined} */
var $clearHandlers = Sys.UI.DomEvent.clearHandlers = function(el) {
  Sys.UI.DomEvent._clearHandlers(el, false);
};
/**
 * @param {?} element
 * @param {boolean} opt_defaultPrevented
 * @return {undefined}
 */
Sys.UI.DomEvent._clearHandlers = function(element, opt_defaultPrevented) {
  if (element._events) {
    var events = element._events;
    var name;
    for (name in events) {
      var listeners = events[name];
      /** @type {number} */
      var i = listeners.length - 1;
      for (; i >= 0; i--) {
        var listener = listeners[i];
        if (!opt_defaultPrevented || listener.autoRemove) {
          $removeHandler(element, name, listener.handler);
        }
      }
    }
    /** @type {null} */
    element._events = null;
  }
};
/**
 * @return {undefined}
 */
Sys.UI.DomEvent._disposeHandlers = function() {
  Sys.UI.DomEvent._clearHandlers(this, true);
  var compares = this._chainDispose;
  /** @type {string} */
  var comparesType = typeof compares;
  if (comparesType !== "undefined") {
    this.dispose = compares;
    /** @type {null} */
    this._chainDispose = null;
    if (comparesType === "function") {
      this.dispose();
    }
  }
};
/** @type {function(!Object, string, !Function): undefined} */
var $removeHandler = Sys.UI.DomEvent.removeHandler = function(name, fn, type) {
  Sys.UI.DomEvent._removeHandler(name, fn, type);
};
/**
 * @param {!Object} e
 * @param {string} name
 * @param {!Function} callback
 * @return {undefined}
 */
Sys.UI.DomEvent._removeHandler = function(e, name, callback) {
  /** @type {null} */
  var emit = null;
  var evts = e._events[name];
  /** @type {number} */
  var i = 0;
  var l = evts.length;
  for (; i < l; i++) {
    if (evts[i].handler === callback) {
      emit = evts[i].browserHandler;
      break;
    }
  }
  if (e.removeEventListener) {
    e.removeEventListener(name, emit, false);
  } else {
    if (e.detachEvent) {
      e.detachEvent("on" + name, emit);
    }
  }
  evts.splice(i, 1);
};
/**
 * @return {undefined}
 */
Sys.UI.DomElement = function() {
};
Sys.UI.DomElement.registerClass("Sys.UI.DomElement");
/**
 * @param {!Object} element
 * @param {string} name
 * @return {undefined}
 */
Sys.UI.DomElement.addCssClass = function(element, name) {
  if (!Sys.UI.DomElement.containsCssClass(element, name)) {
    if (element.className === "") {
      /** @type {string} */
      element.className = name;
    } else {
      element.className += " " + name;
    }
  }
};
/**
 * @param {!Object} obj
 * @param {string} item
 * @return {?}
 */
Sys.UI.DomElement.containsCssClass = function(obj, item) {
  return Array.contains(obj.className.split(" "), item);
};
/**
 * @param {!Object} el
 * @return {?}
 */
Sys.UI.DomElement.getBounds = function(el) {
  var bbox = Sys.UI.DomElement.getLocation(el);
  return new Sys.UI.Bounds(bbox.x, bbox.y, el.offsetWidth || 0, el.offsetHeight || 0);
};
/** @type {function(string, !Object): ?} */
var $get = Sys.UI.DomElement.getElementById = function(id, document) {
  if (!document) {
    return document.getElementById(id);
  }
  if (document.getElementById) {
    return document.getElementById(id);
  }
  /** @type {!Array} */
  var modes = [];
  var children = document.childNodes;
  /** @type {number} */
  var i = 0;
  for (; i < children.length; i++) {
    var el = children[i];
    if (el.nodeType == 1) {
      modes[modes.length] = el;
    }
  }
  for (; modes.length;) {
    el = modes.shift();
    if (el.id == id) {
      return el;
    }
    children = el.childNodes;
    /** @type {number} */
    i = 0;
    for (; i < children.length; i++) {
      el = children[i];
      if (el.nodeType == 1) {
        modes[modes.length] = el;
      }
    }
  }
  return null;
};
if (document.documentElement.getBoundingClientRect) {
  /**
   * @param {!Object} el
   * @return {?}
   */
  Sys.UI.DomElement.getLocation = function(el) {
    if (el.self || el.nodeType === 9 || el === document.documentElement || el.parentNode === el.ownerDocument.documentElement) {
      return new Sys.UI.Point(0, 0);
    }
    var selOfs = el.getBoundingClientRect();
    if (!selOfs) {
      return new Sys.UI.Point(0, 0);
    }
    var doc = el.ownerDocument.documentElement;
    var body = el.ownerDocument.body;
    var l;
    var x = Math.round(selOfs.left) + (doc.scrollLeft || body.scrollLeft);
    var y = Math.round(selOfs.top) + (doc.scrollTop || body.scrollTop);
    if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
      try {
        var f = el.ownerDocument.parentWindow.frameElement || null;
        if (f) {
          /** @type {number} */
          var INC = f.frameBorder === "0" || f.frameBorder === "no" ? 2 : 0;
          x = x + INC;
          y = y + INC;
        }
      } catch (m) {
      }
      if (Sys.Browser.version === 7 && !document.documentMode) {
        /** @type {!HTMLBodyElement} */
        var scrollNode = document.body;
        /** @type {!ClientRect} */
        var header_rect = scrollNode.getBoundingClientRect();
        /** @type {number} */
        var length = (header_rect.right - header_rect.left) / scrollNode.clientWidth;
        /** @type {number} */
        length = Math.round(length * 100);
        /** @type {number} */
        length = (length - length % 5) / 100;
        if (!isNaN(length) && length !== 1) {
          /** @type {number} */
          x = Math.round(x / length);
          /** @type {number} */
          y = Math.round(y / length);
        }
      }
      if ((document.documentMode || 0) < 8) {
        /** @type {number} */
        x = x - doc.clientLeft;
        /** @type {number} */
        y = y - doc.clientTop;
      }
    }
    return new Sys.UI.Point(x, y);
  };
} else {
  if (Sys.Browser.agent === Sys.Browser.Safari) {
    /**
     * @param {!Object} element
     * @return {?}
     */
    Sys.UI.DomElement.getLocation = function(element) {
      if (element.window && element.window === element || element.nodeType === 9) {
        return new Sys.UI.Point(0, 0);
      }
      /** @type {number} */
      var left = 0;
      /** @type {number} */
      var top = 0;
      var parent;
      /** @type {null} */
      var intendedParent = null;
      /** @type {null} */
      var previousStyle = null;
      var currentStyle;
      /** @type {!Object} */
      parent = element;
      for (; parent; intendedParent = parent, previousStyle = currentStyle, parent = parent.offsetParent) {
        currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
        var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
        if ((parent.offsetLeft || parent.offsetTop) && (tagName !== "BODY" || (!previousStyle || previousStyle.position !== "absolute"))) {
          left = left + parent.offsetLeft;
          top = top + parent.offsetTop;
        }
        if (intendedParent && Sys.Browser.version >= 3) {
          left = left + parseInt(currentStyle.borderLeftWidth);
          top = top + parseInt(currentStyle.borderTopWidth);
        }
      }
      currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
      var elementPosition = currentStyle ? currentStyle.position : null;
      if (!elementPosition || elementPosition !== "absolute") {
        parent = element.parentNode;
        for (; parent; parent = parent.parentNode) {
          tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
          if (tagName !== "BODY" && tagName !== "HTML" && (parent.scrollLeft || parent.scrollTop)) {
            /** @type {number} */
            left = left - (parent.scrollLeft || 0);
            /** @type {number} */
            top = top - (parent.scrollTop || 0);
          }
          currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
          var parentPosition = currentStyle ? currentStyle.position : null;
          if (parentPosition && parentPosition === "absolute") {
            break;
          }
        }
      }
      return new Sys.UI.Point(left, top);
    };
  } else {
    /**
     * @param {!Object} element
     * @return {?}
     */
    Sys.UI.DomElement.getLocation = function(element) {
      if (element.window && element.window === element || element.nodeType === 9) {
        return new Sys.UI.Point(0, 0);
      }
      /** @type {number} */
      var left = 0;
      /** @type {number} */
      var top = 0;
      var parent;
      /** @type {null} */
      var production = null;
      /** @type {null} */
      var previousStyle = null;
      /** @type {null} */
      var style = null;
      /** @type {!Object} */
      parent = element;
      for (; parent; production = parent, previousStyle = style, parent = parent.offsetParent) {
        var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
        style = Sys.UI.DomElement._getCurrentStyle(parent);
        if ((parent.offsetLeft || parent.offsetTop) && !(tagName === "BODY" && (!previousStyle || previousStyle.position !== "absolute"))) {
          left = left + parent.offsetLeft;
          top = top + parent.offsetTop;
        }
        if (production !== null && style) {
          if (tagName !== "TABLE" && tagName !== "TD" && tagName !== "HTML") {
            left = left + (parseInt(style.borderLeftWidth) || 0);
            top = top + (parseInt(style.borderTopWidth) || 0);
          }
          if (tagName === "TABLE" && (style.position === "relative" || style.position === "absolute")) {
            left = left + (parseInt(style.marginLeft) || 0);
            top = top + (parseInt(style.marginTop) || 0);
          }
        }
      }
      style = Sys.UI.DomElement._getCurrentStyle(element);
      var elementPosition = style ? style.position : null;
      if (!elementPosition || elementPosition !== "absolute") {
        parent = element.parentNode;
        for (; parent; parent = parent.parentNode) {
          tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
          if (tagName !== "BODY" && tagName !== "HTML" && (parent.scrollLeft || parent.scrollTop)) {
            /** @type {number} */
            left = left - (parent.scrollLeft || 0);
            /** @type {number} */
            top = top - (parent.scrollTop || 0);
            style = Sys.UI.DomElement._getCurrentStyle(parent);
            if (style) {
              left = left + (parseInt(style.borderLeftWidth) || 0);
              top = top + (parseInt(style.borderTopWidth) || 0);
            }
          }
        }
      }
      return new Sys.UI.Point(left, top);
    };
  }
}
/**
 * @param {!Object} value
 * @return {?}
 */
Sys.UI.DomElement.isDomElement = function(value) {
  return Sys._isDomElement(value);
};
/**
 * @param {!Object} name
 * @param {string} value
 * @return {undefined}
 */
Sys.UI.DomElement.removeCssClass = function(name, value) {
  /** @type {string} */
  var term = " " + name.className + " ";
  /** @type {number} */
  var pos = term.indexOf(" " + value + " ");
  if (pos >= 0) {
    /** @type {string} */
    name.className = (term.substr(0, pos) + " " + term.substring(pos + value.length + 1, term.length)).trim();
  }
};
/**
 * @param {?} domElement
 * @param {undefined} doc
 * @return {?}
 */
Sys.UI.DomElement.resolveElement = function(domElement, doc) {
  var element = domElement;
  if (!element) {
    return null;
  }
  if (typeof element === "string") {
    element = Sys.UI.DomElement.getElementById(element, doc);
  }
  return element;
};
/**
 * @param {!Object} y
 * @param {?} d
 * @return {undefined}
 */
Sys.UI.DomElement.raiseBubbleEvent = function(y, d) {
  /** @type {!Object} */
  var e = y;
  for (; e;) {
    var styles = e.control;
    if (styles && styles.onBubbleEvent && styles.raiseBubbleEvent) {
      Sys.UI.DomElement._raiseBubbleEventFromControl(styles, y, d);
      return;
    }
    e = e.parentNode;
  }
};
/**
 * @param {?} a
 * @param {!Object} b
 * @param {?} c
 * @return {undefined}
 */
Sys.UI.DomElement._raiseBubbleEventFromControl = function(a, b, c) {
  if (!a.onBubbleEvent(b, c)) {
    a._raiseBubbleEvent(b, c);
  }
};
/**
 * @param {!Element} text
 * @param {number} left
 * @param {number} top
 * @return {undefined}
 */
Sys.UI.DomElement.setLocation = function(text, left, top) {
  var style = text.style;
  /** @type {string} */
  style.position = "absolute";
  /** @type {string} */
  style.left = left + "px";
  /** @type {string} */
  style.top = top + "px";
};
/**
 * @param {undefined} node
 * @param {string} className
 * @return {undefined}
 */
Sys.UI.DomElement.toggleCssClass = function(node, className) {
  if (Sys.UI.DomElement.containsCssClass(node, className)) {
    Sys.UI.DomElement.removeCssClass(node, className);
  } else {
    Sys.UI.DomElement.addCssClass(node, className);
  }
};
/**
 * @param {?} triggers
 * @return {?}
 */
Sys.UI.DomElement.getVisibilityMode = function(triggers) {
  return triggers._visibilityMode === Sys.UI.VisibilityMode.hide ? Sys.UI.VisibilityMode.hide : Sys.UI.VisibilityMode.collapse;
};
/**
 * @param {!Element} el
 * @param {string} newVal
 * @return {undefined}
 */
Sys.UI.DomElement.setVisibilityMode = function(el, newVal) {
  Sys.UI.DomElement._ensureOldDisplayMode(el);
  if (el._visibilityMode !== newVal) {
    /** @type {string} */
    el._visibilityMode = newVal;
    if (Sys.UI.DomElement.getVisible(el) === false) {
      if (el._visibilityMode === Sys.UI.VisibilityMode.hide) {
        el.style.display = el._oldDisplayMode;
      } else {
        /** @type {string} */
        el.style.display = "none";
      }
    }
    /** @type {string} */
    el._visibilityMode = newVal;
  }
};
/**
 * @param {!Element} element
 * @return {?}
 */
Sys.UI.DomElement.getVisible = function(element) {
  var sequenceOptions = element.currentStyle || Sys.UI.DomElement._getCurrentStyle(element);
  if (!sequenceOptions) {
    return true;
  }
  return sequenceOptions.visibility !== "hidden" && sequenceOptions.display !== "none";
};
/**
 * @param {!Element} element
 * @param {string} value
 * @return {undefined}
 */
Sys.UI.DomElement.setVisible = function(element, value) {
  if (value !== Sys.UI.DomElement.getVisible(element)) {
    Sys.UI.DomElement._ensureOldDisplayMode(element);
    /** @type {string} */
    element.style.visibility = value ? "visible" : "hidden";
    if (value || element._visibilityMode === Sys.UI.VisibilityMode.hide) {
      element.style.display = element._oldDisplayMode;
    } else {
      /** @type {string} */
      element.style.display = "none";
    }
  }
};
/**
 * @param {!Element} element
 * @return {undefined}
 */
Sys.UI.DomElement._ensureOldDisplayMode = function(element) {
  if (!element._oldDisplayMode) {
    var val = element.currentStyle || Sys.UI.DomElement._getCurrentStyle(element);
    element._oldDisplayMode = val ? val.display : null;
    if (!element._oldDisplayMode || element._oldDisplayMode === "none") {
      switch(element.tagName.toUpperCase()) {
        case "DIV":
        case "P":
        case "ADDRESS":
        case "BLOCKQUOTE":
        case "BODY":
        case "COL":
        case "COLGROUP":
        case "DD":
        case "DL":
        case "DT":
        case "FIELDSET":
        case "FORM":
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
        case "HR":
        case "IFRAME":
        case "LEGEND":
        case "OL":
        case "PRE":
        case "TABLE":
        case "TD":
        case "TH":
        case "TR":
        case "UL":
          /** @type {string} */
          element._oldDisplayMode = "block";
          break;
        case "LI":
          /** @type {string} */
          element._oldDisplayMode = "list-item";
          break;
        default:
          /** @type {string} */
          element._oldDisplayMode = "inline";
      }
    }
  }
};
/**
 * @param {!Object} node
 * @return {?}
 */
Sys.UI.DomElement._getWindow = function(node) {
  var doc = node.ownerDocument || node.document || node;
  return doc.defaultView || doc.parentWindow;
};
/**
 * @param {!Object} node
 * @return {?}
 */
Sys.UI.DomElement._getCurrentStyle = function(node) {
  if (node.nodeType === 3) {
    return null;
  }
  var element = Sys.UI.DomElement._getWindow(node);
  if (node.documentElement) {
    node = node.documentElement;
  }
  var settings = element && node !== element && element.getComputedStyle ? element.getComputedStyle(node, null) : node.currentStyle || node.style;
  if (!settings && Sys.Browser.agent === Sys.Browser.Safari && node.style) {
    var gutterDisplay = node.style.display;
    var original_position = node.style.position;
    /** @type {string} */
    node.style.position = "absolute";
    /** @type {string} */
    node.style.display = "block";
    var sets = element.getComputedStyle(node, null);
    node.style.display = gutterDisplay;
    node.style.position = original_position;
    settings = {};
    var i;
    for (i in sets) {
      settings[i] = sets[i];
    }
    /** @type {string} */
    settings.display = "none";
  }
  return settings;
};
/**
 * @return {undefined}
 */
Sys.IContainer = function() {
};
Sys.IContainer.prototype = {};
Sys.IContainer.registerInterface("Sys.IContainer");
/**
 * @param {string} _components
 * @param {?} _gridOptions
 * @return {undefined}
 */
Sys.ApplicationLoadEventArgs = function(_components, _gridOptions) {
  Sys.ApplicationLoadEventArgs.initializeBase(this);
  /** @type {string} */
  this._components = _components;
  this._isPartialLoad = _gridOptions;
};
Sys.ApplicationLoadEventArgs.prototype = {
  get_components : function() {
    return this._components;
  },
  get_isPartialLoad : function() {
    return this._isPartialLoad;
  }
};
Sys.ApplicationLoadEventArgs.registerClass("Sys.ApplicationLoadEventArgs", Sys.EventArgs);
/**
 * @return {undefined}
 */
Sys._Application = function() {
  Sys._Application.initializeBase(this);
  /** @type {!Array} */
  this._disposableObjects = [];
  this._components = {};
  /** @type {!Array} */
  this._createdComponents = [];
  /** @type {!Array} */
  this._secondPassComponents = [];
  this._unloadHandlerDelegate = Function.createDelegate(this, this._unloadHandler);
  Sys.UI.DomEvent.addHandler(window, "unload", this._unloadHandlerDelegate);
  this._domReady();
};
Sys._Application.prototype = {
  _creatingComponents : false,
  _disposing : false,
  _deleteCount : 0,
  get_isCreatingComponents : function() {
    return this._creatingComponents;
  },
  get_isDisposing : function() {
    return this._disposing;
  },
  add_init : function(handler) {
    if (this._initialized) {
      handler(this, Sys.EventArgs.Empty);
    } else {
      this.get_events().addHandler("init", handler);
    }
  },
  remove_init : function(fn) {
    this.get_events().removeHandler("init", fn);
  },
  add_load : function(handler) {
    this.get_events().addHandler("load", handler);
  },
  remove_load : function(handler) {
    this.get_events().removeHandler("load", handler);
  },
  add_unload : function(type) {
    this.get_events().addHandler("unload", type);
  },
  remove_unload : function(fn) {
    this.get_events().removeHandler("unload", fn);
  },
  addComponent : function(obj) {
    /** @type {!Object} */
    this._components[obj.get_id()] = obj;
  },
  beginCreateComponents : function() {
    /** @type {boolean} */
    this._creatingComponents = true;
  },
  dispose : function() {
    if (!this._disposing) {
      /** @type {boolean} */
      this._disposing = true;
      if (this._timerCookie) {
        window.clearTimeout(this._timerCookie);
        delete this._timerCookie;
      }
      if (this._endRequestHandler) {
        Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(this._endRequestHandler);
        delete this._endRequestHandler;
      }
      if (this._beginRequestHandler) {
        Sys.WebForms.PageRequestManager.getInstance().remove_beginRequest(this._beginRequestHandler);
        delete this._beginRequestHandler;
      }
      if (window.pageUnload) {
        window.pageUnload(this, Sys.EventArgs.Empty);
      }
      var log = this.get_events().getHandler("unload");
      if (log) {
        log(this, Sys.EventArgs.Empty);
      }
      var layout = Array.clone(this._disposableObjects);
      /** @type {number} */
      var i = 0;
      var layoutCount = layout.length;
      for (; i < layoutCount; i++) {
        var row = layout[i];
        if (typeof row !== "undefined") {
          row.dispose();
        }
      }
      Array.clear(this._disposableObjects);
      Sys.UI.DomEvent.removeHandler(window, "unload", this._unloadHandlerDelegate);
      if (Sys._ScriptLoader) {
        var e = Sys._ScriptLoader.getInstance();
        if (e) {
          e.dispose();
        }
      }
      Sys._Application.callBaseMethod(this, "dispose");
    }
  },
  disposeElement : function(node, vnode) {
    if (node.nodeType === 1) {
      var i;
      var array = node.getElementsByTagName("*");
      var length = array.length;
      /** @type {!Array} */
      var result = new Array(length);
      /** @type {number} */
      i = 0;
      for (; i < length; i++) {
        result[i] = array[i];
      }
      /** @type {number} */
      i = length - 1;
      for (; i >= 0; i--) {
        var me = result[i];
        var d = me.dispose;
        if (d && typeof d === "function") {
          me.dispose();
        } else {
          var control = me.control;
          if (control && typeof control.dispose === "function") {
            control.dispose();
          }
        }
        var data = me._behaviors;
        if (data) {
          this._disposeComponents(data);
        }
        data = me._components;
        if (data) {
          this._disposeComponents(data);
          /** @type {null} */
          me._components = null;
        }
      }
      if (!vnode) {
        d = node.dispose;
        if (d && typeof d === "function") {
          node.dispose();
        } else {
          control = node.control;
          if (control && typeof control.dispose === "function") {
            control.dispose();
          }
        }
        data = node._behaviors;
        if (data) {
          this._disposeComponents(data);
        }
        data = node._components;
        if (data) {
          this._disposeComponents(data);
          /** @type {null} */
          node._components = null;
        }
      }
    }
  },
  endCreateComponents : function() {
    var nodeResults = this._secondPassComponents;
    /** @type {number} */
    var i = 0;
    var patchLen = nodeResults.length;
    for (; i < patchLen; i++) {
      var that = nodeResults[i].component;
      Sys$Component$_setReferences(that, nodeResults[i].references);
      that.endUpdate();
    }
    /** @type {!Array} */
    this._secondPassComponents = [];
    /** @type {boolean} */
    this._creatingComponents = false;
  },
  findComponent : function(name, component) {
    return component ? Sys.IContainer.isInstanceOfType(component) ? component.findComponent(name) : component[name] || null : Sys.Application._components[name] || null;
  },
  getComponents : function() {
    /** @type {!Array} */
    var components = [];
    var name = this._components;
    var key;
    for (key in name) {
      components[components.length] = name[key];
    }
    return components;
  },
  initialize : function() {
    if (!this.get_isInitialized() && !this._disposing) {
      Sys._Application.callBaseMethod(this, "initialize");
      this._raiseInit();
      if (this.get_stateString) {
        if (Sys.WebForms && Sys.WebForms.PageRequestManager) {
          this._beginRequestHandler = Function.createDelegate(this, this._onPageRequestManagerBeginRequest);
          Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(this._beginRequestHandler);
          this._endRequestHandler = Function.createDelegate(this, this._onPageRequestManagerEndRequest);
          Sys.WebForms.PageRequestManager.getInstance().add_endRequest(this._endRequestHandler);
        }
        var leftArrow = this.get_stateString();
        if (leftArrow !== this._currentEntry) {
          this._navigate(leftArrow);
        } else {
          this._ensureHistory();
        }
      }
      this.raiseLoad();
    }
  },
  notifyScriptLoaded : function() {
  },
  registerDisposableObject : function(g) {
    if (!this._disposing) {
      var seed = this._disposableObjects;
      var i = seed.length;
      seed[i] = g;
      g.__msdisposeindex = i;
    }
  },
  raiseLoad : function() {
    var task = this.get_events().getHandler("load");
    var cb = new Sys.ApplicationLoadEventArgs(Array.clone(this._createdComponents), !!this._loaded);
    /** @type {boolean} */
    this._loaded = true;
    if (task) {
      task(this, cb);
    }
    if (window.pageLoad) {
      window.pageLoad(this, cb);
    }
    /** @type {!Array} */
    this._createdComponents = [];
  },
  removeComponent : function(model) {
    var i = model.get_id();
    if (i) {
      delete this._components[i];
    }
  },
  unregisterDisposableObject : function(b) {
    if (!this._disposing) {
      var length = b.__msdisposeindex;
      if (typeof length === "number") {
        var a = this._disposableObjects;
        delete a[length];
        delete b.__msdisposeindex;
        if (++this._deleteCount > 1000) {
          /** @type {!Array} */
          var limits = [];
          /** @type {number} */
          var k = 0;
          var f = a.length;
          for (; k < f; k++) {
            b = a[k];
            if (typeof b !== "undefined") {
              /** @type {number} */
              b.__msdisposeindex = limits.length;
              limits.push(b);
            }
          }
          /** @type {!Array} */
          this._disposableObjects = limits;
          /** @type {number} */
          this._deleteCount = 0;
        }
      }
    }
  },
  _addComponentToSecondPass : function(element, collectionName) {
    this._secondPassComponents[this._secondPassComponents.length] = {
      component : element,
      references : collectionName
    };
  },
  _disposeComponents : function(bin) {
    if (bin) {
      /** @type {number} */
      var j = bin.length - 1;
      for (; j >= 0; j--) {
        var code = bin[j];
        if (typeof code.dispose === "function") {
          code.dispose();
        }
      }
    }
  },
  _domReady : function() {
    /**
     * @return {undefined}
     */
    function callback() {
      songInput.initialize();
    }
    var fn;
    var g;
    var songInput = this;
    /**
     * @return {undefined}
     */
    var handler = function() {
      Sys.UI.DomEvent.removeHandler(window, "load", handler);
      callback();
    };
    Sys.UI.DomEvent.addHandler(window, "load", handler);
    if (document.addEventListener) {
      try {
        document.addEventListener("DOMContentLoaded", fn = function() {
          document.removeEventListener("DOMContentLoaded", fn, false);
          callback();
        }, false);
      } catch (h) {
      }
    } else {
      if (document.attachEvent) {
        if (window == window.top && document.documentElement.doScroll) {
          var whileBody;
          /** @type {!Element} */
          var div = document.createElement("div");
          /**
           * @return {undefined}
           */
          fn = function() {
            try {
              div.doScroll("left");
            } catch (c) {
              whileBody = window.setTimeout(fn, 0);
              return;
            }
            /** @type {null} */
            div = null;
            callback();
          };
          fn();
        } else {
          document.attachEvent("onreadystatechange", fn = function() {
            if (document.readyState === "complete") {
              document.detachEvent("onreadystatechange", fn);
              callback();
            }
          });
        }
      }
    }
  },
  _raiseInit : function() {
    var ret = this.get_events().getHandler("init");
    if (ret) {
      this.beginCreateComponents();
      ret(this, Sys.EventArgs.Empty);
      this.endCreateComponents();
    }
  },
  _unloadHandler : function() {
    this.dispose();
  }
};
Sys._Application.registerClass("Sys._Application", Sys.Component, Sys.IContainer);
Sys.Application = new Sys._Application;
var $find = Sys.Application.findComponent;
/**
 * @param {!Object} element
 * @return {undefined}
 */
Sys.UI.Behavior = function(element) {
  Sys.UI.Behavior.initializeBase(this);
  /** @type {!Object} */
  this._element = element;
  var s = element._behaviors;
  if (!s) {
    /** @type {!Array} */
    element._behaviors = [this];
  } else {
    s[s.length] = this;
  }
};
Sys.UI.Behavior.prototype = {
  _name : null,
  get_element : function() {
    return this._element;
  },
  get_id : function() {
    var result = Sys.UI.Behavior.callBaseMethod(this, "get_id");
    if (result) {
      return result;
    }
    if (!this._element || !this._element.id) {
      return "";
    }
    return this._element.id + "$" + this.get_name();
  },
  get_name : function() {
    if (this._name) {
      return this._name;
    }
    var name = Object.getTypeName(this);
    var dot_pos = name.lastIndexOf(".");
    if (dot_pos !== -1) {
      name = name.substr(dot_pos + 1);
    }
    if (!this.get_isInitialized()) {
      this._name = name;
    }
    return name;
  },
  set_name : function(name) {
    /** @type {string} */
    this._name = name;
  },
  initialize : function() {
    Sys.UI.Behavior.callBaseMethod(this, "initialize");
    var name = this.get_name();
    if (name) {
      this._element[name] = this;
    }
  },
  dispose : function() {
    Sys.UI.Behavior.callBaseMethod(this, "dispose");
    var element = this._element;
    if (element) {
      var name = this.get_name();
      if (name) {
        /** @type {null} */
        element[name] = null;
      }
      var o = element._behaviors;
      Array.remove(o, this);
      if (o.length === 0) {
        /** @type {null} */
        element._behaviors = null;
      }
      delete this._element;
    }
  }
};
Sys.UI.Behavior.registerClass("Sys.UI.Behavior", Sys.Component);
/**
 * @param {!NodeList} h
 * @param {number} m
 * @return {?}
 */
Sys.UI.Behavior.getBehaviorByName = function(h, m) {
  var value = h[m];
  return value && Sys.UI.Behavior.isInstanceOfType(value) ? value : null;
};
/**
 * @param {?} view
 * @return {?}
 */
Sys.UI.Behavior.getBehaviors = function(view) {
  if (!view._behaviors) {
    return [];
  }
  return Array.clone(view._behaviors);
};
/**
 * @param {?} parentDiv
 * @param {?} callback
 * @return {?}
 */
Sys.UI.Behavior.getBehaviorsByType = function(parentDiv, callback) {
  var patches = parentDiv._behaviors;
  /** @type {!Array} */
  var text = [];
  if (patches) {
    /** @type {number} */
    var i = 0;
    var patchLen = patches.length;
    for (; i < patchLen; i++) {
      if (callback.isInstanceOfType(patches[i])) {
        text[text.length] = patches[i];
      }
    }
  }
  return text;
};
/**
 * @return {?}
 */
Sys.UI.VisibilityMode = function() {
  throw Error.notImplemented();
};
Sys.UI.VisibilityMode.prototype = {
  hide : 0,
  collapse : 1
};
Sys.UI.VisibilityMode.registerEnum("Sys.UI.VisibilityMode");
/**
 * @param {!Object} element
 * @return {undefined}
 */
Sys.UI.Control = function(element) {
  Sys.UI.Control.initializeBase(this);
  /** @type {!Object} */
  this._element = element;
  element.control = this;
  var imgSrcset = this.get_role();
  if (imgSrcset) {
    element.setAttribute("role", imgSrcset);
  }
};
Sys.UI.Control.prototype = {
  _parent : null,
  _visibilityMode : Sys.UI.VisibilityMode.hide,
  get_element : function() {
    return this._element;
  },
  get_id : function() {
    if (!this._element) {
      return "";
    }
    return this._element.id;
  },
  set_id : function() {
    throw Error.invalidOperation(Sys.Res.cantSetId);
  },
  get_parent : function() {
    if (this._parent) {
      return this._parent;
    }
    if (!this._element) {
      return null;
    }
    var obj = this._element.parentNode;
    for (; obj;) {
      if (obj.control) {
        return obj.control;
      }
      obj = obj.parentNode;
    }
    return null;
  },
  set_parent : function(parent) {
    /** @type {!Document} */
    this._parent = parent;
  },
  get_role : function() {
    return null;
  },
  get_visibilityMode : function() {
    return Sys.UI.DomElement.getVisibilityMode(this._element);
  },
  set_visibilityMode : function(args) {
    Sys.UI.DomElement.setVisibilityMode(this._element, args);
  },
  get_visible : function() {
    return Sys.UI.DomElement.getVisible(this._element);
  },
  set_visible : function(visible) {
    Sys.UI.DomElement.setVisible(this._element, visible);
  },
  addCssClass : function(style) {
    Sys.UI.DomElement.addCssClass(this._element, style);
  },
  dispose : function() {
    Sys.UI.Control.callBaseMethod(this, "dispose");
    if (this._element) {
      /** @type {null} */
      this._element.control = null;
      delete this._element;
    }
    if (this._parent) {
      delete this._parent;
    }
  },
  onBubbleEvent : function() {
    return false;
  },
  raiseBubbleEvent : function(a, b) {
    this._raiseBubbleEvent(a, b);
  },
  _raiseBubbleEvent : function(b, c) {
    var button = this.get_parent();
    for (; button;) {
      if (button.onBubbleEvent(b, c)) {
        return;
      }
      button = button.get_parent();
    }
  },
  removeCssClass : function(style) {
    Sys.UI.DomElement.removeCssClass(this._element, style);
  },
  toggleCssClass : function(name) {
    Sys.UI.DomElement.toggleCssClass(this._element, name);
  }
};
Sys.UI.Control.registerClass("Sys.UI.Control", Sys.Component);
/**
 * @param {string} state
 * @return {undefined}
 */
Sys.HistoryEventArgs = function(state) {
  Sys.HistoryEventArgs.initializeBase(this);
  /** @type {string} */
  this._state = state;
};
Sys.HistoryEventArgs.prototype = {
  get_state : function() {
    return this._state;
  }
};
Sys.HistoryEventArgs.registerClass("Sys.HistoryEventArgs", Sys.EventArgs);
/** @type {null} */
Sys.Application._appLoadHandler = null;
/** @type {null} */
Sys.Application._beginRequestHandler = null;
/** @type {null} */
Sys.Application._clientId = null;
/** @type {string} */
Sys.Application._currentEntry = "";
/** @type {null} */
Sys.Application._endRequestHandler = null;
/** @type {null} */
Sys.Application._history = null;
/** @type {boolean} */
Sys.Application._enableHistory = false;
/** @type {null} */
Sys.Application._historyFrame = null;
/** @type {boolean} */
Sys.Application._historyInitialized = false;
/** @type {boolean} */
Sys.Application._historyPointIsNew = false;
/** @type {boolean} */
Sys.Application._ignoreTimer = false;
/** @type {null} */
Sys.Application._initialState = null;
Sys.Application._state = {};
/** @type {number} */
Sys.Application._timerCookie = 0;
/** @type {null} */
Sys.Application._timerHandler = null;
/** @type {null} */
Sys.Application._uniqueId = null;
/**
 * @return {?}
 */
Sys._Application.prototype.get_stateString = function() {
  /** @type {null} */
  var s = null;
  if (Sys.Browser.agent === Sys.Browser.Firefox) {
    /** @type {string} */
    var url = window.location.href;
    /** @type {number} */
    var anchorIndex = url.indexOf("#");
    if (anchorIndex !== -1) {
      /** @type {string} */
      s = url.substring(anchorIndex + 1);
    } else {
      /** @type {string} */
      s = "";
    }
    return s;
  } else {
    /** @type {string} */
    s = window.location.hash;
  }
  if (s.length > 0 && s.charAt(0) === "#") {
    /** @type {string} */
    s = s.substring(1);
  }
  return s;
};
/**
 * @return {?}
 */
Sys._Application.prototype.get_enableHistory = function() {
  return this._enableHistory;
};
/**
 * @param {boolean} a
 * @return {undefined}
 */
Sys._Application.prototype.set_enableHistory = function(a) {
  /** @type {boolean} */
  this._enableHistory = a;
};
/**
 * @param {string} type
 * @return {undefined}
 */
Sys._Application.prototype.add_navigate = function(type) {
  this.get_events().addHandler("navigate", type);
};
/**
 * @param {string} fn
 * @return {undefined}
 */
Sys._Application.prototype.remove_navigate = function(fn) {
  this.get_events().removeHandler("navigate", fn);
};
/**
 * @param {!Object} item
 * @param {string} message
 * @return {undefined}
 */
Sys._Application.prototype.addHistoryPoint = function(item, message) {
  this._ensureHistory();
  var from = this._state;
  var p;
  for (p in item) {
    var to = item[p];
    if (to === null) {
      if (typeof from[p] !== "undefined") {
        delete from[p];
      }
    } else {
      from[p] = to;
    }
  }
  var value = this._serializeState(from);
  /** @type {boolean} */
  this._historyPointIsNew = true;
  this._setState(value, message);
  this._raiseNavigate();
};
/**
 * @param {!AudioNode} clientId
 * @param {!AudioNode} fluxToken
 * @return {undefined}
 */
Sys._Application.prototype.setServerId = function(clientId, fluxToken) {
  /** @type {!AudioNode} */
  this._clientId = clientId;
  /** @type {!AudioNode} */
  this._uniqueId = fluxToken;
};
/**
 * @param {string} locker
 * @return {undefined}
 */
Sys._Application.prototype.setServerState = function(locker) {
  this._ensureHistory();
  /** @type {string} */
  this._state.__s = locker;
  this._updateHiddenField(locker);
};
/**
 * @param {string} a
 * @return {?}
 */
Sys._Application.prototype._deserializeState = function(a) {
  var tmp = {};
  a = a || "";
  var plast = a.indexOf("&&");
  if (plast !== -1 && plast + 2 < a.length) {
    tmp.__s = a.substr(plast + 2);
    a = a.substr(0, plast);
  }
  var rules = a.split("&");
  /** @type {number} */
  var i = 0;
  var rulesCount = rules.length;
  for (; i < rulesCount; i++) {
    var line = rules[i];
    var index = line.indexOf("=");
    if (index !== -1 && index + 1 < line.length) {
      var i = line.substr(0, index);
      var h = line.substr(index + 1);
      /** @type {string} */
      tmp[i] = decodeURIComponent(h);
    }
  }
  return tmp;
};
/**
 * @return {undefined}
 */
Sys._Application.prototype._enableHistoryInScriptManager = function() {
  /** @type {boolean} */
  this._enableHistory = true;
};
/**
 * @return {undefined}
 */
Sys._Application.prototype._ensureHistory = function() {
  if (!this._historyInitialized && this._enableHistory) {
    if (Sys.Browser.agent === Sys.Browser.InternetExplorer && (!document.documentMode || document.documentMode < 8)) {
      /** @type {(Element|null)} */
      this._historyFrame = document.getElementById("__historyFrame");
      /** @type {boolean} */
      this._ignoreIFrame = true;
    }
    this._timerHandler = Function.createDelegate(this, this._onIdle);
    this._timerCookie = window.setTimeout(this._timerHandler, 100);
    try {
      this._initialState = this._deserializeState(this.get_stateString());
    } catch (a) {
    }
    /** @type {boolean} */
    this._historyInitialized = true;
  }
};
/**
 * @param {string} arrow
 * @return {undefined}
 */
Sys._Application.prototype._navigate = function(arrow) {
  this._ensureHistory();
  var newstate = this._deserializeState(arrow);
  if (this._uniqueId) {
    var old = this._state.__s || "";
    var val = newstate.__s || "";
    if (val !== old) {
      this._updateHiddenField(val);
      __doPostBack(this._uniqueId, val);
      this._state = newstate;
      return;
    }
  }
  this._setState(arrow);
  this._state = newstate;
  this._raiseNavigate();
};
/**
 * @return {undefined}
 */
Sys._Application.prototype._onIdle = function() {
  delete this._timerCookie;
  var leftArrow = this.get_stateString();
  if (leftArrow !== this._currentEntry) {
    if (!this._ignoreTimer) {
      /** @type {boolean} */
      this._historyPointIsNew = false;
      this._navigate(leftArrow);
    }
  } else {
    /** @type {boolean} */
    this._ignoreTimer = false;
  }
  this._timerCookie = window.setTimeout(this._timerHandler, 100);
};
/**
 * @param {string} PREVARROW
 * @return {undefined}
 */
Sys._Application.prototype._onIFrameLoad = function(PREVARROW) {
  if (!document.documentMode || document.documentMode < 8) {
    this._ensureHistory();
    if (!this._ignoreIFrame) {
      /** @type {boolean} */
      this._historyPointIsNew = false;
      this._navigate(PREVARROW);
    }
    /** @type {boolean} */
    this._ignoreIFrame = false;
  }
};
/**
 * @return {undefined}
 */
Sys._Application.prototype._onPageRequestManagerBeginRequest = function() {
  /** @type {boolean} */
  this._ignoreTimer = true;
  /** @type {string} */
  this._originalTitle = document.title;
};
/**
 * @param {?} dataLoadPromise
 * @param {?} arg
 * @return {undefined}
 */
Sys._Application.prototype._onPageRequestManagerEndRequest = function(dataLoadPromise, arg) {
  var thcUri = arg.get_dataItems()[this._clientId];
  var c = this._originalTitle;
  /** @type {null} */
  this._originalTitle = null;
  /** @type {(Element|null)} */
  var uiMsg = document.getElementById("__EVENTTARGET");
  if (uiMsg && uiMsg.value === this._uniqueId) {
    /** @type {string} */
    uiMsg.value = "";
  }
  if (typeof thcUri !== "undefined") {
    this.setServerState(thcUri);
    /** @type {boolean} */
    this._historyPointIsNew = true;
  } else {
    /** @type {boolean} */
    this._ignoreTimer = false;
  }
  var value = this._serializeState(this._state);
  if (value !== this._currentEntry) {
    /** @type {boolean} */
    this._ignoreTimer = true;
    if (typeof c === "string") {
      if (Sys.Browser.agent !== Sys.Browser.InternetExplorer || Sys.Browser.version > 7) {
        /** @type {string} */
        var orig_doc_title = document.title;
        /** @type {string} */
        document.title = c;
        this._setState(value);
        /** @type {string} */
        document.title = orig_doc_title;
      } else {
        this._setState(value);
      }
      this._raiseNavigate();
    } else {
      this._setState(value);
      this._raiseNavigate();
    }
  }
};
/**
 * @return {undefined}
 */
Sys._Application.prototype._raiseNavigate = function() {
  var d = this._historyPointIsNew;
  var AddChar = this.get_events().getHandler("navigate");
  var a = {};
  var key;
  for (key in this._state) {
    if (key !== "__s") {
      a[key] = this._state[key];
    }
  }
  var output = new Sys.HistoryEventArgs(a);
  if (AddChar) {
    AddChar(this, output);
  }
  if (!d) {
    var f;
    try {
      if (Sys.Browser.agent === Sys.Browser.Firefox && window.location.hash && (!window.frameElement || window.top.location.hash)) {
        if (Sys.Browser.version < 3.5) {
          window.history.go(0);
        } else {
          location.hash = this.get_stateString();
        }
      }
    } catch (g) {
    }
  }
};
/**
 * @param {!Object} data
 * @return {?}
 */
Sys._Application.prototype._serializeState = function(data) {
  /** @type {!Array} */
  var displayUsedBy = [];
  var a;
  for (a in data) {
    var i = data[a];
    if (a === "__s") {
      var defaultValue = i;
    } else {
      /** @type {string} */
      displayUsedBy[displayUsedBy.length] = a + "=" + encodeURIComponent(i);
    }
  }
  return displayUsedBy.join("&") + (defaultValue ? "&&" + defaultValue : "");
};
/**
 * @param {string} id
 * @param {string} message
 * @return {undefined}
 */
Sys._Application.prototype._setState = function(id, message) {
  if (this._enableHistory) {
    id = id || "";
    if (id !== this._currentEntry) {
      if (window.theForm) {
        var a = window.theForm.action;
        var b = a.indexOf("#");
        /** @type {string} */
        window.theForm.action = (b !== -1 ? a.substring(0, b) : a) + "#" + id;
      }
      if (this._historyFrame && this._historyPointIsNew) {
        /** @type {!Element} */
        var row = document.createElement("div");
        row.appendChild(document.createTextNode(message || document.title));
        /** @type {string} */
        var guid = row.innerHTML;
        /** @type {boolean} */
        this._ignoreIFrame = true;
        var fdoc = this._historyFrame.contentWindow.document;
        fdoc.open("javascript:'<html></html>'");
        fdoc.write("<html><head><title>" + guid + "</title><scri" + 'pt type="text/javascript">parent.Sys.Application._onIFrameLoad(' + Sys.Serialization.JavaScriptSerializer.serialize(id) + ");</scri" + "pt></head><body></body></html>");
        fdoc.close();
      }
      /** @type {boolean} */
      this._ignoreTimer = false;
      /** @type {string} */
      this._currentEntry = id;
      if (this._historyFrame || this._historyPointIsNew) {
        var SetEditor = this.get_stateString();
        if (id !== SetEditor) {
          /** @type {string} */
          window.location.hash = id;
          this._currentEntry = this.get_stateString();
          if (typeof message !== "undefined" && message !== null) {
            /** @type {string} */
            document.title = message;
          }
        }
      }
      /** @type {boolean} */
      this._historyPointIsNew = false;
    }
  }
};
/**
 * @param {string} source
 * @return {undefined}
 */
Sys._Application.prototype._updateHiddenField = function(source) {
  if (this._clientId) {
    /** @type {(Element|null)} */
    var mime = document.getElementById(this._clientId);
    if (mime) {
      /** @type {string} */
      mime.value = source;
    }
  }
};
if (!window.XMLHttpRequest) {
  /**
   * @return {?}
   */
  window.XMLHttpRequest = function() {
    /** @type {!Array} */
    var activeXids = ["Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP"];
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var patchLen = activeXids.length;
    for (; i < patchLen; i++) {
      try {
        return new ActiveXObject(activeXids[i]);
      } catch (d) {
      }
    }
    return null;
  };
}
Type.registerNamespace("Sys.Net");
/**
 * @return {undefined}
 */
Sys.Net.WebRequestExecutor = function() {
  /** @type {null} */
  this._webRequest = null;
  /** @type {null} */
  this._resultObject = null;
};
Sys.Net.WebRequestExecutor.prototype = {
  get_webRequest : function() {
    return this._webRequest;
  },
  _set_webRequest : function(EMSarray) {
    /** @type {!Object} */
    this._webRequest = EMSarray;
  },
  get_started : function() {
    throw Error.notImplemented();
  },
  get_responseAvailable : function() {
    throw Error.notImplemented();
  },
  get_timedOut : function() {
    throw Error.notImplemented();
  },
  get_aborted : function() {
    throw Error.notImplemented();
  },
  get_responseData : function() {
    throw Error.notImplemented();
  },
  get_statusCode : function() {
    throw Error.notImplemented();
  },
  get_statusText : function() {
    throw Error.notImplemented();
  },
  get_xml : function() {
    throw Error.notImplemented();
  },
  get_object : function() {
    if (!this._resultObject) {
      this._resultObject = Sys.Serialization.JavaScriptSerializer.deserialize(this.get_responseData());
    }
    return this._resultObject;
  },
  executeRequest : function() {
    throw Error.notImplemented();
  },
  abort : function() {
    throw Error.notImplemented();
  },
  getResponseHeader : function() {
    throw Error.notImplemented();
  },
  getAllResponseHeaders : function() {
    throw Error.notImplemented();
  }
};
Sys.Net.WebRequestExecutor.registerClass("Sys.Net.WebRequestExecutor");
/**
 * @param {?} markup
 * @return {?}
 */
Sys.Net.XMLDOM = function(markup) {
  if (!window.DOMParser) {
    /** @type {!Array} */
    var activeXids = ["Msxml2.DOMDocument.3.0", "Msxml2.DOMDocument"];
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var patchLen = activeXids.length;
    for (; i < patchLen; i++) {
      try {
        var xmlDOM = new ActiveXObject(activeXids[i]);
        /** @type {boolean} */
        xmlDOM.async = false;
        xmlDOM.loadXML(markup);
        xmlDOM.setProperty("SelectionLanguage", "XPath");
        return xmlDOM;
      } catch (g) {
      }
    }
  } else {
    try {
      var domParser = new window.DOMParser;
      return domParser.parseFromString(markup, "text/xml");
    } catch (g) {
    }
  }
  return null;
};
/**
 * @return {undefined}
 */
Sys.Net.XMLHttpExecutor = function() {
  Sys.Net.XMLHttpExecutor.initializeBase(this);
  var self = this;
  /** @type {null} */
  this._xmlHttpRequest = null;
  /** @type {null} */
  this._webRequest = null;
  /** @type {boolean} */
  this._responseAvailable = false;
  /** @type {boolean} */
  this._timedOut = false;
  /** @type {null} */
  this._timer = null;
  /** @type {boolean} */
  this._aborted = false;
  /** @type {boolean} */
  this._started = false;
  /**
   * @return {undefined}
   */
  this._onReadyStateChange = function() {
    if (self._xmlHttpRequest.readyState === 4) {
      try {
        if (typeof self._xmlHttpRequest.status === "undefined") {
          return;
        }
      } catch (b) {
        return;
      }
      self._clearTimer();
      /** @type {boolean} */
      self._responseAvailable = true;
      try {
        self._webRequest.completed(Sys.EventArgs.Empty);
      } finally {
        if (self._xmlHttpRequest != null) {
          /** @type {function(): undefined} */
          self._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
          /** @type {null} */
          self._xmlHttpRequest = null;
        }
      }
    }
  };
  /**
   * @return {undefined}
   */
  this._clearTimer = function() {
    if (self._timer != null) {
      window.clearTimeout(self._timer);
      /** @type {null} */
      self._timer = null;
    }
  };
  /**
   * @return {undefined}
   */
  this._onTimeout = function() {
    if (!self._responseAvailable) {
      self._clearTimer();
      /** @type {boolean} */
      self._timedOut = true;
      /** @type {function(): undefined} */
      self._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
      self._xmlHttpRequest.abort();
      self._webRequest.completed(Sys.EventArgs.Empty);
      /** @type {null} */
      self._xmlHttpRequest = null;
    }
  };
};
Sys.Net.XMLHttpExecutor.prototype = {
  get_timedOut : function() {
    return this._timedOut;
  },
  get_started : function() {
    return this._started;
  },
  get_responseAvailable : function() {
    return this._responseAvailable;
  },
  get_aborted : function() {
    return this._aborted;
  },
  executeRequest : function() {
    this._webRequest = this.get_webRequest();
    var postBody = this._webRequest.get_body();
    var headers = this._webRequest.get_headers();
    /** @type {!XMLHttpRequest} */
    this._xmlHttpRequest = new XMLHttpRequest;
    this._xmlHttpRequest.onreadystatechange = this._onReadyStateChange;
    var e = this._webRequest.get_httpVerb();
    this._xmlHttpRequest.open(e, this._webRequest.getResolvedUrl(), true);
    this._xmlHttpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    if (headers) {
      var i;
      for (i in headers) {
        var value = headers[i];
        if (typeof value !== "function") {
          this._xmlHttpRequest.setRequestHeader(i, value);
        }
      }
    }
    if (e.toLowerCase() === "post") {
      if (headers === null || !headers["Content-Type"]) {
        this._xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
      }
      if (!postBody) {
        /** @type {string} */
        postBody = "";
      }
    }
    var timeout = this._webRequest.get_timeout();
    if (timeout > 0) {
      this._timer = window.setTimeout(Function.createDelegate(this, this._onTimeout), timeout);
    }
    this._xmlHttpRequest.send(postBody);
    /** @type {boolean} */
    this._started = true;
  },
  getResponseHeader : function(key) {
    var val;
    try {
      val = this._xmlHttpRequest.getResponseHeader(key);
    } catch (c) {
    }
    if (!val) {
      /** @type {string} */
      val = "";
    }
    return val;
  },
  getAllResponseHeaders : function() {
    return this._xmlHttpRequest.getAllResponseHeaders();
  },
  get_responseData : function() {
    return this._xmlHttpRequest.responseText;
  },
  get_statusCode : function() {
    /** @type {number} */
    var problemStatus = 0;
    try {
      problemStatus = this._xmlHttpRequest.status;
    } catch (b) {
    }
    return problemStatus;
  },
  get_statusText : function() {
    return this._xmlHttpRequest.statusText;
  },
  get_xml : function() {
    var doc = this._xmlHttpRequest.responseXML;
    if (!doc || !doc.documentElement) {
      doc = Sys.Net.XMLDOM(this._xmlHttpRequest.responseText);
      if (!doc || !doc.documentElement) {
        return null;
      }
    } else {
      if (navigator.userAgent.indexOf("MSIE") !== -1 && typeof doc.setProperty != "undefined") {
        doc.setProperty("SelectionLanguage", "XPath");
      }
    }
    if (doc.documentElement.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" && doc.documentElement.tagName === "parsererror") {
      return null;
    }
    if (doc.documentElement.firstChild && doc.documentElement.firstChild.tagName === "parsererror") {
      return null;
    }
    return doc;
  },
  abort : function() {
    if (this._aborted || this._responseAvailable || this._timedOut) {
      return;
    }
    /** @type {boolean} */
    this._aborted = true;
    this._clearTimer();
    if (this._xmlHttpRequest && !this._responseAvailable) {
      /** @type {function(): undefined} */
      this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
      this._xmlHttpRequest.abort();
      /** @type {null} */
      this._xmlHttpRequest = null;
      this._webRequest.completed(Sys.EventArgs.Empty);
    }
  }
};
Sys.Net.XMLHttpExecutor.registerClass("Sys.Net.XMLHttpExecutor", Sys.Net.WebRequestExecutor);
/**
 * @return {undefined}
 */
Sys.Net._WebRequestManager = function() {
  /** @type {number} */
  this._defaultTimeout = 0;
  /** @type {string} */
  this._defaultExecutorType = "Sys.Net.XMLHttpExecutor";
};
Sys.Net._WebRequestManager.prototype = {
  add_invokingRequest : function(type) {
    this._get_eventHandlerList().addHandler("invokingRequest", type);
  },
  remove_invokingRequest : function(fn) {
    this._get_eventHandlerList().removeHandler("invokingRequest", fn);
  },
  add_completedRequest : function(type) {
    this._get_eventHandlerList().addHandler("completedRequest", type);
  },
  remove_completedRequest : function(fn) {
    this._get_eventHandlerList().removeHandler("completedRequest", fn);
  },
  _get_eventHandlerList : function() {
    if (!this._events) {
      this._events = new Sys.EventHandlerList;
    }
    return this._events;
  },
  get_defaultTimeout : function() {
    return this._defaultTimeout;
  },
  set_defaultTimeout : function(timeout) {
    /** @type {number} */
    this._defaultTimeout = timeout;
  },
  get_defaultExecutorType : function() {
    return this._defaultExecutorType;
  },
  set_defaultExecutorType : function(a) {
    /** @type {!Array} */
    this._defaultExecutorType = a;
  },
  executeRequest : function(webRequest$jscomp$0) {
    var executor$jscomp$0 = webRequest$jscomp$0.get_executor();
    if (!executor$jscomp$0) {
      /** @type {boolean} */
      var failed$jscomp$0 = false;
      try {
        /** @type {*} */
        var executorType$jscomp$0 = eval(this._defaultExecutorType);
        executor$jscomp$0 = new executorType$jscomp$0;
      } catch (a) {
        /** @type {boolean} */
        failed$jscomp$0 = true;
      }
      webRequest$jscomp$0.set_executor(executor$jscomp$0);
    }
    if (executor$jscomp$0.get_aborted()) {
      return;
    }
    var evArgs$jscomp$0 = new Sys.Net.NetworkRequestEventArgs(webRequest$jscomp$0);
    var handler$jscomp$3 = this._get_eventHandlerList().getHandler("invokingRequest");
    if (handler$jscomp$3) {
      handler$jscomp$3(this, evArgs$jscomp$0);
    }
    if (!evArgs$jscomp$0.get_cancel()) {
      executor$jscomp$0.executeRequest();
    }
  }
};
Sys.Net._WebRequestManager.registerClass("Sys.Net._WebRequestManager");
Sys.Net.WebRequestManager = new Sys.Net._WebRequestManager;
/**
 * @param {!Object} a
 * @return {undefined}
 */
Sys.Net.NetworkRequestEventArgs = function(a) {
  Sys.Net.NetworkRequestEventArgs.initializeBase(this);
  /** @type {!Object} */
  this._webRequest = a;
};
Sys.Net.NetworkRequestEventArgs.prototype = {
  get_webRequest : function() {
    return this._webRequest;
  }
};
Sys.Net.NetworkRequestEventArgs.registerClass("Sys.Net.NetworkRequestEventArgs", Sys.CancelEventArgs);
/**
 * @return {undefined}
 */
Sys.Net.WebRequest = function() {
  /** @type {string} */
  this._url = "";
  this._headers = {};
  /** @type {null} */
  this._body = null;
  /** @type {null} */
  this._userContext = null;
  /** @type {null} */
  this._httpVerb = null;
  /** @type {null} */
  this._executor = null;
  /** @type {boolean} */
  this._invokeCalled = false;
  /** @type {number} */
  this._timeout = 0;
};
Sys.Net.WebRequest.prototype = {
  add_completed : function(type) {
    this._get_eventHandlerList().addHandler("completed", type);
  },
  remove_completed : function(fn) {
    this._get_eventHandlerList().removeHandler("completed", fn);
  },
  completed : function(e) {
    var _reject = Sys.Net.WebRequestManager._get_eventHandlerList().getHandler("completedRequest");
    if (_reject) {
      _reject(this._executor, e);
    }
    _reject = this._get_eventHandlerList().getHandler("completed");
    if (_reject) {
      _reject(this._executor, e);
    }
  },
  _get_eventHandlerList : function() {
    if (!this._events) {
      this._events = new Sys.EventHandlerList;
    }
    return this._events;
  },
  get_url : function() {
    return this._url;
  },
  set_url : function(url) {
    /** @type {string} */
    this._url = url;
  },
  get_headers : function() {
    return this._headers;
  },
  get_httpVerb : function() {
    if (this._httpVerb === null) {
      if (this._body === null) {
        return "GET";
      }
      return "POST";
    }
    return this._httpVerb;
  },
  set_httpVerb : function(a) {
    /** @type {(Object|boolean|string)} */
    this._httpVerb = a;
  },
  get_body : function() {
    return this._body;
  },
  set_body : function(body) {
    /** @type {string} */
    this._body = body;
  },
  get_userContext : function() {
    return this._userContext;
  },
  set_userContext : function(a) {
    /** @type {string} */
    this._userContext = a;
  },
  get_executor : function() {
    return this._executor;
  },
  set_executor : function(executor) {
    /** @type {!AudioNode} */
    this._executor = executor;
    this._executor._set_webRequest(this);
  },
  get_timeout : function() {
    if (this._timeout === 0) {
      return Sys.Net.WebRequestManager.get_defaultTimeout();
    }
    return this._timeout;
  },
  set_timeout : function(timeout) {
    /** @type {number} */
    this._timeout = timeout;
  },
  getResolvedUrl : function() {
    return Sys.Net.WebRequest._resolveUrl(this._url);
  },
  invoke : function() {
    Sys.Net.WebRequestManager.executeRequest(this);
    /** @type {boolean} */
    this._invokeCalled = true;
  }
};
/**
 * @param {string} base
 * @param {string} url
 * @return {?}
 */
Sys.Net.WebRequest._resolveUrl = function(base, url) {
  if (base && base.indexOf("://") !== -1) {
    return base;
  }
  if (!url || url.length === 0) {
    /** @type {!Element} */
    var el = document.getElementsByTagName("base")[0];
    if (el && el.href && el.href.length > 0) {
      url = el.href;
    } else {
      /** @type {string} */
      url = document.URL;
    }
  }
  var indexSpace = url.indexOf("?");
  if (indexSpace !== -1) {
    url = url.substr(0, indexSpace);
  }
  indexSpace = url.indexOf("#");
  if (indexSpace !== -1) {
    url = url.substr(0, indexSpace);
  }
  url = url.substr(0, url.lastIndexOf("/") + 1);
  if (!base || base.length === 0) {
    return url;
  }
  if (base.charAt(0) === "/") {
    var cpl = url.indexOf("://");
    var hashNdx = url.indexOf("/", cpl + 3);
    return url.substr(0, hashNdx) + base;
  } else {
    var index = url.lastIndexOf("/");
    return url.substr(0, index + 1) + base;
  }
};
/**
 * @param {!Array} params
 * @param {string} el
 * @param {string} map
 * @return {?}
 */
Sys.Net.WebRequest._createQueryString = function(params, el, map) {
  el = el || encodeURIComponent;
  /** @type {number} */
  var key = 0;
  var parent;
  var div;
  var i;
  var layer = new Sys.StringBuilder;
  if (params) {
    for (i in params) {
      parent = params[i];
      if (typeof parent === "function") {
        continue;
      }
      div = Sys.Serialization.JavaScriptSerializer.serialize(parent);
      if (key++) {
        layer.append("&");
      }
      layer.append(i);
      layer.append("=");
      layer.append(el(div));
    }
  }
  if (map) {
    if (key) {
      layer.append("&");
    }
    layer.append(map);
  }
  return layer.toString();
};
/**
 * @param {string} url
 * @param {!Array} params
 * @param {string} opts
 * @return {?}
 */
Sys.Net.WebRequest._createUrl = function(url, params, opts) {
  if (!params && !opts) {
    return url;
  }
  var query = Sys.Net.WebRequest._createQueryString(params, null, opts);
  return query.length ? url + (url && url.indexOf("?") >= 0 ? "&" : "?") + query : url;
};
Sys.Net.WebRequest.registerClass("Sys.Net.WebRequest");
/**
 * @param {string} b
 * @param {!Object} variableNames
 * @return {undefined}
 */
Sys._ScriptLoaderTask = function(b, variableNames) {
  /** @type {string} */
  this._scriptElement = b;
  /** @type {!Object} */
  this._completedCallback = variableNames;
};
Sys._ScriptLoaderTask.prototype = {
  get_scriptElement : function() {
    return this._scriptElement;
  },
  dispose : function() {
    if (this._disposed) {
      return;
    }
    /** @type {boolean} */
    this._disposed = true;
    this._removeScriptElementHandlers();
    Sys._ScriptLoaderTask._clearScript(this._scriptElement);
    /** @type {null} */
    this._scriptElement = null;
  },
  execute : function() {
    if (this._ensureReadyStateLoaded()) {
      this._executeInternal();
    }
  },
  _executeInternal : function() {
    this._addScriptElementHandlers();
    document.getElementsByTagName("head")[0].appendChild(this._scriptElement);
  },
  _ensureReadyStateLoaded : function() {
    if (this._useReadyState() && this._scriptElement.readyState !== "loaded" && this._scriptElement.readyState !== "complete") {
      this._scriptDownloadDelegate = Function.createDelegate(this, this._executeInternal);
      $addHandler(this._scriptElement, "readystatechange", this._scriptDownloadDelegate);
      return false;
    }
    return true;
  },
  _addScriptElementHandlers : function() {
    if (this._scriptDownloadDelegate) {
      $removeHandler(this._scriptElement, "readystatechange", this._scriptDownloadDelegate);
      /** @type {null} */
      this._scriptDownloadDelegate = null;
    }
    this._scriptLoadDelegate = Function.createDelegate(this, this._scriptLoadHandler);
    if (this._useReadyState()) {
      $addHandler(this._scriptElement, "readystatechange", this._scriptLoadDelegate);
    } else {
      $addHandler(this._scriptElement, "load", this._scriptLoadDelegate);
    }
    if (this._scriptElement.addEventListener) {
      this._scriptErrorDelegate = Function.createDelegate(this, this._scriptErrorHandler);
      this._scriptElement.addEventListener("error", this._scriptErrorDelegate, false);
    }
  },
  _removeScriptElementHandlers : function() {
    if (this._scriptLoadDelegate) {
      var associatedElement = this.get_scriptElement();
      if (this._scriptDownloadDelegate) {
        $removeHandler(this._scriptElement, "readystatechange", this._scriptDownloadDelegate);
        /** @type {null} */
        this._scriptDownloadDelegate = null;
      }
      if (this._useReadyState() && this._scriptLoadDelegate) {
        $removeHandler(associatedElement, "readystatechange", this._scriptLoadDelegate);
      } else {
        $removeHandler(associatedElement, "load", this._scriptLoadDelegate);
      }
      if (this._scriptErrorDelegate) {
        this._scriptElement.removeEventListener("error", this._scriptErrorDelegate, false);
        /** @type {null} */
        this._scriptErrorDelegate = null;
      }
      /** @type {null} */
      this._scriptLoadDelegate = null;
    }
  },
  _scriptErrorHandler : function() {
    if (this._disposed) {
      return;
    }
    this._completedCallback(this.get_scriptElement(), false);
  },
  _scriptLoadHandler : function() {
    if (this._disposed) {
      return;
    }
    var scriptElem = this.get_scriptElement();
    if (this._useReadyState() && scriptElem.readyState !== "complete") {
      return;
    }
    this._completedCallback(scriptElem, true);
  },
  _useReadyState : function() {
    return Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version < 9 || (document.documentMode || 0) < 9);
  }
};
Sys._ScriptLoaderTask.registerClass("Sys._ScriptLoaderTask", null, Sys.IDisposable);
/**
 * @param {!Node} gapiEl
 * @return {undefined}
 */
Sys._ScriptLoaderTask._clearScript = function(gapiEl) {
  if (!Sys.Debug.isDebug && gapiEl.parentNode) {
    gapiEl.parentNode.removeChild(gapiEl);
  }
};
Type.registerNamespace("Sys.Net");
/**
 * @return {undefined}
 */
Sys.Net.WebServiceProxy = function() {
};
Sys.Net.WebServiceProxy.prototype = {
  get_timeout : function() {
    return this._timeout || 0;
  },
  set_timeout : function(type) {
    if (type < 0) {
      throw Error.argumentOutOfRange("value", type, Sys.Res.invalidTimeout);
    }
    /** @type {number} */
    this._timeout = type;
  },
  get_defaultUserContext : function() {
    return typeof this._userContext === "undefined" ? null : this._userContext;
  },
  set_defaultUserContext : function(a) {
    /** @type {string} */
    this._userContext = a;
  },
  get_defaultSucceededCallback : function() {
    return this._succeeded || null;
  },
  set_defaultSucceededCallback : function(a) {
    /** @type {string} */
    this._succeeded = a;
  },
  get_defaultFailedCallback : function() {
    return this._failed || null;
  },
  set_defaultFailedCallback : function(x) {
    /** @type {string} */
    this._failed = x;
  },
  get_enableJsonp : function() {
    return !!this._jsonp;
  },
  set_enableJsonp : function(a) {
    /** @type {number} */
    this._jsonp = a;
  },
  get_path : function() {
    return this._path || null;
  },
  set_path : function(path) {
    /** @type {string} */
    this._path = path;
  },
  get_jsonpCallbackParameter : function() {
    return this._callbackParameter || "callback";
  },
  set_jsonpCallbackParameter : function(a) {
    /** @type {!Function} */
    this._callbackParameter = a;
  },
  _invoke : function(method, context, args, options, cb, next, callback) {
    cb = cb || this.get_defaultSucceededCallback();
    next = next || this.get_defaultFailedCallback();
    if (callback === null || typeof callback === "undefined") {
      callback = this.get_defaultUserContext();
    }
    return Sys.Net.WebServiceProxy.invoke(method, context, args, options, cb, next, callback, this.get_timeout(), this.get_enableJsonp(), this.get_jsonpCallbackParameter());
  }
};
Sys.Net.WebServiceProxy.registerClass("Sys.Net.WebServiceProxy");
/**
 * @param {string} name
 * @param {boolean} id
 * @param {string} end
 * @param {!Object} response
 * @param {(Array|HTMLCollection|Node|NodeList|Window|string)} func
 * @param {(Array|HTMLCollection|Node|NodeList|Window|string)} cb
 * @param {number} socket
 * @param {number} timeout
 * @param {boolean} type
 * @param {string} context
 * @return {?}
 */
Sys.Net.WebServiceProxy.invoke = function(name, id, end, response, func, cb, socket, timeout, type, context) {
  /**
   * @param {!XMLHttpRequest} sender
   * @return {undefined}
   */
  function callback(sender) {
    if (sender.get_responseAvailable()) {
      var rewrapSources = sender.get_statusCode();
      /** @type {null} */
      var result = null;
      try {
        var contentType = sender.getResponseHeader("Content-Type");
        if (contentType.startsWith("application/json")) {
          result = sender.get_object();
        } else {
          if (contentType.startsWith("text/xml")) {
            result = sender.get_xml();
          } else {
            result = sender.get_responseData();
          }
        }
      } catch (m) {
      }
      var valString = sender.getResponseHeader("jsonerror");
      /** @type {boolean} */
      var valBool = valString === "true";
      if (valBool) {
        if (result) {
          result = new Sys.Net.WebServiceError(false, result.Message, result.StackTrace, result.ExceptionType, result);
        }
      } else {
        if (contentType.startsWith("application/json")) {
          result = !result || typeof result.d === "undefined" ? result : result.d;
        }
      }
      if (rewrapSources < 200 || rewrapSources >= 300 || valBool) {
        if (cb) {
          if (!result || !valBool) {
            result = new Sys.Net.WebServiceError(false, String.format(Sys.Res.webServiceFailedNoMsg, id));
          }
          result._statusCode = rewrapSources;
          cb(result, socket, id);
        }
      } else {
        if (func) {
          func(result, socket, id);
        }
      }
    } else {
      var parsed;
      if (sender.get_timedOut()) {
        parsed = String.format(Sys.Res.webServiceTimedOut, id);
      } else {
        parsed = String.format(Sys.Res.webServiceFailedNoMsg, id);
      }
      if (cb) {
        cb(new Sys.Net.WebServiceError(sender.get_timedOut(), parsed, "", ""), socket, id);
      }
    }
  }
  /** @type {(Array<string>|null)} */
  var parts = type !== false ? Sys.Net.WebServiceProxy._xdomain.exec(name) : null;
  var msgid;
  /** @type {(boolean|null)} */
  var start = parts && parts.length === 3 && (parts[1] !== location.protocol || parts[2] !== location.host);
  end = start || end;
  if (start) {
    context = context || "callback";
    /** @type {string} */
    msgid = "_jsonp" + Sys._jsonp++;
  }
  if (!response) {
    response = {};
  }
  /** @type {!Object} */
  var attrs = response;
  if (!end || !attrs) {
    attrs = {};
  }
  var scriptElement;
  var res;
  /** @type {null} */
  var timeoutId = null;
  var noiseSynth;
  /** @type {null} */
  var body = null;
  var url = Sys.Net.WebRequest._createUrl(id ? name + "/" + encodeURIComponent(id) : name, attrs, start ? context + "=Sys." + msgid : null);
  if (start) {
    /**
     * @param {number} result
     * @param {number} e
     * @return {undefined}
     */
    var callback = function(result, e) {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        /** @type {null} */
        timeoutId = null;
      }
      noiseSynth.dispose();
      delete Sys[msgid];
      /** @type {null} */
      msgid = null;
      if (typeof e !== "undefined" && e !== 200) {
        if (cb) {
          res = new Sys.Net.WebServiceError(false, result.Message || String.format(Sys.Res.webServiceFailedNoMsg, id), result.StackTrace || null, result.ExceptionType || null, result);
          /** @type {number} */
          res._statusCode = e;
          cb(res, socket, id);
        }
      } else {
        if (func) {
          func(result, socket, id);
        }
      }
    };
    /**
     * @return {undefined}
     */
    var finish = function() {
      if (timeoutId === null) {
        return;
      }
      /** @type {null} */
      timeoutId = null;
      res = new Sys.Net.WebServiceError(true, String.format(Sys.Res.webServiceTimedOut, id));
      noiseSynth.dispose();
      delete Sys[msgid];
      if (cb) {
        cb(res, socket, id);
      }
    };
    /** @type {!Element} */
    scriptElement = document.createElement("script");
    scriptElement.src = url;
    noiseSynth = new Sys._ScriptLoaderTask(scriptElement, function(canCreateDiscussions, b) {
      if (!b || msgid) {
        callback({
          Message : String.format(Sys.Res.webServiceFailedNoMsg, id)
        }, -1);
      }
    });
    /** @type {function(number, number): undefined} */
    Sys[msgid] = callback;
    timeout = timeout || Sys.Net.WebRequestManager.get_defaultTimeout();
    if (timeout > 0) {
      timeoutId = window.setTimeout(finish, timeout);
    }
    noiseSynth.execute();
    return null;
  }
  var request = new Sys.Net.WebRequest;
  request.set_url(url);
  /** @type {string} */
  request.get_headers()["Content-Type"] = "application/json; charset=utf-8";
  if (!end) {
    body = Sys.Serialization.JavaScriptSerializer.serialize(response);
    if (body === "{}") {
      /** @type {string} */
      body = "";
    }
  }
  request.set_body(body);
  request.add_completed(callback);
  if (timeout && timeout > 0) {
    request.set_timeout(timeout);
  }
  request.invoke();
  return request;
};
/**
 * @param {string} value
 * @return {?}
 */
Sys.Net.WebServiceProxy._generateTypedConstructor = function(value) {
  return function(gistCommentData) {
    if (gistCommentData) {
      var prop;
      for (prop in gistCommentData) {
        this[prop] = gistCommentData[prop];
      }
    }
    /** @type {string} */
    this.__type = value;
  };
};
/** @type {number} */
Sys._jsonp = 0;
/** @type {!RegExp} */
Sys.Net.WebServiceProxy._xdomain = /^\s*([a-zA-Z0-9\+\-\.]+:)\/\/([^?#\/]+)/;
/**
 * @param {boolean} replyToken
 * @param {string} message
 * @param {string} stackTrace
 * @param {?} requestId
 * @param {string} playerMetadata
 * @return {undefined}
 */
Sys.Net.WebServiceError = function(replyToken, message, stackTrace, requestId, playerMetadata) {
  /** @type {boolean} */
  this._timedOut = replyToken;
  /** @type {string} */
  this._message = message;
  /** @type {string} */
  this._stackTrace = stackTrace;
  this._exceptionType = requestId;
  /** @type {string} */
  this._errorObject = playerMetadata;
  /** @type {number} */
  this._statusCode = -1;
};
Sys.Net.WebServiceError.prototype = {
  get_timedOut : function() {
    return this._timedOut;
  },
  get_statusCode : function() {
    return this._statusCode;
  },
  get_message : function() {
    return this._message;
  },
  get_stackTrace : function() {
    return this._stackTrace || "";
  },
  get_exceptionType : function() {
    return this._exceptionType || "";
  },
  get_errorObject : function() {
    return this._errorObject || null;
  }
};
Sys.Net.WebServiceError.registerClass("Sys.Net.WebServiceError");
Type.registerNamespace("Sys");
Sys.Res = {
  "argumentInteger" : "Value must be an integer.",
  "invokeCalledTwice" : "Cannot call invoke more than once.",
  "webServiceFailed" : "The server method '{0}' failed with the following error: {1}",
  "argumentType" : "Object cannot be converted to the required type.",
  "argumentNull" : "Value cannot be null.",
  "scriptAlreadyLoaded" : "The script '{0}' has been referenced multiple times. If referencing Microsoft AJAX scripts explicitly, set the MicrosoftAjaxMode property of the ScriptManager to Explicit.",
  "scriptDependencyNotFound" : "The script '{0}' failed to load because it is dependent on script '{1}'.",
  "formatBadFormatSpecifier" : "Format specifier was invalid.",
  "requiredScriptReferenceNotIncluded" : "'{0}' requires that you have included a script reference to '{1}'.",
  "webServiceFailedNoMsg" : "The server method '{0}' failed.",
  "argumentDomElement" : "Value must be a DOM element.",
  "invalidExecutorType" : "Could not create a valid Sys.Net.WebRequestExecutor from: {0}.",
  "cannotCallBeforeResponse" : "Cannot call {0} when responseAvailable is false.",
  "actualValue" : "Actual value was {0}.",
  "enumInvalidValue" : "'{0}' is not a valid value for enum {1}.",
  "scriptLoadFailed" : "The script '{0}' could not be loaded.",
  "parameterCount" : "Parameter count mismatch.",
  "cannotDeserializeEmptyString" : "Cannot deserialize empty string.",
  "formatInvalidString" : "Input string was not in a correct format.",
  "invalidTimeout" : "Value must be greater than or equal to zero.",
  "cannotAbortBeforeStart" : "Cannot abort when executor has not started.",
  "argument" : "Value does not fall within the expected range.",
  "cannotDeserializeInvalidJson" : "Cannot deserialize. The data does not correspond to valid JSON.",
  "invalidHttpVerb" : "httpVerb cannot be set to an empty or null string.",
  "nullWebRequest" : "Cannot call executeRequest with a null webRequest.",
  "eventHandlerInvalid" : "Handler was not added through the Sys.UI.DomEvent.addHandler method.",
  "cannotSerializeNonFiniteNumbers" : "Cannot serialize non finite numbers.",
  "argumentUndefined" : "Value cannot be undefined.",
  "webServiceInvalidReturnType" : "The server method '{0}' returned an invalid type. Expected type: {1}",
  "servicePathNotSet" : "The path to the web service has not been set.",
  "argumentTypeWithTypes" : "Object of type '{0}' cannot be converted to type '{1}'.",
  "cannotCallOnceStarted" : "Cannot call {0} once started.",
  "badBaseUrl1" : "Base URL does not contain ://.",
  "badBaseUrl2" : "Base URL does not contain another /.",
  "badBaseUrl3" : "Cannot find last / in base URL.",
  "setExecutorAfterActive" : "Cannot set executor after it has become active.",
  "paramName" : "Parameter name: {0}",
  "nullReferenceInPath" : "Null reference while evaluating data path: '{0}'.",
  "cannotCallOutsideHandler" : "Cannot call {0} outside of a completed event handler.",
  "cannotSerializeObjectWithCycle" : "Cannot serialize object with cyclic reference within child properties.",
  "format" : "One of the identified items was in an invalid format.",
  "assertFailedCaller" : "Assertion Failed: {0}\r\nat {1}",
  "argumentOutOfRange" : "Specified argument was out of the range of valid values.",
  "webServiceTimedOut" : "The server method '{0}' timed out.",
  "notImplemented" : "The method or operation is not implemented.",
  "assertFailed" : "Assertion Failed: {0}",
  "invalidOperation" : "Operation is not valid due to the current state of the object.",
  "breakIntoDebugger" : "{0}\r\n\r\nBreak into debugger?"
};
