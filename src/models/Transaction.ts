import { Schema, model, Document } from 'mongoose';

interface ITransaction extends Document {
  bookId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  issueDate: Date;
  returnDate?: Date;
  totalRent?: number; 
}

const transactionSchema = new Schema<ITransaction>({
  bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  totalRent: { type: Number, default: 0 }, 
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
