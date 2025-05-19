import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password
      });
      
      // Salva o token no localStorage
      localStorage.setItem('token', response.data.token);
      
      // Configura o token no axios para próximas requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      alert('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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

        <button type="submit">Entrar</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Não tem uma conta? <a href="/register">Cadastre-se</a>
      </p>
    </div>
  );
} 