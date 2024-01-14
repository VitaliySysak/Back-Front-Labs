import { useRef, useState } from 'react';
import './style.css';
import * as uuid from 'uuid';

const SingleAnswerComponent = (props) => {

 const [attempts, setAttempts] = useState(0);
 let [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
 const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

 const correctRef = useRef();
 const wrongRef = useRef();
 const showCorrectAnswerButton = useRef();

 const radioClick = (index) => {
  setSelectedAnswerIndex(index);
  wrongRef.current.classList.remove('selected');
  correctRef.current.classList.remove('selected');
  showCorrectAnswerButton.current.classList.remove('show')
 };

 const checkOnClick = () => {
  if (selectedAnswerIndex === props.correctAnswer) {
   correctRef.current.classList.add('selected');
   wrongRef.current.classList.remove('selected');
   showCorrectAnswerButton.current.classList.remove('show');

  } else {
   wrongRef.current.classList.add('selected');
   correctRef.current.classList.remove('selected');
   showCorrectAnswerButton.current.classList.remove('show');
   setAttempts(attempts + 1);
   console.log(attempts)
  }
  if (attempts >= 2) {
    showCorrectAnswerButton.current.classList.add('show');
  }
 };

 function showAnswerFunct() {
    setShowCorrectAnswer(true);
    setSelectedAnswerIndex(props.correctAnswer)
    showCorrectAnswerButton.current.classList.remove('show')
 }

 const qId = uuid.v1();

 return (
  <div className='question single-answer'>
   <div><h3>{props.question}</h3></div>
   <div className='answers'>
    {props.answers.map((answer, i) => {
     const id = uuid.v1();
     const checkedAnswer = showCorrectAnswer && selectedAnswerIndex === i

     return (<div>
      <input
       id={id}
       type='radio'
       name={`group-${qId}`}
       onClick={() => radioClick(i)}
       defaultChecked = {checkedAnswer}
       checked = {checkedAnswer ? true : undefined}
      />
      {checkedAnswer
      ? <label style={{color: "green"}} for={id}>{answer}</label>
      : <label for={id}>{answer}</label>}
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

export default SingleAnswerComponent;