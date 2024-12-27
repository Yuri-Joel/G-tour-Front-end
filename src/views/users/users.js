import { cilTrash, cilPen, cilBriefcase } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormInput,
    CFormLabel,
    CFormFloating,
    CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton
} from '@coreui/react'
import { useState } from 'react'
import { api } from '../../api/api.pnp'
import { toast } from 'react-toastify';
import { UserPermission } from './ModalPermissao'

const Users = () => {
    const [visiblePermission, setVisiblePermission] = useState(false)
    const [BlockPermission, setBlockPermission] = useState([])
    const [idUsuario, setIdUsuario] = useState(null)
    const [data, setData] = useState([])
    const [status, setstatus] = useState(false)
    const [query, setquery] = useState("")
    const SearchUser = async () => {
        if(query.trim()){
        try {
            const res = await api.post("/search-user", { query })
            console.log(res.data.data)
            setData(res.data.data)
            setstatus(true)
        } catch (error) {
            console.log(error)
        }} else {
            toast.info("espaço vazio")
        }
    }
    const Dispach = (e) => {
        if (e.key === "Enter") {
            SearchUser()
        }
    }

    const Block_User = async (userId, status) => {
        try {
            const res = await api.post("/status-user",{ userId, status: status === "ativo"? "inativo": "ativo"})
            setData((prev)=> prev.map((user)=> user.id === userId ? {...user,status: res.data.data.status} : user ))
            toast.info(res.data.message)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <> <CRow>

            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Pesquise usuarios</strong>

                        <CFormFloating className="mb-3">
                            <CFormInput id="floatingInput" value={query} onChange={(e) => setquery(e.target.value)} placeholder="name@example.com" onKeyDown={(e) => Dispach(e)} />
                            <CFormLabel htmlFor="floatingInput">Nome ou Email </CFormLabel>
                        </CFormFloating>
                    </CCardHeader>
                    <CCardBody>
                   {visiblePermission && <UserPermission  setVisiblePermission={setVisiblePermission} visiblePermission={visiblePermission} BlockPermission={BlockPermission} idUsuario={idUsuario} setBlockPermission={setBlockPermission} />}
                        {status ?
                        data.length === 0 ? <div>Usuario não Encontrado</div>:
                      <CTable align="middle" className="mb-0 border" hover responsive>
                            <CTableHead className="text-nowrap">
                                <CTableRow >
                                    <CTableHeaderCell className="bg-body-tertiary">Nome</CTableHeaderCell>
                                    <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                                    <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                                    <CTableHeaderCell className="bg-body-tertiary">Permissao do usuario</CTableHeaderCell>
                                    <CTableHeaderCell className="bg-body-tertiary" colSpan={2} style={{ textAlign: "center" }}>Accao</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {data.map((item, index) => (
                                    <CTableRow v-for="item in tableItems" key={index}>
                                        <CTableDataCell>{`${index + 1}. ${item.name}`}</CTableDataCell>
                                        <CTableDataCell>{item.email}</CTableDataCell>
                                        <CTableDataCell style={{ cursor: 'pointer' }} >
                                            <CButton color='primary' shape="rounded-pill" onClick={()=> Block_User(item.id,item.status)} >
                                                {item.status === "ativo" ? "Desativar": "Activar"}
                                            </CButton>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center" onClick={() => { setVisiblePermission(true); setBlockPermission(item.Block_User_app); setIdUsuario(item) }}>
                                        <CIcon icon={cilBriefcase} size='lg' style={{ cursor: 'pointer', marginRight: '30px' }}
                                          className="icon-yellow"
                                        />
                                      </CTableDataCell>
                                        <CTableDataCell /* onClick={() => { setSelect(item); setVisible(true); setVisibleEdit(true) }} */> <CIcon icon={cilPen} className='icon-yellow' disabled /></CTableDataCell>
                                        <CTableDataCell >
                                            <CIcon icon={cilTrash} className='icon-red' disabled /* onClick={() => { setVisible(false); setVisibleEdit(false); toggle(item.id, item.name) }} */ />
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable> : null}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        </>
    )

}

export default Users
