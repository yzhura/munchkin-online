import React, { useState, useEffect } from 'react'

const Modal = ({show, title, children, save, setModal, disableSave}) => {

    
    return (
        <div className={`modal ${show ? 'd-block' : 'd-none'}`}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setModal(false)}>
                    <span aria-hidden="true" >&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button type="button" className={`btn btn-primary ${disableSave ? 'd-none' : ''}`}  onClick={() => save}>Сохранить</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setModal(false)}>Закрыть</button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
