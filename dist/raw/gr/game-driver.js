require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._cloneDeep = exports.MemoryAmflowClient = void 0;
var MemoryAmflowClient = /** @class */ (function () {
    function MemoryAmflowClient(param) {
        this._tickHandlers = [];
        this._eventHandlers = [];
        /**
         * onEvent() 呼び出し前に sendEvent() されたものを保持しておくバッファ。
         */
        this._events = [];
        this._tickList = null;
        this._playId = param.playId;
        this._putStorageDataSyncFunc = param.putStorageDataSyncFunc || (function () {
            throw new Error("Implementation not given");
        });
        this._getStorageDataSyncFunc = param.getStorageDataSyncFunc || (function () {
            throw new Error("Implementation not given");
        });
        if (param.startPoints) {
            if (param.tickList) {
                this._tickList = param.tickList;
            }
            this._startPoints = param.startPoints;
        }
        else {
            this._startPoints = [];
        }
    }
    MemoryAmflowClient.prototype.dump = function () {
        return {
            tickList: this._tickList,
            startPoints: this._startPoints
        };
    };
    MemoryAmflowClient.prototype.open = function (playId, callback) {
        var _this = this;
        setTimeout(function () {
            if (!callback)
                return;
            if (playId !== _this._playId)
                return void callback(new Error("MemoryAmflowClient#open: unknown playId"));
            callback(null);
        }, 0);
    };
    MemoryAmflowClient.prototype.close = function (callback) {
        if (!callback)
            return;
        setTimeout(function () {
            callback(null);
        }, 0);
    };
    MemoryAmflowClient.prototype.authenticate = function (token, callback) {
        setTimeout(function () {
            switch (token) {
                case MemoryAmflowClient.TOKEN_ACTIVE:
                    callback(null, {
                        writeTick: true,
                        readTick: true,
                        subscribeTick: false,
                        sendEvent: false,
                        subscribeEvent: true,
                        maxEventPriority: 2
                    });
                    break;
                case MemoryAmflowClient.TOKEN_PASSIVE:
                    callback(null, {
                        writeTick: false,
                        readTick: true,
                        subscribeTick: true,
                        sendEvent: true,
                        subscribeEvent: false,
                        maxEventPriority: 2
                    });
                    break;
                default:
                    callback(null, {
                        writeTick: true,
                        readTick: true,
                        subscribeTick: true,
                        sendEvent: true,
                        subscribeEvent: true,
                        maxEventPriority: 2
                    });
                    break;
            }
        }, 0);
    };
    MemoryAmflowClient.prototype.sendTick = function (tick) {
        tick = _cloneDeep(tick); // 元の値が後から変更されてもいいようにコピーしておく
        if (!this._tickList) {
            this._tickList = [tick[0 /* Frame */], tick[0 /* Frame */], []];
        }
        else {
            // 既に存在するTickListのfrom~to間にtickが挿入されることは無い
            if (this._tickList[0 /* From */] <= tick[0 /* Frame */] &&
                tick[0 /* Frame */] <= this._tickList[1 /* To */])
                throw new Error("illegal age tick");
            this._tickList[1 /* To */] = tick[0 /* Frame */];
        }
        var events = tick[1 /* Events */];
        var storageData = tick[2 /* StorageData */];
        if (events || storageData) {
            if (events) {
                tick[1 /* Events */] = events.filter(function (event) { return !(event[1 /* EventFlags */] & 8 /* Transient */); });
            }
            // @ts-ignore
            this._tickList[2 /* Ticks */].push(tick);
        }
        this._tickHandlers.forEach(function (h) { return h(tick); });
    };
    MemoryAmflowClient.prototype.onTick = function (handler) {
        this._tickHandlers.push(handler);
    };
    MemoryAmflowClient.prototype.offTick = function (handler) {
        this._tickHandlers = this._tickHandlers.filter(function (h) { return (h !== handler); });
    };
    MemoryAmflowClient.prototype.sendEvent = function (pev) {
        pev = _cloneDeep(pev); // 元の値が後から変更されてもいいようにコピーしておく
        if (this._eventHandlers.length === 0) {
            this._events.push(pev);
            return;
        }
        this._eventHandlers.forEach(function (h) { return h(pev); });
    };
    MemoryAmflowClient.prototype.onEvent = function (handler) {
        var _this = this;
        this._eventHandlers.push(handler);
        if (this._events.length > 0) {
            this._events.forEach(function (pev) {
                _this._eventHandlers.forEach(function (h) { return h(pev); });
            });
            this._events = [];
        }
    };
    MemoryAmflowClient.prototype.offEvent = function (handler) {
        this._eventHandlers = this._eventHandlers.filter(function (h) { return (h !== handler); });
    };
    MemoryAmflowClient.prototype.getTickList = function (optsOrBegin, endOrCallback, callbackOrUndefined) {
        var opts;
        var callback;
        if (typeof optsOrBegin === "number") {
            // NOTE: optsOrBegin === "number" であれば必ず amflow@2 以前の引数だとみなしてキャストする
            opts = {
                begin: optsOrBegin,
                end: endOrCallback
            };
            callback = callbackOrUndefined;
        }
        else {
            // NOTE: optsOrBegin !== "number" であれば必ず amflow@3 以降の引数だとみなしてキャストする
            opts = optsOrBegin;
            callback = endOrCallback;
        }
        if (!this._tickList) {
            if (callback) {
                setTimeout(function () { return callback(null); }, 0);
            }
            return;
        }
        var from = Math.max(opts.begin, this._tickList[0 /* From */]);
        var to = Math.min(opts.end, this._tickList[1 /* To */]);
        // @ts-ignore
        var ticks = this._tickList[2 /* Ticks */].filter(function (tick) {
            var age = tick[0 /* Frame */];
            return from <= age && age <= to;
        });
        var tickList = [from, to, ticks];
        setTimeout(function () { return callback(null, tickList); }, 0);
    };
    MemoryAmflowClient.prototype.putStartPoint = function (startPoint, callback) {
        var _this = this;
        setTimeout(function () {
            _this._startPoints.push(startPoint);
            callback(null);
        }, 0);
    };
    MemoryAmflowClient.prototype.getStartPoint = function (opts, callback) {
        var _this = this;
        setTimeout(function () {
            if (!_this._startPoints || _this._startPoints.length === 0)
                return void callback(new Error("no startpoint"));
            var index = 0;
            if (opts.frame != null) {
                var nearestFrame = _this._startPoints[0].frame;
                for (var i = 1; i < _this._startPoints.length; ++i) {
                    var frame = _this._startPoints[i].frame;
                    if (frame <= opts.frame && nearestFrame < frame) {
                        nearestFrame = frame;
                        index = i;
                    }
                }
            }
            else {
                var nearestTimestamp = _this._startPoints[0].timestamp;
                for (var i = 1; i < _this._startPoints.length; ++i) {
                    var timestamp = _this._startPoints[i].timestamp;
                    // NOTE: opts.frame が null の場合は opts.timestamp が non-null であることが仕様上保証されている
                    if (timestamp <= opts.timestamp && nearestTimestamp < timestamp) {
                        nearestTimestamp = timestamp;
                        index = i;
                    }
                }
            }
            callback(null, _this._startPoints[index]);
        }, 0);
    };
    MemoryAmflowClient.prototype.putStorageData = function (key, value, options, callback) {
        var _this = this;
        setTimeout(function () {
            try {
                _this._putStorageDataSyncFunc(key, value, options);
                callback(null);
            }
            catch (e) {
                callback(e);
            }
        }, 0);
    };
    MemoryAmflowClient.prototype.getStorageData = function (keys, callback) {
        var _this = this;
        setTimeout(function () {
            try {
                var data = _this._getStorageDataSyncFunc(keys);
                callback(null, data);
            }
            catch (e) {
                callback(e);
            }
        }, 0);
    };
    /**
     * 与えられていたティックリストを部分的に破棄する。
     * @param age ティックを破棄する基準のage(このageのティックも破棄される)
     */
    MemoryAmflowClient.prototype.dropAfter = function (age) {
        if (!this._tickList)
            return;
        var from = this._tickList[0 /* From */];
        var to = this._tickList[1 /* To */];
        if (age <= from) {
            this._tickList = null;
            this._startPoints = [];
        }
        else if (age <= to) {
            this._tickList[1 /* To */] = age - 1;
            // @ts-ignore
            this._tickList[2 /* Ticks */] = this._tickList[2 /* Ticks */].filter(function (tick) {
                var ta = tick[0 /* Frame */];
                return from <= ta && ta <= (age - 1);
            });
            this._startPoints = this._startPoints.filter(function (sp) { return sp.frame < age; });
        }
    };
    /**
     * `writeTick` 権限を持つトークン。
     * この値は authenticate() の挙動以外は変更しない。
     * 他メソッド(sendEvent()など)の呼び出しは(権限に反していても)エラーを起こすとは限らない。
     */
    MemoryAmflowClient.TOKEN_ACTIVE = "mamfc-token:active";
    /**
     * `subscribeTick` 権限を持つトークン。
     * この値は authenticate() の挙動以外は変更しない。
     * 他メソッド(sendTick()など)の呼び出しは(権限に反していても)エラーを起こすとは限らない。
     */
    MemoryAmflowClient.TOKEN_PASSIVE = "mamfc-token:passive";
    return MemoryAmflowClient;
}());
exports.MemoryAmflowClient = MemoryAmflowClient;
function _cloneDeep(v) {
    if (v && typeof v === "object") {
        if (Array.isArray(v)) {
            return v.map(_cloneDeep);
        }
        else {
            return Object.keys(v).reduce(function (acc, k) { return (acc[k] = _cloneDeep(v[k]), acc); }, {});
        }
    }
    return v;
}
exports._cloneDeep = _cloneDeep;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayAmflowProxy = void 0;
var ReplayAmflowProxy = /** @class */ (function () {
    function ReplayAmflowProxy(param) {
        this._amflow = param.amflow;
        this._tickList = param.tickList;
        this._startPoints = param.startPoints;
    }
    /**
     * 与えられていたティックリストを部分的に破棄する。
     * ReplayAmflowProxy の独自メソッド。
     * @param age ティックを破棄する基準のage(このageのティックも破棄される)
     */
    ReplayAmflowProxy.prototype.dropAfter = function (age) {
        if (!this._tickList)
            return;
        var givenFrom = this._tickList[0 /* From */];
        var givenTo = this._tickList[1 /* To */];
        var givenTicksWithEvents = this._tickList[2 /* Ticks */] || [];
        if (age <= givenFrom) {
            this._tickList = null;
            this._startPoints = [];
        }
        else if (age <= givenTo) {
            this._tickList[1 /* To */] = age - 1;
            this._tickList[2 /* Ticks */] = this._sliceTicks(givenTicksWithEvents, givenTo, age - 1);
            this._startPoints = this._startPoints.filter(function (sp) { return sp.frame < age; });
        }
    };
    ReplayAmflowProxy.prototype.open = function (playId, callback) {
        this._amflow.open(playId, callback);
    };
    ReplayAmflowProxy.prototype.close = function (callback) {
        this._amflow.close(callback);
    };
    ReplayAmflowProxy.prototype.authenticate = function (token, callback) {
        this._amflow.authenticate(token, callback);
    };
    ReplayAmflowProxy.prototype.sendTick = function (tick) {
        this._amflow.sendTick(tick);
    };
    ReplayAmflowProxy.prototype.onTick = function (handler) {
        this._amflow.onTick(handler);
    };
    ReplayAmflowProxy.prototype.offTick = function (handler) {
        this._amflow.offTick(handler);
    };
    ReplayAmflowProxy.prototype.sendEvent = function (event) {
        this._amflow.sendEvent(event);
    };
    ReplayAmflowProxy.prototype.onEvent = function (handler) {
        this._amflow.onEvent(handler);
    };
    ReplayAmflowProxy.prototype.offEvent = function (handler) {
        this._amflow.offEvent(handler);
    };
    ReplayAmflowProxy.prototype.getTickList = function (optsOrBegin, endOrCallback, callbackOrUndefined) {
        var _this = this;
        var opts;
        var callback;
        if (typeof optsOrBegin === "number") {
            // NOTE: optsOrBegin === "number" であれば必ず amflow@2 以前の引数だとみなしてキャストする
            opts = {
                begin: optsOrBegin,
                end: endOrCallback
            };
            callback = callbackOrUndefined;
        }
        else {
            // NOTE: optsOrBegin !== "number" であれば必ず amflow@3 以降の引数だとみなしてキャストする
            opts = optsOrBegin;
            callback = endOrCallback;
        }
        if (!this._tickList) {
            this._amflow.getTickList(opts, callback);
            return;
        }
        var from = opts.begin;
        var to = opts.end;
        var givenFrom = this._tickList[0 /* From */];
        var givenTo = this._tickList[1 /* To */];
        var givenTicksWithEvents = this._tickList[2 /* Ticks */] || [];
        var fromInGiven = givenFrom <= from && from <= givenTo;
        var toInGiven = givenFrom <= to && to <= givenTo;
        if (fromInGiven && toInGiven) { // 手持ちが要求範囲を包含
            setTimeout(function () {
                callback(null, [from, to, _this._sliceTicks(givenTicksWithEvents, from, to)]);
            }, 0);
        }
        else {
            this._amflow.getTickList({ begin: from, end: to }, function (err, tickList) {
                if (err)
                    return void callback(err);
                if (!tickList) {
                    // 何も得られなかった。手持ちの重複範囲を返すだけ。
                    if (!fromInGiven && !toInGiven) {
                        if (to < givenFrom || givenTo < from) { // 重複なし
                            callback(null, tickList);
                        }
                        else { // 要求範囲が手持ちを包含
                            callback(null, [givenFrom, givenTo, _this._sliceTicks(givenTicksWithEvents, from, to)]);
                        }
                    }
                    else if (fromInGiven) { // 前半重複
                        callback(null, [from, givenTo, _this._sliceTicks(givenTicksWithEvents, from, to)]);
                    }
                    else { // 後半重複
                        callback(null, [givenFrom, to, _this._sliceTicks(givenTicksWithEvents, from, to)]);
                    }
                }
                else {
                    // 何かは得られた。手持ちとマージする。
                    if (!fromInGiven && !toInGiven) {
                        if (to < givenFrom || givenTo < from) { // 重複なし
                            callback(null, tickList);
                        }
                        else { // 要求範囲が手持ちを包含
                            var ticksWithEvents = tickList[2 /* Ticks */];
                            if (ticksWithEvents) {
                                var beforeGiven = _this._sliceTicks(ticksWithEvents, from, givenFrom - 1);
                                var afterGiven = _this._sliceTicks(ticksWithEvents, givenTo + 1, to);
                                ticksWithEvents = beforeGiven.concat(givenTicksWithEvents, afterGiven);
                            }
                            else {
                                ticksWithEvents = givenTicksWithEvents;
                            }
                            callback(null, [from, to, ticksWithEvents]);
                        }
                    }
                    else if (fromInGiven) { // 前半重複
                        var ticksWithEvents = _this._sliceTicks(givenTicksWithEvents, from, to)
                            .concat(tickList[2 /* Ticks */] || []);
                        callback(null, [from, tickList[1 /* To */], ticksWithEvents]);
                    }
                    else { // 後半重複
                        var ticksWithEvents = (tickList[2 /* Ticks */] || [])
                            .concat(_this._sliceTicks(givenTicksWithEvents, from, to));
                        callback(null, [tickList[0 /* From */], to, ticksWithEvents]);
                    }
                }
            });
        }
    };
    ReplayAmflowProxy.prototype.putStartPoint = function (startPoint, callback) {
        this._amflow.putStartPoint(startPoint, callback);
    };
    ReplayAmflowProxy.prototype.getStartPoint = function (opts, callback) {
        var _this = this;
        var index = 0;
        if (this._startPoints.length > 0) {
            if (opts.frame != null) {
                var nearestFrame = this._startPoints[0].frame;
                for (var i = 1; i < this._startPoints.length; ++i) {
                    var frame = this._startPoints[i].frame;
                    if (frame <= opts.frame && nearestFrame < frame) {
                        nearestFrame = frame;
                        index = i;
                    }
                }
            }
            else {
                var nearestTimestamp = this._startPoints[0].timestamp;
                for (var i = 1; i < this._startPoints.length; ++i) {
                    var timestamp = this._startPoints[i].timestamp;
                    // NOTE: opts.frame が null の場合は opts.timestamp が non-null であることが仕様上保証されている
                    if (timestamp <= opts.timestamp && nearestTimestamp < timestamp) {
                        nearestTimestamp = timestamp;
                        index = i;
                    }
                }
            }
        }
        var givenTo = this._tickList ? this._tickList[1 /* To */] : -1;
        if (typeof opts.frame === "number" && opts.frame > givenTo) {
            this._amflow.getStartPoint(opts, function (err, startPoint) {
                if (err) {
                    callback(err);
                    return;
                }
                if (startPoint && givenTo < startPoint.frame) {
                    callback(null, startPoint);
                }
                else {
                    // 与えられたティックリストの範囲内のスタートポイントが見つかったとしてもなかったかのように振る舞う
                    callback(null, _this._startPoints[index]);
                }
            });
        }
        else {
            setTimeout(function () {
                callback(null, _this._startPoints[index]);
            }, 0);
        }
    };
    ReplayAmflowProxy.prototype.putStorageData = function (key, value, options, callback) {
        this._amflow.putStorageData(key, value, options, callback);
    };
    ReplayAmflowProxy.prototype.getStorageData = function (keys, callback) {
        this._amflow.getStorageData(keys, callback);
    };
    ReplayAmflowProxy.prototype._sliceTicks = function (ticks, from, to) {
        return ticks.filter(function (t) {
            var age = t[0 /* Frame */];
            return from <= age && age <= to;
        });
    };
    return ReplayAmflowProxy;
}());
exports.ReplayAmflowProxy = ReplayAmflowProxy;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathUtil = void 0;
/**
 * パスユーティリティ。
 */
