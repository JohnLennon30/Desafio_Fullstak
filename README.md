# Sistema de Gerenciamento de Usuários

Um sistema de gerenciamento de usuários construído com React, Node.js e JWT para autenticação.

## Funcionalidades

- Login e Registro de usuários
- Dashboard protegido com autenticação JWT
- Listagem de usuários
- Adição e edição de usuários
- Interface moderna e responsiva

## Tecnologias Utilizadas

- Frontend:
  - React
  - React Router DOM
  - Axios
  - CSS moderno

- Backend:
  - Node.js
  - Express
  - JWT (JSON Web Tokens)
  - bcryptjs

## Como Executar

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
node server.js
```

O servidor estará rodando em `http://localhost:3001`

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie a aplicação:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── services/
    │   └── components/
    └── package.json
```

## Contribuindo

1. Faça o fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
