import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const baseFetchURL = 'https://react-hooks-module-2ba54-default-rtdb.firebaseio.com';
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [ isLoading, setIsLoading] = useState(false);
  const [ error, setError ] = useState();

  useEffect(() => {
    console.log('rendering ingredients', userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch(`${baseFetchURL}/ingredients.json`, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(data => {
      setUserIngredients(prevIngredients => [...prevIngredients, { id: data.name, ...ingredient }]);
    }).catch(error => {
      setError('Something went wrong!');
      setIsLoading(false);
    });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`${baseFetchURL}/ingredients/${id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      setIsLoading(false);
      setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
    }).catch(error => {
      setError('Something went wrong!');
      setIsLoading(false);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

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
