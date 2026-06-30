import React from 'react';

const Accordion = () => {
    return (
        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>FAQs - Bus Booking</h2>
            <div id="accordionFlushExample" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: 'gray' }}>
                <div className="accordion-item" style={{ borderBottom: '1px solid #ddd' }}>
                    <h2 className="accordion-header" id="flush-headingOne">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne"
                            style={{ backgroundColor: 'white', color: 'gray', padding: '15px', width: '100%', border: 'none', cursor: 'pointer', borderRadius: '8px 8px 0 0' }}>
                            Can I track the location of my booked bus online? #1
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body" style={{ padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '0 0 8px 8px' }}>
                            Yes, you can track your bus online by using our bus tracking app feature called “Track My Bus”.
                            This feature allows passengers and their families to track the live bus location. You may follow your bus on a map and use the information to plan your trip to the boarding point and to get off at the correct stop.
                            Family and friends may also check the bus position to schedule pick-ups and ensure safety
                        </div>
                    </div>
                </div>
                <div className="accordion-item" style={{ borderBottom: '1px solid #ddd' }}>
                    <h2 className="accordion-header" id="flush-headingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo"
                            style={{ backgroundColor: 'white', color: 'gray', padding: '15px', width: '100%', border: 'none', cursor: 'pointer' }}>
                            What are the advantages of purchasing a bus ticket with whiteBus? #2
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body" style={{ padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '0 0 8px 8px' }}>
                            Booking bus tickets online on whiteBus is increasingly becoming the preferred choice for travellers due to its numerous advantages over traditional methods.
                            With whiteBus, customers can book their bus tickets effortlessly from the comfort of their homes, avoiding the inconvenience of standing in long lines at bus stations or travel agencies.
                            Online bus booking offers the luxury of comparing different bus schedules and operators and presents various discount offers and exclusive deals, resulting in significant savings.
                            Payment security is another notable feature of online booking, which ensures that your financial information is well-protected against fraud.
                            Additionally, customers can pick their seats, providing a customized travel experience. Online bus booking platforms give real-time updates about any changes in the bus timetable, including delays or cancellations, enabling better planning.
                            The convenience doesn't stop here; travellers can even compare onboard amenities like charging points or snacks, further enhancing the travel experience
                        </div>
                    </div>
                </div>
                <div className="accordion-item" style={{ borderBottom: '1px solid #ddd' }}>
                    <h2 className="accordion-header" id="flush-headingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree"
                            style={{ backgroundColor: 'white', color: 'gray', padding: '15px', width: '100%', border: 'none', cursor: 'pointer' }}>
                            Why book bus tickets online on whiteBus? #3
                        </button>
                    </h2>
                    <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body" style={{ padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '0 0 8px 8px' }}>
                            No, you don't have to create an account on the whiteBus site to book your bus ticket.
                            But it is advisable to make one to accelerate the process next time you want to book bus tickets.
                            Also, whiteBus has many discounts and offers that you can easily access if you have an account with us.
                        </div>
                    </div>
                </div>
                <div className="accordion-item" style={{ borderBottom: '1px solid #ddd' }}>
                    <h2 className="accordion-header" id="flush-headingFour">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour"
                            style={{ backgroundColor: 'white', color: 'gray', padding: '15px', width: '100%', border: 'none', cursor: 'pointer' }}>
                            Do I need to create an account on the whiteBus site to book my bus ticket? #4
                        </button>
                    </h2>
                    <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body" style={{ padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '0 0 8px 8px' }}>
                            Booking bus tickets online on whiteBus is increasingly becoming the preferred choice for travellers due to its numerous advantages over traditional methods.
                            With whiteBus, customers can book their bus tickets effortlessly from the comfort of their homes, avoiding the inconvenience of standing in long lines at bus stations or travel agencies.
                            Online bus booking offers the luxury of comparing different bus schedules and operators and presents various discount offers and exclusive deals, resulting in significant savings.
                            Payment security is another notable feature of online booking, which ensures that your financial information is well-protected against fraud.
                            Additionally, customers can pick their seats, providing a customized travel experience.
                            Online bus booking platforms give real-time updates about any changes in the bus timetable, including delays or cancellations, enabling better planning.
                            The convenience doesn't stop here; travellers can even compare onboard amenities like charging points or snacks, further enhancing the travel experience
                        </div>
                    </div>
                </div>
                <div className="accordion-item" style={{ borderBottom: '1px solid #ddd' }}>
                    <h2 className="accordion-header" id="flush-headingFive">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive"
                            style={{ backgroundColor: 'white', color: 'gray', padding: '15px', width: '100%', border: 'none', cursor: 'pointer' }}>
                            Does bus booking online cost me more? #5
                        </button>
                    </h2>
                    <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body" style={{ padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '0 0 8px 8px' }}>
                            Not at all! The bus ticket price is the same as you would get from the bus operator/ counter of any bus ticket agency.
                            whiteBus reduces the travel budget by comparing the bus ticket prices among various operators, making it a more cost-effective choice.
                            Therefore, online bus booking is increasingly recognized as a more convenient, efficient, and economical mode of securing travel arrangements.
                        </div>
                    </div>
                </div>
                <div className="accordion-item" style={{ borderBottom: '1px solid #ddd' }}>
                    <h2 className="accordion-header" id="flush-headingSix">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix"
                            style={{ backgroundColor: 'white', color: 'gray', padding: '15px', width: '100%', border: 'none', cursor: 'pointer' }}>
                            How can I get the discounts on the bus booking? #6
                        </button>
                    </h2>
                    <div id="flush-collapseSix" className="accordion-collapse collapse" aria-labelledby="flush-headingSix" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body" style={{ padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '0 0 8px 8px' }}>
                            Primo Bus Ticket: whiteBus has launched Primo bus services, where passengers can enjoy travelling in high-rated buses with best-in-class services.
                            While looking for bus tickets on the desired route, customers can check the Primo tag to choose this excellent service.
                            From hygiene standards to on-time service and comfort, passengers can benefit from the online bus booking experience from Primo buses
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;