import {useState} from "react";
import useRequest from "../../hooks/useRequest";
import Router from 'next/router';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {doRequest, errors} = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body:{
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    }
    return(
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className = "form-group">
                <label>Email Address</label>
                <input value={email} className="form-control" onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className = "form-group">
                <label>Password</label>
                <input value={password} type="password" className="form-control" onChange={e => setPassword(e.target.value)}/>
            </div>
            {errors}
            <button className = "btn btn-primary">Sign Up</button>
        </form>
    );
};

export default Signup;