const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'sua_chave_secreta'; 

// Middleware
app.use(cors());
app.use(express.json());

// Armazenamento em memória 
const users = [];

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

app.get('/dashboard', authenticateToken, (req, res) => {

  const usersList = users.map(({ password, ...user }) => user);
  res.json(usersList);
});


app.post('/users', authenticateToken, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword
    };
    users.push(newUser);
    res.status(201).json({ message: 'Usuário adicionado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar usuário' });
  }
});


app.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;
    const userIndex = users.findIndex(u => u.id == id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (email) {
      
      const emailExists = users.some(u => u.email === email && u.id != id);
      if (emailExists) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
      users[userIndex].email = email;
    }

    if (password) {
      users[userIndex].password = await bcrypt.hash(password, 10);
    }

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});


app.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id == id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    users.splice(userIndex, 1);
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 
