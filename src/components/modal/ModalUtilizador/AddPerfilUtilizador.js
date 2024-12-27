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

  export const AddPerfilUtilizador = ({ Get, setVisiblePerfil, visiblePerfil, defaultPerfil, idUsuario }) => {

    console.log(defaultPerfil, idUsuario)
    const [perfil, setPerfil] = useState([]);
    const [selectedPerfil, setSelectedPerfil] = useState(new Set(defaultPerfil.map(p => p)));

    useEffect(() => {
      const GetPerfil = async () => {
        try {
          const res = await api.get("/obter-perfil", {
            headers: {
              Authorization: `Bearer ${GetTokenCookie(" ")}`
            }
          });
          setPerfil(res.data.data);
        } catch (error) {
          toast.error("Erro ao obter permissões");
        }
      };

      GetPerfil();
    }, []);

    const handleCheckboxChange = async (perfilId) => {
      const isSelected = selectedPerfil.has(perfilId);
      try {
        if (isSelected) {
          // Remover permissão
          await api.post('/user-remove-perfil', {
           userId: idUsuario,
            perfilId: perfilId
          }, {
            headers: {
              Authorization: `Bearer ${GetTokenCookie(" ")}`
            }
          });
          toast.success('Perfil removido com sucesso');
          Get()
          setSelectedPerfil(prev => {
            const newSet = new Set(prev);
            newSet.delete(perfilId);
            return newSet;
          });
        } else {
          // Adicionar permissão
          await api.post('/user-add-perfil', {
            userId: idUsuario,
            perfilId: perfilId
          }, {
            headers: {
              Authorization: `Bearer ${GetTokenCookie(" ")}`
            }
          });
          toast.success('Perfil adicionado com sucesso');
          Get()
          setSelectedPerfil(prev => {
            const newSet = new Set(prev);
            newSet.add(perfilId);
            return newSet;
          });
        }
      } catch (error) {
        toast.error('Erro ao atualizar permissão');
      }
    };

    return (
      <>
      <CModal backdrop="static" alignment='center'
              visible={visiblePerfil}
              onClose={() => setVisiblePerfil(false)}
              aria-labelledby="ToggleBetweenModalsExample1">
        <CModalHeader>
          <CModalTitle id="ToggleBetweenModalsExample1">Permissões</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <CCardBody>
            <CTable  hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Perfil</CTableHeaderCell>
                  <CTableHeaderCell style={{justifyContent: "center"}}>Selecionar</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {perfil.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      <CFormLabel htmlFor={`valor${index}`}>{item.name}</CFormLabel>
                    </CTableDataCell>
                    <CTableDataCell >
                      <CFormCheck
                        id={`valor${index}`}
                        checked={selectedPerfil.has(item.id)}
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
            <CButton color="primary" style={{ margin: "10px" }} onClick={()=> setVisiblePerfil(false)}>
              Salvar
            </CButton>
            <CButton color='danger' onClick={() => setVisiblePerfil(false)}>
              Cancelar
            </CButton>
          </CCol>
        </CModalFooter>
      </CModal>
    </>
    );
  };
