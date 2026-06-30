import * as React from 'react';
import Chip from '@mui/material/Chip';

const ShowPreviousHistory = ({ searchHistory, deletePreviousHistory, onClickSearchHistory }) => {
    return (
        <div className="d-flex justify-content-center flex-wrap mt-4 px-5">
            {
                searchHistory && searchHistory?.map((el) => (
                    <div className='mt-2 mx-1'>
                        <Chip
                            label={el}
                            onClick={() => onClickSearchHistory(el)}
                            onDelete={() => deletePreviousHistory(el)}
                        />
                    </div>
                ))
            }
        </div>
    )
}
export default ShowPreviousHistory;