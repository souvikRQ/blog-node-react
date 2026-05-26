import { Schema, model, Types } from 'mongoose';
import { CommentStatus } from '@blog/shared-types';

export interface ICommentDocument {
  blog: Types.ObjectId;
  author?: Types.ObjectId;
  guestName?: string;
  guestEmail?: string;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<ICommentDocument>(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    guestName: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'hidden'],
      default: 'approved',
      required: true,
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
commentSchema.index({ blog: 1, status: 1, createdAt: -1 });
commentSchema.index({ blog: 1, author: 1 });

export const CommentModel = model<ICommentDocument>('Comment', commentSchema);
