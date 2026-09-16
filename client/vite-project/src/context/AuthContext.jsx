import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";


const AuthContext = createContext()

// Public Pages - PublicRoutes
// Protected Pages - Protected Routes

export const AuthProvider = ({children})=>{
     const [user , setUser] = useState(null) 

     useEffect(()=>{
           axiosInstance.get('users/me').then((response)=>{
            console.log(response.data.userData)
            setUser(response.data.userData)
           }).catch((err)=>{
            console.log(err)
           })
     } , [])



     return(
        <AuthContext.Provider value={{user , setUser}}>

            {children}
        </AuthContext.Provider>
     )
}

export const useAuth = ()=> useContext(AuthContext)