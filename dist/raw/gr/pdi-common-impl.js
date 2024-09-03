require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
var trigger_1 = require("@akashic/trigger");
/**
 * 各種リソースを表すクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはない。
 * game.jsonによって定義された内容をもとに暗黙的に生成されたインスタンスを、
 * Scene#assets、またはGame#assetsによって取得して利用する。
 */
var Asset = /** @class */ (function () {
    function Asset(id, path) {
        this.id = id;
        this.originalPath = path;
        this.path = this._assetPathFilter(path);
        this.onDestroyed = new trigger_1.Trigger();
    }
    Asset.prototype.destroy = function () {
        this.onDestroyed.fire(this);
        this.id = undefined;
        this.originalPath = undefined;
        this.path = undefined;
        this.onDestroyed.destroy();
        this.onDestroyed = undefined;
    };
    Asset.prototype.destroyed = function () {
        return this.id === undefined;
    };
    /**
     * 現在利用中で解放出来ない `Asset` かどうかを返す。
     * 戻り値は、利用中である場合真、でなければ偽である。
     *
     * 本メソッドは通常 `false` が返るべきである。
     * 例えば `Sprite` の元画像として使われているケース等では、その `Sprite` によって `Asset` は `Surface` に変換されているべきで、
     * `Asset` が利用中で解放出来ない状態になっていない事を各プラットフォームで保障する必要がある。
     *
     * 唯一、例外的に本メソッドが `true` を返すことがあるのは音楽を表す `Asset` である。
     * BGM等はシーンをまたいで演奏することもありえる上、
     * 演奏中のリソースのコピーを常に各プラットフォームに強制するにはコストがかかりすぎるため、
     * 本メソッドは `true` を返し、適切なタイミングで `Asset` が解放されるよう制御する必要がある。
     */
    Asset.prototype.inUse = function () {
        return false;
    };
    /**
     * @private
     */
    Asset.prototype._assetPathFilter = function (path) {
        // 拡張子の補完・読み替えが必要なassetはこれをオーバーライドすればよい。(対応形式が限定されるaudioなどの場合)
        return path;
    };
    return Asset;
}());
exports.Asset = Asset;

},{"@akashic/trigger":19}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioAsset = void 0;
var Asset_1 = require("./Asset");
/**
 * 音リソースを表すクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはない。
 * game.jsonによって定義された内容をもとに暗黙的に生成されたインスタンスを、
 * Scene#assets、またはGame#assetsによって取得して利用する。
 *
 * AudioAsset#playを呼び出す事で、その音を再生することが出来る。
 */
