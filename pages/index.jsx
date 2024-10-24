import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../components/supabaseClient';

const HomePage = () => {
  const [donationsCount, setDonationsCount] = useState(0);

  useEffect(() => {
    const fetchDonationsCount = async () => {
      try {
        const { count, error } = await supabase.from('aide_tracer').select('*', { count: 'exact' });
        if (error) {
          setDonationsCount(0);
        } else {
          setDonationsCount(count);
        }
      } catch (error) {
        setDonationsCount(0);
      }
    };

    fetchDonationsCount();
  }, []);

  return (
    <MainLayout>

      <div className='home'>
        <div className='home-1'>
        <div className='home-contenu'>
          <div className='home-titre'>
            <span className='home-titre-1'>Aide aux victimes</span>
            <span className='home-titre-2'>de catastrophes</span>
            <span className='home-titre-2'> naturelles</span>
          </div>
          <Link href="/aide" className='link-home'>
            <div className='home-btn-aide'>
              <span className='home-btn-txt-1'>Je suis sinistré</span>
              <span className='home-btn-txt-2'>Je cherche de l'aide</span>
            </div>
          </Link>
          <Link href="/proposePage" className='link-home'>
            <div className='home-btn-don'>
              <span className='home-btn-txt-1'>Je suis un particulier</span>
              <span className='home-btn-txt-2'>Proposer une aide</span>
            </div>
          </Link>
        </div>
        <div className='home-donations-count'>
          <h2>Nombre de dons partagés</h2>
          <p>{donationsCount}</p>
        </div>
        </div>
      
        <div className='home-description animated'>
        <div className='home-feature animated'>
        <span className='home-titre-1'>Notre but ?</span>

          <div>
            <span className='home-titre-2'>Ce site a pour but d'aider les sinistrés de France.</span>
            <h2 className='home-titre-2'>Nos objectifs :</h2>
            <li className='home-titre-2'>Faciliter la collecte de dons et leur distribution équitable.</li>
            <li className='home-titre-2'>Assurer la transparence dans l'utilisation des fonds recueillis.</li>
            <li className='home-titre-2'>Apporter un soutien rapide et efficace aux sinistrés.</li>
            <li className='home-titre-2'>Créer une communauté solidaire qui se mobilise en cas de besoin.</li>
          </div>
            <Link href="/about">
              <span className='home-btn'>En savoir plus</span>
            </Link>
            <Link href="/contact">
              <span className='home-titre-2' style={{textDecoration:'none'}}>Nous contacter</span>
            </Link>
          </div>
          <div className='home-feature animated'>
          <span className='home-titre-1'>Fonctionnalité utile !</span>
            <div>
              <span className='home-titre-2'>Vérifier les dernières nouvelles dans votre région.</span>
              <span className='home-titre-2'>Restez informé sur les événements tragiques qui affectent votre communauté.<br/> Notre fonctionnalité de suivi des catastrophes vous permet de visualiser rapidement et facilement les incidents récents dans votre région.<br/> Soyez conscient des défis auxquels vos voisins font face et découvrez comment vous pouvez contribuer à aider ceux qui en ont le plus besoin.</span>  
            </div>
           <Link href="/checkRegion">
              <span className='home-btn'>Vérifier ma région</span>
            </Link>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
