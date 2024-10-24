import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet/dist/leaflet.css';

const MapEvac = () => {
  const [input, setInput] = useState('');
  const [city, setCity] = useState('');
  const [data, setData] = useState([]);
  const [mapSize, setMapSize] = useState('taille');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedCity = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    setCity(formattedCity);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMapSize('full');
      } else {
        setMapSize('taille');
      }
    };
    
    handleResize();
  }, []);

  useEffect(() => {
    if (city) {
      fetch(`https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["name"="${city}"]->.searchArea;node["emergency"="assembly_point"](area.searchArea);out geom;`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setData(data.elements))
        .catch(error => console.log('Error fetching data: ' + error.message));
    }
  }, [city]);

  const MarkerClusterGroupComponent = () => {
    const map = useMap();

    useEffect(() => {
      map.invalidateSize();
    }, [mapSize]);

    useEffect(() => {
      const markerClusterGroup = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
          return L.divIcon({
            html: `<div style="background-color:#a76c05; color: #fff; border-radius: 50%; padding: 3px 15px; font-size: 15px; font-weight: bold;">${cluster.getChildCount()}</div>`,
            className: 'mycluster',
            iconSize: L.point(40, 40),
          });
        },
      });

      const customIcon = L.icon({
        iconUrl: '/arrow.png',
        iconSize: [20, 25],
      });

      data.forEach((item) => {
        const marker = L.marker([item.lat, item.lon], { icon: customIcon });
        marker.bindPopup(`
          <div>
            <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}" target="_blank">Voir sur Google Maps</a>
          </div>
        `);
        markerClusterGroup.addLayer(marker);
      });
      map.addLayer(markerClusterGroup);

      return () => {
        map.removeLayer(markerClusterGroup);
      };
    }, [map, data]);

    useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return null;
  };

  let mapStyle;
  switch (mapSize) {
    case 'taille':
      mapStyle = { height: "70vh", width: "70vw" };
      break;
    case 'full':
      mapStyle = { height: "100vh", width: "98vw" };
      break;
    case 'medium':
      mapStyle = { height: "70vh", width: "70vw" };
      break;
    case 'hidden':
      mapStyle = { display: "none" };
      break;
    default:
      mapStyle = { height: "80%", width: "90%" };
      break;
  }

  return (
    <div className='mainmap'>
      <div className='selector-map'>
        <span>Carte pour abri d'évacuation</span>
        <form className='standard-form-evac' onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={handleInputChange} placeholder="Entrez le nom de la ville" />
          <button type="submit">Afficher les abris d'évacuation</button>
        </form>
      </div>

      <div className='map' style={mapStyle}>
        <MapContainer center={[46.603354, 1.888334]} zoom={5} maxZoom={18} style={{ height: "100%", width: "100%" }}>
          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer name="Mode clair" checked>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Mode sombre">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <MarkerClusterGroupComponent />
        </MapContainer>
      </div>
      <div className='selector-map' style={{marginBottom:'3rem'}}>
        <p>Choisir la taille de la carte :</p>
        <div style={{ display: 'flex' }}>
          <div className="select-container">
            <select value={mapSize} onChange={(e) => setMapSize(e.target.value)}>
              <option value="taille">Choisir la taille de la carte </option>
              <option value="full">Plein écran</option>
              <option value="medium">Moyen</option>
              <option value="hidden">Caché</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapEvac;