var AudioAsset = /** @class */ (function (_super) {
    __extends(AudioAsset, _super);
    function AudioAsset(id, assetPath, duration, system, loop, hint) {
        var _this = _super.call(this, id, assetPath) || this;
        _this.type = "audio";
        _this.duration = duration;
        _this.loop = loop;
        _this.hint = hint;
        _this._system = system;
        _this.data = undefined;
        return _this;
    }
    AudioAsset.prototype.play = function () {
        var player = this._system.createPlayer();
        player.play(this);
        this._lastPlayedPlayer = player;
        return player;
    };
    AudioAsset.prototype.stop = function () {
        var players = this._system.findPlayers(this);
        for (var i = 0; i < players.length; ++i)
            players[i].stop();
    };
    AudioAsset.prototype.inUse = function () {
        return this._system.findPlayers(this).length > 0;
    };
    AudioAsset.prototype.destroy = function () {
        if (this._system)
            this.stop();
        this.data = undefined;
        this._system = undefined;
        this._lastPlayedPlayer = undefined;
        _super.prototype.destroy.call(this);
    };
    return AudioAsset;
}(Asset_1.Asset));
exports.AudioAsset = AudioAsset;

},{"./Asset":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayer = void 0;
var trigger_1 = require("@akashic/trigger");
/**
 * サウンド再生を行うクラス。
 *
 * 本クラスのインスタンスは、 `AudioSystem#createPlayer()` によって明示的に、
 * または `AudioAsset#play()` によって暗黙的に生成される。
 * ゲーム開発者は本クラスのインスタンスを直接生成すべきではない。
 */
var AudioPlayer = /** @class */ (function () {
    /**
     * `AudioPlayer` のインスタンスを生成する。
     */
    function AudioPlayer(system) {
        this.onPlay = new trigger_1.Trigger();
        this.onStop = new trigger_1.Trigger();
        this.played = this.onPlay;
        this.stopped = this.onStop;
        this.currentAudio = undefined;
        this.volume = system.volume;
        this._muted = system._muted;
        this._system = system;
    }
    /**
     * `AudioAsset` を再生する。
     *
     * 再生後、 `this.onPlay` がfireされる。
     * @param audio 再生するオーディオアセット
     */
    AudioPlayer.prototype.play = function (audio) {
        this.currentAudio = audio;
        this.onPlay.fire({
            player: this,
            audio: audio
        });
    };
    /**
     * 再生を停止する。
     *
     * 停止後、 `this.onStop` がfireされる。
     * 再生中でない場合、何もしない(`onStop` もfireされない)。
     */
    AudioPlayer.prototype.stop = function () {
        var audio = this.currentAudio;
        if (!audio)
            return;
        this.currentAudio = undefined;
        this.onStop.fire({
            player: this,
            audio: audio
        });
    };
    /**
     * 音声の終了を検知できるか否か。
     * 通常、ゲーム開発者がこのメソッドを利用する必要はない。
     */
    AudioPlayer.prototype.canHandleStopped = function () {
        return true;
    };
    /**
     * 音量を変更する。
     *
     * @param volume 音量。0以上1.0以下でなければならない
     */
    // エンジンユーザが `AudioPlayer` の派生クラスを実装する場合は、
    // `_changeMuted()` などと同様、このメソッドをオーバーライドして実際に音量を変更する処理を行うこと。
    // オーバーライド先のメソッドはこのメソッドを呼びださなければならない。
    AudioPlayer.prototype.changeVolume = function (volume) {
        this.volume = volume;
    };
    /**
     * ミュート状態を変更する。
     *
     * エンジンユーザが `AudioPlayer` の派生クラスを実装する場合は、
     * このメソッドをオーバーライドして実際にミュート状態を変更する処理を行うこと。
     * オーバーライド先のメソッドはこのメソッドを呼びださなければならない。
     *
     * @param muted ミュート状態にするか否か
     * @private
     */
    AudioPlayer.prototype._changeMuted = function (muted) {
        this._muted = muted;
    };
    /**
     * 音量の変更を通知する。
     * @private
     */
    AudioPlayer.prototype._notifyVolumeChanged = function () {
        // AudioPlayerの音量を AudioSystem の音量で上書きしていたため、最終音量が正常に計算できていなかった。
        // 暫定対応として、 changeVolume() に AudioPlayer 自身の音量を渡す事により最終音量の計算を実行させる。
        this.changeVolume(this.volume);
    };
    return AudioPlayer;
}());
exports.AudioPlayer = AudioPlayer;

},{"@akashic/trigger":19}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionFactory = void 0;
/**
 * 例外生成ファクトリ。
 * エンジン内部での例外生成に利用するもので、ゲーム開発者は通常本モジュールを利用する必要はない。
 */
