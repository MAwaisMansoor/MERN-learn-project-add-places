import React, { useEffect, useState } from 'react';
//useParams returns an object with a key called userId
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [placesLoaded, setPlacesLoaded] = useState();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
                setPlacesLoaded(responseData.places);
            }
            catch (err) { }
        }
        fetchPlaces();
    }, [sendRequest, userId]);

    const placeDeletedHandler = async (deletedPlaceId) => {
        setPlacesLoaded(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
    }

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
            <div className="center">
                <LoadingSpinner />
            </div>
        )}
        {!isLoading && <PlaceList items={placesLoaded} onDeletePlace={placeDeletedHandler} />}

    </React.Fragment>

};

export default UserPlaces;