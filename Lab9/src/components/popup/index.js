import { useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import './style.css';
import CalendarContext from '../../context/calendar.context';

const PopupComponent = () => {

 const { createEvent, setCreateEvent, addEvent, updateEvent } = useContext(CalendarContext);

 const inputRef = useRef();
 const textareaRef = useRef();

 if (createEvent == null) {
  return null;
 }

 const top = createEvent.clientY;
 const left = createEvent.clientX;
 const date = createEvent.date;

 const close = () => {
  setCreateEvent(null);
 };

 const isEditMode = Boolean(createEvent.id);


 const save = () => {

  const title = inputRef.current.value;
  const description = textareaRef.current.value;

  if (isEditMode) {
   updateEvent({
    id: createEvent.id,
    date,
    title,
    description,
   });
  } else {
   addEvent({
    date,
    title,
    description,
   });
  }


  close();
 };

 return (
  <div
   style={{ top: top, left: left }}
   className='popup-wrapper'>
   <FontAwesomeIcon icon={faClose} id='popup-close' onClick={close} />
   <div>
    <div>Date: {date.toLocaleString()}</div>
    <div className='popup-title'>
     Title:
     <input
      ref={inputRef}
      defaultValue={isEditMode ? createEvent.title : ""}
     />
    </div>
    <div className='popup-description'>
     Description:
     <textarea
      ref={textareaRef}
      defaultValue={isEditMode ? createEvent.description : ""}
     ></textarea>
    </div>
   </div>
   <button onClick={save}>save</button>
  </div>
 );


};

export default PopupComponent;