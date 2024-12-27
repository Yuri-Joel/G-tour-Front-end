import { useState } from "react"
import { Schoose } from "./escolha"
import { CCard, CCardImage, CCardTitle, CCol, CRow } from "@coreui/react"
import { SegundaEscolha } from "./SegundaEscolha"
import { EditarProvincia } from "./editar provincia/EditarProvincia"
import { api } from "../../api/api.pnp"
import './province.css'
import { AddMediaProvince } from "./adicionar media/Addmedia"
import Habitos from "../habitos_provincia/habitos"
import { font } from "../../api/urlPhoto"
import { PublicarProvincia } from "./publicar/publicar"

const Provincias = () => {


    const [escolha, setescolha] = useState({ id: 0, name: "", photo: "" })
    const [segundaEscolha, setSegundaEscolha] = useState("")
    const [visible, setVisible] = useState(true)
    const [visibleSelect, setVisibleSelect] = useState(true)
    const [province, setProvince] = useState({})
    const ObterProvinceId = async (id) => {
        try {
            const res = await api.get(`/obter-province/${id}`)
         
            setProvince(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            {visible && <Schoose setescolha={setescolha} setVisible={setVisible} ObterProvinceId={ObterProvinceId} />}
            {!visible &&
                <CRow xs={{ gutter: 0 }}>
                 
                        <div className="float-start">{"Provincia Selecionada " + escolha.name}
                       
                           
                        </div>
                        <div style={{width: "12%", margin: "0.5rem"}} className="float-end">
                            <CCard>
                        <CCardImage src={`${font}/${escolha.photo}`} />
                        </CCard>
                        </div>
                        {visibleSelect &&
                            <SegundaEscolha setSegundaEscolha={setSegundaEscolha} setVisibleSelect={setVisibleSelect} name={escolha.name} setVisible={setVisible} />
                        }

                        {
                            !visibleSelect && <>

                                {segundaEscolha === "perfil" ?
                                                        
                                    <EditarProvincia item={province} setVisible={setVisibleSelect} Get={ObterProvinceId} />

                                    :
                                    segundaEscolha === "cultura" ?
                                        <Habitos provinceId={escolha.id} setVisibleProvince={setVisibleSelect} />
                                    :
                                    segundaEscolha === "media" ?
                                        <AddMediaProvince id={escolha.id} item={province} setVisibleSelect={setVisibleSelect} Get={ObterProvinceId} />
                                   :
                                   <PublicarProvincia  item={province} setVisible={setVisibleSelect} Get={ObterProvinceId} />
                                }

                            </>
                        }
                  
                </CRow>
            }
        </>
    )
}

export default Provincias