var PathUtil;
(function (PathUtil) {
    /**
     * 二つのパス文字列をつなぎ、相対パス表現 (".", "..") を解決して返す。
     * @param base 左辺パス文字列 (先頭の "./" を除き、".", ".." を含んではならない)
     * @param path 右辺パス文字列
     */
    function resolvePath(base, path) {
        function split(str) {
            var ret = str.split("/");
            if (ret[ret.length - 1] === "")
                ret.pop();
            return ret;
        }
        if (path === "")
            return base;
        var baseComponents = PathUtil.splitPath(base);
        var parts = split(baseComponents.path).concat(split(path));
        var resolved = [];
        for (var i = 0; i < parts.length; ++i) {
            var part = parts[i];
            switch (part) {
                case "..":
                    var popped = resolved.pop();
                    if (popped === undefined || popped === "" || popped === ".")
                        throw new Error("PathUtil.resolvePath: invalid arguments");
                    break;
                case ".":
                    if (resolved.length === 0) {
                        resolved.push(".");
                    }
                    break;
                case "": // 絶対パス
                    resolved = [""];
                    break;
                default:
                    resolved.push(part);
            }
        }
        return baseComponents.host + resolved.join("/");
    }
    PathUtil.resolvePath = resolvePath;
    /**
     * パス文字列からディレクトリ名部分を切り出して返す。
     * @param path パス文字列
     */
    function resolveDirname(path) {
        var index = path.lastIndexOf("/");
        if (index === -1)
            return path;
        return path.substr(0, index);
    }
    PathUtil.resolveDirname = resolveDirname;
    /**
     * パス文字列から拡張子部分を切り出して返す。
     * @param path パス文字列
     */
    function resolveExtname(path) {
        for (var i = path.length - 1; i >= 0; --i) {
            var c = path.charAt(i);
            if (c === ".") {
                return path.substr(i);
            }
            else if (c === "/") {
                return "";
            }
        }
        return "";
    }
    PathUtil.resolveExtname = resolveExtname;
    /**
     * パス文字列から、node.js において require() の探索範囲になるパスの配列を作成して返す。
     * @param path ディレクトリを表すパス文字列
     */
    function makeNodeModulePaths(path) {
        var pathComponents = PathUtil.splitPath(path);
        var host = pathComponents.host;
        path = pathComponents.path;
        if (path[path.length - 1] === "/") {
            path = path.slice(0, path.length - 1);
        }
        var parts = path.split("/");
        var firstDir = parts.indexOf("node_modules");
        var root = firstDir > 0 ? firstDir - 1 : 0;
        var dirs = [];
        for (var i = parts.length - 1; i >= root; --i) {
            if (parts[i] === "node_modules")
                continue;
            var dirParts = parts.slice(0, i + 1);
            dirParts.push("node_modules");
            var dir = dirParts.join("/");
            dirs.push(host + dir);
        }
        return dirs;
    }
    PathUtil.makeNodeModulePaths = makeNodeModulePaths;
    /**
     * 与えられたパス文字列からホストを切り出す。
     * @param path パス文字列
     */
    function splitPath(path) {
        var host = "";
        var doubleSlashIndex = path.indexOf("//");
        if (doubleSlashIndex >= 0) {
            var hostSlashIndex = path.indexOf("/", doubleSlashIndex + 2); // 2 === "//".length
            if (hostSlashIndex >= 0) {
                host = path.slice(0, hostSlashIndex);
                path = path.slice(hostSlashIndex); // 先頭に "/" を残して絶対パス扱いさせる
            }
            else {
                host = path;
                path = "/"; // path全体がホストだったので、絶対パス扱いさせる
            }
        }
        else {
            host = "";
        }
        return { host: host, path: path };
    }
    PathUtil.splitPath = splitPath;
})(PathUtil = exports.PathUtil || (exports.PathUtil = {}));

},{}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./PathUtil"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./utils"), exports);

},{"./PathUtil":3,"./types":5,"./utils":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mergeObject = exports.makeLoadConfigurationFunc = void 0;
var es6_promise_1 = require("es6-promise");
var PathUtil_1 = require("./PathUtil");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function makeLoadConfigurationFunc(loadConfiguration) {
    function loadResolvedConfiguration(url, assetBase, cascadeBase, callback) {
        loadConfiguration(url, function (err, conf) {
            if (err) {
                return void callback(err);
            }
            if (!("definitions" in conf)) {
                var c = void 0;
                try {
                    c = _normalizeAssets(conf, assetBase !== null && assetBase !== void 0 ? assetBase : PathUtil_1.PathUtil.resolveDirname(url));
                }
                catch (e) {
                    return void callback(e);
                }
                return void callback(null, c);
            }
            var defs = conf.definitions.map(function (def) {
                if (typeof def === "string") {
                    var resolvedUrl = cascadeBase ? PathUtil_1.PathUtil.resolvePath(cascadeBase, def) : def;
                    return promisifiedLoad(resolvedUrl, undefined, cascadeBase);
                }
                else {
                    var resolvedUrl = cascadeBase ? PathUtil_1.PathUtil.resolvePath(cascadeBase, def.url) : def.url;
                    return promisifiedLoad(resolvedUrl, def.basePath, cascadeBase);
                }
            });
            es6_promise_1.Promise.all(defs)
                .then(function (confs) { return callback(null, confs.reduce(_mergeObject)); })
                .catch(function (e) { return callback(e); });
        });
    }
    function promisifiedLoad(url, assetBase, cascadeBase) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            loadResolvedConfiguration(url, assetBase, cascadeBase, function (err, conf) { return (err ? reject(err) : resolve(conf)); });
        });
    }
    return loadResolvedConfiguration;
}
exports.makeLoadConfigurationFunc = makeLoadConfigurationFunc;
/**
 * 与えられたオブジェクト二つを「マージ」する。
 * ここでマージとは、オブジェクトのフィールドをイテレートし、
 * プリミティブ値であれば上書き、配列であればconcat、オブジェクトであれば再帰的にマージする処理である。
 *
 * @param target マージされるオブジェクト。この値は破壊される
 * @param source マージするオブジェクト
 */
function _mergeObject(target, source) {
    var ks = Object.keys(source);
    for (var i = 0, len = ks.length; i < len; ++i) {
        var k = ks[i];
        var sourceVal = source[k];
        var sourceValType = typeof sourceVal;
        var targetValType = typeof target[k];
        if (sourceValType !== targetValType) {
            target[k] = sourceVal;
            continue;
        }
        if (sourceValType === "string" || sourceValType === "number" || sourceValType === "boolean") {
            target[k] = sourceVal;
        }
        else if (sourceValType === "object") {
            if (sourceVal == null) {
                target[k] = sourceVal;
            }
            else if (Array.isArray(sourceVal)) {
                target[k] = target[k].concat(sourceVal);
            }
            else {
                _mergeObject(target[k], sourceVal);
            }
        }
        else {
            throw new Error("_mergeObject(): unknown type");
        }
    }
    return target;
}
exports._mergeObject = _mergeObject;
/**
 * @private
 */
function _normalizeAssets(configuration, assetBase) {
    var _a;
    var assets = {};
    function addAsset(assetId, asset) {
        if (assets.hasOwnProperty(assetId))
            throw new Error("_normalizeAssets: asset ID already exists: " + assetId);
        assets[assetId] = asset;
    }
    if (Array.isArray(configuration.assets)) {
        configuration.assets.forEach(function (asset) {
            var _a;
            var path = asset.path;
            if (path) {
                asset.virtualPath = (_a = asset.virtualPath) !== null && _a !== void 0 ? _a : asset.path;
                asset.path = PathUtil_1.PathUtil.resolvePath(assetBase, path);
            }
            addAsset(path, asset);
        });
    }
    else if (typeof configuration.assets === "object") {
        for (var assetId in configuration.assets) {
            if (!configuration.assets.hasOwnProperty(assetId))
                continue;
            var asset = configuration.assets[assetId];
            if (asset.path) {
                asset.virtualPath = (_a = asset.virtualPath) !== null && _a !== void 0 ? _a : asset.path;
                asset.path = PathUtil_1.PathUtil.resolvePath(assetBase, asset.path);
            }
            addAsset(assetId, asset);
        }
    }
    if (configuration.globalScripts) {
        configuration.globalScripts.forEach(function (path) {
            addAsset(path, {
                type: /\.json$/i.test(path) ? "text" : "script",
                virtualPath: path,
                path: PathUtil_1.PathUtil.resolvePath(assetBase, path),
                global: true
            });
        });
        delete configuration.globalScripts;
    }
    configuration.assets = assets;
    return configuration;
}

},{"./PathUtil":3,"es6-promise":25}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
var g = require("@akashic/akashic-engine");
/**
 * FPS管理用のクロック。
 *
 * `pdi.Looper` の定期または不定期の呼び出しを受け付け、指定されたFPSから求めた
 * 1フレーム分の時間(1フレーム時間)が経過するたびに `frameTrigger` をfireする。
 */
var Clock = /** @class */ (function () {
    function Clock(param) {
        this.fps = param.fps;
        this.scaleFactor = param.scaleFactor || 1;
        this.frameTrigger = new g.Trigger();
        this.rawFrameTrigger = new g.Trigger();
        this._platform = param.platform;
        this._maxFramePerOnce = param.maxFramePerOnce;
        this._deltaTimeBrokenThreshold = param.deltaTimeBrokenThreshold || Clock.DEFAULT_DELTA_TIME_BROKEN_THRESHOLD;
        if (param.frameHandler) {
            this.frameTrigger.add(param.frameHandler, param.frameHandlerOwner);
        }
        this.running = false;
        this._totalDeltaTime = 0;
        this._onLooperCall_bound = this._onLooperCall.bind(this);
        this._looper = this._platform.createLooper(this._onLooperCall_bound);
        this._waitTime = 0;
        this._waitTimeDoubled = 0;
        this._waitTimeMax = 0;
        this._skipFrameWaitTime = 0;
        this._realMaxFramePerOnce = 0;
    }
    Clock.prototype.start = function () {
        if (this.running)
            return;
        this._totalDeltaTime = 0;
        this._updateWaitTimes(this.fps, this.scaleFactor);
        this._looper.start();
        this.running = true;
    };
    Clock.prototype.stop = function () {
        if (!this.running)
            return;
        this._looper.stop();
        this.running = false;
    };
    /**
     * `scaleFactor` を変更する。
     * start()した後にも呼び出せるが、1フレーム以下の経過時間情報はリセットされる点に注意。
     */
    Clock.prototype.changeScaleFactor = function (scaleFactor) {
        if (this.running) {
            this.stop();
            this.scaleFactor = scaleFactor;
            this.start();
        }
        else {
            this.scaleFactor = scaleFactor;
        }
    };
    Clock.prototype._onLooperCall = function (deltaTime) {
        if (isNaN(deltaTime)) {
            // NaN が渡された場合 次のフレームまで進行する。
            deltaTime = this._waitTime - this._totalDeltaTime;
        }
        var rawDeltaTime = deltaTime;
        if (deltaTime <= 0) {
            // 時間が止まっているか巻き戻っている。初回呼び出しか、あるいは何かがおかしい。時間経過0と見なす。
            return this._waitTime - this._totalDeltaTime;
        }
        if (deltaTime > this._deltaTimeBrokenThreshold) {
            // 間隔が長すぎる。何かがおかしい。時間経過を1フレーム分とみなす。
            deltaTime = this._waitTime;
        }
        var totalDeltaTime = this._totalDeltaTime;
        totalDeltaTime += deltaTime;
        if (totalDeltaTime <= this._skipFrameWaitTime) {
            // 1フレーム分消化するほどの時間が経っていない。
            this._totalDeltaTime = totalDeltaTime;
            return this._waitTime - totalDeltaTime;
        }
        var frameCount = (totalDeltaTime < this._waitTimeDoubled) ? 1
            : (totalDeltaTime > this._waitTimeMax) ? this._realMaxFramePerOnce
                : (totalDeltaTime / this._waitTime) | 0;
        var fc = frameCount;
        var arg = {
            deltaTime: rawDeltaTime,
            interrupt: false
        };
        while (fc > 0 && this.running && !arg.interrupt) {
            --fc;
            this.frameTrigger.fire(arg);
            arg.deltaTime = 0; // 同ループによる2度目以降の呼び出しは差分を0とみなす。
        }
        totalDeltaTime -= ((frameCount - fc) * this._waitTime);
        this.rawFrameTrigger.fire();
        this._totalDeltaTime = totalDeltaTime;
        return this._waitTime - totalDeltaTime;
    };
    Clock.prototype._updateWaitTimes = function (fps, scaleFactor) {
        var realFps = fps * scaleFactor;
        this._waitTime = 1000 / realFps;
        this._waitTimeDoubled = Math.max((2000 / realFps) | 0, 1);
        this._waitTimeMax = Math.max(scaleFactor * (1000 * this._maxFramePerOnce / realFps) | 0, 1);
        this._skipFrameWaitTime = (this._waitTime * Clock.ANTICIPATE_RATE) | 0;
        this._realMaxFramePerOnce = this._maxFramePerOnce * scaleFactor;
    };
    /**
     * 経過時間先取りの比率。
     *
     * FPSから定まる「1フレーム」の経過時間が経っていなくても、この割合の時間が経過していれば1フレーム分の計算を進めてしまう。
     * その代わりに次フレームまでの所要時間を長くする。
     * 例えば20FPSであれば50msで1フレームだが、50*0.8 = 40ms 時点で1フレーム進めてしまい、次フレームまでの時間を60msにする。
     */
    Clock.ANTICIPATE_RATE = 0.8;
    /**
     * 異常値とみなして無視する `Looper` の呼び出し間隔[ms]のデフォルト値。
     */
    Clock.DEFAULT_DELTA_TIME_BROKEN_THRESHOLD = 150;
    return Clock;
}());
exports.Clock = Clock;

},{"@akashic/akashic-engine":"@akashic/akashic-engine"}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBuffer = void 0;
/**
 * AMFlowとPDIから流れ込むイベントを蓄積するバッファ。
 *
 * AMFLowから受信するかどうか、AMFlowに送るかどうかは外部から切り替えることができる。
 * 状態によっては、`_amflow` の認証で `subscribeEvent` と `sendEvent` のいずれかまたは両方の権限を取得している必要がある。
 * 詳細は `setMode()` のコメントを参照。
 */
var EventBuffer = /** @class */ (function () {
    function EventBuffer(param) {
        var _this = this;
        /**
         * スキップ中に発生した非ローカルイベントを破棄するかどうか。
         * NOTE: 基本的には `true` で問題ないはずだが念の為メンバ変数として持たせておく
         */
        this._discardsEventsDuringSkip = true;
        /**
         * スキップ中に発生したローカルイベントを破棄するかどうか。
         * NOTE: 基本的には `true` で問題ないはずだが念の為メンバ変数として持たせておく
         */
        this._discardsLocalEventsDuringSkip = true;
        this._filters = null;
        this._amflow = param.amflow;
        this._isLocalReceiver = true;
        this._isReceiver = false;
        this._isSender = false;
        this._isDiscarder = false;
        this._skipping = false;
        this._defaultEventPriority = 0;
        this._buffer = [];
        this._joinLeaveBuffer = [];
        this._localBuffer = [];
        this._filters = null;
        this._filterController = {
            // この関数は `this.processEvents()` が呼び出すイベントフィルタから同期的にしか呼び出されることはない。(また呼び出されてはならない)
            // `this.processEvents()` は `this._unfilteredEvents` などを空にして、同期的にイベントフィルタを呼ぶ。
            // 従ってこの関数が呼ばれる時、 `this._unfilteredEvents` などに後続の (次フレーム以降に処理される) イベントが積まれている可能性はない。
            // よって単純に push() しても、後続のイベントとの順序が崩れる可能性はない。
            processNext: function (pev) {
                if (EventBuffer.isEventLocal(pev)) {
                    _this._unfilteredLocalEvents.push(pev);
                }
                else {
                    _this._unfilteredEvents.push(pev);
                }
            }
        };
        this._unfilteredLocalEvents = [];
        this._unfilteredEvents = [];
        this._resolvePointEvent_bound = param.game.resolvePointEvent.bind(param.game);
        this._onEvent_bound = this.onEvent.bind(this);
    }
    EventBuffer.isEventLocal = function (pev) {
        switch (pev[0 /* Code */]) {
            case 0 /* Join */:
                return pev[5 /* Local */];
            case 1 /* Leave */:
                return pev[3 /* Local */];
            case 2 /* Timestamp */:
                return pev[4 /* Local */];
            case 3 /* PlayerInfo */:
                return pev[5 /* Local */];
            case 32 /* Message */:
                return pev[4 /* Local */];
            case 33 /* PointDown */:
                return pev[7 /* Local */];
            case 34 /* PointMove */:
                return pev[11 /* Local */];
            case 35 /* PointUp */:
                return pev[11 /* Local */];
            case 64 /* Operation */:
                return pev[5 /* Local */];
            default:
                throw new Error("EventBuffer.isEventLocal");
        }
    };
    /**
     * モードを切り替える。
     *
     * この関数の呼び出す場合、最後に呼び出された _amflow#authenticate() から得た Permission は次の条件を満たさねばならない:
     * * 引数 `param.isReceiver` に真を渡す場合、次に偽を渡すまでの間、 `subscribeEvent` が真であること。
     * * 引数 `param.isSender` に真を渡す場合、次に偽を渡すまでの間、 `sendEvent` が真であること。
     */
    EventBuffer.prototype.setMode = function (param) {
        if (param.isLocalReceiver != null) {
            this._isLocalReceiver = param.isLocalReceiver;
        }
        if (param.isReceiver != null) {
            if (this._isReceiver !== param.isReceiver) {
                this._isReceiver = param.isReceiver;
                if (param.isReceiver) {
                    this._amflow.onEvent(this._onEvent_bound);
                }
                else {
                    this._amflow.offEvent(this._onEvent_bound);
                }
            }
        }
        if (param.isSender != null) {
            this._isSender = param.isSender;
        }
        if (param.isDiscarder != null) {
            this._isDiscarder = param.isDiscarder;
        }
        if (param.defaultEventPriority != null) {
            this._defaultEventPriority = 3 /* Priority */ & param.defaultEventPriority;
        }
    };
    EventBuffer.prototype.getMode = function () {
        return {
            isLocalReceiver: this._isLocalReceiver,
            isReceiver: this._isReceiver,
            isSender: this._isSender,
            isDiscarder: this._isDiscarder,
            defaultEventPriority: this._defaultEventPriority
        };
    };
    EventBuffer.prototype.onEvent = function (pev) {
        if (EventBuffer.isEventLocal(pev)) {
            if (this._isLocalReceiver &&
                !this._isDiscarder &&
                !(this._skipping && this._discardsLocalEventsDuringSkip)) {
                this._unfilteredLocalEvents.push(pev);
            }
            return;
        }
        if (this._skipping && this._discardsEventsDuringSkip) {
            return;
        }
        if (this._isReceiver && !this._isDiscarder) {
            this._unfilteredEvents.push(pev);
        }
        if (this._isSender) {
            if (pev[1 /* EventFlags */] == null) {
                pev[1 /* EventFlags */] = this._defaultEventPriority & 3 /* Priority */;
            }
            this._amflow.sendEvent(pev);
        }
    };
    EventBuffer.prototype.onPointEvent = function (e) {
        var pev = this._resolvePointEvent_bound(e);
        if (pev)
            this.onEvent(pev);
    };
    /**
     * filterを無視してイベントを追加する。
     */
    EventBuffer.prototype.addEventDirect = function (pev) {
        if (EventBuffer.isEventLocal(pev)) {
            if (!this._isLocalReceiver || this._isDiscarder)
                return;
            this._localBuffer.push(pev);
            return;
        }
        if (this._isReceiver && !this._isDiscarder) {
            if (pev[0 /* Code */] === 0 /* Join */ || pev[0 /* Code */] === 1 /* Leave */) {
                this._joinLeaveBuffer.push(pev);
            }
            else {
                this._buffer.push(pev);
            }
        }
        if (this._isSender) {
            if (pev[1 /* EventFlags */] == null) {
                pev[1 /* EventFlags */] = this._defaultEventPriority & 3 /* Priority */;
            }
            this._amflow.sendEvent(pev);
        }
    };
    EventBuffer.prototype.readEvents = function () {
        var ret = this._buffer;
        if (ret.length === 0)
            return null;
        this._buffer = [];
        return ret;
    };
    EventBuffer.prototype.readJoinLeaves = function () {
        var ret = this._joinLeaveBuffer;
        if (ret.length === 0)
            return null;
        this._joinLeaveBuffer = [];
        return ret;
    };
    EventBuffer.prototype.readLocalEvents = function () {
        var ret = this._localBuffer;
        if (ret.length === 0)
            return null;
        this._localBuffer = [];
        return ret;
    };
    EventBuffer.prototype.addFilter = function (filter, handleEmpty) {
        if (!this._filters)
            this._filters = [];
        this._filters.push({ func: filter, handleEmpty: !!handleEmpty });
    };
    EventBuffer.prototype.removeFilter = function (filter) {
        if (!this._filters)
            return;
        if (!filter) {
            this._filters = null;
            return;
        }
        for (var i = this._filters.length - 1; i >= 0; --i) {
            if (this._filters[i].func === filter)
                this._filters.splice(i, 1);
        }
    };
    EventBuffer.prototype.processEvents = function (isLocal) {
        var ulpevs = this._unfilteredLocalEvents;
        var upevs = this._unfilteredEvents;
        this._unfilteredLocalEvents = [];
        var pevs = ulpevs;
        if (!isLocal && upevs.length > 0) {
            pevs = (pevs.length > 0) ? pevs.concat(upevs) : upevs;
            this._unfilteredEvents = [];
        }
        if (this._filters) {
            for (var i = 0; i < this._filters.length; ++i) {
                var filter = this._filters[i];
                if (pevs.length > 0 || filter.handleEmpty)
                    pevs = this._filters[i].func(pevs, this._filterController) || [];
            }
        }
        for (var i = 0; i < pevs.length; ++i) {
            var pev = pevs[i];
            if (EventBuffer.isEventLocal(pev)) {
                this._localBuffer.push(pev);
            }
            else if (pev[0 /* Code */] === 0 /* Join */ || pev[0 /* Code */] === 1 /* Leave */) {
                this._joinLeaveBuffer.push(pev);
            }
            else {
                this._buffer.push(pev);
            }
        }
    };
    EventBuffer.prototype.startSkipping = function () {
        this._skipping = true;
    };
    EventBuffer.prototype.endSkipping = function () {
        this._skipping = false;
    };
    return EventBuffer;
}());
exports.EventBuffer = EventBuffer;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `GameLoop` の実行モード。
 */
