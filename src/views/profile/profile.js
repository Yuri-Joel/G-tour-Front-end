import React, { useState, useEffect } from 'react';
//import 'bootstrap/js/dist/tab'
import { cilUser } from '@coreui/icons';
import UseAuth from '../../hooks/hooks';
import { api } from '../../api/api.pnp';
import { CCard, CCardBody, CCol, CRow, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { GetTokenCookie } from '../../session';
import { toast } from 'react-toastify';

export default function Profile() {

    const [nome, setnome] = useState('');
    const [telefone, setTelefone] = useState('')
    const [email, setemail] = useState('');
    const { user } = UseAuth();
    const [data, setData] = useState({});

    const getDataById = async () => {
        try {
            const res = await api.get(`/obter-user_admin/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${GetTokenCookie(" ")}`
                }
            });
            setTelefone(res.data.data.telefone)
            setemail(res.data.data.email)

            setData(res.data.data);
            setnome(res.data.data.name)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDataById();
    }, []);


    const ActualizarUser = async (e) => {
        e.preventDefault();
        const User = {
            nome: nome.trim(),
            telefone: telefone.trim(),
            email: email.trim()
        }
        try {
            const res = await api.put(`/edit-user_admin/${user.id}`, User,{
                headers: {
                    Authorization: `Bearer ${GetTokenCookie(" ")}`
                }
            })
            console.log(res.data.data)
            toast.success("Perfil Actualizado");
            getDataById()
        } catch (error) {
            toast.error(error.data.message)
        }
    }

    const [Alterar, setsenha] = useState({
        senhaActual: '',
        novaSenha: ''
    })
    const [ConfimarSenha, setConfirmar] = useState('')

    const HandleSubmit = async (e) => {
        e.preventDefault();

        if ((Alterar.novaSenha === ConfimarSenha) && Alterar.senhaActual.trim() && ConfimarSenha.trim() && Alterar.novaSenha.trim()) {
            await api.put(`/editar-senha/${user.id}`, Alterar, {
                headers: {
                    Authorization: `Bearer ${GetTokenCookie(" ")}`
                }
            })
                .then(res => {

                    if (res.data.message === "Actualizada") {

                        toast.success("Senha Actualizada")
                        setsenha({...Alterar, senhaActual: "", novaSenha: ""})
                        setConfirmar(" ")
                        getDataById()
                    } else {
                        toast.warn("erro ao logar neste servidor");
                    }
                })
                .catch(err => {
                    toast.warn("Erro ao Editar Senha"); 
                    setsenha({...Alterar, senhaActual: "", novaSenha: ""})
                    setConfirmar(" ")
            })
        } else {
            toast.error("palavra-passe Errada!")
        }
    }
    return (


        <main id="main" className="main">

            <div className="pagetitle">
                <h1>Perfil</h1>
                <nav>

                </nav>
            </div>

            <section className="section profile">
                <div className="row">
                    <CCol xl={4}>
                        <CCard>
                            <CCardBody className="profile-card pt-4 d-flex flex-column align-items-center">
                                <CIcon icon={cilUser} size='9xl' />
                                <h2>{user.name}</h2>
                                <h3>Admin</h3>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    <CCol xl={8}>

                        <CCard>
                            <CCardBody>

                                <ul className="nav nav-tabs nav-tabs-bordered">

                                    <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Ver meu Perfil</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Editar Perfil</button>
                                    </li>

                                    <li className="nav-item">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Alterar Senha</button>
                                    </li>

                                </ul>
                                <div className="tab-content pt-2">
                                    <div className="tab-pane fade profile-overview pt-3 active show" id="profile-overview">
                                        <h5 className="card-title">Meu Perfil</h5>
                                        <CRow className="mb-3">
                                            <CCol md="4" lg="3" className="label">
                                                Nome
                                            </CCol>
                                            <CCol md="8" lg="9">
                                                {data.name}
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3">
                                            <CCol md="4" lg="3" className="label">
                                                Contacto
                                            </CCol>
                                            <CCol md="8" lg="9">
                                                {data.telefone}
                                            </CCol>
                                        </CRow>
                                        <CRow className="mb-3">
                                            <CCol md="4" lg="3" className="label">
                                                Email
                                            </CCol>
                                            <CCol md="8" lg="9">
                                                {data.email}
                                            </CCol>
                                        </CRow>
                                    </div>
                                    <div className="tab-pane fade profile-edit pt-3" id="profile-edit">


                                        <form onSubmit={ActualizarUser}>

                                            <div className="row mb-3">
                                                <label htmlFor="fullName" className="col-md-4 col-lg-3 col-form-label">Nome</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="fullName" type="text" className="form-control" id="fullName" value={nome} disabled onChange={(e) => setnome(e.target.value)} />
                                                </div>
                                            </div>


                                            <div className="row mb-3">
                                                <label htmlFor="Phone" className="col-md-4 col-lg-3 col-form-label">Contacto</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input className='form-control' placeholder="Número de telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)}
                                                    />

                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label htmlFor="Email" className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="email" type="email" className="form-control" id="Email" value={email} onChange={(e) => setemail(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary" style={{ background: '#00968c', width: '14rem' }}>Salvar</button>
                                            </div>
                                        </form>


                                    </div>

                                    <div className="tab-pane fade pt-3" id="profile-change-password">

                                        <form onSubmit={HandleSubmit}>

                                            <div className="row mb-3">
                                                <label htmlFor="currentPassword" className="col-md-4 col-lg-3 col-form-label">Senha Actual:</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input className="form-control" type='password' value={Alterar.senhaActual} onChange={(e) => setsenha({ ...Alterar, senhaActual: e.target.value })} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label htmlFor="newPassword" className="col-md-4 col-lg-3 col-form-label">Nova Senha</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="newpassword" type="password" className="form-control" id="newPassword" value={Alterar.novaSenha} onChange={(e) => setsenha({ ...Alterar, novaSenha: e.target.value })} />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label htmlFor="renewPassword" className="col-md-4 col-lg-3 col-form-label">Confirmar a Senha</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="renewpassword" type="password" value={ConfimarSenha} className="form-control" id="renewPassword" onChange={(e) => setConfirmar(e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <CButton type='submit' style={{ background: '#00968c', width: '14rem' }} >Salvar</CButton>
                                            </div>
                                        </form>

                                    </div>

                                </div>

                            </CCardBody>
                        </CCard>

                    </CCol>
                </div>
            </section>

        </main>
    );
}
