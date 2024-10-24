import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../components/supabaseClient';
import MainLayout from '../../layouts/MainLayout';
import { AuthContext } from '../../components/AuthContext';
import Link from 'next/link';

const AideDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [aide, setAide] = useState(null);
  const [userInfoFromQuery, setUser] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAide = async () => {
      const { data: aideData, error: aideError } = await supabase.from('aide').select('*').eq('id', id).single();
      if (aideError) {
        console.error('Erreur lors de la récupération de l\'aide', aideError);
      } else {
        setAide(aideData);

        const { data: userData, error: userError } = await supabase.from('users_').select('*').eq('id', aideData.user_id).single();
        if (userError) {
          console.error('Erreur lors de la récupération de l\'utilisateur', userError);
        } else {
          setUser(userData);
        }
      }
    };

    if (id) {
      fetchAide();
    }
  }, [id]);

  return (
    <>
      {!user && (
        <MainLayout>
          <div className='grand-redirect'>
            <div className='petit-redirect'>
              <h2>Vous devez être connecté pour accéder plus en détail sur l'aide offerte !</h2>
              <Link href="/login">Se connecter</Link>
            </div>
          </div>
        </MainLayout>
      )}
      {user && (
        <MainLayout>
          <div className='standard-container'>
            {aide && (
              <div className='standard-card'>
                <h2>Détail du don :</h2>
                <p>Type d'aide : {aide.type}</p>
                <p>Le don sera disponible à : {aide.ville}</p>
                <p>Description de l'aide : {aide.description}</p>
                {userInfoFromQuery && <p>Nom du donneur : {userInfoFromQuery.nom}</p>}
                {userInfoFromQuery && <p>Prénom du donneur : {userInfoFromQuery.prenom}</p>}
                {userInfoFromQuery && <p>Email du donneur : {userInfoFromQuery.email}</p>}
                {userInfoFromQuery && <p>Tel du donneur : {userInfoFromQuery.tel}</p>}
                {userInfoFromQuery && <p>Localisation du donneur : {userInfoFromQuery.ville}</p>}
              </div>
            )}
          </div>
        </MainLayout>
      )}
    </>
  );
};

export default AideDetailPage;
