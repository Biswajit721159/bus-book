import React from "react";
import { Link } from "react-router-dom";
import { CiHeadphones } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { GiIndiaGate } from "react-icons/gi";
import { GiJapaneseBridge } from "react-icons/gi";
import { LuRussianRuble } from "react-icons/lu";
import { GiUsaFlag } from "react-icons/gi";
import { SiIledefrancemobilites } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import '../stylesheet/Homepage3.css'
import { FaBus } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { MdAddBusiness } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";

const Footer=()=>{
    return(
        <footer className="mainfooter mt-5">
            <div className="box-container">
                <div className="box">
                    <h4 className="head2">Locations</h4>
                    <li className="head1"><GiIndiaGate /> India</li>
                    <li className="head1"><GiJapaneseBridge /> Japan</li>
                    <li className="head1"><LuRussianRuble /> Russia</li>
                    <li className="head1"><GiUsaFlag /> USA</li>
                    <li className="head1"><SiIledefrancemobilites /> France</li>
                </div>
                <div className="box">
                    <h4 className="head2">Quick Links</h4>
                    <li className="head1"><Link to="/" style={{ textDecoration: 'none' }}><AiOutlineHome /> Home</Link></li>
                    <li className="head1"><Link to="/BookBus" style={{ textDecoration: 'none' }}><FaBus /> Book Bus</Link></li>
                    <li className="head1"><Link to="/checkstatus" style={{ textDecoration: 'none' }}><CiCircleCheck /> Check Status</Link></li>
                    <li className="head1"><a href='https://busowner.vercel.app/' style={{ textDecoration: 'none' }} target="_blank" ><MdAddBusiness /> Adminpanel</a></li>
                </div>
                <div className="box">
                <h4 className="head2">Contact Info</h4>
                    <li className="head1"><CiHeadphones/> +123-456-7890</li>
                    <li className="head1"><CiHeadphones/> +111-222-3333</li>
                    <li className="head1"><MdEmail /> biswajit2329@gmail.com</li>
                    <li className="head1"><MdEmail /> biswajit@riktamtech.com</li>
                    <li className="head1"><FaLocationArrow /> Hyderabad , india - 500016</li>
                </div>
                <div className="box">
                    <h4 className="head2">Follow us</h4>
                    <li className="head1"><a href="#"  style={{ textDecoration: 'none' }}><FaFacebook /> Facebook</a></li>
                    <li className="head1"><a href="#"  style={{ textDecoration: 'none' }}><FaTwitter /> Twitter</a></li>
                    <li className="head1"><a href="#"  style={{ textDecoration: 'none' }}><FaInstagram /> Instagram</a></li>
                    <li className="head1"><a href="#"  style={{ textDecoration: 'none' }}><FaLinkedinIn /> Linkedin</a></li>
                    <li className="head1"><a href="#"  style={{ textDecoration: 'none' }}><FaYoutube /> Youtube</a></li>
                </div>
                {/* <div className="box">
                    <h4 className="head2">Message US</h4>
                    <div>
                        <input className="form-control mr-sm-2" name='search' type="search" placeholder="Enter Message" aria-label="Search"/>
                    </div>
                    <li></li>
                    <li className="head2"><button className="btn btn-primary btn-sm mt-1">Send</button></li>
                </div> */}
            </div>
            <hr/>
            <div className="credit"> Copyright @ 2023 by <span>Mr Biswajit Ghosh</span> </div>
        </footer>
    )
}

export default Footer