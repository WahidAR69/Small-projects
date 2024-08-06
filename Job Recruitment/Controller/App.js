const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SignUp, Login, Job } = require('../Model/Models');

const uri = "mongodb+srv://wahidahmad:wahid@employeerecruitment.dhu1kut.mongodb.net/?retryWrites=true&w=majority&appName=EmployeeRecruitment";
const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})

// POST request to create a new user
app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, isEmployer} = req.body;
        // Create a new user in the "signups" collection
        const newSignUp = new SignUp({ firstName, lastName, email, password, isEmployer});
        await newSignUp.save();

        const newLogin = new Login({ email, password, isEmployer});
        await newLogin.save();

        if(isEmployer === 'Yes') {
            res.redirect(`/employer?firstname=${firstName}`);
        } else {
            res.redirect(`/loggedIn?firstname=${firstName}`);
        }
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// check if email already exists in the "logins" collection
app.post('/check-signup-email', async (req, res) => {
    const email = req.body.email;

    const existingUser = await SignUp.findOne({ email });
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
});

// POST request to handle login
app.post('/login', async (req, res) => {
    try {
        const { email, password} = req.body;
        await Login.find({ email, password});
        let signedUpUser = await SignUp.findOne({ email});
        let firstName = signedUpUser.firstName;
        if(signedUpUser.isEmployer === 'Yes') {
            res.redirect(`/employer?firstname=${firstName}`);
        } else {
            res.redirect(`/loggedIn?firstname=${firstName}`);
        }
    }catch (err) {
      res.status(400).json({ error: err.message });
    }
});


//check if email and password already exists in the "logins" collection
app.post('/check-login-email', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await Login.findOne({ email, password});

    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
});


// Posting jobs by the employers
app.post('/job-post-1', async (req, res) => {
    try { 
        const { title, description, requirements, location, apply, hiddenUser} = req.body;
        const newJob = new Job({ title, description, requirements, location, apply, hiddenUser});
        await newJob.save()
        .then(() => {
            res.redirect(`/employer?firstname=${hiddenUser}`);
        }).catch(err => {
            console.log(err);
            res.status(400).send('Error posting job');
        });
    }catch(err) {
        res.status(400).json({ error: err.message });
    }
});


app.post('/job-request', (req, res) => {
    const { search } = req.body;
    const searchRegex = new RegExp(search, 'i');

    Job.find({
        $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { requirements: { $regex: searchRegex } },
            { location: { $regex: searchRegex } },
        ]
    })
    .then(jobs => res.json(jobs))
    .catch(err => res.status(400).json({ error: err.message }));
});


app.delete('/delete', (req, res) => {
    const { title } = req.body;

    Job.findOneAndDelete({ title: title })
        .then((deletedJob) => {
            if (!deletedJob) {
                return res.status(404).json({ error: 'Job not found' });
            }
            res.json({ message: 'Job deleted successfully' });
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});





//This part is all the files that is in the view part of my project. 
//For the routes to work each of the file paths should be changed to the correct path.
app.get('/home', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/index.html')
});
app.get('/login', (req,res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/Login.html')
})
app.get('/loggedIn', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/loggedIn.html')
});
app.get('/signUp', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/signup.html')
});

app.get('/about', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/about.html')
});

app.get('/job-post', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/JobPost.html')
});

app.get('/about-1', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/LoggedInAbout.html')
});
app.get('/about-2', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/employerAbout.html')
});
app.get('/employer', (req, res)=> {
    res.sendFile('F:/Master Journeys/The way to become an intern/Edureka Internship/Full stack Web development/Projects/Edureka/Job Recruitment/View/employer.html')
});
