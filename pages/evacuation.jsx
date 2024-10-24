import React from 'react';
import MainLayout from '../layouts/MainLayout';
import dynamic from 'next/dynamic';

const MapEvac = dynamic(() => import('../components/mapEvac'), {
    ssr: false
});

const MapEvacInput = () => {
  return (
    <MainLayout>
      <div>
        <MapEvac />
      </div>
    </MainLayout>
  );
};

export default MapEvacInput;