import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { PulseLoader } from 'react-spinners';
const Loader = () => {
    return (
        <div className='loader-container' size='18px'>
            {/* <PulseLoader size={'12px'} color="#36d7b7" /> */}
            <CircularProgress />
        </div>
    )
}

export default Loader