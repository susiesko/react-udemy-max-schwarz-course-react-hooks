import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const baseFetchURL = 'https://react-hooks-module-2ba54-default-rtdb.firebaseio.com';
  const [filter, setFilter] = useState('');
  const inputRef = useRef();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputRef.current.value){
        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
    
        fetch(`${baseFetchURL}/ingredients.json${query}`)
        .then(response => response.json())
        .then(data => {
          const loadedIngredients = [];
          for (const key in data) {
            loadedIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount
            })
          }
          onLoadIngredients(loadedIngredients);
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
