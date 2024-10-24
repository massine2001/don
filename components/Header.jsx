import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faHandPaper, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './AuthContext';
import { useContext, useState } from 'react';
import Router from 'next/router';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const [isMobile, setIsMobile] = useState(false);


  const handleLogout = async () => {
    Router.push('/');
    await logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <header>
      <nav>
        <div className='header'>
          <div className='header-icons'>
            <Link href="/proposePage">
              <div>
                <FontAwesomeIcon icon={faHandHoldingHeart} />
                <p>Proposer une aide</p>
              </div>
            </Link>
            <span>|</span>
            <Link href="/requestPage">
              <div>
                <FontAwesomeIcon icon={faHandPaper} />
                <p>Demander de l'aide</p>
              </div>
            </Link>
          </div>
          {!user && <p className='header-titre-y'>PPE Project</p>}
          {user && (
            <Link href={'/profil'} className={isMobile ? 'header-titre' : 'header-titre-x'} style={{ color: "green", textDecoration:'none' }}>
              Bienvenue {user.prenom ? user.prenom : user.email}
            </Link>
          )}          <div className='header-login'>
            {!user && <FontAwesomeIcon icon={faUser} />}
            {!user && <Link className='header-profil' href="/login">Se connecter</Link>}
            {user && <div className='header-menu' onClick={toggleMenu} ref={menuRef}>
              <FontAwesomeIcon icon={faBars} onClick={toggleMenu} size="3x" />
              {isOpen && (
                <div className="dropdown-menu">
                  <Link href="/profil">Profil</Link>
                  <Link href="/evacuation">Trouver un abri d'urgence</Link>
                  <Link href="/proposePage">Faire un don</Link>
                  <Link href="/requestPage">Demander de l'aide</Link>
                  <Link href="/mesPropositions">Mes dons</Link>
                  <a onClick={handleLogout}>Déconnexion</a>
                </div>
              )}
            </div>}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
