import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { api } from '../../../api/api.pnp'
import "./loading.css"
import { useNavigate } from 'react-router-dom';
import UseAuth from '../../../hooks/hooks'
import { GetTokenCookie, SaveToken } from '../../../session'
import { toast } from 'react-toastify'
import { Formattime } from '../../../function/Time'

const Login = () => {
  
  const [email, setemail] = useState("")

  const {setuser} = UseAuth();

  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const navi = useNavigate();

  const Login_Sign = async (e) => {
    e.preventDefault();
    setloading(true)

    try {
      const res = await api.post("/login-admin", { email, password })
      SaveToken(res.data.userlogin)
      setuser(GetTokenCookie(null))
      
      if(res.data.last === null){
        toast.info(`Seja bem vindo Sr(a). ${res.data.userlogin.name}`)
      } else {
        toast.info(`Bem vindo de volta Sr(a). ${res.data.userlogin.name}`)
        toast.info(` ultima actividade ${Formattime(res.data.last)} `)
      }
      navi(`/dashboard`)

    } catch (error) {
     // toast.warn(error.response.data.message)
    } finally {
      setloading(false);
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      {(loading &&
        <div className="loading" id="loading">
          <div className="spinner"></div>
        </div>
      )}
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary"> Insira os seus dados</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="email" autoComplete="username" value={email} onChange={(e) => setemail(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password} onChange={(e) => setpassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={Login_Sign}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>G tour Login</h2>
                    <p>
                    Faça login para manter a magia das viagens
                    </p>
                    {/* <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link> */}
                   Bem-vindo de volta, administrador. Vamos gerenciar destinos incríveis.
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