var ExceptionFactory;
(function (ExceptionFactory) {
    function createAssertionError(message, cause) {
        var e = new Error(message);
        e.name = "AssertionError";
        e.cause = cause;
        return e;
    }
    ExceptionFactory.createAssertionError = createAssertionError;
    function createTypeMismatchError(methodName, expected, actual, cause) {
        var message = "Type mismatch on " + methodName + "," + " expected type is " + expected;
        if (arguments.length > 2) {
            // actual 指定時
            try {
                var actualString;
                if (actual && actual.constructor && actual.constructor.name) {
                    actualString = actual.constructor.name;
                }
                else {
                    actualString = typeof actual;
                }
                message += ", actual type is " + (actualString.length > 40 ? actualString.substr(0, 40) : actualString);
            }
            catch (ex) {
                // メッセージ取得時に例外が発生したらactualの型情報出力はあきらめる
            }
        }
        message += ".";
        var e = new Error(message);
        e.name = "TypeMismatchError";
        e.cause = cause;
        e.expected = expected;
        e.actual = actual;
        return e;
    }
    ExceptionFactory.createTypeMismatchError = createTypeMismatchError;
    function createAssetLoadError(message, retriable, _type, // 歴史的経緯により残っている値。利用していない。
    cause) {
        if (retriable === void 0) { retriable = true; }
        if (_type === void 0) { _type = null; }
        var e = new Error(message);
        e.name = "AssetLoadError";
        e.cause = cause;
        e.retriable = retriable;
        return e;
    }
    ExceptionFactory.createAssetLoadError = createAssetLoadError;
})(ExceptionFactory = exports.ExceptionFactory || (exports.ExceptionFactory = {}));

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glyph = void 0;
/**
 * グリフ。
 *
 * @deprecated 非推奨である。将来的に削除される予定である。
 */
var Glyph = /** @class */ (function () {
    /**
     * `Glyph` のインスタンスを生成する。
     * @deprecated 非推奨である。将来的に削除される予定である。
     */
    function Glyph(code, x, y, width, height, offsetX, offsetY, advanceWidth, surface, isSurfaceValid) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (advanceWidth === void 0) { advanceWidth = width; }
        if (isSurfaceValid === void 0) { isSurfaceValid = !!surface; }
        this.code = code;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.advanceWidth = advanceWidth;
        this.surface = surface;
        this.isSurfaceValid = isSurfaceValid;
        this._atlas = null;
    }
    /**
     * グリフの描画上の幅を求める。
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     * @param fontSize フォントサイズ
     */
    Glyph.prototype.renderingWidth = function (fontSize) {
        if (!this.width || !this.height) {
            return 0;
        }
        return (fontSize / this.height) * this.width;
    };
    return Glyph;
}());
exports.Glyph = Glyph;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlyphFactory = void 0;
/**
 * グリフファクトリ。
 *
 * `DynamicFont` はこれを利用してグリフを生成する。
 *
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 */
var GlyphFactory = /** @class */ (function () {
    /**
     * `GlyphFactory` を生成する。
     *
     * @param fontFamily フォントファミリ。フォント名、またはそれらの配列
     * @param fontSize フォントサイズ
     * @param baselineHeight ベースラインの高さ
     * @param strokeWidth 輪郭幅
     * @param strokeColor 輪郭色
     * @param strokeOnly 輪郭を描画するか否か
     * @param fontWeight フォントウェイト
     */
    function GlyphFactory(fontFamily, fontSize, baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
        if (baselineHeight === void 0) { baselineHeight = fontSize; }
        if (fontColor === void 0) { fontColor = "black"; }
        if (strokeWidth === void 0) { strokeWidth = 0; }
        if (strokeColor === void 0) { strokeColor = "black"; }
        if (strokeOnly === void 0) { strokeOnly = false; }
        if (fontWeight === void 0) { fontWeight = "normal"; }
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.fontWeight = fontWeight;
        this.baselineHeight = baselineHeight;
        this.fontColor = fontColor;
        this.strokeWidth = strokeWidth;
        this.strokeColor = strokeColor;
        this.strokeOnly = strokeOnly;
    }
    return GlyphFactory;
}());
exports.GlyphFactory = GlyphFactory;

},{}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAsset = void 0;
var Asset_1 = require("./Asset");
/**
 * 画像リソースを表すクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはない。
 * game.jsonによって定義された内容をもとに暗黙的に生成されたインスタンスを、
 * Scene#assets、またはGame#assetsによって取得して利用する。
 *
 * width, heightでメタデータとして画像の大きさをとることは出来るが、
 * ゲーム開発者はそれ以外の情報を本クラスから直接は取得せず、Sprite等に本リソースを指定して利用する。
 */
