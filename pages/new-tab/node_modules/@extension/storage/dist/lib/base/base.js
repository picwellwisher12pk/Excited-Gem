var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { SessionAccessLevelEnum, StorageEnum } from "./enums";
const chrome = globalThis.chrome;
function updateCache(valueOrUpdate, cache) {
  return __async(this, null, function* () {
    function isFunction(value) {
      return typeof value === "function";
    }
    function returnsPromise(func) {
      return func instanceof Promise;
    }
    if (isFunction(valueOrUpdate)) {
      if (returnsPromise(valueOrUpdate)) {
        return valueOrUpdate(cache);
      } else {
        return valueOrUpdate(cache);
      }
    } else {
      return valueOrUpdate;
    }
  });
}
let globalSessionAccessLevelFlag = false;
function checkStoragePermission(storageEnum) {
  if (!chrome) {
    return;
  }
  if (chrome.storage[storageEnum] === void 0) {
    throw new Error(`Check your storage permission in manifest.json: ${storageEnum} is not defined`);
  }
}
export function createStorage(key, fallback, config) {
  var _a, _b, _c, _d, _e, _f;
  let cache = null;
  let initedCache = false;
  let listeners = [];
  const storageEnum = (_a = config == null ? void 0 : config.storageEnum) != null ? _a : StorageEnum.Local;
  const liveUpdate = (_b = config == null ? void 0 : config.liveUpdate) != null ? _b : false;
  const serialize = (_d = (_c = config == null ? void 0 : config.serialization) == null ? void 0 : _c.serialize) != null ? _d : (v) => v;
  const deserialize = (_f = (_e = config == null ? void 0 : config.serialization) == null ? void 0 : _e.deserialize) != null ? _f : (v) => v;
  if (globalSessionAccessLevelFlag === false && storageEnum === StorageEnum.Session && (config == null ? void 0 : config.sessionAccessForContentScripts) === true) {
    checkStoragePermission(storageEnum);
    chrome == null ? void 0 : chrome.storage[storageEnum].setAccessLevel({
      accessLevel: SessionAccessLevelEnum.ExtensionPagesAndContentScripts
    }).catch((error) => {
      console.warn(error);
      console.warn("Please call setAccessLevel into different context, like a background script.");
    });
    globalSessionAccessLevelFlag = true;
  }
  const get = () => __async(this, null, function* () {
    var _a2;
    checkStoragePermission(storageEnum);
    const value = yield chrome == null ? void 0 : chrome.storage[storageEnum].get([key]);
    if (!value) {
      return fallback;
    }
    return (_a2 = deserialize(value[key])) != null ? _a2 : fallback;
  });
  const _emitChange = () => {
    listeners.forEach((listener) => listener());
  };
  const set = (valueOrUpdate) => __async(this, null, function* () {
    if (initedCache === false) {
      cache = yield get();
    }
    cache = yield updateCache(valueOrUpdate, cache);
    yield chrome == null ? void 0 : chrome.storage[storageEnum].set({ [key]: serialize(cache) });
    _emitChange();
  });
  const subscribe = (listener) => {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };
  const getSnapshot = () => {
    return cache;
  };
  get().then((data) => {
    cache = data;
    initedCache = true;
    _emitChange();
  });
  function _updateFromStorageOnChanged(changes) {
    return __async(this, null, function* () {
      if (changes[key] === void 0) return;
      const valueOrUpdate = deserialize(changes[key].newValue);
      if (cache === valueOrUpdate) return;
      cache = yield updateCache(valueOrUpdate, cache);
      _emitChange();
    });
  }
  if (liveUpdate) {
    chrome == null ? void 0 : chrome.storage[storageEnum].onChanged.addListener(_updateFromStorageOnChanged);
  }
  return {
    get,
    set,
    getSnapshot,
    subscribe
  };
}
//# sourceMappingURL=base.js.map
