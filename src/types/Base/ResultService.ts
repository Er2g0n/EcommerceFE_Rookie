export interface ResultService<T> {

    message: string;
    code: string;
    data: T | null;
  }