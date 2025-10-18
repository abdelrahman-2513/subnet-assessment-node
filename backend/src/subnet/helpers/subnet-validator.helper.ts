export class SubnetValidator {
  static isValidCidr(cidr: string): boolean {
    if (!cidr || cidr.trim() === '') {
      return false;
    }

    const parts = cidr.split('/');
    if (parts.length !== 2) {
      return false;
    }

    if (!this.isValidIp(parts[0])) {
      return false;
    }

    const prefixLength = parseInt(parts[1]);
    if (isNaN(prefixLength)) {
      return false;
    }

    return prefixLength >= 0 && prefixLength <= 25;
  }

  private static isValidIp(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) {
      return false;
    }

    return parts.every(part => {
      const num = parseInt(part);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  }
}
