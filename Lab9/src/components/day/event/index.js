import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import CalendarContext from '../../../context/calendar.context';

/**
 * 
 * @param {Object} props 
 * @param {{ id: string, title: string, description: string, date: string }} props.event 
 * @returns 
 */
const EventComponent = (props) => {
 const { removeEvent: contextRemoveEvent, setCreateEvent } = useContext(CalendarContext);
 const { title, date, description, id } = props.event;

 const click = (event) => {
  event.stopPropagation();
  setCreateEvent({
   id,
   date,
   title,
   description,
   clientX: event.clientX,
   clientY: event.clientY
  });
 };

 const removeEvent = () => {
  contextRemoveEvent(props.event);
 };

 return (
  <div className='event-wrapper' onClick={click}>
   <FontAwesomeIcon icon={faClose} id='event-close' onClick={removeEvent} />
   {title}
  </div>
 );
};

export default EventComponent;