import { useContext } from 'react';
import './style.css';
import CalendarContext from '../../context/calendar.context';

const groupName = 'period-selector';

/**
 * 
 * @param {Object} props 
 * @param {string} props.title 
 * @param {string} props.keyName 
 * @returns 
 */
const RadioComponent = (props) => {

 const { setSelectedPeriod } = useContext(CalendarContext);

 const click = () => setSelectedPeriod(props.keyName);

 return (
  <div className='radio-wrapper'>
   <label onClick={click}>
    <input
     type='radio'
     name={groupName}
    />
    {props.title}
   </label>
  </div>
 );
};

export default RadioComponent;