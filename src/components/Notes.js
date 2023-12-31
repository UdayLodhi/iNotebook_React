import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/noteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    let navigate =useNavigate();

    const context = useContext(noteContext);

    const { notes, getNotes, editNote } = context;

    useEffect(() => {
        if(localStorage.getItem('token')){
            getNotes()
        } else {
            navigate("/login")
        }
        // eslint-disable-next-line
    }, [])
    
    const [note, setnote] = useState({ id:"" ,etitle:"", edescription :"", etag:""});

    const ref = useRef(null)
    const refClose = useRef(null)

    const updateNote = (currentNote) => {
        ref.current.click();
        setnote({id:currentNote._id ,etitle:currentNote.title, edescription : currentNote.description,etag:currentNote.tag});
    }

    const handleClick = (e) =>{
        editNote(note.id,note.etitle,note.edescription,note.etag);
        props.showAlert("Updated Successfully","success")
        refClose.current.click(); 
    }

    const onChange = (e) =>{
        setnote ({
            ...note,
            [e.target.name]:e.target.value
        })
    }
    
    return (
        <>
            <AddNote  showAlert ={props.showAlert}/>
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" value={note.etitle} name="etitle" aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription}  onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length<5 ||note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleClick}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h3>Your Notes</h3>
                <div className="container mx-2">
                {notes.length === 0 && "No Notes to display"}
                </div>
                {notes.map((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} showAlert ={props.showAlert} note={note} />
                }
                )}
            </div>
        </>
    )
}

export default Notes
