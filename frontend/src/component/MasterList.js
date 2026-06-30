import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Loader from "./Loader";
import { usermethod } from '../redux/UserSlice';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const api = process.env.REACT_APP_API;

const MasterList = () => {
    const [name, setName] = useState("");
    const [wrongName, setWrongName] = useState(false);
    const [messName, setMessName] = useState("");

    const [updateName, setUpdateName] = useState("");
    const [wrongUpdateName, setWrongUpdateName] = useState(false);
    const [messUpdateName, setMessUpdateName] = useState("");

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const [data, setData] = useState([]);
    const userInfo = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [submitButtonText, setSubmitButtonText] = useState("Submit");
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteButtonText, setDeleteButtonText] = useState("Delete");
    const [deleteDisabled, setDeleteDisabled] = useState(false);

    const [takeId, setTakeId] = useState('');

    const [updateId, setUpdateId] = useState('');
    const [disableUpdate, setDisableUpdate] = useState(false);
    const [updateButtonText, setUpdateButtonText] = useState("Update");

    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo?.user?.auth) {
            loadData();
        } else {
            navigate('/Login');
        }
    }, [userInfo]);

    const loadData = () => {
        setLoading(true);
        fetch(`${api}/MasterList/${userInfo?.user?.user._id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.user?.auth}`
            }
        }).then(response => response.json()).then((res) => {
            if (res.statusCode === 200) {
                setLoading(false);
                setData(res.data);
            } else if (res.statusCode === 498) {
                dispatch(usermethod.Logout_User());
                navigate('/Login');
            } else {
                navigate('*');
            }
        }).catch((error) => {
            navigate('*');
        });
    };

    const findErrorName = (s) => {
        var regex = /^[a-zA-Z ]{2,30}$/;
        return regex.test(s);
    };

    const handleSubmit = () => {
        let res = findErrorName(name);
        if (res) {
            setWrongName(false);
            setMessName("");
            setDisableSubmit(true);
            setSubmitButtonText("Please Wait....");
            fetch(`${api}/MasterList/${userInfo?.user?.user?._id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.user?.auth}`
                },
                body: JSON.stringify({
                    user_id: userInfo?.user?.user?._id,
                    name: name
                })
            }).then(response => response.json()).then((res) => {
                setDisableSubmit(false);
                setSubmitButtonText("Submit");
                if (res.statusCode === 201) {
                    setName("");
                    setOpenAddModal(false);
                    data.push(res?.data);
                    setData(data);
                } else {
                    setWrongName(true);
                    setMessName(res?.message);
                }
            }).catch((error) => {
                navigate('*');
            });
        } else {
            setWrongName(true);
            setMessName("*Name must be only string and should not contain symbols or numbers and string length is less than 2");
        }
    };

    const handleDeleteUser = (id) => {
        if (deleteDisabled) return;
        setTakeId(id);
        setDeleteButtonText("Please Wait...");
        setDeleteDisabled(true);
        fetch(`${api}/MasterList/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.user?.auth}`
            },
        }).then(response => response.json()).then((res) => {
            setDeleteDisabled(false);
            setDeleteButtonText("Delete");
            setTakeId('');
            let newData = data.filter((item) => {
                if (item?._id !== id) {
                    return item;
                }
            })
            setData(newData);
        }).catch((error) => {
            navigate('*');
        });
    };

    const handleUpdate = (id, name) => {
        setUpdateId(id);
        setOpenUpdateModal(true);
        setWrongUpdateName(false);
        setMessUpdateName("");
        setUpdateName(name);
    };

    const handleActualUpdate = (id) => {
        let res = findErrorName(updateName);
        if (res) {
            setWrongUpdateName(false);
            setMessUpdateName("");
            setUpdateButtonText("Please Wait...");
            setDisableUpdate(true);
            fetch(`${api}/MasterList/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.user?.auth}`
                },
                body: JSON.stringify({
                    name: updateName
                })
            }).then(response => response.json()).then((res) => {
                if (res.statusCode === 200) {
                    setDisableUpdate(false);
                    setUpdateId('');
                    let newData = data?.map((item) => {
                        if (item?._id === id) {
                            return res?.data;
                        } else {
                            return item;
                        }
                    }) 
                    setData(newData);
                    setOpenUpdateModal(false);
                } else {
                    setWrongUpdateName(true);
                    setMessUpdateName(res?.message);
                }
                setDisableUpdate(false);
                setUpdateButtonText("Update");
            }).catch((error) => {
                navigate('*');
            });
        } else {
            setWrongUpdateName(true);
            setMessUpdateName("*Name must be only string and should not contain symbols or numbers and string length is less than 2");
        }
    };

    return (
        <>
            {
                !loading ?
                    <div className="container">
                        <div className="mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" size="small" sx={{ textTransform: 'none' }} color="primary" onClick={() => setOpenAddModal(true)}>Add +</Button>
                        </div>


                        <table className="table-auto shadow border mt-3 p-5 w-auto mx-auto mb-3">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-center px-5 py-2 border ">#</th>
                                    <th scope="col" className="text-center px-5 py-2 border">Name</th>
                                    <th scope="col" className="text-center px-5 py-2 border">#Action1</th>
                                    <th scope="col" className="text-center px-5 py-2 border">#Action2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && data.length !== 0 && data.map((item, ind) => (
                                        <tr key={ind}>
                                            <th className="text-center px-5 py-2 border">{ind + 1}</th>
                                            <td className="text-center px-5 py-2 border">{item?.name}</td>
                                            <td className="text-center px-5 py-2 border">
                                                <Button variant="contained" color="primary" size="small" sx={{ textTransform: 'none' }} onClick={() => handleUpdate(item._id, item.name)}>Update</Button>
                                            </td>
                                            <td className="text-center px-5 py-2 border">
                                                <Button variant="contained" color="secondary" size="small" sx={{ textTransform: 'none' }} disabled={item._id === takeId && deleteDisabled} onClick={() => handleDeleteUser(item._id)}>
                                                    {item._id === takeId ? deleteButtonText : "Delete"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                        <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="xs" fullWidth>
                            <DialogTitle>Add Master User</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    spellCheck='false'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={wrongName}
                                    helperText={wrongName ? messName : ""}
                                    size="small"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenAddModal(false)} variant="contained" color="primary" size="small" sx={{ textTransform: 'none' }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} variant="contained" color="primary" size="small" sx={{ textTransform: 'none' }} disabled={disableSubmit}>
                                    {submitButtonText}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} maxWidth="xs" fullWidth>
                            <DialogTitle>Update Master User</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    spellCheck='false'
                                    value={updateName}
                                    onChange={(e) => setUpdateName(e.target.value)}
                                    error={wrongUpdateName}
                                    helperText={wrongUpdateName ? messUpdateName : ""}
                                    size="small"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenUpdateModal(false)} color="primary" variant="contained" size="small" sx={{ textTransform: 'none' }}>
                                    Cancel
                                </Button>
                                <Button onClick={() => handleActualUpdate(updateId)} variant="contained" color="primary" size="small" sx={{ textTransform: 'none' }} disabled={disableUpdate}>
                                    {updateButtonText}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    : <Loader />
            }
        </>
    );
};

export default MasterList;
