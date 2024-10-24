import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';

const CheckRegion = () => {
  const [departmentCode, setDepartmentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const checkRegion = async (event) => {
    event.preventDefault();

    setError(null);

    if (departmentCode === '') {
      setError('Veuillez entrer un nom de ville ou un code postal.');
      return;
    }

    setLoading(true);

    try {
      let lat, lon;

      if (!isNaN(departmentCode)) {
        const geocodingResponse = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${departmentCode}&country=france&format=json`);
        if (geocodingResponse.data.length === 0) {
          throw new Error('Code postal non trouvé');
        }
        lat = geocodingResponse.data[0].lat;
        lon = geocodingResponse.data[0].lon;
      } else {
        const geocodingResponse = await axios.get(`https://nominatim.openstreetmap.org/search?city=${departmentCode}&country=france&format=json`);
        if (geocodingResponse.data.length === 0) {
          throw new Error('Ville non trouvée');
        }
        lat = geocodingResponse.data[0].lat;
        lon = geocodingResponse.data[0].lon;
      }

      const response = await axios.get(`https://georisques.gouv.fr/api/v1/gaspar/catnat?rayon=2000&latlon=${lon}%2C${lat}&page=1&page_size=10`);

      if (response.data.data) {
        const sortedData = response.data.data.sort((a, b) => {
          const dateA = new Date(a.date_debut_evt.split("/").reverse().join("-"));
          const dateB = new Date(b.date_debut_evt.split("/").reverse().join("-"));
          return dateB - dateA;
        });
        setData(sortedData);
      } else {
        setData(null);
        setError('Aucun résultat trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      <form onSubmit={checkRegion} className="form-container">
        <label>Vérifier votre région</label>
        <label>(Entrez le nom de votre ville ou son code postal)</label>
        <input type="text" placeholder='ex.: Paris ou 75000' value={departmentCode} onChange={(e) => setDepartmentCode(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Vérifier'}
        </button>
      </form>

      {error && <div className="results-container"><span>{error}</span></div>}
      {!error && data && data.length > 0 && (
        <div className="results-container">
          <h2>Résultats pour {data[0].libelle_commune} :</h2>
          {data.map((item, index) => (
            <div key={index} className="result-item">
              <h3>{item.libelle_risque_jo}</h3>
              <p>Commune : {item.libelle_commune}</p>
              <p>Code INSEE : {item.code_insee}</p>
              <p>Code national CATNAT : {item.code_national_catnat}</p>
              <p>Date de début : {item.date_debut_evt}</p>
              <p>Date de fin : {item.date_fin_evt}</p>
              <p>Date de publication de l'arrêté : {item.date_publication_arrete}</p>
              <p>Date de publication JO : {item.date_publication_jo}</p>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default CheckRegion;
