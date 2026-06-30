import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert'
import Loader from './Loader';
import { useSelector, useDispatch } from 'react-redux';
import { usermethod } from '../redux/UserSlice'
import { toast } from 'react-toastify';
const api = process.env.REACT_APP_API
const Ticket_Book = () => {

    const dispatch = useDispatch()
    const userinfo = useSelector((state) => state.user)
    const history = useNavigate()
    const { src } = useParams()
    const { dist } = useParams()
    const { date } = useParams()
    const { bus_id } = useParams()

    const [submitload, setsubmitload] = useState(false)
    const [load, setload] = useState(true)
    // const [total_seat, settotal_seat] = useState(0)
    const [data, setdata] = useState([])
    const [seatarr, setseatarr] = useState([])
    const [MasterList, setMasterList] = useState([])
    const [checkbox, setcheckbox] = useState([])
    let [pay, setpay] = useState(0);
    let [total_distance, settotal_distance] = useState(0)


    function markseat(id) {
        if (data[id - 1].isbooked === "Both") {
            for (let i = 0; i < seatarr.length; i++) {
                if (seatarr[i] === id) {
                    seatarr.splice(i, 1);
                }
            }
            setseatarr([...seatarr]);
            return true;
        }
        else {
            if (seatarr.length >= 5) {
                return false;
            }
            else if (seatarr.length >= MasterList.length) {
                return false;
            }
            else {
                seatarr.push(id)
                setseatarr([...seatarr])
                return true;
            }
        }
    }

    function Mark(id) {
        if (markseat(id) === true) {
            id = id - 1;
            if (data[id].isbooked === false) {
                data[id].isbooked = "Both";
            }
            else {
                data[id].isbooked = false
            }
            setdata([...data])
        }
        else {
            if (seatarr.length >= MasterList.length) {
                swal(`Your MasterList Has ${MasterList.length} User `)
            }
            else swal('Sorry Maximum 5 Seat are Allow !')
        }
    }

    function show_seat(_id) {
        try {
            setload(true)
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
                    bus_id: bus_id,
                })
            }).then(responce => responce.json()).then((res) => {
                if (res != undefined && res.statusCode === 200) {
                    fetch(`${api}/MasterList/${userinfo?.user?.user?._id}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${userinfo?.user?.auth}`
                        }
                    }).then(responce => responce.json()).then((result) => {
                        if (result !== undefined && result.statusCode === 200) {
                            setMasterList(result?.data)
                            setload(false)
                            // settotal_seat(res.data.total_seat)
                            setdata(res.data.BookingRecord)
                            settotal_distance(res.data.total_distance)
                        }
                        else if (result.statusCode === 498) {
                            dispatch(usermethod.Logout_User())
                            history('/Login')
                        }
                    }, (error) => {
                        history('*')
                    })

                }
                else if (res.statusCode === 498) {
                    dispatch(usermethod.Logout_User())
                    history('/Login')
                } else {
                    history('*');
                }
            }, (error) => {
                history('*')
            })
        } catch (error) {
            history('*');
        }
    }

    function handleCheckboxChange(name) {

        if (checkbox.includes(name) === true) {
            let arr = []
            for (let i = 0; i < checkbox.length; i++) {
                if (checkbox[i] !== name) {
                    arr.push(checkbox[i]);
                }
            }
            pay -= ((total_distance * 5))
            setpay(pay)
            setcheckbox([...arr])
        }
        else if (checkbox.length >= seatarr.length) {
            swal(`Sorry You Are Select ${seatarr.length} Seat`)
        }
        else {
            pay += ((total_distance * 5))
            setpay(pay)
            checkbox.push(name)
            setcheckbox([...checkbox])
        }
    }

    function checkAlreadyGetOrNot(nums) {
        for (let i = 0; i < seatarr.length; i++) {
            if (nums[seatarr[i] - 1].isbooked === true) {
                return true;
            }
        }
        return false;
    }

    function checkAlreadyBoth() {
        for (let i = 0; i < seatarr.length; i++) {
            if (data[seatarr[i] - 1].isbooked !== "Both") {
                return false;
            }
        }
        return true
    }

    function submit() {
        while (checkbox.length < seatarr.length) {
            seatarr.pop();
        }
        if (checkAlreadyBoth() && checkbox.length === seatarr.length) {
            setsubmitload(true)
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
                    bus_id: bus_id,
                })
            }).then(responce => responce.json()).then((comeres) => {
                if (comeres != undefined && comeres.statusCode === 200) {
                    if (checkAlreadyGetOrNot(comeres.data.BookingRecord) === false) {
                        fetch(`${api}/Booking`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${userinfo?.user?.auth}`
                            },
                            body: JSON.stringify({
                                bus_id: bus_id,
                                src: src,
                                dist: dist,
                                useremail: userinfo.user.user.email,
                                total_money: pay,
                                date: date,
                                seat_record: seatarr,
                                person: checkbox,
                                total_distance: total_distance
                            })
                        }).then((responce => responce.json())).then((res) => {
                            if (res != undefined && res.statusCode == 201) {
                                history('/LastTransaction')
                            }
                            else if (res != undefined && res.statusCode == 498) {
                                dispatch(usermethod.Logout_User())
                                history('/Login')
                            }
                            else {
                                toast.warn(res?.message)
                                history('*')
                            }
                        }, (error) => {
                            history('*')
                        })
                    }
                    else {
                        swal('Sorry Your Seat is already get by another user Please Select Different Seat')
                        setsubmitload(false)
                        show_seat()
                        setcheckbox([])
                        setseatarr([])
                    }
                }
                else if (comeres?.statusCode === 498) {
                    dispatch(usermethod.Logout_User())
                    history('/Login')
                }
                else {
                    setsubmitload(false)
                    show_seat()
                    setcheckbox([])
                    setseatarr([])
                    history('*')
                }
            }, (error) => {
                history('/')
            })
        }
        else {
            swal('Sorry We find Some Error')
            history('/')
        }
    }

    useEffect(() => {
        if (userinfo.user == null) {
            history('/Login')
        }
        else {
            show_seat()
        }
    }, [userinfo])

    return (
        <>
            {
                submitload === true ?
                    <Loader />
                    :
                    load === false ?
                        <div className='container align-items-center mt-4'>
                            {
                                <div className='row'>
                                    {
                                        data.map((item, ind) => (
                                            <div className='col' key={ind}>
                                                {
                                                    item.isbooked === true ?
                                                        <Link style={{ textDecoration: "none" }} >
                                                            <div className="card" style={{ width: "3.5rem", height: "3.5rem", backgroundColor: "#F69F8C" }}>
                                                                <div className="card-body">
                                                                    <h6 className="card-title">{ind + 1}</h6>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        :
                                                        item.isbooked == "Both" ?
                                                            <Link style={{ textDecoration: "none" }} onClick={() => { Mark(ind + 1) }} >
                                                                <div className="card" style={{ width: "3.5rem", height: "3.5rem", backgroundColor: "#98F980" }} >
                                                                    <div className="card-body">
                                                                        <h6 className="card-title">{ind + 1}</h6>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            : <Link style={{ textDecoration: "none" }} onClick={() => { Mark(ind + 1) }} >
                                                                <div className="card" style={{ width: "3.5rem", height: "3.5rem" }} >
                                                                    <div className="card-body">
                                                                        <h6 className="card-title">{ind + 1}</h6>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            {
                                seatarr.length >= 1 ?
                                    <button className='btn btn-primary btn-sm mt-3 my-5' data-bs-toggle="modal" data-bs-target="#exampleModal">Process To Next Step</button>
                                    : ""
                            }
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Your MasterList</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <table className="table mt-3">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Select</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        MasterList.map((item, ind) => (
                                                            <tr key={ind}>
                                                                <th >{ind + 1}</th>
                                                                <td>{item.name}</td>
                                                                <td>
                                                                    {
                                                                        checkbox.includes(item.name) == true ?
                                                                            <div className="form-check">
                                                                                <input type="checkbox" checked={true} onClick={() => handleCheckboxChange(item.name)} id="flexCheckDefault" />
                                                                            </div>
                                                                            :
                                                                            <div className="form-check">
                                                                                <input type="checkbox" checked={false} onClick={() => handleCheckboxChange(item.name)} id="flexCheckDefault" />
                                                                            </div>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                    <tr>
                                                        <td style={{ color: "green" }}>*Total Price</td>
                                                        <td><button className='btn btn-primary btn-sm' disabled={true}>{pay}</button></td>
                                                        <td>No Payment</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={submit}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <Loader />
                        
            }
        </>
    )
}

export default Ticket_Book