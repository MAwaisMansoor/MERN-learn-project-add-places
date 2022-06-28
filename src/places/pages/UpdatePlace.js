import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const placeId = useParams().placeId;
    const history = useHistory();

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

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            }
            catch (err) { }
        }
        fetchPlace();
    }, [sendRequest, placeId]);

    const placeSubmitHandler = async event => {
        event.preventDefault();

        const formData = {
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
        };

        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                JSON.stringify(formData),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token 
                }
            );

            history.push('/' + auth.userId + '/places');
        }
        catch (err) { }

    }

    if (isLoading) {
        return <div className="center">

            <LoadingSpinner asOverlay />

        </div>
    }

    if (!loadedPlace && !isLoading) {
        return <div className="center"><Card><h2>Place not found</h2></Card></div>
    }

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && loadedPlace &&
            (
                <form className="place-form" onSubmit={placeSubmitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title"
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        type="text"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (at least 5 characters)"
                        onInput={inputHandler}
                        initialValue={loadedPlace.description}
                        initialValid={true}
                    />
                    <Button
                        type="submit"
                        disabled={!formState.isValid}
                    >
                        UPDATE PLACE
                    </Button>
                </form>
            )
        }
    </React.Fragment>


};

export default UpdatePlace;