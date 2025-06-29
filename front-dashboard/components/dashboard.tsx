import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  status: string;
  author: User;
}

interface NewPost {
  title: string;
  content: string;
  authorId: number;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    content: '',
    authorId: 1
  });
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/posts')
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data));

    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  const resetForm = () => {
    setNewPost({ title: '', content: '', authorId: users[0]?.id || 1 });
    setEditingPostId(null);
    setShowForm(false);
  };

  const handleCreateOrUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingPostId ? 'PUT' : 'POST';
    const url = editingPostId
      ? `http://localhost:3000/posts/${editingPostId}`
      : 'http://localhost:3000/posts';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });

    const updated: Post = await response.json();

    if (editingPostId) {
      setPosts((prev) =>
        prev.map((post) => (post.id === updated.id ? updated : post))
      );
    } else {
      setPosts((prev) => [...prev, updated]);
    }

    resetForm();
  };

  const handleEditPost = (post: Post) => {
    setNewPost({
      title: post.title,
      content: post.content,
      authorId: post.author.id
    });
    setEditingPostId(post.id);
    setShowForm(true);
  };

  const handleDeletePost = async (postId: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este post?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        alert('Erro ao excluir post.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Painel de Posts ✍️</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => {
          if (editingPostId) {
            resetForm();
          } else {
            setShowForm(!showForm);
          }
        }} style={{ marginRight: 8 }}>
          {editingPostId ? 'Cancelar Edição' : showForm ? 'Cancelar' : '+ Novo Post'}
        </button>
        <button onClick={() => alert('Funcionalidade de novo usuário em breve!')}>
          + Novo Usuário
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrUpdatePost} style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Título"
            value={newPost.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPost({ ...newPost, title: e.target.value })
            }
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <textarea
            placeholder="Conteúdo"
            value={newPost.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <select
            value={newPost.authorId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNewPost({ ...newPost, authorId: Number(e.target.value) })
            }
            style={{ display: 'block', marginBottom: 8 }}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button type="submit">
            {editingPostId ? 'Atualizar Post' : 'Salvar Post'}
          </button>
        </form>
      )}

      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Status</th>
            <th>Conteúdo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author?.name || 'Desconhecido'}</td>
              <td>{post.status}</td>
              <td>{post.content}</td>
              <td>
                <button onClick={() => handleEditPost(post)}>✏️ Editar</button>{' '}
                <button onClick={() => handleDeletePost(post.id)}>🗑️ Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
