var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/timers/test-if-fiber.js":
/*!****************************************************!*\
  !*** ./node_modules/@skpm/timers/test-if-fiber.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function () {
  return typeof coscript !== 'undefined' && coscript.createFiber
}


/***/ }),

/***/ "./node_modules/@skpm/timers/timeout.js":
/*!**********************************************!*\
  !*** ./node_modules/@skpm/timers/timeout.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var fiberAvailable = __webpack_require__(/*! ./test-if-fiber */ "./node_modules/@skpm/timers/test-if-fiber.js")

var setTimeout
var clearTimeout

var fibers = []

if (fiberAvailable()) {
  var fibers = []

  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    // fibers takes care of keeping coscript around
    var id = fibers.length
    fibers.push(coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
      }
    ))
    return id
  }

  clearTimeout = function (id) {
    var timeout = fibers[id]
    if (timeout) {
      timeout.cancel() // fibers takes care of keeping coscript around
      fibers[id] = undefined // garbage collect the fiber
    }
  }
} else {
  setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    coscript.shouldKeepAround = true
    var id = fibers.length
    fibers.push(true)
    coscript.scheduleWithInterval_jsFunction(
      (delay || 0) / 1000,
      function () {
        if (fibers[id]) { // if not cleared
          func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
        }
        clearTimeout(id)
        if (fibers.every(function (_id) { return !_id })) { // if everything is cleared
          coscript.shouldKeepAround = false
        }
      }
    )
    return id
  }

  clearTimeout = function (id) {
    fibers[id] = false
  }
}

module.exports = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
}


/***/ }),

/***/ "./node_modules/cocoascript-class/lib/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/cocoascript-class/lib/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = undefined;
exports.default = ObjCClass;

var _runtime = __webpack_require__(/*! ./runtime.js */ "./node_modules/cocoascript-class/lib/runtime.js");

exports.SuperCall = _runtime.SuperCall;

// super when returnType is id and args are void
// id objc_msgSendSuper(struct objc_super *super, SEL op, void)

const SuperInit = (0, _runtime.SuperCall)(NSStringFromSelector("init"), [], { type: "@" });

// Returns a real ObjC class. No need to use new.
function ObjCClass(defn) {
  const superclass = defn.superclass || NSObject;
  const className = (defn.className || defn.classname || "ObjCClass") + NSUUID.UUID().UUIDString();
  const reserved = new Set(['className', 'classname', 'superclass']);
  var cls = MOClassDescription.allocateDescriptionForClassWithName_superclass_(className, superclass);
  // Add each handler to the class description
  const ivars = [];
  for (var key in defn) {
    const v = defn[key];
    if (typeof v == 'function' && key !== 'init') {
      var selector = NSSelectorFromString(key);
      cls.addInstanceMethodWithSelector_function_(selector, v);
    } else if (!reserved.has(key)) {
      ivars.push(key);
      cls.addInstanceVariableWithName_typeEncoding(key, "@");
    }
  }

  cls.addInstanceMethodWithSelector_function_(NSSelectorFromString('init'), function () {
    const self = SuperInit.call(this);
    ivars.map(name => {
      Object.defineProperty(self, name, {
        get() {
          return getIvar(self, name);
        },
        set(v) {
          (0, _runtime.object_setInstanceVariable)(self, name, v);
        }
      });
      self[name] = defn[name];
    });
    // If there is a passsed-in init funciton, call it now.
    if (typeof defn.init == 'function') defn.init.call(this);
    return self;
  });

  return cls.registerClass();
};

function getIvar(obj, name) {
  const retPtr = MOPointer.new();
  (0, _runtime.object_getInstanceVariable)(obj, name, retPtr);
  return retPtr.value().retain().autorelease();
}

/***/ }),