var ImageAsset = /** @class */ (function (_super) {
    __extends(ImageAsset, _super);
    function ImageAsset(id, assetPath, width, height) {
        var _this = _super.call(this, id, assetPath) || this;
        _this.type = "image";
        _this.width = width;
        _this.height = height;
        return _this;
    }
    ImageAsset.prototype.initialize = function (hint) {
        this.hint = hint;
    };
    return ImageAsset;
}(Asset_1.Asset));
exports.ImageAsset = ImageAsset;

},{"./Asset":1}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdiCommonUtil = void 0;
/**
 * pdi-browserから使用されるユーティリティ
 */
var PdiCommonUtil;
(function (PdiCommonUtil) {
    /**
     * 与えられたパス文字列に与えられた拡張子を追加する。
     * @param path パス文字列
     * @param ext 追加する拡張子
     */
    function addExtname(path, ext) {
        var index = path.indexOf("?");
        if (index === -1) {
            return path + "." + ext;
        }
        // hoge?query => hoge.ext?query
        return path.substring(0, index) + "." + ext + path.substring(index, path.length);
    }
    PdiCommonUtil.addExtname = addExtname;
})(PdiCommonUtil = exports.PdiCommonUtil || (exports.PdiCommonUtil = {}));

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
/**
 * ゲームの描画を行うクラス。
 *
 * 描画は各エンティティによって行われる。通常、ゲーム開発者が本クラスを利用する必要はない。
 */
var Renderer = /** @class */ (function () {
    function Renderer() {
    }
    Renderer.prototype.begin = function () {
        // nothing to do
    };
    Renderer.prototype.end = function () {
        // nothing to do
    };
    return Renderer;
}());
exports.Renderer = Renderer;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceFactory = void 0;
/**
 * リソースの生成を行うクラス。
 *
 * このクラス (の実装クラス) のインスタンスはエンジンによって生成される。ゲーム開発者が生成する必要はない。
 * またこのクラスの各種アセット生成メソッドは、エンジンによって暗黙に呼び出されるものである。
 * 通常ゲーム開発者が呼び出す必要はない。
 */
var ResourceFactory = /** @class */ (function () {
    function ResourceFactory() {
    }
    return ResourceFactory;
}());
exports.ResourceFactory = ResourceFactory;

},{}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptAsset = void 0;
var Asset_1 = require("./Asset");
/**
 * スクリプトリソースを表すクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはない。
 * game.jsonによって定義された内容をもとに暗黙的に生成されたインスタンスを、
 * Scene#assets、またはGame#assetsによって取得して利用する。
 *
 * ScriptAsset#executeによって、本リソースが表すスクリプトを実行し、その結果を受け取る事が出来る。
 * requireによる参照とは異なり、executeはキャッシュされないため、何度でも呼び出し違う結果を受け取ることが出来る。
 */
var ScriptAsset = /** @class */ (function (_super) {
    __extends(ScriptAsset, _super);
    function ScriptAsset(id, path) {
        var _this = _super.call(this, id, path) || this;
        _this.type = "script";
        _this.script = undefined;
        return _this;
    }
    ScriptAsset.prototype.destroy = function () {
        this.script = undefined;
        _super.prototype.destroy.call(this);
    };
    return ScriptAsset;
}(Asset_1.Asset));
exports.ScriptAsset = ScriptAsset;

},{"./Asset":1}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Surface = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
/**
 * 描画領域を表すクラス。
 *
 * このクラスのインスタンスは、エンジンによって暗黙に生成される。
 * ゲーム開発者はこのクラスのインスタンスを明示的に生成する必要はなく、またできない。
 */
