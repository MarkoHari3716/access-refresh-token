import * as fs from 'fs';

export class FileUtils {
  public static apiDocDict = 'src/common/documentation/api-documentation.json';

  static write(path: string, data: string): void {
    fs.writeFileSync(path, data);
  }
}
