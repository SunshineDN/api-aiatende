const obj = {}

const utm_content = 'asdasjk';
const utm_medium = 'asdasjk';
let utm_source;

const obj_mount = (name, value) => {
  if (value) {
    obj[name] = value;
  }
}

obj_mount('utm_content', utm_content);
obj_mount('utm_medium', utm_medium);
obj_mount('utm_source', utm_source);
