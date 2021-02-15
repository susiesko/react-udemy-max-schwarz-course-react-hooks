import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const baseFetchURL = 'https://react-hooks-module-2ba54-default-rtdb.firebaseio.com';
  const [ userIngredients, setUserIngredients ] = useState([]);

  useEffect(() => {
    console.log('rendering ingredients', userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = ingredient => {
    fetch(`${baseFetchURL}/ingredients.json`, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      setUserIngredients(prevIngredients => [...prevIngredients, { id: data.name, ...ingredient }]);
    });
  };

  const removeIngredientHandler = id => {
    fetch(`${baseFetchURL}/ingredients/${id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, [])

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search 
          onLoadIngredients={filteredIngredientsHandler}
        />
        <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler} 
        />
      </section>
    </div>
  );
}

export default Ingredients;
