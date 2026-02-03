import {
  require_jsx_runtime
} from "./chunk-GGADGINT.js";
import {
  require_react
} from "./chunk-N4N5IM6X.js";
import {
  __toESM
} from "./chunk-LK32TJAX.js";

// node_modules/react-error-boundary/dist/react-error-boundary.js
var import_react = __toESM(require_react());
var h = (0, import_react.createContext)(null);
var c = {
  didCatch: false,
  error: null
};
var m = class extends import_react.Component {
  constructor(e) {
    super(e), this.resetErrorBoundary = this.resetErrorBoundary.bind(this), this.state = c;
  }
  static getDerivedStateFromError(e) {
    return { didCatch: true, error: e };
  }
  resetErrorBoundary(...e) {
    var _a, _b;
    const { error: t } = this.state;
    t !== null && ((_b = (_a = this.props).onReset) == null ? void 0 : _b.call(_a, {
      args: e,
      reason: "imperative-api"
    }), this.setState(c));
  }
  componentDidCatch(e, t) {
    var _a, _b;
    (_b = (_a = this.props).onError) == null ? void 0 : _b.call(_a, e, t);
  }
  componentDidUpdate(e, t) {
    var _a, _b;
    const { didCatch: o } = this.state, { resetKeys: s } = this.props;
    o && t.error !== null && C(e.resetKeys, s) && ((_b = (_a = this.props).onReset) == null ? void 0 : _b.call(_a, {
      next: s,
      prev: e.resetKeys,
      reason: "keys"
    }), this.setState(c));
  }
  render() {
    const { children: e, fallbackRender: t, FallbackComponent: o, fallback: s } = this.props, { didCatch: n, error: a } = this.state;
    let i = e;
    if (n) {
      const u = {
        error: a,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (typeof t == "function")
        i = t(u);
      else if (o)
        i = (0, import_react.createElement)(o, u);
      else if (s !== void 0)
        i = s;
      else
        throw a;
    }
    return (0, import_react.createElement)(
      h.Provider,
      {
        value: {
          didCatch: n,
          error: a,
          resetErrorBoundary: this.resetErrorBoundary
        }
      },
      i
    );
  }
};
function C(r = [], e = []) {
  return r.length !== e.length || r.some((t, o) => !Object.is(t, e[o]));
}

// node_modules/@lexical/react/LexicalErrorBoundary.dev.mjs
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function LexicalErrorBoundary({
  children,
  onError
}) {
  return (0, import_jsx_runtime.jsx)(m, {
    fallback: (0, import_jsx_runtime.jsx)("div", {
      style: {
        border: "1px solid #f00",
        color: "#f00",
        padding: "8px"
      },
      children: "An error was thrown."
    }),
    onError,
    children
  });
}
export {
  LexicalErrorBoundary
};
//# sourceMappingURL=@lexical_react_LexicalErrorBoundary.js.map
