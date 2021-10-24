'use strict';
/**
 * @param {!Object} eventTarget
 * @param {?} eventArgument
 * @param {!Object} validation
 * @param {?} validationGroup
 * @param {string} actionUrl
 * @param {?} trackFocus
 * @param {?} clientSubmit
 * @return {undefined}
 */
function WebForm_PostBackOptions(eventTarget, eventArgument, validation, validationGroup, actionUrl, trackFocus, clientSubmit) {
  /** @type {!Object} */
  this.eventTarget = eventTarget;
  this.eventArgument = eventArgument;
  /** @type {!Object} */
  this.validation = validation;
  this.validationGroup = validationGroup;
  /** @type {string} */
  this.actionUrl = actionUrl;
  this.trackFocus = trackFocus;
  this.clientSubmit = clientSubmit;
}
/**
 * @param {!Object} options
 * @return {undefined}
 */
function WebForm_DoPostBackWithOptions(options) {
  /** @type {boolean} */
  var validationResult = true;
  if (options.validation) {
    if (typeof Page_ClientValidate == "function") {
      validationResult = Page_ClientValidate(options.validationGroup);
    }
  }
  if (validationResult) {
    if (typeof options.actionUrl != "undefined" && options.actionUrl != null && options.actionUrl.length > 0) {
      theForm.action = options.actionUrl;
    }
    if (options.trackFocus) {
      var lastFocus = theForm.elements["__LASTFOCUS"];
      if (typeof lastFocus != "undefined" && lastFocus != null) {
        if (typeof document.activeElement == "undefined") {
          lastFocus.value = options.eventTarget;
        } else {
          var active = document.activeElement;
          if (typeof active != "undefined" && active != null) {
            if (typeof active.id != "undefined" && active.id != null && active.id.length > 0) {
              lastFocus.value = active.id;
            } else {
              if (typeof active.name != "undefined") {
                lastFocus.value = active.name;
              }
            }
          }
        }
      }
    }
  }
  if (options.clientSubmit) {
    __doPostBack(options.eventTarget, options.eventArgument);
  }
}
/** @type {!Array} */
var __pendingCallbacks = new Array;
/** @type {number} */
var __synchronousCallBackIndex = -1;
/**
 * @param {!Object} eventTarget
 * @param {!Object} eventArgument
 * @param {!Function} eventCallback
 * @param {!Object} context
 * @param {!Function} errorCallback
 * @param {!Object} useAsync
 * @return {undefined}
 */
