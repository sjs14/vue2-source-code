import { ELEMENT_TYPE, parseHTML, TEXT_TYPE } from "./parse";
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function toS(str) {
  return JSON.stringify(str);
}

function genElement(ast) {
  let code = `_c(${toS(ast.tag)},{${ast.attrs ? genProps(ast.attrs) : ""}}${
    ast.children && ast.children.length > 0
      ? `,${ast.children.map((item) => codeGen(item)).join(",")}`
      : ""
  })`;
  return code;
}

function genProps(obj) {
  let propsStrArr = [];

  obj.forEach(({ name, value }) => {
    switch (name) {
      case "style":
        let styleStrArr = [];
        value.split(";").forEach((item) => {
          const [cssname, cssvalue] = item.split(":");
          styleStrArr.push(`${toS(cssname.trim())}:${toS(cssvalue.trim())}`);
        });

        propsStrArr.push(`"style":{${styleStrArr.join(",")}}`);

        break;

      default:
        propsStrArr.push(
          `${toS(name.trim())}:${toS(
            value ?? "" === "" ? value : value.trim()
          )}`
        );
        break;
    }
  });

  return propsStrArr.join(",");
}
function codeGen(ast) {
  let code;

  if (ast.type === ELEMENT_TYPE) {
    code = genElement(ast);
  }

  if (ast.type === TEXT_TYPE) {
    const text = ast.text;
    const tokens = [];
    let token;

    let lastIndex = 0;

    defaultTagRE.lastIndex = 0;
    while ((token = defaultTagRE.exec(text))) {

      const curIndex = token.index;
      if (curIndex > lastIndex) {
        tokens.push(toS(text.slice(lastIndex, curIndex)));
      }

      tokens.push(`_s(${token[1].trim()})`);

      lastIndex = curIndex+token[0].length;
    }

    if (lastIndex < text.length) {
      tokens.push(toS(text.slice(lastIndex)));
    }

    code = `_v(${tokens.join("+")})`;
  }

  return code;
}

export const compileToFunction = function (html) {
  const ast = parseHTML(html);

 const code =  codeGen(ast);
 return new Function(`with(this){ return ${code}}`)
};
