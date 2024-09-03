require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetAccessor = void 0;
/**
 * アセットへのアクセスを提供するアクセッサ群。
 *
 * 実態は `AssetManager` のいくつかのメソッドに対するラッパーである。
 * このクラスにより、パス・アセットID・パターン・フィルタから、対応する読み込み済みアセットを取得できる。
 *
 * 通常、ゲーム開発者はこのクラスのオブジェクトを生成する必要はない。
 * `g.Scene#asset` に代入されている値を利用すればよい。
 */
var AssetAccessor = /** @class */ (function () {
    /**
     * `AssetAccessor` のインスタンスを生成する。
     *
     * @param ラップする `AssetManager`
     */
    function AssetAccessor(assetManager) {
        this._assetManager = assetManager;
    }
    /**
     * パスから読み込み済みの画像アセットを取得する。
     *
     * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
     * 当該の画像アセットが読み込まれていない場合、エラー。
     *
     * @param path 取得する画像アセットのパス
     */
    AssetAccessor.prototype.getImage = function (path) {
        return this._assetManager.peekLiveAssetByAccessorPath(path, "image");
    };
    /**
     * パスから読み込み済みのオーディオアセットを取得する。
     *
     * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
     * さらにオーディオアセットに限り、拡張子を省いたものでなければならない。(e.g. `"/audio/bgm01"`)
     *
     * 当該のオーディオアセットが読み込まれていない場合、エラー。
     *
     * @param path 取得するオーディオアセットのパス
     */
    AssetAccessor.prototype.getAudio = function (path) {
        return this._assetManager.peekLiveAssetByAccessorPath(path, "audio");
    };
    /**
     * パスから読み込み済みのスクリプトアセットを取得する。
     *
     * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
     * 当該のスクリプトアセットが読み込まれていない場合、エラー。
     *
     * @param path 取得するスクリプトアセットのパス
     */
    AssetAccessor.prototype.getScript = function (path) {
        return this._assetManager.peekLiveAssetByAccessorPath(path, "script");
    };
    /**
     * パスから読み込み済みのテキストアセットを取得する。
     *
     * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
     * 当該のテキストアセットが読み込まれていない場合、エラー。
     *
     * @param path 取得するテキストアセットのパス
     */
    AssetAccessor.prototype.getText = function (path) {
        return this._assetManager.peekLiveAssetByAccessorPath(path, "text");
    };
    /**
     * パスから読み込み済みのテキストアセットを取得し、その内容の文字列を返す。
     *
     * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
     * 当該のテキストアセットが読み込まれていない場合、エラー。
     *
     * @param path 内容の文字列を取得するテキストアセットのパス
     */
    AssetAccessor.prototype.getTextContent = function (path) {
        return this.getText(path).data;
    };
    /**
     * パスから読み込み済みのテキストアセットを取得し、その内容をJSONとしてパースした値を返す。
     *
     * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
     * 当該のテキストアセットが読み込まれていない場合、エラー。
     *
     * @param path 内容のJSONを取得するテキストアセットのパス
     */
    AssetAccessor.prototype.getJSONContent = function (path) {
        return JSON.parse(this.getTextContent(path));
    };
    /**
     * パスから読み込み済みのベクタ画像アセットを取得する。
     *
     * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
     * 当該のベクタ画像アセットが読み込まれていない場合、エラー。
     *
     * @param path 取得する画像アセットのパス
     */
    AssetAccessor.prototype.getVectorImage = function (path) {
        return this._assetManager.peekLiveAssetByAccessorPath(path, "vector-image");
    };
    /**
     * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全画像アセットを取得する。
     *
     * ここでパスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスである。
     *
     * パターンは、パス文字列、またはパス中に0個以上の `**`, `*`, `?` を含む文字列である。
     * ここで `**` は0個以上の任意のディレクトリを、 `*` は0個以上の `/` でない文字を、
     * `?` は1個の `/` でない文字を表す。 (e.g. "/images/monsters??/*.png")
     *
     * フィルタは、パスを受け取ってbooleanを返す関数である。
     * フィルタを与えた場合、読み込み済みの全アセットのうち、フィルタが偽でない値を返したものを返す。
     *
     * @param patternOrFilter 取得する画像アセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
     */
    AssetAccessor.prototype.getAllImages = function (patternOrFilter) {
        return this._assetManager.peekAllLiveAssetsByPattern(patternOrFilter !== null && patternOrFilter !== void 0 ? patternOrFilter : "**/*", "image");
    };
    /**
     * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全オーディオアセットを取得する。
     * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
     * ただしオーディオアセットに限り、拡張子を省いたものでなければならない。(e.g. `"/audio/bgm*"`)
     *
     * @param patternOrFilter 取得するオーディオアセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
     */
    AssetAccessor.prototype.getAllAudios = function (patternOrFilter) {
        return this._assetManager.peekAllLiveAssetsByPattern(patternOrFilter !== null && patternOrFilter !== void 0 ? patternOrFilter : "**/*", "audio");
    };
    /**
     * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全スクリプトアセットを取得する。
     * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
     *
     * @param patternOrFilter 取得するスクリプトアセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
     */
    AssetAccessor.prototype.getAllScripts = function (patternOrFilter) {
        return this._assetManager.peekAllLiveAssetsByPattern(patternOrFilter !== null && patternOrFilter !== void 0 ? patternOrFilter : "**/*", "script");
    };
    /**
     * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全テキストアセットを取得する。
     * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
     *
     * @param patternOrFilter 取得するテキストアセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
     */
    AssetAccessor.prototype.getAllTexts = function (patternOrFilter) {
        return this._assetManager.peekAllLiveAssetsByPattern(patternOrFilter !== null && patternOrFilter !== void 0 ? patternOrFilter : "**/*", "text");
    };
    /**
     * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全ベクタ画像アセットを取得する。
     * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
     *
     * @param patternOrFilter 取得するベクタ画像アセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
     */
    AssetAccessor.prototype.getAllVectorImages = function (patternOrFilter) {
        return this._assetManager.peekAllLiveAssetsByPattern(patternOrFilter !== null && patternOrFilter !== void 0 ? patternOrFilter : "**/*", "vector-image");
    };
    /**
     * アセットIDから読み込み済みの画像アセットを取得する。
     * 当該の画像アセットが読み込まれていない場合、エラー。
     *
     * @param assetId 取得する画像アセットのID
     */
    AssetAccessor.prototype.getImageById = function (assetId) {
        return this._assetManager.peekLiveAssetById(assetId, "image");
    };
    /**
     * アセットIDから読み込み済みのオーディオアセットを取得する。
     * 当該のオーディオアセットが読み込まれていない場合、エラー。
     *
     * @param assetId 取得するオーディオアセットのID
     */
    AssetAccessor.prototype.getAudioById = function (assetId) {
        return this._assetManager.peekLiveAssetById(assetId, "audio");
    };
    /**
     * アセットIDから読み込み済みのスクリプトアセットを取得する。
     * 当該のスクリプトアセットが読み込まれていない場合、エラー。
     *
     * @param assetId 取得するスクリプトアセットのID
     */
    AssetAccessor.prototype.getScriptById = function (assetId) {
        return this._assetManager.peekLiveAssetById(assetId, "script");
    };
    /**
     * アセットIDから読み込み済みのテキストアセットを取得する。
     * 当該のテキストアセットが読み込まれていない場合、エラー。
     *
     * @param assetId 取得するテキストアセットのID
     */
    AssetAccessor.prototype.getTextById = function (assetId) {
        return this._assetManager.peekLiveAssetById(assetId, "text");
    };
    /**
     * アセットIDから読み込み済みのテキストアセットを取得し、その内容の文字列を返す。
     * 当該のテキストアセットが読み込まれていない場合、エラー。
     *
     * @param assetId 内容の文字列を取得するテキストアセットのID
     */
    AssetAccessor.prototype.getTextContentById = function (assetId) {
        return this.getTextById(assetId).data;
    };
    /**
     * アセットIDから読み込み済みのテキストアセットを取得し、その内容をJSONとしてパースして返す。
     * 当該のテキストアセットが読み込まれていない場合、エラー。
     *
     * @param assetId 内容のJSONを取得するテキストアセットのID
     */
    AssetAccessor.prototype.getJSONContentById = function (assetId) {
        return JSON.parse(this.getTextById(assetId).data);
    };
    /**
     * アセットIDから読み込み済みのベクタ画像アセットを取得する。
     * 当該のベクタ画像アセットが読み込まれていない場合、エラー。
     *
     * @param assetId 取得するベクタ画像アセットのID
     */
    AssetAccessor.prototype.getVectorImageById = function (assetId) {
        return this._assetManager.peekLiveAssetById(assetId, "vector-image");
    };
    return AssetAccessor;
}());
exports.AssetAccessor = AssetAccessor;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetHolder = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
/**
 * シーンのアセットの読み込みと破棄を管理するクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 */
var AssetHolder = /** @class */ (function () {
    function AssetHolder(param) {
        var assetManager = param.assetManager;
        var assetIds = param.assetIds ? param.assetIds.concat() : [];
        assetIds.push.apply(assetIds, assetManager.resolvePatternsToAssetIds(param.assetPaths || []));
        this.waitingAssetsCount = assetIds.length;
        this.userData = param.userData;
        this._assetManager = assetManager;
        this._assetIds = assetIds;
        this._assets = [];
        this._handlerSet = param.handlerSet;
        this._requested = false;
    }
    AssetHolder.prototype.request = function () {
        if (this.waitingAssetsCount === 0)
            return false;
        if (this._requested)
            return true;
        this._requested = true;
        this._assetManager.requestAssets(this._assetIds, this);
        return true;
    };
    AssetHolder.prototype.destroy = function () {
        if (this._requested) {
            this._assetManager.unrefAssets(this._assets);
        }
        this.waitingAssetsCount = 0;
        this.userData = undefined;
        this._handlerSet = undefined;
        this._assetIds = undefined;
        this._requested = false;
    };
    AssetHolder.prototype.destroyed = function () {
        return !this._handlerSet;
    };
    /**
     * @private
     */
    AssetHolder.prototype._onAssetError = function (asset, error) {
        var hs = this._handlerSet;
        if (this.destroyed() || hs.owner.destroyed())
            return;
        var failureInfo = {
            asset: asset,
            error: error,
            cancelRetry: false
        };
        hs.handleLoadFailure.call(hs.owner, failureInfo);
        if (error.retriable && !failureInfo.cancelRetry) {
            this._assetManager.retryLoad(asset);
        }
        else {
            // game.json に定義されていればゲームを止める。それ以外 (DynamicAsset) では続行。
            if (this._assetManager.configuration[asset.id]) {
                hs.handleFinish.call(hs.owner, this, false);
            }
        }
    };
    /**
     * @private
     */
    AssetHolder.prototype._onAssetLoad = function (asset) {
        var hs = this._handlerSet;
        if (this.destroyed() || hs.owner.destroyed())
            return;
        hs.handleLoad.call(hs.owner, asset);
        this._assets.push(asset);
        --this.waitingAssetsCount;
        if (this.waitingAssetsCount > 0)
            return;
        if (this.waitingAssetsCount < 0)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetHolder#_onAssetLoad: broken waitingAssetsCount");
        hs.handleFinish.call(hs.owner, this, true);
    };
    return AssetHolder;
}());
exports.AssetHolder = AssetHolder;

},{"./ExceptionFactory":23}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManager = void 0;
var EmptyVectorImageAsset_1 = require("./auxiliary/EmptyVectorImageAsset");
var PartialImageAsset_1 = require("./auxiliary/PartialImageAsset");
var ExceptionFactory_1 = require("./ExceptionFactory");
var VideoSystem_1 = require("./VideoSystem");
/**
 * @ignore
 */
var AssetLoadingInfo = /** @class */ (function () {
    function AssetLoadingInfo(asset, handler) {
        this.asset = asset;
        this.handlers = [handler];
        this.errorCount = 0;
        this.loading = false;
    }
    return AssetLoadingInfo;
}());
function normalizeAudioSystemConfMap(confMap) {
    if (confMap === void 0) { confMap = {}; }
    var systemDefaults = {
        music: {
            loop: true,
            hint: { streaming: true }
        },
        sound: {
            loop: false,
            hint: { streaming: false }
        }
    };
    for (var key in systemDefaults) {
        if (!(key in confMap)) {
            confMap[key] = systemDefaults[key];
        }
    }
    return confMap;
}
function normalizeCommonArea(area) {
    return Array.isArray(area) ? { x: area[0], y: area[1], width: area[2], height: area[3] } : area;
}
/**
 * パスパターンを関数に変換する。
 *
 * パスパターンは、パス文字列、または0個以上の `**`, `*`, `?` を含むパス文字列である。
 * (実装の単純化のため、いわゆる glob のうちよく使われそうなものだけをサポートしている。)
 * 詳細は `AssetAccessor#getAllImages()` の仕様を参照のこと。
 *
 * 戻り値は、文字列一つを受け取り、パターンにマッチするか否かを返す関数。
 *
 * @param pattern パターン文字列
 */
function patternToFilter(pattern) {
    var parserRe = /([^\*\\\?]*)(\\\*|\\\?|\?|\*(?!\*)|\*\*\/|$)/g;
    //                [----A-----][--------------B---------------]
    // A: パターンの特殊文字でない文字の塊。そのままマッチさせる(ためにエスケープして正規表現にする)
    // B: パターンの特殊文字一つ(*, ** など)かそのエスケープ。patternSpecialsTable で対応する正規表現に変換
    var patternSpecialsTable = {
        "": "",
        "\\*": "\\*",
        "\\?": "\\?",
        "*": "[^/]*",
        "?": "[^/]",
        "**/": "(?:^/)?(?:[^/]+/)*"
        //      [--C--][----D----]
        // C: 行頭の `/` (行頭でなければないので ? つき)
        // D: ディレクトリ一つ分(e.g. "foo/")が0回以上
    };
    var regExpSpecialsRe = /[\\^$.*+?()[\]{}|]/g;
    function escapeRegExp(s) {
        return s.replace(regExpSpecialsRe, "\\$&");
    }
    var code = "";
    for (var match = parserRe.exec(pattern); match && match[0] !== ""; match = parserRe.exec(pattern)) {
        code += escapeRegExp(match[1]) + patternSpecialsTable[match[2]];
    }
    var re = new RegExp("^" + code + "$");
    return function (path) { return re.test(path); };
}
/**
 * `Asset` を管理するクラス。
 *
 * このクラスのインスタンスは `Game` に一つデフォルトで存在する(デフォルトアセットマネージャ)。
 * デフォルトアセットマネージャは、game.json に記述された通常のアセットを読み込むために利用される。
 *
 * ゲーム開発者は、game.json に記述のないリソースを取得するために、このクラスのインスタンスを独自に生成してよい。
 */
var AssetManager = /** @class */ (function () {
    /**
     * `AssetManager` のインスタンスを生成する。
     *
     * @param gameParams このインスタンスが属するゲーム。
     * @param conf このアセットマネージャに与えるアセット定義。game.json の `"assets"` に相当。
     * @param audioSystemConfMap このアセットマネージャに与えるオーディオシステムの宣言。
     * @param moduleMainScripts このアセットマネージャに与える require() 解決用のエントリポイント。
     */
    function AssetManager(gameParams, conf, audioSystemConfMap, moduleMainScripts) {
        this._resourceFactory = gameParams.resourceFactory;
        this._audioSystemManager = gameParams.audio;
        this._defaultAudioSystemId = gameParams.defaultAudioSystemId;
        this.configuration = this._normalize(conf || {}, normalizeAudioSystemConfMap(audioSystemConfMap));
        this._assets = {};
        this._virtualPathToIdTable = {};
        this._liveAssetVirtualPathTable = {};
        this._liveAssetPathTable = {};
        this._moduleMainScripts = moduleMainScripts ? moduleMainScripts : {};
        this._refCounts = {};
        this._loadings = {};
        var assetIds = Object.keys(this.configuration);
        for (var i = 0; i < assetIds.length; ++i) {
            var assetId = assetIds[i];
            var conf_1 = this.configuration[assetId];
            this._virtualPathToIdTable[conf_1.virtualPath] = assetId; // virtualPath の存在は _normalize() で確認済みのため 非 null アサーションとする
        }
    }
    /**
     * このインスタンスを破棄する。
     */
    AssetManager.prototype.destroy = function () {
        var assetIds = Object.keys(this._refCounts);
        for (var i = 0; i < assetIds.length; ++i) {
            this._releaseAsset(assetIds[i]);
        }
        this.configuration = undefined;
        this._assets = undefined;
        this._liveAssetVirtualPathTable = undefined;
        this._liveAssetPathTable = undefined;
        this._refCounts = undefined;
        this._loadings = undefined;
    };
    /**
     * このインスタンスが破棄済みであるかどうかを返す。
     */
    AssetManager.prototype.destroyed = function () {
        return this._assets === undefined;
    };
    /**
     * `Asset` の読み込みを再試行する。
     *
     * 引数 `asset` は読み込みの失敗が (`Scene#assetLoadFail` で) 通知されたアセットでなければならない。
     * @param asset 読み込みを再試行するアセット
     */
    AssetManager.prototype.retryLoad = function (asset) {
        if (!this._loadings.hasOwnProperty(asset.id))
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#retryLoad: invalid argument.");
        var loadingInfo = this._loadings[asset.id];
        if (loadingInfo.errorCount > AssetManager.MAX_ERROR_COUNT) {
            // DynamicAsset はエラーが規定回数超えた場合は例外にせず諦める。
            if (!this.configuration[asset.id])
                return;
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#retryLoad: too many retrying.");
        }
        if (!loadingInfo.loading) {
            loadingInfo.loading = true;
            asset._load(this);
        }
    };
    /**
     * グローバルアセットのIDを全て返す。
     */
    AssetManager.prototype.globalAssetIds = function () {
        var ret = [];
        var conf = this.configuration;
        for (var p in conf) {
            if (!conf.hasOwnProperty(p))
                continue;
            if (conf[p].global)
                ret.push(p);
        }
        return ret;
    };
    /**
     * パターンまたはフィルタに合致するパスを持つアセットIDを全て返す。
     *
     * 戻り値は読み込み済みでないアセットのIDを含むことに注意。
     * 読み込み済みのアセットにアクセスする場合は、 `peekAllLiveAssetsByPattern()` を利用すること。
     *
     * @param patternOrFilters パターンまたはフィルタ。仕様は `AssetAccessor#getAllImages()` を参照
     */
    AssetManager.prototype.resolvePatternsToAssetIds = function (patternOrFilters) {
        if (patternOrFilters.length === 0)
            return [];
        var vpaths = Object.keys(this._virtualPathToIdTable);
        var ret = [];
        for (var i = 0; i < patternOrFilters.length; ++i) {
            var patternOrFilter = patternOrFilters[i];
            var filter = typeof patternOrFilter === "string" ? patternToFilter(this._replaceModulePathToAbsolute(patternOrFilter)) : patternOrFilter;
            for (var j = 0; j < vpaths.length; ++j) {
                var vpath = vpaths[j];
                var accessorPath = "/" + vpath; // virtualPath に "/" を足すと accessorPath という仕様
                if (filter(accessorPath))
                    ret.push(this._virtualPathToIdTable[vpath]);
            }
        }
        return ret;
    };
    /**
     * アセットの取得を要求する。
     *
     * 要求したアセットが読み込み済みでない場合、読み込みが行われる。
     * 取得した結果は `handler` を通して通知される。
     * ゲーム開発者はこのメソッドを呼び出してアセットを取得した場合、
     * 同じアセットID(または取得したアセット)で `unrefAsset()` を呼び出さなければならない。
     *
     * @param assetIdOrConf 要求するアセットのIDまたは設定
     * @param handler 要求結果を受け取るハンドラ
     */
    AssetManager.prototype.requestAsset = function (assetIdOrConf, handler) {
        var assetId = typeof assetIdOrConf === "string" ? assetIdOrConf : assetIdOrConf.id;
        var waiting = false;
        var loadingInfo;
        if (this._assets.hasOwnProperty(assetId)) {
            ++this._refCounts[assetId];
            handler._onAssetLoad(this._assets[assetId]);
        }
        else if (this._loadings.hasOwnProperty(assetId)) {
            loadingInfo = this._loadings[assetId];
            loadingInfo.handlers.push(handler);
            ++this._refCounts[assetId];
            waiting = true;
        }
        else {
            var system = this._getAudioSystem(assetIdOrConf);
            var audioAsset = system === null || system === void 0 ? void 0 : system.getDestroyRequestedAsset(assetId);
            if (system && audioAsset) {
                system.cancelRequestDestroy(audioAsset);
                this._addAssetToTables(audioAsset);
                this._refCounts[assetId] = 1;
                handler._onAssetLoad(audioAsset);
            }
            else {
                var a = this._createAssetFor(assetIdOrConf);
                loadingInfo = new AssetLoadingInfo(a, handler);
                this._loadings[assetId] = loadingInfo;
                this._refCounts[assetId] = 1;
                waiting = true;
                loadingInfo.loading = true;
                a._load(this);
            }
        }
        return waiting;
    };
    /**
     * アセットの参照カウントを減らす。
     * 引数の各要素で `unrefAsset()` を呼び出す。
     *
     * @param assetOrId 参照カウントを減らすアセットまたはアセットID
     */
    AssetManager.prototype.unrefAsset = function (assetOrId) {
        var assetId = typeof assetOrId === "string" ? assetOrId : assetOrId.id;
        if (--this._refCounts[assetId] > 0)
            return;
        this._releaseAsset(assetId);
    };
    /**
     * 複数のアセットの取得を要求する。
     * 引数の各要素で `requestAsset()` を呼び出す。
     *
     * @param assetIdOrConfs 取得するアセットのIDまたはアセット定義
     * @param handler 取得の結果を受け取るハンドラ
     */
    AssetManager.prototype.requestAssets = function (assetIdOrConfs, handler) {
        var waitingCount = 0;
        for (var i = 0, len = assetIdOrConfs.length; i < len; ++i) {
            if (this.requestAsset(assetIdOrConfs[i], handler)) {
                ++waitingCount;
            }
        }
        return waitingCount;
    };
    /**
     * 複数のアセットを解放する。
     * 引数の各要素で `unrefAsset()` を呼び出す。
     *
     * @param assetOrIds 参照カウントを減らすアセットまたはアセットID
     * @private
     */
    AssetManager.prototype.unrefAssets = function (assetOrIds) {
        for (var i = 0, len = assetOrIds.length; i < len; ++i) {
            this.unrefAsset(assetOrIds[i]);
        }
    };
    /**
     * アクセッサパスで指定された読み込み済みのアセットを返す。
     *
     * ここでアクセッサパスとは、 `AssetAccessor` が使うパス
     * (game.jsonのディレクトリをルート (`/`) とする、 `/` 区切りの絶対パス形式の仮想パス)である。
     * これは `/` を除けばアセットの仮想パス (virtualPath) と同一である。
     *
     * @param accessorPath 取得するアセットのアクセッサパス
     * @param type 取得するアセットのタイプ。対象のアセットと合致しない場合、エラー
     */
    AssetManager.prototype.peekLiveAssetByAccessorPath = function (accessorPath, type) {
        accessorPath = this._replaceModulePathToAbsolute(accessorPath);
        if (accessorPath[0] !== "/")
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#peekLiveAssetByAccessorPath(): accessorPath must start with '/'");
        var vpath = accessorPath.slice(1); // accessorPath から "/" を削ると virtualPath という仕様
        var asset = this._liveAssetVirtualPathTable[vpath];
        if (!asset || type !== asset.type)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#peekLiveAssetByAccessorPath(): No ".concat(type, " asset for ").concat(accessorPath));
        return asset;
    };
    /**
     * アセットIDで指定された読み込み済みのアセットを返す。
     *
     * @param assetId 取得するアセットのID
     * @param type 取得するアセットのタイプ。対象のアセットと合致しない場合、エラー
     */
    AssetManager.prototype.peekLiveAssetById = function (assetId, type) {
        var asset = this._assets[assetId];
        if (!asset || type !== asset.type)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("SceneAssetManager#_getById(): No ".concat(type, " asset for id ").concat(assetId));
        return asset;
    };
    /**
     * パターンまたはフィルタにマッチするパスを持つ、指定されたタイプの全読み込み済みアセットを返す。
     *
     * 戻り値の要素の順序は保証されない。
     * パターンとフィルタについては `AssetAccessor#getAllImages()` の仕様を参照のこと。
     *
     * @param patternOrFilter 取得するアセットのパスパターンまたはフィルタ
     * @param type 取得するアセットのタイプ。 null の場合、全てのタイプとして扱われる。
     */
    AssetManager.prototype.peekAllLiveAssetsByPattern = function (patternOrFilter, type) {
        var vpaths = Object.keys(this._liveAssetVirtualPathTable);
        var filter = typeof patternOrFilter === "string" ? patternToFilter(this._replaceModulePathToAbsolute(patternOrFilter)) : patternOrFilter;
        var ret = [];
        for (var i = 0; i < vpaths.length; ++i) {
            var vpath = vpaths[i];
            var asset = this._liveAssetVirtualPathTable[vpath];
            if (type && asset.type !== type)
                continue;
            var accessorPath = "/" + vpath; // virtualPath に "/" を足すと accessorPath という仕様
            if (filter(accessorPath))
                ret.push(asset);
        }
        return ret;
    };
    /**
     * @ignore
     */
    AssetManager.prototype._normalize = function (configuration, audioSystemConfMap) {
        var ret = {};
        if (!(configuration instanceof Object))
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: invalid arguments.");
        for (var p in configuration) {
            if (!configuration.hasOwnProperty(p))
                continue;
            var conf = Object.create(configuration[p]);
            if (!conf.path) {
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: No path given for: " + p);
            }
            if (!conf.virtualPath) {
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: No virtualPath given for: " + p);
            }
            if (!conf.type) {
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: No type given for: " + p);
            }
            if (conf.type === "image") {
                if (typeof conf.width !== "number")
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong width given for the image asset: " + p);
                if (typeof conf.height !== "number")
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong height given for the image asset: " + p);
                conf.slice = conf.slice ? normalizeCommonArea(conf.slice) : undefined;
            }
            if (conf.type === "audio") {
                // durationというメンバは後から追加したため、古いgame.jsonではundefinedになる場合がある
                if (conf.duration === undefined)
                    conf.duration = 0;
                var audioSystemConf = audioSystemConfMap[conf.systemId];
                if (conf.loop === undefined) {
                    conf.loop = !!audioSystemConf && !!audioSystemConf.loop;
                }
                if (conf.hint === undefined) {
                    conf.hint = audioSystemConf ? audioSystemConf.hint : {};
                }
                if (conf.systemId !== "music" && conf.systemId !== "sound") {
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong systemId given for the audio asset: " + p);
                }
            }
            if (conf.type === "video") {
                if (!conf.useRealSize) {
                    if (typeof conf.width !== "number")
                        throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong width given for the video asset: " + p);
                    if (typeof conf.height !== "number")
                        throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong height given for the video asset: " + p);
                    conf.useRealSize = false;
                }
            }
            if (conf.type === "vector-image") {
                if (typeof conf.width !== "number")
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong width given for the vector-image asset: " + p);
                if (typeof conf.height !== "number")
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong height given for the vector-image asset: " + p);
            }
            if (!conf.global)
                conf.global = false;
            ret[p] = conf;
        }
        return ret;
    };
    /**
     * @private
     */
    AssetManager.prototype._createAssetFor = function (idOrConf) {
        var id;
        var uri;
        var conf;
        if (typeof idOrConf === "string") {
            id = idOrConf;
            conf = this.configuration[id];
            uri = this.configuration[id].path;
        }
        else {
            var dynConf = idOrConf;
            id = dynConf.id;
            conf = dynConf;
            uri = dynConf.uri;
        }
        var resourceFactory = this._resourceFactory;
        if (!conf)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_createAssetFor: unknown asset ID: " + id);
        switch (conf.type) {
            case "image":
                var asset = conf.slice
                    ? new PartialImageAsset_1.PartialImageAsset(resourceFactory, id, uri, conf.width, conf.height, conf.slice) // _normalize() で CommonArea になっている
                    : resourceFactory.createImageAsset(id, uri, conf.width, conf.height);
                asset.initialize(conf.hint);
                return asset;
            case "audio":
                var system = conf.systemId
                    ? this._audioSystemManager[conf.systemId]
                    : this._audioSystemManager[this._defaultAudioSystemId];
                return resourceFactory.createAudioAsset(id, uri, conf.duration, system, !!conf.loop, conf.hint);
            case "text":
                return resourceFactory.createTextAsset(id, uri);
            case "script":
                return resourceFactory.createScriptAsset(id, uri);
            case "video":
                // VideoSystemはまだ中身が定義されていなが、将来のためにVideoAssetにVideoSystemを渡すという体裁だけが整えられている。
                // 以上を踏まえ、ここでは簡単のために都度新たなVideoSystemインスタンスを生成している。
                var videoSystem = new VideoSystem_1.VideoSystem();
                return resourceFactory.createVideoAsset(id, uri, conf.width, conf.height, videoSystem, !!conf.loop, !!conf.useRealSize);
            case "vector-image":
                if (!resourceFactory.createVectorImageAsset) {
                    return new EmptyVectorImageAsset_1.EmptyVectorImageAsset(id, uri, conf.width, conf.height, conf.hint);
                }
                return resourceFactory.createVectorImageAsset(id, uri, conf.width, conf.height, conf.hint);
            default:
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssertionError#_createAssetFor: unknown asset type " + conf.type + " for asset ID: " + id);
        }
    };
    /**
     * @ignore
     */
    AssetManager.prototype._releaseAsset = function (assetId) {
        var asset = this._assets[assetId] || (this._loadings[assetId] && this._loadings[assetId].asset);
        var path = null;
        if (asset) {
            path = asset.path;
            if (asset.inUse()) {
                if (asset.type === "audio") {
                    asset._system.requestDestroy(asset);
                }
                else if (asset.type === "video") {
                    // NOTE: 一旦再生完了を待たずに破棄することにする
                    // TODO: 再生中の動画を破棄するタイミングをどのように扱うか検討し実装
                    asset.destroy();
                }
                else {
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#unrefAssets: Unsupported in-use " + asset.id);
                }
            }
            else {
                asset.destroy();
            }
        }
        delete this._refCounts[assetId];
        delete this._loadings[assetId];
        delete this._assets[assetId];
        if (this.configuration[assetId]) {
            var virtualPath = this.configuration[assetId].virtualPath;
            if (virtualPath && this._liveAssetVirtualPathTable.hasOwnProperty(virtualPath))
                delete this._liveAssetVirtualPathTable[virtualPath];
            if (path && this._liveAssetPathTable.hasOwnProperty(path))
                delete this._liveAssetPathTable[path];
        }
    };
    /**
     * 現在ロード中のアセットの数。(デバッグ用; 直接の用途はない)
     * @private
     */
    AssetManager.prototype._countLoadingAsset = function () {
        return Object.keys(this._loadings).length;
    };
    /**
     * @private
     */
    AssetManager.prototype._onAssetError = function (asset, error) {
        // ロード中に Scene が破棄されていた場合などで、asset が破棄済みになることがある
        if (this.destroyed() || asset.destroyed())
            return;
        var loadingInfo = this._loadings[asset.id];
        var hs = loadingInfo.handlers;
        loadingInfo.loading = false;
        ++loadingInfo.errorCount;
        if (loadingInfo.errorCount > AssetManager.MAX_ERROR_COUNT && error.retriable) {
            error = ExceptionFactory_1.ExceptionFactory.createAssetLoadError("Retry limit exceeded", false, null, error);
        }
        if (!error.retriable)
            delete this._loadings[asset.id];
        for (var i = 0; i < hs.length; ++i)
            hs[i]._onAssetError(asset, error, this.retryLoad.bind(this));
    };
    /**
     * @private
     */
    AssetManager.prototype._onAssetLoad = function (asset) {
        // ロード中に Scene が破棄されていた場合などで、asset が破棄済みになることがある
        if (this.destroyed() || asset.destroyed())
            return;
        var loadingInfo = this._loadings[asset.id];
        loadingInfo.loading = false;
        delete this._loadings[asset.id];
        this._addAssetToTables(asset);
        var hs = loadingInfo.handlers;
        for (var i = 0; i < hs.length; ++i)
            hs[i]._onAssetLoad(asset);
    };
    /**
     * @private
     */
    AssetManager.prototype._replaceModulePathToAbsolute = function (accessorPath) {
        if (accessorPath[0] === "/" ||
            accessorPath[0] === "*" // パスに `**/*` が指定された場合
        ) {
            return accessorPath;
        }
        for (var moduleName in this._moduleMainScripts) {
            if (!this._moduleMainScripts.hasOwnProperty(moduleName))
                continue;
            if (accessorPath.lastIndexOf(moduleName, 0) === 0) {
                return "/node_modules/" + accessorPath;
            }
        }
        return accessorPath;
    };
    /**
     * @private
     */
    AssetManager.prototype._getAudioSystem = function (assetIdOrConf) {
        var conf;
        if (typeof assetIdOrConf === "string") {
            conf = this.configuration[assetIdOrConf];
        }
        else {
            var dynConf = assetIdOrConf;
            conf = dynConf;
        }
        if (!conf) {
            return null;
        }
        if (conf.type !== "audio") {
            return null;
        }
        return conf.systemId ? this._audioSystemManager[conf.systemId] : this._audioSystemManager[this._defaultAudioSystemId];
    };
    /**
     * @private
     */
    AssetManager.prototype._addAssetToTables = function (asset) {
        this._assets[asset.id] = asset;
        // DynamicAsset の場合は configuration に書かれていないので以下の判定が偽になる
        if (this.configuration[asset.id]) {
            var virtualPath = this.configuration[asset.id].virtualPath; // virtualPath の存在は _normalize() で確認済みのため 非 null アサーションとする
            if (!this._liveAssetVirtualPathTable.hasOwnProperty(virtualPath)) {
                this._liveAssetVirtualPathTable[virtualPath] = asset;
            }
            else {
                if (this._liveAssetVirtualPathTable[virtualPath].path !== asset.path)
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AssetManager#_onAssetLoad(): duplicated asset path");
            }
            if (!this._liveAssetPathTable.hasOwnProperty(asset.path))
                this._liveAssetPathTable[asset.path] = virtualPath;
        }
    };
    AssetManager.MAX_ERROR_COUNT = 3;
    return AssetManager;
}());
exports.AssetManager = AssetManager;

},{"./ExceptionFactory":23,"./VideoSystem":65,"./auxiliary/EmptyVectorImageAsset":68,"./auxiliary/PartialImageAsset":69}],5:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],6:[function(require,module,exports){
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
exports.SoundAudioSystem = exports.MusicAudioSystem = exports.AudioSystem = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
var AudioSystem = /** @class */ (function () {
    function AudioSystem(param) {
        this.id = param.id;
        this._volume = param.volume || 1;
        this._destroyRequestedAssets = {};
        this._explicitMuted = param.muted || false;
        this._suppressed = false;
        this._muted = false;
        this._resourceFactory = param.resourceFactory;
        this._updateMuted();
    }
    Object.defineProperty(AudioSystem.prototype, "volume", {
        // volumeの変更時には通知が必要なのでアクセサを使う。
        // 呼び出し頻度が少ないため許容。
        get: function () {
            return this._volume;
        },
        set: function (value) {
            if (value < 0 || value > 1 || isNaN(value) || typeof value !== "number")
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AudioSystem#volume: expected: 0.0-1.0, actual: " + value);
            this._volume = value;
            this._onVolumeChanged();
        },
        enumerable: false,
        configurable: true
    });
    AudioSystem.prototype.requestDestroy = function (asset) {
        this._destroyRequestedAssets[asset.id] = asset;
    };
    /**
     * `this.requestDestroy()` により破棄要求されているアセットの破棄を取り消す。
     * @param asset アセット。
     */
    // NOTE: akashic-engine の独自仕様
    AudioSystem.prototype.cancelRequestDestroy = function (asset) {
        delete this._destroyRequestedAssets[asset.id];
    };
    /**
     * `this.requestDestroy()` により破棄要求されていて、まだ実際には破棄されていないアセット。
     * 対象のアセットが破棄要求されていなければ `null` を返す。
     * @param assetId アセットID。
     */
    // NOTE: akashic-engine の独自仕様
    AudioSystem.prototype.getDestroyRequestedAsset = function (assetId) {
        if (this._destroyRequestedAssets.hasOwnProperty(assetId)) {
            return this._destroyRequestedAssets[assetId];
        }
        return null;
    };
    /**
     * @private
     */
    AudioSystem.prototype._reset = function () {
        this.stopAll();
        this._volume = 1;
        this._destroyRequestedAssets = {};
        this._muted = false;
        this._suppressed = false;
        this._explicitMuted = false;
    };
    /**
     * @private
     */
    AudioSystem.prototype._setMuted = function (value) {
        var before = this._explicitMuted;
        this._explicitMuted = !!value;
        if (this._explicitMuted !== before) {
            this._updateMuted();
            this._onMutedChanged();
        }
    };
    /**
     * @private
     */
    AudioSystem.prototype._setPlaybackRate = function (value) {
        if (value < 0 || isNaN(value) || typeof value !== "number")
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("AudioSystem#playbackRate: expected: greater or equal to 0.0, actual: " + value);
        this._suppressed = value !== 1.0;
        this._updateMuted();
    };
    /**
     * @private
     */
    AudioSystem.prototype._updateMuted = function () {
        this._muted = this._explicitMuted || this._suppressed;
    };
    return AudioSystem;
}());
exports.AudioSystem = AudioSystem;
var MusicAudioSystem = /** @class */ (function (_super) {
    __extends(MusicAudioSystem, _super);
    function MusicAudioSystem(param) {
        var _this = _super.call(this, param) || this;
        _this._player = undefined;
        return _this;
    }
    Object.defineProperty(MusicAudioSystem.prototype, "player", {
        // Note: 音楽のないゲームの場合に無駄なインスタンスを作るのを避けるため、アクセサを使う
        get: function () {
            if (!this._player) {
                this._player = this._resourceFactory.createAudioPlayer(this);
                this._player.onPlay.add(this._handlePlay, this);
                this._player.onStop.add(this._handleStop, this);
            }
            return this._player;
        },
        set: function (v) {
            this._player = v;
        },
        enumerable: false,
        configurable: true
    });
    MusicAudioSystem.prototype.findPlayers = function (asset) {
        if (this.player.currentAudio && this.player.currentAudio.id === asset.id)
            return [this.player];
        return [];
    };
    MusicAudioSystem.prototype.createPlayer = function () {
        return this.player;
    };
    MusicAudioSystem.prototype.stopAll = function () {
        if (!this._player)
            return;
        this._player.stop();
    };
    /**
     * @private
     */
    MusicAudioSystem.prototype._reset = function () {
        _super.prototype._reset.call(this);
        if (this._player) {
            this._player.onPlay.remove(this._handlePlay, this);
            this._player.onStop.remove(this._handleStop, this);
        }
        this._player = undefined;
    };
    /**
     * @private
     */
    MusicAudioSystem.prototype._onVolumeChanged = function () {
        this.player._notifyVolumeChanged();
    };
    /**
     * @private
     */
    MusicAudioSystem.prototype._onMutedChanged = function () {
        this.player._changeMuted(this._muted);
    };
    /**
     * @private
     */
    MusicAudioSystem.prototype._setPlaybackRate = function (rate) {
        _super.prototype._setPlaybackRate.call(this, rate);
        this.player._changeMuted(this._muted);
    };
    /**
     * @private
     */
    MusicAudioSystem.prototype._handlePlay = function (e) {
        if (e.player !== this._player)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("MusicAudioSystem#_onPlayerPlayed: unexpected audio player");
    };
    /**
     * @private
     */
    MusicAudioSystem.prototype._handleStop = function (e) {
        if (this._destroyRequestedAssets[e.audio.id]) {
            delete this._destroyRequestedAssets[e.audio.id];
            e.audio.destroy();
        }
    };
    return MusicAudioSystem;
}(AudioSystem));
exports.MusicAudioSystem = MusicAudioSystem;
var SoundAudioSystem = /** @class */ (function (_super) {
    __extends(SoundAudioSystem, _super);
    function SoundAudioSystem(param) {
        var _this = _super.call(this, param) || this;
        _this.players = [];
        return _this;
    }
    SoundAudioSystem.prototype.createPlayer = function () {
        var player = this._resourceFactory.createAudioPlayer(this);
        if (player.canHandleStopped())
            this.players.push(player);
        player.onPlay.add(this._handlePlay, this);
        player.onStop.add(this._handleStop, this);
        return player;
    };
    SoundAudioSystem.prototype.findPlayers = function (asset) {
        var ret = [];
        for (var i = 0; i < this.players.length; ++i) {
            var currentAudio = this.players[i].currentAudio;
            if (currentAudio && currentAudio.id === asset.id)
                ret.push(this.players[i]);
        }
        return ret;
    };
    SoundAudioSystem.prototype.stopAll = function () {
        var players = this.players.concat();
        for (var i = 0; i < players.length; ++i) {
            players[i].stop(); // auto remove
        }
    };
    /**
     * @private
     */
    SoundAudioSystem.prototype._reset = function () {
        _super.prototype._reset.call(this);
        for (var i = 0; i < this.players.length; ++i) {
            var player = this.players[i];
            player.onPlay.remove(this._handlePlay, this);
            player.onStop.remove(this._handleStop, this);
        }
        this.players = [];
    };
    /**
     * @private
     */
    SoundAudioSystem.prototype._onMutedChanged = function () {
        var players = this.players;
        for (var i = 0; i < players.length; ++i) {
            players[i]._changeMuted(this._muted);
        }
    };
    /**
     * @private
     */
    SoundAudioSystem.prototype._setPlaybackRate = function (rate) {
        _super.prototype._setPlaybackRate.call(this, rate);
        var players = this.players;
        if (this._suppressed) {
            for (var i = 0; i < players.length; ++i) {
                players[i]._changeMuted(true);
            }
        }
    };
    /**
     * @private
     */
    SoundAudioSystem.prototype._handlePlay = function (_e) {
        // do nothing
    };
    /**
     * @private
     */
    SoundAudioSystem.prototype._handleStop = function (e) {
        var index = this.players.indexOf(e.player);
        if (index < 0)
            return;
        e.player.onStop.remove(this._handleStop, this);
        this.players.splice(index, 1);
        if (this._destroyRequestedAssets[e.audio.id]) {
            delete this._destroyRequestedAssets[e.audio.id];
            e.audio.destroy();
        }
    };
    /**
     * @private
     */
    SoundAudioSystem.prototype._onVolumeChanged = function () {
        for (var i = 0; i < this.players.length; ++i) {
            this.players[i]._notifyVolumeChanged();
        }
    };
    return SoundAudioSystem;
}(AudioSystem));
exports.SoundAudioSystem = SoundAudioSystem;

},{"./ExceptionFactory":23}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioSystemManager = void 0;
var AudioSystem_1 = require("./AudioSystem");
/**
 * `AudioSystem` の管理クラス。
 *
 * 複数の `AudioSystem` に一括で必要な状態設定を行う。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 */
var AudioSystemManager = /** @class */ (function () {
    function AudioSystemManager(resourceFactory) {
        this._muted = false;
        this._initializeAudioSystems(resourceFactory);
    }
    /**
     * @private
     */
    AudioSystemManager.prototype._reset = function () {
        this._muted = false;
        this.music._reset();
        this.sound._reset();
    };
    /**
     * @private
     */
    AudioSystemManager.prototype._setMuted = function (muted) {
        if (this._muted === muted)
            return;
        this._muted = muted;
        this.music._setMuted(muted);
        this.sound._setMuted(muted);
    };
    /**
     * @private
     */
    AudioSystemManager.prototype._setPlaybackRate = function (rate) {
        this.music._setPlaybackRate(rate);
        this.sound._setPlaybackRate(rate);
    };
    /**
     * @private
     */
    AudioSystemManager.prototype._initializeAudioSystems = function (resourceFactory) {
        this.music = new AudioSystem_1.MusicAudioSystem({
            id: "music",
            muted: this._muted,
            resourceFactory: resourceFactory
        });
        this.sound = new AudioSystem_1.SoundAudioSystem({
            id: "sound",
            muted: this._muted,
            resourceFactory: resourceFactory
        });
    };
    AudioSystemManager.prototype.stopAll = function () {
        this.music.stopAll();
        this.sound.stopAll();
    };
    return AudioSystemManager;
}());
exports.AudioSystemManager = AudioSystemManager;

},{"./AudioSystem":6}],8:[function(require,module,exports){
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
exports.BitmapFont = void 0;
var Font_1 = require("./Font");
var SurfaceUtil_1 = require("./SurfaceUtil");
/**
 * ラスタ画像によるフォント。
 */
var BitmapFont = /** @class */ (function (_super) {
    __extends(BitmapFont, _super);
    /**
     * 各種パラメータを指定して `BitmapFont` のインスタンスを生成する。
     * @param param `BitmapFont` に設定するパラメータ
     */
    function BitmapFont(param) {
        var _this = _super.call(this) || this;
        // @ts-ignore
        _this.surface = SurfaceUtil_1.SurfaceUtil.asSurface(param.src);
        if (param.glyphInfo) {
            _this.map = param.glyphInfo.map;
            _this.defaultGlyphWidth = param.glyphInfo.width;
            _this.defaultGlyphHeight = param.glyphInfo.height;
            _this.missingGlyph = param.glyphInfo.missingGlyph;
            _this.size = param.glyphInfo.height;
        }
        else {
            _this.map = param.map || {};
            _this.defaultGlyphWidth = param.defaultGlyphWidth || 0;
            _this.defaultGlyphHeight = param.defaultGlyphHeight || 0;
            _this.missingGlyph = param.missingGlyph;
            _this.size = param.defaultGlyphHeight || 0;
        }
        return _this;
    }
    /**
     * コードポイントに対応するグリフを返す。
     * @param code コードポイント
     */
    BitmapFont.prototype.glyphForCharacter = function (code) {
        var g = this.map[code] || this.missingGlyph;
        if (!g) {
            return null;
        }
        var w = g.width === undefined ? this.defaultGlyphWidth : g.width;
        var h = g.height === undefined ? this.defaultGlyphHeight : g.height;
        var offsetX = g.offsetX || 0;
        var offsetY = g.offsetY || 0;
        var advanceWidth = g.advanceWidth === undefined ? w : g.advanceWidth;
        var surface = w === 0 || h === 0 ? undefined : this.surface;
        return {
            code: code,
            x: g.x,
            y: g.y,
            width: w,
            height: h,
            surface: surface,
            offsetX: offsetX,
            offsetY: offsetY,
            advanceWidth: advanceWidth,
            isSurfaceValid: true,
            _atlas: null
        };
    };
    /**
     * 利用している `Surface` を破棄した上で、このフォントを破棄する。
     */
    BitmapFont.prototype.destroy = function () {
        if (this.surface && !this.surface.destroyed()) {
            this.surface.destroy();
        }
        this.map = undefined;
    };
    /**
     * 破棄されたオブジェクトかどうかを判定する。
     */
    BitmapFont.prototype.destroyed = function () {
        // mapをfalsy値で作成された場合最初から破棄扱いになるが、仕様とする
        return !this.map;
    };
    return BitmapFont;
}(Font_1.Font));
exports.BitmapFont = BitmapFont;

},{"./Font":24,"./SurfaceUtil":57}],9:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],10:[function(require,module,exports){
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
exports.Camera2D = void 0;
var Object2D_1 = require("./Object2D");
/**
 * 2D世界におけるカメラ。
 */
var Camera2D = /** @class */ (function (_super) {
    __extends(Camera2D, _super);
    /**
     * 指定されたパラメータで `Camera2D` のインスタンスを生成する。
     * @param param 初期化に用いるパラメータのオブジェクト
     */
    function Camera2D(param) {
        var _this = _super.call(this, param) || this;
        _this.local = !!param.local;
        _this.name = param.name;
        _this._modifiedCount = 0;
        return _this;
    }
    /**
     * 与えられたシリアリゼーションでカメラを復元する。
     *
     * @param ser `Camera2D#serialize()` の戻り値
     */
    Camera2D.deserialize = function (ser) {
        var s = ser;
        var ret = new Camera2D(s.param);
        return ret;
    };
    /**
     * カメラ状態の変更をエンジンに通知する。
     *
     * このメソッドの呼び出し後、このカメラのプロパティに対する変更が各 `Renderer` の描画に反映される。
     * ただし逆は真ではない。すなわち、再描画は他の要因によって行われることもある。
     * ゲーム開発者は、このメソッドを呼び出していないことをもって再描画が行われていないことを仮定してはならない。
     *
     * 本メソッドは、このオブジェクトの `Object2D` 由来のプロパティ (`x`, `y`, `angle` など) を変更した場合にも呼びだす必要がある。
     */
    Camera2D.prototype.modified = function () {
        this._modifiedCount = (this._modifiedCount + 1) % 32768;
        if (this._matrix)
            this._matrix._modified = true;
    };
    /**
     * このカメラをシリアライズする。
     *
     * このメソッドの戻り値を `Camera2D#deserialize()` に渡すことで同じ値を持つカメラを復元することができる。
     */
    Camera2D.prototype.serialize = function () {
        var ser = {
            param: {
                local: this.local,
                name: this.name,
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                opacity: this.opacity,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                angle: this.angle,
                anchorX: this.anchorX,
                anchorY: this.anchorY,
                compositeOperation: this.compositeOperation
            }
        };
        return ser;
    };
    /**
     * @private
     */
    Camera2D.prototype._applyTransformToRenderer = function (renderer) {
        if (this.angle || this.scaleX !== 1 || this.scaleY !== 1 || this.anchorX !== 0 || this.anchorY !== 0) {
            // Note: this.scaleX/scaleYが0の場合描画した結果何も表示されない事になるが、特殊扱いはしない
            renderer.transform(this.getMatrix()._matrix);
        }
        else {
            renderer.translate(-this.x, -this.y);
        }
        if (this.opacity !== 1)
            renderer.opacity(this.opacity);
    };
    /**
     * @private
     */
    Camera2D.prototype._updateMatrix = function () {
        if (!this._matrix)
            return;
        // カメラの angle, x, y はエンティティと逆方向に作用することに注意。
        if (this.angle || this.scaleX !== 1 || this.scaleY !== 1 || this.anchorX !== 0 || this.anchorY !== 0) {
            this._matrix.updateByInverse(this.width, this.height, this.scaleX, this.scaleY, this.angle, this.x, this.y, this.anchorX, this.anchorY);
        }
        else {
            this._matrix.reset(-this.x, -this.y);
        }
    };
    return Camera2D;
}(Object2D_1.Object2D));
exports.Camera2D = Camera2D;

},{"./Object2D":35}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collision = void 0;
var Util_1 = require("./Util");
// 外積の絶対値
function absCross(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}
// 二次元ベクトルの減算
function sub(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}
/**
 * オブジェクトなどの衝突判定機能を提供する。
 */
var Collision;
(function (Collision) {
    /**
     * 二つのエンティティの衝突判定を行い、その結果を返す。
     *
     * 回転・拡大されたエンティティや、親の異なるエンティティ同士も扱える汎用の衝突判定処理。
     * ただし計算量が多いので、大量のエンティティ間のすべての衝突を確認するような状況では利用を避けることが望ましい。
     * 親が同じで回転・拡大を行わないエンティティ同士の場合は、より軽量な Collision.intersectAreas() を利用すること。
     * 親が同じで中心座標同士の距離だけで判定してよい場合は、より軽量な Collision.withinAreas() を利用すること。
     *
     * 対象のエンティティの座標や大きさなどを変更した場合、
     * この関数の呼び出し前にそのエンティティの modified() を呼び出しておく必要がある。
     *
     * @param e1 衝突判定するエンティティ
     * @param e2 衝突判定するエンティティ
     * @param area1 e1 の当たり判定領域。省略された場合、`{ x: 0, y: 0, width: e1.width, hegiht: e1.height }`
     * @param area2 e2 の当たり判定領域。省略された場合、`{ x: 0, y: 0, width: e2.width, hegiht: e2.height }`
     */
    function intersectEntities(e1, e2, area1, area2) {
        var lca = e1._findLowestCommonAncestorWith(e2);
        if (!lca)
            return false;
        var r1 = area1
            ? { left: area1.x, top: area1.y, right: area1.x + area1.width, bottom: area1.y + area1.height }
            : { left: 0, top: 0, right: e1.width, bottom: e1.height };
        var r2 = area2
            ? { left: area2.x, top: area2.y, right: area2.x + area2.width, bottom: area2.y + area2.height }
            : { left: 0, top: 0, right: e2.width, bottom: e2.height };
        var mat1 = e1._calculateMatrixTo(lca);
        var mat2 = e2._calculateMatrixTo(lca);
        // 座標系を合わせる: 共通祖先の座標系に合わせたそれぞれの四隅の点を求める。
        var lt1 = mat1.multiplyPoint({ x: r1.left, y: r1.top });
        var rt1 = mat1.multiplyPoint({ x: r1.right, y: r1.top });
        var lb1 = mat1.multiplyPoint({ x: r1.left, y: r1.bottom });
        var rb1 = mat1.multiplyPoint({ x: r1.right, y: r1.bottom });
        var lt2 = mat2.multiplyPoint({ x: r2.left, y: r2.top });
        var rt2 = mat2.multiplyPoint({ x: r2.right, y: r2.top });
        var lb2 = mat2.multiplyPoint({ x: r2.left, y: r2.bottom });
        var rb2 = mat2.multiplyPoint({ x: r2.right, y: r2.bottom });
        // AABB で枝狩りする。(高速化だけでなく後続の条件を単純化するのにも必要である点に注意)
        var minX1 = Math.min(lt1.x, rt1.x, lb1.x, rb1.x);
        var maxX1 = Math.max(lt1.x, rt1.x, lb1.x, rb1.x);
        var minX2 = Math.min(lt2.x, rt2.x, lb2.x, rb2.x);
        var maxX2 = Math.max(lt2.x, rt2.x, lb2.x, rb2.x);
        if (maxX1 < minX2 || maxX2 < minX1)
            return false;
        var minY1 = Math.min(lt1.y, rt1.y, lb1.y, rb1.y);
        var maxY1 = Math.max(lt1.y, rt1.y, lb1.y, rb1.y);
        var minY2 = Math.min(lt2.y, rt2.y, lb2.y, rb2.y);
        var maxY2 = Math.max(lt2.y, rt2.y, lb2.y, rb2.y);
        if (maxY1 < minY2 || maxY2 < minY1)
            return false;
        // 二つの四角形それぞれのいずれかの辺同士が交差するなら衝突している。
        if (Collision.intersectLineSegments(lt1, rt1, lt2, rt2) ||
            Collision.intersectLineSegments(lt1, rt1, rt2, rb2) ||
            Collision.intersectLineSegments(lt1, rt1, rb2, lb2) ||
            Collision.intersectLineSegments(lt1, rt1, lb2, lt2) ||
            Collision.intersectLineSegments(rt1, rb1, lt2, rt2) ||
            Collision.intersectLineSegments(rt1, rb1, rt2, rb2) ||
            Collision.intersectLineSegments(rt1, rb1, rb2, lb2) ||
            Collision.intersectLineSegments(rt1, rb1, lb2, lt2) ||
            Collision.intersectLineSegments(rb1, lb1, lt2, rt2) ||
            Collision.intersectLineSegments(rb1, lb1, rt2, rb2) ||
            Collision.intersectLineSegments(rb1, lb1, rb2, lb2) ||
            Collision.intersectLineSegments(rb1, lb1, lb2, lt2) ||
            Collision.intersectLineSegments(lb1, lt1, lt2, rt2) ||
            Collision.intersectLineSegments(lb1, lt1, rt2, rb2) ||
            Collision.intersectLineSegments(lb1, lt1, rb2, lb2) ||
            Collision.intersectLineSegments(lb1, lt1, lb2, lt2)) {
            return true;
        }
        // そうでない場合、e1 が e2 を包含しているなら衝突している。
        // ここで辺は交差していないので、e1 が e2 の頂点一つ (lt2) を包含しているなら、全体を包含している。
        // cf. https://ksta.skr.jp/topic/diaryb09.html#040528 "各辺の内側判定による内外判定"
        var s1 = absCross(sub(lt1, rt1), sub(lt2, rt1));
        if (s1 * absCross(sub(lb1, lt1), sub(lt2, lt1)) >= 0 &&
            s1 * absCross(sub(rb1, lb1), sub(lt2, lb1)) >= 0 &&
            s1 * absCross(sub(rt1, rb1), sub(lt2, rb1)) >= 0) {
            return true;
        }
        // そうでない場合、e2 が e1 を包含しているなら衝突している。
        var s2 = absCross(sub(lt2, rt2), sub(lt1, rt2));
        return (s2 * absCross(sub(lb2, lt2), sub(lt1, lt2)) >= 0 &&
            s2 * absCross(sub(rb2, lb2), sub(lt1, lb2)) >= 0 &&
            s2 * absCross(sub(rt2, rb2), sub(lt1, rb2)) >= 0);
    }
    Collision.intersectEntities = intersectEntities;
    /**
     * 線分同士の衝突判定 (交差判定) を行い、その結果を返す。
     *
     * @param {CommonOffset} p1 線分の端点の一つ
     * @param {CommonOffset} p2 線分の端点の一つ
     * @param {CommonOffset} q1 もう一つの線分の端点の一つ
     * @param {CommonOffset} q2 もう一つの線分の端点の一つ
     */
    function intersectLineSegments(p1, p2, q1, q2) {
        // cf. https://ksta.skr.jp/topic/diaryb09.html#040518
        var p = sub(p2, p1);
        var q = sub(q2, q1);
        return (absCross(sub(q1, p1), p) * absCross(sub(q2, p1), p) <= 0 && absCross(sub(p1, q1), q) * absCross(sub(p2, q1), q) <= 0 // 符号が違うことを積の符号で判定している
        );
    }
    Collision.intersectLineSegments = intersectLineSegments;
    /**
     * 矩形交差による衝突判定を行い、その結果を返す。
     * 戻り値は、二つの矩形t1, t2が交差しているとき真、でなければ偽。
     *
     * @param {number} x1 t1のX座標
     * @param {number} y1 t1のY座標
     * @param {number} width1 t1の幅
     * @param {number} height1 t1の高さ
     * @param {number} x2 t2のX座標
     * @param {number} y2 t2のY座標
     * @param {number} width2 t2の幅
     * @param {number} height2 t2の高さ
     */
    function intersect(x1, y1, width1, height1, x2, y2, width2, height2) {
        return x1 <= x2 + width2 && x2 <= x1 + width1 && y1 <= y2 + height2 && y2 <= y1 + height1;
    }
    Collision.intersect = intersect;
    /**
     * 矩形交差による衝突判定を行い、その結果を返す。
     * 戻り値は、矩形t1, t2が交差しているとき真、でなければ偽。
     *
     * 特に、回転・拡大を利用していない、親が同じエンティティ同士の衝突判定に利用することができる。
     * 条件を満たさない場合は `withinAreas()` や、より重いが正確な `intersectEntities()` の利用を検討すること。
     *
     * @param {CommonArea} t1 矩形1
     * @param {CommonArea} t2 矩形2
     */
    function intersectAreas(t1, t2) {
        return Collision.intersect(t1.x, t1.y, t1.width, t1.height, t2.x, t2.y, t2.width, t2.height);
    }
    Collision.intersectAreas = intersectAreas;
    /**
     * 2点間の距離による衝突判定を行い、その結果を返す。
     * 戻り値は、2点間の距離が閾値以内であるとき真、でなければ偽。
     * @param {number} t1x 一点の X 座標
     * @param {number} t1y 一点の Y 座標
     * @param {number} t2x もう一点の X 座標
     * @param {number} t2y もう一点の Y 座標
     * @param {number} [distance=1] 衝突判定閾値 [pixel]
     */
    function within(t1x, t1y, t2x, t2y, distance) {
        if (distance === void 0) { distance = 1; }
        return distance >= Util_1.Util.distance(t1x, t1y, t2x, t2y);
    }
    Collision.within = within;
    /**
     * 2つの矩形の中心座標間距離による衝突判定を行い、その結果を返す。
     * 戻り値は、2点間の距離が閾値以内であるとき真、でなければ偽。
     * @param {CommonArea} t1 矩形1
     * @param {CommonArea} t2 矩形2
     * @param {number} [distance=1] 衝突判定閾値 [pixel]
     */
    function withinAreas(t1, t2, distance) {
        if (distance === void 0) { distance = 1; }
        return distance >= Util_1.Util.distanceBetweenAreas(t1, t2);
    }
    Collision.withinAreas = withinAreas;
})(Collision = exports.Collision || (exports.Collision = {}));

},{"./Util":64}],12:[function(require,module,exports){
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
exports.DefaultLoadingScene = void 0;
var CameraCancellingE_1 = require("./entities/CameraCancellingE");
var FilledRect_1 = require("./entities/FilledRect");
var LoadingScene_1 = require("./LoadingScene");
/**
 * デフォルトローディングシーン。
 *
 * `Game#_defaultLoadingScene` の初期値として利用される。
 * このシーンはいかなるアセットも用いてはならない。
 */
var DefaultLoadingScene = /** @class */ (function (_super) {
    __extends(DefaultLoadingScene, _super);
    /**
     * `DefaultLoadingScene` のインスタンスを生成する。
     * @param param 初期化に用いるパラメータのオブジェクト
     */
    function DefaultLoadingScene(param) {
        var _this = _super.call(this, { game: param.game, name: "akashic:default-loading-scene" }) || this;
        if (param.style === "compact") {
            _this._barWidth = _this.game.width / 4;
            _this._barHeight = 5;
            _this._style = "compact";
        }
        else {
            _this._barWidth = Math.min(_this.game.width, Math.max(100, _this.game.width / 2));
            _this._barHeight = 5;
            _this._style = "default";
        }
        _this._gauge = undefined;
        _this._gaugeUpdateCount = 0;
        _this._totalWaitingAssetCount = 0;
        _this.onLoad.add(_this._handleLoad, _this);
        _this.onTargetReset.add(_this._handleTargetReset, _this);
        _this.onTargetAssetLoad.add(_this._handleTargetAssetLoad, _this);
        return _this;
    }
    /**
     * @private
     */
    DefaultLoadingScene.prototype._handleLoad = function () {
        var barX, barY, bgColor;
        if (this._style === "compact") {
            var margin = Math.min(this.game.width, this.game.height) * 0.05;
            barX = this.game.width - margin - this._barWidth;
            barY = this.game.height - margin - this._barHeight;
            bgColor = "transparent";
        }
        else {
            barX = (this.game.width - this._barWidth) / 2;
            barY = (this.game.height - this._barHeight) / 2;
            bgColor = "rgba(0, 0, 0, 0.8)";
        }
        var gauge;
        this.append(new CameraCancellingE_1.CameraCancellingE({
            scene: this,
            children: [
                new FilledRect_1.FilledRect({
                    scene: this,
                    width: this.game.width,
                    height: this.game.height,
                    cssColor: bgColor,
                    children: [
                        new FilledRect_1.FilledRect({
                            scene: this,
                            x: barX,
                            y: barY,
                            width: this._barWidth,
                            height: this._barHeight,
                            cssColor: "gray",
                            children: [
                                (gauge = new FilledRect_1.FilledRect({
                                    scene: this,
                                    width: 0,
                                    height: this._barHeight,
                                    cssColor: "white"
                                }))
                            ]
                        })
                    ]
                })
            ]
        }));
        gauge.onUpdate.add(this._handleUpdate, this);
        this._gauge = gauge;
        return true; // Trigger 登録を解除する
    };
    /**
     * @private
     */
    DefaultLoadingScene.prototype._handleUpdate = function () {
        var BLINK_RANGE = 50;
        var BLINK_PER_SEC = 2 / 3;
        ++this._gaugeUpdateCount;
        // 白を上限に sin 波で明滅させる (updateしていることの確認)
        var c = Math.round(255 - BLINK_RANGE + Math.sin((this._gaugeUpdateCount / this.game.fps) * BLINK_PER_SEC * (2 * Math.PI)) * BLINK_RANGE);
        this._gauge.cssColor = "rgb(" + c + "," + c + "," + c + ")";
        this._gauge.modified();
    };
    /**
     * @private
     */
    DefaultLoadingScene.prototype._handleTargetReset = function (targetScene) {
        if (this._gauge) {
            this._gauge.width = 0;
            this._gauge.modified();
        }
        this._totalWaitingAssetCount = targetScene._sceneAssetHolder.waitingAssetsCount;
    };
    /**
     * @private
     */
    DefaultLoadingScene.prototype._handleTargetAssetLoad = function (_asset) {
        var waitingAssetsCount = this._targetScene._sceneAssetHolder.waitingAssetsCount;
        this._gauge.width = Math.ceil((1 - waitingAssetsCount / this._totalWaitingAssetCount) * this._barWidth);
        this._gauge.modified();
    };
    return DefaultLoadingScene;
}(LoadingScene_1.LoadingScene));
exports.DefaultLoadingScene = DefaultLoadingScene;

},{"./LoadingScene":29,"./entities/CameraCancellingE":71,"./entities/FilledRect":73}],13:[function(require,module,exports){
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
exports.DefaultSkippingScene = void 0;
var CameraCancellingE_1 = require("./entities/CameraCancellingE");
var FilledRect_1 = require("./entities/FilledRect");
var Scene_1 = require("./Scene");
/**
 * @ignore
 */
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1)
        return (c / 2) * t * t + b;
    --t;
    return (-c / 2) * (t * (t - 2) - 1) + b;
}
/**
 * @ignore
 */
function easingInOutQuadWithSaturation(t, b, c, d) {
    var threshold = d * 0.15;
    return 0 < t && t < threshold ? easeInOutQuad(t, b, c, threshold) : b + c;
}
/**
 * @ignore
 */
var EasingFilledRect = /** @class */ (function (_super) {
    __extends(EasingFilledRect, _super);
    function EasingFilledRect(param) {
        var _this = _super.call(this, param) || this;
        _this.age = 0;
        _this.offsetDurationFrame = param.offsetDurationFrame;
        _this.easingDurationFrame = param.easingDurationFrame;
        _this.valueFrom = param.valueFrom;
        _this.valueTo = param.valueTo;
        _this.easing = param.easing;
        _this.onUpdate.add(_this._incrementAge, _this);
        _this.onUpdate.add(_this._updateColor, _this);
        return _this;
    }
    EasingFilledRect.prototype._incrementAge = function () {
        this.age++;
    };
    EasingFilledRect.prototype._updateColor = function () {
        var cssColor = this._calculateCSSColor();
        if (this.cssColor !== cssColor) {
            this.cssColor = cssColor;
            this.modified();
        }
    };
    EasingFilledRect.prototype._calculateCSSColor = function () {
        var _a = this, age = _a.age, offsetDurationFrame = _a.offsetDurationFrame, easingDurationFrame = _a.easingDurationFrame, valueFrom = _a.valueFrom, valueTo = _a.valueTo, easing = _a.easing;
        var t = Math.max(age - offsetDurationFrame, 0) % easingDurationFrame;
        var b = valueFrom;
        var c = valueTo - valueFrom;
        var d = easingDurationFrame;
        var col = easing(t, b, c, d);
        return "rgb(".concat(col, ", ").concat(col, ", ").concat(col, ")");
    };
    return EasingFilledRect;
}(FilledRect_1.FilledRect));
/**
 * デフォルトスキッピングシーン。
 *
 * `Game#_defaultSkippingScene` の初期値として利用される。
 */
var DefaultSkippingScene = /** @class */ (function (_super) {
    __extends(DefaultSkippingScene, _super);
    /**
     * `DefaultSkippingScene` のインスタンスを生成する。
     * @param param 初期化に用いるパラメータのオブジェクト
     */
    function DefaultSkippingScene(param) {
        var _this = _super.call(this, { game: param.game, local: "full-local", name: "akashic:default-skipping-scene" }) || this;
        if (param.style === "indicator") {
            _this.onLoad.addOnce(_this._handleLoadForIndicator, _this);
        }
        return _this;
    }
    /**
     * @private
     */
    DefaultSkippingScene.prototype._handleLoadForIndicator = function () {
        var _this = this;
        var game = this.game;
        var rectSize = (Math.min(game.width, game.height) * 0.03) | 0;
        var margin = (Math.min(game.width, game.height) * 0.03) | 0;
        var marginRight = (Math.min(game.width, game.height) * 0.05) | 0;
        var marginBottom = (Math.min(game.width, game.height) * 0.05) | 0;
        var offsetDurationFrame = 400 / (1000 / game.fps);
        var easingDurationFrame = 2500 / (1000 / game.fps);
        var valueFrom = 255 - 50;
        var valueTo = 255;
        var easing = easingInOutQuadWithSaturation;
        this.append(new CameraCancellingE_1.CameraCancellingE({
            scene: this,
            children: [3, 2, 1, 0].map(function (offsetIndex, i) {
                return new EasingFilledRect({
                    scene: _this,
                    cssColor: "rgb(".concat(valueTo, ", ").concat(valueTo, ", ").concat(valueTo, ")"),
                    width: rectSize,
                    height: rectSize,
                    x: game.width - i * (rectSize + margin) - marginRight,
                    y: game.height - marginBottom,
                    anchorX: 1,
                    anchorY: 1,
                    offsetDurationFrame: offsetDurationFrame * offsetIndex,
                    easingDurationFrame: easingDurationFrame,
                    valueFrom: valueFrom,
                    valueTo: valueTo,
                    easing: easing
                });
            })
        }));
    };
    return DefaultSkippingScene;
}(Scene_1.Scene));
exports.DefaultSkippingScene = DefaultSkippingScene;

},{"./Scene":47,"./entities/CameraCancellingE":71,"./entities/FilledRect":73}],14:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],15:[function(require,module,exports){
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
exports.DynamicFont = void 0;
var pdi_types_1 = require("@akashic/pdi-types");
var BitmapFont_1 = require("./BitmapFont");
var Font_1 = require("./Font");
var SurfaceAtlasSet_1 = require("./SurfaceAtlasSet");
var Util_1 = require("./Util");
/**
 * ビットマップフォントを逐次生成するフォント。
 */
var DynamicFont = /** @class */ (function (_super) {
    __extends(DynamicFont, _super);
    /**
     * 各種パラメータを指定して `DynamicFont` のインスタンスを生成する。
     * @param param `DynamicFont` に設定するパラメータ
     */
    function DynamicFont(param) {
        var _this = _super.call(this) || this;
        _this.fontFamily = param.fontFamily;
        _this.size = param.size;
        _this.hint = param.hint != null ? param.hint : {};
        _this.fontColor = param.fontColor != null ? param.fontColor : "black";
        _this.fontWeight = param.fontWeight != null ? param.fontWeight : pdi_types_1.FontWeight.Normal;
        _this.strokeWidth = param.strokeWidth != null ? param.strokeWidth : 0;
        _this.strokeColor = param.strokeColor != null ? param.strokeColor : "black";
        _this.strokeOnly = param.strokeOnly != null ? param.strokeOnly : false;
        var game = param.game;
        _this._resourceFactory = game.resourceFactory;
        var ff = _this.fontFamily;
        var realFontFamily;
        if (typeof ff === "string") {
            realFontFamily = ff;
        }
        else if (Array.isArray(ff)) {
            var arr = [];
            for (var i = 0; i < ff.length; ++i) {
                var ffi = ff[i];
                arr.push(typeof ffi === "string" ? ffi : Util_1.Util.enumToSnakeCase(pdi_types_1.FontFamily, ffi));
            }
            realFontFamily = arr;
        }
        else {
            var arr = [];
            arr.push(typeof ff === "string" ? ff : Util_1.Util.enumToSnakeCase(pdi_types_1.FontFamily, ff));
            realFontFamily = arr;
        }
        var weight = _this.fontWeight;
        var realFontWeight = typeof weight === "string" ? weight : Util_1.Util.enumToSnakeCase(pdi_types_1.FontWeight, weight);
        _this._glyphFactory = _this._resourceFactory.createGlyphFactory(realFontFamily, _this.size, _this.hint.baselineHeight, _this.fontColor, _this.strokeWidth, _this.strokeColor, _this.strokeOnly, realFontWeight);
        _this._glyphs = {};
        _this._destroyed = false;
        _this._isSurfaceAtlasSetOwner = false;
        // NOTE: hint の特定プロパティ(baselineHeight)を分岐の条件にした場合、後でプロパティを追加した時に
        // ここで追従漏れの懸念があるため、引数の hint が省略されているかで分岐させている。
        if (param.surfaceAtlasSet) {
            _this._atlasSet = param.surfaceAtlasSet;
        }
        else if (!!param.hint) {
            _this._isSurfaceAtlasSetOwner = true;
            _this._atlasSet = new SurfaceAtlasSet_1.SurfaceAtlasSet({
                resourceFactory: game.resourceFactory,
                hint: _this.hint
            });
        }
        else {
            _this._atlasSet = game.surfaceAtlasSet;
        }
        if (_this.hint.presetChars) {
            for (var i = 0, len = _this.hint.presetChars.length; i < len; i++) {
                var code = Util_1.Util.charCodeAt(_this.hint.presetChars, i);
                if (!code) {
                    continue;
                }
                _this.glyphForCharacter(code);
            }
        }
        return _this;
    }
    /**
     * グリフの取得。
     *
     * 取得に失敗するとnullが返る。
     *
     * 取得に失敗した時、次のようにすることで成功するかもしれない。
     * - DynamicFont生成時に指定する文字サイズを小さくする
     * - アトラスの初期サイズ・最大サイズを大きくする
     *
     * @param code 文字コード
     */
    DynamicFont.prototype.glyphForCharacter = function (code) {
        var glyph = this._glyphs[code];
        if (!(glyph && glyph.isSurfaceValid)) {
            glyph = this._glyphFactory.create(code);
            if (glyph.surface) {
                // 空白文字でなければアトラス化する
                if (!this._atlasSet.addGlyph(glyph)) {
                    return null;
                }
            }
            this._glyphs[code] = glyph;
        }
        this._atlasSet.touchGlyph(glyph);
        return glyph;
    };
    /**
     * BtimapFontの生成。
     *
     * 実装上の制限から、このメソッドを呼び出す場合、maxAtlasNum が 1 または undefined/null(1として扱われる) である必要がある。
     * そうでない場合、失敗する可能性がある。
     *
     * @param missingGlyph `BitmapFont#map` に存在しないコードポイントの代わりに表示するべき文字。最初の一文字が用いられる。
     */
    DynamicFont.prototype.asBitmapFont = function (missingGlyphChar) {
        var _this = this;
        if (this._atlasSet.getAtlasNum() !== 1) {
            return null;
        }
        var missingGlyphCharCodePoint = null;
        if (missingGlyphChar) {
            missingGlyphCharCodePoint = Util_1.Util.charCodeAt(missingGlyphChar, 0);
            this.glyphForCharacter(missingGlyphCharCodePoint);
        }
        var glyphAreaMap = {};
        Object.keys(this._glyphs).forEach(function (_key) {
            var key = Number(_key);
            var glyph = _this._glyphs[key];
            var glyphArea = {
                x: glyph.x,
                y: glyph.y,
                width: glyph.width,
                height: glyph.height,
                offsetX: glyph.offsetX,
                offsetY: glyph.offsetY,
                advanceWidth: glyph.advanceWidth
            };
            glyphAreaMap[key] = glyphArea;
        });
        // NOTE: (defaultGlyphWidth, defaultGlyphHeight)= (0, this.size) とする
        //
        // それぞれの役割は第一に `GlyphArea#width`, `GlyphArea#height` が与えられないときの
        // デフォルト値である。ここでは必ず与えているのでデフォルト値としては利用されない。
        // しかし defaultGlyphHeight は BitmapFont#size にも用いられる。
        // そのために this.size をコンストラクタの第４引数に与えることにする。
        // @ts-ignore
        var missingGlyph = glyphAreaMap[missingGlyphCharCodePoint];
        var atlas = this._atlasSet.getAtlas(0);
        var size = atlas.getAtlasUsedSize();
        var surface = this._resourceFactory.createSurface(size.width, size.height);
        var renderer = surface.renderer();
        renderer.begin();
        renderer.drawImage(atlas._surface, 0, 0, size.width, size.height, 0, 0);
        renderer.end();
        var bitmapFont = new BitmapFont_1.BitmapFont({
            src: surface,
            map: glyphAreaMap,
            defaultGlyphWidth: 0,
            defaultGlyphHeight: this.size,
            missingGlyph: missingGlyph
        });
        return bitmapFont;
    };
    DynamicFont.prototype.destroy = function () {
        if (this._isSurfaceAtlasSetOwner) {
            this._atlasSet.destroy();
        }
        this._glyphs = undefined;
        this._glyphFactory = undefined;
        this._destroyed = true;
    };
    DynamicFont.prototype.destroyed = function () {
        return this._destroyed;
    };
    return DynamicFont;
}(Font_1.Font));
exports.DynamicFont = DynamicFont;

},{"./BitmapFont":8,"./Font":24,"./SurfaceAtlasSet":54,"./Util":64,"@akashic/pdi-types":108}],16:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],17:[function(require,module,exports){
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
exports.SeedEvent = exports.PlayerInfoEvent = exports.TimestampEvent = exports.LeaveEvent = exports.JoinEvent = exports.OperationEvent = exports.MessageEvent = exports.PointMoveEventBase = exports.PointUpEventBase = exports.PointDownEventBase = exports.PointEventBase = void 0;
/**
 * ポインティング操作を表すイベントの基底クラス。
 * PointEvent#targetでそのポインティング操作の対象が、
 * PointEvent#pointでその対象からの相対座標が取得できる。
 *
 * 本イベントはマルチタッチに対応しており、PointEvent#pointerIdを参照することで識別することが出来る。
 *
 * abstract
 */
var PointEventBase = /** @class */ (function () {
    function PointEventBase(pointerId, target, point, player, local, eventFlags) {
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.local = !!local;
        this.player = player;
        this.pointerId = pointerId;
        this.target = target;
        this.point = point;
    }
    return PointEventBase;
}());
exports.PointEventBase = PointEventBase;
/**
 * ポインティング操作の開始を表すイベントの基底クラス。
 */
var PointDownEventBase = /** @class */ (function (_super) {
    __extends(PointDownEventBase, _super);
    function PointDownEventBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "point-down";
        return _this;
    }
    return PointDownEventBase;
}(PointEventBase));
exports.PointDownEventBase = PointDownEventBase;
/**
 * ポインティング操作の終了を表すイベントの基底クラス。
 * PointDownEvent後にのみ発生する。
 *
 * PointUpEvent#startDeltaによってPointDownEvent時からの移動量が、
 * PointUpEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
 * PointUpEvent#pointにはPointDownEvent#pointと同じ値が格納される。
 */
var PointUpEventBase = /** @class */ (function (_super) {
    __extends(PointUpEventBase, _super);
    function PointUpEventBase(pointerId, target, point, prevDelta, startDelta, player, local, eventFlags) {
        var _this = _super.call(this, pointerId, target, point, player, local, eventFlags) || this;
        _this.type = "point-up";
        _this.prevDelta = prevDelta;
        _this.startDelta = startDelta;
        return _this;
    }
    return PointUpEventBase;
}(PointEventBase));
exports.PointUpEventBase = PointUpEventBase;
/**
 * ポインティング操作の移動を表すイベント。
 * PointDownEvent後にのみ発生するため、MouseMove相当のものが本イベントとして発生することはない。
 *
 * PointMoveEvent#startDeltaによってPointDownEvent時からの移動量が、
 * PointMoveEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
 * PointMoveEvent#pointにはPointMoveEvent#pointと同じ値が格納される。
 *
 * 本イベントは、プレイヤーがポインティングデバイスを移動していなくても、
 * カメラの移動等視覚的にポイントが変化している場合にも発生する。
 */
var PointMoveEventBase = /** @class */ (function (_super) {
    __extends(PointMoveEventBase, _super);
    function PointMoveEventBase(pointerId, target, point, prevDelta, startDelta, player, local, eventFlags) {
        var _this = _super.call(this, pointerId, target, point, player, local, eventFlags) || this;
        _this.type = "point-move";
        _this.prevDelta = prevDelta;
        _this.startDelta = startDelta;
        return _this;
    }
    return PointMoveEventBase;
}(PointEventBase));
exports.PointMoveEventBase = PointMoveEventBase;
/**
 * 汎用的なメッセージを表すイベント。
 * MessageEvent#dataによってメッセージ内容を取得出来る。
 */
var MessageEvent = /** @class */ (function () {
    function MessageEvent(data, player, local, eventFlags) {
        this.type = "message";
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.local = !!local;
        this.player = player;
        this.data = data;
    }
    return MessageEvent;
}());
exports.MessageEvent = MessageEvent;
/**
 * 操作プラグインが通知する操作を表すイベント。
 * プラグインを識別する `OperationEvent#code` と、プラグインごとの内容 `OperationEvent#data` を持つ。
 */
var OperationEvent = /** @class */ (function () {
    function OperationEvent(code, data, player, local, eventFlags) {
        this.type = "operation";
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.local = !!local;
        this.player = player;
        this.code = code;
        this.data = data;
    }
    return OperationEvent;
}());
exports.OperationEvent = OperationEvent;
/**
 * プレイヤーの参加を表すイベント。
 * JoinEvent#playerによって、参加したプレイヤーを取得出来る。
 */
var JoinEvent = /** @class */ (function () {
    function JoinEvent(player, storageValues, eventFlags) {
        this.type = "join";
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.player = player;
        this.storageValues = storageValues;
    }
    return JoinEvent;
}());
exports.JoinEvent = JoinEvent;
/**
 * プレイヤーの離脱を表すイベント。
 * LeaveEvent#playerによって、離脱したプレイヤーを取得出来る。
 */
var LeaveEvent = /** @class */ (function () {
    function LeaveEvent(player, eventFlags) {
        this.type = "leave";
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.player = player;
    }
    return LeaveEvent;
}());
exports.LeaveEvent = LeaveEvent;
/**
 * タイムスタンプを表すイベント。
 */
var TimestampEvent = /** @class */ (function () {
    function TimestampEvent(timestamp, player, eventFlags) {
        this.type = "timestamp";
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.player = player;
        this.timestamp = timestamp;
    }
    return TimestampEvent;
}());
exports.TimestampEvent = TimestampEvent;
/**
 * プレイヤー情報を表すイベント。
 * PointInfoEvent#player.nameによってプレイヤー名を、PlayerInfoEvent#player.userDataによって送信者依存の追加データを取得できる。
 */
var PlayerInfoEvent = /** @class */ (function () {
    function PlayerInfoEvent(player, eventFlags) {
        this.type = "player-info";
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.player = player;
    }
    return PlayerInfoEvent;
}());
exports.PlayerInfoEvent = PlayerInfoEvent;
/**
 * 新しい乱数の発生を表すイベント。
 * SeedEvent#generatorによって、本イベントで発生したRandomGeneratorを取得出来る。
 */
var SeedEvent = /** @class */ (function () {
    function SeedEvent(generator, eventFlags) {
        this.type = "seed";
        // @ts-ignore TODO: eventFlags のデフォルト値の扱い
        this.eventFlags = eventFlags;
        this.generator = generator;
    }
    return SeedEvent;
}());
exports.SeedEvent = SeedEvent;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventConverter = void 0;
var E_1 = require("./entities/E");
var Event_1 = require("./Event");
var ExceptionFactory_1 = require("./ExceptionFactory");
var Storage_1 = require("./Storage");
/**
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 * @ignore
 */
var EventConverter = /** @class */ (function () {
    function EventConverter(param) {
        var _a;
        this._game = param.game;
        this._playerId = (_a = param.playerId) !== null && _a !== void 0 ? _a : null;
        this._playerTable = {};
    }
    /**
     * playlog.Eventからg.Eventへ変換する。
     */
    EventConverter.prototype.toGameEvent = function (pev) {
        var pointerId;
        var entityId;
        var target;
        var point;
        var startDelta;
        var prevDelta;
        var local;
        var timestamp;
        var eventCode = pev[0 /* Code */];
        var prio = pev[1 /* EventFlags */];
        var playerId = pev[2 /* PlayerId */];
        // @ts-ignore
        var player = this._playerTable[playerId] || { id: playerId };
        switch (eventCode) {
            case 0 /* Join */:
                player = {
                    id: playerId,
                    name: pev[3 /* PlayerName */]
                };
                // @ts-ignore
                if (this._playerTable[playerId] && this._playerTable[playerId].userData != null) {
                    // @ts-ignore
                    player.userData = this._playerTable[playerId].userData;
                }
                // @ts-ignore
                this._playerTable[playerId] = player;
                var store = undefined;
                if (pev[4 /* StorageData */]) {
                    var keys_1 = [];
                    var values_1 = [];
                    pev[4 /* StorageData */].map(function (data) {
                        keys_1.push(data.readKey);
                        values_1.push(data.values);
                    });
                    store = new Storage_1.StorageValueStore(keys_1, values_1);
                }
                return new Event_1.JoinEvent(player, store, prio);
            case 1 /* Leave */:
                delete this._playerTable[player.id];
                return new Event_1.LeaveEvent(player, prio);
            case 2 /* Timestamp */:
                timestamp = pev[3 /* Timestamp */];
                return new Event_1.TimestampEvent(timestamp, player, prio);
            case 3 /* PlayerInfo */:
                var playerName = pev[3 /* PlayerName */];
                var userData = pev[4 /* UserData */];
                player = {
                    id: playerId,
                    name: playerName,
                    userData: userData
                };
                // @ts-ignore
                this._playerTable[playerId] = player;
                return new Event_1.PlayerInfoEvent(player, prio);
            case 32 /* Message */:
                local = pev[4 /* Local */];
                return new Event_1.MessageEvent(pev[3 /* Message */], player, local, prio);
            case 33 /* PointDown */:
                local = pev[7 /* Local */];
                pointerId = pev[3 /* PointerId */];
                entityId = pev[6 /* EntityId */];
                target = entityId == null ? undefined : entityId >= 0 ? this._game.db[entityId] : this._game._localDb[entityId];
                point = {
                    x: pev[4 /* X */],
                    y: pev[5 /* Y */]
                };
                return new E_1.PointDownEvent(pointerId, target, point, player, local, prio);
            case 34 /* PointMove */:
                local = pev[11 /* Local */];
                pointerId = pev[3 /* PointerId */];
                entityId = pev[10 /* EntityId */];
                target = entityId == null ? undefined : entityId >= 0 ? this._game.db[entityId] : this._game._localDb[entityId];
                point = {
                    x: pev[4 /* X */],
                    y: pev[5 /* Y */]
                };
                startDelta = {
                    x: pev[6 /* StartDeltaX */],
                    y: pev[7 /* StartDeltaY */]
                };
                prevDelta = {
                    x: pev[8 /* PrevDeltaX */],
                    y: pev[9 /* PrevDeltaY */]
                };
                return new E_1.PointMoveEvent(pointerId, target, point, prevDelta, startDelta, player, local, prio);
            case 35 /* PointUp */:
                local = pev[11 /* Local */];
                pointerId = pev[3 /* PointerId */];
                entityId = pev[10 /* EntityId */];
                target = entityId == null ? undefined : entityId >= 0 ? this._game.db[entityId] : this._game._localDb[entityId];
                point = {
                    x: pev[4 /* X */],
                    y: pev[5 /* Y */]
                };
                startDelta = {
                    x: pev[6 /* StartDeltaX */],
                    y: pev[7 /* StartDeltaY */]
                };
                prevDelta = {
                    x: pev[8 /* PrevDeltaX */],
                    y: pev[9 /* PrevDeltaY */]
                };
                return new E_1.PointUpEvent(pointerId, target, point, prevDelta, startDelta, player, local, prio);
            case 64 /* Operation */:
                local = pev[5 /* Local */];
                var operationCode = pev[3 /* OperationCode */];
                var operationData = pev[4 /* OperationData */];
                var decodedData = this._game._decodeOperationPluginOperation(operationCode, operationData);
                return new Event_1.OperationEvent(operationCode, decodedData, player, local, prio);
            default:
                // TODO handle error
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("EventConverter#toGameEvent");
        }
    };
    /**
     * g.Eventからplaylog.Eventに変換する。
     */
    EventConverter.prototype.toPlaylogEvent = function (e, preservePlayer) {
        var _a, _b, _c, _d, _e, _f, _g;
        var targetId;
        var playerId;
        switch (e.type) {
            case "join":
            case "leave":
                // akashic-engine は決して Join と Leave を生成しない
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("EventConverter#toPlaylogEvent: Invalid type: " + e.type);
            case "timestamp":
                var ts = e;
                playerId = preservePlayer ? (_a = ts.player.id) !== null && _a !== void 0 ? _a : null : this._playerId;
                return [
                    2 /* Timestamp */,
                    ts.eventFlags,
                    playerId,
                    ts.timestamp //            3: タイムスタンプ
                ];
            case "player-info":
                var playerInfo = e;
                playerId = preservePlayer ? (_b = playerInfo.player.id) !== null && _b !== void 0 ? _b : null : this._playerId;
                return [
                    3 /* PlayerInfo */,
                    playerInfo.eventFlags,
                    playerId,
                    playerInfo.player.name,
                    playerInfo.player.userData // 4: ユーザデータ
                ];
            case "point-down":
                var pointDown = e;
                targetId = pointDown.target ? pointDown.target.id : null;
                playerId = preservePlayer && pointDown.player ? (_c = pointDown.player.id) !== null && _c !== void 0 ? _c : null : this._playerId;
                return [
                    33 /* PointDown */,
                    pointDown.eventFlags,
                    playerId,
                    pointDown.pointerId,
                    pointDown.point.x,
                    pointDown.point.y,
                    targetId,
                    !!pointDown.local //       7?: 直前のポイントムーブイベントからのY座標の差
                ];
            case "point-move":
                var pointMove = e;
                targetId = pointMove.target ? pointMove.target.id : null;
                playerId = preservePlayer && pointMove.player ? (_d = pointMove.player.id) !== null && _d !== void 0 ? _d : null : this._playerId;
                return [
                    34 /* PointMove */,
                    pointMove.eventFlags,
                    playerId,
                    pointMove.pointerId,
                    pointMove.point.x,
                    pointMove.point.y,
                    pointMove.startDelta.x,
                    pointMove.startDelta.y,
                    pointMove.prevDelta.x,
                    pointMove.prevDelta.y,
                    targetId,
                    !!pointMove.local //       11?: 直前のポイントムーブイベントからのY座標の差
                ];
            case "point-up":
                var pointUp = e;
                targetId = pointUp.target ? pointUp.target.id : null;
                playerId = preservePlayer && pointUp.player ? (_e = pointUp.player.id) !== null && _e !== void 0 ? _e : null : this._playerId;
                return [
                    35 /* PointUp */,
                    pointUp.eventFlags,
                    playerId,
                    pointUp.pointerId,
                    pointUp.point.x,
                    pointUp.point.y,
                    pointUp.startDelta.x,
                    pointUp.startDelta.y,
                    pointUp.prevDelta.x,
                    pointUp.prevDelta.y,
                    targetId,
                    !!pointUp.local //       11?: 直前のポイントムーブイベントからのY座標の差
                ];
            case "message":
                var message = e;
                playerId = preservePlayer && message.player ? (_f = message.player.id) !== null && _f !== void 0 ? _f : null : this._playerId;
                return [
                    32 /* Message */,
                    message.eventFlags,
                    playerId,
                    message.data,
                    !!message.local //       4?: ローカル
                ];
            case "operation":
                var op = e;
                playerId = preservePlayer && op.player ? (_g = op.player.id) !== null && _g !== void 0 ? _g : null : this._playerId;
                return [
                    64 /* Operation */,
                    op.eventFlags,
                    playerId,
                    op.code,
                    op.data,
                    !!op.local //              5?: ローカル
                ];
            default:
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Unknown type: " + e.type);
        }
    };
    EventConverter.prototype.makePlaylogOperationEvent = function (op) {
        var playerId = this._playerId;
        var eventFlags = op.priority != null ? op.priority & 3 /* Priority */ : 0;
        return [
            64 /* Operation */,
            eventFlags,
            playerId,
            op._code,
            op.data,
            !!op.local //              5: ローカル
        ];
    };
    return EventConverter;
}());
exports.EventConverter = EventConverter;

},{"./Event":17,"./ExceptionFactory":23,"./Storage":52,"./entities/E":72}],19:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],20:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],21:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],22:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],23:[function(require,module,exports){
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
                var actualString = void 0;
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

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Font = void 0;
var Util_1 = require("./Util");
/**
 * フォント。
 */
var Font = /** @class */ (function () {
    function Font() {
    }
    /**
     * 対象の文字列を一行で描画した際の計測情報を返す。
     *
     * @param text 文字列
     */
    Font.prototype.measureText = function (text) {
        var width = 0;
        var actualBoundingBoxLeft = 0;
        var actualBoundingBoxRight = 0;
        var lastGlyph = null;
        for (var i = 0; i < text.length; i++) {
            var code = Util_1.Util.charCodeAt(text, i);
            if (!code)
                continue;
            var glyph = this.glyphForCharacter(code);
            if (!glyph || glyph.x < 0 || glyph.y < 0 || glyph.width < 0 || glyph.height < 0)
                continue;
            if (i === 0) {
                actualBoundingBoxLeft = -glyph.offsetX;
            }
            lastGlyph = glyph;
            width += glyph.advanceWidth;
        }
        if (lastGlyph) {
            actualBoundingBoxRight = width + lastGlyph.offsetX + lastGlyph.width - lastGlyph.advanceWidth;
        }
        return {
            width: width,
            actualBoundingBoxLeft: actualBoundingBoxLeft,
            actualBoundingBoxRight: actualBoundingBoxRight
        };
    };
    return Font;
}());
exports.Font = Font;

},{"./Util":64}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var trigger_1 = require("@akashic/trigger");
var AssetManager_1 = require("./AssetManager");
var AudioSystemManager_1 = require("./AudioSystemManager");
var DefaultLoadingScene_1 = require("./DefaultLoadingScene");
var DefaultSkippingScene_1 = require("./DefaultSkippingScene");
var EventConverter_1 = require("./EventConverter");
var ExceptionFactory_1 = require("./ExceptionFactory");
var LoadingScene_1 = require("./LoadingScene");
var ModuleManager_1 = require("./ModuleManager");
var OperationPluginManager_1 = require("./OperationPluginManager");
var PointEventResolver_1 = require("./PointEventResolver");
var Scene_1 = require("./Scene");
var Storage_1 = require("./Storage");
var SurfaceAtlasSet_1 = require("./SurfaceAtlasSet");
var XorshiftRandomGenerator_1 = require("./XorshiftRandomGenerator");
/**
 * コンテンツそのものを表すクラス。
 *
 * 本クラスのインスタンスは暗黙に生成され、ゲーム開発者が生成することはない。
 * ゲーム開発者は `g.game` によって本クラスのインスタンスを参照できる。
 *
 * 本クラスをゲーム開発者が利用するのは以下のようなケースである。
 * 1. Sceneの生成時、コンストラクタに引数として渡す
 * 2. Sceneに紐付かないイベント Game#join, Game#leave, Game#playerInfo, Game#seed を処理する
 * 3. 乱数を発生させるため、Game#randomにアクセスしRandomGeneratorを取得する
 * 4. ゲームのメタ情報を確認するため、Game#width, Game#height, Game#fpsにアクセスする
 * 5. グローバルアセットを取得するため、Game#assetsにアクセスする
 * 6. LoadingSceneを変更するため、Game#loadingSceneにゲーム開発者の定義したLoadingSceneを指定する
 * 7. スナップショットに対応するため、Game#requestSaveSnapshot()を呼び出す
 * 8. 現在フォーカスされているCamera情報を得るため、Game#focusingCameraにアクセスする
 * 9. AudioSystemを直接制御するため、Game#audioにアクセスする
 * 10.Sceneのスタック情報を調べるため、Game#scenesにアクセスする
 * 11.操作プラグインを直接制御するため、Game#operationPluginManagerにアクセスする
 */
var Game = /** @class */ (function () {
    /**
     * `Game` のインスタンスを生成する。
     *
     * @param param この `Game` に指定するパラメータ
     */
    function Game(param) {
        var gameConfiguration = this._normalizeConfiguration(param.configuration);
        this.fps = gameConfiguration.fps;
        this.width = gameConfiguration.width;
        this.height = gameConfiguration.height;
        this.renderers = [];
        this.scenes = [];
        this.age = 0;
        this.assetBase = param.assetBase || "";
        this.resourceFactory = param.resourceFactory;
        this.handlerSet = param.handlerSet;
        this.selfId = param.selfId;
        this.db = undefined;
        this.loadingScene = undefined;
        this.operationPlugins = undefined;
        this.random = undefined;
        this.localRandom = undefined;
        this._defaultLoadingScene = undefined;
        this._defaultSkippingScene = undefined;
        this._eventConverter = undefined;
        this._pointEventResolver = undefined;
        this._idx = undefined;
        this._localDb = undefined;
        this._localIdx = undefined;
        this._cameraIdx = undefined;
        this._isTerminated = undefined;
        this._modified = undefined;
        this._postTickTasks = undefined;
        this.playId = undefined;
        this.isSkipping = false;
        this.joinedPlayerIds = [];
        this.audio = new AudioSystemManager_1.AudioSystemManager(this.resourceFactory);
        this.defaultAudioSystemId = "sound";
        this.storage = new Storage_1.Storage();
        this.assets = {};
        this.surfaceAtlasSet = new SurfaceAtlasSet_1.SurfaceAtlasSet({ resourceFactory: this.resourceFactory });
        this.onJoin = new trigger_1.Trigger();
        this.onLeave = new trigger_1.Trigger();
        this.onPlayerInfo = new trigger_1.Trigger();
        this.onSeed = new trigger_1.Trigger();
        this.join = this.onJoin;
        this.leave = this.onLeave;
        this.playerInfo = this.onPlayerInfo;
        this.seed = this.onSeed;
        this._eventTriggerMap = {
            unknown: undefined,
            timestamp: undefined,
            join: this.onJoin,
            leave: this.onLeave,
            "player-info": this.onPlayerInfo,
            seed: this.onSeed,
            message: undefined,
            "point-down": undefined,
            "point-move": undefined,
            "point-up": undefined,
            operation: undefined
        };
        this.onResized = new trigger_1.Trigger();
        this.onSkipChange = new trigger_1.Trigger();
        this.resized = this.onResized;
        this.skippingChanged = this.onSkipChange;
        this.isLastTickLocal = true;
        this.lastOmittedLocalTickCount = 0;
        this.lastLocalTickMode = null;
        this.lastTickGenerationMode = null;
        this._onLoad = new trigger_1.Trigger();
        this._onStart = new trigger_1.Trigger();
        this._loaded = this._onLoad;
        this._started = this._onStart;
        this.isLoaded = false;
        this.onSnapshotRequest = new trigger_1.Trigger();
        this.snapshotRequest = this.onSnapshotRequest;
        this.external = {};
        this._runtimeValueBase = Object.create(param.engineModule, {
            game: {
                value: this,
                enumerable: true
            }
        });
        this._main = gameConfiguration.main;
        this._mainFunc = param.mainFunc;
        this._mainParameter = undefined;
        this._configuration = gameConfiguration;
        this._assetManager = new AssetManager_1.AssetManager(this, gameConfiguration.assets, gameConfiguration.audio, gameConfiguration.moduleMainScripts);
        this._moduleManager = undefined;
        var operationPluginsField = gameConfiguration.operationPlugins || [];
        this.operationPluginManager = new OperationPluginManager_1.OperationPluginManager(this, param.operationPluginViewInfo || null, operationPluginsField);
        this._onOperationPluginOperated = new trigger_1.Trigger();
        this._operationPluginOperated = this._onOperationPluginOperated;
        this._onOperationPluginOperated.add(this._handleOperationPluginOperated, this);
        this.operationPluginManager.onOperate.add(this._onOperationPluginOperated.fire, this._onOperationPluginOperated);
        this.onSceneChange = new trigger_1.Trigger();
        this._onSceneChange = new trigger_1.Trigger();
        this._onSceneChange.add(this._handleSceneChanged, this);
        this._sceneChanged = this._onSceneChange;
        this._initialScene = new Scene_1.Scene({
            game: this,
            assetIds: this._assetManager.globalAssetIds(),
            local: true,
            name: "akashic:initial-scene"
        });
        this._initialScene.onLoad.add(this._handleInitialSceneLoad, this);
        this._reset({ age: 0 });
    }
    Object.defineProperty(Game.prototype, "focusingCamera", {
        /**
         * 使用中のカメラ。
         *
         * `Game#draw()`, `Game#findPointSource()` のデフォルト値として使用される。
         * この値を変更した場合、変更を描画に反映するためには `Game#modified()` を呼び出す必要がある。
         */
        // focusingCameraが変更されても古いカメラをtargetCamerasに持つエンティティのEntityStateFlags.Modifiedを取りこぼすことが無いように、変更時にはrenderを呼べるようアクセサを使う
        get: function () {
            return this._focusingCamera;
        },
        set: function (c) {
            if (c === this._focusingCamera)
                return;
            if (this._modified)
                this.render();
            this._focusingCamera = c;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "skippingScene", {
        /**
         * スキッピングシーン。
         * ゲームが早送りとなった際に描画される特殊なシーンであり、以下の制限を持つ。
         *
         * * サポートするシーンの種別は "full-local" のみ
         * * 非グローバルアセットを利用してはならない
         * * シーン内で発生した一切のイベントは処理されない
         * * 早送りが複数回発生した場合でも、対象のシーンの onLoad は2度目以降発火せずにインスタンスが使い回される
         *
         * 初期値は `undefined` である。
         */
        get: function () {
            return this._skippingScene;
        },
        set: function (scene) {
            if (scene === this._skippingScene)
                return;
            if (scene) {
                if (scene.local !== "full-local") {
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#skippingScene: only 'full-local' scene is supported.");
                }
                if (scene._needsLoading()) {
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#skippingScene: must not depend on any assets/storages.");
                }
            }
            this._skippingScene = scene;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * シーンスタックへのシーンの追加と、そのシーンへの遷移を要求する。
     *
     * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
     * 実際のシーン遷移は現在のフレームの終わり(Scene#update の fire 後) まで遅延される。
     * このメソッドの呼び出しにより、現在のシーンの `stateChanged` が引数 `"deactive"` でfireされる。
     * その後 `scene.stateChanged` が引数 `"active"` でfireされる。
     * @param scene 遷移後のシーン
     */
    Game.prototype.pushScene = function (scene) {
        this._postTickTasks.push({
            type: 0 /* PushScene */,
            scene: scene
        });
    };
    /**
     * 現在のシーンの置き換えを要求する。
     *
     * 現在のシーンをシーンスタックから取り除き、指定のシーンを追加することを要求する。
     * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
     * 実際のシーン遷移は現在のフレームの終わり(Scene#update の fire 後) まで遅延される。
     * 引数 `preserveCurrent` が偽の場合、このメソッドの呼び出しにより現在のシーンは破棄される。
     * またその時 `stateChanged` が引数 `"destroyed"` でfireされる。
     * その後 `scene.stateChanged` が引数 `"active"` でfireされる。
     *
     * @param scene 遷移後のシーン
     * @param preserveCurrent 真の場合、現在のシーンを破棄しない(ゲーム開発者が明示的に破棄せねばならない)。省略された場合、偽
     */
    Game.prototype.replaceScene = function (scene, preserveCurrent) {
        this._postTickTasks.push({
            type: 1 /* ReplaceScene */,
            scene: scene,
            preserveCurrent: !!preserveCurrent
        });
    };
    /**
     * シーンスタックから現在のシーンを取り除くことを要求する
     *
     * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
     * 実際のシーン遷移は次のフレームまでに(次のupdateのfireまでに)行われる。
     * 引数 `preserve` が偽の場合、このメソッドの呼び出しにより取り除かれたシーンは全て破棄される。
     * またその時 `stateChanged` が引数 `"destroyed"` でfireされる。
     * その後一つ前のシーンの `stateChanged` が引数 `"active"` でfireされる。
     * また、step数がスタックされているシーンの数以上の場合、例外が投げられる。
     *
     * @param preserve 真の場合、シーンを破棄しない(ゲーム開発者が明示的に破棄せねばならない)。省略された場合、偽
     * @param step 取り除くシーンの数。省略された場合、1
     */
    Game.prototype.popScene = function (preserve, step) {
        if (step === void 0) { step = 1; }
        for (var i = 0; i < step; i++) {
            this._postTickTasks.push({ type: 2 /* PopScene */, preserveCurrent: !!preserve });
        }
    };
    /**
     * 現在のシーンを返す。
     * ない場合、 `undefined` を返す。
     */
    Game.prototype.scene = function () {
        if (!this.scenes.length)
            return undefined;
        return this.scenes[this.scenes.length - 1];
    };
    /**
     * この `Game` の時間経過とそれに伴う処理を行う。
     *
     * 現在の `Scene` に対して `Scene#update` をfireし、 `events` に設定されたイベントを処理する。
     * このメソッドは暗黙に呼び出される。ゲーム開発者がこのメソッドを利用する必要はない。
     *
     * 戻り値は呼び出し前後でシーンが変わった(別のシーンに遷移した)場合、真。でなければ偽。
     * @param advanceAge 偽を与えた場合、`this.age` を進めない。
     * @param omittedTickCount タイムスタンプ待ちを省略する動作などにより、(前回の呼び出し以降に)省かれたローカルティックの数。省略された場合、 `0` 。
     * @param events ティックに含ませるイベント。省略された場合、 `undefined` 。
     */
    Game.prototype.tick = function (advanceAge, omittedTickCount, events) {
        var scene = null;
        if (this._isTerminated)
            return false;
        this.isLastTickLocal = !advanceAge;
        this.lastOmittedLocalTickCount = omittedTickCount || 0;
        if (this.scenes.length) {
            scene = this.scenes[this.scenes.length - 1];
            if (events && events.length) {
                for (var i = 0; i < events.length; ++i) {
                    var event = this._eventConverter.toGameEvent(events[i]);
                    var trigger = this._eventTriggerMap[event.type];
                    // @ts-ignore 処理の高速化のため以下の箇所のみ型の厳格なチェックをなくす
                    if (trigger)
                        trigger.fire(event);
                }
            }
            scene.onUpdate.fire();
            if (advanceAge)
                ++this.age;
        }
        if (this._postTickTasks.length) {
            this._flushPostTickTasks();
            return scene !== this.scenes[this.scenes.length - 1];
        }
        return false;
    };
    /**
     * このGameを描画する。
     *
     * このゲームに紐づけられた `Renderer` (`this.renderers` に含まれるすべての `Renderer` で、この `Game` の描画を行う。
     * 描画内容に変更がない場合、描画処理がスキップされる点に注意。強制的に描画をする場合は `this.modified()` を呼ぶこと。
     * このメソッドは暗黙に呼び出される。ゲーム開発者がこのメソッドを利用する必要はない。
     */
    Game.prototype.render = function () {
        var _a;
        var scene;
        var skippingScene = (_a = this._skippingScene) !== null && _a !== void 0 ? _a : this._defaultSkippingScene;
        if (skippingScene && this.isSkipping) {
            scene = skippingScene;
            scene.onUpdate.fire();
        }
        else {
            scene = this.scene();
        }
        if (!this._modified)
            return;
        if (!scene)
            return;
        var camera = this.focusingCamera;
        var renderers = this.renderers; // unsafe
        for (var i = 0; i < renderers.length; ++i) {
            var renderer = renderers[i];
            renderer.begin();
            renderer.save();
            renderer.clear();
            if (camera) {
                renderer.save();
                camera._applyTransformToRenderer(renderer);
            }
            var children = scene.children;
            for (var j = 0; j < children.length; ++j)
                children[j].render(renderer, camera);
            if (camera) {
                renderer.restore();
            }
            renderer.restore();
            renderer.end();
        }
        this._modified = false;
    };
    /**
     * 対象のポイントイベントのターゲットエンティティ(`PointTarget#target`)を解決し、それを補完した playlog.Event を返す。
     * Down -> Move -> Up とは異なる順番で呼び出された場合 `null` を返す。
     * このメソッドは暗黙に呼び出される。ゲーム開発者がこのメソッドを利用する必要はない。
     * @param e プラットフォームのポイントイベント
     */
    Game.prototype.resolvePointEvent = function (e) {
        switch (e.type) {
            case 0 /* Down */:
                return this._pointEventResolver.pointDown(e);
            case 1 /* Move */:
                return this._pointEventResolver.pointMove(e);
            case 2 /* Up */:
                return this._pointEventResolver.pointUp(e);
        }
    };
    /**
     * その座標に反応する `PointSource` を返す。
     *
     * 戻り値は、対象が見つかった場合、 `target` に見つかった `E` を持つ `PointSource` である。
     * 対象が見つからなかった場合、 `undefined` である。
     *
     * 戻り値が `undefined` でない場合、その `target` プロパティは次を満たす:
     * - `E#touchable` が真である
     * - カメラ `camera` から可視である中で最も手前にある
     *
     * @param point 対象の座標
     * @param camera 対象のカメラ。指定しなければ `Game.focusingCamera` が使われる
     */
    Game.prototype.findPointSource = function (point, camera) {
        if (!camera)
            camera = this.focusingCamera;
        var scene = this.scene();
        if (!scene)
            return undefined;
        return scene.findPointSourceByPoint(point, false, camera);
    };
    /**
     * このGameにエンティティを登録する。
     *
     * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に利用する必要はない。
     * `e.id` が `undefined` である場合、このメソッドの呼び出し後、 `e.id` には `this` に一意の値が設定される。
     * `e.local` が偽である場合、このメソッドの呼び出し後、 `this.db[e.id] === e` が成立する。
     * `e.local` が真である場合、 `e.id` の値は不定である。
     *
     * @param e 登録するエンティティ
     */
    Game.prototype.register = function (e) {
        if (e.local) {
            if (e.id === undefined) {
                e.id = --this._localIdx;
            }
            else {
                // register前にidがある: スナップショットからの復元用パス
                // スナップショットはローカルエンティティを残さないはずだが、実装上はできるようにしておく。
                if (e.id > 0)
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#register: invalid local id: " + e.id);
                if (this._localDb.hasOwnProperty(String(e.id)))
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#register: conflicted id: " + e.id);
                if (this._localIdx > e.id)
                    this._localIdx = e.id;
            }
            this._localDb[e.id] = e;
        }
        else {
            if (e.id === undefined) {
                e.id = ++this._idx;
            }
            else {
                // register前にidがある: スナップショットからの復元用パス
                if (e.id < 0)
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#register: invalid non-local id: " + e.id);
                if (this.db.hasOwnProperty(String(e.id)))
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#register: conflicted id: " + e.id);
                // _idxがユニークな値を作れるよう更新しておく
                if (this._idx < e.id)
                    this._idx = e.id;
            }
            this.db[e.id] = e;
        }
    };
    /**
     * このGameからエンティティの登録を削除する。
     *
     * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に利用する必要はない。
     * このメソッドの呼び出し後、 `this.db[e.id]` は未定義である。
     * @param e 登録を削除するエンティティ
     */
    Game.prototype.unregister = function (e) {
        if (e.local) {
            delete this._localDb[e.id];
        }
        else {
            delete this.db[e.id];
        }
    };
    /**
     * このゲームを終了する。
     *
     * エンジンに対して続行の断念を通知する。
     * このメソッドの呼び出し後、このクライアントの操作要求は送信されない。
     * またこのクライアントのゲーム実行は行われない(updateを含むイベントのfireはおきない)。
     */
    Game.prototype.terminateGame = function () {
        this._isTerminated = true;
        this._terminateGame();
    };
    /**
     * 画面更新が必要のフラグを設定する。
     */
    Game.prototype.modified = function () {
        this._modified = true;
    };
    /**
     * イベントを発生させる。
     *
     * ゲーム開発者は、このメソッドを呼び出すことで、エンジンに指定のイベントを発生させることができる。
     *
     * @param e 発生させるイベント
     */
    Game.prototype.raiseEvent = function (e) {
        this.handlerSet.raiseEvent(this._eventConverter.toPlaylogEvent(e));
    };
    /**
     * ティックを発生させる。
     *
     * ゲーム開発者は、このメソッドを呼び出すことで、エンジンに時間経過を要求することができる。
     * 現在のシーンのティック生成モード `Scene#tickGenerationMode` が `"manual"` でない場合、エラー。
     *
     * @param events そのティックで追加で発生させるイベント
     */
    Game.prototype.raiseTick = function (events) {
        if (events == null || !events.length) {
            this.handlerSet.raiseTick();
            return;
        }
        var plEvents = [];
        for (var i = 0; i < events.length; i++) {
            plEvents.push(this._eventConverter.toPlaylogEvent(events[i]));
        }
        this.handlerSet.raiseTick(plEvents);
    };
    /**
     * イベントフィルタを追加する。
     *
     * 一つ以上のイベントフィルタが存在する場合、このゲームで発生したイベントは、通常の処理の代わりにイベントフィルタに渡される。
     * エンジンは、イベントフィルタが戻り値として返したイベントを、まるでそのイベントが発生したかのように処理する。
     *
     * イベントフィルタはローカルイベントに対しても適用される。
     * イベントフィルタはローカルティック補間シーンやローカルシーンの間であっても適用される。
     * 複数のイベントフィルタが存在する場合、そのすべてが適用される。適用順は登録の順である。
     *
     * @param filter 追加するイベントフィルタ
     * @param handleEmpty イベントが存在しない場合でも定期的にフィルタを呼び出すか否か。省略された場合、偽。
     */
    Game.prototype.addEventFilter = function (filter, handleEmpty) {
        this.handlerSet.addEventFilter(filter, handleEmpty);
    };
    /**
     * イベントフィルタを削除する。
     *
     * @param filter 削除するイベントフィルタ
     */
    Game.prototype.removeEventFilter = function (filter) {
        this.handlerSet.removeEventFilter(filter);
    };
    /**
     * このインスタンスにおいてスナップショットの保存を行うべきかを返す。
     *
     * スナップショット保存に対応するゲームであっても、
     * 必ずしもすべてのインスタンスにおいてスナップショット保存を行うべきとは限らない。
     * たとえば多人数プレイ時には、複数のクライアントで同一のゲームが実行される。
     * スナップショットを保存するのはそのうちの一つのインスタンスのみでよい。
     * 本メソッドはそのような場合に、自身がスナップショットを保存すべきかどうかを判定するために用いることができる。
     *
     * スナップショット保存に対応するゲームは、このメソッドが真を返す時にのみ `Game#saveSnapshot()` を呼び出すべきである。
     * 戻り値は、スナップショットの保存を行うべきであれば真、でなければ偽である。
     *
     * @deprecated 非推奨である。`saveSnapshot()` (非推奨) の利用時にしか必要ないため。アクティブインスタンスの判定には `isActiveInstance()` を用いること。
     */
    Game.prototype.shouldSaveSnapshot = function () {
        return this.handlerSet.shouldSaveSnapshot();
    };
    /**
     * スナップショットを保存する。
     *
     * このメソッドは `Game#shouldSaveSnapshot()` が真を返す `Game` に対してのみ呼び出されるべきである。
     * そうでない場合、このメソッドの動作は不定である。
     *
     * このメソッドで保存されたスナップショットは、
     * main スクリプト (ゲーム開始時に最初に実行されるスクリプト) の関数に、
     * 引数 (の `snapshot` プロパティ) として与えられる場合がある。
     * (e.g. マルチプレイのゲームプレイ画面を途中から開いた場合)
     * スナップショットが与えられた場合、ゲームはそのスナップショットから保存時の実行状態を復元しなければならない。
     *
     * @param snapshot 保存するスナップショット。JSONとして妥当な値でなければならない。
     * @param timestamp 保存時の時刻。 `g.TimestampEvent` を利用するゲームの場合、それらと同じ基準の時間情報を与えなければならない。
     * @deprecated 非推奨である。互換性のために残されているが、この関数では適切なタイミングのスナップショット保存ができない場合がある。代わりに `requestSaveSnapshot()` を利用すること。
     */
    Game.prototype.saveSnapshot = function (snapshot, timestamp) {
        this.handlerSet.saveSnapshot(this.age, snapshot, this.random.serialize(), this._idx, timestamp);
    };
    /**
     * スナップショットを保存する。
     *
     * (`saveSnapshot()` と同じ機能だが、インターフェースが異なる。こちらを利用すること。)
     *
     * 引数として与えた関数 `func()` がフレームの終了時に呼び出される。
     * エンジンは、`func()` の返した値に基づいて、実行環境にスナップショットの保存を要求する。
     *
     * 保存されたスナップショットは、必要に応じてゲームの起動時に与えられる。
     * 詳細は `g.GameMainParameterObject` を参照のこと。
     *
     * このメソッドを 1 フレーム中に複数回呼び出した場合、引数に与えた関数 `func()` の呼び出し順は保証されない。
     * (スナップショットはフレームごとに定まるので、1フレーム中に複数回呼び出す必要はない。)
     *
     * @param func フレーム終了時に呼び出す関数。 `SnapshotSaveRequest` を返した場合、スナップショット保存が要求される。
     * @param owner func の呼び出し時に `this` として使われる値。指定しなかった場合、 `undefined` 。
     */
    Game.prototype.requestSaveSnapshot = function (func, owner) {
        var _this = this;
        // 他の箇所と異なり push でなく unshift しているのは、他の処理 (シーン遷移処理) と重なった時に先行するため。
        // 効率はよくないが、このメソッドの利用頻度は高くないので許容。
        this._postTickTasks.unshift({
            type: 3 /* Call */,
            fun: function () {
                if (!_this.handlerSet.shouldSaveSnapshot())
                    return;
                var req = func.call(owner);
                if (!req)
                    return; // (null に限らず) falsy は全部弾く。空の値を保存しても不具合の温床にしかならないため。
                _this.handlerSet.saveSnapshot(_this.age, req.snapshot, _this.random.serialize(), _this._idx, req.timestamp);
            },
            owner: null
        });
    };
    /**
     * 現在時刻を取得する。
     *
     * 値は1970-01-01T00:00:00Zからのミリ秒での経過時刻である。
     * `Date.now()` と異なり、この値は消化されたティックの数から算出される擬似的な時刻である。
     */
    Game.prototype.getCurrentTime = function () {
        return this.handlerSet.getCurrentTime();
    };
    /**
     * このインスタンスがアクティブインスタンスであるかどうか返す。
     *
     * ゲーム開発者は、この値の真偽に起因する処理で、ゲームのローカルな実行状態を変更してはならず、
     * `raiseEvent()` などによって、グローバルな状態を更新する必要がある。
     */
    Game.prototype.isActiveInstance = function () {
        return this.handlerSet.getInstanceType() === "active";
    };
    /**
     * @ignore
     */
    Game.prototype._pushPostTickTask = function (fun, owner) {
        this._postTickTasks.push({
            type: 3 /* Call */,
            fun: fun,
            owner: owner
        });
    };
    /**
     * @private
     */
    Game.prototype._normalizeConfiguration = function (gameConfiguration) {
        if (!gameConfiguration)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: invalid arguments");
        if (gameConfiguration.assets == null)
            gameConfiguration.assets = {};
        if (gameConfiguration.fps == null)
            gameConfiguration.fps = 30;
        if (typeof gameConfiguration.fps !== "number")
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: fps must be given as a number");
        if (!(0 <= gameConfiguration.fps && gameConfiguration.fps <= 60))
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: fps must be a number in (0, 60].");
        if (typeof gameConfiguration.width !== "number")
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: width must be given as a number");
        if (typeof gameConfiguration.height !== "number")
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: height must be given as a number");
        return gameConfiguration;
    };
    /**
     * @private
     */
    Game.prototype._setAudioPlaybackRate = function (playbackRate) {
        this.audio._setPlaybackRate(playbackRate);
    };
    /**
     * @private
     */
    Game.prototype._setMuted = function (muted) {
        this.audio._setMuted(muted);
    };
    /**
     * g.OperationEventのデータをデコードする。
     * @private
     */
    Game.prototype._decodeOperationPluginOperation = function (code, op) {
        var plugin = this.operationPluginManager.plugins[code];
        if (!plugin || !plugin.decode)
            return op;
        return plugin.decode(op);
    };
    /**
     * ゲーム状態のリセット。
     * @private
     */
    Game.prototype._reset = function (param) {
        this.operationPluginManager.stopAll();
        if (this.scene()) {
            while (this.scene() !== this._initialScene) {
                this.popScene();
                this._flushPostTickTasks();
            }
            if (!this.isLoaded) {
                // _initialSceneの読み込みが終わっていない: _initialScene自体は使い回すので単にpopする。
                this.scenes.pop();
            }
        }
        if (this._skippingScene && !this._skippingScene.destroyed()) {
            this._skippingScene.destroy();
        }
        if (param) {
            if (param.age !== undefined)
                this.age = param.age;
            if (param.nextEntityId !== undefined)
                this._idx = param.nextEntityId;
            if (param.randGenSer !== undefined) {
                this.random = XorshiftRandomGenerator_1.XorshiftRandomGenerator.deserialize(param.randGenSer);
            }
            else if (param.randSeed !== undefined) {
                this.random = new XorshiftRandomGenerator_1.XorshiftRandomGenerator(param.randSeed);
            }
        }
        this.audio._reset();
        this._onLoad.removeAll({ func: this._handleLoad, owner: this });
        this.onJoin.removeAll();
        this.onLeave.removeAll();
        this.onSeed.removeAll();
        this.onResized.removeAll();
        this.onSkipChange.removeAll();
        this.onSceneChange.removeAll();
        this.handlerSet.removeAllEventFilters();
        this.isSkipping = false;
        this.onSkipChange.add(this._handleSkipChange, this);
        this.joinedPlayerIds = [];
        this.onJoin.add(this._handleJoinEvent, this);
        this.onLeave.add(this._handleLeaveEvent, this);
        this._idx = 0;
        this._localIdx = 0;
        this._cameraIdx = 0;
        this.db = {};
        this._localDb = {};
        this._modified = true;
        this.loadingScene = undefined;
        this._skippingScene = undefined;
        this._focusingCamera = undefined;
        this.lastLocalTickMode = null;
        this.lastTickGenerationMode = null;
        this.onSnapshotRequest.removeAll();
        this._postTickTasks = [];
        this._eventConverter = new EventConverter_1.EventConverter({ game: this, playerId: this.selfId }); // TODO: selfId が null のときの挙動
        this._pointEventResolver = new PointEventResolver_1.PointEventResolver({ sourceResolver: this, playerId: this.selfId }); // TODO: selfId が null のときの挙動
        // ES5だとNumber.MAX_SAFE_INTEGERは使えないのでその値(9007199254740991)を直接かける
        this.localRandom = new XorshiftRandomGenerator_1.XorshiftRandomGenerator(Math.floor(9007199254740991 * Math.random()));
        this._isTerminated = false;
        this.vars = {};
        this._moduleManager = new ModuleManager_1.ModuleManager(this._runtimeValueBase, this._assetManager);
        this.surfaceAtlasSet.destroy();
        this.surfaceAtlasSet = new SurfaceAtlasSet_1.SurfaceAtlasSet({ resourceFactory: this.resourceFactory });
        switch (this._configuration.defaultLoadingScene) {
            case "none":
                // Note: 何も描画しない実装として利用している
                this._defaultLoadingScene = new LoadingScene_1.LoadingScene({ game: this });
                break;
            case "compact":
                this._defaultLoadingScene = new DefaultLoadingScene_1.DefaultLoadingScene({ game: this, style: "compact" });
                break;
            default:
                this._defaultLoadingScene = new DefaultLoadingScene_1.DefaultLoadingScene({ game: this });
                break;
        }
        switch (this._configuration.defaultSkippingScene) {
            case "none":
                this._defaultSkippingScene = new DefaultSkippingScene_1.DefaultSkippingScene({ game: this, style: "none" });
                break;
            case "indicator":
                this._defaultSkippingScene = new DefaultSkippingScene_1.DefaultSkippingScene({ game: this, style: "indicator" });
                break;
            default:
                this._defaultSkippingScene = undefined;
                break;
        }
    };
    /**
     * ゲームを破棄する。
     * エンジンユーザとコンテンツに開放された一部プロパティ(external, vars)は維持する点に注意。
     * @private
     */
    Game.prototype._destroy = function () {
        // ユーザコードを扱う操作プラグインを真っ先に破棄
        this.operationPluginManager.destroy();
        // 到達できるシーンを全て破棄
        if (this.scene()) {
            while (this.scene() !== this._initialScene) {
                this.popScene();
                this._flushPostTickTasks();
            }
        }
        this._initialScene.destroy();
        if (this.loadingScene && !this.loadingScene.destroyed()) {
            this.loadingScene.destroy();
        }
        if (!this._defaultLoadingScene.destroyed()) {
            this._defaultLoadingScene.destroy();
        }
        if (this._defaultSkippingScene && !this._defaultSkippingScene.destroyed()) {
            this._defaultSkippingScene.destroy();
        }
        if (this._skippingScene && !this._skippingScene.destroyed()) {
            this._skippingScene.destroy();
        }
        // NOTE: fps, width, height, external, vars はそのまま保持しておく
        this.db = undefined;
        this.renderers = undefined;
        this.scenes = undefined;
        this.random = undefined;
        this._modified = false;
        this.age = 0;
        this.assets = undefined; // this._initialScene.assets のエイリアスなので、特に破棄処理はしない。
        this.isLoaded = false;
        this.loadingScene = undefined;
        this.assetBase = "";
        this.selfId = undefined;
        this.audio.music.stopAll();
        this.audio.sound.stopAll();
        this.audio = undefined;
        this.defaultAudioSystemId = undefined;
        this.handlerSet = undefined;
        this.localRandom = undefined;
        this.onJoin.destroy();
        this.onJoin = undefined;
        this.onLeave.destroy();
        this.onLeave = undefined;
        this.onSeed.destroy();
        this.onSeed = undefined;
        this.onPlayerInfo.destroy();
        this.onPlayerInfo = undefined;
        this.onResized.destroy();
        this.onResized = undefined;
        this.onSkipChange.destroy();
        this.onSkipChange = undefined;
        this.onSceneChange.destroy();
        this.onSceneChange = undefined;
        this.onSnapshotRequest.destroy();
        this.onSnapshotRequest = undefined;
        this.join = undefined;
        this.leave = undefined;
        this.seed = undefined;
        this.playerInfo = undefined;
        this.snapshotRequest = undefined;
        this.resized = undefined;
        this.skippingChanged = undefined;
        this._sceneChanged = undefined;
        this._loaded = undefined;
        this._started = undefined;
        this._operationPluginOperated = undefined;
        this._onSceneChange.destroy();
        this._onSceneChange = undefined;
        this._onLoad.destroy();
        this._onLoad = undefined;
        this._onStart.destroy();
        this._onStart = undefined;
        // TODO より能動的にdestroy処理を入れるべきかもしれない
        this.resourceFactory = undefined;
        this.storage = undefined;
        this.playId = undefined;
        this.operationPlugins = undefined; // this._operationPluginManager.pluginsのエイリアスなので、特に破棄処理はしない。
        this._eventTriggerMap = undefined;
        this._initialScene = undefined;
        this._defaultLoadingScene = undefined;
        this._main = undefined;
        this._mainFunc = undefined;
        this._mainParameter = undefined;
        this._assetManager.destroy();
        this._assetManager = undefined;
        this._eventConverter = undefined;
        this._pointEventResolver = undefined;
        this.operationPluginManager = undefined;
        this._onOperationPluginOperated.destroy();
        this._onOperationPluginOperated = undefined;
        this._idx = 0;
        this._localDb = {};
        this._localIdx = 0;
        this._cameraIdx = 0;
        this._isTerminated = true;
        this._focusingCamera = undefined;
        this._skippingScene = undefined;
        this._configuration = undefined;
        this._postTickTasks = [];
        this.surfaceAtlasSet.destroy();
        this.surfaceAtlasSet = undefined;
        this._moduleManager = undefined;
    };
    /**
     * ゲームを開始する。
     *
     * 存在するシーンをすべて(_initialScene以外; あるなら)破棄し、グローバルアセットを読み込み、完了後ゲーム開発者の実装コードの実行を開始する。
     * このメソッドの二度目以降の呼び出しの前には、 `this._reset()` を呼び出す必要がある。
     * @param param ゲームのエントリポイントに渡す値
     * @private
     */
    Game.prototype._loadAndStart = function (param) {
        this._mainParameter = param || {};
        if (!this.isLoaded) {
            this._onLoad.add(this._handleLoad, this);
            this.pushScene(this._initialScene);
            this._flushPostTickTasks();
        }
        else {
            this._handleLoad();
        }
    };
    /**
     * グローバルアセットの読み込みを開始する。
     * 単体テスト用 (mainSceneなど特定アセットの存在を前提にする_loadAndStart()はテストに使いにくい) なので、通常ゲーム開発者が利用することはない
     * @private
     */
    Game.prototype._startLoadingGlobalAssets = function () {
        if (this.isLoaded)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_startLoadingGlobalAssets: already loaded.");
        this.pushScene(this._initialScene);
        this._flushPostTickTasks();
    };
    /**
     * @private
     */
    Game.prototype._updateEventTriggers = function (scene) {
        this._modified = true;
        if (!scene) {
            this._eventTriggerMap.message = undefined;
            this._eventTriggerMap["point-down"] = undefined;
            this._eventTriggerMap["point-move"] = undefined;
            this._eventTriggerMap["point-up"] = undefined;
            this._eventTriggerMap.operation = undefined;
            return;
        }
        this._eventTriggerMap.message = scene.onMessage;
        this._eventTriggerMap["point-down"] = scene.onPointDownCapture;
        this._eventTriggerMap["point-move"] = scene.onPointMoveCapture;
        this._eventTriggerMap["point-up"] = scene.onPointUpCapture;
        this._eventTriggerMap.operation = scene.onOperation;
        scene._activate();
    };
    /**
     * @private
     */
    Game.prototype._handleInitialSceneLoad = function () {
        this._initialScene.onLoad.remove(this._handleInitialSceneLoad, this);
        this.assets = this._initialScene.assets;
        this.isLoaded = true;
        this._onLoad.fire(this);
    };
    /**
     * @ignore
     */
    Game.prototype._handleOperationPluginOperated = function (op) {
        var pev = this._eventConverter.makePlaylogOperationEvent(op);
        this.handlerSet.raiseEvent(pev);
    };
    /**
     * @ignore
     */
    Game.prototype._handleSceneChanged = function (scene) {
        this._updateEventTriggers(scene);
        var local = scene ? scene.local : "full-local";
        var tickGenerationMode = scene ? scene.tickGenerationMode : "by-clock";
        if (this.lastLocalTickMode === local && this.lastTickGenerationMode === tickGenerationMode) {
            return;
        }
        this.lastLocalTickMode = local;
        this.lastTickGenerationMode = tickGenerationMode;
        this.handlerSet.changeSceneMode({
            local: local,
            tickGenerationMode: tickGenerationMode
        });
    };
    /**
     * @ignore
     */
    Game.prototype._handleSkippingSceneReady = function (scene) {
        this._pushPostTickTask(scene._fireLoaded, scene);
    };
    /**
     * @private
     */
    Game.prototype._terminateGame = function () {
        // do nothing.
    };
    /**
     * post-tick タスクを実行する。
     *
     * `pushScene()` などのシーン遷移や `_pushPostTickTask()` によって要求された post-tick タスクを実行する。
     * 通常このメソッドは、毎フレーム一度、フレームの最後に呼び出されることを期待する (`Game#tick()` がこの呼び出しを行う)。
     * ただしゲーム開始時 (グローバルアセット読み込み・スナップショットローダ起動後またはmainScene実行開始時) に関しては、
     * シーン追加がゲーム開発者の記述によらない (`tick()` の外側である) ため、それぞれの箇所で明示的にこのメソッドを呼び出す。
     * @private
     */
    Game.prototype._flushPostTickTasks = function () {
        do {
            var reqs = this._postTickTasks;
            this._postTickTasks = [];
            for (var i = 0; i < reqs.length; ++i) {
                var req = reqs[i];
                switch (req.type) {
                    case 0 /* PushScene */:
                        var oldScene = this.scene();
                        if (oldScene) {
                            oldScene._deactivate();
                        }
                        this._doPushScene(req.scene);
                        break;
                    case 1 /* ReplaceScene */:
                        // NOTE: アセットの不要なロードを防ぐため、あらかじめ遷移先のシーンのアセットを先読みする。
                        req.scene.prefetch();
                        // NOTE: replaceSceneの場合、pop時点では_sceneChangedをfireしない。_doPushScene() で一度だけfireする。
                        this._doPopScene(req.preserveCurrent, false);
                        this._doPushScene(req.scene);
                        break;
                    case 2 /* PopScene */:
                        this._doPopScene(req.preserveCurrent, true);
                        break;
                    case 3 /* Call */:
                        req.fun.call(req.owner);
                        break;
                    default:
                        throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_flushPostTickTasks: unknown post-tick task type.");
                }
            }
        } while (this._postTickTasks.length > 0); // flush中に追加される限りflushを続行する
    };
    /**
     * @ignore
     */
    Game.prototype._handleSkipChange = function (isSkipping) {
        var _a;
        this.isSkipping = isSkipping;
        if (isSkipping) {
            var skippingScene = (_a = this._skippingScene) !== null && _a !== void 0 ? _a : this._defaultSkippingScene;
            if (skippingScene && !skippingScene._loaded) {
                skippingScene._load();
                skippingScene._onReady.addOnce(this._handleSkippingSceneReady, this);
            }
        }
    };
    /**
     * @ignore
     */
    Game.prototype._handleJoinEvent = function (event) {
        if (!event.player.id || this.joinedPlayerIds.indexOf(event.player.id) !== -1) {
            return;
        }
        this.joinedPlayerIds.push(event.player.id);
    };
    /**
     * @ignore
     */
    Game.prototype._handleLeaveEvent = function (event) {
        this.joinedPlayerIds = this.joinedPlayerIds.filter(function (id) { return id !== event.player.id; });
    };
    Game.prototype._doPopScene = function (preserveCurrent, fireSceneChanged) {
        var scene = this.scenes.pop();
        if (!scene)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_doPopScene: invalid call; scene stack underflow");
        if (scene === this._initialScene)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_doPopScene: invalid call; attempting to pop the initial scene");
        if (!preserveCurrent)
            scene.destroy();
        if (fireSceneChanged) {
            var nextScene = this.scene();
            this.onSceneChange.fire(nextScene);
            this._onSceneChange.fire(nextScene);
        }
    };
    Game.prototype._handleLoad = function () {
        this.operationPluginManager.initialize();
        this.operationPlugins = this.operationPluginManager.plugins;
        if (this._mainFunc) {
            this._mainFunc(this._runtimeValueBase, this._mainParameter || {});
        }
        else if (this._main) {
            var mainFun = this._moduleManager._require(this._main);
            if (!mainFun || typeof mainFun !== "function")
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_handleLoad: Entry point ".concat(this._main, " not found."));
            mainFun(this._mainParameter);
        }
        else {
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_handleLoad: does not have an entry point");
        }
        this._flushPostTickTasks(); // シーン遷移を要求する可能性がある(というかまずする)
        this._onStart.fire();
    };
    Game.prototype._doPushScene = function (scene, loadingScene) {
        if (!loadingScene)
            loadingScene = this.loadingScene || this._defaultLoadingScene;
        this.scenes.push(scene);
        if (scene._needsLoading() && scene._loadingState !== "loaded-fired") {
            if (this._defaultLoadingScene._needsLoading())
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Game#_doPushScene: _defaultLoadingScene must not depend on any assets/storages.");
            this._doPushScene(loadingScene, this._defaultLoadingScene);
            loadingScene.reset(scene);
        }
        else {
            this.onSceneChange.fire(scene);
            this._onSceneChange.fire(scene);
            // 読み込み待ちのアセットがなければその場で(loadingSceneに任せず)ロード、SceneReadyを発生させてからLoadingSceneEndを起こす。
            if (!scene._loaded) {
                scene._load();
                this._pushPostTickTask(scene._fireLoaded, scene);
            }
        }
        this._modified = true;
    };
    return Game;
}());
exports.Game = Game;

},{"./AssetManager":4,"./AudioSystemManager":7,"./DefaultLoadingScene":12,"./DefaultSkippingScene":13,"./EventConverter":18,"./ExceptionFactory":23,"./LoadingScene":29,"./ModuleManager":33,"./OperationPluginManager":37,"./PointEventResolver":42,"./Scene":47,"./Storage":52,"./SurfaceAtlasSet":54,"./XorshiftRandomGenerator":67,"@akashic/trigger":126}],26:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],27:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],28:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],29:[function(require,module,exports){
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
exports.LoadingScene = void 0;
var trigger_1 = require("@akashic/trigger");
var ExceptionFactory_1 = require("./ExceptionFactory");
var Scene_1 = require("./Scene");
/**
 * Assetの読み込み中に表示されるシーン。
 *
 * 本シーンは通常のシーンと異なり、ゲーム内時間(`Game#age`)と独立に実行される。
 * アセットやストレージデータを読み込んでいる間、ゲーム内時間が進んでいない状態でも、
 * `LoadingScene` は画面に変化を与えることができる(`update` がfireされる)。
 *
 * ゲーム開発者は、ローディング中の演出を実装した独自の `LoadingScene` を
 * `Game#loadingScene` に代入することでエンジンに利用させることができる。
 *
 * ゲーム内時間と独立に処理される `LoadingScene` での処理には再現性がない(他プレイヤーと状態が共有されない)。
 * そのため `Game` に対して副作用のある操作を行ってはならない点に注意すること。
 */
var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    /**
     * `LoadingScene` のインスタンスを生成する。
     * @param param 初期化に用いるパラメータのオブジェクト
     */
    function LoadingScene(param) {
        var _this = this;
        param.local = true; // LoadingScene は強制的にローカルにする
        _this = _super.call(this, param) || this;
        _this.onTargetReset = new trigger_1.Trigger();
        _this.onTargetReady = new trigger_1.Trigger();
        _this.onTargetAssetLoad = new trigger_1.Trigger();
        _this.targetReset = _this.onTargetReset;
        _this.targetReady = _this.onTargetReady;
        _this.targetAssetLoaded = _this.onTargetAssetLoad;
        _this._explicitEnd = !!param.explicitEnd;
        _this._targetScene = undefined;
        return _this;
    }
    LoadingScene.prototype.destroy = function () {
        this._clearTargetScene();
        _super.prototype.destroy.call(this);
    };
    /**
     * アセットロード待ち対象シーンを変更する。
     *
     * このメソッドは、新たにシーンのロード待ちが必要になった場合にエンジンによって呼び出される。
     * (派生クラスはこの処理をオーバーライドしてもよいが、その場合その中で
     * このメソッド自身 (`g.LoadingScene.prototype.reset`) を呼び出す (`call()` する) 必要がある。)
     *
     * @param targetScene アセットロード待ちが必要なシーン
     */
    LoadingScene.prototype.reset = function (targetScene) {
        this._clearTargetScene();
        this._targetScene = targetScene;
        if (this._loadingState !== "loaded-fired") {
            this.onLoad.addOnce(this._doReset, this);
        }
        else {
            this._doReset();
        }
    };
    /**
     * アセットロード待ち対象シーンの残りのロード待ちアセット数を取得する。
     */
    LoadingScene.prototype.getTargetWaitingAssetsCount = function () {
        return this._targetScene ? this._targetScene._sceneAssetHolder.waitingAssetsCount : 0;
    };
    /**
     * ローディングシーンを終了する。
     *
     * `Scene#end()` と異なり、このメソッドの呼び出しはこのシーンを破棄しない。(ローディングシーンは再利用される。)
     * このメソッドが呼び出される時、 `targetReady` がfireされた後でなければならない。
     */
    LoadingScene.prototype.end = function () {
        if (!this._targetScene || this._targetScene._loadingState === "initial") {
            var state = this._targetScene ? this._targetScene._loadingState : "(no scene)";
            var msg = "LoadingScene#end(): the target scene is in invalid state: " + state;
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError(msg);
        }
        this.game.popScene(true);
        this.game._pushPostTickTask(this._targetScene._fireLoaded, this._targetScene);
        this._clearTargetScene();
    };
    /**
     * @private
     */
    LoadingScene.prototype._clearTargetScene = function () {
        if (!this._targetScene)
            return;
        this._targetScene._onReady.removeAll({ owner: this });
        this._targetScene.onAssetLoad.removeAll({ owner: this });
        this._targetScene = undefined;
    };
    /**
     * @private
     */
    LoadingScene.prototype._doReset = function () {
        this.onTargetReset.fire(this._targetScene);
        if (this._targetScene._loadingState === "initial" || this._targetScene._loadingState === "ready") {
            this._targetScene._onReady.add(this._handleReady, this);
            this._targetScene.onAssetLoad.add(this._handleAssetLoad, this);
            this._targetScene._load();
        }
        else {
            this._handleReady(this._targetScene);
        }
    };
    /**
     * @private
     */
    LoadingScene.prototype._handleAssetLoad = function (asset) {
        this.onTargetAssetLoad.fire(asset);
    };
    /**
     * @private
     */
    LoadingScene.prototype._handleReady = function (scene) {
        this.onTargetReady.fire(scene);
        if (!this._explicitEnd) {
            this.end();
        }
    };
    return LoadingScene;
}(Scene_1.Scene));
exports.LoadingScene = LoadingScene;

},{"./ExceptionFactory":23,"./Scene":47,"@akashic/trigger":126}],30:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainMatrix = void 0;
/**
 * 変換行列を一般的なJavaScriptのみで表したクラス。
 * 通常ゲーム開発者が本クラスを直接利用する事はない。
 * 各フィールド、メソッドの詳細は `Matrix` インターフェースの説明を参照。
 */
var PlainMatrix = /** @class */ (function () {
    function PlainMatrix(widthOrSrc, height, scaleX, scaleY, angle, anchorX, anchorY) {
        // TODO: (GAMEDEV-845) Float32Arrayの方が速いらしいので、polyfillして使うかどうか検討
        if (widthOrSrc === undefined) {
            this._modified = false;
            this._matrix = [1, 0, 0, 1, 0, 0];
        }
        else if (typeof widthOrSrc === "number") {
            this._modified = false;
            this._matrix = new Array(6);
            // @ts-ignore
            this.update(widthOrSrc, height, scaleX, scaleY, angle, 0, 0, anchorX, anchorY);
        }
        else {
            this._modified = widthOrSrc._modified;
            this._matrix = [
                widthOrSrc._matrix[0],
                widthOrSrc._matrix[1],
                widthOrSrc._matrix[2],
                widthOrSrc._matrix[3],
                widthOrSrc._matrix[4],
                widthOrSrc._matrix[5]
            ];
        }
    }
    PlainMatrix.prototype.update = function (width, height, scaleX, scaleY, angle, x, y, anchorX, anchorY) {
        if (anchorX == null || anchorY == null) {
            this._updateWithoutAnchor(width, height, scaleX, scaleY, angle, x, y);
            return;
        }
        // ここで求める変換行列Mは、引数で指定された変形を、拡大・回転・平行移動の順に適用するものである。
        // 変形の原点は (anchorX * width, anchorY * height) である。従って
        //    M = A^-1 T R S A
        // である。ただしここでA, S, R, Tは、それぞれ以下を表す変換行列である:
        //    A: アンカーを原点に移す(平行移動する)変換
        //    S: X軸方向にscaleX倍、Y軸方向にscaleY倍する変換
        //    R: angle度だけ回転する変換
        //    T: x, yの値だけ平行移動する変換
        // それらは次のように表せる:
        //           1    0   -w           sx    0    0            c   -s    0            1    0    x
        //    A = [  0    1   -h]    S = [  0   sy    0]    R = [  s    c    0]    T = [  0    1    y]
        //           0    0    1            0    0    1            0    0    1            0    0    1
        // ここで sx, sy は scaleX, scaleY であり、c, s は cos(theta), sin(theta)
        // (ただし theta = angle * PI / 180)、w = anchorX * width, h = anchorY * height である。
        // 以下の実装は、M の各要素をそれぞれ計算して直接求めている。
        var r = (angle * Math.PI) / 180;
        var _cos = Math.cos(r);
        var _sin = Math.sin(r);
        var a = _cos * scaleX;
        var b = _sin * scaleX;
        var c = _sin * scaleY;
        var d = _cos * scaleY;
        var w = anchorX * width;
        var h = anchorY * height;
        this._matrix[0] = a;
        this._matrix[1] = b;
        this._matrix[2] = -c;
        this._matrix[3] = d;
        this._matrix[4] = -a * w + c * h + x;
        this._matrix[5] = -b * w - d * h + y;
    };
    /**
     * このメソッドは anchorX, anchorY が存在しなかった当時との互換性のため存在する。将来この互換性を破棄する時に削除する予定である。
     * @private
     */
    PlainMatrix.prototype._updateWithoutAnchor = function (width, height, scaleX, scaleY, angle, x, y) {
        // ここで求める変換行列Mは、引数で指定された変形を、拡大・回転・平行移動の順に適用するものである。
        // 変形の原点は引数で指定された矩形の中心、すなわち (width/2, height/2) の位置である。従って
        //    M = A^-1 T R S A
        // である。ただしここでA, S, R, Tは、それぞれ以下を表す変換行列である:
        //    A: 矩形の中心を原点に移す(平行移動する)変換
        //    S: X軸方向にscaleX倍、Y軸方向にscaleY倍する変換
        //    R: angle度だけ回転する変換
        //    T: x, yの値だけ平行移動する変換
        // それらは次のように表せる:
        //           1    0   -w           sx    0    0            c   -s    0            1    0    x
        //    A = [  0    1   -h]    S = [  0   sy    0]    R = [  s    c    0]    T = [  0    1    y]
        //           0    0    1            0    0    1            0    0    1            0    0    1
        // ここで sx, sy は scaleX, scaleY であり、c, s は cos(theta), sin(theta)
        // (ただし theta = angle * PI / 180)、w = (width / 2), h = (height / 2) である。
        // 以下の実装は、M の各要素をそれぞれ計算して直接求めている。
        var r = (angle * Math.PI) / 180;
        var _cos = Math.cos(r);
        var _sin = Math.sin(r);
        var a = _cos * scaleX;
        var b = _sin * scaleX;
        var c = _sin * scaleY;
        var d = _cos * scaleY;
        var w = width / 2;
        var h = height / 2;
        this._matrix[0] = a;
        this._matrix[1] = b;
        this._matrix[2] = -c;
        this._matrix[3] = d;
        this._matrix[4] = -a * w + c * h + w + x;
        this._matrix[5] = -b * w - d * h + h + y;
    };
    PlainMatrix.prototype.updateByInverse = function (width, height, scaleX, scaleY, angle, x, y, anchorX, anchorY) {
        if (anchorX == null || anchorY == null) {
            this._updateByInverseWithoutAnchor(width, height, scaleX, scaleY, angle, x, y);
            return;
        }
        // ここで求める変換行列は、update() の求める行列Mの逆行列、M^-1である。update() のコメントに記述のとおり、
        //    M = A^-1 T R S A
        // であるから、
        //    M^-1 = A^-1 S^-1 R^-1 T^-1 A
        // それぞれは次のように表せる:
        //              1    0    w             1/sx     0    0               c    s    0               1    0   -x+w
        //    A^-1 = [  0    1    h]    S^-1 = [   0  1/sy    0]    R^-1 = [ -s    c    0]    T^-1 = [  0    1   -y+h]
        //              0    0    1                0     0    1               0    0    1               0    0    1
        // ここで各変数は update() のコメントのものと同様である。
        // 以下の実装は、M^-1 の各要素をそれぞれ計算して直接求めている。
        var r = (angle * Math.PI) / 180;
        var _cos = Math.cos(r);
        var _sin = Math.sin(r);
        var a = _cos / scaleX;
        var b = _sin / scaleY;
        var c = _sin / scaleX;
        var d = _cos / scaleY;
        var w = anchorX * width;
        var h = anchorY * height;
        this._matrix[0] = a;
        this._matrix[1] = -b;
        this._matrix[2] = c;
        this._matrix[3] = d;
        this._matrix[4] = -a * x - c * y + w;
        this._matrix[5] = b * x - d * y + h;
    };
    /**
     * このメソッドは anchorX, anchorY が存在しなかった当時との互換性のため存在する。将来この互換性を破棄する時に削除する予定である。
     * @private
     */
    PlainMatrix.prototype._updateByInverseWithoutAnchor = function (width, height, scaleX, scaleY, angle, x, y) {
        // ここで求める変換行列は、update() の求める行列Mの逆行列、M^-1である。update() のコメントに記述のとおり、
        //    M = A^-1 T R S A
        // であるから、
        //    M^-1 = A^-1 S^-1 R^-1 T^-1 A
        // それぞれは次のように表せる:
        //              1    0    w             1/sx     0    0               c    s    0               1    0   -x
        //    A^-1 = [  0    1    h]    S^-1 = [   0  1/sy    0]    R^-1 = [ -s    c    0]    T^-1 = [  0    1   -y]
        //              0    0    1                0     0    1               0    0    1               0    0    1
        // ここで各変数は update() のコメントのものと同様である。
        // 以下の実装は、M^-1 の各要素をそれぞれ計算して直接求めている。
        var r = (angle * Math.PI) / 180;
        var _cos = Math.cos(r);
        var _sin = Math.sin(r);
        var a = _cos / scaleX;
        var b = _sin / scaleY;
        var c = _sin / scaleX;
        var d = _cos / scaleY;
        var w = width / 2;
        var h = height / 2;
        this._matrix[0] = a;
        this._matrix[1] = -b;
        this._matrix[2] = c;
        this._matrix[3] = d;
        this._matrix[4] = -a * (w + x) - c * (h + y) + w;
        this._matrix[5] = b * (w + x) - d * (h + y) + h;
    };
    PlainMatrix.prototype.multiply = function (matrix) {
        var m1 = this._matrix;
        var m2 = matrix._matrix;
        var m10 = m1[0];
        var m11 = m1[1];
        var m12 = m1[2];
        var m13 = m1[3];
        m1[0] = m10 * m2[0] + m12 * m2[1];
        m1[1] = m11 * m2[0] + m13 * m2[1];
        m1[2] = m10 * m2[2] + m12 * m2[3];
        m1[3] = m11 * m2[2] + m13 * m2[3];
        m1[4] = m10 * m2[4] + m12 * m2[5] + m1[4];
        m1[5] = m11 * m2[4] + m13 * m2[5] + m1[5];
    };
    PlainMatrix.prototype.multiplyLeft = function (matrix) {
        var m1 = matrix._matrix;
        var m2 = this._matrix;
        var m20 = m2[0];
        var m22 = m2[2];
        var m24 = m2[4];
        m2[0] = m1[0] * m20 + m1[2] * m2[1];
        m2[1] = m1[1] * m20 + m1[3] * m2[1];
        m2[2] = m1[0] * m22 + m1[2] * m2[3];
        m2[3] = m1[1] * m22 + m1[3] * m2[3];
        m2[4] = m1[0] * m24 + m1[2] * m2[5] + m1[4];
        m2[5] = m1[1] * m24 + m1[3] * m2[5] + m1[5];
    };
    PlainMatrix.prototype.multiplyNew = function (matrix) {
        var ret = this.clone();
        ret.multiply(matrix);
        return ret;
    };
    PlainMatrix.prototype.reset = function (x, y) {
        this._matrix[0] = 1;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 1;
        this._matrix[4] = x || 0;
        this._matrix[5] = y || 0;
    };
    PlainMatrix.prototype.clone = function () {
        return new PlainMatrix(this);
    };
    PlainMatrix.prototype.multiplyInverseForPoint = function (point) {
        var m = this._matrix;
        // id = inverse of the determinant
        var _id = 1 / (m[0] * m[3] + m[2] * -m[1]);
        return {
            x: m[3] * _id * point.x + -m[2] * _id * point.y + (m[5] * m[2] - m[4] * m[3]) * _id,
            y: m[0] * _id * point.y + -m[1] * _id * point.x + (-m[5] * m[0] + m[4] * m[1]) * _id
        };
    };
    PlainMatrix.prototype.scale = function (x, y) {
        var m = this._matrix;
        m[0] *= x;
        m[1] *= y;
        m[2] *= x;
        m[3] *= y;
        m[4] *= x;
        m[5] *= y;
    };
    PlainMatrix.prototype.multiplyPoint = function (point) {
        var m = this._matrix;
        var x = m[0] * point.x + m[2] * point.y + m[4];
        var y = m[1] * point.x + m[3] * point.y + m[5];
        return { x: x, y: y };
    };
    return PlainMatrix;
}());
exports.PlainMatrix = PlainMatrix;

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
var PathUtil_1 = require("./PathUtil");
/**
 * Node.js が提供する module の互換クラス。
 */
var Module = /** @class */ (function () {
    function Module(param) {
        var _this = this;
        var path = param.path;
        var dirname = PathUtil_1.PathUtil.resolveDirname(path);
        // `virtualPath` と `virtualDirname` は　`DynamicAsset` の場合は `undefined` になる。
        var virtualPath = param.virtualPath;
        var virtualDirname = virtualPath ? PathUtil_1.PathUtil.resolveDirname(virtualPath) : undefined;
        var requireFunc = param.requireFunc;
        var resolveFunc = param.resolveFunc;
        this._runtimeValue = Object.create(param.runtimeValueBase, {
            filename: {
                value: path,
                enumerable: true
            },
            dirname: {
                value: dirname,
                enumerable: true
            },
            module: {
                value: this,
                writable: true,
                enumerable: true,
                configurable: true
            }
        });
        this.id = param.id;
        this.filename = param.path;
        this.exports = {};
        this.parent = null; // Node.js と互換
        this.loaded = false;
        this.children = [];
        this.paths = virtualDirname ? PathUtil_1.PathUtil.makeNodeModulePaths(virtualDirname) : [];
        this._dirname = dirname;
        this._virtualDirname = virtualDirname;
        // メソッドとしてではなく単体で呼ばれるのでメソッドにせずここで実体を代入する
        var require = (function (path) {
            return requireFunc(path, _this);
        });
        require.resolve = function (path) {
            return resolveFunc(path, _this);
        };
        this.require = require;
    }
    return Module;
}());
exports.Module = Module;

},{"./PathUtil":40}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleManager = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
var Module_1 = require("./Module");
var PathUtil_1 = require("./PathUtil");
var RequireCachedValue_1 = require("./RequireCachedValue");
var ScriptAssetContext_1 = require("./ScriptAssetContext");
/**
 * `Module` を管理するクラス。
 * このクラスのインスタンスは `Game` に一つ存在し、スクリプトアセットの require() の解決に利用される。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 */
var ModuleManager = /** @class */ (function () {
    function ModuleManager(runtimeBase, assetManager) {
        this._assetManager = assetManager;
        this._runtimeValueBase = runtimeBase;
        this._scriptCaches = {};
    }
    /**
     * node.js の require() ライクな読み込み処理を行い、その結果を返す。
     *
     * node.jsのrequireに限りなく近いモデルでrequireする。
     * ただしアセットIDで該当すればそちらを優先する。また node.js のコアモジュールには対応していない。
     * 通常、ゲーム開発者が利用するのは `Module#require()` であり、このメソッドはその内部実装を提供する。
     *
     * @ignore
     * @param path requireのパス。相対パスと、Asset識別名を利用することが出来る。
     *              なお、./xxx.json のようにjsonを指定する場合、そのAssetはTextAssetである必要がある。
     *              その他の形式である場合、そのAssetはScriptAssetである必要がある。
     * @param currentModule このrequireを実行した Module
     * @returns {any} スクリプト実行結果。通常はScriptAsset#executeの結果。
     *                 例外的に、jsonであればTextAsset#dataをJSON.parseした結果が返る
     */
    ModuleManager.prototype._require = function (path, currentModule) {
        // Node.js の require の挙動については http://nodejs.jp/nodejs.org_ja/api/modules.html も参照。
        var _this = this;
        var targetScriptAsset;
        var resolvedPath;
        var liveAssetVirtualPathTable = this._assetManager._liveAssetVirtualPathTable;
        var moduleMainScripts = this._assetManager._moduleMainScripts;
        // 0. アセットIDらしい場合はまず当該アセットを探す
        if (path.indexOf("/") === -1) {
            if (this._assetManager._assets.hasOwnProperty(path)) {
                targetScriptAsset = this._assetManager._assets[path];
                resolvedPath = this._assetManager._liveAssetPathTable[targetScriptAsset.path];
            }
        }
        // 1. If X is a core module,
        // (何もしない。コアモジュールには対応していない。ゲーム開発者は自分でコアモジュールへの依存を解決する必要がある)
        if (/^\.\/|^\.\.\/|^\//.test(path)) {
            // 2. If X begins with './' or '/' or '../'
            if (currentModule) {
                if (!currentModule._virtualDirname)
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("g._require: require from modules without virtualPath is not supported");
                resolvedPath = PathUtil_1.PathUtil.resolvePath(currentModule._virtualDirname, path);
            }
            else {
                if (!/^\.\//.test(path))
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("g._require: entry point path must start with './'");
                resolvedPath = path.substring(2);
            }
            if (this._scriptCaches.hasOwnProperty(resolvedPath)) {
                return this._scriptCaches[resolvedPath]._cachedValue();
            }
            else if (this._scriptCaches.hasOwnProperty(resolvedPath + ".js")) {
                return this._scriptCaches[resolvedPath + ".js"]._cachedValue();
            }
            // 2.a. LOAD_AS_FILE(Y + X)
            if (!targetScriptAsset)
                targetScriptAsset = this._findAssetByPathAsFile(resolvedPath, liveAssetVirtualPathTable);
            // 2.b. LOAD_AS_DIRECTORY(Y + X)
            if (!targetScriptAsset)
                targetScriptAsset = this._findAssetByPathAsDirectory(resolvedPath, liveAssetVirtualPathTable);
        }
        else {
            // 3. LOAD_NODE_MODULES(X, dirname(Y))
            // `path` は node module の名前であると仮定して探す
            // akashic-engine独自仕様: 対象の `path` が `moduleMainScripts` に指定されていたらそちらを参照する
            if (moduleMainScripts[path]) {
                resolvedPath = moduleMainScripts[path];
                targetScriptAsset = liveAssetVirtualPathTable[resolvedPath];
            }
            if (!targetScriptAsset) {
                var dirs = currentModule ? currentModule.paths : [];
                dirs.push("node_modules");
                for (var i = 0; i < dirs.length; ++i) {
                    var dir = dirs[i];
                    resolvedPath = PathUtil_1.PathUtil.resolvePath(dir, path);
                    targetScriptAsset = this._findAssetByPathAsFile(resolvedPath, liveAssetVirtualPathTable);
                    if (targetScriptAsset)
                        break;
                    targetScriptAsset = this._findAssetByPathAsDirectory(resolvedPath, liveAssetVirtualPathTable);
                    if (targetScriptAsset)
                        break;
                }
            }
        }
        if (targetScriptAsset) {
            // @ts-ignore
            if (this._scriptCaches.hasOwnProperty(resolvedPath))
                return this._scriptCaches[resolvedPath]._cachedValue();
            if (targetScriptAsset.type === "script") {
                var module = new Module_1.Module({
                    runtimeValueBase: this._runtimeValueBase,
                    id: targetScriptAsset.id,
                    path: targetScriptAsset.path,
                    virtualPath: this._assetManager._liveAssetPathTable[targetScriptAsset.path],
                    requireFunc: function (path, mod) { return _this._require(path, mod); },
                    resolveFunc: function (path, mod) { return _this._resolvePath(path, mod); }
                });
                var script = new ScriptAssetContext_1.ScriptAssetContext(targetScriptAsset, module);
                // @ts-ignore
                this._scriptCaches[resolvedPath] = script;
                return script._executeScript(currentModule);
            }
            else if (targetScriptAsset.type === "text") {
                // JSONの場合の特殊挙動をトレースするためのコード。node.jsの仕様に準ずる
                if (targetScriptAsset && PathUtil_1.PathUtil.resolveExtname(path) === ".json") {
                    // Note: node.jsではここでBOMの排除をしているが、いったんakashicでは排除しないで実装
                    // @ts-ignore
                    var cache = (this._scriptCaches[resolvedPath] = new RequireCachedValue_1.RequireCachedValue(JSON.parse(targetScriptAsset.data)));
                    return cache._cachedValue();
                }
            }
        }
        throw ExceptionFactory_1.ExceptionFactory.createAssertionError("g._require: can not find module: " + path);
    };
    /**
     * 対象のモジュールからの相対パスを、 game.json のディレクトリをルート (`/`) とする `/` 区切りの絶対パス形式として解決する。
     * `this._require()` と違い `path` にアセットIDが指定されても解決しない点に注意。
     * 通常、ゲーム開発者が利用するのは `require.resolve()` であり、このメソッドはその内部実装を提供する。
     *
     * @ignore
     * @param path resolve する対象のパス。相対パスを利用することができる。
     * @param currentModule この require を実行した Module 。
     * @returns {string} 絶対パス
     */
    ModuleManager.prototype._resolvePath = function (path, currentModule) {
        var resolvedPath = null;
        var liveAssetVirtualPathTable = this._assetManager._liveAssetVirtualPathTable;
        var moduleMainScripts = this._assetManager._moduleMainScripts;
        // require(X) from module at path Y
        // 1. If X is a core module,
        // (何もしない。コアモジュールには対応していない。ゲーム開発者は自分でコアモジュールへの依存を解決する必要がある)
        if (/^\.\/|^\.\.\/|^\//.test(path)) {
            // 2. If X begins with './' or '/' or '../'
            if (currentModule) {
                if (!currentModule._virtualDirname) {
                    throw ExceptionFactory_1.ExceptionFactory.createAssertionError("g._require.resolve: couldn't resolve the moudle path without virtualPath");
                }
                resolvedPath = PathUtil_1.PathUtil.resolvePath(currentModule._virtualDirname, path);
            }
            else {
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("g._require.resolve: couldn't resolve the moudle without currentModule");
            }
            // 2.a. LOAD_AS_FILE(Y + X)
            var targetPath = this._resolveAbsolutePathAsFile(resolvedPath, liveAssetVirtualPathTable);
            if (targetPath) {
                return targetPath;
            }
            // 2.b. LOAD_AS_DIRECTORY(Y + X)
            targetPath = this._resolveAbsolutePathAsDirectory(resolvedPath, liveAssetVirtualPathTable);
            if (targetPath) {
                return targetPath;
            }
        }
        else {
            // 3. LOAD_NODE_MODULES(X, dirname(Y))
            // akashic-engine独自仕様: 対象の `path` が `moduleMainScripts` に指定されていたらそちらを返す
            if (moduleMainScripts[path]) {
                return moduleMainScripts[path];
            }
            // 3.a LOAD_NODE_MODULES(X, START)
            var dirs = currentModule ? currentModule.paths.concat() : [];
            dirs.push("node_modules");
            for (var i = 0; i < dirs.length; ++i) {
                var dir = dirs[i];
                var targetPath = PathUtil_1.PathUtil.resolvePath(dir, path);
                resolvedPath = this._resolveAbsolutePathAsFile(targetPath, liveAssetVirtualPathTable);
                if (resolvedPath) {
                    return resolvedPath;
                }
                resolvedPath = this._resolveAbsolutePathAsDirectory(targetPath, liveAssetVirtualPathTable);
                if (resolvedPath) {
                    return resolvedPath;
                }
            }
        }
        throw ExceptionFactory_1.ExceptionFactory.createAssertionError("g._require.resolve: couldn't resolve the path: " + path);
    };
    /**
     * 与えられたパス文字列がファイルパスであると仮定して、対応するアセットを探す。
     * 見つかった場合そのアセットを、そうでない場合 `undefined` を返す。
     * 通常、ゲーム開発者がファイルパスを扱うことはなく、このメソッドを呼び出す必要はない。
     *
     * @ignore
     * @param resolvedPath パス文字列
     * @param liveAssetPathTable パス文字列のプロパティに対応するアセットを格納したオブジェクト
     */
    ModuleManager.prototype._findAssetByPathAsFile = function (resolvedPath, liveAssetPathTable) {
        if (liveAssetPathTable.hasOwnProperty(resolvedPath))
            return liveAssetPathTable[resolvedPath];
        if (liveAssetPathTable.hasOwnProperty(resolvedPath + ".js"))
            return liveAssetPathTable[resolvedPath + ".js"];
        return undefined;
    };
    /**
     * 与えられたパス文字列がディレクトリパスであると仮定して、対応するアセットを探す。
     * 見つかった場合そのアセットを、そうでない場合 `undefined` を返す。
     * 通常、ゲーム開発者がファイルパスを扱うことはなく、このメソッドを呼び出す必要はない。
     * ディレクトリ内に package.json が存在する場合、package.json 自体もアセットとして
     * `liveAssetPathTable` から参照可能でなければならないことに注意。
     *
     * @ignore
     * @param resolvedPath パス文字列
     * @param liveAssetPathTable パス文字列のプロパティに対応するアセットを格納したオブジェクト
     */
    ModuleManager.prototype._findAssetByPathAsDirectory = function (resolvedPath, liveAssetPathTable) {
        var path;
        path = resolvedPath + "/package.json";
        if (liveAssetPathTable.hasOwnProperty(path) && liveAssetPathTable[path].type === "text") {
            var pkg = JSON.parse(liveAssetPathTable[path].data);
            if (pkg && typeof pkg.main === "string") {
                var asset = this._findAssetByPathAsFile(PathUtil_1.PathUtil.resolvePath(resolvedPath, pkg.main), liveAssetPathTable);
                if (asset)
                    return asset;
            }
        }
        path = resolvedPath + "/index.js";
        if (liveAssetPathTable.hasOwnProperty(path))
            return liveAssetPathTable[path];
        return undefined;
    };
    /**
     * 与えられたパス文字列がファイルパスであると仮定して、対応するアセットの絶対パスを解決する。
     * アセットが存在した場合はそのパスを、そうでない場合 `null` を返す。
     * 通常、ゲーム開発者がファイルパスを扱うことはなく、このメソッドを呼び出す必要はない。
     *
     * @ignore
     * @param resolvedPath パス文字列
     * @param liveAssetPathTable パス文字列のプロパティに対応するアセットを格納したオブジェクト
     */
    ModuleManager.prototype._resolveAbsolutePathAsFile = function (resolvedPath, liveAssetPathTable) {
        if (liveAssetPathTable.hasOwnProperty(resolvedPath))
            return "/" + resolvedPath;
        if (liveAssetPathTable.hasOwnProperty(resolvedPath + ".js"))
            return "/" + resolvedPath + ".js";
        return null;
    };
    /**
     * 与えられたパス文字列がディレクトリパスであると仮定して、対応するアセットの絶対パスを解決する。
     * アセットが存在した場合はそのパスを、そうでない場合 `null` を返す。
     * 通常、ゲーム開発者がファイルパスを扱うことはなく、このメソッドを呼び出す必要はない。
     * ディレクトリ内に package.json が存在する場合、package.json 自体もアセットとして
     * `liveAssetPathTable` から参照可能でなければならないことに注意。
     *
     * @ignore
     * @param resolvedPath パス文字列
     * @param liveAssetPathTable パス文字列のプロパティに対応するアセットを格納したオブジェクト
     */
    ModuleManager.prototype._resolveAbsolutePathAsDirectory = function (resolvedPath, liveAssetPathTable) {
        var path = resolvedPath + "/package.json";
        if (liveAssetPathTable.hasOwnProperty(path) && liveAssetPathTable[path].type === "text") {
            var pkg = JSON.parse(liveAssetPathTable[path].data);
            if (pkg && typeof pkg.main === "string") {
                var targetPath = this._resolveAbsolutePathAsFile(PathUtil_1.PathUtil.resolvePath(resolvedPath, pkg.main), liveAssetPathTable);
                if (targetPath) {
                    return "/" + targetPath;
                }
            }
        }
        path = resolvedPath + "/index.js";
        if (liveAssetPathTable.hasOwnProperty(path)) {
            return "/" + path;
        }
        return null;
    };
    return ModuleManager;
}());
exports.ModuleManager = ModuleManager;

},{"./ExceptionFactory":23,"./Module":32,"./PathUtil":40,"./RequireCachedValue":46,"./ScriptAssetContext":48}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NinePatchSurfaceEffector = void 0;
var SurfaceUtil_1 = require("./SurfaceUtil");
/**
 * ナインパッチによる描画処理を提供するSurfaceEffector。
 *
 * このSurfaceEffectorは、画像素材の拡大・縮小において「枠」の表現を実現するものである。
 * 画像の上下左右の「枠」部分の幅・高さを渡すことで、上下の「枠」を縦に引き延ばすことなく、
 * また左右の「枠」を横に引き延ばすことなく画像を任意サイズに拡大・縮小できる。
 * ゲームにおけるメッセージウィンドウやダイアログの表現に利用することを想定している。
 *
 * @deprecated 非推奨である。将来的に削除される。代わりに `SurfaceUtil#drawNinePatch()` を利用すること。
 */
var NinePatchSurfaceEffector = /** @class */ (function () {
    /**
     * `NinePatchSurfaceEffector` のインスタンスを生成する。
     * @deprecated 非推奨である。将来的に削除される。代わりに `SurfaceUtil#drawNinePatch()` を利用すること。
     * @param game このインスタンスが属する `Game`。
     * @param borderWidth 上下左右の「拡大しない」領域の大きさ。すべて同じ値なら数値一つを渡すことができる。省略された場合、 `4`
     */
    function NinePatchSurfaceEffector(game, borderWidth) {
        if (borderWidth === void 0) { borderWidth = 4; }
        this.game = game;
        if (typeof borderWidth === "number") {
            this.borderWidth = {
                top: borderWidth,
                bottom: borderWidth,
                left: borderWidth,
                right: borderWidth
            };
        }
        else {
            this.borderWidth = borderWidth;
        }
    }
    /**
     * 指定の大きさに拡大・縮小した描画結果の `Surface` を生成して返す。詳細は `SurfaceEffector#render` の項を参照。
     */
    NinePatchSurfaceEffector.prototype.render = function (srcSurface, width, height) {
        if (!this._surface || this._surface.width !== width || this._surface.height !== height || this._beforeSrcSurface !== srcSurface) {
            this._surface = this.game.resourceFactory.createSurface(Math.ceil(width), Math.ceil(height));
            this._beforeSrcSurface = srcSurface;
        }
        SurfaceUtil_1.SurfaceUtil.drawNinePatch(this._surface, srcSurface, this.borderWidth);
        return this._surface;
    };
    return NinePatchSurfaceEffector;
}());
exports.NinePatchSurfaceEffector = NinePatchSurfaceEffector;

},{"./SurfaceUtil":57}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object2D = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
var Matrix_1 = require("./Matrix");
/**
 * 二次元の幾何的オブジェクト。位置とサイズ (に加えて傾きや透明度も) を持つ。
 * ゲーム開発者は `E` を使えばよく、通常このクラスを意識する必要はない。
 */
var Object2D = /** @class */ (function () {
    function Object2D(param) {
        if (!param) {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.opacity = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            this.angle = 0;
            this.compositeOperation = undefined;
            this.anchorX = 0;
            this.anchorY = 0;
            this._matrix = undefined;
        }
        else {
            this.x = param.x || 0;
            this.y = param.y || 0;
            this.width = param.width || 0;
            this.height = param.height || 0;
            this.opacity = param.opacity != null ? param.opacity : 1;
            this.scaleX = param.scaleX != null ? param.scaleX : 1;
            this.scaleY = param.scaleY != null ? param.scaleY : 1;
            this.angle = param.angle || 0;
            this.compositeOperation = param.compositeOperation;
            // `null` に後方互換性のための意味を持たせているので、 `=== undefined` で比較する
            this.anchorX = param.anchorX === undefined ? 0 : param.anchorX;
            this.anchorY = param.anchorY === undefined ? 0 : param.anchorY;
            this._matrix = undefined;
        }
    }
    Object2D.prototype.moveTo = function (posOrX, y) {
        if (typeof posOrX === "number" && typeof y !== "number") {
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Object2D#moveTo: arguments must be CommonOffset or pair of x and y as a number.");
        }
        if (typeof posOrX === "number") {
            this.x = posOrX;
            this.y = y;
        }
        else {
            this.x = posOrX.x;
            this.y = posOrX.y;
        }
    };
    /**
     * オブジェクトを相対的に移動する。
     * このメソッドは `x` と `y` を同時に加算するためのユーティリティメソッドである。
     * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
     * @param x X座標に加算する値
     * @param y Y座標に加算する値
     */
    Object2D.prototype.moveBy = function (x, y) {
        this.x += x;
        this.y += y;
    };
    Object2D.prototype.resizeTo = function (sizeOrWidth, height) {
        if (typeof sizeOrWidth === "number" && typeof height !== "number") {
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Object2D#resizeTo: arguments must be CommonSize or pair of width and height as a number.");
        }
        if (typeof sizeOrWidth === "number") {
            this.width = sizeOrWidth;
            this.height = height;
        }
        else {
            this.width = sizeOrWidth.width;
            this.height = sizeOrWidth.height;
        }
    };
    /**
     * オブジェクトのサイズを相対的に変更する。
     * このメソッドは `width` と `height` を同時に加算するためのユーティリティメソッドである。
     * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
     * @param width 加算する幅
     * @param height 加算する高さ
     */
    Object2D.prototype.resizeBy = function (width, height) {
        this.width += width;
        this.height += height;
    };
    /**
     * オブジェクトの拡大率を設定する。
     * このメソッドは `scaleX` と `scaleY` に同じ値を同時に設定するためのユーティリティメソッドである。
     * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
     * @param scale 拡大率
     */
    Object2D.prototype.scale = function (scale) {
        this.scaleX = scale;
        this.scaleY = scale;
    };
    /**
     * オブジェクトのアンカーの位置を設定する。
     * このメソッドは `anchorX` と `anchorY` を同時に設定するためのユーティリティメソッドである。
     * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
     */
    Object2D.prototype.anchor = function (x, y) {
        this.anchorX = x;
        this.anchorY = y;
    };
    /**
     * このオブジェクトの変換行列を得る。
     */
    Object2D.prototype.getMatrix = function () {
        if (!this._matrix) {
            this._matrix = new Matrix_1.PlainMatrix();
        }
        else if (!this._matrix._modified) {
            return this._matrix;
        }
        this._updateMatrix();
        this._matrix._modified = false;
        return this._matrix;
    };
    /**
     * 公開のプロパティから内部の変換行列キャッシュを更新する。
     * @private
     */
    Object2D.prototype._updateMatrix = function () {
        if (this.angle || this.scaleX !== 1 || this.scaleY !== 1 || this.anchorX !== 0 || this.anchorY !== 0) {
            // @ts-ignore
            this._matrix.update(this.width, this.height, this.scaleX, this.scaleY, this.angle, this.x, this.y, this.anchorX, this.anchorY);
        }
        else {
            // @ts-ignore
            this._matrix.reset(this.x, this.y);
        }
    };
    return Object2D;
}());
exports.Object2D = Object2D;

},{"./ExceptionFactory":23,"./Matrix":31}],36:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationPluginManager = void 0;
var trigger_1 = require("@akashic/trigger");
/**
 * 操作プラグインからの通知をハンドルするクラス。
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 * @ignore
 */
var OperationHandler = /** @class */ (function () {
    function OperationHandler(code, owner, handler) {
        this._code = code;
        this._handler = handler;
        this._handlerOwner = owner;
    }
    OperationHandler.prototype.onOperation = function (op) {
        var iop;
        if (op instanceof Array) {
            iop = { _code: this._code, data: op };
        }
        else {
            iop = op;
            iop._code = this._code;
        }
        this._handler.call(this._handlerOwner, iop);
    };
    return OperationHandler;
}());
/**
 * 操作プラグインを管理するクラス。
 * 通常は game.json の `operationPlugins` フィールドを基に自動的に初期化される他、
 * ゲーム開発者は本クラスを用いて直接操作プラグインを登録することもできる。
 * 詳細は `this.register()` のコメントを参照。
 *
 * 本クラスのインスタンスをゲーム開発者が直接生成することない。
 */
var OperationPluginManager = /** @class */ (function () {
    function OperationPluginManager(game, viewInfo, infos) {
        this.onOperate = new trigger_1.Trigger();
        this.operated = this.onOperate;
        this.plugins = {};
        this._game = game;
        this._viewInfo = viewInfo;
        this._infos = infos;
        this._initialized = false;
    }
    /**
     * 初期化する。
     * このメソッドの呼び出しは、`this.game._loaded` のfire後でなければならない。
     */
    OperationPluginManager.prototype.initialize = function () {
        if (!this._initialized) {
            this._initialized = true;
            this._loadOperationPlugins();
        }
        this._doAutoStart();
    };
    /**
     * 操作プラグインを手動で登録する。
     * このメソッドを利用する場合、game.json の `operationPlugins` フィールドから該当の定義を省略する必要がある。
     * 登録後、ゲーム開発者自身で `OperationPluginManager#start()` を呼び出さなければならない点に注意。
     * @param pluginClass new 可能な操作プラグインの実態
     * @param code 操作プラグインの識別コード
     * @param option 操作プラグインのコンストラクタに渡すパラメータ
     */
    OperationPluginManager.prototype.register = function (pluginClass, code, option) {
        this._infos[code] = {
            code: code,
            _plugin: this._instantiateOperationPlugin(pluginClass, code, option)
        };
    };
    /**
     * 対象の操作プラグインを開始する。
     * @param code 操作プラグインの識別コード
     */
    OperationPluginManager.prototype.start = function (code) {
        var info = this._infos[code];
        if (!info || !info._plugin)
            return;
        info._plugin.start();
    };
    /**
     * 対象の操作プラグインを終了する。
     * @param code 操作プラグインの識別コード
     */
    OperationPluginManager.prototype.stop = function (code) {
        var info = this._infos[code];
        if (!info || !info._plugin)
            return;
        info._plugin.stop();
    };
    OperationPluginManager.prototype.destroy = function () {
        this.stopAll();
        this.onOperate.destroy();
        this.onOperate = undefined;
        this.operated = undefined;
        this.plugins = undefined;
        this._game = undefined;
        this._viewInfo = undefined;
        this._infos = undefined;
    };
    OperationPluginManager.prototype.stopAll = function () {
        if (!this._initialized)
            return;
        for (var i = 0; i < this._infos.length; ++i) {
            var info = this._infos[i];
            if (info._plugin)
                info._plugin.stop();
        }
    };
    OperationPluginManager.prototype._doAutoStart = function () {
        for (var i = 0; i < this._infos.length; ++i) {
            var info = this._infos[i];
            if (!info.manualStart && info._plugin)
                info._plugin.start();
        }
    };
    OperationPluginManager.prototype._loadOperationPlugins = function () {
        for (var i = 0; i < this._infos.length; ++i) {
            var info = this._infos[i];
            if (!info.script)
                continue;
            var pluginClass = this._game._moduleManager._require(info.script);
            info._plugin = this._instantiateOperationPlugin(pluginClass, info.code, info.option);
        }
    };
    OperationPluginManager.prototype._instantiateOperationPlugin = function (pluginClass, code, option) {
        if (!pluginClass.isSupported()) {
            return;
        }
        if (this.plugins[code]) {
            throw new Error("Plugin#code conflicted for code: ".concat(code));
        }
        if (this._infos[code]) {
            throw new Error("this plugin (code: ".concat(code, ") is already defined in game.json"));
        }
        var plugin = new pluginClass(this._game, this._viewInfo, option);
        this.plugins[code] = plugin;
        var handler = new OperationHandler(code, this.onOperate, this.onOperate.fire);
        plugin.operationTrigger.add(handler.onOperation, handler);
        return plugin;
    };
    return OperationPluginManager;
}());
exports.OperationPluginManager = OperationPluginManager;

},{"@akashic/trigger":126}],38:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],39:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathUtil = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
/**
 * パスユーティリティ。
 * 通常、ゲーム開発者がファイルパスを扱うことはなく、このモジュールのメソッドを呼び出す必要はない。
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
                        throw ExceptionFactory_1.ExceptionFactory.createAssertionError("PathUtil.resolvePath: invalid arguments");
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

},{"./ExceptionFactory":23}],41:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointEventResolver = void 0;
/**
 * PlatformPointEventからg.Eventへの変換機構。
 *
 * ほぼ座標しか持たないPlatformPointEventに対して、g.Point(Down|Move|Up)Eventはその座標にあるエンティティや、
 * (g.Point(Move|Up)Eventの場合)g.PointDownEventからの座標の差分を持っている。
 * それらの足りない情報を管理・追加して、PlatformPointEventをg.Eventに変換するクラス。
 * Platform実装はpointDown()なしでpointMove()を呼び出してくることも考えられるため、
 * Down -> Move -> Up の流れを保証する機能も持つ。
 *
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 * @ignore
 */
var PointEventResolver = /** @class */ (function () {
    function PointEventResolver(param) {
        // g.Eと関連した座標データ
        this._pointEventMap = {};
        this._sourceResolver = param.sourceResolver;
        this._playerId = param.playerId;
    }
    PointEventResolver.prototype.pointDown = function (e) {
        var source = this._sourceResolver.findPointSource(e.offset);
        // @ts-ignore
        var point = source.point ? source.point : e.offset;
        // @ts-ignore
        var targetId = source.target ? source.target.id : undefined;
        // @ts-ignore
        var local = source.local;
        this._pointEventMap[e.identifier] = {
            targetId: targetId,
            local: local,
            point: point,
            start: { x: e.offset.x, y: e.offset.y },
            prev: { x: e.offset.x, y: e.offset.y }
        };
        // NOTE: 優先度は機械的にJoinedをつけておく。Joinしていない限りPointDownEventなどはリジェクトされる。
        var ret = [
            33 /* PointDown */,
            2 /* Joined */,
            this._playerId,
            e.identifier,
            point.x,
            point.y,
            targetId //                6?: エンティティID
        ];
        if (source && source.local)
            ret.push(source.local); // 7?: ローカル
        return ret;
    };
    PointEventResolver.prototype.pointMove = function (e) {
        var holder = this._pointEventMap[e.identifier];
        if (!holder)
            return null;
        var prev = { x: 0, y: 0 };
        var start = { x: 0, y: 0 };
        this._pointMoveAndUp(holder, e.offset, prev, start);
        var ret = [
            34 /* PointMove */,
            2 /* Joined */,
            this._playerId,
            e.identifier,
            holder.point.x,
            holder.point.y,
            start.x,
            start.y,
            prev.x,
            prev.y,
            holder.targetId //         10?: エンティティID
        ];
        if (holder.local)
            ret.push(holder.local); // 11?: ローカル
        return ret;
    };
    PointEventResolver.prototype.pointUp = function (e) {
        var holder = this._pointEventMap[e.identifier];
        if (!holder)
            return null;
        var prev = { x: 0, y: 0 };
        var start = { x: 0, y: 0 };
        this._pointMoveAndUp(holder, e.offset, prev, start);
        delete this._pointEventMap[e.identifier];
        var ret = [
            35 /* PointUp */,
            2 /* Joined */,
            this._playerId,
            e.identifier,
            holder.point.x,
            holder.point.y,
            start.x,
            start.y,
            prev.x,
            prev.y,
            holder.targetId //       10?: エンティティID
        ];
        if (holder.local)
            ret.push(holder.local); // 11?: ローカル
        return ret;
    };
    PointEventResolver.prototype._pointMoveAndUp = function (holder, offset, prevDelta, startDelta) {
        startDelta.x = offset.x - holder.start.x;
        startDelta.y = offset.y - holder.start.y;
        prevDelta.x = offset.x - holder.prev.x;
        prevDelta.y = offset.y - holder.prev.y;
        holder.prev.x = offset.x;
        holder.prev.y = offset.y;
    };
    return PointEventResolver;
}());
exports.PointEventResolver = PointEventResolver;

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomGenerator = void 0;
/**
 * 乱数生成器。
 * `RandomGenerator#get()` によって、新しい乱数を生成することができる。
 */
var RandomGenerator = /** @class */ (function () {
    function RandomGenerator(seed) {
        this.seed = seed;
    }
    return RandomGenerator;
}());
exports.RandomGenerator = RandomGenerator;

},{}],44:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],45:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireCachedValue = void 0;
var RequireCachedValue = /** @class */ (function () {
    function RequireCachedValue(value) {
        this._value = value;
    }
    /**
     * @private
     */
    RequireCachedValue.prototype._cachedValue = function () {
        return this._value;
    };
    return RequireCachedValue;
}());
exports.RequireCachedValue = RequireCachedValue;

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
var trigger_1 = require("@akashic/trigger");
var AssetAccessor_1 = require("./AssetAccessor");
var AssetHolder_1 = require("./AssetHolder");
var Camera2D_1 = require("./Camera2D");
var ExceptionFactory_1 = require("./ExceptionFactory");
var TimerManager_1 = require("./TimerManager");
/**
 * シーンを表すクラス。
 */
var Scene = /** @class */ (function () {
    /**
     * 各種パラメータを指定して `Scene` のインスタンスを生成する。
     * @param param 初期化に用いるパラメータのオブジェクト
     */
    function Scene(param) {
        var game = param.game;
        var local = param.local === undefined
            ? "non-local"
            : param.local === false
                ? "non-local"
                : param.local === true
                    ? "full-local"
                    : param.local;
        var tickGenerationMode = param.tickGenerationMode !== undefined ? param.tickGenerationMode : "by-clock";
        if (!param.storageKeys) {
            this._storageLoader = undefined;
            this.storageValues = undefined;
        }
        else {
            this._storageLoader = game.storage._createLoader(param.storageKeys, param.storageValuesSerialization);
            this.storageValues = this._storageLoader._valueStore;
        }
        this.name = param.name;
        this.game = game;
        this.local = local;
        this.tickGenerationMode = tickGenerationMode;
        this.onLoad = new trigger_1.Trigger();
        this.loaded = this.onLoad;
        this._onReady = new trigger_1.Trigger();
        this._ready = this._onReady;
        this.assets = {};
        this.asset = new AssetAccessor_1.AssetAccessor(game._assetManager);
        this._loaded = false;
        this._prefetchRequested = false;
        this._loadingState = "initial";
        this.onUpdate = new trigger_1.Trigger();
        this.update = this.onUpdate;
        this._timer = new TimerManager_1.TimerManager(this.onUpdate, this.game.fps);
        this.onAssetLoad = new trigger_1.Trigger();
        this.onAssetLoadFailure = new trigger_1.Trigger();
        this.onAssetLoadComplete = new trigger_1.Trigger();
        this.assetLoaded = this.onAssetLoad;
        this.assetLoadFailed = this.onAssetLoadFailure;
        this.assetLoadCompleted = this.onAssetLoadComplete;
        this.onMessage = new trigger_1.Trigger();
        this.onPointDownCapture = new trigger_1.Trigger();
        this.onPointMoveCapture = new trigger_1.Trigger();
        this.onPointUpCapture = new trigger_1.Trigger();
        this.onOperation = new trigger_1.Trigger();
        this.message = this.onMessage;
        this.pointDownCapture = this.onPointDownCapture;
        this.pointMoveCapture = this.onPointMoveCapture;
        this.pointUpCapture = this.onPointUpCapture;
        this.operation = this.onOperation;
        this.children = [];
        this.state = "standby";
        this.onStateChange = new trigger_1.Trigger();
        this._assetHolders = [];
        this._sceneAssetHolder = new AssetHolder_1.AssetHolder({
            assetManager: this.game._assetManager,
            assetIds: param.assetIds,
            assetPaths: param.assetPaths,
            handlerSet: {
                owner: this,
                handleLoad: this._handleSceneAssetLoad,
                handleLoadFailure: this._handleSceneAssetLoadFailure,
                handleFinish: this._handleSceneAssetLoadFinish
            },
            userData: null
        });
    }
    /**
     * このシーンが変更されたことをエンジンに通知する。
     *
     * このメソッドは、このシーンに紐づいている `E` の `modified()` を呼び出すことで暗黙に呼び出される。
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     * @param isBubbling この関数をこのシーンの子の `modified()` から呼び出す場合、真を渡さなくてはならない。省略された場合、偽。
     */
    Scene.prototype.modified = function (_isBubbling) {
        this.game.modified();
    };
    /**
     * このシーンを破棄する。
     *
     * 破棄処理の開始時に、このシーンの `onStateChange` が引数 `BeforeDestroyed` でfireされる。
     * 破棄処理の終了時に、このシーンの `onStateChange` が引数 `Destroyed` でfireされる。
     * このシーンに紐づいている全ての `E` と全てのTimerは破棄される。
     * `Scene#setInterval()`, `Scene#setTimeout()` に渡された関数は呼び出されなくなる。
     *
     * このメソッドは `Scene#end` や `Game#popScene` などによって要求されたシーンの遷移時に暗黙に呼び出される。
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     */
    Scene.prototype.destroy = function () {
        this.state = "before-destroyed";
        this.onStateChange.fire(this.state);
        // TODO: (GAMEDEV-483) Sceneスタックがそれなりの量になると重くなるのでScene#dbが必要かもしれない
        var gameDb = this.game.db;
        for (var p in gameDb) {
            if (gameDb.hasOwnProperty(p) && gameDb[p].scene === this)
                gameDb[p].destroy();
        }
        gameDb = this.game._localDb;
        for (var p in gameDb) {
            if (gameDb.hasOwnProperty(p) && gameDb[p].scene === this)
                gameDb[p].destroy();
        }
        this._timer.destroy();
        this.onUpdate.destroy();
        this.onMessage.destroy();
        this.onPointDownCapture.destroy();
        this.onPointMoveCapture.destroy();
        this.onPointUpCapture.destroy();
        this.onOperation.destroy();
        this.onLoad.destroy();
        this.onAssetLoad.destroy();
        this.onAssetLoadFailure.destroy();
        this.onAssetLoadComplete.destroy();
        this.assets = {};
        // アセットを参照しているEより先に解放しないよう最後に解放する
        for (var i = 0; i < this._assetHolders.length; ++i)
            this._assetHolders[i].destroy();
        this._sceneAssetHolder.destroy();
        this._storageLoader = undefined;
        this.game = undefined;
        this.state = "destroyed";
        this.onStateChange.fire(this.state);
        this.onStateChange.destroy();
    };
    /**
     * 破棄済みであるかを返す。
     */
    Scene.prototype.destroyed = function () {
        return this.game === undefined;
    };
    /**
     * 一定間隔で定期的に処理を実行するTimerを作成して返す。
     *
     * 戻り値は作成されたTimerである。
     * 通常は `Scene#setInterval` を利用すればよく、ゲーム開発者がこのメソッドを呼び出す必要はない。
     * `Timer` はフレーム経過処理(`Scene#onUpdate`)で実現される疑似的なタイマーである。実時間の影響は受けない。
     * @param interval Timerの実行間隔（ミリ秒）
     */
    Scene.prototype.createTimer = function (interval) {
        return this._timer.createTimer(interval);
    };
    /**
     * Timerを削除する。
     * @param timer 削除するTimer
     */
    Scene.prototype.deleteTimer = function (timer) {
        this._timer.deleteTimer(timer);
    };
    /**
     * 一定間隔で定期的に実行される処理を作成する。
     *
     * `interval` ミリ秒おきに `owner` を `this` として `handler` を呼び出す。
     * 戻り値は `Scene#clearInterval` の引数に指定して定期実行を解除するために使える値である。
     * このタイマーはフレーム経過処理(`Scene#onUpdate`)で実現される疑似的なタイマーである。実時間の影響は受けない。
     * 関数は指定時間の経過直後ではなく、経過後最初のフレームで呼び出される。
     * @param handler 処理
     * @param interval 実行間隔(ミリ秒)
     * @param owner handlerの所有者。省略された場合、null
     */
    Scene.prototype.setInterval = function (handler, interval, owner) {
        return this._timer.setInterval(handler, interval, owner);
    };
    /**
     * setIntervalで作成した定期処理を解除する。
     * @param identifier 解除対象
     */
    Scene.prototype.clearInterval = function (identifier) {
        this._timer.clearInterval(identifier);
    };
    /**
     * 一定時間後に一度だけ実行される処理を作成する。
     *
     * `milliseconds` ミリ秒後(以降)に、一度だけ `owner` を `this` として `handler` を呼び出す。
     * 戻り値は `Scene#clearTimeout` の引数に指定して処理を削除するために使える値である。
     *
     * このタイマーはフレーム経過処理(`Scene#onUpdate`)で実現される疑似的なタイマーである。実時間の影響は受けない。
     * 関数は指定時間の経過直後ではなく、経過後最初のフレームで呼び出される。
     * (理想的なケースでは、30FPSなら50msのコールバックは66.6ms時点で呼び出される)
     * 時間経過に対して厳密な処理を行う必要があれば、自力で `Scene#onUpdate` 通知を処理すること。
     *
     * @param handler 処理
     * @param milliseconds 時間(ミリ秒)
     * @param owner handlerの所有者。省略された場合、null
     */
    Scene.prototype.setTimeout = function (handler, milliseconds, owner) {
        return this._timer.setTimeout(handler, milliseconds, owner);
    };
    /**
     * setTimeoutで作成した処理を削除する。
     * @param identifier 解除対象
     */
    Scene.prototype.clearTimeout = function (identifier) {
        this._timer.clearTimeout(identifier);
    };
    /**
     * このシーンが現在のシーンであるかどうかを返す。
     */
    Scene.prototype.isCurrentScene = function () {
        return this.game.scene() === this;
    };
    /**
     * 次のシーンへの遷移を要求する。
     *
     * このメソッドは、 `toPush` が真ならば `Game#pushScene()` の、でなければ `Game#replaceScene` のエイリアスである。
     * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
     * このシーンが現在のシーンでない場合、 `AssertionError` がthrowされる。
     * @param next 遷移後のシーン
     * @param toPush 現在のシーンを残したままにするなら真、削除して遷移するなら偽を指定する。省略された場合偽
     */
    Scene.prototype.gotoScene = function (next, toPush) {
        if (!this.isCurrentScene())
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Scene#gotoScene: this scene is not the current scene");
        if (toPush) {
            this.game.pushScene(next);
        }
        else {
            this.game.replaceScene(next);
        }
    };
    /**
     * このシーンの削除と、一つ前のシーンへの遷移を要求する。
     *
     * このメソッドは `Game#popScene()` のエイリアスである。
     * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
     * このシーンが現在のシーンでない場合、 `AssertionError` がthrowされる。
     */
    Scene.prototype.end = function () {
        if (!this.isCurrentScene())
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Scene#end: this scene is not the current scene");
        this.game.popScene();
    };
    /**
     * このSceneにエンティティを登録する。
     *
     * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に呼び出す必要はない。
     * @param e 登録するエンティティ
     */
    Scene.prototype.register = function (e) {
        this.game.register(e);
        e.scene = this;
    };
    /**
     * このSceneからエンティティの登録を削除する。
     *
     * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に呼び出す必要はない。
     * @param e 登録を削除するエンティティ
     */
    Scene.prototype.unregister = function (e) {
        // @ts-ignore
        e.scene = undefined;
        this.game.unregister(e);
    };
    /**
     * 子エンティティを追加する。
     *
     * `this.children` の末尾に `e` を追加する(`e` はそれまでに追加されたすべての子エンティティより手前に表示される)。
     *
     * @param e 子エンティティとして追加するエンティティ
     */
    Scene.prototype.append = function (e) {
        this.insertBefore(e, undefined);
    };
    /**
     * 子エンティティを挿入する。
     *
     * `this.children` の`target`の位置に `e` を挿入する。
     * `target` が`this` の子でない場合、`append(e)`と同じ動作となる。
     *
     * @param e 子エンティティとして追加するエンティティ
     * @param target 挿入位置にある子エンティティ
     */
    Scene.prototype.insertBefore = function (e, target) {
        if (e.parent)
            e.remove();
        e.parent = this;
        var index = -1;
        if (target !== undefined && (index = this.children.indexOf(target)) > -1) {
            this.children.splice(index, 0, e);
        }
        else {
            this.children.push(e);
        }
        this.modified(true);
    };
    /**
     * 子エンティティを削除する。
     * `this` の子から `e` を削除する。 `e` が `this` の子でない場合、何もしない。
     * @param e 削除する子エンティティ
     */
    Scene.prototype.remove = function (e) {
        var index = this.children.indexOf(e);
        if (index === -1)
            return;
        this.children[index].parent = undefined;
        this.children.splice(index, 1);
        this.modified(true);
    };
    /**
     * シーン内でその座標に反応する `PointSource` を返す。
     * @param point 対象の座標
     * @param force touchable指定を無視する場合真を指定する。指定されなかった場合偽
     * @param camera 対象のカメラ。指定されなかった場合undefined
     */
    Scene.prototype.findPointSourceByPoint = function (point, force, camera) {
        var mayConsumeLocalTick = this.local !== "non-local";
        var children = this.children;
        var m = camera && camera instanceof Camera2D_1.Camera2D ? camera.getMatrix() : undefined;
        for (var i = children.length - 1; i >= 0; --i) {
            var ret = children[i].findPointSourceByPoint(point, m, force);
            if (ret) {
                ret.local = (ret.target && ret.target.local) || mayConsumeLocalTick;
                return ret;
            }
        }
        return { target: undefined, point: undefined, local: mayConsumeLocalTick };
    };
    /**
     * アセットの先読みを要求する。
     *
     * `Scene` に必要なアセットは、通常、`Game#pushScene()` などによるシーン遷移にともなって暗黙に読み込みが開始される。
     * ゲーム開発者はこのメソッドを呼び出すことで、シーン遷移前にアセット読み込みを開始する(先読みする)ことができる。
     * 先読み開始後、シーン遷移時までに読み込みが完了していない場合、通常の読み込み処理同様にローディングシーンが表示される。
     *
     * このメソッドは `StorageLoader` についての先読み処理を行わない点に注意。
     * ストレージの場合、書き込みが行われる可能性があるため、順序を無視して先読みすることはできない。
     */
    Scene.prototype.prefetch = function () {
        if (this._loaded) {
            // _load() 呼び出し後に prefetch() する意味はない(先読みではない)。
            return;
        }
        if (this._prefetchRequested)
            return;
        this._prefetchRequested = true;
        this._sceneAssetHolder.request();
    };
    /**
     * シーンが読み込んだストレージの値をシリアライズする。
     *
     * `Scene#storageValues` の内容をシリアライズする。
     */
    Scene.prototype.serializeStorageValues = function () {
        if (!this._storageLoader)
            return undefined;
        return this._storageLoader._valueStoreSerialization;
    };
    Scene.prototype.requestAssets = function (assetIds, handler) {
        var _this = this;
        if (this._loadingState !== "ready-fired" && this._loadingState !== "loaded-fired") {
            // このメソッドは読み込み完了前には呼び出せない。これは実装上の制限である。
            // やろうと思えば _load() で読み込む対象として加えることができる。が、その場合 `handler` を呼び出す方法が単純でないので対応を見送る。
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("Scene#requestAsset(): can be called after loaded.");
        }
        var holder = new AssetHolder_1.AssetHolder({
            assetManager: this.game._assetManager,
            assetIds: assetIds,
            handlerSet: {
                owner: this,
                handleLoad: this._handleSceneAssetLoad,
                handleLoadFailure: this._handleSceneAssetLoadFailure,
                handleFinish: this._handleSceneAssetLoadFinish
            },
            userData: function () {
                // 不要なクロージャは避けたいが生存チェックのため不可避
                if (!_this.destroyed())
                    handler();
            }
        });
        this._assetHolders.push(holder);
        holder.request();
    };
    /**
     * @private
     */
    Scene.prototype._activate = function () {
        this.state = "active";
        this.onStateChange.fire(this.state);
    };
    /**
     * @private
     */
    Scene.prototype._deactivate = function () {
        this.state = "deactive";
        this.onStateChange.fire(this.state);
    };
    /**
     * @private
     */
    Scene.prototype._needsLoading = function () {
        return this._sceneAssetHolder.waitingAssetsCount > 0 || (!!this._storageLoader && !this._storageLoader._loaded);
    };
    /**
     * @private
     */
    Scene.prototype._load = function () {
        if (this._loaded)
            return;
        this._loaded = true;
        var needsWait = this._sceneAssetHolder.request();
        if (this._storageLoader) {
            this._storageLoader._load(this);
            needsWait = true;
        }
        if (!needsWait)
            this._notifySceneReady();
    };
    /**
     * @private
     */
    Scene.prototype._handleSceneAssetLoad = function (asset) {
        this.assets[asset.id] = asset;
        this.onAssetLoad.fire(asset);
        this.onAssetLoadComplete.fire(asset);
    };
    /**
     * @private
     */
    Scene.prototype._handleSceneAssetLoadFailure = function (failureInfo) {
        this.onAssetLoadFailure.fire(failureInfo);
        this.onAssetLoadComplete.fire(failureInfo.asset);
    };
    /**
     * @private
     */
    Scene.prototype._handleSceneAssetLoadFinish = function (holder, succeed) {
        if (!succeed) {
            this.game.terminateGame();
            return;
        }
        // 動的アセット (`requestAssets()` 由来) の場合
        if (holder.userData) {
            this.game._pushPostTickTask(holder.userData, null);
            return;
        }
        if (!this._loaded) {
            // prefetch() で開始されたアセット読み込みを完了したが、_load() がまだ呼ばれていない。
            // _notifySceneReady() は _load() 呼び出し後まで遅延する。
            return;
        }
        if (this._storageLoader && !this._storageLoader._loaded) {
            // アセット読み込みを完了したが、ストレージの読み込みが終わっていない。
            // _notifySceneReady() は  _onStorageLoaded() 呼び出し後まで遅延する。
            return;
        }
        this._notifySceneReady();
    };
    /**
     * @private
     */
    Scene.prototype._onStorageLoadError = function (_error) {
        this.game.terminateGame();
    };
    /**
     * @private
     */
    Scene.prototype._onStorageLoaded = function () {
        if (this._sceneAssetHolder.waitingAssetsCount === 0)
            this._notifySceneReady();
    };
    /**
     * @private
     */
    Scene.prototype._notifySceneReady = function () {
        // 即座に `_onReady` をfireすることはしない。tick()のタイミングで行うため、リクエストをgameに投げておく。
        this._loadingState = "ready";
        this.game._pushPostTickTask(this._fireReady, this);
    };
    /**
     * @private
     */
    Scene.prototype._fireReady = function () {
        if (this.destroyed())
            return;
        this._onReady.fire(this);
        this._loadingState = "ready-fired";
    };
    /**
     * @private
     */
    Scene.prototype._fireLoaded = function () {
        if (this.destroyed())
            return;
        if (this._loadingState === "loaded-fired")
            return;
        this.onLoad.fire(this);
        this._loadingState = "loaded-fired";
    };
    return Scene;
}());
exports.Scene = Scene;

},{"./AssetAccessor":1,"./AssetHolder":2,"./Camera2D":10,"./ExceptionFactory":23,"./TimerManager":63,"@akashic/trigger":126}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptAssetContext = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
/**
 * `ScriptAsset` の実行コンテキスト。
 * 通常スクリプトアセットを実行するためにはこのクラスを経由する。
 *
 * ゲーム開発者がこのクラスを利用する必要はない。
 * スクリプトアセットを実行する場合は、暗黙にこのクラスを利用する `require()` を用いること。
 */
var ScriptAssetContext = /** @class */ (function () {
    function ScriptAssetContext(asset, module) {
        this._asset = asset;
        this._module = module;
        this._started = false;
    }
    /**
     * @private
     */
    ScriptAssetContext.prototype._cachedValue = function () {
        if (!this._started)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("ScriptAssetContext#_cachedValue: not executed yet.");
        return this._module.exports;
    };
    /**
     * @private
     */
    ScriptAssetContext.prototype._executeScript = function (currentModule) {
        if (this._started)
            return this._module.exports;
        if (currentModule) {
            // Node.js 互換挙動: Module#parent は一番最初に require() した module になる
            this._module.parent = currentModule;
            // Node.js 互換挙動: 親 module の children には自身が実行中の段階で既に追加されている
            currentModule.children.push(this._module);
        }
        this._started = true;
        this._asset.execute(this._module._runtimeValue);
        this._module.loaded = true;
        return this._module.exports;
    };
    return ScriptAssetContext;
}());
exports.ScriptAssetContext = ScriptAssetContext;

},{"./ExceptionFactory":23}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaderProgram = void 0;
/**
 * akashic-engineにおけるシェーダ機能を提供するクラス。
 * 現バージョンのakashic-engineではフラグメントシェーダのみをサポートする。
 */
var ShaderProgram = /** @class */ (function () {
    /**
     * 各種パラメータを指定して `ShaderProgram` のインスタンスを生成する。
     * @param param `ShaderProgram` に設定するパラメータ
     */
    function ShaderProgram(param) {
        this.fragmentShader = param.fragmentShader;
        this.uniforms = param.uniforms;
    }
    return ShaderProgram;
}());
exports.ShaderProgram = ShaderProgram;

},{}],50:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteFactory = void 0;
var Sprite_1 = require("./entities/Sprite");
var ExceptionFactory_1 = require("./ExceptionFactory");
var SpriteFactory = /** @class */ (function () {
    function SpriteFactory() {
    }
    /**
     * e の描画内容を持つ Sprite を生成する。
     * @param scene 作成したSpriteを登録するScene
     * @param e Sprite化したいE
     * @param camera 使用カメラ
     */
    SpriteFactory.createSpriteFromE = function (scene, e, camera) {
        var oldX = e.x;
        var oldY = e.y;
        var x = 0;
        var y = 0;
        var width = e.width;
        var height = e.height;
        var boundingRect = e.calculateBoundingRect();
        if (!boundingRect) {
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("SpriteFactory.createSpriteFromE: camera must look e");
        }
        width = boundingRect.right - boundingRect.left;
        height = boundingRect.bottom - boundingRect.top;
        if (boundingRect.left < e.x)
            x = e.x - boundingRect.left;
        if (boundingRect.top < e.y)
            y = e.y - boundingRect.top;
        e.moveTo(x, y);
        // 再描画フラグを立てたくないために e._matrix を直接触っている
        if (e._matrix)
            e._matrix._modified = true;
        var surface = scene.game.resourceFactory.createSurface(Math.ceil(width), Math.ceil(height));
        var renderer = surface.renderer();
        renderer.begin();
        e.render(renderer, camera);
        renderer.end();
        var s = new Sprite_1.Sprite({
            scene: scene,
            src: surface,
            width: width,
            height: height
        });
        s.moveTo(boundingRect.left, boundingRect.top);
        e.moveTo(oldX, oldY);
        if (e._matrix)
            e._matrix._modified = true;
        return s;
    };
    /**
     * scene の描画内容を持つ Sprite を生成する。
     * @param toScene 作ったSpriteを登録するScene
     * @param fromScene Sprite化したいScene
     * @param camera 使用カメラ
     */
    SpriteFactory.createSpriteFromScene = function (toScene, fromScene, camera) {
        var surface = toScene.game.resourceFactory.createSurface(Math.ceil(fromScene.game.width), Math.ceil(fromScene.game.height));
        var renderer = surface.renderer();
        renderer.begin();
        var children = fromScene.children;
        for (var i = 0; i < children.length; ++i)
            children[i].render(renderer, camera);
        renderer.end();
        return new Sprite_1.Sprite({
            scene: toScene,
            src: surface,
            width: fromScene.game.width,
            height: fromScene.game.height
        });
    };
    return SpriteFactory;
}());
exports.SpriteFactory = SpriteFactory;

},{"./ExceptionFactory":23,"./entities/Sprite":77}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = exports.StorageLoader = exports.StorageValueStore = exports.StorageCountsOperation = exports.StorageCondition = exports.StorageOrder = exports.StorageRegion = void 0;
// TODO: (GAMEDEV-1549) コメント整理
/**
 * 操作対象とするストレージのリージョンを表す。
 */
// サーバ仕様に則し、値を指定している。
var StorageRegion;
(function (StorageRegion) {
    /**
     * slotsを表す。
     */
    StorageRegion[StorageRegion["Slots"] = 1] = "Slots";
    /**
     * scoresを表す。
     */
    StorageRegion[StorageRegion["Scores"] = 2] = "Scores";
    /**
     * countsを表す。
     */
    StorageRegion[StorageRegion["Counts"] = 3] = "Counts";
    /**
     * valuesを表す。
     */
    StorageRegion[StorageRegion["Values"] = 4] = "Values";
})(StorageRegion = exports.StorageRegion || (exports.StorageRegion = {}));
/**
 * 一括取得を行う場合のソート順。
 */
var StorageOrder;
(function (StorageOrder) {
    /**
     * 昇順。
     */
    StorageOrder[StorageOrder["Asc"] = 0] = "Asc";
    /**
     * 降順。
     */
    StorageOrder[StorageOrder["Desc"] = 1] = "Desc";
})(StorageOrder = exports.StorageOrder || (exports.StorageOrder = {}));
/**
 * 条件を表す。
 */
// サーバ仕様に則し、値を指定している。
var StorageCondition;
(function (StorageCondition) {
    /**
     * 等価を表す（==）。
     */
    StorageCondition[StorageCondition["Equal"] = 1] = "Equal";
    /**
     * 「より大きい」を表す（>）。
     */
    StorageCondition[StorageCondition["GreaterThan"] = 2] = "GreaterThan";
    /**
     * 「より小さい」を表す（<）。
     */
    StorageCondition[StorageCondition["LessThan"] = 3] = "LessThan";
})(StorageCondition = exports.StorageCondition || (exports.StorageCondition = {}));
/**
 * Countsリージョンへの書き込み操作種別を表す。
 */
// サーバ仕様に則し、値を指定している。
var StorageCountsOperation;
(function (StorageCountsOperation) {
    /**
     * インクリメント操作を実行する。
     */
    StorageCountsOperation[StorageCountsOperation["Incr"] = 1] = "Incr";
    /**
     * デクリメント操作を実行する。
     */
    StorageCountsOperation[StorageCountsOperation["Decr"] = 2] = "Decr";
})(StorageCountsOperation = exports.StorageCountsOperation || (exports.StorageCountsOperation = {}));
/**
 * ストレージの値を保持するクラス。
 * ゲーム開発者がこのクラスのインスタンスを直接生成することはない。
 */
var StorageValueStore = /** @class */ (function () {
    function StorageValueStore(keys, values) {
        this._keys = keys;
        this._values = values;
    }
    /**
     * 値の配列を `StorageKey` またはインデックスから取得する。
     * 通常、インデックスは `Scene` のコンストラクタに指定した `storageKeys` のインデックスに対応する。
     * @param keyOrIndex `StorageKey` 又はインデックス
     */
    StorageValueStore.prototype.get = function (keyOrIndex) {
        if (this._values === undefined) {
            return [];
        }
        if (typeof keyOrIndex === "number") {
            return this._values[keyOrIndex];
        }
        else {
            var index = this._keys.indexOf(keyOrIndex);
            if (index !== -1) {
                return this._values[index];
            }
            for (var i = 0; i < this._keys.length; ++i) {
                var target = this._keys[i];
                if (target.region === keyOrIndex.region &&
                    target.regionKey === keyOrIndex.regionKey &&
                    target.userId === keyOrIndex.userId &&
                    target.gameId === keyOrIndex.gameId) {
                    return this._values[i];
                }
            }
        }
        return [];
    };
    /**
     * 値を `StorageKey` またはインデックスから取得する。
     * 対応する値が複数ある場合は、先頭の値を取得する。
     * 通常、インデックスは `Scene` のコンストラクタに指定した `storageKeys` のインデックスに対応する。
     * @param keyOrIndex `StorageKey` 又はインデックス
     */
    StorageValueStore.prototype.getOne = function (keyOrIndex) {
        var values = this.get(keyOrIndex);
        if (!values)
            return undefined;
        return values[0];
    };
    return StorageValueStore;
}());
exports.StorageValueStore = StorageValueStore;
/**
 * ストレージの値をロードするクラス。
 * ゲーム開発者がこのクラスのインスタンスを直接生成することはなく、
 * 本クラスの機能を利用することもない。
 */
var StorageLoader = /** @class */ (function () {
    function StorageLoader(storage, keys, serialization) {
        this._loaded = false;
        this._storage = storage;
        this._valueStore = new StorageValueStore(keys);
        this._handler = undefined;
        this._valueStoreSerialization = serialization;
    }
    /**
     * @private
     */
    StorageLoader.prototype._load = function (handler) {
        this._handler = handler;
        if (this._storage._load) {
            this._storage._load.call(this._storage, this._valueStore._keys, this, this._valueStoreSerialization);
        }
    };
    /**
     * @private
     */
    // 値の取得が完了したタイミングで呼び出される。
    // `values` は `this._valueStore._keys` に対応する値を表す `StorageValue` の配列。
    // 順番は `this._valueStore._keys` と同じでなければならない。
    StorageLoader.prototype._onLoaded = function (values, serialization) {
        this._valueStore._values = values;
        this._loaded = true;
        if (serialization)
            this._valueStoreSerialization = serialization;
        if (this._handler)
            this._handler._onStorageLoaded();
    };
    /**
     * @private
     */
    StorageLoader.prototype._onError = function (error) {
        if (this._handler)
            this._handler._onStorageLoadError(error);
    };
    return StorageLoader;
}());
exports.StorageLoader = StorageLoader;
/**
 * ストレージ。
 * ゲーム開発者がこのクラスのインスタンスを直接生成することはない。
 */
var Storage = /** @class */ (function () {
    function Storage() {
    }
    /**
     * ストレージに値を書き込む。
     * @param key ストレージキーを表す `StorageKey`
     * @param value 値を表す `StorageValue`
     * @param option 書き込みオプション
     */
    Storage.prototype.write = function (key, value, option) {
        if (this._write) {
            this._write(key, value, option);
        }
    };
    /**
     * 参加してくるプレイヤーの値をストレージから取得することを要求する。
     * 取得した値は `JoinEvent#storageValues` に格納される。
     * @param keys ストレージキーを表す `StorageReadKey` の配列。`StorageReadKey#userId` は無視される。
     */
    Storage.prototype.requestValuesForJoinPlayer = function (keys) {
        this._requestedKeysForJoinPlayer = keys;
    };
    /**
     * @private
     */
    Storage.prototype._createLoader = function (keys, serialization) {
        return new StorageLoader(this, keys, serialization);
    };
    /**
     * @private
     */
    // ストレージに値の書き込むを行う関数を登録する。
    // 登録した関数内の `this` は `Storage` を指す。
    Storage.prototype._registerWrite = function (write) {
        this._write = write;
    };
    /**
     * @private
     */
    // ストレージから値の読み込みを行う関数を登録する。
    // 登録した関数内の `this` は `Storage` を指す。
    // 読み込み完了した場合は、登録した関数内で `loader._onLoaded(values)` を呼ばなければならない。
    // エラーが発生した場合は、登録した関数内で `loader._onError(error)` を呼ばなければならない。
    Storage.prototype._registerLoad = function (load) {
        this._load = load;
    };
    return Storage;
}());
exports.Storage = Storage;

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfaceAtlas = void 0;
var SurfaceAtlasSlot_1 = require("./SurfaceAtlasSlot");
function getSurfaceAtlasSlot(slot, width, height) {
    while (slot) {
        if (slot.width >= width && slot.height >= height) {
            return slot;
        }
        // @ts-ignore
        slot = slot.next;
    }
    return null;
}
/**
 * サーフェスアトラス。
 *
 * 与えられたサーフェスの指定された領域をコピーし一枚のサーフェスにまとめる。
 *
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 */
var SurfaceAtlas = /** @class */ (function () {
    function SurfaceAtlas(surface) {
        this._surface = surface;
        this._emptySurfaceAtlasSlotHead = new SurfaceAtlasSlot_1.SurfaceAtlasSlot(0, 0, this._surface.width, this._surface.height);
        this._accessScore = 0;
        this._usedRectangleAreaSize = { width: 0, height: 0 };
    }
    SurfaceAtlas.prototype.reset = function () {
        var renderer = this._surface.renderer();
        renderer.begin();
        renderer.clear();
        renderer.end();
        this._emptySurfaceAtlasSlotHead = new SurfaceAtlasSlot_1.SurfaceAtlasSlot(0, 0, this._surface.width, this._surface.height);
        this._accessScore = 0;
        this._usedRectangleAreaSize.width = 0;
        this._usedRectangleAreaSize.height = 0;
    };
    /**
     * @private
     */
    SurfaceAtlas.prototype._acquireSurfaceAtlasSlot = function (width, height) {
        // Renderer#drawImage()でサーフェス上の一部を描画するとき、
        // 指定した部分に隣接する画素がにじみ出る現象が確認されている。
        // ここれではそれを避けるため1pixelの余白を与えている。
        width += 1;
        height += 1;
        var slot = getSurfaceAtlasSlot(this._emptySurfaceAtlasSlotHead, width, height);
        if (!slot) {
            return null;
        }
        var remainWidth = slot.width - width;
        var remainHeight = slot.height - height;
        var left;
        var right;
        if (remainWidth <= remainHeight) {
            left = new SurfaceAtlasSlot_1.SurfaceAtlasSlot(slot.x + width, slot.y, remainWidth, height);
            right = new SurfaceAtlasSlot_1.SurfaceAtlasSlot(slot.x, slot.y + height, slot.width, remainHeight);
        }
        else {
            left = new SurfaceAtlasSlot_1.SurfaceAtlasSlot(slot.x, slot.y + height, width, remainHeight);
            right = new SurfaceAtlasSlot_1.SurfaceAtlasSlot(slot.x + width, slot.y, remainWidth, slot.height);
        }
        left.prev = slot.prev;
        left.next = right;
        if (left.prev === null) {
            // left is head
            this._emptySurfaceAtlasSlotHead = left;
        }
        else {
            left.prev.next = left;
        }
        right.prev = left;
        right.next = slot.next;
        if (right.next) {
            right.next.prev = right;
        }
        var acquiredSlot = new SurfaceAtlasSlot_1.SurfaceAtlasSlot(slot.x, slot.y, width, height);
        this._updateUsedRectangleAreaSize(acquiredSlot);
        return acquiredSlot;
    };
    /**
     * @private
     */
    SurfaceAtlas.prototype._updateUsedRectangleAreaSize = function (slot) {
        var slotRight = slot.x + slot.width;
        var slotBottom = slot.y + slot.height;
        if (slotRight > this._usedRectangleAreaSize.width) {
            this._usedRectangleAreaSize.width = slotRight;
        }
        if (slotBottom > this._usedRectangleAreaSize.height) {
            this._usedRectangleAreaSize.height = slotBottom;
        }
    };
    /**
     * サーフェスを追加する。
     *
     * @param surface 追加するサーフェス
     * @param offsetX サーフェス内におけるX方向のオフセット位置。0以上の数値でなければならない
     * @param offsetY サーフェス内におけるY方向のオフセット位置。0以上の数値でなければならない
     * @param width サーフェス内における矩形の幅。0より大きい数値でなければならない
     * @param height サーフェス内における矩形の高さ。0より大きい数値でなければならない
     */
    SurfaceAtlas.prototype.addSurface = function (surface, offsetX, offsetY, width, height) {
        var slot = this._acquireSurfaceAtlasSlot(width, height);
        if (!slot) {
            return null;
        }
        var renderer = this._surface.renderer();
        renderer.begin();
        renderer.drawImage(surface, offsetX, offsetY, width, height, slot.x, slot.y);
        renderer.end();
        return slot;
    };
    /**
     * このSurfaceAtlasの破棄を行う。
     * 以後、このSurfaceを利用することは出来なくなる。
     */
    SurfaceAtlas.prototype.destroy = function () {
        this._surface.destroy();
    };
    /**
     * このSurfaceAtlasが破棄済であるかどうかを判定する。
     */
    SurfaceAtlas.prototype.destroyed = function () {
        return this._surface.destroyed();
    };
    /**
     * このSurfaceAtlasの大きさを取得する。
     */
    SurfaceAtlas.prototype.getAtlasUsedSize = function () {
        return this._usedRectangleAreaSize;
    };
    SurfaceAtlas.prototype.getAccessScore = function () {
        return this._accessScore;
    };
    return SurfaceAtlas;
}());
exports.SurfaceAtlas = SurfaceAtlas;

},{"./SurfaceAtlasSlot":55}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfaceAtlasSet = void 0;
var SurfaceAtlas_1 = require("./SurfaceAtlas");
function calcAtlasSize(hint) {
    // @ts-ignore
    var width = Math.ceil(Math.min(hint.initialAtlasWidth, hint.maxAtlasWidth));
    // @ts-ignore
    var height = Math.ceil(Math.min(hint.initialAtlasHeight, hint.maxAtlasHeight));
    return { width: width, height: height };
}
/**
 * DynamicFont で使用される SurfaceAtlas を管理するクラス。
 *
 * 歴史的経緯のため、名前に反して DynamicFont 専用のクラスであり、汎用の SurfaceAtlas 管理クラスではない点に注意。
 */
var SurfaceAtlasSet = /** @class */ (function () {
    function SurfaceAtlasSet(params) {
        this._surfaceAtlases = [];
        this._atlasGlyphsTable = [];
        this._resourceFactory = params.resourceFactory;
        this._currentAtlasIndex = 0;
        var hint = params.hint ? params.hint : {};
        this._maxAtlasNum = hint.maxAtlasNum ? hint.maxAtlasNum : SurfaceAtlasSet.INITIAL_MAX_SURFACEATLAS_NUM;
        // 指定がないとき、やや古いモバイルデバイスでも確保できると言われる
        // 縦横512pxのテクスチャ一枚のアトラスにまとめる形にする
        // 2048x2048で確保してしまうと、Edge, Chrome にて処理が非常に遅くなることがある
        hint.initialAtlasWidth = hint.initialAtlasWidth ? hint.initialAtlasWidth : 512;
        hint.initialAtlasHeight = hint.initialAtlasHeight ? hint.initialAtlasHeight : 512;
        hint.maxAtlasWidth = hint.maxAtlasWidth ? hint.maxAtlasWidth : 512;
        hint.maxAtlasHeight = hint.maxAtlasHeight ? hint.maxAtlasHeight : 512;
        this._atlasSize = calcAtlasSize(hint);
    }
    /**
     * @private
     */
    SurfaceAtlasSet.prototype._deleteAtlas = function (delteNum) {
        for (var i = 0; i < delteNum; ++i) {
            var atlas = this._spliceLeastFrequentlyUsedAtlas();
            if (!atlas)
                return;
            atlas.destroy();
        }
    };
    /**
     * surfaceAtlases の最も利用されていない SurfaceAtlas を探し、 そのインデックスを返す。
     *
     * _surfaceAtlases の長さが 0 の場合、 -1 を返す。
     * @private
     */
    SurfaceAtlasSet.prototype._findLeastFrequentlyUsedAtlasIndex = function () {
        var minScore = Number.MAX_VALUE;
        var lowScoreAtlasIndex = -1;
        for (var i = 0; i < this._surfaceAtlases.length; ++i) {
            if (this._surfaceAtlases[i]._accessScore <= minScore) {
                minScore = this._surfaceAtlases[i]._accessScore;
                lowScoreAtlasIndex = i;
            }
        }
        return lowScoreAtlasIndex;
    };
    /**
     * surfaceAtlases の最も利用されていない SurfaceAtlas を切り離して返す。
     *
     * 返された SurfaceAtlas に紐づいていたすべての Glyph はサーフェスを失う (_isSurfaceValid が偽になる) 。
     * _surfaceAtlases の長さが 0 の場合、 何もせず null を返す。
     * @private
     */
    SurfaceAtlasSet.prototype._spliceLeastFrequentlyUsedAtlas = function () {
        var idx = this._findLeastFrequentlyUsedAtlasIndex();
        if (idx === -1)
            return null;
        if (this._currentAtlasIndex >= idx)
            --this._currentAtlasIndex;
        var spliced = this._surfaceAtlases.splice(idx, 1)[0];
        var glyphs = this._atlasGlyphsTable.splice(idx, 1)[0];
        for (var i = 0; i < glyphs.length; i++) {
            var glyph = glyphs[i];
            glyph.surface = undefined;
            glyph.isSurfaceValid = false;
            glyph._atlas = null;
        }
        return spliced;
    };
    /**
     * 空き領域のある SurfaceAtlas を探索する。
     * glyph が持つ情報を SurfaceAtlas へ移動し、移動した SurfaceAtlas の情報で glyph を置き換える。
     * glyph が持っていた surface は破棄される。
     *
     * 移動に成功した場合 `true` を、失敗した (空き領域が見つからなかった) 場合 `false` を返す。
     * @private
     */
    SurfaceAtlasSet.prototype._moveGlyphSurface = function (glyph) {
        for (var i = 0; i < this._surfaceAtlases.length; ++i) {
            var index = (this._currentAtlasIndex + i) % this._surfaceAtlases.length;
            var atlas = this._surfaceAtlases[index];
            var slot = atlas.addSurface(glyph.surface, glyph.x, glyph.y, glyph.width, glyph.height);
            if (slot) {
                this._currentAtlasIndex = index;
                if (glyph.surface)
                    glyph.surface.destroy();
                glyph.surface = atlas._surface;
                glyph.x = slot.x;
                glyph.y = slot.y;
                glyph._atlas = atlas;
                this._atlasGlyphsTable[index].push(glyph);
                return true;
            }
        }
        return false;
    };
    /**
     * サーフェスアトラスの再割り当てを行う。
     * @private
     */
    SurfaceAtlasSet.prototype._reallocateAtlas = function () {
        var atlas = null;
        if (this._surfaceAtlases.length >= this._maxAtlasNum) {
            atlas = this._spliceLeastFrequentlyUsedAtlas();
            atlas.reset();
        }
        else {
            atlas = new SurfaceAtlas_1.SurfaceAtlas(this._resourceFactory.createSurface(this._atlasSize.width, this._atlasSize.height));
        }
        this._surfaceAtlases.push(atlas);
        this._atlasGlyphsTable.push([]);
        this._currentAtlasIndex = this._surfaceAtlases.length - 1;
    };
    /**
     * 引数で指定されたindexのサーフェスアトラスを取得する。
     *
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     * @param index 取得対象のインデックス
     */
    SurfaceAtlasSet.prototype.getAtlas = function (index) {
        return this._surfaceAtlases[index];
    };
    /**
     * サーフェスアトラスの保持数を取得する。
     *
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     */
    SurfaceAtlasSet.prototype.getAtlasNum = function () {
        return this._surfaceAtlases.length;
    };
    /**
     * 最大サーフェスアトラス保持数取得する。
     */
    SurfaceAtlasSet.prototype.getMaxAtlasNum = function () {
        return this._maxAtlasNum;
    };
    /**
     * 最大アトラス保持数設定する。
     *
     * 設定された値が、現在保持している_surfaceAtlasesの数より大きい場合、
     * removeLeastFrequentlyUsedAtlas()で設定値まで削除する。
     * @param value 設定値
     */
    SurfaceAtlasSet.prototype.changeMaxAtlasNum = function (value) {
        this._maxAtlasNum = value;
        if (this._surfaceAtlases.length > this._maxAtlasNum) {
            var diff = this._surfaceAtlases.length - this._maxAtlasNum;
            this._deleteAtlas(diff);
        }
    };
    /**
     * サーフェスアトラスのサイズを取得する。
     *
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     */
    SurfaceAtlasSet.prototype.getAtlasUsedSize = function () {
        return this._atlasSize;
    };
    /**
     * グリフを追加する。
     *
     * glyph が持っていたサーフェスは破棄され、このクラスが管理するいずれかの (サーフェスアトラスの) サーフェスに紐づけられる。
     * 追加に成功した場合 `true` を、失敗した (空き領域が見つからなかった) 場合 `false` を返す。
     *
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     * @param glyph グリフ
     */
    SurfaceAtlasSet.prototype.addGlyph = function (glyph) {
        // グリフがアトラスより大きいとき、`_atlasSet.addGlyph()`は失敗する。
        // `_reallocateAtlas()`でアトラス増やしてもこれは解決できない。
        // 無駄な空き領域探索とアトラスの再確保を避けるためにここでリターンする。
        if (glyph.width > this._atlasSize.width || glyph.height > this._atlasSize.height) {
            return false;
        }
        if (this._moveGlyphSurface(glyph))
            return true;
        // retry
        this._reallocateAtlas();
        return this._moveGlyphSurface(glyph);
    };
    /**
     * グリフの利用を通知する。
     *
     * サーフェスが不足した時、このクラスは最も利用頻度の低いサーフェスを解放して再利用する。
     * このメソッドによるグリフの利用通知は、利用頻度の低いサーフェスを特定するために利用される。
     *
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     * @param glyph グリフ
     */
    SurfaceAtlasSet.prototype.touchGlyph = function (glyph) {
        // スコア更新
        // NOTE: LRUを捨てる方式なら単純なタイムスタンプのほうがわかりやすいかもしれない
        // NOTE: 正確な時刻は必要ないはずで、インクリメンタルなカウンタで代用すればDate()生成コストは省略できる
        if (glyph._atlas)
            glyph._atlas._accessScore += 1;
        for (var i = 0; i < this._surfaceAtlases.length; i++) {
            var atlas = this._surfaceAtlases[i];
            atlas._accessScore /= 2;
        }
    };
    /**
     * このインスタンスを破棄する。
     */
    SurfaceAtlasSet.prototype.destroy = function () {
        for (var i = 0; i < this._surfaceAtlases.length; ++i) {
            this._surfaceAtlases[i].destroy();
        }
        this._surfaceAtlases = undefined;
        this._resourceFactory = undefined;
        this._atlasGlyphsTable = undefined;
    };
    /**
     * このインスタンスが破棄済みであるかどうかを返す。
     */
    SurfaceAtlasSet.prototype.destroyed = function () {
        return this._surfaceAtlases === undefined;
    };
    /**
     * SurfaceAtlas最大保持数初期値
     */
    SurfaceAtlasSet.INITIAL_MAX_SURFACEATLAS_NUM = 10;
    return SurfaceAtlasSet;
}());
exports.SurfaceAtlasSet = SurfaceAtlasSet;

},{"./SurfaceAtlas":53}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfaceAtlasSlot = void 0;
/**
 * SurfaceAtlasの空き領域管理クラス。
 *
 * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
 */
var SurfaceAtlasSlot = /** @class */ (function () {
    function SurfaceAtlasSlot(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.prev = null;
        this.next = null;
    }
    return SurfaceAtlasSlot;
}());
exports.SurfaceAtlasSlot = SurfaceAtlasSlot;

},{}],56:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfaceUtil = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
/**
 * Surface に関連するユーティリティ。
 */
var SurfaceUtil;
(function (SurfaceUtil) {
    /**
     * 引数 `src` が `undefined` または `Surface` でそのまま返す。
     * そうでなくかつ `ImageAsset` であれば `Surface` に変換して返す。
     *
     * @param src
     */
    function asSurface(src) {
        if (!src) {
            return undefined;
        }
        else if ("type" in src && src.type === "image") {
            return src.asSurface();
        }
        else if ("_drawable" in src) {
            return src;
        }
        throw ExceptionFactory_1.ExceptionFactory.createTypeMismatchError("SurfaceUtil#asSurface", "ImageAsset|Surface", src);
    }
    SurfaceUtil.asSurface = asSurface;
    /**
     * サーフェスのアニメーティングイベントへのハンドラ登録。
     *
     * これはエンジンが利用するものであり、ゲーム開発者が呼び出す必要はない。
     *
     * @param animatingHandler アニメーティングハンドラ
     * @param surface サーフェス
     */
    function setupAnimatingHandler(animatingHandler, surface) {
        if (surface.isPlaying()) {
            animatingHandler._handleAnimationStart();
        }
    }
    SurfaceUtil.setupAnimatingHandler = setupAnimatingHandler;
    /**
     * アニメーティングハンドラを別のサーフェスへ移動する。
     *
     * これはエンジンが利用するものであり、ゲーム開発者が呼び出す必要はない。
     *
     * @param animatingHandler アニメーティングハンドラ
     * @param beforeSurface ハンドラ登録を解除するサーフェス
     * @param afterSurface ハンドラを登録するサーフェス
     */
    function migrateAnimatingHandler(animatingHandler, _beforeSurface, afterSurface) {
        animatingHandler._handleAnimationStop();
        if (afterSurface.isPlaying()) {
            animatingHandler._handleAnimationStart();
        }
    }
    SurfaceUtil.migrateAnimatingHandler = migrateAnimatingHandler;
    /**
     * 対象の `Surface` にナインパッチ処理された `Surface` を描画する。
     *
     * これは、画像素材の拡大・縮小において「枠」の表現を実現するものである。
     * 画像の上下左右の「枠」部分の幅・高さを渡すことで、上下の「枠」を縦に引き延ばすことなく、
     * また左右の「枠」を横に引き延ばすことなく画像を任意サイズに拡大・縮小できる。
     * ゲームにおけるメッセージウィンドウやダイアログの表現に利用することを想定している。
     *
     * @param destSurface 描画先 `Surface`
     * @param srcSurface 描画元 `Surface`
     * @param borderWidth 上下左右の「拡大しない」領域の大きさ。すべて同じ値なら数値一つを渡すことができる。省略された場合、 `4`
     */
    function drawNinePatch(destSurface, srcSurface, borderWidth) {
        if (borderWidth === void 0) { borderWidth = 4; }
        var renderer = destSurface.renderer();
        var width = destSurface.width;
        var height = destSurface.height;
        var border;
        if (typeof borderWidth === "number") {
            border = {
                top: borderWidth,
                bottom: borderWidth,
                left: borderWidth,
                right: borderWidth
            };
        }
        else {
            border = borderWidth;
        }
        renderer.begin();
        renderer.clear();
        //    x0  x1                          x2
        // y0 +-----------------------------------+
        //    | 1 |             5             | 2 |
        // y1 |---+---------------------------+---|
        //    |   |                           |   |
        //    | 7 |             9             | 8 |
        //    |   |                           |   |
        // y2 |---+---------------------------+---|
        //    | 3 |             6             | 4 |
        //    +-----------------------------------+
        //
        // 1-4: 拡縮無し
        // 5-6: 水平方向へ拡縮
        // 7-8: 垂直方向へ拡縮
        // 9  : 全方向へ拡縮
        var sx1 = border.left;
        var sx2 = srcSurface.width - border.right;
        var sy1 = border.top;
        var sy2 = srcSurface.height - border.bottom;
        var dx1 = border.left;
        var dx2 = width - border.right;
        var dy1 = border.top;
        var dy2 = height - border.bottom;
        // Draw corners
        var srcCorners = [
            {
                x: 0,
                y: 0,
                width: border.left,
                height: border.top
            },
            {
                x: sx2,
                y: 0,
                width: border.right,
                height: border.top
            },
            {
                x: 0,
                y: sy2,
                width: border.left,
                height: border.bottom
            },
            {
                x: sx2,
                y: sy2,
                width: border.right,
                height: border.bottom
            }
        ];
        var destCorners = [
            { x: 0, y: 0 },
            { x: dx2, y: 0 },
            { x: 0, y: dy2 },
            { x: dx2, y: dy2 }
        ];
        for (var i = 0; i < srcCorners.length; ++i) {
            var c = srcCorners[i];
            renderer.save();
            renderer.translate(destCorners[i].x, destCorners[i].y);
            renderer.drawImage(srcSurface, c.x, c.y, c.width, c.height, 0, 0);
            renderer.restore();
        }
        // Draw borders
        var srcBorders = [
            { x: sx1, y: 0, width: sx2 - sx1, height: border.top },
            { x: 0, y: sy1, width: border.left, height: sy2 - sy1 },
            { x: sx2, y: sy1, width: border.right, height: sy2 - sy1 },
            { x: sx1, y: sy2, width: sx2 - sx1, height: border.bottom }
        ];
        var destBorders = [
            { x: dx1, y: 0, width: dx2 - dx1, height: border.top },
            { x: 0, y: dy1, width: border.left, height: dy2 - dy1 },
            { x: dx2, y: dy1, width: border.right, height: dy2 - dy1 },
            { x: dx1, y: dy2, width: dx2 - dx1, height: border.bottom }
        ];
        for (var i = 0; i < srcBorders.length; ++i) {
            var s = srcBorders[i];
            var d = destBorders[i];
            renderer.save();
            renderer.translate(d.x, d.y);
            renderer.transform([d.width / s.width, 0, 0, d.height / s.height, 0, 0]);
            renderer.drawImage(srcSurface, s.x, s.y, s.width, s.height, 0, 0);
            renderer.restore();
        }
        // Draw center
        var sw = sx2 - sx1;
        var sh = sy2 - sy1;
        var dw = dx2 - dx1;
        var dh = dy2 - dy1;
        renderer.save();
        renderer.translate(dx1, dy1);
        renderer.transform([dw / sw, 0, 0, dh / sh, 0, 0]);
        renderer.drawImage(srcSurface, sx1, sy1, sw, sh, 0, 0);
        renderer.restore();
        renderer.end();
    }
    SurfaceUtil.drawNinePatch = drawNinePatch;
})(SurfaceUtil = exports.SurfaceUtil || (exports.SurfaceUtil = {}));

},{"./ExceptionFactory":23}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAlign = void 0;
/**
 * テキストの描画位置。
 * @deprecated 非推奨である。将来的に削除される。代わりに `TextAlignString` を利用すること。
 */
var TextAlign;
(function (TextAlign) {
    /**
     * 左寄せ。
     */
    TextAlign[TextAlign["Left"] = 0] = "Left";
    /**
     * 中央寄せ。
     */
    TextAlign[TextAlign["Center"] = 1] = "Center";
    /**
     * 右寄せ。
     */
    TextAlign[TextAlign["Right"] = 2] = "Right";
})(TextAlign = exports.TextAlign || (exports.TextAlign = {}));

},{}],59:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],60:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],61:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
var trigger_1 = require("@akashic/trigger");
/**
 * 一定時間で繰り返される処理を表すタイマー。
 *
 * ゲーム開発者が本クラスのインスタンスを直接生成することはなく、
 * 通常はScene#setTimeout、Scene#setIntervalによって間接的に利用する。
 */
var Timer = /** @class */ (function () {
    function Timer(interval, fps) {
        this.interval = interval;
        // NOTE: intervalが浮動小数の場合があるため念のため四捨五入する
        this._scaledInterval = Math.round(interval * fps);
        this.onElapse = new trigger_1.Trigger();
        this.elapsed = this.onElapse;
        this._scaledElapsed = 0;
    }
    Timer.prototype.tick = function () {
        // NOTE: 1000 / fps * fps = 1000
        this._scaledElapsed += 1000;
        while (this._scaledElapsed >= this._scaledInterval) {
            // NOTE: this.elapsed.fire()内でdestroy()される可能性があるため、destroyed()を判定する
            if (!this.onElapse) {
                break;
            }
            this.onElapse.fire();
            this._scaledElapsed -= this._scaledInterval;
        }
    };
    Timer.prototype.canDelete = function () {
        return !this.onElapse || this.onElapse.length === 0;
    };
    Timer.prototype.destroy = function () {
        this.interval = undefined;
        this.onElapse.destroy();
        this.onElapse = undefined;
        this.elapsed = undefined;
        this._scaledInterval = 0;
        this._scaledElapsed = 0;
    };
    Timer.prototype.destroyed = function () {
        return this.onElapse === undefined;
    };
    return Timer;
}());
exports.Timer = Timer;

},{"@akashic/trigger":126}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerManager = exports.TimerIdentifier = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
var Timer_1 = require("./Timer");
/**
 * `Scene#setTimeout` や `Scene#setInterval` の実行単位を表す。
 * ゲーム開発者が本クラスのインスタンスを直接生成することはなく、
 * 本クラスの機能を直接利用することはない。
 */
var TimerIdentifier = /** @class */ (function () {
    function TimerIdentifier(timer, handler, handlerOwner, fired, firedOwner) {
        this._timer = timer;
        this._handler = handler;
        this._handlerOwner = handlerOwner;
        this._fired = fired;
        this._firedOwner = firedOwner;
        this._timer.onElapse.add(this._handleElapse, this);
    }
    TimerIdentifier.prototype.destroy = function () {
        this._timer.onElapse.remove(this._handleElapse, this);
        this._timer = undefined;
        this._handler = undefined;
        this._handlerOwner = undefined;
        this._fired = undefined;
        this._firedOwner = undefined;
    };
    TimerIdentifier.prototype.destroyed = function () {
        return this._timer === undefined;
    };
    /**
     * @private
     */
    TimerIdentifier.prototype._handleElapse = function () {
        if (this.destroyed())
            return;
        this._handler.call(this._handlerOwner);
        if (this._fired) {
            this._fired.call(this._firedOwner, this);
        }
    };
    return TimerIdentifier;
}());
exports.TimerIdentifier = TimerIdentifier;
/**
 * Timerを管理する機構を提供する。
 * ゲーム開発者が本クラスを利用する事はない。
 */
var TimerManager = /** @class */ (function () {
    function TimerManager(trigger, fps) {
        this._timers = [];
        this._trigger = trigger;
        this._identifiers = [];
        this._fps = fps;
        this._registered = false;
    }
    TimerManager.prototype.destroy = function () {
        for (var i = 0; i < this._identifiers.length; ++i) {
            this._identifiers[i].destroy();
        }
        for (var i = 0; i < this._timers.length; ++i) {
            this._timers[i].destroy();
        }
        this._timers = undefined;
        this._trigger = undefined;
        this._identifiers = undefined;
        this._fps = undefined;
    };
    TimerManager.prototype.destroyed = function () {
        return this._timers === undefined;
    };
    /**
     * 定期間隔で処理を実行するTimerを作成する。
     * 本Timerはフレーム経過によって動作する疑似タイマーであるため、実時間の影響は受けない
     * @param interval Timerの実行間隔（ミリ秒）
     * @returns 作成したTimer
     */
    TimerManager.prototype.createTimer = function (interval) {
        if (!this._registered) {
            this._trigger.add(this._tick, this);
            this._registered = true;
        }
        if (interval < 0)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("TimerManager#createTimer: invalid interval");
        // NODE: intervalが0の場合に、Timer#tick()で無限ループとなるためintervalの最小値を1とする。
        if (interval < 1)
            interval = 1;
        // NOTE: Timerの_scaledElapsedと比較するため、this.fps倍した値を用いる
        // Math.min(1000 / this._fps * this.fps, interval * this._fps);
        var acceptableMargin = Math.min(1000, interval * this._fps);
        for (var i = 0; i < this._timers.length; ++i) {
            if (this._timers[i].interval === interval) {
                if (this._timers[i]._scaledElapsed < acceptableMargin) {
                    return this._timers[i];
                }
            }
        }
        var timer = new Timer_1.Timer(interval, this._fps);
        this._timers.push(timer);
        return timer;
    };
    /**
     * Timerを削除する。
     * @param timer 削除するTimer
     */
    TimerManager.prototype.deleteTimer = function (timer) {
        if (!timer.canDelete())
            return;
        var index = this._timers.indexOf(timer);
        if (index < 0)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("TimerManager#deleteTimer: can not find timer");
        this._timers.splice(index, 1);
        timer.destroy();
        if (!this._timers.length) {
            if (!this._registered)
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("TimerManager#deleteTimer: handler is not handled");
            this._trigger.remove(this._tick, this);
            this._registered = false;
        }
    };
    TimerManager.prototype.setTimeout = function (handler, milliseconds, owner) {
        var timer = this.createTimer(milliseconds);
        var identifier = new TimerIdentifier(timer, handler, owner, this._onTimeoutFired, this);
        this._identifiers.push(identifier);
        return identifier;
    };
    TimerManager.prototype.clearTimeout = function (identifier) {
        this._clear(identifier);
    };
    TimerManager.prototype.setInterval = function (handler, interval, owner) {
        var timer = this.createTimer(interval);
        var identifier = new TimerIdentifier(timer, handler, owner);
        this._identifiers.push(identifier);
        return identifier;
    };
    TimerManager.prototype.clearInterval = function (identifier) {
        this._clear(identifier);
    };
    /**
     * すべてのTimerを時間経過させる。
     * @private
     */
    TimerManager.prototype._tick = function () {
        var timers = this._timers.concat();
        for (var i = 0; i < timers.length; ++i)
            timers[i].tick();
    };
    /**
     * @private
     */
    TimerManager.prototype._onTimeoutFired = function (identifier) {
        var index = this._identifiers.indexOf(identifier);
        if (index < 0)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("TimerManager#_onTimeoutFired: can not find identifier");
        this._identifiers.splice(index, 1);
        var timer = identifier._timer;
        identifier.destroy();
        this.deleteTimer(timer);
    };
    /**
     * @private
     */
    TimerManager.prototype._clear = function (identifier) {
        var index = this._identifiers.indexOf(identifier);
        if (index < 0)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("TimerManager#_clear: can not find identifier");
        if (identifier.destroyed())
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("TimerManager#_clear: invalid identifier");
        this._identifiers.splice(index, 1);
        var timer = identifier._timer;
        identifier.destroy();
        this.deleteTimer(timer);
    };
    return TimerManager;
}());
exports.TimerManager = TimerManager;

},{"./ExceptionFactory":23,"./Timer":62}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var pdi_types_1 = require("@akashic/pdi-types");
/**
 * ユーティリティ。
 */
var Util;
(function (Util) {
    var _a;
    /**
     * 2点間(P1..P2)の距離(pixel)を返す。
     * @param {number} p1x P1-X
     * @param {number} p1y P1-Y
     * @param {number} p2x P2-X
     * @param {number} p2y P2-Y
     */
    function distance(p1x, p1y, p2x, p2y) {
        return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
    }
    Util.distance = distance;
    /**
     * 2点間(P1..P2)の距離(pixel)を返す。
     * @param {CommonOffset} p1 座標1
     * @param {CommonOffset} p2 座標2
     */
    function distanceBetweenOffsets(p1, p2) {
        return Util.distance(p1.x, p1.y, p2.x, p2.y);
    }
    Util.distanceBetweenOffsets = distanceBetweenOffsets;
    /**
     * 2つの矩形の中心座標(P1..P2)間の距離(pixel)を返す。
     * @param {CommonArea} p1 矩形1
     * @param {CommonArea} p2 矩形2
     */
    function distanceBetweenAreas(p1, p2) {
        return Util.distance(p1.x + p1.width / 2, p1.y + p1.height / 2, p2.x + p2.width / 2, p2.y + p2.height / 2);
    }
    Util.distanceBetweenAreas = distanceBetweenAreas;
    /**
     * idx文字目の文字のchar codeを返す。
     *
     * これはString#charCodeAt()と次の点で異なる。
     * - idx文字目が上位サロゲートの時これを16bit左シフトし、idx+1文字目の下位サロゲートと論理和をとった値を返す。
     * - idx文字目が下位サロゲートの時nullを返す。
     *
     * @param str 文字を取り出される文字列
     * @param idx 取り出される文字の位置
     */
    // highly based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    function charCodeAt(str, idx) {
        var code = str.charCodeAt(idx);
        if (0xd800 <= code && code <= 0xdbff) {
            var hi = code;
            var low = str.charCodeAt(idx + 1);
            return (hi << 16) | low;
        }
        if (0xdc00 <= code && code <= 0xdfff) {
            // Low surrogate
            return null;
        }
        return code;
    }
    Util.charCodeAt = charCodeAt;
    /**
     * enum の値の文字列を snake-case に変換した文字列を返す。
     * @deprecated 非推奨である。非推奨の機能との互換性確保のために存在する。ゲーム開発者が使用すべきではない。
     */
    function enumToSnakeCase(enumDef, val) {
        var s = enumDef[val];
        return (s[0].toLowerCase() + s.slice(1).replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); }));
    }
    Util.enumToSnakeCase = enumToSnakeCase;
    /**
     * CompositeOperation を CompositeOperationString に読み替えるテーブル。
     * @deprecated 非推奨である。非推奨の機能との互換性のために存在する。ゲーム開発者が使用すべきではない。
     */
    // enumToSnakeCase() で代用できるが、 CompositeOperation の変換は複数回実行されうるので専用のテーブルを作っている。
    Util.compositeOperationStringTable = (_a = {},
        _a[pdi_types_1.CompositeOperation.SourceOver] = "source-over",
        _a[pdi_types_1.CompositeOperation.SourceAtop] = "source-atop",
        _a[pdi_types_1.CompositeOperation.Lighter] = "lighter",
        _a[pdi_types_1.CompositeOperation.Copy] = "copy",
        _a[pdi_types_1.CompositeOperation.ExperimentalSourceIn] = "experimental-source-in",
        _a[pdi_types_1.CompositeOperation.ExperimentalSourceOut] = "experimental-source-out",
        _a[pdi_types_1.CompositeOperation.ExperimentalDestinationAtop] = "experimental-destination-atop",
        _a[pdi_types_1.CompositeOperation.ExperimentalDestinationIn] = "experimental-destination-in",
        _a[pdi_types_1.CompositeOperation.DestinationOut] = "destination-out",
        _a[pdi_types_1.CompositeOperation.DestinationOver] = "destination-over",
        _a[pdi_types_1.CompositeOperation.Xor] = "xor",
        _a);
})(Util = exports.Util || (exports.Util = {}));

},{"@akashic/pdi-types":108}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSystem = void 0;
/**
 * 将来 VideoPlayerインスタンスの一元管理（ボリューム設定などAudioSystemと似た役割）
 * を担うインターフェース。VideoAssetはVideoSystemを持つという体裁を整えるために(中身が空であるが)
 * 定義されている。
 * TODO: 実装
 */
var VideoSystem = /** @class */ (function () {
    function VideoSystem() {
    }
    return VideoSystem;
}());
exports.VideoSystem = VideoSystem;

},{}],66:[function(require,module,exports){
"use strict";
// Copyright (c) 2014 Andreas Madsen & Emil Bay
// From https://github.com/AndreasMadsen/xorshift
// https://github.com/AndreasMadsen/xorshift/blob/master/LICENSE.md
// Arranged by DWANGO Co., Ltd.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xorshift = void 0;
var Xorshift = /** @class */ (function () {
    function Xorshift(seed) {
        this.initState(seed);
    }
    Xorshift.deserialize = function (ser) {
        var ret = new Xorshift(0);
        ret._state0U = ser._state0U;
        ret._state0L = ser._state0L;
        ret._state1U = ser._state1U;
        ret._state1L = ser._state1L;
        return ret;
    };
    // シード値が1つの場合にどのようにして初期状態を定義するかは特に定まっていない
    // このコードはロジック的な裏付けは無いが採用例が多いために採用した
    // 以下採用例
    // http://meme.biology.tohoku.ac.jp/klabo-wiki/index.php?cmd=read&page=%B7%D7%BB%BB%B5%A1%2FC%2B%2B#y919a7e1
    // http://hexadrive.sblo.jp/article/63660775.html
    // http://meme.biology.tohoku.ac.jp/students/iwasaki/cxx/random.html#xorshift
    Xorshift.prototype.initState = function (seed) {
        var factor = 1812433253;
        seed = factor * (seed ^ (seed >> 30)) + 1;
        this._state0U = seed;
        seed = factor * (seed ^ (seed >> 30)) + 2;
        this._state0L = seed;
        seed = factor * (seed ^ (seed >> 30)) + 3;
        this._state1U = seed;
        seed = factor * (seed ^ (seed >> 30)) + 4;
        this._state1L = seed;
    };
    Xorshift.prototype.randomInt = function () {
        var s1U = this._state0U;
        var s1L = this._state0L;
        var s0U = this._state1U;
        var s0L = this._state1L;
        this._state0U = s0U;
        this._state0L = s0L;
        var t1U = 0;
        var t1L = 0;
        var t2U = 0;
        var t2L = 0;
        var a1 = 23;
        var m1 = 0xffffffff << (32 - a1);
        t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1));
        t1L = s1L << a1;
        s1U = s1U ^ t1U;
        s1L = s1L ^ t1L;
        t1U = s1U ^ s0U;
        t1L = s1L ^ s0L;
        var a2 = 17;
        var m2 = 0xffffffff >>> (32 - a2);
        t2U = s1U >>> a2;
        t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2));
        t1U = t1U ^ t2U;
        t1L = t1L ^ t2L;
        var a3 = 26;
        var m3 = 0xffffffff >>> (32 - a3);
        t2U = s0U >>> a3;
        t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3));
        t1U = t1U ^ t2U;
        t1L = t1L ^ t2L;
        this._state1U = t1U;
        this._state1L = t1L;
        var sumL = (t1L >>> 0) + (s0L >>> 0);
        t2U = (t1U + s0U + ((sumL / 2) >>> 31)) >>> 0;
        t2L = sumL >>> 0;
        return [t2U, t2L];
    };
    Xorshift.prototype.random = function () {
        var t2 = this.randomInt();
        return (t2[0] * 4294967296 + t2[1]) / 18446744073709551616;
    };
    Xorshift.prototype.nextInt = function (min, sup) {
        return Math.floor(min + this.random() * (sup - min));
    };
    Xorshift.prototype.serialize = function () {
        return {
            _state0U: this._state0U,
            _state0L: this._state0L,
            _state1U: this._state1U,
            _state1L: this._state1L
        };
    };
    return Xorshift;
}());
exports.Xorshift = Xorshift;

},{}],67:[function(require,module,exports){
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
exports.XorshiftRandomGenerator = void 0;
var ExceptionFactory_1 = require("./ExceptionFactory");
var RandomGenerator_1 = require("./RandomGenerator");
var Xorshift_1 = require("./Xorshift");
/**
 * Xorshiftを用いた乱数生成期。
 */
var XorshiftRandomGenerator = /** @class */ (function (_super) {
    __extends(XorshiftRandomGenerator, _super);
    function XorshiftRandomGenerator(seed, xorshift) {
        var _this = this;
        if (seed === undefined) {
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("XorshiftRandomGenerator#constructor: seed is undefined");
        }
        else {
            _this = _super.call(this, seed) || this;
            if (!!xorshift) {
                _this._xorshift = Xorshift_1.Xorshift.deserialize(xorshift);
            }
            else {
                _this._xorshift = new Xorshift_1.Xorshift(seed);
            }
        }
        return _this;
    }
    XorshiftRandomGenerator.deserialize = function (ser) {
        return new XorshiftRandomGenerator(ser._seed, ser._xorshift);
    };
    /**
     * 乱数を生成する。
     * `min` 以上 `max` 以下の数値を返す。
     *
     * @deprecated 非推奨である。将来的に削除される。代わりに `XorshiftRandomGenerator#generate()` を利用すること。
     */
    XorshiftRandomGenerator.prototype.get = function (min, max) {
        return this._xorshift.nextInt(min, max + 1);
    };
    /**
     * 乱数を生成する。
     * 0 以上 1 未満の数値を返す。
     *
     * ローカルイベントの処理中を除き、原則 `Math.random()` ではなくこのメソッドを利用すること。
     */
    XorshiftRandomGenerator.prototype.generate = function () {
        return this._xorshift.random();
    };
    XorshiftRandomGenerator.prototype.serialize = function () {
        return {
            _seed: this.seed,
            _xorshift: this._xorshift.serialize()
        };
    };
    return XorshiftRandomGenerator;
}(RandomGenerator_1.RandomGenerator));
exports.XorshiftRandomGenerator = XorshiftRandomGenerator;

},{"./ExceptionFactory":23,"./RandomGenerator":43,"./Xorshift":66}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyVectorImageAsset = void 0;
var trigger_1 = require("@akashic/trigger");
var EmptyVectorImageAsset = /** @class */ (function () {
    function EmptyVectorImageAsset(id, path, width, height, hint) {
        this.type = "vector-image";
        this.width = 0;
        this.height = 0;
        this.onDestroyed = new trigger_1.Trigger();
        this.id = id;
        this.path = path;
        this.originalPath = path;
        this.width = width;
        this.height = height;
        this.hint = hint;
    }
    EmptyVectorImageAsset.prototype.createSurface = function (_width, _height, _sx, _sy, _sWidth, _sHeight) {
        return null;
    };
    EmptyVectorImageAsset.prototype.inUse = function () {
        return false;
    };
    EmptyVectorImageAsset.prototype.destroy = function () {
        if (this.destroyed()) {
            return;
        }
        this.onDestroyed.destroy();
        this.onDestroyed = undefined;
    };
    EmptyVectorImageAsset.prototype.destroyed = function () {
        return !this.onDestroyed;
    };
    EmptyVectorImageAsset.prototype._load = function (loader) {
        loader._onAssetLoad(this);
    };
    EmptyVectorImageAsset.prototype._assetPathFilter = function (path) {
        return path;
    };
    return EmptyVectorImageAsset;
}());
exports.EmptyVectorImageAsset = EmptyVectorImageAsset;

},{"@akashic/trigger":126}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialImageAsset = void 0;
var trigger_1 = require("@akashic/trigger");
/**
 * 部分画像アセット。
 *
 * `resourceFacotory.createImageAsset()` で生成したアセットをラップし、`slice` で指定される領域の画像アセットとして振る舞う。
 * 通常、ゲーム開発者がこのクラスを生成する必要はない。
 */
var PartialImageAsset = /** @class */ (function () {
    /**
     * 部分画像アセットを生成する。
     *
     * `createImageAsset()` と異なり、 `slice` で指定された領域の画像アセットとして振る舞うため、
     * `this.width`, `this.height` が引数の `width`, height` ではなく `slice` の値で初期化される点に注意。
     * (`width`, `height` は元になる画像アセットの生成に使われる)
     */
    function PartialImageAsset(resourceFactory, id, uri, width, height, slice) {
        this.type = "image";
        this.hint = undefined;
        this.onDestroyed = new trigger_1.Trigger();
        this._surface = null;
        this._loadHandler = null;
        this.id = id;
        this.path = uri;
        this.originalPath = uri;
        this.width = slice.width;
        this.height = slice.height;
        this._slice = slice;
        this._resourceFactory = resourceFactory;
        var internalId = "".concat(id, "/<internal>"); // AssetManager が管理しないので値は何でもよいが、わかりやすさのため `id` を元にしておく
        this._src = resourceFactory.createImageAsset(internalId, uri, width, height);
    }
    PartialImageAsset.prototype.initialize = function (hint) {
        this.hint = hint; // 自分では使わないが、外部観測的に `ImageAsset` と合うように代入しておく
        this._src.initialize(hint);
    };
    PartialImageAsset.prototype.inUse = function () {
        return false;
    };
    PartialImageAsset.prototype.destroy = function () {
        if (this.destroyed()) {
            return;
        }
        this.onDestroyed.fire(this);
        this._src.destroy();
        this._src = null;
        this._slice = null;
        this._resourceFactory = null;
        this._surface = null;
        this._loadHandler = null;
        this.onDestroyed.destroy();
        this.onDestroyed = undefined;
    };
    PartialImageAsset.prototype.destroyed = function () {
        return !this._src;
    };
    PartialImageAsset.prototype.asSurface = function () {
        if (this._surface)
            return this._surface;
        var _a = this._slice, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var surface = this._resourceFactory.createSurface(width, height);
        var r = surface.renderer();
        r.begin();
        r.drawImage(this._src.asSurface(), x, y, width, height, 0, 0);
        r.end();
        this._surface = surface;
        return surface;
    };
    /**
     * @private
     */
    PartialImageAsset.prototype._load = function (loader) {
        this._loadHandler = loader;
        this._src._load(this);
    };
    /**
     * this._src 用のロードハンドラ。
     * @private
     */
    PartialImageAsset.prototype._onAssetLoad = function (_asset) {
        this._loadHandler._onAssetLoad(this);
    };
    /**
     * this._src 用のロードエラーハンドラ。
     * @private
     */
    PartialImageAsset.prototype._onAssetError = function (_asset, error) {
        this._loadHandler._onAssetError(this, error);
    };
    /**
     * @private
     */
    PartialImageAsset.prototype._assetPathFilter = function (path) {
        return path;
    };
    return PartialImageAsset;
}());
exports.PartialImageAsset = PartialImageAsset;

},{"@akashic/trigger":126}],70:[function(require,module,exports){
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
exports.CacheableE = void 0;
var E_1 = require("./E");
/**
 * 内部描画キャッシュを持つ `E` 。
 */
var CacheableE = /** @class */ (function (_super) {
    __extends(CacheableE, _super);
    /**
     * 各種パラメータを指定して `CacheableE` のインスタンスを生成する。
     * @param param このエンティティに対するパラメータ
     */
    function CacheableE(param) {
        var _this = _super.call(this, param) || this;
        _this._shouldRenderChildren = true;
        _this._cache = undefined;
        _this._renderer = undefined;
        _this._renderedCamera = undefined;
        return _this;
    }
    /**
     * このエンティティの描画キャッシュ無効化をエンジンに通知する。
     * このメソッドを呼び出し後、描画キャッシュの再構築が行われ、各 `Renderer` に描画内容の変更が反映される。
     */
    CacheableE.prototype.invalidate = function () {
        this.state &= ~2 /* Cached */;
        this.modified();
    };
    /**
     * このエンティティ自身の描画を行う。
     * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
     */
    CacheableE.prototype.renderSelf = function (renderer, camera) {
        var padding = CacheableE.PADDING;
        if (this._renderedCamera !== camera) {
            this.state &= ~2 /* Cached */;
            this._renderedCamera = camera;
        }
        if (!(this.state & 2 /* Cached */)) {
            this._cacheSize = this.calculateCacheSize();
            var w = Math.ceil(this._cacheSize.width) + padding * 2;
            var h = Math.ceil(this._cacheSize.height) + padding * 2;
            var isNew = !this._cache || this._cache.width < w || this._cache.height < h;
            if (isNew) {
                if (this._cache && !this._cache.destroyed()) {
                    this._cache.destroy();
                }
                this._cache = this.scene.game.resourceFactory.createSurface(w, h);
                this._renderer = this._cache.renderer();
            }
            var cacheRenderer = this._renderer;
            cacheRenderer.begin();
            if (!isNew) {
                cacheRenderer.clear();
            }
            cacheRenderer.save();
            cacheRenderer.translate(padding, padding);
            this.renderCache(cacheRenderer, camera);
            cacheRenderer.restore();
            this.state |= 2 /* Cached */;
            cacheRenderer.end();
        }
        if (this._cache && this._cacheSize.width > 0 && this._cacheSize.height > 0) {
            renderer.translate(-padding, -padding);
            this.renderSelfFromCache(renderer);
            renderer.translate(padding, padding);
        }
        return this._shouldRenderChildren;
    };
    /**
     * 内部キャッシュから自身の描画を行う。
     * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
     */
    CacheableE.prototype.renderSelfFromCache = function (renderer) {
        renderer.drawImage(this._cache, 0, 0, this._cacheSize.width + CacheableE.PADDING, this._cacheSize.height + CacheableE.PADDING, 0, 0);
    };
    /**
     * 利用している `Surface` を破棄した上で、このエンティティを破棄する。
     */
    CacheableE.prototype.destroy = function () {
        if (this._cache && !this._cache.destroyed()) {
            this._cache.destroy();
        }
        this._cache = undefined;
        _super.prototype.destroy.call(this);
    };
    /**
     * キャッシュのサイズを取得する。
     * 本クラスを継承したクラスでエンティティのサイズと異なるサイズを利用する場合、このメソッドをオーバーライドする。
     * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
     * このメソッドから得られる値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
     */
    CacheableE.prototype.calculateCacheSize = function () {
        return {
            width: this.width,
            height: this.height
        };
    };
    /**
     * _cache のパディングサイズ。
     *
     * @private
     */
    CacheableE.PADDING = 1;
    return CacheableE;
}(E_1.E));
exports.CacheableE = CacheableE;

},{"./E":72}],71:[function(require,module,exports){
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
exports.CameraCancellingE = void 0;
var Object2D_1 = require("../Object2D");
var E_1 = require("./E");
/**
 * カメラのtransformを戻すエンティティ。
 * 特定シーンのエンティティがカメラの影響を受けないようにするための内部エンティティ。
 */
var CameraCancellingE = /** @class */ (function (_super) {
    __extends(CameraCancellingE, _super);
    function CameraCancellingE(param) {
        var _this = _super.call(this, param) || this;
        _this._canceller = new Object2D_1.Object2D();
        return _this;
    }
    CameraCancellingE.prototype.renderSelf = function (renderer, camera) {
        if (!this.children)
            return false;
        if (camera) {
            var c = camera;
            var canceller = this._canceller;
            if (c.x !== canceller.x ||
                c.y !== canceller.y ||
                c.angle !== canceller.angle ||
                c.scaleX !== canceller.scaleX ||
                c.scaleY !== canceller.scaleY) {
                canceller.x = c.x;
                canceller.y = c.y;
                canceller.angle = c.angle;
                canceller.scaleX = c.scaleX;
                canceller.scaleY = c.scaleY;
                if (canceller._matrix) {
                    canceller._matrix._modified = true;
                }
            }
            renderer.save();
            renderer.transform(canceller.getMatrix()._matrix);
        }
        // Note: concatしていないのでunsafeだが、render中に配列の中身が変わる事はない前提とする
        var children = this.children;
        for (var i = 0; i < children.length; ++i)
            children[i].render(renderer, camera);
        if (camera) {
            renderer.restore();
        }
        return false;
    };
    return CameraCancellingE;
}(E_1.E));
exports.CameraCancellingE = CameraCancellingE;

},{"../Object2D":35,"./E":72}],72:[function(require,module,exports){
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
exports.E = exports.PointMoveEvent = exports.PointUpEvent = exports.PointDownEvent = void 0;
var trigger_1 = require("@akashic/trigger");
var Event_1 = require("../Event");
var ExceptionFactory_1 = require("../ExceptionFactory");
var Matrix_1 = require("../Matrix");
var Object2D_1 = require("../Object2D");
var Util_1 = require("../Util");
/**
 * ポインティング操作の開始を表すイベント。
 */
var PointDownEvent = /** @class */ (function (_super) {
    __extends(PointDownEvent, _super);
    function PointDownEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PointDownEvent;
}(Event_1.PointDownEventBase));
exports.PointDownEvent = PointDownEvent;
/**
 * ポインティング操作の終了を表すイベント。
 * PointDownEvent後にのみ発生する。
 *
 * PointUpEvent#startDeltaによってPointDownEvent時からの移動量が、
 * PointUpEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
 * PointUpEvent#pointにはPointDownEvent#pointと同じ値が格納される。
 */
var PointUpEvent = /** @class */ (function (_super) {
    __extends(PointUpEvent, _super);
    function PointUpEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PointUpEvent;
}(Event_1.PointUpEventBase));
exports.PointUpEvent = PointUpEvent;
/**
 * ポインティング操作の移動を表すイベント。
 * PointDownEvent後にのみ発生するため、MouseMove相当のものが本イベントとして発生することはない。
 *
 * PointMoveEvent#startDeltaによってPointDownEvent時からの移動量が、
 * PointMoveEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
 * PointMoveEvent#pointにはPointMoveEvent#pointと同じ値が格納される。
 *
 * 本イベントは、プレイヤーがポインティングデバイスを移動していなくても、
 * カメラの移動等視覚的にポイントが変化している場合にも発生する。
 */
var PointMoveEvent = /** @class */ (function (_super) {
    __extends(PointMoveEvent, _super);
    function PointMoveEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PointMoveEvent;
}(Event_1.PointMoveEventBase));
exports.PointMoveEvent = PointMoveEvent;
/**
 * akashic-engineに描画される全てのエンティティを表す基底クラス。
 * 本クラス単体に描画処理にはなく、直接利用する場合はchildrenを利用したコンテナとして程度で利用される。
 */
var E = /** @class */ (function (_super) {
    __extends(E, _super);
    // pointMoveは代入する必要がないのでsetterを定義しない
    /**
     * 各種パラメータを指定して `E` のインスタンスを生成する。
     * @param param 初期化に用いるパラメータのオブジェクト
     */
    function E(param) {
        var _this = _super.call(this, param) || this;
        _this.children = undefined;
        _this.parent = undefined;
        _this._touchable = false;
        _this.state = 0 /* None */;
        _this._hasTouchableChildren = false;
        _this._onUpdate = undefined;
        _this._onMessage = undefined;
        _this._onPointDown = undefined;
        _this._onPointMove = undefined;
        _this._onPointUp = undefined;
        _this.tag = param.tag;
        _this.shaderProgram = param.shaderProgram;
        // local は Scene#register() や this.append() の呼び出しよりも先に立てなければならない
        // ローカルシーン・ローカルティック補間シーンのエンティティは強制的に local (ローカルティックが来て他プレイヤーとずれる可能性がある)
        _this.local = param.scene.local !== "non-local" || !!param.local;
        if (param.children) {
            for (var i = 0; i < param.children.length; ++i)
                _this.append(param.children[i]);
        }
        if (param.parent) {
            param.parent.append(_this);
        }
        if (param.touchable != null)
            _this.touchable = param.touchable;
        if (!!param.hidden)
            _this.hide();
        // set id, scene
        // @ts-ignore NOTE: Game クラスで割り当てられるため、ここでは undefined を許容している
        _this.id = param.id;
        param.scene.register(_this);
        return _this;
    }
    Object.defineProperty(E.prototype, "onUpdate", {
        /**
         * 時間経過イベント。本イベントの一度のfireにつき、常に1フレーム分の時間経過が起こる。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            if (!this._onUpdate)
                this._onUpdate = new trigger_1.ChainTrigger(this.scene.onUpdate);
            return this._onUpdate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "onMessage", {
        // onUpdateは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのmessageイベント。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            if (!this._onMessage)
                this._onMessage = new trigger_1.ChainTrigger(this.scene.onMessage);
            return this._onMessage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "onPointDown", {
        // onMessageは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのpoint downイベント。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            if (!this._onPointDown)
                this._onPointDown = new trigger_1.ChainTrigger(this.scene.onPointDownCapture, this._isTargetOperation, this);
            return this._onPointDown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "onPointUp", {
        // onPointDownは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのpoint upイベント。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            if (!this._onPointUp)
                this._onPointUp = new trigger_1.ChainTrigger(this.scene.onPointUpCapture, this._isTargetOperation, this);
            return this._onPointUp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "onPointMove", {
        // onPointUpは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのpoint moveイベント。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            if (!this._onPointMove)
                this._onPointMove = new trigger_1.ChainTrigger(this.scene.onPointMoveCapture, this._isTargetOperation, this);
            return this._onPointMove;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "touchable", {
        // onPointMoveは代入する必要がないのでsetterを定義しない
        /**
         * プレイヤーにとって触れられるオブジェクトであるかを表す。
         *
         * この値が偽である場合、ポインティングイベントの対象にならない。
         * 初期値は `false` である。
         *
         * `E` の他のプロパティと異なり、この値の変更後に `this.modified()` を呼び出す必要はない。
         */
        get: function () {
            return this._touchable;
        },
        set: function (v) {
            if (this._touchable === v)
                return;
            this._touchable = v;
            if (v) {
                this._enableTouchPropagation();
            }
            else {
                this._disableTouchPropagation();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "update", {
        /**
         * 時間経過イベント。本イベントの一度のfireにつき、常に1フレーム分の時間経過が起こる。
         * @deprecated 非推奨である。将来的に削除される。代わりに `onUpdate` を利用すること。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            return this.onUpdate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "message", {
        // updateは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのmessageイベント。
         * @deprecated 非推奨である。将来的に削除される。代わりに `onMessage` を利用すること。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            return this.onMessage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "pointDown", {
        // messageは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのpoint downイベント。
         * @deprecated 非推奨である。将来的に削除される。代わりに `onPointDown` を利用すること。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            return this.onPointDown;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "pointUp", {
        // pointDownは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのpoint upイベント。
         * @deprecated 非推奨である。将来的に削除される。代わりに `onPointUp` を利用すること。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            return this.onPointUp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(E.prototype, "pointMove", {
        // pointUpは代入する必要がないのでsetterを定義しない
        /**
         * このエンティティのpoint moveイベント。
         * @deprecated 非推奨である。将来的に削除される。代わりに `onPointMove` を利用すること。
         */
        // Eの生成コスト低減を考慮し、参照された時のみ生成出来るようアクセサを使う
        get: function () {
            return this.onPointMove;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 自分自身と子孫の内容を描画する。
     *
     * このメソッドは、 `Renderer#draw()` からエンティティのツリー構造をトラバースする過程で暗黙に呼び出される。
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     * @param renderer 描画先に対するRenderer
     * @param camera 対象のカメラ。省略された場合、undefined
     */
    E.prototype.render = function (renderer, camera) {
        this.state &= ~4 /* Modified */;
        if (this.state & 1 /* Hidden */)
            return;
        if (this.state & 8 /* ContextLess */) {
            renderer.translate(this.x, this.y);
            var goDown_1 = this.renderSelf(renderer, camera);
            if (goDown_1 && this.children) {
                var children = this.children;
                var len = children.length;
                for (var i = 0; i < len; ++i)
                    children[i].render(renderer, camera);
            }
            renderer.translate(-this.x, -this.y);
            return;
        }
        renderer.save();
        if (this.angle || this.scaleX !== 1 || this.scaleY !== 1 || this.anchorX !== 0 || this.anchorY !== 0) {
            // Note: this.scaleX/scaleYが0の場合描画した結果何も表示されない事になるが、特殊扱いはしない
            renderer.transform(this.getMatrix()._matrix);
        }
        else {
            // Note: 変形なしのオブジェクトはキャッシュもとらずtranslateのみで処理
            renderer.translate(this.x, this.y);
        }
        if (this.opacity !== 1)
            renderer.opacity(this.opacity);
        var op = this.compositeOperation;
        if (op !== undefined) {
            renderer.setCompositeOperation(typeof op === "string" ? op : Util_1.Util.compositeOperationStringTable[op]);
        }
        if (this.shaderProgram !== undefined && renderer.isSupportedShaderProgram())
            renderer.setShaderProgram(this.shaderProgram);
        var goDown = this.renderSelf(renderer, camera);
        if (goDown && this.children) {
            // Note: concatしていないのでunsafeだが、render中に配列の中身が変わる事はない前提とする
            var children = this.children;
            for (var i = 0; i < children.length; ++i)
                children[i].render(renderer, camera);
        }
        renderer.restore();
    };
    /**
     * 自分自身の内容を描画する。
     *
     * このメソッドは、 `Renderer#draw()` からエンティティのツリー構造をトラバースする過程で暗黙に呼び出される。
     * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
     *
     * 戻り値は、このエンティティの子孫の描画をスキップすべきであれば偽、でなければ真である。
     * (この値は、子孫の描画方法をカスタマイズする一部のサブクラスにおいて、通常の描画パスをスキップするために用いられる)
     *
     * @param renderer 描画先に対するRenderer
     * @param camera 対象のカメラ
     */
    E.prototype.renderSelf = function (_renderer, _camera) {
        // nothing to do
        return true;
    };
    /**
     * このエンティティが属する `Game` を返す。
     */
    E.prototype.game = function () {
        return this.scene.game;
    };
    /**
     * 子を追加する。
     *
     * @param e 子エンティティとして追加するエンティティ
     */
    E.prototype.append = function (e) {
        this.insertBefore(e, undefined);
    };
    /**
     * 子を挿入する。
     *
     * `target` が`this` の子でない場合、`append(e)` と同じ動作となる。
     *
     * @param e 子エンティティとして追加するエンティティ
     * @param target 挿入位置にある子エンティティ
     */
    E.prototype.insertBefore = function (e, target) {
        if (e.parent)
            e.remove();
        if (!this.children)
            this.children = [];
        e.parent = this;
        var index = -1;
        if (target !== undefined && (index = this.children.indexOf(target)) > -1) {
            this.children.splice(index, 0, e);
        }
        else {
            this.children.push(e);
        }
        if (e._touchable || e._hasTouchableChildren) {
            this._hasTouchableChildren = true;
            this._enableTouchPropagation();
        }
        this.modified(true);
    };
    /**
     * 子を削除する。
     *
     * `e` が `this` の子でない場合、 `AssertionError` がthrowされる。
     * `e === undefined` であり親がない場合、 `AssertionError` がthrowされる。
     *
     * @param e 削除する子エンティティ。省略された場合、自身を親から削除する
     */
    E.prototype.remove = function (e) {
        if (e === undefined) {
            this.parent.remove(this);
            return;
        }
        var index = this.children ? this.children.indexOf(e) : -1;
        if (index < 0)
            throw ExceptionFactory_1.ExceptionFactory.createAssertionError("E#remove: invalid child");
        this.children[index].parent = undefined;
        this.children.splice(index, 1);
        if (e._touchable || e._hasTouchableChildren) {
            if (!this._findTouchableChildren(this)) {
                this._hasTouchableChildren = false;
                this._disableTouchPropagation();
            }
        }
        this.modified(true);
    };
    /**
     * このエンティティを破棄する。
     *
     * 親がある場合、親からは `remove()` される。
     * 子孫を持っている場合、子孫も破棄される。
     */
    E.prototype.destroy = function () {
        if (this.parent)
            this.remove();
        if (this.children) {
            for (var i = this.children.length - 1; i >= 0; --i) {
                this.children[i].destroy();
            }
            if (this.children.length !== 0)
                throw ExceptionFactory_1.ExceptionFactory.createAssertionError("E#destroy: can not destroy all children, " + this.children.length);
            this.children = undefined;
        }
        // この解放はstringとforeachを使って書きたいが、minifyする時は.アクセスの方がいいのでやむを得ない
        if (this._onUpdate) {
            this._onUpdate.destroy();
            this._onUpdate = undefined;
        }
        if (this._onMessage) {
            this._onMessage.destroy();
            this._onMessage = undefined;
        }
        if (this._onPointDown) {
            this._onPointDown.destroy();
            this._onPointDown = undefined;
        }
        if (this._onPointMove) {
            this._onPointMove.destroy();
            this._onPointMove = undefined;
        }
        if (this._onPointUp) {
            this._onPointUp.destroy();
            this._onPointUp = undefined;
        }
        this.scene.unregister(this);
    };
    /**
     * このエンティティが破棄済みであるかを返す。
     */
    E.prototype.destroyed = function () {
        return this.scene === undefined;
    };
    /**
     * このエンティティに対する変更をエンジンに通知する。
     *
     * このメソッドの呼び出し後、 `this` に対する変更が各 `Renderer` の描画に反映される。
     * ただし逆は真ではない。すなわち、再描画は他の要因によって行われることもある。
     * ゲーム開発者は、このメソッドを呼び出していないことをもって再描画が行われていないことを仮定してはならない。
     *
     * 本メソッドは、このオブジェクトの `Object2D` 由来のプロパティ (`x`, `y`, `angle` など) を変更した場合にも呼びだす必要がある。
     * 本メソッドは、描画キャッシュの無効化処理を含まない。描画キャッシュを持つエンティティは、このメソッドとは別に `invalidate()` を提供している。
     * 描画キャッシュの無効化も必要な場合は、このメソッドではなくそちらを呼び出す必要がある。
     * @param isBubbling 通常ゲーム開発者が指定する必要はない。この変更通知が、(このエンティティ自身のみならず)子孫の変更の通知を含む場合、真を渡さなければならない。省略された場合、偽。
     */
    E.prototype.modified = function (_isBubbling) {
        // _matrixの用途は描画に限らない(e.g. E#findPointSourceByPoint)ので、Modifiedフラグと無関係にクリアする必要がある
        if (this._matrix)
            this._matrix._modified = true;
        if (this.angle ||
            this.scaleX !== 1 ||
            this.scaleY !== 1 ||
            this.anchorX !== 0 ||
            this.anchorY !== 0 ||
            this.opacity !== 1 ||
            this.compositeOperation !== undefined ||
            this.shaderProgram !== undefined) {
            this.state &= ~8 /* ContextLess */;
        }
        else {
            this.state |= 8 /* ContextLess */;
        }
        if (this.state & 4 /* Modified */)
            return;
        this.state |= 4 /* Modified */;
        if (this.parent)
            this.parent.modified(true);
    };
    /**
     * このメソッドは、 `E#findPointSourceByPoint()` 内で子孫の探索をスキップすべきか判断するために呼ばれる。
     * 通常、子孫の描画方法をカスタマイズする一部のサブクラスにおいて、与えられた座標に対する子孫の探索を制御する場合に利用する。
     * ゲーム開発者がこのメソッドを呼び出す必要はない。
     *
     * 戻り値は、子孫の探索をスキップすべきであれば偽、でなければ真である。
     *
     * @param point このエンティティ（`this`）の位置を基準とした相対座標
     */
    E.prototype.shouldFindChildrenByPoint = function (_point) {
        // nothing to do
        return true;
    };
    /**
     * 自身と自身の子孫の中で、その座標に反応する `PointSource` を返す。
     *
     * 戻り値は、対象が見つかった場合、 `target` に見つかったエンティティを持つ `PointSource` である。
     * 対象が見つからなかった場合、 `undefined` である。戻り値が `undefined` でない場合、その `target` プロパティは次を満たす:
     * - このエンティティ(`this`) またはその子孫である
     * - `E#touchable` が真である
     *
     * @param point 対象の座標
     * @param m `this` に適用する変換行列。省略された場合、単位行列
     * @param force touchable指定を無視する場合真を指定する。省略された場合、偽
     */
    E.prototype.findPointSourceByPoint = function (point, m, force) {
        if (this.state & 1 /* Hidden */)
            return undefined;
        m = m ? m.multiplyNew(this.getMatrix()) : this.getMatrix().clone();
        var p = m.multiplyInverseForPoint(point);
        if (this._hasTouchableChildren || (force && this.children && this.children.length)) {
            var children = this.children;
            if (this.shouldFindChildrenByPoint(p)) {
                for (var i = children.length - 1; i >= 0; --i) {
                    var child = children[i];
                    if (force || child._touchable || child._hasTouchableChildren) {
                        var target = child.findPointSourceByPoint(point, m, force);
                        if (target)
                            return target;
                    }
                }
            }
        }
        if (!(force || this._touchable))
            return undefined;
        // 逆行列をポイントにかけた結果がEにヒットしているかを計算
        if (0 <= p.x && this.width > p.x && 0 <= p.y && this.height > p.y) {
            return {
                target: this,
                point: p
            };
        }
        return undefined;
    };
    /**
     * このEが表示状態であるかどうかを返す。
     */
    E.prototype.visible = function () {
        return (this.state & 1 /* Hidden */) !== 1 /* Hidden */;
    };
    /**
     * このEを表示状態にする。
     *
     * `this.hide()` によって非表示状態にされたエンティティを表示状態に戻す。
     * 生成直後のエンティティは表示状態であり、 `hide()` を呼び出さない限りこのメソッドを呼び出す必要はない。
     */
    E.prototype.show = function () {
        if (!(this.state & 1 /* Hidden */))
            return;
        this.state &= ~1 /* Hidden */;
        if (this.parent) {
            this.parent.modified(true);
        }
    };
    /**
     * このEを非表示状態にする。
     *
     * `this.show()` が呼ばれるまでの間、このエンティティは各 `Renderer` によって描画されない。
     * また `Game#findPointSource()` で返されることもなくなる。
     * `this#pointDown`, `pointMove`, `pointUp` なども通常の方法ではfireされなくなる。
     */
    E.prototype.hide = function () {
        if (this.state & 1 /* Hidden */)
            return;
        this.state |= 1 /* Hidden */;
        if (this.parent) {
            this.parent.modified(true);
        }
    };
    /**
     * このEの包含矩形を計算する。
     */
    E.prototype.calculateBoundingRect = function () {
        return this._calculateBoundingRect(undefined);
    };
    /**
     * このEの位置を基準とした相対座標をゲームの左上端を基準とした座標に変換する。
     * @param offset Eの位置を基準とした相対座標
     */
    E.prototype.localToGlobal = function (offset) {
        var point = offset;
        for (var entity = this; entity instanceof E; entity = entity.parent) {
            point = entity.getMatrix().multiplyPoint(point);
        }
        return point;
    };
    /**
     * ゲームの左上端を基準とした座標をこのEの位置を基準とした相対座標に変換する。
     * @param offset ゲームの左上端を基準とした座標
     */
    E.prototype.globalToLocal = function (offset) {
        var matrix = new Matrix_1.PlainMatrix();
        for (var entity = this; entity instanceof E; entity = entity.parent) {
            matrix.multiplyLeft(entity.getMatrix());
        }
        return matrix.multiplyInverseForPoint(offset);
    };
    /**
     * このエンティティの座標系を、指定された祖先エンティティ (またはシーン) の座標系に変換する行列を求める。
     *
     * 指定されたエンティティが、このエンティティの祖先でない時、その値は無視される。
     * 指定されたシーンが、このエンティティの属するシーン出ない時、その値は無視される。
     *
     * @param target 座標系の変換先エンティティまたはシーン。省略した場合、このエンティティの属するシーン(グローバル座標系への変換行列になる)
     * @private
     */
    E.prototype._calculateMatrixTo = function (target) {
        var matrix = new Matrix_1.PlainMatrix();
        for (var entity = this; entity instanceof E && entity !== target; entity = entity.parent) {
            matrix.multiplyLeft(entity.getMatrix());
        }
        return matrix;
    };
    /**
     * このエンティティと与えられたエンティティの共通祖先のうち、もっとも子孫側にあるものを探す。
     * 共通祖先がない場合、 `undefined` を返す。
     *
     * @param target このエンティティとの共通祖先を探すエンティティ
     * @private
     */
    E.prototype._findLowestCommonAncestorWith = function (target) {
        var seen = {};
        for (var p = this; p instanceof E; p = p.parent) {
            seen[p.id] = true;
        }
        var ret = target;
        for (; ret instanceof E; ret = ret.parent) {
            if (seen.hasOwnProperty(ret.id))
                break;
        }
        return ret;
    };
    /**
     * @private
     */
    E.prototype._calculateBoundingRect = function (m) {
        var matrix = this.getMatrix();
        if (m) {
            matrix = m.multiplyNew(matrix);
        }
        if (!this.visible()) {
            return undefined;
        }
        var thisBoundingRect = {
            left: 0,
            right: this.width,
            top: 0,
            bottom: this.height
        };
        var targetCoordinates = [
            { x: thisBoundingRect.left, y: thisBoundingRect.top },
            { x: thisBoundingRect.left, y: thisBoundingRect.bottom },
            { x: thisBoundingRect.right, y: thisBoundingRect.top },
            { x: thisBoundingRect.right, y: thisBoundingRect.bottom }
        ];
        var convertedPoint = matrix.multiplyPoint(targetCoordinates[0]);
        var result = {
            left: convertedPoint.x,
            right: convertedPoint.x,
            top: convertedPoint.y,
            bottom: convertedPoint.y
        };
        for (var i = 1; i < targetCoordinates.length; ++i) {
            convertedPoint = matrix.multiplyPoint(targetCoordinates[i]);
            if (result.left > convertedPoint.x)
                result.left = convertedPoint.x;
            if (result.right < convertedPoint.x)
                result.right = convertedPoint.x;
            if (result.top > convertedPoint.y)
                result.top = convertedPoint.y;
            if (result.bottom < convertedPoint.y)
                result.bottom = convertedPoint.y;
        }
        if (this.children !== undefined) {
            for (var i = 0; i < this.children.length; ++i) {
                var nowResult = this.children[i]._calculateBoundingRect(matrix);
                if (nowResult) {
                    if (result.left > nowResult.left)
                        result.left = nowResult.left;
                    if (result.right < nowResult.right)
                        result.right = nowResult.right;
                    if (result.top > nowResult.top)
                        result.top = nowResult.top;
                    if (result.bottom < nowResult.bottom)
                        result.bottom = nowResult.bottom;
                }
            }
        }
        return result;
    };
    /**
     * @private
     */
    E.prototype._enableTouchPropagation = function () {
        var p = this.parent;
        while (p instanceof E && !p._hasTouchableChildren) {
            p._hasTouchableChildren = true;
            p = p.parent;
        }
    };
    /**
     * @private
     */
    E.prototype._disableTouchPropagation = function () {
        var p = this.parent;
        while (p instanceof E && p._hasTouchableChildren) {
            if (this._findTouchableChildren(p))
                break;
            p._hasTouchableChildren = false;
            p = p.parent;
        }
    };
    /**
     * @private
     */
    E.prototype._isTargetOperation = function (e) {
        if (this.state & 1 /* Hidden */)
            return false;
        if (e instanceof Event_1.PointEventBase)
            return this._touchable && e.target === this;
        return false;
    };
    E.prototype._findTouchableChildren = function (e) {
        if (e.children) {
            for (var i = 0; i < e.children.length; ++i) {
                if (e.children[i].touchable)
                    return e.children[i];
                var tmp = this._findTouchableChildren(e.children[i]);
                if (tmp)
                    return tmp;
            }
        }
        return undefined;
    };
    return E;
}(Object2D_1.Object2D));
exports.E = E;

},{"../Event":17,"../ExceptionFactory":23,"../Matrix":31,"../Object2D":35,"../Util":64,"@akashic/trigger":126}],73:[function(require,module,exports){
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
exports.FilledRect = void 0;
var ExceptionFactory_1 = require("../ExceptionFactory");
var E_1 = require("./E");
/**
 * 塗りつぶされた矩形を表すエンティティ。
 */
var FilledRect = /** @class */ (function (_super) {
    __extends(FilledRect, _super);
    /**
     * 各種パラメータを指定して `FilledRect` のインスタンスを生成する。
     * @param param このエンティティに対するパラメータ
     */
    function FilledRect(param) {
        var _this = _super.call(this, param) || this;
        if (typeof param.cssColor !== "string")
            throw ExceptionFactory_1.ExceptionFactory.createTypeMismatchError("ColorBox#constructor(cssColor)", "string", param.cssColor);
        _this.cssColor = param.cssColor;
        return _this;
    }
    /**
     * このエンティティ自身の描画を行う。
     * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
     */
    FilledRect.prototype.renderSelf = function (renderer) {
        renderer.fillRect(0, 0, this.width, this.height, this.cssColor);
        return true;
    };
    return FilledRect;
}(E_1.E));
exports.FilledRect = FilledRect;

},{"../ExceptionFactory":23,"./E":72}],74:[function(require,module,exports){
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
exports.FrameSprite = void 0;
var trigger_1 = require("@akashic/trigger");
var Sprite_1 = require("./Sprite");
/**
 * フレームとタイマーによるアニメーション機構を持つ `Sprite` 。
 *
 * このクラスは、コンストラクタで渡された画像を、
 * 幅 `srcWidth`, 高さ `srcHeight` 単位で区切られた小さな画像(以下、画像片)の集まりであると解釈する。
 * 各画像片は、左上から順に 0 から始まるインデックスで参照される。
 *
 * ゲーム開発者は、このインデックスからなる配列を `FrameSprite#frames` に設定する。
 * `FrameSprite` は、 `frames` に指定されたインデックス(が表す画像片)を順番に描画することでアニメーションを実現する。
 * アニメーションは `interval` ミリ秒ごとに進み、 `frames` の内容をループする。
 *
 * このクラスにおける `srcWidth`, `srcHeight` の扱いは、親クラスである `Sprite` とは異なっていることに注意。
 */
var FrameSprite = /** @class */ (function (_super) {
    __extends(FrameSprite, _super);
    /**
     * 各種パラメータを指定して `FrameSprite` のインスタンスを生成する。
     * @param param `FrameSprite` に設定するパラメータ
     */
    function FrameSprite(param) {
        var _this = _super.call(this, param) || this;
        _this._lastUsedIndex = 0;
        _this.frameNumber = param.frameNumber || 0;
        _this.frames = param.frames != null ? param.frames : [0];
        _this.interval = param.interval;
        _this._timer = undefined;
        _this.loop = param.loop != null ? param.loop : true;
        _this.onFinish = new trigger_1.Trigger();
        _this.finished = _this.onFinish;
        _this._modifiedSelf();
        return _this;
    }
    /**
     * `Sprite` から `FrameSprite` を作成する。
     * @param sprite 画像として使う`Sprite`
     * @param width 作成されるエンティティの高さ。省略された場合、 `sprite.width`
     * @param hegith 作成されるエンティティの高さ。省略された場合、 `sprite.height`
     */
    FrameSprite.createBySprite = function (sprite, width, height) {
        var frameSprite = new FrameSprite({
            scene: sprite.scene,
            src: sprite.src,
            width: width === undefined ? sprite.width : width,
            height: height === undefined ? sprite.height : height
        });
        frameSprite.srcHeight = height === undefined ? sprite.srcHeight : height;
        frameSprite.srcWidth = width === undefined ? sprite.srcWidth : width;
        return frameSprite;
    };
    /**
     * アニメーションを開始する。
     */
    FrameSprite.prototype.start = function () {
        if (this.interval === undefined)
            this.interval = 1000 / this.game().fps;
        if (this._timer)
            this._free();
        this._timer = this.scene.createTimer(this.interval);
        this._timer.onElapse.add(this._handleElapse, this);
    };
    /**
     * このエンティティを破棄する。
     * デフォルトでは利用している `Surface` の破棄は行わない点に注意。
     * @param destroySurface trueを指定した場合、このエンティティが抱える `Surface` も合わせて破棄する
     */
    FrameSprite.prototype.destroy = function (destroySurface) {
        this.stop();
        _super.prototype.destroy.call(this, destroySurface);
    };
    /**
     * アニメーションを停止する。
     */
    FrameSprite.prototype.stop = function () {
        if (this._timer)
            this._free();
    };
    /**
     * このエンティティに対する変更をエンジンに通知する。詳細は `E#modified()` のドキュメントを参照。
     */
    FrameSprite.prototype.modified = function (isBubbling) {
        this._modifiedSelf(isBubbling);
        _super.prototype.modified.call(this, isBubbling);
    };
    /**
     * @private
     */
    FrameSprite.prototype._handleElapse = function () {
        if (this.frameNumber === this.frames.length - 1) {
            if (this.loop) {
                this.frameNumber = 0;
            }
            else {
                this.stop();
                this.onFinish.fire();
            }
        }
        else {
            this.frameNumber++;
        }
        this.modified();
    };
    /**
     * @private
     */
    FrameSprite.prototype._free = function () {
        if (!this._timer)
            return;
        this._timer.onElapse.remove(this._handleElapse, this);
        if (this._timer.canDelete())
            this.scene.deleteTimer(this._timer);
        this._timer = undefined;
    };
    /**
     * @private
     */
    FrameSprite.prototype._changeFrame = function () {
        var frame = this.frames[this.frameNumber];
        var sep = Math.floor(this._surface.width / this.srcWidth);
        this.srcX = (frame % sep) * this.srcWidth;
        this.srcY = Math.floor(frame / sep) * this.srcHeight;
        this._lastUsedIndex = frame;
    };
    FrameSprite.prototype._modifiedSelf = function (_isBubbling) {
        if (this._lastUsedIndex !== this.frames[this.frameNumber])
            this._changeFrame();
    };
    return FrameSprite;
}(Sprite_1.Sprite));
exports.FrameSprite = FrameSprite;

},{"./Sprite":77,"@akashic/trigger":126}],75:[function(require,module,exports){
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
exports.Label = void 0;
var TextAlign_1 = require("../TextAlign");
var Util_1 = require("../Util");
var CacheableE_1 = require("./CacheableE");
/**
 * 単一行のテキストを描画するエンティティ。
 * 本クラスの利用には `BitmapFont` または `DynamicFont` が必要となる。
 */
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    /**
     * 各種パラメータを指定して `Label` のインスタンスを生成する。
     * @param param このエンティティに指定するパラメータ
     */
    function Label(param) {
        var _this = _super.call(this, param) || this;
        _this.text = param.text;
        _this.font = param.font;
        _this.textAlign = param.textAlign != null ? param.textAlign : TextAlign_1.TextAlign.Left;
        _this.glyphs = new Array(param.text.length);
        _this.fontSize = param.fontSize != null ? param.fontSize : param.font.size;
        _this.maxWidth = param.maxWidth;
        _this.widthAutoAdjust = param.widthAutoAdjust != null ? param.widthAutoAdjust : true;
        _this.textColor = param.textColor;
        _this._realTextAlign = "left";
        _this._textWidth = 0;
        _this._overhangLeft = 0;
        _this._overhangRight = 0;
        _this._invalidateSelf();
        return _this;
    }
    /**
     * `width` と `textAlign` を設定し、 `widthAutoAdjust` を `false` に設定する。
     *
     * このメソッドは `this.textAlign` を設定するためのユーティリティである。
     * `textAlign` を `"left"` (または非推奨の旧称 `TextAlign.Left`) 以外に設定する場合には、
     * 通常 `width` や `widthAutoAdjust` も設定する必要があるため、それらをまとめて行う。
     * このメソッドの呼び出し後、 `this.invalidate()` を呼び出す必要がある。
     * @param width 幅
     * @param textAlign テキストの描画位置
     */
    Label.prototype.aligning = function (width, textAlign) {
        this.width = width;
        this.widthAutoAdjust = false;
        this.textAlign = textAlign;
    };
    /**
     * このエンティティの描画キャッシュ無効化をエンジンに通知する。
     * このメソッドを呼び出し後、描画キャッシュの再構築が行われ、各 `Renderer` に描画内容の変更が反映される。
     */
    Label.prototype.invalidate = function () {
        this._invalidateSelf();
        _super.prototype.invalidate.call(this);
    };
    /**
     * Label自身の描画を行う。
     */
    Label.prototype.renderSelfFromCache = function (renderer) {
        // glyphのはみ出し量に応じて、描画先のX座標を調整する。
        var destOffsetX;
        switch (this._realTextAlign) {
            case "center":
                destOffsetX = this.widthAutoAdjust ? this._overhangLeft : 0;
                break;
            case "right":
                destOffsetX = this.widthAutoAdjust ? this._overhangLeft : this._overhangRight;
                break;
            default:
                destOffsetX = this._overhangLeft;
                break;
        }
        renderer.drawImage(this._cache, 0, 0, this._cacheSize.width + CacheableE_1.CacheableE.PADDING, this._cacheSize.height + CacheableE_1.CacheableE.PADDING, destOffsetX, 0);
    };
    Label.prototype.renderCache = function (renderer) {
        if (!this.fontSize || this.height <= 0 || this._textWidth <= 0) {
            return;
        }
        var scale = this.maxWidth && this.maxWidth > 0 && this.maxWidth < this._textWidth ? this.maxWidth / this._textWidth : 1;
        var offsetX = 0;
        switch (this._realTextAlign) {
            case "center":
                offsetX = this.width / 2 - ((this._textWidth + this._overhangLeft) / 2) * scale;
                break;
            case "right":
                offsetX = this.width - (this._textWidth + this._overhangLeft) * scale;
                break;
            default:
                offsetX -= this._overhangLeft * scale;
                break;
        }
        renderer.translate(Math.round(offsetX), 0);
        if (scale !== 1) {
            renderer.transform([scale, 0, 0, 1, 0, 0]);
        }
        renderer.save();
        var glyphScale = this.fontSize / this.font.size;
        var cumulativeOffset = 0;
        for (var i = 0; i < this.glyphs.length; ++i) {
            var glyph = this.glyphs[i];
            var glyphWidth = glyph.advanceWidth * glyphScale;
            var code = glyph.code;
            if (!glyph.isSurfaceValid) {
                glyph = this.font.glyphForCharacter(code);
                if (!glyph) {
                    this._outputOfWarnLogWithNoGlyph(code, "renderCache()");
                    continue;
                }
            }
            if (glyph.surface) {
                // 非空白文字
                renderer.save();
                renderer.translate(Math.round(cumulativeOffset), 0);
                renderer.transform([glyphScale, 0, 0, glyphScale, 0, 0]);
                renderer.drawImage(glyph.surface, glyph.x, glyph.y, glyph.width, glyph.height, glyph.offsetX, glyph.offsetY);
                renderer.restore();
            }
            cumulativeOffset += glyphWidth;
        }
        renderer.restore();
        renderer.save();
        if (this.textColor) {
            renderer.setCompositeOperation("source-atop");
            renderer.fillRect(0, 0, this._textWidth, this.height, this.textColor);
        }
        renderer.restore();
    };
    /**
     * このエンティティを破棄する。
     * 利用している `BitmapFont` の破棄は行わないため、 `BitmapFont` の破棄はコンテンツ製作者が明示的に行う必要がある。
     */
    Label.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    Label.prototype._invalidateSelf = function () {
        this.glyphs.length = 0;
        this._textWidth = 0;
        var align = this.textAlign;
        this._realTextAlign = typeof align === "string" ? align : Util_1.Util.enumToSnakeCase(TextAlign_1.TextAlign, align);
        if (!this.fontSize) {
            this.height = 0;
            return;
        }
        var effectiveTextLastIndex = this.text.length - 1;
        // 右のはみだし量を求めるため、text内での有効な最後の glyph のindexを解決する。
        for (var i = this.text.length - 1; i >= 0; --i) {
            var code = Util_1.Util.charCodeAt(this.text, i);
            if (!code) {
                continue;
            }
            var glyph = this.font.glyphForCharacter(code);
            if (glyph && glyph.width !== 0 && glyph.advanceWidth !== 0) {
                effectiveTextLastIndex = i;
                break;
            }
        }
        var maxHeight = 0;
        var glyphScale = this.font.size > 0 ? this.fontSize / this.font.size : 0;
        for (var i = 0; i <= effectiveTextLastIndex; ++i) {
            var code = Util_1.Util.charCodeAt(this.text, i);
            if (!code) {
                continue;
            }
            var glyph = this.font.glyphForCharacter(code);
            if (!glyph) {
                this._outputOfWarnLogWithNoGlyph(code, "_invalidateSelf()");
                continue;
            }
            if (glyph.width < 0 || glyph.height < 0) {
                continue;
            }
            if (glyph.x < 0 || glyph.y < 0) {
                continue;
            }
            this.glyphs.push(glyph);
            // Font に StrokeWidth が設定されている場合、文字の描画内容は、描画の基準点よりも左にはみ出る場合や、glyph.advanceWidth より右にはみ出る場合がある。
            // キャッシュサーフェスの幅は、最初の文字と最後の文字のはみ出し部分を考慮して求める必要がある。
            var overhang = 0;
            if (i === 0) {
                this._overhangLeft = Math.min(glyph.offsetX, 0);
                overhang = -this._overhangLeft;
            }
            if (i === effectiveTextLastIndex) {
                this._overhangRight = Math.max(glyph.width + glyph.offsetX - glyph.advanceWidth, 0);
                overhang += this._overhangRight;
            }
            this._textWidth += (glyph.advanceWidth + overhang) * glyphScale;
            var height = glyph.offsetY + glyph.height;
            if (maxHeight < height) {
                maxHeight = height;
            }
        }
        if (this.widthAutoAdjust) {
            this.width = this._textWidth;
        }
        this.height = maxHeight * glyphScale;
    };
    Label.prototype._outputOfWarnLogWithNoGlyph = function (code, functionName) {
        var str = code & 0xffff0000 ? String.fromCharCode((code & 0xffff0000) >>> 16, code & 0xffff) : String.fromCharCode(code);
        console.warn("Label#" +
            functionName +
            ": failed to get a glyph for '" +
            str +
            "' " +
            "(BitmapFont might not have the glyph or DynamicFont might create a glyph larger than its atlas).");
    };
    return Label;
}(CacheableE_1.CacheableE));
exports.Label = Label;

},{"../TextAlign":58,"../Util":64,"./CacheableE":70}],76:[function(require,module,exports){
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
exports.Pane = void 0;
var SurfaceUtil_1 = require("../SurfaceUtil");
var CacheableE_1 = require("./CacheableE");
/**
 * 枠を表すエンティティ。
 * クリッピングやパディング、バックグラウンドイメージの演出等の機能を持つため、
 * メニューやメッセージ、ステータスのウィンドウ等に利用されることが期待される。
 * このエンティティの子要素は、このエンティティの持つ `Surface` に描画される。
 */
var Pane = /** @class */ (function (_super) {
    __extends(Pane, _super);
    /**
     * 各種パラメータを指定して `Pane` のインスタンスを生成する。
     * @param param このエンティティに指定するパラメータ
     */
    function Pane(param) {
        var _this = _super.call(this, param) || this;
        _this._oldWidth = param.width;
        _this._oldHeight = param.height;
        _this.backgroundImage = param.backgroundImage;
        _this._beforeBackgroundImage = param.backgroundImage;
        _this._backgroundImageSurface = SurfaceUtil_1.SurfaceUtil.asSurface(param.backgroundImage);
        _this.backgroundEffector = param.backgroundEffector;
        _this._shouldRenderChildren = false;
        _this._padding = param.padding || 0;
        _this._initialize();
        _this._paddingChanged = false;
        return _this;
    }
    Object.defineProperty(Pane.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        /**
         * パディング。
         * このエンティティの子孫は、パディングに指定された分だけ右・下にずれた場所に描画され、またパディングの矩形サイズでクリッピングされる。
         */
        // NOTE: paddingの変更は頻繁に行われるものでは無いと思われるので、フラグを立てるためにアクセサを使う
        set: function (padding) {
            this._padding = padding;
            this._paddingChanged = true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * このエンティティに対する変更をエンジンに通知する。
     * このメソッドの呼び出し後、 `this` に対する変更が各 `Renderer` の描画に反映される。
     * このメソッドは描画キャッシュの無効化を保証しない。描画キャッシュの無効化も必要な場合、 `invalidate()`を呼び出さなければならない。
     * 詳細は `E#modified()` のドキュメントを参照。
     */
    Pane.prototype.modified = function (isBubbling) {
        if (isBubbling)
            this.state &= ~2 /* Cached */;
        _super.prototype.modified.call(this);
    };
    Pane.prototype.shouldFindChildrenByPoint = function (point) {
        var p = this._normalizedPadding;
        if (p.left < point.x && this.width - p.right > point.x && p.top < point.y && this.height - p.bottom > point.y) {
            return true;
        }
        return false;
    };
    Pane.prototype.renderCache = function (renderer, camera) {
        if (this.width <= 0 || this.height <= 0) {
            return;
        }
        this._renderBackground();
        this._renderChildren(camera);
        if (this._bgSurface) {
            renderer.drawImage(this._bgSurface, 0, 0, this.width, this.height, 0, 0);
        }
        else if (this._backgroundImageSurface) {
            renderer.drawImage(this._backgroundImageSurface, 0, 0, this.width, this.height, 0, 0);
        }
        if (this._childrenArea.width <= 0 || this._childrenArea.height <= 0) {
            return;
        }
        renderer.save();
        if (this._childrenArea.x !== 0 || this._childrenArea.y !== 0) {
            renderer.translate(this._childrenArea.x, this._childrenArea.y);
        }
        renderer.drawImage(this._childrenSurface, 0, 0, this._childrenArea.width, this._childrenArea.height, 0, 0);
        renderer.restore();
    };
    /**
     * このエンティティを破棄する。また、バックバッファで利用している `Surface` も合わせて破棄される。
     * ただし、 `backgroundImage` に利用している `Surface` の破棄は行わない。
     * @param destroySurface trueを指定した場合、 `backgroundImage` に利用している `Surface` も合わせて破棄する。
     */
    Pane.prototype.destroy = function (destroySurface) {
        if (destroySurface && this._backgroundImageSurface && !this._backgroundImageSurface.destroyed()) {
            this._backgroundImageSurface.destroy();
        }
        if (this._bgSurface && !this._bgSurface.destroyed()) {
            this._bgSurface.destroy();
        }
        if (this._childrenSurface && !this._childrenSurface.destroyed()) {
            this._childrenSurface.destroy();
        }
        this.backgroundImage = undefined;
        this._backgroundImageSurface = undefined;
        this._beforeBackgroundImage = undefined;
        this._bgSurface = undefined;
        this._childrenSurface = undefined;
        _super.prototype.destroy.call(this);
    };
    /**
     * @private
     */
    Pane.prototype._renderBackground = function () {
        if (this.backgroundImage !== this._beforeBackgroundImage) {
            this._backgroundImageSurface = SurfaceUtil_1.SurfaceUtil.asSurface(this.backgroundImage);
            this._beforeBackgroundImage = this.backgroundImage;
        }
        if (this._backgroundImageSurface && this.backgroundEffector) {
            var bgSurface = this.backgroundEffector.render(this._backgroundImageSurface, this.width, this.height);
            if (this._bgSurface !== bgSurface) {
                if (this._bgSurface && !this._bgSurface.destroyed()) {
                    this._bgSurface.destroy();
                }
                this._bgSurface = bgSurface;
            }
        }
        else {
            this._bgSurface = undefined;
        }
    };
    /**
     * @private
     */
    Pane.prototype._renderChildren = function (camera) {
        var isNew = this._oldWidth !== this.width || this._oldHeight !== this.height || this._paddingChanged;
        if (isNew) {
            this._initialize();
            this._paddingChanged = false;
            this._oldWidth = this.width;
            this._oldHeight = this.height;
        }
        this._childrenRenderer.begin();
        if (!isNew) {
            this._childrenRenderer.clear();
        }
        if (this.children) {
            // Note: concatしていないのでunsafeだが、render中に配列の中身が変わる事はない前提とする
            var children = this.children;
            for (var i = 0; i < children.length; ++i) {
                children[i].render(this._childrenRenderer, camera);
            }
        }
        this._childrenRenderer.end();
    };
    /**
     * @private
     */
    Pane.prototype._initialize = function () {
        var p = this._padding;
        var r;
        if (typeof p === "number") {
            r = { top: p, bottom: p, left: p, right: p };
        }
        else {
            r = this._padding;
        }
        this._childrenArea = {
            x: r.left,
            y: r.top,
            width: this.width - r.left - r.right,
            height: this.height - r.top - r.bottom
        };
        var resourceFactory = this.scene.game.resourceFactory;
        if (this._childrenSurface && !this._childrenSurface.destroyed()) {
            this._childrenSurface.destroy();
        }
        this._childrenSurface = resourceFactory.createSurface(Math.ceil(this._childrenArea.width), Math.ceil(this._childrenArea.height));
        this._childrenRenderer = this._childrenSurface.renderer();
        this._normalizedPadding = r;
    };
    /**
     * このPaneの包含矩形を計算する。
     * Eを継承する他のクラスと異なり、Paneは子要素の位置を包括矩形に含まない。
     * @private
     */
    Pane.prototype._calculateBoundingRect = function (m) {
        var matrix = this.getMatrix();
        if (m) {
            matrix = m.multiplyNew(matrix);
        }
        if (!this.visible()) {
            return undefined;
        }
        var thisBoundingRect = {
            left: 0,
            right: this.width,
            top: 0,
            bottom: this.height
        };
        var targetCoordinates = [
            { x: thisBoundingRect.left, y: thisBoundingRect.top },
            { x: thisBoundingRect.left, y: thisBoundingRect.bottom },
            { x: thisBoundingRect.right, y: thisBoundingRect.top },
            { x: thisBoundingRect.right, y: thisBoundingRect.bottom }
        ];
        var convertedPoint = matrix.multiplyPoint(targetCoordinates[0]);
        var result = {
            left: convertedPoint.x,
            right: convertedPoint.x,
            top: convertedPoint.y,
            bottom: convertedPoint.y
        };
        for (var i = 1; i < targetCoordinates.length; ++i) {
            convertedPoint = matrix.multiplyPoint(targetCoordinates[i]);
            if (result.left > convertedPoint.x)
                result.left = convertedPoint.x;
            if (result.right < convertedPoint.x)
                result.right = convertedPoint.x;
            if (result.top > convertedPoint.y)
                result.top = convertedPoint.y;
            if (result.bottom < convertedPoint.y)
                result.bottom = convertedPoint.y;
        }
        return result;
    };
    return Pane;
}(CacheableE_1.CacheableE));
exports.Pane = Pane;

},{"../SurfaceUtil":57,"./CacheableE":70}],77:[function(require,module,exports){
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
exports.Sprite = void 0;
var Matrix_1 = require("../Matrix");
var SurfaceUtil_1 = require("../SurfaceUtil");
var E_1 = require("./E");
/**
 * 画像を描画するエンティティ。
 */
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    /**
     * 各種パラメータを指定して `Sprite` のインスタンスを生成する。
     * @param param `Sprite` に設定するパラメータ
     */
    function Sprite(param) {
        var _this = _super.call(this, param) || this;
        _this.src = param.src;
        if ("_drawable" in param.src) {
            _this._surface = param.src;
        }
        else {
            // @ts-ignore
            _this._surface = SurfaceUtil_1.SurfaceUtil.asSurface(param.src);
        }
        if (param.width == null)
            _this.width = _this._surface.width;
        if (param.height == null)
            _this.height = _this._surface.height;
        _this.srcWidth = param.srcWidth != null ? param.srcWidth : _this.width;
        _this.srcHeight = param.srcHeight != null ? param.srcHeight : _this.height;
        _this.srcX = param.srcX || 0;
        _this.srcY = param.srcY || 0;
        _this._stretchMatrix = undefined;
        _this._beforeSrc = _this.src;
        _this._beforeSurface = _this._surface;
        SurfaceUtil_1.SurfaceUtil.setupAnimatingHandler(_this, _this._surface);
        _this._invalidateSelf();
        return _this;
    }
    /**
     * @private
     */
    Sprite.prototype._handleUpdate = function () {
        this.modified();
    };
    /**
     * @private
     */
    Sprite.prototype._handleAnimationStart = function () {
        if (!this.onUpdate.contains(this._handleUpdate, this)) {
            this.onUpdate.add(this._handleUpdate, this);
        }
    };
    /**
     * @private
     */
    Sprite.prototype._handleAnimationStop = function () {
        if (!this.destroyed()) {
            this.onUpdate.remove(this._handleUpdate, this);
        }
    };
    /**
     * このエンティティ自身の描画を行う。
     * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
     */
    Sprite.prototype.renderSelf = function (renderer, _camera) {
        if (this.srcWidth <= 0 || this.srcHeight <= 0) {
            return true;
        }
        if (this._stretchMatrix) {
            renderer.save();
            renderer.transform(this._stretchMatrix._matrix);
        }
        renderer.drawImage(this._surface, this.srcX, this.srcY, this.srcWidth, this.srcHeight, 0, 0);
        if (this._stretchMatrix)
            renderer.restore();
        return true;
    };
    /**
     * このエンティティの描画キャッシュ無効化をエンジンに通知する。
     * このメソッドを呼び出し後、描画キャッシュの再構築が行われ、各 `Renderer` に描画内容の変更が反映される。
     */
    Sprite.prototype.invalidate = function () {
        this._invalidateSelf();
        this.modified();
    };
    /**
     * このエンティティを破棄する。
     * デフォルトでは利用している `Surface` の破棄は行わない点に注意。
     * @param destroySurface trueを指定した場合、このエンティティが抱える `Surface` も合わせて破棄する
     */
    Sprite.prototype.destroy = function (destroySurface) {
        if (this._surface && !this._surface.destroyed() && destroySurface) {
            this._surface.destroy();
        }
        this.src = undefined;
        this._beforeSrc = undefined;
        this._surface = undefined;
        _super.prototype.destroy.call(this);
    };
    Sprite.prototype._invalidateSelf = function () {
        if (this.width === this.srcWidth && this.height === this.srcHeight) {
            this._stretchMatrix = undefined;
        }
        else {
            this._stretchMatrix = new Matrix_1.PlainMatrix();
            this._stretchMatrix.scale(this.width / this.srcWidth, this.height / this.srcHeight);
        }
        if (this.src !== this._beforeSrc) {
            this._beforeSrc = this.src;
            if ("_drawable" in this.src) {
                this._surface = this.src;
            }
            else {
                // @ts-ignore
                this._surface = SurfaceUtil_1.SurfaceUtil.asSurface(this.src);
            }
        }
        if (this._surface !== this._beforeSurface) {
            SurfaceUtil_1.SurfaceUtil.migrateAnimatingHandler(this, this._beforeSurface, this._surface);
            this._beforeSurface = this._surface;
        }
    };
    return Sprite;
}(E_1.E));
exports.Sprite = Sprite;

},{"../Matrix":31,"../SurfaceUtil":57,"./E":72}],78:[function(require,module,exports){
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
exports.VideoSystem = exports.ShaderProgram = exports.Module = exports.AudioSystem = void 0;
__exportStar(require("@akashic/game-configuration"), exports);
__exportStar(require("@akashic/trigger"), exports);
// pdi-types 由来の型を g 直下から reexport する。
// ただし一部の型名は、akashic-engine で同名のクラス実装を与えているため、
// そのままでは両方 export しようとして衝突する。
// ここで明示的に片方を export して衝突を解決している。
__exportStar(require("@akashic/pdi-types"), exports);
var AudioSystem_1 = require("./AudioSystem");
Object.defineProperty(exports, "AudioSystem", { enumerable: true, get: function () { return AudioSystem_1.AudioSystem; } });
var Module_1 = require("./Module");
Object.defineProperty(exports, "Module", { enumerable: true, get: function () { return Module_1.Module; } });
var ShaderProgram_1 = require("./ShaderProgram");
Object.defineProperty(exports, "ShaderProgram", { enumerable: true, get: function () { return ShaderProgram_1.ShaderProgram; } });
var VideoSystem_1 = require("./VideoSystem");
Object.defineProperty(exports, "VideoSystem", { enumerable: true, get: function () { return VideoSystem_1.VideoSystem; } });
__exportStar(require("./AudioSystem"), exports);
__exportStar(require("./entities/CacheableE"), exports);
__exportStar(require("./entities/E"), exports);
__exportStar(require("./entities/FilledRect"), exports);
__exportStar(require("./entities/FrameSprite"), exports);
__exportStar(require("./entities/Label"), exports);
__exportStar(require("./entities/Pane"), exports);
__exportStar(require("./entities/Sprite"), exports);
__exportStar(require("./AssetAccessor"), exports);
__exportStar(require("./AssetHolder"), exports);
__exportStar(require("./AssetLoadFailureInfo"), exports);
__exportStar(require("./AssetManager"), exports);
__exportStar(require("./AssetManagerLoadHandler"), exports);
__exportStar(require("./AudioSystemManager"), exports);
__exportStar(require("./BitmapFont"), exports);
__exportStar(require("./Camera"), exports);
__exportStar(require("./Camera2D"), exports);
__exportStar(require("./Collision"), exports);
__exportStar(require("./DefaultLoadingScene"), exports);
__exportStar(require("./DefaultSkippingScene"), exports);
__exportStar(require("./DynamicAssetConfiguration"), exports);
__exportStar(require("./DynamicFont"), exports);
__exportStar(require("./EntityStateFlags"), exports);
__exportStar(require("./Event"), exports);
__exportStar(require("./EventConverter"), exports);
__exportStar(require("./EventFilter"), exports);
__exportStar(require("./EventFilterController"), exports);
__exportStar(require("./EventIndex"), exports);
__exportStar(require("./EventPriority"), exports);
__exportStar(require("./ExceptionFactory"), exports);
__exportStar(require("./Font"), exports);
__exportStar(require("./GameMainParameterObject"), exports);
__exportStar(require("./InternalOperationPluginInfo"), exports);
__exportStar(require("./LoadingScene"), exports);
__exportStar(require("./LocalTickModeString"), exports);
__exportStar(require("./Matrix"), exports);
__exportStar(require("./Module"), exports);
__exportStar(require("./ModuleManager"), exports);
__exportStar(require("./NinePatchSurfaceEffector"), exports);
__exportStar(require("./Object2D"), exports);
__exportStar(require("./OperationPlugin"), exports);
__exportStar(require("./OperationPluginManager"), exports);
__exportStar(require("./OperationPluginOperation"), exports);
__exportStar(require("./OperationPluginStatic"), exports);
__exportStar(require("./PathUtil"), exports);
__exportStar(require("./Player"), exports);
__exportStar(require("./PointEventResolver"), exports);
__exportStar(require("./RandomGenerator"), exports);
__exportStar(require("./Require"), exports);
__exportStar(require("./RequireCacheable"), exports);
__exportStar(require("./RequireCachedValue"), exports);
__exportStar(require("./ScriptAssetContext"), exports);
__exportStar(require("./ShaderProgram"), exports);
__exportStar(require("./SnapshotSaveRequest"), exports);
__exportStar(require("./SpriteFactory"), exports);
__exportStar(require("./Storage"), exports);
__exportStar(require("./SurfaceAtlas"), exports);
__exportStar(require("./SurfaceAtlasSet"), exports);
__exportStar(require("./SurfaceAtlasSlot"), exports);
__exportStar(require("./SurfaceEffector"), exports);
__exportStar(require("./SurfaceUtil"), exports);
__exportStar(require("./TextAlign"), exports);
__exportStar(require("./TextAlignString"), exports);
__exportStar(require("./TextMetrics"), exports);
__exportStar(require("./TickGenerationModeString"), exports);
__exportStar(require("./Timer"), exports);
__exportStar(require("./TimerManager"), exports);
__exportStar(require("./Util"), exports);
__exportStar(require("./VideoSystem"), exports);
__exportStar(require("./Xorshift"), exports);
__exportStar(require("./XorshiftRandomGenerator"), exports);
__exportStar(require("./Scene"), exports);
__exportStar(require("./Game"), exports);

},{"./AssetAccessor":1,"./AssetHolder":2,"./AssetLoadFailureInfo":3,"./AssetManager":4,"./AssetManagerLoadHandler":5,"./AudioSystem":6,"./AudioSystemManager":7,"./BitmapFont":8,"./Camera":9,"./Camera2D":10,"./Collision":11,"./DefaultLoadingScene":12,"./DefaultSkippingScene":13,"./DynamicAssetConfiguration":14,"./DynamicFont":15,"./EntityStateFlags":16,"./Event":17,"./EventConverter":18,"./EventFilter":19,"./EventFilterController":20,"./EventIndex":21,"./EventPriority":22,"./ExceptionFactory":23,"./Font":24,"./Game":25,"./GameMainParameterObject":27,"./InternalOperationPluginInfo":28,"./LoadingScene":29,"./LocalTickModeString":30,"./Matrix":31,"./Module":32,"./ModuleManager":33,"./NinePatchSurfaceEffector":34,"./Object2D":35,"./OperationPlugin":36,"./OperationPluginManager":37,"./OperationPluginOperation":38,"./OperationPluginStatic":39,"./PathUtil":40,"./Player":41,"./PointEventResolver":42,"./RandomGenerator":43,"./Require":44,"./RequireCacheable":45,"./RequireCachedValue":46,"./Scene":47,"./ScriptAssetContext":48,"./ShaderProgram":49,"./SnapshotSaveRequest":50,"./SpriteFactory":51,"./Storage":52,"./SurfaceAtlas":53,"./SurfaceAtlasSet":54,"./SurfaceAtlasSlot":55,"./SurfaceEffector":56,"./SurfaceUtil":57,"./TextAlign":58,"./TextAlignString":59,"./TextMetrics":60,"./TickGenerationModeString":61,"./Timer":62,"./TimerManager":63,"./Util":64,"./VideoSystem":65,"./Xorshift":66,"./XorshiftRandomGenerator":67,"./entities/CacheableE":70,"./entities/E":72,"./entities/FilledRect":73,"./entities/FrameSprite":74,"./entities/Label":75,"./entities/Pane":76,"./entities/Sprite":77,"@akashic/game-configuration":83,"@akashic/pdi-types":108,"@akashic/trigger":126}],79:[function(require,module,exports){
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
__exportStar(require("./index.common"), exports);
__exportStar(require("./GameHandlerSet"), exports); // NOTE: コンテンツから参照する必要はない

},{"./GameHandlerSet":26,"./index.common":78}],80:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],81:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],82:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],83:[function(require,module,exports){
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
__exportStar(require("./AssetConfiguration"), exports);
__exportStar(require("./GameConfiguration"), exports);
__exportStar(require("./OperationPluginInfo"), exports);

},{"./AssetConfiguration":80,"./GameConfiguration":81,"./OperationPluginInfo":82}],84:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetLoadErrorType = void 0;
/**
 * アセット読み込み失敗時のエラーの種別。
 *
 * この値はあくまでもエラーメッセージ出力のための補助情報であり、
 * 網羅性・厳密性を追求したものではないことに注意。
 *
 * @deprecated 非推奨である。将来的に削除される。現在この型が必要な処理は存在しない。
 */
var AssetLoadErrorType;
(function (AssetLoadErrorType) {
    /**
     * 明示されていない(以下のいずれかかもしれないし、そうでないかもしれない)。
     */
    AssetLoadErrorType[AssetLoadErrorType["Unspecified"] = 0] = "Unspecified";
    /**
     * エンジンの再試行回数上限設定値を超えた。
     */
    AssetLoadErrorType[AssetLoadErrorType["RetryLimitExceeded"] = 1] = "RetryLimitExceeded";
    /**
     * ネットワークエラー。タイムアウトなど。
     */
    AssetLoadErrorType[AssetLoadErrorType["NetworkError"] = 2] = "NetworkError";
    /**
     * リクエストに問題があるエラー。HTTP 4XX など。
     */
    AssetLoadErrorType[AssetLoadErrorType["ClientError"] = 3] = "ClientError";
    /**
     * サーバ側のエラー。HTTP 5XX など。
     */
    AssetLoadErrorType[AssetLoadErrorType["ServerError"] = 4] = "ServerError";
})(AssetLoadErrorType = exports.AssetLoadErrorType || (exports.AssetLoadErrorType = {}));

},{}],86:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],87:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],88:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],89:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],90:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],91:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],92:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],93:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],94:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],95:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],96:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],97:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],98:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],99:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],100:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],101:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],102:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontFamily = void 0;
/**
 * 文字列描画のフォントファミリ。
 * @deprecated 非推奨である。将来的に削除される。代わりに文字列 `"sans-serif"`, `"serif"`, `"monospace"` を利用すること。
 */
var FontFamily;
(function (FontFamily) {
    /**
     * サンセリフ体。ＭＳ Ｐゴシック等
     */
    FontFamily[FontFamily["SansSerif"] = 0] = "SansSerif";
    /**
     * セリフ体。ＭＳ 明朝等
     */
    FontFamily[FontFamily["Serif"] = 1] = "Serif";
    /**
     * 等幅。ＭＳ ゴシック等
     */
    FontFamily[FontFamily["Monospace"] = 2] = "Monospace";
})(FontFamily = exports.FontFamily || (exports.FontFamily = {}));

},{}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontWeight = void 0;
/**
 * フォントのウェイト。
 * @deprecated 非推奨である。将来的に削除される。代わりに `FontWeightString` を利用すること。
 */
var FontWeight;
(function (FontWeight) {
    /**
     * 通常のフォントウェイト。
     */
    FontWeight[FontWeight["Normal"] = 0] = "Normal";
    /**
     * 太字のフォントウェイト。
     */
    FontWeight[FontWeight["Bold"] = 1] = "Bold";
})(FontWeight = exports.FontWeight || (exports.FontWeight = {}));

},{}],105:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],106:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],107:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],108:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./commons"), exports);
__exportStar(require("./errors"), exports);
__exportStar(require("./surface/CompositeOperation"), exports);
__exportStar(require("./surface/CompositeOperationString"), exports);
__exportStar(require("./surface/ImageData"), exports);
__exportStar(require("./surface/Renderer"), exports);
__exportStar(require("./surface/ShaderProgram"), exports);
__exportStar(require("./surface/ShaderUniform"), exports);
__exportStar(require("./surface/Surface"), exports);
__exportStar(require("./asset/audio/AudioAsset"), exports);
__exportStar(require("./asset/audio/AudioPlayer"), exports);
__exportStar(require("./asset/audio/AudioSystem"), exports);
__exportStar(require("./asset/audio/AudioAssetHint"), exports);
__exportStar(require("./asset/image/ImageAssetHint"), exports);
__exportStar(require("./asset/image/ImageAsset"), exports);
__exportStar(require("./asset/script/ScriptAsset"), exports);
__exportStar(require("./asset/script/Module"), exports);
__exportStar(require("./asset/script/ScriptAssetRuntimeValue"), exports);
__exportStar(require("./asset/text/TextAsset"), exports);
__exportStar(require("./asset/video/VideoPlayer"), exports);
__exportStar(require("./asset/video/VideoSystem"), exports);
__exportStar(require("./asset/video/VideoAsset"), exports);
__exportStar(require("./asset/vector-image/VectorImageAsset"), exports);
__exportStar(require("./asset/vector-image/VectorImageAssetHint"), exports);
__exportStar(require("./asset/Asset"), exports);
__exportStar(require("./asset/AssetLoadErrorType"), exports);
__exportStar(require("./font/FontWeightString"), exports);
__exportStar(require("./font/FontWeight"), exports);
__exportStar(require("./font/FontFamily"), exports);
__exportStar(require("./font/Glyph"), exports);
__exportStar(require("./font/GlyphFactory"), exports);
__exportStar(require("./platform/Looper"), exports);
__exportStar(require("./platform/OperationPluginView"), exports);
__exportStar(require("./platform/OperationPluginViewInfo"), exports);
__exportStar(require("./platform/Platform"), exports);
__exportStar(require("./platform/PlatformEventHandler"), exports);
__exportStar(require("./platform/PlatformPointEvent"), exports);
__exportStar(require("./platform/RendererRequirement"), exports);
__exportStar(require("./platform/ResourceFactory"), exports);

},{"./asset/Asset":84,"./asset/AssetLoadErrorType":85,"./asset/audio/AudioAsset":86,"./asset/audio/AudioAssetHint":87,"./asset/audio/AudioPlayer":88,"./asset/audio/AudioSystem":89,"./asset/image/ImageAsset":90,"./asset/image/ImageAssetHint":91,"./asset/script/Module":92,"./asset/script/ScriptAsset":93,"./asset/script/ScriptAssetRuntimeValue":94,"./asset/text/TextAsset":95,"./asset/vector-image/VectorImageAsset":96,"./asset/vector-image/VectorImageAssetHint":97,"./asset/video/VideoAsset":98,"./asset/video/VideoPlayer":99,"./asset/video/VideoSystem":100,"./commons":101,"./errors":102,"./font/FontFamily":103,"./font/FontWeight":104,"./font/FontWeightString":105,"./font/Glyph":106,"./font/GlyphFactory":107,"./platform/Looper":109,"./platform/OperationPluginView":110,"./platform/OperationPluginViewInfo":111,"./platform/Platform":112,"./platform/PlatformEventHandler":113,"./platform/PlatformPointEvent":114,"./platform/RendererRequirement":115,"./platform/ResourceFactory":116,"./surface/CompositeOperation":117,"./surface/CompositeOperationString":118,"./surface/ImageData":119,"./surface/Renderer":120,"./surface/ShaderProgram":121,"./surface/ShaderUniform":122,"./surface/Surface":123}],109:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],110:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],111:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],112:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],113:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],114:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],115:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],116:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],117:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeOperation = void 0;
/**
 * 描画時の合成方法。
 * @deprecated 非推奨である。将来的に削除される。代わりに `CompositeOperationString` を利用すること。
 */
var CompositeOperation;
(function (CompositeOperation) {
    /**
     * 先に描画された領域の上に描画する。
     */
    CompositeOperation[CompositeOperation["SourceOver"] = 0] = "SourceOver";
    /**
     * 先に描画された領域と重なった部分のみを描画する。
     */
    CompositeOperation[CompositeOperation["SourceAtop"] = 1] = "SourceAtop";
    /**
     * 先に描画された領域と重なった部分の色を加算して描画する。
     */
    CompositeOperation[CompositeOperation["Lighter"] = 2] = "Lighter";
    /**
     * 先に描画された領域を全て無視して描画する。
     */
    CompositeOperation[CompositeOperation["Copy"] = 3] = "Copy";
    /**
     * 先に描画された領域と重なった部分に描画を行い、それ以外の部分を透明にする。
     * 環境により、描画結果が大きく異なる可能性があるため、試験的導入である。
     */
    CompositeOperation[CompositeOperation["ExperimentalSourceIn"] = 4] = "ExperimentalSourceIn";
    /**
     * 先に描画された領域と重なっていない部分に描画を行い、それ以外の部分を透明にする。
     * 環境により、描画結果が大きく異なる可能性があるため、試験的導入である。
     */
    CompositeOperation[CompositeOperation["ExperimentalSourceOut"] = 5] = "ExperimentalSourceOut";
    /**
     * 描画する領域だけを表示し、先に描画された領域と重なった部分は描画先を表示する。
     * 環境により、描画結果が大きく異なる可能性があるため、試験的導入である。
     */
    CompositeOperation[CompositeOperation["ExperimentalDestinationAtop"] = 6] = "ExperimentalDestinationAtop";
    /**
     * 先に描画された領域と重なっていない部分を透明にし、重なった部分は描画先を表示する。
     * 環境により、描画結果が大きく異なる可能性があるため、試験的導入である。
     */
    CompositeOperation[CompositeOperation["ExperimentalDestinationIn"] = 7] = "ExperimentalDestinationIn";
    /**
     * 描画する領域を透明にする。
     */
    CompositeOperation[CompositeOperation["DestinationOut"] = 8] = "DestinationOut";
    /**
     * 先に描画された領域の下に描画する。
     */
    CompositeOperation[CompositeOperation["DestinationOver"] = 9] = "DestinationOver";
    /**
     * 先に描画された領域と重なった部分のみ透明にする。
     */
    CompositeOperation[CompositeOperation["Xor"] = 10] = "Xor";
})(CompositeOperation = exports.CompositeOperation || (exports.CompositeOperation = {}));

},{}],118:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],119:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],120:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],121:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],122:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],123:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],124:[function(require,module,exports){
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

},{"./Trigger":125}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./Trigger"));
__export(require("./ChainTrigger"));

},{"./ChainTrigger":124,"./Trigger":125}],"@akashic/akashic-engine":[function(require,module,exports){
module.exports = require("./lib/index");

},{"./lib/index":79}]},{},[]);
