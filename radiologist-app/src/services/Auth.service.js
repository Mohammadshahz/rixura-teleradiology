import axios from "axios"
import { errorHandler } from "../utils/error-handler";
import { loginUrl, registerUrl } from "../utils/urls";

const login = async body => {
   return axios.post(loginUrl, body)
   .then(res => res.data)
   .catch(errorHandler)
       
 }

const register = async body => {
   return axios.post(registerUrl, body)
        .then(response => {
           return response.data
        })
        .catch(errorHandler);
 }

 export const AuthService = {
   login,
   register
 }