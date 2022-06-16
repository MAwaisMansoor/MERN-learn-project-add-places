import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import Card from '../../shared/components/UIElements/Card';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u2'
    }
];

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
    }, true);

    const loadedPlace = DUMMY_PLACES.find(place => place.id === placeId);

    useEffect(() => {
        if (loadedPlace) {
            setFormData({
                title: {
                    value: loadedPlace.title,
                    isValid: true
                },
                description: {
                    value: loadedPlace.description,
                    isValid: true
                },
            }, true);
        }
        setIsLoading(false);
    }, [setFormData, loadedPlace]);

    const placeSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    if (!loadedPlace) {
        return <div className="center"><Card><h2>Place not found</h2></Card></div>
        
    }

    if (isLoading) {
        return <div className="center"><h2>Loading...</h2></div>
    }

    return <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
        />
        <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)"
            onInput={inputHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
        />
        <Button
            type="submit"
            disabled={!formState.isValid}
        >
            UPDATE PLACE
        </Button>
    </form>

};

export default UpdatePlace;