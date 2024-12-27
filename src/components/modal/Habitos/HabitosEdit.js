
import { CButton, CCol, CForm, CFormFeedback, CFormSelect, CFormTextarea, CSpinner } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { api } from '../../../api/api.pnp'
import { toast } from 'react-toastify'
import { GetTokenCookie } from '../../../session'

export const EditHabitosProvincia = ({ setVisible, Get, item, setVisibleEdit }) => {

    const [Input, setInput] = useState({
        id: item.id,
        name: item.name,
        type: item.type,
        provinceId: item.provinceId,
        description: item.description
    })
    const [validated, setValidated] = useState(false)
    const [loading, setloading] = useState(false)
    const handleSubmit = async (e) => {

        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()

            toast.warn("erro, espaço vazio")
        }
        setValidated(true)
        setloading(true)
        if (Input.name.trim() &&  Input.description.trim() && Input.type.trim()) {
            try {
                await api.post("/edit-habitat", Input, {
                    headers: {
                        Authorization: `Bearer ${GetTokenCookie(" ")}`
                    }
                })
                setVisible(false)
                setVisibleEdit(false)
                Get()
            } catch (error) {
                toast.info(error.response.data.message)
                console.log(error)
            } finally {
                setloading(false)
            }
        } else {
            toast.info("Erro, espaço vazio")
            setloading(false)
        }
    }
    const [data, setData] = useState([])
    const ObterProvince = async () => {
        try {
            const res = await api.get("/obter-province")
            setData(res.data.data)
        } catch (error) {

        }
    }
    useEffect(() => { ObterProvince() }, [])
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
                        label="Nome do habito"
                        required
                    />
                </CCol>

                <CCol md={4}>
                    <CFormTextarea type="text" value={Input.description} onChange={(e) => { setInput({ ...Input, description: e.target.value }) }}
                        name="description" id="validationCustom02" className='dynamic-textarea' label="descrição"
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormFeedback >Selecine o Tipo de Habitos </CFormFeedback>
                    <CFormSelect required value={Input.type} onChange={(e) => setInput({ ...Input, type: e.target.value })}>
                        <option>Selecione o Tipo de Habitos </option>
                        <option value={"CULTURA"}>Cultura</option>
                        <option value={"ALIMENTACAO"}>Alimentação</option>
                    </CFormSelect>

                </CCol>
                <CCol md={4}>
                    <CFormFeedback >Selecine a Provincia</CFormFeedback>
                    <CFormSelect value={Input.provinceId} required onChange={(e) => setInput({ ...Input, provinceId: e.target.value })}>
                        <option>Selecione a Provincia</option>
                        {data.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </CFormSelect>
                    <CFormFeedback invalid>Erro seleciona uma provincia</CFormFeedback>

                </CCol>
            </CForm>
            <CCol>
                <CButton color="primary" onClick={handleSubmit} style={{ margin: "10px" }}>
                    {!loading ? "Actualizar Habitos da Provincia" : <CSpinner />}
                </CButton>
                <CButton color='danger' onClick={() => { setVisibleEdit(false); setVisible }}>
                    Cancelar
                </CButton>
            </CCol>


        </>
    )
}
