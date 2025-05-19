import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (user, editingId) => {
    try {
      if (editingId) {
        await updateUser(editingId, user);
      } else {
        await createUser(user);
      }
      await fetchUsers(); 
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  return { users, handleSave, handleDelete };
};