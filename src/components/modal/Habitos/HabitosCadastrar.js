import { CButton, CCol, CForm, CFormTextarea, CSpinner, CFormFeedback, CFormSelect, CFormInput, CModal } from "@coreui/react"
import { api } from "../../../api/api.pnp"
import { useEffect, useState } from "react"
import { GetTokenCookie } from "../../../session"
import { toast } from "react-toastify"



export const ModalHabitos = ({ setVisible, visible, Get, provinceId }) => {

  const [Input, setInput] = useState({
    name: "",
    provinceId: provinceId,
    description: "",
    type: "",
    media: null
  })
  const [preview, setPreview] = useState(null);
  const [validated, setValidated] = useState(false)
  const [loading, setloading] = useState(false)
  const CriarHabitos = async (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()

      toast.warn("erro, espaço vazio")
    }
    setValidated(true)
    setloading(true)
    if (Input.name.trim() && Input.description.trim() && Input.type.trim()) {
      try {
        const formData = new FormData();
        formData.append("name", Input.name)
        formData.append("provinceId", Input.provinceId)
        formData.append("description", Input.description)
        formData.append("type", Input.type)
        formData.append("media", Input.media)
        await api.post(`/criar-habitat/`, formData, {
          headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
          }
        })
        setInput({ name: "", provinceId: "", description: "", type: " ", media: null })
        setVisible(false)
        Get()
      } catch (error) {
        console.log(error)
        toast.info(error.response.data.message)
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

  return (
    <>
      <CForm className="row g-3 needs-validation" noValidate validated={validated} >
        <CCol md={6}>
          <CFormTextarea
            type="text"
            value={Input.name}
            onChange={(e) => { setInput({ ...Input, name: e.target.value }) }}
            name="name"
            className='dynamic-textarea'
            id="validationCustom01"
            label="Nome do Habito"
            required
          />
        </CCol>
        <CCol md={6}>
          <CFormTextarea
            type="text"
            value={Input.description ? Input.description : ""}
            onChange={(e) => { setInput({ ...Input, description: e.target.value }) }}
            name="description"
            id="validationCustom02"

            className='dynamic-textarea'
            label="Descrição"
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
          <CFormSelect required value={provinceId} disabled onChange={(e) => setInput({ ...Input, provinceId: provinceId })}>
            <option value=" ">Selecione a Provincia</option>
            {data.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </CFormSelect>
        </CCol>
        <div className="mb-3">
          <CFormInput
            onChange={(e) => { setInput({ ...Input, media: e.target.files[0] }); handleFileChange(e) }}
            type="file"
            id="validationTextarea"
            aria-label="file example"
            accept="image/*,video/*"

          />
          <CFormFeedback invalid>Invalido ficheiro </CFormFeedback>
        </div>
        {/*  {preview && (
            <CModal visible={preview ? true: false}>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </CModal>
          )} */}
      </CForm>



      <CCol>
        <CButton color="primary" onClick={CriarHabitos} style={{ margin: "10px" }}>
          {!loading ? "Criar Novos Habitos" : <CSpinner />}
        </CButton>
        <CButton color='danger' onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
      </CCol>


    </>
  )
}

