import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { supabase } from '../components/supabaseClient';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import Link from 'next/link';

const ProposePage = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useContext(AuthContext);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !type || !description || type === 'type0') {
      alert('Veuillez remplir tous les champs !');
      return;
    }

    const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${name}&format=json`);

    if (response.data && response.data[0]) {
      const location = response.data[0];

      const { data, error } = await supabase
        .from('aide')
        .insert([
          { user_id: user.id, type, description, ville: name, latitude: location.lat, longitude: location.lon },
        ]);

      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setSuccessMessage('Succès !');
        resetForm();
      }
    } else {
      alert('Aucun résultat trouvé pour cette ville');
    }
  };

  return (
    <>
      {!user && <MainLayout>
        <div className='grand-redirect'>
          <div className='petit-redirect'>
            <h2>Vous devez être connecté pour proposer une aide</h2>
            <Link href="/login">Se connecter</Link>
          </div>
        </div>

      </MainLayout>}
      {user &&
        <MainLayout>
          <div className='standard-container'>
            <div className='standard-card'>
              <h2 className='propose-form-titre'>Proposer une aide</h2>
              {successMessage && <div className="success-message">{successMessage}</div>}
              <form onSubmit={handleSubmit} className="standard-form">
                <label>
                  Ville
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>
                  Type de l'aide
                </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="type0"></option>
                  <option value="Aide matérielle">Aide matérielle</option>
                  <option value="Aide financière">Aide financière</option>
                  <option value="Logement">Logement</option>
                </select>
                <label>
                  Description de l'aide proposée
                </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                <div className='div-btn-standard'>
                <button type="submit" >Envoyer</button>
                <button onClick={() => router.back()}>Annuler</button>
                </div>
              </form>
            </div>
          </div>

        </MainLayout>
      }</>
  );
};

export default ProposePage;
