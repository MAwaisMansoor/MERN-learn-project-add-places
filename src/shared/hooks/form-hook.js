import React, { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                }
                else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                isValid: formIsValid
            };
        case 'FORM_SUBMIT':
            return {
                ...state,
                isValid: action.isValid
            };
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            };
        default:
            return state;
    }
};

export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity //overall form validity
    });

    //callback function to handle input change
    //now it will be reused instead of recreation
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        })
    }, []);

    //callback function to handle form submit
    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            isValid: formValidity
        }, []);
    }, []);

    return [formState, inputHandler, setFormData];
};