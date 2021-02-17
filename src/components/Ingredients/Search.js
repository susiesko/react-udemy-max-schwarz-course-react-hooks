import React, { useEffect, useState, useRef } from 'react';
import useHttp from '../../hooks/http';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();
  const {isLoading, data, error, sendRequest, clear} = useHttp();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputRef.current.value){
        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;    
        sendRequest(`/ingredients.json${query}`, 'GET');
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, onLoadIngredients, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients);      
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input 
            ref={inputRef}
            type="text"
            value={filter}
            onChange={ev => setFilter(ev.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
