import {describe, expect, test} from '@jest/globals';
import { getFormattedAttemptState } from './wordle-core';

describe('getFormattedAttemptState', () => {
  test('behaves properly with double letter in an attempt but only one of which is in the solution', () => {
    expect(getFormattedAttemptState("pouty")("putty")).toEqual("🟩🟨🟦🟩🟩");
  });

  test('behaves properly with double letter in an attempt but only one of which is in the solution and is misplaced', () => {
    expect(getFormattedAttemptState("pouty")("pttoy")).toEqual("🟩🟨🟦🟨🟩");
  });

  test('behaves properly with scrambled attempt', () => {
    expect(getFormattedAttemptState("pouty")("ytoup")).toEqual("🟨🟨🟨🟨🟨");
  });

  test('behaves properly with perfect attempt', () => {
    expect(getFormattedAttemptState("pouty")("pouty")).toEqual("🟩🟩🟩🟩🟩");
  });

  test('behaves properly with wrong duplicated first', () => {
    expect(getFormattedAttemptState("pouty")("youty")).toEqual("🟦🟩🟩🟩🟩");
  });

  test('behaves properly with wrong duplicated last', () => {
    expect(getFormattedAttemptState("pouty")("poutp")).toEqual("🟩🟩🟩🟩🟦");
  });
});
