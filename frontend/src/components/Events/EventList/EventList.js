import React from 'react';
import './EventList.css';

import EventItem from './EventItem/EventItem';

const eventList = props => {
    const events = props.events.map(event => {
        return (
            <EventItem key={event.id} eventId={event.id} title={event.title} userId={props.authUserId} creatorId={event.creatorId.id} />
        );
    });

    return <ul className="event__list">{events}</ul>;
};

export default eventList; 