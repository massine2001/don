import { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import MainLayout from '../layouts/MainLayout';
import Link from 'next/link';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      alert('Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {user && <MainLayout>
        <div className='grand-redirect'>
          <div className='petit-redirect'>
            <h2>Vous avez déjà un compte !</h2>
            <Link href="/">Allez vers l'accueil</Link>
          </div>
        </div>
      </MainLayout>}
      {!user &&
        <MainLayout>
          <div className='signup'>
            <div className="signup-page">
              <h2 className="signup-title">Inscription</h2>
              <form onSubmit={handleSubmit} className="signup-form">
                <label className="signup-label">
                  Email :
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="signup-input"
                  />
                </label>
                <label className="signup-label">
                  Mot de passe :
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="signup-input"
                  />
                </label>
                <div className='btn-log'>
                  <button type="submit" className='signup-button'>S'inscrire </button>
                  <Link href="/login" className='signup-label'>Déjà inscrit ? Se connecter ici !</Link>
                </div>
              </form>
            </div>
          </div>
        </MainLayout>
      }
    </>
  );
};

export default SignupPage;
