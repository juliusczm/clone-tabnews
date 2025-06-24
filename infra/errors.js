export class InternalServerError extends Error {
  constructor({ cause }) {
    super('Um erro interno não esperado aconteceu.', {
      cause,
    });
    this.name = 'InternalServerError';
    this.action = 'Entre em contato com o suporte';
    this.statusCode = 500;
  }

  toJson() {
    return {
      name: this.name,
      messagem: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
