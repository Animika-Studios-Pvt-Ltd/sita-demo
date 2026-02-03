import {
  LinkNode,
  registerLink
} from "./chunk-HAKYVIOZ.js";
import {
  namedSignals
} from "./chunk-Q3WBXKIQ.js";
import "./chunk-EQBNXHVQ.js";
import {
  useLexicalComposerContext
} from "./chunk-INCFV6SQ.js";
import "./chunk-B2O7A4CS.js";
import {
  require_react
} from "./chunk-N4N5IM6X.js";
import {
  __toESM
} from "./chunk-LK32TJAX.js";

// node_modules/@lexical/react/LexicalLinkPlugin.dev.mjs
var import_react = __toESM(require_react(), 1);
function LinkPlugin({
  validateUrl,
  attributes
}) {
  const [editor] = useLexicalComposerContext();
  (0, import_react.useEffect)(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error("LinkPlugin: LinkNode not registered on editor");
    }
  });
  (0, import_react.useEffect)(() => {
    return registerLink(editor, namedSignals({
      attributes,
      validateUrl
    }));
  }, [editor, validateUrl, attributes]);
  return null;
}
export {
  LinkPlugin
};
//# sourceMappingURL=@lexical_react_LexicalLinkPlugin.js.map
