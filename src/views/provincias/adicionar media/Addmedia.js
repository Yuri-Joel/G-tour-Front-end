import { CButton, CCard, CCardBody, CCardHeader, CCardImage, CCardTitle, CCol, CFormInput, CRow, CSpinner } from "@coreui/react";
import { GetTokenCookie } from "../../../session";
import { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import { toast } from "react-toastify";
import { api } from "../../../api/api.pnp";
import { font } from "../../../api/urlPhoto";



export const AddMediaProvince = ({ id, item, setVisibleSelect, Get }) => {

    const [media, setmedia] = useState(null)
    const [preview, setPreview] = useState(null);
    const [loading, setloading] = useState(false)
    const AddMedia = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("id", id)
        formData.append("media", media)
        setloading(true)
        try {
            if (media) {
                const res = await api.post("/add-media-province", formData, {
                    headers: {
                        Authorization: `Bearer ${GetTokenCookie(" ")}`
                    }
                });

                Get(id)
               // setVisibleSelect(true)
            } else {
                toast.warn("ficheiro não encontrado")
                setloading(false)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setloading(false)
        }
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } if (file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        }
    }

    const deleteMedia = async (mediaPath) => {
        try {
           const res=  await api.post("/delete-media-province", { id, mediaPath }, {
                headers: {
                    Authorization: `Bearer ${GetTokenCookie(" ")}`
                }
            });
           
            toast.success(res.data.message);
            Get(id);
          //  setVisibleSelect(true)
        } catch (error) {
            console.log(error);
            toast.error("Erro ao excluir mídia");
        }
    };
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                    <CCol md={6}>
                        <CFormInput
                            onChange={(e) => { setmedia(e.target.files[0]); handleFileChange(e) }}
                            type="file"
                            id="validationTextarea"
                            aria-label="file example"
                            required
                            accept="image/*,video/*"

                        />

                    </CCol>
                    <CCol >
                        <CButton color="primary" onClick={AddMedia}>{!loading ? "Adicionar" : <CSpinner />}</CButton>

                        <CButton color="secondary" onClick={() => { setPreview(null); setVisibleSelect(true) }} style={{ margin: "10px" }} >
                            Voltar
                        </CButton>
                    </CCol>
                </CCardHeader>
                <CCardBody>
                    <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>

                        {
                            item.photos.map((foto, index) => (
                                <CCol xs key={index}>
                                    <CCard>
                                        <CCardImage orientation="top" src={`${font}/${foto}`} style={{ height: "200px" }} />

                                        <CCardBody>
                                            <CCardTitle> {`imagem ${index+1} da galeria`}</CCardTitle>
                                            <CButton color="danger" onClick={() => deleteMedia(foto)} >
                                                <CIcon icon={cilTrash} />Eliminar
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            ))


                        }

                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}