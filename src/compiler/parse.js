const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;

export const ELEMENT_TYPE = 1;
export const TEXT_TYPE = 3;

export function parseHTML(html) {
  const stack = [];
  let root, currentParent;

  function createAstElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      attrs,
      parent: null,
      children: [],
    };
  }

  function startHandle(tag, attrs) {
    const node = createAstElement(tag, attrs);

    if (currentParent) {
      node.parent = currentParent;
      currentParent.children.push(node);
    }

    if (!root) {
      root = node;
    }

    stack.push(node);
    currentParent = node;
  }

  function charsHandle(text) {
    currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent,
    });
  }

  function endHandle(tag) {
    stack.pop();
    currentParent = stack[stack.length - 1];
  }

  function advance(n) {
    html = html.substring(n);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);

    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };

      startHandle(match.tagName, match.attrs);
      advance(start[0].length);

      let end, attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length);
      }

      if (end) {
        end[1] === "/" && endHandle(start[1]);
        advance(end[0].length);
      }

      return match;
    }

    return false;
  }

  while (html) {
    const textEnd = html.indexOf("<");
    if (textEnd === 0) {
      // 标签开始或者结束位置
      const startTagMatch = parseStartTag();

      if (startTagMatch) {
        continue;
      }

      const endTagMatch = html.match(endTag);

      if (endTagMatch) {
        endHandle(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    } else {
      // 文本节点开始
      let text;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      } else {
        text = html;
      }

      if (text) {
        charsHandle(text);
        advance(text.length);
      }
    }
  }

  return root;
}
