import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import MainLayout from '../layouts/MainLayout';
import { supabase } from '../components/supabaseClient';
import Link from 'next/link';

const PageMesPropositions = () => {
  const { user } = useContext(AuthContext);
  const [aides, setAides] = useState([]);

  const fetchAides = async () => {
    if (!user) {
      return;
    }

    const { data: aidesData, error: aidesError } = await supabase
      .from('aide_tracer')
      .select('*')
      .eq('user_id', user.id);

    if (aidesError) {
      console.error('Erreur lors de la récupération des aides', aidesError);
    } else {
      setAides(aidesData);
    }
  };

  const cloturerAide = async (id) => {
    const { error: tracerError } = await supabase
      .from('aide_tracer')
      .update({ cloture: true })
      .eq('id', id);

    if (tracerError) {
      console.error('Erreur lors de la mise à jour de aide_tracer', tracerError);
      return;
    }

    const { error: aideError } = await supabase
      .from('aide')
      .delete()
      .eq('id', id);

    if (aideError) {
      console.error('Erreur lors de la suppression de la proposition', aideError);
    } else {
      fetchAides();
    }
  };

  useEffect(() => {
    fetchAides();
  }, [user]);

  return (
    <MainLayout>
      <div className='aide-grand-grand'>
        <div className='aide-grand'>
          <span className='aide-titre'>Mes dons :</span>
          {aides.map((aide) => (
            <div className="aide-card" key={aide.id}>
              <div className='aide-link'>
                <h2>Localisation : {aide.ville}</h2>
                <p>Type d'aide : {aide.type}</p>
                <p>Description de l'aide proposée :{aide.description}</p>
                <p>Date : {new Date(aide.created_at).toLocaleDateString()}</p>
                <p>Proposition cloturée : {aide.cloture? 'Oui': 'Non'}</p>
                <div className='grp-don-btn'>
                  {aide.cloture && <button disabled={aide.cloture}>Modifier</button>}
                  {!aide.cloture && <button disabled={aide.cloture}><Link href={`/modifierProposition/${aide.id}`}>Modifier</Link></button>}
                  <button onClick={() => cloturerAide(aide.id)} disabled={aide.cloture}>
                    Cloturer la proposition
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PageMesPropositions;
