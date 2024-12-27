import { useEffect, useState } from "react"
import { api } from "../../../api/api.pnp"
import { CButton, CForm, CSpinner, CCol, CFormTextarea, CFormInput, CWidgetStatsF, CCardImage, CLink, CCard, CCardBody, CRow } from "@coreui/react"
import { GetTokenCookie } from "../../../session"
import { toast } from "react-toastify"
import { font } from "../../../api/urlPhoto"
import {cilTrash } from "@coreui/icons"
import CIcon from "@coreui/icons-react"



export const PublicarProvincia = ({ item, setVisible, Get }) => {

    const [Input, setInput] = useState({
        authorId: 24,
        descricao: "",
        media: null,
    })
    const [validated, setValidated] = useState(false)
    const [loading, setloading] = useState(false)
    const CriarPost = async (e) => {
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        }
        setValidated(true)
        setloading(true)
        const formData = new FormData();
        formData.append("authorId", Input.authorId)
        formData.append("descricao", Input.descricao)
        formData.append("media", Input.media)
        formData.append("provinceId", item.id)

        try {
            await api.post("/criar-post", formData, {
                headers: {
                    Authorization: `Bearer ${GetTokenCookie(" ")}`
                }
            })
            setVisible(true)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setloading(false)
        }
    }

    const [postProvince, setPostProvince] = useState([])
    const [VisiblePost, setVisiblePost] = useState(false)

    const ObterPostProvince = async () => {
        try {
            const res = await api.get(`/get-post-provinceId/${item.id}`)
            console.log(res.data.data);
            setPostProvince(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const DeletePost =async (id)=>{
        try {
          await api.post("/delete-post", {postId: id, userId: 24, IsAdmin:true})

          toast.info("Publicação deletada")
          ObterPostProvince()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { ObterPostProvince() }, [])
    return (
        <>
            <CCol> <CButton color="primary" onClick={() => setVisiblePost(!VisiblePost)}> {VisiblePost? "Voltar": "Ver Posts"} </CButton></CCol>

            <CCard className="mb-4">
            <CCardBody>
             <CRow xs={{ gutter: 4 }}>
            {!VisiblePost && <>
                <CForm className="row g-3 needs-validation" noValidate validated={validated} >
                    <CCol md={6}>
                        <CFormTextarea
                            type="text"
                            value={Input.descricao}
                            onChange={(e) => { setInput({ ...Input, descricao: e.target.value }) }}
                            name="name"
                            className='dynamic-textarea'
                            id="validationCustom01"
                            label={`Publique na Provincia ${item.name}`}

                            required
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            onChange={(e) => { setInput({ ...Input, media: e.target.files[0] }); }}
                            type="file"
                            id="validationTextarea"
                            aria-label="file example"
                            required
                            accept="image/*"

                        />

                    </CCol>
                </CForm>

                <CCol>
                    <CButton color="primary" onClick={CriarPost} style={{ margin: "10px" }}>
                        {!loading ? "Criar Publicação" : <CSpinner />}
                    </CButton>
                    <CButton color="secondary" onClick={() => setVisible(true)}>
                        Voltar
                    </CButton>
                </CCol>
            </>}
            {VisiblePost &&
                postProvince.map((item, index) => (
                    <CCol  key={index} >
                        <CWidgetStatsF
                            /*  onClick={()=> {setescolha({name:item.name, id: item.id, photo: item.photo}); ObterProvinceId(item.id); setVisible(false)}} */
                            icon={
                                item.photos.map((value, index) => (
                                    <CCardImage key={index} src={`${font}/${value}`} style={{ height: "5rem" }} />
                                ))
                            }
                            title={item.descricao}
                            value={item.author.name}

                            footer={
                                <CLink
                                    className="font-weight-bold font-xs text-body-secondary"
                                    rel="noopener norefferer">
                                    Ver mais
                                    <CIcon  style={{cursor: "pointer"}} onClick={()=> DeletePost(item.id)} icon={cilTrash} className="float-end" width={16} />
                                </CLink>
                            }
                        />
                    </CCol>
                ))}


            </CRow>
                </CCardBody>
                </CCard>
        </>
    )
}
