import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: Number(id) }
    });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
};
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, authorId } = req.body;

  try {
    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        authorId: Number(authorId)
      },
      include: {
        author: true
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, authorId } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        status: 'Rascunho', // ou outro status conforme sua lógica
      }
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};
