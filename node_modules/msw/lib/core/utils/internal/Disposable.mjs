class Disposable {
  subscriptions = [];
  async dispose() {
    await Promise.all(this.subscriptions.map((subscription) => subscription()));
  }
}
export {
  Disposable
};
//# sourceMappingURL=Disposable.mjs.map