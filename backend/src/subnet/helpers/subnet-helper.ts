export class SubnetHelper {
  static generateIpsFromCidr(cidr: string): string[] {
    const parts = cidr.split('/');
    const baseIp = parts[0];
    const prefix = parseInt(parts[1]);

    const baseAddress = this.ipToNumber(baseIp);
    const hostBits = 32 - prefix;
    const numberOfIps = Math.pow(2, hostBits);

    const ips: string[] = [];
    for (let i = 1; i < numberOfIps - 1; i++) {
      const newIp = baseAddress + i;
      ips.push(this.numberToIp(newIp));
    }

    return ips;
  }

  private static ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  }

  private static numberToIp(num: number): string {
    return [
      (num >>> 24) & 0xff,
      (num >>> 16) & 0xff,
      (num >>> 8) & 0xff,
      num & 0xff
    ].join('.');
  }
}
