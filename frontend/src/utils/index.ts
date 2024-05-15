export function areEqual(a: unknown, b: unknown): boolean {
  // 타입이 다르면 false 반환
  if (typeof a !== typeof b) return false;

  // 기본 타입이면 값 비교
  if (typeof a !== 'object') return a === b;

  // null 체크
  if (a === null || b === null) return a === b;

  // 배열일 경우 길이와 각 요소 비교
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!areEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // 객체일 경우 키와 값 비교
  if (typeof a === 'object' && typeof b === 'object') {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
      if (!areEqual(objA[key], objB[key])) return false;
    }

    return true;
  }

  return false; // 이 외의 경우, 동등하지 않다고 처리
}
