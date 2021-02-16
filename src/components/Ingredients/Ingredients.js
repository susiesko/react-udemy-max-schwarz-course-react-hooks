import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

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

const Ingredients = () => {
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);
  const { isLoading, data, error, sendRequest } = useHttp();

  useEffect(() => {
  }, [userIngredients]);
  
  const addIngredientHandler = useCallback(ingredient => {
    //dispatchHttp({ type: 'SEND' });
    sendRequest(`/ingredients.json`, 'POST', JSON.stringify(ingredient));
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(`/ingredients/${id}.json`, 'DELETE');
    //dispatchHttp({ type: 'SEND' });
  }, [sendRequest]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
    //setUserIngredients(filteredIngredients);
  }, []);

  const clearError = useCallback(() => {
    //dispatchHttp({ type: 'CLEAR' });
  }, [])

  const ingredientList = useMemo(() => {
    return <IngredientList 
      ingredients={userIngredients} 
      onRemoveItem={removeIngredientHandler} 
    />;
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search 
          onLoadIngredients={filteredIngredientsHandler}
        />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
