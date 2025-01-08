import { useSyncExternalStore } from "react";
const storageMap = /* @__PURE__ */ new Map();
export function useStorage(storage) {
  const _data = useSyncExternalStore(storage.subscribe, storage.getSnapshot);
  if (!storageMap.has(storage)) {
    storageMap.set(storage, wrapPromise(storage.get()));
  }
  if (_data !== null) {
    storageMap.set(storage, { read: () => _data });
  }
  return _data != null ? _data : storageMap.get(storage).read();
}
function wrapPromise(promise) {
  let status = "pending";
  let result;
  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      switch (status) {
        case "pending":
          throw suspender;
        case "error":
          throw result;
        default:
          return result;
      }
    }
  };
}
//# sourceMappingURL=useStorage.js.map
