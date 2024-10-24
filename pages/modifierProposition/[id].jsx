import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { supabase } from '../../components/supabaseClient';
import axios from 'axios';
import { AuthContext } from '../../components/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ModifierPropostion = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;

  const resetForm = () => {
    setName('');
    setType('');
    setDescription('');
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchDon = async () => {
      if (!id) {
        return;
      }

      const { data: donData, error: donError } = await supabase
        .from('aide')
        .select('*')
        .eq('id', id)
        .single();

      if (donError) {
        console.error('Erreur lors de la récupération du don', donError);
      } else {
        setName(donData.ville);
        setType(donData.type);
        setDescription(donData.description);
      }
    };

    fetchDon();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${name}&format=json`);

    if (response.data && response.data[0]) {
      const location = response.data[0];

      const { data: aideData, error: aideError } = await supabase
        .from('aide')
        .update([
          { type, description, ville: name, latitude: location.lat, longitude: location.lon },
        ])
        .eq('id', id);

      if (aideError) {
        console.error(aideError);
      } else {
        console.log(aideData);
        setSuccessMessage('Succès !');
        resetForm();
      }

      const { data: tracerData, error: tracerError } = await supabase
        .from('aide_tracer')
        .update([
          { type, description, ville: name, latitude: location.lat, longitude: location.lon },
        ])
        .eq('id', id);

      if (tracerError) {
        console.error(tracerError);
      } else {
        console.log(tracerData);
        router.push('/mesPropositions');
      }
    } else {
      console.error('Aucun résultat trouvé pour cette ville');
    }
  };

  return (
    <>
      {!user && (
        <MainLayout>
          <div className='grand-redirect'>
            <div className='petit-redirect'>
              <h2>Vous devez être connecté pour proposer une aide</h2>
              <Link href="/login">Se connecter</Link>
            </div>
          </div>
        </MainLayout>
      )}
      {user && (
        <MainLayout>
            <div className='standard-container'>
              <div className='standard-card'>
                <h2 className='propose-form-titre'>Modifier mon don</h2>
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit} className="standard-form">
                    <label>
                        Ville
                    </label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <label>
                        Type du don
                    </label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Aide matérielle">Aide matérielle</option>
                        <option value="Aide financière">Aide financière</option>
                        <option value="Logement">Logement</option>
                    </select>
                    <label>
                        Description du don
                    </label>
                    <textarea value={description} rows={6} onChange={(e) => setDescription(e.target.value)} />
                    <div className='div-btn-standard'>
                      <button type="submit" >Enregistrer</button>
                      <button onClick={() => router.back()}>Annuler</button>
                    </div>
                </form>
              </div>
            </div>
        </MainLayout>
      )}
    </>
  );
};

export default ModifierPropostion;
