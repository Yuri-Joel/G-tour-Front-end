import React, { useState, useEffect} from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow, CTable, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell, CTableBody, CButton } from '@coreui/react'
import { cilPen, cilTrash, cilUserPlus } from '@coreui/icons';
import { toast } from 'react-toastify';
import { api } from '../../api/api.pnp';
import CIcon from '@coreui/icons-react';
import { GetTokenCookie } from '../../session';
import { ModalDelete } from '../../components/modal/ModalDelete';
import { ModalHabitos } from '../../components/modal/Habitos/HabitosCadastrar';
import { EditHabitosProvincia } from '../../components/modal/Habitos/HabitosEdit';


  const Habitos = ({provinceId, setVisibleProvince}) => {
 
  const [data, setData] = useState([])
  const [visible, setVisible]  = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [select, setSelect] = useState({})
  const [deleting, setDeletador] = useState({
    id: 0,
    name: ""
  })

  const GetHabitos = async()=>{
    try {  
      const res = await api.get(`/obter-habitat/${provinceId}`, {
        headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
    })
      setData(res.data.data)
    } catch (error) {
      toast.error("Erro na busca de Habitos")
    }
  }

  useEffect(()=>{
    GetHabitos()
  },[])
  
  const toggle = (id, name) => {
    setDeletador({
      id,
      name
    })
    setVisibleDelete(true);
  }
  
  const Delete = async (id) => {
    try {
     const res = await api.delete(`/delete-habitat/${id}`, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie("nada")}`
        }
      });
    toast.info(res.data.message)
     setVisibleDelete(false)
     GetHabitos()
    } catch (error) {
     // toast.error(error.data.message)
     console.log("erro", error)
    }
  }

  return (
    <CRow>
     <ModalDelete visibleDelete={visibleDelete} setVisibleDelete={setVisibleDelete} Delete={Delete} name={deleting.name} id={deleting.id} />
 
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>Habitos da Provincia <CButton  color="secondary"  onClick={()=> setVisibleProvince(true)}>
                   Voltar
                </CButton>
          {<div className="float-end"><CButton onClick={() => { setVisible(!visible); setVisibleEdit(false) }} ><CIcon icon={cilUserPlus} size='xxl' /> </CButton></div>}
          </CCardHeader>
          <CCardBody>
          {visible && !visibleEdit &&  <ModalHabitos visible={visible} setVisible={setVisible} Get={GetHabitos} provinceId={provinceId} /> }
          { visibleEdit &&  <EditHabitosProvincia item={select} setVisibleEdit={setVisibleEdit} visibleEdit={visibleEdit}  Get={GetHabitos} setVisible={setVisible} />}

        {!visible && !visibleEdit && <CTable  align="middle" className="mb-0 border" hover responsive>
              <CTableHead className="text-nowrap">

                <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">descricao</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Tipo de habito</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Provincia</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary" colSpan={2}>acção</CTableHeaderCell>
                </CTableRow>             
                </CTableHead>
                <CTableBody>
                {data.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>{`${index + 1}. ${item.name}`}</CTableDataCell>
                    <CTableDataCell>{item.description}</CTableDataCell>
                    <CTableHeaderCell >{item.type === "ALIMENTACAO"? "Alimentação": "Cultura"}</CTableHeaderCell> 
                    <CTableDataCell>{item.province.name}</CTableDataCell>
                    
                    
                  
                    <CTableDataCell onClick={() => {  setSelect(item); setVisibleEdit(true); setVisible(false)  }}> <CIcon icon={cilPen} className='icon-yellow' /></CTableDataCell>
                    <CTableDataCell>
                      <CIcon icon={cilTrash} className='icon-red' onClick={() => {  setVisibleEdit(false); toggle(item.id, item.name)}} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
          </CTable>}
          </CCardBody>
        </CCard>
      </CCol>
     
    </CRow>
  )
}


export default Habitos