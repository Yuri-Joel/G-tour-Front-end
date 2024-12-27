import { CButton, CCol, CForm, CFormFeedback, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CSpinner } from "@coreui/react"
import { api } from "../../../api/api.pnp"
import {  useState } from "react"
import { GetTokenCookie } from "../../../session"
import { toast } from "react-toastify"


export const ModalEmergencias = ({ setVisible, visible, Get}) => {

    const [Input, setInput] = useState({    
        name: "" ,
        telefone: "",
        description:"" ,
          type: "",
          latitude:"",
          longitude:""
    })
   
    const [validated, setValidated] = useState(false)
    const [loading, setloading] = useState(false)
    const CriarEmergencias = async (e) => {
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()

            toast.warn("erro, espaço vazio")
        }
        setValidated(true)
        setloading(true)
        const token = GetTokenCookie("nada")
        try {
            const res = await api.post(`/criar-emergencias/`, Input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
setInput({name: "", telefone:"", description: ""})

            setVisible(false)
            Get()
        } catch (error) {
            toast.info(error.response.data.message)
        } finally {
            setloading(false)
        }
    }
    return (
        <CModal backdrop="static" alignment='center'
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="ToggleBetweenModalsExample1"
        >
            <CModalHeader>

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
                            label="Nome da emergencia"
                            required
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormTextarea
                            type="text"
                            value={Input.telefone ? Input.telefone : ""}
                            onChange={(e) => { setInput({ ...Input, telefone: e.target.value }) }}
                            name="telefone"
                            id="validationCustom02"

                            className='dynamic-textarea'
                            label="Telefone"
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
                            label="descricao"
                            required
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormTextarea
                            type="text"
                            value={Input.latitude}
                            onChange={(e) => { setInput({ ...Input, latitude: e.target.value }) }}
                            name="latitude"
                            id="validationCustom02"

                            className='dynamic-textarea'
                            label="latitude"
                            required
                        />
                    </CCol><CCol md={6}>
                        <CFormTextarea
                            type="text"
                            value={Input.longitude}
                            onChange={(e) => { setInput({ ...Input, longitude: e.target.value }) }}
                            name="longitude"
                            id="validationCustom02"

                            className='dynamic-textarea'
                            label="longitude"
                            required
                        />
                    </CCol>
                    <CCol md={6}>
                <CFormFeedback >Selecine o tipo de Emergencia</CFormFeedback>
                  <CFormSelect required  label={" "} onChange={(e)=> setInput({...Input, type: e.target.value})}>
                    <option>Selecione o tipo de emergencia</option>
                  
                      <option value={"Policia"}>Policia</option>
                      <option value={"Bombeiros"}>Bombeiros</option>
                      <option value={"Hospital"}>Hospital</option>
                      <option value={"Faa"}>Faa</option>
               
                  </CFormSelect>
                  <CFormFeedback invalid>Erro seleciona um tipo</CFormFeedback>
              
                </CCol>
                </CForm>

            </CModalBody>
            <CModalFooter>
                <CButton
                    color="success"
                    onClick={CriarEmergencias}
                >
                    {!loading ? "Cadastrar Emergencia" : <CSpinner />}
                </CButton>
                <CButton
                    color="primary"
                    onClick={() => setVisible(false)}>
                    Cancelar
                </CButton>

            </CModalFooter>
        </CModal>)
}

