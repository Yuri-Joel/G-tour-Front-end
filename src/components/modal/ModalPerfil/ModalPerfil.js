import { CButton, CCol, CForm, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useState } from 'react'
import { api } from '../../../api/api.pnp'
import { toast } from 'react-toastify'
import { GetTokenCookie } from '../../../session'

export const AddPerfil = ({ GetPerfil, setVisible, visible}) => {

  const [Input, setInput] = useState({
    name: "",
    description: ""
  })

  const [validated, setValidated] = useState(false)
  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (Input.description.trim() && Input.name.trim()) {
      try {

        const res = await api.post("/criar-perfil", Input, {
          headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
          }
        })

        setInput({ name: "", description: " " })
        GetPerfil()
        setVisible(false)
        toast.success(res.data.message)
      } catch (error) {
        toast.error(error.data.message)
      }
    } else {
      toast.warning("espaço vazio")
    }
  }
  return (
    <>
  <CModal backdrop="static"  alignment='center'
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="ToggleBetweenModalsExample1"
            >
              <CModalHeader>
                    <CModalTitle id="ToggleBetweenModalsExample1">Cadastrar Novo Perfil</CModalTitle>
                </CModalHeader>
                <CModalBody>
      <CForm className="row g-3 needs-validation" noValidate validated={validated} >
        <CCol md={6}>
          <CFormTextarea
            type="text"
            value={Input.name}
            onChange={(e) => { setInput({ ...Input, name: e.target.value }) }}
            name="name"
            className='dynamic-textarea'
            id="validationCustom01"
            label="Novo Perfil"
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormTextarea
            type="text"
            value={Input.description}
            onChange={(e) => { setInput({ ...Input, description: e.target.value }) }}
            name="description"
            id="validationCustom02"

            className='dynamic-textarea'
            label="Descrição"
            required
          />
        </CCol>
      </CForm>
      </CModalBody>
        <CModalFooter>
                   
                 
        <CCol>
        <CButton color="primary" onClick={handleSubmit} style={{ margin: "10px" }}>
          Criar Novo Perfil
        </CButton>
        <CButton color='danger' onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
      </CCol>
      </CModalFooter>
      </CModal>

    </>
  )

}