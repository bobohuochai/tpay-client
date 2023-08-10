export function useFile(url) {
  const modules = import.meta.globEager("/src/assets/**/*.{png,svg,jpg,jpeg}");
  if (modules[url]) return modules[url].default;
  else {
    console.error("Error url is wrong path");
  }
}
