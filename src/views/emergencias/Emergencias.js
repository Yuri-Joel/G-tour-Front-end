import React, { useState, useEffect} from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CTable, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell, CTableBody, CButton } from '@coreui/react'
import { cilPen, cilTrash, cilUserPlus } from '@coreui/icons';
import { toast } from 'react-toastify';
import { api } from '../../api/api.pnp';
import CIcon from '@coreui/icons-react';
import { GetTokenCookie } from '../../session';
import { ModalDelete } from '../../components/modal/ModalDelete';
import { ModalEditEmergencias } from '../../components/modal/Emergencia/ModalEditEmergencias';
import { ModalEmergencias } from '../../components/modal/Emergencia/ModalcadastrarEmergencias';

  const Emergencias = () => {
 
  const [data, setData] = useState([])


  const GetEmergencias = async()=>{
    try {
      
      const res = await api.get("/obter-emergencias")
      console.log(res.data.data);
      setData(res.data.data)
    } catch (error) {
      toast.error("Erro na busca de emergencias")
    }
  }

  useEffect(()=>{
    GetEmergencias()
  },[])
  const [visible, setVisible]  = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [select, setSelect] = useState({})
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
     const res = await api.delete(`/remove-emergencias/${id}`, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      });
    toast.info(res.data.message)
     setVisibleDelete(false)
     GetEmergencias()
    } catch (error) {
      toast.error(error.data.message)
    }
  }

  return (
    <CRow>
     <ModalDelete visibleDelete={visibleDelete} setVisibleDelete={setVisibleDelete} Delete={Delete} name={deleting.name} id={deleting.id} />
    <ModalEmergencias visible={visible} setVisible={setVisible} Get={GetEmergencias} /> 
   { visibleEdit &&  <ModalEditEmergencias item={select} setVisibleEdit={setVisibleEdit} visibleEdit={visibleEdit}  Get={GetEmergencias} />}
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>Emergências
          {<div className="float-end"><CButton onClick={() => { setVisible(true); setVisibleEdit(false) }} ><CIcon icon={cilUserPlus} size='xxl' /> </CButton></div>}
          </CCardHeader>
          <CCardBody>
          <CTable  align="middle" className="mb-0 border" hover responsive>
              <CTableHead className="text-nowrap">

                <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Telefone</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Descricao</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Latitude</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Longitude</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Tipo</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary" colSpan={2}>Acção</CTableHeaderCell>
                </CTableRow>             
                </CTableHead>
                <CTableBody>
                {data.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{`${index + 1}. ${item.name}`}</CTableDataCell>
                    <CTableDataCell>{item.telefone}</CTableDataCell>
                    <CTableDataCell>{item.description}</CTableDataCell>
                    <CTableDataCell>{item.latitude}</CTableDataCell>
                    <CTableDataCell>{item.longitude}</CTableDataCell>
                    <CTableDataCell>{item.type}</CTableDataCell>
                    
                  
                    <CTableDataCell onClick={() => {  setSelect(item); setVisibleEdit(true);   }}> <CIcon icon={cilPen} className='icon-yellow' /></CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilTrash} className='icon-red' onClick={() => {  setVisibleEdit(false); toggle(item.id, item.name)}} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
          </CTable>
          </CCardBody>
        </CCard>
      </CCol>
     
    </CRow>
  )
}


export default Emergencias