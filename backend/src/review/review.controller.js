const Review = require("./review.model");
const Book = require("../books/book.model");
const User = require("../users/user.model");
const emailService = require("../services/emailService");
const smsService = require("../services/smsService");

const postReview = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { userId, userName, userEmail, rating, comment } = req.body;

    if (!userId || !userName || !rating || !comment) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send({ message: "Book not found" });

    let existingReview = await Review.findOne({ bookId, userId });

    if (existingReview) {
      console.log('🔄 Updating existing review');
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.userName = userName;
      if (userEmail) existingReview.userEmail = userEmail;
      existingReview.approved = false;
      await existingReview.save();
      console.log('✅ Review updated:', existingReview._id);
      await emailService.sendReviewNotificationToAdmin(
        { ...existingReview.toObject(), bookTitle: book.title }, 'updated'
      );
    } else {
      console.log('📝 Creating new review');
      const newReview = new Review({
        bookId,
        userId,
        userName,
        userEmail: userEmail || null,
        rating,
        comment,
        approved: false,
      });
      await newReview.save();
      console.log('✅ Review created:', newReview._id);
      await emailService.sendReviewNotificationToAdmin(
        { ...newReview.toObject(), bookTitle: book.title }, 'added'
      );
    }

    const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });
    res.status(200).send({
      message: "Review submitted successfully",
      reviews,
    });
  } catch (error) {
    console.error("❌ Error submitting review:", error);
    res.status(500).send({ message: "Failed to submit or update review" });
  }
};

const getReviewsByBook = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const reviews = await Review.find({ bookId }).sort({ createdAt: -1 });
    res.status(200).send(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
};

const getAllHighRatedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: { $gt: 2 }, approved: true })
      .sort({ createdAt: -1 })
      .populate("bookId", "title")
      .lean();

    const formattedReviews = reviews.map((r) => ({
      ...r,
      bookName: r.bookId?.title || "Unknown Book",
    }));

    res.status(200).send(formattedReviews);
  } catch (error) {
    console.error("❌ Error fetching high-rated reviews:", error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
};

const getAllReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("bookId", "title")
      .lean();

    console.log(`📊 Fetched ${reviews.length} reviews for admin`);

    const formattedReviews = await Promise.all(
      reviews.map(async (r) => {
        let userEmail = r.userEmail || null;
        
        if (!userEmail) {
          try {
            const user = await User.findOne({ uid: r.userId }).select("email");
            if (user && user.email) {
              userEmail = user.email;
              await Review.findByIdAndUpdate(r._id, { userEmail: user.email });
              console.log(`✅ Updated review ${r._id} with email from User model`);
            }
          } catch (err) {
            console.error(`⚠️ Error fetching email for userId ${r.userId}:`, err.message);
          }
        }

        return {
          ...r,
          bookName: r.bookId?.title || "Unknown Book",
          userEmail: userEmail || "user@example.com",
        };
      })
    );

    res.status(200).send(formattedReviews);
  } catch (error) {
    console.error("❌ Error fetching all reviews for admin:", error);
    res.status(500).send({ message: "Failed to fetch reviews" });
  }
};

const toggleReviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const existingReview = await Review.findById(id);

    if (!existingReview) {
      return res.status(404).send({ message: "Review not found" });
    }

    const previousStatus = existingReview.approved;
    
    console.log('🔄 Updating review approval:', previousStatus, '→', approved);

    const review = await Review.findByIdAndUpdate(
      id,
      { approved },
      { new: true }
    ).populate("bookId", "title");

    const formattedReview = {
      ...review.toObject(),
      bookName: review.bookId?.title || "Unknown",
    };

    console.log(`✅ Review ${id} approval updated to: ${approved}`);

    res.status(200).send({
      message: "Review updated successfully",
      review: formattedReview,
    });
  } catch (error) {
    console.error("❌ Error updating review:", error);
    res.status(500).send({ message: "Failed to update review" });
  }
};

const disapproveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).send({ message: "Reason is required" });
    }

    const review = await Review.findById(id).populate("bookId", "title");

    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    console.log('🚫 Disapproving review:', id);
    console.log('   User:', review.userName);
    console.log('   Book:', review.bookId?.title);
    console.log('   Reason:', reason);

    // ✅ Get user email
    let userEmail = review.userEmail || null;
    let userPhone = null;
    
    if (!userEmail) {
      console.log('🔍 Email not in review, checking User model...');
      try {
        const user = await User.findOne({ uid: review.userId }).select("email phone");
        if (user) {
          userEmail = user.email ;
          userPhone = user.phone || null;
          console.log(`✅ Found user data - Email: ${userEmail}, Phone: ${userPhone}`);
        } else {
          console.warn(`⚠️ No user found for userId: ${review.userId}`);
          userEmail = "india.lumos@gmail.com";
        }
      } catch (err) {
        console.error(`❌ Error fetching user:`, err.message);
        userEmail = "india.lumos@gmail.com";
      }
    } else {
      console.log(`✅ Using stored email from review: ${userEmail}`);
      // Still try to get phone from User model
      try {
        const user = await User.findOne({ uid: review.userId }).select("phone");
        if (user && user.phone) {
          userPhone = user.phone;
          console.log(`✅ Found phone: ${userPhone}`);
        }
      } catch (err) {
        console.error(`❌ Error fetching phone:`, err.message);
      }
    }

    const reviewData = {
      userName: review.userName,
      bookName: review.bookId?.title || "Unknown Book",
      comment: review.comment,
      rating: review.rating,
      userEmail,
      phone: userPhone, // ✅ Added for SMS
    };

    // ✅ Send email notification
    console.log('📧 Sending disapproval email to:', userEmail);
    emailService.sendReviewDisapprovedEmail(reviewData, reason)
      .then(result => {
        if (result.success) {
          console.log('✅ Disapproval email sent successfully');
        } else {
          console.error('⚠️ Disapproval email failed:', result.error);
        }
      })
      .catch(err => console.error('❌ Email error:', err.message));

    // ✅ Send SMS notification if phone exists
    if (userPhone && userEmail !== "india.lumos@gmail.com") {
      console.log('📱 Sending disapproval SMS to:', userPhone);
      const smsService = require("../services/smsService");
      smsService.sendReviewDisapprovedSMS(reviewData, reason)
        .then(result => {
          if (result.success) {
            console.log('✅ Disapproval SMS sent successfully');
          } else {
            console.error('⚠️ Disapproval SMS failed:', result.error);
          }
        })
        .catch(err => console.error('❌ SMS error:', err.message));
    }

    // ✅ Delete the review
    await Review.findByIdAndDelete(id);

    console.log(`✅ Review ${id} disapproved and deleted`);

    res.status(200).send({
      message: "Review disapproved and deleted successfully",
      deletedReviewId: id,
    });
  } catch (error) {
    console.error("❌ Error disapproving review:", error);
    res.status(500).send({ message: "Failed to disapprove review" });
  }
};

module.exports = {
  postReview,
  getReviewsByBook,
  getAllHighRatedReviews,
  toggleReviewApproval,
  getAllReviewsForAdmin,
  disapproveReview,
};
