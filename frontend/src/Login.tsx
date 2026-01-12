import React, { useState } from 'react';
import api from './Api_Interceptor';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
    const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/token/`, {
        username,
        password,
      });
      
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      navigate('/pokemons');  // Redirect
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit = {handleLogin}>
        <label htmlFor="username">Username:</label>
        <input type="username" id="username" value={username} required placeholder="Enter your username" onChange = {(e) => setUsername(e.target.value)}/>
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} required placeholder="Enter your password" onChange = {(e) => setPassword(e.target.value)}/>
        
        <button type="submit">Login</button>
        <button type ="button" onClick = {() => navigate('/register')}>Create Account</button>
      </form>
    </div>
  );
};

export default Login;