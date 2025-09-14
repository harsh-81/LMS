import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import {User} from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import mongoose from "mongoose";

export const addBook = catchAsyncErrors(async(req, res, next) =>{
     if (!req.body) {
        return next(new ErrorHandler("Request body is missing. Please send data in JSON format.", 400));
    }
    const {title, author, description, price, quantity} = req.body;
    if(!title ||!author || !description || !price || !quantity){
        return next(new ErrorHandler("Please fill all fields.", 400));
    }
    const book = await Book.create({
        title, 
        author,
        description,
        price,
        quantity,
    });
    res.status(201).json({
        success: true,
        message: "Book added succuessfully.",
        book,
    });
});
export const getAllBooks = catchAsyncErrors(async(req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books,
    });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid book ID format", 400));
    }

    const book = await Book.findById(id);

    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    await book.deleteOne();

    res.status(200).json({
        success: true,
        message: "Book deleted successfully."
    });
});
// export const deleteBook = catchAsyncErrors(async(req, res, next) => {
//     const {id} = req.params;
//     const book = await Book.findById(id);
//     if(!book){
//         return next(new ErrorHandler("Book not found.", 404))
//     }
// });