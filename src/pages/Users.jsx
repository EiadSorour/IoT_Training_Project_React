import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// server url
const URL = "http://localhost:3001/api";

function UsersPage() {
    
    // username variable (current admin username)
    var username;
    
    // Page users limit
    const pageLimit = 5;

    // Navigate object to navigate through pages
    const navigate = useNavigate();

    // This object will allow us to get "username" state that was sent from "login" page
    const {state} = useLocation();

    try{
        // set username to current admin username
        username = state.username;
    }catch(error){
        // it there is no admin username found these means no login happend so redirected to "Login" page again
        navigate("/login");
    }
    
    // States to hold "current Users" , "maximum pagination pages number" and "current pagination page number"
    const [users, setUsers] = React.useState([]);
    const [maxPageNumber, SetMaxPageNumber] = React.useState(0);
    const [currentPage , setCurrentPage] = React.useState(1);
    
    // useEffect is a hook that is excuted whenever any change happen to the objects i specify
    // it is granted to excuted (at least once)
    // Implement useEffect hook that doesn't wait for any changes on any component 
    // Excuted once to just get all users from server
    React.useEffect(()=>{
        const prepareUsers = async ()=>{
            try{
                const url = URL+"/users";
                const response = await axios.get(url , {params: {limit:pageLimit , page:currentPage}});
                setUsers(response.data.data.users);
                SetMaxPageNumber(Math.ceil(response.data.data.count/pageLimit));
            }catch(error){
                navigate("/login");
            }
        }
        prepareUsers();
    }, [])


    // Navigate to next page of users (pagination)
    async function handleOnNextPage(event){
        event.preventDefault();
        var url;
        var response;
        if(currentPage !== maxPageNumber){
            try{
                url = URL+"/users";
                response = await axios.get(url , {params: {limit:pageLimit , page:(currentPage+1)}});
                setUsers(response.data.data.users);
                setCurrentPage(currentPage+1);
            }catch(error){
                navigate("/login");
            }
        }
    }

    // Navigate to previous page of users (pagination)
    async function handleOnPreviousePage(event){
        event.preventDefault();
        var url;
        var response;
        if(currentPage !== 1){
            try{
                url = URL+"/users";
                response = await axios.get(url , {params: {limit:pageLimit , page:(currentPage-1)}});
                setUsers(response.data.data.users);
                setCurrentPage(currentPage-1);
            }catch(error){
                navigate("/login");
            }
        }
    }

    // Block or unblock user
    async function blockUnblock(args, event){
        
        // set URL to the server
        const url = URL+"/users/block";
        
        // get user username
        const userToBlock = args[0].username;
        
        // send request to the server
        const response = await axios.patch(url, {} ,{params: {username:userToBlock}});
        const newUser = response.data.data.user;
        

        // Change rendering of the buttons passed on action happened (conditional rendering)
        const buttonID = event.target.id;
        const btn = document.getElementById(buttonID);

        if(newUser.isBlocked){
            btn.classList.remove(["btn-danger"]);
            btn.classList.add(["btn-success"]);
            btn.textContent = "unblock";
        }else{
            btn.classList.remove(["btn-success"]);
            btn.classList.add(["btn-danger"]);
            btn.textContent = "Block";
        }
    }


    // make admin or remove admin
    async function addRemoveAdmin(args, event){

        // set URL to the server
        const url = URL+"/users/admin";

        // get user username
        const username = args[0].username;

        // send request to the server
        const response = await axios.patch(url, {} ,{params: {username:username}});
        const newUser = response.data.data.user;
        
        // Change rendering of the buttons passed on action happened (conditional rendering)
        const buttonID = event.target.id;
        const btn = document.getElementById(buttonID);

        if(newUser.role === "client"){
            btn.classList.remove(["btn-danger"]);
            btn.classList.add(["btn-success"]);
            btn.textContent = "Make Admin";
        }else{
            btn.classList.remove(["btn-success"]);
            btn.classList.add(["btn-danger"]);
            btn.textContent = "Remove Admin";
        }
    }

    if(users){
        return(
            <div className="text-center d-grid gap-2 col-11 mx-auto position-absolute top-50 start-50 translate-middle">
            
            <h1 className="text-center">Welcome, {username}</h1>

            <table class="table table-bordered table-striped">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">userID</th>
                        <th scope="col">username</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {users.map((user, index)=>{
                        return (
                            <tr>
                                <td>{user.userID}</td>
                                <td>{user.username}</td>
                                <td name="button"><button id={`block_${index}`} onClick={blockUnblock.bind(this , [user])} className={user.isBlocked === false? "btn btn-danger":"btn btn-success"}>{user.isBlocked === true? "unblock": "Block"}</button></td>
                                <td name="button"><button id={`admin_${index}`} onClick={addRemoveAdmin.bind(this,[user])} className={user.role === "admin"? "btn btn-danger":"btn btn-success"}>{user.role === "admin"? "Remove Admin":"Make Admin"}</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="position-relative">
                <nav aria-label="Page navigation example" className="position-absolute mt-3 top-50 start-50 translate-middle">
                    <ul className="pagination">
                        <li onClick={handleOnPreviousePage} class="page-item">
                            <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li class="page-item"><a class="page-link">{currentPage}</a></li>
                        <li onClick={handleOnNextPage} class="page-item">
                            <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            
            <Link to={"/login"} className="btn btn-primary position-absolute top-100 start-0 mt-5">Back</Link>
        </div>
        );
    }else{
        return <h1>loading...</h1>;
    }
}

export default UsersPage;
