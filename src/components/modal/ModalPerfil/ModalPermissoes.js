import { 
  CButton, 
  CCardBody, 
  CCol, 
  CFormLabel, 
  CFormCheck, 
  CModal, 
  CModalBody, 
  CModalFooter, 
  CModalHeader, 
  CModalTitle,
   CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell 
} from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { api } from '../../../api/api.pnp';
import { toast } from 'react-toastify';
import { GetTokenCookie } from '../../../session';

export const AddPermission = ({ Get, setVisiblePermission, visiblePermission, defaultPermission, idPerfil }) => {
  
  console.log(defaultPermission.map(p=> p))
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set(defaultPermission.map(p => p)));

  useEffect(() => {
    const GetPermission = async () => {
      try {
        const res = await api.get("/obter-permissao", {
          headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
          }
        });
        setPermissions(res.data.data);
      } catch (error) {
        toast.error("Erro ao obter permissões");
      }
    };

    GetPermission();
  }, []);

  const handleCheckboxChange = async (permissionId) => {
    const isSelected = selectedPermissions.has(permissionId);
    try {
      if (isSelected) {
        // Remover permissão
        await api.post('/perfil-remove-permissao', {
          profileId: idPerfil,
          permissionId: permissionId
        }, {
          headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
          }
        });
        toast.success('Permissão removida com sucesso');
        Get()
        setSelectedPermissions(prev => {
          const newSet = new Set(prev);
          newSet.delete(permissionId);
          return newSet;
        });
      } else {
        // Adicionar permissão
        await api.post('/adicionar-permissao', {
          profileId: idPerfil,
          permissionId: permissionId
        }, {
          headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
          }
        });
        toast.success('Permissão adicionada com sucesso');
        Get()
        setSelectedPermissions(prev => {
          const newSet = new Set(prev);
          newSet.add(permissionId);
          return newSet;
        });
      }
    } catch (error) {
      toast.error('Erro ao atualizar permissão');
    }
  };
/* 
  const handleSubmit = async () => {
    try {
      await api.post('/atualizar-permissoes', {
        perfilId: idPerfil,
        permissoes: Array.from(selectedPermissions)
      }, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      });
      toast.success("Permissões atualizadas com sucesso");
      Get(); // Atualizar a lista de permissões do perfil
      setVisiblePermission(false);
    } catch (error) {
      toast.error("Erro ao atualizar permissões");
    }
  }; */

  return (
    <>
    <CModal backdrop="static" alignment='center'
            visible={visiblePermission}
            onClose={() => setVisiblePermission(false)}
            aria-labelledby="ToggleBetweenModalsExample1">
      <CModalHeader>
        <CModalTitle id="ToggleBetweenModalsExample1">Permissões</CModalTitle>
      </CModalHeader>
      <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <CCardBody>
          <CTable  hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Permissão</CTableHeaderCell>
                <CTableHeaderCell style={{justifyContent: "center"}}>Selecionar</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {permissions.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <CFormLabel htmlFor={`valor${index}`}>{item.name}</CFormLabel>
                  </CTableDataCell>
                  <CTableDataCell >
                    <CFormCheck 
                      id={`valor${index}`} 
                      checked={selectedPermissions.has(item.id)}
                      onChange={() => handleCheckboxChange(item.id)} 
                      style={{ transform: 'scale(1.5)' }} 
                    />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CModalBody>
      <CModalFooter>
        <CCol>
          <CButton color="primary" style={{ margin: "10px" }} onClick={()=> setVisiblePermission(false)}>
            Salvar
          </CButton>
          <CButton color='danger' onClick={() => setVisiblePermission(false)}>
            Cancelar
          </CButton>
        </CCol>
      </CModalFooter>
    </CModal>
  </>
  );
};