var Surface = /** @class */ (function () {
    /**
     * `Surface` のインスタンスを生成する。
     * @param width 描画領域の幅（整数値でなければならない）
     * @param height 描画領域の高さ（整数値でなければならない）
     * @param drawable 描画可能な実体。省略された場合、 `undefined`
     */
    function Surface(width, height, drawable) {
        if (width % 1 !== 0 || height % 1 !== 0) {
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Surface#constructor: width and height must be integers");
        }
        this.width = width;
        this.height = height;
        this._drawable = drawable;
        // this._destroyedは破棄時に一度だけ代入する特殊なフィールドなため、コンストラクタで初期値を代入しない
    }
    /**
     * このSurfaceの破棄を行う。
     * 以後、このSurfaceを利用することは出来なくなる。
     */
    Surface.prototype.destroy = function () {
        this._destroyed = true;
    };
    /**
     * このSurfaceが破棄済であるかどうかを判定する。
     */
    Surface.prototype.destroyed = function () {
        // _destroyedはundefinedかtrueなため、常にbooleanが返すように!!演算子を用いる
        return !!this._destroyed;
    };
    return Surface;
}());
exports.Surface = Surface;

},{"./ExceptionFactory":4}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAsset = void 0;
var Asset_1 = require("./Asset");
/**
 * 文字列リソースを表すクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはない。
 * game.jsonによって定義された内容をもとに暗黙的に生成されたインスタンスを、
 * Scene#assets、またはGame#assetsによって取得して利用する。
 *
 * TextAsset#dataによって、本リソースが保持する文字列を取得することが出来る。
 */
var TextAsset = /** @class */ (function (_super) {
    __extends(TextAsset, _super);
    function TextAsset(id, assetPath) {
        var _this = _super.call(this, id, assetPath) || this;
        _this.type = "text";
        _this.data = undefined;
        return _this;
    }
    TextAsset.prototype.destroy = function () {
        this.data = undefined;
        _super.prototype.destroy.call(this);
    };
    return TextAsset;
}(Asset_1.Asset));
exports.TextAsset = TextAsset;

},{"./Asset":1}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorImageAsset = void 0;
var Asset_1 = require("./Asset");
/**
 * ベクタ画像リソースを表すクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはない。
 * game.jsonによって定義された内容をもとに暗黙的に生成されたインスタンスを、
 * Scene#assets、またはGame#assetsによって取得して利用する。
 */
var VectorImageAsset = /** @class */ (function (_super) {
    __extends(VectorImageAsset, _super);
    function VectorImageAsset(id, assetPath, width, height, hint) {
        var _this = _super.call(this, id, assetPath) || this;
        _this.type = "vector-image";
        _this.width = width;
        _this.height = height;
        _this.hint = hint;
        return _this;
    }
    return VectorImageAsset;
}(Asset_1.Asset));
exports.VectorImageAsset = VectorImageAsset;

},{"./Asset":1}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoAsset = void 0;
var Asset_1 = require("./Asset");
/**
 * 動画リソースを表すクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはない。
 * game.jsonによって定義された内容をもとに暗黙的に生成されたインスタンスを、
 * Scene#assets、またはGame#assetsによって取得して利用する。
 */
var VideoAsset = /** @class */ (function (_super) {
    __extends(VideoAsset, _super);
    function VideoAsset(id, assetPath, width, height, system, loop, useRealSize) {
        var _this = _super.call(this, id, assetPath) || this;
        _this.type = "video";
        _this.width = width;
        _this.height = height;
        _this.realWidth = 0;
        _this.realHeight = 0;
        _this._system = system;
        _this._loop = loop;
        _this._useRealSize = useRealSize;
        return _this;
    }
    VideoAsset.prototype.play = function (_loop) {
        this.getPlayer().play(this);
        return this.getPlayer();
    };
    VideoAsset.prototype.stop = function () {
        this.getPlayer().stop();
    };
    VideoAsset.prototype.destroy = function () {
        this._system = undefined;
        _super.prototype.destroy.call(this);
    };
    return VideoAsset;
}(Asset_1.Asset));
exports.VideoAsset = VideoAsset;

},{"./Asset":1}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPlayer = void 0;
var trigger_1 = require("@akashic/trigger");
/**
 * ビデオ再生を行うクラス。
 *
 * ゲーム開発者は本クラスのインスタンスを直接生成すべきではない。
 */