var ExecutionMode;
(function (ExecutionMode) {
    /**
     * `GameLoop` がactiveである。
     *
     * `GameLoop#_executionMode` がこの値である場合、そのインスタンスは:
     *  - playlog.Eventを外部から受け付ける
     *  - playlog.Tickを生成し外部へ送信する
     */
    ExecutionMode[ExecutionMode["Active"] = 0] = "Active";
    /**
     * `GameLoop` がpassiveである。
     *
     * `GameLoop#_executionMode` がこの値である場合、そのインスタンスは:
     *  - playlog.Eventを外部に送信する
     *  - playlog.Tickを受信し、それに基づいて `g.Game#tick()` を呼び出す
     */
    ExecutionMode[ExecutionMode["Passive"] = 1] = "Passive";
})(ExecutionMode || (ExecutionMode = {}));
exports.default = ExecutionMode;

},{}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var g = require("@akashic/akashic-engine");
/**
 * Gameクラス。
 *
 * このクラスはakashic-engineに由来するクラスであり、
 * アンダースコアで始まるプロパティ (e.g. _foo) を外部から参照する場合がある点に注意。
 * (akashic-engine においては、_foo は「ゲーム開発者向けでない」ことしか意味しない。)
 */
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game(param) {
        var _this = _super.call(this, param) || this;
        /**
         * 特定ageへの到達を通知するTrigger。
         * fire時には到達したageが渡される。
         */
        _this.agePassedTrigger = new g.Trigger();
        /**
         * 要求を受けた後の目標時刻到達を通知するTrigger。
         * 目標時刻関数を用いたリプレイ中でなければfireされない。
         * fire時には到達した目標時刻が渡される。
         */
        _this.targetTimeReachedTrigger = new g.Trigger();
        /**
         * GameLoopのスキップ状態の変化を通知するTrigger。
         * 通常状態からスキップ状態に遷移する際にtrue、スキップ状態から通常状態に戻る時にfalseが渡される。
         *
         * ゲーム開発者に公開される g.Game#skippingChanged との違いに注意。
         * 組み込み側に公開されるこちらが常にfireされる一方、`skippingChanged` は `isSkipAware` が真の時のみfireされる。
         */
        _this.skippingChangedTrigger = new g.Trigger();
        /**
         * Gameの続行が断念されたことを通知するTrigger。
         *
         * 現在のバージョンでは、これをfireする方法は `Game#_abortGame()` の呼び出し、または
         * それを引き起こすリトライ不能のアセットエラーだけである。
         * ただしこの `Game#_abortGame()` の仕様は今後変動しうる。
         */
        _this.abortTrigger = new g.Trigger();
        _this._notifyPassedAgeTable = Object.create(null);
        _this._notifiesTargetTimeReached = false;
        _this._isSkipAware = false;
        _this.player = param.player;
        _this.handlerSet = param.handlerSet;
        _this._gameArgs = param.gameArgs;
        _this._globalGameArgs = param.globalGameArgs;
        _this.skippingChangedTrigger.add(_this._onSkippingChanged, _this);
        return _this;
    }
    /**
     * 特定age到達時の通知を要求する。
     * @param age 通知を要求するage
     */
    Game.prototype.requestNotifyAgePassed = function (age) {
        this._notifyPassedAgeTable[age] = true;
    };
    /**
     * 特定age到達時の通知要求を解除する。
     * @param age 通知要求を解除するage
     */
    Game.prototype.cancelNotifyAgePassed = function (age) {
        delete this._notifyPassedAgeTable[age];
    };
    /**
     * 次に目標時刻を到達した時点を通知するよう要求する。
     * 重複呼び出しはサポートしていない。すなわち、呼び出し後 `targetTimeReachedTrigger` がfireされるまでの呼び出しは無視される。
     */
    Game.prototype.requestNotifyTargetTimeReached = function () {
        this._notifiesTargetTimeReached = true;
    };
    /**
     * 目標時刻を到達した時点を通知要求を解除する。
     */
    Game.prototype.cancelNofityTargetTimeReached = function () {
        this._notifiesTargetTimeReached = false;
    };
    Game.prototype.fireAgePassedIfNeeded = function () {
        var age = this.age - 1; // 通過済みのageを確認するため -1 する。
        if (this._notifyPassedAgeTable[age]) {
            delete this._notifyPassedAgeTable[age];
            this.agePassedTrigger.fire(age);
            return true;
        }
        return false;
    };
    Game.prototype.setStorageFunc = function (funcs) {
        this.storage._registerLoad(funcs.storageGetFunc);
        this.storage._registerWrite(funcs.storagePutFunc);
        // TODO: akashic-engine 側で書き換えられるようにする
        this.storage.requestValuesForJoinPlayer = funcs.requestValuesForJoinFunc;
    };
    Game.prototype.getIsSkipAware = function () {
        return this._isSkipAware;
    };
    Game.prototype.setIsSkipAware = function (aware) {
        this._isSkipAware = aware;
    };
    Game.prototype._destroy = function () {
        this.agePassedTrigger.destroy();
        this.agePassedTrigger = null;
        this.targetTimeReachedTrigger.destroy();
        this.targetTimeReachedTrigger = null;
        this.skippingChangedTrigger.destroy();
        this.skippingChangedTrigger = null;
        this.abortTrigger.destroy();
        this.abortTrigger = null;
        this.player = null;
        this.handlerSet = null;
        this._notifyPassedAgeTable = null;
        this._gameArgs = null;
        this._globalGameArgs = null;
        _super.prototype._destroy.call(this);
    };
    Game.prototype._restartWithSnapshot = function (snapshot) {
        var data = snapshot.data;
        if (data.seed != null) {
            // 例外ケース: 第0スタートポイントでスナップショットは持っていないので特別対応
            this._reset({ age: snapshot.frame, randSeed: data.seed });
            this._loadAndStart({ args: this._gameArgs, globalArgs: this._globalGameArgs });
        }
        else {
            this._reset({ age: snapshot.frame, nextEntityId: data.nextEntityId, randGenSer: data.randGenSer });
            this._loadAndStart({ snapshot: data.gameSnapshot });
        }
    };
    Game.prototype._abortGame = function () {
        this.abortTrigger.fire();
    };
    Game.prototype._onRawTargetTimeReached = function (targetTime) {
        if (this._notifiesTargetTimeReached) {
            this._notifiesTargetTimeReached = false;
            this.targetTimeReachedTrigger.fire(targetTime);
        }
    };
    Game.prototype._onSkippingChanged = function (skipping) {
        if (this._isSkipAware) {
            this.onSkipChange.fire(skipping);
        }
    };
    return Game;
}(g.Game));
exports.Game = Game;

},{"@akashic/akashic-engine":"@akashic/akashic-engine"}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDriver = void 0;
var g = require("@akashic/akashic-engine");
var utils_1 = require("@akashic/game-configuration/lib/utils");
var es6_promise_1 = require("es6-promise");
var constants = require("./constants");
var EventBuffer_1 = require("./EventBuffer");
var ExecutionMode_1 = require("./ExecutionMode");
var Game_1 = require("./Game");
var GameHandlerSet_1 = require("./GameHandlerSet");
var GameLoop_1 = require("./GameLoop");
var LoopMode_1 = require("./LoopMode");
var GAME_DESTROYED_MESSAGE = "GAME_DESTROYED";
var GameDriver = /** @class */ (function () {
    function GameDriver(param) {
        this.errorTrigger = new g.Trigger();
        this.configurationLoadedTrigger = new g.Trigger();
        this.gameCreatedTrigger = new g.Trigger();
        this._rendererRequirement = null;
        this._game = null;
        this._gameLoop = null;
        this._eventBuffer = null;
        this._openedAmflow = false;
        this._playToken = null;
        this._permission = null;
        this._hidden = false;
        this._destroyed = false;
        if (param.errorHandler)
            this.errorTrigger.add(param.errorHandler, param.errorHandlerOwner);
        this._platform = param.platform;
        this._loadConfigurationFunc = (0, utils_1.makeLoadConfigurationFunc)(param.platform.loadGameConfiguration);
        this._player = param.player;
    }
    /**
     * `GameDriver` を初期化する。
     */
    GameDriver.prototype.initialize = function (param, callback) {
        this.doInitialize(param).then(function () {
            callback();
        }, callback);
    };
    /**
     * `GameDriver` の各種状態を変更する。
     *
     * 引数 `param` のうち、省略されなかった値が新たに設定される。
     * `startGame()` によりゲームが開始されていた場合、暗黙に `stopGame()` が行われ、完了後 `startGame()` される。
     */
    GameDriver.prototype.changeState = function (param, callback) {
        var _this = this;
        var _a;
        var pausing = this._gameLoop && this._gameLoop.running;
        if (pausing)
            (_a = this._gameLoop) === null || _a === void 0 ? void 0 : _a.stop();
        this.initialize(param, function (err) {
            var _a;
            if (err) {
                callback(err);
                return;
            }
            if (pausing)
                (_a = _this._gameLoop) === null || _a === void 0 ? void 0 : _a.start();
            callback();
        });
    };
    /**
     * ゲームを開始する。
     * このメソッドの呼び出しは、 `initialize()` の完了後でなければならない。
     */
    GameDriver.prototype.startGame = function () {
        if (!this._gameLoop) {
            this.errorTrigger.fire(new Error("Not initialized"));
            return;
        }
        this._gameLoop.start();
    };
    /**
     * ゲームを(一時的に)止める。
     *
     * このメソッドの呼び出し後、 `startGame()` が呼び出されるまで、 `Game#tick()` は呼び出されない。
     * Active であればティックの生成が行われず、 Passive であれば受信したティックは蓄積される。
     */
    GameDriver.prototype.stopGame = function () {
        if (this._gameLoop) {
            this._gameLoop.stop();
        }
    };
    /**
     * このドライバが次にティックを生成する場合の、ageの値を設定する。
     * `ExecutionMode.Active` でない場合、動作に影響を与えない。
     * このメソッドの呼び出しは、 `initialize()` の完了後でなければならない。
     *
     * @param age 次に生成されるティックのage
     */
    GameDriver.prototype.setNextAge = function (age) {
        var _a;
        (_a = this._gameLoop) === null || _a === void 0 ? void 0 : _a.setNextAge(age);
    };
    GameDriver.prototype.getPermission = function () {
        return this._permission;
    };
    GameDriver.prototype.getDriverConfiguration = function () {
        var _a;
        return {
            playId: this._playId,
            playToken: (_a = this._playToken) !== null && _a !== void 0 ? _a : undefined,
            executionMode: this._gameLoop ? this._gameLoop.getExecutionMode() : undefined,
            eventBufferMode: this._eventBuffer ? this._eventBuffer.getMode() : undefined
        };
    };
    GameDriver.prototype.getLoopConfiguration = function () {
        return this._gameLoop ? this._gameLoop.getLoopConfiguration() : null;
    };
    GameDriver.prototype.getHidden = function () {
        return this._hidden;
    };
    /**
     * PDIに対してプライマリサーフェスのリセットを要求する。
     *
     * @param width プライマリサーフェスの幅。
     * @param height プライマリサーフェスの高さ。
     * @param rendererCandidates Rendererのタイプ。
     */
    GameDriver.prototype.resetPrimarySurface = function (width, height, rendererCandidates) {
        rendererCandidates = rendererCandidates ? rendererCandidates
            : this._rendererRequirement ? this._rendererRequirement.rendererCandidates
                : undefined;
        var game = this._game;
        var pf = this._platform;
        var primarySurface = pf.getPrimarySurface();
        game.renderers = game.renderers.filter(function (renderer) { return renderer !== primarySurface.renderer(); });
        pf.setRendererRequirement({
            primarySurfaceWidth: width,
            primarySurfaceHeight: height,
            rendererCandidates: rendererCandidates
        });
        this._rendererRequirement = {
            primarySurfaceWidth: width,
            primarySurfaceHeight: height,
            rendererCandidates: rendererCandidates
        };
        game.renderers.push(pf.getPrimarySurface().renderer());
        game.width = width;
        game.height = height;
        game.onResized.fire({ width: width, height: height });
        game.modified();
    };
    GameDriver.prototype.doInitialize = function (param) {
        var _this = this;
        var p = new es6_promise_1.Promise(function (resolve, reject) {
            if (_this._gameLoop && _this._gameLoop.running) {
                return reject(new Error("Game is running. Must be stopped."));
            }
            if (_this._gameLoop && param.loopConfiguration) {
                _this._gameLoop.setLoopConfiguration(param.loopConfiguration);
            }
            if (param.hidden != null) {
                _this._hidden = param.hidden;
                if (_this._game) {
                    _this._game._setMuted(param.hidden);
                }
            }
            resolve();
        }).then(function () {
            _this._assertLive();
            return _this._doSetDriverConfiguration(param.driverConfiguration);
        });
        var configurationUrl = param.configurationUrl;
        if (!configurationUrl)
            return p;
        return p.then(function () {
            _this._assertLive();
            return _this._loadConfiguration(configurationUrl, param.assetBase, param.configurationBase);
        }).then(function (conf) {
            _this._assertLive();
            return _this._createGame(conf, _this._player, param);
        });
    };
    GameDriver.prototype.destroy = function () {
        var _this = this;
        // NOTE: ここで破棄されるTriggerのfire中に呼ばれるとクラッシュするので、同期的処理だが念のためPromiseに包んで非同期で実行する
        return new es6_promise_1.Promise(function (resolve, _reject) {
            _this.stopGame();
            if (_this._game) {
                _this._game._destroy();
                _this._game = null;
            }
            _this.errorTrigger.destroy();
            _this.errorTrigger = null;
            _this.configurationLoadedTrigger.destroy();
            _this.configurationLoadedTrigger = null;
            _this.gameCreatedTrigger.destroy();
            _this.gameCreatedTrigger = null;
            if (_this._platform.destroy) {
                _this._platform.destroy();
            }
            else {
                _this._platform.setRendererRequirement(undefined);
            }
            _this._platform = null;
            _this._loadConfigurationFunc = null;
            _this._player = null;
            _this._rendererRequirement = null;
            _this._playId = undefined;
            _this._gameLoop = null;
            _this._eventBuffer = null;
            _this._openedAmflow = false;
            _this._playToken = null;
            _this._permission = null;
            _this._hidden = false;
            _this._destroyed = true;
            resolve();
        });
    };
    GameDriver.prototype._doSetDriverConfiguration = function (dconf) {
        var _this = this;
        var _a, _b;
        if (dconf == null) {
            return es6_promise_1.Promise.resolve();
        }
        // デフォルト値の補完
        if (dconf.playId === undefined)
            dconf.playId = (_a = this._playId) !== null && _a !== void 0 ? _a : undefined;
        if (dconf.playToken === undefined)
            dconf.playToken = (_b = this._playToken) !== null && _b !== void 0 ? _b : undefined;
        if (dconf.eventBufferMode === undefined) {
            if (dconf.executionMode === ExecutionMode_1.default.Active) {
                dconf.eventBufferMode = { isReceiver: true, isSender: false };
            }
            else if (dconf.executionMode === ExecutionMode_1.default.Passive) {
                dconf.eventBufferMode = { isReceiver: false, isSender: true };
            }
        }
        var p = es6_promise_1.Promise.resolve();
        if (this._playId !== dconf.playId) {
            p = p.then(function () {
                _this._assertLive();
                return _this._doOpenAmflow(dconf.playId);
            });
        }
        if (this._playToken !== dconf.playToken) {
            p = p.then(function () {
                _this._assertLive();
                return _this._doAuthenticate(dconf.playToken);
            });
        }
        return p.then(function () {
            _this._assertLive();
            if (dconf.eventBufferMode != null) {
                if (dconf.eventBufferMode.defaultEventPriority == null) {
                    if (_this._permission) {
                        dconf.eventBufferMode.defaultEventPriority = 3 /* Priority */ & _this._permission.maxEventPriority;
                    }
                    else {
                        // NOTE: permission が無ければイベントを送信することはできないが、念の為に優先度を最低につけておく。
                        dconf.eventBufferMode.defaultEventPriority = 0;
                    }
                }
                if (_this._eventBuffer) {
                    _this._eventBuffer.setMode(dconf.eventBufferMode);
                }
            }
            if (dconf.executionMode != null) {
                if (_this._gameLoop) {
                    _this._gameLoop.setExecutionMode(dconf.executionMode);
                }
            }
        });
    };
    GameDriver.prototype._doCloseAmflow = function () {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            if (!_this._openedAmflow)
                return resolve();
            _this._platform.amflow.close(function (err) {
                _this._openedAmflow = false;
                var error = _this._getCallbackError(err);
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    };
    GameDriver.prototype._doOpenAmflow = function (playId) {
        var _this = this;
        if (playId === undefined) {
            return es6_promise_1.Promise.resolve();
        }
        var p = this._doCloseAmflow();
        return p.then(function () {
            _this._assertLive();
            return new es6_promise_1.Promise(function (resolve, reject) {
                if (playId === null)
                    return resolve();
                _this._platform.amflow.open(playId, function (err) {
                    var error = _this._getCallbackError(err);
                    if (error) {
                        return reject(error);
                    }
                    _this._openedAmflow = true;
                    _this._playId = playId;
                    if (_this._game)
                        _this._updateGamePlayId(_this._game);
                    resolve();
                });
            });
        });
    };
    GameDriver.prototype._doAuthenticate = function (playToken) {
        var _this = this;
        if (playToken == null)
            return es6_promise_1.Promise.resolve();
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._platform.amflow.authenticate(playToken, function (err, permission) {
                var error = _this._getCallbackError(err);
                if (error) {
                    return reject(error);
                }
                if (!permission) {
                    reject(new Error("Permission denied."));
                    return;
                }
                _this._playToken = playToken;
                _this._permission = permission;
                if (_this._game) {
                    _this._game.handlerSet.isSnapshotSaver = permission.writeTick;
                }
                resolve();
            });
        });
    };
    GameDriver.prototype._loadConfiguration = function (configurationUrl, assetBase, configurationBase) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._loadConfigurationFunc(configurationUrl, assetBase, configurationBase, function (err, conf) {
                var error = _this._getCallbackError(err);
                if (error) {
                    return void reject(error);
                }
                if (!conf) {
                    return void reject(new Error("GameDriver#_loadConfiguration: No configuration found."));
                }
                _this.configurationLoadedTrigger.fire(conf);
                resolve(conf);
            });
        });
    };
    GameDriver.prototype._putZerothStartPoint = function (data) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            // AMFlowは第0スタートポイントに関して「書かれるまで待つ」という動作をするため、「なければ書き込む」ことはできない。
            // NOTE: 仕様上第0スタートポイントには必ず data.startedAt が存在するとみなせる。
            var zerothStartPoint = { frame: 0, timestamp: data.startedAt, data: data };
            _this._platform.amflow.putStartPoint(zerothStartPoint, function (err) {
                var error = _this._getCallbackError(err);
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    };
    GameDriver.prototype._getStartPoint = function (frame) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._platform.amflow.getStartPoint({ frame: frame }, function (err, startPoint) {
                var error = _this._getCallbackError(err);
                if (error)
                    return reject(error);
                if (!startPoint)
                    return reject(new Error("GameDriver#_getStartPoint: No startPoint found"));
                resolve(startPoint);
            });
        });
    };
    GameDriver.prototype._createGame = function (conf, player, param) {
        var _this = this;
        var _a, _b;
        var writeTick = !!((_a = this._permission) === null || _a === void 0 ? void 0 : _a.writeTick);
        var putSeed = !!(((_b = param.driverConfiguration) === null || _b === void 0 ? void 0 : _b.executionMode) === ExecutionMode_1.default.Active) && writeTick;
        if (!param.loopConfiguration) // このパス (configurationUrl があって Game を作る) では必須
            throw new Error("GameDriver#_createGame: No loopConfiguration");
        var loopConfiguration = param.loopConfiguration;
        var p;
        if (putSeed) {
            p = this._putZerothStartPoint({
                seed: Date.now(),
                globalArgs: param.globalGameArgs,
                fps: conf.fps,
                startedAt: Date.now()
            });
        }
        else {
            p = es6_promise_1.Promise.resolve();
        }
        p = p.then(function () {
            _this._assertLive();
            return _this._getStartPoint(0);
        }).then(function (zerothSp) {
            if (!putSeed && loopConfiguration.loopMode === LoopMode_1.default.Realtime) {
                // 明確に最新に追いつきたいので、最新のスナップショットを探す
                return _this._getStartPoint(constants.PSEUDO_INFINITE_AGE).then(function (latestSp) { return [zerothSp, latestSp]; });
            }
            return [zerothSp, zerothSp];
        });
        return p.then(function (_a) {
            var zerothStartPoint = _a[0], latestStartPoint = _a[1];
            _this._assertLive();
            var zerothData = zerothStartPoint.data;
            if (typeof zerothData.seed !== "number") // 型がないので一応確認
                throw new Error("GameDriver#_createGame: No seed found in the zeroth startpoint.");
            var pf = _this._platform;
            var driverConf = param.driverConfiguration || {
                eventBufferMode: { isReceiver: true, isSender: false },
                executionMode: ExecutionMode_1.default.Active
            };
            var seed = zerothData.seed;
            var args = param.gameArgs;
            var globalArgs = zerothData.globalArgs;
            var startedAt = zerothData.startedAt;
            var rendererRequirement = {
                primarySurfaceWidth: conf.width,
                primarySurfaceHeight: conf.height,
                rendererCandidates: conf.renderers // TODO: g.GameConfiguration に renderers の定義を加える
            };
            pf.setRendererRequirement(rendererRequirement);
            var handlerSet = new GameHandlerSet_1.GameHandlerSet({
                isSnapshotSaver: writeTick
            });
            var game = new Game_1.Game({
                engineModule: g,
                handlerSet: handlerSet,
                configuration: conf,
                selfId: player.id,
                player: player,
                resourceFactory: pf.getResourceFactory(),
                assetBase: param.assetBase,
                operationPluginViewInfo: (pf.getOperationPluginViewInfo ? pf.getOperationPluginViewInfo() : undefined),
                gameArgs: args,
                globalGameArgs: globalArgs
            });
            var eventBuffer = new EventBuffer_1.EventBuffer({ game: game, amflow: pf.amflow });
            // NOTE: this._doSetDriverConfiguration() により driverConf の各 config が non-null であることが保証されている
            var eventBufferMode = driverConf.eventBufferMode;
            var executionMode = driverConf.executionMode;
            eventBuffer.setMode(eventBufferMode);
            pf.setPlatformEventHandler(eventBuffer);
            handlerSet.setEventFilterFuncs({
                addFilter: eventBuffer.addFilter.bind(eventBuffer),
                removeFilter: eventBuffer.removeFilter.bind(eventBuffer)
            });
            game.renderers.push(pf.getPrimarySurface().renderer());
            var gameLoop = new GameLoop_1.GameLoop({
                game: game,
                amflow: pf.amflow,
                platform: pf,
                executionMode: executionMode,
                eventBuffer: eventBuffer,
                configuration: loopConfiguration,
                startedAt: startedAt,
                profiler: param.profiler
            });
            gameLoop.rawTargetTimeReachedTrigger.add(game._onRawTargetTimeReached, game);
            handlerSet.setCurrentTimeFunc(gameLoop.getCurrentTime.bind(gameLoop));
            game._reset({ age: 0, randSeed: seed });
            _this._updateGamePlayId(game);
            if (_this._hidden)
                game._setMuted(true);
            handlerSet.snapshotTrigger.add(function (startPoint) {
                if (startPoint.frame === 0) {
                    // 0 フレーム目の startPoint は状態復元の高速化に寄与しない。
                    // またシードの保存など別用途で使っているので無視。(ref. _putZerothStartPoint())
                    return;
                }
                _this._platform.amflow.putStartPoint(startPoint, function (err) {
                    var error = _this._getCallbackError(err);
                    if (error) {
                        _this.errorTrigger.fire(error);
                    }
                });
            });
            _this._game = game;
            _this._eventBuffer = eventBuffer;
            _this._gameLoop = gameLoop;
            _this._rendererRequirement = rendererRequirement;
            _this.gameCreatedTrigger.fire(game);
            gameLoop.reset(latestStartPoint);
        });
    };
    GameDriver.prototype._updateGamePlayId = function (game) {
        var _this = this;
        game.playId = this._playId;
        game.external.send = function (data) {
            if (!_this._playId)
                return;
            _this._platform.sendToExternal(_this._playId, data);
        };
    };
    // 非同期処理中にゲームがdestroy済みかどうか判定するためのメソッド
    GameDriver.prototype._assertLive = function () {
        if (this._destroyed) {
            throw new Error(GAME_DESTROYED_MESSAGE);
        }
    };
    // コールバック時にエラーが発生もしくはゲームがdestroy済みの場合はErrorを返す
    GameDriver.prototype._getCallbackError = function (err) {
        if (err) {
            return err;
        }
        else if (this._destroyed) {
            return new Error(GAME_DESTROYED_MESSAGE);
        }
        return null;
    };
    return GameDriver;
}());
exports.GameDriver = GameDriver;

},{"./EventBuffer":8,"./ExecutionMode":9,"./Game":10,"./GameHandlerSet":12,"./GameLoop":13,"./LoopMode":15,"./constants":23,"@akashic/akashic-engine":"@akashic/akashic-engine","@akashic/game-configuration/lib/utils":4,"es6-promise":25}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameHandlerSet = void 0;
var g = require("@akashic/akashic-engine");
var GameHandlerSet = /** @class */ (function () {
    function GameHandlerSet(param) {
        this.raiseEventTrigger = new g.Trigger();
        this.raiseTickTrigger = new g.Trigger();
        this.snapshotTrigger = new g.Trigger();
        this.changeSceneModeTrigger = new g.Trigger();
        this._getCurrentTimeFunc = null;
        this._eventFilterFuncs = null;
        this._local = null;
        this._tickGenerationMode = null;
        this.isSnapshotSaver = !!param.isSnapshotSaver;
    }
    /**
     * `Game` が利用する時刻取得関数をセットする。
     * このメソッドは `Game#_load()` 呼び出しに先行して呼び出されていなければならない。
     */
    GameHandlerSet.prototype.setCurrentTimeFunc = function (fun) {
        this._getCurrentTimeFunc = fun;
    };
    /**
     * `Game` のイベントフィルタ関連実装をセットする。
     * このメソッドは `Game#_load()` 呼び出しに先行して呼び出されていなければならない。
     */
    GameHandlerSet.prototype.setEventFilterFuncs = function (funcs) {
        this._eventFilterFuncs = funcs;
    };
    GameHandlerSet.prototype.removeAllEventFilters = function () {
        if (this._eventFilterFuncs)
            this._eventFilterFuncs.removeFilter();
    };
    GameHandlerSet.prototype.changeSceneMode = function (mode) {
        this._local = mode.local;
        this._tickGenerationMode = mode.tickGenerationMode;
        this.changeSceneModeTrigger.fire(mode);
    };
    GameHandlerSet.prototype.getCurrentTime = function () {
        // GameLoopの同名メソッドとは戻り値が異なるが、 `Game.getCurrentTime()` は `Date.now()` の代替として使用されるため、整数値を返す。
        return Math.floor(this._getCurrentTimeFunc());
    };
    GameHandlerSet.prototype.raiseEvent = function (event) {
        this.raiseEventTrigger.fire(event);
    };
    GameHandlerSet.prototype.raiseTick = function (events) {
        this.raiseTickTrigger.fire(events);
    };
    GameHandlerSet.prototype.addEventFilter = function (filter, handleEmpty) {
        if (this._eventFilterFuncs)
            this._eventFilterFuncs.addFilter(filter, handleEmpty);
    };
    GameHandlerSet.prototype.removeEventFilter = function (filter) {
        if (this._eventFilterFuncs)
            this._eventFilterFuncs.removeFilter(filter);
    };
    GameHandlerSet.prototype.shouldSaveSnapshot = function () {
        return this.isSnapshotSaver;
    };
    GameHandlerSet.prototype.getInstanceType = function () {
        // NOTE: Active かどうかは `shouldSaveSnapshot()` と等価なので、簡易対応としてこの実装を用いる。
        return this.shouldSaveSnapshot() ? "active" : "passive";
    };
    GameHandlerSet.prototype.saveSnapshot = function (frame, gameSnapshot, randGenSer, nextEntityId, timestamp) {
        if (timestamp === void 0) { timestamp = this._getCurrentTimeFunc(); }
        if (!this.shouldSaveSnapshot())
            return;
        this.snapshotTrigger.fire({
            frame: frame,
            timestamp: timestamp,
            data: {
                randGenSer: randGenSer,
                nextEntityId: nextEntityId,
                gameSnapshot: gameSnapshot
            }
        });
    };
    return GameHandlerSet;
}());
exports.GameHandlerSet = GameHandlerSet;

},{"@akashic/akashic-engine":"@akashic/akashic-engine"}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLoop = void 0;
var g = require("@akashic/akashic-engine");
var Clock_1 = require("./Clock");
var constants = require("./constants");
var ExecutionMode_1 = require("./ExecutionMode");
var LoopMode_1 = require("./LoopMode");
var LoopRenderMode_1 = require("./LoopRenderMode");
var ProfilerClock_1 = require("./ProfilerClock");
var TickController_1 = require("./TickController");
var EventIndex = g.EventIndex; // eslint-disable-line @typescript-eslint/naming-convention
/**
 * ゲームのメインループ管理クラス。
 * clock frameの度にTickBufferに蓄積されたTickを元にゲームを動かす。
 *
 * start() から stop() までの間、最後に呼び出された _amflow.authenticate() は Permission#readTick を返していなければならない。
 */
