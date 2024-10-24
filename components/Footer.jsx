import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <nav>
        <div className='footer'>
          <Link className='text-footer' href="/requestPage">
            Vous ne trouvez pas l'aide qui vous convient ? Rédigez une demande ici
          </Link>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
