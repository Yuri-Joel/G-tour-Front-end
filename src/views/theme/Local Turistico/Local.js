import React, { useEffect, useState } from 'react'
import { CCard, CCardHeader, CCardBody, CButton, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CCardImage, CCardTitle, CCardText, CCol, CCardFooter } from '@coreui/react'
import { cilCamera, cilPen, cilTrash, cilUserPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { api } from '../../../api/api.pnp';
import { ModalDelete } from '../../../components/modal/ModalDelete';
import { AddPhotos } from '../../../components/modal/Local Turistico/AddPhotos'
import { AddLocal } from '../../../components/modal/Local Turistico/AddLocal'
import { EditLocal } from '../../../components/modal/Local Turistico/EditLocal'
import { Formattime } from '../../../function/Time';
import { toast } from 'react-toastify';
import { GetTokenCookie } from '../../../session';
import { font } from '../../../api/urlPhoto';


const LocalTuristico = () => {

  const [visible, setVisible] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleMedia, setVisibleMedia] = useState(false)
  const [visiblePhoto, setVisiblePhoto] = useState(false)
  const [data, setData] = useState([])
  const [select, setSelect] = useState({})
  const GetLocalTuristico = async () => {
    try {
      const res = await api.get("/obter-local")

      setData(res.data.data)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    GetLocalTuristico()
  }, [])

  const [deleting, setDeletador] = useState({
    id: 0,
    name: ""
  })
  const toggle = (id, name) => {
    setDeletador({
      id,
      name
    })
    setVisibleDelete(true);
  }

  const Delete = async (id) => {
    try {
      await api.delete(`/delete-local/${id}`, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie("nada")}`
        }
      });

      setVisibleDelete(false)
      GetLocalTuristico()
    } catch (error) {
      toast.error(error.data.message)
    }
  }
  const DeleteMedia = async (id, media) => {
    try {
      const res = await api.post("/delete-media", { id, media }, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie("nada")}`
        }
      })

      if (media === 'image') {
        const updatedPhotos = select.Photo_TouristSpot.filter(photo => photo.id !== id);
        setSelect(prevState => ({
          ...prevState,
          Photo_TouristSpot: updatedPhotos,
        }));
      } else if (media === "video") {
        const updatedVideos = select.Video_TouristSpot.filter(video => video.id !== id);
        setSelect(prevState => ({
          ...prevState,
          Video_TouristSpot: updatedVideos,
        }));
      }
      GetLocalTuristico()
      toast.success(res.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.data.message)
    }
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          Locais Turisticos
          {<div className="float-end"><CButton onClick={() => { setVisible(!visible); setVisibleEdit(false); setVisibleMedia(false) }} ><CIcon icon={cilUserPlus} size='xxl' /> </CButton></div>}
        </CCardHeader>

        <ModalDelete visibleDelete={visibleDelete} setVisibleDelete={setVisibleDelete} Delete={Delete} id={deleting.id} name={deleting.name} />

        <CCardBody>
          <p>
            Adicione  mais locais turistico, em nosso sistema
          </p>
          <CRow>
            {visible && !visibleEdit && <AddLocal setVisible={setVisible} Get={GetLocalTuristico} />}
            {!visible &&
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">

                  <CTableRow >
                    <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Provincia</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Endereço</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Sobre</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">latitude</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">longitude</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Tipo de local</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" colSpan={3} style={{ textAlign: "center" }}>Accao</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>{`${index + 1}. ${item.name}`}</CTableDataCell>
                      <CTableDataCell>{item.province.name}</CTableDataCell>
                      <CTableDataCell>{item.address}</CTableDataCell>
                      <CTableDataCell>{item.about}</CTableDataCell>
                      <CTableDataCell>{item.latitude}</CTableDataCell>
                      <CTableDataCell>{item.longitude}</CTableDataCell>
                      <CTableDataCell>{item.localType === "ZONA_TURISTICA" ? "Zona turistica natural" : "Zona turisitica constituida"}</CTableDataCell>

                      <CTableDataCell style={{ cursor: 'pointer' }} >
                        <CButton color='primary' shape="rounded-pill" onClick={() => { setSelect(item); setVisible(true); setVisibleEdit(true); setVisibleMedia(true) }} >
                          <CIcon icon={cilCamera} />
                          Ver Media
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell onClick={() => { setSelect(item); setVisible(true); setVisibleEdit(true) }}> <CIcon icon={cilPen} className='icon-yellow' /></CTableDataCell>
                      <CTableDataCell>
                        <CIcon icon={cilTrash} className='icon-red' onClick={() => { setVisible(false); setVisibleEdit(false); toggle(item.id, item.name) }} />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>}


            {
              visibleEdit && !visibleMedia && <EditLocal item={select} Get={GetLocalTuristico} setVisible={setVisible} setVisibleEdit={setVisibleEdit} />
            }
            {visiblePhoto && <AddPhotos Get={GetLocalTuristico} select={select} setSelect={setSelect} id={select.id} setVisible={setVisiblePhoto} visible={visiblePhoto} />}
          </CRow>
          {visibleMedia &&
            <>
              <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>

                {
                  select.Photo_TouristSpot.lenght === 0 ? null :

                    select.Photo_TouristSpot.map((item, index) => (
                      <CCol xs key={index}>
                        <CCard>
                          <CCardImage orientation="top" src={`${font}/${item.photo}`} style={{ height: "200px" }} />

                          <CCardBody>
                            <CCardTitle>{select.name}</CCardTitle>
                            <CCardText>
                              {select.about}
                            </CCardText>
                            <CButton color="danger" onClick={() => DeleteMedia(item.id, "image")} >
                              <CIcon icon={cilTrash} />Eliminar
                            </CButton>
                          </CCardBody>
                          <CCardFooter>
                            <small className="text-body-secondary">Criado em {Formattime(item.createdAt)}</small>
                          </CCardFooter>
                        </CCard>
                      </CCol>
                    ))
                }
                {select.Video_TouristSpot.lenght === 0 ? null :
                  select.Video_TouristSpot.map((item, index) => (
                    <CCol xs key={index}>
                      <CCard >
                        <video width="640" height="360" controls>

                          <source src={`${font}/${item.Video}`} type="video/mp4" />
                            Teu Navegador não suporta este video.
                        </video>
                       

                        <CCardBody>
                          <CCardTitle>{select.name}</CCardTitle>
                          <CCardText>
                            {select.about}
                          </CCardText>
                          <CButton color="danger" onClick={() => DeleteMedia(item.id, "video")} >
                            <CIcon icon={cilTrash} />Eliminar
                          </CButton>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))


                }

              </CRow>
              <CCol style={{ margin: "1rem" }}>
                <CButton onClick={() => setVisiblePhoto(true)} className='float-start' color='success'>
                  Adicionar Media
                </CButton>
                <CButton onClick={() => { setVisibleMedia(false); setVisible(false); setVisibleEdit(false) }} className='float-end' color='info'>
                  Voltar
                </CButton>
              </CCol>
            </>
          }
        </CCardBody>
      </CCard>

    </>
  )
}

export default LocalTuristico
