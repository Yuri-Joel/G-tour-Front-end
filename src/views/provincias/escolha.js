import { cilArrowRight } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { CCard, CCardBody, CCardHeader, CCardImage, CCol, CLink, CRow, CWidgetStatsF } from "@coreui/react"
import { useEffect, useState } from "react"
import { api } from "../../api/api.pnp"
import { font } from "../../api/urlPhoto"

export const Schoose = ({setescolha, setVisible, ObterProvinceId})=>{

const [data, setData] = useState([])
    const ObterProvince =async ()=>{
        try {
           const res =  await api.get("/obter-province")
           setData(res.data.data)
        } catch (error) {
            console.log(error)
        } 
    }
    useEffect(()=>{ ObterProvince()},[])
    
    return (
        <CCard className="mb-4">
             <CCardHeader>Escolha a Provincia</CCardHeader>
             <CCardBody>
        <CRow xs={{ gutter: 4 }}>
            {
                data.map((item, index)=>(
                    <CCol xs={12} sm={6} xl={4} xxl={3} key={index} style={{cursor: "pointer"}} >

                    <CWidgetStatsF  className="province"
                    onClick={()=> {setescolha({name:item.name, id: item.id, photo: item.photo}); ObterProvinceId(item.id); setVisible(false)}}
                      icon={
                        <CCardImage src={`${font}/${item.photo}`} style={{ height: "5rem" }} />
                      }
                      
                      title={item.name}
                      value={item.capital}
                   
                      footer={
                        <CLink
                          className="font-weight-bold font-xs text-body-secondary"     
                          rel="noopener norefferer">
                          Ver mais
                          <CIcon icon={cilArrowRight} className="float-end" width={16} />
                        </CLink>
                      }
                    />
                  </CCol>
                ))
            }
     
    
      </CRow>
      </CCardBody>
      </CCard>
    )
} 