import express from 'express';
import { requireReviewer } from '../middleware/reviewer.middleware.js';
import {
  getReviewQueue,
  getReviewDetails,
  streamReviewDocument,
  decideReview
} from '../controllers/review.controller.js';

const router = express.Router();

router.use(requireReviewer);
router.get('/reviews/queue', getReviewQueue);
router.get('/reviews/:id/document', streamReviewDocument);
router.get('/reviews/:id', getReviewDetails);
router.post('/reviews/:id/decision', decideReview);

export default router;
