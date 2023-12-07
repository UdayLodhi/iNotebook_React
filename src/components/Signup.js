import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {  

    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", cpassword: "" })

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            //save the auth token and redirect 
            localStorage.setItem('token', json.authtoken)
            navigate("/");
            props.showAlert("Account Created Successfully","success");
            setcredentials ({ name: "", email: "", password: "", cpassword: "" })
        }
        else {
            props.showAlert("Invalid credentials","danger");
        }
    }

    const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='container mt-2'>
            <h3>Create an account to use iNotebook</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label"><strong>Enter name</strong></label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label"><strong>Enter Email</strong></label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label"><strong>Enter Password</strong></label>
                    <input type="password" className="form-control" onChange={onChange} id="password" name="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label"><strong>Confirm Password</strong></label>
                    <input type="password" className="form-control" onChange={onChange} id="cpassword" name='cpassword' minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}

export default Signup
