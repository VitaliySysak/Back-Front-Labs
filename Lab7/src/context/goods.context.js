import { createContext } from 'react';

const GoodsContext = new createContext({
 selectedGoods: []
});

export default GoodsContext;