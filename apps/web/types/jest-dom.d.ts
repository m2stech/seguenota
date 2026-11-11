import "vitest";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation via extends
  interface Assertion<R = void, T = unknown>
    extends TestingLibraryMatchers<T, R> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation via extends
  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<unknown, void> {}
}
