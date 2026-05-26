import { Schema, model, Types } from 'mongoose';
import { BlogStatus } from '@blog/shared-types';

export interface IBlogDocument {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: BlogStatus;
  author: Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlogDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        const retObj = ret as any;
        retObj.id = retObj._id.toString();
        delete retObj._id;
        delete retObj.__v;
        return retObj;
      },
    },
  }
);

// Indexes
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ status: 1, publishedAt: -1 });

export const BlogModel = model<IBlogDocument>('Blog', blogSchema);
