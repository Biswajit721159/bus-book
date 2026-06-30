import React from "react";
import { useDispatch, useSelector } from 'react-redux'
import '../stylesheet/Searchinput.css'
import { BusTablemethod } from '../redux/BusSlice'
const Search = () => {
    const dispatch = useDispatch()
    let inputvalue = useSelector((state) => state.Bus.searchinput)
    let bus = useSelector((state) => state?.Bus?.Bus)
    return (
        <input
            className="searchinputfrom"
            placeholder="Enter Bus Name"
            value={inputvalue}
            spellCheck="false"
            onChange={(e) => {
                dispatch(BusTablemethod.Addsearch({ searchinput: e.target.value, bus: bus }))
            }}
        />
    )
}
export default Search