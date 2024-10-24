import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div className="navbar">
        <Link href="/checkRegion" className='navbar-1'>Ma région</Link>
        <Link href="/" className='navbar-1'>Accueil</Link>
        <Link href="/aide" className='navbar-1'>Aide</Link>
        <Link href="/evacuation" className='navbar-1'>Abri d'urg.</Link>
      </div>
    </nav>
  );
};

export default Navbar;