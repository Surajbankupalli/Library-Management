const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const BookRequest = require('../models/BookRequest');
const Book = require('../models/Book');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

router.get('/', async (req, res) => {
  try {
    const requests = await BookRequest.find().sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newRequest = new BookRequest({
      userId: req.body.userId,
      bookId: req.body.bookId,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      bookTitle: req.body.bookTitle,
      borrowDays: req.body.borrowDays || 1,
      purpose: req.body.purpose || 'No purpose specified',
      status: 'pending',
      requestDate: new Date()
    });
    const savedRequest = await newRequest.save();

    const notification = new Notification({
      userId: 'admin',
      message: `New borrow request for "${req.body.bookTitle}"`,
      type: 'info'
    });
    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request: savedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message
    });
  }
});
router.post('/res', async (req, res) => {
  try {
    const newRequest = new BookRequest({
      userId: req.body.userId,
      bookId: req.body.bookId,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      bookTitle: req.body.bookTitle,
      borrowDays: req.body.borrowDays || 1,
      purpose: req.body.purpose || 'No purpose specified',
      status: 'pending',
      requestDate: new Date()
    });
    const savedRequest = await newRequest.save();

    const notification = new Notification({
      userId: 'admin',
      message: `New Reserve request for "${req.body.bookTitle}"`,
      type: 'info'
    });
    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request: savedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message
    });
  }
});

router.put('/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Status must be either approved or rejected'
      });
    }

    const request = await BookRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    request.status = status;
    const updatedRequest = await request.save();

    const notificationMessage = status === 'approved'
      ? `Your request to borrow "${request.bookTitle}" has been approved! You can collect the book from the library.`
      : `Your request to borrow "${request.bookTitle}" has been rejected. Please contact the librarian for more information.`;

    const notification = new Notification({
      userId: request.userId,
      message: notificationMessage,
      type: status === 'approved' ? 'success' : 'info',
      read: false,
      createdAt: new Date()
    });
    await notification.save();

    if (status === 'approved') {
      const book = await Book.findById(request.bookId);
      if (book) {
        book.count = Math.max(0, book.count - 1);
        book.status = book.count > 0 ? 'available' : 'not available';
        await book.save();
      }
    }

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || `Failed to update request`
    });
  }
});


router.put('/:requestId/return', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { returnStatus, userId, bookTitle } = req.body;

    const request = await BookRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (returnStatus === 'returned') {
      const book = await Book.findById(request.bookId);
      if (book) {
        book.count += 1;
        book.status = 'available';
        await book.save();
      }
      
      const notification = new Notification({
        userId: request.userId,
        message: `Your book "${request.bookTitle}" has been returned successfully.`,
        type: 'success',
        read: false,
        createdAt: new Date()
      });
      await notification.save();
      
      await Activity.create({
        action: 'return',
        bookId: request.bookId,
        userId: request.userId,
        details: `Book "${request.bookTitle}" marked as returned by admin`,
        timestamp: new Date()
      });
      
      await BookRequest.findByIdAndDelete(requestId);
    } else if (returnStatus === 'overdue') {
      request.returnStatus = returnStatus;
      await request.save();
      
      const notification = new Notification({
        userId: request.userId,
        message: `The book "${request.bookTitle}" is overdue. Please return it as soon as possible to avoid penalties.`,
        type: 'warning',
        read: false,
        createdAt: new Date()
      });
      await notification.save();
    }

    res.json({ 
      success: true, 
      message: `Book marked as ${returnStatus} successfully.`,
      bookId: request.bookId 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await BookRequest.find({ userId }).sort({ requestDate: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user requests' });
  }
});


router.get('/userrequests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await BookRequest.find({
      userId: userId
    }).populate('bookId');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
