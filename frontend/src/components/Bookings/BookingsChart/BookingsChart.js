import React from 'react';

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 49,
    },
    Normal: {
        min: 50,
        max: 99,
    },
    Expensive: {
        min: 100,
        max: 1000000000,
    },
};

const bookingsChart = props => {

    const output = {};
    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (
                current.eventId.price > BOOKINGS_BUCKETS[bucket].min &&
                current.eventId.price < BOOKINGS_BUCKETS[bucket].max
            ) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        output[bucket] = filteredBookingsCount;

    }
    console.log(output);
    return (
        <p>
            The Chart
        </p>
    )
};

export default bookingsChart;