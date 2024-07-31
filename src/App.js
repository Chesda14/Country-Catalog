
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Fuse from 'fuse.js';
import Modal from './CountryModal';


function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const itemsPerPage = 25;

  const getCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      console.log('API response:', response.data);
      setCountries(response.data);
      setFilteredCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const fuse = new Fuse(countries, { keys: ['name.official'] });
    const result = term ? fuse.search(term).map(({ item }) => item) : countries;
    setFilteredCountries(result);
  };

  const handleSort = () => {
    const sorted = [...filteredCountries].sort((a, b) => {
      const nameA = a.name.official.toUpperCase();
      const nameB = b.name.official.toUpperCase();
      if (sortOrder === 'asc') {
        return nameA > nameB ? 1 : -1;
      } else {
        return nameA < nameB ? 1 : -1;
      }
    });
    setFilteredCountries(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleClose = () => setSelectedCountry(null);

  const displayCountries = filteredCountries.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className='container pt-5'>
      <h3>Country Catalog Implementation</h3>
      <hr />
    
      <div className='row p-3 '>
        <div className='col-lg-4'>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Country..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button onClick={handleSort} className="btn btn-primary">
              Sort to {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>
      </div>
  
     

      <div className='row pt-3'>
        <div className='col-lg-12'>
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th className="">N0.</th>
                <th className="col-sm-1">Flag</th>
                <th className="col-sm-2">Country Name</th>
                <th className="col-sm-1">2-Char</th>
                <th className="col-sm-1">3-Char</th>
                <th className="col-sm-2">Native Name</th>
                <th className="col-sm-3">Alternative Name</th>
                <th className="col-sm-2">Calling Codes</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {displayCountries.map((country, index) => (
                <tr >
                  <td>{currentPage * itemsPerPage + index + 1}.</td>
                  <td><img src={country.flags.png} alt={`Flag of ${country.name.official}`} width="50" /></td>
                  <td key={country} onClick={() => setSelectedCountry(country)}>{country.name.official}</td>
                  <td>{country.cca2}</td>
                  <td>{country.cca3}</td>
                  <td>{Object.values(country.name.nativeName || {}).map(n => n.common).join(', ')}</td>
                  <td>{country.altSpellings.join(', ')}</td>
                  <td>{country.idd.root}{country.idd.suffixes ? country.idd.suffixes.join(', ') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <nav aria-label="Page navigation example" className='pt-4 pb-5 float-end'>
            <ReactPaginate
              previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={'...'}
              pageCount={Math.ceil(filteredCountries.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
            />
          </nav>

          <Modal
            show={!!selectedCountry}
            handleClose={handleClose}
            country={selectedCountry}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

