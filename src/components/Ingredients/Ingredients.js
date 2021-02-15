import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get here!');
  }
}

const Ingredients = () => {
  const baseFetchURL = 'https://react-hooks-module-2ba54-default-rtdb.firebaseio.com';
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);
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
      dispatch({type: 'ADD', ingredient: { id: data.name, ...ingredient }})
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
      dispatch({type: 'DELETE', id});
    }).catch(error => {
      setError('Something went wrong!');
      setIsLoading(false);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
    //setUserIngredients(filteredIngredients);
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
