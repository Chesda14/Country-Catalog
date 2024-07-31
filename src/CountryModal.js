
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CountryModal = ({ show, handleClose, country }) => {
  if (!country) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header >
        <Modal.Title>{country.name.official}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex '>
        <img src={country.flags.png} alt={`Flag of ${country.name.official}`} width="50%" />
        <div className='p-3'>
        <p>Country 2-Charactor Code: <b>{country.cca2}</b></p>
        <p>Country 3-Charactor Code: <b>{country.cca3}</b></p>
        <p>Native Country Name: <b>{Object.values(country.name.nativeName || {}).map(n => n.common).join(', ')}</b></p>
        <p>Alternative Country Names: <b>{country.altSpellings.join(', ')}</b></p>
        <p>Country Calling Codes: <b>{country.idd.root}{country.idd.suffixes ? country.idd.suffixes.join(', ') : ''}</b></p>
        </div>
        
        </div>
       
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CountryModal;
