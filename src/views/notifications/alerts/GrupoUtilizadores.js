import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CPopover,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { api } from '../../../api/api.pnp'
import CIcon from '@coreui/icons-react'
import { cilBriefcase, cilPen, cilTrash, cilUserPlus } from '@coreui/icons'
import { toast } from 'react-toastify'
import { GetTokenCookie } from '../../../session'
import { ModalDelete } from '../../../components/modal/ModalDelete'
import { AddPerfil } from '../../../components/modal/ModalPerfil/ModalPerfil'
import { AddPermission } from '../../../components/modal/ModalPerfil/ModalPermissoes'
import { EditPerfil } from '../../../components/modal/ModalPerfil/ModalEditPerfil'

const GrupoUtilizadores = () => {
  const [data, setData] = useState([])
  const [visiblePermission, setVisiblePermission] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [defaultPermission, setdefaultPermission] = useState([])
  const [idPerfil, setIdPerfil] = useState(null)
  const[Edit, SetEdit] = useState(null)
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
  const GetProfile = async () => {
    try {
      const res = await api.get("/obter-perfil", {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      })
      console.log(res.data.data)
      setData(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { GetProfile() }, [])

  const StatusProfile = async (id, status) => {
    try {
      await api.post("/status-perfil", { id, status }, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      })
      GetProfile();
      toast.info("Actualização feita com sucesso")
    } catch (error) {
      toast.error("erro na actualização do Estado")
    }
  }

  const Delete = async (id) => {
    try {
      await api.delete(`/delete-perfil/${id}`, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      })
      GetProfile();
      setVisibleDelete(false)
      toast.info("Deletado com sucesso")
    } catch (error) {
      toast.error("erro ao apagar perfil")

    }
  }
 
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Grupo de Utilizadores</strong>
            {<div className="float-end"><CButton onClick={() => { setVisible(true); setVisibleEdit(false) }} ><CIcon icon={cilUserPlus} size='xxl' /> </CButton></div>}
          </CCardHeader>

          <ModalDelete visibleDelete={visibleDelete} setVisibleDelete={setVisibleDelete} Delete={Delete} id={deleting.id} name={deleting.name} />
          {visible && !visibleEdit && <AddPerfil GetPerfil={GetProfile} setVisible={setVisible} visible={visible} />}
          {visiblePermission && <AddPermission Get={GetProfile} setVisiblePermission={setVisiblePermission} visiblePermission={visiblePermission} defaultPermission={defaultPermission} idPerfil={idPerfil} />}
          {visibleEdit && <EditPerfil setVisibleEdit={setVisibleEdit} visibleEdit={visibleEdit} item={Edit} Get={GetProfile}/>}
          <CCardBody>
            <CRow>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Perfil</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Descrição</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Permissões</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" >+ Permissoes</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center" colSpan={2}>
                      Acção
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div> {`${index + 1}. ${item.name}`}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.description}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CPopover
                          content={item.permissions.map((value, index) => <div key={index}>{value.permissoes.name}</div>)}
                          placement="top"
                        >
                          <CButton color="secondary">Permissões</CButton>
                        </CPopover>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton onClick={() => StatusProfile(item.id, !item.status)} color={item.status ? "danger" : "success"}>{item.status ? "Desactivar" : "Activar"}</CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-center" onClick={() => { setVisiblePermission(true); setdefaultPermission(item.permissions.map((value) => value.permissoes.id)); setIdPerfil(item.id) }}>
                        <CIcon icon={cilBriefcase} size='lg' style={{ cursor: 'pointer', marginRight: '30px' }}
                          className="icon-yellow" onClick={() => { /* setVisibleEdit(!visibleEdit); setVisible(false); setInput({ id: item.id, name: item.name, description: item.description })  */ }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon icon={cilPen} size='lg' style={{ cursor: 'pointer', marginRight: '30px' }}
                          className="icon-yellow" onClick={() => {  setVisibleEdit(true); setVisible(false); SetEdit({ id: item.id, name: item.name, description: item.description })  }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon className="icon-red" icon={cilTrash} size='lg' style={{ cursor: 'pointer', }}
                          onClick={() => { setVisible(false); setVisibleEdit(false); toggle(item.id, item.name) }} />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default GrupoUtilizadores
