/**
 * Determines if the given function is an iterator.
 */
declare function isIterable<IteratorType>(fn: any): fn is Generator<IteratorType, IteratorType, IteratorType>;

export { isIterable };
