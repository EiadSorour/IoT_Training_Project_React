import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage(){

    // Navigation object to navigate through routes
    const navigate = useNavigate();

    // userData state which contains the value of username and password of user
    const [userData, setUserData] = React.useState(
        {
            username: "",
            password: ""
        }
    );
    
    // Type of password field state (used to hide and unhide password passed on button click)
    const [passwordTypes, setPasswordTypes] = React.useState(
        {
            passwordType: "password",
            passIcon: "fa-solid fa-eye"
        }
    );

    // State that holds array of erros that we can get from the server
    const [errorMessages, setErrorMessages] = React.useState([]);

    // function that excuted when username or password fields changed their value
    function handleOnChange(event){
        const changeName = event.target.id;
        const currentValue = event.target.value;
        
        // Update userData state with the current value 
        setUserData((prev)=>{
            return(
                {
                    ...prev,                        // fetch previous values
                    [changeName]: currentValue      // Update only changed ones
                }
            )
        })
    }

    // Hide and unhide password button function
    function handleOnClick(event){
        event.preventDefault();
        const clickBtn = event.target.id;
        if(clickBtn === "btnPassword" || clickBtn === "passIcon"){
            setPasswordTypes((prev)=>{
                if(prev.passwordType === "password"){
                    return {
                        ...prev,
                        passwordType: "text",
                        passIcon: "fa-solid fa-eye-slash"
                    }
                }else{
                    return {
                        ...prev,
                        passwordType: "password",
                        passIcon: "fa-solid fa-eye"
                    }
                }
            })
        }
    }

    // Login function
    async function handleOnSubmit(event){
        event.preventDefault();
        
        // set server url
        const url = "http://localhost:3001/api/login/admin";
        
        // try to catch any expected errors from the server
        try{

            // response variable to hold response of the server
            const response = await axios.post(url, userData);

            // Extract username from the response
            const username = response.data.data.username;            
            
            // Navigate to admin page and pass username as a state to it
            navigate("/admin/users" , {state: {username:username}});
        }catch(error){
            // extract error messages from error object
            const errorMessage = error.response.data.message;
            
            // set errorMessages state
            setErrorMessages((prev)=>{
                if(Array.isArray(errorMessage)){
                    return errorMessage;
                }else{
                    return([errorMessage])
                }
            });
        }
    }

    return (
        <main className="form-signin m-auto position-absolute top-50 start-50 translate-middle">
            <form className="text-center">
                {errorMessages.map((message)=>{
                    return (
                        <p className="m-0" style={{color:"red"}}>{message}</p>
                    )
                })}
                
                <h1 className="h3 mb-3 fw-bold">Login</h1>

                <div className="form-floating p-0 mb-2">
                    <input onChange={handleOnChange} type="text" className="form-control" id="username" placeholder="Username"/>
                    <label htmlFor="username">Username</label>
                </div>
                
                <div className="form-floating p-0">
                    <input onChange={handleOnChange} style={{minWidth: "120px"}} type={passwordTypes.passwordType} className="form-control" id="password" placeholder="Password"/>
                    <label htmlFor="password">Password</label>
                    <button onClick={handleOnClick} id="btnPassword" className="bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y me-1" ><i id="passIcon" className={passwordTypes.passIcon}></i></button>
                </div>

                <button onClick={handleOnSubmit} className="btn btn-primary fw-bold w-100 py-2 my-3" type="submit">Login</button>
                
            </form>
        </main>
    )
}

export default LoginPage;