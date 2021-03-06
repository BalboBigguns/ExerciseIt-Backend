const express = require('express');
const User = require('../models/User');
const errorResObj = require('../util/routerHelp');

const router = express.Router();

const USERNAME_TAKEN = 11000;

// Add new user
router.post('/', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user.save()
        .then(({ username, _id }) => {
            res.status(201).json({ username, _id });
        })
        .catch(err => {
            if (err.code === USERNAME_TAKEN) {
                res.status(400).json(errorResObj(400, "Username already taken."));
            }
            else {
                res.status(400).json(errorResObj(400, err.message));
            }
        });
});

// Get all the users
router.get('/', (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(400).json(errorResObj(400, err.message));
        });
});

// Get one user
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json(errorResObj(404, "User not found."));
                return;
            }
            res.json(user);
        })
        .catch(err => {
            res.status(400).json(errorResObj(400, err.toString()));
        });
});

// Delete user by id or name
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id)
        .then(deleted => {
            if (!deleted) {
                res.status(404).json(errorResObj(404, "Document not found."));
            }
            else {
                res.json(deleted);
            }
        })
        .catch(err => {
            res.status(400).json(errorResObj(400, err.message));
        });
});

router.patch('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
    .then(updated => {
        if (!updated) {
            res.status(404).json(errorResObj(404, "User not found."));
        }
        else {
            res.json(updated);
        }
    })
    .catch(err => {
        res.status(400).json(errorResObj(400, err.message));
    });
});

module.exports = router;