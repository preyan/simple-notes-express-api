import { CommonValidator } from './common.validator.js';

describe('CommonValidator', () => {
  describe('isEmptyOrUnavailable', () => {
    it('should return false when all formFields are valid', () => {
      const formFields = ['test', 'valid'];
      expect(CommonValidator.isEmptyOrUnavailable(formFields)).toBe(false);
    });

    it('should return true when formFields contains undefined', () => {
      const formFields = ['test', undefined];
      expect(CommonValidator.isEmptyOrUnavailable(formFields)).toBe(true);
    });

    it('should return true when formFields contains null', () => {
      const formFields = ['test', null];
      expect(CommonValidator.isEmptyOrUnavailable(formFields)).toBe(true);
    });

    it('should return true when formFields contains an empty string', () => {
      const formFields = ['test', ''];
      expect(CommonValidator.isEmptyOrUnavailable(formFields)).toBe(true);
    });

    it('should return true when formFields contains a string with only whitespace', () => {
      const formFields = ['test', '   '];
      expect(CommonValidator.isEmptyOrUnavailable(formFields)).toBe(true);
    });

    it('should return true when formFields is an empty array', () => {
      const formFields = [];
      expect(CommonValidator.isEmptyOrUnavailable(formFields)).toBe(true);
    });
  });
});