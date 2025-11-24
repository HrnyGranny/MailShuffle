import { computed } from "vue";
import DOMPurify from "dompurify";

/**
 * Configure DOMPurify with security hooks
 */
const configureDOMPurify = () => {
  DOMPurify.addHook("afterSanitizeAttributes", function (node) {
    // Make links open in new tab with security attributes
    if (node.tagName === "A") {
      if (node.hasAttribute("target")) {
        node.setAttribute("rel", "noopener noreferrer");
      } else {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    }

    // Add accessibility and styling to images
    if (node.tagName === "IMG") {
      if (!node.hasAttribute("alt")) {
        node.setAttribute("alt", "Email image");
      }
      node.classList.add("img-fluid");
    }

    // Add Bootstrap styling to tables
    if (node.tagName === "TABLE") {
      node.classList.add("table");
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
        "a",
        "b",
        "blockquote",
        "br",
        "caption",
        "code",
        "div",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "i",
        "img",
        "li",
        "nl",
        "ol",
        "p",
        "pre",
        "span",
        "strike",
        "strong",
        "sub",
        "sup",
        "table",
        "tbody",
        "td",
        "th",
        "thead",
        "tr",
        "u",
        "ul",
        "font",
        "center",
        "style",
        "section",
        "article",
        "header",
        "footer",
      ],
      ALLOWED_ATTR: [
        "align",
        "alt",
        "bgcolor",
        "border",
        "cellpadding",
        "cellspacing",
        "class",
        "color",
        "colspan",
        "data-*",
        "dir",
        "height",
        "href",
        "id",
        "lang",
        "name",
        "rowspan",
        "scope",
        "size",
        "span",
        "src",
        "start",
        "style",
        "target",
        "title",
        "type",
        "valign",
        "width",
        "rel",
        "background",
        "role",
        "aria-*",
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
      font-family: var(--bs-font-sans-serif);
      color: #212529;
      line-height: 1.5;
    }

    a { 
      color: #0d6efd; 
      text-decoration: none;
      transition: color 0.2s ease;
    }
    a:hover { 
      text-decoration: underline;
      color: #0a58ca;
    }

    img { 
      max-width: 100%; 
      height: auto; 
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    table {
      width: 100%;
      table-layout: auto;
      border-collapse: collapse;
      margin-bottom: 1rem;
      border-radius: 4px;
      overflow: hidden;
    }

    th, td {
      padding: 0.75rem;
      vertical-align: top;
      border-top: 1px solid #dee2e6;
    }

    thead th {
      vertical-align: bottom;
      border-bottom: 2px solid #dee2e6;
      background-color: rgba(0,0,0,0.02);
    }

    blockquote {
      border-left: 4px solid #98fe98;
      margin-left: 0;
      padding: 0.5rem 0 0.5rem 1rem;
      color: #495057;
      background-color: rgba(152, 254, 152, 0.05);
      border-radius: 0 4px 4px 0;
    }

    code {
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875em;
      color: #d63384;
      padding: 0.2em 0.4em;
      background-color: rgba(0,0,0,0.05);
      border-radius: 3px;
    }

    pre {
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 1rem;
      margin-bottom: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
      overflow: auto;
    }

    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 500;
      line-height: 1.2;
      color: #212529;
    }

    p {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    ul, ol {
      padding-left: 2rem;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    hr {
      margin: 1.5rem 0;
      color: #dee2e6;
      opacity: 0.25;
    }

    .email-content-wrapper * {
      max-width: 100%;
      box-sizing: border-box;
    }

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
