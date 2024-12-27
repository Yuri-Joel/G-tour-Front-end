import React, { useEffect, useState } from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CForm, CFormTextarea } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash, cilUserPlus } from '@coreui/icons'
import { api } from '../../../api/api.pnp'
import { AddBusiness } from '../../../components/modal/business/AddBusiness'
import { ModalDelete } from '../../../components/modal/ModalDelete'
import { toast } from 'react-toastify'
import { GetTokenCookie } from '../../../session'

const Business = () => {

  const [visible, setVisible] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [data, setData] = useState([])
  const GetBusinessArea = async () => {

    try {
      const res = await api.get("/obter-business")
      setData(res.data.data)
    } catch (error) {
      toast.error(error.data.message)
    }

  }

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

  useEffect(() => {
    GetBusinessArea()
  }, [])

  const [Input, setInput] = useState({
    id: 0,
    name: " ",
    description: " "
  })

  const Editar = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/edit-business`, Input, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie(" ")}`
        }
      });

      setInput({ id: 0, name: " ", description: " " })
      setVisibleEdit(false)
      GetBusinessArea()

      //   console.log(res.data)
    } catch (error) {
      toast.error(error.data.message)
    }

  }
  const adjustTextareaHeight = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };


  const Delete = async (id) => {
    try {
      const res =   await api.delete(`/delete-business/${id}`, {
        headers: {
          Authorization: `Bearer ${GetTokenCookie("nada")}`
        }
      });

      setVisibleDelete(false)
      GetBusinessArea()
      toast.info(res.data.message)  
      } catch (error) {
      toast.info(res.data.message)
    }
  }
  return (
    <>
      <CCard className="mb-4">

        <CCardHeader>
          Área de negocio
          {<div className="float-end"><CButton onClick={() => { setVisible(!visible); setVisibleEdit(false) }} ><CIcon icon={cilUserPlus} size='xxl' /> </CButton></div>}

        </CCardHeader>

        <ModalDelete visibleDelete={visibleDelete} setVisibleDelete={setVisibleDelete} Delete={Delete} id={deleting.id} name={deleting.name} />



        <CCardBody>
          <CRow>
            {visible && !visibleEdit && <AddBusiness GetBusiness={GetBusinessArea} setVisible={setVisible} />}
            {visibleEdit && !visible &&
              <>
                <CForm className="row g-3 needs-validation" noValidate>
                  <CCol md={4}>
                    <CFormTextarea
                      type="text"
                      value={Input.name}
                      onChange={(e) => { setInput({ ...Input, name: e.target.value }); adjustTextareaHeight(e); }}
                      name="name"
                      className='dynamic-textarea'
                      id="validationCustom01"
                      label="Nova área"
                      required
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormTextarea
                      type="text"
                      value={Input.description}
                      onChange={(e) => { setInput({ ...Input, description: e.target.value }); adjustTextareaHeight(e); }}
                      name="description"
                      id="validationCustom02"

                      className='dynamic-textarea'
                      label="Descrição"
                      required
                    />
                  </CCol>

                </CForm>
                <CCol style={{ margin: "10px" }} >
                  <CButton color="primary" onClick={Editar} style={{ margin: "10px" }}  >
                    Actualizar
                  </CButton>
                  <CButton color='danger' onClick={() => setVisibleEdit(false)}>
                    Cancelar
                  </CButton>
                </CCol>
              </>
            }

            {!visibleEdit &&
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>

                    <CTableHeaderCell className="bg-body-tertiary">Nome da área de negocio</CTableHeaderCell>

                    <CTableHeaderCell className="bg-body-tertiary">Descrição</CTableHeaderCell>
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
                        <div className="small text-body-secondary text-nowrap">
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          {/*  <div className="fw-semibold">{item.usage.value}%</div> */}
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.description}</small>
                          </div>
                        </div>

                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon icon={cilPen} size='lg' style={{ cursor: 'pointer', marginRight: '30px' }}
                          className="icon-yellow" onClick={() => { setVisibleEdit(!visibleEdit); setVisible(false); setInput({ id: item.id, name: item.name, description: item.description }) }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon className="icon-red" icon={cilTrash} size='lg' style={{ cursor: 'pointer', }}
                          onClick={() => { setVisible(false); setVisibleEdit(false); toggle(item.id, item.name) }} />
                      </CTableDataCell>


                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>}
          </CRow>
        </CCardBody>

      </CCard>
    </>
  )
}

export default Business