function WebForm_DoCallback(eventTarget, eventArgument, eventCallback, context, errorCallback, useAsync) {
  /** @type {string} */
  var postData = __theFormPostData + "__CALLBACKID=" + WebForm_EncodeCallback(eventTarget) + "&__CALLBACKPARAM=" + WebForm_EncodeCallback(eventArgument);
  if (theForm["__EVENTVALIDATION"]) {
    /** @type {string} */
    postData = postData + ("&__EVENTVALIDATION=" + WebForm_EncodeCallback(theForm["__EVENTVALIDATION"].value));
  }
  var xmlRequest;
  var e;
  try {
    /** @type {!XMLHttpRequest} */
    xmlRequest = new XMLHttpRequest;
  } catch (e) {
    try {
      xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {
    }
  }
  /** @type {boolean} */
  var setRequestHeaderMethodExists = true;
  try {
    setRequestHeaderMethodExists = xmlRequest && xmlRequest.setRequestHeader;
  } catch (e) {
  }
  /** @type {!Object} */
  var callback = new Object;
  /** @type {!Function} */
  callback.eventCallback = eventCallback;
  /** @type {!Object} */
  callback.context = context;
  /** @type {!Function} */
  callback.errorCallback = errorCallback;
  /** @type {!Object} */
  callback.async = useAsync;
  var callbackIndex = WebForm_FillFirstAvailableSlot(__pendingCallbacks, callback);
  if (!useAsync) {
    if (__synchronousCallBackIndex != -1) {
      /** @type {null} */
      __pendingCallbacks[__synchronousCallBackIndex] = null;
    }
    __synchronousCallBackIndex = callbackIndex;
  }
  if (setRequestHeaderMethodExists) {
    /** @type {function(): undefined} */
    xmlRequest.onreadystatechange = WebForm_CallbackComplete;
    callback.xmlRequest = xmlRequest;
    var action = theForm.action || document.location.pathname;
    var fragmentIndex = action.indexOf("#");
    if (fragmentIndex !== -1) {
      action = action.substr(0, fragmentIndex);
    }
    if (!__nonMSDOMBrowser) {
      var queryIndex = action.indexOf("?");
      if (queryIndex !== -1) {
        var path = action.substr(0, queryIndex);
        if (path.indexOf("%") === -1) {
          /** @type {string} */
          action = encodeURI(path) + action.substr(queryIndex);
        }
      } else {
        if (action.indexOf("%") === -1) {
          /** @type {string} */
          action = encodeURI(action);
        }
      }
    }
    xmlRequest.open("POST", action, true);
    xmlRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    xmlRequest.send(postData);
    return;
  }
  /** @type {!Object} */
  callback.xmlRequest = new Object;
  /** @type {string} */
  var callbackFrameID = "__CALLBACKFRAME" + callbackIndex;
  var xmlRequestFrame = document.frames[callbackFrameID];
  if (!xmlRequestFrame) {
    /** @type {!Element} */
    xmlRequestFrame = document.createElement("IFRAME");
    /** @type {string} */
    xmlRequestFrame.width = "1";
    /** @type {string} */
    xmlRequestFrame.height = "1";
    /** @type {string} */
    xmlRequestFrame.frameBorder = "0";
    /** @type {string} */
    xmlRequestFrame.id = callbackFrameID;
    /** @type {string} */
    xmlRequestFrame.name = callbackFrameID;
    /** @type {string} */
    xmlRequestFrame.style.position = "absolute";
    /** @type {string} */
    xmlRequestFrame.style.top = "-100px";
    /** @type {string} */
    xmlRequestFrame.style.left = "-100px";
    try {
      if (callBackFrameUrl) {
        xmlRequestFrame.src = callBackFrameUrl;
      }
    } catch (e) {
    }
    document.body.appendChild(xmlRequestFrame);
  }
  var interval = window.setInterval(function() {
    xmlRequestFrame = document.frames[callbackFrameID];
    if (xmlRequestFrame && xmlRequestFrame.document) {
      window.clearInterval(interval);
      xmlRequestFrame.document.write("");
      xmlRequestFrame.document.close();
      xmlRequestFrame.document.write('<html><body><form method="post"><input type="hidden" name="__CALLBACKLOADSCRIPT" value="t"></form></body></html>');
      xmlRequestFrame.document.close();
      xmlRequestFrame.document.forms[0].action = theForm.action;
      var count = __theFormPostCollection.length;
      var element;
      /** @type {number} */
      var i = 0;
      for (; i < count; i++) {
        element = __theFormPostCollection[i];
        if (element) {
          var fieldElement = xmlRequestFrame.document.createElement("INPUT");
          /** @type {string} */
          fieldElement.type = "hidden";
          fieldElement.name = element.name;
          fieldElement.value = element.value;
          xmlRequestFrame.document.forms[0].appendChild(fieldElement);
        }
      }
      var callbackIdFieldElement = xmlRequestFrame.document.createElement("INPUT");
      /** @type {string} */
      callbackIdFieldElement.type = "hidden";
      /** @type {string} */
      callbackIdFieldElement.name = "__CALLBACKID";
      /** @type {!Object} */
      callbackIdFieldElement.value = eventTarget;
      xmlRequestFrame.document.forms[0].appendChild(callbackIdFieldElement);
      var callbackParamFieldElement = xmlRequestFrame.document.createElement("INPUT");
      /** @type {string} */
      callbackParamFieldElement.type = "hidden";
      /** @type {string} */
      callbackParamFieldElement.name = "__CALLBACKPARAM";
      /** @type {!Object} */
      callbackParamFieldElement.value = eventArgument;
      xmlRequestFrame.document.forms[0].appendChild(callbackParamFieldElement);
      if (theForm["__EVENTVALIDATION"]) {
        var callbackValidationFieldElement = xmlRequestFrame.document.createElement("INPUT");
        /** @type {string} */
        callbackValidationFieldElement.type = "hidden";
        /** @type {string} */
        callbackValidationFieldElement.name = "__EVENTVALIDATION";
        callbackValidationFieldElement.value = theForm["__EVENTVALIDATION"].value;
        xmlRequestFrame.document.forms[0].appendChild(callbackValidationFieldElement);
      }
      var callbackIndexFieldElement = xmlRequestFrame.document.createElement("INPUT");
      /** @type {string} */
      callbackIndexFieldElement.type = "hidden";
      /** @type {string} */
      callbackIndexFieldElement.name = "__CALLBACKINDEX";
      callbackIndexFieldElement.value = callbackIndex;
      xmlRequestFrame.document.forms[0].appendChild(callbackIndexFieldElement);
      xmlRequestFrame.document.forms[0].submit();
    }
  }, 10);
}
/**
 * @return {undefined}
 */
function WebForm_CallbackComplete() {
  /** @type {number} */
  var i = 0;
  for (; i < __pendingCallbacks.length; i++) {
    callbackObject = __pendingCallbacks[i];
    if (callbackObject && callbackObject.xmlRequest && callbackObject.xmlRequest.readyState == 4) {
      if (!__pendingCallbacks[i].async) {
        /** @type {number} */
        __synchronousCallBackIndex = -1;
      }
      /** @type {null} */
      __pendingCallbacks[i] = null;
      /** @type {string} */
      var callbackFrameID = "__CALLBACKFRAME" + i;
      /** @type {(Element|null)} */
      var xmlRequestFrame = document.getElementById(callbackFrameID);
      if (xmlRequestFrame) {
        xmlRequestFrame.parentNode.removeChild(xmlRequestFrame);
      }
      WebForm_ExecuteCallback(callbackObject);
    }
  }
}
/**
 * @param {!Object} callbackObject
 * @return {undefined}
 */
function WebForm_ExecuteCallback(callbackObject) {
  var response = callbackObject.xmlRequest.responseText;
  if (response.charAt(0) == "s") {
    if (typeof callbackObject.eventCallback != "undefined" && callbackObject.eventCallback != null) {
      callbackObject.eventCallback(response.substring(1), callbackObject.context);
    }
  } else {
    if (response.charAt(0) == "e") {
      if (typeof callbackObject.errorCallback != "undefined" && callbackObject.errorCallback != null) {
        callbackObject.errorCallback(response.substring(1), callbackObject.context);
      }
    } else {
      var separatorIndex = response.indexOf("|");
      if (separatorIndex != -1) {
        /** @type {number} */
        var validationFieldLength = parseInt(response.substring(0, separatorIndex));
        if (!isNaN(validationFieldLength)) {
          var validationField = response.substring(separatorIndex + 1, separatorIndex + validationFieldLength + 1);
          if (validationField != "") {
            var validationFieldElement = theForm["__EVENTVALIDATION"];
            if (!validationFieldElement) {
              /** @type {!Element} */
              validationFieldElement = document.createElement("INPUT");
              /** @type {string} */
              validationFieldElement.type = "hidden";
              /** @type {string} */
              validationFieldElement.name = "__EVENTVALIDATION";
              theForm.appendChild(validationFieldElement);
            }
            validationFieldElement.value = validationField;
          }
          if (typeof callbackObject.eventCallback != "undefined" && callbackObject.eventCallback != null) {
            callbackObject.eventCallback(response.substring(separatorIndex + validationFieldLength + 1), callbackObject.context);
          }
        }
      }
    }
  }
}
/**
 * @param {!Array} array
 * @param {!Object} element
 * @return {?}
 */
function WebForm_FillFirstAvailableSlot(array, element) {
  var i;
  /** @type {number} */
  i = 0;
  for (; i < array.length; i++) {
    if (!array[i]) {
      break;
    }
  }
  /** @type {!Object} */
  array[i] = element;
  return i;
}
/** @type {boolean} */
var __nonMSDOMBrowser = window.navigator.appName.toLowerCase().indexOf("explorer") == -1;
/** @type {string} */
var __theFormPostData = "";
/** @type {!Array} */
var __theFormPostCollection = new Array;
/** @type {!RegExp} */
var __callbackTextTypes = /^(text|password|hidden|search|tel|url|email|number|range|color|datetime|date|month|week|time|datetime-local)$/i;
/**
 * @return {undefined}
 */
function WebForm_InitCallback() {
  var formElements = theForm.elements;
  var length = formElements.length;
  var element;
  /** @type {number} */
  var i = 0;
  for (; i < length; i++) {
    element = formElements[i];
    var name = element.tagName.toLowerCase();
    if (name == "input") {
      var type = element.type;
      if ((__callbackTextTypes.test(type) || (type == "checkbox" || type == "radio") && element.checked) && element.id != "__EVENTVALIDATION") {
        WebForm_InitCallbackAddField(element.name, element.value);
      }
    } else {
      if (name == "select") {
        var patchLen = element.options.length;
        /** @type {number} */
        var i = 0;
        for (; i < patchLen; i++) {
          var selectChild = element.options[i];
          if (selectChild.selected == true) {
            WebForm_InitCallbackAddField(element.name, element.value);
          }
        }
      } else {
        if (name == "textarea") {
          WebForm_InitCallbackAddField(element.name, element.value);
        }
      }
    }
  }
}
/**
 * @param {!Object} name
 * @param {!Object} value
 * @return {undefined}
 */
function WebForm_InitCallbackAddField(name, value) {
  /** @type {!Object} */
  var nameValue = new Object;
  /** @type {!Object} */
  nameValue.name = name;
  /** @type {!Object} */
  nameValue.value = value;
  /** @type {!Object} */
  __theFormPostCollection[__theFormPostCollection.length] = nameValue;
  __theFormPostData = __theFormPostData + (WebForm_EncodeCallback(name) + "=" + WebForm_EncodeCallback(value) + "&");
}
/**
 * @param {!Object} parameter
 * @return {?}
 */
function WebForm_EncodeCallback(parameter) {
  if (encodeURIComponent) {
    return encodeURIComponent(parameter);
  } else {
    return escape(parameter);
  }
}
/** @type {!Array} */
var __disabledControlArray = new Array;
/**
 * @return {?}
 */
function WebForm_ReEnableControls() {
  if (typeof __enabledControlArray == "undefined") {
    return false;
  }
  /** @type {number} */
  var disabledIndex = 0;
  /** @type {number} */
  var i = 0;
  for (; i < __enabledControlArray.length; i++) {
    var c;
    if (__nonMSDOMBrowser) {
      /** @type {(Element|null)} */
      c = document.getElementById(__enabledControlArray[i]);
    } else {
      c = document.all[__enabledControlArray[i]];
    }
    if (typeof c != "undefined" && c != null && c.disabled == true) {
      /** @type {boolean} */
      c.disabled = false;
      __disabledControlArray[disabledIndex++] = c;
    }
  }
  setTimeout("WebForm_ReDisableControls()", 0);
  return true;
}
/**
 * @return {undefined}
 */
function WebForm_ReDisableControls() {
  /** @type {number} */
  var i = 0;
  for (; i < __disabledControlArray.length; i++) {
    /** @type {boolean} */
    __disabledControlArray[i].disabled = true;
  }
}
/**
 * @param {!Object} element
 * @param {!Event} event
 * @return {?}
 */
function WebForm_SimulateClick(element, event) {
  var evt;
  if (element) {
    if (element.click) {
      element.click();
    } else {
      /** @type {(Event|null)} */
      evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      if (!element.dispatchEvent(evt)) {
        return true;
      }
    }
    /** @type {boolean} */
    event.cancelBubble = true;
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    return false;
  }
  return true;
}
/**
 * @param {!Event} event
 * @param {?} target
 * @return {?}
 */
function WebForm_FireDefaultButton(event, target) {
  if (event.keyCode == 13) {
    var src = event.srcElement || event.target;
    if (src && (src.tagName.toLowerCase() == "input" && (src.type.toLowerCase() == "submit" || src.type.toLowerCase() == "button")) || src.tagName.toLowerCase() == "a" && src.href != null && src.href != "" || src.tagName.toLowerCase() == "textarea") {
      return true;
    }
    var defaultButton;
    if (__nonMSDOMBrowser) {
      /** @type {(Element|null)} */
      defaultButton = document.getElementById(target);
    } else {
      defaultButton = document.all[target];
    }
    if (defaultButton) {
      return WebForm_SimulateClick(defaultButton, event);
    }
  }
  return true;
}
/**
 * @return {?}
 */
function WebForm_GetScrollX() {
  if (__nonMSDOMBrowser) {
    return window.pageXOffset;
  } else {
    if (document.documentElement && document.documentElement.scrollLeft) {
      return document.documentElement.scrollLeft;
    } else {
      if (document.body) {
        return document.body.scrollLeft;
      }
    }
  }
  return 0;
}
/**
 * @return {?}
 */
function WebForm_GetScrollY() {
  if (__nonMSDOMBrowser) {
    return window.pageYOffset;
  } else {
    if (document.documentElement && document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    } else {
      if (document.body) {
        return document.body.scrollTop;
      }
    }
  }
  return 0;
}
/**
 * @return {?}
 */
function WebForm_SaveScrollPositionSubmit() {
  if (__nonMSDOMBrowser) {
    /** @type {number} */
    theForm.elements["__SCROLLPOSITIONY"].value = window.pageYOffset;
    /** @type {number} */
    theForm.elements["__SCROLLPOSITIONX"].value = window.pageXOffset;
  } else {
    theForm.__SCROLLPOSITIONX.value = WebForm_GetScrollX();
    theForm.__SCROLLPOSITIONY.value = WebForm_GetScrollY();
  }
  if (typeof this.oldSubmit != "undefined" && this.oldSubmit != null) {
    return this.oldSubmit();
  }
  return true;
}
/**
 * @return {?}
 */
function WebForm_SaveScrollPositionOnSubmit() {
  theForm.__SCROLLPOSITIONX.value = WebForm_GetScrollX();
  theForm.__SCROLLPOSITIONY.value = WebForm_GetScrollY();
  if (typeof this.oldOnSubmit != "undefined" && this.oldOnSubmit != null) {
    return this.oldOnSubmit();
  }
  return true;
}
/**
 * @return {?}
 */
function WebForm_RestoreScrollPosition() {
  if (__nonMSDOMBrowser) {
    window.scrollTo(theForm.elements["__SCROLLPOSITIONX"].value, theForm.elements["__SCROLLPOSITIONY"].value);
  } else {
    window.scrollTo(theForm.__SCROLLPOSITIONX.value, theForm.__SCROLLPOSITIONY.value);
  }
  if (typeof theForm.oldOnLoad != "undefined" && theForm.oldOnLoad != null) {
    return theForm.oldOnLoad();
  }
  return true;
}
/**
 * @param {!Event} event
 * @return {?}
 */
function WebForm_TextBoxKeyHandler(event) {
  if (event.keyCode == 13) {
    var target;
    if (__nonMSDOMBrowser) {
      target = event.target;
    } else {
      target = event.srcElement;
    }
    if (typeof target != "undefined" && target != null) {
      if (typeof target.onchange != "undefined") {
        target.onchange();
        /** @type {boolean} */
        event.cancelBubble = true;
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        return false;
      }
    }
  }
  return true;
}
/**
 * @param {string} value
 * @return {?}
 */
function WebForm_TrimString(value) {
  return value.replace(/^\s+|\s+$/g, "");
}
/**
 * @param {!Object} element
 * @param {string} className
 * @return {undefined}
 */
function WebForm_AppendToClassName(element, className) {
  /** @type {string} */
  var related_node_ids = " " + WebForm_TrimString(element.className) + " ";
  className = WebForm_TrimString(className);
  /** @type {number} */
  var index = related_node_ids.indexOf(" " + className + " ");
  if (index === -1) {
    element.className = element.className === "" ? className : element.className + " " + className;
  }
}
/**
 * @param {!Object} element
 * @param {string} className
 * @return {undefined}
 */
function WebForm_RemoveClassName(element, className) {
  /** @type {string} */
  var currentClassName = " " + WebForm_TrimString(element.className) + " ";
  className = WebForm_TrimString(className);
  /** @type {number} */
  var index = currentClassName.indexOf(" " + className + " ");
  if (index >= 0) {
    element.className = WebForm_TrimString(currentClassName.substring(0, index) + " " + currentClassName.substring(index + className.length + 1, currentClassName.length));
  }
}
/**
 * @param {?} elementId
 * @return {?}
 */
function WebForm_GetElementById(elementId) {
  if (document.getElementById) {
    return document.getElementById(elementId);
  } else {
    if (document.all) {
      return document.all[elementId];
    } else {
      return null;
    }
  }
}
/**
 * @param {!Object} element
 * @param {!Object} tagName
 * @return {?}
 */
function WebForm_GetElementByTagName(element, tagName) {
  var elements = WebForm_GetElementsByTagName(element, tagName);
  if (elements && elements.length > 0) {
    return elements[0];
  } else {
    return null;
  }
}
/**
 * @param {!Object} element
 * @param {!Object} tagName
 * @return {?}
 */
function WebForm_GetElementsByTagName(element, tagName) {
  if (element && tagName) {
    if (element.getElementsByTagName) {
      return element.getElementsByTagName(tagName);
    }
    if (element.all && element.all.tags) {
      return element.all.tags(tagName);
    }
  }
  return null;
}
/**
 * @param {!Element} element
 * @return {?}
 */
function WebForm_GetElementDir(element) {
  if (element) {
    if (element.dir) {
      return element.dir;
    }
    return WebForm_GetElementDir(element.parentNode);
  }
  return "ltr";
}
/**
 * @param {!Object} element
 * @return {?}
 */
function WebForm_GetElementPosition(element) {
  /** @type {!Object} */
  var result = new Object;
  /** @type {number} */
  result.x = 0;
  /** @type {number} */
  result.y = 0;
  /** @type {number} */
  result.width = 0;
  /** @type {number} */
  result.height = 0;
  if (element.offsetParent) {
    result.x = element.offsetLeft;
    result.y = element.offsetTop;
    var parent = element.offsetParent;
    for (; parent;) {
      result.x += parent.offsetLeft;
      result.y += parent.offsetTop;
      var parentTagName = parent.tagName.toLowerCase();
      if (parentTagName != "table" && parentTagName != "body" && parentTagName != "html" && parentTagName != "div" && parent.clientTop && parent.clientLeft) {
        result.x += parent.clientLeft;
        result.y += parent.clientTop;
      }
      parent = parent.offsetParent;
    }
  } else {
    if (element.left && element.top) {
      result.x = element.left;
      result.y = element.top;
    } else {
      if (element.x) {
        result.x = element.x;
      }
      if (element.y) {
        result.y = element.y;
      }
    }
  }
  if (element.offsetWidth && element.offsetHeight) {
    result.width = element.offsetWidth;
    result.height = element.offsetHeight;
  } else {
    if (element.style && element.style.pixelWidth && element.style.pixelHeight) {
      result.width = element.style.pixelWidth;
      result.height = element.style.pixelHeight;
    }
  }
  return result;
}
/**
 * @param {!Node} element
 * @param {string} tagName
 * @return {?}
 */
function WebForm_GetParentByTagName(element, tagName) {
  var parent = element.parentNode;
  var root_node = tagName.toUpperCase();
  for (; parent && parent.tagName.toUpperCase() != root_node;) {
    parent = parent.parentNode ? parent.parentNode : parent.parentElement;
  }
  return parent;
}
/**
 * @param {!Object} element
 * @param {number} height
 * @return {undefined}
 */
function WebForm_SetElementHeight(element, height) {
  if (element && element.style) {
    /** @type {string} */
    element.style.height = height + "px";
  }
}
/**
 * @param {!Object} element
 * @param {number} width
 * @return {undefined}
 */
function WebForm_SetElementWidth(element, width) {
  if (element && element.style) {
    /** @type {string} */
    element.style.width = width + "px";
  }
}
/**
 * @param {!Object} element
 * @param {number} x
 * @return {undefined}
 */
function WebForm_SetElementX(element, x) {
  if (element && element.style) {
    /** @type {string} */
    element.style.left = x + "px";
  }
}
/**
 * @param {!Object} element
 * @param {number} y
 * @return {undefined}
 */
function WebForm_SetElementY(element, y) {
  if (element && element.style) {
    /** @type {string} */
    element.style.top = y + "px";
  }
}
;