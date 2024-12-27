import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import UseAuth from '../../hooks/hooks'
import { NavLink, useNavigate } from 'react-router-dom'
import { RemoveTokenCookie } from '../../session'
import Cookies from 'js-cookie'
import { extrairPrimeiroUltimoNome } from '../../function/name'

const AppHeaderDropdown = ({notificacoes}) => {
  const navi = useNavigate()
  const { user, setuser } = UseAuth()
  const Logout = () => {

    Cookies.remove("userlogin")

    RemoveTokenCookie()
    setuser({
      name: "",
      id: "",
      email: "",
      status: false,
    })
  navi("/login")
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        {/*  <CAvatar src={} size="md" /> */}
        {extrairPrimeiroUltimoNome(user.name)}
        <CIcon icon={cilUser} size='xxl' />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Sua Conta</CDropdownHeader>
        <CDropdownItem as={NavLink} to="/notificacao">
          <CIcon icon={cilBell} className="me-2" />
         notificacoes
          <CBadge color="info" className="ms-2">
            {notificacoes}
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>

        <CDropdownItem as={NavLink} to={"/profile"}>
        <CIcon icon={cilUser} className="me-2" />
        Perfil
        </CDropdownItem>
        <CDropdownItem href="#" >
          <CIcon icon={cilSettings} className="me-2" />
          Definições
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={() => Logout()} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Terminar Sessão
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
