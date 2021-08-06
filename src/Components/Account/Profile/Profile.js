import React, { useRef, useEffect, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import Header from "../../Header/Header"
import Sidebar from "../Sidebar"
import './profile.css'
import { useAuth } from "../../../contexts/AuthContext"
import { database, db } from '../../../firebase'

function Profile() {
    const { currentUser, currentUserData, videos, likedVideos } = useAuth()
    const [loading, setLoading] = useState(false)
    const nameRef = useRef()
    const [error, setError] = useState()
    const [result, setResult] = useState()
    const [uploadCount, setUploadCount ] = useState()
    const [ likeCount, setLikeCount ] = useState()
    const [ subscriptionCount, setSubscriptionCount] = useState()
    useEffect(() => {
        var count = 0;
        console.log(videos)
        for(var i = 0;i < videos.length;i++){
            if(videos[i].email === currentUser.email){
                count ++;
            }
        }
        setUploadCount(count)
    },[videos, setUploadCount, currentUser])
    useEffect(() => {
        setLikeCount(likedVideos.length)
    }, [likedVideos])
    useEffect(() => {
        db.collection("UserSubscriptions").doc(currentUser.uid).collection("subscribedChannels").onSnapshot((snap) => {
            setSubscriptionCount(snap.docs.length)
        })
    },[setSubscriptionCount, currentUser])
    function updateProfile(){
        const Name = nameRef.current.value
        if(currentUserData){
            if(currentUserData.name !== Name){
                setLoading(true)
                currentUser.displayName = Name
                database.users.doc(currentUser.uid.toString).set({
                    name: Name
                })
                .then(() => {
                    setResult("Profile Updated Successfully")
                })
                .catch((error) => {
                    setError("An Error Occured while updating")
                })
            }
        }
        else{
            setLoading(true)
            database.users.doc(currentUser.uid).set({
                name: Name
            })
            .then(() => {
                setResult("Profile Updated Successfully")
            })
            .catch((error) => {
                setError("An Error Occured while updating")
            })
        }
        setLoading(false)
    }
    return (
       <div>
           <Header />
           <div className="body">
               <Sidebar />
               <div className="profile-body">
                    <div className="profile">
                        <h1>Profile</h1>
                        <div className="profile_card">
                        <Form>
                            <Form.Group id="name" style={{margin: "20px"}}>
                                <h4>Name</h4>
                                <Form.Control type="text" ref={nameRef} />
                            </Form.Group>
                        </Form>
                        { currentUser &&  <div className="email_div">
                        <h4>Email</h4>
                        <p>{currentUser.email}</p>
                        <h4>User Id</h4>
                        </div>}
                        <Button disabled={loading} onClick={updateProfile}>Update Profile</Button>
                        {result &&  <Alert variant="success">{result}</Alert> }
                        {error && <Alert variant="danger">{error}</Alert>}
                    </div>
               </div>
               <div className="profile-video-data">
                        <div className="profile-display">
                            <img alt="profileImage" src={currentUser.photoURL} />
                            <p>Uploads: {uploadCount} </p>
                            <p>Likes: {likeCount} </p>
                            <p>Subscriptions: {subscriptionCount} </p>
                        </div>
                </div>
        </div>
           </div>
       </div>
    )
}

export default Profile
