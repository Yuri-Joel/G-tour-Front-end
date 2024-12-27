import { CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CSpinner,  CButton } from "@coreui/react"
import { useState } from "react"
import { api } from "../../../api/api.pnp"
import { GetTokenCookie } from "../../../session"
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import {cilArrowCircleRight, cilUserPlus} from '@coreui/icons';
const AdminCadastrarAdmin = ()=>{

    const  navi = useNavigate()

       const [admin, setadmin] = useState({
          nome: '',
          email: "",
          telefone: "",
          senha: "",
       })
const [loading, setloading] = useState(false)
  const HandleAdmin = async (e)=>{
    setloading(true)
              e.preventDefault()
          try {

              const res = await api.post(`/criar-admin`, admin, {
                headers: {
                  Authorization: `Bearer ${GetTokenCookie(" ")}`
                }
              })


                navi("/Controle/listar")
                  toast.success(res.data.message)



          } catch (error) {
            toast.error(error.response.data.message)
              console.log(error)
          } finally {
            setloading(false)
          }
       }




  return(


        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">

                <div className="card-body">
                {<div className="float-end"><CButton onClick={() => { navi("/Controle/listar") }} ><CIcon icon={cilArrowCircleRight} size='xxl' /> </CButton></div>}
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Cadastrar Admin</h5>
                  </div>

                  <CForm className="row g-3 needs-validation"  onSubmit={HandleAdmin}>
                    <div className="col-12">
                      <label htmlFor="yourName" className="form-label">Nome</label>
                      <input type="text"  className="form-control" id="yourName" required  onChange={(e)=> setadmin({...admin, nome: e.target.value})}/>
                      <div className="invalid-feedback">Please, enter your name!</div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">Email</label>
                      <input type="email"  className="form-control" id="yourEmail" required onChange={(e)=> setadmin({...admin, email: e.target.value})} />
                      <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourtelefone" className="form-label">telefone</label>
                      <input  className="form-control" id="yourtelefone" required onChange={(e)=> setadmin({...admin, telefone: e.target.value})} />
                      <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                    </div>

                       <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">Password</label>
                      <input type="password" className="form-control" id="yourPassword" required onChange={(e)=> setadmin({...admin, senha: e.target.value})} />
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit" style={{backgroundColor:'#00968c'}}>Cadastrar</button>
                    </div>

                  </CForm>

                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default AdminCadastrarAdmin;
