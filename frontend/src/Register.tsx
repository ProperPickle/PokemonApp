import React, {useState } from 'react';
import api from './Api_Interceptor';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/register/`, {
        username,
        password,
      });
      navigate('/login');  // Redirect
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit = {handleRegister}>
        <label htmlFor="username">Username:</label>
        <input type="username" id="username" value={username} required placeholder="Enter your username" onChange = {(e) => setUsername(e.target.value)}/>
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} required placeholder="Enter your password" onChange = {(e) => setPassword(e.target.value)}/>
        
        <button type="submit">Register</button>
        <button type ="button" onClick = {() => navigate('/login')}>Login Instead</button>
      </form>
    </div>
  );
};

export default Register;