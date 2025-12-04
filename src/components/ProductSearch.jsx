import { useState, useEffect, useRef } from 'react';

function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const searchProducts = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.products || []);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Ошибка при поиске продуктов:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchProducts(value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="product-search" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Поиск продуктов</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Введите название продукта..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            width: '100%',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {loading && <span style={{ marginLeft: 10 }}>🔍 Загрузка...</span>}
      </div>

      {error && (
        <div style={{ color: '#e74c3c', marginBottom: 20 }}>
          Ошибка: {error}
        </div>
      )}

      <div>
        {products.length > 0 ? (
          <>
            <h3>Найдено продуктов: {products.length}</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {products.map(product => (
                <div key={product.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: 'white'
                }}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ marginTop: 10 }}>
                    <h4 style={{ margin: '10px 0' }}>{product.title}</h4>
                    <p style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                      ${product.price}
                    </p>
                    <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
                      {product.category}
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      {product.description.slice(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          searchTerm.trim() && !loading && (
            <p>Продукты не найдены</p>
          )
        )}
      </div>
    </div>
  );
}

export default ProductSearch;