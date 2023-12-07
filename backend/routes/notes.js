const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');

// ROUTE 1 : Get all the notes using : GET "/api/notes/fetchallnotes" .Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.send(notes);

    } catch (error) {
        console.log(error.messaage);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2 : Add a new note using : POST "/api/notes/addnote" .Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Password must be atleat 5 Characters').isLength({ min: 5 })

], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //If there are error then return Bad Request and Errors
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ result: result.array() });
        }

        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await notes.save();

        res.send(savedNote);

    } catch (error) {
        console.log(error.messaage);
        res.status(500).send("Internal Server Error");
    }

});

// ROUTE 3 : Update an existig note using : PUT "/api/notes/updatenote" .Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //Create a newNote Object 
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find a note to be updated and update it 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

        res.json({ note });

    } catch (error) {
        console.log(error.messaage);
        res.status(500).send("Internal Server Error");
    }

});

// ROUTE 3 : Delete an existig note using : DELETE "/api/notes/deletenote" .Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Find a note to be deleted and delete it 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Allow deletion if only user owns this Note 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id)

        res.json({ "Success": "This Note has been deleted ", note: note });


    } catch (error) {
        console.log(error.messaage);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;