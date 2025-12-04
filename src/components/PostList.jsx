import useApi from '../hooks/useApi';

function PostList() {
  const { data: posts, loading, error, refetch } = useApi(
    'https://jsonplaceholder.typicode.com/posts'
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Загрузка постов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
        <h2>Ошибка при загрузке постов</h2>
        <p>{error}</p>
        <button 
          onClick={refetch}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20 
      }}>
        <h2>Список постов ({posts?.length || 0})</h2>
        <button 
          onClick={refetch}
          style={{
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Обновить
        </button>
      </div>

      <div>
        {posts?.map(post => (
          <article key={post.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ marginTop: 0 }}>{post.title}</h3>
            <p>{post.body}</p>
            <div style={{ 
              display: 'flex', 
              gap: '20px',
              marginTop: '10px',
              fontSize: '14px',
              color: '#7f8c8d'
            }}>
              <span>ID: {post.id}</span>
              <span>User: {post.userId}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PostList;