/***/ "./node_modules/cocoascript-class/lib/runtime.js":
/*!*******************************************************!*\
  !*** ./node_modules/cocoascript-class/lib/runtime.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = SuperCall;
exports.CFunc = CFunc;
const objc_super_typeEncoding = '{objc_super="receiver"@"super_class"#}';

// You can store this to call your function. this must be bound to the current instance.
function SuperCall(selector, argTypes, returnType) {
  const func = CFunc("objc_msgSendSuper", [{ type: '^' + objc_super_typeEncoding }, { type: ":" }, ...argTypes], returnType);
  return function (...args) {
    const struct = make_objc_super(this, this.superclass());
    const structPtr = MOPointer.alloc().initWithValue_(struct);
    return func(structPtr, selector, ...args);
  };
}

// Recursively create a MOStruct
function makeStruct(def) {
  if (typeof def !== 'object' || Object.keys(def).length == 0) {
    return def;
  }
  const name = Object.keys(def)[0];
  const values = def[name];

  const structure = MOStruct.structureWithName_memberNames_runtime(name, Object.keys(values), Mocha.sharedRuntime());

  Object.keys(values).map(member => {
    structure[member] = makeStruct(values[member]);
  });

  return structure;
}

function make_objc_super(self, cls) {
  return makeStruct({
    objc_super: {
      receiver: self,
      super_class: cls
    }
  });
}

// Due to particularities of the JS bridge, we can't call into MOBridgeSupport objects directly
// But, we can ask key value coding to do the dirty work for us ;)
function setKeys(o, d) {
  const funcDict = NSMutableDictionary.dictionary();
  funcDict.o = o;
  Object.keys(d).map(k => funcDict.setValue_forKeyPath(d[k], "o." + k));
}

// Use any C function, not just ones with BridgeSupport
function CFunc(name, args, retVal) {
  function makeArgument(a) {
    if (!a) return null;
    const arg = MOBridgeSupportArgument.alloc().init();
    setKeys(arg, {
      type64: a.type
    });
    return arg;
  }
  const func = MOBridgeSupportFunction.alloc().init();
  setKeys(func, {
    name: name,
    arguments: args.map(makeArgument),
    returnValue: makeArgument(retVal)
  });
  return func;
}

/*
@encode(char*) = "*"
@encode(id) = "@"
@encode(Class) = "#"
@encode(void*) = "^v"
@encode(CGRect) = "{CGRect={CGPoint=dd}{CGSize=dd}}"
@encode(SEL) = ":"
*/

function addStructToBridgeSupport(key, structDef) {
  // OK, so this is probably the nastiest hack in this file.
  // We go modify MOBridgeSupportController behind its back and use kvc to add our own definition
  // There isn't another API for this though. So the only other way would be to make a real bridgesupport file.
  const symbols = MOBridgeSupportController.sharedController().valueForKey('symbols');
  if (!symbols) throw Error("Something has changed within bridge support so we can't add our definitions");
  // If someone already added this definition, don't re-register it.
  if (symbols[key] !== null) return;
  const def = MOBridgeSupportStruct.alloc().init();
  setKeys(def, {
    name: key,
    type: structDef.type
  });
  symbols[key] = def;
};

// This assumes the ivar is an object type. Return value is pretty useless.
const object_getInstanceVariable = exports.object_getInstanceVariable = CFunc("object_getInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "^@" }], { type: "^{objc_ivar=}" });
// Again, ivar is of object type
const object_setInstanceVariable = exports.object_setInstanceVariable = CFunc("object_setInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "@" }], { type: "^{objc_ivar=}" });

// We need Mocha to understand what an objc_super is so we can use it as a function argument
addStructToBridgeSupport('objc_super', { type: objc_super_typeEncoding });

/***/ }),

