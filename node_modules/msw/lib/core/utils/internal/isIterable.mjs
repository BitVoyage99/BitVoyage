function isIterable(fn) {
  if (!fn) {
    return false;
  }
  return typeof fn[Symbol.iterator] == "function";
}
export {
  isIterable
};
//# sourceMappingURL=isIterable.mjs.map