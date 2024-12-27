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
  CTableHeaderCell,
  CFormInput
} from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { GetTokenCookie } from '../../session';
import { api } from '../../api/api.pnp';

export const UserPermission = ({ setVisiblePermission, visiblePermission, BlockPermission, idUsuario, setBlockPermission }) => {
  const [permissions, setPermissions] = useState([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [blockDuration, setBlockDuration] = useState(1); // Default block duration is 1 hour
  const [currentPermissionId, setCurrentPermissionId] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissionRes = await api.get(`/obter-permissao-app/${idUsuario.type}`, {
          headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
          }
        });

        setPermissions(permissionRes.data.data);

        // Fetch blocked permissions
        const blockedPermissions = BlockPermission.map(p => p.permissionId);
        setSelectedPermissions(new Set(blockedPermissions));
      } catch (error) {
        toast.error("Erro ao obter permissões ou detalhes do usuário");
      }
    };

    fetchPermissions();
  }, [BlockPermission, idUsuario]);

  const handleCheckboxChange = async (permissionId) => {
    const isSelected = selectedPermissions.has(permissionId);
    if (isSelected) {
      // Unblock permission
      try {
        await api.post('/desblock-user', {
          UserId: idUsuario.id,
          permissionId: permissionId
        }, {
          headers: {
            Authorization: `Bearer ${GetTokenCookie(" ")}`
          }
        });
        toast.success('Permissão desbloqueada com sucesso');

        setSelectedPermissions(prev => {
          const newSet = new Set(prev);
          newSet.delete(permissionId);
          return newSet;
        });
        setBlockPermission(selectedPermissions)

        console.log(BlockPermission);

      } catch (error) {
        toast.error('Erro ao atualizar permissão');
      }
    } else {
      // Show time modal for block duration
      setCurrentPermissionId(permissionId);
      setShowTimeModal(true);
    }
  };

  const handleBlockPermission = async () => {
    try {
      await api.post('/block-user', {
        UserId: idUsuario.id,
        permissionId: currentPermissionId,
        duration: blockDuration, // Sending the duration to the backend
      }, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      });
      toast.success('Permissão bloqueada com sucesso');

      setSelectedPermissions(prev => {
        const newSet = new Set(prev);
        newSet.add(currentPermissionId);
        return newSet;
      });
      setShowTimeModal(false);
    } catch (error) {
      toast.error('Erro ao atualizar permissão');
    }
  };

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
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Permissão</CTableHeaderCell>
                  <CTableHeaderCell>Descrição</CTableHeaderCell>
                  <CTableHeaderCell style={{ justifyContent: "center" }}>Selecionar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {permissions.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      <CFormLabel htmlFor={`valor${index}`}>{item.name}</CFormLabel>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormLabel htmlFor={`valor${index}`}>{item.description}</CFormLabel>
                    </CTableDataCell>
                    <CTableDataCell>
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
            <CButton color="primary" style={{ margin: "10px" }} onClick={() => setVisiblePermission(false)}>
              Salvar
            </CButton>
            <CButton color='danger' onClick={() => setVisiblePermission(false)}>
              Cancelar
            </CButton>
          </CCol>
        </CModalFooter>
      </CModal>

      <CModal backdrop="static" alignment='center'
              visible={showTimeModal}
              onClose={() => setShowTimeModal(false)}
              aria-labelledby="BlockDurationModal">
        <CModalHeader>
          <CModalTitle id="BlockDurationModal">Definir Duração do Bloqueio</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel htmlFor="blockDurationInput">Duração em horas</CFormLabel>
          <CFormInput
            type="number"
            id="blockDurationInput"
            value={blockDuration}
            onChange={(e) => setBlockDuration(e.target.value)}
            min={1}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleBlockPermission}>Confirmar</CButton>
          <CButton color='danger' onClick={() => setShowTimeModal(false)}>Cancelar</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};