var VideoPlayer = /** @class */ (function () {
    /**
     * `VideoPlayer` のインスタンスを生成する。
     */
    function VideoPlayer(loop) {
        this._loop = !!loop;
        this.onPlay = new trigger_1.Trigger();
        this.onStop = new trigger_1.Trigger();
        this.played = this.onPlay;
        this.stopped = this.onStop;
        this.currentVideo = undefined;
        this.volume = 1.0;
    }
    /**
     * `VideoAsset` を再生する。
     *
     * 再生後、 `this.onPlay` がfireされる。
     * @param Video 再生するビデオアセット
     */
    VideoPlayer.prototype.play = function (videoAsset) {
        this.currentVideo = videoAsset;
        this.onPlay.fire({
            player: this,
            video: videoAsset
        });
    };
    /**
     * 再生を停止する。
     *
     * 再生中でない場合、何もしない。
     * 停止後、 `this.onStop` がfireされる。
     */
    VideoPlayer.prototype.stop = function () {
        var videoAsset = this.currentVideo;
        this.onStop.fire({
            player: this,
            video: videoAsset
        });
    };
    /**
     * 音量を変更する。
     *
     * エンジンユーザが `VideoPlayer` の派生クラスを実装する場合は、
     *  このメソッドをオーバーライドして実際に音量を変更する処理を行うこと。
     *  オーバーライド先のメソッドはこのメソッドを呼びださなければならない。
     * @param volume 音量。0以上1.0以下でなければならない
     */
    VideoPlayer.prototype.changeVolume = function (volume) {
        this.volume = volume;
    };
    return VideoPlayer;
}());
exports.VideoPlayer = VideoPlayer;

},{"@akashic/trigger":19}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Trigger_1 = require("./Trigger");
/**
 * 他のTriggerLikeに反応して発火するイベント通知機構。
 */
var ChainTrigger = /** @class */ (function (_super) {
    __extends(ChainTrigger, _super);
    /**
     * `ChainTrigger` のインスタンスを生成する。
     *
     * このインスタンスは、 `chain` がfireされたときに `filter` を実行し、真を返した場合に自身をfireする。
     * @param chain このインスタンスがfireするきっかけとなる TriggerLike
     * @param filter `chain` がfireされたときに実行される関数。省略された場合、または本関数の戻り値が真の場合、このインスタンスをfireする。
     * @param filterOwner `filter` 呼び出し時に使われる `this` の値。
     */
    function ChainTrigger(chain, filter, filterOwner) {
        var _this = _super.call(this) || this;
        _this.chain = chain;
        _this.filter = filter != null ? filter : null;
        _this.filterOwner = filterOwner;
        _this._isActivated = false;
        return _this;
    }
    ChainTrigger.prototype.add = function (paramsOrHandler, owner) {
        _super.prototype.add.call(this, paramsOrHandler, owner);
        if (!this._isActivated) {
            this.chain.add(this._onChainTriggerFired, this);
            this._isActivated = true;
        }
    };
    ChainTrigger.prototype.addOnce = function (paramsOrHandler, owner) {
        _super.prototype.addOnce.call(this, paramsOrHandler, owner);
        if (!this._isActivated) {
            this.chain.add(this._onChainTriggerFired, this);
            this._isActivated = true;
        }
    };
    ChainTrigger.prototype.remove = function (paramsOrFunc, owner) {
        _super.prototype.remove.call(this, paramsOrFunc, owner);
        if (this.length === 0 && this._isActivated) {
            this.chain.remove(this._onChainTriggerFired, this);
            this._isActivated = false;
        }
    };
    ChainTrigger.prototype.removeAll = function (params) {
        _super.prototype.removeAll.call(this, params);
        if (this.length === 0 && this._isActivated) {
            this.chain.remove(this._onChainTriggerFired, this);
            this._isActivated = false;
        }
    };
    ChainTrigger.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.chain.remove(this._onChainTriggerFired, this);
        this.filter = null;
        this.filterOwner = null;
        this._isActivated = false;
    };
    /**
     * @private
     */
    ChainTrigger.prototype._onChainTriggerFired = function (args) {
        if (!this.filter || this.filter.call(this.filterOwner, args)) {
            this.fire(args);
        }
    };
    return ChainTrigger;
}(Trigger_1.Trigger));
exports.ChainTrigger = ChainTrigger;

},{"./Trigger":18}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * イベント通知機構クラス。
 */
