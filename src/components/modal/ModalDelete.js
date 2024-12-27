
import { CButton, CModal, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { _descriptors } from 'chart.js/helpers'
import React from 'react'


export const ModalDelete = ({ visibleDelete, setVisibleDelete, Delete, name, id}) => {

    return (
        <>
            <CModal backdrop="static"  alignment='center'
                visible={visibleDelete}
                onClose={() => setVisibleDelete(false)}
                aria-labelledby="ToggleBetweenModalsExample1"
            >
                <CModalHeader>
                    <CModalTitle id="ToggleBetweenModalsExample1">{`Tens a certeza que queres eliminar ${name} ?`}</CModalTitle>
                </CModalHeader>
          
                <CModalFooter>
                    <CButton
                        color="danger"
                        onClick={()=>Delete(id)}
                    >
                        Eliminar
                    </CButton>
                    <CButton
                        color="primary"
                        onClick={()=> setVisibleDelete(false)}
                    >
                       Cancelar
                    </CButton>

                </CModalFooter>
            </CModal>
        </>
    )

}