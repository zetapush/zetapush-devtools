import { Injectable } from '@angular/core';
import { getSecureUrl } from '../../utils';
import { NGXLogger } from 'ngx-logger';

const ZBO_VERSION_PATTERN = /ZBO version ([\.-\w]+)/;
function getZboVersion(raw, pattern = ZBO_VERSION_PATTERN) {
  if (pattern.test(raw)) {
    const [, version] = pattern.exec(raw);
    return version;
  } else {
    throw new Error('Invalid ZBO Version');
  }
}

const SEMVER_PATTERN = /(\d).(\d).(\d)/;
function getSemVer(raw, pattern = SEMVER_PATTERN) {
  if (pattern.test(raw)) {
    const [, major, minor, patch] = pattern.exec(raw);
    return {
      major: parseInt(major, 10),
      minor: parseInt(minor, 10),
      patch: parseInt(patch, 10),
    };
  } else {
    throw new Error('Incorrect Semver pattern');
  }
}

@Injectable()
export class VersionService {
  constructor(private logger: NGXLogger) {}
  async assertIsCompatible({ apiUrl }) {
    const compatible = await this.isCompatible({ apiUrl });
    if (!compatible) {
      throw new Error('ZBO Version not compatible with Devtools Version');
    }
  }
  async isCompatible({ apiUrl }): Promise<boolean> {
    try {
      const response = await fetch(getSecureUrl(`${apiUrl}/zbo/`), {
        method: 'GET',
        headers: {
          'Content-Type': 'text/html',
        },
        credentials: 'include',
      });
      const rawVersion = await response.text();
      const target = getSemVer(getZboVersion(rawVersion));
      const current = getSemVer('3.0.0');
      const matchStrictMajor = target.major === current.major;
      const matchStrictMinor = target.minor === current.minor;
      return matchStrictMajor && matchStrictMinor;
    } catch (ex) {
      throw ex;
    }
  }
}
