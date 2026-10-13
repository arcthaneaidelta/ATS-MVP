export class ApiError extends Error {
  public code: string;
  constructor(message: string, code: string = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export class BankConnectionError extends ApiError {
  constructor(message: string = "We couldn't reach your bank. Nothing was saved.") {
    super(message, 'BANK_CONNECTION_FAILED');
  }
}

export class SaveError extends ApiError {
  constructor(message: string = "Couldn't save that. Your data is safe. Try again.") {
    super(message, 'SAVE_FAILED');
  }
}
