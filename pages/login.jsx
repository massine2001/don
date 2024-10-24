import { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useRouter } from 'next/router';
import MainLayout from '../layouts/MainLayout';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert('Connexion réussie !');
      router.push('/aide');
    } catch (error) {
      alert('La connexion a échoué. ' + error.message);
    }
  };

  return (
    <>
      {user && (
        <MainLayout>
          <div className='grand-redirect'>
            <div className='petit-redirect'>
              <h2>Vous êtes déjà connecté !</h2>
              <Link href="/">Allez vers l'accueil</Link>
            </div>
          </div>
        </MainLayout>
      )}
      {!user && (
        <MainLayout>
          <div className='signup'>
            <div className='signup-page'>
              <h2 className='signup-title'>Connexion</h2>
              <form onSubmit={handleLogin} className='signup-form'>
                <label className='signup-label'>
                  Email :
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='signup-input'
                  />
                </label>
                <label className='signup-label'>
                  Mot de passe :
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='signup-input'
                  />
                </label>
                <div className='btn-log'>
                  <button type="submit" className='signup-button'>Se connecter</button>
                  <Link href="/signup" className='signup-label'>Pas de compte ? S'inscrire ici !</Link>
                </div>
              </form>
            </div>
          </div>
        </MainLayout>
      )}
    </>
  );
};

export default LoginPage;
