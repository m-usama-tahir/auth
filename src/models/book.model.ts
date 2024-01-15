import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A book must have name!"],
  },
  author: {
    type: String,
    required: [true, "A book must have any author!"],
  },
  price: {
    type: Number,
    min: 3,
    required: [true, "A book mush have price!"],
  },
});

const bookModel = mongoose.model("book", bookSchema);

export default bookModel;
