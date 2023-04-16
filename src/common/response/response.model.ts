import { HttpStatus } from '@nestjs/common';

export class ResponseModel {
  code: number;
  type: string;
  message: string;
  data?: any;

  constructor(_code: number, _message: string, _data?: any) {
    this.code = _code;
    this.type = this.formatType(_code);
    this.message = _message;
    this.data = _data;
  }

  private formatType(code): string {
    const type = HttpStatus[code];
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
