import { createSlice } from '@reduxjs/toolkit'

function getSourceStation() {
    let src = localStorage.getItem('src')
    if (src === null) {
        localStorage.setItem('src', JSON.stringify(''));
        return ''
    }
    else {
        return JSON.parse(src)
    }
}

function getDistinationStation() {
    let dist = localStorage.getItem('dist');
    if (dist === null) {
        localStorage.setItem('dist', JSON.stringify(''));
        return ''
    }
    else {
        return JSON.parse(dist)
    }
}

function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    let date = localStorage.getItem('date');
    if (date === null) {
        localStorage.setItem('date', JSON.stringify(today));
        return today
    } else {
        return JSON.parse(date)
    }
}

function clearEverythig() {
    localStorage.setItem('date', JSON.stringify(''))
    localStorage.setItem('src', JSON.stringify(''))
    localStorage.setItem('dist', JSON.stringify(''))
}

const BusSearchSlice = createSlice({
    name: 'BusSearch',
    initialState: {
        src: getSourceStation(),
        dist: getDistinationStation(),
        date: getDate()
    },

    reducers: {
        Addsrc: (state, action) => {
            state.src = action.payload;
            localStorage.setItem('src', JSON.stringify(action.payload))
        },
        adddist: (state, action) => {
            state.dist = action.payload
            localStorage.setItem('dist', JSON.stringify(action.payload))
        },
        addate: (state, action) => {
            state.date = action.payload
            localStorage.setItem('date', JSON.stringify(action.payload))
        },
        clearsearch: (state, action) => {
            clearEverythig()
            state.src = ''
            state.dist = ''
            state.date = ''
        }
    },
})


export const BusSearchmethod = BusSearchSlice.actions
const BusSearchReducer = BusSearchSlice.reducer
export default BusSearchReducer