import React from 'react'

function Break(props) {
  return(
  <div className="break">
      <span id="break-label">BREAK LENGTH: </span>
      <span id="break-length">{props.breakTime / 60}</span> Minutes
      <br />
      <button id="break-decrement" onClick={props.breakTime > 60 && props.handleDec}>-1 Min</button>
      <button id="break-increment" onClick={props.breakTime < 3600 && props.handleInc}>+1 Min</button>
  </div>
  )
}

function Session(props) {
  return(
  <div className="session">
      <span id="session-label">SESSION LENGTH: </span>
      <span id="session-length">{props.sessionTime / 60}</span> Minutes
      <br />
      <button id="session-decrement" onClick={props.sessionTime > 60 && props.handleDec}>-1 Min</button>
      <button id="session-increment" onClick={props.sessionTime < 3600 && props.handleInc}>+1 Min</button>
  </div>
  )
}

function Timer(props) {
  
  const [timeRemaining, setTimeRemaining] = React.useState({
    time: props.sessionTime
  })
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (props.pauseState) {
        null
      } else {
        props.handleClock()
      }
    }, 1000);
    return () => clearInterval(timer);
  });
  
   function timeMath() {
      let minutes = Math.floor(props.timeLeft / 60)
      let seconds = props.timeLeft % 60
      if (seconds < 10) {
        seconds = `${0}${seconds}`
      }
      if (minutes < 10) {
          minutes = `${0}${minutes}`
    }
    return `${minutes}:${seconds}`
  }
  
    function resetFunc() {
      props.resetHandler()
    }
  
  return(
  <div className="timer"><span id="timer-label">{props.sessionBool ? "Session" : "Break"} </span>
      Time Remaining: <span id="time-left">{timeMath()}</span>
  <br />
      <button id="start_stop" onClick={props.pauseHandler}>START/PAUSE</button>
      <button id="reset" onClick={resetFunc}>RESET</button>
  </div>
   
  )
}

function App() {
  
  const [state, setState] = React.useState({
    break: 300,
    session: 1500,
    sessionBool: true,
    pause: true,
    timeLeft: 1500
  })
  
  const audio = document.getElementById("beep")
  
  function pause() {
    setState(() => ({
      ...state,
      pause: !state.pause
    }))
  }
  
  function breakIncrement() {
     if (!state.pause) {
      return
     }
    setState(() => ({
      ...state,
      break: state.break + 60
    }))
  }
  
    function breakDecrement() {
      if (!state.pause) {
      return
      }
    setState(() => ({
      ...state,
      break: state.break + -60
    }))
  }
  
    function sessIncrement() {
    if (!state.pause) {
      return
    }
    setState(() => ({
      ...state,
      session: state.session + 60,
      timeLeft: state.session + 60
    }))
  }
  
    function sessDecrement() {
     if (!state.pause) {
      return
    }
    setState(() => ({
      ...state,
      session: state.session + -60,
      timeLeft: state.session + -60
    }))
  }
    
    function reset() {
      setState({
        break: 300,
        session: 1500,
        sessionBool: true,
        pause: true,
        timeLeft: 1500
      })
      audio.pause()
      audio.currentTime = 0
    }
  
    function runClock() {
      if (state.timeLeft < 1 && state.sessionBool) {
        audio.play()
        setState(() => ({
        ...state,
        timeLeft: state.break,
        sessionBool: false
      }))        
      } else if (state.timeLeft < 1 && !state.sessionBool) {
        audio.play()
        setState(() => ({
        ...state,
        timeLeft: state.session,
        sessionBool: true
        }))
      } else {
      setState(() => ({
        ...state,
        timeLeft: state.timeLeft - 1
      }))}
    }
  
  return (
  <div className="container">
      <Break 
        breakTime={state.break} 
        handleInc={breakIncrement}
        handleDec={breakDecrement}
        />
      <Session 
        sessionTime={state.session} 
        handleInc={sessIncrement}
        handleDec={sessDecrement}
        />
      <Timer 
        sessionTime={state.session} 
        breakTime={state.break}
        pauseState={state.pause}
        resetHandler={reset}
        pauseHandler={pause}
        timeLeft={state.timeLeft}
        handleClock={runClock}
        sessionBool={state.sessionBool}
       />
      <audio src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" id="beep" />
  </div>
  )
}


export default App
