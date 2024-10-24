import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../layouts/MainLayout';
import { supabase } from '../components/supabaseClient';
import { AuthContext } from '../components/AuthContext';
import axios from 'axios';
import Link from 'next/link';

const ProfilPage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [tel, setTel] = useState('');
  const [ville, setVille] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users_')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setNom(data.nom);
        setPrenom(data.prenom);
        setTel(data.tel);
        setVille(data.ville);
      } else {
        console.log("onnn");
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!nom || !prenom || !tel || !ville) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    const handleUnload = async () => {
      if (!nom || !prenom || !tel || !ville) {
        await supabase.auth.signOut();
        await supabase.from('auth.users').delete().match({ id: user.id });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [nom, prenom, tel, ville, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${ville}&format=json`);

    const firstResult = response.data[0];

    const latitude = firstResult.lat;
    const longitude = firstResult.lon;

    const updates = {
      id: user.id,
      nom,
      prenom,
      tel,
      ville,
      latitude,
      longitude,
    };

    let { error } = await supabase.from('users_').upsert(updates, {
      returning: 'minimal',
    });

    if (error) {
      console.log('Error: ', error);
    } else {
      updateUser(updates);
      router.push('/');
    }
  };

  return (
    <>
      {!user && <MainLayout>
        <div className='grand-redirect'>
          <div className='petit-redirect'>
            <h2>Vous devez être connecté pour accéder à la page profil !</h2>
            <Link href="/login">Se connecter</Link>
          </div>
        </div>
      </MainLayout>}
      {user &&
        <MainLayout>
          <div className='standard-container'>
            <div className='standard-card'>
              <h1>Profil</h1>
              <form onSubmit={handleSubmit} className='standard-form-profil'>
                <label htmlFor="nom">Nom</label>
                <input type="text" id="nom" name="nom" required value={nom ?? ''} onChange={e => setNom(e.target.value)} />
                <label htmlFor="prenom">Prénom</label>
                <input type="text" id="prenom" name="prenom" required value={prenom ?? ''} onChange={e => setPrenom(e.target.value)} />
                <label htmlFor="tel">Tel</label>
                <input type="tel" id="tel" name="tel" required value={tel ?? ''} onChange={e => setTel(e.target.value)} />
                <label htmlFor='ville'>Ville</label>
                <input type="text" id="ville" name="ville" required value={ville ?? ''} onChange={e => setVille(e.target.value)} />
                <div className='div-btn-profil'>
                  <button type="submit">Enregistrer</button>
                  <button onClick={() => router.back()}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </MainLayout>
      }
    </>
  );
};

export default ProfilPage;
