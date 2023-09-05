import {cloneElement} from 'preact'
import {useRef, useState} from 'preact/hooks'

import {CSSTransition, TransitionGroup} from 'react-transition-group'

import './SlideTransition.scss'

const STEPS = [
  {name: 'first step'},
  {name: 'second step'},
  {name: 'third step'},
  {name: 'fourth step'},
]

export function SLIDE() {
  const [currentStep, setCurrentStep] = useState(0)
  const isNext = useRef(false)
  const {name: step} = STEPS[currentStep] ?? {}

  const handlePrev = () => {
    isNext.current = false

    setCurrentStep(currentStep - 1)
  }

  const handleNext = () => {
    isNext.current = true

    setCurrentStep(currentStep + 1)
  }
  return (
    <div className="App">
      <button disabled={currentStep - 1 < 0} onClick={handlePrev}>
        Prev
      </button>
      <button disabled={currentStep + 1 > STEPS.length - 1} onClick={handleNext}>
        Next
      </button>

      <TransitionGroup
        className="container"
        childFactory={(child) => {
          return cloneElement(child, {
            classNames: isNext.current ? 'right-to-left' : 'left-to-right',
            timeout: 500,
          })
        }}
      >
        <CSSTransition
          // mountOnEnter
          // unmountOnExit
          alwaysMounted={false}
          duration={500}
          classNames="right-to-left"
          key={step}
          // nodeRef={nodeRef}
        >
          <h1 className="step">{step}</h1>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}
