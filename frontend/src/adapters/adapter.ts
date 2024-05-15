class Adapter {
  private static value: unknown;

  static from<Source>(originData: Source) {
    this.value = originData;
    return this;
  }

  static to<Input, Output>(mapperFn: (value: Input) => Output) {
    const transformed = mapperFn(this.value as Input);
    return transformed;
  }
}

export default Adapter;
