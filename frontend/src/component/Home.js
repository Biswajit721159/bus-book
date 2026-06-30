import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Loader from './Loader'
import swal from 'sweetalert';
import { HiOutlineCheckCircle } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { loadStation, loadBus, fetchBusData } from '../redux/BusSlice'
import Searching from "./Searching";
import Filter from "./Filter";
import '../stylesheet/Home.css'
import Search from "./Search";
const api = process.env.REACT_APP_API
const Home = () => {

    let date = useSelector((state) => state.BusSearch.date)
    const history = useNavigate()
    let src = useSelector((state) => state.BusSearch.src);
    let dist = useSelector((state) => state.BusSearch.dist);
    const [bus__id, setbus__id] = useState('')
    const [show_seat_button, setshow_seat_button] = useState("Show Seat")
    const [disabled_showseat, setdisabled_showseat] = useState(false)
    const [Available_seat, setAvailable_seat] = useState(0)
    const [seat_res_come, setseat_res_come] = useState(false)

    const dispatch = useDispatch();
    const { Bus, station, loadingBus, loadingStation, error } = useSelector(state => state.Bus);

    useEffect(() => {
        if (Bus?.length === 0 && src?.length !== 0 && dist?.length !== 0) dispatch(fetchBusData({ src, dist }))
        else if (Bus?.length === 0) dispatch(loadBus());
        if (station?.length === 0) dispatch(loadStation());
    }, [dispatch]);

    function show_seat(_id, src, dist) {
        if (date.length < 10) {
            swal("Please Select a Date!")
            return;
        }
        else if (src === dist) {
            swal("Source and Destination cannot be same")
            return;
        }
        setbus__id(_id)
        setseat_res_come(false)
        setdisabled_showseat(true)
        setshow_seat_button("wait..")
        fetch(`${api}/Booking/get_Seat`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_station: src,
                end_station: dist,
                date: date,
                bus_id: _id,
            })
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.statusCode == 200) {
                setAvailable_seat(res.data.nowAvailable_seat)
                setdisabled_showseat(false)
                setshow_seat_button("Show Seat")
                setseat_res_come(true)
            }
        }, (error) => {
            history('*')
        })
    }


    return (
        <>
            {
                loadingBus === true || loadingStation === true ?
                    <Loader /> :
                    <>
                        <Searching />

                        {Bus?.length != 0 && <Filter />}
                        {/* {Bus?.length != 0 && <Search />} */}

                        {Bus?.length != 0 ?
                            <div className="row d-flex justify-content-around col-12 mt-4">
                                <div >
                                    <table className=" container table table-striped table border-info">
                                        <thead>
                                            <tr>
                                                <th className="text-center" scope="col">Bus Name</th>
                                                <th className="text-center" scope="col">Starting Station</th>
                                                <th className="text-center" scope="col">Arrival Time</th>
                                                <th className="text-center" scope="col">Distance</th>
                                                <th className="text-center" scope="col">Rupees</th>
                                                <th className="text-center" scope="col">Departure Time</th>
                                                <th className="text-center" scope="col">Duration</th>
                                                <th className="text-center" scope="col">Ending Station</th>
                                                <th className="text-center" scope="col">View Bus</th>
                                                <th className="text-center" scope="col">View Ticket</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                Bus?.length != 0 ?
                                                    Bus?.map((item, ind) => (
                                                        <tr key={ind} style={{ height: "70px", margin: '20px' }}>
                                                            <td className="text-center">{item.bus_name} <HiOutlineCheckCircle style={{ color: 'green' }} /></td>
                                                            <th className="text-center" style={{ color: '#0000FF' }}>{item.start_station}</th>
                                                            <td className="text-center"> {item.start_arrived_time}</td>
                                                            <td className="text-center">{item.total_distance}km</td>
                                                            <td className="text-center">₹{item.total_distance * 5}</td>
                                                            <td className="text-center">{item.end_arrive_time}</td>
                                                            <td className="text-center">{item.total_time}</td>
                                                            <th className="text-center" style={{ color: '#0000FF' }}>{item.end_station}</th>
                                                            <td className="text-center"><Link to={`/View_Bus/${item.bus_id}`}><button className="btn btn-primary btn-sm">view</button></Link></td>
                                                            {
                                                                item.bus_id != bus__id ?
                                                                    <td className="text-center"><button className="btn btn-info btn-sm" onClick={() => { show_seat(item.bus_id, item.start_station, item.end_station) }} >Show</button></td>
                                                                    :
                                                                    seat_res_come == true ?
                                                                        <td className="text-center">
                                                                            <button className="btn btn-primary btn-sm" disabled={true} >{Available_seat} Left </button>
                                                                            <Link to={`/${item.bus_id}/${item.start_station}/${item.end_station}/${date}`}>
                                                                                <button className="btn btn-primary btn-sm" disabled={!Available_seat}>
                                                                                    Book
                                                                                </button>
                                                                            </Link>
                                                                        </td>
                                                                        :
                                                                        <td className="text-center">
                                                                            <button className="btn btn-danger btn-sm" disabled={disabled_showseat} onClick={() => { show_seat(item.bus_id, item.start_station, item.end_station) }} >
                                                                                {show_seat_button}
                                                                            </button>
                                                                        </td>
                                                            }
                                                        </tr>
                                                    ))
                                                    : <tr >
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center">NA</td>
                                                        <td className="text-center"></td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div> : <h6 className="text-center mt-5">Bus not Found ! 😥 </h6>
                        }
                    </>
            }
        </>
    )
}
export default Home