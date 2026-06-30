import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Modal,
    Box,
    Typography,
    Backdrop,
    Fade,
} from '@mui/material';

const OTPModal = ({ open, handleClose, OTPVerified, sendOTP, errormess, submitLoading, resentLoading }) => {

    const [otp, setOtp] = useState('');
    const [resendTimeout, setResendTimeout] = useState(60);
    const [resendEnabled, setResendEnabled] = useState(false);

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        OTPVerified(otp);
    };

    useEffect(() => {
        if (resendTimeout > 0) {
            const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendEnabled(true);
        }
    }, [resendTimeout]);

    function resentOTP() {
        sendOTP();
        setResendTimeout(60);
        setResendEnabled(false);
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
                        Enter OTP
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
                                        onClick={resentOTP}
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
    );
};

export default OTPModal;
