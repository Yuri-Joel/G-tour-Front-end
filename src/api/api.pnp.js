import axios from 'axios'
import { toast } from 'react-toastify'
import { RemoveTokenCookie } from '../session'

export const api = axios.create({
  baseURL: 'http://26.114.129.108:8800',
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Limpar o token ou realizar outras ações necessárias
      RemoveTokenCookie()
      window.location.href = '/login#/login'
      toast.info(`${error.response.data.message}`)
    }
    return Promise.reject(error)
  },
)

export const React_APP = 'angola'
