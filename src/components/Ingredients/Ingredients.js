import React, { useReducer, useEffect, useCallback } from 'react';

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
      throw new Error('Should not be reached!');
  }
}

const httpReducer = (httpState, action) => {
  switch(action.type){
    case 'SEND': 
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false };
    case 'ERROR': 
      return { loading: false, error: action.error };
    case 'CLEAR':
      return { ...httpState, error: null };
    default: 
      throw new Error('Should not be reached!');
  }
}

const Ingredients = () => {
  const baseFetchURL = 'https://react-hooks-module-2ba54-default-rtdb.firebaseio.com';
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);
  const [ httpState, dispatchHttp ] = useReducer(httpReducer, { loading: false, error: null });

  useEffect(() => {
  }, [userIngredients]);

  const addIngredientHandler = ingredient => {
    dispatchHttp({ type: 'SEND' });

    fetch(`${baseFetchURL}/ingredients.json`, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      return response.json();
    }).then(data => {
      dispatch({type: 'ADD', ingredient: { id: data.name, ...ingredient }})
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', error: error.message });
    });
  };

  const removeIngredientHandler = id => {
    dispatchHttp({ type: 'SEND' });
    fetch(`${baseFetchURL}/ingredients/${id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      dispatchHttp({ type: 'RESPONSE' });
      dispatch({type: 'DELETE', id});
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', error: error.message });
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
    //setUserIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

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
