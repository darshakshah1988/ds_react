## Readme

We are using directory name as `slices` instead of `reducers`.

The term `slices` came about when [@reduxjs/toolkit](https://redux-toolkit.js.org/introduction/getting-started) was introduced. `Slices` are an alternative to vanilla `reducer function`. As we know, the vanilla `reducer function` has many switch cases and updates the redux store based on the payload from the dispatch action.

[@reduxjs/toolkit](https://redux-toolkit.js.org/introduction/getting-started) does not use `reducer function` with switch cases instead it will use a  `slice` which is nothing but a Javascript object. This object will contain properties like `name`, `initialState`, and `reducers`. The `reducers` property is also an object which contains only functions. These functions will take parameters like the `previousState` and `action` object. You can consider these functions as small `reducers`.

### Example:

**Without @reduxjs/toolkit**
```js
const initialState = {
  value: 0,
};

const reducerFunction = (prevState = initialState, action) => {
  switch (action.type) {
    case 'increment':
      // Maybe in future our state object can contain more properties
      // so it is safer to create copy of previous object with spread operator.
      return { ...prevState, count: prevState.value + 1 };
    default:
      return prevState;
  }
};

const rootReducer = combineReducers({
  counter: reducerFunction,
});

export default store = createStore(rootReducer);

// Our dispatch action to the store
dispatch({ type: 'increment', payload: 'First action.' });
```

**With @reduxjs/toolkit**

```js
import { createSlice } from '@reduxjs/toolkit'  
  
const initialState = {  
  value: 0,  
}  
  
export const counterSlice = createSlice({  
  name: 'counter',  
  initialState,  
  reducers: {  
  increment: (prevState, action) => {  
  // Redux Toolkit allows us to write "mutating" logic in reducers. It  
  // doesn't actually mutate the state because it uses the Immer library,  
  // which detects changes to a "draft state" and produces a brand new  
  // immutable state based on those changes
  prevState.value += 1  
  }
 },})
  
// Action creators are generated for each case reducer function  
export const { increment } = counterSlice.actions;

export default counterSlice.reducer


```

```js
import { configureStore } from '@reduxjs/toolkit';

import counterReducer from '/slices/counterSlice';
  
export default configureStore({  
  // all reducers of our app  
  reducer: {  
  counter: counterSlice  
 }});
```

```js
// Our dispatch action to the store
dispatch(increment())

// Dispatch action to the store with a payload
dispatch(increment(10))
```

You can read more about this in [docs](https://redux-toolkit.js.org/usage/usage-guide).