/***/ "./src/plugin/index.ts":
/*!*****************************!*\
  !*** ./src/plugin/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setTimeout) {
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="sketch.d.ts" />
/// <reference types="../../typings/skpm" />
const core_1 = __webpack_require__(/*! ./utils/core */ "./src/plugin/utils/core.ts");
const WebViewUtils = __webpack_require__(/*! ./utils/webview */ "./src/plugin/utils/webview/index.ts");
const Dom = __webpack_require__(/*! sketch/dom */ "sketch/dom");
// These are just used to identify the window(s)
// Change them to whatever you need e.g. if you need to support multiple
// windows at the same time...
const windowIdentifier = 'sketch-plugin-boilerplate--window';
const panelIdentifier = 'sketch-plugin-boilerplate--panel';
// All exported functions will be exposed as entry points to your plugin
// and can be referenced in your `manifest.json`
function helloWorld(context) {
    core_1.initWithContext(context);
    core_1.document.showMessage('👋🌏 Hello World!');
}
exports.helloWorld = helloWorld;
function openWindow(context) {
    // It's good practice to have an init function, that can be called
    // at the beginning of all entry points and will prepare the enviroment
    // using the provided `context`
    core_1.initWithContext(context);
    WebViewUtils.openWindow(windowIdentifier);
}
exports.openWindow = openWindow;
function togglePanel(context) {
    core_1.initWithContext(context);
    WebViewUtils.togglePanel(panelIdentifier);
}
exports.togglePanel = togglePanel;
function sendMessageToWindow(context) {
    core_1.initWithContext(context);
    WebViewUtils.sendWindowAction(windowIdentifier, 'foo', { foo: 'bar' });
}
exports.sendMessageToWindow = sendMessageToWindow;
function sendMessageToPanel(context) {
    core_1.initWithContext(context);
    WebViewUtils.sendPanelAction(panelIdentifier, 'foo', { foo: 'bar' });
}
exports.sendMessageToPanel = sendMessageToPanel;
function closeAllPanels(context) {
    log('Close all panels due to document closed');
    core_1.initWithContext(context);
    WebViewUtils.closeActivePanels();
}
exports.closeAllPanels = closeAllPanels;
function openActivePanels(context) {
    log('open all active panels!');
    setTimeout(() => {
        if (!context.document) {
            context.document = Dom.getSelectedDocument().sketchObject;
        }
        core_1.initWithContext(context);
        WebViewUtils.openCurrentPanels();
    }, 250);
}
exports.openActivePanels = openActivePanels;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/timers/timeout.js */ "./node_modules/@skpm/timers/timeout.js")["setTimeout"]))

/***/ }),

/***/ "./src/plugin/utils/core.ts":
/*!**********************************!*\
  !*** ./src/plugin/utils/core.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
let context = null;
exports.context = context;
let document = null;
exports.document = document;
let selection = null;
exports.selection = selection;
let pluginFolderPath = null;
exports.pluginFolderPath = pluginFolderPath;
const frameworkFolderPath = '/Contents/Resources/frameworks/';
function getPluginFolderPath() {
    // Get absolute folder path of plugin
    const split = context.scriptPath.split('/');
    split.splice(-3, 3);
    return split.join('/');
}
function initWithContext(ctx) {
    // This function needs to be called in the beginning of every entry point!
    // Set all env variables according to current context
    exports.context = context = ctx;
    exports.document = document = ctx.document
        || MSDocument.currentDocument();
    exports.selection = selection = document ? document.selectedLayers() : null;
    exports.pluginFolderPath = pluginFolderPath = getPluginFolderPath();
    // Here you could load custom cocoa frameworks if you need to
    // loadFramework('FrameworkName', 'ClassName');
    // => would be loaded into ClassName in global namespace!
}
exports.initWithContext = initWithContext;
function loadFramework(frameworkName, frameworkClass) {
    // Only load framework if class not already available
    if (Mocha && NSClassFromString(frameworkClass) == null) {
        const frameworkDir = `${pluginFolderPath}${frameworkFolderPath}`;
        const mocha = Mocha.sharedRuntime();
        return mocha.loadFrameworkWithName_inDirectory(frameworkName, frameworkDir);
    }
    return false;
}
exports.loadFramework = loadFramework;


/***/ }),

/***/ "./src/plugin/utils/formatter.ts":
/*!***************************************!*\
  !*** ./src/plugin/utils/formatter.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function toArray(object) {
    if (Array.isArray(object)) {
        return object;
    }
    const arr = [];
    for (let j = 0; j < object.count(); j++) {
        arr.push(object.objectAtIndex(j));
    }
    return arr;
}
exports.toArray = toArray;


/***/ }),

/***/ "./src/plugin/utils/webview/index.ts":
/*!*******************************************!*\
  !*** ./src/plugin/utils/webview/index.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./webview */ "./src/plugin/utils/webview/webview.ts"));
const window_1 = __webpack_require__(/*! ./window */ "./src/plugin/utils/webview/window.ts");
exports.openWindow = window_1.open;
exports.sendWindowAction = window_1.sendAction;
const panel_1 = __webpack_require__(/*! ./panel */ "./src/plugin/utils/webview/panel.ts");
exports.togglePanel = panel_1.toggle;
exports.openPanel = panel_1.open;
exports.closePanel = panel_1.close;
exports.isPanelOpen = panel_1.isOpen;
exports.sendPanelAction = panel_1.sendAction;
exports.closeActivePanels = panel_1.closeActivePanels;
exports.openCurrentPanels = panel_1.openCurrentPanels;


