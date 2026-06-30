import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';
const api = process.env.REACT_APP_API
const View_Bus = () => {

    const [data, setdata] = useState()
    const [load, setload] = useState(true)
    const { _id } = useParams();
    const history = useNavigate();

    function loadBus() {
        setload(true)
        fetch(`${api}/bus/bus_detail/${_id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(responce => responce.json()).then((res) => {
            if (res != undefined && res.statusCode === 200) {
                setload(false)
                setdata(res.data)
            }
        }, (error) => {
            history('*')
        })
    }

    useEffect(() => {
        loadBus();
    }, [])


    return (
        <>
            {
                load === false ?
                    <div className='container'>
                        <table className="table border mt-5">
                            <thead>
                                <tr>
                                    <th scope="col">Bus Name -</th>
                                    <th scope="col">{data[0]?.bus_name}</th>
                                    <th scope="col">Total No. Of Station -</th>
                                    <th scope="col">{data[0]?.station_data.length}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Bus ID -</th>
                                    <th><Link style={{ textDecoration: "none" }}>{data[0]?._id}</Link></th>
                                    <th>Total Seat -</th>
                                    <th>{data[0]?.Total_seat}</th>
                                </tr>
                            </tbody>
                        </table>
                        <div className='d-flex align-items-center justify-content-center mt-5'>

                            <div>
                                {
                                    data?.length != 0 && data[0]?.station_data?.map((item, ind) => (
                                        <div key={ind}>
                                            <div className="mt-2">
                                                <h6>*{item?.station} - {item?.arrived_time} ({item?.Distance_from_Previous_Station} km)</h6>
                                            </div>
                                            <div className="mx-2 d-flex align-items-center justify-content-center mt-1">
                                                {
                                                    (ind + 1) == data[0]?.station_data.length ?
                                                        ""
                                                        : <i className="fa fa-arrow-circle-down mt-2" style={{ fontSize: "20px", color: "blue", textAlign: "center" }}></i>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    : <Loader />
            }
        </>
    )
}

export default View_Bus