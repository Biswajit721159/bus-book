import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import '../stylesheet/Filter.css'
import { BusTablemethod } from '../redux/BusSlice'
const Filter = () => {

    const dispatch = useDispatch();
    const { Bus, station, loadingBus, loadingStation, error } = useSelector(state => state.Bus);

    const [bus, setbus] = useState(Bus)
    const [DurationEarlyFirst, setDurationEarlyFirst] = useState(false)
    const [DurationLateFirst, setDurationLateFirst] = useState(false)
    const [DepartureEarlyFirst, setDepartureEarlyFirst] = useState(false)
    const [DepartureLateFirst, setDepartureLateFirst] = useState(false)
    const [ArrivalEarlyFirst, setArrivalEarlyFirst] = useState(false)
    const [ArrivalLateFirst, setArrivalLateFirst] = useState(false)

    function removedRemainingChecked(s) {
        if (s !== "DurationEarlyFirst")
            setDurationEarlyFirst(false)
        if (s !== "DurationLateFirst")
            setDurationLateFirst(false)
        if (s !== "DepartureEarlyFirst")
            setDepartureEarlyFirst(false)
        if (s !== "DepartureLateFirst")
            setDepartureLateFirst(false)
        if (s !== "ArrivalEarlyFirst")
            setArrivalEarlyFirst(false)
        if (s !== "ArrivalLateFirst")
            setArrivalLateFirst(false)

    }

    function ChangeChecked(e, s) {
        if (s === "DurationEarlyFirst") {
            setDurationEarlyFirst(e.target.checked)
            removedRemainingChecked(s)
            applyFilter(s)
        }
        else if (s === "DurationLateFirst") {
            setDurationLateFirst(e.target.checked)
            removedRemainingChecked(s)
            applyFilter(s)
        }
        else if (s === "DepartureEarlyFirst") {
            setDepartureEarlyFirst(e.target.checked)
            removedRemainingChecked(s)
            applyFilter(s)
        }
        else if (s === "DepartureLateFirst") {
            setDepartureLateFirst(e.target.checked)
            removedRemainingChecked(s)
            applyFilter(s)
        }
        else if (s === "ArrivalEarlyFirst") {
            setArrivalEarlyFirst(e.target.checked)
            removedRemainingChecked(s)
            applyFilter(s)
        }
        else if (s === "ArrivalLateFirst") {
            setArrivalLateFirst(e.target.checked)
            removedRemainingChecked(s)
            applyFilter(s)
        }
    }

    function applyFilter(s) {
        if (s === "DurationEarlyFirst") {
            dispatch(BusTablemethod.DurationEarlyFirst(Bus))
        }
        else if (s === "DurationLateFirst") {
            dispatch(BusTablemethod.DurationLateFirst(Bus))
        }
        else if (s === "DepartureEarlyFirst") {
            dispatch(BusTablemethod.DepartureEarlyFirst(Bus))
        }
        else if (s === "DepartureLateFirst") {
            dispatch(BusTablemethod.DepartureLateFirst(Bus))
        }
        else if (s === "ArrivalEarlyFirst") {
            dispatch(BusTablemethod.ArrivalEarlyFirst(Bus))
        }
        else if (s === "ArrivalLateFirst") {
            dispatch(BusTablemethod.ArrivalLateFirst(Bus))
        }
    }

    return (
        <div className="filter mt-5" >

            <div className="form-check  mb-3 mx-2">
                <input className="form-check-input1" type="checkbox" checked={DurationEarlyFirst} onChange={(e) => ChangeChecked(e, "DurationEarlyFirst")} />
                <label className="form-check-label">
                    Duration(Early First)
                </label>
            </div>
            <div className="form-check  mb-3 mx-2">
                <input className="form-check-input1" type="checkbox" checked={DurationLateFirst} onChange={(e) => ChangeChecked(e, "DurationLateFirst")} />
                <label className="form-check-label">
                    Duration(Late First)
                </label>
            </div>
            <div className="form-check  mb-3 mx-2">
                <input className="form-check-input1" type="checkbox" checked={DepartureEarlyFirst} onChange={(e) => ChangeChecked(e, "DepartureEarlyFirst")} />
                <label className="form-check-label">
                    Departure(Early First)
                </label>
            </div>
            <div className="form-check  mb-3 mx-2">
                <input className="form-check-input1" type="checkbox" checked={DepartureLateFirst} onChange={(e) => ChangeChecked(e, "DepartureLateFirst")} />
                <label className="form-check-label">
                    Departure(Late First)
                </label>
            </div>
            <div className="form-check  mb-3 mx-2">
                <input className="form-check-input1" type="checkbox" checked={ArrivalEarlyFirst} onChange={(e) => ChangeChecked(e, "ArrivalEarlyFirst")} />
                <label className="form-check-label">
                    Arrival(Early First)
                </label>
            </div>
            <div className="form-check  mb-3 mx-2">
                <input className="form-check-input1" type="checkbox" checked={ArrivalLateFirst} onChange={(e) => ChangeChecked(e, "ArrivalLateFirst")} />
                <label className="form-check-label">
                    Arrival(Late First)
                </label>
            </div>
        </div>
    )
}
export default Filter