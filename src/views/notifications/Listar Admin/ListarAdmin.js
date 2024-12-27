import React, { useEffect, useState } from 'react';
import { api } from '../../../api/api.pnp';
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
import CIcon from '@coreui/icons-react';
import { cilBriefcase, cilPen, cilTrash, cilUserPlus} from '@coreui/icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ModalDelete } from '../../../components/modal/ModalDelete';
import { AddPerfilUtilizador } from '../../../components/modal/ModalUtilizador/AddPerfilUtilizador';
import { GetTokenCookie } from '../../../session';

const AdministratorsList = () => {
  const navi= useNavigate()
  const [data, setdata] = useState([]);
  const [visiblePermission, setVisiblePermission] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [defaultPefil, setdefaultPefil] = useState([])
  const [idUsuario, setIdUsuario] = useState(null)
  const [visiblePerfil, setVisiblePerfil] = useState(false)

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
  const [loading, setLoading] = useState(true);
  const fetchAdministrators = async () => {
    try {
      const res = await api.get('/listar-admin', {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      });
      console.log(res.data.data);
      setdata(res.data.data);
  
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdministrators();
  }, []);
  const StatusUsuario = async(id, status) => {
    // Lógica para desativar o usuário
   try{
    const res = await api.post("/status-user-admin", {userId: id, active: status}, {
      headers: {
        Authorization: `Bearer ${GetTokenCookie(" ")}`
      }
    })

    toast.success(res.data.message)
    fetchAdministrators();
   }catch(error){
    toast.error("erro ao actualizar Estado")
   }
  };

  const handleEdit = (id) => {
    // Lógica para editar o usuário
    console.log(`Editar usuário com id: ${id}`);
  };

  const Delete =async (id) => {
    try{
const res = await api.delete(`/delete-user-admin/${id}`,{
  headers: {
    Authorization: `Bearer ${GetTokenCookie(" ")}`
  }
} )
setVisibleDelete(false)
fetchAdministrators();
toast.info(res.data.message)
    }catch(error){
      toast.error("Erro ao eliminar Utilizador")
    }
  };
   
  return (
   <>
   <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Grupo de Utilizadores</strong>
            {<div className="float-end"><CButton onClick={() => { navi("/Controle/cadastrar") }} ><CIcon icon={cilUserPlus} size='xxl' /> </CButton></div>}
          </CCardHeader>
          <ModalDelete visibleDelete={visibleDelete} setVisibleDelete={setVisibleDelete} Delete={Delete} id={deleting.id} name={deleting.name} />
        {visiblePerfil &&  <AddPerfilUtilizador Get={fetchAdministrators} setVisiblePerfil={setVisiblePerfil} visiblePerfil={visiblePerfil} defaultPerfil={defaultPefil} idUsuario={idUsuario} />}
          <CCardBody>
            <CRow>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Telefone</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Perfil</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" >+ Perfil</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center" colSpan={2}>
                      Acção
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      {item.isSuperAdmin ? null:     
                      <>
                      <CTableDataCell>
                        <div> {`${index + 1}. ${item.name}`}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.email}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.telefone}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        
                        <CPopover
                          content={item.profileTypes.map((value, index) => <div key={index}>{value.type.name}</div>)}
                          placement="top"
                        >
                          <CButton color="secondary">Perfil</CButton>
                        </CPopover>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton onClick={() => StatusUsuario(item.id, !item.active)} color={item.active ? "danger" : "success"}>{item.active ? "Desactivar" : "Activar"}</CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-center" onClick={() => {setVisiblePerfil(true); setdefaultPefil(item.profileTypes.map((value) => value.perfilId)); setIdUsuario(item.id) }}>
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
                      </>
                      }
                   
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
   </>
  );
};

export default AdministratorsList;
