import { useState } from "react"

const App = () => {
  // Состояния
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [previousValue, setPreviousValue] = useState(null)
  const [currentOperation, setCurrentOperation] = useState(null)
  const [activeOperation, setActiveOperation] = useState(null)
  const [shouldResetDisplay, setShouldResetDisplay] = useState(true)

  // Утилиты
  const formatNumber = (number) => {
    // Форматируем число для отображения (добавляем разделители тысяч)
    return Number(number).toLocaleString('en-US', {
      maximumFractionDigits: 8,
      minimumFractionDigits: 0
    })
  }

  // Обработчики
  const handleNumber = (e) => {
    const digit = e.target.innerText
    
    if (shouldResetDisplay) {
      setDisplay(digit)
      setExpression(previousValue ? expression + digit : digit)
      setShouldResetDisplay(false)
    } else {
      if (display.replace(/,/g, '').length >= 9) return // Ограничение на длину числа
      const newDisplay = display === '0' ? digit : display.replace(/,/g, '') + digit
      setDisplay(formatNumber(newDisplay))
      setExpression(expression + digit)
    }
  }

  const handleOperation = (e) => {
    const operation = e.target.innerText
    const currentValue = parseFloat(display.replace(/,/g, ''))

    // Если операция уже выбрана, но мы выбираем другую - меняем операцию
    if (currentOperation && shouldResetDisplay) {
      setCurrentOperation(operation)
      setActiveOperation(operation)
      setExpression(expression.slice(0, -2) + `${operation} `)
      return
    }

    if (previousValue === null) {
      // Первая операция
      setPreviousValue(currentValue)
      setCurrentOperation(operation)
      setActiveOperation(operation)
      setExpression(`${formatNumber(currentValue)} ${operation} `)
    } else {
      // Последующие операции
      const result = calculate(previousValue, currentValue, currentOperation)
      setPreviousValue(result)
      setCurrentOperation(operation)
      setActiveOperation(operation)
      setDisplay(formatNumber(result))
      setExpression(`${formatNumber(result)} ${operation} `)
    }
    setShouldResetDisplay(true)
  }

  const calculate = (prev, current, operation) => {
    switch (operation) {
      case '+': return prev + current
      case '-': return prev - current
      case '×': return prev * current
      case '÷': return current !== 0 ? prev / current : 'Error'
      default: return current
    }
  }

  const handleEquals = () => {
    if (previousValue === null || currentOperation === null) return

    const currentValue = parseFloat(display.replace(/,/g, ''))
    const result = calculate(previousValue, currentValue, currentOperation)
    
    setDisplay(formatNumber(result))
    setExpression(`${expression} = ${formatNumber(result)}`)
    setPreviousValue(null)
    setCurrentOperation(null)
    setActiveOperation(null)
    setShouldResetDisplay(true)
  }

  const clear = () => {
    setDisplay('0')
    setExpression('')
    setPreviousValue(null)
    setCurrentOperation(null)
    setActiveOperation(null)
    setShouldResetDisplay(true)
  }

  const toggleSign = () => {
    const value = parseFloat(display.replace(/,/g, '')) * -1
    setDisplay(formatNumber(value))
    // Обновляем expression только если это первое число
    if (!previousValue) {
      setExpression(formatNumber(value))
    }
  }

  const percentage = () => {
    const value = parseFloat(display.replace(/,/g, '')) / 100
    setDisplay(formatNumber(value))
    if (!previousValue) {
      setExpression(formatNumber(value))
    }
  }

  const decimal = () => {
    if (display.includes('.')) return
    
    const newDisplay = display + '.'
    setDisplay(newDisplay)
    if (!shouldResetDisplay) {
      setExpression(expression + '.')
    }
  }

  // Общий класс для кнопок
  const buttonClass = (color) => 
    `${color} rounded-full h-16 text-2xl transition-colors duration-150 ease-in-out cursor-pointer`

  const numberClass = buttonClass("bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white")
  const operationClass = buttonClass("bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-white")
  const functionClass = buttonClass("bg-gray-400 hover:bg-gray-300 active:bg-gray-200 text-black")


  // Функция для определения класса кнопки операции
  const getOperationButtonClass = (operation) => {
    const baseClass = "rounded-full h-16 text-2xl transition-colors duration-150 ease-in-out"
    const isActive = operation === activeOperation && shouldResetDisplay
    
    if (isActive) {
      return `${baseClass} bg-amber-300 text-gray-100 cursor-not-allowed`
    }
    
    return `${baseClass} bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-white cursor-pointer`
  }

  return (
    <div className="max-w-xs mx-auto bg-black p-4 rounded-3xl">
      <div className="text-right text-gray-400 text-lg h-8 overflow-hidden">
        {expression}
      </div>
      <div className="text-right text-white text-4xl mb-4 h-20 flex items-end justify-end">
        {display}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className={functionClass}>C</button>
        <button onClick={toggleSign} className={functionClass}>±</button>
        <button onClick={percentage} className={functionClass}>%</button>
        <button
          onClick={handleOperation} 
          disabled={activeOperation === '÷' && shouldResetDisplay}
          className={getOperationButtonClass('÷')}
        >÷</button>

        <button onClick={handleNumber} className={numberClass}>7</button>
        <button onClick={handleNumber} className={numberClass}>8</button>
        <button onClick={handleNumber} className={numberClass}>9</button>
        <button 
          onClick={handleOperation}
          disabled={activeOperation === '×' && shouldResetDisplay}
          className={getOperationButtonClass('×')}
        >×</button>

        <button onClick={handleNumber} className={numberClass}>4</button>
        <button onClick={handleNumber} className={numberClass}>5</button>
        <button onClick={handleNumber} className={numberClass}>6</button>
        <button 
          onClick={handleOperation}
          disabled={activeOperation === '-' && shouldResetDisplay}
          className={getOperationButtonClass('-')}
        >-</button>

        <button onClick={handleNumber} className={numberClass}>1</button>
        <button onClick={handleNumber} className={numberClass}>2</button>
        <button onClick={handleNumber} className={numberClass}>3</button>
        <button 
          onClick={handleOperation}
          disabled={activeOperation === '+' && shouldResetDisplay}
          className={getOperationButtonClass('+')}
        >+</button>

        <button onClick={handleNumber} className={`${numberClass} col-span-2`}>0</button>
        <button onClick={decimal} className={numberClass}>.</button>
        <button onClick={handleEquals} className={operationClass}>=</button>
      </div>
    </div>
  )
}

export default App