var GameLoop = /** @class */ (function () {
    function GameLoop(param) {
        this.errorTrigger = new g.Trigger();
        this.rawTargetTimeReachedTrigger = new g.Trigger();
        this.running = false;
        /**
         * 最後のティック通知以後に、ローカルティック補間なしでスキップされた時間。
         *
         * ローカルティックの数は不定であるため、本来「省略された」数を数えることはできない。
         * ただし Realtime 時や omitInterpolatedTickOnReplay フラグが真の場合には「タイムスタンプ待ちをせずに即座に時間を進める」場合がある。
         * このような時に「タイムスタンプ待ちを行なっていたらいくつのローカルティックがある時間だったか」は求まる。この時間を累積する変数。
         */
        this._omittedTickDuration = 0;
        this._sceneTickMode = null;
        this._sceneLocalMode = null;
        this._waitingStartPoint = false;
        this._lastRequestedStartPointAge = -1;
        this._lastRequestedStartPointTime = -1;
        this._waitingNextTick = false;
        /**
         * reset() 後、一度でも最新 (既知最新でなく実際の最新と思われる) tick を見つけたか。
         *
         * この値が偽である場合、受信できていない後続 tick が存在する可能性がある。
         * 真ならば、以降の tick はすべて AMFlow#onTick() で受け取るはずなので、後続を探すための tick リクエストが不要になる。
         * (なお一部の異常系ではこの値が真でも後続 tick を見落としている可能性があるが、その場合はポーリング処理で救うことにする)
         */
        this._foundLatestTick = false;
        this._skipping = false;
        this._lastPollingTickTime = 0;
        this._events = [];
        this._currentTime = param.startedAt;
        this._frameTime = 1000 / param.game.fps;
        if (param.errorHandler) {
            this.errorTrigger.add(param.errorHandler, param.errorHandlerOwner);
        }
        var conf = param.configuration;
        this._startedAt = param.startedAt;
        this._targetTimeFunc = conf.targetTimeFunc || null;
        this._targetTimeOffset = conf.targetTimeOffset || null;
        this._originDate = conf.originDate || null;
        this._realTargetTimeOffset = (this._originDate != null) ? this._originDate : (this._targetTimeOffset || 0) + this._startedAt;
        this._delayIgnoreThreshold = conf.delayIgnoreThreshold || constants.DEFAULT_DELAY_IGNORE_THRESHOLD;
        this._skipTicksAtOnce = conf.skipTicksAtOnce || constants.DEFAULT_SKIP_TICKS_AT_ONCE;
        this._skipThreshold = conf.skipThreshold || constants.DEFAULT_SKIP_THRESHOLD;
        this._skipThresholdTime = this._skipThreshold * this._frameTime;
        // this._skipAwareGame はないことに注意 (Game#getIsSkipAware()) を使う
        this._jumpTryThreshold = conf.jumpTryThreshold || constants.DEFAULT_JUMP_TRY_THRESHOLD;
        this._jumpIgnoreThreshold = conf.jumpIgnoreThreshold || constants.DEFAULT_JUMP_IGNORE_THRESHOLD;
        this._pollingTickThreshold = conf._pollingTickThreshold || constants.DEFAULT_POLLING_TICK_THRESHOLD;
        this._playbackRate = conf.playbackRate || 1;
        var loopRenderMode = (conf.loopRenderMode != null) ? conf.loopRenderMode : LoopRenderMode_1.default.AfterRawFrame;
        this._loopRenderMode = null; // 後の_setLoopRenderMode()で初期化
        this._omitInterpolatedTickOnReplay = (conf.omitInterpolatedTickOnReplay != null) ? conf.omitInterpolatedTickOnReplay : true;
        this._loopMode = conf.loopMode;
        this._amflow = param.amflow;
        this._game = param.game;
        this._eventBuffer = param.eventBuffer;
        this._executionMode = param.executionMode;
        this._targetAge = (conf.targetAge != null) ? conf.targetAge : null;
        // todo: 本来は、パフォーマンス測定機構を含まないリリースモードによるビルド方式も提供すべき。
        if (!param.profiler) {
            this._clock = new Clock_1.Clock({
                fps: param.game.fps,
                scaleFactor: this._playbackRate,
                platform: param.platform,
                maxFramePerOnce: 5
            });
        }
        else {
            this._clock = new ProfilerClock_1.ProfilerClock({
                fps: param.game.fps,
                scaleFactor: this._playbackRate,
                platform: param.platform,
                maxFramePerOnce: 5,
                profiler: param.profiler
            });
        }
        this._tickController = new TickController_1.TickController({
            amflow: param.amflow,
            clock: this._clock,
            game: param.game,
            eventBuffer: param.eventBuffer,
            executionMode: param.executionMode,
            startedAt: param.startedAt,
            errorHandler: this.errorTrigger.fire,
            errorHandlerOwner: this.errorTrigger
        });
        this._tickBuffer = this._tickController.getBuffer();
        this._onGotStartPoint_bound = this._onGotStartPoint.bind(this);
        this._setLoopRenderMode(loopRenderMode);
        this._game.setIsSkipAware(conf.skipAwareGame != null ? conf.skipAwareGame : true);
        this._game.setStorageFunc(this._tickController.storageFunc());
        this._game.handlerSet.raiseEventTrigger.add(this._onGameRaiseEvent, this);
        this._game.handlerSet.raiseTickTrigger.add(this._onGameRaiseTick, this);
        this._game.handlerSet.changeSceneModeTrigger.add(this._handleSceneChange, this);
        this._game._onStart.add(this._onGameStarted, this);
        this._tickBuffer.gotNextTickTrigger.add(this._onGotNextFrameTick, this);
        this._tickBuffer.gotNoTickTrigger.add(this._onGotNoTick, this);
        this._tickBuffer.start();
        this._updateGamePlaybackRate();
    }
    GameLoop.prototype.reset = function (startPoint) {
        // リセットから `g.Game#_start()` まで(エントリポイント実行まで)の間、processEvents() は起こらないようにする。
        // すなわちこれ以降 `_onGameStarted()` までの間 EventBuffer からイベントは取得できない。しかしそもそもこの状態では
        // イベントを処理するシーンがいない = 非ローカルティックは生成されない = 非ローカルティック生成時にのみ行われるイベントの取得もない。
        this._clock.frameTrigger.remove(this._onEventsProcessed, this);
        if (this._skipping)
            this._stopSkipping();
        this._tickBuffer.setCurrentAge(startPoint.frame);
        this._currentTime = startPoint.timestamp || startPoint.data.timestamp || 0; // data.timestamp は後方互換性のために存在。現在は使っていない。
        this._waitingNextTick = false; // 現在ageを変えた後、さらに後続のTickが足りないかどうかは_onFrameで判断する。
        this._foundLatestTick = false; // 同上。
        this._lastRequestedStartPointAge = -1; // 現在ageを変えた時はリセットしておく(場合によっては不要だが、安全のため)。
        this._lastRequestedStartPointTime = -1; // 同上。
        this._omittedTickDuration = 0;
        this._game._restartWithSnapshot(startPoint);
    };
    GameLoop.prototype.start = function () {
        this.running = true;
        this._clock.start();
    };
    GameLoop.prototype.stop = function () {
        this._clock.stop();
        this.running = false;
    };
    GameLoop.prototype.setNextAge = function (age) {
        this._tickController.setNextAge(age);
    };
    GameLoop.prototype.getExecutionMode = function () {
        return this._executionMode;
    };
    GameLoop.prototype.setExecutionMode = function (execMode) {
        this._executionMode = execMode;
        this._tickController.setExecutionMode(execMode);
    };
    GameLoop.prototype.getLoopConfiguration = function () {
        var _a, _b, _c, _d, _e;
        return {
            loopMode: this._loopMode,
            delayIgnoreThreshold: this._delayIgnoreThreshold,
            skipTicksAtOnce: this._skipTicksAtOnce,
            skipThreshold: this._skipThreshold,
            skipAwareGame: this._game.getIsSkipAware(),
            jumpTryThreshold: this._jumpTryThreshold,
            jumpIgnoreThreshold: this._jumpIgnoreThreshold,
            playbackRate: this._playbackRate,
            loopRenderMode: (_a = this._loopRenderMode) !== null && _a !== void 0 ? _a : undefined,
            targetTimeFunc: (_b = this._targetTimeFunc) !== null && _b !== void 0 ? _b : undefined,
            targetTimeOffset: (_c = this._targetTimeOffset) !== null && _c !== void 0 ? _c : undefined,
            originDate: (_d = this._originDate) !== null && _d !== void 0 ? _d : undefined,
            omitInterpolatedTickOnReplay: this._omitInterpolatedTickOnReplay,
            targetAge: (_e = this._targetAge) !== null && _e !== void 0 ? _e : undefined
        };
    };
    GameLoop.prototype.setLoopConfiguration = function (conf) {
        if (conf.loopMode != null)
            this._loopMode = conf.loopMode;
        if (conf.delayIgnoreThreshold != null)
            this._delayIgnoreThreshold = conf.delayIgnoreThreshold;
        if (conf.skipTicksAtOnce != null)
            this._skipTicksAtOnce = conf.skipTicksAtOnce;
        if (conf.skipThreshold != null) {
            this._skipThreshold = conf.skipThreshold;
            this._skipThresholdTime = this._skipThreshold * this._frameTime;
        }
        if (conf.skipAwareGame != null)
            this._game.setIsSkipAware(conf.skipAwareGame);
        if (conf.jumpTryThreshold != null)
            this._jumpTryThreshold = conf.jumpTryThreshold;
        if (conf.jumpIgnoreThreshold != null)
            this._jumpIgnoreThreshold = conf.jumpIgnoreThreshold;
        if (conf.playbackRate != null) {
            this._playbackRate = conf.playbackRate;
            this._clock.changeScaleFactor(this._playbackRate);
            this._updateGamePlaybackRate();
        }
        if (conf.loopRenderMode != null)
            this._setLoopRenderMode(conf.loopRenderMode);
        if (conf.targetTimeFunc != null) {
            this._targetTimeFunc = conf.targetTimeFunc;
        }
        if (conf.targetTimeOffset != null)
            this._targetTimeOffset = conf.targetTimeOffset;
        if (conf.originDate != null)
            this._originDate = conf.originDate;
        this._realTargetTimeOffset = (this._originDate != null) ? this._originDate : (this._targetTimeOffset || 0) + this._startedAt;
        if (conf.omitInterpolatedTickOnReplay != null)
            this._omitInterpolatedTickOnReplay = conf.omitInterpolatedTickOnReplay;
        if (conf.targetAge != null) {
            if (this._targetAge !== conf.targetAge) {
                // targetAgeの変化によって必要なティックが変化した可能性がある。
                // 一度リセットして _onFrame() で改めて _waitingNextTick を求め直す。
                this._waitingNextTick = false;
            }
            this._targetAge = conf.targetAge;
        }
    };
    GameLoop.prototype.addTickList = function (tickList) {
        this._tickBuffer.addTickList(tickList);
    };
    GameLoop.prototype.getCurrentTime = function () {
        return this._currentTime;
    };
    /**
     * 早送り状態に入る。
     *
     * すべての早回し(1フレームでの複数ティック消費)で早送り状態に入るわけではないことに注意。
     * 少々の遅れはこのクラスが暗黙に早回しして吸収する。
     * 早送り状態は、暗黙の早回しでは吸収しきれない規模の早回しの開始時に通知される。
     * 具体的な値との関連は `skipThreshold` など `LoopConfiguration` のメンバを参照のこと。
     */
    GameLoop.prototype._startSkipping = function () {
        this._skipping = true;
        this._updateGamePlaybackRate();
        this._tickBuffer.startSkipping();
        this._eventBuffer.startSkipping();
        this._game.skippingChangedTrigger.fire(true);
    };
    /**
     * 早送り状態を終える。
     */
    GameLoop.prototype._stopSkipping = function () {
        this._skipping = false;
        this._updateGamePlaybackRate();
        this._tickBuffer.endSkipping();
        this._eventBuffer.endSkipping();
        this._game.skippingChangedTrigger.fire(false);
    };
    /**
     * Gameの再生速度設定を変える。
     * 実際に再生速度(ティックの消費速度)を決めているのはこのクラスである点に注意。
     */
    GameLoop.prototype._updateGamePlaybackRate = function () {
        var realPlaybackRate = this._skipping ? (this._playbackRate * this._skipTicksAtOnce) : this._playbackRate;
        this._game._setAudioPlaybackRate(realPlaybackRate);
    };
    GameLoop.prototype._handleSceneChange = function (mode) {
        var localMode = mode.local;
        var tickMode = mode.tickGenerationMode;
        if (this._sceneLocalMode !== localMode || this._sceneTickMode !== tickMode) {
            this._sceneLocalMode = localMode;
            this._sceneTickMode = tickMode;
            this._clock.frameTrigger.remove(this._onFrame, this);
            this._clock.frameTrigger.remove(this._onLocalFrame, this);
            switch (localMode) {
                case "full-local":
                    // ローカルシーン: TickGenerationMode に関係なくローカルティックのみ
                    this._tickController.stopTick();
                    this._clock.frameTrigger.add(this._onLocalFrame, this);
                    break;
                case "non-local":
                case "interpolate-local":
                    if (tickMode === "by-clock") {
                        this._tickController.startTick();
                    }
                    else {
                        // Manual の場合: storageDataが乗る可能性がある最初のTickだけ生成させ、あとは生成を止める。(Manualの仕様どおりの挙動)
                        // storageDataがある場合は送らないとPassiveのインスタンスがローディングシーンを終えられない。
                        this._tickController.startTickOnce();
                    }
                    this._clock.frameTrigger.add(this._onFrame, this);
                    break;
                default:
                    this.errorTrigger.fire(new Error("Unknown LocalTickMode: " + localMode));
                    return;
            }
        }
    };
    /**
     * ローカルシーンのフレーム処理。
     *
     * `this._clock` の管理する時間経過に従い、ローカルシーンにおいて1フレーム時間につき1回呼び出される。
     */
    GameLoop.prototype._onLocalFrame = function () {
        this._doLocalTick();
    };
    GameLoop.prototype._doLocalTick = function () {
        var game = this._game;
        var pevs = this._eventBuffer.readLocalEvents();
        this._currentTime += this._frameTime;
        if (pevs) {
            game.tick(false, Math.floor(this._omittedTickDuration / this._frameTime), pevs);
        }
        else {
            game.tick(false, Math.floor(this._omittedTickDuration / this._frameTime));
        }
        this._omittedTickDuration = 0;
    };
    /**
     * 非ローカルシーンのフレーム処理。
     *
     * `this._clock` の管理する時間経過に従い、非ローカルシーンにおいて1フレーム時間につき1回呼び出される。
     */
    GameLoop.prototype._onFrame = function (frameArg) {
        if (this._loopMode !== LoopMode_1.default.Replay || !this._targetTimeFunc) {
            this._onFrameNormal(frameArg);
        }
        else {
            var givenTargetTime = this._targetTimeFunc();
            var targetTime = givenTargetTime + this._realTargetTimeOffset;
            var prevTime = this._currentTime;
            this._onFrameForTimedReplay(targetTime, frameArg);
            // 目標時刻到達判定: 進めなくなり、あと1フレームで目標時刻を過ぎるタイミングを到達として通知する。
            // 時間進行を進めていっても目標時刻 "以上" に進むことはないので「過ぎた」タイミングは使えない点に注意。
            // (また、それでもなお (prevTime <= targetTime) の条件はなくせない点にも注意。巻き戻す時は (prevTime > targetTime) になる)
            if ((prevTime === this._currentTime) && (prevTime <= targetTime) && (targetTime <= prevTime + this._frameTime))
                this.rawTargetTimeReachedTrigger.fire(givenTargetTime);
        }
    };
    /**
     * 時刻関数が与えられている場合のフレーム処理。
     *
     * 通常ケース (`_onFrameNormal()`) とは主に次の点で異なる:
     *  1. `Replay` 時の実装しか持たない (`Realtime` は時刻関数を使わずとにかく最新ティックを目指すので不要)
     *  2. ローカルティック補間をタイムスタンプに従ってしか行わない
     * 後者は、ティック受信待ちなどの状況で起きるローカルティック補間がなくなることを意味する。
     */
    GameLoop.prototype._onFrameForTimedReplay = function (targetTime, frameArg) {
        var _a, _b;
        var sceneChanged = false;
        var game = this._game;
        var timeGap = targetTime - this._currentTime;
        var frameGap = (timeGap / this._frameTime);
        if ((frameGap > this._jumpTryThreshold || frameGap < 0) &&
            (!this._waitingStartPoint) &&
            (this._lastRequestedStartPointTime < this._currentTime)) {
            // スナップショットを要求だけして続行する(スナップショットが来るまで進める限りは進む)。
            this._waitingStartPoint = true;
            this._lastRequestedStartPointTime = targetTime;
            this._amflow.getStartPoint({ timestamp: targetTime }, this._onGotStartPoint_bound);
        }
        if (frameGap <= 0) {
            if (this._skipping)
                this._stopSkipping();
            return;
        }
        if (!this._skipping) {
            if ((frameGap > this._skipThreshold || this._tickBuffer.currentAge === 0) &&
                (this._tickBuffer.hasNextTick() || (this._omitInterpolatedTickOnReplay && this._foundLatestTick))) {
                // ここでは常に `frameGap > 0` であることに注意。0の時にskipに入ってもすぐ戻ってしまう
                this._startSkipping();
            }
        }
        var consumedFrame = 0;
        for (; consumedFrame < this._skipTicksAtOnce; ++consumedFrame) {
            var nextFrameTime = this._currentTime + this._frameTime;
            if (!this._tickBuffer.hasNextTick()) {
                if (!this._waitingNextTick) {
                    this._startWaitingNextTick();
                    if (!this._foundLatestTick)
                        this._tickBuffer.requestNonIgnorableTicks();
                }
                if (this._omitInterpolatedTickOnReplay && this._sceneLocalMode === "interpolate-local") {
                    if (this._foundLatestTick) {
                        // 最新のティックが存在しない場合は現在時刻を目標時刻に合わせる。
                        // (_doLocalTick() により現在時刻が this._frameTime 進むのでその直前まで進める)
                        this._currentTime = targetTime - this._frameTime;
                    }
                    // ティックがなく、目標時刻に到達していない場合、補間ティックを挿入する。
                    // (経緯上ここだけフラグ名と逆っぽい挙動になってしまっている点に注意。TODO フラグを改名する)
                    if (targetTime > nextFrameTime)
                        this._doLocalTick();
                }
                break;
            }
            var nextTickTime = this._tickBuffer.readNextTickTime();
            if (nextTickTime == null)
                nextTickTime = nextFrameTime;
            if (targetTime < nextFrameTime) {
                // 次フレームに進むと目標時刻を超過する＝次フレーム時刻までは進めない＝補間ティックは必要ない。
                if (nextTickTime <= targetTime) {
                    // 特殊ケース: 目標時刻より手前に次ティックがあるので、目標時刻までは進んで次ティックは消化してしまう。
                    // (この処理がないと、特にリプレイで「最後のティックの0.1フレーム時間前」などに来たときに進めなくなってしまう。)
                    nextFrameTime = targetTime;
                }
                else {
                    break;
                }
            }
            else {
                if (nextFrameTime < nextTickTime) {
                    if (this._omitInterpolatedTickOnReplay && this._skipping) {
                        // スキップ中、ティック補間不要なら即座に次ティック時刻(かその手前の目標時刻)まで進める。
                        // (_onFrameNormal()の対応箇所と異なり、ここでは「次ティック時刻の "次フレーム時刻"」に切り上げないことに注意。
                        //  時間ベースリプレイでは目標時刻 "以後" には進めないという制約がある。これを単純な実装で守るべく切り上げを断念している)
                        if (targetTime <= nextTickTime) {
                            // 次ティック時刻まで進めると目標時刻を超えてしまう: 目標時刻直前まで動いて抜ける(目標時刻直前までは来ないと目標時刻到達通知が永久にできない)
                            var gap = targetTime - this._currentTime;
                            this._omittedTickDuration += gap;
                            // targetTime を直接丸めると誤差が出る場合があるので、代わりに gap だけを丸めて加算する
                            this._currentTime += Math.floor(gap / this._frameTime) * this._frameTime;
                            break;
                        }
                        nextFrameTime = nextTickTime;
                        this._omittedTickDuration += nextTickTime - this._currentTime;
                    }
                    else {
                        if (this._sceneLocalMode === "interpolate-local") {
                            this._doLocalTick();
                        }
                        continue;
                    }
                }
            }
            this._currentTime = nextFrameTime;
            var tick = this._tickBuffer.consume();
            var consumedAge = -1;
            this._events.length = 0;
            if (tick != null) {
                var plEvents = this._eventBuffer.readLocalEvents();
                if (plEvents) {
                    (_a = this._events).push.apply(_a, plEvents);
                }
                if (typeof tick === "number") {
                    consumedAge = tick;
                    sceneChanged = game.tick(true, Math.floor(this._omittedTickDuration / this._frameTime), this._events);
                }
                else {
                    consumedAge = tick[0 /* Age */];
                    var pevs = tick[1 /* Events */];
                    if (pevs) {
                        (_b = this._events).push.apply(_b, pevs);
                    }
                    sceneChanged = game.tick(true, Math.floor(this._omittedTickDuration / this._frameTime), this._events);
                }
            }
            this._omittedTickDuration = 0;
            if (game._notifyPassedAgeTable[consumedAge]) {
                // ↑ 無駄な関数コールを避けるため汚いが外部から事前チェック
                if (game.fireAgePassedIfNeeded()) {
                    // age到達通知したらドライバユーザが何かしている可能性があるので抜ける
                    frameArg.interrupt = true;
                    break;
                }
            }
            if (sceneChanged) {
                break; // シーンが変わったらローカルシーンに入っているかもしれないので一度抜ける
            }
        }
        if (this._skipping && (targetTime - this._currentTime < this._frameTime)) {
            this._stopSkipping();
            // スキップ状態が解除された (≒等倍に戻った) タイミングで改めてすべてのティックを取得し直す
            this._tickBuffer.dropAll();
            this._tickBuffer.requestTicks();
        }
    };
    /**
     * 非ローカルシーンの通常ケースのフレーム処理。
     * 時刻関数が与えられていない、またはリプレイでない場合に用いられる。
     */
    GameLoop.prototype._onFrameNormal = function (frameArg) {
        var _a, _b;
        var sceneChanged = false;
        var game = this._game;
        // NOTE: ブラウザが長時間非アクティブ状態 (裏タブに遷移していたなど) であったとき、長時間ゲームループが呼ばれないケースがある。
        // もしその期間がスキップの閾値を超えていたら、即座にスキップに入る。
        if (!this._skipping && frameArg.deltaTime > this._skipThresholdTime) {
            this._startSkipping();
            // ただしティック待ちが無ければすぐにスキップを抜ける。
            if (this._waitingNextTick)
                this._stopSkipping();
        }
        if (this._waitingNextTick) {
            if (this._sceneLocalMode === "interpolate-local")
                this._doLocalTick();
            return;
        }
        var targetAge;
        var ageGap;
        var currentAge = this._tickBuffer.currentAge;
        if (this._loopMode === LoopMode_1.default.Realtime) {
            targetAge = this._tickBuffer.knownLatestAge + 1;
            ageGap = targetAge - currentAge;
        }
        else {
            if (this._targetAge === null) {
                // targetAgeがない: ただリプレイして見ているだけの状態。1フレーム時間経過 == 1age消化。
                targetAge = null;
                ageGap = 1;
            }
            else if (this._targetAge === currentAge) {
                // targetAgeに到達した: targetAgeなし状態になる。
                targetAge = this._targetAge = null;
                ageGap = 1;
            }
            else {
                // targetAgeがあり、まだ到達していない。
                targetAge = this._targetAge;
                ageGap = targetAge - currentAge;
            }
        }
        if ((ageGap > this._jumpTryThreshold || ageGap < 0) &&
            (!this._waitingStartPoint) &&
            (this._lastRequestedStartPointAge < currentAge)) {
            // スナップショットを要求だけして続行する(スナップショットが来るまで進める限りは進む)。
            //
            // 上の条件が _lastRequestedStartPointAge を参照しているのは、スナップショットで飛んだ後もなお
            // `ageGap` が大きい場合に、延々スナップショットをリクエストし続けるのを避けるためである。
            // 実際にはageが進めば新たなスナップショットが保存されている可能性もあるので、
            // `targetAge` が変わればリクエストし続けるのが全くの無駄というわけではない。
            // が、`Realtime` で実行している場合 `targetAge` は毎フレーム変化してしまうし、
            // スナップショットがそれほど頻繁に保存されるとは思えない(すべきでもない)。ここでは割り切って抑制しておく。
            this._waitingStartPoint = true;
            // @ts-ignore TODO: targetAge が null の場合の振る舞い
            this._lastRequestedStartPointAge = targetAge;
            // @ts-ignore TODO: targetAge が null の場合の振る舞い
            this._amflow.getStartPoint({ frame: targetAge }, this._onGotStartPoint_bound);
        }
        if (ageGap <= 0) {
            if (ageGap === 0) {
                if (!this._foundLatestTick) {
                    // NOTE: Manualのシーンやアクティブインスタンスがポーズしている状況では、後続のティックが長時間受信できない場合がある。(TickBuffer#addTick()が呼ばれない)
                    // そのケースでは後続ティックの受信にポーリングの単位時間(初期値: 10秒)かかってしまうため、ここで最新ティックを要求する。
                    this._tickBuffer.requestNonIgnorableTicks();
                }
                // 既知最新ティックに追いついたので、ポーリング処理により後続ティックを要求する。
                // NOTE: Manualのシーンでは最新ティックの生成そのものが長時間起きない可能性がある。
                // (Manualでなくても、最新ティックの受信が長時間起きないことはありうる(長いローディングシーンなど))
                this._startWaitingNextTick();
            }
            if (this._sceneLocalMode === "interpolate-local") {
                // ティック待ちの間、ローカルティックを(補間して)消費: 上の暫定対処のrequestTicks()より後に行うべきである点に注意。
                // ローカルティックを消費すると、ゲームスクリプトがraiseTick()する(_waitingNextTickが立つのはおかしい)可能性がある。
                this._doLocalTick();
            }
            if (this._skipping)
                this._stopSkipping();
            return;
        }
        if (!this._skipping && (ageGap > this._skipThreshold || currentAge === 0) && this._tickBuffer.hasNextTick()) {
            // ここでは常に (ageGap > 0) であることに注意。(0の時にskipに入ってもすぐ戻ってしまう)
            this._startSkipping();
        }
        var loopCount = (!this._skipping && ageGap <= this._delayIgnoreThreshold) ? 1 : Math.min(ageGap, this._skipTicksAtOnce);
        var consumedFrame = 0;
        for (; consumedFrame < loopCount; ++consumedFrame) {
            // ティック時刻確認
            var nextFrameTime = this._currentTime + this._frameTime;
            var nextTickTime = this._tickBuffer.readNextTickTime();
            if (nextTickTime != null && nextFrameTime < nextTickTime) {
                if (this._loopMode === LoopMode_1.default.Realtime || (this._omitInterpolatedTickOnReplay && this._skipping)) {
                    // リアルタイムモード(と早送り中のリプレイでティック補間しない場合)ではティック時刻を気にせず続行するが、
                    // リプレイモードに切り替えた時に矛盾しないよう時刻を補正する(当該ティック時刻まで待った扱いにする)。
                    nextFrameTime = Math.ceil(nextTickTime / this._frameTime) * this._frameTime;
                    this._omittedTickDuration += nextFrameTime - this._currentTime;
                }
                else {
                    if (this._sceneLocalMode === "interpolate-local") {
                        this._doLocalTick();
                        continue;
                    }
                    break;
                }
            }
            this._currentTime = nextFrameTime;
            var tick = this._tickBuffer.consume();
            var consumedAge = -1;
            this._events.length = 0;
            if (tick != null) {
                var plEvents = this._eventBuffer.readLocalEvents();
                if (plEvents) {
                    (_a = this._events).push.apply(_a, plEvents);
                }
                if (typeof tick === "number") {
                    consumedAge = tick;
                    sceneChanged = game.tick(true, Math.floor(this._omittedTickDuration / this._frameTime), this._events);
                }
                else {
                    consumedAge = tick[0 /* Age */];
                    var pevs = tick[1 /* Events */];
                    if (pevs) {
                        (_b = this._events).push.apply(_b, pevs);
                    }
                    sceneChanged = game.tick(true, Math.floor(this._omittedTickDuration / this._frameTime), this._events);
                }
                this._omittedTickDuration = 0;
            }
            else {
                // 時間は経過しているが消費すべきティックが届いていない
                this._tickBuffer.requestTicks();
                this._startWaitingNextTick();
                break;
            }
            if (game._notifyPassedAgeTable[consumedAge]) {
                // ↑ 無駄な関数コールを避けるため汚いが外部から事前チェック
                if (game.fireAgePassedIfNeeded()) {
                    // age到達通知したらドライバユーザが何かしている可能性があるので抜ける
                    frameArg.interrupt = true;
                    break;
                }
            }
            if (sceneChanged) {
                break; // シーンが変わったらローカルシーンに入っているかもしれないので一度抜ける
            }
        }
        // @ts-ignore TODO: targetAge が null の場合の振る舞い
        if (this._skipping && (targetAge - this._tickBuffer.currentAge < 1))
            this._stopSkipping();
    };
    GameLoop.prototype._onGotNextFrameTick = function () {
        if (!this._waitingNextTick)
            return;
        if (this._loopMode === LoopMode_1.default.FrameByFrame) {
            // コマ送り実行時、Tickの受信は実行に影響しない。
            return;
        }
        this._stopWaitingNextTick();
    };
    GameLoop.prototype._onGotNoTick = function () {
        if (this._waitingNextTick)
            this._foundLatestTick = true;
    };
    GameLoop.prototype._onGotStartPoint = function (err, startPoint) {
        this._waitingStartPoint = false;
        if (err) {
            this.errorTrigger.fire(err);
            return;
        }
        if (!startPoint) {
            // NOTE: err が無ければ startPoint は必ず存在するはずだが、念の為にバリデートする。
            return;
        }
        if (!this._targetTimeFunc || this._loopMode === LoopMode_1.default.Realtime) {
            var targetAge = (this._loopMode === LoopMode_1.default.Realtime) ? this._tickBuffer.knownLatestAge + 1 : this._targetAge;
            if (targetAge === null || targetAge < startPoint.frame) {
                // 要求した時点と今で目標age(targetAge)が変わっている。
                // 現在の状況では飛ぶ必要がないか、得られたStartPointでは目標ageより未来に飛んでしまう。
                return;
            }
            var currentAge = this._tickBuffer.currentAge;
            if (currentAge <= targetAge && startPoint.frame < currentAge + this._jumpIgnoreThreshold) {
                // 今の目標age(targetAge)は過去でない一方、得られたStartPointは至近未来または過去のもの → 飛ぶ価値なし。
                return;
            }
        }
        else {
            var targetTime = this._targetTimeFunc() + this._realTargetTimeOffset;
            if (targetTime < startPoint.timestamp) {
                // 要求した時点と今で目標時刻(targetTime)が変わっている。得られたStartPointでは目標時刻より未来に飛んでしまう。
                return;
            }
            var currentTime = this._currentTime;
            if (currentTime <= targetTime && startPoint.timestamp < currentTime + (this._jumpIgnoreThreshold * this._frameTime)) {
                // 今の目標時刻(targetTime)は過去でない一方、得られたStartPointは至近未来または過去のもの → 飛ぶ価値なし。
                return;
            }
        }
        this.reset(startPoint);
    };
    GameLoop.prototype._onGameStarted = function () {
        // 必ず先頭に挿入することで、同じClockを参照する `TickGenerator` のティック生成などに毎フレーム先行してイベントフィルタを適用する。
        // 全体的に `this._clock` のhandle順は動作順に直結するので注意が必要。
        this._clock.frameTrigger.add({ index: 0, owner: this, func: this._onEventsProcessed });
    };
    GameLoop.prototype._onEventsProcessed = function () {
        this._eventBuffer.processEvents(this._sceneLocalMode === "full-local");
    };
    GameLoop.prototype._setLoopRenderMode = function (mode) {
        if (mode === this._loopRenderMode)
            return;
        this._loopRenderMode = mode;
        switch (mode) {
            case LoopRenderMode_1.default.AfterRawFrame:
                this._clock.rawFrameTrigger.add(this._renderOnRawFrame, this);
                break;
            case LoopRenderMode_1.default.None:
                this._clock.rawFrameTrigger.remove(this._renderOnRawFrame, this);
                break;
            default:
                this.errorTrigger.fire(new Error("GameLoop#_setLoopRenderMode: unknown mode: " + mode));
                break;
        }
    };
    GameLoop.prototype._renderOnRawFrame = function () {
        this._game.render();
    };
    GameLoop.prototype._onGameRaiseEvent = function (event) {
        this._eventBuffer.onEvent(event);
    };
    GameLoop.prototype._onGameRaiseTick = function (es) {
        if (this._executionMode !== ExecutionMode_1.default.Active)
            return;
        // TODO: イベントフィルタの中で呼ばれるとおかしくなる(フィルタ中のイベントがtickに乗らない)。
        if (es) {
            for (var i = 0; i < es.length; ++i)
                this._eventBuffer.addEventDirect(es[i]);
        }
        this._tickController.forceGenerateTick();
    };
    GameLoop.prototype._onPollingTick = function () {
        // この関数が呼ばれる時、 `this._waitingNextTick` は必ず真である。
        // TODO: rawFrameTriggerのfire時に前回呼び出し時からの経過時間を渡せばnew Dateする必要はなくなる。
        var time = Date.now();
        if (time - this._lastPollingTickTime > this._pollingTickThreshold) {
            this._lastPollingTickTime = time;
            this._tickBuffer.requestTicks();
        }
    };
    GameLoop.prototype._startWaitingNextTick = function () {
        this._waitingNextTick = true;
        // TODO: Active時はポーリングしない (要 Active/Passive 切り替えの対応)
        this._clock.rawFrameTrigger.add(this._onPollingTick, this);
        this._lastPollingTickTime = Date.now();
        if (this._skipping)
            this._stopSkipping();
    };
    GameLoop.prototype._stopWaitingNextTick = function () {
        this._waitingNextTick = false;
        this._clock.rawFrameTrigger.remove(this._onPollingTick, this);
    };
    return GameLoop;
}());
exports.GameLoop = GameLoop;

},{"./Clock":7,"./ExecutionMode":9,"./LoopMode":15,"./LoopRenderMode":16,"./ProfilerClock":17,"./TickController":20,"./constants":23,"@akashic/akashic-engine":"@akashic/akashic-engine"}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinResolver = exports.JoinLeaveRequest = void 0;
var g = require("@akashic/akashic-engine");
var JoinLeaveRequest = /** @class */ (function () {
    function JoinLeaveRequest(pev, joinResolver, amflow, keys) {
        this.joinResolver = joinResolver;
        this.pev = pev;
        if (pev[0 /* Code */] === 0 /* Join */ && keys) {
            this.resolved = false;
            amflow === null || amflow === void 0 ? void 0 : amflow.getStorageData(keys, this._onGotStorageData.bind(this));
        }
        else {
            this.resolved = true;
        }
    }
    JoinLeaveRequest.prototype._onGotStorageData = function (err, sds) {
        this.resolved = true;
        if (err) {
            this.joinResolver.errorTrigger.fire(err);
            return;
        }
        this.pev[4 /* StorageData */] = sds;
    };
    return JoinLeaveRequest;
}());
exports.JoinLeaveRequest = JoinLeaveRequest;
var JoinResolver = /** @class */ (function () {
    function JoinResolver(param) {
        this._keysForJoin = null;
        this._requested = [];
        this.errorTrigger = new g.Trigger();
        if (param.errorHandler)
            this.errorTrigger.add(param.errorHandler, param.errorHandlerOwner);
        this._amflow = param.amflow;
    }
    JoinResolver.prototype.request = function (pev) {
        this._requested.push(new JoinLeaveRequest(pev, this, this._amflow, this._keysForJoin || undefined));
    };
    JoinResolver.prototype.readResolved = function () {
        var len = this._requested.length;
        if (len === 0 || !this._requested[0].resolved)
            return null;
        var ret = [];
        var i;
        for (i = 0; i < len; ++i) {
            var req = this._requested[i];
            if (!req.resolved)
                break;
            ret.push(req.pev);
        }
        this._requested.splice(0, i);
        return ret;
    };
    JoinResolver.prototype.setRequestValuesForJoin = function (keys) {
        this._keysForJoin = keys;
    };
    return JoinResolver;
}());
exports.JoinResolver = JoinResolver;

},{"@akashic/akashic-engine":"@akashic/akashic-engine"}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `GameLoop` のループ制御のモード。
 * `GameLoop` は、この値に応じて `g.Game#tick()` の呼び出し方法を変える。
 */
