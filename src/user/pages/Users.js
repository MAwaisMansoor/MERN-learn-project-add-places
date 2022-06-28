import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
    //have to send http request whenever page loads
    //whenever component renders or reders again
    //useEffect allow us to run certain code only when certain depencency changes

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {

            try {

                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);

                setLoadedUsers(responseData.users);

            }
            catch (err) {}

        }

        fetchUsers();

    }, [sendRequest]); //sendRequest is a function/dependency of useEffect, coming from outside

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading &&
            <div className="center">
                <LoadingSpinner />
            </div>
        }
        {!isLoading && <UsersList items={loadedUsers} />}
    </React.Fragment>
}

export default Users;