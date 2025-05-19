import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/register', {
        email,
        password
      });
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      setError('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Cadastro</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
        </div>
        
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Já tem uma conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
} 