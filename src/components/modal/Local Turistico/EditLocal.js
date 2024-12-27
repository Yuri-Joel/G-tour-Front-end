
import { CButton, CCol, CForm, CFormFeedback, CFormSelect, CFormTextarea, CSpinner } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { api } from '../../../api/api.pnp'
import { toast } from 'react-toastify'
import { GetTokenCookie } from '../../../session'

export const EditLocal = ({setVisible, Get, item, setVisibleEdit}) => {

    const [Input, setInput] = useState({
        id: item.id,
        name: item.name,
        about: item.about,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
        provinceId: item.provinceId,
        localType: item.localType
    })
    const [validated, setValidated] = useState(false)
    const [loading, setloading] = useState(false)
    const handleSubmit = async (e)=>{
      
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()

            toast.warn("erro, espaço vazio")
        }
        setValidated(true)
        setloading(true)
        try {
          
         await api.post("/edit-local",Input,{headers:{
              Authorization: `Bearer ${GetTokenCookie(" ")}`
         }} )
           
            setVisible(false)
            setVisibleEdit(false)
            Get()
        } catch (error) {
          toast.error("Erro ao Actualizar")
          console.log(error)
        }finally{
            setloading(false)
        }
    }
const [data, setData] = useState([])
    const ObterProvince =async ()=>{
        try {
           const res =  await api.get("/obter-province")
           setData(res.data.data)
        } catch (error) {
            
        } 
    }
    useEffect(()=>{ ObterProvince()},[])
    return (
        <>

            <CForm className="row g-3 needs-validation" noValidate validated={validated} >
                <CCol md={4}>
                    <CFormTextarea
                        type="text"
                        value={Input.name}
                        onChange={(e) => { setInput({ ...Input, name: e.target.value }) }}
                        name="name"
                        className='dynamic-textarea'
                        id="validationCustom01"
                        label="Nome do local (zona turistica)"
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormTextarea
                        type="text"
                        value={Input.about?Input.about :""}
                        onChange={(e) => { setInput({ ...Input, about: e.target.value }) }}
                        name="about"
                        id="validationCustom02"

                        className='dynamic-textarea'
                        label="Sobre"
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormTextarea
                        type="text"
                        value={Input.latitude}
                        onChange={(e) => { setInput({ ...Input, latitude: e.target.value }) }}
                        name="latitude"
                        id="validationCustom02"

                        className='dynamic-textarea'
                        label="Latitude"
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormTextarea type="text"    value={Input.longitude} onChange={(e) => { setInput({ ...Input, longitude: e.target.value }) }}
                        name="longitude"id="validationCustom02"     className='dynamic-textarea'  label="Longitude"
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormTextarea
                        type="text"
                        value={Input.address}
                        onChange={(e) => { setInput({ ...Input, address: e.target.value }) }} name="address"       id="validationCustom02" className='dynamic-textarea'label="Endereço"
                        required
                    />
                </CCol>
                <CCol md={4}>
                <CFormFeedback >Selecine o Tipo de Local</CFormFeedback>
                  <CFormSelect required value={Input.localType} onChange={(e)=> setInput({...Input, localType: e.target.value})}>
                    <option>Selecione o Tipo de Local</option>
                      <option value={"ZONA_TURISTICA"}>Zona Turistica</option>
                      <option value={"ZONA_TURISTA_CONSTITUIDA"}>Zona Turistica Constituida</option>
                  </CFormSelect>
                 
                </CCol>
                <CCol md={4}>
                <CFormFeedback >Selecine a Provincia</CFormFeedback>
                  <CFormSelect value={Input.provinceId} required  label={" "} onChange={(e)=> setInput({...Input, provinceId: e.target.value})}>
                    <option>Selecione a Provincia</option>
                   {data.map((item)=>(
                      <option key={item.id} value={item.id}>{item.name}</option>
                   ))}
                  </CFormSelect>
                  <CFormFeedback invalid>Erro seleciona uma provincia</CFormFeedback>
              
                </CCol>
            </CForm>
            <CCol>
                <CButton color="primary" onClick={handleSubmit} style={{ margin: "10px" }}>
                   {!loading? "Actualizar local Turistico" :    <CSpinner />}
                </CButton>
                <CButton color='danger' onClick={() => {setVisible(false) ; setVisibleEdit(false)}}>
                    Cancelar
                </CButton>
            </CCol>
        

        </>
    )
}
