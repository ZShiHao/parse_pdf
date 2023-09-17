import mongoose from "mongoose";
import dayjs from "dayjs";
interface BookAttrs {
  title: string;
  author?: string;
  date?: number;
  language: string;
  cover: string;
  createDate?: string;
  updateDate?: string;
  tags?: string[];
  source: {
    format: string;
    size: string;
    pages?: number;
    fileName: string;
    location: string;
  };
  active?: boolean;
  download?: number;
}

interface BookDoc extends mongoose.Document, BookAttrs {}

interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttrs): BookDoc;
}

const bookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: String,
    default: "",
  },
  date: {
    type: Number,
    default: "",
  },
  language: {
    type: String,
    index: true,
  },
  cover: String,
  createDate: {
    type: String,
    default: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  },
  updateDate: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    index: true,
  },
  source: {
    type: [
      {
        format: String,
        size: String,
        pages: Number,
        fileName: String,
        location: String,
      },
    ],
  },
  active: {
    type: Boolean,
    default: true,
  },
  download: {
    type: Number,
    default: 0,
  },
});

bookSchema.pre("save", async function () {
  this.set("updateDate", dayjs().format("YYYY-MM-DD HH:mm:ss"));
});

bookSchema.statics.build = (attrs: BookAttrs) => {
  return new Book(attrs);
};

const Book = mongoose.model<BookDoc, BookModel>("Book", bookSchema);

export { Book,BookAttrs };
