import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful! Redirecting...');
        console.log('Register Response:', data);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage(`${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      console.error('Register Error:', err);
      setMessage('Server error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" type="text" placeholder="Name" onChange={handleChange}
          className="input" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange}
          className="input" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange}
          className="input" required />
        <button className="btn btn-primary w-full">Register</button>
        <p className="text-sm text-green-500 dark:text-green-400 mt-2">{message}</p>
      </form>
    </div>
  );
}

export default Register;
