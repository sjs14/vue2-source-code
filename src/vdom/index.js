export function createElementVNode(vm, tag, props = {}, ...children) {
  const key = props.key;

  if (key) {
    delete props.key;
  }

  return vnode(vm, tag, key, props, children);
}

export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
  };
}
