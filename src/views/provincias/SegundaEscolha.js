import { CButton, CCard, CCardBody, CCardHeader, CCol, CLink, CRow, CWidgetStatsF } from "@coreui/react"



export const SegundaEscolha = ({ setVisibleSelect, setSegundaEscolha, name, setVisible }) => {

    return (
        <>
            <CCard  className="mb-4">
           
                <CCardHeader><CButton color="secondary" onClick={()=> setVisible(true)}>Voltar</CButton>  </CCardHeader>
                <CCardBody>
                    
                    <CRow>      
                        <CCol style={{ cursor: "pointer" }} >
                            <CWidgetStatsF
                                className="province"
                                onClick={() => { setVisibleSelect(false); setSegundaEscolha("perfil") }}
                                title={"Dados da provincia"}
                                value={"Editar latitude, longitude, sobre"}
                                color="primary"
                            />
                        </CCol>
                        <CCol style={{ cursor: "pointer" }} >

                            <CWidgetStatsF
                                className="province"
                                onClick={() => { setVisibleSelect(false); setSegundaEscolha("media") }}
                                title={"Fotos e videos"}
                                value={"Adicione novas imagens e videos"}
                                color="primary"
                            />
                        </CCol>
                        <CCol style={{ cursor: "pointer" }} >
                            <CWidgetStatsF
                                className="province"
                                onClick={() => { setVisibleSelect(false); setSegundaEscolha("cultura") }}
                                title={`Habitos da provincia ${name}` }
                                value={"Cultura, alimentação"}
                                color="primary"
                            />
                        </CCol>
                        <CCol style={{ cursor: "pointer" }} >
                            <CWidgetStatsF
                                className="province"
                                onClick={() => { setVisibleSelect(false); setSegundaEscolha("publicar") }}
                                title={`Publicação de ${name}` }
                                value={"Publique"}
                                color="primary"
                            />
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}