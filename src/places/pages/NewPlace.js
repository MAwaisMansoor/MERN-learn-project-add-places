import React from 'react';

import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

const NewPlace = () => {

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
        },
        false
    );

    const submitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    return <form className="place-form" onSubmit={submitHandler}>
        <Input
            element='input'
            id='title'
            label='Title'
            type='text'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title'
            onInput={inputHandler}
        />
        <Input
            element='textarea'
            id='description'
            label='Description'
            type='text'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (at least 5 characters)'
            onInput={inputHandler}
        />
        <Input
            element='input'
            id='address'
            label='Address'
            type='text'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid address'
            onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
};

export default NewPlace;