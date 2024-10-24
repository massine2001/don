import React from 'react';
import MainLayout from '../layouts/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className='standard-container'>
      <div className='standard-card'>
      <div class='about-container'>
  <h2 class='about-titre-1'>À Propos de Nous</h2>

  <p class='about-description'>
    Bienvenue sur Ppe Project 'Aide aux sinistrés', une initiative née de la volonté de faire une différence positive dans la vie des personnes touchées par des catastrophes en France. Nous croyons en la force de la solidarité et en la capacité de chacun à apporter son soutien dans les moments difficiles. Notre mission est de faciliter la gestion des dons pour les sinistrés, de créer une plateforme transparente et efficace pour canaliser l'aide vers ceux qui en ont le plus besoin.
  </p>

  <p class='about-valeurs'>
    À Ppe Project 'Aide aux sinistrés', nous nous engageons à respecter les valeurs suivantes :
  </p>

  <ul class='about-liste-valeurs'>
    <li><span class='about-highlight'>Solidarité :</span> Unis dans l'entraide, nous croyons en la force collective pour surmonter les épreuves.</li>
    <li><span class='about-highlight'>Transparence :</span> Nous mettons un accent particulier sur la clarté et la transparence dans toutes nos actions. Chaque don compte, et nous vous assurons que votre générosité atteint directement ceux qui en ont besoin.</li>
    <li><span class='about-highlight'>Efficacité :</span> Nous sommes déterminés à être une force efficace dans la gestion des ressources et des dons. Notre objectif est d'apporter un soutien rapide et significatif aux sinistrés.</li>
  </ul>

  <p class='about-appel-action'>
    <strong>Rejoignez-nous dans cette Mission</strong><br/>
    À Ppe Project 'Aide aux sinistrés', nous croyons que chaque personne a le pouvoir de changer des vies. Rejoignez-nous dans cette mission d'apporter de l'aide et de l'espoir aux communautés touchées par des catastrophes. Explorez notre plateforme, découvrez nos initiatives et contribuez à construire un avenir meilleur pour ceux qui en ont le plus besoin. Ensemble, nous pouvons faire une réelle différence.
  </p>
</div>

      </div>
      </div>
     </MainLayout>
  );
};

export default AboutPage;
