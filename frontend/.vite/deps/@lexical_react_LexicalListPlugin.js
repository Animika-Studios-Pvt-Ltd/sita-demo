import {
  ListItemNode,
  ListNode,
  registerList,
  registerListStrictIndentTransform
} from "./chunk-POSTMMEK.js";
import "./chunk-Q3WBXKIQ.js";
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

// node_modules/@lexical/react/LexicalListPlugin.dev.mjs
var import_react = __toESM(require_react(), 1);
function useList(editor) {
  (0, import_react.useEffect)(() => {
    return registerList(editor);
  }, [editor]);
}
function ListPlugin({
  hasStrictIndent = false
}) {
  const [editor] = useLexicalComposerContext();
  (0, import_react.useEffect)(() => {
    if (!editor.hasNodes([ListNode, ListItemNode])) {
      throw new Error("ListPlugin: ListNode and/or ListItemNode not registered on editor");
    }
  }, [editor]);
  (0, import_react.useEffect)(() => {
    if (!hasStrictIndent) {
      return;
    }
    return registerListStrictIndentTransform(editor);
  }, [editor, hasStrictIndent]);
  useList(editor);
  return null;
}
export {
  ListPlugin
};
//# sourceMappingURL=@lexical_react_LexicalListPlugin.js.map
