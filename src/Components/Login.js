import React, { useRef, useState } from 'react'
import GoogleSignIn from "./GoogleSignIn";
import { useAuth } from "../contexts/AuthContext"
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

       
export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()
    async function handleSubmit(e){
        e.preventDefault()
        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/")
           } catch {
               setError("Failed to login ")
               
           }
           setLoading(false)
                
    }
    return (
        <div>
            <>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">LOGIN PAGE</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group id="email" style={{ margin: "10px" }}>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password" style={{ margin: "10px" }}>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Button disabled={loading} className="w-100" style={{ margin: "10px" }} type="submit">
                                Sign In
                            </Button>
                            <div>Don't have an account?</div>
                            <div> <a href="./signup" style={{ textAlign: "center" }}>Sign Up</a></div>
                        </Form>
                    </Card.Body>
                </Card>
                 </>
            <GoogleSignIn/>
        </div>
    )
}
        

        //added google sign in. Add rest login functionality on top as per need

