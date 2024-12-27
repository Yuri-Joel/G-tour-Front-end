import  { useContext } from 'react'
import { AuthContext } from '../context/context'
export default function UseAuth() {
 
    return useContext(AuthContext)
}
