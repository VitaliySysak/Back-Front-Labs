import { useContext } from 'react';
import './style.css';
import CalendarContext from '../../context/calendar.context';
import { MONTHS } from '../shared/months';

const CurrentDateComponent = () => {
 const { currentDate } = useContext(CalendarContext);

 const month = currentDate.getMonth();
 const day = currentDate.getDate();
 const year = currentDate.getFullYear();

 return (<div className='current-date-wrapper'>{day} {MONTHS[month]}, {year}</div>);
};

export default CurrentDateComponent;