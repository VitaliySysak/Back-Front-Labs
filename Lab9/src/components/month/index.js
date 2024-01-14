import { useContext, useState } from 'react';
import { MONTHS } from '../shared/months';
import './style.css';
import CalendarContext from '../../context/calendar.context';

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDaysInMonth (year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const MonthComponent = () => {
  const { currentDate, setCurrentDate } = useContext(CalendarContext);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysCount = getDaysInMonth(currentYear, currentMonth);

  // const dayComponents = [];
  // for (let i = 1; i <= daysCount; i += 1) {
  //   const date = new Date(currentDate);
  //   date.setDate(i);
  //   const dayOfWeek = date.getDay();
  //   dayComponents.push(
  //     <div
  //       style={{ "--day-col-start": dayOfWeek }}
  //       className='content-item day'
  //     >{i}</div>
  //   );
  // }

  const click = (day) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(day);
      return newDate;
    });
  };

  return (
    <div className='content-wrapper month-wrapper'>
      <div className='header'>{MONTHS[currentMonth]}</div>
      {
        WEEK_DAYS.map(dayName => (<div className='day-name'>{dayName}</div>))
      }
      {/* {dayComponents} */}
      {
        Array(daysCount).fill(null)
          .map((el, i) => {
            const date = new Date(currentDate);
            date.setDate(i + 1);
            const dayOfWeek = date.getDay();
            return (
              <div
                onClick={() => click(i + 1)}
                style={{ "--day-col-start": dayOfWeek }}
                className='content-item day'
              >{i + 1}</div>
            );
          })
      }
    </div>
  );
};

export default MonthComponent;