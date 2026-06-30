import React, { useState, useEffect } from "react";
import { GoXCircleFill } from "react-icons/go";
import { HiCheckCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { usermethod } from '../redux/UserSlice'
import { useDispatch } from 'react-redux'
import { SendOTP, VerifyOTP } from "./controlerApi";
import {
    Button,
    TextField,
    Modal,
    Box,
    Typography,
    Backdrop,
    Fade,
} from '@mui/material';
import '../stylesheet/Auth.css'
export default function Login() {

    const dispatch = useDispatch()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const history = useNavigate();
    const [wronguser, setwronguser] = useState(false)
    const [disabled, setdisabled] = useState(false)
    const [errormess, seterrormess] = useState("")
    const [registerandloginlink, setregisterandloginlink] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [resentLoading, setResentLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [resendTimeout, setResendTimeout] = useState(0);
    const [resendEnabled, setResendEnabled] = useState(true);

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        OTPVerified(otp);
    };


    const [emailcontrol, setemailcontrol] = useState({
        wrongemail: false,
        showemailfrom: false,
    })

    const [passwordcontrol, setpasswordcontrol] = useState({
        uppercase: false,
        lowercase: false,
        digit: false,
        specialCharacters: false,
        len: false,
        showpasswordfrom: false,
    })

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('user'));
        if (auth) {
            history('/')
        }
    }, [])

    useEffect(() => {
        if (resendTimeout > 0) {
            const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendEnabled(true);
        }
    }, [resendTimeout]);

    //password check
    function containsUppercase(str) {
        return /[A-Z]/.test(str);
    }

    function containsLowercase(str) {
        return /[a-z]/.test(str);
    }

    function containsDigit(str) {
        return /\d/.test(str);
    }

    function containsSpecialCharacter(str) {
        return /[^\w\d]/.test(str);
    }

    function checkpassword(s) {
        setwronguser(false)
        s = s.replace(/\s+/g, '');
        setpassword(s)
        if (s.length === 0) {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                uppercase: false,
                lowercase: false,
                digit: false,
                specialCharacters: false,
                len: false
            }));
            return
        }

        if (containsUppercase(s) === true) {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                uppercase: true,
            }));
        } else {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                uppercase: false,
            }));
        }

        if (containsLowercase(s) === true) {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                lowercase: true,
            }));
        } else {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                lowercase: false,
            }));
        }

        if (containsDigit(s) === true) {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                digit: true,
            }));
        } else {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                digit: false,
            }));
        }

        if (containsSpecialCharacter(s) === true) {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                specialCharacters: true,
            }));
        } else {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                specialCharacters: false,
            }));
        }

        if (s.length >= 8 && s.length <= 15) {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                len: true,
            }));
        } else {
            setpasswordcontrol((prevUserData) => ({
                ...prevUserData,
                len: false,
            }));
        }
    }

    //email check
    function checkforemailid(s) {
        setwronguser(false)
        s = s.replace(/\s+/g, '');
        setemail(s);
        if (s.length == 0) {
            setemailcontrol((prevUserData) => ({
                ...prevUserData,
                wrongemail: false,
            }));
            return
        }
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let a = regex.test(s);
        if (a) {
            setemailcontrol((prevUserData) => ({
                ...prevUserData,
                wrongemail: true,
            }));
        }
        else {
            setemailcontrol((prevUserData) => ({
                ...prevUserData,
                wrongemail: false,
            }));
        }
    }

    function checkAllInputfield() {
        return emailcontrol.wrongemail && passwordcontrol.uppercase && passwordcontrol.lowercase && passwordcontrol.digit && passwordcontrol.len && passwordcontrol.specialCharacters
    }

    function checkotp(data) {
        if (data?.length === 4) {
            return true;
        }
        seterrormess("Otp must be 4 digit");
        return false;
    }

    async function OTPVerified(otp) {
        try {
            seterrormess("");
            if (!checkotp(otp)) {
                return;
            }
            setSubmitLoading(true);
            let result = await VerifyOTP(email, password, otp);
            setSubmitLoading(false);
            if (result.statusCode == 200) {
                dispatch(usermethod.Add_User(result.data));
                history(-1);
            }
            else {
                setwronguser(true);
                seterrormess(result.message);
            }
        }
        catch (error) {
            setSubmitLoading(false);
            setwronguser(true);
            seterrormess("Some Error is Found");
        }
    }

    function disableinputform() {
        setwronguser(false)
        setpasswordcontrol((prevUserData) => ({
            ...prevUserData,
            showpasswordfrom: true
        }));
        setemailcontrol((prevUserData) => ({
            ...prevUserData,
            showemailfrom: true
        }));
    }

    function inableinputfrom() {
        setpasswordcontrol((prevUserData) => ({
            ...prevUserData,
            showpasswordfrom: false
        }));
        setemailcontrol((prevUserData) => ({
            ...prevUserData,
            showemailfrom: false
        }));
        setwronguser(true)
    }

    async function sendOTP() {
        if (checkAllInputfield()) {
            try {
                disableinputform();
                setdisabled(true);
                seterrormess("");
                setResentLoading(true)
                let result = await SendOTP(email, password);
                setResentLoading(false);
                if (result.statusCode == 200) {
                    handleOpen();
                    setregisterandloginlink(false);
                    setResendTimeout(60);
                    setResendEnabled(false);
                }
                else {
                    inableinputfrom();
                    setdisabled(false);
                    seterrormess(result.message);
                }
            }
            catch (error) {
                setResentLoading(false);
                inableinputfrom();
                setdisabled(false);
                seterrormess("We Find Some Error");
            }
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '1px solid gray',
        boxShadow: 24,
        p: 3,
        textAlign: 'center',
        'border-radius': '2%'
    };

    return (
        <div className="authform auto  mt-3">
            <h4>Login</h4>

            <div className="">
                <input type="email" value={email} onChange={(e) => { checkforemailid(e.target.value) }} disabled={emailcontrol.showemailfrom} className="inputreglog" placeholder="Enter Email Id" required />
                {emailcontrol.wrongemail && <HiCheckCircle style={{ color: 'green' }} />}
            </div>

            <div>
                <label className="wrongtext">{emailcontrol.wrongemail == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Email Address must be in valid formate with @ symbol</label>
            </div>

            <div className="">
                <input type="password" value={password} onChange={(e) => { checkpassword(e.target.value) }} disabled={passwordcontrol.showpasswordfrom} className="inputreglog" placeholder="Enter Password" required />
                {passwordcontrol.uppercase && passwordcontrol.lowercase && passwordcontrol.digit && passwordcontrol.len && passwordcontrol.specialCharacters && <HiCheckCircle style={{ color: 'green' }} />}
            </div>

            <div>
                <div className="authform">
                    <label className="wrongtext">{passwordcontrol.uppercase == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />} Password Must be one Upper case Character</label>
                    <label className="wrongtext">{passwordcontrol.lowercase == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}   Password Must be one Lower case Character</label>
                    <label className="wrongtext">{passwordcontrol.digit == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Password Must be Contain one Digit Character</label>
                    <label className="wrongtext">{passwordcontrol.specialCharacters == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Password Must be Contain one Special Character </label>
                    <label className="wrongtext">{passwordcontrol.len == false ? <GoXCircleFill style={{ color: 'red' }} /> : <HiCheckCircle style={{ color: 'green' }} />}  Length of Password at Least 8 to 15 Character</label>
                </div>
            </div>

            <div>
                {wronguser ? <label className="wrongtext" style={{ color: "red" }}><GoXCircleFill /> {errormess}</label> : ""}
            </div>
            <button className="btn btn-primary btn-sm" disabled={disabled} onClick={sendOTP}>{disabled ? 'Loging..' : 'Sign in'}</button>
            {
                registerandloginlink &&
                <>
                    <Link className="mt-3" style={{ textDecoration: 'none' }} to={'/ForgotPassword'}>Forgot Password</Link>
                    <p className="mt-4">Not a member? <Link style={{ textDecoration: 'none' }} to={'/register'}>Signup now</Link></p>
                </>
            }


            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">
                            Verify OTP
                        </Typography>
                        <form onSubmit={handleFormSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="OTP"
                                variant="outlined"
                                value={otp}
                                onChange={handleChange}
                                type='Number'
                            />
                            <div>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    size='small'
                                    disabled={submitLoading | resentLoading}
                                    style={{ textTransform: 'none' }}
                                >
                                    {submitLoading ? "Submitting" : "Submit"}
                                </Button>
                                {
                                    !resendEnabled && !resentLoading ?
                                        <p className='mt-2' style={{ color: 'green' }}>Resend OTP in <strong>{resendTimeout}</strong> seconds</p> :
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ mt: 2 }}
                                            onClick={sendOTP}
                                            disabled={submitLoading | resentLoading}
                                            size='small'
                                            style={{ textTransform: 'none', marginLeft: '10px' }}
                                        >
                                            {resentLoading ? "Resending" : "Resend"}
                                        </Button>}
                            </div>
                        </form>
                        <p style={{ color: 'red', marginTop: '5%' }}>{errormess}</p>
                    </Box>
                </Fade>
            </Modal>

            {/* <OTPModal
                open={open}
                handleClose={handleClose}
                OTPVerified={OTPVerified}
                sendOTP={sendOTP}
                errormess={errormess}
                submitLoading={submitLoading}
                resentLoading={resentLoading}
            /> */}
        </div>
    )
}