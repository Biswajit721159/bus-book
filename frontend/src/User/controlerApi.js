
const api = process.env.REACT_APP_API
export const VerifyOTP = async (email, password, otp) => {
    try {
        let response = await fetch(`${api}/Verification/VerifyOTP`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                otp: otp,
                password: password
            })
        })
        response = await response.json();
        return response;
    } catch (error) {
        throw (new Error("Fail to send otp, please try again"))
    }
}

export const SendOTP = async (email, password) => {
    try {
        let response = await fetch(`${api}/Verification/Login/otp-send`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email, password: password
            })
        })
        response = await response.json();
        return response;
    } catch (error) {
        throw (new Error("Fail to send otp, please try again"))
    }
}