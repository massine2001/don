import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ aides }) => {
  const [visibleAides, setVisibleAides] = useState(aides.slice(0, 100));
  const [mapSize, setMapSize] = useState('taille');
  const [filter, setFilter] = useState('filtre');
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMapSize('hidden');
      } else {
        setMapSize('taille');
      }
    };
    
    handleResize();
  }, []);
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

      visibleAides.forEach((aide) => {
        if (filter === 'filtre' || aide.type === filter) {
          const marker = L.marker([aide.latitude, aide.longitude], { icon: customIcon });
          marker.bindPopup(`
            <div>
              <a href="/aideDetail/${aide.id}">Une aide ici à ${aide.ville}</a>
              <p>${aide.type}</p>
            </div>
          `);
          markerClusterGroup.addLayer(marker);
        }
      });
      map.addLayer(markerClusterGroup);

      return () => {
        map.removeLayer(markerClusterGroup);
      };
    }, [map, visibleAides]);

    map.on('zoomend', () => {
      const zoomLevel = map.getZoom();
      if (zoomLevel > 5) {
        setVisibleAides(aides);
      } else {
        setVisibleAides(aides.slice(0, 20));
      }
    });

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
        <span>Carte des offres disponible</span>
        <p>Choisir la taille de la carte ou lui appliquer des filtres :</p>
      <div style={{ display: 'flex' }}>
        <div className="select-container">
          <select value={mapSize} onChange={(e) => setMapSize(e.target.value)}>
            <option value="taille">Choisir la taille de la carte </option>
            <option value="full">Plein écran</option>
            <option value="medium">Moyen</option>
            <option value="hidden">Caché</option>
          </select>
        </div>
        <div className='select-container'>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="filtre">Filtrer par catégorie</option>
            <option value="Aide matérielle">Aide matérielle</option>
            <option value="Aide financière">Aide financière</option>
            <option value="Logement">Logement</option>
          </select>
        </div>
      </div>
      </div>
      
      <div className='map' style={mapStyle}>
        <MapContainer center={[46.603354, 1.888334]} zoom={5} maxZoom={18} style={{ height: "100%", width: "100%" }}>
          <LayersControl position="topright">
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
    </div>
  );
};

export default MapComponent;
