import { useState, useRef } from 'react';
import './style.css';
import * as uuid from 'uuid';

const isArrayEqual = (selected, correct) => {

 if (selected.length !== correct.length) {
  return false;
 }
 return correct.filter(e => !selected.includes(e)).length === 0;
};

const MultiAnswerComponent = (props) => {

 const [Attempts, setAttempts] = useState(0);
 const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
 let [selectedAnswerIndex, setSelectedAnswerIndex] = useState([]);

 const correctRef = useRef();
 const wrongRef = useRef();
 const showCorrectAnswerButton = useRef();

 const checkboxClick = (index, status) => {
  if (status) {
   selectedAnswerIndex.push(index);
  } else {
   selectedAnswerIndex = selectedAnswerIndex.filter(e => e !== index);
  }
  wrongRef.current.classList.remove('selected');
  correctRef.current.classList.remove('selected');
 };

 const checkOnClick = () => {
  if (isArrayEqual(selectedAnswerIndex, props.correctAnswer)) {
   correctRef.current.classList.add('selected');
   wrongRef.current.classList.remove('selected');
   showCorrectAnswerButton.current.classList.remove('show');
  } else {
   wrongRef.current.classList.add('selected');
   correctRef.current.classList.remove('selected');
   showCorrectAnswerButton.current.classList.remove('show');
   setAttempts(Attempts + 1);
  }
  if (Attempts >= 2) {
    showCorrectAnswerButton.current.classList.add('show');
  }
 };

 function showAnswerFunct() {
    setShowCorrectAnswer(true);
    setSelectedAnswerIndex(props.correctAnswer)
 }

 return (
  <div className='question single-answer'>
   <div><h3>{props.question}</h3></div>
   <div className='answers'>
    {props.answers.map((answer, i) => {
     const id = uuid.v1();
     const checkedAnswer = props.correctAnswer.includes(i) && showCorrectAnswer
     return (<div>
      <input
       id={id}
       type='checkbox'
       onClick={(e) => checkboxClick(i, e.currentTarget.checked)}
       defaultChecked = {checkedAnswer}
       checked = {checkedAnswer ? true : undefined}
       disabled = {showCorrectAnswer}
      />
      {checkedAnswer
    ? <label style={{color : "green"}} for={id}>{answer}</label> 
    :  <label for={id}>{answer}</label>}
     </div>);
    })}
   </div>
   <div className='check'>
    <div className='button' onClick={checkOnClick}>
     check my answer
     <div ref={correctRef} className='correct'>correct</div>
     <div ref={wrongRef} className='wrong'>wrong</div>
    </div>
    <div className= 'showButton' onClick={showAnswerFunct} ref={showCorrectAnswerButton}>
    show me correct answer
        </div>
   </div>
  </div>
 );
};

export default MultiAnswerComponent;