/***/ }),

/***/ "./src/plugin/utils/webview/panel.ts":
/*!*******************************************!*\
  !*** ./src/plugin/utils/webview/panel.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(/*! ../core */ "./src/plugin/utils/core.ts");
const formatter_1 = __webpack_require__(/*! ../formatter */ "./src/plugin/utils/formatter.ts");
const webview_1 = __webpack_require__(/*! ./webview */ "./src/plugin/utils/webview/webview.ts");
const shared_1 = __webpack_require__(/*! ../../../shared */ "./src/shared.ts");
const Settings = __webpack_require__(/*! sketch/settings */ "sketch/settings");
const Dom = __webpack_require__(/*! sketch/dom */ "sketch/dom");
const OPEN_PANELS_KEY = 'open-panels';
function toggle(identifier, path, width) {
    if (isOpen(identifier)) {
        close(identifier);
    }
    else {
        open(identifier, path, width);
    }
}
exports.toggle = toggle;
/**
 * Closes active panels in the current document.
 */
function closeActivePanels() {
    const panels = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    for (const panel of panels) {
        close(panel.id, false);
    }
}
exports.closeActivePanels = closeActivePanels;
function openCurrentPanels() {
    log('Settings for key');
    log(Settings.settingForKey(OPEN_PANELS_KEY));
    const panels = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    for (const panel of panels) {
        openPanel(panel.id, panel.path, panel.options);
    }
}
exports.openCurrentPanels = openCurrentPanels;
// TODO: Handle document closing (fiber should get released, probably)
let webview = null;
function open(identifier, path = 'index.html', options = {}, openForAll = true) {
    // get an absolute path
    path = webview_1.getFilePath(path);
    if (openForAll) {
        // note that we opened this panel
        const panels = Settings.settingForKey(OPEN_PANELS_KEY) || [];
        if (!panels.find(panel => panel.id == identifier)) {
            panels.push({ id: identifier, options, path });
            Settings.setSettingForKey(OPEN_PANELS_KEY, panels);
            log('Saved key');
            log(panels);
        }
        // for each open document, open the panel
        Dom.getDocuments().forEach((doc) => {
            openPanel(identifier, path, options, doc.sketchObject);
        });
    }
    else {
        openPanel(identifier, path, options);
    }
}
exports.open = open;
function openPanel(identifier, path, options, doc) {
    const { width } = options;
    const frame = NSMakeRect(0, 0, width || 250, 600); // the height doesn't really matter here
    doc = doc || core_1.document;
    if (!doc) {
        console.warn('Trying to open panel in document, but no document');
        return;
    }
    if (!doc.documentWindow()) {
        console.warn('Trying to open panel in document, but no document window');
        return;
    }
    const contentView = doc.documentWindow().contentView();
    if (!contentView || findWebView(identifier, doc)) {
        return false;
    }
    const stageView = contentView.subviews().objectAtIndex(0);
    webview = new webview_1.BridgedWebView();
    webview.init(path, frame);
    webview.view.identifier = identifier;
    // if the fiber gets cleaned up, remove the panel
    webview.fiber.onCleanup(() => {
        // don't double clean up
        if (!webview) {
            return;
        }
        // clear the fiber reference so that it doesn't get far when triggered again
        webview.fiber = null;
        // remove the panel from the document
        removePanel(identifier);
    });
    // TODO: Expose this for more general use
    webview.onActionReceived = (name, payload) => {
        console.log('Received ', name, payload);
    };
    // Inject our webview into the right spot in the subview list
    const views = stageView.subviews();
    const finalViews = [];
    let pushedWebView = false;
    for (let i = 0; i < views.count(); i++) {
        const view = views.objectAtIndex(i);
        finalViews.push(view);
        // NOTE: change the view identifier here if you want to add
        //  your panel anywhere else - view_canvas is the document area
        if (!pushedWebView && view.identifier() == 'view_canvas') {
            finalViews.push(webview.view);
            pushedWebView = true;
        }
    }
    // If it hasn't been pushed yet, push our web view
    // E.g. when inspector is not activated etc.
    if (!pushedWebView) {
        finalViews.push(webview.view);
    }
    // Finally, update the subviews prop and refresh
    stageView.subviews = finalViews;
    stageView.adjustSubviews();
}
function close(identifier, closeForAll = true) {
    if (closeForAll) {
        // record the panel as closed
        const panels = Settings.settingForKey(OPEN_PANELS_KEY) || [];
        if (panels.find(panel => panel.id == identifier)) {
            Settings.setSettingForKey(OPEN_PANELS_KEY, panels.filter(panel => panel.id != identifier));
        }
        // for each open document, close the panel
        Dom.getDocuments().forEach((doc) => {
            sendAction(identifier, shared_1.MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()', doc.sketchObject);
        });
    }
    else {
        // close just the current document
        // send message to the original JS context that created the view and tell it to clean up
        sendAction(identifier, shared_1.MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()');
    }
}
exports.close = close;
function removePanel(identifier) {
    // Search for web view panel
    const view = findWebView(identifier);
    if (view) {
        view.removeFromSuperview();
    }
    // clear variable for good measure
    webview = null;
}
function isOpen(identifier) {
    const panels = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    return !!panels.find(panel => panel.id == identifier);
}
exports.isOpen = isOpen;
function findWebView(identifier, doc) {
    doc = doc || core_1.document;
    if (!doc || !doc.documentWindow()) {
        return null;
    }
    const contentView = (doc || core_1.document).documentWindow().contentView();
    if (!contentView) {
        return null;
    }
    const splitView = contentView.subviews().objectAtIndex(0);
    const views = formatter_1.toArray(splitView.subviews());
    return views.find(view => view.identifier() == identifier);
}
exports.findWebView = findWebView;
function sendAction(identifier, name, payload = {}, document) {
    return webview_1.sendActionToWebView(findWebView(identifier, document), name, payload);
}
exports.sendAction = sendAction;


/***/ }),

