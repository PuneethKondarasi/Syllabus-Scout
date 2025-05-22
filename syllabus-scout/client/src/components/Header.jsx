import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu } from '@headlessui/react';
import { UserCircle, Menu as MenuIcon } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="icon.svg"
              alt="Syllabus Scout Logo"
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Syllabus Scout</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
              Home
            </Link>
            
            {!auth ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">
                  Sign Up
                </Link>
              </>
            ) : (
              <UserMenu logout={logout} />
            )}
            
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-2 space-y-3">
            <Link to="/" className="block px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded">
              Home
            </Link>
            
            {!auth ? (
              <>
                <Link to="/login" className="block px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded">
                  Login
                </Link>
                <Link to="/register" className="block px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="block px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded">
                  Profile
                </Link>
                <button 
                  onClick={logout} 
                  className="w-full text-left px-2 py-1 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Logout
                </button>
              </>
            )}
            
            <div className="px-2 py-1">
              <ThemeToggle />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

// Extracted UserMenu component for better organization
function UserMenu({ logout }) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
        <UserCircle className="w-7 h-7" />
      </Menu.Button>
      
      <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg focus:outline-none z-50">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${
                  active ? 'bg-gray-100 dark:bg-gray-600' : ''
                }`}
              >
                Profile
              </Link>
            )}
          </Menu.Item>
          
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={`w-full text-left px-4 py-2 text-sm text-red-600 ${
                  active ? 'bg-gray-100 dark:bg-gray-600' : ''
                }`}
              >
                Logout
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}

export default Header;