import React from 'react';
import Table3 from '../images/bus-4.jpg'
import { AiFillPhone } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import '../stylesheet/Homepage2.css'
const Homepage2 = () => {
    return (
        <div className=' mt-1 shadow-none p-3 mb-5 bg-light rounded'>
            <h3 className='headline1' >About us</h3>
            <h1 className='headline2'  > WHY CHOOSE US? </h1>
            <div >
                <div className="imageitem">
                    <img src={Table3} className="imageitem" alt="Error" />
                </div>
                <div className='mt-2'>
                    <h3 className='headline2' style={{ color: "green" }}>Best bus in our country</h3>
                    <p className='headline1' style={{color:"grey"}}><strong style={{color:'yellowgreen'}}>(Luxury Coach):</strong> Our luxury coaches offer a premium travel experience with plush, reclining seats, ample legroom, and onboard amenities such as Wi-Fi, charging ports, and entertainment systems. Sit back, relax, and enjoy the journey in style.</p>
                    <p className='headline1' style={{color:"grey"}}><strong style={{color:'yellowgreen'}}>(Eco-Friendly Shuttle):</strong> Travel sustainably with our eco-friendly shuttle buses. These vehicles are powered by clean energy sources, minimizing their environmental impact while providing comfortable and convenient transportation options for passengers.</p>
                    <p className='headline1' style={{color:"grey"}}><strong style={{color:'yellowgreen'}}>(City Tour Bus):</strong> Explore the sights and sounds of the city aboard our city tour buses. These double-decker vehicles offer panoramic views of landmarks, informative commentary, and hop-on-hop-off flexibility, allowing you to discover the city at your own pace.</p>
                    <p className='headline1' style={{color:"grey"}}><strong style={{color:'yellowgreen'}}>(Executive Mini Bus):</strong> Perfect for corporate events, group outings, or airport transfers, our executive mini buses combine comfort and convenience. With leather seating, climate control, and professional drivers, you can travel in comfort and style to your destination.</p>
                    <p className='headline1' style={{color:"grey"}}><strong style={{color:'yellowgreen'}}>(School Bus):</strong> Ensuring safe and reliable transportation for students, our school buses are equipped with the latest safety features and undergo regular maintenance checks. Trust us to provide a secure journey for students to and from school every day.</p>
                    <p className='headline1' style={{color:"grey"}}><strong style={{color:'yellowgreen'}}>(Charter Bus):</strong> Whether you're planning a family reunion, corporate retreat, or group excursion, our charter buses are the ideal choice for large group travel. With spacious interiors, onboard restrooms, and experienced drivers, we'll take you wherever you need to go with ease.</p>
                    <p className='headline1' style={{color:"grey"}}><strong style={{color:'yellowgreen'}}>(Airport Shuttle):</strong> Make your airport transfer hassle-free with our convenient airport shuttle service. We offer regular departures to and from major airports, ensuring timely arrivals and departures for passengers traveling to catch their flights.</p>
    
                    <div className="row1 mt-5">
                        <div className="col1 shadow p-2 mb-5 bg-white rounded" >
                            <FaBus className='icon mb-3' />
                            <span className='headline1'>On Time </span>
                        </div>
                        <div className="col1 shadow p-2 mb-5 bg-white rounded" >
                            <FaRupeeSign className='icon mb-3' />
                            <span className='headline1'>Easy Payments</span>
                        </div>
                        <div className="col1 shadow p-2 mb-5 bg-white rounded" >
                            <AiFillPhone className='icon mb-3' />
                            <span className='headline1'>24/7 Service</span>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Homepage2