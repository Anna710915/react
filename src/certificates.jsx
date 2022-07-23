import React, {Component, useEffect, useRef, useState} from "react";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import AppNavBar from "./app-nav-bar";
import Modal from "./modal.jsx";
import CertificateEdit from "./edit";
import Popup from "./Popup";
import CertificatePagination from "./CertificatePagination";
import Selector from "./Selector";
import './certificates.css'

const Certificates = () => {

    const [certificates, setCertificates] = useState([]);
    const [isLoadCertificate, setIsLoadCertificate] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [url, setUrl] = useState({id: 1, href:'http://localhost:8080/certificates/all?page=1'});
    const [modalActive, setModalActive] = useState(false);
    const [id, setId] = useState('');
    const [actionCertificate, setActionCertificate] = useState('new');
    const [searchQuery, setSearchQuery] = useState({part: '', tags: ''});
    const [isToastShown, setIsToastShown] = useState(false);
    const [errorMessage, setErrorMessage]= useState('');
    const toastTimerClose = useRef();
    const [nameSort, setNameSort] = useState('');
    const [dateSort, setDateSort] = useState('');
    const [pages, setPages] = useState([]);
    const [size, setSize] = useState(10);
    const [isError, setIsError] = useState({value: false, error: {}});

    useEffect(() => {
        setDelete(false);
        setEdit(false);
            fetch(
                sessionStorage.getItem('current') ?
                    sessionStorage.getItem('current') :
                url.href+'&size='+size)
                .then(response => response.json())
                .then(data => {
                    setCertificates(data._embedded.certificateDtoList);
                    setPages([{
                        id: data._links.first.name,
                        href:  data._links.first.href
                    },
                        {
                        id: data._links.prev.name,
                        href:  data._links.prev.href
                        },
                        {
                            id: sessionStorage.getItem('pageId') ?
                                sessionStorage.getItem('pageId') :
                                url.id,
                            href: sessionStorage.getItem('current') ?
                                sessionStorage.getItem('current') :
                                url.href
                        },
                        {
                            id: data._links.next.name,
                            href:  data._links.next.href
                        },
                        {
                            id: data._links.last.name,
                            href:  data._links.last.href
                        },
                    ]);
                })
                .catch(error => {
                    setErrorMessage(error.message);
                    showToast();
                });
    }, [isDelete, isEdit, url, size]);


    const remove = async (url) => {
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Authorization': `Bearer ` + localStorage.getItem("token")
            }
        }).then((response) =>
            response.json()).then(body => {
                setUrl(
                    body._links.get_certificates.href);
                    setDelete(true);
            }).catch(error => {
            setErrorMessage(error.message);
            showToast();
        });

    }

    function showToast(){
        setIsToastShown(true);
        toastTimerClose.current = setTimeout(hideToast, 4000);
    }

    function hideToast(){
        setIsToastShown(false);
    }

    const handleChange = (event) => {
        setSearchQuery({...searchQuery, [event.target.name]: event.target.value});
    }

    const searchCertificates = async (event) => {
        if(event.key === 'Enter' || event.type === 'click') {
            let url = createUrl(event);
            console.log(url);
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setCertificates(data._embedded.certificateDtoList);
                    setPages([{
                        id: data._links.first.name,
                        href: data._links.first.href
                    },
                        {
                            id: data._links.prev.name,
                            href: data._links.prev.href
                        },
                        {
                            id: sessionStorage.getItem('pageId') ?
                                sessionStorage.getItem('pageId') :
                                url.id,
                            href: sessionStorage.getItem('current') ?
                                sessionStorage.getItem('current') :
                                url.href
                        },
                        {
                            id: data._links.next.name,
                            href:  data._links.next.href
                        },
                        {
                            id: data._links.last.name,
                            href:  data._links.last.href
                        },
                    ]);
                })
                .catch(error => {
                    setErrorMessage(error.message);
                    showToast();
                });
        }
    }

    const createUrl = (event) => {
        let url = `http://localhost:8080/certificates/all?page=1&size=${size}`

        if(searchQuery.part !== ''){
            url += '&part=' + searchQuery.part;
        }


        if(searchQuery.tags !== ''){
            url += '&tags=' + searchQuery.tags;
        }
        if(event.target.id === 'name'){
            if(nameSort === '' || nameSort === 'desc_name'){
                 url += '&name=asc_name';
                 setNameSort('asc_name');
            }else {
                url += '&name=desc_name';
                setNameSort('desc_name');
            }

        }else {
            if(nameSort !== ''){
                url += '&name=' + nameSort;
            }

        }

        if(event.target.id === 'date'){
            if(dateSort === '' || dateSort === 'desc_date'){
                url += '&date=asc_date';
                setDateSort('asc_date');
            }else {
                url += '&date=desc_date';
                setDateSort('desc_date');
            }
        }else{
            if(dateSort !== ''){
                url += '&date=' + dateSort;
            }

        }
        return url;
    }

    function changePage(page){
        setUrl(page);
        sessionStorage.setItem('current', page.href);
        sessionStorage.setItem('pageId', page.id);
    }

    function changeSize(e){
        setSize(e.target.value);
        setNameSort('');
        setDateSort('');
        setSearchQuery({part: '', tags: ''});
        sessionStorage.clear();
    }

    return(<div className="main">
        <AppNavBar/>
        {isToastShown &&
        <Popup>
            {errorMessage}
        </Popup>}
        <Container fluid className="certificates-container">
            <div className="search-container">
                <input
                    placeholder="Search..."
                    name='part'
                    value={searchQuery.part}
                    onChange={e => handleChange(e)}
                    onKeyPress={e => searchCertificates(e)}/>
                <input
                    placeholder="Tags..."
                    name='tags'
                    value={searchQuery.tags}
                    onChange={e => handleChange(e)}
                    onKeyPress={e => searchCertificates(e)}/>
                {localStorage.getItem("role") === "ADMIN" &&
                <Button color="success" onClick={() => {
                    setModalActive(true);
                    setId('');
                    setIsLoadCertificate(false);
                    setActionCertificate('new');
                    setIsError({...isError, value: false});
                }}>Add New</Button> }
            </div>
            <h3>Certificates</h3>
            <Table className="mt-4 table">
                <thead>
                <tr>
                    <th width="30%"
                        id = 'name'
                        onClick={e => searchCertificates(e)}>Name</th>
                    <th width="20%"
                        id = 'date'
                        onClick={e => searchCertificates(e)}>Date</th>
                    <th width="30%">Price</th>
                    {localStorage.getItem("role") === "ADMIN" &&
                    <th width="40%">Actions</th>
                    }
                </tr>
                </thead>
                <tbody>
                {
                    certificates.map(certificate => {
                        return (<tr key={certificate.id}>
                            <td style={{whiteSpace: 'nowrap'}}>{certificate.name}</td>
                            <th>{certificate.lastUpdateDate}</th>
                            <td>{certificate.price}</td>
                            {localStorage.getItem("role") === "ADMIN" &&
                            <td>
                                <ButtonGroup>
                                    <Button size="sm" color="primary" onClick={() => {
                                        setModalActive(true);
                                        setId(certificate.id);
                                        setActionCertificate('edit');
                                        setIsLoadCertificate(false);
                                        setIsError({...isError, value: false});
                                    }}>Edit</Button>
                                    <Button size="sm" color="danger"
                                            onClick={() => remove(certificate._links.delete_certificate.href)}>Delete</Button>
                                </ButtonGroup>
                            </td>}
                        </tr>)
                    })
                }
                </tbody>
            </Table>
            <div className='pagination'>
                <CertificatePagination pages={pages} changePage={changePage}/>
                <Selector size={size} sizeHandleChange={changeSize}/>
            </div>
        </Container>
        <Modal active={modalActive} setActive={setModalActive}>
            <CertificateEdit id={id} action={actionCertificate}
                             setEdit={setEdit} showToast={() => showToast()}
                             errorMessage={setErrorMessage} setActive={setModalActive}
                             isLoadCertificate={isLoadCertificate} setIsLoadCertificate={setIsLoadCertificate}
                             isError={isError} setIsError={setIsError}
            />
        </Modal>
    </div>);
}

export default Certificates;


