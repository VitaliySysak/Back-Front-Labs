import { useContext } from 'react';
import './style.css';
import GoodsContext from '../../context/goods.context';
import GoodsComponent from '../goods';

const CounterComponent = () => {
  const { selectedGoods, addGoods, removeAllGoods, data } = useContext(GoodsContext);

  const sum = selectedGoods.reduce((acc, cur) => {
    return acc + cur.cost;
  }, 0);

  const autoDetect = () => {
    const combinations = generateCombinations(data, 40);
    const bestCombination = findBestCombination(combinations);
    
    removeAllGoods();
    bestCombination.forEach((goods) => {
      addGoods(goods);
    });
  };

  const generateCombinations = (goodsList, targetSum) => {
    const result = [];
    const current = [];
  
    const helper = (index, sum) => {
      if (sum >= targetSum) {
        result.push([...current]);
        return;
      }
  
      for (let i = index; i < goodsList.length; i++) {
        current.push(goodsList[i]);
        helper(i + 1, sum + goodsList[i].cost);
        current.pop();
      }
    };
  
    helper(0, 0);
    return result;
  };

  const findBestCombination = (combinations) => {
    let bestCombination = null;
    let minCost = Infinity;

    combinations.forEach((combination) => {
      const combinationCost = combination.reduce((acc, cur) => acc + cur.cost, 0);
      if (combinationCost >= 40 && combinationCost < minCost) {
        minCost = combinationCost;
        bestCombination = combination;
      }
    });

    return bestCombination;
  };

  return (
    <div className='cost-wrapper'>
      <div>{sum}/40</div>
      <div className='auto-detect' onClick={autoDetect}>auto-detect</div>
      <div className='selected-goods'>
        {selectedGoods.map((el) => (
          <GoodsComponent {...el} key={'selected' + el.id} />
        ))}
      </div>
    </div>
  );
};

export default CounterComponent;
