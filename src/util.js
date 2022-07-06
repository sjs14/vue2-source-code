const tactics = {};
const lifycycles = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
];

lifycycles.forEach((lifycycle) => {
  tactics[lifycycle] = (p, c) => {
    if (c) {
      if (p) {
        return p.concat(c);
      } else {
        return [c];
      }
    } else {
      return p;
    }
  };
});

export function mergeOptions(parent, child) {
  const options = {};
  Object.keys(parent).forEach((key) => {
    mergeField(key);
  });

  Object.keys(child).forEach((key) => {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  });

  function mergeField(key) {
    if (tactics[key]) {
      options[key] = tactics[key](parent[key], child[key]);
    } else {
      options[key] = child[key] || parent[key];
    }
  }

  return options;
}
