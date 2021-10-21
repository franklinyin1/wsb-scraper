import axios from 'axios'

//ACTION TYPES
const SET_STOCKS = 'SET_STOCKS'

//ACTION CREATORS
const setStocks = (stocks) => {
  return {
    type: SET_STOCKS,
    stocks
  }
}

//THUNK CREATORS
export const fetchStocks = () => {
  return async (dispatch) => {
    const { data } = await axios.get('/api/stocks')
    return dispatch(setStocks(data))
  }
}

//REDUCER & INITIAL STATE
const initialState = []
export default function (stocks = [], action) {
  switch(action.type) {
    case SET_STOCKS:
      return action.stocks
    default:
      return stocks
  }
}