var LoopMode;
(function (LoopMode) {
    /**
     * 最新フレームに最大限追いつくモード。
     *
     * Passiveである場合、自分の現在フレームが取得済みの最新フレームから大きく遅れているなら、
     * 早送りやスナップショットによるジャンプを行う。
     *
     * ローカルティック補間シーンにおいては、ティックの受信を待っている間ティック補間を行う。すなわち:
     *  * 次ティックがある場合: ローカルティックを生成せず、ただちに次ティックを消化する(補間しない)
     *  * 次ティックがない場合: ローカルティックを生成して消化する(補間する)
     */
    LoopMode[LoopMode["Realtime"] = 0] = "Realtime";
    /**
     * 追いつこうとするフレームを自分で制御するモード。
     *
     * `Realtime` と同様早送りやスナップショットによるジャンプを行うが、
     * その基準フレームとして `LoopConfiguration#targetAge` (を保持する `GameLoop#_targetAge`) を使う。
     * 早送りやスナップショットによるジャンプを行う。
     *
     * ローカルティック補間シーンにおいては、ティックのタイムスタンプ情報にできるだけ忠実にティック補間を行う。すなわち:
     *  * 次ティックがある場合: 現在時刻が次ティックのタイムスタンプか目標時刻に至るまで、ローカルティックを生成して消化する(補間する)。
     *  * 次ティックがない場合: 何もしない(補間しない)。
     * ただし LoopConfiguration#omitInterpolatedTickOnReplay が真の場合は、次の規則が追加で適用される。
     *  * 次ティックがある場合、スキップ中ならば: ローカルティックを生成せず、ただちに次ティックを消化する(補間しない; Realtimeと同じになる)
     *  * 次ティックがない場合、目標時刻に到達していなければ: ローカルティックを生成して消化する(補間する; Realtimeと同じになる)
     */
    LoopMode[LoopMode["Replay"] = 1] = "Replay";
    /**
     * 正しく使っていない。削除する予定。
     *
     * コマ送りモード。
     * `GameLoop#step()` 呼び出し時に1フレーム進む。それ以外の方法では進まない。
     * 早送りやスナップショットによるジャンプは行わない。
     */
    LoopMode[LoopMode["FrameByFrame"] = 2] = "FrameByFrame";
})(LoopMode || (LoopMode = {}));
exports.default = LoopMode;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `GameLoop` が描画を行う基準。
 */
