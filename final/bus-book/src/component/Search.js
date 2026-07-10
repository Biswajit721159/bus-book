import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { BusTablemethod } from '../redux/BusSlice';

const Search = () => {
    const dispatch = useDispatch();
    const inputvalue = useSelector((state) => state.Bus.searchinput);
    const bus = useSelector((state) => state?.Bus?.Bus);

    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                className="input-field pl-9"
                placeholder="Search bus name..."
                value={inputvalue}
                spellCheck="false"
                onChange={(e) => {
                    dispatch(BusTablemethod.Addsearch({ searchinput: e.target.value, bus: bus }));
                }}
            />
        </div>
    );
};

export default Search;