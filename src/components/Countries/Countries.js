import React, { useEffect, useState } from 'react';
import './countries.css';
import { useQuery, gql } from '@apollo/client';
import axios from 'axios';
import Modal from 'react-modal';

const ALL_COUNTRIES = gql`
  query allcountries {
    countries {
      name
      continent {
        name
      }
      capital
      emoji
      languages {
        name
      }
      currency
      states {
        name
      }
    }
  }
`;

const Countries = () => {
  const { data, loading, error } = useQuery(ALL_COUNTRIES);
  const [flags, setFlags] = useState({});
  const [countryImages, setCountryImages] = useState({});
  const [filterCountry, setFilterCountry] = useState('');
  const [filterContinent, setFilterContinent] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (data && data.countries) {
      // Por cada país, realiza una consulta a Pixabay para obtener la imagen correspondiente
      const requests = data.countries.map((country) =>
        axios.get(`https://pixabay.com/api/?key=41375322-d0519b28ade79975071bfd9a2&q=${country.name}&image_type=photo`)
      );

      // Ejecuta las consultas a Pixabay en paralelo
      axios
        .all(requests)
        .then(
          axios.spread((...responses) => {
            // Almacena las imágenes en el estado
            const images = responses.map((response) => response.data.hits[0]?.webformatURL || ''); // Usa la primera imagen disponible
            const countryImageMap = data.countries.reduce((acc, country, index) => {
              acc[country.name] = images[index];
              return acc;
            }, {});
            setCountryImages(countryImageMap);
          })
        )
        .catch((error) => {
          console.error('Error fetching images from Pixabay:', error);
        });
    }
  }, [data]);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v2/all');
        const flagData = response.data.reduce((acc, country) => {
          acc[country.name] = country.flags.png;
          return acc;
        }, {});
        setFlags(flagData);
      } catch (error) {
        console.error('Error fetching flags:', error);
      }
    };

    fetchFlags();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>There is an error</p>;
  }

  const filteredCountries = data.countries.filter((country) => {
    // Filtrar por nombre de país
    const filterCountryCondition =
      filterCountry === '' || country.name.toLowerCase().includes(filterCountry.toLowerCase());

    // Filtrar por continente
    const filterContinentCondition =
      filterContinent === '' || country.continent.name.toLowerCase() === filterContinent.toLowerCase();

    return filterCountryCondition && filterContinentCondition;
  });

  const openModal = (country) => {
    setSelectedCountry(country);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCountry(null);
  };

  return (
    <>
      <div className="filter-container">
        <label>
          Filtrar por país:
          <input
            type="text"
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            readOnly={false}
            className="filter-input"
          />
        </label>
        <label>
          Filtrar por continente:
          <input
            type="text"
            value={filterContinent}
            onChange={(e) => setFilterContinent(e.target.value)}
            readOnly={false}
            className="filter-input"
          />
        </label>
      </div>
      <div className="home-section">
        {filteredCountries.map((country) => (
          <div className="card" key={country.name} onClick={() => openModal(country)}>
            <div className="poster">
              <img src={countryImages[country.name]} alt={`Flag of ${country.name}`} />
            </div>
            <div className="details">
              <div className="imgcontent">
                <img src={flags[country.name]} alt={`Flag of ${country.name}`} />
                <span>{country.name}</span>
              </div>
              <div className="tags">
                <span className="fantasy">{country.name}</span>
                <span className="mystery">{country.continent.name}</span>
              </div>
              <div className="info">
                <p>Capital: {country.capital}</p>
                <ul>
                  <li>
                    <strong>Estados:</strong>
                    <ul>
                      {country.states.map((state) => (
                        <li key={state.name}>{state.name}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Country Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedCountry && (
          <>
            <h2>{selectedCountry.name}</h2>
            <p>Capital: {selectedCountry.capital}</p>
            <p>Continent: {selectedCountry.continent.name}</p>
            <p>Languages: {selectedCountry.languages.map((lang) => lang.name).join(', ')}</p>
            {/* Agrega más detalles según tus necesidades */}
            <button onClick={closeModal}>Close</button>
          </>
        )}
      </Modal>
    </>
  );
};

export default Countries;