var LoopRenderMode;
(function (LoopRenderMode) {
    /**
     * 毎raw frame後に描画する。
     * raw frameの詳細についてはClock.tsのコメントを参照。
     */
    LoopRenderMode[LoopRenderMode["AfterRawFrame"] = 0] = "AfterRawFrame";
    /**
     * 描画をまったく行わない。
     */
    LoopRenderMode[LoopRenderMode["None"] = 1] = "None";
})(LoopRenderMode || (LoopRenderMode = {}));
exports.default = LoopRenderMode;

},{}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilerClock = void 0;
var Clock_1 = require("./Clock");
/**
 * プロファイラーを有するクロック。
 *
 * note: _onLooperCall()のみをオーバーライドし、 `this._profiler.~~` を追加しただけとなっています。
 */
var ProfilerClock = /** @class */ (function (_super) {
    __extends(ProfilerClock, _super);
    function ProfilerClock(param) {
        var _this = _super.call(this, param) || this;
        _this._profiler = param.profiler;
        return _this;
    }
    ProfilerClock.prototype._onLooperCall = function (deltaTime) {
        var rawDeltaTime = deltaTime;
        if (deltaTime <= 0) {
            // 時間が止まっているか巻き戻っている。初回呼び出しか、あるいは何かがおかしい。時間経過0と見なす。
            return this._waitTime - this._totalDeltaTime;
        }
        if (deltaTime > this._deltaTimeBrokenThreshold) {
            // 間隔が長すぎる。何かがおかしい。時間経過を1フレーム分とみなす。
            deltaTime = this._waitTime;
        }
        var totalDeltaTime = this._totalDeltaTime;
        totalDeltaTime += deltaTime;
        if (totalDeltaTime <= this._skipFrameWaitTime) {
            // 1フレーム分消化するほどの時間が経っていない。
            this._totalDeltaTime = totalDeltaTime;
            return this._waitTime - totalDeltaTime;
        }
        this._profiler.timeEnd(1 /* RawFrameInterval */);
        this._profiler.time(1 /* RawFrameInterval */);
        var frameCount = (totalDeltaTime < this._waitTimeDoubled) ? 1
            : (totalDeltaTime > this._waitTimeMax) ? this._realMaxFramePerOnce
                : (totalDeltaTime / this._waitTime) | 0;
        var fc = frameCount;
        var arg = {
            deltaTime: rawDeltaTime,
            interrupt: false
        };
        this._profiler.setValue(0 /* SkippedFrameCount */, fc - 1);
        while (fc > 0 && this.running && !arg.interrupt) {
            --fc;
            this._profiler.time(2 /* FrameTime */);
            this.frameTrigger.fire(arg);
            this._profiler.timeEnd(2 /* FrameTime */);
            arg.deltaTime = 0; // 同ループによる2度目以降の呼び出しは差分を0とみなす。
        }
        totalDeltaTime -= ((frameCount - fc) * this._waitTime);
        this._profiler.time(3 /* RenderingTime */);
        this.rawFrameTrigger.fire();
        this._profiler.timeEnd(3 /* RenderingTime */);
        this._totalDeltaTime = totalDeltaTime;
        this._profiler.flush();
        return this._waitTime - totalDeltaTime;
    };
    return ProfilerClock;
}(Clock_1.Clock));
exports.ProfilerClock = ProfilerClock;

},{"./Clock":7}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageResolver = void 0;
var g = require("@akashic/akashic-engine");
var ExecutionMode_1 = require("./ExecutionMode");
/**
 * ストレージの読み書きを担うクラス。
 * Gameのストレージアクセスはすべてこのクラスが一次受けする(一次受けする関数を提供する)。
 *
 * ただし読み込みに関しては、実際にはこのクラスでは行わない。
 * Activeモードの場合、ストレージから読み込んだデータはTickに乗せる必要がある。
 * このクラスはTickGeneratorにリクエストを通知し、読み込みはTickGeneratorが解決する。
 * Passiveモードやスナップショットからの復元の場合、ストレージのデータは `TickBuffer` で受信したTickから得られる。
 * このクラスは、読み込みリクエストを得られたストレージデータと付き合わせて完了を通知する役割を持つ。
 */
