import {useNavigate} from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <button onClick={logout} style={{backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', transition: 'background-color 0.3s', width: '100%', minWidth: '100px'}}>Logout</button>
    </div>
  );
}

export default Logout;