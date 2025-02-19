import mongoose, { Schema } from 'mongoose';

interface IPost extends Document {
    classroom: mongoose.Types.ObjectId;
    content: string;
    quizzes: mongoose.Types.ObjectId[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        classroom: { type: Schema.Types.ObjectId, ref: 'class', required: true },
        content: { type: String, required: true },
        quizzes: [{ type: Schema.Types.ObjectId, ref: 'quiz' }],
        createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);
const Post = mongoose.model<IPost>('post', PostSchema);
export default Post;
