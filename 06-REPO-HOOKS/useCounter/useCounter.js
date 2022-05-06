import {useState} from "react";

export const useCounter = (initState = 10) => {
    const [counter, setCounter] = useState(initState);

    const increment = ( factor = 1) => {
        setCounter(counter + factor);
    }

    const decrement = (factor = 1) => {
        setCounter(counter - factor);
    }

    const reset = () => {
        setCounter(initState);
    }

    return{
        counter,
        increment,
        decrement,
        reset,
    }
}