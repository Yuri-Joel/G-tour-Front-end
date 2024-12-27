import { CToast, CToastBody, CToastHeader } from '@coreui/react'
import React from 'react'

export const Toast = ({result}) => {
    return (
        <CToast animation={false} autohide={false} visible={true}>
            <CToastHeader closeButton>
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    <rect width="100%" height="100%" fill="#007aff"></rect>
                </svg>
                <div className="fw-bold me-auto">{result}</div>
                <small></small>
            </CToastHeader>
            <CToastBody>Good!</CToastBody>
        </CToast>
    )
}
