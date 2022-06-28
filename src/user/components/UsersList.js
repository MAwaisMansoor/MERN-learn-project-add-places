import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import UserItem from './UserItem';
import Button from '../../shared/components/FormElements/Button';
import './UsersList.css';

const UsersList = props => {
    if (!props.items) {
        return (
            <div className="center">
                <Card>
                    <h2>Sadly, No users found.</h2><h2>You have the chance to be the first!</h2>
                    <Button to="/auth">LET'S SIGNUP</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className="users-list">
            {
                props.items.map(user => (
                    <UserItem
                        key={user.id}
                        id={user.id}
                        image={user.image}
                        name={user.name}
                        placeCount={user.places.length}
                    />
                ))
            }
        </ul>
    );
};

export default UsersList;