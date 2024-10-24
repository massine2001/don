import React, { useState } from 'react';

const RepertoireServices = () => {
  const [serviceRecherche, setServiceRecherche] = useState('');
  const [resultats, setResultats] = useState([]);

  const rechercherService = () => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${serviceRecherche}&format=json`)
      .then(response => response.json())
      .then(data => {
        setResultats(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des données de services :', error));
  };

  return (
    <>
      <label htmlFor="service">Recherchez un service :</label>
      <input
        type="text"
        id="service"
        placeholder="Plombier, Électricien..."
        value={serviceRecherche}
        onChange={e => setServiceRecherche(e.target.value)}
      />
      <button onClick={rechercherService}>Rechercher</button>

      <div id="resultat">
        {resultats.length > 0 ? (
          resultats.map(result => (
            <div key={result.place_id}>
              <p><strong>{result.display_name}</strong></p>
              <p>Latitude : {result.lat}</p>
              <p>Longitude : {result.lon}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>Aucun service trouvé pour {serviceRecherche}.</p>
        )}
      </div>
    </>
  );
};

export default RepertoireServices;