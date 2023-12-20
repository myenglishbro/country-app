import React, { useState } from 'react';
import './Navbar.css';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from '../../constants/index.js';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';

const Navbar = () => {
  // Paso 1: Desestructura el valor del estado actual y la función para actualizarlo
  const [sidebar, setSidebar] = useState(false);

  // Paso 2: Crea una función para cambiar el estado
  const showSidebar = () => setSidebar(!sidebar);

  // Paso 3: Devuelve la interfaz del componente
  return (
    <>
      {/* Paso 4: Proporciona el contexto para los iconos con IconContext.Provider */}
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          {/* Paso 5: Agrega un enlace con el ícono FaBars y el evento onClick */}
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        {/* Paso 6: Agrega la barra de navegación con la clase condicional para el estado activo */}
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            {/* Paso 7: Mapea los elementos de la barra lateral desde SidebarData */}
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
