import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';

class EventsPage extends Component {

    state = {
        creating: false
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    startCreateEventHandler = () => {
        this.setState({creating: true});
    }

    modalConfirmHandler = () => {
        this.setState({creating: false})
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            title.trim().length === 0 || 
            price <= 0 || 
            date.trim().length === 0 || 
            description.trim().length === 0
        ) {
            return;
        }

        const event = { title, price, date, description };
        console.log(event);

        const requestBody = {
            query: `
                mutation {
                    createEvent(title: "${title}", description: "${description}", price: ${price}, date: "${date}") {
                    id
                    title
                    description
                    date
                    price
                    creatorId {
                        id
                        email
                    }
                    }
                }
              
            `
        };

        const token = this.context.token;
    
        fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201) {
                        throw new Error('Failed');
                    }
                    return res.json();
                })
                .then(resData => {
                    console.log(resData);
                })
                .catch(err => {
                    console.log(err);
                });
    };

    
    modalCancelHandler = () => {
        this.setState({creating: false});
    }
    
    render() {
        return (
            <React.Fragment>
            {this.state.creating && <Backdrop />}
            {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={this.titleElRef}></input>
                    </div>

                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={this.priceElRef}></input>
                    </div>

                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" ref={this.dateElRef}></input>
                    </div>

                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" ref={this.descriptionElRef} rows="4"/>
                    </div>

                </form>
            </Modal>}
                {this.context.token && (<div className="events-control">
                <p>Share your own Events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>)}
                <ul className="events__list">
                    <li className="events__list-item">Test 1</li>
                    <li className="events__list-item">Test 2</li>
                </ul>
            </React.Fragment>
        )
    }
}

export default EventsPage;