import prism from "prismjs";
import "prismjs/components/prism-markup";

/**
 * Highlights code using PrismJS
 * @param {string} code - The code to highlight
 * @returns {string} - The highlighted HTML string
 */
export const highlightCode = (code) => {
  return prism.highlight(code, prism.languages.html || prism.languages.markup, "html");
};

/**
 * Formats HTML code with proper indentation and line wrapping
 * @param {string} html - The HTML string to format
 * @returns {string} - The formatted HTML string
 */
export const formatHTML = (html) => {
  if (!html) return "";

  const tab = '  '; // 2 spaces indentation
  const maxLineLength = 80; // Character limit for text wrapping
  let result = '';
  let indentLevel = 0;
  
  const voidElements = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
    'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype', 'doctype'
  ];

  // Normalize whitespace: replace newlines and tabs with spaces, collapse multiple spaces
  const normalizedHtml = html.replace(/\s+/g, ' ').trim();

  // Tokenize: Split by tags
  const tokens = normalizedHtml.split(/(<!--[\s\S]*?-->|<\/[^>]+>|<[^>]+\/>|<[^>]+>)/g)
                               .map(t => t.trim())
                               .filter(t => t.length > 0);

  for (const token of tokens) {
    const isTag = token.startsWith('<');
    const isComment = token.startsWith('<!--');
    const isClosing = token.startsWith('</');
    const isSelfClosing = token.endsWith('/>');
    
    // Determine if it's an opening tag that needs indentation increase
    let isOpening = isTag && !isClosing && !isComment && !isSelfClosing;
    
    if (isOpening) {
      const tagNameMatch = token.match(/^<([a-zA-Z0-9\-!]+)/);
      if (tagNameMatch) {
        const tagName = tagNameMatch[1].toLowerCase();
        if (voidElements.includes(tagName)) {
          isOpening = false;
        }
      }
    }

    // Decrease indentation BEFORE printing a closing tag
    if (isClosing) {
      if (indentLevel > 0) indentLevel--;
    }

    const currentIndent = tab.repeat(indentLevel);

    if (!isTag) {
      // Text content handling with wrapping
      const words = token.split(' ');
      let currentLine = "";
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        // If it's the first word of the block, we just start
        if (currentLine === "") {
          currentLine = word;
        } else {
          // Check length INCLUDING indentation
          if (currentIndent.length + currentLine.length + 1 + word.length > maxLineLength) {
            result += currentIndent + currentLine + '\n';
            currentLine = word;
          } else {
            currentLine += " " + word;
          }
        }
      }
      // Print the last remaining line
      if (currentLine.length > 0) {
        result += currentIndent + currentLine + '\n';
      }
      
    } else {
      // Tag handling - also check for very long tags (like with many attributes or long URLs)
      if (token.length > maxLineLength) {
         // Simple wrapping for long tags: just print them indented. 
         // Advanced attribute wrapping could be added here but might be risky for HTML validity if not careful.
         // For now, we ensure the tag itself starts indented.
         result += currentIndent + token + '\n';
      } else {
         result += currentIndent + token + '\n';
      }
    }

    // Increase indentation AFTER printing an opening tag
    if (isOpening) {
      indentLevel++;
    }
  }

  return result.trim();
};