var StorageResolver = /** @class */ (function () {
    function StorageResolver(param) {
        this.errorTrigger = new g.Trigger();
        this._unresolvedLoaders = Object.create(null);
        this._unresolvedStorages = Object.create(null);
        if (param.errorHandler)
            this.errorTrigger.add(param.errorHandler, param.errorHandlerOwner);
        this.getStorageFunc = this._getStorage.bind(this);
        this.putStorageFunc = this._putStorage.bind(this);
        this.requestValuesForJoinFunc = this._requestValuesForJoin.bind(this);
        this._onStoragePut_bound = this._onStoragePut.bind(this);
        this._game = param.game;
        this._amflow = param.amflow;
        this._tickGenerator = param.tickGenerator;
        this._tickBuffer = param.tickBuffer;
        this._executionMode = null; // 後続のsetExecutionMode()で設定する。
        this.setExecutionMode(param.executionMode);
    }
    /**
     * ExecutionModeを変更する。
     */
    StorageResolver.prototype.setExecutionMode = function (executionMode) {
        if (this._executionMode === executionMode)
            return;
        this._executionMode = executionMode;
        var tickBuf = this._tickBuffer;
        var tickGen = this._tickGenerator;
        if (executionMode === ExecutionMode_1.default.Active) {
            tickBuf.gotStorageTrigger.remove(this._onGotStorageOnTick, this);
            tickGen.gotStorageTrigger.add(this._onGotStorageOnTick, this);
        }
        else {
            tickGen.gotStorageTrigger.remove(this._onGotStorageOnTick, this);
            tickBuf.gotStorageTrigger.add(this._onGotStorageOnTick, this);
        }
    };
    StorageResolver.prototype._onGotStorageOnTick = function (storageOnTick) {
        var resolvingAge = storageOnTick.age;
        var storageData = storageOnTick.storageData;
        var loader = this._unresolvedLoaders[resolvingAge];
        if (!loader) {
            this._unresolvedStorages[resolvingAge] = storageData;
            return;
        }
        delete this._unresolvedLoaders[resolvingAge];
        var serialization = resolvingAge;
        var values = storageData.map(function (d) { return d.values; });
        loader._onLoaded(values, serialization);
    };
    StorageResolver.prototype._getStorage = function (keys, loader, ser) {
        var resolvingAge;
        if (ser != null) {
            // akashic-engineにとって `ser' の型は単にanyである。実態は実装(game-driver)に委ねられている。
            // game-driverはシリアリゼーションとして「ストレージが含められていたTickのage」を採用する。
            resolvingAge = ser;
            this._tickBuffer.requestTicks(resolvingAge, 1); // request しておけば後は _onGotStorageOnTick() に渡ってくる
        }
        else {
            if (this._executionMode === ExecutionMode_1.default.Active) {
                resolvingAge = this._tickGenerator.requestStorageTick(keys);
            }
            else {
                resolvingAge = this._game.age; // TODO: gameを参照せずともageがとれるようにすべき。
                this._tickBuffer.requestTicks(resolvingAge, 1); // request しておけば後は _onGotStorageOnTick() に渡ってくる
            }
        }
        var sd = this._unresolvedStorages[resolvingAge];
        if (!sd) {
            this._unresolvedLoaders[resolvingAge] = loader;
            return;
        }
        delete this._unresolvedStorages[resolvingAge];
        var serialization = resolvingAge;
        var values = sd.map(function (d) { return d.values; });
        loader._onLoaded(values, serialization);
    };
    StorageResolver.prototype._putStorage = function (key, value, option) {
        if (this._executionMode === ExecutionMode_1.default.Active) {
            this._amflow.putStorageData(key, value, option, this._onStoragePut_bound);
        }
    };
    StorageResolver.prototype._requestValuesForJoin = function (keys) {
        this._tickGenerator.setRequestValuesForJoin(keys);
    };
    StorageResolver.prototype._onStoragePut = function (err) {
        if (err)
            this.errorTrigger.fire(err);
    };
    return StorageResolver;
}());
exports.StorageResolver = StorageResolver;

},{"./ExecutionMode":9,"@akashic/akashic-engine":"@akashic/akashic-engine"}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickBuffer = void 0;
var g = require("@akashic/akashic-engine");
var ExecutionMode_1 = require("./ExecutionMode");
var EventIndex = g.EventIndex; // eslint-disable-line @typescript-eslint/naming-convention
/**
 * AMFlowから流れ込むTickを蓄積するバッファ。
 *
 * 主に以下を行う。
 * * 受信済みのTickの管理
 * * 現在age・既知の最新age・直近の欠けているTickの管理
 * * 足りなそうなTickの先行リクエスト
 * * 処理済みTickの破棄
 */
var TickBuffer = /** @class */ (function () {
    function TickBuffer(param) {
        /**
         * 現在のage。
         * 次に `consume()` した時、このageのTickを返す。
         */
        this.currentAge = 0;
        /**
         * 既知の最新age。
         * AMFlow から受け取った、または setCurrentAge() で外部から存在を示された最新の age 。
         */
        this.knownLatestAge = -1;
        /**
         * 現在ageのTickを新たに取得したときにfireされる `g.Trigger` 。
         * Tick取得待ちを解除する契機として使える。
         */
        this.gotNextTickTrigger = new g.Trigger();
        /**
         * 最新Tick取得した結果、新たに消化すべきTickが存在しないときにfireされる `g.Trigger` 。
         * 取得済みのTickの消化待ちにかかわらず発火されることに注意。
         */
        this.gotNoTickTrigger = new g.Trigger();
        /**
         * ストレージを含むTickを取得した時にfireされる `g.Trigger` 。
         */
        this.gotStorageTrigger = new g.Trigger();
        this._receiving = false;
        this._skipping = false;
        /**
         * 取得したTick。
         */
        this._tickRanges = [];
        /**
         * `readNextTickTime()` の値のキャッシュ。
         * ティック時刻に到達するまでループの度に確認されるのでキャッシュしておく。
         *
         * 旧仕様(相対時刻)用の暫定対応のため、この値をティックのタイムスタンプと直接比較してはならない(cf. readNextTickTime())。
         */
        this._nextTickTimeCache = null;
        this._amflow = param.amflow;
        this._prefetchThreshold = param.prefetchThreshold || TickBuffer.DEFAULT_PREFETCH_THRESHOLD;
        this._sizeRequestOnce = param.sizeRequestOnce || TickBuffer.DEFAULT_SIZE_REQUEST_ONCE;
        this._executionMode = param.executionMode;
        this._startedAt = param.startedAt || 0;
        this._oldTimestampThreshold = (param.startedAt != null) ? (param.startedAt - (86400 * 1000 * 10)) : 0; // 数字は適当な値(10日分)。
        this._nearestAbsentAge = this.currentAge;
        this._addTick_bound = this.addTick.bind(this);
        this._onTicks_bound = this._onTicks.bind(this);
    }
    TickBuffer.prototype.start = function () {
        this._receiving = true;
        this._updateAmflowReceiveState();
    };
    TickBuffer.prototype.stop = function () {
        this._receiving = false;
        this._updateAmflowReceiveState();
    };
    TickBuffer.prototype.setExecutionMode = function (execMode) {
        // TODO: getTickList()中にauthenticate()しなおした場合の挙動確認
        if (this._executionMode === execMode)
            return;
        this._dropUntil(this.knownLatestAge + 1); // 既存データは捨てる(特にPassive->Activeで既存Tickを上書きする必要がありうる)
        this.knownLatestAge = this.currentAge;
        this._nextTickTimeCache = null;
        this._nearestAbsentAge = this.currentAge;
        this._executionMode = execMode;
        this._updateAmflowReceiveState();
    };
    /**
     * currentAge を設定する。
     *
     * 引数は存在することがわかっている age でなければならない。
     * (Realtime モードの tick/StartPoint 取得の基準となる knownLatestAge も更新するため)
     */
    TickBuffer.prototype.setCurrentAge = function (age) {
        this._dropUntil(age);
        this._nextTickTimeCache = null;
        this.currentAge = age;
        if (this.knownLatestAge < age - 1)
            this.knownLatestAge = age - 1;
        this._nearestAbsentAge = this._findNearestAbscentAge(age);
    };
    TickBuffer.prototype.startSkipping = function () {
        this._skipping = true;
    };
    TickBuffer.prototype.endSkipping = function () {
        this._skipping = false;
    };
    TickBuffer.prototype.hasNextTick = function () {
        return this.currentAge !== this._nearestAbsentAge;
    };
    TickBuffer.prototype.consume = function () {
        if (this.currentAge === this._nearestAbsentAge)
            return null;
        var age = this.currentAge;
        var range = this._tickRanges[0];
        if (age === range.start) {
            this._nextTickTimeCache = null;
            ++this.currentAge;
            ++range.start;
            if (age + this._prefetchThreshold === this._nearestAbsentAge) {
                this.requestTicks(this._nearestAbsentAge, this._sizeRequestOnce);
            }
            if (range.start === range.end)
                this._tickRanges.shift();
            return (range.ticks.length > 0 && range.ticks[0][0 /* Age */] === age) ? range.ticks.shift() : age;
        }
        // range.start < age。外部から前に追加された場合。破棄してリトライする。
        this._dropUntil(this.currentAge);
        return this.consume();
    };
    TickBuffer.prototype.readNextTickTime = function () {
        if (this._nextTickTimeCache != null)
            return this._nextTickTimeCache;
        if (this.currentAge === this._nearestAbsentAge)
            return null;
        var age = this.currentAge;
        var range = this._tickRanges[0];
        if (age === range.start) {
            if (range.ticks.length === 0)
                return null;
            var tick = range.ticks[0];
            if (tick[0 /* Age */] !== age)
                return null;
            var pevs = tick[1 /* Events */];
            if (!pevs)
                return null;
            for (var i = 0; i < pevs.length; ++i) {
                if (pevs[i][0 /* Code */] === 2 /* Timestamp */) {
                    var nextTickTime = pevs[i][3 /* Timestamp */];
                    // 暫定処理: 旧仕様(相対時刻)用ワークアラウンド。小さすぎる時刻は相対とみなす
                    if (nextTickTime < this._oldTimestampThreshold)
                        nextTickTime += this._startedAt;
                    this._nextTickTimeCache = nextTickTime;
                    return nextTickTime;
                }
            }
            return null;
        }
        // range.start < age。外部から前に追加された場合。破棄してリトライする。
        this._dropUntil(this.currentAge);
        return this.readNextTickTime();
    };
    TickBuffer.prototype.requestTicks = function (from, len) {
        if (from === void 0) { from = this.currentAge; }
        if (len === void 0) { len = this._sizeRequestOnce; }
        if (this._skipping) {
            this.requestNonIgnorableTicks(from, len);
        }
        else {
            this.requestAllTicks(from, len);
        }
    };
    TickBuffer.prototype.requestAllTicks = function (from, len) {
        if (from === void 0) { from = this.currentAge; }
        if (len === void 0) { len = this._sizeRequestOnce; }
        if (this._executionMode !== ExecutionMode_1.default.Passive)
            return;
        // NOTE: 移行期のため一部特殊な環境では旧インターフェイスを利用する
        // TODO: このパスを削除する
        if (typeof window !== "undefined" && window.prompt === window.confirm) {
            this._amflow.getTickList(from, from + len, this._onTicks_bound);
            return;
        }
        this._amflow.getTickList({ begin: from, end: from + len }, this._onTicks_bound);
    };
    TickBuffer.prototype.requestNonIgnorableTicks = function (from, len) {
        if (from === void 0) { from = this.currentAge; }
        if (len === void 0) { len = this._sizeRequestOnce; }
        if (this._executionMode !== ExecutionMode_1.default.Passive)
            return;
        // NOTE: 移行期のため一部特殊な環境では旧インターフェイスを利用する。ignorable には対応しない。
        // TODO: このパスを削除する
        if (typeof window !== "undefined" && window.prompt === window.confirm) {
            this._amflow.getTickList(from, from + len, this._onTicks_bound);
            return;
        }
        this._amflow.getTickList({ begin: from, end: from + len, excludeEventFlags: { ignorable: true } }, this._onTicks_bound);
    };
    TickBuffer.prototype.addTick = function (tick) {
        var age = tick[0 /* Age */];
        var gotNext = (this.currentAge === age) && (this._nearestAbsentAge === age);
        if (this.knownLatestAge < age) {
            this.knownLatestAge = age;
        }
        var storageData = tick[2 /* StorageData */];
        if (storageData) {
            this.gotStorageTrigger.fire({ age: tick[0 /* Age */], storageData: storageData });
        }
        var i = this._tickRanges.length - 1;
        for (; i >= 0; --i) {
            var range = this._tickRanges[i];
            if (age >= range.start)
                break;
        }
        var nextRange = this._tickRanges[i + 1];
        if (i < 0) {
            // 既知のどの tick よりも過去、または単に既知の tick がない。
            // NOTE: _tickRanges[0]を過去方向に拡張できるかもしれないが、
            //       addTickはほぼ最新フレームしか受信しないので気にせず新たにTickRangeを作る。
            this._tickRanges.unshift(this._createTickRangeFromTick(tick));
        }
        else {
            var range = this._tickRanges[i];
            if (age === range.end) {
                // 直近の TickRange のすぐ後に続く tick だった。
                ++range.end;
                if (tick[1 /* Events */]) {
                    range.ticks.push(tick);
                }
            }
            else if (age > range.end) {
                // 既存 TickList に続かない tick だった。新規に TickList を作って挿入
                this._tickRanges.splice(i + 1, 0, this._createTickRangeFromTick(tick));
            }
            else {
                // (start <= age < end) 既存 tick と重複している。何もしない。
            }
        }
        if (this._nearestAbsentAge === age) {
            ++this._nearestAbsentAge;
            if (nextRange && this._nearestAbsentAge === nextRange.start) {
                // 直近の欠けているageを追加したら前後のrangeが繋がってしまった。諦めて_nearestAbsentAgeを求め直す。
                this._nearestAbsentAge = this._findNearestAbscentAge(this._nearestAbsentAge);
            }
        }
        if (gotNext)
            this.gotNextTickTrigger.fire();
    };
    TickBuffer.prototype.addTickList = function (tickList) {
        var start = tickList[0 /* From */];
        var end = tickList[1 /* To */] + 1;
        var ticks = tickList[2 /* TicksWithEvents */];
        var origStart = start;
        var origEnd = end;
        if (this.knownLatestAge < end - 1) {
            this.knownLatestAge = end - 1;
        }
        // 今回挿入分の開始ageよりも「後」に開始される最初のrangeを探す
        var i = 0;
        var len = this._tickRanges.length;
        for (i = 0; i < len; ++i) {
            var range = this._tickRanges[i];
            if (start < range.start)
                break;
        }
        var insertPoint = i;
        // 左側が重複しうるrangeを探して重複を除く
        if (i > 0) {
            // 左側が重複しうるrangeは、今回挿入分の開始ageの直前に始まるもの
            --i;
            var leftEndAge = this._tickRanges[i].end;
            if (start < leftEndAge)
                start = leftEndAge;
        }
        // 右側で重複しうるrangeを探して重複を除く
        for (; i < len; ++i) {
            var range = this._tickRanges[i];
            if (end <= range.end)
                break;
        }
        if (i < len) {
            var rightStartAge = this._tickRanges[i].start;
            if (end > rightStartAge)
                end = rightStartAge;
        }
        if (start >= end) {
            // 今回挿入分はすべて重複だった。何もせずreturn
            return { start: start, end: start, ticks: [] };
        }
        if (!ticks)
            ticks = [];
        if (origStart !== start || origEnd !== end) {
            ticks = ticks.filter(function (tick) {
                var age = tick[0 /* Age */];
                return start <= age && age < end;
            });
        }
        for (var j = 0; j < ticks.length; ++j) {
            var tick = ticks[j];
            var storageData = tick[2 /* StorageData */];
            if (storageData)
                this.gotStorageTrigger.fire({ age: tick[0 /* Age */], storageData: storageData });
        }
        var tickRange = { start: start, end: end, ticks: ticks };
        var delLen = Math.max(0, i - insertPoint);
        this._tickRanges.splice(insertPoint, delLen, tickRange);
        if (start <= this._nearestAbsentAge && this._nearestAbsentAge < end) {
            this._nearestAbsentAge = this._findNearestAbscentAge(this._nearestAbsentAge);
        }
        return tickRange;
    };
    TickBuffer.prototype.dropAll = function () {
        this._tickRanges = [];
        this._nearestAbsentAge = this.currentAge;
        this._nextTickTimeCache = null;
    };
    TickBuffer.prototype._updateAmflowReceiveState = function () {
        if (this._receiving && this._executionMode === ExecutionMode_1.default.Passive) {
            this._amflow.onTick(this._addTick_bound);
        }
        else {
            this._amflow.offTick(this._addTick_bound);
        }
    };
    TickBuffer.prototype._onTicks = function (err, ticks) {
        if (err)
            throw err;
        if (!ticks) {
            this.gotNoTickTrigger.fire();
            return;
        }
        var mayGotNext = (this.currentAge === this._nearestAbsentAge);
        var inserted = this.addTickList(ticks);
        if (mayGotNext && (inserted.start <= this.currentAge && this.currentAge < inserted.end)) {
            this.gotNextTickTrigger.fire();
        }
        if (inserted.start === inserted.end) {
            this.gotNoTickTrigger.fire();
        }
    };
    TickBuffer.prototype._findNearestAbscentAge = function (age) {
        var i = 0;
        var len = this._tickRanges.length;
        for (; i < len; ++i) {
            if (age <= this._tickRanges[i].end)
                break;
        }
        for (; i < len; ++i) {
            var range = this._tickRanges[i];
            if (age < range.start)
                break;
            age = range.end;
        }
        return age;
    };
    TickBuffer.prototype._dropUntil = function (age) {
        // [start,end) が全部 age 以前のものを削除
        var i;
        for (i = 0; i < this._tickRanges.length; ++i) {
            if (age < this._tickRanges[i].end)
                break;
        }
        this._tickRanges = this._tickRanges.slice(i);
        if (this._tickRanges.length === 0)
            return;
        // start を書き換えることで、[start, age) の範囲を削除
        var range = this._tickRanges[0];
        if (age < range.start)
            return;
        range.start = age;
        for (i = 0; i < range.ticks.length; ++i) {
            if (age <= range.ticks[i][0 /* Age */])
                break;
        }
        range.ticks = range.ticks.slice(i);
    };
    TickBuffer.prototype._createTickRangeFromTick = function (tick) {
        var age = tick[0 /* Age */];
        var range = {
            start: age,
            end: age + 1,
            ticks: []
        };
        if (tick[1 /* Events */]) {
            range.ticks.push(tick);
        }
        return range;
    };
    TickBuffer.DEFAULT_PREFETCH_THRESHOLD = 30 * 60; // 数字は適当に30FPSで1分間分。30FPS * 60秒。
    TickBuffer.DEFAULT_SIZE_REQUEST_ONCE = 30 * 60 * 5; // 数字は適当に30FPSで5分間分。
    return TickBuffer;
}());
exports.TickBuffer = TickBuffer;

},{"./ExecutionMode":9,"@akashic/akashic-engine":"@akashic/akashic-engine"}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickController = void 0;
var g = require("@akashic/akashic-engine");
var ExecutionMode_1 = require("./ExecutionMode");
var sr = require("./StorageResolver");
var TickBuffer_1 = require("./TickBuffer");
var TickGenerator_1 = require("./TickGenerator");
/**
 * `GameLoop` に流れるTickを管理するクラス。
 *
 * `GameLoop` に対して `TickGenerator` と `AMFlow` を隠蔽し、
 * Active/Passiveに(ほぼ)関係なくTickを扱えるようにする。
 */
