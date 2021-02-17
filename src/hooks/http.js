import { useCallback, useReducer } from 'react';

const baseURL = 'https://react-hooks-module-2ba54-default-rtdb.firebaseio.com';
const initialState = { 
  loading: false, 
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (httpState, action) => {
  switch(action.type){
    case 'SEND': 
      return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
    case 'RESPONSE':
      return { ...httpState, loading: false, data: action.data, extra: action.extra };
    case 'ERROR': 
      return { loading: false, error: action.error };
    case 'CLEAR':
      return initialState;
    default: 
      throw new Error('Should not be reached!');
  }
}

const useHttp = () => {
  const [ httpState, dispatchHttp ] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: 'SEND', identifier })
    fetch (`${baseURL}${url}`, {
      method, 
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      return res.json();
    }).then(data => {
      dispatchHttp({ type: 'RESPONSE', data, extra });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', error: error.message });
    });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear
  };
};

export default useHttp;