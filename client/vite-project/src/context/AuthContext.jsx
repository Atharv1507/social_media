import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";



const AuthContext = createContext()

// Public Pages - PublicRoutes
// Protected Pages - Protected Routes

export const AuthProvider = ({children})=>{
     const [user , setUser] = useState(null) 
     const [loading , setLoading] = useState(false)

     useEffect(()=>{
        setLoading(true)
           axiosInstance.get('users/me').then((response)=>{
            console.log(response.data.userData)
            setUser(response.data.userData)
            setLoading(false)
           }).catch((err)=>{
            console.log(err)
            setLoading(false)
           }).finally(()=>{
            setLoading(false)
           })
     } , [])



     return(
        <AuthContext.Provider value={{user , setUser , loading}}>

            {children}
        </AuthContext.Provider>
     )
}

export const useAuth = ()=> useContext(AuthContext)