/***/ "./src/plugin/utils/webview/webview.ts":
/*!*********************************************!*\
  !*** ./src/plugin/utils/webview/webview.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(/*! ../core */ "./src/plugin/utils/core.ts");
const cocoascript_class_1 = __webpack_require__(/*! cocoascript-class */ "./node_modules/cocoascript-class/lib/index.js");
const Async = __webpack_require__(/*! sketch/async */ "sketch/async");
const shared_1 = __webpack_require__(/*! ../../../shared */ "./src/shared.ts");
function getFilePath(file) {
    return `${core_1.pluginFolderPath}/Contents/Resources/webview/${file}`;
}
exports.getFilePath = getFilePath;
function sendActionToWebView(webView, name, payload = {}) {
    if (!webView || !webView.evaluateJavaScript_completionHandler) {
        return;
    }
    // call the JS function exposed on window in the webview!
    const script = `${shared_1.PLUGIN_TO_WV_BRIDGE}('${JSON.stringify({ name, payload })}');`;
    webView.evaluateJavaScript_completionHandler(script, null);
}
exports.sendActionToWebView = sendActionToWebView;
class BridgedWebView {
    constructor() {
        this.fiber = null;
        this.view = null;
    }
    initWithFile(file, frame) {
        this.init(getFilePath(file), frame);
    }
    init(path, frame) {
        const webView = this.createView(frame);
        const url = NSURL.fileURLWithPath(path);
        // log('File URL');
        // log(url);
        webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
        webView.loadRequest(NSURLRequest.requestWithURL(url));
        this.view = webView;
        // don't let the JS context get cleaned up while the panel is open
        // consumers of the webview should add their own callbacks (to remove panel/close window)
        this.fiber = Async.createFiber();
    }
    createView(frame) {
        const config = WKWebViewConfiguration.alloc().init();
        // enable right click -> inspect element
        config.preferences()._developerExtrasEnabled = true;
        // This is a helper delegate, that handles incoming bridge messages
        const BridgeMessageHandler = cocoascript_class_1.default({
            'userContentController:didReceiveScriptMessage:': (_controller, message) => {
                try {
                    const bridgeMessage = JSON.parse(String(message.body()));
                    this.receiveAction(bridgeMessage.name, bridgeMessage.payload);
                }
                catch (e) {
                    console.log('Could not parse bridge message', e, message.body());
                    console.log('String of body: ', String(message.body()));
                }
            }
        });
        const messageHandler = BridgeMessageHandler.alloc().init();
        config.userContentController().addScriptMessageHandler_name(messageHandler, shared_1.WV_TO_PLUGIN_BRIDGE);
        const ViewClass = cocoascript_class_1.default({
            classname: 'WebViewWrapper',
            superclass: WKWebView,
            ['viewWillMoveToSuperview:']: (view) => {
                if (!view && this.fiber) {
                    log('Cleaning up!');
                    this.fiber.cleanup();
                }
            }
        });
        return ViewClass.alloc().initWithFrame_configuration(frame, config);
    }
    receiveAction(name, payload = {}) {
        if (name == shared_1.MESSAGE_TO_WV_CONTEXT) {
            try {
                const func = new Function(payload);
                func.call(this);
            }
            catch (e) {
                console.warn('Unable to evaluate message to plugin', e, payload);
            }
            return;
        }
        if (this.onActionReceived) {
            try {
                this.onActionReceived(name, payload);
            }
            catch (e) {
                console.warn('Unable to perform action received callback', e, payload);
            }
        }
    }
}
exports.BridgedWebView = BridgedWebView;


