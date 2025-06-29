import { useEffect, useState } from 'react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    authorId: 1
  });

  // Carregar posts da API
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:3001/api/posts');  // Ajuste para a URL do seu back-end
      const data = await response.json();
      setPosts(data);
    };

    const fetchUsers = async () => {
      const response = await fetch('http://localhost:3001/api/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchPosts();
    fetchUsers();
  }, []);

  // Função para criar um novo post
  const createPost = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newPost.title,
        content: newPost.content,
        authorId: newPost.authorId
      })
    });

    const data = await response.json();
    setPosts([...posts, data]);  // Adiciona o novo post na lista de posts
    setNewPost({ title: '', content: '', authorId: 1 });  // Limpa o formulário
  };

  return (
    <div>
      <h1>Gerenciar Posts</h1>

      {/* Formulário para criar novos posts */}
      <form onSubmit={createPost}>
        <div>
          <label>Título</label>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Conteúdo</label>
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Autor</label>
          <select
            value={newPost.authorId}
            onChange={(e) => setNewPost({ ...newPost, authorId: e.target.value })}
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Criar Post</button>
      </form>

      {/* Tabela de posts */}
      <table>
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
              <td>{post.author.name}</td>
              <td>{post.status}</td>
              <td>{post.content}</td>
              <td>
                <button onClick={() => alert(`Editar post: ${post.id}`)}>Editar</button>
                <button onClick={() => alert(`Deletar post: ${post.id}`)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
