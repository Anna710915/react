import {useEffect, useState} from "react";
import {Button, Form} from "reactstrap";
import './edit.css'

const CertificateEdit = ({id, action, setAction, setEdit, showToast, errorMessage}) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] =useState('');
    const [tags, setTags] = useState('');
    const [description, setDescription] = useState('');
    const [isError, setIsError] = useState({value: false, error: {}});
    const error = {
        name: '',
        price: '',
        duration: '',
        tags: '',
        description: ''
    };


    const edit = async () => {
        if (action !== 'new') {
            try {
                await fetch(`http://localhost:8080/certificates/certificate/${id}`)
                    .then(response => response.json())
                    .then(body => {
                        setPrice(body.price);
                        setName(body.name);
                        setDuration(body.duration);
                        setDescription(body.description);
                        let string = '';
                        for (let tag of body.tags) {
                            string += tag.name + ' ';
                        }
                        setTags(string);
                    });
            }catch (error){
                errorMessage(error.message);
                showToast();
            }
           setAction('new');
        }
    }
    edit();

    const postData = async () => {
        const listTags = tags.trim().split(/\s+/);
        const tagObjects = [];
        for(let tag of listTags){
            tagObjects.push({name: tag});
        }
        const item = {
            name: name,
            description: description,
            price: price,
            duration: duration,
            tags: tagObjects,
        }
        if(!checkInputData(item)){
            setIsError({value: true, error: error});
            return;
        }
            setIsError({...isError,value: false});
            try {
                await fetch(id ? `http://localhost:8080/certificates/certificate/${id}/update` : 'http://localhost:8080/certificates/create', {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ` + localStorage.getItem("token")
                    },
                    body: JSON.stringify(item),
                }).then(response => response.json())
                    .then(function () {
                        setEdit(true);
                        if (id) {
                            return;
                        }
                        setName('');
                        setDescription('');
                        setTags('');
                        setPrice('');
                        setDuration('');
                    });
            }catch(error){
                errorMessage(error.message);
                showToast();
            }
    }
    function checkInputData(item){
        let result = true;
        result = lettersLimit(item) && result;
        result = checkDigit(item) && result;
        result = blankFields(item) && result;
        return result;
    }

    function blankFields(item){
        let result = true;
        if(item.name === ''){
            error.name = "No blank field";
            result = false;
        }
        if(item.price === ''){
            error.price = "No blank field";
            result = false;
        }
        if(item.duration === ''){
            error.duration = "No blank field";
            result = false;
        }
        if(item.description === ''){
            error.description = "No blank field";
            result = false;
        }
        if(item.tags === ''){
            error.tags = "No blank field";
            result = false;
        }
        return result;
    }

    function lettersLimit(item){
        let result = true;
        if(item.name.length <= 6 || item.name.length >= 30){
            error.name = "Title field must not be less than 6 and greater than 30 characters";
            result = false;
        }
        if(item.description.length <= 12 || item.description.length >= 1000){
            error.description = "Description field must not be less than 12 and greater than 1000 characters";
            result = false;
        }
        return result;
    }

    function checkDigit(item){
        let result = true;
        if(isNaN(item.price)){
            error.price = "Price must be a number or float";
            result = false;
        }else if(+item.price < 0){
            error.price = "Price must be greater than 0 ";
            result = false;
        }
        if(isNaN(item.price) && !Number.isInteger(+item.duration)){
            error.duration = "Duration must be a number";
            result = false;
        }else if(+item.duration <= 0){
            error.duration = "Duration must be greater than 0 or be 0";
            result = false;
        }
        return result;
    }

    return(<div className="edit-container">
        <div className="edit-title">
            <h2 className="title">{id ? 'Edit certificate' : 'Add certificate'}</h2>
        </div>
        <div className="edit-form">
            <Form  className="form">
                <div className="field">
                    <label className="label" htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={name} onChange={(event) => {
                        setName(event.target.value);
                    }}/>
                    {isError.value && <span className='error_message'> {isError.error.name}</span>}
                </div>
                <div className="field">
                    <label className="label" htmlFor="price">Price</label>
                    <input type="text" id="price" name="price" value={price} onChange={(event) => setPrice(event.target.value)}/>
                    {isError.value && <span className='error_message'> {isError.error.price}</span>}
                </div>
                <div className="field">
                    <label className="label" htmlFor="duration" >Duration</label>
                    <input type="text" id="duration" name="duration" value={duration} onChange={(event) => setDuration(event.target.value)}/>
                    {isError.value && <span className='error_message'> {isError.error.duration}</span>}
                </div>
                <div className="field-textarea">
                    <label className="label">Tags</label>
                    <textarea value={tags} onChange={(event) => setTags(event.target.value)}/>
                    {isError.value && <span className='error_message'> {isError.error.tags}</span>}
                </div>
                <div className="field-textarea">
                    <label className="label">Description</label>
                    <textarea value={description} onChange={(event) => {
                        setDescription(event.target.value);
                    }}/>
                    {isError.value && <span className='error_message'> {isError.error.description}</span>}
                </div>
                <div className="buttons">
                    <div className="cancel">
                        <input type="submit" value="Cancel"/>
                    </div>
                    <div className="save">
                        <Button className="save__content" onClick={postData}>Save</Button>
                    </div>
                </div>
            </Form>
        </div>
    </div>);

}

export default CertificateEdit;