import React from 'react';
import Homepage1 from '../Homepage/Homepage1';
import Homepage2 from '../Homepage/Homepage2';
import Homepage3 from '../Homepage/Homepage3';
import Accordion from '../Homepage/Accordion';


export default function FrontPage() {
    return (
        <>
            <Homepage1 />
            <Homepage2 />
            <Accordion />
            <Homepage3 />
        </>
    )
}