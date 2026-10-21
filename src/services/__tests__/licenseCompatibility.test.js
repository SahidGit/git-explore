import { describe, it, expect } from 'vitest';
import { checkLicenseCompatibility, normalizeSpdx } from '../../data/licenseCompatibility';

describe('License Compatibility Checker', () => {
  it('normalizes common SPDX identifiers and aliases', () => {
    expect(normalizeSpdx('mit')).toBe('MIT');
    expect(normalizeSpdx('apache-2.0')).toBe('Apache-2.0');
    expect(normalizeSpdx('gplv3')).toBe('GPL-3.0');
    expect(normalizeSpdx('unlicense')).toBe('Unlicense');
    expect(normalizeSpdx(null)).toBeNull();
  });

  it('evaluates identical licenses as directly compatible', () => {
    const result = checkLicenseCompatibility('MIT', 'MIT');
    expect(result.status).toBe('compatible');
    expect(result.badge).toBe('Directly Compatible');
    expect(result.disclaimer).toContain('not constitute legal advice');
  });

  it('permits combining permissive licenses (MIT + Apache-2.0)', () => {
    const result = checkLicenseCompatibility('MIT', 'Apache-2.0');
    expect(result.status).toBe('compatible');
    expect(result.title).toContain('can be included in a Apache-2.0 project');
  });

  it('evaluates permissive into strong copyleft (MIT into GPL-3.0) with copyleft conditions', () => {
    const result = checkLicenseCompatibility('MIT', 'GPL-3.0');
    expect(result.status).toBe('compatible-with-conditions');
    expect(result.badge).toBe('Compatible with Copyleft Terms');
  });

  it('flags Apache-2.0 into GPL-2.0-only as incompatible per FSF documented guidelines', () => {
    const result = checkLicenseCompatibility('Apache-2.0', 'GPL-2.0');
    expect(result.status).toBe('incompatible');
    expect(result.badge).toBe('Incompatible');
    expect(result.basis).toContain('Free Software Foundation');
  });

  it('flags copyleft into permissive as incompatible (GPL-3.0 into MIT)', () => {
    const result = checkLicenseCompatibility('GPL-3.0', 'MIT');
    expect(result.status).toBe('incompatible');
    expect(result.badge).toBe('Copyleft Restriction');
  });

  it('flags unknown or missing licenses for manual review', () => {
    const missing = checkLicenseCompatibility('', 'MIT');
    expect(missing.status).toBe('unknown');
    expect(missing.badge).toBe('Manual Review Required');

    const custom = checkLicenseCompatibility('Custom-Proprietary-v1', 'MIT');
    expect(custom.status).toBe('custom');
    expect(custom.badge).toBe('Custom License Detected');
  });
});
