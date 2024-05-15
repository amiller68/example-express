import mongoose, { Schema, Document, Types } from 'mongoose';

// Example schema
interface IExample extends Document {
  test: string;
}

const exampleSchema = new Schema({});

export const ExampleSchema = mongoose.model<IExample>(
  'Example',
  exampleSchema
);
