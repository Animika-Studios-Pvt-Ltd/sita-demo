import {
  require_react
} from "./chunk-N4N5IM6X.js";
import {
  __toESM
} from "./chunk-LK32TJAX.js";

// node_modules/@auth0/auth0-react/dist/auth0-react.esm.js
var import_react = __toESM(require_react());
var extendStatics = function(d2, b2) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
    d3.__proto__ = b3;
  } || function(d3, b3) {
    for (var p2 in b3) if (Object.prototype.hasOwnProperty.call(b3, p2)) d3[p2] = b3[p2];
  };
  return extendStatics(d2, b2);
};
function __extends(d2, b2) {
  if (typeof b2 !== "function" && b2 !== null)
    throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
  extendStatics(d2, b2);
  function __() {
    this.constructor = d2;
  }
  d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t2) {
    for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
      s2 = arguments[i2];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2)) t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
function __rest(s2, e3) {
  var t2 = {};
  for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e3.indexOf(p2) < 0)
    t2[p2] = s2[p2];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
      if (e3.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
        t2[p2[i2]] = s2[p2[i2]];
    }
  return t2;
}
function __awaiter(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve) {
      resolve(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e3) {
        reject(e3);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e3) {
        reject(e3);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _2 = { label: 0, sent: function() {
    if (t2[0] & 1) throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g2 = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g2.next = verb(0), g2["throw"] = verb(1), g2["return"] = verb(2), typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  function step(op) {
    if (f2) throw new TypeError("Generator is already executing.");
    while (g2 && (g2 = 0, op[0] && (_2 = 0)), _2) try {
      if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done) return t2;
      if (y2 = 0, t2) op = [op[0] & 2, t2.value];
      switch (op[0]) {
        case 0:
        case 1:
          t2 = op;
          break;
        case 4:
          _2.label++;
          return { value: op[1], done: false };
        case 5:
          _2.label++;
          y2 = op[1];
          op = [0];
          continue;
        case 7:
          op = _2.ops.pop();
          _2.trys.pop();
          continue;
        default:
          if (!(t2 = _2.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _2 = 0;
            continue;
          }
          if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
            _2.label = op[1];
            break;
          }
          if (op[0] === 6 && _2.label < t2[1]) {
            _2.label = t2[1];
            t2 = op;
            break;
          }
          if (t2 && _2.label < t2[2]) {
            _2.label = t2[2];
            _2.ops.push(op);
            break;
          }
          if (t2[2]) _2.ops.pop();
          _2.trys.pop();
          continue;
      }
      op = body.call(thisArg, _2);
    } catch (e3) {
      op = [6, e3];
      y2 = 0;
    } finally {
      f2 = t2 = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __spreadArray(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar2; i2 < l2; i2++) {
    if (ar2 || !(i2 in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i2);
      ar2[i2] = from[i2];
    }
  }
  return to2.concat(ar2 || Array.prototype.slice.call(from));
}
function e(e3, t2) {
  var n2 = {};
  for (var o2 in e3) Object.prototype.hasOwnProperty.call(e3, o2) && t2.indexOf(o2) < 0 && (n2[o2] = e3[o2]);
  if (null != e3 && "function" == typeof Object.getOwnPropertySymbols) {
    var r2 = 0;
    for (o2 = Object.getOwnPropertySymbols(e3); r2 < o2.length; r2++) t2.indexOf(o2[r2]) < 0 && Object.prototype.propertyIsEnumerable.call(e3, o2[r2]) && (n2[o2[r2]] = e3[o2[r2]]);
  }
  return n2;
}
var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
var n = {};
var o = {};
Object.defineProperty(o, "__esModule", { value: true });
var r = function() {
  function e3() {
    var e4 = this;
    this.locked = /* @__PURE__ */ new Map(), this.addToLocked = function(t2, n2) {
      var o2 = e4.locked.get(t2);
      void 0 === o2 ? void 0 === n2 ? e4.locked.set(t2, []) : e4.locked.set(t2, [n2]) : void 0 !== n2 && (o2.unshift(n2), e4.locked.set(t2, o2));
    }, this.isLocked = function(t2) {
      return e4.locked.has(t2);
    }, this.lock = function(t2) {
      return new Promise(function(n2, o2) {
        e4.isLocked(t2) ? e4.addToLocked(t2, n2) : (e4.addToLocked(t2), n2());
      });
    }, this.unlock = function(t2) {
      var n2 = e4.locked.get(t2);
      if (void 0 !== n2 && 0 !== n2.length) {
        var o2 = n2.pop();
        e4.locked.set(t2, n2), void 0 !== o2 && setTimeout(o2, 0);
      } else e4.locked.delete(t2);
    };
  }
  return e3.getInstance = function() {
    return void 0 === e3.instance && (e3.instance = new e3()), e3.instance;
  }, e3;
}();
o.default = function() {
  return r.getInstance();
};
var i = t && t.__awaiter || function(e3, t2, n2, o2) {
  return new (n2 || (n2 = Promise))(function(r2, i2) {
    function a2(e4) {
      try {
        c2(o2.next(e4));
      } catch (e5) {
        i2(e5);
      }
    }
    function s2(e4) {
      try {
        c2(o2.throw(e4));
      } catch (e5) {
        i2(e5);
      }
    }
    function c2(e4) {
      e4.done ? r2(e4.value) : new n2(function(t3) {
        t3(e4.value);
      }).then(a2, s2);
    }
    c2((o2 = o2.apply(e3, t2 || [])).next());
  });
};
var a = t && t.__generator || function(e3, t2) {
  var n2, o2, r2, i2, a2 = { label: 0, sent: function() {
    if (1 & r2[0]) throw r2[1];
    return r2[1];
  }, trys: [], ops: [] };
  return i2 = { next: s2(0), throw: s2(1), return: s2(2) }, "function" == typeof Symbol && (i2[Symbol.iterator] = function() {
    return this;
  }), i2;
  function s2(i3) {
    return function(s3) {
      return function(i4) {
        if (n2) throw new TypeError("Generator is already executing.");
        for (; a2; ) try {
          if (n2 = 1, o2 && (r2 = 2 & i4[0] ? o2.return : i4[0] ? o2.throw || ((r2 = o2.return) && r2.call(o2), 0) : o2.next) && !(r2 = r2.call(o2, i4[1])).done) return r2;
          switch (o2 = 0, r2 && (i4 = [2 & i4[0], r2.value]), i4[0]) {
            case 0:
            case 1:
              r2 = i4;
              break;
            case 4:
              return a2.label++, { value: i4[1], done: false };
            case 5:
              a2.label++, o2 = i4[1], i4 = [0];
              continue;
            case 7:
              i4 = a2.ops.pop(), a2.trys.pop();
              continue;
            default:
              if (!(r2 = a2.trys, (r2 = r2.length > 0 && r2[r2.length - 1]) || 6 !== i4[0] && 2 !== i4[0])) {
                a2 = 0;
                continue;
              }
              if (3 === i4[0] && (!r2 || i4[1] > r2[0] && i4[1] < r2[3])) {
                a2.label = i4[1];
                break;
              }
              if (6 === i4[0] && a2.label < r2[1]) {
                a2.label = r2[1], r2 = i4;
                break;
              }
              if (r2 && a2.label < r2[2]) {
                a2.label = r2[2], a2.ops.push(i4);
                break;
              }
              r2[2] && a2.ops.pop(), a2.trys.pop();
              continue;
          }
          i4 = t2.call(e3, a2);
        } catch (e4) {
          i4 = [6, e4], o2 = 0;
        } finally {
          n2 = r2 = 0;
        }
        if (5 & i4[0]) throw i4[1];
        return { value: i4[0] ? i4[1] : void 0, done: true };
      }([i3, s3]);
    };
  }
};
var s = t;
Object.defineProperty(n, "__esModule", { value: true });
var c = o;
var u = { key: function(e3) {
  return i(s, void 0, void 0, function() {
    return a(this, function(e4) {
      throw new Error("Unsupported");
    });
  });
}, getItem: function(e3) {
  return i(s, void 0, void 0, function() {
    return a(this, function(e4) {
      throw new Error("Unsupported");
    });
  });
}, clear: function() {
  return i(s, void 0, void 0, function() {
    return a(this, function(e3) {
      return [2, window.localStorage.clear()];
    });
  });
}, removeItem: function(e3) {
  return i(s, void 0, void 0, function() {
    return a(this, function(e4) {
      throw new Error("Unsupported");
    });
  });
}, setItem: function(e3, t2) {
  return i(s, void 0, void 0, function() {
    return a(this, function(e4) {
      throw new Error("Unsupported");
    });
  });
}, keySync: function(e3) {
  return window.localStorage.key(e3);
}, getItemSync: function(e3) {
  return window.localStorage.getItem(e3);
}, clearSync: function() {
  return window.localStorage.clear();
}, removeItemSync: function(e3) {
  return window.localStorage.removeItem(e3);
}, setItemSync: function(e3, t2) {
  return window.localStorage.setItem(e3, t2);
} };
function l(e3) {
  return new Promise(function(t2) {
    return setTimeout(t2, e3);
  });
}
function d(e3) {
  for (var t2 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", n2 = "", o2 = 0; o2 < e3; o2++) {
    n2 += t2[Math.floor(Math.random() * t2.length)];
  }
  return n2;
}
var h = function() {
  function e3(t2) {
    this.acquiredIatSet = /* @__PURE__ */ new Set(), this.storageHandler = void 0, this.id = Date.now().toString() + d(15), this.acquireLock = this.acquireLock.bind(this), this.releaseLock = this.releaseLock.bind(this), this.releaseLock__private__ = this.releaseLock__private__.bind(this), this.waitForSomethingToChange = this.waitForSomethingToChange.bind(this), this.refreshLockWhileAcquired = this.refreshLockWhileAcquired.bind(this), this.storageHandler = t2, void 0 === e3.waiters && (e3.waiters = []);
  }
  return e3.prototype.acquireLock = function(t2, n2) {
    return void 0 === n2 && (n2 = 5e3), i(this, void 0, void 0, function() {
      var o2, r2, i2, s2, c2, h2, p2;
      return a(this, function(a2) {
        switch (a2.label) {
          case 0:
            o2 = Date.now() + d(4), r2 = Date.now() + n2, i2 = "browser-tabs-lock-key-" + t2, s2 = void 0 === this.storageHandler ? u : this.storageHandler, a2.label = 1;
          case 1:
            return Date.now() < r2 ? [4, l(30)] : [3, 8];
          case 2:
            return a2.sent(), null !== s2.getItemSync(i2) ? [3, 5] : (c2 = this.id + "-" + t2 + "-" + o2, [4, l(Math.floor(25 * Math.random()))]);
          case 3:
            return a2.sent(), s2.setItemSync(i2, JSON.stringify({ id: this.id, iat: o2, timeoutKey: c2, timeAcquired: Date.now(), timeRefreshed: Date.now() })), [4, l(30)];
          case 4:
            return a2.sent(), null !== (h2 = s2.getItemSync(i2)) && (p2 = JSON.parse(h2)).id === this.id && p2.iat === o2 ? (this.acquiredIatSet.add(o2), this.refreshLockWhileAcquired(i2, o2), [2, true]) : [3, 7];
          case 5:
            return e3.lockCorrector(void 0 === this.storageHandler ? u : this.storageHandler), [4, this.waitForSomethingToChange(r2)];
          case 6:
            a2.sent(), a2.label = 7;
          case 7:
            return o2 = Date.now() + d(4), [3, 1];
          case 8:
            return [2, false];
        }
      });
    });
  }, e3.prototype.refreshLockWhileAcquired = function(e4, t2) {
    return i(this, void 0, void 0, function() {
      var n2 = this;
      return a(this, function(o2) {
        return setTimeout(function() {
          return i(n2, void 0, void 0, function() {
            var n3, o3, r2;
            return a(this, function(i2) {
              switch (i2.label) {
                case 0:
                  return [4, c.default().lock(t2)];
                case 1:
                  return i2.sent(), this.acquiredIatSet.has(t2) ? (n3 = void 0 === this.storageHandler ? u : this.storageHandler, null === (o3 = n3.getItemSync(e4)) ? (c.default().unlock(t2), [2]) : ((r2 = JSON.parse(o3)).timeRefreshed = Date.now(), n3.setItemSync(e4, JSON.stringify(r2)), c.default().unlock(t2), this.refreshLockWhileAcquired(e4, t2), [2])) : (c.default().unlock(t2), [2]);
              }
            });
          });
        }, 1e3), [2];
      });
    });
  }, e3.prototype.waitForSomethingToChange = function(t2) {
    return i(this, void 0, void 0, function() {
      return a(this, function(n2) {
        switch (n2.label) {
          case 0:
            return [4, new Promise(function(n3) {
              var o2 = false, r2 = Date.now(), i2 = false;
              function a2() {
                if (i2 || (window.removeEventListener("storage", a2), e3.removeFromWaiting(a2), clearTimeout(s2), i2 = true), !o2) {
                  o2 = true;
                  var t3 = 50 - (Date.now() - r2);
                  t3 > 0 ? setTimeout(n3, t3) : n3(null);
                }
              }
              window.addEventListener("storage", a2), e3.addToWaiting(a2);
              var s2 = setTimeout(a2, Math.max(0, t2 - Date.now()));
            })];
          case 1:
            return n2.sent(), [2];
        }
      });
    });
  }, e3.addToWaiting = function(t2) {
    this.removeFromWaiting(t2), void 0 !== e3.waiters && e3.waiters.push(t2);
  }, e3.removeFromWaiting = function(t2) {
    void 0 !== e3.waiters && (e3.waiters = e3.waiters.filter(function(e4) {
      return e4 !== t2;
    }));
  }, e3.notifyWaiters = function() {
    void 0 !== e3.waiters && e3.waiters.slice().forEach(function(e4) {
      return e4();
    });
  }, e3.prototype.releaseLock = function(e4) {
    return i(this, void 0, void 0, function() {
      return a(this, function(t2) {
        switch (t2.label) {
          case 0:
            return [4, this.releaseLock__private__(e4)];
          case 1:
            return [2, t2.sent()];
        }
      });
    });
  }, e3.prototype.releaseLock__private__ = function(t2) {
    return i(this, void 0, void 0, function() {
      var n2, o2, r2, i2;
      return a(this, function(a2) {
        switch (a2.label) {
          case 0:
            return n2 = void 0 === this.storageHandler ? u : this.storageHandler, o2 = "browser-tabs-lock-key-" + t2, null === (r2 = n2.getItemSync(o2)) ? [2] : (i2 = JSON.parse(r2)).id !== this.id ? [3, 2] : [4, c.default().lock(i2.iat)];
          case 1:
            a2.sent(), this.acquiredIatSet.delete(i2.iat), n2.removeItemSync(o2), c.default().unlock(i2.iat), e3.notifyWaiters(), a2.label = 2;
          case 2:
            return [2];
        }
      });
    });
  }, e3.lockCorrector = function(t2) {
    for (var n2 = Date.now() - 5e3, o2 = t2, r2 = [], i2 = 0; ; ) {
      var a2 = o2.keySync(i2);
      if (null === a2) break;
      r2.push(a2), i2++;
    }
    for (var s2 = false, c2 = 0; c2 < r2.length; c2++) {
      var u2 = r2[c2];
      if (u2.includes("browser-tabs-lock-key")) {
        var l2 = o2.getItemSync(u2);
        if (null !== l2) {
          var d2 = JSON.parse(l2);
          (void 0 === d2.timeRefreshed && d2.timeAcquired < n2 || void 0 !== d2.timeRefreshed && d2.timeRefreshed < n2) && (o2.removeItemSync(u2), s2 = true);
        }
      }
    }
    s2 && e3.notifyWaiters();
  }, e3.waiters = void 0, e3;
}();
var p = n.default = h;
var f = { timeoutInSeconds: 60 };
var m = { name: "auth0-spa-js", version: "2.12.0" };
var y = () => Date.now();
var w = class _w extends Error {
  constructor(e3, t2) {
    super(t2), this.error = e3, this.error_description = t2, Object.setPrototypeOf(this, _w.prototype);
  }
  static fromPayload(e3) {
    let { error: t2, error_description: n2 } = e3;
    return new _w(t2, n2);
  }
};
var g = class _g extends w {
  constructor(e3, t2, n2) {
    let o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
    super(e3, t2), this.state = n2, this.appState = o2, Object.setPrototypeOf(this, _g.prototype);
  }
};
var v = class _v extends w {
  constructor(e3, t2, n2, o2) {
    let r2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null;
    super(e3, t2), this.connection = n2, this.state = o2, this.appState = r2, Object.setPrototypeOf(this, _v.prototype);
  }
};
var b = class _b extends w {
  constructor() {
    super("timeout", "Timeout"), Object.setPrototypeOf(this, _b.prototype);
  }
};
var _ = class __ extends b {
  constructor(e3) {
    super(), this.popup = e3, Object.setPrototypeOf(this, __.prototype);
  }
};
var k = class _k extends w {
  constructor(e3) {
    super("cancelled", "Popup closed"), this.popup = e3, Object.setPrototypeOf(this, _k.prototype);
  }
};
var S = class _S extends w {
  constructor() {
    super("popup_open", "Unable to open a popup for loginWithPopup - window.open returned `null`"), Object.setPrototypeOf(this, _S.prototype);
  }
};
var E = class _E extends w {
  constructor(e3, t2, n2) {
    super(e3, t2), this.mfa_token = n2, Object.setPrototypeOf(this, _E.prototype);
  }
};
var A = class _A extends w {
  constructor(e3, t2) {
    super("missing_refresh_token", "Missing Refresh Token (audience: '".concat(R(e3, ["default"]), "', scope: '").concat(R(t2), "')")), this.audience = e3, this.scope = t2, Object.setPrototypeOf(this, _A.prototype);
  }
};
var T = class _T extends w {
  constructor(e3, t2) {
    super("missing_scopes", "Missing requested scopes after refresh (audience: '".concat(R(e3, ["default"]), "', missing scope: '").concat(R(t2), "')")), this.audience = e3, this.scope = t2, Object.setPrototypeOf(this, _T.prototype);
  }
};
var P = class _P extends w {
  constructor(e3) {
    super("use_dpop_nonce", "Server rejected DPoP proof: wrong nonce"), this.newDpopNonce = e3, Object.setPrototypeOf(this, _P.prototype);
  }
};
function R(e3) {
  let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
  return e3 && !t2.includes(e3) ? e3 : "";
}
var I = () => window.crypto;
var O = () => {
  const e3 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
  let t2 = "";
  return Array.from(I().getRandomValues(new Uint8Array(43))).forEach((n2) => t2 += e3[n2 % e3.length]), t2;
};
var x = (e3) => btoa(e3);
var C = [{ key: "name", type: ["string"] }, { key: "version", type: ["string", "number"] }, { key: "env", type: ["object"] }];
var j = (e3) => Object.keys(e3).reduce((t2, n2) => {
  const o2 = C.find((e4) => e4.key === n2);
  return o2 && o2.type.includes(typeof e3[n2]) && (t2[n2] = e3[n2]), t2;
}, {});
var D = (t2) => {
  var { clientId: n2 } = t2, o2 = e(t2, ["clientId"]);
  return new URLSearchParams(((e3) => Object.keys(e3).filter((t3) => void 0 !== e3[t3]).reduce((t3, n3) => Object.assign(Object.assign({}, t3), { [n3]: e3[n3] }), {}))(Object.assign({ client_id: n2 }, o2))).toString();
};
var K = async (e3) => {
  const t2 = I().subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(e3));
  return await t2;
};
var L = (e3) => ((e4) => decodeURIComponent(atob(e4).split("").map((e5) => "%" + ("00" + e5.charCodeAt(0).toString(16)).slice(-2)).join("")))(e3.replace(/_/g, "/").replace(/-/g, "+"));
var U = (e3) => {
  const t2 = new Uint8Array(e3);
  return ((e4) => {
    const t3 = { "+": "-", "/": "_", "=": "" };
    return e4.replace(/[+/=]/g, (e5) => t3[e5]);
  })(window.btoa(String.fromCharCode(...Array.from(t2))));
};
var N = new TextEncoder();
var W = new TextDecoder();
function H(e3) {
  return "string" == typeof e3 ? N.encode(e3) : W.decode(e3);
}
function z(e3) {
  if ("number" != typeof e3.modulusLength || e3.modulusLength < 2048) throw new F(`${e3.name} modulusLength must be at least 2048 bits`);
}
async function J(e3, t2, n2) {
  if (false === n2.usages.includes("sign")) throw new TypeError('private CryptoKey instances used for signing assertions must include "sign" in their "usages"');
  const o2 = `${V(H(JSON.stringify(e3)))}.${V(H(JSON.stringify(t2)))}`;
  return `${o2}.${V(await crypto.subtle.sign(function(e4) {
    switch (e4.algorithm.name) {
      case "ECDSA":
        return { name: e4.algorithm.name, hash: "SHA-256" };
      case "RSA-PSS":
        return z(e4.algorithm), { name: e4.algorithm.name, saltLength: 32 };
      case "RSASSA-PKCS1-v1_5":
        return z(e4.algorithm), { name: e4.algorithm.name };
      case "Ed25519":
        return { name: e4.algorithm.name };
    }
    throw new G();
  }(n2), n2, H(o2)))}`;
}
var M;
if (Uint8Array.prototype.toBase64) M = (e3) => (e3 instanceof ArrayBuffer && (e3 = new Uint8Array(e3)), e3.toBase64({ alphabet: "base64url", omitPadding: true }));
else {
  const e3 = 32768;
  M = (t2) => {
    t2 instanceof ArrayBuffer && (t2 = new Uint8Array(t2));
    const n2 = [];
    for (let o2 = 0; o2 < t2.byteLength; o2 += e3) n2.push(String.fromCharCode.apply(null, t2.subarray(o2, o2 + e3)));
    return btoa(n2.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };
}
function V(e3) {
  return M(e3);
}
var G = class extends Error {
  constructor(e3) {
    var t2;
    super(null != e3 ? e3 : "operation not supported"), this.name = this.constructor.name, null === (t2 = Error.captureStackTrace) || void 0 === t2 || t2.call(Error, this, this.constructor);
  }
};
var F = class extends Error {
  constructor(e3) {
    var t2;
    super(e3), this.name = this.constructor.name, null === (t2 = Error.captureStackTrace) || void 0 === t2 || t2.call(Error, this, this.constructor);
  }
};
function Z(e3) {
  switch (e3.algorithm.name) {
    case "RSA-PSS":
      return function(e4) {
        if ("SHA-256" === e4.algorithm.hash.name) return "PS256";
        throw new G("unsupported RsaHashedKeyAlgorithm hash name");
      }(e3);
    case "RSASSA-PKCS1-v1_5":
      return function(e4) {
        if ("SHA-256" === e4.algorithm.hash.name) return "RS256";
        throw new G("unsupported RsaHashedKeyAlgorithm hash name");
      }(e3);
    case "ECDSA":
      return function(e4) {
        if ("P-256" === e4.algorithm.namedCurve) return "ES256";
        throw new G("unsupported EcKeyAlgorithm namedCurve");
      }(e3);
    case "Ed25519":
      return "Ed25519";
    default:
      throw new G("unsupported CryptoKey algorithm name");
  }
}
function q(e3) {
  return e3 instanceof CryptoKey;
}
function B(e3) {
  return q(e3) && "public" === e3.type;
}
async function X(e3, t2, n2, o2, r2, i2) {
  const a2 = null == e3 ? void 0 : e3.privateKey, s2 = null == e3 ? void 0 : e3.publicKey;
  if (!q(c2 = a2) || "private" !== c2.type) throw new TypeError('"keypair.privateKey" must be a private CryptoKey');
  var c2;
  if (!B(s2)) throw new TypeError('"keypair.publicKey" must be a public CryptoKey');
  if (true !== s2.extractable) throw new TypeError('"keypair.publicKey.extractable" must be true');
  if ("string" != typeof t2) throw new TypeError('"htu" must be a string');
  if ("string" != typeof n2) throw new TypeError('"htm" must be a string');
  if (void 0 !== o2 && "string" != typeof o2) throw new TypeError('"nonce" must be a string or undefined');
  if (void 0 !== r2 && "string" != typeof r2) throw new TypeError('"accessToken" must be a string or undefined');
  if (void 0 !== i2 && ("object" != typeof i2 || null === i2 || Array.isArray(i2))) throw new TypeError('"additional" must be an object');
  return J({ alg: Z(a2), typ: "dpop+jwt", jwk: await Y(s2) }, Object.assign(Object.assign({}, i2), { iat: Math.floor(Date.now() / 1e3), jti: crypto.randomUUID(), htm: n2, nonce: o2, htu: t2, ath: r2 ? V(await crypto.subtle.digest("SHA-256", H(r2))) : void 0 }), a2);
}
async function Y(e3) {
  const { kty: t2, e: n2, n: o2, x: r2, y: i2, crv: a2 } = await crypto.subtle.exportKey("jwk", e3);
  return { kty: t2, crv: a2, e: n2, n: o2, x: r2, y: i2 };
}
var Q = ["authorization_code", "refresh_token", "urn:ietf:params:oauth:grant-type:token-exchange"];
function $() {
  return async function(e3, t2) {
    var n2;
    let o2;
    if ("string" != typeof e3 || 0 === e3.length) throw new TypeError('"alg" must be a non-empty string');
    switch (e3) {
      case "PS256":
        o2 = { name: "RSA-PSS", hash: "SHA-256", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) };
        break;
      case "RS256":
        o2 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) };
        break;
      case "ES256":
        o2 = { name: "ECDSA", namedCurve: "P-256" };
        break;
      case "Ed25519":
        o2 = { name: "Ed25519" };
        break;
      default:
        throw new G();
    }
    return crypto.subtle.generateKey(o2, null !== (n2 = null == t2 ? void 0 : t2.extractable) && void 0 !== n2 && n2, ["sign", "verify"]);
  }("ES256", { extractable: false });
}
function ee(e3) {
  return async function(e4) {
    if (!B(e4)) throw new TypeError('"publicKey" must be a public CryptoKey');
    if (true !== e4.extractable) throw new TypeError('"publicKey.extractable" must be true');
    const t2 = await Y(e4);
    let n2;
    switch (t2.kty) {
      case "EC":
        n2 = { crv: t2.crv, kty: t2.kty, x: t2.x, y: t2.y };
        break;
      case "OKP":
        n2 = { crv: t2.crv, kty: t2.kty, x: t2.x };
        break;
      case "RSA":
        n2 = { e: t2.e, kty: t2.kty, n: t2.n };
        break;
      default:
        throw new G("unsupported JWK kty");
    }
    return V(await crypto.subtle.digest({ name: "SHA-256" }, H(JSON.stringify(n2))));
  }(e3.publicKey);
}
function te(e3) {
  let { keyPair: t2, url: n2, method: o2, nonce: r2, accessToken: i2 } = e3;
  const a2 = function(e4) {
    const t3 = new URL(e4);
    return t3.search = "", t3.hash = "", t3.href;
  }(n2);
  return X(t2, a2, o2, r2, i2);
}
var ne = async (e3, t2) => {
  const n2 = await fetch(e3, t2);
  return { ok: n2.ok, json: await n2.json(), headers: (o2 = n2.headers, [...o2].reduce((e4, t3) => {
    let [n3, o3] = t3;
    return e4[n3] = o3, e4;
  }, {})) };
  var o2;
};
var oe = async (e3, t2, n2) => {
  const o2 = new AbortController();
  let r2;
  return t2.signal = o2.signal, Promise.race([ne(e3, t2), new Promise((e4, t3) => {
    r2 = setTimeout(() => {
      o2.abort(), t3(new Error("Timeout when executing 'fetch'"));
    }, n2);
  })]).finally(() => {
    clearTimeout(r2);
  });
};
var re = async (e3, t2, n2, o2, r2, i2, a2, s2) => ((e4, t3) => new Promise(function(n3, o3) {
  const r3 = new MessageChannel();
  r3.port1.onmessage = function(e5) {
    e5.data.error ? o3(new Error(e5.data.error)) : n3(e5.data), r3.port1.close();
  }, t3.postMessage(e4, [r3.port2]);
}))({ auth: { audience: t2, scope: n2 }, timeout: r2, fetchUrl: e3, fetchOptions: o2, useFormData: a2, useMrrt: s2 }, i2);
var ie = async function(e3, t2, n2, o2, r2, i2) {
  let a2 = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 1e4, s2 = arguments.length > 7 ? arguments[7] : void 0;
  return r2 ? re(e3, t2, n2, o2, a2, r2, i2, s2) : oe(e3, o2, a2);
};
async function ae(t2, n2, o2, r2, i2, a2, s2, c2, u2, l2) {
  if (u2) {
    const e3 = await u2.generateProof({ url: t2, method: i2.method || "GET", nonce: await u2.getNonce() });
    i2.headers = Object.assign(Object.assign({}, i2.headers), { dpop: e3 });
  }
  let d2, h2 = null;
  for (let e3 = 0; e3 < 3; e3++) try {
    d2 = await ie(t2, o2, r2, i2, a2, s2, n2, c2), h2 = null;
    break;
  } catch (e4) {
    h2 = e4;
  }
  if (h2) throw h2;
  const p2 = d2.json, { error: f2, error_description: m2 } = p2, y2 = e(p2, ["error", "error_description"]), { headers: g2, ok: v2 } = d2;
  let b2;
  if (u2 && (b2 = g2["dpop-nonce"], b2 && await u2.setNonce(b2)), !v2) {
    const e3 = m2 || "HTTP error. Unable to fetch ".concat(t2);
    if ("mfa_required" === f2) throw new E(f2, e3, y2.mfa_token);
    if ("missing_refresh_token" === f2) throw new A(o2, r2);
    if ("use_dpop_nonce" === f2) {
      if (!u2 || !b2 || l2) throw new P(b2);
      return ae(t2, n2, o2, r2, i2, a2, s2, c2, u2, true);
    }
    throw new w(f2 || "request_error", e3);
  }
  return y2;
}
async function se(t2, n2) {
  var { baseUrl: o2, timeout: r2, audience: i2, scope: a2, auth0Client: s2, useFormData: c2, useMrrt: u2, dpop: l2 } = t2, d2 = e(t2, ["baseUrl", "timeout", "audience", "scope", "auth0Client", "useFormData", "useMrrt", "dpop"]);
  const h2 = "urn:ietf:params:oauth:grant-type:token-exchange" === d2.grant_type, p2 = "refresh_token" === d2.grant_type && u2, f2 = Object.assign(Object.assign(Object.assign(Object.assign({}, d2), h2 && i2 && { audience: i2 }), h2 && a2 && { scope: a2 }), p2 && { audience: i2, scope: a2 }), y2 = c2 ? D(f2) : JSON.stringify(f2), w2 = (g2 = d2.grant_type, Q.includes(g2));
  var g2;
  return await ae("".concat(o2, "/oauth/token"), r2, i2 || "default", a2, { method: "POST", body: y2, headers: { "Content-Type": c2 ? "application/x-www-form-urlencoded" : "application/json", "Auth0-Client": btoa(JSON.stringify(j(s2 || m))) } }, n2, c2, u2, w2 ? l2 : void 0);
}
var ce = (e3) => Array.from(new Set(e3));
var ue = function() {
  for (var e3 = arguments.length, t2 = new Array(e3), n2 = 0; n2 < e3; n2++) t2[n2] = arguments[n2];
  return ce(t2.filter(Boolean).join(" ").trim().split(/\s+/)).join(" ");
};
var le = (e3, t2, n2) => {
  let o2;
  return n2 && (o2 = e3[n2]), o2 || (o2 = e3.default), ue(o2, t2);
};
var de = class _de {
  constructor(e3) {
    let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "@@auth0spajs@@", n2 = arguments.length > 2 ? arguments[2] : void 0;
    this.prefix = t2, this.suffix = n2, this.clientId = e3.clientId, this.scope = e3.scope, this.audience = e3.audience;
  }
  toKey() {
    return [this.prefix, this.clientId, this.audience, this.scope, this.suffix].filter(Boolean).join("::");
  }
  static fromKey(e3) {
    const [t2, n2, o2, r2] = e3.split("::");
    return new _de({ clientId: n2, scope: r2, audience: o2 }, t2);
  }
  static fromCacheEntry(e3) {
    const { scope: t2, audience: n2, client_id: o2 } = e3;
    return new _de({ scope: t2, audience: n2, clientId: o2 });
  }
};
var he = class {
  set(e3, t2) {
    localStorage.setItem(e3, JSON.stringify(t2));
  }
  get(e3) {
    const t2 = window.localStorage.getItem(e3);
    if (t2) try {
      return JSON.parse(t2);
    } catch (e4) {
      return;
    }
  }
  remove(e3) {
    localStorage.removeItem(e3);
  }
  allKeys() {
    return Object.keys(window.localStorage).filter((e3) => e3.startsWith("@@auth0spajs@@"));
  }
};
var pe = class {
  constructor() {
    this.enclosedCache = /* @__PURE__ */ function() {
      let e3 = {};
      return { set(t2, n2) {
        e3[t2] = n2;
      }, get(t2) {
        const n2 = e3[t2];
        if (n2) return n2;
      }, remove(t2) {
        delete e3[t2];
      }, allKeys: () => Object.keys(e3) };
    }();
  }
};
var fe = class {
  constructor(e3, t2, n2) {
    this.cache = e3, this.keyManifest = t2, this.nowProvider = n2 || y;
  }
  async setIdToken(e3, t2, n2) {
    var o2;
    const r2 = this.getIdTokenCacheKey(e3);
    await this.cache.set(r2, { id_token: t2, decodedToken: n2 }), await (null === (o2 = this.keyManifest) || void 0 === o2 ? void 0 : o2.add(r2));
  }
  async getIdToken(e3) {
    const t2 = await this.cache.get(this.getIdTokenCacheKey(e3.clientId));
    if (!t2 && e3.scope && e3.audience) {
      const t3 = await this.get(e3);
      if (!t3) return;
      if (!t3.id_token || !t3.decodedToken) return;
      return { id_token: t3.id_token, decodedToken: t3.decodedToken };
    }
    if (t2) return { id_token: t2.id_token, decodedToken: t2.decodedToken };
  }
  async get(e3) {
    let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], o2 = arguments.length > 3 ? arguments[3] : void 0;
    var r2;
    let i2 = await this.cache.get(e3.toKey());
    if (!i2) {
      const t3 = await this.getCacheKeys();
      if (!t3) return;
      const r3 = this.matchExistingCacheKey(e3, t3);
      if (r3 && (i2 = await this.cache.get(r3)), !i2 && n2 && "cache-only" !== o2) return this.getEntryWithRefreshToken(e3, t3);
    }
    if (!i2) return;
    const a2 = await this.nowProvider(), s2 = Math.floor(a2 / 1e3);
    return i2.expiresAt - t2 < s2 ? i2.body.refresh_token ? this.modifiedCachedEntry(i2, e3) : (await this.cache.remove(e3.toKey()), void await (null === (r2 = this.keyManifest) || void 0 === r2 ? void 0 : r2.remove(e3.toKey()))) : i2.body;
  }
  async modifiedCachedEntry(e3, t2) {
    return e3.body = { refresh_token: e3.body.refresh_token, audience: e3.body.audience, scope: e3.body.scope }, await this.cache.set(t2.toKey(), e3), { refresh_token: e3.body.refresh_token, audience: e3.body.audience, scope: e3.body.scope };
  }
  async set(e3) {
    var t2;
    const n2 = new de({ clientId: e3.client_id, scope: e3.scope, audience: e3.audience }), o2 = await this.wrapCacheEntry(e3);
    await this.cache.set(n2.toKey(), o2), await (null === (t2 = this.keyManifest) || void 0 === t2 ? void 0 : t2.add(n2.toKey()));
  }
  async remove(e3, t2, n2) {
    const o2 = new de({ clientId: e3, scope: n2, audience: t2 });
    await this.cache.remove(o2.toKey());
  }
  async clear(e3) {
    var t2;
    const n2 = await this.getCacheKeys();
    n2 && (await n2.filter((t3) => !e3 || t3.includes(e3)).reduce(async (e4, t3) => {
      await e4, await this.cache.remove(t3);
    }, Promise.resolve()), await (null === (t2 = this.keyManifest) || void 0 === t2 ? void 0 : t2.clear()));
  }
  async wrapCacheEntry(e3) {
    const t2 = await this.nowProvider();
    return { body: e3, expiresAt: Math.floor(t2 / 1e3) + e3.expires_in };
  }
  async getCacheKeys() {
    var e3;
    return this.keyManifest ? null === (e3 = await this.keyManifest.get()) || void 0 === e3 ? void 0 : e3.keys : this.cache.allKeys ? this.cache.allKeys() : void 0;
  }
  getIdTokenCacheKey(e3) {
    return new de({ clientId: e3 }, "@@auth0spajs@@", "@@user@@").toKey();
  }
  matchExistingCacheKey(e3, t2) {
    return t2.filter((t3) => {
      var n2;
      const o2 = de.fromKey(t3), r2 = new Set(o2.scope && o2.scope.split(" ")), i2 = (null === (n2 = e3.scope) || void 0 === n2 ? void 0 : n2.split(" ")) || [], a2 = o2.scope && i2.reduce((e4, t4) => e4 && r2.has(t4), true);
      return "@@auth0spajs@@" === o2.prefix && o2.clientId === e3.clientId && o2.audience === e3.audience && a2;
    })[0];
  }
  async getEntryWithRefreshToken(e3, t2) {
    var n2;
    for (const o2 of t2) {
      const t3 = de.fromKey(o2);
      if ("@@auth0spajs@@" === t3.prefix && t3.clientId === e3.clientId) {
        const t4 = await this.cache.get(o2);
        if (null === (n2 = null == t4 ? void 0 : t4.body) || void 0 === n2 ? void 0 : n2.refresh_token) return this.modifiedCachedEntry(t4, e3);
      }
    }
  }
  async updateEntry(e3, t2) {
    var n2;
    const o2 = await this.getCacheKeys();
    if (o2) for (const r2 of o2) {
      const o3 = await this.cache.get(r2);
      if ((null === (n2 = null == o3 ? void 0 : o3.body) || void 0 === n2 ? void 0 : n2.refresh_token) === e3) {
        const e4 = Object.assign(Object.assign({}, o3.body), { refresh_token: t2 });
        await this.set(e4);
      }
    }
  }
};
var me = class {
  constructor(e3, t2, n2) {
    this.storage = e3, this.clientId = t2, this.cookieDomain = n2, this.storageKey = "".concat("a0.spajs.txs", ".").concat(this.clientId);
  }
  create(e3) {
    this.storage.save(this.storageKey, e3, { daysUntilExpire: 1, cookieDomain: this.cookieDomain });
  }
  get() {
    return this.storage.get(this.storageKey);
  }
  remove() {
    this.storage.remove(this.storageKey, { cookieDomain: this.cookieDomain });
  }
};
var ye = (e3) => "number" == typeof e3;
var we = ["iss", "aud", "exp", "nbf", "iat", "jti", "azp", "nonce", "auth_time", "at_hash", "c_hash", "acr", "amr", "sub_jwk", "cnf", "sip_from_tag", "sip_date", "sip_callid", "sip_cseq_num", "sip_via_branch", "orig", "dest", "mky", "events", "toe", "txn", "rph", "sid", "vot", "vtm"];
var ge = (e3) => {
  if (!e3.id_token) throw new Error("ID token is required but missing");
  const t2 = ((e4) => {
    const t3 = e4.split("."), [n3, o3, r3] = t3;
    if (3 !== t3.length || !n3 || !o3 || !r3) throw new Error("ID token could not be decoded");
    const i2 = JSON.parse(L(o3)), a2 = { __raw: e4 }, s2 = {};
    return Object.keys(i2).forEach((e5) => {
      a2[e5] = i2[e5], we.includes(e5) || (s2[e5] = i2[e5]);
    }), { encoded: { header: n3, payload: o3, signature: r3 }, header: JSON.parse(L(n3)), claims: a2, user: s2 };
  })(e3.id_token);
  if (!t2.claims.iss) throw new Error("Issuer (iss) claim must be a string present in the ID token");
  if (t2.claims.iss !== e3.iss) throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'.concat(e3.iss, '", found "').concat(t2.claims.iss, '"'));
  if (!t2.user.sub) throw new Error("Subject (sub) claim must be a string present in the ID token");
  if ("RS256" !== t2.header.alg) throw new Error('Signature algorithm of "'.concat(t2.header.alg, '" is not supported. Expected the ID token to be signed with "RS256".'));
  if (!t2.claims.aud || "string" != typeof t2.claims.aud && !Array.isArray(t2.claims.aud)) throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");
  if (Array.isArray(t2.claims.aud)) {
    if (!t2.claims.aud.includes(e3.aud)) throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e3.aud, '" but was not one of "').concat(t2.claims.aud.join(", "), '"'));
    if (t2.claims.aud.length > 1) {
      if (!t2.claims.azp) throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");
      if (t2.claims.azp !== e3.aud) throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'.concat(e3.aud, '", found "').concat(t2.claims.azp, '"'));
    }
  } else if (t2.claims.aud !== e3.aud) throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e3.aud, '" but found "').concat(t2.claims.aud, '"'));
  if (e3.nonce) {
    if (!t2.claims.nonce) throw new Error("Nonce (nonce) claim must be a string present in the ID token");
    if (t2.claims.nonce !== e3.nonce) throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'.concat(e3.nonce, '", found "').concat(t2.claims.nonce, '"'));
  }
  if (e3.max_age && !ye(t2.claims.auth_time)) throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");
  if (null == t2.claims.exp || !ye(t2.claims.exp)) throw new Error("Expiration Time (exp) claim must be a number present in the ID token");
  if (!ye(t2.claims.iat)) throw new Error("Issued At (iat) claim must be a number present in the ID token");
  const n2 = e3.leeway || 60, o2 = new Date(e3.now || Date.now()), r2 = /* @__PURE__ */ new Date(0);
  if (r2.setUTCSeconds(t2.claims.exp + n2), o2 > r2) throw new Error("Expiration Time (exp) claim error in the ID token; current time (".concat(o2, ") is after expiration time (").concat(r2, ")"));
  if (null != t2.claims.nbf && ye(t2.claims.nbf)) {
    const e4 = /* @__PURE__ */ new Date(0);
    if (e4.setUTCSeconds(t2.claims.nbf - n2), o2 < e4) throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Current time (".concat(o2, ") is before ").concat(e4));
  }
  if (null != t2.claims.auth_time && ye(t2.claims.auth_time)) {
    const r3 = /* @__PURE__ */ new Date(0);
    if (r3.setUTCSeconds(parseInt(t2.claims.auth_time) + e3.max_age + n2), o2 > r3) throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Current time (".concat(o2, ") is after last auth at ").concat(r3));
  }
  if (e3.organization) {
    const n3 = e3.organization.trim();
    if (n3.startsWith("org_")) {
      const e4 = n3;
      if (!t2.claims.org_id) throw new Error("Organization ID (org_id) claim must be a string present in the ID token");
      if (e4 !== t2.claims.org_id) throw new Error('Organization ID (org_id) claim mismatch in the ID token; expected "'.concat(e4, '", found "').concat(t2.claims.org_id, '"'));
    } else {
      const e4 = n3.toLowerCase();
      if (!t2.claims.org_name) throw new Error("Organization Name (org_name) claim must be a string present in the ID token");
      if (e4 !== t2.claims.org_name) throw new Error('Organization Name (org_name) claim mismatch in the ID token; expected "'.concat(e4, '", found "').concat(t2.claims.org_name, '"'));
    }
  }
  return t2;
};
var ve = t && t.__assign || function() {
  return ve = Object.assign || function(e3) {
    for (var t2, n2 = 1, o2 = arguments.length; n2 < o2; n2++) for (var r2 in t2 = arguments[n2]) Object.prototype.hasOwnProperty.call(t2, r2) && (e3[r2] = t2[r2]);
    return e3;
  }, ve.apply(this, arguments);
};
function be(e3, t2) {
  if (!t2) return "";
  var n2 = "; " + e3;
  return true === t2 ? n2 : n2 + "=" + t2;
}
function _e(e3, t2, n2) {
  return encodeURIComponent(e3).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/\(/g, "%28").replace(/\)/g, "%29") + "=" + encodeURIComponent(t2).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + function(e4) {
    if ("number" == typeof e4.expires) {
      var t3 = /* @__PURE__ */ new Date();
      t3.setMilliseconds(t3.getMilliseconds() + 864e5 * e4.expires), e4.expires = t3;
    }
    return be("Expires", e4.expires ? e4.expires.toUTCString() : "") + be("Domain", e4.domain) + be("Path", e4.path) + be("Secure", e4.secure) + be("SameSite", e4.sameSite);
  }(n2);
}
function ke() {
  return function(e3) {
    for (var t2 = {}, n2 = e3 ? e3.split("; ") : [], o2 = /(%[\dA-F]{2})+/gi, r2 = 0; r2 < n2.length; r2++) {
      var i2 = n2[r2].split("="), a2 = i2.slice(1).join("=");
      '"' === a2.charAt(0) && (a2 = a2.slice(1, -1));
      try {
        t2[i2[0].replace(o2, decodeURIComponent)] = a2.replace(o2, decodeURIComponent);
      } catch (e4) {
      }
    }
    return t2;
  }(document.cookie);
}
var Se = function(e3) {
  return ke()[e3];
};
function Ee(e3, t2, n2) {
  document.cookie = _e(e3, t2, ve({ path: "/" }, n2));
}
var Ae = Ee;
var Te = function(e3, t2) {
  Ee(e3, "", ve(ve({}, t2), { expires: -1 }));
};
var Pe = { get(e3) {
  const t2 = Se(e3);
  if (void 0 !== t2) return JSON.parse(t2);
}, save(e3, t2, n2) {
  let o2 = {};
  "https:" === window.location.protocol && (o2 = { secure: true, sameSite: "none" }), (null == n2 ? void 0 : n2.daysUntilExpire) && (o2.expires = n2.daysUntilExpire), (null == n2 ? void 0 : n2.cookieDomain) && (o2.domain = n2.cookieDomain), Ae(e3, JSON.stringify(t2), o2);
}, remove(e3, t2) {
  let n2 = {};
  (null == t2 ? void 0 : t2.cookieDomain) && (n2.domain = t2.cookieDomain), Te(e3, n2);
} };
var Re = { get(e3) {
  const t2 = Pe.get(e3);
  return t2 || Pe.get("".concat("_legacy_").concat(e3));
}, save(e3, t2, n2) {
  let o2 = {};
  "https:" === window.location.protocol && (o2 = { secure: true }), (null == n2 ? void 0 : n2.daysUntilExpire) && (o2.expires = n2.daysUntilExpire), (null == n2 ? void 0 : n2.cookieDomain) && (o2.domain = n2.cookieDomain), Ae("".concat("_legacy_").concat(e3), JSON.stringify(t2), o2), Pe.save(e3, t2, n2);
}, remove(e3, t2) {
  let n2 = {};
  (null == t2 ? void 0 : t2.cookieDomain) && (n2.domain = t2.cookieDomain), Te(e3, n2), Pe.remove(e3, t2), Pe.remove("".concat("_legacy_").concat(e3), t2);
} };
var Ie = { get(e3) {
  if ("undefined" == typeof sessionStorage) return;
  const t2 = sessionStorage.getItem(e3);
  return null != t2 ? JSON.parse(t2) : void 0;
}, save(e3, t2) {
  sessionStorage.setItem(e3, JSON.stringify(t2));
}, remove(e3) {
  sessionStorage.removeItem(e3);
} };
var Oe;
!function(e3) {
  e3.Code = "code", e3.ConnectCode = "connect_code";
}(Oe || (Oe = {}));
var xe = class {
};
function Ce(e3, t2, n2) {
  var o2 = void 0 === t2 ? null : t2, r2 = function(e4, t3) {
    var n3 = atob(e4);
    if (t3) {
      for (var o3 = new Uint8Array(n3.length), r3 = 0, i3 = n3.length; r3 < i3; ++r3) o3[r3] = n3.charCodeAt(r3);
      return String.fromCharCode.apply(null, new Uint16Array(o3.buffer));
    }
    return n3;
  }(e3, void 0 !== n2 && n2), i2 = r2.indexOf("\n", 10) + 1, a2 = r2.substring(i2) + (o2 ? "//# sourceMappingURL=" + o2 : ""), s2 = new Blob([a2], { type: "application/javascript" });
  return URL.createObjectURL(s2);
}
var je;
var De;
var Ke;
var Le;
var Ue = (je = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Y2xhc3MgZSBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHQscil7c3VwZXIociksdGhpcy5lcnJvcj10LHRoaXMuZXJyb3JfZGVzY3JpcHRpb249cixPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcyxlLnByb3RvdHlwZSl9c3RhdGljIGZyb21QYXlsb2FkKHQpe2xldHtlcnJvcjpyLGVycm9yX2Rlc2NyaXB0aW9uOnN9PXQ7cmV0dXJuIG5ldyBlKHIscyl9fWNsYXNzIHQgZXh0ZW5kcyBle2NvbnN0cnVjdG9yKGUscyl7c3VwZXIoIm1pc3NpbmdfcmVmcmVzaF90b2tlbiIsIk1pc3NpbmcgUmVmcmVzaCBUb2tlbiAoYXVkaWVuY2U6ICciLmNvbmNhdChyKGUsWyJkZWZhdWx0Il0pLCInLCBzY29wZTogJyIpLmNvbmNhdChyKHMpLCInKSIpKSx0aGlzLmF1ZGllbmNlPWUsdGhpcy5zY29wZT1zLE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLHQucHJvdG90eXBlKX19ZnVuY3Rpb24gcihlKXtsZXQgdD1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06W107cmV0dXJuIGUmJiF0LmluY2x1ZGVzKGUpP2U6IiJ9ImZ1bmN0aW9uIj09dHlwZW9mIFN1cHByZXNzZWRFcnJvciYmU3VwcHJlc3NlZEVycm9yO2NvbnN0IHM9ZT0+e3ZhcntjbGllbnRJZDp0fT1lLHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj17fTtmb3IodmFyIHMgaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxzKSYmdC5pbmRleE9mKHMpPDAmJihyW3NdPWVbc10pO2lmKG51bGwhPWUmJiJmdW5jdGlvbiI9PXR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKXt2YXIgbz0wO2ZvcihzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZSk7bzxzLmxlbmd0aDtvKyspdC5pbmRleE9mKHNbb10pPDAmJk9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChlLHNbb10pJiYocltzW29dXT1lW3Nbb11dKX1yZXR1cm4gcn0oZSxbImNsaWVudElkIl0pO3JldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKChlPT5PYmplY3Qua2V5cyhlKS5maWx0ZXIoKHQ9PnZvaWQgMCE9PWVbdF0pKS5yZWR1Y2UoKCh0LHIpPT5PYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sdCkse1tyXTplW3JdfSkpLHt9KSkoT2JqZWN0LmFzc2lnbih7Y2xpZW50X2lkOnR9LHIpKSkudG9TdHJpbmcoKX07bGV0IG89e307Y29uc3Qgbj0oZSx0KT0+IiIuY29uY2F0KGUsInwiKS5jb25jYXQodCk7YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsKGFzeW5jIGU9PntsZXQgcixjLHtkYXRhOnt0aW1lb3V0OmksYXV0aDphLGZldGNoVXJsOmYsZmV0Y2hPcHRpb25zOmwsdXNlRm9ybURhdGE6cCx1c2VNcnJ0Omh9LHBvcnRzOlt1XX09ZSxkPXt9O2NvbnN0e2F1ZGllbmNlOmcsc2NvcGU6eX09YXx8e307dHJ5e2NvbnN0IGU9cD8oZT0+e2NvbnN0IHQ9bmV3IFVSTFNlYXJjaFBhcmFtcyhlKSxyPXt9O3JldHVybiB0LmZvckVhY2goKChlLHQpPT57clt0XT1lfSkpLHJ9KShsLmJvZHkpOkpTT04ucGFyc2UobC5ib2R5KTtpZighZS5yZWZyZXNoX3Rva2VuJiYicmVmcmVzaF90b2tlbiI9PT1lLmdyYW50X3R5cGUpe2lmKGM9KChlLHQpPT5vW24oZSx0KV0pKGcseSksIWMmJmgpe2NvbnN0IGU9by5sYXRlc3RfcmVmcmVzaF90b2tlbix0PSgoZSx0KT0+e2NvbnN0IHI9T2JqZWN0LmtleXMobykuZmluZCgocj0+e2lmKCJsYXRlc3RfcmVmcmVzaF90b2tlbiIhPT1yKXtjb25zdCBzPSgoZSx0KT0+dC5zdGFydHNXaXRoKCIiLmNvbmNhdChlLCJ8IikpKSh0LHIpLG89ci5zcGxpdCgifCIpWzFdLnNwbGl0KCIgIiksbj1lLnNwbGl0KCIgIikuZXZlcnkoKGU9Pm8uaW5jbHVkZXMoZSkpKTtyZXR1cm4gcyYmbn19KSk7cmV0dXJuISFyfSkoeSxnKTtlJiYhdCYmKGM9ZSl9aWYoIWMpdGhyb3cgbmV3IHQoZyx5KTtsLmJvZHk9cD9zKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSxlKSx7cmVmcmVzaF90b2tlbjpjfSkpOkpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSxlKSx7cmVmcmVzaF90b2tlbjpjfSkpfWxldCBhLGs7ImZ1bmN0aW9uIj09dHlwZW9mIEFib3J0Q29udHJvbGxlciYmKGE9bmV3IEFib3J0Q29udHJvbGxlcixsLnNpZ25hbD1hLnNpZ25hbCk7dHJ5e2s9YXdhaXQgUHJvbWlzZS5yYWNlKFsoaj1pLG5ldyBQcm9taXNlKChlPT5zZXRUaW1lb3V0KGUsaikpKSksZmV0Y2goZixPYmplY3QuYXNzaWduKHt9LGwpKV0pfWNhdGNoKGUpe3JldHVybiB2b2lkIHUucG9zdE1lc3NhZ2Uoe2Vycm9yOmUubWVzc2FnZX0pfWlmKCFrKXJldHVybiBhJiZhLmFib3J0KCksdm9pZCB1LnBvc3RNZXNzYWdlKHtlcnJvcjoiVGltZW91dCB3aGVuIGV4ZWN1dGluZyAnZmV0Y2gnIn0pO189ay5oZWFkZXJzLGQ9Wy4uLl9dLnJlZHVjZSgoKGUsdCk9PntsZXRbcixzXT10O3JldHVybiBlW3JdPXMsZX0pLHt9KSxyPWF3YWl0IGsuanNvbigpLHIucmVmcmVzaF90b2tlbj8oaCYmKG8ubGF0ZXN0X3JlZnJlc2hfdG9rZW49ci5yZWZyZXNoX3Rva2VuLE89YyxiPXIucmVmcmVzaF90b2tlbixPYmplY3QuZW50cmllcyhvKS5mb3JFYWNoKChlPT57bGV0W3Qscl09ZTtyPT09TyYmKG9bdF09Yil9KSkpLCgoZSx0LHIpPT57b1tuKHQscildPWV9KShyLnJlZnJlc2hfdG9rZW4sZyx5KSxkZWxldGUgci5yZWZyZXNoX3Rva2VuKTooKGUsdCk9PntkZWxldGUgb1tuKGUsdCldfSkoZyx5KSx1LnBvc3RNZXNzYWdlKHtvazprLm9rLGpzb246cixoZWFkZXJzOmR9KX1jYXRjaChlKXt1LnBvc3RNZXNzYWdlKHtvazohMSxqc29uOntlcnJvcjplLmVycm9yLGVycm9yX2Rlc2NyaXB0aW9uOmUubWVzc2FnZX0saGVhZGVyczpkfSl9dmFyIE8sYixfLGp9KSl9KCk7Cgo=", De = null, Ke = false, function(e3) {
  return Le = Le || Ce(je, De, Ke), new Worker(Le, e3);
});
var Ne = {};
var We = async function(e3) {
  let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3;
  for (let n2 = 0; n2 < t2; n2++) if (await e3()) return true;
  return false;
};
var He = class {
  constructor(e3, t2) {
    this.cache = e3, this.clientId = t2, this.manifestKey = this.createManifestKeyFrom(this.clientId);
  }
  async add(e3) {
    var t2;
    const n2 = new Set((null === (t2 = await this.cache.get(this.manifestKey)) || void 0 === t2 ? void 0 : t2.keys) || []);
    n2.add(e3), await this.cache.set(this.manifestKey, { keys: [...n2] });
  }
  async remove(e3) {
    const t2 = await this.cache.get(this.manifestKey);
    if (t2) {
      const n2 = new Set(t2.keys);
      return n2.delete(e3), n2.size > 0 ? await this.cache.set(this.manifestKey, { keys: [...n2] }) : await this.cache.remove(this.manifestKey);
    }
  }
  get() {
    return this.cache.get(this.manifestKey);
  }
  clear() {
    return this.cache.remove(this.manifestKey);
  }
  createManifestKeyFrom(e3) {
    return "".concat("@@auth0spajs@@", "::").concat(e3);
  }
};
var ze = { memory: () => new pe().enclosedCache, localstorage: () => new he() };
var Je = (e3) => ze[e3];
var Me = (t2) => {
  const { openUrl: n2, onRedirect: o2 } = t2, r2 = e(t2, ["openUrl", "onRedirect"]);
  return Object.assign(Object.assign({}, r2), { openUrl: false === n2 || n2 ? n2 : o2 });
};
var Ve = (e3, t2) => {
  const n2 = (null == t2 ? void 0 : t2.split(" ")) || [];
  return ((null == e3 ? void 0 : e3.split(" ")) || []).every((e4) => n2.includes(e4));
};
var Ge = { NONCE: "nonce", KEYPAIR: "keypair" };
var Fe = class {
  constructor(e3) {
    this.clientId = e3;
  }
  getVersion() {
    return 1;
  }
  createDbHandle() {
    const e3 = window.indexedDB.open("auth0-spa-js", this.getVersion());
    return new Promise((t2, n2) => {
      e3.onupgradeneeded = () => Object.values(Ge).forEach((t3) => e3.result.createObjectStore(t3)), e3.onerror = () => n2(e3.error), e3.onsuccess = () => t2(e3.result);
    });
  }
  async getDbHandle() {
    return this.dbHandle || (this.dbHandle = await this.createDbHandle()), this.dbHandle;
  }
  async executeDbRequest(e3, t2, n2) {
    const o2 = n2((await this.getDbHandle()).transaction(e3, t2).objectStore(e3));
    return new Promise((e4, t3) => {
      o2.onsuccess = () => e4(o2.result), o2.onerror = () => t3(o2.error);
    });
  }
  buildKey(e3) {
    const t2 = e3 ? "_".concat(e3) : "auth0";
    return "".concat(this.clientId, "::").concat(t2);
  }
  setNonce(e3, t2) {
    return this.save(Ge.NONCE, this.buildKey(t2), e3);
  }
  setKeyPair(e3) {
    return this.save(Ge.KEYPAIR, this.buildKey(), e3);
  }
  async save(e3, t2, n2) {
    await this.executeDbRequest(e3, "readwrite", (e4) => e4.put(n2, t2));
  }
  findNonce(e3) {
    return this.find(Ge.NONCE, this.buildKey(e3));
  }
  findKeyPair() {
    return this.find(Ge.KEYPAIR, this.buildKey());
  }
  find(e3, t2) {
    return this.executeDbRequest(e3, "readonly", (e4) => e4.get(t2));
  }
  async deleteBy(e3, t2) {
    const n2 = await this.executeDbRequest(e3, "readonly", (e4) => e4.getAllKeys());
    null == n2 || n2.filter(t2).map((t3) => this.executeDbRequest(e3, "readwrite", (e4) => e4.delete(t3)));
  }
  deleteByClientId(e3, t2) {
    return this.deleteBy(e3, (e4) => "string" == typeof e4 && e4.startsWith("".concat(t2, "::")));
  }
  clearNonces() {
    return this.deleteByClientId(Ge.NONCE, this.clientId);
  }
  clearKeyPairs() {
    return this.deleteByClientId(Ge.KEYPAIR, this.clientId);
  }
};
var Ze = class {
  constructor(e3) {
    this.storage = new Fe(e3);
  }
  getNonce(e3) {
    return this.storage.findNonce(e3);
  }
  setNonce(e3, t2) {
    return this.storage.setNonce(e3, t2);
  }
  async getOrGenerateKeyPair() {
    let e3 = await this.storage.findKeyPair();
    return e3 || (e3 = await $(), await this.storage.setKeyPair(e3)), e3;
  }
  async generateProof(e3) {
    const t2 = await this.getOrGenerateKeyPair();
    return te(Object.assign({ keyPair: t2 }, e3));
  }
  async calculateThumbprint() {
    return ee(await this.getOrGenerateKeyPair());
  }
  async clear() {
    await Promise.all([this.storage.clearNonces(), this.storage.clearKeyPairs()]);
  }
};
var qe;
var Be;
var Xe;
!function(e3) {
  e3.Bearer = "Bearer", e3.DPoP = "DPoP";
}(qe || (qe = {}));
var Ye = class {
  constructor(e3, t2) {
    this.hooks = t2, this.config = Object.assign(Object.assign({}, e3), { fetch: e3.fetch || ("undefined" == typeof window ? fetch : window.fetch.bind(window)) });
  }
  isAbsoluteUrl(e3) {
    return /^(https?:)?\/\//i.test(e3);
  }
  buildUrl(e3, t2) {
    if (t2) {
      if (this.isAbsoluteUrl(t2)) return t2;
      if (e3) return "".concat(e3.replace(/\/?\/$/, ""), "/").concat(t2.replace(/^\/+/, ""));
    }
    throw new TypeError("`url` must be absolute or `baseUrl` non-empty.");
  }
  getAccessToken(e3) {
    return this.config.getAccessToken ? this.config.getAccessToken(e3) : this.hooks.getAccessToken(e3);
  }
  extractUrl(e3) {
    return "string" == typeof e3 ? e3 : e3 instanceof URL ? e3.href : e3.url;
  }
  buildBaseRequest(e3, t2) {
    if (!this.config.baseUrl) return new Request(e3, t2);
    const n2 = this.buildUrl(this.config.baseUrl, this.extractUrl(e3)), o2 = e3 instanceof Request ? new Request(n2, e3) : n2;
    return new Request(o2, t2);
  }
  setAuthorizationHeader(e3, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : qe.Bearer;
    e3.headers.set("authorization", "".concat(n2, " ").concat(t2));
  }
  async setDpopProofHeader(e3, t2) {
    if (!this.config.dpopNonceId) return;
    const n2 = await this.hooks.getDpopNonce(), o2 = await this.hooks.generateDpopProof({ accessToken: t2, method: e3.method, nonce: n2, url: e3.url });
    e3.headers.set("dpop", o2);
  }
  async prepareRequest(e3, t2) {
    const n2 = await this.getAccessToken(t2);
    let o2, r2;
    "string" == typeof n2 ? (o2 = this.config.dpopNonceId ? qe.DPoP : qe.Bearer, r2 = n2) : (o2 = n2.token_type, r2 = n2.access_token), this.setAuthorizationHeader(e3, r2, o2), o2 === qe.DPoP && await this.setDpopProofHeader(e3, r2);
  }
  getHeader(e3, t2) {
    return Array.isArray(e3) ? new Headers(e3).get(t2) || "" : "function" == typeof e3.get ? e3.get(t2) || "" : e3[t2] || "";
  }
  hasUseDpopNonceError(e3) {
    if (401 !== e3.status) return false;
    const t2 = this.getHeader(e3.headers, "www-authenticate");
    return t2.includes("invalid_dpop_nonce") || t2.includes("use_dpop_nonce");
  }
  async handleResponse(e3, t2) {
    const n2 = this.getHeader(e3.headers, "dpop-nonce");
    if (n2 && await this.hooks.setDpopNonce(n2), !this.hasUseDpopNonceError(e3)) return e3;
    if (!n2 || !t2.onUseDpopNonceError) throw new P(n2);
    return t2.onUseDpopNonceError();
  }
  async internalFetchWithAuth(e3, t2, n2, o2) {
    const r2 = this.buildBaseRequest(e3, t2);
    await this.prepareRequest(r2, o2);
    const i2 = await this.config.fetch(r2);
    return this.handleResponse(i2, n2);
  }
  fetchWithAuth(e3, t2, n2) {
    const o2 = { onUseDpopNonceError: () => this.internalFetchWithAuth(e3, t2, Object.assign(Object.assign({}, o2), { onUseDpopNonceError: void 0 }), n2) };
    return this.internalFetchWithAuth(e3, t2, o2, n2);
  }
};
var Qe = class {
  constructor(e3, t2) {
    this.myAccountFetcher = e3, this.apiBase = t2;
  }
  async connectAccount(e3) {
    const t2 = await this.myAccountFetcher.fetchWithAuth("".concat(this.apiBase, "v1/connected-accounts/connect"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e3) });
    return this._handleResponse(t2);
  }
  async completeAccount(e3) {
    const t2 = await this.myAccountFetcher.fetchWithAuth("".concat(this.apiBase, "v1/connected-accounts/complete"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e3) });
    return this._handleResponse(t2);
  }
  async _handleResponse(e3) {
    let t2;
    try {
      t2 = await e3.text(), t2 = JSON.parse(t2);
    } catch (n2) {
      throw new $e({ type: "invalid_json", status: e3.status, title: "Invalid JSON response", detail: t2 || String(n2) });
    }
    if (e3.ok) return t2;
    throw new $e(t2);
  }
};
var $e = class _$e extends Error {
  constructor(e3) {
    let { type: t2, status: n2, title: o2, detail: r2, validation_errors: i2 } = e3;
    super(r2), this.name = "MyAccountApiError", this.type = t2, this.status = n2, this.title = o2, this.detail = r2, this.validation_errors = i2, Object.setPrototypeOf(this, _$e.prototype);
  }
};
function et(e3, t2) {
  this.v = e3, this.k = t2;
}
function tt(e3, t2, n2) {
  if ("function" == typeof e3 ? e3 === t2 : e3.has(t2)) return arguments.length < 3 ? t2 : n2;
  throw new TypeError("Private element is not present on this object");
}
function nt(e3) {
  return new et(e3, 0);
}
function ot(e3, t2) {
  if (t2.has(e3)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function rt(e3, t2) {
  return e3.get(tt(e3, t2));
}
function it(e3, t2, n2) {
  ot(e3, t2), t2.set(e3, n2);
}
function at(e3, t2, n2) {
  return e3.set(tt(e3, t2), n2), n2;
}
function st(e3, t2, n2) {
  return (t2 = function(e4) {
    var t3 = function(e5, t4) {
      if ("object" != typeof e5 || !e5) return e5;
      var n3 = e5[Symbol.toPrimitive];
      if (void 0 !== n3) {
        var o2 = n3.call(e5, t4 || "default");
        if ("object" != typeof o2) return o2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t4 ? String : Number)(e5);
    }(e4, "string");
    return "symbol" == typeof t3 ? t3 : t3 + "";
  }(t2)) in e3 ? Object.defineProperty(e3, t2, { value: n2, enumerable: true, configurable: true, writable: true }) : e3[t2] = n2, e3;
}
function ct(e3, t2) {
  var n2 = Object.keys(e3);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e3);
    t2 && (o2 = o2.filter(function(t3) {
      return Object.getOwnPropertyDescriptor(e3, t3).enumerable;
    })), n2.push.apply(n2, o2);
  }
  return n2;
}
function ut(e3) {
  for (var t2 = 1; t2 < arguments.length; t2++) {
    var n2 = null != arguments[t2] ? arguments[t2] : {};
    t2 % 2 ? ct(Object(n2), true).forEach(function(t3) {
      st(e3, t3, n2[t3]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(n2)) : ct(Object(n2)).forEach(function(t3) {
      Object.defineProperty(e3, t3, Object.getOwnPropertyDescriptor(n2, t3));
    });
  }
  return e3;
}
function lt(e3, t2) {
  if (null == e3) return {};
  var n2, o2, r2 = function(e4, t3) {
    if (null == e4) return {};
    var n3 = {};
    for (var o3 in e4) if ({}.hasOwnProperty.call(e4, o3)) {
      if (-1 !== t3.indexOf(o3)) continue;
      n3[o3] = e4[o3];
    }
    return n3;
  }(e3, t2);
  if (Object.getOwnPropertySymbols) {
    var i2 = Object.getOwnPropertySymbols(e3);
    for (o2 = 0; o2 < i2.length; o2++) n2 = i2[o2], -1 === t2.indexOf(n2) && {}.propertyIsEnumerable.call(e3, n2) && (r2[n2] = e3[n2]);
  }
  return r2;
}
function dt(e3) {
  return function() {
    return new ht(e3.apply(this, arguments));
  };
}
function ht(e3) {
  var t2, n2;
  function o2(t3, n3) {
    try {
      var i2 = e3[t3](n3), a2 = i2.value, s2 = a2 instanceof et;
      Promise.resolve(s2 ? a2.v : a2).then(function(n4) {
        if (s2) {
          var c2 = "return" === t3 ? "return" : "next";
          if (!a2.k || n4.done) return o2(c2, n4);
          n4 = e3[c2](n4).value;
        }
        r2(i2.done ? "return" : "normal", n4);
      }, function(e4) {
        o2("throw", e4);
      });
    } catch (e4) {
      r2("throw", e4);
    }
  }
  function r2(e4, r3) {
    switch (e4) {
      case "return":
        t2.resolve({ value: r3, done: true });
        break;
      case "throw":
        t2.reject(r3);
        break;
      default:
        t2.resolve({ value: r3, done: false });
    }
    (t2 = t2.next) ? o2(t2.key, t2.arg) : n2 = null;
  }
  this._invoke = function(e4, r3) {
    return new Promise(function(i2, a2) {
      var s2 = { key: e4, arg: r3, resolve: i2, reject: a2, next: null };
      n2 ? n2 = n2.next = s2 : (t2 = n2 = s2, o2(e4, r3));
    });
  }, "function" != typeof e3.return && (this.return = void 0);
}
var pt;
if (ht.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
  return this;
}, ht.prototype.next = function(e3) {
  return this._invoke("next", e3);
}, ht.prototype.throw = function(e3) {
  return this._invoke("throw", e3);
}, ht.prototype.return = function(e3) {
  return this._invoke("return", e3);
}, "undefined" == typeof navigator || null === (Be = navigator.userAgent) || void 0 === Be || null === (Xe = Be.startsWith) || void 0 === Xe || !Xe.call(Be, "Mozilla/5.0 ")) {
  const e3 = "v3.8.3";
  pt = "".concat("oauth4webapi", "/").concat(e3);
}
function ft(e3, t2) {
  if (null == e3) return false;
  try {
    return e3 instanceof t2 || Object.getPrototypeOf(e3)[Symbol.toStringTag] === t2.prototype[Symbol.toStringTag];
  } catch (e4) {
    return false;
  }
}
function mt(e3, t2, n2) {
  const o2 = new TypeError(e3, { cause: n2 });
  return Object.assign(o2, { code: t2 }), o2;
}
var yt = Symbol();
var wt = Symbol();
var gt = Symbol();
var vt = Symbol();
var bt = Symbol();
var _t = Symbol();
var kt = new TextEncoder();
var St = new TextDecoder();
function Et(e3) {
  return "string" == typeof e3 ? kt.encode(e3) : St.decode(e3);
}
var At;
var Tt;
if (Uint8Array.prototype.toBase64) At = (e3) => (e3 instanceof ArrayBuffer && (e3 = new Uint8Array(e3)), e3.toBase64({ alphabet: "base64url", omitPadding: true }));
else {
  const e3 = 32768;
  At = (t2) => {
    t2 instanceof ArrayBuffer && (t2 = new Uint8Array(t2));
    const n2 = [];
    for (let o2 = 0; o2 < t2.byteLength; o2 += e3) n2.push(String.fromCharCode.apply(null, t2.subarray(o2, o2 + e3)));
    return btoa(n2.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };
}
function Pt(e3) {
  return "string" == typeof e3 ? Tt(e3) : At(e3);
}
Tt = Uint8Array.fromBase64 ? (e3) => {
  try {
    return Uint8Array.fromBase64(e3, { alphabet: "base64url" });
  } catch (e4) {
    throw mt("The input to be decoded is not correctly encoded.", "ERR_INVALID_ARG_VALUE", e4);
  }
} : (e3) => {
  try {
    const t2 = atob(e3.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")), n2 = new Uint8Array(t2.length);
    for (let e4 = 0; e4 < t2.length; e4++) n2[e4] = t2.charCodeAt(e4);
    return n2;
  } catch (e4) {
    throw mt("The input to be decoded is not correctly encoded.", "ERR_INVALID_ARG_VALUE", e4);
  }
};
var Rt = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), st(this, "code", void 0), this.name = this.constructor.name, this.code = Rn, null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
var It = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), st(this, "code", void 0), this.name = this.constructor.name, null != t2 && t2.code && (this.code = null == t2 ? void 0 : t2.code), null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
function Ot(e3, t2, n2) {
  return new It(e3, { code: t2, cause: n2 });
}
function xt(e3, t2) {
  if (function(e4, t3) {
    if (!(e4 instanceof CryptoKey)) throw mt("".concat(t3, " must be a CryptoKey"), "ERR_INVALID_ARG_TYPE");
  }(e3, t2), "private" !== e3.type) throw mt("".concat(t2, " must be a private CryptoKey"), "ERR_INVALID_ARG_VALUE");
}
function Ct(e3) {
  return null !== e3 && "object" == typeof e3 && !Array.isArray(e3);
}
function jt(e3) {
  ft(e3, Headers) && (e3 = Object.fromEntries(e3.entries()));
  const t2 = new Headers(null != e3 ? e3 : {});
  if (pt && !t2.has("user-agent") && t2.set("user-agent", pt), t2.has("authorization")) throw mt('"options.headers" must not include the "authorization" header name', "ERR_INVALID_ARG_VALUE");
  return t2;
}
function Dt(e3, t2) {
  if (void 0 !== t2) {
    if ("function" == typeof t2 && (t2 = t2(e3.href)), !(t2 instanceof AbortSignal)) throw mt('"options.signal" must return or be an instance of AbortSignal', "ERR_INVALID_ARG_TYPE");
    return t2;
  }
}
function Kt(e3) {
  return e3.includes("//") ? e3.replace("//", "/") : e3;
}
async function Lt(e3, t2) {
  return async function(e4, t3, n2, o2) {
    if (!(e4 instanceof URL)) throw mt('"'.concat(t3, '" must be an instance of URL'), "ERR_INVALID_ARG_TYPE");
    Xt(e4, true !== (null == o2 ? void 0 : o2[yt]));
    const r2 = n2(new URL(e4.href)), i2 = jt(null == o2 ? void 0 : o2.headers);
    return i2.set("accept", "application/json"), ((null == o2 ? void 0 : o2[vt]) || fetch)(r2.href, { body: void 0, headers: Object.fromEntries(i2.entries()), method: "GET", redirect: "manual", signal: Dt(r2, null == o2 ? void 0 : o2.signal) });
  }(e3, "issuerIdentifier", (e4) => {
    switch (null == t2 ? void 0 : t2.algorithm) {
      case void 0:
      case "oidc":
        !function(e5, t3) {
          e5.pathname = Kt("".concat(e5.pathname, "/").concat(t3));
        }(e4, ".well-known/openid-configuration");
        break;
      case "oauth2":
        !function(e5, t3) {
          let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          "/" === e5.pathname ? e5.pathname = t3 : e5.pathname = Kt("".concat(t3, "/").concat(n2 ? e5.pathname : e5.pathname.replace(/(\/)$/, "")));
        }(e4, ".well-known/oauth-authorization-server");
        break;
      default:
        throw mt('"options.algorithm" must be "oidc" (default), or "oauth2"', "ERR_INVALID_ARG_VALUE");
    }
    return e4;
  }, t2);
}
function Ut(e3, t2, n2, o2, r2) {
  try {
    if ("number" != typeof e3 || !Number.isFinite(e3)) throw mt("".concat(n2, " must be a number"), "ERR_INVALID_ARG_TYPE", r2);
    if (e3 > 0) return;
    if (t2) {
      if (0 !== e3) throw mt("".concat(n2, " must be a non-negative number"), "ERR_INVALID_ARG_VALUE", r2);
      return;
    }
    throw mt("".concat(n2, " must be a positive number"), "ERR_INVALID_ARG_VALUE", r2);
  } catch (e4) {
    if (o2) throw Ot(e4.message, o2, r2);
    throw e4;
  }
}
function Nt(e3, t2, n2, o2) {
  try {
    if ("string" != typeof e3) throw mt("".concat(t2, " must be a string"), "ERR_INVALID_ARG_TYPE", o2);
    if (0 === e3.length) throw mt("".concat(t2, " must not be empty"), "ERR_INVALID_ARG_VALUE", o2);
  } catch (e4) {
    if (n2) throw Ot(e4.message, n2, o2);
    throw e4;
  }
}
function Wt(e3) {
  !function(e4, t2) {
    if (ln(e4) !== t2) throw function(e5) {
      let t3 = '"response" content-type must be ';
      for (var n2 = arguments.length, o2 = new Array(n2 > 1 ? n2 - 1 : 0), r2 = 1; r2 < n2; r2++) o2[r2 - 1] = arguments[r2];
      if (o2.length > 2) {
        const e6 = o2.pop();
        t3 += "".concat(o2.join(", "), ", or ").concat(e6);
      } else 2 === o2.length ? t3 += "".concat(o2[0], " or ").concat(o2[1]) : t3 += o2[0];
      return Ot(t3, Cn, e5);
    }(e4, t2);
  }(e3, "application/json");
}
function Ht() {
  return Pt(crypto.getRandomValues(new Uint8Array(32)));
}
function zt(e3) {
  switch (e3.algorithm.name) {
    case "RSA-PSS":
      return function(e4) {
        switch (e4.algorithm.hash.name) {
          case "SHA-256":
            return "PS256";
          case "SHA-384":
            return "PS384";
          case "SHA-512":
            return "PS512";
          default:
            throw new Rt("unsupported RsaHashedKeyAlgorithm hash name", { cause: e4 });
        }
      }(e3);
    case "RSASSA-PKCS1-v1_5":
      return function(e4) {
        switch (e4.algorithm.hash.name) {
          case "SHA-256":
            return "RS256";
          case "SHA-384":
            return "RS384";
          case "SHA-512":
            return "RS512";
          default:
            throw new Rt("unsupported RsaHashedKeyAlgorithm hash name", { cause: e4 });
        }
      }(e3);
    case "ECDSA":
      return function(e4) {
        switch (e4.algorithm.namedCurve) {
          case "P-256":
            return "ES256";
          case "P-384":
            return "ES384";
          case "P-521":
            return "ES512";
          default:
            throw new Rt("unsupported EcKeyAlgorithm namedCurve", { cause: e4 });
        }
      }(e3);
    case "Ed25519":
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      return e3.algorithm.name;
    case "EdDSA":
      return "Ed25519";
    default:
      throw new Rt("unsupported CryptoKey algorithm name", { cause: e3 });
  }
}
function Jt(e3) {
  const t2 = null == e3 ? void 0 : e3[wt];
  return "number" == typeof t2 && Number.isFinite(t2) ? t2 : 0;
}
function Mt(e3) {
  const t2 = null == e3 ? void 0 : e3[gt];
  return "number" == typeof t2 && Number.isFinite(t2) && -1 !== Math.sign(t2) ? t2 : 30;
}
function Vt() {
  return Math.floor(Date.now() / 1e3);
}
function Gt(e3) {
  if ("object" != typeof e3 || null === e3) throw mt('"as" must be an object', "ERR_INVALID_ARG_TYPE");
  Nt(e3.issuer, '"as.issuer"');
}
function Ft(e3) {
  if ("object" != typeof e3 || null === e3) throw mt('"client" must be an object', "ERR_INVALID_ARG_TYPE");
  Nt(e3.client_id, '"client.client_id"');
}
function Zt(e3) {
  return Nt(e3, '"clientSecret"'), (t2, n2, o2, r2) => {
    o2.set("client_id", n2.client_id), o2.set("client_secret", e3);
  };
}
function qt(e3, t2) {
  const { key: n2, kid: o2 } = (r2 = e3) instanceof CryptoKey ? { key: r2 } : (null == r2 ? void 0 : r2.key) instanceof CryptoKey ? (void 0 !== r2.kid && Nt(r2.kid, '"kid"'), { key: r2.key, kid: r2.kid }) : {};
  var r2;
  return xt(n2, '"clientPrivateKey.key"'), async (e4, r3, i2, a2) => {
    var s2;
    const c2 = { alg: zt(n2), kid: o2 }, u2 = function(e5, t3) {
      const n3 = Vt() + Jt(t3);
      return { jti: Ht(), aud: e5.issuer, exp: n3 + 60, iat: n3, nbf: n3, iss: t3.client_id, sub: t3.client_id };
    }(e4, r3);
    null == t2 || null === (s2 = t2[bt]) || void 0 === s2 || s2.call(t2, c2, u2), i2.set("client_id", r3.client_id), i2.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), i2.set("client_assertion", await async function(e5, t3, n3) {
      if (!n3.usages.includes("sign")) throw mt('CryptoKey instances used for signing assertions must include "sign" in their "usages"', "ERR_INVALID_ARG_VALUE");
      const o3 = "".concat(Pt(Et(JSON.stringify(e5))), ".").concat(Pt(Et(JSON.stringify(t3)))), r4 = Pt(await crypto.subtle.sign(function(e6) {
        switch (e6.algorithm.name) {
          case "ECDSA":
            return { name: e6.algorithm.name, hash: Mn(e6) };
          case "RSA-PSS":
            switch (Jn(e6), e6.algorithm.hash.name) {
              case "SHA-256":
              case "SHA-384":
              case "SHA-512":
                return { name: e6.algorithm.name, saltLength: parseInt(e6.algorithm.hash.name.slice(-3), 10) >> 3 };
              default:
                throw new Rt("unsupported RSA-PSS hash name", { cause: e6 });
            }
          case "RSASSA-PKCS1-v1_5":
            return Jn(e6), e6.algorithm.name;
          case "ML-DSA-44":
          case "ML-DSA-65":
          case "ML-DSA-87":
          case "Ed25519":
            return e6.algorithm.name;
        }
        throw new Rt("unsupported CryptoKey algorithm name", { cause: e6 });
      }(n3), n3, Et(o3)));
      return "".concat(o3, ".").concat(r4);
    }(c2, u2, n2));
  };
}
var Bt = URL.parse ? (e3, t2) => URL.parse(e3, t2) : (e3, t2) => {
  try {
    return new URL(e3, t2);
  } catch (e4) {
    return null;
  }
};
function Xt(e3, t2) {
  if (t2 && "https:" !== e3.protocol) throw Ot("only requests to HTTPS are allowed", Dn, e3);
  if ("https:" !== e3.protocol && "http:" !== e3.protocol) throw Ot("only HTTP and HTTPS requests are allowed", Kn, e3);
}
function Yt(e3, t2, n2, o2) {
  let r2;
  if ("string" != typeof e3 || !(r2 = Bt(e3))) throw Ot("authorization server metadata does not contain a valid ".concat(n2 ? '"as.mtls_endpoint_aliases.'.concat(t2, '"') : '"as.'.concat(t2, '"')), void 0 === e3 ? Wn : Hn, { attribute: n2 ? "mtls_endpoint_aliases.".concat(t2) : t2 });
  return Xt(r2, o2), r2;
}
function Qt(e3, t2, n2, o2) {
  return n2 && e3.mtls_endpoint_aliases && t2 in e3.mtls_endpoint_aliases ? Yt(e3.mtls_endpoint_aliases[t2], t2, n2, o2) : Yt(e3[t2], t2, n2, o2);
}
var $t = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), st(this, "cause", void 0), st(this, "code", void 0), st(this, "error", void 0), st(this, "status", void 0), st(this, "error_description", void 0), st(this, "response", void 0), this.name = this.constructor.name, this.code = Pn, this.cause = t2.cause, this.error = t2.cause.error, this.status = t2.response.status, this.error_description = t2.cause.error_description, Object.defineProperty(this, "response", { enumerable: false, value: t2.response }), null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
var en = class extends Error {
  constructor(e3, t2) {
    var n2, o2;
    super(e3, t2), st(this, "cause", void 0), st(this, "code", void 0), st(this, "error", void 0), st(this, "error_description", void 0), this.name = this.constructor.name, this.code = In, this.cause = t2.cause, this.error = t2.cause.get("error"), this.error_description = null !== (n2 = t2.cause.get("error_description")) && void 0 !== n2 ? n2 : void 0, null === (o2 = Error.captureStackTrace) || void 0 === o2 || o2.call(Error, this, this.constructor);
  }
};
var tn = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), st(this, "cause", void 0), st(this, "code", void 0), st(this, "response", void 0), st(this, "status", void 0), this.name = this.constructor.name, this.code = Tn, this.cause = t2.cause, this.status = t2.response.status, this.response = t2.response, Object.defineProperty(this, "response", { enumerable: false }), null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
var nn = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+";
var on = new RegExp("^[,\\s]*(" + nn + ")");
var rn = new RegExp('^[,\\s]*([a-zA-Z0-9!#$%&\\\'\\*\\+\\-\\.\\^_`\\|~]+)\\s*=\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"[,\\s]*(.*)');
var an = new RegExp("^[,\\s]*([a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+)\\s*=\\s*([a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+)[,\\s]*(.*)");
var sn = new RegExp("^([a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2})(?:$|[,\\s])(.*)");
async function cn(e3, t2, n2) {
  if (e3.status !== t2) {
    let t3;
    var o2;
    if (function(e4) {
      let t4;
      if (t4 = function(e5) {
        if (!ft(e5, Response)) throw mt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
        const t5 = e5.headers.get("www-authenticate");
        if (null === t5) return;
        const n3 = [];
        let o3 = t5;
        for (; o3; ) {
          var r2;
          let e6 = o3.match(on);
          const t6 = null === (r2 = e6) || void 0 === r2 ? void 0 : r2[1].toLowerCase();
          if (!t6) return;
          const i2 = o3.substring(e6[0].length);
          if (i2 && !i2.match(/^[\s,]/)) return;
          const a2 = i2.match(/^\s+(.*)$/), s2 = !!a2;
          o3 = a2 ? a2[1] : void 0;
          const c2 = {};
          let u2;
          if (s2) for (; o3; ) {
            let t7, n4;
            if (e6 = o3.match(rn)) {
              if ([, t7, n4, o3] = e6, n4.includes("\\")) try {
                n4 = JSON.parse('"'.concat(n4, '"'));
              } catch (e7) {
              }
              c2[t7.toLowerCase()] = n4;
            } else {
              if (!(e6 = o3.match(an))) {
                if (e6 = o3.match(sn)) {
                  if (Object.keys(c2).length) break;
                  [, u2, o3] = e6;
                  break;
                }
                return;
              }
              [, t7, n4, o3] = e6, c2[t7.toLowerCase()] = n4;
            }
          }
          else o3 = i2 || void 0;
          const l2 = { scheme: t6, parameters: c2 };
          u2 && (l2.token68 = u2), n3.push(l2);
        }
        return n3.length ? n3 : void 0;
      }(e4)) throw new tn("server responded with a challenge in the WWW-Authenticate HTTP Header", { cause: t4, response: e4 });
    }(e3), t3 = await async function(e4) {
      if (e4.status > 399 && e4.status < 500) {
        zn(e4), Wt(e4);
        try {
          const t4 = await e4.clone().json();
          if (Ct(t4) && "string" == typeof t4.error && t4.error.length) return t4;
        } catch (e5) {
        }
      }
    }(e3)) throw await (null === (o2 = e3.body) || void 0 === o2 ? void 0 : o2.cancel()), new $t("server responded with an error in the response body", { cause: t3, response: e3 });
    throw Ot('"response" is not a conform '.concat(n2, " response (unexpected HTTP status code)"), jn, e3);
  }
}
function un(e3) {
  if (!vn.has(e3)) throw mt('"options.DPoP" is not a valid DPoPHandle', "ERR_INVALID_ARG_VALUE");
}
function ln(e3) {
  var t2;
  return null === (t2 = e3.headers.get("content-type")) || void 0 === t2 ? void 0 : t2.split(";")[0];
}
async function dn(e3, t2, n2, o2, r2, i2, a2) {
  return await n2(e3, t2, r2, i2), i2.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"), ((null == a2 ? void 0 : a2[vt]) || fetch)(o2.href, { body: r2, headers: Object.fromEntries(i2.entries()), method: "POST", redirect: "manual", signal: Dt(o2, null == a2 ? void 0 : a2.signal) });
}
async function hn(e3, t2, n2, o2, r2, i2) {
  var a2;
  const s2 = Qt(e3, "token_endpoint", t2.use_mtls_endpoint_aliases, true !== (null == i2 ? void 0 : i2[yt]));
  r2.set("grant_type", o2);
  const c2 = jt(null == i2 ? void 0 : i2.headers);
  c2.set("accept", "application/json"), void 0 !== (null == i2 ? void 0 : i2.DPoP) && (un(i2.DPoP), await i2.DPoP.addProof(s2, c2, "POST"));
  const u2 = await dn(e3, t2, n2, s2, r2, c2, i2);
  return null == i2 || null === (a2 = i2.DPoP) || void 0 === a2 || a2.cacheNonce(u2, s2), u2;
}
var pn = /* @__PURE__ */ new WeakMap();
var fn = /* @__PURE__ */ new WeakMap();
function mn(e3) {
  if (!e3.id_token) return;
  const t2 = pn.get(e3);
  if (!t2) throw mt('"ref" was already garbage collected or did not resolve from the proper sources', "ERR_INVALID_ARG_VALUE");
  return t2;
}
async function yn(e3, t2, n2, o2, r2, i2) {
  if (Gt(e3), Ft(t2), !ft(n2, Response)) throw mt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
  await cn(n2, 200, "Token Endpoint"), zn(n2);
  const a2 = await Xn(n2);
  if (Nt(a2.access_token, '"response" body "access_token" property', xn, { body: a2 }), Nt(a2.token_type, '"response" body "token_type" property', xn, { body: a2 }), a2.token_type = a2.token_type.toLowerCase(), void 0 !== a2.expires_in) {
    let e4 = "number" != typeof a2.expires_in ? parseFloat(a2.expires_in) : a2.expires_in;
    Ut(e4, true, '"response" body "expires_in" property', xn, { body: a2 }), a2.expires_in = e4;
  }
  if (void 0 !== a2.refresh_token && Nt(a2.refresh_token, '"response" body "refresh_token" property', xn, { body: a2 }), void 0 !== a2.scope && "string" != typeof a2.scope) throw Ot('"response" body "scope" property must be a string', xn, { body: a2 });
  if (void 0 !== a2.id_token) {
    Nt(a2.id_token, '"response" body "id_token" property', xn, { body: a2 });
    const i3 = ["aud", "exp", "iat", "iss", "sub"];
    true === t2.require_auth_time && i3.push("auth_time"), void 0 !== t2.default_max_age && (Ut(t2.default_max_age, true, '"client.default_max_age"'), i3.push("auth_time")), null != o2 && o2.length && i3.push(...o2);
    const { claims: s2, jwt: c2 } = await async function(e4, t3, n3, o3, r3) {
      let i4, a3, { 0: s3, 1: c3, length: u2 } = e4.split(".");
      if (5 === u2) {
        if (void 0 === r3) throw new Rt("JWE decryption is not configured", { cause: e4 });
        e4 = await r3(e4), { 0: s3, 1: c3, length: u2 } = e4.split(".");
      }
      if (3 !== u2) throw Ot("Invalid JWT", xn, e4);
      try {
        i4 = JSON.parse(Et(Pt(s3)));
      } catch (e5) {
        throw Ot("failed to parse JWT Header body as base64url encoded JSON", On, e5);
      }
      if (!Ct(i4)) throw Ot("JWT Header must be a top level object", xn, e4);
      if (t3(i4), void 0 !== i4.crit) throw new Rt('no JWT "crit" header parameter extensions are supported', { cause: { header: i4 } });
      try {
        a3 = JSON.parse(Et(Pt(c3)));
      } catch (e5) {
        throw Ot("failed to parse JWT Payload body as base64url encoded JSON", On, e5);
      }
      if (!Ct(a3)) throw Ot("JWT Payload must be a top level object", xn, e4);
      const l2 = Vt() + n3;
      if (void 0 !== a3.exp) {
        if ("number" != typeof a3.exp) throw Ot('unexpected JWT "exp" (expiration time) claim type', xn, { claims: a3 });
        if (a3.exp <= l2 - o3) throw Ot('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', Ln, { claims: a3, now: l2, tolerance: o3, claim: "exp" });
      }
      if (void 0 !== a3.iat && "number" != typeof a3.iat) throw Ot('unexpected JWT "iat" (issued at) claim type', xn, { claims: a3 });
      if (void 0 !== a3.iss && "string" != typeof a3.iss) throw Ot('unexpected JWT "iss" (issuer) claim type', xn, { claims: a3 });
      if (void 0 !== a3.nbf) {
        if ("number" != typeof a3.nbf) throw Ot('unexpected JWT "nbf" (not before) claim type', xn, { claims: a3 });
        if (a3.nbf > l2 + o3) throw Ot('unexpected JWT "nbf" (not before) claim value', Ln, { claims: a3, now: l2, tolerance: o3, claim: "nbf" });
      }
      if (void 0 !== a3.aud && "string" != typeof a3.aud && !Array.isArray(a3.aud)) throw Ot('unexpected JWT "aud" (audience) claim type', xn, { claims: a3 });
      return { header: i4, claims: a3, jwt: e4 };
    }(a2.id_token, Gn.bind(void 0, t2.id_token_signed_response_alg, e3.id_token_signing_alg_values_supported, "RS256"), Jt(t2), Mt(t2), r2).then(kn.bind(void 0, i3)).then(gn.bind(void 0, e3)).then(wn.bind(void 0, t2.client_id));
    if (Array.isArray(s2.aud) && 1 !== s2.aud.length) {
      if (void 0 === s2.azp) throw Ot('ID Token "aud" (audience) claim includes additional untrusted audiences', Un, { claims: s2, claim: "aud" });
      if (s2.azp !== t2.client_id) throw Ot('unexpected ID Token "azp" (authorized party) claim value', Un, { expected: t2.client_id, claims: s2, claim: "azp" });
    }
    void 0 !== s2.auth_time && Ut(s2.auth_time, true, 'ID Token "auth_time" (authentication time)', xn, { claims: s2 }), fn.set(n2, c2), pn.set(a2, s2);
  }
  if (void 0 !== (null == i2 ? void 0 : i2[a2.token_type])) i2[a2.token_type](n2, a2);
  else if ("dpop" !== a2.token_type && "bearer" !== a2.token_type) throw new Rt("unsupported `token_type` value", { cause: { body: a2 } });
  return a2;
}
function wn(e3, t2) {
  if (Array.isArray(t2.claims.aud)) {
    if (!t2.claims.aud.includes(e3)) throw Ot('unexpected JWT "aud" (audience) claim value', Un, { expected: e3, claims: t2.claims, claim: "aud" });
  } else if (t2.claims.aud !== e3) throw Ot('unexpected JWT "aud" (audience) claim value', Un, { expected: e3, claims: t2.claims, claim: "aud" });
  return t2;
}
function gn(e3, t2) {
  var n2, o2;
  const r2 = null !== (n2 = null === (o2 = e3[Qn]) || void 0 === o2 ? void 0 : o2.call(e3, t2)) && void 0 !== n2 ? n2 : e3.issuer;
  if (t2.claims.iss !== r2) throw Ot('unexpected JWT "iss" (issuer) claim value', Un, { expected: r2, claims: t2.claims, claim: "iss" });
  return t2;
}
var vn = /* @__PURE__ */ new WeakSet();
var bn = Symbol();
var _n = { aud: "audience", c_hash: "code hash", client_id: "client id", exp: "expiration time", iat: "issued at", iss: "issuer", jti: "jwt id", nonce: "nonce", s_hash: "state hash", sub: "subject", ath: "access token hash", htm: "http method", htu: "http uri", cnf: "confirmation", auth_time: "authentication time" };
function kn(e3, t2) {
  for (const n2 of e3) if (void 0 === t2.claims[n2]) throw Ot('JWT "'.concat(n2, '" (').concat(_n[n2], ") claim missing"), xn, { claims: t2.claims });
  return t2;
}
var Sn = Symbol();
var En = Symbol();
async function An(e3, t2, n2, o2) {
  return "string" == typeof (null == o2 ? void 0 : o2.expectedNonce) || "number" == typeof (null == o2 ? void 0 : o2.maxAge) || null != o2 && o2.requireIdToken ? async function(e4, t3, n3, o3, r2, i2, a2) {
    const s2 = [];
    switch (o3) {
      case void 0:
        o3 = Sn;
        break;
      case Sn:
        break;
      default:
        Nt(o3, '"expectedNonce" argument'), s2.push("nonce");
    }
    switch (null != r2 || (r2 = t3.default_max_age), r2) {
      case void 0:
        r2 = En;
        break;
      case En:
        break;
      default:
        Ut(r2, true, '"maxAge" argument'), s2.push("auth_time");
    }
    const c2 = await yn(e4, t3, n3, s2, i2, a2);
    Nt(c2.id_token, '"response" body "id_token" property', xn, { body: c2 });
    const u2 = mn(c2);
    if (r2 !== En) {
      const e5 = Vt() + Jt(t3), n4 = Mt(t3);
      if (u2.auth_time + r2 < e5 - n4) throw Ot("too much time has elapsed since the last End-User authentication", Ln, { claims: u2, now: e5, tolerance: n4, claim: "auth_time" });
    }
    if (o3 === Sn) {
      if (void 0 !== u2.nonce) throw Ot('unexpected ID Token "nonce" claim value', Un, { expected: void 0, claims: u2, claim: "nonce" });
    } else if (u2.nonce !== o3) throw Ot('unexpected ID Token "nonce" claim value', Un, { expected: o3, claims: u2, claim: "nonce" });
    return c2;
  }(e3, t2, n2, o2.expectedNonce, o2.maxAge, o2[_t], o2.recognizedTokenTypes) : async function(e4, t3, n3, o3, r2) {
    const i2 = await yn(e4, t3, n3, void 0, o3, r2), a2 = mn(i2);
    if (a2) {
      if (void 0 !== t3.default_max_age) {
        Ut(t3.default_max_age, true, '"client.default_max_age"');
        const e5 = Vt() + Jt(t3), n4 = Mt(t3);
        if (a2.auth_time + t3.default_max_age < e5 - n4) throw Ot("too much time has elapsed since the last End-User authentication", Ln, { claims: a2, now: e5, tolerance: n4, claim: "auth_time" });
      }
      if (void 0 !== a2.nonce) throw Ot('unexpected ID Token "nonce" claim value', Un, { expected: void 0, claims: a2, claim: "nonce" });
    }
    return i2;
  }(e3, t2, n2, null == o2 ? void 0 : o2[_t], null == o2 ? void 0 : o2.recognizedTokenTypes);
}
var Tn = "OAUTH_WWW_AUTHENTICATE_CHALLENGE";
var Pn = "OAUTH_RESPONSE_BODY_ERROR";
var Rn = "OAUTH_UNSUPPORTED_OPERATION";
var In = "OAUTH_AUTHORIZATION_RESPONSE_ERROR";
var On = "OAUTH_PARSE_ERROR";
var xn = "OAUTH_INVALID_RESPONSE";
var Cn = "OAUTH_RESPONSE_IS_NOT_JSON";
var jn = "OAUTH_RESPONSE_IS_NOT_CONFORM";
var Dn = "OAUTH_HTTP_REQUEST_FORBIDDEN";
var Kn = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN";
var Ln = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED";
var Un = "OAUTH_JWT_CLAIM_COMPARISON_FAILED";
var Nn = "OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED";
var Wn = "OAUTH_MISSING_SERVER_METADATA";
var Hn = "OAUTH_INVALID_SERVER_METADATA";
function zn(e3) {
  if (e3.bodyUsed) throw mt('"response" body has been used already', "ERR_INVALID_ARG_VALUE");
}
function Jn(e3) {
  const { algorithm: t2 } = e3;
  if ("number" != typeof t2.modulusLength || t2.modulusLength < 2048) throw new Rt("unsupported ".concat(t2.name, " modulusLength"), { cause: e3 });
}
function Mn(e3) {
  const { algorithm: t2 } = e3;
  switch (t2.namedCurve) {
    case "P-256":
      return "SHA-256";
    case "P-384":
      return "SHA-384";
    case "P-521":
      return "SHA-512";
    default:
      throw new Rt("unsupported ECDSA namedCurve", { cause: e3 });
  }
}
async function Vn(e3) {
  if ("POST" !== e3.method) throw mt("form_post responses are expected to use the POST method", "ERR_INVALID_ARG_VALUE", { cause: e3 });
  if ("application/x-www-form-urlencoded" !== ln(e3)) throw mt("form_post responses are expected to use the application/x-www-form-urlencoded content-type", "ERR_INVALID_ARG_VALUE", { cause: e3 });
  return async function(e4) {
    if (e4.bodyUsed) throw mt("form_post Request instances must contain a readable body", "ERR_INVALID_ARG_VALUE", { cause: e4 });
    return e4.text();
  }(e3);
}
function Gn(e3, t2, n2, o2) {
  if (void 0 === e3) if (Array.isArray(t2)) {
    if (!t2.includes(o2.alg)) throw Ot('unexpected JWT "alg" header parameter', xn, { header: o2, expected: t2, reason: "authorization server metadata" });
  } else {
    if (void 0 === n2) throw Ot('missing client or server configuration to verify used JWT "alg" header parameter', void 0, { client: e3, issuer: t2, fallback: n2 });
    if ("string" == typeof n2 ? o2.alg !== n2 : "function" == typeof n2 ? !n2(o2.alg) : !n2.includes(o2.alg)) throw Ot('unexpected JWT "alg" header parameter', xn, { header: o2, expected: n2, reason: "default value" });
  }
  else if ("string" == typeof e3 ? o2.alg !== e3 : !e3.includes(o2.alg)) throw Ot('unexpected JWT "alg" header parameter', xn, { header: o2, expected: e3, reason: "client configuration" });
}
function Fn(e3, t2) {
  const { 0: n2, length: o2 } = e3.getAll(t2);
  if (o2 > 1) throw Ot('"'.concat(t2, '" parameter must be provided only once'), xn);
  return n2;
}
var Zn = Symbol();
var qn = Symbol();
function Bn(e3, t2, n2, o2) {
  if (Gt(e3), Ft(t2), n2 instanceof URL && (n2 = n2.searchParams), !(n2 instanceof URLSearchParams)) throw mt('"parameters" must be an instance of URLSearchParams, or URL', "ERR_INVALID_ARG_TYPE");
  if (Fn(n2, "response")) throw Ot('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()', xn, { parameters: n2 });
  const r2 = Fn(n2, "iss"), i2 = Fn(n2, "state");
  if (!r2 && e3.authorization_response_iss_parameter_supported) throw Ot('response parameter "iss" (issuer) missing', xn, { parameters: n2 });
  if (r2 && r2 !== e3.issuer) throw Ot('unexpected "iss" (issuer) response parameter value', xn, { expected: e3.issuer, parameters: n2 });
  switch (o2) {
    case void 0:
    case qn:
      if (void 0 !== i2) throw Ot('unexpected "state" response parameter encountered', xn, { expected: void 0, parameters: n2 });
      break;
    case Zn:
      break;
    default:
      if (Nt(o2, '"expectedState" argument'), i2 !== o2) throw Ot(void 0 === i2 ? 'response parameter "state" missing' : 'unexpected "state" response parameter value', xn, { expected: o2, parameters: n2 });
  }
  if (Fn(n2, "error")) throw new en("authorization response from the server is an error", { cause: n2 });
  const a2 = Fn(n2, "id_token"), s2 = Fn(n2, "token");
  if (void 0 !== a2 || void 0 !== s2) throw new Rt("implicit and hybrid flows are not supported");
  return c2 = new URLSearchParams(n2), vn.add(c2), c2;
  var c2;
}
async function Xn(e3) {
  let t2, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Wt;
  try {
    t2 = await e3.json();
  } catch (t3) {
    throw n2(e3), Ot('failed to parse "response" body as JSON', On, t3);
  }
  if (!Ct(t2)) throw Ot('"response" body must be a top level object', xn, { body: t2 });
  return t2;
}
var Yn = Symbol();
var Qn = Symbol();
var $n = new TextEncoder();
var eo = new TextDecoder();
function to(e3) {
  const t2 = new Uint8Array(e3.length);
  for (let n2 = 0; n2 < e3.length; n2++) {
    const o2 = e3.charCodeAt(n2);
    if (o2 > 127) throw new TypeError("non-ASCII string encountered in encode()");
    t2[n2] = o2;
  }
  return t2;
}
function no(e3) {
  if (Uint8Array.fromBase64) return Uint8Array.fromBase64(e3);
  const t2 = atob(e3), n2 = new Uint8Array(t2.length);
  for (let e4 = 0; e4 < t2.length; e4++) n2[e4] = t2.charCodeAt(e4);
  return n2;
}
function oo(e3) {
  if (Uint8Array.fromBase64) return Uint8Array.fromBase64("string" == typeof e3 ? e3 : eo.decode(e3), { alphabet: "base64url" });
  let t2 = e3;
  t2 instanceof Uint8Array && (t2 = eo.decode(t2)), t2 = t2.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return no(t2);
  } catch (e4) {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}
