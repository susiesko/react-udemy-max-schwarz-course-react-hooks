import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-module-2ba54-default-rtdb.firebaseio.com/ingredients.json', {
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
    setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
