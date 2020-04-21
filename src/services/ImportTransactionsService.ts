import csv from 'csvtojson';
import path from 'path';
import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(file: string): Promise<Request[]> {
    const createTransaction = new CreateTransactionService();
    const filePath = path.join(uploadConfig.directory, file);
    const transactions = await csv().fromFile(filePath);

    async function processArray(array: Request[]): Promise<void> {
      for (const item of array) {
        const { title, type, value, category } = item;

        await createTransaction.execute({
          title,
          type,
          value,
          category,
        });
      }
    }

    await processArray(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
