import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
const NotFoundPage = () => {
    const nevigate=useNavigate();
    function goback(){
        nevigate(-1);
    }
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 text-center">
                    <h3 className="mb-4">404 - Page Not Found</h3>
                    <p className="mb-4">Oops! The page you are looking for does not exist.</p>
                    <Link onClick={()=>goback()} className="btn btn-primary btn-sm">Go Home</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
