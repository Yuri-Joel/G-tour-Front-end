import { useState } from "react"
import { api } from "../../../api/api.pnp"
import { CButton, CForm, CSpinner,CCol ,CFormTextarea, CFormInput} from "@coreui/react"
import { GetTokenCookie } from "../../../session"



export const EditarProvincia = ({ item, setVisible, Get }) => {

    const [Input, setInput] = useState({
        id: item.id,
        name: item.name,
        capital: item.capital,
        about: item.about,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
        media: null,
    })
  
    const [validated, setValidated] = useState(false)
    const [loading, setloading] = useState(false)
    const Update = async (e) => {
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        }
        setValidated(true)
        setloading(true)
        const formData = new FormData();
        formData.append("id", item.id)
        formData.append("name", Input.name)
        formData.append("capital", Input.capital)
        formData.append("media", Input.media)
        formData.append("latitude", Input.latitude)
        formData.append("longitude", Input.longitude)
        formData.append("address", Input.address)
        formData.append("about", Input.about)
        try {
             await api.post("/edit-province", formData, {
                headers: {
                    Authorization: `Bearer ${GetTokenCookie(" ")}`
                }
            })

        Get(item.id)
            setVisible(true)           
        } catch (error) {
            console.log(error)
        }
    }
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
                        label="Nome da Provincia"
                        disabled
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormTextarea
                        type="text"
                        value={Input.capital}
                        onChange={(e) => { setInput({ ...Input, capital: e.target.value }) }}
                        name="name"
                        className='dynamic-textarea'
                        id="validationCustom01"
                        label="Nome da Capital"
                        disabled
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormTextarea
                        type="text"
                        value={Input.about}
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
                    <CFormTextarea type="text" value={Input.longitude} onChange={(e) => { setInput({ ...Input, longitude: e.target.value }) }}
                        name="longitude" id="validationCustom02" className='dynamic-textarea' label="Longitude"
                        required
                    />
                </CCol>
                <CCol md={4}>
                    <CFormTextarea
                        type="text"
                        value={Input.address}
                        onChange={(e) => { setInput({ ...Input, address: e.target.value }) }} name="address" id="validationCustom02" className='dynamic-textarea' label="Endereço"
                        required
                    />
                </CCol>
                <CCol md={6}>
                        <CFormInput
                            onChange={(e) => { setInput({...Input, media: e.target.files[0]}); }}
                            type="file"
                            id="validationTextarea"
                            aria-label="file example"
                            required
                            accept="image/*"

                        />

                    </CCol>
            </CForm>

            <CCol>
                <CButton color="primary" onClick={Update} style={{ margin: "10px" }}>
                   {!loading? "Actualizar Provincia" :    <CSpinner />}
                </CButton>
                <CButton  color="secondary"  onClick={()=> setVisible(true)}>
                   Voltar
                </CButton>
            </CCol>
        </>
    )
}