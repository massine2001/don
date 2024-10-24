import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../layouts/MainLayout';
import { supabase } from '../components/supabaseClient';
import Link from 'next/link';

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false
});

const AidePage = () => {
  const [aides, setAides] = useState([]);
  const [aideDemandes, setAideDemandes] = useState([]);
  const [filter, setFilter] = useState('filtre');
  const [filter2, setFilter2] = useState('filtre');

  useEffect(() => {
    const fetchAides = async () => {
      let query = supabase.from('aide').select('*').order('created_at', { ascending: false });
      if (filter !== 'filtre') {
        query = query.eq('type', filter);
      }
      const { data: aidesData, error: aidesError } = await query;
      if (aidesError) {
        console.error('Erreur lors de la récupération des aides', aidesError);
      } else {
        const aidesDataWithUser = await Promise.all(aidesData.map(async (aide) => {
          const { data: userData, error: userError } = await supabase.from('users_').select('*').eq('id', aide.user_id).single();
          if (userError) {
            console.error('Erreur lors de la récupération de l\'utilisateur', userError);
          } else {
            return { ...aide, user: userData };
          }
        }));
        setAides(aidesDataWithUser);
      }
    };

    const fetchAideDemandes = async () => {
      let query = supabase.from('aide_demande').select('*').order('created_at', { ascending: false });
      if (filter2 !== 'filtre') {
        query = query.eq('type', filter2);
      }
      const { data: aideDemandeData, error: aideDemandeError } = await query;
      if (aideDemandeError) {
        console.error('Erreur lors de la récupération des demandes d\'aide', aideDemandeError);
      } else {
        const aideDemandeDataWithUser = await Promise.all(aideDemandeData.map(async (aideDemande) => {
          const { data: userData, error: userError } = await supabase.from('users_').select('*').eq('id', aideDemande.user_id).single();
          if (userError) {
            console.error('Erreur lors de la récupération de l\'utilisateur', userError);
          } else {
            return { ...aideDemande, user: userData };
          }
        }));
        setAideDemandes(aideDemandeDataWithUser);
      }
    };

    fetchAides();
    fetchAideDemandes();
  }, [filter, filter2]);

  return (
    <MainLayout>
      <MapComponent aides={aides} />
      <div className='aide-grand-grand'>
        <div className='aide-grand'>

          <span className='aide-titre'>Offres d'aide</span>
          <div className='select-container'>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="filtre">Filtrer par type de don</option>
              <option value="Aide matérielle">Aide matérielle</option>
              <option value="Aide financière">Aide financière</option>
              <option value="Logement">Logement</option>
            </select>
          </div>
          {aides.map((aide) => (
            <div className="aide-card" key={aide.id}>
              <Link className='aide-link' href={`/aideDetail/${aide.id}`}>
                <h2>Localisation - {aide.ville}</h2>
                <p>Description du don : {aide.description.substring(0, 30)}...</p>
                {aide.user && <p>Tel : {aide.user.tel}</p>}
                <p>Publiée le : {new Date(aide.created_at).toLocaleDateString()}</p>
              </Link>
              <p><Link style={{ color: '#FCA616' }} href={`/aideDetail/${aide.id}`}>Plus de détails</Link></p>
            </div>
          ))}
        </div>
        <div className='aide-grand'>

          <span className='aide-titre'>Demandes d'aide</span>
          <div className='select-container'>
            <select value={filter2} onChange={(e) => setFilter2(e.target.value)}>
              <option value="filtre">Filtrer par type de demande</option>
              <option value="Aide matérielle">Aide matérielle</option>
              <option value="Aide financière">Aide financière</option>
              <option value="Logement">Logement</option>
            </select>
          </div>
          {aideDemandes.map((aideDemande) => (
            <div className="aide-card-2" key={aideDemande.id}>
              <Link className='aide-link' href={`/aideDemandeDetail/${aideDemande.id}`}>
                <h2>Localisation - {aideDemande.ville}</h2>
                <p>Description du don : {aideDemande.description.substring(0, 30)}...</p>
                {aideDemande.user && <p>Tel : {aideDemande.user.tel}</p>}
                <p>Publiée le : {new Date(aideDemande.created_at).toLocaleDateString()}</p>
              </Link>
              <p><Link style={{ color: '#14203E' }} href={`/aideDemandeDetail/${aideDemande.id}`}>Plus de détails</Link></p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AidePage;