var TickController = /** @class */ (function () {
    function TickController(param) {
        this.errorTrigger = new g.Trigger();
        if (param.errorHandler)
            this.errorTrigger.add(param.errorHandler, param.errorHandlerOwner);
        this._amflow = param.amflow;
        this._clock = param.clock;
        this._started = false;
        this._executionMode = param.executionMode;
        this._generator = new TickGenerator_1.TickGenerator({
            amflow: param.amflow,
            eventBuffer: param.eventBuffer,
            errorHandler: this.errorTrigger.fire,
            errorHandlerOwner: this.errorTrigger
        });
        this._buffer = new TickBuffer_1.TickBuffer({
            amflow: param.amflow,
            executionMode: param.executionMode,
            startedAt: param.startedAt
        });
        this._storageResolver = new sr.StorageResolver({
            game: param.game,
            amflow: param.amflow,
            tickGenerator: this._generator,
            tickBuffer: this._buffer,
            executionMode: param.executionMode,
            errorHandler: this.errorTrigger.fire,
            errorHandlerOwner: this.errorTrigger
        });
        this._generator.tickTrigger.add(this._onTickGenerated, this);
        this._clock.frameTrigger.add(this._generator.next, this._generator);
    }
    TickController.prototype.startTick = function () {
        this._started = true;
        this._updateGeneratorState();
    };
    TickController.prototype.stopTick = function () {
        this._started = false;
        this._updateGeneratorState();
    };
    TickController.prototype.startTickOnce = function () {
        this._started = true;
        this._generator.tickTrigger.addOnce(this._stopTriggerOnTick, this);
        this._updateGeneratorState();
    };
    TickController.prototype.setNextAge = function (age) {
        this._generator.setNextAge(age);
    };
    TickController.prototype.forceGenerateTick = function () {
        this._generator.forceNext();
    };
    TickController.prototype.getBuffer = function () {
        return this._buffer;
    };
    TickController.prototype.storageFunc = function () {
        return {
            storageGetFunc: this._storageResolver.getStorageFunc,
            storagePutFunc: this._storageResolver.putStorageFunc,
            requestValuesForJoinFunc: this._storageResolver.requestValuesForJoinFunc
        };
    };
    TickController.prototype.setExecutionMode = function (execMode) {
        if (this._executionMode === execMode)
            return;
        this._executionMode = execMode;
        this._updateGeneratorState();
        this._buffer.setExecutionMode(execMode);
        this._storageResolver.setExecutionMode(execMode);
    };
    TickController.prototype._stopTriggerOnTick = function () {
        this.stopTick();
    };
    TickController.prototype._updateGeneratorState = function () {
        var toGenerate = (this._started && this._executionMode === ExecutionMode_1.default.Active);
        this._generator.startStopGenerate(toGenerate);
    };
    TickController.prototype._onTickGenerated = function (tick) {
        this._amflow.sendTick(tick);
        this._buffer.addTick(tick);
    };
    return TickController;
}());
exports.TickController = TickController;

},{"./ExecutionMode":9,"./StorageResolver":18,"./TickBuffer":19,"./TickGenerator":21,"@akashic/akashic-engine":"@akashic/akashic-engine"}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickGenerator = void 0;
var g = require("@akashic/akashic-engine");
var JoinResolver_1 = require("./JoinResolver");
/**
 * `playlog.Tick` の生成器。
 * `next()` が呼ばれる度に、EventBuffer に蓄積されたイベントを集めてtickを生成、`tickTrigger` で通知する。
 */
var TickGenerator = /** @class */ (function () {
    function TickGenerator(param) {
        this.tickTrigger = new g.Trigger();
        this.gotStorageTrigger = new g.Trigger();
        this.errorTrigger = new g.Trigger();
        this._nextAge = 0;
        this._storageDataForNext = null;
        this._generatingTick = false;
        this._waitingStorage = false;
        if (param.errorHandler)
            this.errorTrigger.add(param.errorHandler, param.errorHandlerOwner);
        this._amflow = param.amflow;
        this._eventBuffer = param.eventBuffer;
        this._joinResolver = new JoinResolver_1.JoinResolver({
            amflow: param.amflow,
            errorHandler: this.errorTrigger.fire,
            errorHandlerOwner: this.errorTrigger
        });
        this._onGotStorageData_bound = this._onGotStorageData.bind(this);
    }
    TickGenerator.prototype.next = function () {
        if (!this._generatingTick || this._waitingStorage)
            return;
        var joinLeaves = this._eventBuffer.readJoinLeaves();
        if (joinLeaves) {
            for (var i = 0; i < joinLeaves.length; ++i)
                this._joinResolver.request(joinLeaves[i]);
        }
        var evs = this._eventBuffer.readEvents();
        var resolvedJoinLeaves = this._joinResolver.readResolved();
        if (resolvedJoinLeaves) {
            if (evs) {
                evs.push.apply(evs, resolvedJoinLeaves);
            }
            else {
                evs = resolvedJoinLeaves;
            }
        }
        var sds = this._storageDataForNext;
        this._storageDataForNext = null;
        if (sds) {
            this.tickTrigger.fire([
                this._nextAge++,
                evs,
                sds // 2?: ストレージデータ
            ]);
        }
        else {
            this.tickTrigger.fire([
                this._nextAge++,
                evs // 1?: イベント
            ]);
        }
    };
    TickGenerator.prototype.forceNext = function () {
        if (this._waitingStorage) {
            this.errorTrigger.fire(new Error("TickGenerator#forceNext(): cannot generate tick while waiting storage."));
            return;
        }
        var origValue = this._generatingTick;
        this._generatingTick = true;
        this.next();
        this._generatingTick = origValue;
    };
    TickGenerator.prototype.startStopGenerate = function (toGenerate) {
        this._generatingTick = toGenerate;
    };
    TickGenerator.prototype.startTick = function () {
        this._generatingTick = true;
    };
    TickGenerator.prototype.stopTick = function () {
        this._generatingTick = false;
    };
    TickGenerator.prototype.setNextAge = function (age) {
        if (this._waitingStorage) {
            // エッジケース: 次のtickにストレージを乗せるはずだったが、ageが変わってしまうのでできない。
            // Activeでストレージ要求(シーン切り替え)して待っている間にここに来るとこのパスにかかる。
            // 現実にはActiveで実行開始した後にageを変えるケースは想像しにくい(tickが飛び飛びになったり重複したりする)。
            this.errorTrigger.fire(new Error("TickGenerator#setNextAge(): cannot change the next age while waiting storage."));
            return;
        }
        this._nextAge = age;
    };
    /**
     * 次に生成するtickにstorageDataを持たせる。
     * 取得が完了するまで、次のtickは生成されない。
     */
    TickGenerator.prototype.requestStorageTick = function (keys) {
        if (this._waitingStorage) {
            var err = new Error("TickGenerator#requestStorageTick(): Unsupported: multiple storage request");
            this.errorTrigger.fire(err);
            return -1;
        }
        this._waitingStorage = true;
        this._amflow.getStorageData(keys, this._onGotStorageData_bound);
        return this._nextAge;
    };
    TickGenerator.prototype.setRequestValuesForJoin = function (keys) {
        this._joinResolver.setRequestValuesForJoin(keys);
    };
    TickGenerator.prototype._onGotStorageData = function (err, sds) {
        this._waitingStorage = false;
        if (err) {
            this.errorTrigger.fire(err);
            return;
        }
        if (!sds) {
            // NOTE: err が無ければ storageData は必ず存在するはずだが、念の為にバリデートする。
            return;
        }
        this._storageDataForNext = sds;
        this.gotStorageTrigger.fire({ age: this._nextAge, storageData: sds });
    };
    return TickGenerator;
}());
exports.TickGenerator = TickGenerator;

},{"./JoinResolver":14,"@akashic/akashic-engine":"@akashic/akashic-engine"}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleProfiler = void 0;
var g = require("@akashic/akashic-engine");
var SimpleProfiler = /** @class */ (function () {
    function SimpleProfiler(param) {
        var _a;
        this._startTime = 0;
        this._beforeFlushTime = 0;
        this._beforeTimes = [];
        this._values = [];
        this._calculateProfilerValueTrigger = new g.Trigger();
        this._interval = (_a = param.interval) !== null && _a !== void 0 ? _a : SimpleProfiler.DEFAULT_INTERVAL;
        if (param.limit != null) {
            this._limit = param.limit >= SimpleProfiler.DEFAULT_LIMIT ? param.limit : SimpleProfiler.DEFAULT_LIMIT;
        }
        else {
            this._limit = SimpleProfiler.DEFAULT_LIMIT;
        }
        if (param.getValueHandler) {
            this._calculateProfilerValueTrigger.add(param.getValueHandler, param.getValueHandlerOwner);
        }
        this._reset();
    }
    SimpleProfiler.prototype.time = function (type) {
        this._beforeTimes[type] = this._getCurrentTime();
    };
    SimpleProfiler.prototype.timeEnd = function (type) {
        var now = this._getCurrentTime();
        var value = this._beforeTimes[type] != null ? now - this._beforeTimes[type] : 0;
        this._values[type].push({
            time: now,
            value: value
        });
    };
    SimpleProfiler.prototype.flush = function () {
        var now = this._getCurrentTime();
        if (this._beforeFlushTime === 0)
            this._beforeFlushTime = now;
        if (this._beforeFlushTime + this._interval < now) {
            this._calculateProfilerValueTrigger.fire(this.getProfilerValue(this._interval));
            this._beforeFlushTime = now;
        }
        if (this._values[1 /* RawFrameInterval */].length > this._limit) {
            for (var i in this._values) {
                if (this._values.hasOwnProperty(i))
                    this._values[i] = this._values[i].slice(-SimpleProfiler.BACKUP_MARGIN);
            }
        }
    };
    SimpleProfiler.prototype.setValue = function (type, value) {
        this._values[type].push({
            time: this._getCurrentTime(),
            value: value
        });
    };
    /**
     * 現在時刻から、指定した時間までを遡った期間の `SimpleProfilerValue` を取得する。
     */
    SimpleProfiler.prototype.getProfilerValue = function (time) {
        var rawFrameInterval = this._calculateProfilerValue(1 /* RawFrameInterval */, time);
        return {
            skippedFrameCount: this._calculateProfilerValue(0 /* SkippedFrameCount */, time),
            rawFrameInterval: rawFrameInterval,
            framePerSecond: {
                ave: 1000 / rawFrameInterval.ave,
                max: 1000 / rawFrameInterval.min,
                min: 1000 / rawFrameInterval.max
            },
            frameTime: this._calculateProfilerValue(2 /* FrameTime */, time),
            renderingTime: this._calculateProfilerValue(3 /* RenderingTime */, time)
        };
    };
    SimpleProfiler.prototype._reset = function () {
        this._startTime = this._getCurrentTime();
        this._beforeFlushTime = 0;
        this._beforeTimes = [];
        this._beforeTimes[1 /* RawFrameInterval */] = 0;
        this._beforeTimes[2 /* FrameTime */] = 0;
        this._beforeTimes[3 /* RenderingTime */] = 0;
        this._beforeTimes[0 /* SkippedFrameCount */] = 0;
        this._values = [];
        this._values[1 /* RawFrameInterval */] = [];
        this._values[2 /* FrameTime */] = [];
        this._values[3 /* RenderingTime */] = [];
        this._values[0 /* SkippedFrameCount */] = [];
    };
    SimpleProfiler.prototype._calculateProfilerValue = function (type, time) {
        var limit = this._getCurrentTime() - time;
        var sum = 0;
        var num = 0;
        var max = 0;
        var min = Number.MAX_VALUE;
        for (var i = this._values[type].length - 1; i >= 0; --i) {
            if (0 < num && this._values[type][i].time < limit)
                break;
            var value = this._values[type][i].value;
            if (max < value)
                max = value;
            if (value < min)
                min = value;
            sum += value;
            ++num;
        }
        return {
            ave: sum / num,
            max: max,
            min: min
        };
    };
    SimpleProfiler.prototype._getCurrentTime = function () {
        return +new Date();
    };
    SimpleProfiler.DEFAULT_INTERVAL = 1000;
    SimpleProfiler.DEFAULT_LIMIT = 1000;
    SimpleProfiler.BACKUP_MARGIN = 100;
    return SimpleProfiler;
}());
exports.SimpleProfiler = SimpleProfiler;

},{"@akashic/akashic-engine":"@akashic/akashic-engine"}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PSEUDO_INFINITE_AGE = exports.DEFAULT_POLLING_TICK_THRESHOLD = exports.DEFAULT_JUMP_IGNORE_THRESHOLD = exports.DEFAULT_JUMP_TRY_THRESHOLD = exports.DEFAULT_SKIP_THRESHOLD = exports.DEFAULT_SKIP_TICKS_AT_ONCE = exports.DEFAULT_DELAY_IGNORE_THRESHOLD = void 0;
/**
 * 遅延を無視する域値のデフォルト。
 * `LoopConfiguration#delayIgnoreThreshold` のデフォルト値。
 * このフレーム以下の遅延は遅れてないものとみなす(常時コマが飛ぶのを避けるため)。
 */
exports.DEFAULT_DELAY_IGNORE_THRESHOLD = 6;
/**
 * 「早送り」時倍率のデフォルト値。
 * `LoopConfiguration#skipTicksAtOnce` のデフォルト値。
 */
exports.DEFAULT_SKIP_TICKS_AT_ONCE = 100;
/**
 * 「早送り」状態に移る域値のデフォルト。
 * `LoopConfiguration#skipThreshold` のデフォルト値。
 */
exports.DEFAULT_SKIP_THRESHOLD = 100;
/**
 * スナップショットジャンプを試みる域値のデフォルト。
 * `LoopConfiguration#jumpTryThreshold` のデフォルト値。
 */
exports.DEFAULT_JUMP_TRY_THRESHOLD = 30000; // 30FPSの100倍早送りで換算3000FPSで進めても10秒かかる閾値
/**
 * 取得したスナップショットを無視する域値のデフォルト。
 * `LoopConfiguration#jumpIgnoreThreshold` のデフォルト値。
 */
exports.DEFAULT_JUMP_IGNORE_THRESHOLD = 15000; // 30FPSの100倍早送りで換算3000FPSで進めて5秒で済む閾値
/**
 * 最新ティックをポーリングする間隔(ms)のデフォルト。
 */
exports.DEFAULT_POLLING_TICK_THRESHOLD = 10000;
/**
 * 擬似的に無限未来として扱うage。
 */
exports.PSEUDO_INFINITE_AGE = 1892160000; // = 365 * 86400 * 60 = 60FPSで一年分。(特に制限ではないが32bit signed intに収まる)

},{}],24:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopRenderMode = exports.LoopMode = exports.GameDriver = exports.Game = exports.ExecutionMode = exports.SimpleProfiler = exports.ReplayAmflowProxy = exports.MemoryAmflowClient = void 0;
__exportStar(require("./constants"), exports);
var MemoryAmflowClient_1 = require("@akashic/amflow-util/lib/MemoryAmflowClient");
Object.defineProperty(exports, "MemoryAmflowClient", { enumerable: true, get: function () { return MemoryAmflowClient_1.MemoryAmflowClient; } });
var ReplayAmflowProxy_1 = require("@akashic/amflow-util/lib/ReplayAmflowProxy");
Object.defineProperty(exports, "ReplayAmflowProxy", { enumerable: true, get: function () { return ReplayAmflowProxy_1.ReplayAmflowProxy; } });
var SimpleProfiler_1 = require("./auxiliary/SimpleProfiler");
Object.defineProperty(exports, "SimpleProfiler", { enumerable: true, get: function () { return SimpleProfiler_1.SimpleProfiler; } });
var ExecutionMode_1 = require("./ExecutionMode");
exports.ExecutionMode = ExecutionMode_1.default;
var Game_1 = require("./Game");
Object.defineProperty(exports, "Game", { enumerable: true, get: function () { return Game_1.Game; } });
var GameDriver_1 = require("./GameDriver");
Object.defineProperty(exports, "GameDriver", { enumerable: true, get: function () { return GameDriver_1.GameDriver; } });
var LoopMode_1 = require("./LoopMode");
exports.LoopMode = LoopMode_1.default;
var LoopRenderMode_1 = require("./LoopRenderMode");
exports.LoopRenderMode = LoopRenderMode_1.default;

},{"./ExecutionMode":9,"./Game":10,"./GameDriver":11,"./LoopMode":15,"./LoopRenderMode":16,"./auxiliary/SimpleProfiler":22,"./constants":23,"@akashic/amflow-util/lib/MemoryAmflowClient":1,"@akashic/amflow-util/lib/ReplayAmflowProxy":2}],25:[function(require,module,exports){
(function (process,global){(function (){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));





}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":26}],26:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"@akashic/game-driver":[function(require,module,exports){
module.exports = require("./lib/index");

},{"./lib/index":24}]},{},[]);