/***/ }),

/***/ "./src/plugin/utils/webview/window.ts":
/*!********************************************!*\
  !*** ./src/plugin/utils/webview/window.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const webview_1 = __webpack_require__(/*! ./webview */ "./src/plugin/utils/webview/webview.ts");
// TODO: Update & handle window closing - https://github.com/skpm/sketch-module-web-view/blob/master/lib/set-delegates.js
function open(identifier, path = 'index.html', options = {}) {
    // Sensible defaults for options
    const { width = 450, height = 350, title = 'Sketch Plugin Boilerplate' } = options;
    const frame = NSMakeRect(0, 0, width, height);
    const masks = NSTitledWindowMask |
        NSWindowStyleMaskClosable |
        NSResizableWindowMask;
    const window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, masks, NSBackingStoreBuffered, false);
    window.setMinSize({ width: 200, height: 200 });
    // We use this dictionary to have a persistant storage of our NSWindow/NSPanel instance
    // Otherwise the instance is stored nowhere and gets release => Window closes
    const threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary[identifier] = window;
    const webView = new webview_1.BridgedWebView();
    webView.init(path, frame);
    window.title = title;
    window.center();
    window.contentView().addSubview(webView.view);
    window.makeKeyAndOrderFront(null);
}
exports.open = open;
function findWebView(identifier) {
    const threadDictionary = NSThread.mainThread().threadDictionary();
    const window = threadDictionary[identifier];
    return window.contentView().subviews()[0];
}
exports.findWebView = findWebView;
function sendAction(identifier, name, payload = {}) {
    return webview_1.sendActionToWebView(findWebView(identifier), name, payload);
}
exports.sendAction = sendAction;


/***/ }),

/***/ "./src/shared.ts":
/*!***********************!*\
  !*** ./src/shared.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WV_TO_PLUGIN_BRIDGE = 'Sketch';
exports.PLUGIN_TO_WV_BRIDGE = 'sketchBridge';
exports.MESSAGE_TO_WV_CONTEXT = '__eval__';


/***/ }),

/***/ "sketch/async":
/*!*******************************!*\
  !*** external "sketch/async" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/async");

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/settings");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['helloWorld'] = __skpm_run.bind(this, 'helloWorld');
that['onRun'] = __skpm_run.bind(this, 'default');
that['openWindow'] = __skpm_run.bind(this, 'openWindow');
that['togglePanel'] = __skpm_run.bind(this, 'togglePanel');
that['handleBridgeMessage'] = __skpm_run.bind(this, 'handleBridgeMessage');
that['sendMessageToWindow'] = __skpm_run.bind(this, 'sendMessageToWindow');
that['sendMessageToPanel'] = __skpm_run.bind(this, 'sendMessageToPanel');
that['openActivePanels'] = __skpm_run.bind(this, 'openActivePanels');
that['closeAllPanels'] = __skpm_run.bind(this, 'closeAllPanels')

//# sourceMappingURL=index.js.map