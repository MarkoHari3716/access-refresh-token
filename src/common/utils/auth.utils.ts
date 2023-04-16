import * as sha512 from 'crypto-js/sha512';

export class AuthUtils {
  static verifySha512(value: string, hashedValue: string): boolean {
    return this.hashSha512(value) === hashedValue;
  }

  static hashSha512(password: string): string {
    return sha512(password).toString();
  }
}