var ro = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), st(this, "code", "ERR_JOSE_GENERIC"), this.name = this.constructor.name, null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
st(ro, "code", "ERR_JOSE_GENERIC");
var io = class extends ro {
  constructor(e3, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified", o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
    super(e3, { cause: { claim: n2, reason: o2, payload: t2 } }), st(this, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED"), st(this, "claim", void 0), st(this, "reason", void 0), st(this, "payload", void 0), this.claim = n2, this.reason = o2, this.payload = t2;
  }
};
st(io, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED");
var ao = class extends ro {
  constructor(e3, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified", o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
    super(e3, { cause: { claim: n2, reason: o2, payload: t2 } }), st(this, "code", "ERR_JWT_EXPIRED"), st(this, "claim", void 0), st(this, "reason", void 0), st(this, "payload", void 0), this.claim = n2, this.reason = o2, this.payload = t2;
  }
};
st(ao, "code", "ERR_JWT_EXPIRED");
var so = class extends ro {
  constructor() {
    super(...arguments), st(this, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
  }
};
st(so, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
var co = class extends ro {
  constructor() {
    super(...arguments), st(this, "code", "ERR_JOSE_NOT_SUPPORTED");
  }
};
st(co, "code", "ERR_JOSE_NOT_SUPPORTED");
st(class extends ro {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "decryption operation failed", arguments.length > 1 ? arguments[1] : void 0), st(this, "code", "ERR_JWE_DECRYPTION_FAILED");
  }
}, "code", "ERR_JWE_DECRYPTION_FAILED");
st(class extends ro {
  constructor() {
    super(...arguments), st(this, "code", "ERR_JWE_INVALID");
  }
}, "code", "ERR_JWE_INVALID");
var uo = class extends ro {
  constructor() {
    super(...arguments), st(this, "code", "ERR_JWS_INVALID");
  }
};
st(uo, "code", "ERR_JWS_INVALID");
var lo = class extends ro {
  constructor() {
    super(...arguments), st(this, "code", "ERR_JWT_INVALID");
  }
};
st(lo, "code", "ERR_JWT_INVALID");
st(class extends ro {
  constructor() {
    super(...arguments), st(this, "code", "ERR_JWK_INVALID");
  }
}, "code", "ERR_JWK_INVALID");
var ho = class extends ro {
  constructor() {
    super(...arguments), st(this, "code", "ERR_JWKS_INVALID");
  }
};
st(ho, "code", "ERR_JWKS_INVALID");
var po = class extends ro {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "no applicable key found in the JSON Web Key Set", arguments.length > 1 ? arguments[1] : void 0), st(this, "code", "ERR_JWKS_NO_MATCHING_KEY");
  }
};
st(po, "code", "ERR_JWKS_NO_MATCHING_KEY");
var fo = class extends ro {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "multiple matching keys found in the JSON Web Key Set", arguments.length > 1 ? arguments[1] : void 0), st(this, Symbol.asyncIterator, void 0), st(this, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
  }
};
st(fo, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
var mo = class extends ro {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "request timed out", arguments.length > 1 ? arguments[1] : void 0), st(this, "code", "ERR_JWKS_TIMEOUT");
  }
};
st(mo, "code", "ERR_JWKS_TIMEOUT");
var yo = class extends ro {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "signature verification failed", arguments.length > 1 ? arguments[1] : void 0), st(this, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
  }
};
st(yo, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
var wo = function(e3) {
  let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "algorithm.name";
  return new TypeError("CryptoKey does not support this operation, its ".concat(t2, " must be ").concat(e3));
};
var go = (e3, t2) => e3.name === t2;
function vo(e3) {
  return parseInt(e3.name.slice(4), 10);
}
function bo(e3, t2, n2) {
  switch (t2) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!go(e3.algorithm, "HMAC")) throw wo("HMAC");
      const n3 = parseInt(t2.slice(2), 10);
      if (vo(e3.algorithm.hash) !== n3) throw wo("SHA-".concat(n3), "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!go(e3.algorithm, "RSASSA-PKCS1-v1_5")) throw wo("RSASSA-PKCS1-v1_5");
      const n3 = parseInt(t2.slice(2), 10);
      if (vo(e3.algorithm.hash) !== n3) throw wo("SHA-".concat(n3), "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!go(e3.algorithm, "RSA-PSS")) throw wo("RSA-PSS");
      const n3 = parseInt(t2.slice(2), 10);
      if (vo(e3.algorithm.hash) !== n3) throw wo("SHA-".concat(n3), "algorithm.hash");
      break;
    }
    case "Ed25519":
    case "EdDSA":
      if (!go(e3.algorithm, "Ed25519")) throw wo("Ed25519");
      break;
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      if (!go(e3.algorithm, t2)) throw wo(t2);
      break;
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!go(e3.algorithm, "ECDSA")) throw wo("ECDSA");
      const n3 = function(e4) {
        switch (e4) {
          case "ES256":
            return "P-256";
          case "ES384":
            return "P-384";
          case "ES512":
            return "P-521";
          default:
            throw new Error("unreachable");
        }
      }(t2);
      if (e3.algorithm.namedCurve !== n3) throw wo(n3, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  !function(e4, t3) {
    if (t3 && !e4.usages.includes(t3)) throw new TypeError("CryptoKey does not support this operation, its usages must include ".concat(t3, "."));
  }(e3, n2);
}
function _o(e3, t2) {
  for (var n2 = arguments.length, o2 = new Array(n2 > 2 ? n2 - 2 : 0), r2 = 2; r2 < n2; r2++) o2[r2 - 2] = arguments[r2];
  if ((o2 = o2.filter(Boolean)).length > 2) {
    const t3 = o2.pop();
    e3 += "one of type ".concat(o2.join(", "), ", or ").concat(t3, ".");
  } else 2 === o2.length ? e3 += "one of type ".concat(o2[0], " or ").concat(o2[1], ".") : e3 += "of type ".concat(o2[0], ".");
  if (null == t2) e3 += " Received ".concat(t2);
  else if ("function" == typeof t2 && t2.name) e3 += " Received function ".concat(t2.name);
  else if ("object" == typeof t2 && null != t2) {
    var i2;
    null !== (i2 = t2.constructor) && void 0 !== i2 && i2.name && (e3 += " Received an instance of ".concat(t2.constructor.name));
  }
  return e3;
}
var ko = function(e3, t2) {
  for (var n2 = arguments.length, o2 = new Array(n2 > 2 ? n2 - 2 : 0), r2 = 2; r2 < n2; r2++) o2[r2 - 2] = arguments[r2];
  return _o("Key for the ".concat(e3, " algorithm must be "), t2, ...o2);
};
var So = (e3) => {
  if ("CryptoKey" === (null == e3 ? void 0 : e3[Symbol.toStringTag])) return true;
  try {
    return e3 instanceof CryptoKey;
  } catch (e4) {
    return false;
  }
};
var Eo = (e3) => "KeyObject" === (null == e3 ? void 0 : e3[Symbol.toStringTag]);
var Ao = (e3) => So(e3) || Eo(e3);
function To(e3) {
  if ("object" != typeof (t2 = e3) || null === t2 || "[object Object]" !== Object.prototype.toString.call(e3)) return false;
  var t2;
  if (null === Object.getPrototypeOf(e3)) return true;
  let n2 = e3;
  for (; null !== Object.getPrototypeOf(n2); ) n2 = Object.getPrototypeOf(n2);
  return Object.getPrototypeOf(e3) === n2;
}
var Po = (e3, t2) => {
  if (e3.byteLength !== t2.length) return false;
  for (let n2 = 0; n2 < e3.byteLength; n2++) if (e3[n2] !== t2[n2]) return false;
  return true;
};
var Ro = (e3) => {
  const t2 = e3.data[e3.pos++];
  if (128 & t2) {
    const n2 = 127 & t2;
    let o2 = 0;
    for (let t3 = 0; t3 < n2; t3++) o2 = o2 << 8 | e3.data[e3.pos++];
    return o2;
  }
  return t2;
};
var Io = (e3, t2, n2) => {
  if (e3.data[e3.pos++] !== t2) throw new Error(n2);
};
var Oo = (e3, t2) => {
  const n2 = e3.data.subarray(e3.pos, e3.pos + t2);
  return e3.pos += t2, n2;
};
var xo = (e3) => {
  const t2 = ((e4) => {
    Io(e4, 6, "Expected algorithm OID");
    const t3 = Ro(e4);
    return Oo(e4, t3);
  })(e3);
  if (Po(t2, [43, 101, 110])) return "X25519";
  if (!Po(t2, [42, 134, 72, 206, 61, 2, 1])) throw new Error("Unsupported key algorithm");
  Io(e3, 6, "Expected curve OID");
  const n2 = Ro(e3), o2 = Oo(e3, n2);
  for (const { name: e4, oid: t3 } of [{ name: "P-256", oid: [42, 134, 72, 206, 61, 3, 1, 7] }, { name: "P-384", oid: [43, 129, 4, 0, 34] }, { name: "P-521", oid: [43, 129, 4, 0, 35] }]) if (Po(o2, t3)) return e4;
  throw new Error("Unsupported named curve");
};
var Co = async (e3, t2, n2, o2) => {
  var r2;
  let i2, a2;
  const s2 = "spki" === e3, c2 = () => s2 ? ["verify"] : ["sign"];
  switch (n2) {
    case "PS256":
    case "PS384":
    case "PS512":
      i2 = { name: "RSA-PSS", hash: "SHA-".concat(n2.slice(-3)) }, a2 = c2();
      break;
    case "RS256":
    case "RS384":
    case "RS512":
      i2 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-".concat(n2.slice(-3)) }, a2 = c2();
      break;
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512":
      i2 = { name: "RSA-OAEP", hash: "SHA-".concat(parseInt(n2.slice(-3), 10) || 1) }, a2 = s2 ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"];
      break;
    case "ES256":
    case "ES384":
    case "ES512":
      i2 = { name: "ECDSA", namedCurve: { ES256: "P-256", ES384: "P-384", ES512: "P-521" }[n2] }, a2 = c2();
      break;
    case "ECDH-ES":
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW":
      try {
        const e4 = o2.getNamedCurve(t2);
        i2 = "X25519" === e4 ? { name: "X25519" } : { name: "ECDH", namedCurve: e4 };
      } catch (e4) {
        throw new co("Invalid or unsupported key format");
      }
      a2 = s2 ? [] : ["deriveBits"];
      break;
    case "Ed25519":
    case "EdDSA":
      i2 = { name: "Ed25519" }, a2 = c2();
      break;
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      i2 = { name: n2 }, a2 = c2();
      break;
    default:
      throw new co('Invalid or unsupported "alg" (Algorithm) value');
  }
  return crypto.subtle.importKey(e3, t2, i2, null !== (r2 = null == o2 ? void 0 : o2.extractable) && void 0 !== r2 ? r2 : !!s2, a2);
};
var jo = (e3, t2, n2) => {
  var o2;
  const r2 = ((e4, t3) => no(e4.replace(t3, "")))(e3, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
  let i2 = n2;
  return null != t2 && null !== (o2 = t2.startsWith) && void 0 !== o2 && o2.call(t2, "ECDH-ES") && (i2 || (i2 = {}), i2.getNamedCurve = (e4) => {
    const t3 = { data: e4, pos: 0 };
    return function(e5) {
      Io(e5, 48, "Invalid PKCS#8 structure"), Ro(e5), Io(e5, 2, "Expected version field");
      const t4 = Ro(e5);
      e5.pos += t4, Io(e5, 48, "Expected algorithm identifier");
      Ro(e5);
      e5.pos;
    }(t3), xo(t3);
  }), Co("pkcs8", r2, t2, i2);
};
async function Do(e3) {
  var t2, n2;
  if (!e3.alg) throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  const { algorithm: o2, keyUsages: r2 } = function(e4) {
    let t3, n3;
    switch (e4.kty) {
      case "AKP":
        switch (e4.alg) {
          case "ML-DSA-44":
          case "ML-DSA-65":
          case "ML-DSA-87":
            t3 = { name: e4.alg }, n3 = e4.priv ? ["sign"] : ["verify"];
            break;
          default:
            throw new co('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      case "RSA":
        switch (e4.alg) {
          case "PS256":
          case "PS384":
          case "PS512":
            t3 = { name: "RSA-PSS", hash: "SHA-".concat(e4.alg.slice(-3)) }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "RS256":
          case "RS384":
          case "RS512":
            t3 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-".concat(e4.alg.slice(-3)) }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            t3 = { name: "RSA-OAEP", hash: "SHA-".concat(parseInt(e4.alg.slice(-3), 10) || 1) }, n3 = e4.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
            break;
          default:
            throw new co('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      case "EC":
        switch (e4.alg) {
          case "ES256":
            t3 = { name: "ECDSA", namedCurve: "P-256" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ES384":
            t3 = { name: "ECDSA", namedCurve: "P-384" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ES512":
            t3 = { name: "ECDSA", namedCurve: "P-521" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW":
            t3 = { name: "ECDH", namedCurve: e4.crv }, n3 = e4.d ? ["deriveBits"] : [];
            break;
          default:
            throw new co('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      case "OKP":
        switch (e4.alg) {
          case "Ed25519":
          case "EdDSA":
            t3 = { name: "Ed25519" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW":
            t3 = { name: e4.crv }, n3 = e4.d ? ["deriveBits"] : [];
            break;
          default:
            throw new co('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      default:
        throw new co('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
    }
    return { algorithm: t3, keyUsages: n3 };
  }(e3), i2 = ut({}, e3);
  return "AKP" !== i2.kty && delete i2.alg, delete i2.use, crypto.subtle.importKey("jwk", i2, o2, null !== (t2 = e3.ext) && void 0 !== t2 ? t2 : !e3.d && !e3.priv, null !== (n2 = e3.key_ops) && void 0 !== n2 ? n2 : r2);
}
var Ko = (e3) => To(e3) && "string" == typeof e3.kty;
var Lo;
var Uo = async function(e3, t2, n2) {
  let o2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
  Lo || (Lo = /* @__PURE__ */ new WeakMap());
  let r2 = Lo.get(e3);
  if (null != r2 && r2[n2]) return r2[n2];
  const i2 = await Do(ut(ut({}, t2), {}, { alg: n2 }));
  return o2 && Object.freeze(e3), r2 ? r2[n2] = i2 : Lo.set(e3, { [n2]: i2 }), i2;
};
async function No(e3, t2) {
  if (e3 instanceof Uint8Array) return e3;
  if (So(e3)) return e3;
  if (Eo(e3)) {
    if ("secret" === e3.type) return e3.export();
    if ("toCryptoKey" in e3 && "function" == typeof e3.toCryptoKey) try {
      return ((e4, t3) => {
        Lo || (Lo = /* @__PURE__ */ new WeakMap());
        let n3 = Lo.get(e4);
        if (null != n3 && n3[t3]) return n3[t3];
        const o2 = "public" === e4.type, r2 = !!o2;
        let i2;
        if ("x25519" === e4.asymmetricKeyType) {
          switch (t3) {
            case "ECDH-ES":
            case "ECDH-ES+A128KW":
            case "ECDH-ES+A192KW":
            case "ECDH-ES+A256KW":
              break;
            default:
              throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          }
          i2 = e4.toCryptoKey(e4.asymmetricKeyType, r2, o2 ? [] : ["deriveBits"]);
        }
        if ("ed25519" === e4.asymmetricKeyType) {
          if ("EdDSA" !== t3 && "Ed25519" !== t3) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          i2 = e4.toCryptoKey(e4.asymmetricKeyType, r2, [o2 ? "verify" : "sign"]);
        }
        switch (e4.asymmetricKeyType) {
          case "ml-dsa-44":
          case "ml-dsa-65":
          case "ml-dsa-87":
            if (t3 !== e4.asymmetricKeyType.toUpperCase()) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
            i2 = e4.toCryptoKey(e4.asymmetricKeyType, r2, [o2 ? "verify" : "sign"]);
        }
        if ("rsa" === e4.asymmetricKeyType) {
          let n4;
          switch (t3) {
            case "RSA-OAEP":
              n4 = "SHA-1";
              break;
            case "RS256":
            case "PS256":
            case "RSA-OAEP-256":
              n4 = "SHA-256";
              break;
            case "RS384":
            case "PS384":
            case "RSA-OAEP-384":
              n4 = "SHA-384";
              break;
            case "RS512":
            case "PS512":
            case "RSA-OAEP-512":
              n4 = "SHA-512";
              break;
            default:
              throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          }
          if (t3.startsWith("RSA-OAEP")) return e4.toCryptoKey({ name: "RSA-OAEP", hash: n4 }, r2, o2 ? ["encrypt"] : ["decrypt"]);
          i2 = e4.toCryptoKey({ name: t3.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: n4 }, r2, [o2 ? "verify" : "sign"]);
        }
        if ("ec" === e4.asymmetricKeyType) {
          var a2;
          const n4 = (/* @__PURE__ */ new Map([["prime256v1", "P-256"], ["secp384r1", "P-384"], ["secp521r1", "P-521"]])).get(null === (a2 = e4.asymmetricKeyDetails) || void 0 === a2 ? void 0 : a2.namedCurve);
          if (!n4) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          "ES256" === t3 && "P-256" === n4 && (i2 = e4.toCryptoKey({ name: "ECDSA", namedCurve: n4 }, r2, [o2 ? "verify" : "sign"])), "ES384" === t3 && "P-384" === n4 && (i2 = e4.toCryptoKey({ name: "ECDSA", namedCurve: n4 }, r2, [o2 ? "verify" : "sign"])), "ES512" === t3 && "P-521" === n4 && (i2 = e4.toCryptoKey({ name: "ECDSA", namedCurve: n4 }, r2, [o2 ? "verify" : "sign"])), t3.startsWith("ECDH-ES") && (i2 = e4.toCryptoKey({ name: "ECDH", namedCurve: n4 }, r2, o2 ? [] : ["deriveBits"]));
        }
        if (!i2) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
        return n3 ? n3[t3] = i2 : Lo.set(e4, { [t3]: i2 }), i2;
      })(e3, t2);
    } catch (e4) {
      if (e4 instanceof TypeError) throw e4;
    }
    let n2 = e3.export({ format: "jwk" });
    return Uo(e3, n2, t2);
  }
  if (Ko(e3)) return e3.k ? oo(e3.k) : Uo(e3, e3, t2, true);
  throw new Error("unreachable");
}
var Wo = (e3) => null == e3 ? void 0 : e3[Symbol.toStringTag];
var Ho = (e3, t2, n2) => {
  if (void 0 !== t2.use) {
    let e4;
    switch (n2) {
      case "sign":
      case "verify":
        e4 = "sig";
        break;
      case "encrypt":
      case "decrypt":
        e4 = "enc";
    }
    if (t2.use !== e4) throw new TypeError('Invalid key for this operation, its "use" must be "'.concat(e4, '" when present'));
  }
  if (void 0 !== t2.alg && t2.alg !== e3) throw new TypeError('Invalid key for this operation, its "alg" must be "'.concat(e3, '" when present'));
  if (Array.isArray(t2.key_ops)) {
    var o2, r2;
    let i2;
    switch (true) {
      case ("sign" === n2 || "verify" === n2):
      case "dir" === e3:
      case e3.includes("CBC-HS"):
        i2 = n2;
        break;
      case e3.startsWith("PBES2"):
        i2 = "deriveBits";
        break;
      case /^A\d{3}(?:GCM)?(?:KW)?$/.test(e3):
        i2 = !e3.includes("GCM") && e3.endsWith("KW") ? "encrypt" === n2 ? "wrapKey" : "unwrapKey" : n2;
        break;
      case ("encrypt" === n2 && e3.startsWith("RSA")):
        i2 = "wrapKey";
        break;
      case "decrypt" === n2:
        i2 = e3.startsWith("RSA") ? "unwrapKey" : "deriveBits";
    }
    if (i2 && false === (null === (o2 = t2.key_ops) || void 0 === o2 || null === (r2 = o2.includes) || void 0 === r2 ? void 0 : r2.call(o2, i2))) throw new TypeError('Invalid key for this operation, its "key_ops" must include "'.concat(i2, '" when present'));
  }
  return true;
};
function zo(e3, t2, n2) {
  switch (e3.substring(0, 2)) {
    case "A1":
    case "A2":
    case "di":
    case "HS":
    case "PB":
      ((e4, t3, n3) => {
        if (!(t3 instanceof Uint8Array)) {
          if (Ko(t3)) {
            if (((e5) => "oct" === e5.kty && "string" == typeof e5.k)(t3) && Ho(e4, t3, n3)) return;
            throw new TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
          }
          if (!Ao(t3)) throw new TypeError(ko(e4, t3, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
          if ("secret" !== t3.type) throw new TypeError("".concat(Wo(t3), ' instances for symmetric algorithms must be of type "secret"'));
        }
      })(e3, t2, n2);
      break;
    default:
      ((e4, t3, n3) => {
        if (Ko(t3)) switch (n3) {
          case "decrypt":
          case "sign":
            if (((e5) => "oct" !== e5.kty && ("AKP" === e5.kty && "string" == typeof e5.priv || "string" == typeof e5.d))(t3) && Ho(e4, t3, n3)) return;
            throw new TypeError("JSON Web Key for this operation must be a private JWK");
          case "encrypt":
          case "verify":
            if (((e5) => "oct" !== e5.kty && void 0 === e5.d && void 0 === e5.priv)(t3) && Ho(e4, t3, n3)) return;
            throw new TypeError("JSON Web Key for this operation must be a public JWK");
        }
        if (!Ao(t3)) throw new TypeError(ko(e4, t3, "CryptoKey", "KeyObject", "JSON Web Key"));
        if ("secret" === t3.type) throw new TypeError("".concat(Wo(t3), ' instances for asymmetric algorithms must not be of type "secret"'));
        if ("public" === t3.type) switch (n3) {
          case "sign":
            throw new TypeError("".concat(Wo(t3), ' instances for asymmetric algorithm signing must be of type "private"'));
          case "decrypt":
            throw new TypeError("".concat(Wo(t3), ' instances for asymmetric algorithm decryption must be of type "private"'));
        }
        if ("private" === t3.type) switch (n3) {
          case "verify":
            throw new TypeError("".concat(Wo(t3), ' instances for asymmetric algorithm verifying must be of type "public"'));
          case "encrypt":
            throw new TypeError("".concat(Wo(t3), ' instances for asymmetric algorithm encryption must be of type "public"'));
        }
      })(e3, t2, n2);
  }
}
var Jo;
var Mo;
var Vo;
var Go;
if ("undefined" == typeof navigator || null === (Jo = navigator.userAgent) || void 0 === Jo || null === (Mo = Jo.startsWith) || void 0 === Mo || !Mo.call(Jo, "Mozilla/5.0 ")) {
  const e3 = "v6.8.1";
  Go = "".concat("openid-client", "/").concat(e3), Vo = { "user-agent": Go };
}
var Fo = (e3) => Zo.get(e3);
var Zo;
var qo;
function Bo(e3) {
  return void 0 !== e3 ? Zt(e3) : (qo || (qo = /* @__PURE__ */ new WeakMap()), (e4, t2, n2, o2) => {
    let r2;
    return (r2 = qo.get(t2)) || (!function(e5, t3) {
      if ("string" != typeof e5) throw $o("".concat(t3, " must be a string"), Qo);
      if (0 === e5.length) throw $o("".concat(t3, " must not be empty"), Yo);
    }(t2.client_secret, '"metadata.client_secret"'), r2 = Zt(t2.client_secret), qo.set(t2, r2)), r2(e4, t2, n2, o2);
  });
}
var Xo = vt;
var Yo = "ERR_INVALID_ARG_VALUE";
var Qo = "ERR_INVALID_ARG_TYPE";
function $o(e3, t2, n2) {
  const o2 = new TypeError(e3, { cause: n2 });
  return Object.assign(o2, { code: t2 }), o2;
}
function er(e3) {
  return async function(e4) {
    return Nt(e4, "codeVerifier"), Pt(await crypto.subtle.digest("SHA-256", Et(e4)));
  }(e3);
}
function tr() {
  return Ht();
}
var nr = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), st(this, "code", void 0), this.name = this.constructor.name, this.code = null == t2 ? void 0 : t2.code, null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
function or(e3, t2, n2) {
  return new nr(e3, { cause: t2, code: n2 });
}
function rr(e3) {
  if (e3 instanceof TypeError || e3 instanceof nr || e3 instanceof $t || e3 instanceof en || e3 instanceof tn) throw e3;
  if (e3 instanceof It) switch (e3.code) {
    case Dn:
      throw or("only requests to HTTPS are allowed", e3, e3.code);
    case Kn:
      throw or("only requests to HTTP or HTTPS are allowed", e3, e3.code);
    case jn:
      throw or("unexpected HTTP response status code", e3.cause, e3.code);
    case Cn:
      throw or("unexpected response content-type", e3.cause, e3.code);
    case On:
      throw or("parsing error occured", e3, e3.code);
    case xn:
      throw or("invalid response encountered", e3, e3.code);
    case Un:
      throw or("unexpected JWT claim value encountered", e3, e3.code);
    case Nn:
      throw or("unexpected JSON attribute value encountered", e3, e3.code);
    case Ln:
      throw or("JWT timestamp claim value failed validation", e3, e3.code);
    default:
      throw or(e3.message, e3, e3.code);
  }
  if (e3 instanceof Rt) throw or("unsupported operation", e3, e3.code);
  if (e3 instanceof DOMException) switch (e3.name) {
    case "OperationError":
      throw or("runtime operation error", e3, Rn);
    case "NotSupportedError":
      throw or("runtime unsupported operation", e3, Rn);
    case "TimeoutError":
      throw or("operation timed out", e3, "OAUTH_TIMEOUT");
    case "AbortError":
      throw or("operation aborted", e3, "OAUTH_ABORT");
  }
  throw new nr("something went wrong", { cause: e3 });
}
async function ir(e3, t2, n2, o2, r2) {
  const i2 = await async function(e4, t3) {
    var n3, o3;
    if (!(e4 instanceof URL)) throw $o('"server" must be an instance of URL', Qo);
    const r3 = !e4.href.includes("/.well-known/"), i3 = null !== (n3 = null == t3 ? void 0 : t3.timeout) && void 0 !== n3 ? n3 : 30, a3 = AbortSignal.timeout(1e3 * i3), s3 = await (r3 ? Lt(e4, { algorithm: null == t3 ? void 0 : t3.algorithm, [vt]: null == t3 ? void 0 : t3[Xo], [yt]: null == t3 || null === (o3 = t3.execute) || void 0 === o3 ? void 0 : o3.includes(pr), signal: a3, headers: new Headers(Vo) }) : ((null == t3 ? void 0 : t3[Xo]) || fetch)((Xt(e4, null == t3 || null === (c2 = t3.execute) || void 0 === c2 || !c2.includes(pr)), e4.href), { headers: Object.fromEntries(new Headers(ut({ accept: "application/json" }, Vo)).entries()), body: void 0, method: "GET", redirect: "manual", signal: a3 })).then((e5) => async function(e6, t4) {
      const n4 = e6;
      if (!(n4 instanceof URL) && n4 !== Yn) throw mt('"expectedIssuerIdentifier" must be an instance of URL', "ERR_INVALID_ARG_TYPE");
      if (!ft(t4, Response)) throw mt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
      if (200 !== t4.status) throw Ot('"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)', jn, t4);
      zn(t4);
      const o4 = await Xn(t4);
      if (Nt(o4.issuer, '"response" body "issuer" property', xn, { body: o4 }), n4 !== Yn && new URL(o4.issuer).href !== n4.href) throw Ot('"response" body "issuer" property does not match the expected value', Nn, { expected: n4.href, body: o4, attribute: "issuer" });
      return o4;
    }(Yn, e5)).catch(rr);
    var c2;
    r3 && new URL(s3.issuer).href !== e4.href && (function(e5, t4, n4) {
      return !("https://login.microsoftonline.com" !== e5.origin || null != n4 && n4.algorithm && "oidc" !== n4.algorithm || (t4[ar] = true, 0));
    }(e4, s3, t3) || function(e5, t4) {
      return !(!e5.hostname.endsWith(".b2clogin.com") || null != t4 && t4.algorithm && "oidc" !== t4.algorithm);
    }(e4, t3) || (() => {
      throw new nr("discovered metadata issuer does not match the expected issuer", { code: Nn, cause: { expected: e4.href, body: s3, attribute: "issuer" } });
    })());
    return s3;
  }(e3, r2), a2 = new sr(i2, t2, n2, o2);
  let s2 = Fo(a2);
  if (null != r2 && r2[Xo] && (s2.fetch = r2[Xo]), null != r2 && r2.timeout && (s2.timeout = r2.timeout), null != r2 && r2.execute) for (const e4 of r2.execute) e4(a2);
  return a2;
}
new TextDecoder();
var ar = Symbol();
var sr = class {
  constructor(e3, t2, n2, o2) {
    var r2, i2, a2, s2, c2;
    if ("string" != typeof t2 || !t2.length) throw $o('"clientId" must be a non-empty string', Qo);
    if ("string" == typeof n2 && (n2 = { client_secret: n2 }), void 0 !== (null === (r2 = n2) || void 0 === r2 ? void 0 : r2.client_id) && t2 !== n2.client_id) throw $o('"clientId" and "metadata.client_id" must be the same', Yo);
    const u2 = ut(ut({}, structuredClone(n2)), {}, { client_id: t2 });
    let l2;
    u2[wt] = null !== (i2 = null === (a2 = n2) || void 0 === a2 ? void 0 : a2[wt]) && void 0 !== i2 ? i2 : 0, u2[gt] = null !== (s2 = null === (c2 = n2) || void 0 === c2 ? void 0 : c2[gt]) && void 0 !== s2 ? s2 : 30, l2 = o2 || ("string" == typeof u2.client_secret && u2.client_secret.length ? Bo(u2.client_secret) : (e4, t3, n3, o3) => {
      n3.set("client_id", t3.client_id);
    });
    let d2 = Object.freeze(u2);
    const h2 = structuredClone(e3);
    ar in e3 && (h2[Qn] = (t3) => {
      let { claims: { tid: n3 } } = t3;
      return e3.issuer.replace("{tenantid}", n3);
    });
    let p2 = Object.freeze(h2);
    Zo || (Zo = /* @__PURE__ */ new WeakMap()), Zo.set(this, { __proto__: null, as: p2, c: d2, auth: l2, tlsOnly: true, jwksCache: {} });
  }
  serverMetadata() {
    const e3 = structuredClone(Fo(this).as);
    return function(e4) {
      Object.defineProperties(e4, /* @__PURE__ */ function(e5) {
        return { supportsPKCE: { __proto__: null, value() {
          var t2;
          let n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "S256";
          return true === (null === (t2 = e5.code_challenge_methods_supported) || void 0 === t2 ? void 0 : t2.includes(n2));
        } } };
      }(e4));
    }(e3), e3;
  }
  clientMetadata() {
    return structuredClone(Fo(this).c);
  }
  get timeout() {
    return Fo(this).timeout;
  }
  set timeout(e3) {
    Fo(this).timeout = e3;
  }
  get [Xo]() {
    return Fo(this).fetch;
  }
  set [Xo](e3) {
    Fo(this).fetch = e3;
  }
};
function cr(e3) {
  Object.defineProperties(e3, function(e4) {
    let t2;
    if (void 0 !== e4.expires_in) {
      const n2 = /* @__PURE__ */ new Date();
      n2.setSeconds(n2.getSeconds() + e4.expires_in), t2 = n2.getTime();
    }
    return { expiresIn: { __proto__: null, value() {
      if (t2) {
        const e5 = Date.now();
        return t2 > e5 ? Math.floor((t2 - e5) / 1e3) : 0;
      }
    } }, claims: { __proto__: null, value() {
      try {
        return mn(this);
      } catch (e5) {
        return;
      }
    } } };
  }(e3));
}
async function ur(e3, t2, n2) {
  var o2;
  let r2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
  const i2 = null === (o2 = e3.headers.get("retry-after")) || void 0 === o2 ? void 0 : o2.trim();
  if (void 0 === i2) return;
  let a2;
  if (/^\d+$/.test(i2)) a2 = parseInt(i2, 10);
  else {
    const e4 = new Date(i2);
    if (Number.isFinite(e4.getTime())) {
      const t3 = /* @__PURE__ */ new Date(), n3 = e4.getTime() - t3.getTime();
      n3 > 0 && (a2 = Math.ceil(n3 / 1e3));
    }
  }
  if (r2 && !Number.isFinite(a2)) throw new It("invalid Retry-After header value", { cause: e3 });
  a2 > t2 && await lr(a2 - t2, n2);
}
function lr(e3, t2) {
  return new Promise((n2, o2) => {
    const r2 = (e4) => {
      try {
        t2.throwIfAborted();
      } catch (e5) {
        return void o2(e5);
      }
      if (e4 <= 0) return void n2();
      const i2 = Math.min(e4, 5);
      setTimeout(() => r2(e4 - i2), 1e3 * i2);
    };
    r2(e3);
  });
}
async function dr(e3, t2) {
  vr(e3);
  const { as: n2, c: o2, auth: r2, fetch: i2, tlsOnly: a2, timeout: s2 } = Fo(e3);
  return async function(e4, t3, n3, o3, r3) {
    Gt(e4), Ft(t3);
    const i3 = Qt(e4, "backchannel_authentication_endpoint", t3.use_mtls_endpoint_aliases, true !== (null == r3 ? void 0 : r3[yt])), a3 = new URLSearchParams(o3);
    a3.set("client_id", t3.client_id);
    const s3 = jt(null == r3 ? void 0 : r3.headers);
    return s3.set("accept", "application/json"), dn(e4, t3, n3, i3, a3, s3, r3);
  }(n2, o2, r2, t2, { [vt]: i2, [yt]: !a2, headers: new Headers(Vo), signal: br(s2) }).then((e4) => async function(e5, t3, n3) {
    if (Gt(e5), Ft(t3), !ft(n3, Response)) throw mt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
    await cn(n3, 200, "Backchannel Authentication Endpoint"), zn(n3);
    const o3 = await Xn(n3);
    Nt(o3.auth_req_id, '"response" body "auth_req_id" property', xn, { body: o3 });
    let r3 = "number" != typeof o3.expires_in ? parseFloat(o3.expires_in) : o3.expires_in;
    return Ut(r3, true, '"response" body "expires_in" property', xn, { body: o3 }), o3.expires_in = r3, void 0 !== o3.interval && Ut(o3.interval, false, '"response" body "interval" property', xn, { body: o3 }), o3;
  }(n2, o2, e4)).catch(rr);
}
async function hr(e3, t2, n2, o2) {
  var r2, i2;
  vr(e3), n2 = new URLSearchParams(n2);
  let a2 = null !== (r2 = t2.interval) && void 0 !== r2 ? r2 : 5;
  const s2 = null !== (i2 = null == o2 ? void 0 : o2.signal) && void 0 !== i2 ? i2 : AbortSignal.timeout(1e3 * t2.expires_in);
  try {
    await lr(a2, s2);
  } catch (e4) {
    rr(e4);
  }
  const { as: c2, c: u2, auth: l2, fetch: d2, tlsOnly: h2, nonRepudiation: p2, timeout: f2, decrypt: m2 } = Fo(e3), y2 = (r3, i3) => hr(e3, ut(ut({}, t2), {}, { interval: r3 }), n2, ut(ut({}, o2), {}, { signal: s2, flag: i3 })), w2 = await async function(e4, t3, n3, o3, r3) {
    Gt(e4), Ft(t3), Nt(o3, '"authReqId"');
    const i3 = new URLSearchParams(null == r3 ? void 0 : r3.additionalParameters);
    return i3.set("auth_req_id", o3), hn(e4, t3, n3, "urn:openid:params:grant-type:ciba", i3, r3);
  }(c2, u2, l2, t2.auth_req_id, { [vt]: d2, [yt]: !h2, additionalParameters: n2, DPoP: null == o2 ? void 0 : o2.DPoP, headers: new Headers(Vo), signal: s2.aborted ? s2 : br(f2) }).catch(rr);
  var g2;
  if (503 === w2.status && w2.headers.has("retry-after")) return await ur(w2, a2, s2, true), await (null === (g2 = w2.body) || void 0 === g2 ? void 0 : g2.cancel()), y2(a2);
  const v2 = async function(e4, t3, n3, o3) {
    return yn(e4, t3, n3, void 0, null == o3 ? void 0 : o3[_t], null == o3 ? void 0 : o3.recognizedTokenTypes);
  }(c2, u2, w2, { [_t]: m2 });
  let b2;
  try {
    b2 = await v2;
  } catch (e4) {
    if (_r(e4, o2)) return y2(a2, kr);
    if (e4 instanceof $t) switch (e4.error) {
      case "slow_down":
        a2 += 5;
      case "authorization_pending":
        return await ur(e4.response, a2, s2), y2(a2);
    }
    rr(e4);
  }
  return b2.id_token && await (null == p2 ? void 0 : p2(w2)), cr(b2), b2;
}
function pr(e3) {
  Fo(e3).tlsOnly = false;
}
async function fr(e3, t2, n2, o2, r2) {
  if (vr(e3), !((null == r2 ? void 0 : r2.flag) === kr || t2 instanceof URL || function(e4, t3) {
    try {
      return Object.getPrototypeOf(e4)[Symbol.toStringTag] === t3;
    } catch (e5) {
      return false;
    }
  }(t2, "Request"))) throw $o('"currentUrl" must be an instance of URL, or Request', Qo);
  let i2, a2;
  const { as: s2, c: c2, auth: u2, fetch: l2, tlsOnly: d2, jarm: h2, hybrid: p2, nonRepudiation: f2, timeout: m2, decrypt: y2, implicit: w2 } = Fo(e3);
  if ((null == r2 ? void 0 : r2.flag) === kr) i2 = r2.authResponse, a2 = r2.redirectUri;
  else {
    if (!(t2 instanceof URL)) {
      const e4 = t2;
      switch (t2 = new URL(t2.url), e4.method) {
        case "GET":
          break;
        case "POST":
          const n3 = new URLSearchParams(await Vn(e4));
          if (p2) t2.hash = n3.toString();
          else for (const [e5, o3] of n3.entries()) t2.searchParams.append(e5, o3);
          break;
        default:
          throw $o("unexpected Request HTTP method", Yo);
      }
    }
    switch (a2 = function(e4) {
      return (e4 = new URL(e4)).search = "", e4.hash = "", e4.href;
    }(t2), true) {
      case !!h2:
        i2 = await h2(t2, null == n2 ? void 0 : n2.expectedState);
        break;
      case !!p2:
        i2 = await p2(t2, null == n2 ? void 0 : n2.expectedNonce, null == n2 ? void 0 : n2.expectedState, null == n2 ? void 0 : n2.maxAge);
        break;
      case !!w2:
        throw new TypeError("authorizationCodeGrant() cannot be used by response_type=id_token clients");
      default:
        try {
          i2 = Bn(s2, c2, t2.searchParams, null == n2 ? void 0 : n2.expectedState);
        } catch (e4) {
          rr(e4);
        }
    }
  }
  const g2 = await async function(e4, t3, n3, o3, r3, i3, a3) {
    if (Gt(e4), Ft(t3), !vn.has(o3)) throw mt('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()', "ERR_INVALID_ARG_VALUE");
    Nt(r3, '"redirectUri"');
    const s3 = Fn(o3, "code");
    if (!s3) throw Ot('no authorization code in "callbackParameters"', xn);
    const c3 = new URLSearchParams(null == a3 ? void 0 : a3.additionalParameters);
    return c3.set("redirect_uri", r3), c3.set("code", s3), i3 !== bn && (Nt(i3, '"codeVerifier"'), c3.set("code_verifier", i3)), hn(e4, t3, n3, "authorization_code", c3, a3);
  }(s2, c2, u2, i2, a2, (null == n2 ? void 0 : n2.pkceCodeVerifier) || bn, { additionalParameters: o2, [vt]: l2, [yt]: !d2, DPoP: null == r2 ? void 0 : r2.DPoP, headers: new Headers(Vo), signal: br(m2) }).catch(rr);
  "string" != typeof (null == n2 ? void 0 : n2.expectedNonce) && "number" != typeof (null == n2 ? void 0 : n2.maxAge) || (n2.idTokenExpected = true);
  const v2 = An(s2, c2, g2, { expectedNonce: null == n2 ? void 0 : n2.expectedNonce, maxAge: null == n2 ? void 0 : n2.maxAge, requireIdToken: null == n2 ? void 0 : n2.idTokenExpected, [_t]: y2 });
  let b2;
  try {
    b2 = await v2;
  } catch (t3) {
    if (_r(t3, r2)) return fr(e3, void 0, n2, o2, ut(ut({}, r2), {}, { flag: kr, authResponse: i2, redirectUri: a2 }));
    rr(t3);
  }
  return b2.id_token && await (null == f2 ? void 0 : f2(g2)), cr(b2), b2;
}
async function mr(e3, t2, n2, o2) {
  vr(e3), n2 = new URLSearchParams(n2);
  const { as: r2, c: i2, auth: a2, fetch: s2, tlsOnly: c2, nonRepudiation: u2, timeout: l2, decrypt: d2 } = Fo(e3), h2 = await async function(e4, t3, n3, o3, r3) {
    Gt(e4), Ft(t3), Nt(o3, '"refreshToken"');
    const i3 = new URLSearchParams(null == r3 ? void 0 : r3.additionalParameters);
    return i3.set("refresh_token", o3), hn(e4, t3, n3, "refresh_token", i3, r3);
  }(r2, i2, a2, t2, { [vt]: s2, [yt]: !c2, additionalParameters: n2, DPoP: null == o2 ? void 0 : o2.DPoP, headers: new Headers(Vo), signal: br(l2) }).catch(rr), p2 = async function(e4, t3, n3, o3) {
    return yn(e4, t3, n3, void 0, null == o3 ? void 0 : o3[_t], null == o3 ? void 0 : o3.recognizedTokenTypes);
  }(r2, i2, h2, { [_t]: d2 });
  let f2;
  try {
    f2 = await p2;
  } catch (r3) {
    if (_r(r3, o2)) return mr(e3, t2, n2, ut(ut({}, o2), {}, { flag: kr }));
    rr(r3);
  }
  return f2.id_token && await (null == u2 ? void 0 : u2(h2)), cr(f2), f2;
}
async function yr(e3, t2, n2) {
  vr(e3), t2 = new URLSearchParams(t2);
  const { as: o2, c: r2, auth: i2, fetch: a2, tlsOnly: s2, timeout: c2 } = Fo(e3), u2 = await async function(e4, t3, n3, o3, r3) {
    return Gt(e4), Ft(t3), hn(e4, t3, n3, "client_credentials", new URLSearchParams(o3), r3);
  }(o2, r2, i2, t2, { [vt]: a2, [yt]: !s2, DPoP: null == n2 ? void 0 : n2.DPoP, headers: new Headers(Vo), signal: br(c2) }).catch(rr), l2 = async function(e4, t3, n3, o3) {
    return yn(e4, t3, n3, void 0, null == o3 ? void 0 : o3[_t], null == o3 ? void 0 : o3.recognizedTokenTypes);
  }(o2, r2, u2);
  let d2;
  try {
    d2 = await l2;
  } catch (o3) {
    if (_r(o3, n2)) return yr(e3, t2, ut(ut({}, n2), {}, { flag: kr }));
    rr(o3);
  }
  return cr(d2), d2;
}
function wr(e3, t2) {
  vr(e3);
  const { as: n2, c: o2, tlsOnly: r2, hybrid: i2, jarm: a2, implicit: s2 } = Fo(e3), c2 = Qt(n2, "authorization_endpoint", false, r2);
  if ((t2 = new URLSearchParams(t2)).has("client_id") || t2.set("client_id", o2.client_id), !t2.has("request_uri") && !t2.has("request")) {
    if (t2.has("response_type") || t2.set("response_type", i2 ? "code id_token" : s2 ? "id_token" : "code"), s2 && !t2.has("nonce")) throw $o("response_type=id_token clients must provide a nonce parameter in their authorization request parameters", Yo);
    a2 && t2.set("response_mode", "jwt");
  }
  for (const [e4, n3] of t2.entries()) c2.searchParams.append(e4, n3);
  return c2;
}
async function gr(e3, t2, n2) {
  vr(e3);
  const o2 = wr(e3, t2), { as: r2, c: i2, auth: a2, fetch: s2, tlsOnly: c2, timeout: u2 } = Fo(e3), l2 = await async function(e4, t3, n3, o3, r3) {
    var i3;
    Gt(e4), Ft(t3);
    const a3 = Qt(e4, "pushed_authorization_request_endpoint", t3.use_mtls_endpoint_aliases, true !== (null == r3 ? void 0 : r3[yt])), s3 = new URLSearchParams(o3);
    s3.set("client_id", t3.client_id);
    const c3 = jt(null == r3 ? void 0 : r3.headers);
    c3.set("accept", "application/json"), void 0 !== (null == r3 ? void 0 : r3.DPoP) && (un(r3.DPoP), await r3.DPoP.addProof(a3, c3, "POST"));
    const u3 = await dn(e4, t3, n3, a3, s3, c3, r3);
    return null == r3 || null === (i3 = r3.DPoP) || void 0 === i3 || i3.cacheNonce(u3, a3), u3;
  }(r2, i2, a2, o2.searchParams, { [vt]: s2, [yt]: !c2, DPoP: null == n2 ? void 0 : n2.DPoP, headers: new Headers(Vo), signal: br(u2) }).catch(rr), d2 = async function(e4, t3, n3) {
    if (Gt(e4), Ft(t3), !ft(n3, Response)) throw mt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
    await cn(n3, 201, "Pushed Authorization Request Endpoint"), zn(n3);
    const o3 = await Xn(n3);
    Nt(o3.request_uri, '"response" body "request_uri" property', xn, { body: o3 });
    let r3 = "number" != typeof o3.expires_in ? parseFloat(o3.expires_in) : o3.expires_in;
    return Ut(r3, true, '"response" body "expires_in" property', xn, { body: o3 }), o3.expires_in = r3, o3;
  }(r2, i2, l2);
  let h2;
  try {
    h2 = await d2;
  } catch (o3) {
    if (_r(o3, n2)) return gr(e3, t2, ut(ut({}, n2), {}, { flag: kr }));
    rr(o3);
  }
  return wr(e3, { request_uri: h2.request_uri });
}
function vr(e3) {
  if (!(e3 instanceof sr)) throw $o('"config" must be an instance of Configuration', Qo);
  if (Object.getPrototypeOf(e3) !== sr.prototype) throw $o("subclassing Configuration is not allowed", Yo);
}
function br(e3) {
  return e3 ? AbortSignal.timeout(1e3 * e3) : void 0;
}
function _r(e3, t2) {
  return !(null == t2 || !t2.DPoP || t2.flag === kr) && function(e4) {
    if (e4 instanceof tn) {
      const { 0: t3, length: n2 } = e4.cause;
      return 1 === n2 && "dpop" === t3.scheme && "use_dpop_nonce" === t3.parameters.error;
    }
    return e4 instanceof $t && "use_dpop_nonce" === e4.error;
  }(e3);
}
Object.freeze(sr.prototype);
var kr = Symbol();
async function Sr(e3, t2, n2, o2) {
  vr(e3);
  const { as: r2, c: i2, auth: a2, fetch: s2, tlsOnly: c2, timeout: u2, decrypt: l2 } = Fo(e3), d2 = await async function(e4, t3, n3, o3, r3, i3) {
    return Gt(e4), Ft(t3), Nt(o3, '"grantType"'), hn(e4, t3, n3, o3, new URLSearchParams(r3), i3);
  }(r2, i2, a2, t2, new URLSearchParams(n2), { [vt]: s2, [yt]: !c2, DPoP: null == o2 ? void 0 : o2.DPoP, headers: new Headers(Vo), signal: br(u2) }).then((e4) => {
    let n3;
    return "urn:ietf:params:oauth:grant-type:token-exchange" === t2 && (n3 = { n_a: () => {
    } }), async function(e5, t3, n4, o3) {
      return yn(e5, t3, n4, void 0, null == o3 ? void 0 : o3[_t], null == o3 ? void 0 : o3.recognizedTokenTypes);
    }(r2, i2, e4, { [_t]: l2, recognizedTokenTypes: n3 });
  }).catch(rr);
  return cr(d2), d2;
}
async function Er(e3, t2, n2) {
  if (t2 instanceof Uint8Array) {
    if (!e3.startsWith("HS")) throw new TypeError(function(e4) {
      for (var t3 = arguments.length, n3 = new Array(t3 > 1 ? t3 - 1 : 0), o2 = 1; o2 < t3; o2++) n3[o2 - 1] = arguments[o2];
      return _o("Key must be ", e4, ...n3);
    }(t2, "CryptoKey", "KeyObject", "JSON Web Key"));
    return crypto.subtle.importKey("raw", t2, { hash: "SHA-".concat(e3.slice(-3)), name: "HMAC" }, false, [n2]);
  }
  return bo(t2, e3, n2), t2;
}
async function Ar(e3, t2, n2, o2) {
  const r2 = await Er(e3, t2, "verify");
  !function(e4, t3) {
    if (e4.startsWith("RS") || e4.startsWith("PS")) {
      const { modulusLength: n3 } = t3.algorithm;
      if ("number" != typeof n3 || n3 < 2048) throw new TypeError("".concat(e4, " requires key modulusLength to be 2048 bits or larger"));
    }
  }(e3, r2);
  const i2 = function(e4, t3) {
    const n3 = "SHA-".concat(e4.slice(-3));
    switch (e4) {
      case "HS256":
      case "HS384":
      case "HS512":
        return { hash: n3, name: "HMAC" };
      case "PS256":
      case "PS384":
      case "PS512":
        return { hash: n3, name: "RSA-PSS", saltLength: parseInt(e4.slice(-3), 10) >> 3 };
      case "RS256":
      case "RS384":
      case "RS512":
        return { hash: n3, name: "RSASSA-PKCS1-v1_5" };
      case "ES256":
      case "ES384":
      case "ES512":
        return { hash: n3, name: "ECDSA", namedCurve: t3.namedCurve };
      case "Ed25519":
      case "EdDSA":
        return { name: "Ed25519" };
      case "ML-DSA-44":
      case "ML-DSA-65":
      case "ML-DSA-87":
        return { name: e4 };
      default:
        throw new co("alg ".concat(e4, " is not supported either by JOSE or your javascript runtime"));
    }
  }(e3, r2.algorithm);
  try {
    return await crypto.subtle.verify(i2, r2, n2, o2);
  } catch (e4) {
    return false;
  }
}
async function Tr(e3, t2, n2) {
  if (!To(e3)) throw new uo("Flattened JWS must be an object");
  if (void 0 === e3.protected && void 0 === e3.header) throw new uo('Flattened JWS must have either of the "protected" or "header" members');
  if (void 0 !== e3.protected && "string" != typeof e3.protected) throw new uo("JWS Protected Header incorrect type");
  if (void 0 === e3.payload) throw new uo("JWS Payload missing");
  if ("string" != typeof e3.signature) throw new uo("JWS Signature missing or incorrect type");
  if (void 0 !== e3.header && !To(e3.header)) throw new uo("JWS Unprotected Header incorrect type");
  let o2 = {};
  if (e3.protected) try {
    const t3 = oo(e3.protected);
    o2 = JSON.parse(eo.decode(t3));
  } catch (e4) {
    throw new uo("JWS Protected Header is invalid");
  }
  if (!function() {
    for (var e4 = arguments.length, t3 = new Array(e4), n3 = 0; n3 < e4; n3++) t3[n3] = arguments[n3];
    const o3 = t3.filter(Boolean);
    if (0 === o3.length || 1 === o3.length) return true;
    let r3;
    for (const e5 of o3) {
      const t4 = Object.keys(e5);
      if (r3 && 0 !== r3.size) for (const e6 of t4) {
        if (r3.has(e6)) return false;
        r3.add(e6);
      }
      else r3 = new Set(t4);
    }
    return true;
  }(o2, e3.header)) throw new uo("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  const r2 = ut(ut({}, o2), e3.header), i2 = function(e4, t3, n3, o3, r3) {
    if (void 0 !== r3.crit && void 0 === (null == o3 ? void 0 : o3.crit)) throw new e4('"crit" (Critical) Header Parameter MUST be integrity protected');
    if (!o3 || void 0 === o3.crit) return /* @__PURE__ */ new Set();
    if (!Array.isArray(o3.crit) || 0 === o3.crit.length || o3.crit.some((e5) => "string" != typeof e5 || 0 === e5.length)) throw new e4('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    let i3;
    i3 = void 0 !== n3 ? new Map([...Object.entries(n3), ...t3.entries()]) : t3;
    for (const t4 of o3.crit) {
      if (!i3.has(t4)) throw new co('Extension Header Parameter "'.concat(t4, '" is not recognized'));
      if (void 0 === r3[t4]) throw new e4('Extension Header Parameter "'.concat(t4, '" is missing'));
      if (i3.get(t4) && void 0 === o3[t4]) throw new e4('Extension Header Parameter "'.concat(t4, '" MUST be integrity protected'));
    }
    return new Set(o3.crit);
  }(uo, /* @__PURE__ */ new Map([["b64", true]]), null == n2 ? void 0 : n2.crit, o2, r2);
  let a2 = true;
  if (i2.has("b64") && (a2 = o2.b64, "boolean" != typeof a2)) throw new uo('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
  const { alg: s2 } = r2;
  if ("string" != typeof s2 || !s2) throw new uo('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  const c2 = n2 && function(e4, t3) {
    if (void 0 !== t3 && (!Array.isArray(t3) || t3.some((e5) => "string" != typeof e5))) throw new TypeError('"'.concat(e4, '" option must be an array of strings'));
    if (t3) return new Set(t3);
  }("algorithms", n2.algorithms);
  if (c2 && !c2.has(s2)) throw new so('"alg" (Algorithm) Header Parameter value not allowed');
  if (a2) {
    if ("string" != typeof e3.payload) throw new uo("JWS Payload must be a string");
  } else if ("string" != typeof e3.payload && !(e3.payload instanceof Uint8Array)) throw new uo("JWS Payload must be a string or an Uint8Array instance");
  let u2 = false;
  "function" == typeof t2 && (t2 = await t2(o2, e3), u2 = true), zo(s2, t2, "verify");
  const l2 = function() {
    for (var e4 = arguments.length, t3 = new Array(e4), n3 = 0; n3 < e4; n3++) t3[n3] = arguments[n3];
    const o3 = t3.reduce((e5, t4) => {
      let { length: n4 } = t4;
      return e5 + n4;
    }, 0), r3 = new Uint8Array(o3);
    let i3 = 0;
    for (const e5 of t3) r3.set(e5, i3), i3 += e5.length;
    return r3;
  }(void 0 !== e3.protected ? to(e3.protected) : new Uint8Array(), to("."), "string" == typeof e3.payload ? a2 ? to(e3.payload) : $n.encode(e3.payload) : e3.payload);
  let d2;
  try {
    d2 = oo(e3.signature);
  } catch (e4) {
    throw new uo("Failed to base64url decode the signature");
  }
  const h2 = await No(t2, s2);
  if (!await Ar(s2, h2, d2, l2)) throw new yo();
  let p2;
  if (a2) try {
    p2 = oo(e3.payload);
  } catch (e4) {
    throw new uo("Failed to base64url decode the payload");
  }
  else p2 = "string" == typeof e3.payload ? $n.encode(e3.payload) : e3.payload;
  const f2 = { payload: p2 };
  return void 0 !== e3.protected && (f2.protectedHeader = o2), void 0 !== e3.header && (f2.unprotectedHeader = e3.header), u2 ? ut(ut({}, f2), {}, { key: h2 }) : f2;
}
var Pr = (e3) => Math.floor(e3.getTime() / 1e3);
var Rr = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
function Ir(e3) {
  const t2 = Rr.exec(e3);
  if (!t2 || t2[4] && t2[1]) throw new TypeError("Invalid time period format");
  const n2 = parseFloat(t2[2]);
  let o2;
  switch (t2[3].toLowerCase()) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      o2 = Math.round(n2);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      o2 = Math.round(60 * n2);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      o2 = Math.round(3600 * n2);
      break;
    case "day":
    case "days":
    case "d":
      o2 = Math.round(86400 * n2);
      break;
    case "week":
    case "weeks":
    case "w":
      o2 = Math.round(604800 * n2);
      break;
    default:
      o2 = Math.round(31557600 * n2);
  }
  return "-" === t2[1] || "ago" === t2[4] ? -o2 : o2;
}
var Or = (e3) => e3.includes("/") ? e3.toLowerCase() : "application/".concat(e3.toLowerCase());
var xr = (e3, t2) => "string" == typeof e3 ? t2.includes(e3) : !!Array.isArray(e3) && t2.some(Set.prototype.has.bind(new Set(e3)));
async function Cr(e3, t2, n2) {
  var o2;
  const r2 = await async function(e4, t3, n3) {
    if (e4 instanceof Uint8Array && (e4 = eo.decode(e4)), "string" != typeof e4) throw new uo("Compact JWS must be a string or Uint8Array");
    const { 0: o3, 1: r3, 2: i3, length: a3 } = e4.split(".");
    if (3 !== a3) throw new uo("Invalid Compact JWS");
    const s2 = await Tr({ payload: r3, protected: o3, signature: i3 }, t3, n3), c2 = { payload: s2.payload, protectedHeader: s2.protectedHeader };
    return "function" == typeof t3 ? ut(ut({}, c2), {}, { key: s2.key }) : c2;
  }(e3, t2, n2);
  if (null !== (o2 = r2.protectedHeader.crit) && void 0 !== o2 && o2.includes("b64") && false === r2.protectedHeader.b64) throw new lo("JWTs MUST NOT use unencoded payload");
  const i2 = function(e4, t3) {
    let n3, o3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    try {
      n3 = JSON.parse(eo.decode(t3));
    } catch (e5) {
    }
    if (!To(n3)) throw new lo("JWT Claims Set must be a top-level JSON object");
    const { typ: r3 } = o3;
    if (r3 && ("string" != typeof e4.typ || Or(e4.typ) !== Or(r3))) throw new io('unexpected "typ" JWT header value', n3, "typ", "check_failed");
    const { requiredClaims: i3 = [], issuer: a3, subject: s2, audience: c2, maxTokenAge: u2 } = o3, l2 = [...i3];
    void 0 !== u2 && l2.push("iat"), void 0 !== c2 && l2.push("aud"), void 0 !== s2 && l2.push("sub"), void 0 !== a3 && l2.push("iss");
    for (const e5 of new Set(l2.reverse())) if (!(e5 in n3)) throw new io('missing required "'.concat(e5, '" claim'), n3, e5, "missing");
    if (a3 && !(Array.isArray(a3) ? a3 : [a3]).includes(n3.iss)) throw new io('unexpected "iss" claim value', n3, "iss", "check_failed");
    if (s2 && n3.sub !== s2) throw new io('unexpected "sub" claim value', n3, "sub", "check_failed");
    if (c2 && !xr(n3.aud, "string" == typeof c2 ? [c2] : c2)) throw new io('unexpected "aud" claim value', n3, "aud", "check_failed");
    let d2;
    switch (typeof o3.clockTolerance) {
      case "string":
        d2 = Ir(o3.clockTolerance);
        break;
      case "number":
        d2 = o3.clockTolerance;
        break;
      case "undefined":
        d2 = 0;
        break;
      default:
        throw new TypeError("Invalid clockTolerance option type");
    }
    const { currentDate: h2 } = o3, p2 = Pr(h2 || /* @__PURE__ */ new Date());
    if ((void 0 !== n3.iat || u2) && "number" != typeof n3.iat) throw new io('"iat" claim must be a number', n3, "iat", "invalid");
    if (void 0 !== n3.nbf) {
      if ("number" != typeof n3.nbf) throw new io('"nbf" claim must be a number', n3, "nbf", "invalid");
      if (n3.nbf > p2 + d2) throw new io('"nbf" claim timestamp check failed', n3, "nbf", "check_failed");
    }
    if (void 0 !== n3.exp) {
      if ("number" != typeof n3.exp) throw new io('"exp" claim must be a number', n3, "exp", "invalid");
      if (n3.exp <= p2 - d2) throw new ao('"exp" claim timestamp check failed', n3, "exp", "check_failed");
    }
    if (u2) {
      const e5 = p2 - n3.iat;
      if (e5 - d2 > ("number" == typeof u2 ? u2 : Ir(u2))) throw new ao('"iat" claim timestamp check failed (too far in the past)', n3, "iat", "check_failed");
      if (e5 < 0 - d2) throw new io('"iat" claim timestamp check failed (it should be in the past)', n3, "iat", "check_failed");
    }
    return n3;
  }(r2.protectedHeader, r2.payload, n2), a2 = { payload: i2, protectedHeader: r2.protectedHeader };
  return "function" == typeof t2 ? ut(ut({}, a2), {}, { key: r2.key }) : a2;
}
function jr(e3) {
  return To(e3);
}
var Dr;
var Kr;
var Lr = /* @__PURE__ */ new WeakMap();
var Ur = /* @__PURE__ */ new WeakMap();
var Nr = class {
  constructor(e3) {
    if (it(this, Lr, void 0), it(this, Ur, /* @__PURE__ */ new WeakMap()), !function(e4) {
      return e4 && "object" == typeof e4 && Array.isArray(e4.keys) && e4.keys.every(jr);
    }(e3)) throw new ho("JSON Web Key Set malformed");
    at(Lr, this, structuredClone(e3));
  }
  jwks() {
    return rt(Lr, this);
  }
  async getKey(e3, t2) {
    const { alg: n2, kid: o2 } = ut(ut({}, e3), null == t2 ? void 0 : t2.header), r2 = function(e4) {
      switch ("string" == typeof e4 && e4.slice(0, 2)) {
        case "RS":
        case "PS":
          return "RSA";
        case "ES":
          return "EC";
        case "Ed":
          return "OKP";
        case "ML":
          return "AKP";
        default:
          throw new co('Unsupported "alg" value for a JSON Web Key Set');
      }
    }(n2), i2 = rt(Lr, this).keys.filter((e4) => {
      let t3 = r2 === e4.kty;
      if (t3 && "string" == typeof o2 && (t3 = o2 === e4.kid), !t3 || "string" != typeof e4.alg && "AKP" !== r2 || (t3 = n2 === e4.alg), t3 && "string" == typeof e4.use && (t3 = "sig" === e4.use), t3 && Array.isArray(e4.key_ops) && (t3 = e4.key_ops.includes("verify")), t3) switch (n2) {
        case "ES256":
          t3 = "P-256" === e4.crv;
          break;
        case "ES384":
          t3 = "P-384" === e4.crv;
          break;
        case "ES512":
          t3 = "P-521" === e4.crv;
          break;
        case "Ed25519":
        case "EdDSA":
          t3 = "Ed25519" === e4.crv;
      }
      return t3;
    }), { 0: a2, length: s2 } = i2;
    if (0 === s2) throw new po();
    if (1 !== s2) {
      const e4 = new fo(), t3 = rt(Ur, this);
      throw e4[Symbol.asyncIterator] = dt(function* () {
        for (const e5 of i2) try {
          yield yield nt(Wr(t3, e5, n2));
        } catch (e6) {
        }
      }), e4;
    }
    return Wr(rt(Ur, this), a2, n2);
  }
};
async function Wr(e3, t2, n2) {
  const o2 = e3.get(t2) || e3.set(t2, {}).get(t2);
  if (void 0 === o2[n2]) {
    const e4 = await async function(e5, t3, n3) {
      var o3;
      if (!To(e5)) throw new TypeError("JWK must be an object");
      let r2;
      switch (null != t3 || (t3 = e5.alg), null != r2 || (r2 = null !== (o3 = null == n3 ? void 0 : n3.extractable) && void 0 !== o3 ? o3 : e5.ext), e5.kty) {
        case "oct":
          if ("string" != typeof e5.k || !e5.k) throw new TypeError('missing "k" (Key Value) Parameter value');
          return oo(e5.k);
        case "RSA":
          if ("oth" in e5 && void 0 !== e5.oth) throw new co('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
          return Do(ut(ut({}, e5), {}, { alg: t3, ext: r2 }));
        case "AKP":
          if ("string" != typeof e5.alg || !e5.alg) throw new TypeError('missing "alg" (Algorithm) Parameter value');
          if (void 0 !== t3 && t3 !== e5.alg) throw new TypeError("JWK alg and alg option value mismatch");
          return Do(ut(ut({}, e5), {}, { ext: r2 }));
        case "EC":
        case "OKP":
          return Do(ut(ut({}, e5), {}, { alg: t3, ext: r2 }));
        default:
          throw new co('Unsupported "kty" (Key Type) Parameter value');
      }
    }(ut(ut({}, t2), {}, { ext: true }), n2);
    if (e4 instanceof Uint8Array || "public" !== e4.type) throw new ho("JSON Web Key Set members must be public keys");
    o2[n2] = e4;
  }
  return o2[n2];
}
function Hr(e3) {
  const t2 = new Nr(e3), n2 = async (e4, n3) => t2.getKey(e4, n3);
  return Object.defineProperties(n2, { jwks: { value: () => structuredClone(t2.jwks()), enumerable: false, configurable: false, writable: false } }), n2;
}
var zr;
if ("undefined" == typeof navigator || null === (Dr = navigator.userAgent) || void 0 === Dr || null === (Kr = Dr.startsWith) || void 0 === Kr || !Kr.call(Dr, "Mozilla/5.0 ")) {
  const e3 = "v6.1.3";
  zr = "".concat("jose", "/").concat(e3);
}
var Jr = Symbol();
var Mr = Symbol();
var Vr = /* @__PURE__ */ new WeakMap();
var Gr = /* @__PURE__ */ new WeakMap();
var Fr = /* @__PURE__ */ new WeakMap();
var Zr = /* @__PURE__ */ new WeakMap();
var qr = /* @__PURE__ */ new WeakMap();
var Br = /* @__PURE__ */ new WeakMap();
var Xr = /* @__PURE__ */ new WeakMap();
var Yr = /* @__PURE__ */ new WeakMap();
var Qr = /* @__PURE__ */ new WeakMap();
var $r = /* @__PURE__ */ new WeakMap();
var ei = class {
  constructor(e3, t2) {
    if (it(this, Vr, void 0), it(this, Gr, void 0), it(this, Fr, void 0), it(this, Zr, void 0), it(this, qr, void 0), it(this, Br, void 0), it(this, Xr, void 0), it(this, Yr, void 0), it(this, Qr, void 0), it(this, $r, void 0), !(e3 instanceof URL)) throw new TypeError("url must be an instance of URL");
    var n2, o2;
    at(Vr, this, new URL(e3.href)), at(Gr, this, "number" == typeof (null == t2 ? void 0 : t2.timeoutDuration) ? null == t2 ? void 0 : t2.timeoutDuration : 5e3), at(Fr, this, "number" == typeof (null == t2 ? void 0 : t2.cooldownDuration) ? null == t2 ? void 0 : t2.cooldownDuration : 3e4), at(Zr, this, "number" == typeof (null == t2 ? void 0 : t2.cacheMaxAge) ? null == t2 ? void 0 : t2.cacheMaxAge : 6e5), at(Xr, this, new Headers(null == t2 ? void 0 : t2.headers)), zr && !rt(Xr, this).has("User-Agent") && rt(Xr, this).set("User-Agent", zr), rt(Xr, this).has("accept") || (rt(Xr, this).set("accept", "application/json"), rt(Xr, this).append("accept", "application/jwk-set+json")), at(Yr, this, null == t2 ? void 0 : t2[Jr]), void 0 !== (null == t2 ? void 0 : t2[Mr]) && (at($r, this, null == t2 ? void 0 : t2[Mr]), n2 = null == t2 ? void 0 : t2[Mr], o2 = rt(Zr, this), "object" == typeof n2 && null !== n2 && "uat" in n2 && "number" == typeof n2.uat && !(Date.now() - n2.uat >= o2) && "jwks" in n2 && To(n2.jwks) && Array.isArray(n2.jwks.keys) && Array.prototype.every.call(n2.jwks.keys, To) && (at(qr, this, rt($r, this).uat), at(Qr, this, Hr(rt($r, this).jwks))));
  }
  pendingFetch() {
    return !!rt(Br, this);
  }
  coolingDown() {
    return "number" == typeof rt(qr, this) && Date.now() < rt(qr, this) + rt(Fr, this);
  }
  fresh() {
    return "number" == typeof rt(qr, this) && Date.now() < rt(qr, this) + rt(Zr, this);
  }
  jwks() {
    var e3;
    return null === (e3 = rt(Qr, this)) || void 0 === e3 ? void 0 : e3.jwks();
  }
  async getKey(e3, t2) {
    rt(Qr, this) && this.fresh() || await this.reload();
    try {
      return await rt(Qr, this).call(this, e3, t2);
    } catch (n2) {
      if (n2 instanceof po && false === this.coolingDown()) return await this.reload(), rt(Qr, this).call(this, e3, t2);
      throw n2;
    }
  }
  async reload() {
    rt(Br, this) && ("undefined" != typeof WebSocketPair || "undefined" != typeof navigator && "Cloudflare-Workers" === navigator.userAgent || "undefined" != typeof EdgeRuntime && "vercel" === EdgeRuntime) && at(Br, this, void 0), rt(Br, this) || at(Br, this, async function(e3, t2, n2) {
      let o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : fetch;
      const r2 = await o2(e3, { method: "GET", signal: n2, redirect: "manual", headers: t2 }).catch((e4) => {
        if ("TimeoutError" === e4.name) throw new mo();
        throw e4;
      });
      if (200 !== r2.status) throw new ro("Expected 200 OK from the JSON Web Key Set HTTP response");
      try {
        return await r2.json();
      } catch (e4) {
        throw new ro("Failed to parse the JSON Web Key Set HTTP response as JSON");
      }
    }(rt(Vr, this).href, rt(Xr, this), AbortSignal.timeout(rt(Gr, this)), rt(Yr, this)).then((e3) => {
      at(Qr, this, Hr(e3)), rt($r, this) && (rt($r, this).uat = Date.now(), rt($r, this).jwks = e3), at(qr, this, Date.now()), at(Br, this, void 0);
    }).catch((e3) => {
      throw at(Br, this, void 0), e3;
    })), await rt(Br, this);
  }
};
var ti = ["mfaToken"];
var ni = ["mfaToken"];
var oi;
var ri;
var ii;
var ai;
var si;
var ci;
var ui;
var li;
var di = class extends Error {
  constructor(e3, t2) {
    super(t2), st(this, "code", void 0), this.name = "NotSupportedError", this.code = e3;
  }
};
var hi = class extends Error {
  constructor(e3, t2, n2) {
    super(t2), st(this, "cause", void 0), st(this, "code", void 0), this.code = e3, this.cause = n2 && { error: n2.error, error_description: n2.error_description, message: n2.message };
  }
};
var pi = class extends hi {
  constructor(e3, t2) {
    super("token_by_code_error", e3, t2), this.name = "TokenByCodeError";
  }
};
var fi = class extends hi {
  constructor(e3, t2) {
    super("token_by_client_credentials_error", e3, t2), this.name = "TokenByClientCredentialsError";
  }
};
var mi = class extends hi {
  constructor(e3, t2) {
    super("token_by_refresh_token_error", e3, t2), this.name = "TokenByRefreshTokenError";
  }
};
var yi = class extends hi {
  constructor(e3, t2) {
    super("token_for_connection_error", e3, t2), this.name = "TokenForConnectionErrorCode";
  }
};
var wi = class extends hi {
  constructor(e3, t2) {
    super("token_exchange_error", e3, t2), this.name = "TokenExchangeError";
  }
};
var gi = class extends Error {
  constructor(e3) {
    super(e3), st(this, "code", "verify_logout_token_error"), this.name = "VerifyLogoutTokenError";
  }
};
var vi = class extends hi {
  constructor(e3) {
    super("backchannel_authentication_error", "There was an error when trying to use Client-Initiated Backchannel Authentication.", e3), st(this, "code", "backchannel_authentication_error"), this.name = "BackchannelAuthenticationError";
  }
};
var bi = class extends hi {
  constructor(e3) {
    super("build_authorization_url_error", "There was an error when trying to build the authorization URL.", e3), this.name = "BuildAuthorizationUrlError";
  }
};
var _i = class extends hi {
  constructor(e3) {
    super("build_link_user_url_error", "There was an error when trying to build the Link User URL.", e3), this.name = "BuildLinkUserUrlError";
  }
};
var ki = class extends hi {
  constructor(e3) {
    super("build_unlink_user_url_error", "There was an error when trying to build the Unlink User URL.", e3), this.name = "BuildUnlinkUserUrlError";
  }
};
var Si = class extends Error {
  constructor() {
    super("The client secret or client assertion signing key must be provided."), st(this, "code", "missing_client_auth_error"), this.name = "MissingClientAuthError";
  }
};
function Ei(e3) {
  return Object.entries(e3).filter((e4) => {
    let [, t2] = e4;
    return void 0 !== t2;
  }).reduce((e4, t2) => ut(ut({}, e4), {}, { [t2[0]]: t2[1] }), {});
}
var Ai = class extends Error {
  constructor(e3, t2, n2) {
    super(t2), st(this, "cause", void 0), st(this, "code", void 0), this.code = e3, this.cause = n2 && { error: n2.error, error_description: n2.error_description, message: n2.message };
  }
};
var Ti = class extends Ai {
  constructor(e3, t2) {
    super("mfa_list_authenticators_error", e3, t2), this.name = "MfaListAuthenticatorsError";
  }
};
var Pi = class extends Ai {
  constructor(e3, t2) {
    super("mfa_enrollment_error", e3, t2), this.name = "MfaEnrollmentError";
  }
};
var Ri = class extends Ai {
  constructor(e3, t2) {
    super("mfa_delete_authenticator_error", e3, t2), this.name = "MfaDeleteAuthenticatorError";
  }
};
var Ii = class extends Ai {
  constructor(e3, t2) {
    super("mfa_challenge_error", e3, t2), this.name = "MfaChallengeError";
  }
};
function Oi(e3) {
  return { id: e3.id, authenticatorType: e3.authenticator_type, active: e3.active, name: e3.name, oobChannels: e3.oob_channels, type: e3.type };
}
var xi = (oi = /* @__PURE__ */ new WeakMap(), ri = /* @__PURE__ */ new WeakMap(), ii = /* @__PURE__ */ new WeakMap(), class {
  constructor(e3) {
    var t2;
    it(this, oi, void 0), it(this, ri, void 0), it(this, ii, void 0), at(oi, this, "https://".concat(e3.domain)), at(ri, this, e3.clientId), at(ii, this, null !== (t2 = e3.customFetch) && void 0 !== t2 ? t2 : function() {
      return fetch(...arguments);
    });
  }
  async listAuthenticators(e3) {
    const t2 = "".concat(rt(oi, this), "/mfa/authenticators"), { mfaToken: n2 } = e3, o2 = await rt(ii, this).call(this, t2, { method: "GET", headers: { Authorization: "Bearer ".concat(n2), "Content-Type": "application/json" } });
    if (!o2.ok) {
      const e4 = await o2.json();
      throw new Ti(e4.error_description || "Failed to list authenticators", e4);
    }
    return (await o2.json()).map(Oi);
  }
  async enrollAuthenticator(e3) {
    const t2 = "".concat(rt(oi, this), "/mfa/associate"), { mfaToken: n2 } = e3, o2 = lt(e3, ti), r2 = { authenticator_types: o2.authenticatorTypes };
    "oobChannels" in o2 && (r2.oob_channels = o2.oobChannels), "phoneNumber" in o2 && o2.phoneNumber && (r2.phone_number = o2.phoneNumber), "email" in o2 && o2.email && (r2.email = o2.email);
    const i2 = await rt(ii, this).call(this, t2, { method: "POST", headers: { Authorization: "Bearer ".concat(n2), "Content-Type": "application/json" }, body: JSON.stringify(r2) });
    if (!i2.ok) {
      const e4 = await i2.json();
      throw new Pi(e4.error_description || "Failed to enroll authenticator", e4);
    }
    return function(e4) {
      if ("otp" === e4.authenticator_type) return { authenticatorType: "otp", secret: e4.secret, barcodeUri: e4.barcode_uri, recoveryCodes: e4.recovery_codes, id: e4.id };
      if ("oob" === e4.authenticator_type) return { authenticatorType: "oob", oobChannel: e4.oob_channel, oobCode: e4.oob_code, bindingMethod: e4.binding_method, id: e4.id };
      throw new Error("Unexpected authenticator type: ".concat(e4.authenticator_type));
    }(await i2.json());
  }
  async deleteAuthenticator(e3) {
    const { authenticatorId: t2, mfaToken: n2 } = e3, o2 = "".concat(rt(oi, this), "/mfa/authenticators/").concat(encodeURIComponent(t2)), r2 = await rt(ii, this).call(this, o2, { method: "DELETE", headers: { Authorization: "Bearer ".concat(n2), "Content-Type": "application/json" } });
    if (!r2.ok) {
      const e4 = await r2.json();
      throw new Ri(e4.error_description || "Failed to delete authenticator", e4);
    }
  }
  async challengeAuthenticator(e3) {
    const t2 = "".concat(rt(oi, this), "/mfa/challenge"), { mfaToken: n2 } = e3, o2 = lt(e3, ni), r2 = { mfa_token: n2, client_id: rt(ri, this), challenge_type: o2.challengeType };
    o2.authenticatorId && (r2.authenticator_id = o2.authenticatorId);
    const i2 = await rt(ii, this).call(this, t2, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r2) });
    if (!i2.ok) {
      const e4 = await i2.json();
      throw new Ii(e4.error_description || "Failed to challenge authenticator", e4);
    }
    return function(e4) {
      const t3 = { challengeType: e4.challenge_type };
      return void 0 !== e4.oob_code && (t3.oobCode = e4.oob_code), void 0 !== e4.binding_method && (t3.bindingMethod = e4.binding_method), t3;
    }(await i2.json());
  }
});
var Ci = class e2 {
  constructor(e3, t2, n2, o2, r2, i2, a2) {
    st(this, "accessToken", void 0), st(this, "idToken", void 0), st(this, "refreshToken", void 0), st(this, "expiresAt", void 0), st(this, "scope", void 0), st(this, "claims", void 0), st(this, "authorizationDetails", void 0), st(this, "tokenType", void 0), st(this, "issuedTokenType", void 0), this.accessToken = e3, this.idToken = n2, this.refreshToken = o2, this.expiresAt = t2, this.scope = r2, this.claims = i2, this.authorizationDetails = a2;
  }
  static fromTokenEndpointResponse(t2) {
    const n2 = t2.id_token ? t2.claims() : void 0, o2 = new e2(t2.access_token, Math.floor(Date.now() / 1e3) + Number(t2.expires_in), t2.id_token, t2.refresh_token, t2.scope, n2, t2.authorization_details);
    return o2.tokenType = t2.token_type, o2.issuedTokenType = t2.issued_token_type, o2;
  }
};
var ji = "openid profile email offline_access";
var Di = Object.freeze(/* @__PURE__ */ new Set(["grant_type", "client_id", "client_secret", "client_assertion", "client_assertion_type", "subject_token", "subject_token_type", "requested_token_type", "actor_token", "actor_token_type", "audience", "aud", "resource", "resources", "resource_indicator", "scope", "connection", "login_hint", "organization", "assertion"]));
function Ki(e3) {
  if (null == e3) throw new wi("subject_token is required");
  if ("string" != typeof e3) throw new wi("subject_token must be a string");
  if (0 === e3.trim().length) throw new wi("subject_token cannot be blank or whitespace");
  if (e3 !== e3.trim()) throw new wi("subject_token must not include leading or trailing whitespace");
  if (/^bearer\s+/i.test(e3)) throw new wi("subject_token must not include the 'Bearer ' prefix");
}
function Li(e3, t2) {
  if (t2) {
    for (const [n2, o2] of Object.entries(t2)) if (!Di.has(n2)) if (Array.isArray(o2)) {
      if (o2.length > 20) throw new wi("Parameter '".concat(n2, "' exceeds maximum array size of ").concat(20));
      o2.forEach((t3) => {
        e3.append(n2, t3);
      });
    } else e3.append(n2, o2);
  }
}
var Ui = (ai = /* @__PURE__ */ new WeakMap(), si = /* @__PURE__ */ new WeakMap(), ci = /* @__PURE__ */ new WeakMap(), ui = /* @__PURE__ */ new WeakMap(), li = /* @__PURE__ */ new WeakSet(), class {
  constructor(e3) {
    if (function(e4, t2) {
      ot(e4, t2), t2.add(e4);
    }(this, li), it(this, ai, void 0), it(this, si, void 0), it(this, ci, void 0), it(this, ui, void 0), st(this, "mfa", void 0), at(ci, this, e3), e3.useMtls && !e3.customFetch) throw new di("mtls_without_custom_fetch_not_supported", "Using mTLS without a custom fetch implementation is not supported");
    this.mfa = new xi({ domain: rt(ci, this).domain, clientId: rt(ci, this).clientId, customFetch: rt(ci, this).customFetch });
  }
  async buildAuthorizationUrl(e3) {
    const { serverMetadata: t2 } = await tt(li, this, Ni).call(this);
    if (null != e3 && e3.pushedAuthorizationRequests && !t2.pushed_authorization_request_endpoint) throw new di("par_not_supported_error", "The Auth0 tenant does not have pushed authorization requests enabled. Learn how to enable it here: https://auth0.com/docs/get-started/applications/configure-par");
    try {
      return await tt(li, this, Ji).call(this, e3);
    } catch (e4) {
      throw new bi(e4);
    }
  }
  async buildLinkUserUrl(e3) {
    try {
      const t2 = await tt(li, this, Ji).call(this, { authorizationParams: ut(ut({}, e3.authorizationParams), {}, { requested_connection: e3.connection, requested_connection_scope: e3.connectionScope, scope: "openid link_account offline_access", id_token_hint: e3.idToken }) });
      return { linkUserUrl: t2.authorizationUrl, codeVerifier: t2.codeVerifier };
    } catch (e4) {
      throw new _i(e4);
    }
  }
  async buildUnlinkUserUrl(e3) {
    try {
      const t2 = await tt(li, this, Ji).call(this, { authorizationParams: ut(ut({}, e3.authorizationParams), {}, { requested_connection: e3.connection, scope: "openid unlink_account", id_token_hint: e3.idToken }) });
      return { unlinkUserUrl: t2.authorizationUrl, codeVerifier: t2.codeVerifier };
    } catch (e4) {
      throw new ki(e4);
    }
  }
  async backchannelAuthentication(e3) {
    const { configuration: t2, serverMetadata: n2 } = await tt(li, this, Ni).call(this), o2 = Ei(ut(ut({}, rt(ci, this).authorizationParams), null == e3 ? void 0 : e3.authorizationParams)), r2 = new URLSearchParams(ut(ut({ scope: ji }, o2), {}, { client_id: rt(ci, this).clientId, binding_message: e3.bindingMessage, login_hint: JSON.stringify({ format: "iss_sub", iss: n2.issuer, sub: e3.loginHint.sub }) }));
    e3.requestedExpiry && r2.append("requested_expiry", e3.requestedExpiry.toString()), e3.authorizationDetails && r2.append("authorization_details", JSON.stringify(e3.authorizationDetails));
    try {
      const e4 = await dr(t2, r2), n3 = await hr(t2, e4);
      return Ci.fromTokenEndpointResponse(n3);
    } catch (e4) {
      throw new vi(e4);
    }
  }
  async initiateBackchannelAuthentication(e3) {
    const { configuration: t2, serverMetadata: n2 } = await tt(li, this, Ni).call(this), o2 = Ei(ut(ut({}, rt(ci, this).authorizationParams), null == e3 ? void 0 : e3.authorizationParams)), r2 = new URLSearchParams(ut(ut({ scope: ji }, o2), {}, { client_id: rt(ci, this).clientId, binding_message: e3.bindingMessage, login_hint: JSON.stringify({ format: "iss_sub", iss: n2.issuer, sub: e3.loginHint.sub }) }));
    e3.requestedExpiry && r2.append("requested_expiry", e3.requestedExpiry.toString()), e3.authorizationDetails && r2.append("authorization_details", JSON.stringify(e3.authorizationDetails));
    try {
      const e4 = await dr(t2, r2);
      return { authReqId: e4.auth_req_id, expiresIn: e4.expires_in, interval: e4.interval };
    } catch (e4) {
      throw new vi(e4);
    }
  }
  async backchannelAuthenticationGrant(e3) {
    let { authReqId: t2 } = e3;
    const { configuration: n2 } = await tt(li, this, Ni).call(this), o2 = new URLSearchParams({ auth_req_id: t2 });
    try {
      const e4 = await Sr(n2, "urn:openid:params:grant-type:ciba", o2);
      return Ci.fromTokenEndpointResponse(e4);
    } catch (e4) {
      throw new vi(e4);
    }
  }
  async getTokenForConnection(e3) {
    var t2;
    if (e3.refreshToken && e3.accessToken) throw new yi("Either a refresh or access token should be specified, but not both.");
    const n2 = null !== (t2 = e3.accessToken) && void 0 !== t2 ? t2 : e3.refreshToken;
    if (!n2) throw new yi("Either a refresh or access token must be specified.");
    try {
      return await this.exchangeToken({ connection: e3.connection, subjectToken: n2, subjectTokenType: e3.accessToken ? "urn:ietf:params:oauth:token-type:access_token" : "urn:ietf:params:oauth:token-type:refresh_token", loginHint: e3.loginHint });
    } catch (e4) {
      if (e4 instanceof wi) throw new yi(e4.message, e4.cause);
      throw e4;
    }
  }
  async exchangeToken(e3) {
    return "connection" in e3 ? tt(li, this, Wi).call(this, e3) : tt(li, this, Hi).call(this, e3);
  }
  async getTokenByCode(e3, t2) {
    const { configuration: n2 } = await tt(li, this, Ni).call(this);
    try {
      const o2 = await fr(n2, e3, { pkceCodeVerifier: t2.codeVerifier });
      return Ci.fromTokenEndpointResponse(o2);
    } catch (e4) {
      throw new pi("There was an error while trying to request a token.", e4);
    }
  }
  async getTokenByRefreshToken(e3) {
    const { configuration: t2 } = await tt(li, this, Ni).call(this);
    try {
      const n2 = await mr(t2, e3.refreshToken);
      return Ci.fromTokenEndpointResponse(n2);
    } catch (e4) {
      throw new mi("The access token has expired and there was an error while trying to refresh it.", e4);
    }
  }
  async getTokenByClientCredentials(e3) {
    const { configuration: t2 } = await tt(li, this, Ni).call(this);
    try {
      const n2 = new URLSearchParams({ audience: e3.audience });
      e3.organization && n2.append("organization", e3.organization);
      const o2 = await yr(t2, n2);
      return Ci.fromTokenEndpointResponse(o2);
    } catch (e4) {
      throw new fi("There was an error while trying to request a token.", e4);
    }
  }
  async buildLogoutUrl(e3) {
    const { configuration: t2, serverMetadata: n2 } = await tt(li, this, Ni).call(this);
    if (!n2.end_session_endpoint) {
      const t3 = new URL("https://".concat(rt(ci, this).domain, "/v2/logout"));
      return t3.searchParams.set("returnTo", e3.returnTo), t3.searchParams.set("client_id", rt(ci, this).clientId), t3;
    }
    return function(e4, t3) {
      vr(e4);
      const { as: n3, c: o2, tlsOnly: r2 } = Fo(e4), i2 = Qt(n3, "end_session_endpoint", false, r2);
      (t3 = new URLSearchParams(t3)).has("client_id") || t3.set("client_id", o2.client_id);
      for (const [e5, n4] of t3.entries()) i2.searchParams.append(e5, n4);
      return i2;
    }(t2, { post_logout_redirect_uri: e3.returnTo });
  }
  async verifyLogoutToken(e3) {
    const { serverMetadata: t2 } = await tt(li, this, Ni).call(this);
    rt(ui, this) || at(ui, this, function(e4, t3) {
      const n3 = new ei(e4, t3), o2 = async (e5, t4) => n3.getKey(e5, t4);
      return Object.defineProperties(o2, { coolingDown: { get: () => n3.coolingDown(), enumerable: true, configurable: false }, fresh: { get: () => n3.fresh(), enumerable: true, configurable: false }, reload: { value: () => n3.reload(), enumerable: true, configurable: false, writable: false }, reloading: { get: () => n3.pendingFetch(), enumerable: true, configurable: false }, jwks: { value: () => n3.jwks(), enumerable: true, configurable: false, writable: false } }), o2;
    }(new URL(t2.jwks_uri), { [Jr]: rt(ci, this).customFetch }));
    const { payload: n2 } = await Cr(e3.logoutToken, rt(ui, this), { issuer: t2.issuer, audience: rt(ci, this).clientId, algorithms: ["RS256"], requiredClaims: ["iat"] });
    if (!("sid" in n2) && !("sub" in n2)) throw new gi('either "sid" or "sub" (or both) claims must be present');
    if ("sid" in n2 && "string" != typeof n2.sid) throw new gi('"sid" claim must be a string');
    if ("sub" in n2 && "string" != typeof n2.sub) throw new gi('"sub" claim must be a string');
    if ("nonce" in n2) throw new gi('"nonce" claim is prohibited');
    if (!("events" in n2)) throw new gi('"events" claim is missing');
    if ("object" != typeof n2.events || null === n2.events) throw new gi('"events" claim must be an object');
    if (!("http://schemas.openid.net/event/backchannel-logout" in n2.events)) throw new gi('"http://schemas.openid.net/event/backchannel-logout" member is missing in the "events" claim');
    if ("object" != typeof n2.events["http://schemas.openid.net/event/backchannel-logout"]) throw new gi('"http://schemas.openid.net/event/backchannel-logout" member in the "events" claim must be an object');
    return { sid: n2.sid, sub: n2.sub };
  }
});
async function Ni() {
  if (rt(ai, this) && rt(si, this)) return { configuration: rt(ai, this), serverMetadata: rt(si, this) };
  const e3 = await tt(li, this, zi).call(this);
  return at(ai, this, await ir(new URL("https://".concat(rt(ci, this).domain)), rt(ci, this).clientId, { use_mtls_endpoint_aliases: rt(ci, this).useMtls }, e3, { [Xo]: rt(ci, this).customFetch })), at(si, this, rt(ai, this).serverMetadata()), rt(ai, this)[Xo] = rt(ci, this).customFetch || fetch, { configuration: rt(ai, this), serverMetadata: rt(si, this) };
}
async function Wi(e3) {
  var t2, n2;
  const { configuration: o2 } = await tt(li, this, Ni).call(this);
  if ("audience" in e3 || "resource" in e3) throw new wi("audience and resource parameters are not supported for Token Vault exchanges");
  Ki(e3.subjectToken);
  const r2 = new URLSearchParams({ connection: e3.connection, subject_token: e3.subjectToken, subject_token_type: null !== (t2 = e3.subjectTokenType) && void 0 !== t2 ? t2 : "urn:ietf:params:oauth:token-type:access_token", requested_token_type: null !== (n2 = e3.requestedTokenType) && void 0 !== n2 ? n2 : "http://auth0.com/oauth/token-type/federated-connection-access-token" });
  e3.loginHint && r2.append("login_hint", e3.loginHint), e3.scope && r2.append("scope", e3.scope), Li(r2, e3.extra);
  try {
    const e4 = await Sr(o2, "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token", r2);
    return Ci.fromTokenEndpointResponse(e4);
  } catch (t3) {
    throw new wi("Failed to exchange token for connection '".concat(e3.connection, "'."), t3);
  }
}
async function Hi(e3) {
  const { configuration: t2 } = await tt(li, this, Ni).call(this);
  Ki(e3.subjectToken);
  const n2 = new URLSearchParams({ subject_token_type: e3.subjectTokenType, subject_token: e3.subjectToken });
  e3.audience && n2.append("audience", e3.audience), e3.scope && n2.append("scope", e3.scope), e3.requestedTokenType && n2.append("requested_token_type", e3.requestedTokenType), e3.organization && n2.append("organization", e3.organization), Li(n2, e3.extra);
  try {
    const e4 = await Sr(t2, "urn:ietf:params:oauth:grant-type:token-exchange", n2);
    return Ci.fromTokenEndpointResponse(e4);
  } catch (t3) {
    throw new wi("Failed to exchange token of type '".concat(e3.subjectTokenType, "'").concat(e3.audience ? " for audience '".concat(e3.audience, "'") : "", "."), t3);
  }
}
async function zi() {
  if (!rt(ci, this).clientSecret && !rt(ci, this).clientAssertionSigningKey && !rt(ci, this).useMtls) throw new Si();
  if (rt(ci, this).useMtls) return (e4, t2, n2, o2) => {
    n2.set("client_id", t2.client_id);
  };
  let e3 = rt(ci, this).clientAssertionSigningKey;
  return !e3 || e3 instanceof CryptoKey || (e3 = await async function(e4, t2, n2) {
    if ("string" != typeof e4 || 0 !== e4.indexOf("-----BEGIN PRIVATE KEY-----")) throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    return jo(e4, t2, n2);
  }(e3, rt(ci, this).clientAssertionSigningAlg || "RS256")), e3 ? function(e4, t2) {
    return qt(e4, t2);
  }(e3) : Bo(rt(ci, this).clientSecret);
}
async function Ji(e3) {
  const { configuration: t2 } = await tt(li, this, Ni).call(this), n2 = tr(), o2 = await er(n2), r2 = Ei(ut(ut({}, rt(ci, this).authorizationParams), null == e3 ? void 0 : e3.authorizationParams)), i2 = new URLSearchParams(ut(ut({ scope: ji }, r2), {}, { client_id: rt(ci, this).clientId, code_challenge: o2, code_challenge_method: "S256" }));
  return { authorizationUrl: null != e3 && e3.pushedAuthorizationRequests ? await gr(t2, i2) : await wr(t2, i2), codeVerifier: n2 };
}
var Mi = new p();
var Vi = class {
  constructor(e3) {
    let t2, n2;
    if (this.userCache = new pe().enclosedCache, this.activeLockKeys = /* @__PURE__ */ new Set(), this.defaultOptions = { authorizationParams: { scope: "openid profile email" }, useRefreshTokensFallback: false, useFormData: true }, this._releaseLockOnPageHide = async () => {
      const e4 = Array.from(this.activeLockKeys);
      for (const t3 of e4) await Mi.releaseLock(t3);
      this.activeLockKeys.clear(), window.removeEventListener("pagehide", this._releaseLockOnPageHide);
    }, this.options = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), e3), { authorizationParams: Object.assign(Object.assign({}, this.defaultOptions.authorizationParams), e3.authorizationParams) }), "undefined" != typeof window && (() => {
      if (!I()) throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");
      if (void 0 === I().subtle) throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/main/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ");
    })(), e3.cache && e3.cacheLocation && console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."), e3.cache) n2 = e3.cache;
    else {
      if (t2 = e3.cacheLocation || "memory", !Je(t2)) throw new Error('Invalid cache location "'.concat(t2, '"'));
      n2 = Je(t2)();
    }
    var o2;
    this.httpTimeoutMs = e3.httpTimeoutInSeconds ? 1e3 * e3.httpTimeoutInSeconds : 1e4, this.cookieStorage = false === e3.legacySameSiteCookie ? Pe : Re, this.orgHintCookieName = (o2 = this.options.clientId, "auth0.".concat(o2, ".organization_hint")), this.isAuthenticatedCookieName = ((e4) => "auth0.".concat(e4, ".is.authenticated"))(this.options.clientId), this.sessionCheckExpiryDays = e3.sessionCheckExpiryDays || 1;
    const r2 = e3.useCookiesForTransactions ? this.cookieStorage : Ie;
    var i2;
    this.scope = function(e4, t3) {
      for (var n3 = arguments.length, o3 = new Array(n3 > 2 ? n3 - 2 : 0), r3 = 2; r3 < n3; r3++) o3[r3 - 2] = arguments[r3];
      if ("object" != typeof e4) return { default: ue(t3, e4, ...o3) };
      let i3 = { default: ue(t3, ...o3) };
      return Object.keys(e4).forEach((n4) => {
        const r4 = e4[n4];
        i3[n4] = ue(t3, r4, ...o3);
      }), i3;
    }(this.options.authorizationParams.scope, "openid", this.options.useRefreshTokens ? "offline_access" : ""), this.transactionManager = new me(r2, this.options.clientId, this.options.cookieDomain), this.nowProvider = this.options.nowProvider || y, this.cacheManager = new fe(n2, n2.allKeys ? void 0 : new He(n2, this.options.clientId), this.nowProvider), this.dpop = this.options.useDpop ? new Ze(this.options.clientId) : void 0, this.domainUrl = (i2 = this.options.domain, /^https?:\/\//.test(i2) ? i2 : "https://".concat(i2)), this.tokenIssuer = ((e4, t3) => e4 ? e4.startsWith("https://") ? e4 : "https://".concat(e4, "/") : "".concat(t3, "/"))(this.options.issuer, this.domainUrl);
    const a2 = "".concat(this.domainUrl, "/me/"), s2 = this.createFetcher(Object.assign(Object.assign({}, this.options.useDpop && { dpopNonceId: "__auth0_my_account_api__" }), { getAccessToken: () => this.getTokenSilently({ authorizationParams: { scope: "create:me:connected_accounts", audience: a2 }, detailedResponse: true }) }));
    this.myAccountApi = new Qe(s2, a2), this.authJsClient = new Ui({ domain: this.options.domain, clientId: this.options.clientId }), "undefined" != typeof window && window.Worker && this.options.useRefreshTokens && "memory" === t2 && (this.options.workerUrl ? this.worker = new Worker(this.options.workerUrl) : this.worker = new Ue());
  }
  getConfiguration() {
    return Object.freeze({ domain: this.options.domain, clientId: this.options.clientId });
  }
  _url(e3) {
    const t2 = encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client || m)));
    return "".concat(this.domainUrl).concat(e3, "&auth0Client=").concat(t2);
  }
  _authorizeUrl(e3) {
    return this._url("/authorize?".concat(D(e3)));
  }
  async _verifyIdToken(e3, t2, n2) {
    const o2 = await this.nowProvider();
    return ge({ iss: this.tokenIssuer, aud: this.options.clientId, id_token: e3, nonce: t2, organization: n2, leeway: this.options.leeway, max_age: (r2 = this.options.authorizationParams.max_age, "string" != typeof r2 ? r2 : parseInt(r2, 10) || void 0), now: o2 });
    var r2;
  }
  _processOrgHint(e3) {
    e3 ? this.cookieStorage.save(this.orgHintCookieName, e3, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }) : this.cookieStorage.remove(this.orgHintCookieName, { cookieDomain: this.options.cookieDomain });
  }
  async _prepareAuthorizeUrl(e3, t2, n2) {
    var o2;
    const r2 = x(O()), i2 = x(O()), a2 = O(), s2 = await K(a2), c2 = U(s2), u2 = await (null === (o2 = this.dpop) || void 0 === o2 ? void 0 : o2.calculateThumbprint()), l2 = ((e4, t3, n3, o3, r3, i3, a3, s3, c3) => Object.assign(Object.assign(Object.assign({ client_id: e4.clientId }, e4.authorizationParams), n3), { scope: le(t3, n3.scope, n3.audience), response_type: "code", response_mode: s3 || "query", state: o3, nonce: r3, redirect_uri: a3 || e4.authorizationParams.redirect_uri, code_challenge: i3, code_challenge_method: "S256", dpop_jkt: c3 }))(this.options, this.scope, e3, r2, i2, c2, e3.redirect_uri || this.options.authorizationParams.redirect_uri || n2, null == t2 ? void 0 : t2.response_mode, u2), d2 = this._authorizeUrl(l2);
    return { nonce: i2, code_verifier: a2, scope: l2.scope, audience: l2.audience || "default", redirect_uri: l2.redirect_uri, state: r2, url: d2 };
  }
  async loginWithPopup(e3, t2) {
    var n2;
    if (e3 = e3 || {}, !(t2 = t2 || {}).popup && (t2.popup = ((e4) => {
      const t3 = window.screenX + (window.innerWidth - 400) / 2, n3 = window.screenY + (window.innerHeight - 600) / 2;
      return window.open(e4, "auth0:authorize:popup", "left=".concat(t3, ",top=").concat(n3, ",width=").concat(400, ",height=").concat(600, ",resizable,scrollbars=yes,status=1"));
    })(""), !t2.popup)) throw new S();
    const o2 = await this._prepareAuthorizeUrl(e3.authorizationParams || {}, { response_mode: "web_message" }, window.location.origin);
    t2.popup.location.href = o2.url;
    const r2 = await ((e4) => new Promise((t3, n3) => {
      let o3;
      const r3 = setInterval(() => {
        e4.popup && e4.popup.closed && (clearInterval(r3), clearTimeout(i3), window.removeEventListener("message", o3, false), n3(new k(e4.popup)));
      }, 1e3), i3 = setTimeout(() => {
        clearInterval(r3), n3(new _(e4.popup)), window.removeEventListener("message", o3, false);
      }, 1e3 * (e4.timeoutInSeconds || 60));
      o3 = function(a2) {
        if (a2.data && "authorization_response" === a2.data.type) {
          if (clearTimeout(i3), clearInterval(r3), window.removeEventListener("message", o3, false), false !== e4.closePopup && e4.popup.close(), a2.data.response.error) return n3(w.fromPayload(a2.data.response));
          t3(a2.data.response);
        }
      }, window.addEventListener("message", o3);
    }))(Object.assign(Object.assign({}, t2), { timeoutInSeconds: t2.timeoutInSeconds || this.options.authorizeTimeoutInSeconds || 60 }));
    if (o2.state !== r2.state) throw new w("state_mismatch", "Invalid state");
    const i2 = (null === (n2 = e3.authorizationParams) || void 0 === n2 ? void 0 : n2.organization) || this.options.authorizationParams.organization;
    await this._requestToken({ audience: o2.audience, scope: o2.scope, code_verifier: o2.code_verifier, grant_type: "authorization_code", code: r2.code, redirect_uri: o2.redirect_uri }, { nonceIn: o2.nonce, organization: i2 });
  }
  async getUser() {
    var e3;
    const t2 = await this._getIdTokenFromCache();
    return null === (e3 = null == t2 ? void 0 : t2.decodedToken) || void 0 === e3 ? void 0 : e3.user;
  }
  async getIdTokenClaims() {
    var e3;
    const t2 = await this._getIdTokenFromCache();
    return null === (e3 = null == t2 ? void 0 : t2.decodedToken) || void 0 === e3 ? void 0 : e3.claims;
  }
  async loginWithRedirect() {
    var t2;
    const n2 = Me(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}), { openUrl: o2, fragment: r2, appState: i2 } = n2, a2 = e(n2, ["openUrl", "fragment", "appState"]), s2 = (null === (t2 = a2.authorizationParams) || void 0 === t2 ? void 0 : t2.organization) || this.options.authorizationParams.organization, c2 = await this._prepareAuthorizeUrl(a2.authorizationParams || {}), { url: u2 } = c2, l2 = e(c2, ["url"]);
    this.transactionManager.create(Object.assign(Object.assign(Object.assign({}, l2), { appState: i2, response_type: Oe.Code }), s2 && { organization: s2 }));
    const d2 = r2 ? "".concat(u2, "#").concat(r2) : u2;
    o2 ? await o2(d2) : window.location.assign(d2);
  }
  async handleRedirectCallback() {
    const e3 = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.location.href).split("?").slice(1);
    if (0 === e3.length) throw new Error("There are no query params available for parsing.");
    const t2 = this.transactionManager.get();
    if (!t2) throw new w("missing_transaction", "Invalid state");
    this.transactionManager.remove();
    const n2 = ((e4) => {
      e4.indexOf("#") > -1 && (e4 = e4.substring(0, e4.indexOf("#")));
      const t3 = new URLSearchParams(e4);
      return { state: t3.get("state"), code: t3.get("code") || void 0, connect_code: t3.get("connect_code") || void 0, error: t3.get("error") || void 0, error_description: t3.get("error_description") || void 0 };
    })(e3.join(""));
    return t2.response_type === Oe.ConnectCode ? this._handleConnectAccountRedirectCallback(n2, t2) : this._handleLoginRedirectCallback(n2, t2);
  }
  async _handleLoginRedirectCallback(e3, t2) {
    const { code: n2, state: o2, error: r2, error_description: i2 } = e3;
    if (r2) throw new g(r2, i2 || r2, o2, t2.appState);
    if (!t2.code_verifier || t2.state && t2.state !== o2) throw new w("state_mismatch", "Invalid state");
    const a2 = t2.organization, s2 = t2.nonce, c2 = t2.redirect_uri;
    return await this._requestToken(Object.assign({ audience: t2.audience, scope: t2.scope, code_verifier: t2.code_verifier, grant_type: "authorization_code", code: n2 }, c2 ? { redirect_uri: c2 } : {}), { nonceIn: s2, organization: a2 }), { appState: t2.appState, response_type: Oe.Code };
  }
  async _handleConnectAccountRedirectCallback(e3, t2) {
    const { connect_code: n2, state: o2, error: r2, error_description: i2 } = e3;
    if (r2) throw new v(r2, i2 || r2, t2.connection, o2, t2.appState);
    if (!n2) throw new w("missing_connect_code", "Missing connect code");
    if (!(t2.code_verifier && t2.state && t2.auth_session && t2.redirect_uri && t2.state === o2)) throw new w("state_mismatch", "Invalid state");
    const a2 = await this.myAccountApi.completeAccount({ auth_session: t2.auth_session, connect_code: n2, redirect_uri: t2.redirect_uri, code_verifier: t2.code_verifier });
    return Object.assign(Object.assign({}, a2), { appState: t2.appState, response_type: Oe.ConnectCode });
  }
  async checkSession(e3) {
    if (!this.cookieStorage.get(this.isAuthenticatedCookieName)) {
      if (!this.cookieStorage.get("auth0.is.authenticated")) return;
      this.cookieStorage.save(this.isAuthenticatedCookieName, true, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }), this.cookieStorage.remove("auth0.is.authenticated");
    }
    try {
      await this.getTokenSilently(e3);
    } catch (e4) {
    }
  }
  async getTokenSilently() {
    let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    var t2, n2;
    const o2 = Object.assign(Object.assign({ cacheMode: "on" }, e3), { authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e3.authorizationParams), { scope: le(this.scope, null === (t2 = e3.authorizationParams) || void 0 === t2 ? void 0 : t2.scope, (null === (n2 = e3.authorizationParams) || void 0 === n2 ? void 0 : n2.audience) || this.options.authorizationParams.audience) }) }), r2 = await ((e4, t3) => {
      let n3 = Ne[t3];
      return n3 || (n3 = e4().finally(() => {
        delete Ne[t3], n3 = null;
      }), Ne[t3] = n3), n3;
    })(() => this._getTokenSilently(o2), "".concat(this.options.clientId, "::").concat(o2.authorizationParams.audience, "::").concat(o2.authorizationParams.scope));
    return e3.detailedResponse ? r2 : null == r2 ? void 0 : r2.access_token;
  }
  async _getTokenSilently(t2) {
    const { cacheMode: n2 } = t2, o2 = e(t2, ["cacheMode"]);
    if ("off" !== n2) {
      const e3 = await this._getEntryFromCache({ scope: o2.authorizationParams.scope, audience: o2.authorizationParams.audience || "default", clientId: this.options.clientId, cacheMode: n2 });
      if (e3) return e3;
    }
    if ("cache-only" === n2) return;
    const r2 = (i2 = this.options.clientId, a2 = o2.authorizationParams.audience || "default", "".concat("auth0.lock.getTokenSilently", ".").concat(i2, ".").concat(a2));
    var i2, a2;
    if (!await We(() => Mi.acquireLock(r2, 5e3), 10)) throw new b();
    this.activeLockKeys.add(r2), 1 === this.activeLockKeys.size && window.addEventListener("pagehide", this._releaseLockOnPageHide);
    try {
      if ("off" !== n2) {
        const e4 = await this._getEntryFromCache({ scope: o2.authorizationParams.scope, audience: o2.authorizationParams.audience || "default", clientId: this.options.clientId });
        if (e4) return e4;
      }
      const e3 = this.options.useRefreshTokens ? await this._getTokenUsingRefreshToken(o2) : await this._getTokenFromIFrame(o2), { id_token: t3, token_type: i3, access_token: a3, oauthTokenScope: s2, expires_in: c2 } = e3;
      return Object.assign(Object.assign({ id_token: t3, token_type: i3, access_token: a3 }, s2 ? { scope: s2 } : null), { expires_in: c2 });
    } finally {
      await Mi.releaseLock(r2), this.activeLockKeys.delete(r2), 0 === this.activeLockKeys.size && window.removeEventListener("pagehide", this._releaseLockOnPageHide);
    }
  }
  async getTokenWithPopup() {
    let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    var n2, o2;
    const r2 = Object.assign(Object.assign({}, e3), { authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e3.authorizationParams), { scope: le(this.scope, null === (n2 = e3.authorizationParams) || void 0 === n2 ? void 0 : n2.scope, (null === (o2 = e3.authorizationParams) || void 0 === o2 ? void 0 : o2.audience) || this.options.authorizationParams.audience) }) });
    t2 = Object.assign(Object.assign({}, f), t2), await this.loginWithPopup(r2, t2);
    return (await this.cacheManager.get(new de({ scope: r2.authorizationParams.scope, audience: r2.authorizationParams.audience || "default", clientId: this.options.clientId }), void 0, this.options.useMrrt)).access_token;
  }
  async isAuthenticated() {
    return !!await this.getUser();
  }
  _buildLogoutUrl(t2) {
    null !== t2.clientId ? t2.clientId = t2.clientId || this.options.clientId : delete t2.clientId;
    const n2 = t2.logoutParams || {}, { federated: o2 } = n2, r2 = e(n2, ["federated"]), i2 = o2 ? "&federated" : "";
    return this._url("/v2/logout?".concat(D(Object.assign({ clientId: t2.clientId }, r2)))) + i2;
  }
  async logout() {
    let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    var n2;
    const o2 = Me(t2), { openUrl: r2 } = o2, i2 = e(o2, ["openUrl"]);
    null === t2.clientId ? await this.cacheManager.clear() : await this.cacheManager.clear(t2.clientId || this.options.clientId), this.cookieStorage.remove(this.orgHintCookieName, { cookieDomain: this.options.cookieDomain }), this.cookieStorage.remove(this.isAuthenticatedCookieName, { cookieDomain: this.options.cookieDomain }), this.userCache.remove("@@user@@"), await (null === (n2 = this.dpop) || void 0 === n2 ? void 0 : n2.clear());
    const a2 = this._buildLogoutUrl(i2);
    r2 ? await r2(a2) : false !== r2 && window.location.assign(a2);
  }
  async _getTokenFromIFrame(e3) {
    const t2 = (n2 = this.options.clientId, "".concat("auth0.lock.getTokenFromIFrame", ".").concat(n2));
    var n2;
    if (!await We(() => Mi.acquireLock(t2, 5e3), 10)) throw new b();
    try {
      const n3 = Object.assign(Object.assign({}, e3.authorizationParams), { prompt: "none" }), o2 = this.cookieStorage.get(this.orgHintCookieName);
      o2 && !n3.organization && (n3.organization = o2);
      const { url: r2, state: i2, nonce: a2, code_verifier: s2, redirect_uri: c2, scope: u2, audience: l2 } = await this._prepareAuthorizeUrl(n3, { response_mode: "web_message" }, window.location.origin);
      if (window.crossOriginIsolated) throw new w("login_required", "The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");
      const d2 = e3.timeoutInSeconds || this.options.authorizeTimeoutInSeconds;
      let h2;
      try {
        h2 = new URL(this.domainUrl).origin;
      } catch (e4) {
        h2 = this.domainUrl;
      }
      const p2 = await function(e4, t3) {
        let n4 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 60;
        return new Promise((o3, r3) => {
          const i3 = window.document.createElement("iframe");
          i3.setAttribute("width", "0"), i3.setAttribute("height", "0"), i3.style.display = "none";
          const a3 = () => {
            window.document.body.contains(i3) && (window.document.body.removeChild(i3), window.removeEventListener("message", s3, false));
          };
          let s3;
          const c3 = setTimeout(() => {
            r3(new b()), a3();
          }, 1e3 * n4);
          s3 = function(e5) {
            if (e5.origin != t3) return;
            if (!e5.data || "authorization_response" !== e5.data.type) return;
            const n5 = e5.source;
            n5 && n5.close(), e5.data.response.error ? r3(w.fromPayload(e5.data.response)) : o3(e5.data.response), clearTimeout(c3), window.removeEventListener("message", s3, false), setTimeout(a3, 2e3);
          }, window.addEventListener("message", s3, false), window.document.body.appendChild(i3), i3.setAttribute("src", e4);
        });
      }(r2, h2, d2);
      if (i2 !== p2.state) throw new w("state_mismatch", "Invalid state");
      const f2 = await this._requestToken(Object.assign(Object.assign({}, e3.authorizationParams), { code_verifier: s2, code: p2.code, grant_type: "authorization_code", redirect_uri: c2, timeout: e3.authorizationParams.timeout || this.httpTimeoutMs }), { nonceIn: a2, organization: n3.organization });
      return Object.assign(Object.assign({}, f2), { scope: u2, oauthTokenScope: f2.scope, audience: l2 });
    } catch (e4) {
      throw "login_required" === e4.error && this.logout({ openUrl: false }), e4;
    } finally {
      await Mi.releaseLock(t2);
    }
  }
  async _getTokenUsingRefreshToken(e3) {
    const t2 = await this.cacheManager.get(new de({ scope: e3.authorizationParams.scope, audience: e3.authorizationParams.audience || "default", clientId: this.options.clientId }), void 0, this.options.useMrrt);
    if (!(t2 && t2.refresh_token || this.worker)) {
      if (this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
      throw new A(e3.authorizationParams.audience || "default", e3.authorizationParams.scope);
    }
    const n2 = e3.authorizationParams.redirect_uri || this.options.authorizationParams.redirect_uri || window.location.origin, o2 = "number" == typeof e3.timeoutInSeconds ? 1e3 * e3.timeoutInSeconds : null, r2 = ((e4, t3, n3, o3) => {
      var r3;
      if (e4 && n3 && o3) {
        if (t3.audience !== n3) return t3.scope;
        const e5 = o3.split(" "), i3 = (null === (r3 = t3.scope) || void 0 === r3 ? void 0 : r3.split(" ")) || [], a3 = i3.every((t4) => e5.includes(t4));
        return e5.length >= i3.length && a3 ? o3 : t3.scope;
      }
      return t3.scope;
    })(this.options.useMrrt, e3.authorizationParams, null == t2 ? void 0 : t2.audience, null == t2 ? void 0 : t2.scope);
    try {
      const u2 = await this._requestToken(Object.assign(Object.assign(Object.assign({}, e3.authorizationParams), { grant_type: "refresh_token", refresh_token: t2 && t2.refresh_token, redirect_uri: n2 }), o2 && { timeout: o2 }), { scopesToRequest: r2 });
      if (u2.refresh_token && (null == t2 ? void 0 : t2.refresh_token) && await this.cacheManager.updateEntry(t2.refresh_token, u2.refresh_token), this.options.useMrrt) {
        if (i2 = null == t2 ? void 0 : t2.audience, a2 = null == t2 ? void 0 : t2.scope, s2 = e3.authorizationParams.audience, c2 = e3.authorizationParams.scope, i2 !== s2 || !Ve(c2, a2)) {
          if (!Ve(r2, u2.scope)) {
            if (this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
            await this.cacheManager.remove(this.options.clientId, e3.authorizationParams.audience, e3.authorizationParams.scope);
            const t3 = ((e4, t4) => {
              const n3 = (null == e4 ? void 0 : e4.split(" ")) || [], o3 = (null == t4 ? void 0 : t4.split(" ")) || [];
              return n3.filter((e5) => -1 == o3.indexOf(e5)).join(",");
            })(r2, u2.scope);
            throw new T(e3.authorizationParams.audience || "default", t3);
          }
        }
      }
      return Object.assign(Object.assign({}, u2), { scope: e3.authorizationParams.scope, oauthTokenScope: u2.scope, audience: e3.authorizationParams.audience || "default" });
    } catch (t3) {
      if ((t3.message.indexOf("Missing Refresh Token") > -1 || t3.message && t3.message.indexOf("invalid refresh token") > -1) && this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
      throw t3;
    }
    var i2, a2, s2, c2;
  }
  async _saveEntryInCache(t2) {
    const { id_token: n2, decodedToken: o2 } = t2, r2 = e(t2, ["id_token", "decodedToken"]);
    this.userCache.set("@@user@@", { id_token: n2, decodedToken: o2 }), await this.cacheManager.setIdToken(this.options.clientId, t2.id_token, t2.decodedToken), await this.cacheManager.set(r2);
  }
  async _getIdTokenFromCache() {
    const e3 = this.options.authorizationParams.audience || "default", t2 = this.scope[e3], n2 = await this.cacheManager.getIdToken(new de({ clientId: this.options.clientId, audience: e3, scope: t2 })), o2 = this.userCache.get("@@user@@");
    return n2 && n2.id_token === (null == o2 ? void 0 : o2.id_token) ? o2 : (this.userCache.set("@@user@@", n2), n2);
  }
  async _getEntryFromCache(e3) {
    let { scope: t2, audience: n2, clientId: o2, cacheMode: r2 } = e3;
    const i2 = await this.cacheManager.get(new de({ scope: t2, audience: n2, clientId: o2 }), 60, this.options.useMrrt, r2);
    if (i2 && i2.access_token) {
      const { token_type: e4, access_token: t3, oauthTokenScope: n3, expires_in: o3 } = i2, r3 = await this._getIdTokenFromCache();
      return r3 && Object.assign(Object.assign({ id_token: r3.id_token, token_type: e4 || "Bearer", access_token: t3 }, n3 ? { scope: n3 } : null), { expires_in: o3 });
    }
  }
  async _requestToken(e3, t2) {
    var n2, o2;
    const { nonceIn: r2, organization: i2, scopesToRequest: a2 } = t2 || {}, s2 = await se(Object.assign(Object.assign({ baseUrl: this.domainUrl, client_id: this.options.clientId, auth0Client: this.options.auth0Client, useFormData: this.options.useFormData, timeout: this.httpTimeoutMs, useMrrt: this.options.useMrrt, dpop: this.dpop }, e3), { scope: a2 || e3.scope }), this.worker), c2 = await this._verifyIdToken(s2.id_token, r2, i2);
    if ("authorization_code" === e3.grant_type) {
      const e4 = await this._getIdTokenFromCache();
      (null === (o2 = null === (n2 = null == e4 ? void 0 : e4.decodedToken) || void 0 === n2 ? void 0 : n2.claims) || void 0 === o2 ? void 0 : o2.sub) && e4.decodedToken.claims.sub !== c2.claims.sub && (await this.cacheManager.clear(this.options.clientId), this.userCache.remove("@@user@@"));
    }
    return await this._saveEntryInCache(Object.assign(Object.assign(Object.assign(Object.assign({}, s2), { decodedToken: c2, scope: e3.scope, audience: e3.audience || "default" }), s2.scope ? { oauthTokenScope: s2.scope } : null), { client_id: this.options.clientId })), this.cookieStorage.save(this.isAuthenticatedCookieName, true, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }), this._processOrgHint(i2 || c2.claims.org_id), Object.assign(Object.assign({}, s2), { decodedToken: c2 });
  }
  async exchangeToken(e3) {
    return this._requestToken({ grant_type: "urn:ietf:params:oauth:grant-type:token-exchange", subject_token: e3.subject_token, subject_token_type: e3.subject_token_type, scope: le(this.scope, e3.scope, e3.audience || this.options.authorizationParams.audience), audience: e3.audience || this.options.authorizationParams.audience, organization: e3.organization || this.options.authorizationParams.organization });
  }
  _assertDpop(e3) {
    if (!e3) throw new Error("`useDpop` option must be enabled before using DPoP.");
  }
  getDpopNonce(e3) {
    return this._assertDpop(this.dpop), this.dpop.getNonce(e3);
  }
  setDpopNonce(e3, t2) {
    return this._assertDpop(this.dpop), this.dpop.setNonce(e3, t2);
  }
  generateDpopProof(e3) {
    return this._assertDpop(this.dpop), this.dpop.generateProof(e3);
  }
  createFetcher() {
    let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return new Ye(e3, { isDpopEnabled: () => !!this.options.useDpop, getAccessToken: (e4) => {
      var t2;
      return this.getTokenSilently({ authorizationParams: { scope: null === (t2 = null == e4 ? void 0 : e4.scope) || void 0 === t2 ? void 0 : t2.join(" "), audience: null == e4 ? void 0 : e4.audience }, detailedResponse: true });
    }, getDpopNonce: () => this.getDpopNonce(e3.dpopNonceId), setDpopNonce: (t2) => this.setDpopNonce(t2, e3.dpopNonceId), generateDpopProof: (e4) => this.generateDpopProof(e4) });
  }
  async connectAccountWithRedirect(e3) {
    const { openUrl: t2, appState: n2, connection: o2, scopes: r2, authorization_params: i2, redirectUri: a2 = this.options.authorizationParams.redirect_uri || window.location.origin } = e3;
    if (!o2) throw new Error("connection is required");
    const s2 = x(O()), c2 = O(), u2 = await K(c2), l2 = U(u2), { connect_uri: d2, connect_params: h2, auth_session: p2 } = await this.myAccountApi.connectAccount({ connection: o2, scopes: r2, redirect_uri: a2, state: s2, code_challenge: l2, code_challenge_method: "S256", authorization_params: i2 });
    this.transactionManager.create({ state: s2, code_verifier: c2, auth_session: p2, redirect_uri: a2, appState: n2, connection: o2, response_type: Oe.ConnectCode });
    const f2 = new URL(d2);
    f2.searchParams.set("ticket", h2.ticket), t2 ? await t2(f2.toString()) : window.location.assign(f2);
  }
};
var initialAuthState = {
  isAuthenticated: false,
  isLoading: true,
  error: void 0,
  user: void 0
};
var stub = function() {
  throw new Error("You forgot to wrap your component in <Auth0Provider>.");
};
var initialContext = __assign(__assign({}, initialAuthState), { buildAuthorizeUrl: stub, buildLogoutUrl: stub, getAccessTokenSilently: stub, getAccessTokenWithPopup: stub, getIdTokenClaims: stub, exchangeToken: stub, loginWithRedirect: stub, loginWithPopup: stub, connectAccountWithRedirect: stub, logout: stub, handleRedirectCallback: stub, getDpopNonce: stub, setDpopNonce: stub, generateDpopProof: stub, createFetcher: stub, getConfiguration: stub });
var Auth0Context = (0, import_react.createContext)(initialContext);
var OAuthError = (
  /** @class */
  function(_super) {
    __extends(OAuthError2, _super);
    function OAuthError2(error, error_description) {
      var _this = _super.call(this, error_description !== null && error_description !== void 0 ? error_description : error) || this;
      _this.error = error;
      _this.error_description = error_description;
      Object.setPrototypeOf(_this, OAuthError2.prototype);
      return _this;
    }
    return OAuthError2;
  }(Error)
);
var CODE_RE = /[?&](?:connect_)?code=[^&]+/;
var STATE_RE = /[?&]state=[^&]+/;
var ERROR_RE = /[?&]error=[^&]+/;
var hasAuthParams = function(searchParams) {
  if (searchParams === void 0) {
    searchParams = window.location.search;
  }
  return (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) && STATE_RE.test(searchParams);
};
var normalizeErrorFn = function(fallbackMessage) {
  return function(error) {
    if (error instanceof Error) {
      return error;
    }
    if (error !== null && typeof error === "object" && "error" in error && typeof error.error === "string") {
      if ("error_description" in error && typeof error.error_description === "string") {
        var e_1 = error;
        return new OAuthError(e_1.error, e_1.error_description);
      }
      var e3 = error;
      return new OAuthError(e3.error);
    }
    return new Error(fallbackMessage);
  };
};
var loginError = normalizeErrorFn("Login failed");
var tokenError = normalizeErrorFn("Get access token failed");
var deprecateRedirectUri = function(options) {
  var _a, _b;
  if (options === null || options === void 0 ? void 0 : options.redirectUri) {
    console.warn("Using `redirectUri` has been deprecated, please use `authorizationParams.redirect_uri` instead as `redirectUri` will be no longer supported in a future version");
    options.authorizationParams = (_a = options.authorizationParams) !== null && _a !== void 0 ? _a : {};
    options.authorizationParams.redirect_uri = options.redirectUri;
    delete options.redirectUri;
  }
  if ((_b = options === null || options === void 0 ? void 0 : options.authorizationParams) === null || _b === void 0 ? void 0 : _b.redirectUri) {
    console.warn("Using `authorizationParams.redirectUri` has been deprecated, please use `authorizationParams.redirect_uri` instead as `authorizationParams.redirectUri` will be removed in a future version");
    options.authorizationParams.redirect_uri = options.authorizationParams.redirectUri;
    delete options.authorizationParams.redirectUri;
  }
};
var reducer = function(state, action) {
  switch (action.type) {
    case "LOGIN_POPUP_STARTED":
      return __assign(__assign({}, state), { isLoading: true });
    case "LOGIN_POPUP_COMPLETE":
    case "INITIALISED":
      return __assign(__assign({}, state), { isAuthenticated: !!action.user, user: action.user, isLoading: false, error: void 0 });
    case "HANDLE_REDIRECT_COMPLETE":
    case "GET_ACCESS_TOKEN_COMPLETE":
      if (state.user === action.user) {
        return state;
      }
      return __assign(__assign({}, state), { isAuthenticated: !!action.user, user: action.user });
    case "LOGOUT":
      return __assign(__assign({}, state), { isAuthenticated: false, user: void 0 });
    case "ERROR":
      return __assign(__assign({}, state), { isLoading: false, error: action.error });
  }
};
var toAuth0ClientOptions = function(opts) {
  deprecateRedirectUri(opts);
  return __assign(__assign({}, opts), { auth0Client: {
    name: "auth0-react",
    version: "2.12.0"
  } });
};
var defaultOnRedirectCallback = function(appState) {
  var _a;
  window.history.replaceState({}, document.title, (_a = appState.returnTo) !== null && _a !== void 0 ? _a : window.location.pathname);
};
var Auth0Provider = function(opts) {
  var children = opts.children, skipRedirectCallback = opts.skipRedirectCallback, _a = opts.onRedirectCallback, onRedirectCallback = _a === void 0 ? defaultOnRedirectCallback : _a, _b = opts.context, context = _b === void 0 ? Auth0Context : _b, clientOpts = __rest(opts, ["children", "skipRedirectCallback", "onRedirectCallback", "context"]);
  var client = (0, import_react.useState)(function() {
    return new Vi(toAuth0ClientOptions(clientOpts));
  })[0];
  var _c = (0, import_react.useReducer)(reducer, initialAuthState), state = _c[0], dispatch = _c[1];
  var didInitialise = (0, import_react.useRef)(false);
  var handleError = (0, import_react.useCallback)(function(error) {
    dispatch({ type: "ERROR", error });
    return error;
  }, []);
  (0, import_react.useEffect)(function() {
    if (didInitialise.current) {
      return;
    }
    didInitialise.current = true;
    (function() {
      return __awaiter(void 0, void 0, void 0, function() {
        var user, _a2, _b2, appState, response_type, result, error_1;
        return __generator(this, function(_c2) {
          switch (_c2.label) {
            case 0:
              _c2.trys.push([0, 7, , 8]);
              user = void 0;
              if (!(hasAuthParams() && !skipRedirectCallback)) return [3, 3];
              return [4, client.handleRedirectCallback()];
            case 1:
              _a2 = _c2.sent(), _b2 = _a2.appState, appState = _b2 === void 0 ? {} : _b2, response_type = _a2.response_type, result = __rest(_a2, ["appState", "response_type"]);
              return [4, client.getUser()];
            case 2:
              user = _c2.sent();
              appState.response_type = response_type;
              if (response_type === Oe.ConnectCode) {
                appState.connectedAccount = result;
              }
              onRedirectCallback(appState, user);
              return [3, 6];
            case 3:
              return [4, client.checkSession()];
            case 4:
              _c2.sent();
              return [4, client.getUser()];
            case 5:
              user = _c2.sent();
              _c2.label = 6;
            case 6:
              dispatch({ type: "INITIALISED", user });
              return [3, 8];
            case 7:
              error_1 = _c2.sent();
              handleError(loginError(error_1));
              return [3, 8];
            case 8:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    })();
  }, [client, onRedirectCallback, skipRedirectCallback, handleError]);
  var loginWithRedirect = (0, import_react.useCallback)(function(opts2) {
    deprecateRedirectUri(opts2);
    return client.loginWithRedirect(opts2);
  }, [client]);
  var loginWithPopup = (0, import_react.useCallback)(function(options, config) {
    return __awaiter(void 0, void 0, void 0, function() {
      var error_2, user;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            dispatch({ type: "LOGIN_POPUP_STARTED" });
            _a2.label = 1;
          case 1:
            _a2.trys.push([1, 3, , 4]);
            return [4, client.loginWithPopup(options, config)];
          case 2:
            _a2.sent();
            return [3, 4];
          case 3:
            error_2 = _a2.sent();
            handleError(loginError(error_2));
            return [
              2
              /*return*/
            ];
          case 4:
            return [4, client.getUser()];
          case 5:
            user = _a2.sent();
            dispatch({ type: "LOGIN_POPUP_COMPLETE", user });
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [client, handleError]);
  var logout = (0, import_react.useCallback)(function() {
    var args_1 = [];
    for (var _i2 = 0; _i2 < arguments.length; _i2++) {
      args_1[_i2] = arguments[_i2];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function(opts2) {
      if (opts2 === void 0) {
        opts2 = {};
      }
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, client.logout(opts2)];
          case 1:
            _a2.sent();
            if (opts2.openUrl || opts2.openUrl === false) {
              dispatch({ type: "LOGOUT" });
            }
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [client]);
  var getAccessTokenSilently = (0, import_react.useCallback)(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function(opts2) {
      return __awaiter(void 0, void 0, void 0, function() {
        var token, error_3, _a2;
        var _b2;
        return __generator(this, function(_c2) {
          switch (_c2.label) {
            case 0:
              _c2.trys.push([0, 2, 3, 5]);
              return [4, client.getTokenSilently(opts2)];
            case 1:
              token = _c2.sent();
              return [3, 5];
            case 2:
              error_3 = _c2.sent();
              throw tokenError(error_3);
            case 3:
              _a2 = dispatch;
              _b2 = {
                type: "GET_ACCESS_TOKEN_COMPLETE"
              };
              return [4, client.getUser()];
            case 4:
              _a2.apply(void 0, [(_b2.user = _c2.sent(), _b2)]);
              return [
                7
                /*endfinally*/
              ];
            case 5:
              return [2, token];
          }
        });
      });
    },
    [client]
  );
  var getAccessTokenWithPopup = (0, import_react.useCallback)(function(opts2, config) {
    return __awaiter(void 0, void 0, void 0, function() {
      var token, error_4, _a2;
      var _b2;
      return __generator(this, function(_c2) {
        switch (_c2.label) {
          case 0:
            _c2.trys.push([0, 2, 3, 5]);
            return [4, client.getTokenWithPopup(opts2, config)];
          case 1:
            token = _c2.sent();
            return [3, 5];
          case 2:
            error_4 = _c2.sent();
            throw tokenError(error_4);
          case 3:
            _a2 = dispatch;
            _b2 = {
              type: "GET_ACCESS_TOKEN_COMPLETE"
            };
            return [4, client.getUser()];
          case 4:
            _a2.apply(void 0, [(_b2.user = _c2.sent(), _b2)]);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [2, token];
        }
      });
    });
  }, [client]);
  var connectAccountWithRedirect = (0, import_react.useCallback)(function(options) {
    return client.connectAccountWithRedirect(options);
  }, [client]);
  var getIdTokenClaims = (0, import_react.useCallback)(function() {
    return client.getIdTokenClaims();
  }, [client]);
  var exchangeToken = (0, import_react.useCallback)(function(options) {
    return __awaiter(void 0, void 0, void 0, function() {
      var tokenResponse, error_5, _a2;
      var _b2;
      return __generator(this, function(_c2) {
        switch (_c2.label) {
          case 0:
            _c2.trys.push([0, 2, 3, 5]);
            return [4, client.exchangeToken(options)];
          case 1:
            tokenResponse = _c2.sent();
            return [3, 5];
          case 2:
            error_5 = _c2.sent();
            throw tokenError(error_5);
          case 3:
            _a2 = dispatch;
            _b2 = {
              type: "GET_ACCESS_TOKEN_COMPLETE"
            };
            return [4, client.getUser()];
          case 4:
            _a2.apply(void 0, [(_b2.user = _c2.sent(), _b2)]);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [2, tokenResponse];
        }
      });
    });
  }, [client]);
  var handleRedirectCallback = (0, import_react.useCallback)(function(url) {
    return __awaiter(void 0, void 0, void 0, function() {
      var error_6, _a2;
      var _b2;
      return __generator(this, function(_c2) {
        switch (_c2.label) {
          case 0:
            _c2.trys.push([0, 2, 3, 5]);
            return [4, client.handleRedirectCallback(url)];
          case 1:
            return [2, _c2.sent()];
          case 2:
            error_6 = _c2.sent();
            throw tokenError(error_6);
          case 3:
            _a2 = dispatch;
            _b2 = {
              type: "HANDLE_REDIRECT_COMPLETE"
            };
            return [4, client.getUser()];
          case 4:
            _a2.apply(void 0, [(_b2.user = _c2.sent(), _b2)]);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }, [client]);
  var getDpopNonce = (0, import_react.useCallback)(function(id) {
    return client.getDpopNonce(id);
  }, [client]);
  var setDpopNonce = (0, import_react.useCallback)(function(nonce, id) {
    return client.setDpopNonce(nonce, id);
  }, [client]);
  var generateDpopProof = (0, import_react.useCallback)(function(params) {
    return client.generateDpopProof(params);
  }, [client]);
  var createFetcher = (0, import_react.useCallback)(function(config) {
    return client.createFetcher(config);
  }, [client]);
  var getConfiguration = (0, import_react.useCallback)(function() {
    return client.getConfiguration();
  }, [client]);
  var contextValue = (0, import_react.useMemo)(function() {
    return __assign(__assign({}, state), { getAccessTokenSilently, getAccessTokenWithPopup, getIdTokenClaims, exchangeToken, loginWithRedirect, loginWithPopup, connectAccountWithRedirect, logout, handleRedirectCallback, getDpopNonce, setDpopNonce, generateDpopProof, createFetcher, getConfiguration });
  }, [
    state,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
    getIdTokenClaims,
    exchangeToken,
    loginWithRedirect,
    loginWithPopup,
    connectAccountWithRedirect,
    logout,
    handleRedirectCallback,
    getDpopNonce,
    setDpopNonce,
    generateDpopProof,
    createFetcher,
    getConfiguration
  ]);
  return import_react.default.createElement(context.Provider, { value: contextValue }, children);
};
var useAuth0 = function(context) {
  if (context === void 0) {
    context = Auth0Context;
  }
  return (0, import_react.useContext)(context);
};
var withAuth0 = function(Component, context) {
  if (context === void 0) {
    context = Auth0Context;
  }
  return function WithAuth(props) {
    return import_react.default.createElement(context.Consumer, null, function(auth) {
      return import_react.default.createElement(Component, __assign({}, props, { auth0: auth }));
    });
  };
};
var defaultOnRedirecting = function() {
  return import_react.default.createElement(import_react.default.Fragment, null);
};
var defaultOnBeforeAuthentication = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      return [
        2
        /*return*/
      ];
    });
  });
};
var defaultReturnTo = function() {
  return "".concat(window.location.pathname).concat(window.location.search);
};
var withAuthenticationRequired = function(Component, options) {
  if (options === void 0) {
    options = {};
  }
  return function WithAuthenticationRequired(props) {
    var _this = this;
    var _a = options.returnTo, returnTo = _a === void 0 ? defaultReturnTo : _a, _b = options.onRedirecting, onRedirecting = _b === void 0 ? defaultOnRedirecting : _b, _c = options.onBeforeAuthentication, onBeforeAuthentication = _c === void 0 ? defaultOnBeforeAuthentication : _c, loginOptions = options.loginOptions, _d = options.context, context = _d === void 0 ? Auth0Context : _d;
    var _e2 = useAuth0(context), isAuthenticated = _e2.isAuthenticated, isLoading = _e2.isLoading, loginWithRedirect = _e2.loginWithRedirect;
    (0, import_react.useEffect)(function() {
      if (isLoading || isAuthenticated) {
        return;
      }
      var opts = __assign(__assign({}, loginOptions), { appState: __assign(__assign({}, loginOptions === null || loginOptions === void 0 ? void 0 : loginOptions.appState), { returnTo: typeof returnTo === "function" ? returnTo() : returnTo }) });
      void function() {
        return __awaiter(_this, void 0, void 0, function() {
          return __generator(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                return [4, onBeforeAuthentication()];
              case 1:
                _a2.sent();
                return [4, loginWithRedirect(opts)];
              case 2:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      }();
    }, [
      isLoading,
      isAuthenticated,
      loginWithRedirect,
      onBeforeAuthentication,
      loginOptions,
      returnTo
    ]);
    return isAuthenticated ? import_react.default.createElement(Component, __assign({}, props)) : onRedirecting();
  };
};
export {
  Auth0Context,
  Auth0Provider,
  g as AuthenticationError,
  v as ConnectError,
  w as GenericError,
  pe as InMemoryCache,
  he as LocalStorageCache,
  E as MfaRequiredError,
  A as MissingRefreshTokenError,
  OAuthError,
  k as PopupCancelledError,
  _ as PopupTimeoutError,
  Oe as ResponseType,
  b as TimeoutError,
  P as UseDpopNonceError,
  xe as User,
  initialContext,
  useAuth0,
  withAuth0,
  withAuthenticationRequired
};
//# sourceMappingURL=@auth0_auth0-react.js.map
