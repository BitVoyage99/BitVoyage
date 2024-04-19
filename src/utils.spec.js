import { describe, it, expect } from 'vitest';
import { increase, decrease } from './utils';

describe('utils.js', () => {
  it('increase()는 count를 1 올려 반환합니다.', () => {
    const given = 7;

    let result = given;
    for (let i = 0; i < 10; i++) {
      result = increase(result);
    }

    expect(result).toBe(17);
  });

  it('decrease()는 count를 1 내려 반환합니다.', () => {
    const given = 7;

    let result = given;
    for (let i = 0; i < 10; i++) {
      result = decrease(result);
    }

    expect(result).toBe(-3);
  });
});
