import { CButton, CFormFeedback, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSpinner } from '@coreui/react'
import React, { useState } from 'react'
import { api } from '../../../api/api.pnp'
import { toast } from 'react-toastify'
import { GetTokenCookie } from '../../../session'

export const AddPhotos = ({ id, setVisible, visible, setSelect }) => {


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
        const res = await api.post("/add-media", formData, {
          headers: {
            Authorization: `Bearer ${GetTokenCookie("nada")}`
          }
        });
        console.log(res.data.data.Photo_TouristSpot[res.data.data.Photo_TouristSpot.length - 1].photo);
        if (media.type.startsWith('image/')) {
          setSelect((prevSelect) => ({
            ...prevSelect,
            Photo_TouristSpot: [...prevSelect.Photo_TouristSpot, res.data.data.Photo_TouristSpot[res.data.data.Photo_TouristSpot.length - 1]],
          }));
        } if (media.type.startsWith('video/')) {
          setSelect((prevSelect) => ({
            ...prevSelect,
            Video_TouristSpot: [...prevSelect.Video_TouristSpot, res.data.data.Video_TouristSpot[res.data.data.Video_TouristSpot.length - 1]],
          }));
        }
        setVisible(false)
      } else {
        toast.warn("ficheiro não encontrado")
      }
    } catch (error) {
      toast.error(error.data.message)
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

  return (
    <>
      <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Adicionar Imagens</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormInput
              onChange={(e) => { setmedia(e.target.files[0]); handleFileChange(e) }}
              type="file"
              id="validationTextarea"
              aria-label="file example"
              required
              accept="image/*,video/*"

            />
            <CFormFeedback invalid>Invalido ficheiro </CFormFeedback>
          </div>
          {preview && (
            <div>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setVisible(false); setPreview(null) }}>
            Close
          </CButton>
          <CButton color="primary" onClick={AddMedia}>{!loading ? "Adicionar" : <CSpinner />}</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
