const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching notifications for user:', userId);
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });
    
    console.log('Found notifications:', notifications);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const notification = new Notification({
      userId,
      message,
      type
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error){
    res.status(400).json({ error: 'Failed to create notification' });
  }
});

router.put('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    console.log('Marking notification as read:', notificationId);
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    console.log('Updated notification:', notification);
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});


router.get('/user/:userId/unread/count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.params.userId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

module.exports = router; 