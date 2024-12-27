import { cilTrash, cilPen, cilBriefcase } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormText
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { encryptID } from "./cripto"; //não faz mal
import { api } from '../../api/api.pnp'
import { toast } from 'react-toastify';
import { font } from '../../api/urlPhoto'
import { useNavigate } from 'react-router-dom'; // Atualiza a importação
import { UserPermission } from '../users/ModalPermissao';

const Denuncias = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visiblePermission, setVisiblePermission] = useState(false)
  const [BlockPermission, setBlockPermission] = useState([])
  const GetDenuncia = async () => {
    try {
      const res = await api.get("/obter-denunciados");
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar as denúncias");
    }
  }

  useEffect(() => {
    GetDenuncia();
  }, []);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };
  const handleControlStatus = async (status) => {
    if (selectedItem) {
      try {
        // Supondo que você tenha um endpoint para controlar o status
        const res = await api.post(`/status-user`, { userId: selectedItem.denunciadoUserId, status });
        toast.success(`Status atualizado para ${status}`);
        setSelectedItem({
          ...selectedItem,
          denunciadoUser: {
            ...selectedItem.denunciadoUser,
            status
          }
        });

        // handleCloseModal(); // Fecha o modal após a operação
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar status");
      }
    }
  };

  const handleViewProfile = () => {
    if (selectedItem) {
      // Criptografa o ID do usuário denunciado antes de redirecionar
      const encryptedId = encryptID(selectedItem.id); //coloca o teu ip e mete em um link para abrir outra janela
      const url = `http://192.168.1.35:3000/perfil/${encryptedId}`; // Substitua 'teu-ip' pelo seu IP ou URL desejado
      window.open(url, '_blank');
    }
  };

  const renderItemDetails = () => {
    if (!selectedItem) return null;



    const NotitificationAlert = async() => {
      try {
        const res = await api.post()

      } catch (error) {
        console.log(error);

      }
    }
    return (
      <div>
        <p><strong>Nome do Denunciado:</strong> {selectedItem ? selectedItem.name : 'Não disponível'}</p>
        <p><strong>Status:</strong> {selectedItem.denuncias[0].statusDenuncia}</p>
        <p><strong>Denunciantes:</strong> {selectedItem.denuncias.map((item) => item.name).join(', ')}</p>
        <p><strong>Post Denunciado ID:</strong></p>
        <p><strong>Foto do Denunciado:</strong></p>
        {selectedItem?.photo ? (
          <img src={`${font}/${selectedItem.photo}`} alt={selectedItem.name} style={{ width: '100px', height: '100px' }} />
        ) : (
          <p>Foto não disponível</p>
        )}
        <p><strong>Quantas vezes foi denunciado:</strong> {selectedItem?.warningsCount ?? 0}</p>
        <CButton color="secondary" onClick={()=> NotitificationAlert(selectedItem.id)}>
          Aviso de notificação
        </CButton>
      </div>
    );
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Denúncias</strong>
            </CCardHeader>
            <CCardBody>
              {data?.usuarios?.length === 0 ? <div>Sem denúncias</div> :
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Denúncia</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary" style={{ textAlign: "center" }}>Ação</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {data?.usuarios?.map((item, index) => (
                      <CTableRow key={index} onClick={() => handleOpenModal(item)} style={{ cursor: 'pointer' }}>
                        <CTableDataCell>{item.name ?? 'Não disponível'}</CTableDataCell>
                        <CTableDataCell>{item.denuncias.map(item => item.type).join(', ')}</CTableDataCell>
                        <CTableDataCell style={{ textAlign: 'center' }}>
                          <CIcon icon={cilBriefcase} className='icon-yellow' />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {visiblePermission && <UserPermission setVisiblePermission={setVisiblePermission} visiblePermission={visiblePermission} BlockPermission={BlockPermission} idUsuario={selectedItem} setBlockPermission={selectedItem} />}
      {/* Modal de Detalhes */}
      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader>
          <CModalTitle>Detalhes da Denúncia</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {renderItemDetails()}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Fechar
          </CButton>

          <CButton color="danger" onClick={() => { setVisiblePermission(true); setBlockPermission(selectedItem?.Block_User_app) }}>
            Bloquear Permissões
          </CButton>
          <CButton color="primary" onClick={() => handleControlStatus(selectedItem?.status === "ativo" ? "inativo" : "ativo")}>
            {selectedItem?.status === "ativo" ? "Desativar" : "Activar"}
          </CButton>
          <CButton color="info" onClick={handleViewProfile}>
            Ver Perfil
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Denuncias;
