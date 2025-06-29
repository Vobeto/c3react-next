import { Router } from 'express';
import { createPost, getPosts } from '../controllers/postController';
import { deletePost } from '../controllers/postController';
import { updatePost } from '../controllers/postController';

const router = Router();

router.get('/', getPosts);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.put('/:id', updatePost);


export default router;
