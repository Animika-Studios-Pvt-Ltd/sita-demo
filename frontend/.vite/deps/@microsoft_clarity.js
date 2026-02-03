import "./chunk-LK32TJAX.js";

// node_modules/@microsoft/clarity/src/utils.js
function injectScript(projectId) {
  try {
    (function(c, l, a, r, i, t, y) {
      if (l.getElementById("clarity-script")) {
        return;
      }
      c[a] = c[a] || function() {
        (c[a].q = c[a].q || []).push(arguments);
      };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i + "?ref=npm";
      t.id = "clarity-script";
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);
    return;
  } catch (error) {
    return;
  }
}

// node_modules/@microsoft/clarity/index.js
var Clarity = {
  init(projectId) {
    injectScript(projectId, "clarity-script");
  },
  setTag(key, value) {
    window.clarity("set", key, value);
  },
  identify(customerId, customSessionId, customPageId, friendlyName) {
    window.clarity("identify", customerId, customSessionId, customPageId, friendlyName);
  },
  consent(consent = true) {
    window.clarity("consent", consent);
  },
  consentV2(consentOptions = { ad_Storage: "granted", analytics_Storage: "granted" }) {
    window.clarity("consentv2", consentOptions);
  },
  upgrade(reason) {
    window.clarity("upgrade", reason);
  },
  event(eventName) {
    window.clarity("event", eventName);
  }
};
var clarity_default = Clarity;
export {
  clarity_default as default
};
//# sourceMappingURL=@microsoft_clarity.js.map
