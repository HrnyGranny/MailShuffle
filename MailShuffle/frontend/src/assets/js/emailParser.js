import { computed } from "vue";
import DOMPurify from "dompurify";

/**
 * Configure DOMPurify with security hooks
 */
const configureDOMPurify = () => {
  DOMPurify.addHook("afterSanitizeAttributes", function (node) {
    // Make links open in new tab with security attributes
    if (node.tagName === "A") {
      // Force all links to open in new tab to prevent tabnabbing and app navigation hijacking
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
};

/**
 * Create a sanitized HTML version of an email body
 * @param {Object} email - The email object containing the body
 * @returns {Function} - Computed property that returns sanitized HTML
 */
const useSanitizedBody = (email) => {
  return computed(() => {
    if (!email.value?.body) return "";

    const wrappedBody = `<div class="email-content-wrapper">${email.value.body}</div>`;

    return DOMPurify.sanitize(wrappedBody, {
      ALLOWED_TAGS: [
        "a", "abbr", "acronym", "address", "area", "article", "aside", "b", "bdi", "bdo", "big", "blockquote", "br", "button", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "font", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "img", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "meter", "nav", "ol", "optgroup", "option", "output", "p", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small", "span", "strike", "strong", "sub", "summary", "sup", "style", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "tt", "u", "ul", "var", "wbr"
      ],
      ALLOWED_ATTR: [
        "accept", "action", "align", "alt", "autocomplete", "background", "bgcolor", "border", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "coords", "datetime", "default", "dir", "disabled", "download", "enctype", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "ismap", "label", "lang", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "multiple", "name", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "rules", "scope", "selected", "shape", "size", "span", "spellcheck", "src", "srcset", "start", "step", "style", "summary", "tabindex", "target", "title", "type", "usemap", "valign", "value", "width", "wrap", "aria-*", "data-*"
      ],
      ADD_TAGS: ["style", "meta"],
      ADD_ATTR: ["target", "rel"],
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      FORCE_BODY: true,
      ALLOW_DATA_ATTR: true,
    });
  });
};

/**
 * Get email CSS styles for shadow DOM
 * @returns {string} - CSS styles for the email content
 */
const getEmailStyles = () => {
  return `
    :host {
      all: initial;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #212529;
      line-height: 1.5;
      display: block;
      background-color: #ffffff;
    }

    /* Reset styles to allow email's own styles to work better */
    a { color: #0d6efd; text-decoration: underline; }
    
    /* Ensure images don't overflow */
    img { 
      max-width: 100%; 
      height: auto; 
      vertical-align: middle;
    }

    /* Basic table reset */
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    /* Allow email content to define its own look mostly */
    .email-content-wrapper {
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }
    
    /* Fix for some email clients specific styles */
    [style*="background-image"] {
      background-size: cover !important;
      background-position: center !important;
    }
  `;
};

/**
 * Render email content to shadow DOM
 * @param {Object} shadowContainer - Ref to the DOM element that will host the shadow
 * @param {String} htmlContent - Sanitized HTML content to render
 */
const renderEmailToShadow = (shadowContainer, htmlContent) => {
  if (!shadowContainer) return;

  const shadow =
    shadowContainer.shadowRoot ||
    shadowContainer.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>${getEmailStyles()}</style>
    ${htmlContent}
  `;
};

// Initialize DOMPurify configuration
configureDOMPurify();

export { useSanitizedBody, renderEmailToShadow };