var Trigger = /** @class */ (function () {
    function Trigger() {
        this._handlers = [];
        this.length = 0;
    }
    Trigger.prototype.add = function (paramsOrFunc, owner) {
        if (typeof paramsOrFunc === "function") {
            this._handlers.push({
                func: paramsOrFunc,
                owner: owner,
                once: false,
                name: undefined
            });
        }
        else {
            var params = paramsOrFunc;
            if (typeof params.index === "number") {
                this._handlers.splice(params.index, 0, {
                    func: params.func,
                    owner: params.owner,
                    once: false,
                    name: params.name
                });
            }
            else {
                this._handlers.push({
                    func: params.func,
                    owner: params.owner,
                    once: false,
                    name: params.name
                });
            }
        }
        this.length = this._handlers.length;
    };
    Trigger.prototype.addOnce = function (paramsOrFunc, owner) {
        if (typeof paramsOrFunc === "function") {
            this._handlers.push({
                func: paramsOrFunc,
                owner: owner,
                once: true,
                name: undefined
            });
        }
        else {
            var params = paramsOrFunc;
            if (typeof params.index === "number") {
                this._handlers.splice(params.index, 0, {
                    func: params.func,
                    owner: params.owner,
                    once: true,
                    name: params.name
                });
            }
            else {
                this._handlers.push({
                    func: params.func,
                    owner: params.owner,
                    once: true,
                    name: params.name
                });
            }
        }
        this.length = this._handlers.length;
    };
    /**
     * このTriggerにハンドラを追加する。
     * @deprecated 互換性のために残されている。代わりに `add()` を利用すべきである。実装の変化のため、 `func` が `boolean` を返した時の動作はサポートされていない。
     */
    Trigger.prototype.handle = function (owner, func, name) {
        this.add(func ? { owner: owner, func: func, name: name } : { func: owner });
    };
    /**
     * このTriggerを発火する。
     *
     * 登録された全ハンドラの関数を、引数 `arg` を与えて呼び出す。
     * 呼び出し後、次のいずれかの条件を満たす全ハンドラの登録は解除される。
     * * ハンドラが `addOnce()` で登録されていた場合
     * * ハンドラが `add()` で登録される際に `once: true` オプションが与えられていた場合
     * * 関数がtruthyな値を返した場合
     *
     * @param arg ハンドラに与えられる引数
     */
    Trigger.prototype.fire = function (arg) {
        if (!this._handlers || !this._handlers.length)
            return;
        var handlers = this._handlers.concat();
        for (var i = 0; i < handlers.length; i++) {
            var handler = handlers[i];
            if (handler.func.call(handler.owner, arg) || handler.once) {
                var index = this._handlers.indexOf(handler);
                if (index !== -1)
                    this._handlers.splice(index, 1);
            }
        }
        if (this._handlers != null)
            this.length = this._handlers.length;
    };
    Trigger.prototype.contains = function (paramsOrFunc, owner) {
        var condition = typeof paramsOrFunc === "function" ? { func: paramsOrFunc, owner: owner } : paramsOrFunc;
        for (var i = 0; i < this._handlers.length; i++) {
            if (this._comparePartial(condition, this._handlers[i])) {
                return true;
            }
        }
        return false;
    };
    Trigger.prototype.remove = function (paramsOrFunc, owner) {
        var condition = typeof paramsOrFunc === "function" ? { func: paramsOrFunc, owner: owner } : paramsOrFunc;
        for (var i = 0; i < this._handlers.length; i++) {
            var handler = this._handlers[i];
            if (condition.func === handler.func && condition.owner === handler.owner && condition.name === handler.name) {
                this._handlers.splice(i, 1);
                --this.length;
                return;
            }
        }
    };
    /**
     * 指定した条件に部分一致するイベントハンドラを削除する。
     *
     * 本メソッドは引数に与えた条件に一致したイベントハンドラを全て削除する。
     * 引数の条件を一部省略した場合、その値の内容が登録時と異なっていても対象のイベントハンドラは削除される。
     * 引数に与えた条件と完全に一致したイベントハンドラのみを削除したい場合は `this.remove()` を用いる。
     * 引数を省略した場合は全てのイベントハンドラを削除する。
     *
     * @param params 削除するイベントハンドラの条件
     */
    Trigger.prototype.removeAll = function (params) {
        var handlers = [];
        if (params) {
            for (var i = 0; i < this._handlers.length; i++) {
                var handler = this._handlers[i];
                if (!this._comparePartial(params, handler)) {
                    handlers.push(handler);
                }
            }
        }
        this._handlers = handlers;
        this.length = this._handlers.length;
    };
    /**
     * このTriggerを破棄する。
     */
    Trigger.prototype.destroy = function () {
        this._handlers = null;
        this.length = null;
    };
    /**
     * このTriggerが破棄されているかを返す。
     */
    Trigger.prototype.destroyed = function () {
        return this._handlers === null;
    };
    /**
     * @private
     */
    Trigger.prototype._comparePartial = function (target, compare) {
        if (target.func !== undefined && target.func !== compare.func)
            return false;
        if (target.owner !== undefined && target.owner !== compare.owner)
            return false;
        if (target.name !== undefined && target.name !== compare.name)
            return false;
        return true;
    };
    return Trigger;
}());
exports.Trigger = Trigger;

},{}],19:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./Trigger"));
__export(require("./ChainTrigger"));

},{"./ChainTrigger":17,"./Trigger":18}],"@akashic/pdi-common-impl":[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Asset"), exports);
__exportStar(require("./AudioAsset"), exports);
__exportStar(require("./AudioPlayer"), exports);
__exportStar(require("./ExceptionFactory"), exports);
__exportStar(require("./Glyph"), exports);
__exportStar(require("./GlyphFactory"), exports);
__exportStar(require("./ImageAsset"), exports);
__exportStar(require("./PdiCommonUtil"), exports);
__exportStar(require("./Renderer"), exports);
__exportStar(require("./ResourceFactory"), exports);
__exportStar(require("./ScriptAsset"), exports);
__exportStar(require("./Surface"), exports);
__exportStar(require("./TextAsset"), exports);
__exportStar(require("./VectorImageAsset"), exports);
__exportStar(require("./VideoAsset"), exports);
__exportStar(require("./VideoPlayer"), exports);

},{"./Asset":1,"./AudioAsset":2,"./AudioPlayer":3,"./ExceptionFactory":4,"./Glyph":5,"./GlyphFactory":6,"./ImageAsset":7,"./PdiCommonUtil":8,"./Renderer":9,"./ResourceFactory":10,"./ScriptAsset":11,"./Surface":12,"./TextAsset":13,"./VectorImageAsset":14,"./VideoAsset":15,"./VideoPlayer":16}]},{},[]);
