import React from 'react';
import './EventItem.css';

const eventItem = props => (
    <li key={props.id} className="events__list-item">
        <div>
            <h1>{props.title}</h1>
            <h2>$19.99</h2>
        </div>

        <div>
            {props.userId === props.creatorId ? <p>You're the owner of this event.</p> : <button className="btn">View Details</button>}

        </div>
    </li>
);

export default eventItem;