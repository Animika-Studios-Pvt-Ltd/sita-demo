import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useFetchAllBooksQuery, useDeleteBookMutation } from "../../../redux/features/books/booksApi";
import axios from "axios";
import InputField from "../manageBooks/InputField";
import getBaseUrl from "../../../utils/baseURL";
import Loading from "../../../components/Loading";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch } from "react-redux";
import { updateCartProductDetails } from "../../../redux/features/cart/cartSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
};
const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
const roundMoney = (n) => Math.max(0, Math.round(n));
const roundPct = (n) => clamp(Math.round(n), 0, 100);

const roundWeightToNearest10 = (weight) => {
    const num = parseFloat(weight);
    if (!Number.isFinite(num) || num <= 0) return 0;
    return Math.ceil(num / 10) * 10;
};

const ManageBooks = () => {
    const [viewMode, setViewMode] = useState("list");
    const { data: books, refetch } = useFetchAllBooksQuery();
    const [deleteBook] = useDeleteBookMutation();
    const dispatch = useDispatch();
    const [editingBookId, setEditingBookId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);
    const navigate = useNavigate();
    const [ebookFile, setEbookFile] = useState(null);
    const [chapters, setChapters] = useState([{ title: "", description: "" }]);


    const { register, handleSubmit, reset, setValue, watch, getValues } = useForm({
        defaultValues: {
            title: '',
            subtitle: '',
            author: '',
            aboutBook: '',
            description: '',
            coverImage: null,
            backImage: null,
            oldPrice: '',
            newPrice: '',
            discount: '',
            language: '',
            binding: '',
            publisher: '',
            isbn: '',
            publishingDate: '',
            pages: '',
            height: '',
            width: '',
            length: '',
            weight: '',
            stock: 100,
            ebookType: 'none',
            ebookFile: null,
            ipfsCID: '',
        },
    });


    const [lastEdited, setLastEdited] = useState(null);
    const oldPrice = toNum(watch("oldPrice"));
    const newPrice = toNum(watch("newPrice"));
    const discount = toNum(watch("discount"));
    const coverImageFile = watch("coverImage");
    const backImageFile = watch("backImage");
    const weightValue = watch("weight");

    useEffect(() => {
        if (coverImageFile && coverImageFile[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setCoverImagePreview(reader.result);
            reader.readAsDataURL(coverImageFile[0]);
        }
    }, [coverImageFile]);

    useEffect(() => {
        if (backImageFile && backImageFile[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setBackImagePreview(reader.result);
            reader.readAsDataURL(backImageFile[0]);
        }
    }, [backImageFile]);

    const handleOldPriceChange = (e) => {
        setLastEdited("oldPrice");
        const oldP = toNum(e.target.value);
        const disc = toNum(getValues("discount"));
        const np = toNum(getValues("newPrice"));
        if (disc > 0) {
            const calcNew = roundMoney(oldP * (1 - disc / 100));
            setValue("newPrice", calcNew, { shouldDirty: true });
        }
        else if (np > 0) {
            const calcDisc = roundPct(((oldP - np) / (oldP || 1)) * 100);
            setValue("discount", calcDisc, { shouldDirty: true });
        }
    };

    const handleDiscountChange = (e) => {
        setLastEdited("discount");
        const disc = clamp(toNum(e.target.value), 0, 100);
        const oldP = toNum(getValues("oldPrice"));
        if (oldP > 0) {
            const calcNew = roundMoney(oldP * (1 - disc / 100));
            setValue("discount", disc, { shouldDirty: true });
            setValue("newPrice", calcNew, { shouldDirty: true });
        }
    };
    const handleChapterChange = (index, field, value) => {
        const updated = [...chapters];
        updated[index][field] = value;
        setChapters(updated);
    };

    const handleAddChapter = () => {
        setChapters([...chapters, { title: "", description: "" }]);
    };

    const handleRemoveChapter = (index) => {
        const updated = [...chapters];
        updated.splice(index, 1);
        setChapters(updated);
    };


    const handleNewPriceChange = (e) => {
        setLastEdited("newPrice");
        const np = toNum(e.target.value);
        const oldP = toNum(getValues("oldPrice"));
        if (oldP > 0) {
            const calcDisc = roundPct(((oldP - np) / oldP) * 100);
            setValue("newPrice", np, { shouldDirty: true });
            setValue("discount", calcDisc, { shouldDirty: true });
        }
    };

    const handleWeightBlur = (e) => {
        const inputWeight = e.target.value;
        if (inputWeight) {
            const rounded = roundWeightToNearest10(inputWeight);
            setValue("weight", rounded, { shouldDirty: true });
        }
    };

    const handleSuspendBook = async (book) => {
        const action = book.suspended ? "unsuspend" : "suspend";
        const result = await Swal.fire({
            title: `Are you sure you want to ${action} this book?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: action === "suspend" ? "Yes, suspend!" : "Yes, unsuspend!"
        });
        if (!result.isConfirmed) return;
        try {
            await axios.put(
                `${getBaseUrl()}/api/books/${action}/${book._id}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            Swal.fire("Success", `Book ${action}ed successfully`, "success");
            refetch();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to update book status", "error");
        }
    };

    useEffect(() => {
        if (!oldPrice) {
            if (lastEdited === "discount") setValue("newPrice", "", { shouldDirty: true });
            else if (lastEdited === "newPrice") setValue("discount", "", { shouldDirty: true });
        }
    }, [oldPrice]);

    useEffect(() => {
        if (editingBookId) {
            axios.get(`${getBaseUrl()}/api/books/${editingBookId}`)
                .then(({ data }) => {
                    Object.keys(data).forEach((key) => {
                        if (key !== "coverImage" && key !== "backImage" && key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
                            setValue(key, data[key] || "");
                        }
                    });
                    if (data.coverImage) setCoverImagePreview(data.coverImage);
                    if (data.backImage) setBackImagePreview(data.backImage);

                    // Set chapters
                    if (data.chapters && Array.isArray(data.chapters) && data.chapters.length > 0) {
                        setChapters(data.chapters);
                    } else {
                        setChapters([{ title: "", description: "" }]);
                    }
                    setViewMode("form");
                })
                .catch((err) => console.error(err));
        }
    }, [editingBookId, setValue]);

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const requiredWidth = 290;
            const requiredHeight = 435;
            const withinRange =
                Math.abs(img.width - requiredWidth) <= 25 &&
                Math.abs(img.height - requiredHeight) <= 25;

            if (!withinRange) {
                Swal.fire({
                    icon: "warning",
                    title: "Image Size Warning",
                    html: `
                        <p>Recommended: <b>${requiredWidth} × ${requiredHeight}px</b></p>
                        <p>You uploaded: <b>${img.width} × ${img.height}px</b></p>
                        <p>Do you want to use this image anyway?</p>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Yes, use it",
                    cancelButtonText: "No, re-upload",
                }).then((result) => {
                    if (!result.isConfirmed) {
                        e.target.value = "";
                        return;
                    }
                });
            }

            if (type === "cover") {
                setCoverImagePreview(URL.createObjectURL(file));
                setValue("coverImage", [file]);
            } else if (type === "back") {
                setBackImagePreview(URL.createObjectURL(file));
                setValue("backImage", [file]);
            }
        };
    };

    const onSubmit = async (data) => {
        const roundedWeight = roundWeightToNearest10(data.weight);
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('subtitle', data.subtitle);
            formData.append('author', data.author);
            formData.append('aboutBook', data.aboutBook);
            formData.append('description', data.description);
            formData.append('oldPrice', toNum(data.oldPrice));
            formData.append('newPrice', toNum(data.newPrice));
            formData.append('discount', toNum(data.discount));
            formData.append('language', data.language);
            formData.append('binding', data.binding);
            formData.append('publisher', data.publisher);
            formData.append('isbn', data.isbn);
            formData.append('publishingDate', data.publishingDate);
            formData.append('pages', toNum(data.pages));
            formData.append('height', toNum(data.height));
            formData.append('width', toNum(data.width));
            formData.append('length', toNum(data.length));
            formData.append('weight', roundedWeight);
            formData.append('stock', toNum(data.stock) || 100);
            formData.append("chapters", JSON.stringify(chapters));

            if (data.coverImage && data.coverImage[0]) {
                formData.append('coverImage', data.coverImage[0]);
            }
            if (data.backImage && data.backImage[0]) {
                formData.append('backImage', data.backImage[0]);
            }

            formData.append('ebookType', data.ebookType || 'none');

            if (data.ebookType === 'local' && data.ebookFile && data.ebookFile[0]) {
                formData.append('ebookFile', data.ebookFile[0]);
            }

            if (data.ebookType === 'ipfs' && data.ipfsCID) {
                formData.append('ipfsCID', data.ipfsCID);
            }

            if (editingBookId) {
                await axios.put(`${getBaseUrl()}/api/books/edit/${editingBookId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (data.chapters && Array.isArray(data.chapters)) {
                    setChapters(data.chapters);
                } else {
                    setChapters([{ title: "", description: "" }]);
                }

                dispatch(updateCartProductDetails({
                    id: editingBookId,
                    oldPrice: toNum(data.oldPrice),
                    newPrice: toNum(data.newPrice),
                    discount: toNum(data.discount),
                    stock: toNum(data.stock) || 100,
                }));

                Swal.fire('Book Updated', 'Book updated successfully!', 'success');
            } else {
                await axios.post(`${getBaseUrl()}/api/books/create-book`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                Swal.fire('Book Added', 'Book added successfully!', 'success');
            }

            reset();
            setCoverImagePreview(null);
            setBackImagePreview(null);
            setEditingBookId(null);
            setViewMode('list');
            refetch();

        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to save book. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBook = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This book will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });
        if (!result.isConfirmed) return;
        try {
            await deleteBook(id).unwrap();
            Swal.fire("Deleted!", "Book deleted successfully.", "success");
            refetch();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to delete book. Please try again.", "error");
        }
    };

    const handleEditBook = (bookId) => {
        setEditingBookId(bookId);
    };

    return (
        <div className="container mt-[40px]">
            <div className="max-w-8xl mx-auto rounded-lg">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 transition-all duration-300 text-white font-medium rounded-[6px] px-2 py-1"
                >
                    <ArrowBackIcon className="w-2 h-2" />
                    Back
                </button>
                <div className="relative flex justify-center mb-8 bg-gray-200 rounded-full p-1 max-w-md mx-auto shadow-inner">
                    <div className={`absolute top-1 left-1 w-1/2 h-10 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 rounded-full shadow-md transform transition-transform duration-300 ${viewMode === "form" ? "translate-x-full" : ""}`}></div>
                    <button
                        className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "list" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"}`}
                        onClick={() => {
                            setViewMode("list");
                            setEditingBookId(null);
                            reset();
                            setCoverImagePreview(null);
                            setBackImagePreview(null);
                        }}
                    >
                        <MenuBookIcon /> View Books
                    </button>
                    <button
                        className={`relative flex-1 py-2 flex items-center justify-center gap-2 rounded-full font-semibold text-md transition-all duration-300 transform ${viewMode === "form" ? "text-white" : "text-gray-700 hover:text-gray-900 hover:scale-105"}`}
                        onClick={() => {
                            setViewMode("form");
                            setEditingBookId(null);
                            reset();
                            setCoverImagePreview(null);
                            setBackImagePreview(null);
                        }}
                    >
                        <FiEdit /> Add Book
                    </button>
                </div>

                {viewMode === "form" && (
                    <div className="container">
                        <div className="mt-[50px]">
                            <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                                    {editingBookId ? "Edit Book" : "Add New Book"}
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <InputField label="Title" name="title" register={register} placeholder="Enter book title" required />
                                    <InputField label="Sub Title" name="subtitle" register={register} placeholder="Enter book sub title" />
                                    <InputField label="Author" name="author" register={register} placeholder="Enter author name" required />
                                    <InputField label="Short Description" name="aboutBook" register={register} placeholder="Short description" type="textarea" />
                                    <InputField label="Detailed Description" name="description" register={register} placeholder="Enter description" type="textarea" required />
                                    <div className="mt-4 p-3 rounded-lg border-2 ">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Chapters
                                        </label>

                                        {chapters.map((chapter, index) => (
                                            <div key={index} className="mb-2 p-2 border border-gray-200 rounded-md bg-white">
                                                <div className="flex justify-between items-center mb-2">


                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Chapters {index + 1}
                                                    </label>
                                                    {chapters.length > 1 && (
                                                        <button
                                                            onClick={() => handleRemoveChapter(index)}
                                                            className="flex items-center gap-1 px-3 py-1 rounded-full text-white font-light bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 transition-all duration-300"
                                                        >
                                                            <FiTrash2 /> Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={chapter.title}
                                                    onChange={(e) => handleChapterChange(index, "title", e.target.value)}
                                                    placeholder="Chapter Title"
                                                    className="w-full mb-2 px-3 py-2 border rounded-md"
                                                />

                                                <textarea
                                                    value={chapter.description}
                                                    onChange={(e) => handleChapterChange(index, "description", e.target.value)}
                                                    placeholder="Chapter Description"
                                                    rows={3}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddChapter}
                                            className="mt-0 bg-gradient-to-r font-light from-purple-600 to-purple-800 hover:from-purple-800 hover:to-purple-600 text-white px-3 py-1 rounded-full"
                                        >
                                            + Add Chapter
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Book Front Cover Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, "cover")}
                                                className="w-full border rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md 
                                                file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
                                                hover:file:bg-blue-100"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Recommended size: <span className="font-semibold">290 × 435 px</span>
                                            </p>
                                            {coverImagePreview && (
                                                <img
                                                    src={coverImagePreview}
                                                    alt="Cover preview"
                                                    className="w-[150px] h-[200px] mt-2 object-contain border rounded"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Book Back Cover Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, "back")}
                                                className="w-full border rounded-md px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md 
                                                file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Recommended size: <span className="font-semibold">290 × 435 px</span>
                                            </p>
                                            {backImagePreview && (
                                                <img
                                                    src={backImagePreview}
                                                    alt="Back preview"
                                                    className="w-[150px] h-[200px] mt-2 object-contain border rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                <span>📚</span> eBook Settings (Optional)
                                            </h3>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2 text-gray-700">
                                                    Upload eBook File (.epub)
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".epub"
                                                    onChange={(e) => setEbookFile(e.target.files[0])}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                                {ebookFile && (
                                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                                                        <span>✅</span> Selected: {ebookFile.name}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    💡 Upload an EPUB file to make this book available as an eBook
                                                </p>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Language" name="language" register={register} placeholder="Enter language" />
                                        <InputField label="Binding" name="binding" register={register} placeholder="Enter binding" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Publisher" name="publisher" register={register} placeholder="Enter publisher" />
                                        <InputField label="ISBN" name="isbn" register={register} placeholder="Enter ISBN" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Publishing Date" name="publishingDate" register={register} type="date" />
                                        <InputField label="Pages" name="pages" register={register} type="number" placeholder="Enter pages" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Height (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                placeholder="0.0"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("height")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Width (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                placeholder="0.0"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("width")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Length (cm)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                placeholder="0.0"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("length")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Weight (grams)
                                                {weightValue && (
                                                    <span className="ml-2 text-blue-600 text-xs">
                                                        → {roundWeightToNearest10(weightValue)}g
                                                    </span>
                                                )}
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                placeholder="0"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("weight")}
                                                onBlur={handleWeightBlur}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">

                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Actual Price (₹)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                placeholder="0"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("oldPrice", { onChange: handleOldPriceChange })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Offer Price (₹)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                placeholder="0"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("newPrice", { onChange: handleNewPriceChange })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                inputMode="numeric"
                                                className="w-full border rounded-md px-3 py-2"
                                                {...register("discount", { onChange: handleDiscountChange })}
                                            />
                                        </div>
                                    </div>

                                    {oldPrice > 0 && (newPrice > 0 || discount > 0) && (
                                        <p className="mt-3 text-md text-gray-700">
                                            Final Price: <span className="font-semibold text-green-600">₹{newPrice || 0}</span>
                                            {discount > 0 && (
                                                <span className="ml-2 text-red-500 font-semibold">({roundPct(discount)}% OFF)</span>
                                            )}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`py-2 mt-4 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 transition-all duration-300 rounded-full transition text-white font-regular px-7 flex items-center justify-center gap-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                </svg>
                                                {editingBookId ? "Updating..." : "Adding..."}
                                            </>
                                        ) : (
                                            editingBookId ? "Update Book" : "Add Book"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="container mt-[50px]">
                        <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Book List</h2>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                                            <th className="px-6 py-3 text-left">#</th>
                                            <th className="px-6 py-3 text-left">Book Title</th>
                                            <th className="px-6 py-3 text-center align-middle">Price</th>
                                            <th className="px-6 py-3 text-left">Stock</th>
                                            <th className="px-6 py-3 text-center align-middle">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books && books.length > 0 ? (
                                            books.map((book, index) => (
                                                <tr key={book._id} className="border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                                                    <td className="px-6 py-4 text-sm">{book.title}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        {book.oldPrice && book.discount > 0 ? (
                                                            <div>
                                                                <span className="text-gray-400 line-through mr-2">₹{book.oldPrice}</span>
                                                                <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                                                <span className="ml-2 text-red-500 font-semibold">({book.discount}% OFF)</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`${book.stock < 10 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                                                            {book.stock || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm space-x-4 flex items-center">
                                                        <button
                                                            onClick={() => handleEditBook(book._id)}
                                                            className="flex items-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300"
                                                        >
                                                            <FiEdit /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleSuspendBook(book)}
                                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r ${book.suspended
                                                                ? "from-teal-500 to-teal-700 hover:from-teal-700 hover:to-teal-500"
                                                                : "from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400"
                                                                } transition-all duration-300`}
                                                        >
                                                            {book.suspended ? "Unsuspend" : "Suspend"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBook(book._id)}
                                                            className="flex items-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 transition-all duration-300"
                                                        >
                                                            <FiTrash2 /> Delete
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-6 text-gray-500">No books available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                {books && books.length > 0 ? (
                                    books.map((book, index) => (
                                        <div
                                            key={book._id}
                                            className="bg-gray-50 p-4 rounded-lg shadow flex flex-col space-y-2"
                                        >
                                            <div className="font-semibold text-sm">
                                                {index + 1}. {book.title}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                {book.oldPrice && book.discount > 0 ? (
                                                    <>
                                                        <span className="line-through text-gray-400 mr-1">
                                                            ₹{book.oldPrice}
                                                        </span>
                                                        <span className="text-green-600 font-semibold">
                                                            ₹{book.newPrice}
                                                        </span>
                                                        <span className="ml-1 text-red-500 font-semibold">
                                                            ({book.discount}% OFF)
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-green-600 font-semibold">
                                                        ₹{book.newPrice}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-sm">
                                                Stock:{" "}
                                                <span
                                                    className={`${book.stock < 10 ? "text-red-600 font-semibold" : ""}`}
                                                >
                                                    {book.stock || 0}
                                                </span>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditBook(book._id)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 transition-all duration-300"
                                                >
                                                    <FiEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 rounded-full text-white font-medium bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-700 hover:to-rose-500 transition-all duration-300"
                                                >
                                                    <FiTrash2 /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">No books available</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBooks;
